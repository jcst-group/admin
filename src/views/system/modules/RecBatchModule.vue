<template>
  <a-modal  :title="title" v-model="visible" @ok="handleOk" style="top:10%;height: 90%" cancelText="取消" okText="确定" :maskClosable="false" class="standard-modal"  @cancel="handelCancel">
    <a-form :form='form'>
      <div class="form-wrapper">
        <a-form-item label='种植批次'>
          <a-select disabled  v-decorator="[
                        'cropBatchId',
                            {
                                initialValue:this.cropBatchIds,
                                rules: [{ required: true, message: '请选择种植批次' }],
                            }
                        ]">
            <a-select-option v-for="item in batchDatas" :key="item.id" :value='item.id' @click="changeBatch(item.id)">
              {{item.batchName}}
            </a-select-option>
          </a-select>
        </a-form-item>
      </div>
      <div class="form-wrapper">
        <a-form-item label='作物品种'>
          <a-input disabled  placeholder="此信息为选择种植批次后自动带入" v-decorator="[
                    'cropId',
                    {
                        initialValue:this.cropAll.cropName,
                    }
                ]" />
        </a-form-item>
      </div>
      <div class="form-wrapper">
        <a-form-item label='采收品'>
          <a-select disabled v-decorator="[
                        'harvestedId',
                            {
                                initialValue:this.productid,
                                rules: [{ required: true, message: '请选择采收品' }],
                            }
                        ]">
            <a-select-option v-for="item in productsList" :key="item.id" :value='item.id'>
              {{item.type? item.type.displayName : null}}-{{item.harvestedName}}
            </a-select-option>
          </a-select>
        </a-form-item>
      </div>
      <div class="form-wrapper">
        <a-form-item label='采收日期'>
          <a-date-picker
          :disabled="status!='UNCODED'"
            style="width: 236px;"
            v-decorator="[
                    'harvestingTime',
                    {
            rules: [{ required: true, message: '请选择检测时间' }],
            initialValue:moment(this.harvestingTime, 'YYYY-MM-DD')
          }
                  ]"
            @change="onChange"
          />
        </a-form-item>
      </div>
      <div class="form-wrapper">
        <a-form-item label='单位'>
          <a-select :disabled="status!='UNCODED'" v-decorator="[
                        'unit',
                            {
                                initialValue:record.unit?record.unit.code:'',
                                rules: [{ required: true, message: '请选择采收单位' }],
                            }
                        ]">
            <a-select-option v-for="item in unitDatas" :key="item.code" :value='item.code' @click="changeUnit(item.displayName,item.code,item.radix,item.value)">
              {{item.displayName}}
            </a-select-option>
          </a-select>
        </a-form-item>
      </div>
    </a-form>
    <a-table
      :columns="familyColumnss"
      :dataSource="lotList"
      :loading="loading"
      :pagination='false'
      bordered
      v-if="isRecord"
    >
      <template slot='yield'>
        <div>
          <a-input-number :disabled="status!='UNCODED'"/>
        </div>
      </template>
      <template slot='unit'>
        <div>
            <span>{{units}}</span>
        </div>
      </template>
    </a-table>
    <a-table
      :columns="familyColumns"
      :dataSource="recoveryLotList"
      :loading="loading"
      :pagination='false'
      bordered
      rowKey="id"
      v-if="!isRecord"
    >
      <template slot='yield' slot-scope="text,record">
        <div>
          <a-input-number :disabled="status!='UNCODED'" v-model="record.yield" @blur="changeBlur(record.yield)"/>
        </div>
      </template>
      <template slot='unit'>
        <div>
          <span>{{units}}</span>
        </div>
      </template>
    </a-table>
  </a-modal>
</template>
<script>
  import { getAllCropBatchs,getRecoveryVo,addRecoveryBatch,updateRecoveryBatch,getUnitEnum } from '@/api/permissonApi'
  // import ATextarea from "ant-design-vue/es/input/TextArea";
  import moment from 'moment';
  export default {
    components: {
      // ATextarea
    },
    data() {
      return {
        unitvalue:'',
        unitradix:'',
        unitCode:'',
        isBlur:true,
        productid:'',
        isRecord:true,
        cropBatchIds:'',
        cropId:'',
        yieAll:0,
        lotId:'',
        codes:['1'],
        recoveryLotList:[],
        recoveryLotListChange:[],
        batchDatas: [],
        yies:'',
        units:'',
        cropAll:'',
        lotList:[],
        productsList:[],
        harvestingTime:'',
        dateString: '',
        familyDatas: [],
        loading: false,
        relationDatas: [],
        form: this.$form.createForm(this),
        unitDatas: [],
        cropDatas: [],
        stageDatas: [],
        categoryDatas: [],
        title: '',
        visible: false,
        status:'',
        record: {},
        familyColumns: [
          {
            title: '地块名称',
            dataIndex: 'lot.lotName',
            key: 'lot.lotName',
            scopedSlots: { customRender: "lot.lotName" },
            align: "center"
          },
          {
            title: '产量',
            dataIndex: 'yield',
            key: 'yield',
            width:'30%',
            scopedSlots: { customRender: "yield" },
            align: "center"
          },
          {
            title: '单位',
            dataIndex: 'unit',
            key: 'unit',
            scopedSlots: { customRender: "unit" },
            align: "center"
          },
        ],
        familyColumnss: [
          {
            title: '地块名称',
            dataIndex: 'lotName',
            key: 'lotName',
            scopedSlots: { customRender: "lotName" },
            align: "center"
          },
          {
            title: '产量',
            dataIndex: 'yield',
            key: 'yield',
            width:'30%',
            scopedSlots: { customRender: "yield" },
            align: "center"
          },
          {
            title: '单位',
            dataIndex: 'unit',
            key: 'unit',
            scopedSlots: { customRender: "unit" },
            align: "center"
          },
        ],
      }
    },
    created() {
      this._getAllDatas()
    },
    methods: {
      changeUnit(displayName,code,radix,value){
        this.units = displayName;
        this.unitCode = code;
        this.unitradix = radix;
        this.unitvalue = value;
      },
      handelCancel(){
        this.recoveryLotList=this.recoveryLotListChange
      },
      changeBlur(value){
        if(value==undefined){
          this.isBlur=false;
        }else{
          this.isBlur=true;
        }
      },
      ss(value){
        alert(value);
      },
      changUnit(){
        var unitAll = this.form.getFieldsValue(["unit"]);
        this.units = unitAll.unit;
      },
      changeBatch(batchId){
        this.cropAll='';
        this.cropId="";
        this.lotList=[];
        this.productsList=[];
        this.recoveryLotList=[];
        this.form.resetFields("harvestedId");
        let param={};
        param.batchId=batchId;
        this.loading=true;
        getRecoveryVo(param).then(res => {
          if(res.success) {
            if(res.result[0]){
              this.cropAll=res.result[0].crop;
              this.lotList=res.result[0].lotList;
              this.recoveryLotList=res.result[0].lotList;
              this.productsList=res.result[0].harvestedProductList;
              this.cropId = this.cropAll.id;
              this.loading=false;
            }
          }
        })
      },
      onChange(date, dateString) {
        this.dateString = dateString;
      },
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
      _getAllDatas() {
        getAllCropBatchs().then(res => {
          if(res.success) {
            this.batchDatas = res.result;
          }
        })
        getUnitEnum().then(res => {
          if(res.success) {
            this.unitDatas = res.result;
          }
        })
      },
      test(value, key, column) {
        this.familyLock = true
        const newData = [...this.familyDatas]
        const target = newData.filter(item => key === item.id)[0]
        if(target) {
          target.relation.code = value
          this.familyDatas = newData
        }
      },
      open(record) {
        this.status=record.status.code;
        if(this.status!='UNCODED'){
          this.$message.warning('已打码，不可编辑！')
        }
        this.lotList=[];
        this.visible = true
        this.form.resetFields()
        if(record !== undefined) {
          this.harvestingTime=record.harvestingTime;
          this.recoveryLotList=JSON.parse(JSON.stringify(record.recoveryLotList));
          this.recoveryLotListChange=JSON.parse(JSON.stringify(record.recoveryLotList));
          this.isRecord=false;
          this.record = record;
          if(record.cropBatch){
            this.cropBatchIds=record.cropBatch.id;
          }
          if(record.harvestedProduct){
            this.productid = record.harvestedProduct.id;
          }
          this.unitCode = record.unit.code;
          this.unitradix = record.unit.radix;
          this.unitvalue = record.unit.value;
          this.units=record.unit.displayName;
          this.cropAll=record.crop;
          let param={};
          param.batchId=this.cropBatchIds;
          this.loading=true;
          getRecoveryVo(param).then(res => {
            if(res.success) {
              if(res.result[0]){
                this.lotList=res.result[0].lotList;
                this.productsList=res.result[0].harvestedProductList;
                this.loading=false;
              }
            }
          })
        } else {
          this.productid="";
          this.cropBatchIds="";
          this.isRecord=true;
          this.productsList="";
          this.units="";
          this.record = {}
          this.harvestingTime=this.getNowFormatDate()
        }
      },
      handleOk() {
        if(this.status=='UNCODED'){
        this.yieAll=0;
        if(this.title === '新增') {
          this.form.validateFieldsAndScroll((err, values) => {
            if(!err) {
              const params = this.form.getFieldsValue()
              for (let i = 0; i < this.lotList.length; i++) {
                var yie =document.getElementsByClassName("ant-input-number-input")[i].value;
                if(yie==""){
                  this.$message.warn("产量不能为空");
                  this.recoveryLotList=[];
                  this.yieAll=0;
                  return;
                }
               /* this.recoveryLotList.push({lotId:this.lotList[i].id,yield:yie,unit:this.units});*/
                this.yieAll+=parseInt(yie);
              }
              params.cropId=this.cropAll.id;
              this.getTime();
              params.harvestingTime=this.harvestingTime;
              params.recoveryLotList=this.recoveryLotList;
              params.yield=this.yieAll;
              addRecoveryBatch(params).then(res => {
                this.$message.info(res.message)
                this.visible = false
                if(res.success) {
                  this.$parent._loadData()
                }
              })
            }
          })
        } else {
          if(this.isBlur==false){
            this.$message.warn("产量不能为空");
            return;
          }
          const params = this.form.getFieldsValue()
          for (let i = 0; i < this.recoveryLotList.length; i++) {
            var yie =document.getElementsByClassName("ant-input-number-input")[i].value;
            if(yie==""){
              this.$message.warn("产量不能为空");
              this.yieAll=0;
              return;
            }
           /* this.recoveryLotList.push({lotId:this.recoveryLotList[i].id,yield:yie,unit:this.units});*/
          }
          if(this.yieAll=0){
            this.$message.warn("产量不能为零或者空");
            return;
          }
          params.cropId=this.cropAll.id;
          this.getTime();
          params.harvestingTime=this.harvestingTime;
          for(var indexs = 0; indexs<this.recoveryLotList.length;indexs++){
            delete this.recoveryLotList[indexs].unit;
          }
          params.recoveryLotList=this.recoveryLotList;
          for(let index in this.recoveryLotList){
            this.yieAll+=parseInt(this.recoveryLotList[index].yield);
          }
          params.yield=this.yieAll;
          params.id = this.record.id
          updateRecoveryBatch(params).then(res => {
            this.$message.info(res.message)
            this.visible = false
            if(res.success) {
              this.$parent._loadData()
            }
          })
        }
        }else{
          this.visible=false;
        }
      },
      unique(arr) {
        const res = new Map();
        return arr.filter((arr) => !res.has(arr.id) && res.set(arr.id, 1))
      },
      openHukou() {
        this.$refs.hukouMessage.visible = true
        this.$refs.hukouMessage.curUid = this.curUid
        this.$refs.hukouMessage.form.resetFields()
      },
      getTime(){
        this.harvestingTime=this.form.getFieldsValue(['harvestingTime']).harvestingTime.format('YYYY-MM-DD');
      }
    }
  }
</script>
<style lang="stylus">
  .standard-modal
    width: 900px !important

    .form-wrapper
      width 45%
      display inline-block

      .ant-form-item
        width 100%
        display inline-block

        .ant-form-item-control-wrapper
          width 60%
          display inline-block

        .ant-form-item-label
          width 150px
          vertical-align top

  .ant-input-number
    width: 200px

  .ant-modal-body
    padding: 12px

  .tab-box01 /deep/ .ant-form-item
    margin-bottom: 5px;

  .standard-modal /deep/ .ant-modal-body
    overflow-y: auto;
    max-height: 450px;
</style>
