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
    <template v-if="nbutton">
    <div style="margin: 0 0 16px 10px;">
      <a-button
        type="primary"
        @click="dtb"
      >
        立即派发
      </a-button>
</div>
</template>
      <a-form
    :form="form"
  >
    <a-form-item
      v-bind="formItemLayout"
      label="所属基地"
    >
       <a-select
      v-decorator="[
          'baseId',
          {
            initialValue:1,
            rules: [{ required: true, message: '请选择基地' }],
          }
        ]"
        v-if="base"
         >
     <a-select-option v-for="(v,index) in baseinfo" :value="v.id" :key="index">{{v.baseName}}</a-select-option>
  </a-select>
   <a-input
   v-if="!base"
        v-decorator="[
          'baseId',

          {
            initialValue:defbase,
          }
        ]"
      />
    </a-form-item>
    <a-form-item
      v-bind="formItemLayout"
      label="工单名称"
    >
      <a-input
        v-decorator="[
          'workOrderName',

          {
            initialValue:record.workOrderName,
            rules: [{ required: true, message: '请输入工单名称' }],
          }
        ]"
      />
    </a-form-item>
    <a-form-item
      v-bind="formItemLayout"
      label="工单内容"
    >
    <a-textarea :rows="4"
     v-decorator="[
          'workOrderContent',
          {
            initialValue:record.workOrderContent,
            rules: [{ required: true, message: '请输入工单内容' }],
          }
        ]"
    />

    </a-form-item>


    <a-form-item
      v-bind="formItemLayout"
      label="开始时间"
    >
      <a-date-picker
       v-decorator="[
          'startTime',
          {rules: [{ required: true, message: '请输入开始时间' }],
          initialValue:moment(startTime, 'YYYY-MM-DD')}
        ]"
      />
    </a-form-item>
     <a-form-item
      v-bind="formItemLayout"
      label="结束时间"
    >
      <a-date-picker
      v-decorator="[
          'endTime',
          {rules: [{ required: true, message: '请输入结束时间' }],
          initialValue:moment(endTime, 'YYYY-MM-DD')}
        ]"
      />
    </a-form-item>

  <!-- <a-form-item
     v-bind="formItemLayout"
     label=" 开始时间"
   >
    <a-date-picker
      v-decorator="['startTime',
      {initialValue:record}]"-->

    <template v-if="distribute">
    <a-form-item
      v-bind="formItemLayout"
      label="巡查员姓名"
    >
      <a-input
        v-decorator="[
          'walkerName',
          {initialValue:walkerName,
            rules: [{
              required: true, message: '请输入巡查员姓名',
            }]
          }
        ]"
      />
    </a-form-item>
    <a-form-item
      v-bind="formItemLayout"
      label="派发时间"
    >
      <a-input
        v-decorator="[
          'distributionTime',
          {initialValue:distributionTime,
            rules: [{ required: true, message: '请输入派发时间' }],
          }
        ]"
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
import moment from 'moment';

  import {pick} from 'lodash'
  import { addworklist,updateworklist,getbaselist } from '@/api/userApi'

  export default {
    data() {
      return {
        //walkerName:'',
        //distributionTime:'',
        startTime:'',
        endTime:'',
        base:true,
        defbase:"",
        baseinfo:[],
        nbutton:false,
        distribute:false,
        record:{},
        loading: false,
        confirmDirty: false,
        visible: false,
        title:"操作",
        okText:"",
        userinfo:{},
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
      moment,
       getNowFormatDate() {
            var date = new Date();
            var seperator1 = "-";
            var year = date.getFullYear();
            var month = date.getMonth() + 1;
            var strDate = date.getDate();
            if (month >= 1 && month <= 9) {
                month = "0" + month;
            }
            if (strDate >= 0 && strDate <= 9) {
                strDate = "0" + strDate;
            }
            var currentdate = year + seperator1 + month + seperator1 + strDate;
            return currentdate;
        },
        dtb(){
          this.record={};
          if(this.distribute){
            this.distribute=false
            this.form.resetFields(['walkerName','distributionTime'])
          }else{
            this.distribute=true
          }
        },
        add(){
          //this.form.resetFields();
          this.record={};
          this.defbase=1;
          this.base=true;
          this.startTime=this.getNowFormatDate();
          this.endTime=this.getNowFormatDate();
          this.edit();
          getbaselist().then((res=>{
            this.baseinfo=res.result.list
          }))
          this.edit();

        },
        edit(record){
          this.record={};
          if(record!=" "&&record!=undefined){
            this.base=false;
            this.record=record
            this.defbase=record.baseInfo.baseName
            this.startTime=record.startTime;
            this.endTime=record.endTime;
          }
        this.visible=true
        },
      handleOk(){
        if(this.title=="添加工单"){
           this.form.validateFieldsAndScroll((err, values) => {
        if (!err) {
         this.userinfo=this.form.getFieldsValue(['workOrderName','workOrderContent','baseId'])
         this.getTime();
          addworklist(this.userinfo).then((res=>{
            if(res.success==true){
              this.$message.info('添加成功！')
               this.form.resetFields()
               this.$parent.loadData()
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
        if(this.title=="编辑工单"){
        this.form.validateFieldsAndScroll((err, values) => {
        if (!err) {
         this.userinfo=this.form.getFieldsValue(['workOrderName','workOrderContent','baseName'])
         this.getTime();
         this.userinfo.id=this.record.id
          updateworklist(this.userinfo).then((res=>{
            if(res.success==true){
              this.$message.info(res.message)
              this.form.resetFields()
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
          this.visible=false
        }
      },
      getTime(){
        this.userinfo.startTime=this.form.getFieldsValue(['startTime']).startTime.format('YYYY-MM-DD');
        this.userinfo.endTime=this.form.getFieldsValue(['endTime']).endTime.format('YYYY-MM-DD');
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
