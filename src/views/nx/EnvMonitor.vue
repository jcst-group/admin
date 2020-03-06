/*
*   实时监测数据页面
*/
<template>
  <div style="width:100%;height:auto;padding:1px;background:white;">
    <div style="background:white;padding:10px 0 10px 0;">
      <div style="margin:0 1% 0 1%;">

        <div>
          <div style="min-width:172px;margin-bottom:10px;margin-top:10px;">
            <a-button type="primary" html-type="submit" icon="search" @click="handleSearch">查询</a-button>
            <a-button type="primary" icon="reload" style="margin-left: 8px" @click="handleReset">重置</a-button>
          </div>
        </div>
        <div class="select">
          <a-form
            :form="form"
            @submit="handleSearch">
            <div style="display: flex;width: 100%;flex-direction: column">
            <div style="flex: 1;">
              <div style="float:left;width:30%;height:50px;margin-bottom:10px;margin-top: 10px;">
                <a-form-item
                  label="设备名称"
                  v-bind="formItemLayout"
                >
                  <a-select
                    v-decorator="[
                    'equipmentId',
                    {
                      initialValue:equipment
                    }
                  ]"
                  >
                    <a-select-option v-for="v in equipmentList"  :key="v.id" :value="v.id" @click="ahandlesChange(v.id)">{{v.equipmentName}}</a-select-option>
                  </a-select>
                </a-form-item>
              </div>
              <div style="float:left;width:30%;height:50px;margin-bottom:10px;margin-top: 10px;">
                <a-form-item
                  label="测量时间"
                  v-bind="formItemLayout"
                >
                  <!--<a-date-picker
                    @change="onChange"
                    style="top: -38px;position: absolute;width: 180px;left: 79px;"
                    v-decorator="[
                    'monitorTime'
                  ]"
                  />-->
                  <a-range-picker @change="onChange"
                                  v-decorator="[
                      'monitorTime'
                    ]" />
                </a-form-item>
              </div>
              <div style="float:left;width:30%;height:50px;margin-bottom:10px;margin-top: 10px;">
                <a-form-item
                  label="监测地"
                  v-bind="formItemLayout"
                >
                  <a-select
                    v-decorator="[
                    'val',
                    {
                      initialValue:String(bases),
                    }
                  ]"
                  >
                    <a-select-option v-for="val in options" :key="val" :value="val" @click="handChange(val)">{{val}}</a-select-option>
                  </a-select>
                </a-form-item>
              </div>
            </div>
              <div style="flex: 1;" v-if="shows">
                <div style="float:left;width:30%;height:50px;margin-bottom:10px;margin-top: 10px;"  v-if="shows">
                  <a-form-item
                    label="所属基地"
                    v-bind="formItemLayout"
                  >
                    <a-select
                      v-decorator="[
                      'baseName',
                      {
                        initialValue:String(base),
                      }
                    ]"
                    >
                      <a-select-option v-for="v in baseinfos"  :key="v.id" :value="v.id" @click="handlesChange(v.id)">{{v.baseName}}</a-select-option>
                    </a-select>
                  </a-form-item>
                </div>
                <div style="float:left;width:30%;height:50px;margin-bottom:10px;margin-top: 10px;" v-if="shoos">
                  <a-form-item
                    label="所属地块"
                    v-bind="formItemLayout"
                  >
                    <a-select
                      v-decorator="[
                  'lotId',
                  {
                    initialValue:Number(basess)?Number(basess):'暂无地块信息',
                  }
                ]"
                    >
                      <a-select-option v-for="v in baseinfoss" :key="v.id" :value="v.id">{{v.lotName}}</a-select-option>
                    </a-select>
                  </a-form-item>
                </div>
                <div style="flex: 1"></div>
              </div>
            </div>
          </a-form>
        </div>
      </div>
      <div>
        <a-table :columns="columns"
                 :dataSource="dataSource"
                 :pagination="ipagination"
                 @change="handleTableChange"
                 bordered
                 :scroll="{ x: '190%' }"
                 rowKey="id">
          <span slot="action" slot-scope="text, record">
          <!-- <a @click="handleEdit(record)">编辑</a>
          <a-divider type="vertical"/> -->
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
    <EnvModule ref="envModule"/>
  </div>
</template>
<script>
  /*import WorkerModal from './modules/WorkerModal'*/
  import {deleteEnv, queryEnv,envmonitorList} from '@/api/allapi'
  import EnvModule from '@/views/module/EnvModule'
  import {getbaselist,getBlocksByBaseId,getEquipmentIdAndNameList}  from '@/api/userApi'
  const options = ['基地', '地块'];
  const columns = [{
    title: '设备名称',
    dataIndex: 'equipment.equipmentName',
    key: 'equipment.equipmentName',
    fixed: 'left',
    width: 180,
    align:"center"
  }, {
    title: '空气温度(℃)',
    dataIndex: 'airTemperature',
    key: 'airTemperature',
    align:"center"
  }, {
    title: '空气湿度(%RH)',
    dataIndex: 'airHumidity',
    key: 'airHumidity',
    align:"center"
  }, {
    title: '气压(kPa)',
    dataIndex: 'airPressure',
    key: 'airPressure',
    align:"center"
  }, {
    title: '风速(m/s)',
    dataIndex: 'windSpeed',
    key: 'windSpeed',
    align:"center"
  }, {
    title: '风向',
    dataIndex: 'windDirection',
    key: 'windDirection',
    align:"center",
    width: "6%",
    customRender:function (value) {
      if(value==0){
        return "东"
      }else if(0<value && value<90){
        return "东北"
      }else if(value==90){
        return "北"
      }else if(90<value && value<180){
        return "西北"
      }else if(value==180){
        return "西"
      }else if(180<value && value<270){
        return "西南"
      }else if(value==270){
        return "南"
      }else if(270<value && value<360){
        return "东南"
      }
    },
  }, {
    title: '降雨量(mm)',
    dataIndex: 'rainfall',
    key: 'rainfall',
    align:"center"
  }, {
    title: '土壤温度(℃)',
    dataIndex: 'soilTemperature',
    key: 'soilTemperature',
    align:"center"
  }, {
    title: '土壤湿度(%)',
    dataIndex: 'soilHumidity',
    key: 'soilHumidity',
    align:"center"
  }, {
    title: '土壤PH值',
    dataIndex: 'soilPh',
    key: 'soilPh',
    align:"center",
  }, {
    title: '光照时长(h)',
    dataIndex: 'illTime',
    key: 'illTime',
    align:"center",
    width: "5%",
  }, {
    title: '光照强度(Lux)',
    dataIndex: 'illIntensity',
    key: 'illIntensity',
    align:"center",
    width: "7%",
  }, /*{
    title: '二氧化碳浓度(ppm)',
    dataIndex: 'co2Value',
    key: 'co2Value',
    align:"center",
    width: "7%",
  }, {
    title: 'PM2.5值',
    dataIndex: 'pm25Value',
    key: 'pm25Value',
    align:"center",
    width: 90,
  },*/ {
    title: '测量时间',
    dataIndex: 'monitorTime',
    key: 'monitorTime',
    align:"center"
  }, {
    title: '操作',
    dataIndex: 'action',
    key: 'action',
    scopedSlots: {customRender: 'action'},
    align: "center",
    width: 170,
    fixed: 'right',
  }];


  const i = 1;

  export default {
    name: 'WorkerList',
    components: {
      /*WorkerModal,*/
      EnvModule
    },
    data() {
      return {
        windDir:'',
        formItemLayout: {
          labelCol: {
            xs: { span: 24 },
            sm: { span: 8 },
          },
          wrapperCol: {
            xs: { span: 24 },
            sm: { span: 16 },
          },
        },
        dateString:'',
        startTime:'',
        endTime:'',
        equipmentList:[],
        equipment:'',
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
      getEquipmentIdAndNameList().then((res=>{
        this.equipmentList=res.result;
      }));
    },
    mounted() {
      this.loadData();
    },
    methods: {
      onChange(date, dateString){
        if(dateString!=","){
          this.startTime=dateString[0];
          this.endTime=dateString[1];
        }else{
          this.userinfo.startTime="";
          this.userinfo.endTime="";
          this.startTime='';
          this.endTime='';
          this.loadData();
        }
        /*this.dateString = dateString;*/
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
        envmonitorList(params).then((res) => {
          if (res.success) {
            this.dataSource = res.result.list;
            this.ipagination.total = res.result.total;
          }
        })
      },
      handleOk() {

      },
      handlelook(record) {
        this.$refs.envModule.look(record);

      },
      handleEdit(record) {
        this.$refs.envModule.edit(record);

      },
      handleAdd() {
        this.$refs.envModule.add();
        this.$refs.envModule.title = "新增";
      },
      handleSearch(e) {
        e.preventDefault();
        this.form.validateFieldsAndScroll((err, values) => {
          if (!err) {
            this.userinfo.relationType=this.relationType;
            if(this.relationType == 1) {
              this.userinfo=this.form.getFieldsValue(['equipmentId']);
              this.userinfo.baseId=this.siteId;
              /*this.userinfo.monitorTime=this.dateString;*/
              this.userinfo.startTime=this.startTime;
              this.userinfo.endTime=this.endTime;
              this.userinfo.relationType=this.relationType;
              this.loadData();
            }else {
             /* this.userinfo.monitorTime=this.dateString;*/
              if(this.form.getFieldsValue(['lotId']).lotId=="暂无地块信息"){
                if(this.siteId!=""){
                  this.$message.info("当前基地暂无地块信息")
                }else{
                  this.userinfo=this.form.getFieldsValue(['equipmentId']);
                  this.userinfo.startTime=this.startTime;
                  this.userinfo.endTime=this.endTime;
                  this.userinfo.lotId="";
                  this.userinfo.relationType=this.relationType;
                  this.loadData();
                }
              }else{
                this.userinfo=this.form.getFieldsValue(['lotId','equipmentId']);
                this.userinfo.startTime=this.startTime;
                this.userinfo.endTime=this.endTime;
                this.userinfo.relationType=this.relationType;
                this.loadData();
              }
            }
          }
        });
      },
      handleDelete(id) {
        console.log(id);
        var that = this;
        let params = {};
        params.id = id;
        deleteEnv(params).then((res) => {
          if (res.success) {
            that.$message.success(res.message);
            that.loadData();
          } else {
            that.$message.warning(res.message);
          }
        });
      },
      handleReset() {
        this.startTime="";
        this.endTime="";
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
        this.baseinfoss={};
        this.basess="";
        if(val == '基地') {
          this.relationType = 1;
          this.shows = true;
          this.shoos = false;
          this.showssss=false;
          this.showsss=true;
          getbaselist().then((res=>{
            this.baseinfos=res.result;
          }));
        }else if(val == '地块') {
          this.relationType = 2;
          this.shows = true;
          this.shoos = true;
          getbaselist().then((res=>{
            this.baseinfos=res.result;
          }));
        }
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
      ahandlesChange(id){

      },
      isWind(value){
        if(value==0){
          this.windDir="东"
        }else if(0<value<90){
          this.windDir="东北"
        }else if(value==90){
          this.windDir="北"
        }else if(90<value<180){
          this.windDir="西北"
        }else if(value==180){
          this.windDir="西"
        }else if(180<value<270){
          this.windDir="西南"
        }else if(value==270){
          this.windDir="南"
        }else if(270<value<360){
          this.windDir="东南"
        }
      }
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
      left: 30.4%;
      width: 155px !important;
    }
    .aSelect1{
       left: 32% !important;
       width: 150px !important;
     }
    .aSelect2{
      left: 32% !important;
      width: 150px !important;
    }
    .selecta{
      width: 20% !important;
    }
  }
  @media screen and (max-width: 1400px) {
    .aSelect{
      right: -75% !important;
      width: 120px !important;
    }
    .aSelect1{
      left: 40% !important;
      width: 150px !important;
    }
    .aSelect2{
      left: 32% !important;
      width: 150px !important;
    }
  }
  @media screen and (max-width: 1200px) {
    .aSelect{
      right: -75% !important;
      width: 120px !important;
    }
    .aSelect1{
      left: 40% !important;
      width: 110px !important;
    }
    .aSelect2{
      left: 40% !important;
      width: 150px !important;
    }
  }


</style>
