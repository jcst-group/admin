<template>
 <div>
     <a-modal
      :title="title"
      v-model="visible"
      style="top:5%;height: 90%;"
      cancelText="取消"
      :okText="okText"
      @ok="handleOk"
      :maskClosable="false"
    >
    <label>基地：</label>
    <a-select v-model="serpost" style="width:100%;">
      <a-select-option v-for="v in baseinfo" :value="v.id" :key="v.id" v-if="next">{{v.baseName}}</a-select-option>
       <a-select-option v-for="v in baseinfo" :value="v.bid" :key="v.bid" v-else>{{v.bName}}</a-select-option>
    </a-select>
     </a-modal>
 </div>
</template>
<script>
import {getbaselist,disbase,delbase} from '@/api/userApi'
export default {
      data() {
      return {
        next:true,
        baseinfo:[],
        info:{},
        serpost:1,
        visible: false,
        title:"指派基地",
        okText:"确认指派",
    }
      },
  methods: {
      add(record){    
      this.next=true;
      this.visible=true;
      this.info.serviceManId=record.id;
      this.title="指派基地"
      this.okText="确认指派"
      getbaselist().then((res=>{
            this.baseinfo=res.result
            this.serpost=res.result[0].id
          }))
      },
      del(record){
      if(record.bsmList.length>0){
      this.next=false;
      this.visible=true;
      this.info.serviceManId=record.id;
      this.baseinfo=record.bsmList;
      this.serpost=record.bsmList[0].bid
      this.title="解除基地"
      this.okText="确认解除"
      }else{
      this.$message.info("请先指派基地！");
      }
      },
    handleOk(){
        if(this.title=="指派基地"){
            this.info.baseId=this.serpost;
            disbase(this.info).then((res=>{
                 if(res.success==true){
              this.$message.info(res.message);
              this.$parent.loadData();
              this.visible=false;
            }else{
              this.$message.info(res.message);
            }
            }))
        }
         if(this.title=="解除基地"){
            this.info.baseId=this.serpost;
            delbase(this.info).then((res=>{
                 if(res.success==true){
              this.$message.info(res.message);
              this.$parent.loadData();
              this.visible=false;
            }else{
              this.$message.info(res.message);
            }
            }))
        }
    }
  },
}
</script>
