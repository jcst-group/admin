<template>
  <div>
    <a-modal
      :title="title"
    v-model="visible"
    @ok="handleOk"
    style="top:5%;height: 90%;"
    cancelText="取消"
    :okText="okText"
    :maskClosable="false"
    >

    </a-modal>
  </div>
</template>
<script>
  import Vue from 'vue'
  import { addservice,addworklist,updateworklist } from '@/api/userApi'
  import { getCrops,queryAllBase ,selectByBaseId,getBlockByBaseId,  } from '@/api/allapi'
  import moment from 'moment';
  export default {
    data() {
      return {
        visible: false,
        title:"",
        okText:"",

        form: this.$form.createForm(this),
      }
    },
    computed:{
      batchId(){
        return this.record.batchId;
      }
    },
    methods: {
      moment,
      add(){
        this.record=this.initrecord;
        console.log(this.initrecord);
        this.title="添加";
        this.okText="确认添加";
        this.edit(this.record);
      },



      edit(record){

      },
      handleOk(){

      },

    }
  }
</script>
