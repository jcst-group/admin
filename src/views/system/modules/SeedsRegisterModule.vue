<template>
  <a-modal :title="title" v-model="visible" @ok="handleOk" style="top:10%;height: 90%" cancelText="取消" okText="确定"
           :maskClosable="false" class="standard-modal" @cancel='handelCancel'>
    <a-form :form='form'>
      <div class="form-wrapper">
        <a-form-item label='类型'>
          <a-select
            :placeholder="1111"
            v-decorator="[
            'type',
                {
                    initialValue:this.typeCode,
                    rules: [{ required: true, message: '请选择类型' }],
                }
            ]">
            <a-select-option v-for="item in seedTypeDatas" :key="item.code" :value='item.code'>
              {{item.displayName}}
            </a-select-option>
          </a-select>
        </a-form-item>
      </div>
      <div class="form-wrapper">
        <a-form-item label='品种名称'>
          <a-select
            v-decorator="[
              'cropId',
                {
                    initialValue:record.cropId,
                    rules: [{ required: true, message: '请选择品种名称' }],
                }
            ]">
            <a-select-option v-for="item in cropsDatas" :key="item.id" :value='item.id' @click="onChangeCrops(item.id)">
              {{item.cropName}}
            </a-select-option>
          </a-select>
        </a-form-item>
      </div>
      <div class="form-wrapper">
        <a-form-item label='是否自种'>
          <a-radio-group @change="onChangeRadio(v.code)" v-for="v in selfspeciesDatas" :key="v.code" v-model="valuRadio">
            <a-radio :value="v.code" :key="v.code">{{v.displayName}}</a-radio>
          </a-radio-group>
        </a-form-item>
      </div>
      <div class="form-wrapper" v-if="radioShow">
        <a-form-item label='采收批次'>
          <a-select
            :filterOption="filterBatch"
            :showSearch='true'
            :notFoundContent='recoveryContent ? "无匹配数据" : "请先选择品种名称"'
            v-decorator="[
              'recoveryId',
                {
                    initialValue:this.recoveryIds,
                    rules: [{ required: true, message: '请选择采收批次' }],
                }
            ]">
            <a-select-option v-for="item in recoveryCropDatas" :key="item.id" :value='item.id'>
              <div class='hide-name' style="color: rgba(0,0,0,0.4)">{{item.batchName}}</div>
              <div class="crop-text">{{item.recoveryCode}}</div>
            </a-select-option>
          </a-select>
        </a-form-item>
      </div>
      <div class="form-wrapper" v-if="!radioShow">
        <a-form-item label='采收批次'>
          <a-input disabled v-decorator="[
                    '',
                ]"/>
        </a-form-item>
      </div>
      <div class="form-wrapper">
        <a-form-item label='批次编号'>
          <a-input disabled placeholder="由系统自动生成" v-decorator="[
                    'seedCodes',
                    {
                       initialValue:record.seedCode,
                    }
                ]"/>
        </a-form-item>
      </div>
      <div class="form-wrapper">
        <a-form-item label='供应商'>
          <a-input placeholder="请输入50位以内任意字符" v-decorator="[
                    'supplier',
                    {
                        initialValue:record.supplier,
                        rules: [{
                        required: true, message: '请输入供应商名称',
                        }],
                    }
                ]"/>
        </a-form-item>
      </div>
      <div class="form-wrapper">
        <a-form-item label='采收日期'>
          <a-date-picker
            style="width: 236px;"
            v-decorator="[
                    'registrationTime',
                    {
            rules: [{ required: true, message: '请选择登记时间' }],
            initialValue:moment(this.registrationTime, 'YYYY-MM-DD')
          }
                  ]"
            @change="onChange"
          />
        </a-form-item>
      </div>
      <div id="textareas">
        <div class="form-wrapper" style="width: 100%">
          <a-form-item label='备注'>
            <a-textarea :autosize="{ minRows: 4, maxRows: 4}" placeholder="请输入200位以内任意字符" v-decorator="[
                    'remark',
                    {
                        initialValue:record.remark,
                    }
                ]"/>
          </a-form-item>
        </div>
      </div>
    </a-form>
  </a-modal>
</template>
<script>
  import { addSeedAdd,updateSeedAll,getSeedTypeEnum,getAllCrop,getSelfSpeciesEnum,getRecoveryByCropId} from '@/api/permissonApi'
  import ATextarea from "ant-design-vue/es/input/TextArea";
  import moment from 'moment';

  export default {
    components: {
      ATextarea
    },
    data() {
      return {
        recoveryIds:'',
        typeCode:'',
        recoveryCropDatas: [],
        cropsDatas: [],
        seedTypeDatas: [],
        selfspeciesDatas: [],
        radioShow: false,
        valuRadio: '1',
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
        registrationTime: '',
        dateString: '',
        selfSpecies:'',
        recoveryContent: false
      }
    },
    created() {
      this._getAllDatas()
    },
    methods: {
      filterBatch(val, node) {
        return node.componentOptions.children[0].children[0].text.indexOf(val) > -1 || node.componentOptions.children[1].children[0].text.indexOf(val) > -1
      },
      onChangeCrops(cropId,value) {
        if(value!=1){
          this.recoveryIds="";
        }
        this.form.resetFields("recoveryId");
        this.recoveryContent = true
        getRecoveryByCropId({cropId: cropId}).then(res => {
          if (res.success) {
            this.recoveryCropDatas = res.result;
          }
        })
      },
      onChangeRadio(code) {
        this.recoveryIds="";
        if (code == 'YES') {
          this.radioShow = true;
        } else {
          this.radioShow = false;
        }
        this.selfSpecies=code;
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
        this.registrationTime = this.form.getFieldsValue(['registrationTime']).registrationTime.format('YYYY-MM-DD');
      },
      onChange(date, dateString) {
        this.dateString = dateString;
      },
      _getAllDatas() {
        getSeedTypeEnum().then(res => {
          if (res.success) {
            this.seedTypeDatas = res.result;
          }
        })
        getAllCrop().then(res => {
          if (res.success) {
            this.cropsDatas = res.result;
          }
        })
        getSelfSpeciesEnum().then(res => {
          if (res.success) {
            this.selfspeciesDatas = res.result;
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
        this.visible = true
        this.form.resetFields()
        if (record !== undefined) {
          this.registrationTime=record.registrationTime;
          this.record = record;
          this.selfSpecies=this.valuRadio=this.record.selfSpecies.code;
          this.typeCode=record.type.code;
          this.recoveryIds=record.recoveryId;
          if (this.valuRadio == 'YES') {
            this.radioShow = true;
          } else {
            this.radioShow = false;
          }
          this.onChangeCrops(record.cropId,1);
        } else {
          this.typeCode='';
          this.valuRadio="1";
          this.radioShow=false,
          this.registrationTime = this.getNowFormatDate()
          this.record = {}
        }
      },
      handleOk() {
        if (this.title === '新增') {
          this.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
              const params = this.form.getFieldsValue();
              params.selfSpecies=this.selfSpecies;
              this.getTime();
              params.registrationTime=this.registrationTime;
              if(params.selfSpecies==''){
                this.$message.warn("请选择是否自种");
                return;
              }
              if(params.supplier.length>50){
                this.$message.warn("供应商名称不能超过50个字符");
                return;
              }
              if(params.remark){
                  if(params.remark.length>200){
                    this.$message.warn("备注不能超过200个字符");
                    return;
                  }
              }
              addSeedAdd(params).then(res => {
                this.$message.info(res.message)
                this.visible = false
                if (res.success) {
                  this.$parent._loadData()
                }
              })
            }
          })
        } else {
          this.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
              const params = this.form.getFieldsValue();
              params.selfSpecies=this.selfSpecies;
              this.getTime();
              params.registrationTime=this.registrationTime;
              if(params.selfSpecies==''){
                this.$message.warn("请选择是否自种");
                return;
              }
              if(params.supplier.length>50){
                this.$message.warn("供应商名称不能超过50个字符");
                return;
              }
              if(params.remark){
                if(params.remark.length>200){
                  this.$message.warn("备注不能超过200个字符");
                  return;
                }
              }
              params.id = this.record.id;
              updateSeedAll(params).then(res => {
                this.$message.info(res.message)
                this.visible = false
                if (res.success) {
                  this.$parent._loadData()
                }
              })
            }
          })
        }
      },
      handelCancel() {
        this.recoveryContent = false
        this.recoveryCropDatas = []
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

  .ant-input-number
    width: 200px

  .ant-modal-body
    padding: 12px

  .tab-box01 /deep/ .ant-form-item
    margin-bottom: 5px;

  .standard-modal /deep/ .ant-modal-body
    overflow-y: auto;
    max-height: 450px;

  #textareas /deep/ .ant-form-item-control-wrapper
    width 72%
</style>
