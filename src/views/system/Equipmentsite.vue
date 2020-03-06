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
            <div style="float:left;width: 20%;height:50px;margin-right:1%;margin-bottom:10px;min-width: 300px">
              <a-form-item
                label="设备"
                v-bind="formItemLayout"
              >
                <a-select
                  style="width: 80%;margin-left: 2%"
                  v-decorator="[
                  'equipmentId',
                  {
                     initialValue:equ
                   }
                 ]"
                >
                  <a-select-option v-for="v in equipments" :key="v.id" :value="v.id" @click="shandChangeBas(v.id)">{{v.equipmentName}}</a-select-option>
                </a-select>
              </a-form-item>
            </div>
            <div style="float:left;width: 10%;height:50px;margin-left:-72px;margin-right:2%;margin-bottom:10px;min-width: 300px" class="asel">
              <a-form-item
                label="监测地"
                v-bind="formItemLayout"
              >
                <a-select
                  style="width: 80%;margin-left:3%"
                  v-decorator="[
                    'val',
                    {
                      initialValue:String(bases)
                    }
                  ]"
                >
                  <a-select-option v-for="val in options" :key="val" :value="val" @click="handChange(val)">{{val}}</a-select-option>
                </a-select>
              </a-form-item>
            </div>
            <div v-if="shows" style="float:left;width: 20%;margin-left:-92px;height:50px;margin-right:2%;margin-bottom:10px;min-width: 258px">
              <a-form-item
                label="基地"
                v-bind="formItemLayout"
              >
                <a-select
                  style="width: 80%;margin-left: 2%"
                  v-decorator="[
                      'baseId',
                      {
                        initialValue:base,
                      }
                    ]"
                >
                  <a-select-option v-for="v in baseinfos"  :key="v.id" :value="v.id" @click="handlesChange(v.id)">{{v.baseName}}</a-select-option>
                </a-select>
              </a-form-item>
            </div>
            <div v-if="shoos" style="margin-left:-92px;float:left;width: 20%;height:50px;margin-right:1%;margin-bottom:10px;min-width: 277px">
              <a-form-item
                label="地块"
                v-bind="formItemLayout"
              >
                <a-select
                  style="width: 80%;margin-left: 2%"
                  v-decorator="[
                  'lotId',
                  {
                    initialValue:basess,
                  }
                ]"
                >
                  <a-select-option v-for="v in baseinfoss" :key="v.id" :value="v.id">{{v.lotName}}</a-select-option>
                </a-select>
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
          新增设备与监测地关联数据
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
    <EquipSiteModule ref="equipSiteModule"/>
    <EquipSiteComModule ref="equipSiteComModule"/>
    <EquipSitesModule ref="equipSitesModule"/>
  </div>
</template>
<script>
  /*import WorkerModal from './modules/WorkerModal'*/
  import EquipSiteModule from '@/views/module/EquipSiteAddModule'
  import EquipSiteComModule from '@/views/module/EquipSiteComModule'
  import EquipSitesModule from '@/views/module/EquipSitesModule'
  import {getEquipmentSiteList,deleteEquipmentSiteRel,getBaseIdAndBaseName,getBaseIdAndBaseNameMe,getLotIdAndName,getLotIdAndNameByBaseIds,getEquipmentIdAndNameList,getBaseIdAndBaseNames}  from '@/api/userApi'
  const options = ['基地', '地块'];
  const columns = [{
    title: '设备名称',
    dataIndex: 'equipment.equipmentName',
    key: 'equipment.equipmentName',
    align:"center"
  }, {
    title: '监测地类型',
    dataIndex: 'relationType',
    key: 'relationType',
    align:"center",
    customRender:function (text) {
      if(text==1){
        return "基地";
      }else{
        return "地块";
      }
    },
  }, {
    title: '基地名称',
    dataIndex: 'baseInfo.baseName',
    key: 'baseInfo.baseName',
    align:"center"
  }, {
    title: '地块名称',
    dataIndex: 'lot.lotName',
    key: 'lot.lotName',
    align:"center",
    customRender:function (text) {
      if(text==null){
        return "";
      }else{
        return text;
      }
    },
  }, {
    title: '创建时间',
    dataIndex: 'createTime',
    key: 'createTime',
    align:"center",
  }, {
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
      EquipSiteModule,
      EquipSiteComModule,
      EquipSitesModule
    },
    data() {
      return {
        formItemLayout: {
          labelCol: {
            xs: { span: 24 },
            sm: { span: 4 },
          },
          wrapperCol: {
            xs: { span: 24 },
            sm: { span: 16 },
          },
        },
        showsss:true,
        showssss:false,
        assss:false,
        aaaa:'暂无地块信息',
        columns,
        options,
        shows: false,
        shoos: false,
        facility:'请选择设备',
        base:'请选择所属基地',
        bases:'',
        basess:'',
        userinfo:{},
        baseinfo:[],
        baseinfoss:[],
        baseinfos:[],
        siteId:'',
        relationType:'',
        loading: false,
        queryParam: {},
        equipments:[],
        equ:'',
        ipagination:{
          current: 1,
          pageSize: 10,
          pageSizeOptions: ['10', '20', '30'],
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
      this.equ="";
      getEquipmentIdAndNameList().then((res=>{
        this.equipments = res.result;
      }));
    },
    methods: {
      shandChangeBas(id){
      },
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
        let params = this.getQueryParams();//查询条件
        getEquipmentSiteList(params).then((res) => {
          if (res.success) {
            this.dataSource = res.result.list;
            for(let index in this.dataSource){
              console.log(this.dataSource[index].baseInfo);
              if(this.dataSource[index].baseInfo==null){
                this.dataSource[index].lot=[];
              }
            }
            this.ipagination.total = res.result.total;
          }
        })
      },
      add(){
        this.$refs.equipSiteModule.add();
        this.$refs.equipSiteModule.title="新增关联数据"
        this.$refs.equipSiteModule.okText="确认添加"
      },
      handleOk() {

      },
      handleTableChange(pagination, filters, sorter) {
        console.log("handleTableChange pagination")
        console.log(pagination)
        if (Object.keys(sorter).length > 0) {
          this.isorter.column = sorter.field;
          this.isorter.order = "ascend" == sorter.order ? "asc" : "desc"
        }
        this.ipagination = pagination;
        this.loadData();
      },
      handChange(val) {
        if(val == '基地') {
          this.relationType = 1;
          this.shows = true;
          this.shoos = false;
          getBaseIdAndBaseNames().then((res=>{
            this.baseinfos=res.result;
          }));
        }else if(val == '地块'){
          this.relationType = 2;
          this.shows = true;
          this.shoos = true;
          let parameter = {};
          getBaseIdAndBaseNames(parameter).then((res=>{
            this.baseinfos=res.result;
            this.base=res.result[0].id;
            let parameters = {};
            parameters.baseId=this.base;
            getLotIdAndNameByBaseIds(parameters).then((res=>{
              this.baseinfoss=res.result;
              this.basess=res.result[0].id;
            }));
          }));
        }
      },
      handleEdit(record){
        this.$refs.equipSiteComModule.edit(record,1);
        this.$refs.equipSiteComModule.title="编辑关联数据"
        this.$refs.equipSiteComModule.okText="确认修改"
      },
      handlelook(record) {
        this.$refs.equipSitesModule.look(record);
      },
      /*handleAdd() {
        this.$refs.equipSiteModule.add();
        this.$refs.equipSiteModule.title = "新增";
      },*/
      handleSearch(e) {
        e.preventDefault();
        this.form.validateFieldsAndScroll((err, values) => {
          if (!err) {
            this.userinfo=this.form.getFieldsValue(['equipmentId','baseId']);
            this.userinfo.relationType=this.relationType;
            if(this.userinfo.relationType==2){
              this.userinfo=this.form.getFieldsValue(['baseId','lotId']);
            }
            if(this .userinfo.baseId!="请选择所属基地"){
              this.loadData();
            }else{
              this.$message.info('请选择所属基地');
            }
          }
        });
      },
      handleDelete(id) {
        console.log(id);
        var that = this;
        let params = {};
        params.id = id;
        deleteEquipmentSiteRel(params).then((res) => {
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
      handlesChange(id) {
        this.baseinfoss=[];
        this.shoow=true;
        /*this.baseId*/
        this.basess="";
        let parameters = {};
        parameters.baseId = this.siteId =  id;
        getLotIdAndNameByBaseIds(parameters).then((res=>{
          this.baseinfoss=res.result;
          this.basess=res.result[0].id;
        }));
       /* getBlocksByBaseId(parameter).then((res=>{
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
        }));*/
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
  @media screen and (max-width: 1700px) {
    .aSelect{
      left: 30%;
      width: 75% !important;
    }
    .aSelect1{
      left: 33% !important;
      width: 70% !important;
    }
    .aSelect2{
      left: 33% !important;
      width: 70% !important;
    }
    .aSelect3{
      left: 30% !important;
      width: 75% !important;
    }
    .aSelect5{
      left: 20% !important;
      width: 80% !important;
    }
  }
  @media screen and (max-width: 1400px) {
    .aSelect{
       right: -70% !important;
     }
  }


</style>
