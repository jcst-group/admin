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
    <label>农户：</label>
    <a-select v-model="serpost" style="width:100%;">
      <a-select-option v-for="v in farinfo" :value="v.id" :key="v.id" v-if="next">{{v.farmerName}}</a-select-option>
       <a-select-option v-for="v in farinfo" :value="v.fid" :key="v.fid" v-if="!next">{{v.fname}}</a-select-option>
    </a-select>
     </a-modal>
 </div>
</template>
<script>
import {getfarlist,bindfarbas,delfarbas} from '@/api/userApi'
export default {
      data() {
      return {
        next:true,
        farinfo:[],
        info:{},
        serpost:1,
        visible: false,
        title:"绑定农户",
        okText:"确认绑定",
    }
      },
  methods: {
      add(record){    
        if(!record.farmer.length>0){
      this.next=true;
      this.visible=true;
      this.info.baseId=record.id;
      this.title="绑定农户"
      this.okText="确认绑定"
      getfarlist().then((res=>{
            this.farinfo=res.result
            this.serpost=res.result[0].id
          }))
        }else{
          this.$message.info("只能绑定一个农户！");
        }
      },
      del(record){
      if(record.farmer.length>0){
      this.next=false;
      this.visible=true;
      this.info.baseId=record.id;
      this.farinfo=record.farmer;
      this.serpost=record.farmer[0].fid
      this.title="解除绑定"
      this.okText="确认解除"
      }else{
      this.$message.info("请先绑定农户！");
      }
      },
    handleOk(){
        if(this.title=="绑定农户"){
            this.info.farmerId=this.serpost;
            bindfarbas(this.info).then((res=>{
                 if(res.success==true){
              this.$message.info(res.message);
              this.$parent.loadData();
              this.visible=false;
            }else{
              this.$message.info(res.message);
            }
            }))
        }
         if(this.title=="解除绑定"){
            this.info.farmerId=this.serpost;
            delfarbas(this.info).then((res=>{
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
