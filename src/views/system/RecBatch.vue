<template>
  <div style="background:white;padding:10px 0 10px 0;" class="recBatch-box tdRec-box">
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
            <div style="float:left;width:335px;height:50px;margin-bottom:10px;">
              <span style="line-height:40px;margin-right:5px">种植批次：</span>
              <a-form-item style="display:inline-block">
                <a-select
                  :showSearch='true'
                  :filterOption='filterBatch'
                  v-decorator="['batchId']"
                  style="width: 230px">
                  <a-select-option
                    v-for="item in batchDatas"
                    @click="changeBatch(item.id)"
                    :key="item.id"
                    :value='item.id'>
                    {{item.batchName}}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </div>
            <div style="float:left;width:253px;height:50px;margin-bottom:10px;">
              <span style="line-height:40px;margin-right:5px">采收日期：</span>
              <a-form-item style="display:inline-block">
                <a-date-picker
                  placeholder="开始日期"
                  style="width: 160px"
                  v-decorator="[
                    'startTime',
                  ]"
                  @change="onChange"
                />
              </a-form-item>
            </div>
            <div style="float:left;width:24%;height:50px;margin-bottom:10px;">
              <span style="line-height:40px;margin-right:20px;">至</span>
              <a-form-item style="display:inline-block">
                <a-date-picker
                  placeholder="结束日期"
                  style="width: 160px"
                  v-decorator="[
                    'endTime',
                  ]"
                  @change="onChanges"
                />
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
        添加采收批次
      </a-button>
    </div>
    <div>
      <a-table
        :columns="standardColumns"
        :dataSource="dataSource"
        :pagination="pagination"
        :loading="loading"
        rowKey="id"
        bordered
        @change="changeTable"
      >
        <span slot="recoveryList01" slot-scope="recoveryList" style="text-align: center" class="slot-box">
           <div class="slot-div" v-for="(v,index) in recoveryList" :key="index"><span>{{v.recoveryCode}}</span></div>
        </span>
        <span slot="recoveryList02" slot-scope="recoveryList" style="text-align: center" class="slot-box">
           <div class="slot-div" v-for="(v,index) in recoveryList" :key="index"><span>{{v.harvestedProduct.type.displayName}}-{{v.harvestedProduct.harvestedName}}</span></div>
        </span>
        <span slot="recoveryList03" slot-scope="recoveryList" style="text-align: center" class="slot-box">
           <div class="slot-div" v-for="(v,index) in recoveryList" :key="index"><span>{{v.yield}}</span></div>
        </span>
        <span slot="recoveryList04" slot-scope="recoveryList" style="text-align: center" class="slot-box">
           <div class="slot-div" v-for="(v,index) in recoveryList" :key="index"><span>{{v.unit.displayName}}</span></div>
        </span>
        <span slot="recoveryList05" slot-scope="recoveryList" style="text-align: center" class="slot-box">
           <div class="slot-div" v-for="(v,index) in recoveryList" :key="index"><span>{{v.harvestingTime}}</span></div>
        </span>
        <span slot="recoveryLotList" slot-scope="recoveryLotList">
          <a-tag v-for="tag in recoveryLotList" color="rgb(60, 158, 171)" :key="tag.lot.id">{{tag.lot.lotName}}</a-tag>
        </span>
        <span slot="methods" slot-scope="text">
           <div v-html="f2(text)">{{f2(text)}}</div>
        </span>
        <span slot="recoveryList06" slot-scope="recoveryList" style="text-align: center" class="slot-box">
                <div class="slot-div" v-for="(v,index) in recoveryList" :key="index">
                <a @click="handleEdit(v)">编辑</a>
                <a-divider type="vertical"/>
                <a-popconfirm title="确定删除吗?" @confirm="handleDelete(v.id)">
                    <a>删除</a>
                </a-popconfirm>
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
    <RecBatchModule ref="recBatchModule"></RecBatchModule>
    <RecBatchAddModule ref="recBatchAddModule"></RecBatchAddModule>
  </div>

</template>
<script>
  import {getRecoveryBatch, getAllCropBatchs, getRecoveryVo, deleteRecoveryBatch} from '@/api/permissonApi'
  import RecBatchModule from './modules/RecBatchModule'
  import RecBatchAddModule from './modules/RecBatchAddModule'

  export default {
    name: "recBatch",
    data() {
      return {
        baseIds: '',
        lotIds: '',
        lotList: [],
        startTime: '',
        endTime: '',
        cropIds: 0,
        dataSource: [],
        loading: false,
        form: this.$form.createForm(this),
        processDatas: [],
        batchDatas: [{
          id: -1,
          batchName: '全部'
        }],
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
            title: '种植批次名称',
            dataIndex: 'batchName',
            key: 'batchName',
            align: "center",
          },
          {
            title: '品种',
            dataIndex: 'crop.cropName',
            key: 'crop.cropName',
            align: "center",
          },
          {
            title: '采收批次',
            dataIndex: 'recoveryList',
            key: 'recoveryList01',
            scopedSlots: {customRender: "recoveryList01"},
            align: "center",
          },
          {
            title: '采收品',
            dataIndex: 'recoveryList',
            key: 'recoveryList02',
            scopedSlots: {customRender: 'recoveryList02'},
            align: "center",
          },
          /*{
            title: '地块名称',
            dataIndex: 'recoveryLotList',
            key: 'recoveryLotList.',
            scopedSlots: { customRender: 'recoveryLotList' },
            align: "center",
          },*/
          {
            title: '产量',
            dataIndex: 'recoveryList',
            key: 'recoveryList03',
            scopedSlots: {customRender: 'recoveryList03'},
            align: "center",
          },
          {
            title: '单位',
            dataIndex: 'recoveryList',
            key: 'recoveryList04',
            scopedSlots: {customRender: 'recoveryList04'},
            align: "center",
          },
          {
            title: '采收时间',
            dataIndex: 'recoveryList',
            key: 'recoveryList05',
            scopedSlots: {customRender: 'recoveryList05'},
            align: "center"
          },
          {
            title: '操作',
            dataIndex: "recoveryList",
            key: "recoveryList06",
            scopedSlots: {customRender: "recoveryList06"},
            align: "center",
          }
        ]
      }
    },
    components: {
      RecBatchModule,
      RecBatchAddModule
    },
    created() {
      this._loadData();
      this.baseIds = 0;
      this.getAllcrop();
    },
    methods: {
      filterBatch(val, node) {
        return node.componentOptions.children[0].text.trim().indexOf(val) > -1
      },
      getAllcrop() {
        getAllCropBatchs().then(res => {
          if (res.success) {
            this.batchDatas = this.batchDatas.concat(res.result);
          }
        })
      },
      changeBatch(batchId) {
        this.form.resetFields("lotId");
        this.lotList = [];
        let param = {};
        param.batchId = batchId;
      },
      onChange(date, dateString) {
        this.startTime = dateString;
      },
      onChanges(date, dateString) {
        this.endTime = dateString;
      },
      f2(text) {
        return text.replace(/\n/g, "<br/>");
      },
      _loadData(params) {
        params === undefined ? null : params
        this.loading = true
        getRecoveryBatch(params).then(res => {
          if (res.success) {
            this.dataSource = res.result.list;
            this.dataSource.recoveryLotList = this.dataSource.recoveryLotList;
            this.$set(this.pagination, 'total', res.result.total)
            this.$set(this.pagination, 'pageSize', res.result.pageSize)
            this.$set(this.pagination, 'current', res.result.pageNum)
          }
          this.loading = false
        })
      },

      handleReset() {
        this.form.resetFields()
        this._loadData()
      },
      handleSearch() {
        var userinfo = this.form.getFieldsValue();
        if (userinfo.startTime != undefined&&userinfo.startTime != '') {
          this.getTime();
          userinfo.startTime = this.startTime;
        }else{
          delete userinfo.startTime;
        }
        if (userinfo.endTime != undefined&&userinfo.endTime != '') {
          this.getTimes();
          userinfo.endTime = this.endTime;
        }else{
          delete userinfo.endTime;
        }
        if (userinfo.batchId == -1) {
          delete userinfo.batchId;
        }
        this._loadData(userinfo)
      },
      getTime() {
        this.startTime = this.form.getFieldsValue(['startTime']).startTime.format('YYYY/MM/DD');
      },
      getTimes() {
        this.endTime = this.form.getFieldsValue(['endTime']).endTime.format('YYYY/MM/DD');
      },
      add() {
        this.$refs.recBatchAddModule.title = '新增',
          this.$refs.recBatchAddModule.open()
      },
      handleEdit(record) {
        this.$refs.recBatchModule.title = '修改',
          this.$refs.recBatchModule.open(record)
      },
      handleDelete(id) {
        deleteRecoveryBatch({
          id: id
        }).then(res => {
          this.$message.info(res.message)
          if (res.success) {
            this._loadData()
          }
        })
      },
      changeTable(page) {
        this.loading = true
        var userinfo = this.form.getFieldsValue();
        if (userinfo.startTime != undefined) {
          this.getTime();
          userinfo.startTime = this.startTime;
        }
        if (userinfo.endTime != undefined) {
          this.getTimes();
          userinfo.endTime = this.endTime;
        }
        if (userinfo.batchId == -1) {
          delete userinfo.batchId;
        }
        userinfo.pageNo = page.current
        userinfo.pageSize = page.pageSize
        getRecoveryBatch(userinfo).then(res => {
          if (res.success) {
            this.dataSource = res.result.list
            this.$set(this.pagination, 'total', res.result.total)
            this.$set(this.pagination, 'pageSize', res.result.pageSize)
            this.$set(this.pagination, 'current', res.result.pageNum)
          }
          this.loading = false
        })
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

  .slot-div:last-child
    border-bottom 0px
</style>
<style>
  .recBatch-box /deep/ .ant-table-body {
    width: 100%;
    overflow-x: auto;
  }

  .recBatch-box /deep/ .ant-table-body > table {
    min-width: 1200px;
  }

  .tdRec-box /deep/ .ant-table-tbody > tr > td {
    padding: 0px !important;
  }
</style>
