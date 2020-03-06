<template>
  <div style="width:100%;height:auto;padding:1px;background:white;">
    <div style="background:white;padding:10px 0 10px 0;">
      <div style="margin:0 1% 0 0;">

        <div>
          <div style="min-width:172px;margin-bottom:10px;margin-top:10px;">
            <a-button type="primary" html-type="submit" icon="search" v-if="showsss" @click="handleSearch">查询</a-button>
            <a-button type="primary" icon="reload" style="margin-left: 8px" @click="handleReset">重置</a-button>
          </div>
        </div>
        <div class="select">
          <a-form
            :form="form"
            @submit="handleSearch">
            <div style="float:left;width:24.25%;height:50px;margin-right:1%;margin-bottom:10px;">
              <a-form-item>
                <a-input
                  v-decorator="['equipmentId']"
                  addonBefore="监测设备编号"
                />
              </a-form-item>
            </div>
            <div style="float:left;width:24.25%;height:50px;margin-right:1%;margin-bottom:10px;">
              <a-form-item>
                <a-input
                  v-decorator="['equipmentName']"
                  addonBefore="监测设备名称"
                />
              </a-form-item>
            </div>
          </a-form>
        </div>
      </div>
      <div style="margin: 0 0 16px 0;">
        <a-button
          type="primary"
          icon="plus"
          @click="add"
        >
          新增监测设备
        </a-button>
      </div>
      <div>
        <a-table :columns="columns"
                 :dataSource="dataSource"
                 :pagination="ipagination"
                 @change="handleTableChange"
                 bordered
                 rowKey="id">
          <span slot="action" slot-scope="text, record">
          <a @click="handleEdit(record)">编辑</a>
          <a-divider type="vertical"/>
          <a-dropdown>
            <a class="ant-dropdown-link">
              更多 <a-icon type="down"/>
            </a>
            <a-menu slot="overlay">
              <a-menu-item>
                <a href="javascript:;" @click="handlelook(record)">详情</a>
              </a-menu-item>

              <a-menu-item>
                <a-popconfirm title="确定删除吗?" @confirm="handleDelete(record.id)">
                  <a>删除</a>
                </a-popconfirm>
              </a-menu-item>
            </a-menu>
          </a-dropdown>
        </span>
        </a-table>
      </div>

    </div>
    <EquipModule ref="equipModule"/>
  </div>
</template>
<script>
  /*import WorkerModal from './modules/WorkerModal'*/
  import EquipModule from '@/views/module/EquipModule'
  import {addEquipment,delEquipment,getEquipmentList}  from '@/api/ddwbApi'
  const options = ['基地', '地块'];
  const columns = [{
    title: '监测设备编号',
    dataIndex: 'equipmentId',
    key: 'equipmentId',
    align:"center"
  }, {
    title: '监测设备名称',
    dataIndex: 'equipmentName',
    key: 'equipmentName',
    align:"center"
  }, {
    title: '设备所在基地',
    dataIndex: 'baseName',
    key: 'baseName',
    align:"center"
  }, {
    title: '设备安装地址',
    dataIndex: 'equipmentAddress',
    key: 'equipmentAddress',
    align:"center"
  },  {
    title: '操作',
    dataIndex: 'action',
    key: 'action',
    scopedSlots: {customRender: 'action'},
    align: "center",
  }];


  const i = 1;

  export default {
    name: 'WorkerList',
    components: {
      /*WorkerModal,*/
      EquipModule
    },
    data() {
      return {
        showsss:true,
        showssss:false,
        assss:false,
        aaaa:'暂无地块信息',
        columns,
        options,
        shows: false,
        shoos: false,
        base:'请选择所属基地',
        bases:'请选择监测地',
        basess:'',
        userinfo:{},
        baseinfo:[],
        baseinfoss:[],
        baseinfos:[],
        siteId:'',
        relationType:'',
        loading: false,
        queryParam: {},
        ipagination: {
          current: 1,
          pageSize: 10,
          pageSizeOptions: ['10', '20', '50'],
          showTotal: (total, range) => {
            return range[0] + "-" + range[1] + " 共" + total + "条"
          },
          showQuickJumper: true,
          showSizeChanger: true,
          total: 0
        },
        dataSource: [],
        form: this.$form.createForm(this),
      }
    },
    created() {
    },
    methods: {
      getQueryParams() {
        let param = Object.assign({}, this.userinfo);
        param.pageNo = this.ipagination.current;
        param.pageSize = this.ipagination.pageSize;
        return param;
      },
      loadData(arg) {
        if (arg === 1) {
          this.ipagination.current = 1;
        }
        let params = this.getQueryParams();//查询条件
        getEquipmentList(params).then((res) => {
          if (res.success) {
            this.dataSource = res.result.list;
            this.ipagination.total = res.result.total;
          }
        })
      },
      add(){
        this.$refs.equipModule.add();
        this.$refs.equipModule.title="新增监测设备"
        this.$refs.equipModule.okText="确认添加"
      },
      handleOk() {

      },
      handlelook(record) {
        this.$refs.equipModule.look(record);
        this.$refs.equipModule.okText="确认"
      },
      handleEdit(record) {
        this.$refs.equipModule.edit(record,1);
        this.$refs.equipModule.title="编辑监测设备"
        this.$refs.equipModule.okText="确认修改"
      },
      handleAdd() {
        this.$refs.equipModule.add();
        this.$refs.equipModule.title = "新增";
      },
      handleSearch(e) {
        e.preventDefault();
        this.form.validateFieldsAndScroll((err, values) => {
          if (!err) {
            this.userinfo=this.form.getFieldsValue(['equipmentId','equipmentName'])
            for(let k in this.userinfo){
              if(this.userinfo[k]!=undefined && this.userinfo[k].trim()==''){
                this.userinfo[k] = undefined
              }
            }
            this.loadData();
          }
        });
      },
      handleDelete(id) {
        var that = this;
        let params = {};
        params.id = id;
        deleteEquipment(params).then((res) => {
          if (res.success) {
            that.$message.success(res.message);
            that.loadData();
          } else {
            that.$message.warning(res.message);
          }
        });
      },
      handleReset() {
        this.shows=false;
        this.shoos=false;
        this.form.resetFields();
        this.loading = true;
        this.loading = false;
        this.relationType="";
        this.userinfo={};
        this.showsss=true;
        this.showssss=false;
        this.baseId="";
        this.siteId="";
        this.loadData();
      },
      handleTableChange(pagination, filters, sorter) {
        if (Object.keys(sorter).length > 0) {
          this.isorter.column = sorter.field;
          this.isorter.order = "ascend" == sorter.order ? "asc" : "desc"
        }
        this.ipagination = pagination;
        this.loadData();
      },
      handlesChange(id) {
        this.shoow=true;
        let parameter = new Object();
        /*this.baseId*/
        parameter.baseId = this.siteId =  id;
        this.basess="";
        getBlocksByBaseId(parameter).then((res=>{
          this.baseinfoss=res.result;
          if(this.baseinfoss==""&&this.relationType==2){
            this.showssss=true;
            this.showsss=false;
          }else{
            this.showssss=false;
            this.showsss=true;
            if(this.baseinfoss!="") {
              this.basess=res.result[0].id;
            }else{
              this.basess=false;
            };
          }

        }));
      },
    },
    mounted() {
      this.loadData();
    },

  }
</script>
<style scoped>
  .select::after {
    clear: both;
    content: '';
    display: block;
    width: 0;
    height: 0;
  }
  @media screen and (max-width: 1700px){

  }
  @media screen and (max-width: 1700px) {
    .aSelect{
      left: 30%;
      width: 150px !important;
    }
    .aSelect1{
      left: 32% !important;
      width: 150px !important;
    }
    .aSelect2{
      left: 32% !important;
      width: 150px !important;
    }
  }
  @media screen and (max-width: 1400px) {
    .aSelect{
      right: -70% !important;
    }
  }


</style>
