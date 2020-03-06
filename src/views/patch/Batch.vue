<template>
<div style="background:white;padding:10px 0 10px 0;">
  <div style="margin:0 1% 0 0; overflow:hidden">
    <div>
        <div class="button">
            <i-button class="review-btn btn" @click="handleReset">
                <Icon type="md-sync" class="icon"/>
                重置
            </i-button>
            <i-button class="search-btn btn" style="margin-right:10px"  @click="handleSearch">
                <Icon type="md-search" class="icon"/>
                查询
            </i-button>
        </div>
        <div class="select">
            <a-form
                :form="form"
                @submit="handleSearch" >
                <div style="float:left;width: 270px;height:50px;margin-bottom:10px;">
                    <span style="line-height:40px;margin-right:5px">品种：</span>
                    <a-form-item style="display:inline-block">
                        <a-select
                        v-decorator="['cropId']"
                        style="width: 200px">
                            <a-select-option 
                                v-for="item in cropDatas"
                                :key="item.id"
                                :value='item.id'>
                                {{item.cropName}}
                            </a-select-option>
                        </a-select>
                    </a-form-item>
                </div>
                <div style="float:left;width:270px;height:50px;margin-bottom:10px;">
                    <a-form-item style="display:inline-block">
                        <a-input
                            placeholder="请输入任意字符"
                            addonBefore='批次名'
                            v-decorator="['batchName']">
                        </a-input>
                    </a-form-item>
                </div>
            </a-form>
        </div>
    </div>
  </div>
  <div style="margin: 0 0 16px 0;">
    <a-button
      type="primary"
      icon="plus"
      @click="add"
    >
      添加批次
    </a-button>
  </div>
  <div>
    <a-table :columns="columns"
      :dataSource="dataSource"
      :pagination="pagination"
      :loading="loading"
      rowKey="id"
      bordered
      @change="handleTableChange"
    >
      <span slot="lot" slot-scope="text, record" class='limit-lot'>
        <a-tooltip placement='topLeft'>
          <template slot='title'>
            <div v-for="item in record.lotList" :key="item.id" style="white-space: nowrap">
              {{item.lotName}}
            </div>
          </template>
          <!-- <span v-for="(item,index) in record.lotList" v-show="index < 5" :key="item.id">
            {{item.lotName}}
          </span> -->
          <a-tag v-for="(item,index) in record.lotList" v-show="index < 5" :key="item.id" color='blue'>
            {{item.lotName}}
          </a-tag>
          <span v-if="record.lotList.length > 5">…</span>
        </a-tooltip>
      </span>
      <span slot="times" slot-scope="text, record">
        {{record.startTime}}——{{record.endTime}}
      </span>
      <span slot="action" slot-scope="text, record" style="white-space: nowrap">
        <a @click="handleEdit(record)">编辑</a>
        <a-divider type="vertical"/>
        <a-dropdown>
            <a class="ant-dropdown-link">
              更多 <a-icon type="down" />
            </a>
            <a-menu slot="overlay">
              <a-menu-item >
                <a href="javascript:;" @click="handlelook(record)">查看</a>
              </a-menu-item>
              <a-menu-item>
                <a-popconfirm title="确定删除吗?" @confirm="handleDelete(record)">
                  <a>删除</a>
                </a-popconfirm>
              </a-menu-item>
              <a-menu-item >
                <a href="javascript:;" @click="addWorkList(record)">创建工单</a>
              </a-menu-item>
              <a-menu-item >
                <a href="javascript:;" @click="deleteWorkList(record)">撤销工单</a>
              </a-menu-item>
              <a-menu-item >
                <a @click="methodAchive(record)">批次完成</a>
              </a-menu-item>
              <a-menu-item >
                <a @click="save(record)">溯源管理</a>
              </a-menu-item>
            </a-menu>
          </a-dropdown>
      </span>
    </a-table>
  </div>
  <batch-modal ref="batchModal" :cropDatas='cropDatas.slice(1, this.cropDatas.length)'></batch-modal>
</div>

</template>

<script>
//import { version } from 'punycode';
import BatchModal from "./modules/BatchModal";

import { queryBatch, batchDelete } from "@/api/allapi";
import {getAllCrop, updateStatus, addWorkOrder, cancelWorkOrder} from '@/api/permissonApi'

const columns = [
  {
    title: "批次名称",
    dataIndex: "batchName",
    key: "batchName",
  },
  // {
  //   title: "预计产值（kg）",
  //   dataIndex: "projectedMuYield",
  //   key: "projectedMuYield",
  // },
  {
    title: "基地",
    dataIndex: "baseInfo.baseName",
    key: "baseInfo.baseName",
  },
  {
    title: "地块",
    dataIndex: "lot",
    key: "lot",
    scopedSlots: { customRender: "lot" },
    width: '25%',
  },
  {
    title: "开始结束时间",
    dataIndex: "times",
    key: "times",
    scopedSlots: { customRender: "times" },
  },
  {
    title: "制定日期",
    dataIndex: "createTime",
    key: "createTime",
  },
  {
    title: "状态",
    dataIndex: "status.displayName",
    key: "status.displayName",
  },
  {
    title: "操作",
    dataIndex: "action",
    key: "action",
    scopedSlots: { customRender: "action" },
    align: "center"
  }
];

export default {
  name: "batch",
  components: {
    BatchModal
  },
  data() {
    return {
      form: this.$form.createForm(this),
      dataSource: [],
      cropDatas: [{
        id: 0,
        cropName: '全部'
      }],
      loading: false,
      pageNo: null,
      pageSize: null,
      pagination: {
        pageSizeOptions: ["10", "20", "50"],
        showTotal: (total, range) => {
            return range[0] + "-" + range[1] + " 共" + total + "条";
        },
        showQuickJumper: true,
        showSizeChanger: true,
      },
      columns: columns
    };
  },
  created() {
    getAllCrop().then(res => {
      if (res.success) {
        this.cropDatas = this.cropDatas.concat(res.result)
      }
    })
    this._loadData()
  },
  methods: {
    _loadData() {
      let params = this.form.getFieldsValue();
      params.pageNo = this.pageNo
      params.pageSize = this.pageSize
      this.loading = true
      if (params.cropId === 0) {
        delete params.cropId
      }
      queryBatch(params).then(res => {
        if (res.success) {
          this.dataSource = res.result.list
          this.$set(this.pagination, 'total', res.result.total)
          this.$set(this.pagination, 'pageSize', res.result.pageSize)
          this.$set(this.pagination, 'current', res.result.pageNum)
        }
        this.loading = false
      })
    },
    save(record) {
      this.$router.push({path: '/batch/save', query: {batchId: record.id}})
      // this.$router.push({name: 'batchSave', params: {batchId: record.id, record: JSON.stringify(record)}})
    },
    handleTableChange(page) {
      this.pageNo = page.current
      this.pageSize = page.pageSize
      this._loadData()
    },
    handleReset() {
      this.form.resetFields()
      this._loadData()
    },
    handleSearch() {
      this._loadData()
    },
    add() {
      this.$refs.batchModal.add();
    },
    handleEdit(record) {
      if (record.status.displayName === '未使用') {
        this.$refs.batchModal.edit(record);
      } else {
        this.$message.warn('该方案' + record.status.displayName + '，不可编辑')
      }
    },
    handleDelete(record) {
      if (record.status.displayName === '未使用') {
        batchDelete({
          id: record.id
        }).then(res => {
          this.$message.info(res.message)
          if (res.success) {
            this._loadData()
          }
        })
      } else {
        this.$message.warn('该方案' + record.status.displayName + '，不可删除')
      }
    },
    handlelook(record) {
      this.$refs.batchModal.isedit = false
      this.$refs.batchModal.edit(record)
      this.$refs.batchModal.title = '查看'
    },
    addWorkList(record) {
      if (record.status.displayName === '未使用') {
        addWorkOrder({
          batchId: record.id
        }).then(res => {
          this.$message.info(res.message)
          if (res.success) {
            this._loadData()
          }
        })
      } else {
        this.$message.warn('该方案' + record.status.displayName + '，不可做发起工单任务操作！')
      }
    },
    deleteWorkList(record) {
      if (record.status.displayName === '使用中') {
        var that = this
        this.$confirm({
          title: '您确定撤销该方案下的任务工单吗',
          onOk() {
            cancelWorkOrder({
              batchId: record.id
            }).then(res => {
              that.$message.info(res.message)
              if (res.success) {
                that._loadData()
              }
            })
          }
        })
      } else {
        this.$message.warn('该方案' + record.status.displayName + '，不可做撤销工单任务操作！')
      }
    },
    methodAchive(record) {
      if (record.status.displayName === '使用中') {
        var that = this
        this.$confirm({
          title: '您确定该方案已完成吗？',
          onOk() {
            updateStatus({
              id: record.id
            }).then(res => {
              that.$message.info(res.message)
              if (res.success) {
                that._loadData()
              }
            })
          }
        })
      } else {
        this.$message.warn('该方案' + record.status.displayName + '，不可做完成操作！')
      }
    }
    // getTreeData(data) {
    //   console.log(data);
    //   if (data instanceof Array) {
    //     let xx = [];
    //     for (let o in data) {
    //       let obj = data[o];
    //       let item = this.getTreeData(obj);
    //       xx.push(item);
    //     }
    //     return xx;
    //   } else if (data instanceof Object) {
    //     if (data.children != undefined && data.children.length == 0) {
    //       let item = {};
    //       item.title = data.name;
    //       item.value = String(data.id);
    //       item.key = String(data.id);
    //       return item;
    //     } else {
    //       let item = {};
    //       item.title = data.name;
    //       item.value = String(data.id);
    //       item.key = String(data.id);
    //       item.children = this.getTreeData(data.children);
    //       return item;
    //     }
    //   }
    // },
  }
};
</script>
<style lang='stylus' scoped>
  .limit-lot
    white-space nowrap
    overflow hidden
    display block
    width 100%
    max-width 400px
    text-overflow ellipsis
    cursor pointer
  .btn
    float right
    background #2c909c
    border-color #2c909c
    color #fff
    line-height 18px
    margin-top 6px
    .icon
      font-size 18px
      vertical-align middle
</style>
