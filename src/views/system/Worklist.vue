<template>
<div style="width:100%;height:auto;padding:16px;background:white;">
  <div style="background:white;padding:10px 0 10px 0;">
     <div style="margin:0 1% 0 1%;">

    <div>
      <div style="min-width:172px;margin-bottom:10px;margin-top:10px;">
        <a-button type="primary" html-type="submit" icon="search" @click="handleSearch">查询</a-button>
        <a-button type="primary" icon="reload" style="margin-left: 8px"  @click="handleReset">重置</a-button>
      </div>
      <div class="select">
         <a-form
         :form="form"
         @submit="handleSearch" >
        <div style="float:left;width:24.25%;height:50px;margin-right:1%;margin-bottom:10px;">
          <a-form-item>
              <a-input
              v-decorator="[
          'workOrderName',
        ]"
        addonBefore="工单名称"></a-input>
            </a-form-item>
            </div>
            <div style="float:left;margin-right:20px;">
            <a-form-item>
             <a-radio-group @change="onFilterChange"
              v-model="filter.send"
              buttonStyle="solid">
              <a-radio-button value="0" >未指派</a-radio-button>
              <a-radio-button value="1">已指派</a-radio-button>
            </a-radio-group>
            </a-form-item>
            </div>
          <div style="float:left;">
            <a-form-item>
             <a-radio-group @change="onFilterChange"
             v-model="filter.finish"
             buttonStyle="solid">
              <a-radio-button value="0">未完成</a-radio-button>
              <a-radio-button value="1">已完成</a-radio-button>
            </a-radio-group>
            </a-form-item>
            </div>

         </a-form>
      </div>

    </div>
  </div>
<div style="margin: 0 0 16px 10px;">
      <a-button
        type="primary"
        icon="plus"
        @click="add"
      >
        添加工单
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
   <span slot="action" slot-scope="text, record">
          <a @click="handleEdit(record)">编辑</a>
          <a-divider type="vertical" />
          <a @click="handledis(record)">指派</a>

        </span>
  </a-table>
  </div>

  </div>
  <WorklistModule ref="usermodule"/>
  <DistributionModule ref="dismodule"/>

</div>

</template>

<script>
//import { version } from 'punycode';
import WorklistModule from '@/views/module/WorklistModule'
import DistributionModule from '@/views/module/DistributionModule'

import { deleteUser,getUsers,getworklist } from '@/api/userApi'
const columns = [{
  title: '工单名称',
  dataIndex: 'workOrderName',
},{
  title: '工单内容',
  dataIndex: 'workOrderContent',
}, {
  title: '开始时间',
  dataIndex: 'startTime',
}, {
  title: '结束时间',
  dataIndex: 'endTime',
}, {
  title: '完成状态',
  dataIndex: 'orderStatus',
   customRender:function (text) {
              if(text==0){
                return "未完成";
              }else if(text==1){
                return "已完成";
              }else{
                return text;
              }
            },
},
 {
  title: '指派状态',
  dataIndex: 'distributionStatus',
   customRender:function (text) {
              if(text=="0"){
                return "未指派";
              }else if(text=="1"){
                return "已指派";
              }else{
                return text;
              }
            },
}, {
  title: '指派时间',
  dataIndex: 'distributionTime',
}, {
  title: '所属基地',
  dataIndex: 'baseInfo.baseName',
}, {
  title: '执行巡查员',
  dataIndex: 'walker.walkerName',
}, {
  title: '操作',
  dataIndex: 'action',
  key: 'action',
  scopedSlots: { customRender: 'action' },
  align:"center",
}];

export default {
  components:{
    WorklistModule,
    DistributionModule
  },
  data() {
    return {
      filter:{
        send:"0",
        finish:"0",
      },
      visible:false,
      loading: false,
      columns,
      pagination:{
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
      userInfo:{},
      form: this.$form.createForm(this),
    }
  },
  created() {
      this.loadData();

    },
   computed: {
    datas(){
       return this.$store.state.user.worklist.list
    }
  },
  methods: {
    onFilterChange(){
      this.loadData();
    },
    handledis(record){
    this.$refs.dismodule.edit(record)
    },
    add(){
    this.$refs.usermodule.add();
    this.$refs.usermodule.title="添加工单"
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
      this.pagination = xx
      this.loadData()
    },
    getQueryParams(){
      let param = Object.assign({}, this.userInfo);
      param.distributionStatus = this.filter.send;
      param.orderStatus = this.filter.finish;
      // param.field = this.getQueryField();
      param.pageNo = this.pagination.current;
      param.pageSize = this.pagination.pageSize;
      //return filterObj(param);
      return param;
    },
    loadData(){
      this.loading = true;
      const params = this.getQueryParams()
      //this.$store.dispatch('user/getlist',params)
      getworklist(params).then((res)=>{
      if(res.success){
          //let dataSource = res.result.list;
          this.$store.commit('user/SET_WORKLIST',res.result)
          this.pagination.total = res.result.total;
        }
      })
      this.loading = false;
    },
      handleEdit: function(record){
       this.$refs.usermodule.edit(record);
       this.$refs.usermodule.title="编辑工单"
       this.$refs.usermodule.okText="确认修改"
      },
      handleOk(){
        this.visible=false
      },
      handleReset () {
      this.form.resetFields();
      this.loading = true;
      this.userInfo={}
      this.loadData()
      //this.$store.dispatch('user/getlist',{pageNo:"1",pageSize:"30"})
      this.loading = false;

    },
    handleSearch(e){
       e.preventDefault();

       const userinfo=this.form.getFieldsValue(['workOrderName'])
        for(let k in userinfo){
          if(userinfo[k]!=undefined && userinfo[k].trim()==''){
            userinfo[k] = undefined
          }
        }
        this.userInfo = userinfo
        this.loadData()
          /*console.log("userinfo")
          console.log(userinfo)
          getUsers(userinfo).then((res=>{
            if(res.success==true){
              this.loading = true;
              this.$store.commit('user/SET_USER',res.result)
              this.loading = false;
            }else{
              this.$message.info(res.message)
            }
          }))*/

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
</style>
