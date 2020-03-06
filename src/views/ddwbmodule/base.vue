<template>
  <div>
    <a-modal
      v-model="visible"
      title="查看详情"
      @ok="handleOk"
      okText="退出"
      ref="modal"
      cancelText="取消"
      :maskClosable="false"
      style="min-width:600px;"
    >
    <div class="all_1">
    <div class="all">
    <a-form
    :form="form"
  >
  <div class="title">基础信息</div>
  <a-row :gutter="16">
    <a-col :span="12">
       <a-form-item
      v-bind="formItemLayout"
      label="基地名称"
    >
     <div class="inp">{{record.baseName}}</div>
    </a-form-item>
    </a-col>
    <a-col :span="12">
       <a-form-item
          label="基地范畴"
          v-bind="formItemLayout"
        >
         <div class="inp">{{record.category?record.category.displayName:null}}</div>
        </a-form-item>
    </a-col>
  </a-row>
  <a-row :gutter="16">
    <a-col :span="12">
        <a-form-item
      v-bind="formItemLayout"
      label="基地类型"
    >
      <div class="inp">{{record.baseType?record.baseType.displayName:null}}</div>
    </a-form-item>
    </a-col>
    <a-col :span="12">
       <a-form-item
      v-bind="formItemLayout"
      label="土壤类型"
    >
      <div class="inp">{{record.soilType?record.soilType.displayName:null}}</div>
    </a-form-item>
    </a-col>
  </a-row>
   <a-row :gutter="16">
     <a-col :span="12">
        <a-form-item
      v-bind="formItemLayout"
      label="前茬茬口"
    >
      <div class="inp">{{record.frontStubble}}</div>
    </a-form-item>
     </a-col>
     <a-col :span="12">
       <a-form-item
      v-bind="formItemLayout"
      label="面积(亩)"
    >
      <div class="inp">{{record.acreage}}</div>
    </a-form-item>
     </a-col>
   </a-row>
   <a-row :gutter="16">
     <a-col :span="12">
       <a-form-item
      v-bind="formItemLayout"
      label="方位"
    >
      <div class="inp">{{position}}</div>
    </a-form-item>
     </a-col>
     <a-col :span="12">
      <a-form-item
      v-bind="formItemLayout"
      label="坡度"
    >
      <div class="inp">{{record.slope}}</div>
    </a-form-item>
     </a-col>
   </a-row>
    <a-row :gutter="16">
     <a-col :span="12">
       <a-form-item
      v-bind="formItemLayout"
      label="经度"
    >
         <div class="inp">{{record.longitude}}</div>
    </a-form-item>
     </a-col>
     <a-col :span="12">
       <a-form-item
      v-bind="formItemLayout"
      label="纬度"
    >
         <div class="inp">{{record.latitude}}</div>
    </a-form-item>
     </a-col>
   </a-row>
    <a-form-item
      v-bind="formItemLayout"
      label="基地全景图"
    >
         <div class="inp">{{record.panoramaUrl}}</div>
    </a-form-item>
   <a-row :gutter="16">
     <a-col :span="20">
       <a-form-item
      v-bind="formItemLayout1"
      label="基地地址"
    >
    <a-row :gutter="16">
      <a-col :span="8">
        <div class="inp">{{record.address?record.address.province:null}}</div>
      </a-col>
      <a-col :span="8">
        <div class="inp">{{record.address?record.address.city:null}}</div>
      </a-col>
      <a-col :span="8">
        <div class="inp">{{record.address?record.address.area:null}}</div>
      </a-col>
    </a-row>
      <div class="inp">{{record.address?record.address.street:null}}</div>
    </a-form-item>
     </a-col>
   </a-row>
    <a-form-item
      v-bind="formItemLayout1"
      label="简介"
    >
      <div class="inp">{{record.survey}}</div>
    </a-form-item>

   <a-row :gutter="16">
     <!-- <a-col :span="12">
       <a-form-item

      label="基地图片"
    >
     <img style="width:100px;height:100px;" :src="getpic(record.basePic?record.basePic.pictureUrl:null)"/>
     <a-button class="look-btn" type="primary" @click="lookpic(record.basePic?record.basePic.pictureUrl:null)">查看</a-button>
    </a-form-item>
     </a-col> -->
     <a-col :span="12">
       <a-form-item

      label="水源检测图片"
    >
     <img style="width:100px;height:100px;" :src="getpic(record.waterPic?record.waterPic.pictureUrl:null)"/>
     <a-button class="look-btn" type="primary" @click="lookpic(record.waterPic?record.waterPic.pictureUrl:null)">查看</a-button>
    </a-form-item>
     </a-col>
     <a-col :span="12">
       <a-form-item

      label="大气检测图片"
    >
     <img style="width:100px;height:100px;" :src="getpic(record.airPic?record.airPic.pictureUrl:null)"/>
     <a-button class="look-btn" type="primary" @click="lookpic(record.airPic?record.airPic.pictureUrl:null)">查看</a-button>
    </a-form-item>
     </a-col>
   </a-row>

   <a-row :gutter="16">
     <a-col :span="12">
        <a-form-item

      label="土壤检测图片"
    >
     <img style="width:100px;height:100px;" :src="getpic(record.soilPic?record.soilPic.pictureUrl:null)"/>
     <a-button class="look-btn" type="primary" @click="lookpic(record.soilPic?record.soilPic.pictureUrl:null)">查看</a-button>
    </a-form-item>
     </a-col>
     <a-col :span="12">
      
     </a-col>
   </a-row>
    <a-form-item

      label="基地图片"
    >
      <template v-for="(v,k) in record.basePic">
        <div style="float:left;margin-right:50px;" :key="k">
          <img :key="k" style="width:70px;height:70px;display:block;" :src="getpic(v.pictureUrl)"/>
          <a-button :key="k" class="look-btn" type="primary" @click="lookpic(v.pictureUrl)">查看</a-button>
        </div>
     </template>
    </a-form-item>
  <div style="clear:both"></div>
   <div class="title">水源检测</div>
   <div style="width:50%;float:left;" v-for="v in water" :key="v.envStandardsId">
      <a-form-item
      v-bind="formItemLayout"
      :label="v.item"
    >
     <div class="inp">{{v.value}}</div>
    </a-form-item>
   </div>
<div style="clear:both"></div>
   <div class="title">大气检测</div>
    <div style="width:50%;float:left;" v-for="v in air" :key="v.envStandardsId">
      <a-form-item
      v-bind="formItemLayout"
      :label="v.item"
    >
     <div class="inp">{{v.value}}</div>
    </a-form-item>
   </div>
   <div style="clear:both"></div>
   <div class="title">土壤检测</div>
   <div style="width:50%;float:left;" v-for="v in soil" :key="v.envStandardsId">
      <a-form-item
      v-bind="formItemLayout"
      :label="v.item"
    >
     <div class="inp">{{v.value}}</div>
    </a-form-item>
   </div>
  </a-form>
</div>
</div>
    </a-modal>
     <a-modal
      v-model="ispic"
      title="查看图片"
      @ok="pic_handleOk"
      okText="退出"
      width=60%
    >
    <img style="width:100%;height:100%;" :src="pic_url" />
     </a-modal>
  </div>
</template>
<script>
  import {saveWalker,updateWalker} from '@/api/allapi'
  import Vue from 'vue'
  import { ACCESS_TOKEN } from "@/store/mutation-types"
  import { getBaseCategoryEnum,getBaseTypeEnum,getChinaArea,getSecondArea,getSoilTypeEnum,getBaseAllTest,addBase,editBase } from '@/api/ddwbApi'
  import { insertBase,updateBase,basenamecheck } from '@/api/allapi'
  import { getmap } from '@/api/userApi'
  import {pick} from 'lodash'
  import MapLoader from '@/utils/loadMap.js'
  import axios from 'axios'
  export default {
    name:'workerModal',
    data() {
      return {
        form: this.$form.createForm(this),
        formItemLayout: {
        labelCol: {
          xs: { span: 24},
          sm: { span: 8 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 16 },
        },
      },
      formItemLayout1:{
        labelCol: {
          xs: { span: 24},
          sm: { span: 4 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 20 },
        },
      },
        visible: false,
        title:"操作",
        record:{},
        water:[],
        air:[],
        soil:[],
        ispic:false,
        pic_url:'',
        position:'',
      }
    },
    methods: {
      lookpic(a){
        this.pic_url='/api2/pictureInfo/show/'+a;
        this.ispic=true;
      },
      pic_handleOk(){
        this.ispic=false;
      },
      getpic(a){
         let imageUrl='/api2/pictureInfo/show/'+a;
         return imageUrl;
      },
      look(record){
        this.water=[];
        this.air=[];
        this.soil=[];
       this.record=record;
       if(record.position==1){
         this.position='阴坡';
       }
       if(record.position==2){
         this.position='阳坡';
       }
       if(record.position==3){
         this.position='平地';
       }
       if(this.record.baseTestingVoList.length>0){
         for(let i=0;i<this.record.baseTestingVoList.length;i++){
           if(this.record.baseTestingVoList[i].itemName.code=='AIR'){
             this.air.push(this.record.baseTestingVoList[i]);
           }
           if(this.record.baseTestingVoList[i].itemName.code=='WATER'){
            this.water.push(this.record.baseTestingVoList[i]);
           }
           if(this.record.baseTestingVoList[i].itemName.code=='SOIL'){
             this.soil.push(this.record.baseTestingVoList[i]);
           }
         }
       }
       this.visible=true;
      },

      handleOk(){
        this.visible=false;
      },
      showModal() {
        this.visible = true
      },
      hideModal() {
        this.visible = false
      },
    }
  }
</script>
<style scoped>
.title{
  font-size: 20px;
  font-weight: bold;
}
.inp{
  border-bottom: 1px solid #000
}
.look-btn{
  width:60px;
  height:25px;
  line-height: 25px;
  text-align: center;
}
.all_1{
  width:100%;
  height:600px;
  overflow-y: auto;
}
.all{
  width:90%;
}
.inp{
  height:40px;
}
</style>

