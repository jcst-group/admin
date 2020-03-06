<template>
  <div>
    <a-modal
      :title="title"
      v-model="visible"
      @ok="handleOk"
      style="top:5%;height: 90%;"
      cancelText="取消"
      :okText="okText"
      :footer="null"
      :maskClosable="false"
    >
      <a-form
        :form="form"
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
   </a-form>
    </a-modal>
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

      edit(record){
        this.form.resetFields();
        this.record=record;
        this.uploadData.relationId=record.id;
        this.title="编辑";
        getFileByBatchId({batchId:record.id}).then((res=>{
          if(res.success==true){
            let batchs = res.result;
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
        //this.fileList = fileList;
        if(file.status=="done"){
          //设置返回的图像id
          let result = file.response.result;
          let id = result.id;
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

      },
      beforeUpload (file) {
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
        deleteFileById({id:file.uid}).then((res=>{
          if(res.success==true){
            let message = res.message;
            this.$message.info(message);
          }else{
            this.$message.info(res.message)
          }
        }))

      },
      handleOk(){
        this.visible = false;
          /*this.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
              const info=this.form.getFieldsValue();

              let record = this.record;
                info.id = record.id;
                  batchUpdate(info).then((res=>{
                  if(res.success==true){
                    this.$message.info(res.message)
                    this.$parent.loadData();
                    this.visible = false;
                  }else{
                    this.$message.info(res.message)
                  }
                  this.form.resetFields();
                }))

            }
          });*/
      },

    }
  }
</script>
