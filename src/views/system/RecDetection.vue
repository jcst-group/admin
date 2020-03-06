<template>
  <div style="background:white;padding:10px 0 10px 0;" id="boxs">
    <div style="margin:0 1% 0 0; overflow:hidden">
      <div>
        <div class="button">
          <i-button class="review-btn btn" @click="handleReset">
            <Icon type="md-sync" class="icon"/>
            重置
          </i-button>
          <i-button class="search-btn btn" style="margin-right:10px" @click="handleSearch">
            <Icon type="md-search" class="icon"/>
            查询
          </i-button>
        </div>
        <div class="select">
          <a-form
            :form="form"
            @submit="handleSearch">
            <div style="float:left;width:300px;height:50px;margin-bottom:10px;">
              <span style="line-height:40px;margin-right:5px">种植计划：</span>
              <a-form-item style="display:inline-block">
                <a-select
                  v-decorator="['planId']"
                  style="width: 200px">
                  <a-select-option
                    v-for="item in planDatas"
                    :key="item.id"
                    :value='item.id'>
                    {{item.planName}}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </div>
            <div style="float:left;width:500px;height:50px;margin-bottom:10px;">
              <span style="line-height:40px;margin-right:5px">采收检测日期：</span>
              <a-form-item style="display:inline-block;width: 60%">
                <a-range-picker @change="onChange"
                                v-decorator="[
                      'monitorTime'
                    ]"/>
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
        添加采收检测
      </a-button>
    </div>
    <div>
      <a-table
        class="dec-table"
        :columns="standardColumns"
        :dataSource="dataSource"
        :pagination="pagination"
        :loading="loading"
        rowKey="id"
        bordered
        @change="changeTable">
        <div slot="recoveryCode" slot-scope="text, record" style="text-align: center" class="slot-box show-text">
          <div style="margin-bottom: 10px" v-for="(v,k) in record.recoveryList" :key="k" v-show="k < 5 || record.showText === '收起'"><span>{{v.recoveryCode}}</span></div>
          <a class="show-more" v-show="record.recoveryList.length > 5" @click="showMore(record)">{{record.showText}}</a>
        </div>
        <span slot="crop.cropName" slot-scope="text, record" style="text-align: center" class="slot-box">
          <div class="slot-div" v-for="(item,index) in record.detectionVoList" :key="index">
            <span>{{item.item}}</span>
          </div>
        </span>
        <span slot="itemCategory.displayName" slot-scope="text, record">
          <div class="slot-div" v-for="(item,index) in record.detectionVoList" :key="index">
            <span>{{item.actValue + ' ' + (item.unit.displayName ? item.unit.displayName : '')}}</span>
          </div>
        </span>
        <span slot="createTime" slot-scope="text, record" style="text-align: center">
          <div class="slot-div" v-for="(item,index) in record.detectionVoList" :key="index">
            <span>{{item.minValue}} 至 {{item.maxValue}}</span>
          </div>
        </span>
        <span slot="action" slot-scope="text, record">
          <a @click="handleEdit(record)">编辑</a>
          <a-divider type="vertical"/>
          <a-popconfirm title="确定删除吗?" @confirm="handleDelete(record.id)">
              <a>删除</a>
          </a-popconfirm>
        </span>
      </a-table>
    </div>
    <RecDetection ref="recDetection" :planDatas='planDatas.slice(1, planDatas.length)'></RecDetection>
  </div>

</template>
<script>
  import {
    getAllRecovery,
    deleteRecoveryDet,
    getPlantingAll
  } from '@/api/permissonApi'
  import RecDetection from './modules/RecDetectionModule'

  export default {
    name: "recovery",
    data() {
      return {
        startTime: undefined,
        endTime: undefined,
        dataSource: [],
        loading: false,
        form: this.$form.createForm(this),
        planDatas: [{
          planName: '全部',
          id: -1
        }],
        pageNo: undefined,
        pageSize: undefined,
        pagination: {
          pageSizeOptions: ["10", "20", "50"],
          showTotal: (total, range) => {
            return range[0] + "-" + range[1] + " 共" + total + "条";
          },
          showQuickJumper: true,
          showSizeChanger: true,
        },
        standardColumns: [
          {
            title: '种植计划',
            dataIndex: 'plantingPlan.planName',
            key: 'plantingPlan.planName',
            align: "center"
          },
          {
            title: '采收检测时间',
            dataIndex: 'detectionTime',
            key: 'detectionTime',
            align: "center"
          },
          {
            title: '采收批次',
            dataIndex: 'recoveryCode',
            key: 'recoveryCode',
            scopedSlots: {customRender: 'recoveryCode'},
            align: "center"
          },
          {
            title: '检测项目',
            dataIndex: 'crop.cropName',
            key: 'crop.cropName',
            scopedSlots: {customRender: 'crop.cropName'},
            align: "center"
          },
          {
            title: '检测结果',
            dataIndex: 'itemCategory.displayName',
            key: 'itemCategory.displayName',
            scopedSlots: {customRender: 'itemCategory.displayName'},
            align: "center"
          },
          {
            title: '标准数值',
            dataIndex: 'createTime',
            key: 'createTime',
            scopedSlots: {customRender: 'createTime'},
            align: "center"
          },
          {
            title: '操作',
            dataIndex: "action",
            key: "action",
            scopedSlots: {customRender: "action"},
            align: "center"
          }
        ]
      }
    },
    components: {
      RecDetection
    },
    created() {
      this._loadData()
      getPlantingAll().then(res => {
        if (res.success) {
          this.planDatas = this.planDatas.concat(res.result)
        }
      })
    },
    methods: {
      showMore(record) {
        if (record.showText === '收起') {
          record.showText = '展开'
        } else {
          record.showText = '收起'
        }
      },
      _loadData() {
        let params = this.form.getFieldsValue(["planId"]);
        params.pageNo = this.pageNo
        params.pageSize = this.pageSize
        params.startTime = this.startTime
        params.endTime = this.endTime
        this.loading = true
        if (params.planId == -1) {
          delete params.planId
        }
        getAllRecovery(params).then(res => {
          if (res.success) {
            this.dataSource = res.result.list.map(item => {
              item.showText = '展开'
              item.showAll = item.recoveryList.length < 5
              return item
            })
            this.$set(this.pagination, 'total', res.result.total)
            this.$set(this.pagination, 'pageSize', res.result.pageSize)
            this.$set(this.pagination, 'current', res.result.pageNum)
          }
          this.loading = false
        })
      },
      onChange(date, dateString) {
        if (dateString.length > 0) {
          if (dateString[0]) {
            this.startTime = dateString[0].split('-').join('/')
          }
          if (dateString[1]) {
            this.endTime = dateString[1].split('-').join('/')
          }
        }
      },
      handleReset() {
        this.startTime = undefined
        this.endTime = undefined
        this.form.resetFields()
        this._loadData()
      },
      handleSearch() {
        this._loadData()
      },
      add() {
        this.$refs.recDetection.title = '添加采收检测',
          this.$refs.recDetection.open()
      },
      handleEdit(record) {
        this.$refs.recDetection.title = '修改采收检测',
        this.$refs.recDetection.open(record)
      },
      handleDelete(id) {
        deleteRecoveryDet({
          id: id
        }).then(res => {
          this.$message.info(res.message)
          if (res.success) {
            this._loadData()
          }
        })
      },
      changeTable(page) {
        this.pageNo = page.current
        this.pegeSize = page.pageSize
        this._loadData()
      }
    }
  }
</script>
<style lang="stylus" scoped>
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

  .slot-div
    height 35px
    line-height 35px
    border-bottom 1px dashed #d7d7d7
    &:last-child
      border-bottom none
  .slot-div:nth-last-child
    border-bottom 0px
  .show-text
    position relative
    .show-more
      position absolute
      width 30px
      right 10px
      bottom 0
</style>
<style lang="stylus">
  #boxs
    .dec-table
      .ant-table-body
        .ant-table-row
          height 50px
          td
            padding 0
</style>
