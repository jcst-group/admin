<template>
  <div>
    <a-modal
      :title="title"
      v-model="visible"
      style="top:5%;height: 90%;"
      cancelText="关闭"
      :bodyStyle="bodyStyle"
      @cancel="cancel"
      @ok="handleok"
      :afterClose="afterClose"
      :maskClosable="false"
    >
      <a-upload
        action="/api/baseInfo/insertPicture"
        listType="picture-card"
        :fileList="fileList"
        :headers="headers"
        :multiple="true"
        :data="uploadData"
        :remove="remove"
        @preview="handlePreview"
        @change="handleChange"
        :beforeUpload="beforeUpload"
      >
        <div v-if="fileList.length < 10">
          <a-icon type="plus" />
          <div class="ant-upload-text">Upload</div>
        </div>
      </a-upload>

   </a-modal>
    <ImgShow ref="imgShow"/>

    <a-modal :visible="previewVisible" :footer="null" width="80%" @cancel="handleCancel">
      <img alt="example" style="width: 100%;" :src="previewImage" />
    </a-modal>
  </div>
</template>
<script>
  import Vue from 'vue'
  import { delbasepic } from '@/api/userApi'
  import { ACCESS_TOKEN } from "@/store/mutation-types"
  import ImgShow from '../../views/patch/modules/ImgShow'
  import moment from 'moment';
  export default {
    components:{
      ImgShow,
    },
    data() {
      return {
        visible:false,
        title:'图片编辑',
        okText:'关闭',
        headers:{},
        SHOWURL:"/api/upload/show?fileName=",
        uploadData:{baseId:undefined},
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
      add(){
        this.record=this.initrecord;
        this.title="添加";
        this.okText="确认添加";
        this.edit(this.record);
      },

      beforeUpload (file) {
        const isJPG = file.type === 'image/jpeg'
        const isPNG = file.type === 'image/png'
        if (!(isPNG||isJPG)) {
          this.$message.error('只允许上传jpg/png格式图片')
        }
        const isLt2M = file.size / 1024 / 1024 < 2
        if (!isLt2M) {
          this.$message.error('图片大小不能大于2M')
        }
        return (isJPG || isPNG) && isLt2M
      },
      show(record){
        //处理初始化
        this.removeList =[];
        this.addList=[];
        // 初始化图片列表，初始化上传的ID
        this.uploadData.baseId=record.id;
        let pictureInfoList = record.pictureInfoList;
        let fileList = [];
        for(let i=0;i<pictureInfoList.length;i++){
          let file = {};
          let item = pictureInfoList[i];
          file.uid = item.id;
          file.name=item.pictureUrl;
          file.url = this.SHOWURL+item.pictureUrl;
          fileList.push(file)
        }
        this.fileList = fileList;
        this.visible=true;
      },
      handleCancel () {
        this.previewVisible = false
      },
      handlePreview (file) {
        this.previewImage = file.url || file.thumbUrl
        this.previewVisible = true
      },
      handleChange ({ fileList,file }) {
        console.log("handleChange");
        console.log(fileList);
        console.log(file);
        console.log("file.status:"+file.status);
        //this.fileList = fileList;
        if(file.status=="done"){
          console.log("上传完成");
          //设置返回的图像id
          let result = file.response.result;
          console.log(result);
          let id = result.id;
          console.log("result.id:"+id);
          file = {};
          if(id!=undefined && this.addList.indexOf(id)==-1){
            file.uid = id;
            file.name=result.pictureUrl;
            file.url = this.SHOWURL+result.pictureUrl;
            //fileList = this.fileList;
            /*fileList.pop();
            fileList.push(file)*/
            this.addList.push(file.uid);
            this.fileList = fileList;
          }else{
            this.fileList = fileList;
          }
          console.log(this.addList);
        }else{
          if(file.status!=undefined){
            this.fileList = fileList;
          }
        }
      },

      remove(file){
        if(file.response){
          this.removeList.push(file.response.result.id);
        }else{
          this.removeList.push(file.uid);
        }
      },

      cancel(){
        console.log("cancel");
        this.$emit('afterClose')
        //取消的时候，将多增加的删除
        for(let i=0;i<this.addList.length;i++){
          let id = this.addList[i];
          delbasepic({id:id,baseId:this.uploadData.baseId}).then();
        }
      },
      handleok(){
        //ok的时候，将需要删除的删除掉
        console.log("handleok");
        this.visible = false;
        for(let i=0;i<this.removeList.length;i++){
          let id = this.removeList[i];
          delbasepic({id:id,baseId:this.uploadData.baseId}).then();
        }
        this.$parent.loadData();
      },
      afterClose(){
        console.log("after close");
        this.$emit('afterClose')
      },

    }
  }
</script>
