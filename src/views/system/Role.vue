<template>
  <div style="width:100%;height:auto;background:white;" class="role-wrapper">
    <div style="background:white;padding:10px 0 10px 0;">
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
        <div class="select">
          <a-form
            :form="form"
            @submit="handleSearch" >
            <div style="float:left;width:300px;height:50px;margin-right:16px;margin-bottom:10px;">
              <a-form-item>
                <a-input
                  v-decorator="['name']"
                  addonBefore="角色名称">
                </a-input>
              </a-form-item>
            </div>
            <div style="float:left;width:300px;height:50px;margin-right:16px;margin-bottom:10px;" class="role-type-wrapper">
              <a-form-item label="角色类型">
                <a-select
                    v-decorator="['type']"
                    style="width: 200px">
                    <a-select-option 
                        v-for="item in roleDatas"
                        :key="item.value"
                        :value='item.code'>
                        {{item.displayName}}
                    </a-select-option>
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
          添加角色
        </a-button>
      </div>
      <div>
        <a-table
          :columns="columns"
          :dataSource="dataSource"
          :pagination="pagination"
          :loading="loading"
          rowKey="id"
          bordered
          @change="handleTableChange"
        >
          <span slot="action" slot-scope="text, record" v-if="record.type.value != 1" >
            <a @click="handleEdit(record)">编辑</a>
            <a-divider type="vertical"/>
            <a-dropdown>
              <a class="ant-dropdown-link">
                更多 <a-icon type="down" />
              </a>
              <a-menu slot="overlay">
                <a-menu-item >
                  <a href="javascript:;" @click="handleHTEditRole(record)">后台权限管理</a>
                </a-menu-item>
                <a-menu-item >
                  <a href="javascript:;" @click="handleAPPEditRole(record)">APP权限管理</a>
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
    <RolesModal ref="rolesModal"/>
    <APPRolesResourceModal ref="APPRolesResourceModal"/>
    <HTRolesResourceModal ref="HTRolesResourceModal"/>
  </div>
</template>

<script>
  //import { version } from 'punycode';
  import RolesModal from './modules/RolesModal'
  import APPRolesResourceModal from './modules/APPRolesResourceModal'
  import HTRolesResourceModal from './modules/HTRolesResourceModal'
  import { roleQuery,roleAdd,roleUpdate,roleDelete,getAllRoleType } from '@/api/permissonApi'
  const columns = [{
    title: '角色名',
    dataIndex: 'name',
    key:'name',
  },{
    title: '角色类型',
    dataIndex: 'type.displayName',
    key: 'type.displayName',
  }, {
    title: '状态',
    dataIndex: 'status.displayName',
    key: 'status.displayName'
  }, {
    title: '创建时间',
    dataIndex: 'createTime',
    key: 'createTime',
    //width: '11%',
  }, {
    title: '备注',
    dataIndex: 'remark',
    key: 'remark',
    //width: '11%',
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
    name: "roles",
    components:{
      RolesModal,
      APPRolesResourceModal,
      HTRolesResourceModal
    },
    data() {
      return {
        visible:false,
        loading: false,
        columns,
        dataSource:[],
        roleDatas: [],
        pagination:{
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
        userInfo:{},
        form: this.$form.createForm(this),
      }
    },
    created() {
      this.loadData();
    },
    methods: {
      add(){
        this.$refs.rolesModal.add();
        this.$refs.rolesModal.title="添加角色"
        this.$refs.rolesModal.okText="确认添加"
      },
      handleAPPEditRole(record){
        this.$refs.APPRolesResourceModal.edit(record);
        this.$refs.APPRolesResourceModal.title="APP权限管理"
        this.$refs.APPRolesResourceModal.okText="确认修改"
      },
      handleHTEditRole(record){
        this.$refs.HTRolesResourceModal.edit(record);
        this.$refs.HTRolesResourceModal.title="后台权限管理"
        this.$refs.HTRolesResourceModal.okText="确认修改"
      },
      handleTableChange(xx){
        this.pagination = xx
        this.loadData()
      },
      getQueryParams(){
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
        roleQuery(params).then((res)=>{
          if(res.success){
            let dataSource = res.result.list;
            this.dataSource = dataSource;
            this.pagination.total = res.result.total;
            this.loading = false;
          }
        })
        getAllRoleType().then(res => {
          if (res.success) {
            this.roleDatas = res.result
          }
        })
      },
      handleDelete: function(uid){
        let that = this;
        roleDelete({id: uid}).then((res)=>{
          if(res.success){
            that.$message.success(res.message);
            that.loadData();
          }else{
            that.$message.warning(res.message);
          }
        });
      },
      handleEdit: function(record){
        this.$refs.rolesModal.edit(record);
        this.$refs.rolesModal.title="编辑角色"
        this.$refs.rolesModal.okText="确认修改"
      },
      handleOk(){
        this.visible=false
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
      },
      handleReset() {
        this.pagination.current = 1;
        this.userInfo = {};
        this.form.resetFields();
        this.loadData();
      }
    },

  }
</script>
<style lang='stylus'>
  .role-wrapper
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
    .role-type-wrapper
      .ant-form-item-control-wrapper
        display inline-block
    .select::after{
      clear:both;
      content:'';
      display:block;
      width:0;
      height:0;
    }
</style>
