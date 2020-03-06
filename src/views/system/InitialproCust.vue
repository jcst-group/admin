<template>
  <div style="background:white;padding:10px 0 10px 0;">
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
            <div style="float:left;width:30%;height:50px;margin-bottom:10px;">
              <span style="line-height:40px;margin-right:5px">作物品种名称：</span>
              <a-form-item style="display:inline-block">
                <a-select
                  v-decorator="['cropId']"
                  style="width: 160px">
                  <a-select-option
                    v-for="item in cropDatas"
                    :key="item.id"
                    :value='item.id'>
                    {{item.cropName}}
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
        添加初加工事件
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
        <span slot="methods" slot-scope="text">
           <div v-html="f2(text)">{{f2(text)}}</div>
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
    <InitialproCustModule ref="initialproCustModule"></InitialproCustModule>
  </div>

</template>
<script>
  import {deleteProcessing, getAllProcessing,getAllCrop} from '@/api/permissonApi'
  import InitialproCustModule from './modules/InitialproCustModule'

  export default {
    name: "initialproCust",
    data() {
      return {
        cropIds:0,
        startTime: '',
        endTime: '',
        dataSource: [],
        loading: false,
        form: this.$form.createForm(this),
        processDatas: [],
        cropDatas: [{
          id:-1,
          cropName:'全部'
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
            title: '加工事件',
            dataIndex: 'processingName',
            key: 'processingName',
            align: "center",
            width:'15%'
          },
          {
            title: '作物名称',
            dataIndex: 'crop.cropName',
            key: 'crop.cropName',
            align: "center",
            width:'15%'
          },
          {
            title: '方法',
            dataIndex: 'methods',
            key: 'methods',
            scopedSlots: { customRender: 'methods' },
          },
          {
            title: '操作',
            dataIndex: "action",
            key: "action",
            scopedSlots: {customRender: "action"},
            align: "center",
            width:'20%'
          }
        ]
      }
    },
    components: {
      InitialproCustModule
    },
    created() {
      this._loadData()
      getAllCrop().then(res => {
        if (res.success) {
          this.cropDatas = this.cropDatas.concat(res.result);
        }
      })
      getAllProcessing().then(res => {
        if (res.success) {
          this.processDatas = res.result
        }
      })
    },
    methods: {
      f2(text){
        return text.replace(/\n/g,"<br/>");
      },
      _loadData(params) {
        params === undefined ? null : params
        this.loading = true
        getAllProcessing(params).then(res => {
          if (res.success) {
            this.dataSource = res.result.list
            this.$set(this.pagination, 'total', res.result.total)
            this.$set(this.pagination, 'pageSize', res.result.pageSize)
            this.$set(this.pagination, 'current', res.result.pageNum)
          }
          this.loading = false
        })
      },
      onChange(date, dateString) {
        if (dateString != ",") {
          this.startTime = dateString[0];
          this.endTime = dateString[1];
        } else {
          /*this.userinfo.startTime = "";
          this.userinfo.endTime = "";*/
          this.startTime = '';
          this.endTime = '';
          this._loadData();
        }
      },
      handleReset() {
        this.form.resetFields()
        this._loadData()
      },
      handleSearch() {
        var userinfo = this.form.getFieldsValue([
          "cropId"
        ]);
        if(userinfo.cropId==-1){
          delete userinfo.cropId;
        }
        this._loadData(userinfo)
      },
      add() {
        this.$refs.initialproCustModule.title = '新增',
          this.$refs.initialproCustModule.open()
      },
      handleEdit(record) {
        this.$refs.initialproCustModule.title = '修改',
          this.$refs.initialproCustModule.open(record)
      },
      handleDelete(id) {
        deleteProcessing({
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
        var userinfo = this.form.getFieldsValue([
          "cropId"
        ]);
        if(userinfo.cropId==-1){
          delete userinfo.cropId;
        }
        userinfo.pageNo=page.current
        userinfo.pageSize=page.pageSize
        getAllProcessing(userinfo).then(res => {
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
    height 30px
    line-height 30px
    border-bottom 1px dashed #d7d7d7

  .slot-div:nth-last-child
    border-bottom 0px
</style>
<!--<style>
  #boxs /deep/ .ant-table-tbody > tr > td{
    padding: 0px !important;
  }
</style>-->
