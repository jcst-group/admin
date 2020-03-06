<template>
  <div>
    <a-modal
      v-model="visible"
      title="修改地块样式"
      @ok="handleOk"
      okText="保存"
      cancelText="取消"
      :maskClosable="false"
    >
    <a-row :gutter="16">
      <a-col :span="12"><span style="float:right">红(R:0~255):</span></a-col>
      <a-col :span="12"><a-input-number :min="0" :max="255" v-model="red" @change="changered" /></a-col>
    </a-row>
    <br/>
    <a-row :gutter="16">
      <a-col :span="12"><span style="float:right">绿(R:0~255):</span></a-col>
      <a-col :span="12"><a-input-number :min="0" :max="255" v-model="green" @change="changegreen" /></a-col>
    </a-row>
    <br/>
    <a-row :gutter="16">
      <a-col :span="12"><span style="float:right">蓝(R:0~255):</span></a-col>
      <a-col :span="12"><a-input-number :min="0" :max="255" v-model="blue" @change="changeblue" /></a-col>
    </a-row>
    <br/>
    <a-row :gutter="16">
      <a-col :span="12"><span style="float:right">透明度(0~1):</span></a-col>
      <a-col :span="12"><a-input-number :min="0" :max="1" :step="0.1" v-model="transparency" @change="changetransparency" /></a-col>
    </a-row>
    <br/>
    <a-row :gutter="16">
      <a-col :span="24"><div class="color" ref="color"></div></a-col>
    </a-row>
    </a-modal>
  </div>
</template>
<script>
export default {
  data(){
    return{
      visible:false,
      record:{},
      red:'',
      green:'',
      blue:'',
      transparency:'',
      rgba:'',
    }
  },
  mounted(){
   this.$refs.color.style.background=this.rgba;
  },
  methods:{
  changecolor(record){
      this.record=record;
      let col= eval('(' + record.remark + ')').strokeColor;
      this.red=parseInt(col.slice(1,3),16);
      this.green=parseInt(col.slice(3,5),16);
      this.blue=parseInt(col.slice(5,7),16);
      this.transparency=eval('(' + record.remark + ')').strokeOpacity;
      this.rgba='rgba('+this.red+','+this.green+','+this.blue+','+this.transparency+')';
      this.visible=true;
      this.$refs.color.style.background=this.rgba;
  },
  changered(value){
       this.red=value;
       if(value>255){
         this.red=255;
       }
       this.rgba='rgba('+this.red+','+this.green+','+this.blue+','+this.transparency+')';
       this.$refs.color.style.background=this.rgba;
  },
  changegreen(value){
       this.green=value;
       if(value>255){
         this.green=255;
       }
       this.rgba='rgba('+this.red+','+this.green+','+this.blue+','+this.transparency+')';
       this.$refs.color.style.background=this.rgba;
  },
  changeblue(value){
       this.blue=value;
       if(value>255){
         this.blue=255;
       }
       this.rgba='rgba('+this.red+','+this.green+','+this.blue+','+this.transparency+')';
       this.$refs.color.style.background=this.rgba;
  },
  changetransparency(value){
       this.transparency=value;
       if(value>1){
         this.transparency=1;
       }
       this.rgba='rgba('+this.red+','+this.green+','+this.blue+','+this.transparency+')';
       this.$refs.color.style.background=this.rgba;
  },
  handleOk(){

  },
  },
}
</script>
<style scoped>
.color{
  width:100px;
  height:100px;
}
</style>
