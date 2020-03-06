<template>
  <div>
  <a-modal
    title="选择初加工批次"
    v-model="visible"
    @ok="handleOk"
    style="top:10%;height: 90%"
    cancelText="取消"
    okText="确定"
    :maskClosable="false"
    class="rec-modal"
  >
    <a-table
      :columns="batchColumns"
      :dataSource="batchDatas"
      :pagination='false'
      :rowSelection='rowSelection'
      id="addint"
    >
        <span slot="proItemList01" slot-scope="proItemList" style="text-align: center" class="slot-box">
          <div class="slot-div"  v-for="v in proItemList"><span>{{v.proName}}</span></div>
        </span>
        <span slot="proItemList02" slot-scope="proItemList" style="text-align: center" class="slot-box">
           <div class="slot-div"  v-for="v in proItemList"><span>{{v.proLevel}}</span></div>
        </span>
        <span slot="proItemList03" slot-scope="proItemList" style="text-align: center" class="slot-box">
           <div class="slot-div"  v-for="v in proItemList"><span>{{v.weightCount}}</span></div>
        </span>
        <span slot="proItemList04" slot-scope="proItemList" style="text-align: center" class="slot-box">
           <div class="slot-div"  v-for="v in proItemList"><span>{{v.unit.displayName}}</span></div>
        </span>
    </a-table>
  </a-modal>
  </div>
</template>

<script>
  let checkedDatas = []
  export default {
    props: {
      batchDatas: {
        type: Array,
        default() {
          return []
        }
      },
    },
    data() {
      return {
        visible: false,
        rowSelection: {
          columnTitle: '选择',
          onChange(selectedRowKeys, selectedRows) {
            this.selectedRowKeys = selectedRowKeys
            checkedDatas = selectedRows
          },
          selectedRowKeys: []
        },
        batchColumns: [
          {
            title: '初加工名称',
            dataIndex: 'initialName',
            key: 'initialName',
            align: "center"
          },
          {
            title: '初加工批次',
            dataIndex: 'initialProcessingCode',
            key: 'initialProcessingCode',
            align: "center"
          },
          {
            title: '产成品',
            dataIndex: 'proItemList',
            key: 'proItemList01',
            scopedSlots: {customRender: "proItemList01"},
            align: "center"
          },
          {
            title: '等级',
            dataIndex: 'proItemList',
            key: 'proItemList02',
            scopedSlots: {customRender: "proItemList02"},
            align: "center"
          },
          {
            title: '产量',
            dataIndex: 'proItemList',
            key: 'proItemList03',
            scopedSlots: {customRender: "proItemList03"},
            align: "center"
          },
          {
            title: '单位',
            dataIndex: 'proItemList',
            key: 'proItemList04',
            scopedSlots: {customRender: "proItemList04"},
            align: "center"
          }
        ]
      }
    },
    methods: {
      handleOk() {
        this.visible = false;
        this.$emit('setData', checkedDatas)
      }
    }
  }
</script>

<style lang='stylus' scoped>
  .slot-div
    height 30px
    line-height 30px

  .slot-div:last-child
    border-bottom 0px
</style>
<style>
  #addint /deep/ .ant-table-tbody > tr > td{
    padding: 0px 0px !important;
  }
</style>
