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
          'loginAccount',
          {
            initialValue:record.loginAccount,
            rules: [{ required: true, message: '用户名长度必须在6-32位内！' ,min:6,max:32}],
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
    <a-form-item
      v-bind="formItemLayout"
      label="手机号"
    >
      <a-input
        maxlength="11" onkeyup="this.value=this.value.replace(/\D/g,'')"
        v-decorator="[
          'phoneNum',
          {initialValue:record.phoneNum,
            rules: [{
              required: true, message: ' ',
            },{
              validator: displayResult,
            }],
          }
        ]"
        style="width: 100%"
      />
    </a-form-item>

    <a-form-item
      v-bind="formItemLayout"
      label="地址"
    >
    <a-button type="primary" @click="handleupdate" v-if="!ade">修改地址</a-button>
      <a-cascader :options="options" placeholder="请选择省/市/(县，区)" @change="onChangmap" v-else/>
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
          'loginPassword',
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
     <template v-if="post">
    <a-form-item
      v-bind="formItemLayout"
      label="岗位"
    >
    <a-select v-model="serpost">
      <a-select-option v-for="v in servicepost" :key="v.id" :value="v.id" v-if="next">{{v.positionName}}</a-select-option>
      <a-select-option v-for="v in servicepost" :key="v.id" :value="v.pId" v-else>{{v.pName}}</a-select-option>
    </a-select>
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
  import { addservice,updateservice,getservicepostlist,distriWorkPosition,delworkposition,getmap,} from '@/api/userApi'
  import {seraccountcheck} from '@/api/allapi'
  export default {
    data() {
      return {
        address:[],
        options: [],
        label:[],
        par:[],
        ade:true,
        next:true,
        serpost:1,
        servicepost:[],
        pw:true,
        npw:true,
        post:false,
        record:{},
        loading: false,
        visible: false,
        title:"",
        okText:"",
        confirmDirty: false,
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
       loadmap(){
  getmap().then((res)=>{
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
          this.record={};
          this.title="添加服务人员";
          this.okText="确认添加";
          this.pw=true;
          this.npw=true;
          this.ade=true;
          this.post=false;
          this.options=[];
          this.loadmap();
          this.edit();
        },
        edit(record){
          this.form.resetFields();
          if(record!=" "&&record!=undefined){
            this.record=record
            this.title="编辑";
            this.okText="确认修改";
            this.pw=false;
            this.npw=true;
            this.post=false;
            this.ade=false;
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
            this.post=false;
          }
        this.visible=true
        },
        editpost(record){
          if(record!=" "&&record!=undefined){
            this.record=record;
            this.title="分配岗位";
            this.okText="确认分配";
            this.pw=false;
            this.npw=false;
            this.post=true;
            this.next=true;
            getservicepostlist().then((res=>{
            this.servicepost=res.result;
            this.serpost=res.result[0].id;
        }))
          }
        this.visible=true
        },
        delpost(record){
            if(record.psmList.length>0){
          if(record!=" "&&record!=undefined){
            this.record=record;
            this.title="删除岗位";
            this.okText="确认删除";
            this.pw=false;
            this.npw=false;
            this.post=true;
            this.next=false;
            this.servicepost=record.psmList;
            this.serpost=record.psmList[0].pId;
          }
        this.visible=true
        }else{
        this.$message.info("请先指派岗位！");
            }
        },
        handleOk(){
        if(this.title=="添加服务人员"){
           this.form.validateFieldsAndScroll((err, values) => {
        if (!err) {
         const info=this.form.getFieldsValue(['realName','loginPassword','loginAccount','phoneNum','contactAddress']);
         let a=info.contactAddress;
         info.contactAddress=this.address.join('')+a;
          this.par.address=this.address.join('')+a; 
           info.address=this.par;
         //info.manType=this.sertype;
         //info.positionType=this.serpost;
         seraccountcheck({account:info.loginAccount}).then((res)=>{
           if(res.success){
             addservice(info).then((res=>{
            if(res.success==true){
              this.$message.info('添加成功！')
              this.$parent.loadData();
              this.visible=false;
            }else{
              this.$message.info(res.message)
            }
            this.form.resetFields();
          }))
           }else{
             //this.form.resetFields('phoneNum');
             this.$message.info(res.message);
           }
         })
         
        }
      });
        }
        if(this.title=="编辑"){
        this.form.validateFieldsAndScroll((err, values) => {
        if (!err) {
         const info=this.form.getFieldsValue(['realName','loginAccount','phoneNum','contactAddress']);
         info.id=this.record.id
         let a=info.contactAddress;
         //info.manStatus=this.record.manStatus
         if(this.record.loginAccount==info.loginAccount){
            if(this.ade){
            info.contactAddress=this.address.join('')+a;
            this.par.address=this.address.join('')+a; 
            info.address=this.par;
                }else{
                  info.address=this.record.address;
                }
          updateservice(info).then((res=>{
            if(res.success==true){
              this.$message.info(res.message);
              this.$parent.loadData();
              this.visible=false;
            }else{
              this.$message.info(res.message)
            }
          }))
         }else{
           seraccountcheck({account:info.loginAccount}).then((res)=>{
           if(res.success){
              if(this.ade){
            info.contactAddress=this.address.join('')+a;
            this.par.address=this.address.join('')+a; 
            info.address=this.par;
                }else{
                  info.address=this.record.address;
                }
              updateservice(info).then((res=>{
            if(res.success==true){
              this.$message.info(res.message);
              this.$parent.loadData();
              this.visible=false;
            }else{
              this.$message.info(res.message)
            }
          }))
           }else{
             //this.form.resetFields('phoneNum');
             this.$message.info(res.message);
           }
         })
         }
        }
      });
        }
        if(this.title=="修改密码"){
        this.form.validateFieldsAndScroll((err, values) => {
        if (!err) {
          const info=this.record;
          info.loginPassword=this.form.getFieldsValue(['loginPassword']).loginPassword;
         //info.manStatus=this.record.manStatus
          updateservice(info).then((res=>{
            if(res.success==true){
              this.$message.info(res.message);
              this.$parent.loadData();
              this.visible=false;
            }else{
              this.$message.info(res.message)
            }
          }))
        }
      });
        }
         if(this.title=="分配岗位"){
        this.form.validateFieldsAndScroll((err, values) => {
        if (!err) {
         const info={};
         info.serviceManId=this.record.id;
         info.positionId=this.serpost;
         distriWorkPosition(info).then((res=>{
            if(res.success==true){
              this.$message.info(res.message);
              this.$parent.loadData();
              this.visible=false;
            }else{
              this.$message.info(res.message)
            }
          }))
        }
      });
        }
         if(this.title=="删除岗位"){
        this.form.validateFieldsAndScroll((err, values) => {
        if (!err) {
         const info={};
         info.serviceManId=this.record.id;
         info.positionId=this.serpost;
         delworkposition(info).then((res=>{
            if(res.success==true){
              this.$message.info(res.message);
              this.$parent.loadData();
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
      if (value && value !== form.getFieldValue('loginPassword')) {
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
      },
    }
}

</script>
<style>

</style>
