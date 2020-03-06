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
        <div style="float:left;width:24.25%;height:50px;margin-right:1%;margin-bottom:10px;">
          <a-form-item>
              <a-input
              v-decorator="['loginAccount']"
              addonBefore="用户名"
              />
            </a-form-item>
        </div>
        <div style="float:left;width:24.25%;height:50px;margin-right:1%;margin-bottom:10px;">
          <a-form-item>
                <a-input
                v-decorator="['phoneNum']"
                addonBefore="手机号"
                />
              </a-form-item>
        </div>
        <div style="float:left;width:24.25%;height:50px;margin-right:1%;margin-bottom:10px;">
          <a-form-item>
            <a-input
            v-decorator="['realName']"
            addonBefore="真实姓名"
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
        添加服务人员
      </a-button>
</div>
<div>
  <a-table :columns="columns"
    :dataSource="dataSource"
    :pagination="pagination"
    :loading="loading"
    rowKey="id"
    bordered
    @change="handleTableChange"
    :scroll="{ x: '118%' }"
  >
   <span slot="psmList" slot-scope="psmList">
      <a-tag v-for="tag in psmList" color="rgb(60, 158, 171)" :key="tag.pId">{{tag.pName}}</a-tag>
    </span>
    <span slot="bsmList" slot-scope="bsmList">
      <a-tag v-for="tag in bsmList" color="rgb(60, 158, 171)" :key="tag.bid">{{tag.bName}}</a-tag>
    </span>
   <span slot="action" slot-scope="text, record">
          <a @click="handleEdit(record)">编辑</a>
          <a-divider type="vertical" />
             <a-dropdown>
            <a class="ant-dropdown-link">
              更多 <a-icon type="down" />
            </a>
            <a-menu slot="overlay">
              <a-menu-item >
                <a href="javascript:;" @click="handledis(record)">指派基地</a>
              </a-menu-item>
               <a-menu-item >
                <a href="javascript:;" @click="handledel(record)">解除基地</a>
              </a-menu-item>
               <a-menu-item >
                <a href="javascript:;" @click="handledispost(record)">指派岗位</a>
              </a-menu-item>
                <a-menu-item >
                <a href="javascript:;" @click="handledeldispost(record)">解除岗位</a>
              </a-menu-item>

              <a-menu-item >
                <a href="javascript:;" @click="handleEditpw(record)">修改密码</a>
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
  <ServiceModule ref="servicemodule"/>
  <DistributionSer ref="distributionser"/>
</div>

</template>

<script>
//import { version } from 'punycode';
import ServiceModule from '@/views/module/ServiceModule'
import DistributionSer from '@/views/module/DistributionSer'

import { deleteservice,getServicelist } from '@/api/userApi'
const columns = [{
  title: '用户名',
  dataIndex: 'loginAccount',
},{
  title: '真实姓名',
  dataIndex: 'realName',
}, {
  title: '手机号码',
  dataIndex: 'phoneNum',

}, {
  title: '岗位',
  dataIndex: 'psmList',
  scopedSlots: { customRender: 'psmList' },
}, {
  title: '地址',
  dataIndex: 'contactAddress',

}, {
  title: '状态',
  dataIndex: 'manStatus',
  customRender:function (text) {
              if(text==0){
                return "冻结";
              }else if(text==1){
                return "正常";
              }else{
                return text;
              }
            },
 // width: '11%',

},{
  title: '注册时间',
  dataIndex: 'createTime',

}, {
  title: '基地',
  dataIndex: 'bsmList',
  scopedSlots: { customRender: 'bsmList' },
}, {
  title: '操作',
  dataIndex: 'action',
  key: 'action',
  scopedSlots: { customRender: 'action' },
  align:"center",
  fixed: 'right',
  width: 170,
}];

export default {
  components:{
    ServiceModule,
    DistributionSer,
  },
  data() {
    return {
      loading: false,//加载动画
      dataSource:[],//表格的数据源
      userinfo:{},//查询参数
      columns,//表格的列
      pagination:{//分页参数
          current: 1,
          pageSize: 10,
          pageSizeOptions: ['10', '20', '30'],
          showTotal: (total, range) => {
            return range[0] + "-" + range[1] + " 共" + total + "条"
          },
          showQuickJumper: true,
          showSizeChanger: true,
          total: 0},
          form: this.$form.createForm(this),//绑定表单
    }
  },
  created() {
      this.loadData();//加载数据

    },
  methods: {
    handleTableChange(pagination){
    this.pagination = pagination
    this.loadData();
    },
     getQueryParams(){//获取请求参数
      let param = Object.assign({}, this.userinfo);
      param.pageNo = this.pagination.current;
      param.pageSize = this.pagination.pageSize;
      return param;
    },
    loadData(){
      this.loading = true;
      const params = this.getQueryParams()
      getServicelist(params).then((res)=>{
        if(res.success){
        this.dataSource=res.result.list
        this.pagination.total=res.result.total
        }else{
        this.$message.info(res.message)
        }
        console.log(res);
      })
      this.loading = false;
    },
     handleReset () {
      this.form.resetFields();
      this.userinfo={};
      this.loadData();
    },
    handleSearch(e){
       e.preventDefault();
       this.form.validateFieldsAndScroll((err, values) => {
        if (!err) {
         this.userinfo=this.form.getFieldsValue(['realName','loginAccount','phoneNum'])
          for(let k in this.userinfo){
            if(this.userinfo[k]!=undefined && this.userinfo[k].trim()==''){
              this.userinfo[k] = undefined
            }
          }
          this.loadData();
        }
      });
    },
    add(){
    this.$refs.servicemodule.add();
    },
    handledis(record){
     this.$refs.distributionser.add(record);
    },
    handledel(record){
      this.$refs.distributionser.del(record);
    },
    handleEdit(record){
       this.$refs.servicemodule.edit(record);
    },
    handleEditpw(record){
       this.$refs.servicemodule.editpw(record);
    },
    handledispost(record){
       this.$refs.servicemodule.editpost(record);
    },
    handledeldispost(record){
       this.$refs.servicemodule.delpost(record);
    },
    handleDelete(fid){
     deleteservice({id:fid}).then((res)=>{
    if(res.success){
    this.$message.success(res.message);
    this.loadData();
    }else{
    this.$message.warning(res.message);
         }
        });
    },
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
