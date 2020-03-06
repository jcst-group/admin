<template>
  <a-modal :title="title" v-model="visible" @ok="handleOk" style="top:5%;height: 90%" cancelText="取消" okText="确定"
           :maskClosable="false" class="standard-modal">
    <a-form :form='form'>
      <a-table :rowKey="record=>record.id" :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
               :columns="familyColumnss" :dataSource="recoveryPlanDate" :pagination='false' :loading="loading">
      </a-table>
    </a-form>
  </a-modal>
</template>
<script>
  import {getRecoveryByPlanId} from '@/api/permissonApi'
  // import ATextarea from "ant-design-vue/es/input/TextArea";

  export default {
    computed: {},
    // components: {
    //   ATextarea
    // },
    data() {
      return {
        recoveryByfu:[],
        selectedRowKeys: [],
        selectedRowKeysShow: [],
        recoveryPlanDate: [],
        planId: '',
        harvestId: '',
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
            width: '30%',
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
            align: "center"
          },
          {
            title: '单位',
            dataIndex: 'unit.displayName',
            key: 'unit.displayName',
            align: "center"
          },
        ],
      }
    },
    created() {
    },
    methods: {
      onSelectChange(selectedRowKeys) {
        this.selectedRowKeys = selectedRowKeys
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
      open(planId, harvestId,recoveryByfu) {
        this.visible = true;
        this.recoveryPlanDate = [];
        this.selectedRowKeys = [];
        this.selectedRowKeysShow = [];
        getRecoveryByPlanId({planId: planId, harvestId: harvestId}).then(res => {
          if (res.success) {
            this.recoveryPlanDate = res.result;
            if(recoveryByfu!=[]){
              this.recoveryPlanDate = this.recoveryPlanDate.filter(item => !recoveryByfu.some(ele=>ele.id===item.id));
            }
          }
        })
        /*this.form.resetFields()
        if(record !== undefined) {
          this.record = record
        } else {
          this.record = {}
        }*/
      },
      handleOk() {
        for (let index in this.selectedRowKeys) {
          for (let indexs in this.recoveryPlanDate) {
            if(this.selectedRowKeys[index]==this.recoveryPlanDate[indexs].id){
              this.selectedRowKeysShow.push(this.recoveryPlanDate[indexs]);
            }
          }
        }
        this.$emit('childByValue', this.selectedRowKeysShow)
        this.visible = false;
      },
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
    max-height 517px !important;
</style>
