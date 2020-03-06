/*
*   土壤检测页面
*/
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
              <div style="float:left;width:26%;height:50px;margin-right:1%;margin-bottom:10px;">
                <a-form-item
                  v-bind="formItemLayout"
                  label="地区"
                >
                  <a-tree-select
                    :dropdownStyle="{ maxHeight: '300px', overflow: 'auto' }"
                    :treeData="treeData"
                    @change="onchange"
                    :value="value"
                    style="max-width: 200px"
                  />
                </a-form-item>
              </div>
              <div style="float:left;width:30%;height:50px;margin-right:1%;margin-bottom:10px;">
                <a-form-item
                  label="检测时间"
                  v-bind="formItemLayout"
                >
                  <a-date-picker
                    @change="onChange"
                    v-decorator="[
                      'testTime'
                    ]"
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
          添加土壤检测信息
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
                 :scroll="{ x: '150%' }"
        >
          <span slot="soilTestLotRelList" slot-scope="soilTestLotRelList">
            <a-tag color="rgb(60, 158, 171)">{{soilTestLotRelList[0].bname}}</a-tag>
          </span>
          <span slot="soilTestLotRelLists" slot-scope="soilTestLotRelLists">
            <a-tag v-for="tags in soilTestLotRelLists" color="rgb(60, 158, 171)" :key="tags.id">{{tags.lotname}}</a-tag>
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
                <a href="javascript:;" @click="handlelook(record)">详情</a>
              </a-menu-item>
              <a-menu-item >
                <a href="javascript:;" @click="handleadd(record)">绑定土壤所属地块</a>
              </a-menu-item>
              <a-menu-item >
                <a href="javascript:;" @click="handleDel(record)">解除土壤所属地块</a>
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
    <SoilTestModule ref="soilTestModule"/>
  </div>

</template>

<script>
  //import { version } from 'punycode';
  import SoilTestModule from '@/views/module/SoilTestModule'
  import { getSoilTestList,deleteSoilTest,getmap } from '@/api/userApi'
  import moment from 'moment';

  const columns = [{
    title: '基地',
    dataIndex: 'soilTestLotRelList[0].bname',
    scopedSlots: { customRender: 'soilTestLotRelList[0].bname' },
    width: "9%",
    align:"center"
  }, {
    title: '地块',
    dataIndex: 'soilTestLotRelList',
    scopedSlots: { customRender: 'soilTestLotRelLists' },
    width: "9.3%",
    align:"center"
  },{
    title: '有机质含量%',
    dataIndex: 'organicMaterial',
    key:'organicMaterial',
    width: "9.09%",
    align:"center"
  }, {
    title: '氮含量(mg/kg)',
    dataIndex: 'nitrogen',
    key:'nitrogen',
    width: "9.09%",
    align:"center"
  }, {
    title: '磷含量(mg/kg)',
    dataIndex: 'phosphorus',
    key:'phosphorus',
    width: "9.09%",
    align:"center"
  }, {
    title: '钾含量(mg/kg)',
    dataIndex: 'potassium',
    key:'potassium',
    width: "9.09%",
    align:"center"
  },  {
    title: '微量元素含量(mg/kg)',
    dataIndex: 'microelement',
    key: 'microelement',
    width: "9.09%",
    align:"center"
  }, {
    title: '检测时间',
    dataIndex: 'testTime',
    key: 'testTime',
    width: "9.3%",
    align:"center"
  },{
    title: '备注',
    dataIndex: 'remark',
    key: 'remark',
    width: "9.3%",
    align:"center",
  }, {
    title: '创建时间',
    dataIndex: 'createTime',
    key: 'createTime',
    width: "9.2%",
    align:"center",
  },  {
    title: '操作',
    dataIndex: 'action',
    key: 'action',
    scopedSlots: { customRender: 'action' },
    align:"center",
    width: "20%",
  }];

  export default {
    components:{
      SoilTestModule
    },
    data() {
      return {
        areaLevel:'',
        treeData:[],
        value:'',
        area:'',
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
        visible:false,
        loading: false,
        testTime:'',
        datass:'',
        lid:-1,
        dataLid:[],
        columns,
        userinfo:{},
        datas:[],
        dateString:'',
        pagination:{
          current: 1,
          pageSize: 10,
          pageSizeOptions: ['10', '20', '30'],
          showTotal: (total, range) => {
            return range[0] + "-" + range[1] + " 共" + total + "条"
          },
          showQuickJumper: true,
          showSizeChanger: true,
          total: 0},
        form: this.$form.createForm(this),
      }
    },
    created() {
      this.loadData();
      this.loadmap();
    },
    methods: {
      moment,
      /* imgurl(record){
         let imgshowapi = '/api/upload/show'
        // console.log(record)
               if(record.avatar){
                return imgshowapi+'?fileName='+record.avatar
               }
       },*/
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
        this.area=this.area[0];
        this.areaLevel=a[1];
      },
      add(){
        this.$refs.soilTestModule.add();
        this.$refs.soilTestModule.title="添加土壤检测信息"
        this.$refs.soilTestModule.okText="确认添加"
      },
      handlelook(record){
        this.$refs.soilTestModule.look(record);
        this.$refs.soilTestModule.title="查看详情"
        this.$refs.soilTestModule.okText="确认"
        this.$refs.soilTestModule.pw=false
        this.$refs.soilTestModule.npw=true
      },
      handleadd(record){
        this.$refs.soilTestModule.adds(record);
        this.$refs.soilTestModule.title="绑定土壤所属地块"
        this.$refs.soilTestModule.okText="确认"
        this.$refs.soilTestModule.details=false
        if(record.soilTestLotRelList.length>0){
          this.$refs.soilTestModule.detail=true
        }
      },
      handleDel(record){
        this.$refs.soilTestModule.del(record);
        this.$refs.soilTestModule.title="解除土壤所属地块"
        this.$refs.soilTestModule.okText="删除"
        this.$refs.soilTestModule.details=false
        this.$refs.soilTestModule.detail=false
        this.$refs.soilTestModule.dels=true
      },
      handleTableChange(xx){
        console.log("handleTableChange")
        console.log(xx)
        this.pagination = xx
        this.loadData()
      },
      getQueryParams(){
        console.log(this.userInfo)
        let param = Object.assign({}, this.userinfo);
        // param.field = this.getQueryField();
        param.pageNo = this.pagination.current;
        param.pageSize = this.pagination.pageSize;
        //return filterObj(param);
        return param;
      },
      loadData(callback){
        this.loading = true;
        const params = this.getQueryParams();
        //this.$store.dispatch('user/getlist',params)
        getSoilTestList(params).then((res=>{
          if(res.success==true){
            this.loading = true;
            //this.$store.commit('user/SET_PROTESTLIST',res.result)
            this.datas = res.result.list;
            this.loading = false;
            this.pagination.total = res.result.total;
          }else{
            this.$message.info(res.message)
          }
        }))
        if(callback!=undefined){
          callback()
        }
        this.loading = false;
      },
      refreshTestItemModal(pid){
        this.loadData();
        const refreshPro = this.datas.filter(item => pid === item.id)[0]
        console.log("refreshTestItemModal")
        console.log(refreshPro)
        this.$refs.soilTestModule.look(refreshPro);
        this.$refs.soilTestModule.naddd = true;
        this.$refs.soilTestModule.add = false;
      },
      handleDelete: function(id){
        let that = this;
        deleteSoilTest({id: id}).then((res)=>{
          if(res.success){
            that.$message.success(res.message);
            that.loadData();
          }else{
            that.$message.warning(res.message);
          }
        });
      },
      handleEdit: function(record){
        let a=1;
        this.$refs.soilTestModule.edit(record,a);
        this.$refs.soilTestModule.title="编辑土壤检测信息"
        this.$refs.soilTestModule.okText="确认修改"
      },
      handleOk(){
        this.visible=false
      },
      handleReset () {
        this.form.resetFields();
        this.userinfo={};
        this.dateString='';
        this.area="";
        this.value="";
        this.loadData();
      },
      onChange(date, dateString){
        this.dateString = dateString;
        if(dateString==""){
          this.userinfo.testTime='';
          this.loadData();
        }
      },
      handleSearch(e){
        e.preventDefault();
        this.form.validateFieldsAndScroll((err, values) => {
          if (!err) {
            /*this.userinfo=this.dateString;
            for(let k in this.userinfo){
              if(this.userinfo[k]!=undefined && this.userinfo[k].trim()==''){
                this.userinfo[k] = undefined
              }
            }*/
            this.userinfo.testTime=this.dateString;
            this.userinfo.areaCode=this.area;
            this.userinfo.areaLevel=this.areaLevel;
            this.loadData();
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
