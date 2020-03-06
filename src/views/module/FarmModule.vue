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
      label="农户姓名"
    >
      <a-input
        v-decorator="[
          'farmerName',
          {
            initialValue:record.farmerName,
            rules: [{ required: true, message: '用户名长度必须在1-32位内！',min:1,max:32 }],
          }
        ]"
      />
    </a-form-item>
    <a-form-item
      v-bind="formItemLayout"
      label="手机号"
    >
      <a-input
        maxlength="11" onkeyup="this.value=this.value.replace(/\D/g,'')"
        v-decorator="[
          'farmerPhoneNum',
          {initialValue:record.farmerPhoneNum,
            rules: [{
              required: true, message: ' ',
            },{
              validator: displayResult,
            }],
          }
        ]"
        style="width: 100%"
        v-if="isedit"
      />
      <template v-if="!isedit">{{record.phone}}</template>
    </a-form-item>
    <a-form-item
      v-bind="formItemLayout"
      label="邮箱"
    >
      <a-input
        v-decorator="[
          'farmerEmail',
          {initialValue:record.farmerEmail,
            rules: [{
              type: 'email', message: '这不是一个正确的邮箱',
            }, {
              required: false, message: '请输入邮箱',
            }]
          }
        ]"
      />
    </a-form-item>
    <a-form-item
      v-bind="formItemLayout"
      label="地址"
    >
     <a-button type="primary" @click="handleupdate" v-if="!ade">修改地址</a-button>
      <a-cascader :options="options" placeholder="请选择省/市/(县，区)" @change="onChangmap" v-if="ade"/>
      <a-input
      :disabled="!ade"
        v-decorator="[
          'contactAddress',
          {initialValue:record.contactAddress,
            rules: [{ required: true, message: '请输入你的地址' }]
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
          'farmerPassword',
          {
            rules: [{
              required: true, message: '密码长度必须在6-32位内！',min:6,max:32
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
    action="/api/farmer/insertPicture"
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
  import {farmnumcheck} from '@/api/allapi'
  import {pick} from 'lodash'
  import { addfarm,updatefarm,updatefarmpw,getmap} from '@/api/userApi'
  export default {
    data() {
      return {
         address:[],
        options: [],
        label:[],
        par:{},
        ade:true,
        imageUrl: '',
        isedit:true,
        tx:true,
        pw:true,
        npw:true,
        record:{},
        headers:'',
        avatarsrc:'',
        loading: false,
        visible: false,
        title:"",
        okText:"",
        confirmDirty: false,
        oldphone:'',
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
       handleupdate(){
        this.ade=true;
        this.options=[];
        this.loadmap();
        this.form.resetFields('contactAddress');
      },
      onChangmap(value){
        this.label=[];
        this.address=[];
        this.par={};
        for(let i=0;i<value.length;i++){
          let a=value[i].split('-');
          this.address.push(a[1]);
          this.label.push(a[0]);
        }
        if(value.length>1){
        this.par.province=this.address[0];
        this.par.provinceCode=this.label[0];
        this.par.city=this.address[1];
        this.par.cityCode=this.label[1];
        this.par.area=this.address[2];
        this.par.areaCode=this.label[2];
        }else{
          this.par.province=this.address[0];
          this.par.provinceCode=this.label[0];
        }
      },
        handleChange (info) {
      if (info.file.status === 'uploading') {
        this.loading = true
        return
      }
      if (info.file.status === 'done') {
        // Get this url from response in real world.
        //console.log(info.file.response.result.path)
        this.avatarsrc=info.file.response.result
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
     loadmap(){
  getmap().then((res)=>{
          console.log('地区列表................');
          console.log(res);
          for(let i=0;i<res.result.length;i++){
            var a={};
            a.value=res.result[i].id+'-'+res.result[i].name;
            a.label=res.result[i].name;
            a.children=[];
            if(res.result[i].children.length>0){
              for(let j=0;j<res.result[i].children.length;j++){
                var b={};
                b.value=res.result[i].children[j].id+'-'+res.result[i].children[j].name;
                b.label=res.result[i].children[j].name;
                b.children=[];
                if(res.result[i].children[j].children.length>0){
                  for(let k=0;k<res.result[i].children[j].children.length;k++){
                    var c={};
                    c.value=res.result[i].children[j].children[k].id+'-'+res.result[i].children[j].children[k].name;
                    c.label=res.result[i].children[j].children[k].name;
                    b.children.push(c);
                  }
                }
                a.children.push(b);
              }
            }
            this.options.push(a);
          }
        });
      },
        add(){
          this.form.resetFields();
          this.record={};
          this.title="添加农户";
          this.okText="确认添加";
          this.pw=true;
          this.npw=true;
          this.imageUrl='';
          this.ade=true;
          this.tx=true;
          this.options=[];
          this.loadmap();
          this.edit();
        },
        edit(record){
          this.form.resetFields();
          if(record!=" "&&record!=undefined){
            this.oldphone=record.farmerPhoneNum;
            this.record=record;
            this.title="编辑农户";
            this.okText="确认修改";
            this.imageUrl='';
            this.pw=false;
            this.npw=true;
            this.ade=false;
            this.tx=true;
            let imgshowapi = '/api/upload/show'
            if(record.headPictureInfo){
            this.imageUrl=imgshowapi+'?fileName='+record.headPictureInfo
            }else{
               this.imageUrl='';
            }

          }
        this.visible=true
        },
        editpw(record){
          this.form.resetFields();
          if(record!=" "&&record!=undefined){
            this.record=record;
            this.title="修改密码";
            this.okText="确认修改";
            this.pw=true;
            this.npw=false;
            this.ade=false;
            this.tx=false;
          }
        this.visible=true
        },
        handleOk(){
        if(this.title=="添加农户"){
           this.form.validateFieldsAndScroll((err, values) => {
        if (!err) {
          let info={};
         info=this.form.getFieldsValue(['farmerName','farmerPhoneNum','contactAddress','farmerEmail','farmerPassword']);
         info.headPictureInfo = this.avatarsrc;
         let a=info.contactAddress;
         info.contactAddress=this.address.join('')+a;
          this.par.address=this.address.join('')+a;
           info.address=this.par;
           let b={};
           b.phone=info.farmerPhoneNum;
           farmnumcheck(b).then((res)=>{
             if(res.success){
               addfarm(info).then((res=>{
            if(res.success==true){
              this.$message.info('添加成功！')
              this.$parent.loadData();
              //this.form.resetFields();
              this.imageUrl='';
              this.form.resetFields();
              this.visible=false;
            }else{
              this.$message.info(res.message)
            }
          }))
             }
             else{
               this.$message.info(res.message)
             }
           })

        }
      });
        }
        if(this.title=="编辑农户"){
        this.form.validateFieldsAndScroll((err, values) => {
        if (!err) {
         const info=this.form.getFieldsValue(['farmerName','farmerPhoneNum','contactAddress','farmerEmail']);
         let a=info.contactAddress;
         info.id=this.record.id
         info.farmerStatus=this.record.farmerStatus
         if(this.avatarsrc){
            info.headPictureInfo = this.avatarsrc;
         }else{
           info.headPictureInfo = this.record.headPictureInfo;
         }
         if(this.ade){
            info.contactAddress=this.address.join('')+a;
            this.par.address=this.address.join('')+a;
            info.address=this.par;
                }else{
                  info.address=this.record.address;
                }
                let b={};
                b.phone=info.farmerPhoneNum;
                if(this.oldphone==info.farmerPhoneNum){
                   updatefarm(info).then((res=>{
            if(res.success==true){
              this.$message.info(res.message);
              this.$parent.loadData();
              this.form.resetFields();
              this.visible=false;
            }else{
              this.$message.info(res.message)
            }
          }))
                }else{
            farmnumcheck(b).then((res)=>{
             if(res.success){
                updatefarm(info).then((res=>{
            if(res.success==true){
              this.$message.info(res.message);
              this.$parent.loadData();
              this.form.resetFields();
              this.visible=false;
            }else{
              this.$message.info(res.message)
            }
          }))
             }
             else{
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
         const info=this.form.getFieldsValue(['farmerPassword']);
         info.id=this.record.id

          updatefarmpw(info).then((res=>{
            if(res.success==true){
              this.$message.info(res.message);
              this.$parent.loadData();
              this.form.resetFields();
              this.visible=false;
            }else{
              this.$message.info(res.message)
            }
          }))
        }
      });
        }
      },
      handleConfirmBlur  (e) {
      const value = e.target.value;
      this.confirmDirty = this.confirmDirty || !!value;
    },
    compareToFirstPassword  (rule, value, callback) {
      const form = this.form;
      if (value && value !== form.getFieldValue('farmerPassword')) {
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
    displayResult  (rule, value, callback) {
      if (value.length!=11) {
        callback('请输入正确的手机号');
      } else {
        callback();
      }
    }
    }
}

</script>
<style>

</style>
