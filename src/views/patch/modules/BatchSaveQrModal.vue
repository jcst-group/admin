<template>
  <div>
    <a-modal
      :title="title"
      v-model="visible"
      :footer="null"
      style="top:5%;height: 90%;"
      :maskClosable="false"
    >
      <qrcode-vue :value="value" :size="size" level="H"></qrcode-vue>
    </a-modal>
  </div>
</template>
<script>
  import QrcodeVue from 'qrcode.vue';
  export default {
    components:{
      QrcodeVue,
    },
    data() {
      return {
        visible: false,
        title:"",
        value: 'https://example.com',
        size: 300
      }
    },
    methods: {
      show(url){
        this.value = url;
        this.visible = true;
      },
    }
  }
</script>
