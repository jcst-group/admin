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
  <template v-if="npw">
    <a-form-item
      v-bind="formItemLayout"
      label="用户名"
    >
      <a-input
        v-decorator="[
          'username',
          
          {
            initialValue:record.username,
            rules: [{ required: true, message: '请输入用户名' }],
          }
        ]"
      />
    </a-form-item>
    <a-form-item
      v-bind="formItemLayout"
      label="真实姓名"
    >
      <a-input
        v-decorator="[
          'realName',
          {
            initialValue:record.realName,
            rules: [{ required: true, message: '请输入真实姓名' }],
          }
        ]"
      />
    </a-form-item>
    
    </template>
    <template v-if="pw">
    <a-form-item
      v-bind="formItemLayout"
      label="密码"
    >
      <a-input
        v-decorator="[
          'password',
          {
            rules: [{
              required: true, message: '请输入密码',
            }, {
              validator: validateToNextPassword,
            }],
          }
        ]"
        type="password"
      />
    </a-form-item>
    <a-form-item
      v-bind="formItemLayout"
      label="确认密码"
    >
      <a-input
        v-decorator="[
          'confirm',
          {
            rules: [{
              required: true, message: '请再输入一次密码',
            }, {
              validator: compareToFirstPassword,
            }],
          }
        ]"
        type="password"
        @blur="handleConfirmBlur"
      />
    </a-form-item>
    </template>
    <template v-if="npw">
    <a-form-item
      v-bind="formItemLayout"
      label="性别"
    >
      <a-select  
      v-decorator="[
          'sex',
          {
            initialValue:String(this.record.sex),
            rules: [{ required: true, message: '请选择你的性别' }],
          }
        ]"
        >
      <a-select-option value="0">男</a-select-option>
      <a-select-option value="1">女</a-select-option>
  </a-select>
    </a-form-item>


    <a-form-item
      v-bind="formItemLayout"
      label="手机号"
    >
      <a-input
        v-decorator="[
          'phone',
          {initialValue:record.phone,
            rules: [{ required: true, message: '请输入你的手机号' }],
          }
        ]"
        style="width: 100%"
      >
      </a-input>
    </a-form-item>
    <a-form-item
      v-bind="formItemLayout"
      label="邮箱"
    >
      <a-input
        v-decorator="[
          'email',
          {initialValue:record.email,
            rules: [{
              type: 'email', message: '这不是一个正确的邮箱',
            }, {
              required: true, message: '请输入邮箱',
            }]
          }
        ]"
      />
    </a-form-item>
    </template>
    <template v-if="tx">
<a-form-item
      v-bind="formItemLayout"
      label="头像"
    >
       <a-upload
    name="file"
    listType="picture-card"
    class="avatar-uploader"
    :showUploadList="false"
    action="/api/upload/image"
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
    </template>
    
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
  export default {
    data() {
      return {
        tx:true,
        pw:false,
        npw:true,
        record:{},
        loading: false,
        imageUrl: '',
        headers:'',
        avatarsrc:'',
        confirmDirty: false,
        visible: false,
        title:"操作",
        okText:"",
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
        handleChange (info) {
      if (info.file.status === 'uploading') {
        this.loading = true
        return
      }
      if (info.file.status === 'done') {
        // Get this url from response in real world.
        //console.log(info.file.response.result.path)
        this.avatarsrc=info.file.response.result.path
        getBase64(info.file.originFileObj, (imageUrl) => {
         
          this.imageUrl = imageUrl
          this.loading = false
        })
      }
    },
    beforeUpload (file) {
      const isJPG = file.type === 'image/jpeg'
      if (!isJPG) {
        this.$message.error('You can only upload JPG file!')
      }
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isLt2M) {
        this.$message.error('Image must smaller than 2MB!')
      }
      return isJPG && isLt2M
    },
        add(){
          this.record={}
          this.imageUrl=''
          this.record.sex=''
          this.edit();
        },
        editpw(record){
        
         if(record!=" "&&record!=undefined){
            this.record=record
         }
         this.visible=true
        },
        look(record){
          if(record!=" "&&record!=undefined){
           if(!record.avatar){
             this.tx=false
           }
           else{
             this.tx=true
           }
          }
        this.edit(record) 
        },
        edit(record){
          
          if(record!=" "&&record!=undefined){
            this.record=record
            if(this.record.sex==null){
              this.record.sex=''
            }
            //console.log(record)
            let imgshowapi = '/api/upload/show'
            if(record.avatar){
            this.imageUrl=imgshowapi+'?fileName='+record.avatar
            }else{
               this.imageUrl=''
            }
          }
        this.visible=true
        },
      handleOk(){
        if(this.title=="新增"){
           this.form.validateFieldsAndScroll((err, values) => {
        if (!err) {
         const userinfo=this.form.getFieldsValue(['username','realName','password','phone','sex','email']) 
         this.form.resetFields();
         //console.log(this.avatarsrc);
         userinfo.avatar = this.avatarsrc;
         //urif=Object.assign(userinfo,{avatar:getimgurl()})
         //getimgurl();
         //this.$store.dispatch('user/adduser',userinfo)
          addInfo(userinfo).then((res=>{
            if(res.success==true){
              this.$message.info('添加成功！')
               this.form.resetFields()
              this.visible=false;
            }else{
              this.form.resetFields('username')
              this.$message.info(res.message)
              this.visible=false;
            }
          }))
             
         //this.$message.info(this.$store.state.user.addinfo)
         //console.log(this.form.getFieldsValue(['username','password','phone','sex','email']))
        }
      });
        }
        if(this.title=="编辑"){
        this.form.validateFieldsAndScroll((err, values) => {
        if (!err) {
         const userinfo=this.form.getFieldsValue(['username','realName','phone','sex','email']) 
          this.form.resetFields();
         if(this.avatarsrc){
           userinfo.avatar=this.avatarsrc
         }else{
           userinfo.avatar = this.record.avatar;
         }
         userinfo.uid=this.record.uid
          updateUser(userinfo).then((res=>{
            if(res.success==true){
              this.$message.info(res.message)
              this.$store.dispatch('user/getlist',{pageNo:"1",pageSize:"30"})
            }else{
              this.form.resetFields('username')
              this.$message.info(res.message)
            }
          }))
        }
      });  
        }
        if(this.title=="修改密码"){
          this.form.validateFieldsAndScroll((err, values) => {
        if (!err) {
         const userinfo=this.form.getFieldsValue(['password']) 
          this.form.resetFields();
         userinfo.uid=this.record.uid
          updateUser(userinfo).then((res=>{
            if(res.success==true){
              this.$message.info(res.message)
              this.$store.dispatch('user/getlist',{pageNo:"1",pageSize:"30"})
            }else{
              this.form.resetFields('username')
              this.$message.info(res.message)
            }
          }))
        }
      });  
        }
        if(this.title=="查看详情"){
          this.visible=false
        }
      },
       handleConfirmBlur  (e) {
      const value = e.target.value;
      this.confirmDirty = this.confirmDirty || !!value;
    },
    compareToFirstPassword  (rule, value, callback) {
      const form = this.form;
      if (value && value !== form.getFieldValue('password')) {
        callback('两次密码不一样');
      } else {
        callback();
      }
    },
    validateToNextPassword  (rule, value, callback) {
      const form = this.form;
      if (value && this.confirmDirty) {
        form.validateFields(['confirm'], { force: true });
      }
      callback();
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
