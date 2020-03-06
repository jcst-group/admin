<template>
  <div>
    <a-modal
      :title="title"
      v-model="visible"
      cancelText="关闭"
      :bodyStyle="bodyStyle"
      :footer="null"
      :maskClosable="false"
    >
      <a-carousel arrows dotsClass="slick-dots slick-thumb">
        <a slot="customPaging" slot-scope="props">
          <img :src="getImgUrl(props.i)" />
        </a>
        <div v-for="item in 4">
          <img :src="baseUrl+'abstract0'+item+'.jpg'" />
        </div>
      </a-carousel>

   </a-modal>
  </div>
</template>
<script>
  import Vue from 'vue'
  import { ACCESS_TOKEN } from "@/store/mutation-types"
  import moment from 'moment';
  const baseUrl = 'https://raw.githubusercontent.com/vueComponent/ant-design-vue/master/components/vc-slick/assets/img/react-slick/'
  export default {
    data() {
      return {
        baseUrl,
        visible:false,
        title:'图片编辑',
        okText:'关闭',
        headers:{},
        SHOWURL:"/api/upload/show?fileName=",
        uploadData:{recordId:undefined},
        previewVisible: false,
        previewImage: '',
        bodyStyle:{overflow: "auto"},
        fileList: [],
        removeList:[],//用于保存需要删除的图片ID
        addList:[],//用于保存增加的图片ID
      }
    },
    created() {
      const token = Vue.ls.get(ACCESS_TOKEN);
      this.headers = {"X-Access-Token":token}
    },
    methods: {
      moment,
      getImgUrl(i) {
        return `${baseUrl}abstract0${i + 1}.jpg`
      },
      add(){
        this.record=this.initrecord;
        console.log(this.initrecord);
        this.title="添加";
        this.okText="确认添加";
        this.edit(this.record);
      },

      cancel(){
        console.log("cancel");
        this.$emit('afterClose')
      },
      show(){
        this.visible = true;
      },
      afterClose(){
        console.log("after close");
        this.$emit('afterClose')
      },

    }
  }
</script>
<style scoped>
/* For demo */
.ant-carousel >>> .slick-dots {
  height: auto
}
.ant-carousel >>> .slick-slide img{
  border: 5px solid #FFF;
  display: block;
  margin: auto;
  max-width: 80%;
}
.ant-carousel >>> .slick-thumb {
  bottom: -45px;
}
.ant-carousel >>> .slick-thumb li {
  width: 60px;
  height: 45px;
}
.ant-carousel >>> .slick-thumb li img {
  width: 100%;
  height: 100%;
  filter: grayscale(100%);
}
.ant-carousel >>> .slick-thumb li.slick-active img{
  filter: grayscale(0%);
}
</style>
