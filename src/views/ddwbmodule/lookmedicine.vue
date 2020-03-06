<template>
  <div>
    <a-modal
      title="查看"
      v-model="visible"
      @ok="handleOk"
      :confirmLoading="confirmLoading"
      okText="保存"
      cancelText="取消"
      :maskClosable="false">
      查看作物！
    </a-modal>
  </div>
</template>
<script>
export default {
  data(){
    return{
       visible:false,
       confirmLoading:false,
       record:{},
    }
  },
  created(){

  },
  mounted() {

  },
  methods:{
    look(record){
      this.record=record;
      this.visible=true;
    },
    handleOk(){

    },
  },
}
</script>
<style scoped>

</style>
