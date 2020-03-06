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
      v-bind="formItemLayout"
      label="索引图片"
    >
       <a-upload
    name="file"
    listType="picture-card"
    class="avatar-uploader"
    :showUploadList="false"
    action="/api/basePanorama/addPic"
    :data="uploadData"
    :beforeUpload="beforeUpload"
    :headers="headers"
    @change="handleChange"
  >
    <img v-if="imageUrl" :src="imageUrl" alt="avatar" style="width:50px;height:50px;"/>
    <div v-else>
        <a-icon :type="loading ? 'loading' : 'plus'" />
        <div class="ant-upload-text">Upload</div>
    </div>
  </a-upload>
    </a-form-item>
<a-form-item
      v-bind="formItemLayout"
      label="全景图url"
    >
      <a-input
        v-decorator="[
          'panoramaUrl',
          {
            initialValue:this.panoramaUrl,
            rules: [{
              required: true, message: '请输入全景图url！',
            }],
          }
        ]"
        style="width: 100%"
      />
    </a-form-item>
  </a-form>
    </a-modal>
  </div>
</template>
<script>
function getBase64 (img, callback) {
  const reader = new FileReader()
  reader.addEventListener('load', () => callback(reader.result))
  reader.readAsDataURL(img)
}
 import Vue from 'vue'
 import { ACCESS_TOKEN } from "@/store/mutation-types"

  import {pick} from 'lodash'
  import { addInfo,updateUser } from '@/api/userApi'
  import {updatebasepic,basepicDelete} from '@/api/allapi'
  export default {
    data() {
      return {
        uploadData:{},
        record:{},
        loading: false,
        imageUrl: '',
        headers:{},
        avatarsrc:'',
        visible: false,
        title:"操作",
        okText:"",
        panoramaUrl:"",
        form: this.$form.createForm(this),
        formItemLayout: {
        labelCol: {
          xs: { span: 24 },
          sm: { span: 8 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 16 },
        },
      },
      tailFormItemLayout: {
        wrapperCol: {
          xs: {
            span: 24,
            offset: 0,
          },
          sm: {
            span: 16,
            offset: 8,
          },
        },
      },
    }
    },
    created() {
    const token = Vue.ls.get(ACCESS_TOKEN);
    this.headers = {"X-Access-Token":token}
  },
    methods: {
      /*cancel () {
          basepicDelete({id:file.uid}).then((res=>{
          if(res.success==true){
            console.log(res);
            let message = res.message;
            this.$message.info(message);
            this.$parent.loadData();
            //console.log(result);
          }else{
            this.$message.info(res.message)
          }
        }));
        this.visible = false;
      },*/
        handleChange (info) {
      if (info.file.status === 'uploading') {
        this.loading = true
        return
      }
      if (info.file.status === 'done') {
        // Get this url from response in real world.
        //console.log(info.file.response.result.id)
        this.avatarsrc=info.file.response.result.id
        getBase64(info.file.originFileObj, (imageUrl) => {

          this.imageUrl = imageUrl
          this.loading = false
        })
      }
    },
    beforeUpload (file) {
      
        const isJPG = file.type === 'image/jpeg'
        const isPNG = file.type === 'image/png'
        if (!(isPNG||isJPG)) {
          this.$message.error('只允许上传jpg/png格式图片')
        }
        const isLt2M = file.size / 1024 / 1024 < 2
        if (!isLt2M) {
          this.$message.error('图片大小不能大于2M')
        }
        return (isJPG || isPNG) && isLt2M
    },
        /*add(record){
          this.record=record;
          this.uploadData.baseId=record.id;
          this.imageUrl='';
          this.title="添加全景图"
          this.form.resetFields('panoramaUrl');
          this.panoramaUrl='';
          this.visible=true;
        },*/
        edit(record){
          this.uploadData.baseId=record.id;
           if(record.basePanoramaList.length>0){
          this.title="编辑全景图"
          this.form.resetFields('panoramaUrl');
          this.panoramaUrl='';
          
           if(record!=" "&&record!=undefined){
            this.record=record
            let imgshowapi = '/api/upload/show'
            if(record.basePanoramaList.length>0){
            this.imageUrl=imgshowapi+'?fileName='+record.basePanoramaList[0].picUrl;
            this.panoramaUrl=record.basePanoramaList[0].panoramaUrl;
            }else{
               this.imageUrl='';
               this.panoramaUrl='';
            }
          }
          this.visible=true
           }else{
             //this.$message.info("暂无全景图信息,请先添加！")
          this.record=record;
          //this.uploadData.baseId=record.id;
          this.imageUrl='';
          this.title="添加全景图"
          this.form.resetFields('panoramaUrl');
          this.panoramaUrl='';
          this.visible=true;
           }
        },
      handleOk(){
        if(this.title=="添加全景图"){
           this.form.validateFieldsAndScroll((err, values) => {
        if (!err) {
         const userinfo=this.form.getFieldsValue(['panoramaUrl'])
         userinfo.id = this.avatarsrc;
          updatebasepic(userinfo).then((res=>{
            if(res.success==true){
              this.$message.info('添加成功！')
               this.form.resetFields('panoramaUrl');
               this.$parent.loadData();
              this.visible=false;
            }else{
              this.$message.info(res.message)
              this.visible=false;
            }
          }))
        }
      });
        }
        if(this.title=="编辑全景图"){
        this.form.validateFieldsAndScroll((err, values) => {
        if (!err) {
         const userinfo=this.form.getFieldsValue(['panoramaUrl'])
         if(this.avatarsrc){
           userinfo.id=this.avatarsrc
         }else{
           userinfo.id = this.record.basePanoramaList[0].id;
         }
          updatebasepic(userinfo).then((res=>{
            if(res.success==true){
              this.$message.info('修改成功！')
               this.form.resetFields('panoramaUrl');
               this.$parent.loadData();
              this.visible=false;
            }else{
              this.$message.info(res.message)
              this.visible=false;
            }
          }))
        }
      });
        }
      },
    }
}

</script>
<style>
  .avatar-uploader > .ant-upload {
    width: 50px;
    height: 50px;
  }
  .ant-upload-select-picture-card i {
    font-size: 32px;
    color: #999;
  }

  .ant-upload-select-picture-card .ant-upload-text {
    margin-top: 8px;
    color: #666;
  }
</style>

