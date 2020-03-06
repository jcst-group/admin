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
            <div style="float:left;width:255px;height:50px;margin-bottom:10px;">
              <span style="line-height:40px;margin-right:5px">检测时间：</span>
              <a-form-item style="display:inline-block;width: 60%">
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
            <div style="float:left;width:30%;height:50px;margin-bottom:10px;">
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
        添加种子/种苗检测
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
        <span slot="detectionVoList01" slot-scope="detectionVoList" style="text-align: center;" class="slot-box">
           <!--<div v-if="detectionVoList.length>4">
             <div class="slot-div"  v-for="(v,index) in detectionVoList" v-if="index<3 && isShowslot01==false"><span>{{v.item}}</span></div>
           <div class="slot-div" @click="clickdete01" v-if="isShowslot01==false"><span style="color: #1890ff">显示更多</span></div>
          <div class="slot-div"  v-for="v in detectionVoList" v-if="isShowslot01==true"><span>{{v.item}}</span></div>
           </div>
          <div v-if="detectionVoList.length<5">
            <div class="slot-div"  v-for="v in detectionVoList"><span>{{v.item}}</span></div>
          </div>-->
          <div>
            <div class="slot-div"  v-for="(v,k) in detectionVoList" :key="k"><span>{{v.item}}</span></div>
          </div>
        </span>
        <span slot="detectionVoList02" slot-scope="detectionVoList" style="text-align: center" class="slot-box">
           <div class="slot-div"  v-for="(v,index) in detectionVoList" :key="index"><span>{{v.unit.displayName}}</span></div>
        </span>
        <span slot="detectionVoList03" slot-scope="detectionVoList" style="text-align: center" class="slot-box">
           <div class="slot-div"  v-for="(v,index) in detectionVoList" :key="index"><span>{{v.actValue}}</span></div>
        </span>
        <span slot="detectionVoList04" slot-scope="detectionVoList" style="text-align: center" class="slot-box">
           <div class="slot-div"  v-for="(v,index) in detectionVoList" :key="index"><span>{{v.minValue}}至{{v.maxValue}}</span></div>
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
    <SeedModule ref="seedModule"></SeedModule>
    <SeedAddModule ref="seedAddModule"></SeedAddModule>
  </div>

</template>
<script>
  import {getSeedDetection,deleteSeedDetection} from '@/api/permissonApi'
  import SeedModule from './modules/SeedModule'
  import SeedAddModule from './modules/SeedAddModule'
  export default {
    name: "seed",
    data() {
      return {
        isShowslot01:false,
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
            title: '检测时间',
            dataIndex: 'detectionTime',
            key: 'detectionTime',
            align: "center"
          },
          {
            title: '种子/种苗批号',
            dataIndex: 'seedBatch.seedCode',
            key: 'seedBatch.seedCode',
            align: "center"
          },
          {
            title: '检测项目',
            dataIndex: 'detectionVoList',
            key: 'detectionVoList01',
            scopedSlots: {customRender: 'detectionVoList01'},
            align: "center"
          },
          {
            title: '单位',
            dataIndex: 'detectionVoList',
            key: 'detectionVoList02',
            scopedSlots: {customRender: 'detectionVoList02'},
            align: "center"
          },
          {
            title: '实际数据',
            dataIndex: 'detectionVoList',
            key: 'detectionVoList03',
            scopedSlots: {customRender: 'detectionVoList03'},
            align: "center"
          },
          {
            title: '标准数值',
            dataIndex: 'detectionVoList',
            key: 'detectionVoList04',
            scopedSlots: {customRender: 'detectionVoList04'},
            align: "center"
          },
          {
            title: '操作人员',
            dataIndex: 'user.realName',
            key: 'user.realName',
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
      SeedModule,
      SeedAddModule
    },
    created() {
      this._loadData()
    },
    methods: {
      clickdete01(){
        this.isShowslot01=true;
      },
      _loadData(params) {
        params === undefined ? null : params
        this.loading = true
        getSeedDetection(params).then(res => {
          if (res.success) {
            this.dataSource = res.result.list
            this.$set(this.pagination, 'total', res.result.total)
            this.$set(this.pagination, 'pageSize', res.result.pageSize)
            this.$set(this.pagination, 'current', res.result.pageNum)
          }
          this.loading = false
        })
      },
      getTime(){
        this.startTime=this.form.getFieldsValue(['startTime']).startTime.format('YYYY/MM/DD');
      },
      getTimes(){
        this.endTime=this.form.getFieldsValue(['endTime']).endTime.format('YYYY/MM/DD');
      },
      onChange(date, dateString) {
        this.startTime = dateString;
      },
      onChanges(date, dateString){
        this.endTime = dateString;
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
        }else{
          delete userinfo.startTime
        }
        if(userinfo.endTime!=undefined){
          this.getTimes();
          userinfo.endTime=this.endTime;
        }else{
          delete userinfo.endTime
        }
        this._loadData(userinfo)
      },
      add() {
        this.$refs.seedAddModule.title = '新增',
          this.$refs.seedAddModule.open()
      },
      handleEdit(record) {
        this.$refs.seedModule.title = '修改';
        this.$refs.seedModule.detectionVoListvalue = record.detectionVoList;
        this.$refs.seedModule.open(record);
      },
      handleDelete(id) {
        deleteSeedDetection({
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
        userinfo.pageNo=page.current
        userinfo.pageSize=page.pageSize
        getSeedDetection(userinfo).then(res => {
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
