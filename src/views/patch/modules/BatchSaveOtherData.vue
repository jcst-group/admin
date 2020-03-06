<template>
  <a-list
    itemLayout="horizontal"
    :dataSource="data"
  >
    <a-list-item slot="renderItem" slot-scope="item, index">
      <a-list-item-meta
        :description="item.recordContent"
      >
        <span slot="title">{{item.farmingRecordName}}</span>
        <span slot="title" style="margin-left: 20px;">{{item.farmingRecordName}}</span>
      </a-list-item-meta>

      <span slot="actions">
         <a-radio-group :defaultValue="item.recordStatus" @change="upStatus(item)">
          <a-radio-button :value="0" >显示</a-radio-button>
          <a-radio-button :value="1" >不显示</a-radio-button>
        </a-radio-group>
        </span>
    </a-list-item>
  </a-list>
</template>
<script>
  import { getAllByBatchId,
    updateStatus} from '@/api/allapi'

  export default {
    data () {
      return {
        data:[],
        batchId:null,
      }
    },
    methods: {
      loadData(batchId){
        this.batchId = batchId;
        getAllByBatchId({batchId:batchId}).then((res)=>{
          if(res.success==true){
            console.log(res);
            let result = res.result;
            this.data = result;
            let all = result.length;
            this.$store.commit('pro/SET_RECORD_COUNT',all)
            let show = 0;
            for(let i=0;i<result.length;i++){
              let item = result[i];
              if(item.recordStatus===0){
                show++;
              }
            }
            let unshow = all-show;
            console.log("show",show);
            console.log("unshow",unshow);
            this.$store.commit('pro/SET_SHOW_RECORD_COUNT',show)
            this.$store.commit('pro/SET_UNSHOW_RECORD_COUNT',unshow)
            //this.$message.info(message);
            console.log(result);
          }else{
            this.$message.info(res.message)
          }
        })
      },
      upStatus(record){
        console.log("record Id :",record);
        updateStatus({id:record.id}).then((res)=>{
          if(res.success==true){
            console.log(res);
            let showAdd = 0;
            console.log("record.recordStatus=",record.recordStatus);
            showAdd = record.recordStatus===1?1:-1;
            console.log("showAdd ",showAdd);

            let show = this.$store.state.pro.showRecordCount
            show = show + showAdd;
            let unshow = this.$store.state.pro.unShowRecordCount
            unshow = unshow-showAdd;

            this.$store.commit('pro/SET_SHOW_RECORD_COUNT',show)
            this.$store.commit('pro/SET_UNSHOW_RECORD_COUNT',unshow)
            this.$message.info(res.message);
            this.loadData(this.batchId);
          }else{
            this.$message.info(res.message)
          }
        })
      }
    }
  }
</script>
<style>

</style>
