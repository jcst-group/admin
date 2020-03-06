<template>
  <a-list
    itemLayout="horizontal"
    :dataSource="data"
    v-if="data.length > 0"
  >
    <a-list-item class="message-wrapper" slot="renderItem" slot-scope="item">
      <a-list-item-meta
        :description="item.farmingItem ? item.farmingItem.method : ''"
      >
        <span slot="title" class="time">
          <a-icon type="clock-circle" />
          {{item.executionTime}} {{item.solarTerm ? item.solarTerm.displayName : null}}
        </span>
        <span slot="title" class="title">{{item.farmingItem ? item.farmingItem.farmingName : '暂无数据'}}</span>
      </a-list-item-meta>
      <span slot="actions" v-if="item.pictureInfoList && item.pictureInfoList.length > 0">
         <img alt="" width="60" height="60" style="border-radius:50%" :src="'/api2/pictureInfo/show/' + item.pictureInfoList[0].pictureUrl ">
      </span>
    </a-list-item>
  </a-list>
</template>
<script>
  import { getAllByBatchId,updateStatus, getOrderByBatch} from '@/api/allapi'
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
        getOrderByBatch({batchId:batchId}).then(res => {
          if (res.success) {
            this.data = res.result
          }
        })
        // getAllByBatchId({batchId:batchId}).then((res)=>{
        //   if(res.success==true){
        //     console.log(res);
        //     let result = res.result;
        //     this.data = result;
        //     let all = result.length;
        //     this.$store.commit('pro/SET_RECORD_COUNT',all)
        //     let show = 0;
        //     for(let i=0;i<result.length;i++){
        //       let item = result[i];
        //       if(item.recordStatus===0){
        //         show++;
        //       }
        //     }
        //     let unshow = all-show;
        //     console.log("show",show);
        //     console.log("unshow",unshow);
        //     this.$store.commit('pro/SET_SHOW_RECORD_COUNT',show)
        //     this.$store.commit('pro/SET_UNSHOW_RECORD_COUNT',unshow)
        //     //this.$message.info(message);
        //     console.log(result);
        //   }else{
        //     this.$message.info(res.message)
        //   }
        // })
      },
      // upStatus(record){
      //   console.log("record Id :",record);
      //   updateStatus({id:record.id}).then((res)=>{
      //     if(res.success==true){
      //       console.log(res);
      //       let showAdd = 0;
      //       console.log("record.recordStatus=",record.recordStatus);
      //       showAdd = record.recordStatus===1?1:-1;
      //       console.log("showAdd ",showAdd);

      //       let show = this.$store.state.pro.showRecordCount
      //       show = show + showAdd;
      //       let unshow = this.$store.state.pro.unShowRecordCount
      //       unshow = unshow-showAdd;

      //       this.$store.commit('pro/SET_SHOW_RECORD_COUNT',show)
      //       this.$store.commit('pro/SET_UNSHOW_RECORD_COUNT',unshow)
      //       this.$message.info(res.message);
      //       this.loadData(this.batchId);
      //     }else{
      //       this.$message.info(res.message)
      //     }
      //   })
      // }
    }
  }
</script>
<style lang='stylus'>
  .message-wrapper
    position relative
    height 100px
    .ant-collapse-content-box
      padding 0 16px
    .ant-list-item-meta-description
      position absolute
      width 80%
    .time
      position absolute
      top 10px
      left 10px
      font-size 8px
    .title
      display inline-block
      padding 0 10px
      text-align center
      background-color antiquewhite
      color #f40
      border-radius 12px
</style>
