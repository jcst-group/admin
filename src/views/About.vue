<template>
  <div class="about">
    <h1>This is an about page</h1>
    <h1>{{message}}</h1>
    <button @click="increase">xx</button>
    <button @click="increase2">xx2</button>
    <h1>{{count}}</h1>
    <h1>{{token}}</h1>
    <h1>{{getlength}}</h1>
    <a-upload name="file" :multiple="true" action="/api2/upload/image" :headers="headers" @change="handleChange">
      <a-button>
        <a-icon type="upload" /> Click to Upload
      </a-button>
    </a-upload>
    <img src="/api2/upload/show?fileName=xx1555411630398.jpg"/>
  </div>
</template>
<script>


import { mapState } from 'vuex';
import Vue from 'vue'
import request from '@/utils/request'
import { ACCESS_TOKEN } from "@/store/mutation-types"
export default {
  name: 'about',
  data (){
    return{
      message:this.$store.state.count,
      headers: {}
    }
  },
  methods:{
    increase (){
      this.$store.commit("increase");
      this.$store.commit("gettoken");
    },
    increase2 () {
      this.$store.dispatch("increase");
    },
    handleChange(info) {
      if (info.file.status !== 'uploading') {
        return
      }
      if (info.file.status === 'done') {
        const response = info.file.response;
        if(response.success){
          this.avatar = response.result.path;
        }else{
          this.$message.warning(response.message);
        }
      } else if (info.file.status === 'error') {
        this.$message.error(`${info.file.name} 文件上传失败`);
      }
    },

  },
  computed:{
    count (){
      return this.$store.state.count;
    },
    token(){
      return this.$store.state.token;
    },
    getlength(){
      return this.$store.getters.getTokenLength;
    }
  },
  created() {
    const token = Vue.ls.get(ACCESS_TOKEN);
    this.headers = {"X-Access-Token":token}
  }
}




</script>

