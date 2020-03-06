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
              v-decorator="[
          'account',

        ]"
        addonBefore="账号"></a-input>
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
        添加基地账户
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
  >
   <span slot="action" slot-scope="text, record">
          <a @click="handleEdit(record)">编辑</a>
          <a-divider type="vertical" />
          <a-dropdown>
            <a class="ant-dropdown-link">
              更多 <a-icon type="down" />
            </a>
            <a-menu slot="overlay">
              <a-menu-item >
                <a href="javascript:;" @click="handlefreeze(record)">冻结/解冻</a>
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
  <UserModule ref="usermodule"/>
</div>

</template>

<script>
//import { version } from 'punycode';
import UserModule from '@/views/module/BaseAccountModule'
import { baseaccountdelete,getUsers,getvaseaccountlist,baseaccountupdate } from '@/api/userApi'
import { queryAllBase } from '@/api/allapi'
const columns = [{
  title: '账号',
  dataIndex: 'account',
  key:'account',
},{
  title: '所属基地',
  dataIndex: 'baseInfo.baseName',
  key:'baseInfo.baseName',
}, {
  title: '账号状态',
  dataIndex: 'accStatus',
  key: 'accStatus',
  customRender:function (text) {
              if(text==0){
                return "冻结";
              }else if(text==1){
                return "正常";
              }else{
                return text;
              }
            },
},{
  title: '创建时间',
  dataIndex: 'createTime',
  key:'createTime',
}, {
  title: '操作',
  dataIndex: 'action',
  key: 'action',
  scopedSlots: { customRender: 'action' },
  fixed:"right",
  align:"center",
  width: 150,
}];

export default {
  components:{
    UserModule,
  },
  data() {
    return {
      dataSource:[],
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
       return this.$store.state.user.userData.list
    },

  },
  methods: {
    add(){
    this.$refs.usermodule.add();
    this.$refs.usermodule.title="添加用户"
    this.$refs.usermodule.okText="确认添加"
    this.$refs.usermodule.pw=true
    this.$refs.usermodule.npw=true
    },
    handleEditpw(record){
    this.$refs.usermodule.editpw(record);
    this.$refs.usermodule.title="修改密码"
    this.$refs.usermodule.okText="确认修改"
    this.$refs.usermodule.pw=true
    this.$refs.usermodule.npw=false
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
      console.log(this.userInfo)
      let param = Object.assign({}, this.userInfo);
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
      getvaseaccountlist(params).then((res)=>{
        if(res.success){
          this.dataSource = res.result.list;
          this.pagination.total = res.result.total;
        }
      })
      this.loading = false;
    },
     handleDelete: function(id){
        let that = this;
        baseaccountdelete({id: id}).then((res)=>{
          if(res.success){
            that.$message.success(res.message);
            that.loadData();
          }else{
            that.$message.warning(res.message);
          }
        });
      },
      handlefreeze(record){
        let that=this;
        let aa={};
        aa.id=record.id;
        if(record.accStatus){
            aa.accStatus=0;
        }else{
            aa.accStatus=1
        }
        baseaccountupdate(aa).then((res)=>{
            if(res.success){
            that.$message.success(res.message);
            that.loadData();
          }else{
            that.$message.warning(res.message);
          }
        })
      },
      handleEdit: function(record){
       this.$refs.usermodule.edit(record);
       this.$refs.usermodule.title="编辑用户"
       this.$refs.usermodule.okText="确认修改"
       this.$refs.usermodule.pw=false
       this.$refs.usermodule.npw=true
      },
      handleOk(){
        this.visible=false
      },
      handleReset () {
      this.pagination.current=1;
      this.userInfo={};
      this.form.resetFields();
      this.loading = true;
      //this.$store.dispatch('user/getlist',{pageNo:"1",pageSize:"30"})
      this.loading = false;
      this.loadData()
    },
    handleSearch(e){
       e.preventDefault();

       const userinfo=this.form.getFieldsValue(['account'])
        for(let k in userinfo){
          console.log(k)
          console.log(userinfo[k])
          if(userinfo[k]!=undefined && userinfo[k].trim()==''){
            userinfo[k] = undefined
          }
        }
        this.userInfo = userinfo
        console.log("userinfo:");
        console.log(userinfo);
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
