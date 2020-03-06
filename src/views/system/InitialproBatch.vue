<template >
  <div style="background:white;padding:10px 0 10px 0;" class="recBatch-box" id="boxs">
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
            <div style="float:left;width:280px;height:50px;margin-bottom:10px;">
              <span style="line-height:40px;margin-right:5px">种植计划：</span>
              <a-form-item style="display:inline-block">
                <a-select
                  v-decorator="['planId']"
                  style="width: 180px">
                  <a-select-option
                    v-for="item in batchDatas"
                    @click="changeBatch(item.id)"
                    :key="item.id"
                    :value='item.id'>
                    {{item.planName}}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </div>
            <div style="float:left;width:225px;height:50px;margin-bottom:10px;">
              <span style="line-height:40px;margin-right:5px">日期：</span>
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
            <div style="float:left;width:220px;height:50px;margin-bottom:10px;">
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
            <div style="float:left;width: 340px;height:50px;margin-bottom:10px;">
              <span style="line-height:40px;margin-right:5px">采收批次：</span>
              <a-form-item style="display:inline-block">
                <a-select
                  :filterOption="filterBatch"
                  :showSearch='true'
                  v-decorator="['recoveryId']"
                  style="width: 200px">
                  <a-select-option
                    v-for="item in recorveryData"
                    :key="item.id"
                    :value='item.id'>
                    <div class='hide-name' style="color: rgba(0,0,0,0.4)">{{item.batch_name ? item.batch_name : '非自种'}}</div>
                    <div>{{item.recovery_code}}</div>
                  </a-select-option>
                </a-select>
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
        添加初加工批次
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
        <div slot="recoveryList" slot-scope="text, record" style="text-align: center" class="slot-box show-text">
           <div style="margin-bottom: 10px" v-for="(v,k) in record.recoveryList" :key="k" v-show="k < 5 || record.showText === '收起'"><span>{{v.recoveryCode}}</span></div>
           <a class="show-more" v-show="record.recoveryList.length > 5" @click="showMore(record)">{{record.showText}}</a>
        </div>
        <span slot="proItemList01" slot-scope="proItemList" style="text-align: center" class="slot-box">
           <div class="slot-div"  v-for="(v,k) in proItemList" :key="k"><span>{{v.proName}}</span></div>
        </span>
        <span slot="proItemList02" slot-scope="proItemList" style="text-align: center" class="slot-box">
           <div class="slot-div"  v-for="(v,k) in proItemList" :key="k"><span>{{v.proLevel}}</span></div>
        </span>
        <span slot="proItemList03" slot-scope="proItemList" style="text-align: center" class="slot-box">
           <div class="slot-div"  v-for="(v,k) in proItemList" :key="k"><span>{{v.weightCount}}</span></div>
        </span>
        <span slot="proItemList04" slot-scope="proItemList" style="text-align: center" class="slot-box">
           <div class="slot-div"  v-for="(v,k) in proItemList" :key="k"><span>{{v.unit.displayName}}</span></div>
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
    <InitialproBatchAddModule ref="initialproBatchAddModule"></InitialproBatchAddModule>
    <InitialproBatchModule ref="initialproBatchModule"></InitialproBatchModule>
  </div>

</template>
<script>
  import { getProbatchAll,getPlantingAll,deleteProbatchAll,getRecoveryData } from '@/api/permissonApi'
  import InitialproBatchAddModule from './modules/InitialproBatchAddModule'
  import InitialproBatchModule from './modules/InitialproBatchModule'
  export default {
    name: "initialproBatch",
    data() {
      return {
        baseIds:'',
        lotIds:'',
        lotList:[],
        startTime:'',
        endTime:'',
        cropIds:0,
        dataSource: [],
        loading: false,
        form: this.$form.createForm(this),
        processDatas: [],
        recorveryData: [],
        batchDatas: [{
          id:-1,
          planName:'全部'
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
            title: '初加工名称',
            dataIndex: 'initialName',
            key: 'initialName',
            align: "center",
            width:'10%'
          },
          {
            title: '种植计划',
            dataIndex: 'plantingPlan.planName',
            key: 'plantingPlan.planName',
            align: "center",
          },
          {
            title: '品种',
            dataIndex: 'crop.cropName',
            key: 'crop.cropName',
            align: "center",
          },
          {
            title: '初加工批次',
            dataIndex: 'initialProcessingCode',
            key: 'initialProcessingCode',
            align: "center",
          },
          {
            title: '采收批次',
            dataIndex: 'recoveryList',
            key: 'recoveryList',
            scopedSlots: {customRender: "recoveryList"},
            align: "center",
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
            align: "center",
          },
          {
            title: '产量',
            dataIndex: 'proItemList',
            key: 'proItemList03',
            scopedSlots: {customRender: "proItemList03"},
            align: "center",
          },
          {
            title: '单位',
            dataIndex: 'proItemList',
            key: 'proItemList04',
            scopedSlots: {customRender: "proItemList04"},
            align: "center",
          },
          {
            title: '初加工日期',
            dataIndex: 'initialProcessingTime',
            key: 'initialProcessingTime',
            align: "center",
          },
          {
            title: '操作',
            dataIndex: "action",
            key: "action",
            scopedSlots: {customRender: "action"},
            align: "center",
          }
        ]
      }
    },
    components: {
      InitialproBatchAddModule,
      InitialproBatchModule
    },
    created() {
      this._loadData();
      this.baseIds=0;
      this.getAllbatch();
      getRecoveryData().then(res => {
        if (res.success) {
          this.recorveryData = res.result
        }
      })
    },
    methods: {
      filterBatch(val, node) {
        return node.componentOptions.children[0].children[0].text.indexOf(val) > -1 || node.componentOptions.children[1].children[0].text.indexOf(val) > -1
      },
      showMore(record) {
        if (record.showText === '收起') {
          record.showText = '展开'
        } else {
          record.showText = '收起'
        }
      },
      getAllbatch(){
        getPlantingAll().then(res => {
          if (res.success) {
            this.batchDatas = this.batchDatas.concat(res.result);
          }
        })
      },
      changeBatch(batchId){

      },
      onChange(date, dateString){
        this.startTime = dateString;
      },
      onChanges(date, dateString){
        this.endTime = dateString;
      },
      f2(text){
        return text.replace(/\n/g,"<br/>");
      },
      _loadData(params) {
        params === undefined ? null : params
        this.loading = true
        getProbatchAll(params).then(res => {
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

      handleReset() {
        this.form.resetFields()
        this._loadData()
      },
      handleSearch() {
        var userinfo = this.form.getFieldsValue();
        if(userinfo.startTime!=undefined){
          this.getTime();
          userinfo.startTime=this.startTime;
        }
        if(userinfo.endTime!=undefined){
          this.getTimes();
          userinfo.endTime=this.endTime;
        }
        if(userinfo.planId==-1){
          delete userinfo.planId;
        }
        this._loadData(userinfo)
      },
      getTime(){
        this.startTime=this.form.getFieldsValue(['startTime']).startTime.format('YYYY/MM/DD');
      },
      getTimes(){
        this.endTime=this.form.getFieldsValue(['endTime']).endTime.format('YYYY/MM/DD');
      },
      add() {
        this.$refs.initialproBatchAddModule.title = '新增',
          this.$refs.initialproBatchAddModule.open()
      },
      handleEdit(record) {
        this.$refs.initialproBatchModule.title = '修改',
          this.$refs.initialproBatchModule.open(record)
      },
      handleDelete(id) {
        deleteProbatchAll({
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
        if(userinfo.startTime!=undefined){
          this.getTime();
          userinfo.startTime=this.startTime;
        }
        if(userinfo.endTime!=undefined){
          this.getTimes();
          userinfo.endTime=this.endTime;
        }
        if(userinfo.planId==-1){
          delete userinfo.planId;
        }
        userinfo.pageNo=page.current
        userinfo.pageSize=page.pageSize
        getProbatchAll(userinfo).then(res => {
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
  .show-text
    position relative
    .show-more
      position absolute
      width 30px
      right 10px
      bottom 0
</style>
<style>
  .recBatch-box .ant-select-selection-selected-value .hide-name {
    display: none
  }
  .recBatch-box .ant-table-body{
    width: 100%;
    overflow-x: auto;
  }
  .recBatch-box .ant-table-body > table{
    min-width: 1200px;
  }
  #boxs .ant-table-tbody > tr > td{
    padding: 0px !important;
  }
</style>
