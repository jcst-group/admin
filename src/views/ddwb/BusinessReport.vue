<template>
    <div>
        <div class="button">
            <a-button class="export-btn btn" type="primary" icon="download" @click="exporttale">导出</a-button>
            <a-button class="review-btn btn" type="primary" icon="reload" @click="review">重置</a-button>
            <a-button class="search-btn btn" type="primary" icon="search" @click="search">查询</a-button>
        </div>
        <div class="input">
            <span class="title">作物名称：</span>
            <a-select v-model="cropid" @change="handleChangecrop" class="inp">
                <a-select-option v-for="(v,k) in croplist" :value="v.id" :key="k">{{v.cropName}}</a-select-option>
            </a-select>
            <span class="title">基地名称：</span>
            <a-select v-model="baseid" @change="handleChangebase" class="inp">
                <a-select-option v-for="(v,k) in baselist" :value="v.id" :key="k">{{v.baseName}}</a-select-option>
            </a-select>
            <span class="title">年份：</span>
            <DatePicker
                class="inp"
                :value='curDate'
                type="year"
                :clearable="false"
                @on-change="handleChangeyear"
                placeholder="请选择开始年份">
            </DatePicker>        
        </div>
        <div class="table">
         <a-table :pagination="ipagination" @change="handleTableChange" :rowKey="record => record.id" :columns="columns" :dataSource="data" :loading="loading">
           <div style="width:100%;text-align:center;" slot="materiel" slot-scope="text,record">
                <!-- <a-row :gutter="16">
                   <a-col :span="12">农资物料名称</a-col>
                   <a-col :span="12">农资物料金额(元)</a-col>
               </a-row>
               <a-divider style="margin:10px 0;"></a-divider> -->
             <div v-for="(v,k) in record.materielCost" :key="k">
               <a-row :gutter="16">
                   <a-col :span="12">{{v.materialName}}</a-col>
                   <a-col :span="12">{{v.cost}}</a-col>
               </a-row>
               <a-divider style="margin:10px 0;" v-if="record.materielCost.length!=1&&k<record.materielCost.length-1"></a-divider>
             </div>
           </div>
           
           <div style="width:100%;text-align:center;" slot="harvested" slot-scope="text,record">
                <!-- <a-row :gutter="16">
                   <a-col :span="12">采收品名称</a-col>
                   <a-col :span="12">采收品产量</a-col>
               </a-row>
               <a-divider style="margin:10px 0;"></a-divider> -->
             <div v-for="(v,k) in record.harvested" :key="k">
               <a-row :gutter="16">
                   <a-col :span="12">{{v.type.displayName}}-{{v.harvestedName}}</a-col>
                   <a-col :span="12">{{v.totalYield}}</a-col>
               </a-row>
               <a-divider style="margin:10px 0;" v-if="record.harvested.length!=1&&k<record.harvested.length-1"></a-divider>
             </div>
           </div>

           <div style="width:100%;text-align:center;" slot="user" slot-scope="text,record">
             <div style="display:inline-block" v-for="(v,k) in record.userList" :key="k">
                 {{v.realName}}
               <span v-if="record.userList.length!=1&&k<record.userList.length-1">、</span>
             </div>
           </div>
        </a-table>
        </div>
    </div>
</template>
<script>
import {getALLBaseList,getAllCrop,getAllBusiness} from '@/api/ddwbApi'
export default {
    name: "businessreport",
    data(){
        return{
            cropid:'',
            croplist:[],
            baseid:'',
            baselist:[],
            curDate:null,
            data:[],
            loading:false,
            par:{},
            ipagination: {
            current: 1,
            pageSize: 2,
            pageSizeOptions: ['2', '5', '10'],
            showTotal: (total, range) => {
             return range[0] + '-' + range[1] + '共' + total + '条';
            },
            showQuickJumper: true,
            showSizeChanger: true,
            total: 0
           },
            columns:[{
        title:()=>{
            return(
                    <div style="width:100%;font-size:16px;">批次名称</div>
            )
        },
        align:'center',
        width:'10%',
        dataIndex: 'batchName',
      }, {
        title:()=>{
            return(
                <div style="width:100%;">
                    <div style="width:100%;font-size:16px;">采收品</div>
                    <div style="width:100%;text-align:center">
                        <span style="width:50%;padding:0 8px;display:inline-block">采收品名称</span>
                        <span style="width:50%;padding:0 8px;display:inline-block">采收品产量</span>
                    </div>
                </div>
            )
        },
        align:'center',
        width:'25%',
        scopedSlots: { customRender: 'harvested' },
      }, {
        title:()=>{
            return(
                <div style="width:100%;">
                    <div style="width:100%;font-size:16px;">农资物料</div>
                    <div style="width:100%;text-align:center">
                        <span style="width:50%;padding:0 8px;display:inline-block">农资物料名称</span>
                        <span style="width:50%;padding:0 8px;display:inline-block">农资物料金额(元)</span>
                    </div>
                </div>
            )
        },
        align:'center',
        width:'25%',
        scopedSlots: { customRender: 'materiel' },
      }, {
        title:()=>{
            return(
                    <div style="width:100%;font-size:16px;">人力成本</div>
            )
        },
        align:'center',
        width:'10%',
        dataIndex:'humanCost',
      },{
        title:()=>{
            return(
                    <div style="width:100%;font-size:16px;">年份</div>
            )
        },
        align:'center',
        width:'10%',
        dataIndex:'startYear',
      },{
        title:()=>{
            return(
                    <div style="width:100%;font-size:16px;">基地负责人</div>
            )
        },
        align:'center',
        width:'20%',
        scopedSlots: { customRender: 'user' },
      }],
        }
    },
    created(){
        getALLBaseList().then(res=>{
            if(res.success){
                this.baselist=res.result;
            }
        });
        getAllCrop().then(res=>{
            if(res.success){
                this.croplist=res.result;
            }
        });
        this.loadData();
    },
    mounted(){

    },
    methods:{
        exporttale(){
            let par='';
            let api='/api2/budget/businessExport';
            let realapi='';
            if(this.baseid){
                if(this.cropid||this.curDate){
                    par='baseId='+this.baseid+'&';
                }else{
                    par='baseId='+this.baseid;
                }
                    
            }
            if(this.cropid){
                if(this.curDate){
                    par+='cropId='+this.cropid+'&';
                }else{
                    par+='cropId='+this.cropid;
                }
            }
            if(this.curDate){
                par+='startYear='+this.curDate;
            }
            if(par){
                realapi=api+'?'+par;
            }else{
                realapi=api;
            }
            let a = document.createElement('a')
            a.href = realapi;
            var evt = document.createEvent("MouseEvents"); 
            evt.initEvent("click",true,true); 
            a.dispatchEvent(evt); 
        },
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
            getAllBusiness(params).then(res=>{
                if(res.success){
                this.data=res.result.list;
                for(let i=0;i<this.data.length;i++){
                    this.data[i].materielCost.push.apply(this.data[i].materielCost,this.data[i].deviceCost);
                };
                this.ipagination.total = res.result.total;
                this.loading=false;
                }
            })
        },
        review(){
            this.baseid='';
            this.cropid='';
            this.curDate=null;
            this.par={};
            this.loadData();
        },
        search(){
            this.loadData();
        },
        handleChangecrop(value){
            this.cropid=value
            this.par.cropId=value;
        },
        handleChangebase(value){
            this.baseid=value
            this.par.baseId=value;
        },
        handleChangeyear(value){
            this.curDate=value;
            this.par.startYear=value;
     },
    }
}
</script>
<style scoped>
.scroll >>> .ant-table-body::-webkit-scrollbar{
  width: 18px;
  height: 0px;
}
.scroll{
  width:100%;
  height:648px;
  margin-top:20px;
  overflow-x:hidden;
}
.scroll:hover{
   overflow-x:auto;
}
.table{
    margin-top:20px;
}
.table >>> td{
    vertical-align:text-top;
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
    .title
        margin-right 5px
        line-height 32px
    .inp
        width 15%
        margin-right 10px
</style>