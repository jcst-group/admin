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
          label="基地"
          v-bind="formItemLayout"
          v-if="basesInit"
        >
          <a-select
            @change="initBatchsByBaseId"
            v-if="basesInit"
            v-decorator="[
          'baseId',
          {
            initialValue:record.baseId,
            rules: [{ required: true, message: '请选择基地' }],
          }
        ]"
          >
            <a-select-option v-for="v in bases" :key="v.id" :value="v.id">{{v.baseName}}</a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item
          label="批次"
          v-bind="formItemLayout"
          v-if="batchsInit"
        >
          <a-select
            v-decorator="[
          'batchId',
          {
            initialValue:record.batchId,
            rules: [{ required: true, message: '请选择批次' }],
          }
        ]"
          >
            <a-select-option v-for="v in batchs" :key="v.id" :value="v.id">{{v.batchName}}</a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item
          label="计划名称"
        >
          <a-input
            v-decorator="[
          'workOrderName',
          {
            initialValue:record.workOrderName,
            rules: [{
              required: true, message: '请输入批次名称',
            }]
          }
        ]"
          />
        </a-form-item>
        <a-form-item
          v-bind="formItemLayout"
          label="计划内容"
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

          label="开始时间"
        >
          <a-date-picker
            v-decorator="[
          'startTime',
          {rules: [{ required: true, message: '请输入开始时间' }],
          initialValue:moment(model.startTime, 'YYYY-MM-DD')}
        ]"
          />
        </a-form-item>

        <a-form-item

          label="结束时间"
        >
          <a-date-picker
            v-decorator="[
          'endTime',
          {rules: [{ required: true, message: '请输入开始时间' }],
          initialValue:moment(model.endTime, 'YYYY-MM-DD')}
        ]"
          />
        </a-form-item>


      </a-form>
    </a-modal>
  </div>
</template>
<script>
  import Vue from 'vue'
  import { addservice,addworklist,updateworklist } from '@/api/userApi'
  import { getCrops,queryAllBase ,selectByBaseId,getBlockByBaseId,  } from '@/api/allapi'
  import moment from 'moment';
  export default {
    data() {
      return {
        model:{
          startTime:'',
          endTime:'',
        },
        next:true,
        post:false,
        bases:{},
        batchs:[],
        initrecord:{
          baseId:null,
          batchId:null,
        },
        basesInit:true,
        batchsInit:false,
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

      initBatchsByBaseId(baseId){
        console.log("initBatchsByBaseId");
        this.batchsInit = false;
        selectByBaseId({baseId:baseId}).then((res=>{
          if(res.success==true){
            this.batchs = res.result;
            console.log("this.initrecord.baseId   this.record.baseId");
            console.log(this.initrecord.baseId +"   "+  this.record.baseId);
            if(this.initrecord.baseId!=baseId){
              console.log("initrecord.baseId!=this.record.baseId");
              this.record.batchId = undefined;
            }
          }else{
            this.$message.info(res.message)
          }
          this.batchsInit = true;
        }))
      },
      edit(record){
        //this.basesInit = false;
        console.log("hiden basesForm");
        /*queryAllBase().then((res)=>{
          if(res.success){
            this.bases = res.result;
          }else{
            this.$message.info(res.message)
          }
          this.basesInit = true;
          console.log("show basesForm");
          console.log(res);
        })*/

        if(record!= undefined && record.baseId!=undefined && record.baseId!=null ){
          console.log("initBatchsByBaseId 重新定义批次");
          this.initBatchsByBaseId(record.baseId);
        }


        this.model.startTime=this.getNowFormatDate();
        this.model.endTime=this.getNowFormatDate();
        this.form.resetFields();

        if(record!=undefined && record!=" "&& record.id!=undefined){
          this.model.startTime = record.startTime;
          this.model.endTime = record.endTime;
          this.record=record;
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
            //info.manType=this.sertype;
            //this.form.getFieldsValue(['startTime'])
            //info.positionType=this.serpost;
            info.endTime=info.endTime.format('YYYY-MM-DD');
            info.startTime=info.startTime.format('YYYY-MM-DD');
            console.log(info);
            let record = this.record;
            if(record.id!=undefined && record.id!=null && record.id!=""){
              info.id = record.id;
              updateworklist(info).then((res=>{
                if(res.success==true){
                  this.$message.info(res.message)
                  this.$parent.loadData();
                  this.visible = false;
                }else{
                  this.$message.info(res.message)
                }
                this.form.resetFields();
              }))
            }else{
              addworklist(info).then((res=>{
                if(res.success==true){
                  this.$message.info('添加成功！')
                  this.$parent.loadData();
                  this.visible = false;
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
