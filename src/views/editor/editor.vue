<template>
    <div>
        <div class="addbut">
            <a-button class="btn" type="primary" icon="reload" @click="handleReset">重置</a-button>
            <a-button class="btn" type="primary" icon="search" @click="handleSearch">查询</a-button>    
            <a-button class="btn" type="primary" icon="plus" @click="add">新增文章</a-button>
        </div>
        <div class="input">
            <span class="title">类别：</span>
            <a-cascader style="margin-right:5px;"  :options="Categoryinfo" placeholder=" " :fieldNames="{ label: 'name', value: 'id', children: 'children' }" changeOnSelect v-model="categoryId"></a-cascader>
            <span class="title">标题：</span>
            <a-input v-model="partitle" class="inp"/>
            <span class="title">作者：</span>
            <a-input v-model="parauto" class="inp"/>
        </div>
        <a-table :columns="columns"
                :dataSource="dataSource"
                :pagination="ipagination"
                @change="handleTableChange"
                :loading="loading"
                bordered
                rowKey="id"
        >
            <span slot="titlet" slot-scope="text, record">
              <a @click="gotoshow(record.id)">{{text}}</a>
            </span>
            <span slot="action" slot-scope="text, record">
              <a @click="handleEdit(record)">编辑</a>
              <a-divider type="vertical"/>
              <a-popconfirm title="确定删除吗?" @confirm="handleDelete(record.id)">
                  <a>删除</a>
              </a-popconfirm>
            </span>
            </a-table>
            <Editarticle ref="Editarticle"/>
            <!-- <div style="width:1000px;height:800px;text-align:center;" v-html="content"></div> -->
    </div>
</template>
<script>
import {articleList} from '@/api/ddwbApi'
import Editarticle from '@/views/editormodule/editarticle'
import {addEquipment,delEquipment,getEquipmentList,articleDel,categoryList}  from '@/api/ddwbApi'

const columns = [{
    title: '标题',
    dataIndex: 'title',
    key: 'title',
    scopedSlots: {customRender: 'titlet'},
    align:"center"
}, {
    title: '类别',
    dataIndex: 'category.category',
    key: 'category.category',
    align:"center"
}, {
    title: '作者',
    dataIndex: 'author',
    key: 'author',
    align:"center"
}, {
    title: '操作',
    dataIndex: 'action',
    key: 'action',
    scopedSlots: {customRender: 'action'},
    align: "center",
}];

export default {
    name:'editor',
     components: {
      Editarticle,
    },
    data(){
        return{
            Categoryinfo:null,
            content:'',
            categoryId:[],
            partitle:'',
            parauto:'',
            showsss:true,
            showssss:false,
            assss:false,
            aaaa:'暂无地块信息',
            columns,
            shows: false,
            shoos: false,
            base:'请选择所属基地',
            bases:'请选择监测地',
            basess:'',
            userinfo:{},
            baseinfo:[],
            baseinfoss:[],
            baseinfos:[],
            siteId:'',
            equipmentId:'',
            equipmentName:'',
            relationType:'',
            loading: false,
            queryParam: {},
            ipagination: {
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
            dataSource: [],
            form: this.$form.createForm(this),
        }
    },
    created(){
        categoryList().then(res=>{
            if(res.success){
                this.Categoryinfo=res.result;
            }
        })
    },
     methods: {
      gotoshow(id){
          this.$router.push({path:'/articleshow',query:{id:id}})
      },
      getQueryParams() {
        let param = Object.assign({}, this.userinfo);
        param.pageNo = this.ipagination.current;
        param.pageSize = this.ipagination.pageSize;
        return param;
      },
      loadData() {
        this.loading=true;
        let params = this.getQueryParams();//查询条件
        articleList(params).then((res) => {
          if (res.success) {
            this.dataSource = res.result.records;
            this.ipagination.total = res.result.total;
            this.loading=false;
          }
        })
      },
      add(){
        this.$refs.Editarticle.add();
      },
      handleEdit(record) {
        this.$refs.Editarticle.edit(record);
      },
      handleReset(){
        this.categoryId=[];
        this.partitle='';
        this.parauto='';
        this.userinfo={};
        this.loadData();
      },
      handleSearch(){
        this.userinfo={};
        if(this.categoryId.length>0){
          this.userinfo.categoryId=this.categoryId[this.categoryId.length-1];
        }
        if(this.partitle){
          this.userinfo.title=this.partitle;
        }
        if(this.parauto){
          this.userinfo.author=this.parauto;
        }
       this.loadData();
      },
      handleDelete(id) {
        var that = this;
        let params = {};
        params.id = id;
        articleDel(params).then((res) => {
          if (res.success) {
            that.$message.success(res.message);
            that.loadData();
          } else {
            that.$message.warning(res.message);
          }
        });
      },
      handleTableChange(pagination) {
        this.ipagination = pagination;
        this.loadData();
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
