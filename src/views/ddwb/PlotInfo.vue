<template>
 <div class="temp">
        <div class="button">
          <a-button class="review-btn btn" type="primary" icon="reload" @click="review">重置</a-button>
          <a-button class="search-btn btn" type="primary" icon="search" @click="search">查询</a-button>
          <a-button class="add-btn btn" type="primary" icon="plus" @click="addplot1">新增</a-button>
        </div>
        <div class="input">
            <span class="title">基地名称：</span>
           <a-select v-model="basevalue" class="inp">
              <a-select-option v-for="(v,k) in baseinfo" :value="v.id" :key="k">{{v.baseName}}</a-select-option>
            </a-select>
        </div>
        <div class="btable">
            <a-table :columns="columns"
                :dataSource="dataSource"
                :pagination="ipagination"
                @change="handleTableChange"
                :rowKey="record => record.id"
                >
                 <span slot="latitude" slot-scope="text, record">
                   {{record.longitude}};{{record.latitude}}
                   </span>
                   <span slot="edit" slot-scope="text, record">
                      <router-link :to="{path:'/plotinfo',query: { lotid:record.id }}" >编辑</router-link>
                   </span>
                <span slot="action" slot-scope="text, record">
                          <a href="javascript:;" @click="delplot1(record.id)">删除</a>
                </span>
            </a-table>
        </div>
        <addPlott ref="addplot"></addPlott>
    </div>
</template>
<script>
import {getALLBaseList,getPlotList,delPlot,addPlot,editPlot} from '@/api/ddwbApi'
import addPlott from '@/views/ddwbmodule/addplot'

const columns = [{
    title: '地块编号',
    dataIndex: 'lotCode',
    key: 'lotCode',
    align: 'center',
  },{
    title: '地块名称',
    dataIndex: 'lotName',
    key: 'lotName',
    align: 'center',
  }, {
    title: '地块面积(亩)',
    dataIndex: 'lotAcreage',
    key: 'lotAcreage',
    align: 'center',
  },
  //{
  //   title: '地块中心坐标(经度;纬度)',
  //   dataIndex: 'latitude',
  //   key: 'latitude',
  //   scopedSlots: { customRender: 'latitude' },
  //   align: 'center',
  // },{
  //   title: '海拔',
  //   dataIndex: 'altitude',
  //   key: 'altitude',
  //   align: 'center',
  // },
  {
    title: '所属基地',
    dataIndex: 'baseInfo.baseName',
    key: 'baseInfo.baseName',
    align: 'center',
  },{
    title: '所属农户',
    dataIndex: 'user.realName',
    key: 'user.realName',
    align: 'center',
  },{
    title: '描述',
    dataIndex: 'survey',
    key: 'survey',
    align: 'center',
  },{
    title: '地块状态',
    dataIndex: 'status',
    key: 'status',
    align: 'center',
     customRender:function (text) {
              if(text==1){
                return "使用中";
              }else if(text==2){
                return "空闲中";
              }else{
                return text;
              }
            },
  },{
    title: '编辑',
    dataIndex: 'edit',
    key: 'edit',
    scopedSlots: { customRender: 'edit' },
    align: 'center',
  },{
    title: '删除',
    dataIndex: 'action',
    key: 'action',
    scopedSlots: { customRender: 'action' },
    align: 'center',
  }];
export default {
  components:{
    addPlott,
  },
  data(){
    return{
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
           columns,
           dataSource: [],
           basevalue:'',
           baseinfo:[],
           par:{},
    }
  },
   created(){
      this.loadData();
      getALLBaseList().then((res)=>{
        if(res.success){
          this.baseinfo=res.result;
        }
      })
    },
    methods:{
       handleTableChange(pagination) {
        this.ipagination = pagination;
        this.loadData();
      },
      getQueryParams() {
        let param = Object.assign({}, this.par);
        param.pageNo = this.ipagination.current;
        param.pageSize = this.ipagination.pageSize;
        return param;
      },
      loadData() {
        let params = this.getQueryParams();//查询条件
        getPlotList(params)
          .then((res) => {
          //  console.log(res);
            if (res.success) {
              this.dataSource = res.result.list;
              this.ipagination.total = res.result.total;
            }
          });
      },
      review(){
        this.basevalue='';
        this.par={};
        this.loadData();
      },
      search(){
        if(this.basevalue){
          this.par.baseId=this.basevalue;
        }
       this.loadData();
      },
      addplot1(){
        this.$refs.addplot.add();
      },
      delplot1(id){
        delPlot({id:id}).then(res=>{
          if(res.success){
              this.$message.success(res.message);
              this.loadData();
          }else{
              this.$message.warning(res.message);
          }
        })
      },
    }
}
</script>
<style lang='stylus' scoped>
    .btn
        float right
        background #2c909c
        border-color #2c909c
        color #fff
        line-height 18px
        margin-right 10px
    .title
        margin-right 5px
        line-height 32px
    .inp
        width 10%
        margin-right 10px
    .btable
        margin-top 10px
        width 100%
</style>
