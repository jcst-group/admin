<template>

    <div id="components-form-demo-advanced-search">
      <a-form
        class="ant-advanced-search-form"
      >
        <a-row :gutter="24">
          <a-col
            :span="24"
          >
            <a-form-item label="农产品图片">
              <a-upload
                action="/api/anadromousManage/addPicture"
                listType="picture-card"
                :fileList="fileList"
                :headers="headers"
                :multiple="true"
                :data="uploadData"
                :remove="remove"
                :disabled="!write"
                @preview="handlePreview"
                @change="handleChange"
                @click="showMessage"
                :beforeUpload="beforeUpload"
              >
                <div v-if="fileList.length < 10">
                  <a-icon type="plus" />
                  <div class="ant-upload-text">Upload</div>
                </div>
              </a-upload>
            </a-form-item>
          </a-col>
          <a-col
            v-if="!write"
            :span="24"
          >
            <p style="color: #b43400;">保存产品信息表后，才可上传图片</p>
          </a-col>
   </a-row>


      </a-form>
      <ImgShow ref="imgShow"/>

      <a-modal :visible="previewVisible" :footer="null" width="80%" @cancel="handleCancel">
        <img alt="example" style="width: 100%;" :src="previewImage" />
      </a-modal>
    </div>

</template>
<script>
  import Vue from 'vue'
  import { picDelete,getAgriculturalPro } from '@/api/allapi'
  import { ACCESS_TOKEN } from "@/store/mutation-types"
  import ImgShow from './ImgShow'
  import moment from 'moment';
  export default {
    components:{
      ImgShow,
    },
    props:['picCount'],
    data() {
      return {
        visible:false,
        title:'图片编辑',
        okText:'关闭',
        headers:{},
        SHOWURL:"/api/upload/show?fileName=",
        uploadData:{relationId:undefined},
        batchId:undefined,
        previewVisible: false,
        previewImage: '',
        bodyStyle:{overflow: "auto"},
        nohave:true,
        fileList: [],
        removeList:[],//用于保存需要删除的图片ID
        addList:[],//用于保存增加的图片ID
      }
    },
    created() {
      const token = Vue.ls.get(ACCESS_TOKEN);
      this.headers = {"X-Access-Token":token}
    },
    computed: {
      write() {
        return this.$store.state.pro.write
      },
    },
    methods: {
      moment,
      beforeUpload (file){
        if(this.uploadData.relationId==undefined){
          //his.show(this.batchId);
          this.uploadData.relationId =  this.$store.state.pro.proId
        }
        console.log(file.type);
        let type = file.type+"";
        console.log(type);
        let isJPG = this.judgeName(type);
        console.log("isJPG:"+isJPG);
        if (!isJPG) {
          this.$message.error('只允许上传图片')
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
          this.$message.error('图片大小不能大于2M')
        }
        return isJPG && isLt2M
      },
      judgeName(fileName){
        return fileName.indexOf("image")!=-1
      },

      show(batchId){
        // 初始化图片列表，初始化上传的ID
        console.log("show");
        let have = false;
        let pro = null;
        let that = this;
        this.batchId = batchId;
        getAgriculturalPro({batchId:batchId}).then((res)=>{
          console.log("dayin jieguo");
          console.log(res);
          if(res.result!=null){
            pro = res.result;
            have = true;
            console.log(have);
            console.log(pro);
            if(have){
              console.log("have pro");
              this.uploadData.relationId =pro.id;
              let pictureInfoList = pro.pictureInfoList;
              let fileList = [];
              for(let i=0;i<pictureInfoList.length;i++){
                let file = {};
                let item = pictureInfoList[i];
                file.uid = item.id;
                file.name=item.pictureUrl;
                file.url = this.SHOWURL+item.pictureUrl;
                fileList.push(file)
              }
              that.nohave = false;
              that.fileList = fileList;
            }
          }
        });
      },
      handleCancel () {
        this.previewVisible = false
      },
      handlePreview (file) {
        this.previewImage = file.url || file.thumbUrl
        this.previewVisible = true
      },
      showMessage(){
        if(this.nohave){
          this.$message.error('保存产品信息后才可上传产品图片')
        }
      },
      handleChange ({ fileList,file,event }) {
        console.log("handleChange");
        console.log(fileList);
        console.log(file);
        console.log("file.status:"+file.status);
        //this.fileList = fileList;
        console.log("file.response:"+file.response);
        if(file.status!=undefined){
          this.fileList = fileList;
        }
        for(let i=0;i<this.fileList.length;i++){
          let response = fileList[i].response;
          if(response!=undefined){
            let result = response.result;
            let file = {};
            file.uid = result.id;
            file.name=result.pictureUrl;
            file.url = this.SHOWURL+result.pictureUrl;
            this.fileList[i] = file;
          }
        }
        this.$store.commit('pro/SET_PIC_COUNT',this.fileList.length)
        /*if(file.status=="done"){
          console.log(fileList);
          console.log("上传完成");
          //设置返回的图像id
          this.fileList = fileList;
          for(let i=0;i<this.fileList.length;i++){
            let response = fileList[0].response;
            if(response!=undefined){
              let result = response.result;
              let file = {};
              file.uid = result.id;
              file.name=result.pictureUrl;
              file.url = this.SHOWURL+result.pictureUrl;
              this.fileList[i] = file;
            }
          }
        }else{
          if(file.status!=undefined){
            this.fileList = fileList;
          }
        }*/

        /*if(file.status=="done"){
          console.log(fileList);
          console.log("上传完成");
          //设置返回的图像id
          let result = file.response.result;
          console.log(result);
          let id = result.id;
          console.log("result.id:"+id);
          if(id!=undefined){
            let file = {};
            file.uid = id;
            file.name=result.pictureUrl;
            file.url = this.SHOWURL+result.pictureUrl;
            this.fileList.pop();
            this.fileList.push(file);
          }else{
            this.fileList = fileList;
          }
          console.log(this.fileList);
        }else{
          if(file.status!=undefined){
            this.fileList = fileList;
          }
        }*/
      },

      remove(file){
        console.log("remove(file){");
        console.log(file);
        picDelete({id:file.uid}).then((res=>{
          if(res.success==true){
            console.log(res);
            let message = res.message;
            this.$message.info(message);
            //console.log(result);
          }else{
            this.$message.info(res.message)
          }
        }));
      },
      piccCount(count){
        //console.log(this.$parent);
        //this.$emit('changePicCount',count);
        //调用的parent有问题
        //this.$parent.changePicCount(count);
      },




    }
  }
</script>

