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
      label="指派给谁？"
    >
       <a-select  
      v-decorator="[
          'walkerId',
          {
            initialValue:num,
            rules: [{ required: true, message: '请选择巡查员' }],
          }
        ]"
        >
     <a-select-option v-for="(v,k) in walkerinfo" :value="v.id" :key="k">{{v.walkerName}}</a-select-option>
  </a-select>
    </a-form-item>
  </a-form>
    </a-modal>
  </div>
</template>
<script>
 import Vue from 'vue'
  import {pick} from 'lodash'
  import { getwalkerlist,sendorder } from '@/api/userApi'
  export default {
    data() {
      return {
        walkerinfo:[],
        num:1,
        record:{},
        loading: false,
        visible: false,
        title:"指派",
        okText:"确定指派",
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

        edit(record){
          if(record!=" "&&record!=undefined){
            this.record=record
          }
        this.visible=true
        getwalkerlist().then((res=>{
            this.walkerinfo=res.result
            this.num=res.result[0].id;
          }))
        },
      handleOk(){
       
           this.form.validateFieldsAndScroll((err, values) => {
        if (!err) {
         const userinfo=this.form.getFieldsValue(['walkerId'])
         userinfo.orderId=this.record.id
          sendorder(userinfo).then((res=>{
            if(res.success==true){
              this.$message.info('指派成功！')
              this.$parent.loadData();
              this.visible=false;
            }else{
              this.$message.info(res.message)
            }
          }))
             
         //this.$message.info(this.$store.state.user.addinfo)
         //console.log(this.form.getFieldsValue(['username','password','phone','sex','email']))
        }
      });
        }
       
      },
    
    }
    
</script>
<style>
 
</style>