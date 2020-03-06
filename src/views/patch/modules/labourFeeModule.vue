<template>
  <a-modal
    :title="title"
    v-model="visible"
    @ok="handleOk"
    style="top:5%;height: 90%;"
    cancelText="取消"
    :okText="okText"
    :maskClosable="false"
    @cancel='cancel'
  >
    <a-form :form="form">
      <!-- <a-form-item label="费用类型">
        <a-tree-select
            allowClear
            showSearch
            treeDefaultExpandAll
            placeholder='请选择费用类型'
            :dropdownStyle="{ maxHeight: '260px', overflow: 'auto' }"
            @search = 'movementFeeType'
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
         </a-tree-select>
      </a-form-item> -->

      <div class="wrapper" :class="{active: this.feeLock}" ref="wrapper">
        <div class="title-wrapper">
          <h3 class="title">人工费用类型</h3>
        </div>
        <a-tree-select
            allowClear
            showSearch
            treeDefaultExpandAll
            placeholder='请选择费用类型'
            searchPlaceholder = '手动添加'
            :dropdownStyle="{ maxHeight: '260px', overflow: 'auto' }"
            @search = 'movementFeeType'
            @change="clickFeeType"
            :value='handFeeType'
          >
          <a-tree-select-node value='人工费用' title="人工费用" key="0-1" disabled ref="labour">
            <a-tree-select-node v-for="v in this.labourFeeType" :title="v.labourCostName" :key="v.id" :value="v.labourCostName"></a-tree-select-node>
          </a-tree-select-node>
        </a-tree-select>
        <div class="error" v-show="feeLock">
          请输入费用类型
        </div>
      </div>

      <a-form-item label="人次">
        <a-input
          v-decorator="[
          'costName',
          {
            initialValue:fee.costName,
            rules: [{
              required: true, message: '请输入人次',
            }]
          }
        ]"
        />
      </a-form-item>

      <a-form-item label="总价">
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
</template>
<script>
import { getLabourCostName } from "@/api/userApi";
import { insertLabourCost, updatelabourCost } from "@/api/allapi";
export default {
  data() {
    return {
        fee: {},
        labourFeeType: [],
        form: this.$form.createForm(this),
        recordId: undefined,
        visible: false,
        okText:"",
        title:"",
        feeName: '',
        handFeeType: '',
        feeLock: false
    };
  },
  created() {
        this._getLabourName();
  },
  methods: {
        _getLabourName() {
            getLabourCostName().then(res => {
                if (res.success) {
                  this.labourFeeType = res.result;
                } else {
                  return;
                }
            });
        },  
        handleChange(value) {
            this.feeName = value.label
        },
        add(item) {
            this.title = "添加";
            this.okText = "确认添加";
            this.edit(item);
        },
        movementFeeType(val) {
          this.handFeeType = val
          if (val) {
            this.$refs.wrapper.children[1].firstElementChild.style.borderColor = '#d9d9d9'
            this.feeLock = false
          }
        },
        clickFeeType(val) {
          this.handFeeType = val
          if (val) {
            this.$refs.wrapper.children[1].firstElementChild.style.borderColor = '#d9d9d9'
            this.feeLock = false
          }
        },
        edit(fee) {
            this.form.resetFields();

            let recordExist = fee != undefined && fee != "" && fee.id != undefined;
            if (recordExist) {
                this.title = "编辑";
                this.okText = "确认修改";
                this.fee = fee;
                this.recordId = fee.recordId;
                this.handFeeType = fee.labourCostName
                this.$nextTick(() => {
                    this.form.setFieldsValue({ costName: fee.peopleNum });
                    this.form.setFieldsValue({ costAmount: fee.totalPrice });
                });
            } else {
                this.fee = {};
            }
            this.visible = true;
        },
        cancel() {
          this.handFeeType = ''
          this.$refs.wrapper.children[1].firstElementChild.style.borderColor = '#d9d9d9'
          this.feeLock = false
        },
        handleOk(){
            if (!this.handFeeType) {
              this.$refs.wrapper.children[1].firstElementChild.style.borderColor = '#f5222d'
              this.feeLock = true
            } else {
              this.$refs.wrapper.children[1].firstElementChild.style.borderColor = '#d9d9d9'
              this.feeLock = false
            }
            if (!this.handFeeType) {
              this.feeLock = true
            }
            this.form.validateFieldsAndScroll((err, values) => {
              if (!err) {
                const info=this.form.getFieldsValue();
                info.recordId = this.recordId
                info.peopleNum = info.costName
                info.labourCostName = this.handFeeType
                let fee = this.fee;
                info.totalPrice = info.costAmount
                this.handFeeType = ''
                if(fee.id!=undefined && fee.id!=null && fee.id!=""){
                    info.id = fee.id;
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
                } else {
                    info.peopleNum = info.costName
                    insertLabourCost(info).then(res => {
                        if(res.success==true){
                            this.$message.info('添加成功！')
                            this.$parent._getRecord();
                            this.visible = false;
                        }else{
                            this.$message.info(res.message)
                        }
                        this.form.resetFields();
                    })
                }
              }
            });
        }
  }
};
</script>
<style scoped>
  .wrapper{
    font-family: "Chinese Quote", -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Helvetica Neue", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
    font-size: 14px;
    font-variant: tabular-nums;
    line-height: 1.5;
    color: rgba(0, 0, 0, 0.65);
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    list-style: none;
    margin-bottom: 24px;
    vertical-align: top;
  }
  .title-wrapper{
    text-align: right;
    vertical-align: middle;
    line-height: 39.9999px;
    display: inline-block;
    overflow: hidden;
    white-space: nowrap;
  }
  .title{
    color: rgba(0, 0, 0, 0.85);
    position: relative;
    font-size: 14px;
    text-align: right;
    vertical-align: middle;
    line-height: 40px;
    display: inline-block;
    overflow: hidden;
    white-space: nowrap;
  }
  .title::before{
    display: inline-block;
    margin-right: 4px;
    content: '*';
    font-family: SimSun;
    line-height: 1;
    font-size: 14px;
    color: #f5222d;
  }
  .title::after{
    content: ':';
    margin: 0 8px 0 2px;
    position: relative;
    top: -0.5px;
  }
  .error{
    color: #f5222d;
    line-height: 1.524;
    transition: color 0.3s cubic-bezier(0.215, 0.61, 0.355, 1);
    margin-top: 5px;
    clear: both;
  }
  .active .ant-select .ant-select-selection{
    border-color: #f5222d !important;
  }
</style>
