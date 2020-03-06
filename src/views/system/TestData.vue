<template>
<div style="width:100%;height:auto;padding:1px;background:white;">
  <div style="background:white;padding:10px 0 10px 0;">
     <div style="margin:0 1% 0 0;">

    <div>
      <div style="min-width:172px;margin-bottom:10px;margin-top:10px;">
        <a-button type="primary" html-type="submit" icon="search" @click="handleSearch">查询</a-button>
        <a-button type="primary" icon="reload" style="margin-left: 8px"  @click="handleReset">重置</a-button>
      </div>
      <div class="select">
         <a-form
         :form="form"
         @submit="handleSearch" >
        <div style="float:left;width:24%;height:50px;margin-bottom:10px;margin-top: 10px;">
          <a-form-item
            label="产品名称"
            v-bind="formItemLayout"
          >
              <a-input
                style="max-width: 220px"
              v-decorator="[
          'produceName',
        ]"></a-input>
            </a-form-item>
        </div>
           <div style="float:left;width:24%;height:50px;margin-bottom:10px;margin-top: 10px">
             <a-form-item
               label="检测时间"
               v-bind="formItemLayout"
               >
               <a-date-picker
                 v-decorator="[
                    'testTime',
                  ]"
                 @change="onChange"
               />
             </a-form-item>
           </div>
           <div style="float:left;width:24%;height:50px;margin-bottom:10px;margin-top: 10px">
             <!--<a-form-item
               v-bind="formItemLayout"
               label="地区"
             >
               <a-cascader :options="options" placeholder="请选择省/市/(县，区)" @change="onChangmap" />
             </a-form-item>-->
             <a-form-item
               v-bind="formItemLayout"
               label="地区"
             >
               <a-tree-select
                 :dropdownStyle="{ maxHeight: '300px', overflow: 'auto' }"
                 :treeData="treeData"
                 @change="onchange"
                 :value="value"
               />
             </a-form-item>
           </div>
           <div style="float:left;width:24%;height:50px;margin-bottom:10px;margin-top: 10px">
             <a-form-item
               label="地区批次"
               v-bind="formItemLayout"
             >
               <a-select
                 v-decorator="[
                    'batchId',
                    {
                      initialValue:String(base),
                    }
                  ]"
               >
                 <a-select-option v-for="v in baseinfo"  :key="v.id" :value="v.id">{{v.batchName}}</a-select-option>
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
        添加产品
      </a-button>
</div>
<div>
  <a-table :columns="columns"
    :dataSource="datas"
    :pagination="pagination"
    :loading="loading"
    rowKey="id"
    bordered
    @change="handleTableChange"
  >
    <span slot="item" slot-scope="text,record">
    <a @click="allItem(record)">查看所有项目</a>
    </span>
   <span slot="action" slot-scope="text,record">
          <a @click="handleEdit(record)">编辑</a>
          <a-divider type="vertical" />
          <a-dropdown>
            <a class="ant-dropdown-link">
              更多 <a-icon type="down" />
            </a>
            <a-menu slot="overlay">
              <a-menu-item >
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
  <TestModule ref="usermodule"/>
  <TestItemModule ref="testmodule"/>
</div>

</template>

<script>
//import { version } from 'punycode';
import TestModule from '@/views/module/TestModule'
import TestItemModule from '@/views/module/TestItemModule'
import { deleteUser,getUsers,getProducttestlist,deleteproduce,getAllBaseInfo,getbaselist,getAllArea,getBatchByCropId,getmap } from '@/api/userApi'
const columns = [{
  title: '所属基地',
  dataIndex: 'batch.baseInfo.baseName',
  key:'batch.baseInfo.baseName',
  align:"center"
}, {
  title: '农产品名称',
  dataIndex: 'produceName',
  key:'produceName',
  align:"center"
}, {
  title: '所属批次',
  dataIndex: 'batch.batchName',
  key: 'batch.batchName',
  align:"center"
},{
  title: '收成时间',
  dataIndex: 'harvestTime',
  key:'harvestTime',
  align:"center"
},  {
  title: '检测时间',
  dataIndex: 'testTime',
  key: 'testTime',
  align:"center"
  //width: '11%',
}, {
  title: '检测次数',
  dataIndex: 'testSequence',
  key: 'testSequence',
  align:"center"

},{
  title: '检测项目',
  dataIndex: 'item',
  key: 'item',
  scopedSlots: { customRender: 'item' },
  align:"center",
},  {
  title: '操作',
  dataIndex: 'action',
  key: 'action',
  scopedSlots: { customRender: 'action' },
  align:"center",
}];

export default {
  components:{
    TestModule,
    TestItemModule
  },
  data() {
    return {
      level:"",
      treeData:[],
      value:'',
      area:'',
      options: [],
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
      visible:false,
      loading: false,
      columns,
      baseinfo:[],
      userinfo:{
        testTime:""
      },
      datas:[],
      batchs:[],
      nbatch:false,
      dateString:'',
      base:'',
      pagination:{
          current: 1,
          pageSize: 10,
          pageSizeOptions: ['10', '20', '30'],
          showTotal: (total, range) => {
            return range[0] + "-" + range[1] + " 共" + total + "条"
          },
          showQuickJumper: true,
          showSizeChanger: true,
          total: 0},
          form: this.$form.createForm(this),
    }
  },
  created() {
      this.loadData();
      this.loadmap();
    getbaselist({}).then((res)=>{
      if(res.success){
        this.batchs=this.getTreeData(res.result);
        this.nbatch = true;
      }else{
        this.$message.info(res.message)
      }
      console.log(res);
    });
    },
  methods: {
   /* imgurl(record){
      let imgshowapi = '/api/upload/show'
     // console.log(record)
            if(record.avatar){
             return imgshowapi+'?fileName='+record.avatar
            }
    },*/
    loadmap(){
      this.treeData=[];
      getmap().then((res)=>{
        for(let i=0;i<res.result.length;i++){
          var a={};
          a.value=String(res.result[i].id)+'-'+'1';
          a.key=String(res.result[i].id);
          a.title=res.result[i].name;
          a.children=[];
          if(res.result[i].children.length>0){
            for(let j=0;j<res.result[i].children.length;j++){
              var b={};
              b.value=String(res.result[i].children[j].id)+'-'+'2';
              b.key=String(res.result[i].children[j].id);
              b.title=res.result[i].children[j].name;
              b.children=[];
              if(res.result[i].children[j].children.length>0){
                for(let k=0;k<res.result[i].children[j].children.length;k++){
                  var c={};
                  c.value=String(res.result[i].children[j].children[k].id)+'-'+'3';
                  c.key=String(res.result[i].children[j].children[k].id);
                  c.title=res.result[i].children[j].children[k].name;
                  b.children.push(c);
                }
              }
              a.children.push(b);
            }
          }
          this.treeData.push(a);
        }
      });
    },
    onChangmap(value){
      this.label=[];
      this.address=[];
      this.par={};
      this.areaCode="";
      for(let i=0;i<value.length;i++){
        let a=value[i].split('-');
        this.address.push(a[1]);
        this.label.push(a[0]);
      }
      if(value.length>1){
        this.areaCode=this.label[2];
        this.par.province=this.address[0];
        this.par.provinceCode=this.label[0];
        this.par.city=this.address[1];
        this.par.cityCode=this.label[1];
        this.par.area=this.address[2];
        this.par.areaCode=this.label[2];
      }else{
        this.par.province=this.address[0];
        this.par.provinceCode=this.label[0];
        this.areaCode=this.par.provinceCode;
      }
      let params = {};
      params.areaCode=this.areaCode;
      if(this.areaCode!=null&&this.areaCode!=""){
        getCropsByAreaCode(params).then((res=>{
          if(res.success){
            this.crops=this.getTreeData(res.result)
          }else{
            this.$message.info(res.message)
          }
        }))
      }else{
        this.crops="";
        this.baseinfo="";
        this.form.resetFields();
      }
    },
    onchange (value, label, extra) {
// console.log('onchange_value', value);
// console.log('onchange_lable', label);
      /**/
      this.form.resetFields('batchId');
      this.batchId='';
      this.base='';
      this.value=value;
      let a=value.split('-');
      this.area=a;
      this.area=this.area[0];
      this.level=a[1];
      let params={};
      params.areaCode=this.area;
      params.areaLevel=a[1];
      getBatchByCropId(params).then((res=>{
        this.baseinfo=res.result;
      }));
    },
    getTreeData(data){
      console.log(data)
      if(data instanceof  Array){
        let xx = [];
        for(let o in data){
          let obj = data[o]
          let item = this.getTreeData(obj);
          xx.push(item);
        }
        return xx;
      }else{
        let item = {};
        item.title = data.baseName;
        item.value = data.id;
        item.key = data.id;/*
        alert(this.nbatch);*/
        /*if( this.nbatch == true) {
          item.children = this.getTreeData(this.baseinfo);
          this.nbatch = false;
        }*/
        return item;
      }
    },
    onChange(date, dateString){
      this.dateString = dateString;
      if(dateString==""){
        this.userinfo.testTime='';
        this.loadData();
      }
    },
    allItem(record){
      this.$refs.testmodule.look(record);
    },
    add(){
    this.$refs.usermodule.add();
    this.$refs.usermodule.title="添加产品监测"
    this.$refs.usermodule.okText="确认添加"
    },
    handlelook(record){
    this.$refs.usermodule.look(record);
    this.$refs.usermodule.title="查看详情"
    this.$refs.usermodule.okText="确认"
    this.$refs.usermodule.pw=false
    this.$refs.usermodule.npw=true
    },
    handleTableChange(xx){
      console.log("handleTableChange")
      console.log(xx)
    this.pagination = xx
      this.loadData()
    },
    getQueryParams(){
      console.log(this.userInfo)
      let param = Object.assign({}, this.userinfo);
      // param.field = this.getQueryField();
      param.pageNo = this.pagination.current;
      param.pageSize = this.pagination.pageSize;
      //return filterObj(param);
      return param;
    },
    loadData(callback){
      this.loading = true;
      const params = this.getQueryParams()
      //this.$store.dispatch('user/getlist',params)
      getProducttestlist(params).then((res=>{
        if(res.success==true){
          this.loading = true;
          //this.$store.commit('user/SET_PROTESTLIST',res.result)
          this.datas = res.result.list;
          this.loading = false;
          this.pagination.total = res.result.total;
        }else{
          this.$message.info(res.message)
        }
      }))
      if(callback!=undefined){
        callback()
      }
      this.loading = false;
    },
    refreshTestItemModal(pid){
      this.loadData();
      const refreshPro = this.datas.filter(item => pid === item.id)[0]
      console.log("refreshTestItemModal")
      console.log(refreshPro)
      this.$refs.usermodule.look(refreshPro);
      this.$refs.usermodule.naddd = true;
      this.$refs.usermodule.add = false;
    },
     handleDelete: function(id){
        let that = this;
        deleteproduce({id: id}).then((res)=>{
          if(res.success){
            that.$message.success(res.message);
            that.loadData();
          }else{
            that.$message.warning(res.message);
          }
        });
      },
      handleEdit: function(record){
        let a=1;
       this.$refs.usermodule.edit(record,a);
       this.$refs.usermodule.title="编辑产品监测"
       this.$refs.usermodule.okText="确认修改"
      },
      handleOk(){
        this.visible=false
      },
      handleReset(){
      this.form.resetFields();
      this.dateString='';
      this.userinfo={};
      this.area="";
      this.value="";
      this.level='';
      this.baseinfo=[];
      this.loadData();
    },
    handleSearch(e){
       e.preventDefault();
       this.form.validateFieldsAndScroll((err, values) => {
        if (!err) {
          if(this.form.getFieldsValue(['batchId']).batchId!='请选择批次') {
            this.userinfo=this.form.getFieldsValue(['produceName','batchName','batchId']);
            this.userinfo.testTime=this.dateString;
            this.userinfo.areaLevel=this.level;
            this.userinfo.areaCode=this.area;
          }else{
            this.userinfo=this.form.getFieldsValue(['produceName']);
            this.userinfo.areaLevel=this.level;
            this.userinfo.areaCode=this.area;
            this.userinfo.testTime=this.dateString;
          }
          /*for(let k in this.userinfo){
            if(this.userinfo[k]!=undefined && this.userinfo[k].trim()==''){
              this.userinfo[k] = undefined
            }
          }*/
          this.loadData()
        }
      });
    }
    },

}
</script>
<style scoped>
.select::after{
  clear:both;
  content:'';
  display:block;
  width:0;
  height:0;
}
@media screen and (max-width: 1700px) {
}
@media screen and (max-width: 1400px) {
}
</style>
