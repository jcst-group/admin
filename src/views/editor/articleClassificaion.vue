<template>
 <div>
    <div>   
        <a-button type="primary" icon="plus" @click="add">新增类别</a-button>
    </div>
   <a-table :columns="columns"
            :dataSource="dataSource"
            :pagination="false"
            :loading="loading"
            rowKey="id">
          <span slot="action" slot-scope="text, record">
            <a @click="addchannel(record)">子类别</a>
            <a-divider type="vertical"/>
            <a @click="handleEdit(record)">编辑</a>
            <a-divider type="vertical"/>
            <a-popconfirm title="确定删除吗?" @confirm="handleDelete(record.id)">
              <a>删除</a>
            </a-popconfirm>
        </span>
        </a-table>
        <AddEquipment ref="AddEquipment"/>
        <EditEquipment ref="EditEquipment"/>
  </div>
</template>
<script>

  import AddEquipment from '@/views/editormodule/addcategory'
  import EditEquipment from '@/views/editormodule/editcategory'
  import {categoryList,categoryDel}  from '@/api/ddwbApi'


  const columns = [{
    title: '类别名称',
    dataIndex: 'name',
    key: 'name',
    align:"left"
  },
  {
    title: '操作',
    dataIndex: 'action',
    key: 'action',
    scopedSlots: {customRender: 'action'},
    align: "center",
  },];


  const i = 1;

  export default {
    name:'articleClassificaion',
    components: {
      AddEquipment,
      EditEquipment,
    },
    data() {
      return {
        columns,
        videoName:'',
        loading: false,
        dataSource: [],
        form: this.$form.createForm(this),
      }
    },
    created() {
       
    },
    methods: {
      addchannel(record){
        this.$refs.AddEquipment.add(record.id);
      },
      loadData(arg) {
        this.loading=true;
        categoryList().then(res=>{
            if(res.success){
                this.dataSource = res.result;
                this.loading=false;
            }
        })
      },
      add(){
        this.$refs.AddEquipment.add(-1);
      },
      handleEdit(record) {
        this.$refs.EditEquipment.edit(record);
      },
      handleDelete(id) {
        var that = this;
        let params = {};
        params.id = id;
        categoryDel(params).then((res) => {
          if (res.success) {
            that.$message.success(res.message);
            that.loadData();
          } else {
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
<style scoped>
  .select::after {
    clear: both;
    content: '';
    display: block;
    width: 0;
    height: 0;
  }
  @media screen and (max-width: 1700px){

  }
  @media screen and (max-width: 1700px) {
    .aSelect{
      left: 30%;
      width: 150px !important;
    }
    .aSelect1{
      left: 32% !important;
      width: 150px !important;
    }
    .aSelect2{
      left: 32% !important;
      width: 150px !important;
    }
  }
  @media screen and (max-width: 1400px) {
    .aSelect{
      right: -70% !important;
    }
  }
</style>
<style lang='stylus' scoped>
    .btn
        float right
        background #2c909c
        border-color #2c909c
        color #fff
        line-height 18px
        margin-right 10px
    .inp
        width 10%
        margin-right 10px
    .input
        margin-bottom 20px    
</style>
