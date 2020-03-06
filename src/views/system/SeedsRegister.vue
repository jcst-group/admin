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
            <div style="float:left;width:25%;height:50px;margin-bottom:10px;margin-top: 1px">
              <a-form-item style="display:inline-block">
              <a-input
                addonBefore='品种'
                v-decorator="['cropName']">
              </a-input>
              </a-form-item>
            </div>
            <div style="float:left;width:25%;height:50px;margin-bottom:10px;margin-top: 1px;margin-left: 5px">
              <a-form-item style="display:inline-block">
              <a-input
                addonBefore='供应商'
                v-decorator="['supplier']">
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
        添加种子登记
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
        <a-popover slot="supplier" slot-scope="text,record">
          <template slot="content">
            <p style="width:300px;">{{record.supplier}}</p>
          </template>
          <div v-html="f2(record.supplier)">{{f2(record.supplier)}}</div>
        </a-popover>
        <a-popover slot="remark" slot-scope="text,record">
          <template slot="content">
            <p style="width:500px;">{{record.remark}}</p>
          </template>
          <div v-html="f2(record.remark)">{{f2(record.remark)}}</div>
        </a-popover>
        <!--<span slot="methods" slot-scope="text">
           <div v-html="f2(text)">{{f2(text)}}</div>
        </span>-->
        <span slot="action" slot-scope="text, record">
                <a @click="handleEdit(record)">编辑</a>
                <a-divider type="vertical"/>
                <a-popconfirm title="确定删除吗?" @confirm="handleDelete(record.id)">
                    <a>删除</a>
                </a-popconfirm>
            </span>
      </a-table>
    </div>
    <SeedsRegisterModule ref="seedsRegisterModule"></SeedsRegisterModule>
  </div>

</template>
<script>
  import {deleteSeedAll, getSeedAll} from '@/api/permissonApi'
  import SeedsRegisterModule from './modules/SeedsRegisterModule'

  export default {
    name: "seedsRegister",
    data() {
      return {
        cropIds: 0,
        startTime: '',
        endTime: '',
        dataSource: [],
        loading: false,
        form: this.$form.createForm(this),
        processDatas: [],
        cropDatas: [{
          id: 0,
          cropName: '全部'
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
            title: '类型',
            dataIndex: 'type.displayName',
            key: 'type.displayName',
            align: "center",
          },
          {
            title: '种植批次名称',
            dataIndex: 'cropBatch.batchName',
            key: 'cropBatch.batchName',
            align: "center"
          },
          {
            title: '种子编码',
            dataIndex: 'seedCode',
            key: 'seedCode',
            align: "center"
          },
          {
            title: '品种',
            dataIndex: 'crop.cropName',
            key: 'crop.cropName',
            align: "center",
          },
          {
            title: '供应商',
            dataIndex: 'supplier',
            key: 'supplier',
            scopedSlots: {customRender: 'supplier'},
            align: "center",
          },
          {
            title: '备注',
            dataIndex: 'remark',
            key: 'remark',
            align: "center",
            scopedSlots: {customRender: 'remark'},
          },
          {
            title: '登记时间',
            dataIndex: 'registrationTime',
            key: 'registrationTime',
            align: "center",
          },
          {
            title: '操作',
            dataIndex: "action",
            key: "action",
            scopedSlots: {customRender: "action"},
            align: "center",
            width: '20%'
          }
        ]
      }
    },
    components: {
      SeedsRegisterModule
    },
    created() {
      this._loadData()
    },
    methods: {
      f2(text) {
        if (text != null) {
          let a = text.split('');
          let b = [];
          if (a.length > 10) {
            for (let i = 0; i < 10; i++) {
              b.push(a[i]);
            }
            let c = b.join('') + '...';
            return c.replace(/\n/g, "<br/>");
          } else {
            return text.replace(/\n/g, "<br/>");
          }
        }
        return text;
      },
      _loadData(params) {
        params === undefined ? null : params
        this.loading = true
        getSeedAll(params).then(res => {
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
        var userinfo = this.form.getFieldsValue();
        this._loadData(userinfo);
      },
      add() {
        this.$refs.seedsRegisterModule.title = '新增',
          this.$refs.seedsRegisterModule.open()
      },
      handleEdit(record) {
        this.$refs.seedsRegisterModule.title = '修改',
          this.$refs.seedsRegisterModule.open(record)
      },
      handleDelete(id) {
        deleteSeedAll({
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
        var userinfos = this.form.getFieldsValue();
        userinfos.pageNo=page.current
        userinfos.pageSize=page.pageSize
        getSeedAll(userinfos).then(res => {
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
