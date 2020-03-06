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
            <div style="float:left;width:280px;height:50px;margin-bottom:10px;">
              <span style="line-height:40px;margin-right:5px">种植计划：</span>
              <a-form-item style="display:inline-block">
                <a-select
                  v-decorator="['planId']"
                  style="width: 160px">
                  <a-select-option
                    v-for="item in batchDatas"
                    :key="item.id"
                    :value='item.id'>
                    {{item.planName}}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </div>
            <div style="float:left;width:296px;height:50px;margin-bottom:10px;">
              <span style="line-height:40px;margin-right:5px">初加工检测日期：</span>
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
        添加初加工检测
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
        <span slot="initProVoList" slot-scope="initProVoList" style="text-align: center;" class="slot-box">
           <div  v-for="(v,k) in initProVoList" :key="k"><span>{{v.initialProcessingCode}}</span></div>
        </span>
        <span slot="detectionVoList01" slot-scope="detectionVoList" style="text-align: center" class="slot-box">
           <div class="slot-div"  v-for="(v,k) in detectionVoList" :key="k"><span>{{v.item}}</span></div>
        </span>
        <span slot="detectionVoList02" slot-scope="detectionVoList" style="text-align: center" class="slot-box">
           <div class="slot-div"  v-for="(v,k) in detectionVoList" :key="k"><span>{{v.actValue}}</span></div>
        </span>
        <span slot="detectionVoList03" slot-scope="detectionVoList" style="text-align: center" class="slot-box">
           <div class="slot-div"  v-for="(v,k) in detectionVoList" :key="k"><span>{{v.minValue}}至{{v.maxValue}}</span></div>
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
    <InitialproModule ref="initialproModule" :planDatas='batchDatas.slice(1, batchDatas.length)'></InitialproModule>
  </div>

</template>
<script>
  import {getProDetectio,getPlantingAll,deleteProDetectio} from '@/api/permissonApi'
  import InitialproModule from './modules/InitialproModule'

  export default {
    name: "initialpro",
    data() {
      return {
        batchDatas: [{
          id:-1,
          planName:'全部'
        }],
        startTime: '',
        endTime: '',
        dataSource: [],
        loading: false,
        form: this.$form.createForm(this),
        stageDatas: [],
        cropDatas: [],
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
            title: '初加工批次',
            dataIndex: 'initProVoList',
            key: 'initProVoList',
            scopedSlots: {customRender: "initProVoList"},
            align: "center"
          },
          {
            title: '检测项目',
            dataIndex: 'detectionVoList',
            key: 'detectionVoList01',
            scopedSlots: {customRender: "detectionVoList01"},
            align: "center",
          },
          {
            title: '检测结果',
            dataIndex: 'detectionVoList',
            key: 'detectionVoList02',
            scopedSlots: {customRender: "detectionVoList02"},
            align: "center"
          },
          {
            title: '标准数值',
            dataIndex: 'detectionVoList',
            key: 'detectionVoList03',
            scopedSlots: {customRender: "detectionVoList03"},
            align: "center"
          },
          {
            title: '初加工检测时间',
            dataIndex: 'detectionTime',
            key: 'detectionTime',
            align: "center",
            width:'16%'
          },
          {
            title: '操作人员',
            dataIndex: 'user.realName',
            key: 'user.realName',
            align: "center",
            width:'14%'
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
      InitialproModule
    },
    created() {
      this._loadData();
      this.getAllbatch();
    },
    methods: {
      getAllbatch(){
        getPlantingAll().then(res => {
          if (res.success) {
            this.batchDatas = this.batchDatas.concat(res.result);
          }
        })
      },
      onChange(date, dateString){
        this.startTime = dateString;
      },
      onChanges(date, dateString){
        this.endTime = dateString;
      },
      getTime(){
        this.startTime=this.form.getFieldsValue(['startTime']).startTime.format('YYYY/MM/DD');
      },
      getTimes(){
        this.endTime=this.form.getFieldsValue(['endTime']).endTime.format('YYYY/MM/DD');
      },
      _loadData(params) {
        params === undefined ? null : params
        this.loading = true
        getProDetectio(params).then(res => {
          if (res.success) {
            this.dataSource = res.result.list
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
        const userinfo = this.form.getFieldsValue();
        if(userinfo.startTime!=undefined){
          this.getTime();
          userinfo.startTime=this.startTime;
        }else{
          delete userinfo.startTime
        }
        if(userinfo.endTime!=undefined){
          this.getTimes();
          userinfo.endTime=this.endTime;
        }else{
          delete userinfo.endTime
        }
        if(userinfo.planId==-1){
          delete userinfo.planId;
        }
        this._loadData(userinfo)
      },
      add() {
        this.$refs.initialproModule.title = '新增',
          this.$refs.initialproModule.open()
      },
      handleEdit(record) {
        this.$refs.initialproModule.title = '修改',
          this.$refs.initialproModule.open(record)
      },
      handleDelete(id) {
        deleteProDetectio({
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
        getProDetectio(userinfo).then(res => {
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
  #boxs /deep/ .ant-table-tbody > tr > td{
    padding: 0px !important;
  }
</style>
