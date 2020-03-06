<template>
 <div>
    <div class="addbut">
        <a-button class="btn" type="primary" icon="reload" @click="handleReset">重置</a-button>
        <a-button class="btn" type="primary" icon="search" v-if="showsss" @click="handleSearch">查询</a-button>    
        <a-button class="btn" type="primary" icon="plus" @click="add">新增监测设备</a-button>
    </div>
    <div class="input">
        <span class="title">监测设备编号：</span>
        <a-input v-model="equipmentId" class="inp"/>
        <span class="title">监测设备名称：</span>
        <a-input v-model="equipmentName" class="inp"/>
    </div>
   <a-table :columns="columns"
            :dataSource="dataSource"
            :pagination="ipagination"
            @change="handleTableChange"
            :loading="loading"
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
        <AddEquipment ref="AddEquipment"/>
        <EditEquipment ref="EditEquipment"/>
        <LookEquipment ref="LookEquipment"/>
  </div>
</template>
<script>
  import AddEquipment from '@/views/ddwbmodule/addequipment'
  import EditEquipment from '@/views/ddwbmodule/editequipment'
  import LookEquipment from '@/views/ddwbmodule/lookequipment'
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
    name: "equipment",
    components: {
      AddEquipment,
      EditEquipment,
      LookEquipment
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
        equipmentId:'',
        equipmentName:'',
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
        // param.field = this.getQueryField();
        param.pageNo = this.ipagination.current;
        param.pageSize = this.ipagination.pageSize;
        //return filterObj(param);
        /*param.baseName = this.form.getFieldsValue(['baseName']).baseName;
        alert(param.baseName);*/
        return param;
      },
      loadData(arg) {
        if (arg === 1) {
          this.ipagination.current = 1;
        }
        this.loading=true;
        let params = this.getQueryParams();//查询条件
        getEquipmentList(params).then((res) => {
          if (res.success) {
            this.dataSource = res.result.list;
            this.ipagination.total = res.result.total;
            this.loading=false;
          }
        })
      },
      add(){
        this.$refs.AddEquipment.add();
      },
      handlelook(record) {
        this.$refs.LookEquipment.look(record);
      },
      handleEdit(record) {
        this.$refs.EditEquipment.edit(record);
      },
      handleReset(){
        this.equipmentId='';
        this.equipmentName='';
        this.userinfo={};
        this.loadData();
      },
      handleSearch(){
        this.userinfo={};
        if(this.equipmentId){
          this.userinfo.equipmentId=this.equipmentId;
        }
        if(this.equipmentName){
          this.userinfo.equipmentName=this.equipmentName;
        }
       this.loadData();
      },
      handleDelete(id) {
       // console.log(id);
        var that = this;
        let params = {};
        params.id = id;
        delEquipment(params).then((res) => {
          if (res.success) {
            that.$message.success(res.message);
            that.loadData();
          } else {
            that.$message.warning(res.message);
          }
        });
      },
      handleTableChange(pagination, filters, sorter) {
       // console.log("handleTableChange pagination")
        //console.log(pagination)
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
<style lang='stylus' scoped>
    .btn
        float right
        background #2c909c
        border-color #2c909c
        color #fff
        line-height 18px
        margin-right 10px
    .inp
        width 10%
        margin-right 10px
    .input
        margin-bottom 20px    
</style>
