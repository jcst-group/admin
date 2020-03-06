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
        <div style="float:left;width:24%;height:50px;margin-right:1%;margin-bottom:10px;">
          <a-form-item>
              <a-input
              v-decorator="['farmerName']"
              addonBefore="农户姓名"
              />
            </a-form-item>
        </div>
        <div style="float:left;width:24%;height:50px;margin-right:1%;margin-bottom:10px;">
          <a-form-item>
                <a-input
                v-decorator="['farmerPhoneNum']"
                addonBefore="手机号"
                />
              </a-form-item>
        </div>
        <div style="float:left;width:24%;height:50px;margin-right:1%;margin-bottom:10px;">
          <a-form-item>
            <a-input
            v-decorator="[
            'farmerEmail',
           ]"
            addonBefore="邮箱"
            />
            </a-form-item>
        </div>
           <div  style="float:left;width:24%;height:50px;margin-right:1%;margin-bottom:10px;">
             <a-form-item
               v-bind="formItemLayout"
               label="地区"
               style="margin-left: -22%"
             >
               <a-tree-select
                 :dropdownStyle="{ maxHeight: '300px', overflow: 'auto' }"
                 :treeData="treeData"
                 @change="onchange"
                 :value="value"
                 style="max-width: 250px;"
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
        添加农户
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
    :scroll="{ x: '148%' }"
  >
  <span slot="headPictureInfo" slot-scope="text, record">
    <img :src="imgurl(record)"  style="width:30px;height:30px;"/>
    </span>
    <span slot="baseInfo" slot-scope="baseInfo">
       <a-tag v-for="tag in baseInfo" color="rgb(60, 158, 171)" :key="tag.id">{{tag.baseName}}</a-tag>
    </span>
   <span slot="action" slot-scope="text, record">
          <a @click="handleEdit(record)">编辑</a>
          <a-divider type="vertical" />
             <a-dropdown>
            <a class="ant-dropdown-link">
              更多 <a-icon type="down" />
            </a>
            <a-menu slot="overlay">
              <!--<a-menu-item >
                <a href="javascript:;" @click="handlefreeze(record)">冻结</a>
              </a-menu-item>-->

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
  <FarmModule ref="farmmodule"/>
</div>

</template>

<script>
//import { version } from 'punycode';
import FarmModule from '@/views/module/FarmModule'
import { deletefarm,getFarmerlist,getmap } from '@/api/userApi'
const columns = [{
  title: '农户姓名',
  dataIndex: 'farmerName',
},{
  title: '头像',
  dataIndex: 'headPictureInfo',
  key: 'headPictureInfo',
  scopedSlots: { customRender: 'headPictureInfo' },
  align:"center",
}, {
  title: '手机号码',
  dataIndex: 'farmerPhoneNum',

}, {
  title: '邮箱',
  dataIndex: 'farmerEmail',

}, {
  title: '地址',
  dataIndex: 'contactAddress',

}, {
  title: '状态',
  dataIndex: 'farmerStatus',
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

}, {
  title: '基地',
  dataIndex: 'baseInfo',
  scopedSlots: { customRender: 'baseInfo' },
  width:270
}, {
  title: '注册时间',
  dataIndex: 'createTime',

}, {
  title: '修改时间',
  dataIndex: 'updateTime',
},{
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
    FarmModule,
  },
  data() {
    return {
      level:'',
      treeData:[],
      value:'',
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
      this.loadmap();
    },
  methods: {
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
    onchange (value, label, extra) {
// console.log('onchange_value', value);
// console.log('onchange_lable', label);
      this.value=value;
      let a=value.split('-');
      this.area=a;
      this.area=a[0];
      this.level=a[1];
    },
     imgurl(record){
      let imgshowapi = '/api2/upload/show'
     // console.log(record)
            if(record.headPictureInfo){
             return imgshowapi+'?fileName='+record.headPictureInfo
            }
    },
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
      console.log("param:"+params);
      getFarmerlist(params).then((res)=>{
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
       this.area="";
       this.value="";
       this.level="";
      this.loadData();
    },
    handleSearch(e){
       e.preventDefault();
       this.form.validateFieldsAndScroll((err, values) => {
        if (!err) {
         this.userinfo=this.form.getFieldsValue(['farmerName','farmerPhoneNum','farmerEmail']);
         this.userinfo.areaCode=this.area;
         this.userinfo.areaLevel=this.level;
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
    this.$refs.farmmodule.add();
    },
    handleEdit(record){
       this.$refs.farmmodule.edit(record);
    },
    handleEditpw(record){
       this.$refs.farmmodule.editpw(record);
    },
    handleDelete(fid){
     deletefarm({id:fid}).then((res)=>{
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
