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
          label="批次"
          v-bind="formItemLayout"
          v-if="basesInit"
        >

          <a-tree-select
            :dropdownStyle="{ maxHeight: '400px', overflow: 'auto' }"
            placeholder='请选择批次'
            :treeData="treeData"
            @change="initWorkOrder"
            @treeExpand="treeExpand"

            v-decorator="[
          'batchId',
          {
            initialValue:record.batchId,
            rules: [{ required: true, message: '请选择批次' }],
          }
        ]"
          >
          </a-tree-select>

        </a-form-item>

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
        console.log(this.initrecord);
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
      treeExpand(e){
        console.log("treeExpand");
        console.log(e);
        if(e.length>0){
          let key = e[e.length-1];
          let splits = key.split("-");
          console.log(splits);
          let type = splits[0];
          let relateId = splits[1];
          selectByBaseId({baseId:relateId}).then((res=>{
            if(res.success==true){
              let batchs = res.result;
              let childs = [];
              for(let i=0;i<batchs.length;i++){
                let item = batchs[i];
                let child = {};
                child.title = item.batchName;
                child.key = "batch"+"-"+item.id;
                child.value = item.id;
                child.isLeaf = true;
                childs.push(child);
              }
              for(let i=0;i<this.treeData.length;i++){
                if(this.treeData[i].value== Number(relateId)){
                  this.treeData[i].children = childs;
                }
              }
              this.treeData = [...this.treeData]
              console.log("expand this.treeData",this.treeData);
            }else{
              this.$message.info(res.message)
            }
          }))
        }

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
        this.treeData = [];
        getBatchCount({}).then((res)=>{
          if(res.success){
            let bases = res.result;
            this.bases = bases;
            let treeData=[];
            for(let i=0;i<bases.length;i++){
              let item = bases[i];
              if(item.num>0){
                let dataitem = {};
                dataitem.title=item.baseName;
                dataitem.key="bases"+"-"+item.baseId;
                dataitem.value=item.baseId;
                dataitem.isLeaf = false;
                dataitem.selectable = false;
                this.treeData.push(dataitem);
              }
            }
          }else{
            this.$message.info(res.message)
          }
          console.log(res);
        })




        this.model.startTime=this.getNowFormatDate();
        this.model.endTime=this.getNowFormatDate();
        this.form.resetFields();

        let recordExist = record!=undefined && record!=""&& record.id!=undefined;
        let selectExist = this.initrecord.baseId!=null && this.initrecord.batchId!=null;
        if(recordExist){
          this.model.startTime = record.startTime;
          this.model.endTime = record.endTime;
          this.record=record;
          console.log(record);
          this.title="编辑";
          this.okText="确认修改";
          this.post=false;
          let relateId = record.batch.baseId;
          let that = this;
          selectByBaseId({baseId:relateId}).then((res=>{
            if(res.success==true){
              let batchs = res.result;
              console.log(batchs);
              let childs = [];
              for(let i=0;i<batchs.length;i++){
                let item = batchs[i];
                let child = {};
                child.title = item.batchName;
                child.key = "batch"+"-"+item.id;
                child.value = item.id;
                child.isLeaf = true;
                childs.push(child);
              }
              for(let i=0;i<that.treeData.length;i++){
                if(that.treeData[i].value== Number(relateId)){
                  that.treeData[i].children = childs;
                }
              }
              that.treeData = [...that.treeData]
              console.log(that.treeData);
            }else{
              this.$message.info(res.message)
            }

          }))

          let batchId = record.batch.id;
          selectWorkOrderByBatchId({batchId:batchId}).then((res=>{
            if(res.success==true){
              that.orders = res.result;
              /* if(this.initrecord.relationId!=batchId){
                 console.log("initrecord.baseId!=this.record.baseId");
                 this.record.relationId = undefined;
               }*/
            }else{
              this.$message.info(res.message)
            }
          }))


        }else if(selectExist){
          console.log("批次已被选择，所以通过批次，刷新add的时候的选项");
          let relateId = this.initrecord.baseId;
          let that = this;
          selectByBaseId({baseId:relateId}).then((res=>{
            if(res.success==true){
              let batchs = res.result;
              console.log(batchs);
              let childs = [];
              for(let i=0;i<batchs.length;i++){
                let item = batchs[i];
                let child = {};
                child.title = item.batchName;
                child.key = "batch"+"-"+item.id;
                child.value = item.id;
                child.isLeaf = true;
                childs.push(child);
              }
              for(let i=0;i<that.treeData.length;i++){
                if(that.treeData[i].value== Number(relateId)){
                  that.treeData[i].children = childs;
                }
              }
              that.treeData = [...that.treeData]
              console.log(that.treeData);
            }else{
              this.$message.info(res.message)
            }

          }))

          let batchId = this.initrecord.batchId;
          selectWorkOrderByBatchId({batchId:batchId}).then((res=>{
            if(res.success==true){
              that.orders = res.result;
              /* if(this.initrecord.relationId!=batchId){
                 console.log("initrecord.baseId!=this.record.baseId");
                 this.record.relationId = undefined;
               }*/
            }else{
              this.$message.info(res.message)
            }
          }))
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
            //info.manType=this.sertype;
            //this.form.getFieldsValue(['startTime'])
            //info.positionType=this.serpost;
            /*info.endTime=info.endTime.format('YYYY-MM-DD');
            info.startTime=info.startTime.format('YYYY-MM-DD');*/
            info.startTime = startTime;
            info.endTime = endTime;
            let record = this.record;
            if(record.id!=undefined && record.id!=null && record.id!=""){
              info.id = record.id;
              farmingRecordUpdate(info).then((res=>{
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
              farmingRecordInsert(info).then((res=>{
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
