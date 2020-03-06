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
      label="账户名"
    >
      <a-input
        v-decorator="[
          'account',
          
          {
            initialValue:record.account,
            rules: [{ required: true, message: '用户名长度要在6-30内！',min:6,max:30  }],
          }
        ]"
        v-if="isedit"
      />
      <template v-if="!isedit">{{record.account}}</template>
    </a-form-item>
     <a-form-item
          label="基地"
          v-bind="formItemLayout"
        >
          <a-select
            v-decorator="[
          'relationId',
          {
            initialValue:record.relationId?record.relationId:defid,
            rules: [{ required: true, message: '请选择基地'}],
          }
        ]"
        >
            <a-select-option v-for="v in bases" :key="v.id" :value="v.id">{{v.baseName}}</a-select-option>
          </a-select>
        </a-form-item>  
    </template>
    <template v-if="pw">
    <a-form-item
      v-bind="formItemLayout"
      label="密码"
    >
      <a-input
        v-decorator="[
          'accPassword',
          {
            rules: [{
              required: true, message: '密码长度必须在6-32位内！',min:6,max:30
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
    
  </a-form>
    </a-modal>
  </div>
</template>
<script>
 import Vue from 'vue'
 import { ACCESS_TOKEN } from "@/store/mutation-types"
  import {pick} from 'lodash'
  import { baseaccountadd,baseaccountupdate,baseaccountpassword } from '@/api/userApi'
  import { queryAllBase,baseacountcheck } from '@/api/allapi'
  export default {
    data() {
      return {
        bases:'',
        defid:1,
        isedit:true,
        npw:true,
        pw:true,
        record:{},
        loading: false,
        confirmDirty: false,
        visible: false,
        title:"操作",
        okText:"",
        oldname:'',
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
    queryAllBase().then((res)=>{
          if(res.success){

            this.bases = res.result;
            this.defid=res.result[0].id;
          }else{
            this.$message.info(res.message)
          }
          console.log(res);
        })
  },
    methods: {
        add(){
          this.form.resetFields();
          this.record={};
          this.isedit=true;
          this.visible=true;
        },
        editpw(record){
        this.form.resetFields();
         if(record!=" "&&record!=undefined){
            this.record=record
         }
         this.visible=true
        },
        look(record){
          this.form.resetFields();
          this.isedit=false;
         if(record!=" "&&record!=undefined){
            this.record=record
          }
        this.visible=true
        },
        edit(record){
          this.form.resetFields();
           this.isedit=true;
          if(record!=" "&&record!=undefined){
            this.record=record
            this.oldname=this.record.account;
            //console.log(record)
          }
        this.visible=true
        },
      handleOk(){
        if(this.title=="添加用户"){
           this.form.validateFieldsAndScroll((err, values) => {
        if (!err) {
         const userinfo=this.form.getFieldsValue(['account','relationId','accPassword']) 
         let a={};
         a.account=userinfo.account; 
         baseacountcheck(a).then((res)=>{
           if(res.success){
             this.form.resetFields();
          baseaccountadd(userinfo).then((res=>{
            if(res.success==true){
              this.$message.info('添加成功！')
               this.form.resetFields()
               this.$parent.loadData();
              this.visible=false;
            }else{
              this.$message.info(res.message)
            }
          }))
           }else{
                // this.form.resetFields('account')
                 this.$message.info(res.message)
                }
         })
         
             
         //this.$message.info(this.$store.state.user.addinfo)
         //console.log(this.form.getFieldsValue(['username','password','phone','sex','email']))
        }
      });
        }
        if(this.title=="编辑用户"){
        this.form.validateFieldsAndScroll((err, values) => {
        if (!err) {
         const userinfo=this.form.getFieldsValue(['account','relationId']) 
         userinfo.id=this.record.id
          if(this.oldname==userinfo.account){
          baseaccountupdate(userinfo).then((res=>{
            if(res.success==true){
              this.$message.info(res.message)
              this.$parent.loadData();
              this.visible=false;
            }else{
              this.$message.info(res.message)
            }
          }))
          }else{
            let a={};
         a.account=userinfo.account; 
         baseacountcheck(a).then((res)=>{
           if(res.success){
              baseaccountupdate(userinfo).then((res=>{
            if(res.success==true){
              this.$message.info(res.message)
              this.$parent.loadData();
              this.visible=false;
            }else{
              this.$message.info(res.message)
            }
          }))
           }else{
                 //this.form.resetFields('account')
                 this.$message.info(res.message)
                }
         })
         
          }
        }
      });  
        }
        if(this.title=="修改密码"){
          this.form.validateFieldsAndScroll((err, values) => {
        if (!err) {
         const userinfo=this.form.getFieldsValue(['accPassword']) 
          this.form.resetFields();
         userinfo.id=this.record.id
          baseaccountpassword(userinfo).then((res=>{
            if(res.success==true){
              this.$message.info(res.message)
              this.visible=false;
            }else{
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
      if (value && value !== form.getFieldValue('accPassword')) {
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

