<template>
  <div>
    <div style="margin: 0 0 16px 0;">
  <a-button
    type="primary"
    icon="plus"
    @click="handleAdd"
  >
    添加菜单
  </a-button>
    </div>
  <a-table :columns="columns" :dataSource="datas" rowKey="id" >
     <span slot="xx" slot-scope="text, record">
    <!--  <a v-if="record.children==undefined" @click="handleFun(record)">功能管理</a>
      <a-divider v-if="record.children==undefined" type="vertical" />-->
      <a  @click="handleEdit(record)">修改</a>
      <a-divider type="vertical" />
      <a href="javascript:;" class="ant-dropdown-link">
        <a-popconfirm title='确定删除该菜单?' @confirm="() => handleDelete(record.id)">
          删除
        </a-popconfirm>
      </a>
    </span>
  </a-table>
    <resource-modal ref="resourcemodal" @ok="loadData"></resource-modal>
    <resource-small-modal ref="resourceSmallModal"></resource-small-modal>
  </div>
</template>
<script>
  import ResourceModal from './modules/ResourceModal'
  import {deleteMenu,allmenus} from '@/api/allapi'
  import ResourceSmallModal from './modules/ResourceSmallModal'

  const columns = [{
    title: '菜单名称',
    dataIndex: 'name',
    key: 'name',
  }, {
    title: '类型',
    dataIndex: 'type',
    key: 'type',
    customRender:function (text) {
      if(text==1){
        return "菜单";
      }else if(text==2){
        return "功能";
      }else{
        return text;
      }
    },
  },{
    title: '前端地址',
    dataIndex: 'code',
    key: 'code',
  },{
    title: '操作',
    key: 'action',
    scopedSlots: { customRender: 'xx' },
  }];


  const i = 1;

  export default {
    name:'ResourceList',
    components: {
      ResourceModal,
      ResourceSmallModal,
    },
    data() {
      return {
        visible: false,
        columns,
        loading: false,
        form: this.$form.createForm(this),
        mdl: {},
        selfData:{}
      }
    },
    computed:{
      datas(){
        let data = this.filterNoChild(this.$store.state.resource.resources);
        console.log("computed data:");
        console.log(data)
        return data
      }
    },
    methods:{
      loadData(){
        let params = {};
        allmenus(params).then((res)=>{
          if(res.success){
            console.log(res);
            //this.dataSource=res.result.list
            //this.pagination.total=res.result.total
            let resources = res.result;
            this.$store.commit('resource/SET_RESOURCES',resources)
          }else{
            this.$message.info(res.message)
          }
          console.log(res);
        })

        //this.$store.dispatch('resource/queryMenus')
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
      handleFun(record){
        console.log("handleFun");
        this.$refs.resourceSmallModal.editFun(record);
      },
      handleEdit (record) {
        this.$refs.resourcemodal.edit(record);
        this.$refs.resourcemodal.title="编辑";
      },
      handleAdd(){
        this.$refs.resourcemodal.add();
        this.$refs.resourcemodal.title="新增";
      },
      handleDelete(id){
        console.log(id);
        var that = this;
        let params = {};
        params.id = id;
        deleteMenu(params).then((res)=>{
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
