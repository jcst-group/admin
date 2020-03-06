<template>
    <div class="temp">
        <div class="button">
          <a-button class="review-btn btn" type="primary" icon="reload" @click="review">重置</a-button>
          <a-button class="search-btn btn" type="primary" icon="search" @click="search">查询</a-button>
          <a-button class="add-btn btn" type="primary" icon="plus" @click="addbaseevn">新增</a-button>
        </div>
        <div class="input">
            <span class="title">环境条件：</span>
           <a-select v-model="condition" class="inp">
              <a-select-option v-for="(v,k) in Condition" :value="v.code" :key="k">{{v.displayName}}</a-select-option>
            </a-select>
        </div>
        <div class="btable">
            <a-table :columns="columns"
                :dataSource="dataSource"
                :pagination="ipagination"
                @change="handleTableChange"
                :rowKey="record => record.id"
                :loading="loading"
                bordered
                >
                <span slot="maxValue" slot-scope="text, record">
                  {{record.minValue}}至{{record.maxValue}}
                  </span>
                <span slot="action" slot-scope="text, record">
                    <a href="javascript:;" @click="edit(record)">编辑</a>
                     <a-divider type="vertical"/>
                <a-popconfirm title="确定删除吗?" @confirm="del(record)">
                    <a>删除</a>
                </a-popconfirm>
                    <!-- <a href="javascript:;" @click="del(record)">删除</a> -->
                </span>
            </a-table>
        </div>
        <addBaseEvn ref="addbaseevn"/>
        <editBaseEvn ref="editbaseevn"/>
    </div>
</template>
<script>
import {getEnvStandards,getEnvStandardsList,delEnvStandards} from '@/api/ddwbApi'
import addBaseEvn from '@/views/ddwbmodule/addbaseevn'
import editBaseEvn from '@/views/ddwbmodule/editbaseevn'



const columns = [{
    title: '检测项目',
    dataIndex: 'item',
    key: 'item',
    align: 'center',
  }, {
    title: '单位',
    dataIndex: 'unit.displayName',
    key: 'unit.displayName',
    align: 'center',
  }, {
    title: '检测标准',
    dataIndex: 'maxValue',
    key:'maxValue',
    scopedSlots: { customRender: 'maxValue' },
    align: 'center',
  },{
    title: '环境条件',
    dataIndex: 'itemName.displayName',
    key: 'itemName.displayName',
    align: 'center',
  },{
    title: '操作',
    dataIndex: 'action',
    key: 'action',
    scopedSlots: { customRender: 'action' },
    align: 'center',
  }];
export default {
  name: "envstandards",
  components:{
    addBaseEvn,
    editBaseEvn,
  },
  data(){
    return{
     condition:'',
     Condition:[],
     columns,
     loading:false,
     dataSource:[],
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
     par:{},
    }
  },
  created(){
    this.loadData();
    getEnvStandards().then((res)=>{
      if(res.success){
        this.Condition=res.result;
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
        this.loading=true;
        let params = this.getQueryParams();//查询条件
        getEnvStandardsList(params)
          .then((res) => {
           // console.log(res);
            if (res.success) {
              this.dataSource = res.result.list;
              this.ipagination.total = res.result.total;
              this.loading=false;
            }
          });
      },
      addbaseevn(){
         this.$refs.addbaseevn.add();
      },
      edit(record){
         this.$refs.editbaseevn.edit(record);
      },
      del(record){
        delEnvStandards({id:record.id}).then((res)=>{
          if (res.success) {
                this.$message.success(res.message);
                this.loadData();
              } else {
                this.$message.warning(res.message);
              }
        })
      },
       review(){
        this.condition='';
        this.par={};
        this.loadData();
      },
      search(){
        if(this.condition){
          this.par.itemName=this.condition;
        }
       this.loadData();
      },
  },
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
        width 100%
        margin-top 10px
</style>
