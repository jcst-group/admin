<template>
  <div>
      <div class="button">
          <a-button class="export-btn btn" type="primary" icon="download" @click="exporttale">导出</a-button>
          <a-button class="review-btn btn" type="primary" icon="reload" @click="review">重置</a-button>
          <a-button class="search-btn btn" type="primary" icon="search" @click="search">查询</a-button>
        </div>
       <div class="input">
            <span class="title">选择计划：</span>
           <a-select v-model="planvale" @change="handleChange" class="inp">
              <a-select-option v-for="(v,k) in plan" :value="v.id" :key="k">{{v.planName}}</a-select-option>
            </a-select>
            <span class="title">开始年份：</span>
             <DatePicker
             class="inp"
            :value='curDate'
            type="year"
            :clearable="false"
            @on-change="handleChangeyear"
            placeholder="请选择开始年份"></DatePicker>
            <span class="title">选择批次：</span>
             <a-select v-model="cropbatch" mode="multiple" class="inp1">
      <a-select-option v-for="(v,k) in crop" :value="v.id" :key="k">{{v.batchName}}</a-select-option>
    </a-select>
        </div>
      <div v-if="all" style="margin-top:20px;"><span>汇总信息&nbsp;&nbsp;年总费用:{{all}}元</span></div>
      <div class="scroll">
        <div style="min-width:2300px;">
         <a-table :pagination="false" :scroll="{y: 580 }" :rowKey="record => record.id" :columns="columns" :dataSource="data" :loading="loading">
           <div style="width:100%;text-align:center;" slot="personName" slot-scope="text,record">
             <div v-for="(v,k) in record.personnelActList" :key="k">
               {{v.personName}}
               <a-divider style="margin:10px 0;" v-if="record.personnelActList.length!=1&&k<record.personnelActList.length"></a-divider>
             </div>
           </div>
           <div style="width:100%;text-align:center;" slot="personpreUnitCount" slot-scope="text,record">
             <div v-for="(v,k) in record.personnelActList" :key="k">
               {{v.preUnitCount}}
               <a-divider  v-if="record.personnelActList.length!=1&&k<record.personnelActList.length"></a-divider>
             </div>
           </div>
           <div style="width:100%;text-align:center;" slot="personpreUnitPrice" slot-scope="text,record">
             <div v-for="(v,k) in record.personnelActList" :key="k">
               {{v.preUnitPrice}}
               <a-divider style="margin:10px 0;" v-if="record.personnelActList.length!=1&&k<record.personnelActList.length"></a-divider>
             </div>
           </div>
           <div style="width:100%;text-align:center;" slot="personpreUnitCount" slot-scope="text,record">
             <div v-for="(v,k) in record.personnelActList" :key="k">
               {{v.preUnitCount}}
               <a-divider style="margin:10px 0;" v-if="record.personnelActList.length!=1&&k<record.personnelActList.length"></a-divider>
             </div>
           </div>
             <div style="width:100%;text-align:center;" slot="personpreCal" slot-scope="text,record">
             <div v-for="(v,k) in record.personnelActList" :key="k">
               {{v.preCal}}
               <a-divider style="margin:10px 0;" v-if="record.personnelActList.length!=1&&k<record.personnelActList.length"></a-divider>
             </div>
           </div>
           <div style="width:100%;text-align:center;" slot="allpersonpreCal" slot-scope="text,record">
               {{getall(record,1)}}
           </div>

           <div style="width:100%;text-align:center;" slot="materialName" slot-scope="text,record">
             <div v-for="(v,k) in record.materialActList" :key="k">
               {{v.materialName}}
               <a-divider style="margin:10px 0;" v-if="record.materialActList.length!=1&&k<record.personnelActList.length"></a-divider>
             </div>
           </div>
           <div style="width:100%;text-align:center;" slot="materialcompany" slot-scope="text,record">
             <div v-for="(v,k) in record.materialActList" :key="k">
               {{v.company}}
               <a-divider style="margin:10px 0;" v-if="record.materialActList.length!=1&&k<record.personnelActList.length"></a-divider>
             </div>
           </div>
           <div style="width:100%;text-align:center;" slot="materialpreUnitPrice" slot-scope="text,record">
             <div v-for="(v,k) in record.materialActList" :key="k">
               {{v.preUnitPrice}}
               <a-divider style="margin:10px 0;" v-if="record.materialActList.length!=1&&k<record.personnelActList.length"></a-divider>
             </div>
           </div>
           <div style="width:100%;text-align:center;" slot="materialpreUnitCount" slot-scope="text,record">
             <div v-for="(v,k) in record.materialActList" :key="k">
               {{v.preUnitCount}}
               <a-divider style="margin:10px 0;" v-if="record.materialActList.length!=1&&k<record.personnelActList.length"></a-divider>
             </div>
           </div>
             <div style="width:100%;text-align:center;" slot="materialpreCal" slot-scope="text,record">
             <div v-for="(v,k) in record.materialActList" :key="k">
               {{v.preCal}}
               <a-divider style="margin:10px 0;" v-if="record.materialActList.length!=1&&k<record.personnelActList.length"></a-divider>
             </div>
           </div>
            <div style="width:100%;text-align:center;" slot="allmaterialpreCal" slot-scope="text,record">
               {{getall(record,2)}}
           </div>

           <div style="width:100%;text-align:center;" slot="deviceName" slot-scope="text,record">
             <div v-for="(v,k) in record.deviceActList" :key="k">
               {{v.deviceName}}
               <a-divider style="margin:10px 0;" v-if="record.deviceActList.length!=1&&k<record.deviceActList.length"></a-divider>
             </div>
           </div>
           <div style="width:100%;text-align:center;" slot="devicecompany" slot-scope="text,record">
             <div v-for="(v,k) in record.deviceActList" :key="k">
               {{v.company}}
               <a-divider style="margin:10px 0;" v-if="record.deviceActList.length!=1&&k<record.deviceActList.length"></a-divider>
             </div>
           </div>
           <div style="width:100%;text-align:center;" slot="devicepreUnitPrice" slot-scope="text,record">
             <div v-for="(v,k) in record.deviceActList" :key="k">
               {{v.preUnitPrice}}
               <a-divider style="margin:10px 0;" v-if="record.deviceActList.length!=1&&k<record.deviceActList.length"></a-divider>
             </div>
           </div>
           <div style="width:100%;text-align:center;" slot="devicepreUnitCount" slot-scope="text,record">
             <div v-for="(v,k) in record.deviceActList" :key="k">
               {{v.preUnitCount}}
               <a-divider style="margin:10px 0;" v-if="record.deviceActList.length!=1&&k<record.deviceActList.length"></a-divider>
             </div>
           </div>
             <div style="width:100%;text-align:center;" slot="devicepreCal" slot-scope="text,record">
             <div v-for="(v,k) in record.deviceActList" :key="k">
               {{v.preCal}}
               <a-divider style="margin:10px 0;" v-if="record.deviceActList.length!=1&&k<record.deviceActList.length"></a-divider>
             </div>
           </div>
            <div style="width:100%;text-align:center;" slot="alldevicepreCal" slot-scope="text,record">
               {{getall(record,3)}}
           </div>
        </a-table>
         </div>
      </div>
  </div>
</template>
<script>
  import { getBatchByPlanId,getallplan,getBudgetList } from '@/api/ddwbApi'
export default {
  name: "budgetereport",
  data(){
    return{
      plan:[],
      planvale:'',
      curDate: null,
      cropbatch:[],
      crop:[],
      all:null,
      columns:[{
        title: '时间',
        align:'center',
        width:'5%',
        dataIndex: 'executionTime',
      }, {
        title: '农事',
        align:'center',
        width:'5%',
        dataIndex: 'farmingName',
      }, {
        title: '工种',
        align:'center',
        width:'5%',
        scopedSlots: { customRender: 'personName' },
      },{
        title: '人*天',
        align:'center',
        width:'5%',
        scopedSlots: { customRender: 'personpreUnitCount' },
      },{
        title: '元/人/天',
        align:'center',
        width:'5%',
        scopedSlots: { customRender: 'personpreUnitPrice' },
      },{
        title: '小计(元)',
        align:'center',
        width:'5%',
        scopedSlots: { customRender: 'personpreCal' },
      },{
        title: '总计(元)',
        align:'center',
        width:'5%',
        scopedSlots: { customRender: 'allpersonpreCal' },
      },{
        title: '物料名称',
        align:'center',
        width:'5%',
        scopedSlots: { customRender: 'materialName' },
      },{
        title: '物料单位',
        align:'center',
        width:'5%',
        scopedSlots: { customRender: 'materialcompany' },
      },{
        title: '物料单价(元)',
        align:'center',
        width:'5%',
        scopedSlots: { customRender: 'materialpreUnitPrice' },
      },{
        title: '物料数量',
        align:'center',
        width:'5%',
        scopedSlots: { customRender: 'materialpreUnitCount' },
      },{
        title: '物料小计(元)',
        align:'center',
        width:'5%',
        scopedSlots: { customRender: 'materialpreCal' },
      },{
        title: '物料总价(元)',
        align:'center',
        width:'5%',
        scopedSlots: { customRender: 'allmaterialpreCal' },
      },{
        title: '农机名称',
        align:'center',
        width:'5%',
        scopedSlots: { customRender: 'deviceName' },
      },{
        title: '农机单位',
        align:'center',
        width:'5%',
        scopedSlots: { customRender: 'devicecompany' },
      },{
        title: '农机单价(元)',
        align:'center',
        width:'5%',
        scopedSlots: { customRender: 'devicepreUnitPrice' },
      },{
        title: '农机数量',
        align:'center',
        width:'5%',
        scopedSlots: { customRender: 'devicepreUnitCount' },
      },{
        title: '农机小计(元)',
        align:'center',
        width:'5%',
        scopedSlots: { customRender: 'devicepreCal' },
      },{
        title: '农机总价(元)',
        align:'center',
        width:'5%',
        scopedSlots: { customRender: 'alldevicepreCal' },
      },{
        title: '合计(元)',
        align:'center',
        width:'5%',
        dataIndex: 'costSum',
      }],
      data:[],
      loading:false,
    }
  },
  created(){
    getallplan().then(res=>{
      if(res.success){
        this.plan=res.result;
      }
    });

  },
  mounted(){

  },
  methods:{
    exporttale(){
      if(this.cropbatch.length>0){
          let api = '/api2/budget/export?'
      for(let i=0;i<this.cropbatch.length;i++){
        if(i!=this.cropbatch.length-1){
          api+='batchIds=' + this.cropbatch[i]+'&'
        }else{
          api+='batchIds=' + this.cropbatch[i]
        }
      }
      let a = document.createElement('a')
      a.href = api
      var evt = document.createEvent("MouseEvents"); 
      evt.initEvent("click",true,true); 
      a.dispatchEvent(evt); 
      }else{
          this.$message.warning("请先选择批次！")
      }
    },
    getall(record,b){
      let data=0;
      if(b==1){
        if(record.personnelActList.length==0){
          return null;
        }else{
           for(let i=0;i<record.personnelActList.length;i++){
          data+=record.personnelActList[i].preCal;
        }
        data=data.toFixed(1);
        return data;
        }
      }
      if(b==2){
        if(record.materialActList.length==0){
          return null;
        }else{
           for(let i=0;i<record.materialActList.length;i++){
          data+=record.materialActList[i].preCal;
        }
        data=data.toFixed(1);
        return data;
        }
      }
      if(b==3){
        if(record.deviceActList.length==0){
          return null;
        }else{
           for(let i=0;i<record.deviceActList.length;i++){
          data+=record.deviceActList[i].preCal;
        }
        data=data.toFixed(1);
        return data;
        }
      }
    },
    huoqucrop(){
      let par={};
      par.planId=this.planvale;
      par.startYear=this.curDate;
      getBatchByPlanId(par).then(res=>{
          if(res.success){
            this.crop=res.result;
          }
          if(res.result.length<1){
            this.$message.warning("暂无批次！")
          }
      })
    },
     handleChange(value){
        if(this.curDate){
          this.cropbatch=[];
          this.huoqucrop();
        }
     },
     handleChangeyear(value){
        this.curDate=value;
        if(this.planvale){
          this.cropbatch=[];
          this.huoqucrop();
        }
     },
     review(){
        this.planvale='';
        this.curDate=null;
        this.cropbatch=[];
        this.data=[];
        this.all=null;
     },
     search(){
        if(this.cropbatch.length>0){
          let par={};
          this.all=null;
          this.loading=true;
          //par.batchIds=JSON.stringify(this.cropbatch);
          par.batchIds=this.cropbatch;
          getBudgetList(par).then(res=>{
              if(res.success){
                this.data=res.result;
                this.loading=false;
                for(let i=0;i<res.result.length;i++){
                  res.result[i].id=i;
                  this.all+=Number(res.result[i].costSum);
                }
                if(this.all){
                  this.all=this.all.toFixed(2);
                }
                //console.log(res.result);
              }
          })
        }else{
          this.$message.warning("请先选择批次！")
        }
     },
  },
}
</script>
<style scoped>
.scroll >>> .ant-table-body::-webkit-scrollbar{
  width: 18px;
  height: 0px;
}
.scroll{
  width:100%;
  margin-bottom:15px;
  margin-top:20px;
  overflow-x:hidden;
}
.scroll:hover{
   overflow-x:auto;
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
    .inp1
        width 25%
        margin-right 10px
    .btable
        margin-top 10px
        width 100%
    .scroll::-webkit-scrollbar
        width 0px
        height 5px
    .scroll::-webkit-scrollbar-thumb
        border-radius 10px
        -webkit-box-shadow inset 0 0 5px rgba(0,0,0,1)
        background #535353
    .scroll::-webkit-scrollbar-track
        -webkit-box-shadow inset 0 0 5px rgba(0,0,0,0.2)
        border-radius 10px
        background #EDEDED

</style>
