<template>
<div style="width:100%;height:auto;background:white;" class="user-wrapper">
  <div style="background:white">
    <div style="margin:0 1% 0 0;">
      <div>
        <div class="button">
          <i-button class="review-btn btn" @click="handleReset">
              <Icon type="md-sync" class="icon"/>
              重置
          </i-button>
          <i-button class="search-btn btn" style="margin-right:10px"  @click="handleSearch">
              <Icon type="md-search" class="icon"/>
              查询
          </i-button>
        </div>
        <div class="select" style="padding-right:15%">
          <a-form
            :form="form"
            @submit="handleSearch" >
            <div style="float:left;width:250px;height:50px;margin-right:16px;margin-bottom:10px;">
              <a-form-item>
                  <!-- <a-input 
                  v-decorator="['par']">
                    <a-select 
                      v-decorator="[
                      'qian',{
                        initialValue:'账号',
                      }]"
                      slot="addonBefore"  style="width: 90px">
                        <a-select-option value="账号">账号</a-select-option>
                        <a-select-option value="手机号">手机号</a-select-option>
                        <a-select-option value="邮箱">邮箱</a-select-option>
                        <a-select-option value="姓名">姓名</a-select-option>
                    </a-select>
                  </a-input> -->
                <a-input
                v-decorator="['username',]"
                addonBefore="账号"></a-input>
              </a-form-item>
            </div>
            <div style="float:left;width: 250px;height:50px;margin-right:16px;margin-bottom:10px;">
              <a-form-item>
                <a-input
                  v-decorator="['phone']"
                  addonBefore="手机号">
                </a-input>
              </a-form-item>
            </div>
            <!-- <div style="float:left;width:24.25%;height:50px;margin-right:1%;margin-bottom:10px;">
              <a-form-item>
                <a-input
                  v-decorator="[
                    'email',
                    {
                      rules: [{
                        type: 'email', message: '这不是一个正确的邮箱',
                      }]
                    }
                  ]"
                  addonBefore="邮箱"></a-input>
              </a-form-item>
            </div> -->
            <div style="float:left;width:250px;margin-right:16px;height:50px;">
                <a-form-item>
                  <a-input
                    v-decorator="['realName',]"
                    addonBefore="姓名" ></a-input>
                </a-form-item> 
            </div>
            <div style="float:left;width:250px;height:50px;" class="user-role-wrapper">
                <a-form-item label="角色类型">
                  <a-select
                      v-decorator="['roleId']"
                      style="width: 150px">
                      <a-select-option 
                          v-for="item in roleDatas"
                          :key="item.id"
                          :value='item.id'>
                          {{item.name}}
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
            添加用户
          </a-button>
    </div>
    <div>
      <a-table 
        :columns="columns"
        :dataSource="datas"
        :pagination="pagination"
        :loading="loading"
        rowKey="uid"
        bordered
        @change="handleTableChange"
      >
        <span slot="roleType" slot-scope="text, record">
          <a-tooltip>
            <template slot='title' v-if="record.roleList.length > 5">
              <div v-for="item in record.roleList" :key="item.id">
                {{item.name}}
              </div>
            </template>
            <a-tag v-for="(item,index) in record.roleList" v-show="index < 5" :key="item.id" color='blue'>
              {{item.name}}
            </a-tag>
            <span v-if="record.roleList.length > 5">……</span>
          </a-tooltip>
        </span>
        <span slot="status" slot-scope="text, record">
          <div @click="getCurRecord(record)">
            <a-switch :defaultChecked='record.status.value == 1' @change="changeCheck"></a-switch>
          </div>
        </span>
        <span slot="action" slot-scope="text, record" style="display:block;margin:auto; white-space: nowrap">
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
              <a-menu-item >
                <a href="javascript:;" @click="handleEditpw(record)">修改密码</a>
              </a-menu-item>
              <a-menu-item>
                <a-popconfirm title="确定删除吗?" @confirm="handleDelete(record.uid)">
                  <a>删除账户</a>
                </a-popconfirm>
              </a-menu-item>
              <a-menu-item >
                <a href="javascript:;" @click="handledis(record)">分配角色</a>
              </a-menu-item>
              <a-menu-item >
                <a @click="editHukou(record)">家庭成员信息</a>
              </a-menu-item>
            </a-menu>
          </a-dropdown>
        </span>
      </a-table>
    </div>
  </div>
  <UserModule ref="usermodule"/>
  <UserRole ref="userrole"/>
  <HukouModal ref="hukouModal"/>
</div>

</template>

<script>
//import { version } from 'punycode';
import UserModule from "@/views/module/UserModule";
import HukouModal from "./modules/hukou"
import UserRole from "@/views/module/UserRole";
import { deleteUser, getUsers, changeStatus} from "@/api/userApi";
import { showpicture, getallpermission} from "@/api/allapi";

const columns = [
  {
    title: "账号",
    dataIndex: "username",
    key: "username"
  },
  // {
  //   title: "头像",
  //   dataIndex: "avatar",
  //   key: "avatar",
  //   scopedSlots: { customRender: "avatar" },
  //   align: "center"
  // },
  {
    title: "真实姓名",
    dataIndex: "realName",
    key: "realName",
    width: '11%',
  }, 
  {
    title: '性别',
    dataIndex: 'sex',
    key: 'sex',
    customRender:function (text) {
                if(text.value == 1){
                  return "男";
                }else if(text.value == 2){
                  return "女";
                }else{
                  return text;
                }
              },
    width: '8%',
  },
  {
    title: "手机号码",
    dataIndex: "phone",
    key: "phone",
    width: '11%',
  },
  {
    title: "身份证号",
    dataIndex: "identifyCode",
    key: "identifyCode"
  },
  // {
  //   title: "邮箱",
  //   dataIndex: "email",
  //   key: "email"
  //   // width: '11%',
  // },
  {
    title: "注册时间",
    dataIndex: "createTime",
    key: "createTime",
    width: '13%',
  },
  {
    title: '角色类型',
    dataIndex: 'roleType',
    key: 'roleType',
    scopedSlots: {customRender: "roleType"},
    width: '40%'
  },
  // {
  //   title: "修改时间",
  //   dataIndex: "updateTime",
  //   key: "updateTime"
  //   //width: '11%',
  // },
  //  {
  //   title:'修改详情',
  //   dataIndex:'createWhere',
  //   key: 'createWhere',
  //   //width:'11%',
  // },
  {
    title: '启用状态',
    dataIndex: 'status',
    key: 'status',
    scopedSlots: {customRender: "status"},
    width: '11%',
  },
  {
    title: "操作",
    dataIndex: "action",
    key: "action",
    scopedSlots: { customRender: "action" },
    align: "center"
  }
];

export default {
  name: 'users',
  components: {
    UserModule,
    UserRole,
    HukouModal
  },
  data() {
    return {
      visible: false,
      loading: false,
      roleDatas: [],
      record: {},
      columns,
      pica: "",
      pagination: {
        current: 1,
        pageSize: 10,
        pageSizeOptions: ["10", "20", "50"],
        showTotal: (total, range) => {
          return range[0] + "-" + range[1] + " 共" + total + "条";
        },
        showQuickJumper: true,
        showSizeChanger: true,
        total: 0
      },
      userInfo: {},
      form: this.$form.createForm(this)
    };
  },
  created() {
    this.loadData();
  },
  computed: {
    datas() {
      return !this.$store.state.user.userData ? [] : this.$store.state.user.userData.list 
    }
  },
  methods: {
    getCurRecord(record) {
      this.record = record ? record : {}
    },
    changeCheck(checked) {
      setTimeout(() => {
        changeStatus({
          id: this.record.uid
        }).then(res => {
          this.$message.info(res.message)
          if (res.success) {
            this.loadData()
          }
        })
      }, 0)
    },
    editHukou(record) {
      this.$refs.hukouModal.add(record)
    },
    handledis(record) {
      this.$refs.userrole.add(record);
    },
    imgurl(record) {
      // this.pica='';
      // showpicture({fileName:record.avatar}).then((res)=>{
      //   if(res.success){
      //     //this.pica=res.result;
      //     return res.result;
      //   }
      // })
      if (record) {
        let imgshowapi = "/api2/upload/show/compression";
        return imgshowapi + "/" + record.avatar;
      }
      // if(record){
      //        //return imgshowapi+'?fileName='+record.avatar
      // let xx =  showpicture({fileName:record}).then((res)=>{
      //   if(res.success){
      //     //this.pica=res.result;
      //     return Promise.resolve(res.result);
      //     //return res.result;
      //   }
      // })
    },
    add() {
      this.$refs.usermodule.add();
      this.$refs.usermodule.title = "添加用户";
      this.$refs.usermodule.okText = "确认添加";
      this.$refs.usermodule.pw = true;
      this.$refs.usermodule.tx = true;
      this.$refs.usermodule.npw = true;
    },
    handleEditpw(record) {
      this.$refs.usermodule.editpw(record);
      this.$refs.usermodule.title = "修改密码";
      this.$refs.usermodule.okText = "确认修改";
      this.$refs.usermodule.pw = true;
      this.$refs.usermodule.npw = false;
      this.$refs.usermodule.tx = false;
    },
    handlelook(record) {
      this.$refs.usermodule.look(record);
      this.$refs.usermodule.title = "查看详情";
      this.$refs.usermodule.okText = "确认";
      this.$refs.usermodule.pw = false;
      this.$refs.usermodule.npw = true;
    },
    handleTableChange(pagination) {
      this.pagination = pagination;
      this.loadData();
    },
    getQueryParams() {
      let param = Object.assign({}, this.userInfo);
      // param.field = this.getQueryField();
      param.pageNo = this.pagination.current;
      param.pageSize = this.pagination.pageSize;
      //return filterObj(param);
      return param;
    },
    loadData() {
      this.record = {}
      this.loading = true;
      const params = this.getQueryParams();
      // this.$store.dispatch('user/getlist',params)
      getUsers(params).then(res => {
        if (res.success) {
          let dataSource = res.result.list;
          this.$store.commit("user/SET_USER", res.result);
          this.pagination.total = res.result.total;
          this.loading = false;
        }
      });
      getallpermission().then(res => {
        if (res.success) {
          this.roleDatas = res.result
        }
      })
    },
    handleDelete: function(uid) {
      let that = this;
      deleteUser({ id: uid }).then(res => {
        if (res.success) {
          that.$message.success(res.message);
          that.loadData();
        } else {
          that.$message.warning(res.message);
        }
      });
    },
    handleEdit: function(record) {
      this.$refs.usermodule.edit(record);
      this.$refs.usermodule.title = "编辑用户";
      this.$refs.usermodule.okText = "确认修改";
      this.$refs.usermodule.pw = false;
      this.$refs.usermodule.tx = true;
      this.$refs.usermodule.npw = true;
    },
    handleOk() {
      this.visible = false;
    },
    handleReset() {
      this.pagination.current = 1;
      this.userInfo = {};
      this.form.resetFields();
      //this.loading = true;
      //this.$store.dispatch('user/getlist',{pageNo:"1",pageSize:"30"})
      //this.loading = false;
      this.loadData();
    },
    handleSearch(e) {
      e.preventDefault();
      const userinfo = this.form.getFieldsValue();
      for (let k in userinfo) {
        if (typeof userinfo[k] !== 'number' && userinfo[k] != undefined && userinfo[k].trim() == "") {
          userinfo[k] = undefined;
        }
      }
      this.userInfo = userinfo;
      this.loadData();
    }
  }
};
</script>
<style lang='stylus'>
  .user-wrapper
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
    .user-role-wrapper
      .ant-form-item-control-wrapper
        display inline-block
    .select::after {
      clear: both;
      content: "";
      display: block;
      width: 0;
      height: 0;
    }
</style>
