<template>
  <div>
    <a-modal
      :title="title"
      v-model="visible"
      @ok="handleOk"
      @cancel='handlleCancel'
      style="top:5%;height: 90%;"
      cancelText="取消"
      :okText="okText"
      :maskClosable="false"
      class="batch-modal">
      <a-form
        class="test"
        :form="form">
        <div class="form-wrapper">
          <a-form-item
            label="批次名称">
            <a-input
              v-if="isedit"
              v-decorator="[
                'batchName',
                {
                  initialValue:record.batchName,
                  rules: [{
                    required: true,message:'批次名称不能为空',
                  }]
                }
              ]"
            />
            <template v-if="!isedit">{{record.batchName}}</template>
          </a-form-item>
        </div>
        <div class="form-wrapper">
          <a-form-item
            label="种植品种">
            <a-select
              @change="changeCrop"
              v-if="isedit"
              v-decorator="[
                'cropId',
                {
                  initialValue:record.crop || this.curName ? this.curName : '',
                  rules: [{
                    required: true, message:'种植品种不能为空',
                  }]
                }
              ]"
            >
              <a-select-option 
                v-for="item in cropDatas"
                :key="item.id"
                :value='item.id'>
                {{item.cropName}}
              </a-select-option>
            </a-select>
            <template v-if="!isedit">{{record.crop.cropName}}</template>
          </a-form-item>
        </div>
        <div class="form-wrapper">
          <a-form-item
            label="种植计划">
            <a-select
              v-if="isedit"
              placeholder="请先选择种植品种"
              v-decorator="[
                'planId',
                {
                  initialValue:record.plantingPlan ? record.plantingPlan.planName : undefined,
                  rules: [{
                    required: true, message:'种植计划不能为空',
                  }]
                }
              ]"
            >
              <a-select-option 
                v-for="item in planDatas"
                :key="item.id"
                :value='item.id'>
                {{item.planName}}
              </a-select-option>
            </a-select>
            <template v-if="!isedit">{{record.plantingPlan ? record.plantingPlan.planName : ''}}</template>
          </a-form-item>
        </div>
        <!-- <div class="form-wrapper">
          <a-form-item
            label="种子批次">
            <a-select
              v-if="isedit"
              placeholder="请先选择种植品种"
              :filterOption="filterBatch"
              :showSearch='true'
              v-decorator="[
                'seedBatchId',
                {
                  initialValue:record.seedBatch ? record.seedBatch.seedCode : undefined,
                  rules: [{
                    required: true, message:'种子批次不能为空',
                  }]
                }
              ]"
            >
              <a-select-option
                v-for="item in cropBatchs"
                :key="item.id"
                :value='item.id'>
                <div class='hide-name' style="color: rgba(0,0,0,0.4)">{{item.batchName ? item.batchName : '非自种'}}</div>
                <div class="crop-text">{{item.seedCode}}</div>
              </a-select-option>
            </a-select>
            <template v-if="!isedit">{{record.batchName}}</template>
          </a-form-item>
        </div> -->
        <div class="form-wrapper">
          <a-form-item
            label="基地">
            <a-select
              v-if="isedit"
              @change="handleBaseChange"
              @search='searchBase'
              @focus='focusSelect'
              @inputKeydown='getNewBase'
              :filterOption="false"
              :showSearch='true'
              :notFoundContent="fetching ? undefined : '无匹配数据'"
              v-decorator="[
                'baseId',
                {
                  initialValue:record.baseId,
                  rules: [{ required: true, message: '请选择基地' }],
                }
              ]"
            >
              <a-spin v-if="fetching" slot="notFoundContent" size="small"/>
              <a-select-option v-for="v in bases" :key="v.id" :value="v.id">{{v.baseName}}</a-select-option>
            </a-select>
            <template v-if="!isedit">{{curBase}}</template>
          </a-form-item>
        </div>
        <div class="form-wrapper">
          <a-form-item
            label="地块">
              <a-select
                v-if="isedit"
                @change="handleChangeLot"
                placeholder="请先选择基地"
                mode="multiple"
                v-decorator="[
                  'lots',
                  {
                    initialValue:this.record.lotsId ? this.record.lotsId : undefined,
                    rules: [{ required: true, message: '请选择地块' }],
                  }
                ]"
              >
                <a-select-option v-for="v in blocks" :key="v.id" :value="v.id">{{v.lotName}}</a-select-option>
              </a-select>
              <template v-if="!isedit">
                <!-- <span v-for="item in record.lotList" :key="item.id">
                  {{item.lotName}}
                </span> -->
                <a-tooltip placement='topLeft'>
                  <template slot='title'>
                    <div v-for="item in record.lotList" :key="item.id" style="white-space: nowrap">
                      {{item.lotName}}
                    </div>
                  </template>
                  <span v-for="(item,index) in record.lotList" :style="{display: index < 5 ? 'inline' : 'none'}" :key="item.id">
                    {{item.lotName}}
                  </span>
                  <span v-if="record.lotList.length > 5">…</span>
                </a-tooltip>
              </template>
          </a-form-item>
        </div>
        <div class="form-wrapper">
            <div
              v-if="isedit"
              style="width:100%;text-align:right;position: relative;top: 6px;"
              :class="{'wrapper-error': this.dateLock}"
            >
              <label class="ant-form-item-required" title="开始年份" style="margin-right:4px">
                开始年份:
              </label>
              <DatePicker 
                style="width: 234px;"
                :class="{'pick-date': this.dateLock}"
                :value='curDate'
                @on-change='changeDate'
                v-if="isedit"
                type="year" 
                placeholder="请选择开始年份">
              </DatePicker>
              <span v-if="this.dateLock" class="date-error">请选择开始年份</span>
            </div>
            <template v-if="!isedit">
              <label title="开始年份" style="color:rgba(0, 0, 0, 0.85);margin-left: 80px;">
                开始年份：
              </label>
              {{record.startYear}}
            </template>
        </div>
        <!-- <div class="form-wrapper">
          <a-form-item
            label="预估亩产量（公斤）">
            <a-input-number
              v-if="isedit"
              style="width:100%"
              :max="200000000"
              v-decorator="[
                'projectedMuYield',
                {
                  initialValue:record.projectedMuYield,
                  rules: [{
                    required:true, message: '请输入预计产量'
                  }]
                }
              ]"
            />
            <template v-if="!isedit">{{record.projectedMuYield}}</template>
          </a-form-item>
        </div> -->
      </a-form>
      <a-table
          v-show="showTable"
          class='batch-modal-table'
          :columns="batchColumns"
          :dataSource="dataSource"
          :pagination="false"
          :loading="loading"
          :rowKey="record => record.lotId"
          :scroll="{y: 300 }"
          bordered>
          <template slot="scale" slot-scope="text, record">
              <a-input-number @change="val => changeScale(val, record)" style="width: 100%" :value='text'/>
          </template>
      </a-table>
    </a-modal>
  </div>
</template>
<script>
  import {queryAllBase, batchAdd,getBlockByBaseId, batchUpdate,getAllPlan,getAllBatch,getSeedAndBatch,getPlanDatas,getLotScale } from '@/api/allapi'

  export default {
    props: {
      cropDatas: {
        default() {
          return []
        }
      }
    },
    data() {
      return {
        isedit: true,
        dateLock: false,
        curDate: null,
        bases:[],
        fetching: false,
        curValue: '',
        timer: '',
        blocks:[],
        record:{},
        initrecord:{
          baseId:null,
          cropId:null,
        },
        visible: false,
        planDatas: [],
        cropBatchs: [],
        title:"",
        okText:"",
        curName: '',
        form: this.$form.createForm(this),
        calId: '',
        lots: [],
        curCropId: '',
        loading: false,
        dataSource: [],
        batchColumns: [
          {
            title: '地块名称',
            dataIndex: 'lotName',
            key: 'lotName',
            width: 272
          },
          {
            title: '品种',
            dataIndex: 'cropName',
            key: 'cropName',
            width: 108
          },
          {
            title: '规模',
            dataIndex: 'scale',
            key: 'scale',
            scopedSlots: { customRender: "scale" },
            width: 369
          },
          {
            title: '单位',
            dataIndex: 'unit',
            key: 'unit'
          },
        ]
      }
    },
    computed: {
      curBase() {
        let base = ''
        if (this.bases.length > 0) {
          this.bases.forEach(item => {
            if (item.id === this.record.baseId) {
              base = item.baseName
            }
          })
        }
        return base
      },
      showTable() {
        let flag = this.lots.length > 0 && this.curCropId && this.calId
        if (flag) {
          getLotScale({
            lots: this.lots,
            cropId: this.curCropId,
            calId: this.calId
          }).then(res => {
            if (res.success) {
              this.dataSource = res.result
            }
          })
        }
        return flag
      }
    },
    methods: {
      filterBatch(val, node) {
        return node.componentOptions.children[0].children[0].text.indexOf(val) > -1 || node.componentOptions.children[1].children[0].text.indexOf(val) > -1
      },
      changeScale(val, record) {
        record.scale = val
      },
      changeCrop(value) {
        this.form.setFieldsValue({seedBatchId: '', planId: ''})
        let index = this.cropDatas.findIndex(item => item.id === value)
        this.curCropId = value
        this.calId = this.cropDatas[index].calId
        getPlanDatas({
          cropId: value,
          calId: this.calId
        }).then(res => {
          if (res.success) {
            this.planDatas = res.result
          } else {
            this.$message.info(res.message)
          }
        })
        // getSeedAndBatch({
        //   cropId: value
        // }).then(res => {
        //   if(res.success){
        //     this.cropBatchs = res.result;
        //   }else{
        //     this.$message.info(res.message)
        //   }
        // })
      },
      handleChangeLot(value, option) {
        this.lots = [...value]
      },
      add(){
        this.record = this.initrecord;
        this.title = "添加";
        this.okText = "确认添加";
        this.edit();
      },
      edit(record){
        queryAllBase().then((res)=>{
          if(res.success){
            this.bases = res.result;
          }else{
            this.$message.info(res.message)
          }
        })
        if (!this.isedit) {
          this.record = record
          this.visible = true
          return
        }
        this.cropBatchs = []
        if (record && record.startYear) {
          this.curDate = String(record.startYear)
        }
        this.form.resetFields();
        if(record != " " && record != undefined){
          this.record = record;
          if (record.crop) {
            this.curName = record.crop.cropName
          }
          if(record.baseId != undefined && record.baseId != null){
            let params = {
              baseId: record.baseId,
              batchId: record.id
            }
            this.getBlocksByBId(params);
          }else{
            this.record.lotList = [];
          }
          let lots = this.record.lotList;
          if(lots.length>0){
            let lotsId = [];
            for(let i=0;i<lots.length;i++){
              lotsId.push(lots[i].id);
            }
            this.record.lotsId = lotsId
          }
          if (record.cropId) {
            getSeedAndBatch({
              cropId: record.cropId
            }).then(res => {
              if(res.success){
                this.cropBatchs = res.result;
              }else{
                this.$message.info(res.message)
              }
            })
          }
          this.lots = record.lotsId
          this.curCropId = record.crop ? record.crop.id : ''
          this.calId = record.crop ? record.crop.calId : ''
          this.title="编辑";
          this.okText="确认修改";
        }
        this.visible = true
      },
      handleBaseChange(value){
        this.record.lotsId=[];
        this.lots = []
        this.form.setFieldsValue({
          lots: []
        })
        let params = {
          baseId: value
        }
        if (this.record.id) {
          params.batchId = this.record.id
        }
        this.getBlocksByBId(params);
      },
      getBlocksByBId(params){
        getBlockByBaseId(params).then((res)=>{
          if(res.success){
            let blocks = res.result;
            if(blocks.length==0){
              this.$message.info("该基地无地块，请先前往基地管理创建该基地的地块。")
            }
            this.blocks = res.result;
          }
        })
      },
      handleOk(){
          this.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
              if (!this.curDate) {
                return
              }
              const info=this.form.getFieldsValue();
              this.cropDatas.forEach(item => {
                if (info.cropId === item.cropName) {
                  info.cropId = item.id
                }
              })
              let changeLot = [...info.lots]
              for (let i = 0; i < changeLot.length; i++) {
                let index = changeLot[i]
                changeLot[i] = {
                  id: index
                }
              }
              if (typeof info.startYear !== 'number') {
                info.startYear = parseInt(info.startYear)
              }
              info.lotList = changeLot
              let record = this.record;
              if(record.id){
                // info.baseId = info.baseId.value
                info.startYear = this.curDate ? this.curDate : record.startYear
                info.id = record.id;
                info.lotCalRelList = this.dataSource.map(item => {
                  item.calId = this.calId
                  return item
                })
                if (this.dataSource.some(item => {
                  return item.scale !== 0 && !item.scale
                })) {
                  return this.$message.warn('请将所有规模填写完整')
                }
                if (typeof info.planId !== 'number') {
                  info.planId = record.planId
                }
                if (typeof info.seedBatchId !== 'number') {
                  delete info.seedBatchId
                }
                batchUpdate(info).then((res=>{
                  this.$message.info(res.message)
                  if(res.success==true){
                    this.curName = ''
                    this.curDate = null
                    this.dateLock = false
                    this.$parent._loadData();
                    this.visible = false;
                    this.form.resetFields();
                    this.lots = []
                    this.curCropId = ''
                    this.calId = ''
                  }
                }))
              } else {
                info.startYear = this.curDate
                // info.baseId = info.baseId.value
                info.lotCalRelList = this.dataSource.map(item => {
                  item.calId = this.calId
                  return item
                })
                batchAdd(info).then((res=>{
                  if(res.success==true){
                    this.curName = ''
                    this.curDate = null
                    this.dateLock = false
                    this.$message.info('添加成功！')
                    this.$parent._loadData();
                    this.visible = false;
                    this.form.resetFields();
                    this.lots = []
                    this.curCropId = ''
                    this.calId = ''
                  }else{
                    this.$message.info(res.message)
                  }
                }))
              }
            }
          });
          if (!this.curDate) {
            this.dateLock = true
          }
      },
      handlleCancel() {
        this.curName = ''
        this.isedit = true
        this.curDate = null
        this.dateLock = false
        this.blocks = []
        this.lots = []
        this.curCropId = ''
        this.calId = ''
      },
      focusSelect() {
        queryAllBase().then((res)=>{
            if(res.success){
                this.bases = res.result;
            } else {
                this.$message.info(res.message)
            }
        })
      },
      searchBase(value) {
          this.curValue = value
      },
      getNewBase() {
          this.bases = []
          this.fetching = true
          clearTimeout(this.timer)
          this.timer = setTimeout(() => {
              queryAllBase({
                  baseName: this.curValue
              }).then((res)=>{
                  this.fetching = false
                  if(res.success){
                      this.bases = res.result
                  } else {
                      this.$message.info(res.message)
                  }
              })
          }, 800)    
      },
      checkPrice  (rule, value, callback) {
        if (value.value && (value.value > 0 || value.value.length)) {
          callback();
          return;
        }
        callback('请选择基地');
      },
      changeDate(date) {
        this.curDate = date
        this.dateLock = false
      }
    }
  }
</script>
<style lang="stylus">
  .batch-modal
    width: 900px !important
    .form-wrapper
        width 45%
        display inline-block
        .ant-select-selection-selected-value
          .hide-name
            display: none
        .ant-form-item
            width 100%
            display inline-block
            .ant-form-item-control-wrapper
                width 60%
                display inline-block
            .ant-form-item-label
                width 150px
                vertical-align top
    .wrapper-error
      margin-top 10px
      position relative
      .pick-date
        .ivu-input
          border-color #f5222d
      .date-error
        color #f5222d
        line-height 16px
        display inline-block
        position absolute
        left 150px
        top 40px
    .batch-modal-table
      margin-top 30px
</style>
