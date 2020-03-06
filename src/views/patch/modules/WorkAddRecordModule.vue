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
          label="计划"
          v-bind="formItemLayout"
          v-if="batchsInit"
        >
          <a-select
            v-decorator="[
          'relationId',
          {
            initialValue:record.relationId,
          }
        ]"
          >
            <a-select-option v-for="v in orders" :key="v.id" :value="v.id">{{v.workOrderName}}</a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item
          label="记录名称"
        >
          <a-input
            v-decorator="[
          'farmingRecordName',
          {
            initialValue:record.farmingRecordName,
            rules: [{
              required: true, message: '请输入批次名称',
            }]
          }
        ]"
          />
        </a-form-item>
        <a-form-item
          v-bind="formItemLayout"
          label="记录内容"
        >
          <a-textarea :rows="4"
                      v-decorator="[
          'recordContent',
          {
            initialValue:record.recordContent,
            rules: [{ required: true, message: '请输入农事内容' }],
          }
        ]"
          />

        </a-form-item>


        <a-form-item

          label="开始与结束时间"
        >
          <a-range-picker
            :ranges="{ 今天: [moment(), moment()], '本月': [moment(), moment().endOf('month')] }"
            v-decorator="['startToEnd',
            {rules:
            [{ required: true, message: '请选择开始到结束的时间' }],
            initialValue:[moment(model.startTime,  'YYYY-MM-DD'), moment(model.endTime,  'YYYY-MM-DD')]
            },

            ]"
          />
          <!--<a-range-picker
              v-decorator="[
          'startTime',
          {rules: [{ required: true, message: '请输入开始时间' }],
          initialValue:moment(model.startTime, 'YYYY-MM-DD')}
        ]"
          />-->

         <!-- <a-date-picker
            v-decorator="[
          'startTime',
          {rules: [{ required: true, message: '请输入开始时间' }],
          initialValue:moment(model.startTime, 'YYYY-MM-DD')}
        ]"
          />-->
        </a-form-item>

       <!-- <a-form-item

          label="结束时间"
        >
          <a-date-picker
            v-decorator="[
          'endTime',
          {rules: [{ required: true, message: '请输入开始时间' }],
          initialValue:moment(model.endTime, 'YYYY-MM-DD')}
        ]"
          />
        </a-form-item>-->


      </a-form>
    </a-modal>
  </div>
</template>
<script>
  import Vue from 'vue'
  import { addservice } from '@/api/userApi'
  import { getCrops,queryAllBase ,selectByBaseId,selectWorkOrderByBatchId,getBatchCount ,farmingRecordInsert , farmingRecordUpdate } from '@/api/allapi'
  import moment from 'moment';
  export default {
    data() {
      return {
        model:{
          startTime:'',
          endTime:'',
        },
        treeData: [],
        next:true,
        post:false,
        bases:{},
        orders:[],
        initrecord:{
          baseId:null,
          batchId:null,
        },
        basesInit:true,
        batchsInit:true,
        record:{},
        loading: false,
        visible: false,
        crops:{},
        title:"",
        okText:"",
        formItemLayout: {

        },
        form: this.$form.createForm(this),
      }
    },
    computed:{
      batchId(){
        return this.record.batchId;
      }
    },
    methods: {
      moment,
      add(){
        this.record=this.initrecord;
        this.title="添加";
        this.okText="确认添加";
        this.edit(this.record);
      },
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

      initWorkOrder(batchId){
        console.log("initWorkOrder");
        this.batchsInit = false;
        selectWorkOrderByBatchId({batchId:batchId}).then((res=>{
          if(res.success==true){
            this.orders = res.result;
            if(this.initrecord.relationId!=batchId){
              console.log("initrecord.baseId!=this.record.baseId");
              this.record.relationId = undefined;
            }
          }else{
            this.$message.info(res.message)
          }
          this.batchsInit = true;
        }))
      },

      edit(record){
        this.treeData = [];

        this.model.startTime=this.getNowFormatDate();
        this.model.endTime=this.getNowFormatDate();
        this.form.resetFields();
        let batchId = this.initrecord.batchId;
        let that = this;
        selectWorkOrderByBatchId({batchId:batchId}).then((res=>{
          if(res.success==true){
            that.orders = res.result;
          }else{
            this.$message.info(res.message)
          }
        }))

        let recordExist = record!=undefined && record!=""&& record.id!=undefined;
        if(recordExist){
          this.model.startTime = record.startTime;
          this.model.endTime = record.endTime;
          this.record=record;
          console.log(record);
          this.title="编辑";
          this.okText="确认修改";
          this.post=false;

        }else{
          console.log("revalue the record");
          let xx = this.record;
          this.record = xx;
        }
        this.visible=true
      },
      handleOk(){
        this.form.validateFieldsAndScroll((err, values) => {
          if (!err) {
            const info=this.form.getFieldsValue();
            console.log("info edit",info);
            let startTime = info.startToEnd[0].format('YYYY-MM-DD');
            let endTime = info.startToEnd[1].format('YYYY-MM-DD');
            console.log("from "+startTime +" to "+ endTime);
            info.startTime = startTime;
            info.endTime = endTime;
            let record = this.record;
            if(record.id!=undefined && record.id!=null && record.id!=""){
              info.id = record.id;
              farmingRecordUpdate(info).then((res=>{
                if(res.success==true){
                  this.$message.info(res.message)
                  this.visible = false;
                  this.$parent.loadRecordData();

                }else{
                  this.$message.info(res.message)
                }
                this.form.resetFields();
              }))
            }else{
              info.batchId = this.initrecord.batchId;
              farmingRecordInsert(info).then((res=>{
                if(res.success==true){
                  this.$message.info('添加成功！')
                  this.visible = false;
                  this.$parent.loadRecordData();

                }else{
                  this.$message.info(res.message)
                }
                this.form.resetFields();
              }))
            }
          }
        });
      },

    }
  }
</script>
