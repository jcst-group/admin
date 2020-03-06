<template>

  <div id="components-form-demo-advanced-search">
    <a-form
      class="ant-advanced-search-form"
    >
      <a-row :gutter="24">
        <a-col
          :span="24"
        >
          <a-form-item
            label="检测报告上传："
          >
            <a-upload action="/api/nxFileInfo/upload"
                      :fileList="fileList"
                      :headers="headers"
                      :beforeUpload="beforeUpload"
                      :data="uploadData"
                      :remove="remove"
                      @change="handleChange"
            >
              <a-button>
                <a-icon type="upload" /> Upload
              </a-button>
            </a-upload>
          </a-form-item>
        </a-col>

      </a-row>


    </a-form>
  </div>

</template>
<script>
  import Vue from 'vue'
  import { ACCESS_TOKEN } from "@/store/mutation-types"
  import { getFileByBatchId,deleteFileById,batchUpdate} from '@/api/allapi'
  import moment from 'moment';
  import AFormItem from 'ant-design-vue/es/form/FormItem';
  export default {
    components: { AFormItem },
    data() {
      return {
        record:{},
        loading: false,
        visible: false,
        headers:{},
        crops:[],
        title:"",
        okText:"",
        fileList:[],
        DOWNLOADURL:'/api/nxFileInfo/downFile?fileUrl=',
        uploadData:{relationId:undefined},
        formItemLayout: {

        },
        form: this.$form.createForm(this),
      }
    },
    created() {
      const token = Vue.ls.get(ACCESS_TOKEN);
      this.headers = {"X-Access-Token":token}
    },
    methods: {
      moment,

      edit(batchId){
        this.form.resetFields();
        this.uploadData.relationId=batchId;
        this.title="编辑";
        getFileByBatchId({batchId:batchId}).then((res=>{
          if(res.success==true){
            let batchs = res.result;
            this.$store.commit('pro/SET_REPORT_COUNT',batchs.length)
            let fileList = [];
            for(let i=0;i<batchs.length;i++){
              let file = {};
              let item = batchs[i];
              file.uid = item.id;
              file.name=item.fileName;
              file.url = this.DOWNLOADURL+item.fileUrl;
              fileList.push(file)
            }
            this.fileList=fileList;
          }else{
            this.$message.info(res.message)
          }
        }))
        this.okText="关闭";
        this.post=false;
        this.visible=true
      },
      handleChange ({ fileList,file }) {
        console.log(file);
        //this.fileList = fileList;
        if(file.status=="done"){
          console.log("上传完成");
          //设置返回的图像id

          console.log(file.response);
          console.log(file.response.result);
          let result = file.response.result;
          let id = result.id;
          console.log("result.id:"+id);
          let infile = {};
          infile.uid = id;
          infile.name=result.fileName;
          infile.url = this.DOWNLOADURL+result.fileUrl;
          fileList = this.fileList;
          fileList.pop();
          fileList.push(infile)
          this.fileList = fileList;
        }else{
          if(file.status!=undefined){
            this.fileList = fileList;
          }
        }
        this.$store.commit('pro/SET_REPORT_COUNT',this.fileList.length)

      },
      beforeUpload (file) {
        console.log(file.type);
        const isJPG = file.type === 'application/pdf' || file.type === 'application/msword' || file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        if (!isJPG) {
          this.$message.error('只允许上传pdf,doc,docx文件')
        }
        const isLt2M = file.size / 1024 / 1024 < 2
        if (!isLt2M) {
          this.$message.error('文件大小不能大于10M')
        }
        return isJPG && isLt2M
      },
      remove(file){
        console.log(file.uid);
        deleteFileById({id:file.uid}).then((res=>{
          if(res.success==true){
            console.log(res);
            let message = res.message;
            this.$message.info(message);
            //console.log(result);
          }else{
            this.$message.info(res.message)
          }
        }))

      },
      handleOk(){
        this.visible = false;

      },

    }
  }
</script>

