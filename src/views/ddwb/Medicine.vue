<template>
  <div>
   <div class="addbut">
     <a-button class="add-btn" type="primary" icon="plus" @click="addMedicine">新增</a-button>
   </div>
   <a-table
    :columns="columns"
    :rowKey="record => record.id"
    :dataSource="dataSource"
    :pagination="ipagination"
    :loading="loading"
    @change="handleTableChange"
    bordered
   >
    <a-popover slot="describe" slot-scope="text">
                <template slot="content">
                <div style="width:400px" v-html="f2(text)">{{f2(text)}}</div>   
                </template> 
                <span>{{h(text)}}</span>
    </a-popover>
      <a-popover slot="edibleValue" slot-scope="text">
        <template slot="content">
        <div style="width:400px" v-html="f2(text)">{{f2(text)}}</div>   
        </template>
        <span>{{h(text)}}</span>
    </a-popover>
      <a-popover slot="medicinalValue" slot-scope="text">
        <template slot="content">
        <div style="width:400px" v-html="f2(text)">{{f2(text)}}</div>   
        </template>
        <span>{{h(text)}}</span>
    </a-popover>
    <span slot="action" slot-scope="text, record">
      <a href="javascript:;" @click="edit(record)" style="white-space：nowrap">编辑</a>
          <a-divider type="vertical" />
          <a href="javascript:;" class="ant-dropdown-link">
          <a-popconfirm title='确定删除?' @confirm="() => del(record.id)" style="white-space：nowrap">
          删除
          </a-popconfirm>
      </a>
    </span>
   </a-table>
   <addMedicine ref="addmedicine"/>
   <editMedicine ref="editmedicine"/>
   <lookMedicine ref="lookmedicine"/>
  </div>
</template>
<script>
import {  getCropList,addCrop,delCrop,editCrop } from '@/api/ddwbApi'
import addMedicine from '@/views/ddwbmodule/addmedicine'
import editMedicine from '@/views/ddwbmodule/editmedicine'
import lookMedicine from '@/views/ddwbmodule/lookmedicine'

const columns = [{
    title: '作物编码',
    dataIndex: 'cropCode',
    key: 'cropCode',
    width:"15%",
    align: 'center',
  },{
    title: '作物名称',
    dataIndex: 'cropName',
    key: 'cropName',
    width:"8%",
    align: 'center',
  }, {
    title: '拼音码',
    dataIndex: 'pinyinCode',
    key: 'pinyinCode',
    width:"7%",
    align: 'center',
  },{
    title: '计量单位',
    dataIndex: 'calculateUnit.unit',
    key: 'calculateUnit.unit',
    align: 'center',
  }, {
    title: '作物描述',
    dataIndex: 'describe',
    key: 'describe',
    width:"19%",
    scopedSlots: { customRender: 'describe' },
    align: 'center',
  },{
    title: '食用价值',
    dataIndex: 'edibleValue',
    key: 'edibleValue',
    width:"18%",
    scopedSlots: { customRender: 'edibleValue' },
    align: 'center',
  },{
    title: '作物价值',
    dataIndex: 'medicinalValue',
    key: 'medicinalValue',
    width:"18%",
    scopedSlots: { customRender: 'medicinalValue' },
    align: 'center',
  },{
    title: '操作',
    dataIndex: 'action',
    key: 'action',
    scopedSlots: { customRender: 'action' },
    align: 'center',
  }];
export default {
  name: 'medicine',
  components:{
     addMedicine,
     editMedicine,
     lookMedicine,
  },
  data(){
    return{
      columns,
      dataSource: [],
      loading:false,
      ipagination: {
            current: 1,
            pageSize: 10,
            pageSizeOptions: ['10', '20', '50'],
            showTotal: (total, range) => {
             return range[0] + '-' + range[1] + '共' + total + '条';
            },
            showQuickJumper: true,
            showSizeChanger: true,
            total: 0
       },
    }
  },
  created(){
    this.loadData();
  },
  mounted(){

  },
  methods:{
    h(text){
      if(text!=null){
          let a=text.split('');
          let b=[];
          if(a.length>50){
              for(let i=0;i<50;i++){
              b.push(a[i]);
              }
              let c=b.join('')+'...';
              return c;
          }else{
              return text;
          }
          }
          return text;
    },
    f2(text) {
      if (!text) return
      return text.replace(/\n/g, "<br/>");
    },
    handleTableChange(pagination) {
        this.ipagination = pagination;
        this.loadData();
      },
      getQueryParams() {
        let param = {};
        param.pageNo = this.ipagination.current;
        param.pageSize = this.ipagination.pageSize;
        return param;
      },
      loadData() {
        let params = this.getQueryParams();
        this.loading=true;
        getCropList(params)
          .then((res) => {
            if (res.success) {
              this.dataSource = res.result.list;
              this.ipagination.total = res.result.total;
              this.loading=false;
            }
          });
      },
    addMedicine(){
      this.$refs.addmedicine.add();
    },
    look(record){
      this.$refs.lookmedicine.look(record);
    },
    edit(record){
     // console.log(record);
      this.$refs.editmedicine.edit(record);
    },
    del(id){
      delCrop({id:id}).then(res=>{
        if(res.success){
          this.$message.success(res.message);
          this.loadData();
        }else{
          this.$message.warning(res.message);
        }
      })
    },
  },
}
</script>
<style scoped>
.addbut{
  width:100%;
  height:50px;
}

</style>
