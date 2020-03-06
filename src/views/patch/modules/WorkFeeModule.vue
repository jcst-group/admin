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
      @cancel='() => {this.selects = ""}'
    >

      <a-form
        :form="form"
      >

        <a-form-item label="费用类型">
          <!-- <a-tree-select
            allowClear
            treeDefaultExpandAll
            placeholder='请选择费用类型'
            :dropdownStyle="{ maxHeight: '260px', overflow: 'auto' }"
            @change="selectType"
            @select='makeFee'
            v-decorator="[
                  'costType',
                  {
                    initialValue:fee.costType,
                    rules: [{ required: true, message: '请选择费用类型' }],
                  }
                ]" 
          >
            <a-tree-select-node value='人工费用' title="人工费用" key="0-1" disabled ref="labour">
              <a-tree-select-node v-for="v in this.labourFeeType" :title="v.labourCostName" :key="v.id" :value="v.labourCostName"></a-tree-select-node>
            </a-tree-select-node>
            <a-tree-select-node value='用药费用' title="用药费用" key="1-1" disabled>
              <a-tree-select-node v-for="(v,i) in this.pesticidesFeeType" :title="v.pesticidesName" :key="i" :value="v.pesticidesName"></a-tree-select-node>
            </a-tree-select-node>
            <a-tree-select-node value='施肥费用' title="施肥费用" key="2-1" disabled>
              <a-tree-select-node v-for="(v,i) in this.manuresFeeType" 
              :title="v.name" :key="i" :value="v.name" disabled>
                <a-tree-select-node v-for="ele in v.children" :title="ele.name" :key="ele.id" :value="ele.name === '磷酸二氢钾' && ele.id === 304 ? '钾肥磷酸二氢钾': ele.name"></a-tree-select-node>
              </a-tree-select-node>
            </a-tree-select-node>
          </a-tree-select> -->
          <a-select
            :allowClear='true'
            style="width: 100%"
            v-if="this.feeType === 'labour'"
          >
            <a-select-option v-for="(item, index) in this.feeData" :key="index">{{item.labourCostName}}</a-select-option>
          </a-select>
          <a-select
            :allowClear='true'
            style="width: 100%"
            v-else-if="this.feeType === 'pesticides'"
          >
            <a-select-option v-for="(item, index) in this.feeData" :key="index">{{item.pesticidesName}}</a-select-option>
          </a-select>
          <a-select
            :allowClear='true'
            style="width: 100%"
            v-else
          >
            <a-select-option v-for="(item, index) in this.feeData" :key="index">{{item.name}}</a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item
          v-show="this.selects === '数量'"
          label="用量"
        >
          <a-input
            v-decorator="[
          'dosage',
          {
            initialValue:fee.dosage,
            rules: [{
              required: this.selects === '数量', message: '请输入用量',
            }]
          }
        ]"
          />
        </a-form-item>

        <a-form-item
          :label="this.selects"
          v-show="this.selects === '数量'"
        >
          <a-input
            v-decorator="[
          'costNum',
          {
            initialValue:fee.costNum,
            rules: [{
              required: this.selects === '数量', message: '请输入数量',
            }]
          }
        ]"
          />
        </a-form-item>

        <a-form-item
          :label="this.selects"
          v-show="this.selects === '人数'"
        >
          <a-input
            v-decorator="[
          'costName',
          {
            initialValue:fee.costName,
            rules: [{
              required: this.selects === '人数', message: '请输入人数',
            }]
          }
        ]"
          />
        </a-form-item>

        <a-form-item
          :label="this.selects === '人数' ? '单价（元/人/天）' : '单价（元）'"
        >
          <a-input
            v-decorator="[
          'costAmount',
          {
            initialValue:fee.costAmount,
            rules: [{
              required: true, message: '请输入金额',
            }]
          }
        ]"
          />
        </a-form-item>

      </a-form>
    </a-modal>
  </div>
</template>
<script>
  import Vue from 'vue'
  import { addservice, getLabourCostName, getPesticidesCostName, getManuresCostName} from '@/api/userApi'
  import { insertLabourCost, insertPesticidesCost, insertManuresCost, updatelabourCost, updatepesticidesCost, updatemanureCost} from '@/api/allapi'

  export default {
    data() {
      return {
        feeType: '',
        feeName: '',
        feeData: [],
        labourFeeType: [],
        pesticidesFeeType: [],
        manuresFeeType: [],
        selects: '',
        recordId:undefined,
        fee:{},
        loading: false,
        visible: false,
        title:"",
        okText:"",
        formItemLayout: {

        },
        form: this.$form.createForm(this),
      }
    },
    mounted() {
      this._getALLFeeName()
    },
    methods: {
      _getALLFeeName() {
        getLabourCostName().then(res => {
          if (res.success) {
            this.labourFeeType = res.result
          } else {
            return
          }
        })
        getPesticidesCostName().then(res => {
          if (res.success) {
            this.pesticidesFeeType = res.result
          } else {
            return
          }
        })
        getManuresCostName().then(res => {
          if (res.success) {
            this.manuresFeeType = res.result
          } else {
            return
          }
        })
      },

      add(item){
        if (item === 'labour') {
          this.feeData = this.labourFeeType
          this.feeType = 'labour'
        } else if (item === 'pesticides') {
          this.feeData = this.pesticidesFeeType
          this.feeType = 'pesticides'
        } else {
          this.feeType = 'manure'
          this.feeData = this.manuresFeeType
        }
        this.title="添加";
        this.okText="确认添加";
        this.edit(item);
      },

      // selectType(val) {
      //   if (!val) {
      //     return
      //   }
      //   this.feeName = val
      //   if (val.indexOf('人工费用') > -1) {
      //     this.selects = '人数'
      //   } else {
      //     this.selects = '数量'
      //   }
      // },

      // 用来判断是哪种费用
      // makeFee(val, node, extra) {
      //   let text = node.$el.parentElement.parentElement.outerText
      //   if (text.indexOf('人工费用') > -1) {
      //     this.feeType = 'labour'
      //   } else if (text.indexOf('用药费用') > -1) {
      //     this.feeType = 'pesticides'
      //   } else {
      //     this.feeType = 'manures'
      //   }
      // },

     edit(fee){
        this.form.resetFields();

        let recordExist = fee!=undefined && fee!=""&& fee.id!=undefined;
        if(recordExist){
          console.log(fee)
          this.title="编辑";
          this.okText="确认修改";
          this.fee = fee;
          this.recordId = fee.recordId
          if (fee.type) {
            if (fee.type === 'labour') {
              this.feeType = 'labour'
              this.selects = '人数'
              this.$nextTick(() => {
                this.form.setFieldsValue({costType: fee.labourCostName})
                this.form.setFieldsValue({costName: fee.peopleNum})
                this.form.setFieldsValue({costAmount: fee.price})
              })
            } else if (fee.type === 'manure') {
              this.selects = '数量'
              this.feeType = 'manure'
              this.$nextTick(() => {
                this.form.setFieldsValue({costType: fee.manureName})
                this.form.setFieldsValue({dosage: fee.dosage})
                this.form.setFieldsValue({costNum: fee.quantity})
                this.form.setFieldsValue({costAmount: fee.price})
              })
            } else {
              this.selects = '数量'
              this.feeType = 'pesticides'
              this.$nextTick(() => {
                this.form.setFieldsValue({costType: fee.pesticidesName})
                this.form.setFieldsValue({dosage: fee.dosage})
                this.form.setFieldsValue({costNum: fee.quantity})
                this.form.setFieldsValue({costAmount: fee.price})
              })
            }
          }
        } else{
          this.fee = {};
        }
        this.visible=true
      },

      handleOk(){
        this.form.validateFieldsAndScroll((err, values) => {
          if (!err) {
            const info=this.form.getFieldsValue();
            info.recordId = this.recordId
            let fee = this.fee;
            info.price = info.costAmount
            if(fee.id!=undefined && fee.id!=null && fee.id!=""){
              info.id = fee.id;
              // costUpdate(info).then((res=>{
              //   if(res.success==true){
              //     this.$message.info(res.message)
              //     this.$parent.loadRecordData();
              //     this.visible = false;
              //   }else{
              //     this.$message.info(res.message)
              //   }
              //   this.form.resetFields();
              // }))
              if (this.feeType === 'labour') {
                info.labourCostName = info.costType
                info.peopleNum = info.costName
                updatelabourCost(info).then(res => {
                  if(res.success === true) {
                    this.$message.info(res.message)
                    this.$parent._getRecord();
                    this.visible = false;
                  } else {
                    this.$message.info(res.message)
                  }
                  this.form.resetFields();
                })
              } else if (this.feeType === 'pesticides') {
                info.pesticidesName = info.costType
                info.quantity = info.costNum
                updatepesticidesCost(info).then(res => {
                  if(res.success === true) {
                    this.$message.info(res.message)
                    this.$parent._getRecord();
                    this.visible = false;
                  } else {
                    this.$message.info(res.message)
                  }
                  this.form.resetFields();
                })
              } else {
                info.manureName = info.costType
                info.quantity = info.costNum
                updatemanureCost(info).then(res => {
                  if(res.success === true) {
                    this.$message.info(res.message)
                    this.$parent._getRecord();
                    this.visible = false;
                  } else {
                    this.$message.info(res.message)
                  }
                  this.form.resetFields();
                })
              }
            }else{
              if (this.feeType === 'labour') {
                info.labourCostName = this.feeName
                info.peopleNum = info.costName
                insertLabourCost(info).then(res => {
                  if(res.success==true){
                    this.$message.info('添加成功！')
                    this.$parent.loadRecordData();
                    this.visible = false;
                  }else{
                    this.$message.info(res.message)
                  }
                  this.form.resetFields();
                })
              } else if (this.feeType === 'pesticides') {
                info.pesticidesName = this.feeName
                info.quantity = info.costNum
                insertPesticidesCost(info).then(res => {
                  if(res.success==true){
                    this.$message.info('添加成功！')
                    this.$parent.loadRecordData();
                    this.visible = false;
                  }else{
                    this.$message.info(res.message)
                  }
                  this.form.resetFields();
                })
              } else {
                info.manureName = this.feeName
                info.quantity = info.costNum
                insertManuresCost(info).then(res => {
                  if(res.success==true){
                    this.$message.info('添加成功！')
                    this.$parent.loadRecordData();
                    this.visible = false;
                  }else{
                    this.$message.info(res.message)
                  }
                  this.form.resetFields();
                })
              }
              // costInsert(info).then((res=>{
              //   if(res.success==true){
              //     this.$message.info('添加成功！')
              //     this.$parent.loadRecordData();
              //     this.visible = false;
              //   }else{
              //     this.$message.info(res.message)
              //   }
              //   this.form.resetFields();
              // }))
            }
          }
        });
      },

    }
  }
</script>
