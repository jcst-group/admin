<template>
  <a-modal :title="title" v-model="visible" @ok="handleOk" style="top:5%;height: 90%" cancelText="取消" okText="确定"
           :maskClosable="false" class="standard-modal" @cancel="handelCancel">
    <a-tabs v-model="curKye">
      <a-tab-pane tab="初加工批次信息" key="1">
        <div id="batchModss">
          <a-form :form='form'>
            <div class="form-wrapper">
              <a-form-item label='初加工批次名称'>
                <a-input disabled placeholder="请输入初加工批次名称" v-decorator="[
                    'initialName',
                    {
                        initialValue:record.initialName,
                        rules: [{
                        required: true, message: '请输入初加工批次名称',
                        }],
                    }
                ]"/>
              </a-form-item>
            </div>
            <div class="form-wrapper">
              <a-form-item label='种植计划'>
                <a-select disabled v-decorator="[
                        'planId',
                            {
                                initialValue:record.plantingPlan ? record.plantingPlan.id : '',
                                rules: [{ required: true, message: '请选择种植计划' }],
                            }
                        ]">
                  <a-select-option v-for="item in cropDatas" :key="item.id" :value='item.id'
                                   @click="changeBatch(item.cropId,item.id)">
                    {{item.planName}}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </div>
            <div class="form-wrapper">
              <a-form-item label='作物品种'>
                <a-input disabled placeholder="此信息为选择种植方案后自动带入" v-decorator="[
                    'cropId',
                    {
                        initialValue:this.cropAllDate? this.cropAllDate.cropName : '',
                    }
                ]"/>
              </a-form-item>
            </div>
            <div class="form-wrapper">
              <a-form-item label='采收品'>
                <a-select disabled v-decorator="[
                        'harvestedProductId',
                            {
                                initialValue:record.harvestedProductId,
                                rules: [{ required: true, message: '请选择采收品' }],
                            }
                        ]">
                  <a-select-option v-for="item in harvestedAll" :key="item.id" :value='item.id'
                                   @click="changeHaves(item.id)">
                    {{item.type? item.type.displayName : null}}-{{item.harvestedName}}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </div>
            <div class="form-wrapper">
              <a-form-item label='初加工日期'>
                <a-date-picker
                  disabled
                  style="width: 236px;"
                  v-decorator="[
                    'initialProcessingTime',
                    {
            rules: [{ required: true, message: '请选择检测时间' }],
            initialValue:moment(this.initialProcessingTime, 'YYYY-MM-DD')
          }
                  ]"
                  @change="onChange"
                />
              </a-form-item>
            </div>
            <div class="form-wrapper" style="width: 80%">
              <a-form-item label='加工方法'>
                <a-checkbox-group  disabled :options="Options" v-model="value"/>
              </a-form-item>
            </div>
            <div id="textareas">
              <div class="form-wrapper" style="width: 100%">
                <a-form-item label='备注'>
                  <a-textarea disabled  style="height: 80px;min-height: 80px;" :autosize="{ minRows: 4, maxRows: 4 }"
                              placeholder="请输入200位以内任意字符" v-decorator="[
                    'content',
                    {
                        initialValue:record.content,
                    }
                ]"/>
                </a-form-item>
              </div>
            </div>
          </a-form>
        </div>
        <div id="textareass">
          <a-table
            :rowKey="record=>record.id"
            :columns="familyColumnss"
            :dataSource="recoveryPlanDates"
            :loading="loading"
            :pagination='false'
            bordered
          >
          </a-table>
        </div>
      </a-tab-pane>
      <a-tab-pane tab="初加工产成品" key="2" forceRender>
        <div>
          <a-table
            :rowKey="record=>record.id"
            :columns="familyColumnssAll"
            :dataSource="productHarvestDate"
            :loading="loading"
            :pagination='false'
            bordered
          >
            <template slot='yield' slot-scope="text,record">
              <div>
                <a-input-number :disabled="status!='UNCODED'" class="yield2" v-model="record.weightCount" @blur="changeBlur(record.weightCount)"/>
              </div>
            </template>
            <template slot='unit'>
              <div>
                <!--<a-input class="yield3" v-model="record.unit" @blur="changeBlurs(record.unit)"/>-->
                <a-select style="width: 100%" v-model="unitCode">
                  <a-select-option :disabled="status!='UNCODED'" v-for="item in unitDatas" :key="item.code" :value='item.code' @click="changeUnit(item.displayName,item.code)">
                    {{item.displayName}}
                  </a-select-option>
                </a-select>
              </div>
            </template>
          </a-table>
        </div>
      </a-tab-pane>
    </a-tabs>
    <InitBatchPiciModule ref="initBatchPiciModule" v-on:childByValue="childByValue"></InitBatchPiciModule>
  </a-modal>
</template>
<script>
  import {
    getPlantingAll,
    getIdAndNameById,
    getHarvestedByCropId,
    selectByCropId,
    getCropProductByHarvestedId,
    updateProbatchAll,
    getUnitEnum
  } from '@/api/permissonApi'
  import InitBatchPiciModule from "./InitBatchPiciModule";
  import ATextarea from "ant-design-vue/es/input/TextArea";
  import moment from 'moment';

  export default {
    components: {
      InitBatchPiciModule
    },
    data() {
      return {
        unitCode:'',
        proItemListChange:[],
        isBlur:true,
        isBlurs:true,
        cropAllDate:[],
        proItemList:[],
        methodIdsDate:[],
        recoveryPlanDates:[],
        recoveryLotList:[],
        initialProcessingTime:'',
        planId: '',
        harvestId: '',
        productHarvestDate: [],
        isSeedShow: true,
        value: [],
        Options: [],
        selectAll: [],
        productid: '',
        harvestedAll: [],
        status:'',
        cropAll: [],
        curKye: '1',
        isOpenpici: false,
        isOpenpicis: false,
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
        record: {},
        familyColumnss: [
          {
            title: '采收批次',
            dataIndex: 'recoveryCode',
            key: 'recoveryCode',
            width:'30%',
            align: "center"
          },
          {
            title: '基地名称',
            dataIndex: 'baseName',
            key: 'baseName',
            align: "center"
          },
          {
            title: '数量',
            dataIndex: 'yield',
            key: 'yield',
            align: "center",
            scopedSlots: { customRender: "yield" },
          },
          {
            title: '单位',
            dataIndex: 'unit.displayName',
            key: 'unit.displayName',
            align: "center"
          },
        ],
        familyColumnssAll: [
          {
            title: '产成品',
            dataIndex: 'proName',
            key: 'proName',
            align: "center"
          },
          {
            title: '等级',
            dataIndex: 'proLevel',
            key: 'proLevel',
            align: "center"
          },
          {
            title: '产量',
            dataIndex: 'weightCount',
            key: 'weightCount',
            width:'25%',
            align: "center",
            scopedSlots: { customRender: "yield" },
          },
          {
            title: '单位',
            dataIndex: 'unit',
            key: 'unit',
            width:'25%',
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
      changeBlur(value){
        if(value==undefined||value==''){
          this.isBlur=false;
        }else{
          this.isBlur=true;
        }
      },
      changeUnit(displayName,code){
        this.unitCode = code;
      },
      /*changeBlurs(value){
        if(value==undefined||value==''){
          this.isBlurs=false;
        }else{
          this.isBlurs=true;
        }
      },*/
      getYie(value){
        return 'yield'+value.toString();
      },
      childByValue: function (childValue) {
        if(this.recoveryPlanDates.length==0){
          this.recoveryPlanDates = childValue
        }else{
          this.recoveryPlanDates = this.recoveryPlanDates.concat(childValue);
        }
      },
      changeHaves(id) {
        this.recoveryPlanDates=[];
        this.isOpenpicis = true;
        this.harvestId = id;
        getCropProductByHarvestedId({harvestedId: id}).then(res => {
          if (res.success) {
            this.productHarvestDate = res.result;
            this.$nextTick(() => {
              this.isSeedShow = false;
            });
          }
        })
      },
      handelCancel() {
        this.curKye = '1';
        this.productHarvestDate=this.proItemListChange;
      },
      changeBatch(value,planId) {
        this.form.resetFields("harvestedProductId");
        this.productid = '';
        this.cropAll = [];
        this.harvestedAll = [];
        this.isOpenpici = true;
        this.isOpenpicis=false;
        this.planId = planId;
        getIdAndNameById({id: value}).then(res => {
          if (res.success) {
            this.cropAll = res.result;
            getHarvestedByCropId({cropId: this.cropAll.id}).then(res => {
              if (res.success) {
                this.harvestedAll = res.result;
              }
            });
            selectByCropId({cropId: this.cropAll.id}).then(res => {
              if (res.success) {
                this.Options = [];
                for (let i = 0; i < res.result.length; i++) {
                  let a = {};
                  a.label = res.result[i].processingName;
                  a.value = String(res.result[i].id);
                  this.Options.push(a);
                }
              }
            })
          }
        })
      },
      openPici() {
        if (this.isOpenpici == false) {
          this.$message.warn("请选择种植计划")
          return;
        }
        if (this.isOpenpicis == false) {
          this.$message.warn("请选择采收品")
          return;
        }
        this.$refs.initBatchPiciModule.title = '信息'
        this.$refs.initBatchPiciModule.open(this.planId,this.harvestId,this.recoveryPlanDates)
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
      getTime() {
        this.initialProcessingTime = this.form.getFieldsValue(['initialProcessingTime']).initialProcessingTime.format('YYYY-MM-DD');
      },
      onChange(date, dateString) {
        this.dateString = dateString;
      },
      _getAllDatas() {
        getPlantingAll().then(res => {
          if (res.success) {
            this.cropDatas = res.result;
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
        if (target) {
          target.relation.code = value
          this.familyDatas = newData
        }
      },
      open(record) {
        this.status=record.status.code;
        if(this.status!='UNCODED'){
          this.$message.warning('已打码，不可编辑！')
        }
        this.Options=[];
        this.value=[];
        this.visible = true
        this.form.resetFields()
        if (record !== undefined) {
          this.record = record;
          this.cropAllDate=this.record.crop;
          getHarvestedByCropId({cropId: record.cropId}).then(res => {
            if (res.success) {
              this.harvestedAll = res.result;
            }
          });
          this.unitCode=record.unit.code;
          this.initialProcessingTime=record.initialProcessingTime;
          this.recoveryPlanDates=record.recoveryList;
          this.productHarvestDate=JSON.parse(JSON.stringify(record.proItemList));
          this.proItemListChange=JSON.parse(JSON.stringify(record.proItemList));
          selectByCropId({cropId: record.cropId}).then(res => {
            if (res.success) {
              this.Options = [];
              for (let i = 0; i < res.result.length; i++) {
                let a = {};
                a.label = res.result[i].processingName;
                a.value = String(res.result[i].id);
                this.Options.push(a);
              }
              if (record.methodsList && record.methodsList.length > 0) {
                for (let i = 0; i < record.methodsList.length; i++) {
                  this.value.push(String(record.methodsList[i].id))
                }
              }
            }
          })
        } else {
          this.value=[];
          this.recoveryPlanDates=[];
          this.harvestId = '',
            this.planId = '',
            this.harvestedAll = [];
          this.cropAll = "";
          this.Options = [];
          this.isSeedShow = true;
          this.productHarvestDate = [];
          this.isOpenpici = false;
          this.isOpenpicis = false;
          this.initialProcessingTime = this.getNowFormatDate();
          this.record = {}
        }
      },
      handleOk() {
        if(this.status=='UNCODED'){
        if (this.title === '新增') {
          if (this.productHarvestDate == []) {
            this.$message.warn("暂无产成品,无法添加！")
            return;
          }
          this.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
              const params = this.form.getFieldsValue();
              params.methodIds = [];
              if(this.value.length==0){
                this.$message.warn("请选择加工方法")
                return;
              }
              for (let i = 0; i < this.value.length; i++) {
                /*let a = {};
                a.id = ;*/
                params.methodIds.push(parseInt(this.value[i]));
              }
              if(this.recoveryPlanDates.length==0){
                this.$message.warn("请添加采收批次信息")
                return;
              }
              var recBatch = []
              for(let index in this.recoveryPlanDates){
                recBatch.push(this.recoveryPlanDates[index].id);
              }
              params.recoveryBatchIds=recBatch;
              var yieAll = [];

              for (let i = 0; i < this.productHarvestDate.length; i++) {
                var yie =document.getElementsByClassName('yield02')[i].__vue__._data.inputValue;
                if(yie==undefined||yie==''){
                  this.$message.warn("产量不能为空");
                  yieAll=[];
                  return;
                }
                yieAll.push(yie);
              }

              for (let i = 0; i < this.productHarvestDate.length; i++) {
                var unit = document.getElementsByClassName('yield03')[i]._value;
                if(unit==""){
                  this.$message.warn("单位不能为空");
                  this.proItemList=[];
                  return;
                }
                this.proItemList.push({proName:this.productHarvestDate[i].productName,proLevel:this.productHarvestDate[i].level,weightCount:yieAll[i],unit:unit});
              }
              params.proItemList=this.proItemList;
              params.cropId=this.cropAll.id;
              this.getTime();
              params.initialProcessingTime=this.initialProcessingTime;
              addProbatch(params).then(res => {
                this.$message.info(res.message)
                this.visible = false
                if (res.success) {
                  this.$parent._loadData()
                }
              })
            }
          })
        } else {
          var gross = 0;
          for(let index in this.recoveryPlanDates){
            var weights = this.recoveryPlanDates[index].unit.radix *  this.recoveryPlanDates[index].yield;
            gross += weights;
          }
          this.proItemList=[];
          if(this.isBlur==false){
            this.$message.warn("产量不能为空");
            return;
          }
          /*if(this.isBlurs==false){
            this.$message.warn("单位不能为空");
            return;
          }*/
          var yieAll = [];
          var yield1=0;
          for (let i = 0; i < this.productHarvestDate.length; i++) {
            var yie =document.getElementsByClassName('yield2')[i].__vue__._data.inputValue;
            if(yie==undefined||yie==''){
              this.$message.warn("产量不能为空");
              yieAll=[];
              return;
            }
            yieAll.push(yie);
          }
           /*yield1=yieAll.reduce(function(previousValue, currentValue, index, array){
                return Number(previousValue) + Number(currentValue);
           });*/
          yield1 = eval(yieAll.join("+"));
          for (let i = 0; i < this.productHarvestDate.length; i++) {
            /*var unit = document.getElementsByClassName('yield3')[i]._value;
            if(unit==""){
              this.$message.warn("单位不能为空");
              this.proItemList=[];
              return;
            }*/
            this.proItemList.push({proName:this.productHarvestDate[i].proName,proLevel:this.productHarvestDate[i].proLevel,weightCount:yieAll[i],unit:this.unitCode});
          }
          var params={};
          params.proItemList=this.proItemList;
          params.id = this.record.id;
          params.yield=yield1;
          params.unit=this.unitCode;
          var yield2 = 0;
          if(this.unitCode=="G"){
            yield2 = yield1/1000
          }else{
            yield2 = yield1
          }
          if(gross<yield2){
            this.$message.warn("初加工重量不能超过采收重量!");
            return;
          }
          updateProbatchAll(params).then(res => {
            this.$message.info(res.message)
            this.visible = false
            this.curKye = '1'
            if (res.success) {
              this.$parent._loadData()
            }
          })
        }
        }else{
          this.visible=false;
        }
      },
      openHukou() {
        this.$refs.hukouMessage.visible = true
        this.$refs.hukouMessage.curUid = this.curUid
        this.$refs.hukouMessage.form.resetFields()
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
    width 200px

  .ant-modal-body
    padding 12px

  .standard-modal /deep/ .ant-modal-body
    overflow-y auto
    max-height 517px !important

  #textareas /deep/ .ant-form-item-control-wrapper
    width 72%

  #batchModss /deep/ .ant-form-item
    margin-bottom: 7px !important;
</style>
