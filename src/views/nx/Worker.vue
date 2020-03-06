<template>
  <div style="width:100%;height:auto;padding:1px;background:white;">
    <div style="background:white;padding:10px 0 10px 0;width:100%;">
      <div style="margin:0 1% 0 0;">
        <div>
          <div style="min-width:172px;margin-bottom:10px;margin-top:10px;">
            <a-button type="primary" html-type="submit" icon="search" @click="handleSearch">查询</a-button>
            <a-button type="primary" icon="reload" style="margin-left: 8px" @click="handleReset">重置</a-button>
          </div>
          <div class="select">
            <a-form
              :form="form"
              @submit="handleSearch">
              <div style="float:left;width:30%;height:50px;margin-right:1%;margin-bottom:10px;">
      <a-form-item
      v-bind="formItemLayout"
      label="基地地区查询"
    >
      <a-tree-select
    :dropdownStyle="{ maxHeight: '400px', overflow: 'auto' }"
    :treeData="treeData"
    @change="onchange"
    :value="value"
  />
    </a-form-item>
              </div>
              <div style="float:left;width:30%;height:50px;margin-right:1%;margin-bottom:10px;">
                <a-form-item
                v-bind="formItemLayout"
      label="基地名称查询"
    >
    <a-input
            v-decorator="[
          'baseName',
        ]"
          >
          </a-input>
       <!-- <a-select

      v-decorator="[
          'baseName',
        ]"
         >
     <a-select-option v-for="(v,k) in baseinfo" :value="v.baseName" :key="k">{{v.baseName}}</a-select-option>
  </a-select> -->
    </a-form-item>
              </div>
      <div style="float:left;width:30%;height:50px;margin-right:1%;margin-bottom:10px;">
                <a-form-item
                v-bind="formItemLayout"
      label="管理员名称查询"
    >
    <a-input
            v-decorator="[
          'walkerName',
        ]"
          >
          </a-input>
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
        @click="handleAdd"
      >
        添加管理人员
      </a-button>
    </div>
      <div style="width:100%;">
    <a-table :columns="columns"
             :dataSource="dataSource"
             :pagination="ipagination"
             @change="handleTableChange"
             rowKey="id" >
     <span slot="baseInfos" slot-scope="baseInfos">
     <a-tag v-for="tag in baseInfos" color="rgb(60, 158, 171)" :key="tag.id">{{tag.baseName}}</a-tag>
     </span>
     <span slot="xx" slot-scope="text, record">
      <a  @click="handleEdit(record)">编辑</a>
      <a-divider type="vertical" />
       <a  @click="handleEditpassword(record)">密码</a>
      <a-divider type="vertical" />
      <a href="javascript:;" class="ant-dropdown-link">
        <a-popconfirm title='确定删除该菜单?' @confirm="() => handleDelete(record.id)">
          删除
        </a-popconfirm>
      </a>
    </span>
    </a-table>
      </div>

    </div>
    <worker-modal ref="workermodal" @ok="loadData"></worker-modal>
  </div>
</template>
<script>
  import WorkerModal from './modules/WorkerModal'
  import {deleteWalker,queryWalker} from '@/api/allapi'
  import { getmap } from '@/api/userApi'

  const columns = [{
    title: '管理人员名字',
    dataIndex: 'walkerName',
    key: 'walkerName',
  },{
    title: '管理人员电话',
    dataIndex: 'walkerPhoneNum',
    key: 'walkerPhoneNum',
  },{
    title: '管理人员住址',
    dataIndex: 'contactAddresss',
    key: 'contactAddresss',
  },{
    title: '管理人员邮箱',
    dataIndex: 'walkerEmail',
    key: 'walkerEmail',
  }, {
  title: '绑定的基地',
  dataIndex: 'baseInfos',
  scopedSlots: { customRender: 'baseInfos' },
},{
    title: '创建时间',
    dataIndex: 'createTime',
    key: 'createTime',
  }, {
    title: '操作',
    key: 'action',
    scopedSlots: { customRender: 'xx' },
  }];
  const i = 1;

  export default {
    name:'WorkerList',
    components: {
      WorkerModal
    },
    data() {
      return {
        columns,
        loading: false,
        dataSource:[],
        userinfo:{},
        value:'',
        area:'',
        treeData:[],
        ipagination:{
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
        form: this.$form.createForm(this),
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
      }
    },

    methods:{
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
    },
       handleReset() {
        this.loading = true;
        this.userinfo = {};
        this.value='';
        this.area='';
        this.form.resetFields();
        this.loadData();
        this.loading = false;
      },
       handleSearch(e) {
        e.preventDefault();
        this.userinfo = this.form.getFieldsValue(['baseName','walkerName']);     
        //this.userinfo = this.form.getFieldsValue(['walkerName']);
        this.userinfo.areaCode=this.area[0];
        this.userinfo.level=this.area[1];
        console.log(this.userinfo);
        for (let k in this.userinfo) {
          if (this.userinfo[k] != undefined && this.userinfo[k].trim() == '') {
            this.userinfo[k] = undefined;
          }
        }
        this.loadData();
      },
    handleTableChange(pagination){
    this.ipagination = pagination
    this.loadData();
    },
      getQueryParams(){
        let param = {};//Object.assign({}, this.queryParam);
        //param.field = this.getQueryField();
        param=this.userinfo;
        param.pageNo = this.ipagination.current;
        param.pageSize = this.ipagination.pageSize;
        return param;
      },
      loadData(){
        this.loading = true;
        let params = this.getQueryParams();//查询条件
        queryWalker(params).then((res)=>{
          if(res.success){
            this.dataSource = res.result.list;
            this.ipagination.total = res.result.total;
          }
        })
        this.loading = false;
      },
      handleOk () {

      },
      handleEditpassword(record){
       this.$refs.workermodal.editpassword(record);
        this.$refs.workermodal.title="修改密码";
      },
      handleEdit (record) {
        this.$refs.workermodal.edit(record);
        this.$refs.workermodal.title="编辑";
      },
      handleAdd(){
        this.$refs.workermodal.add();
        this.$refs.workermodal.title="新增";
      },
      handleDelete(id){
        console.log(id);
        var that = this;
        let params = {};
        params.id = id;
        deleteWalker(params).then((res)=>{
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
      this.treeData=[];
      this.loadmap();
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
</style>