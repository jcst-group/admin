<template>
  <div>
    <a-modal
      :title="title"
      v-model="visible"
      @ok="handleOk"
      style="top:5%;height: 90%;"
      cancelText="取消"
      :okText="okText"
      :maskClosable="false"
    >
      <a-form
        :form="form"
      >
        <a-form-item
          label="实际产量（公斤）"
        >
          <a-input-number
            style="width:100%"
            :max="1000000"
            v-decorator="[
          'actualOutput',
          {
            initialValue:record.actualOutput,
          }
        ]"
          />
        </a-form-item>
          <a-form-item
            label="有关检测报告："
          >
            <a-upload action="/api/nxFileInfo/upload"
                      :fileList="fileList"
                      :headers="headers"
                      :beforeUpload="beforeUpload"
                      :data="uploadData"
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
  import { getFileByBatchId} from '@/api/allapi'
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
              file.url = this.SHOWURL+item.fileUrl;
              fileList.push(file)
            }
            this.fileList=fileList;
            console.log(batchs);
          }else{
            this.$message.info(res.message)
          }
        }))
        this.okText="保存";
        this.post=false;
        this.visible=true
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

      handleOk(){
          this.form.validateFieldsAndScroll((err, values) => {
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
          });
      },

    }
  }
</script>
