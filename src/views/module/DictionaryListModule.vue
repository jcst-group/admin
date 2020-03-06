/*
*   字典管理添加模块
*/
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
          label="字典分类编号"
        >
          <a-input
            v-decorator="[
          'dictTypeCode',

          {
            initialValue:record.dictTypeCode,
            rules: [{ required: true, message: '请输入字典分类编号' }],
          }
        ]"
            v-if="isedit"
          />
          <template v-if="!isedit">{{record.dictTypeCode}}</template>
        </a-form-item>
        <a-form-item
          v-bind="formItemLayout"
          label="字典分类名称"
        >
          <a-input
            v-decorator="[
          'dictTypeName',

          {
            initialValue:record.dictTypeName,
            rules: [{ required: true, message: '请输入字典分类名称' }],
          }
        ]"
            v-if="isedit"
          />
          <template v-if="!isedit">{{record.dictTypeName}}</template>
        </a-form-item>
        <a-form-item
          v-bind="formItemLayout"
          label="默认值"
        >
          <a-input
            v-decorator="[
          'defaultValue',
          {
            initialValue:record.defaultValue,
            rules: [{ required: true, message: '请输入值' }],

          }
        ]"
            v-if="isedit"
          />
          <template v-if="!isedit">{{record.defaultValue}}</template>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>
<script>
  import Vue from 'vue'
  import { ACCESS_TOKEN } from "@/store/mutation-types"

  import {pick} from 'lodash'
  import { addpro,updateUser,updateDictType,insertDictType } from '@/api/userApi'
  export default {
    data() {
      return {
        isedit:true,
        record:{},
        loading: false,
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
    },
    methods: {
      add(){
        this.isedit=true;
        this.record={}
        this.edit();
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
        this.isedit=false;
        this.edit(record,2)
      },
      edit(record,a){
        if(a==2){
          this.isedit=false;
        }else{
          this.isedit=true;
        }
        if(record!=" "&&record!=undefined){
          this.record=record
          /*if(this.record.sex==null){
            this.record.sex=''
          }
          //console.log(record)
          let imgshowapi = '/api/upload/show'
          if(record.avatar){
          this.imageUrl=imgshowapi+'?fileName='+record.avatar
          }else{
             this.imageUrl=''
          }*/
        }
        this.visible=true
      },
      handleOk(){
        if(this.title=="添加字典"){
          this.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
              const userinfo=this.form.getFieldsValue(['dictTypeCode','dictTypeName','defaultValue'])
              this.form.resetFields();
              console.log(userinfo);
              insertDictType(userinfo).then((res=>{
                if(res.success==true){
                  this.$message.info('添加成功！')
                  this.form.resetFields()
                  this.$parent.loadData()
                }else{
                  this.$message.info(res.message)
                  this.visible=false;
                }
              }))

              //this.$message.info(this.$store.state.user.addinfo)
              //console.log(this.form.getFieldsValue(['username','password','phone','sex','email']))
            }
          });
        }
        if(this.title=="编辑字典"){
          this.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
              const userinfo=this.form.getFieldsValue(['dictTypeCode','dictTypeName','defaultValue',])
              this.form.resetFields();
              userinfo.id=this.record.id
              updateDictType(userinfo).then((res=>{
                if(res.success==true){
                  this.$message.info(res.message)
                  this.$parent.loadData()

                  this.visible=false
                }else{
                  this.$message.info(res.message)
                }
              }))
            }
          });
        }
        if(this.title=="查看详情"){
          this.visible=false;
          this.isedit=false;
        }else{
          this.isedit=true;
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
