<template>
  <div>
    <div style="margin: 0 0 16px 10px;">
  <a-button
    type="primary"
    icon="plus"
    @click="handleAdd"
  >
    添加权限
  </a-button>
    </div>
  <a-table :columns="columns" :dataSource="data" rowKey="id" >
     <span slot="xx" slot-scope="text, record">
      <a  @click="handleEdit(record)">修改</a>
      <a-divider type="vertical" />
      <a href="javascript:;" class="ant-dropdown-link">
        <a-popconfirm title='确定删除该权限?' @confirm="() => handleDelete(record.id)">
          删除
        </a-popconfirm>
      </a>
    </span>
  </a-table>
    <PermissionModule ref="permissionmodule" @ok="loadData"></PermissionModule>
  </div>
</template>
<script>
  import PermissionModule from './modules/PermissionModule'
  import {getpermission,delpermission} from '@/api/allapi'

  const columns = [{
    title: '权限名称',
    dataIndex: 'name',
    key: 'name',
  }, {
    title: '接口地址',
    dataIndex: 'code',
    key: 'code',
    width: '35%',
  },{
    title: '操作',
    key: 'action',
    scopedSlots: { customRender: 'xx' },
  }];


  const i = 1;

  export default {
    components: {
      PermissionModule
    },
    data() {
      return {
        visible: false,
        columns,
        loading: false,
        form: this.$form.createForm(this),
        mdl: {},
        selfData:{},
        data:[],
      }
    },
    methods:{
      loadData(){
        getpermission().then((res)=>{
         this.data=this.filterNoChild(res.result);
     })
      },
      handleOk () {

      },
      filterNoChild(data){
        if(data instanceof  Array){
          for(let o in data){
            let obj = data[o]
            if(obj.children!=undefined && obj.children.length==0){
              delete obj.children;
            }else{
              this.filterNoChild(obj);
            }
          }
        }else if(data instanceof Object){
          if(data.children!=undefined && data.children.length==0){
            delete data.children;
          }else{
            this.filterNoChild(data.children);
          }
        }
        return data
      },

      handleEdit (record) {
        this.$refs.permissionmodule.edit(record);
        this.$refs.permissionmodule.title="编辑";
      },
      handleAdd(){
        this.$refs.permissionmodule.add();
        this.$refs.permissionmodule.title="新增";
      },
      handleDelete(id){
        console.log(id);
        var that = this;
        let params = {};
        params.id = id;
        delpermission(params).then((res)=>{
          if(res.success){
            that.$message.success(res.message);
            that.loadData();
          }else{
            that.$message.warning(res.message);
          }
        });
      },

    },
    mounted() {
      this.loadData();

    },

  }
</script>
