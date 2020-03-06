<template>
  <div>
    <a-modal
      width=60%
      v-model="visible"
      :title="title"
      @ok="handleOk"
      @cancel="delAllPic"
      okText="保存"
      ref="modal"
      cancelText="取消"
      :maskClosable="false"
      style="min-width:1150px"
    >
     <a-tabs v-model="nowkey" @change="changekey">
    <a-tab-pane tab="基地信息" key="1">
      <div class="allall">
      <div class="all" style="position: relative;">
    <div style="width:40%;float:left;margin-right:10px;">
      <a-form :form="form">
        <a-form-item
          label="基地名称"
          v-bind="formItemLayout"
        >
          <a-input
            v-decorator="[
          'baseName',
          {
            rules: [{
              required: true, message: '请输入基地名称',min:0,max:50
            }]
          }
        ]"
          />
        </a-form-item>
        <a-form-item
          label="基地范畴"
          v-bind="formItemLayout"
        >
         <a-select
          v-decorator="[
          'category',
          {
            rules: [{
              required: true, message: '请输入基地范畴',
            }]
          }
        ]">
              <a-select-option v-for="(v,k) in Categoryinfo" :value="v.code" :key="k">{{v.displayName}}</a-select-option>
            </a-select>
        </a-form-item>

        <a-form-item
          label="基地类型"
          v-bind="formItemLayout"
        >
        <a-select
          v-decorator="[
          'baseType',
          {
            rules: [{
              required: true, message: '请输入基地类型',
            }]
          }
        ]">
              <a-select-option v-for="(v,k) in Basetypeinfo" :value="v.code" :key="k">{{v.displayName}}</a-select-option>
            </a-select>
        </a-form-item>

         <a-form-item
          label="土壤类型"
          v-bind="formItemLayout"
        >
        <a-select
          v-decorator="[
          'soilType',
          {
            rules: [{
              required: false, message: '请输入土壤类型',
            }]
          }
        ]">
              <a-select-option v-for="(v,k) in soilTypeinfo" :value="v.code" :key="k">{{v.displayName}}</a-select-option>
            </a-select>
        </a-form-item>

         <a-form-item
        label="基地地址"
        v-bind="formItemLayout"
      >
      <!-- <a-cascader :options="options" placeholder="请选择省/市/(县，区)" @change="onChangmap"/> -->
      <div class="jiange">
      <a-select style="float:left;width:49%;margin-right:2%" v-model="province_code"  @change="changefirst">
        <a-select-option v-for="(v,k) in chinamap" :value="v.areaCode" :key="k">{{v.areaName}}</a-select-option>
      </a-select>
      <a-select style="float:left;width:49%;" v-model="city_code" @change="changescend">
        <a-select-option v-for="(v,k) in secondmap" :value="v.areaCode" :key="k">{{v.areaName}}</a-select-option>
      </a-select>
      </div>
      <div style="width:100%;height:5px;"></div>
      <div class="jiange">
      <a-select style="float:left;width:100%;margin-top:3px;" v-model="area_code" @change="changethree">
        <a-select-option v-for="(v,k) in threemap" :value="v.areaCode" :key="k">{{v.areaName}}</a-select-option>
      </a-select>
         <!-- <a-input
         @blur="start"   -->
        </div>
        <div>
          <a-input
          placeholder="请输入具体地址"
          v-model="address"
          style="width:100%"
        >
        </a-input>
        </div>
        <a-button style="width:100%" type="primary" icon="search" @click="handleSearch">搜索</a-button>
      </a-form-item>
      <div class="jwd">
       <a-form-item
          label="经度"
          v-bind="formItemLayout"
          style="display:inline-block;width:50%;"
        >
          <a-input
          disabled
            v-decorator="[
          'longitude',
           {
            rules: [{ required: true, message: '请点击地图选取经度！' }],
          }
        ]"
            style="width: 100%"
          >
          </a-input>
          <!--<span style="font-size:20px;" v-if="!log">点击下面的地图选取经度！</span>
          <span style="font-size:20px;" v-if="log">{{log}}</span>-->
        </a-form-item>

        <a-form-item
          label="纬度"
          v-bind="formItemLayout"
          style="display:inline-block;width:50%;"
        >
          <a-input
          disabled
            v-decorator="[
          'latitude',
          {
            rules: [{ required: true, message: '请点击地图选取纬度！' }],
          }
        ]"
            style="width: 100%"
          >
          </a-input>
          <!--<span style="font-size:20px;" v-if="!lat">点击下面的地图选取纬度！</span>
          <span style="font-size:20px;" v-if="lat">{{lat}}</span>-->
          <!-- <a-button type="primary" @click="latandlog" style="margin-left:-65px;">{{butinfo}}</a-button> -->
          <!--<span>经度：{{log}}</span><span>纬度：{{lat}}</span>-->
        </a-form-item>
         </div>
        <a-form-item
          label="海拔(米)"
          v-bind="formItemLayout"
        >
          <a-input-number
            style="width:100%"
            v-decorator="[
          'altitude',
        ]"
          />
        </a-form-item>

        <a-form-item
          label="前茬茬口"
          v-bind="formItemLayout"
        >
          <a-input
            v-decorator="[
          'frontStubble',
          {
            rules: [{
              required: true, message: '请输入前茬茬口',min:0,max:50
            }]
          }
        ]"
          />
        </a-form-item>
        <a-form-item
          label="面积(亩)"
          v-bind="formItemLayout"
        >
          <a-input-number
            style="width:100%"
            v-decorator="[
          'acreage',
          {
            rules: [{
              required: true, message: '请输入面积'
            }]
          }
        ]"
          />
        </a-form-item>
        <a-form-item
          label="方位"
          v-bind="formItemLayout"
        >
        <a-radio-group
        v-decorator="[
          'position',
          {
            rules: [{
              required: true, message: '请选择方位'
            }]
          }
        ]"
         >
      <a-radio :value="1">阴坡</a-radio>
      <a-radio :value="2">阳坡</a-radio>
      <a-radio :value="3">平地</a-radio>
    </a-radio-group>
        </a-form-item>
        <a-form-item
          label="坡度"
          v-bind="formItemLayout"
        >
        <a-input-number
            style="width:100%"
            v-decorator="[
          'slope',
        ]"
          />
        </a-form-item>
        <a-form-item
          label="基地全景图"
          v-bind="formItemLayout"
        >
        <a-input
            style="width:100%"
            v-decorator="[
          'panoramaUrl',
        ]"
          />
        </a-form-item>


        <div class="tp">
        <a-form-item
      label="基地图片"
      style="display:inline-block;width:100%;"
    >
     <a-upload
      name="file"
      action="/api2/pictureInfo/addBasePic"
      listType="picture-card"
      :fileList="basefileList"
      @preview="basehandlePreview"
      :headers="headers"
      :beforeUpload="beforeUpload"
      @change="basehandleChange"
      :remove="removebasepic"
    >
      <div v-if="basefileList.length < 4">
        <a-icon type="plus" />
        <div class="ant-upload-text">Upload</div>
      </div>
    </a-upload>
    <a-modal :visible="basepreviewVisible" :footer="null" @cancel="basehandleCancel">
      <img alt="example" style="width: 100%" :src="basepreviewImage" />
    </a-modal>
       <!-- <a-upload
    name="file"
    listType="picture-card"
    class="avatar-uploader"
    :showUploadList="false"
    action="/api/pictureInfo/addBasePic"
    :beforeUpload="beforeUpload"
    :headers="headers"
    @change="basehandleChange"
    v-if="isedit"
  >
    <img v-if="baseimageUrl" :src="baseimageUrl" alt="基地" style="width:100px;height:100px;"/>
    <div v-else>
        <a-icon :type="baseloading ? 'loading' : 'plus'" />
        <div class="ant-upload-text">Upload</div>
    </div>
  </a-upload>
  <template v-if="!isedit"><img v-if="baseimageUrl" :src="baseimageUrl" alt="avatar" style="width:100px;height:100px;"/></template> -->
    </a-form-item>
        </div>
        <div class="tp1">
    <a-form-item
      label="水源检测图片"
      style="display:inline-block;width:100%;"
    >
     <a-upload
      name="file"
      action="/api2/pictureInfo/addWaterPic"
      listType="picture-card"
      :fileList="waterfileList"
      @preview="waterhandlePreview"
      :headers="headers"
      :beforeUpload="beforeUpload"
      @change="waterhandleChange"
      :remove="removewaterpic"
    >
      <div v-if="waterfileList.length < 1">
        <a-icon type="plus" />
        <div class="ant-upload-text">Upload</div>
      </div>
    </a-upload>
    <a-modal :visible="waterpreviewVisible" :footer="null" @cancel="waterhandleCancel">
      <img alt="example" style="width: 100%" :src="waterpreviewImage" />
      </a-modal>
    </a-form-item>
    </div>
    <div class="tpp">
    <a-form-item
      label="大气检测图片"
      style="display:inline-block;width:100%;"
    >
      <a-upload
      name="file"
      action="/api2/pictureInfo/addAirPic"
      listType="picture-card"
      :fileList="airfileList"
      @preview="airhandlePreview"
      :headers="headers"
      :beforeUpload="beforeUpload"
      @change="airhandleChange"
      :remove="removeairpic"
    >
      <div v-if="airfileList.length < 1">
        <a-icon type="plus" />
        <div class="ant-upload-text">Upload</div>
      </div>
    </a-upload>
    <a-modal :visible="airpreviewVisible" :footer="null" @cancel="airhandleCancel">
      <img alt="example" style="width: 100%" :src="airpreviewImage" />
      </a-modal>
    </a-form-item>
    </div>
    <div class="tpp1">
    <a-form-item
      label="土壤检测图片"
      style="display:inline-block;width:100%;"
    >
      <a-upload
      style="width:50px;height:50px;"
      name="file"
      action="/api2/pictureInfo/addSoilPic"
      listType="picture-card"
      :fileList="soilfileList"
      @preview="soilhandlePreview"
      :headers="headers"
      :beforeUpload="beforeUpload"
      @change="soilhandleChange"
      :remove="removesoilpic"
    >
      <div v-if="soilfileList.length < 1">
        <a-icon type="plus" />
        <div class="ant-upload-text">Upload</div>
      </div>
    </a-upload>
    <a-modal :visible="soilpreviewVisible" :footer="null" @cancel="soilhandleCancel">
      <img alt="example" style="width: 100%" :src="soilpreviewImage" />
      </a-modal>
    </a-form-item>
    </div>
     <div class="nc">
    <a-form-item
      label="农残检测图片"
      style="display:inline-block;width:100%;"
    >
      <a-upload
      name="file"
      action="/api2/pictureInfo/addPesticideResiduesPic"
      listType="picture-card"
      :fileList="ncfileList"
      @preview="nchandlePreview"
      :headers="headers"
      :beforeUpload="beforeUpload"
      @change="nchandleChange"
      :remove="removencpic"
    >
      <div v-if="ncfileList.length < 1">
        <a-icon type="plus" />
        <div class="ant-upload-text">Upload</div>
      </div>
    </a-upload>
    <a-modal :visible="ncpreviewVisible" :footer="null" @cancel="nchandleCancel">
      <img alt="example" style="width: 100%" :src="ncpreviewImage" />
      </a-modal>
    </a-form-item>
    </div>
    <div class="td">
    <a-form-item
      label="糖度检测图片"
      style="display:inline-block;width:100%;"
    >
      <a-upload
      name="file"
      action="/api2/pictureInfo/addSugarContentPic"
      listType="picture-card"
      :fileList="tdfileList"
      @preview="tdhandlePreview"
      :headers="headers"
      :beforeUpload="beforeUpload"
      @change="tdhandleChange"
      :remove="removetdpic"
    >
      <div v-if="tdfileList.length < 1">
        <a-icon type="plus" />
        <div class="ant-upload-text">Upload</div>
      </div>
    </a-upload>
    <a-modal :visible="tdpreviewVisible" :footer="null" @cancel="tdhandleCancel">
      <img alt="example" style="width: 100%" :src="tdpreviewImage" />
      </a-modal>
    </a-form-item>
    </div>
    <div class="gp">
    <a-form-item
      label="果品图片"
      style="display:inline-block;width:100%;"
    >
      <a-upload
      name="file"
      action="/api2/pictureInfo/addSugarContentPic"
      listType="picture-card"
      :fileList="gpfileList"
      @preview="gphandlePreview"
      :headers="headers"
      :beforeUpload="beforeUpload"
      @change="gphandleChange"
      :remove="removegppic"
    >
      <div v-if="gpfileList.length < 1">
        <a-icon type="plus" />
        <div class="ant-upload-text">Upload</div>
      </div>
    </a-upload>
    <a-modal :visible="gppreviewVisible" :footer="null" @cancel="gphandleCancel">
      <img alt="example" style="width: 100%" :src="gppreviewImage" />
      </a-modal>
    </a-form-item>
    </div>
        <a-form-item
          label="简介"
          v-bind="formItemLayout"
        >
          <a-textarea
          :rows="4"
            v-decorator="[
          'survey',
        ]"
            style="width: 100%"
          >
          </a-textarea>
        </a-form-item>
      </a-form>
      </div>
      <div class="input"><span>关键字搜索地点:</span><input id='input1' type="text"></div>
      <div class="ditu" style="float:left;"><div id="container">

        </div></div>
      </div>
      </div>
    </a-tab-pane>
    <a-tab-pane tab="水源检测" key="2">
      <div style="height:500px;">
      <a-form :form="form1">
        <div style="width:40%;float:left;margin-right:5%" v-for="(v,k) in watertest" :key="k">
          <a-form-item
          :label="getlabel(v)"
          v-bind="formItemLayout1"
        >
          <a-input-number
            v-decorator="[
          String(v.id),
          {
            rules: [{ required: false}],
          }
        ]"
            style="width: 100%"
          >
          </a-input-number>
        </a-form-item>
        </div>
      </a-form>
      </div>
      </a-tab-pane>
    <a-tab-pane tab="大气检测" key="3">
      <div style="height:500px;">
       <a-form :form="form2">
         <div style="width:40%;float:left;margin-right:5%" v-for="(v,k) in airtest" :key="k">
          <a-form-item
          :label="getlabel(v)"
          v-bind="formItemLayout1"
        >
          <a-input-number
            v-decorator="[
          String(v.id),
          {
            rules: [{ required: false}],
          }
        ]"
            style="width: 100%"
          >
          </a-input-number>
        </a-form-item>
        </div>
      </a-form>
      </div>
    </a-tab-pane>
    <a-tab-pane tab="土壤检测" key="4">
      <div style="height:500px;">
       <a-form :form="form3">
          <div style="width:40%;float:left;margin-right:5%" v-for="(v,k) in soiltest" :key="k">
          <a-form-item
          :label="getlabel(v)"
          v-bind="formItemLayout1"
        >
          <a-input-number
            v-decorator="[
          String(v.id),
          {
            rules: [{ required: false}],
          }
        ]"
            style="width: 100%"
          >
          </a-input-number>
        </a-form-item>
        </div>
      </a-form>
      </div>
    </a-tab-pane>
    <a-tab-pane tab="农残检测" key="5">
      <div style="height:500px;">
       <a-form :form="form4">
          <div style="width:40%;float:left;margin-right:5%" v-for="(v,k) in nctest" :key="k">
          <a-form-item
          :label="getlabel(v)"
          v-bind="formItemLayout1"
        >
          <a-input-number
            v-decorator="[
          String(v.id),
          {
            rules: [{ required: false}],
          }
        ]"
            style="width: 100%"
          >
          </a-input-number>
        </a-form-item>
        </div>
      </a-form>
      </div>
    </a-tab-pane>
    <a-tab-pane tab="糖度检测" key="6">
      <div style="height:500px;">
        <table style="margin:0 auto;text-align:center;">
          <tr>
            <td style="width:300px;padding:10px 20px;font-size:16px;font-weight:bold;">检测值</td>
            <td style="width:300px;padding:10px 20px;font-size:16px;font-weight:bold;">检测时间</td>
            <td style="width:100px;"></td>
          </tr>
        </table>
        <table style="margin:0 auto;text-align:center;">
          <tr v-for="(v,k) in sugarContents" :key="k">
            <td style="width:300px;padding:10px 20px;">
              {{v.sugarContent}}
            </td>
            <td style="width:300px;padding:10px 20px;">
              {{v.detectionTime}}
            </td>
            <td style="width:100px;padding:10px 20px;">
              <a @click="deltd(k)">删除</a>
            </td>
          </tr>
        </table>
        <table style="margin:0 auto;text-align:center;">
          <tr>
            <td style="width:300px;padding:0 20px;">
              <a-input-number v-model="sugarContent" style="width:100%;"></a-input-number>
            </td>
            <td style="width:300px;padding:0 20px;">
               <a-date-picker style="width:100%;" v-model="deldta" @change="onChangead" />
            </td>
            <td style="width:100px;padding:0 20px;">
              <a @click="savetd()">保存</a>
            </td>
          </tr>
        </table>
      </div>
    </a-tab-pane>
    <a-tab-pane tab="果品检测" key="7">
      <div style="height:500px;">
        <table style="margin:0 auto;text-align:center;">
          <tr>
            <td style="font-size:18px;font-weight:bold;text-align:right;padding:50px 10px;">果实颜色：</td>
            <td style="width:300px;padding:50px 10px;">
              <a-select style="width:100%;" v-model="gpzl.fruitColor">
                <a-select-option v-for="(v,k) in colors" :key="k" :value="v">{{v}}</a-select-option>
              </a-select></td>
          </tr>
          <tr>
            <td style="font-size:18px;font-weight:bold;text-align:right;padding:50px 10px;">果实形状：</td>
            <td style="width:300px;padding:50px 10px;"><a-rate v-model="gpzl.fruitShape" allowHalf /><span class="ant-rate-text">{{descc[gpzl.fruitShape*2 - 1]}}</span></td>
          </tr>
          <tr>
            <td style="font-size:18px;font-weight:bold;text-align:right;padding:50px 10px;">果肉饱满度：</td>
            <td style="width:300px;padding:50px 10px;"><a-rate v-model="gpzl.fruitPlumpness" allowHalf /><span class="ant-rate-text">{{descc[gpzl.fruitPlumpness*2 - 1]}}</span></td>
          </tr>
        </table>
      </div>
    </a-tab-pane>
  </a-tabs>

    </a-modal>
  </div>
</template>
<script>
function getBase64 (img, callback) {
  const reader = new FileReader()
  reader.addEventListener('load', () => callback(reader.result))
  reader.readAsDataURL(img)
}
  import Vue from 'vue'
  import { ACCESS_TOKEN } from "@/store/mutation-types"
  import { getBaseCategoryEnum,getBaseTypeEnum,getChinaArea,getSecondArea,getSoilTypeEnum,getBaseAllTest,addBase,delPic,getFruitColorEnum } from '@/api/ddwbApi'
  import {pick} from 'lodash'
  import MapLoader from '@/utils/loadMap.js'
  import axios from 'axios'
  export default {
    name:'workerModal',
    data() {
      return {
        descc:['0.5','1','1.5','2','2.5','3','3.5','4','4.5','5'],
        gpzl:{
          fruitColor:'',
          fruitShape:0,
          fruitPlumpness:0,
        },
        colors:[],
        deldta:null,
        sugarContent:'',
        detectionTime:null,
        sugarContents:[],
        basefileList:[],
        waterfileList:[],
        airfileList:[],
        soilfileList:[],
        ncfileList:[],
        tdfileList:[],
        gpfileList:[],
        basepreviewVisible: false,
        waterpreviewVisible: false,
        airpreviewVisible: false,
        soilpreviewVisible: false,
        ncpreviewVisible:false,
        tdpreviewVisible:false,
        gppreviewVisible:false,
        basepreviewImage: '',
        waterpreviewImage: '',
        airpreviewImage: '',
        soilpreviewImage: '',
        ncpreviewImage:'',
        tdpreviewImage:'',
        gppreviewImage:'',
        Categoryinfo:[],
        Basetypeinfo:[],
        soilTypeinfo:[],
        chinamap:[],
        secondmap:[],
        threemap:[],
        baseloading: false,
        waterloading: false,
        airloading: false,
        soilloading: false,
        ncloading:false,
        tdloading:false,
        gploading:false,
        isedit:true,
        baseimageUrl: '',
        waterimageUrl: '',
        airimageUrl: '',
        soilimageUrl: '',
        ncimageUrl:'',
        tdimageUrl:'',
        gpimageUrl:'',
        headers:'',
        basepic:[],
        waterpic:'',
        airpic:'',
        soilpic:'',
        ncpic:'',
        tdpic:'',
        gppic:'',
        alltest:[],
        airtest:[],
        soiltest:[],
        nctest:[],
        watertest:[],
        map:null,
        area_code:'',
        province_code:'',
        city_code:'',
        ade:true,
        nowkey:'1',
        //showmap:false,
        //butinfo:'选择经纬度',
        address:'',
        label:[],
        options: [],
        confirmDirty: false,
        treeData:[],
        visible: false,
        title:"操作",
        oldname:'',
        par:{},
        ssxarea1:'',
        ssxarea2:'',
        ssxarea3:'',
        ssxarea4:'',
        ssxarea:'',
        baseAddress:'',
        geocoder:{},
        loganglat:{},
        model:{},
        markerb:[],
        ssmarker:'',
        formItemLayout: {
        labelCol: {
          xs: { span: 24},
          sm: { span: 6 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 16 },
        },
      },
      formItemLayout1: {
        labelCol: {
          xs: { span: 24},
          sm: { span: 10 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 14 },
        },
      },
        form: this.$form.createForm(this),
        form1:this.$form.createForm(this),
        form2:this.$form.createForm(this),
        form3:this.$form.createForm(this),
        form4:this.$form.createForm(this),
      }
    },
    created(){
      const token = Vue.ls.get(ACCESS_TOKEN);
      this.headers = {"X-Access-Token":token};
      this.loganglat.log=null;
      this.loganglat.lat=null;
      getBaseAllTest().then((res)=>{
        if(res.success){
          this.alltest=res.result;
          this.watertest=[];
          this.soiltest=[];
          this.airtest=[];
          this.nctest=[];
          for(let i=0;i<this.alltest.length;i++){
            switch (this.alltest[i].itemName.code) {
              case 'AIR':
                this.airtest.push(this.alltest[i])
                break;
              case 'WATER':
                this.watertest.push(this.alltest[i])
                break;
              case 'SOIL':
                this.soiltest.push(this.alltest[i])
                break;
              case 'PESTICIDE_RESIDUES':
                this.nctest.push(this.alltest[i])
                break;  
              default:
                break;
            }
          }
        }
      })
      getBaseCategoryEnum().then((res)=>{
        if(res.success){
          this.Categoryinfo=res.result;
        }
      })
      getBaseTypeEnum().then((res)=>{
         if(res.success){
          this.Basetypeinfo=res.result;
        }
      })
      getChinaArea().then((res)=>{
        if(res.success){
          this.chinamap=res.result;
        }
      })
      getSoilTypeEnum().then((res)=>{
        if(res.success){
          this.soilTypeinfo=res.result;
        }
      })
      getFruitColorEnum().then((res)=>{
        if(res.success){
          this.colors=res.result;
        }
      })
    },
    mounted(){},
    methods: {
    onChangead(value){
      if(value){
        this.detectionTime=value.format("YYYY-MM-DD")
      }
    },
    deltd(k){
      this.sugarContents.splice(k,1);
    },
    savetd(){
      let par={};
      if(this.sugarContent&&this.detectionTime){
        par.sugarContent=this.sugarContent;
        par.detectionTime=this.detectionTime;
        this.sugarContents.push(par);
        this.sugarContent='';
        this.detectionTime=null;
        this.deldta=null;
      }
    },
    getlabel(v){
      return v.item+'('+v.unit.displayName+')';
    },
    basehandleCancel () {
      this.basepreviewVisible = false
    },
    waterhandleCancel () {
      this.waterpreviewVisible = false
    },
    airhandleCancel () {
      this.airpreviewVisible = false
    },
    soilhandleCancel () {
      this.soilpreviewVisible = false
    },
    nchandleCancel () {
      this.ncpreviewVisible = false
    },
    tdhandleCancel () {
      this.tdpreviewVisible = false
    },
    gphandleCancel () {
      this.gppreviewVisible = false
    },
    basehandlePreview (file) {
      this.basepreviewImage = file.url || file.thumbUrl
      this.basepreviewVisible = true
    },
    waterhandlePreview (file) {
      this.waterpreviewImage = file.url || file.thumbUrl
      this.waterpreviewVisible = true
    },
    airhandlePreview (file) {
      this.airpreviewImage = file.url || file.thumbUrl
      this.airpreviewVisible = true
    },
    soilhandlePreview (file) {
      this.soilpreviewImage = file.url || file.thumbUrl
      this.soilpreviewVisible = true
    },
    nchandlePreview (file) {
      this.ncpreviewImage = file.url || file.thumbUrl
      this.ncpreviewVisible = true
    },
    tdhandlePreview (file) {
      this.tdpreviewImage = file.url || file.thumbUrl
      this.tdpreviewVisible = true
    },
    gphandlePreview (file) {
      this.gppreviewImage = file.url || file.thumbUrl
      this.gppreviewVisible = true
    },
    removebasepic(file){
      console.log(file.response.result.id);
       delPic({id:this.basepic[this.basepic.indexOf(file.response.result.id)]}).then(res=>{
         if(res.success){
           this.$message.success(res.message);
           this.basepic=this.basepic.filter((v)=>{
             if(v!=this.basepic.indexOf(file.response.result.id)){
               return v;
             }
           });
           this.basefileList=this.basefileList.filter((v)=>{
             if(v.response.result.id!=file.response.result.id){
               return v;
             }
           });
         }
       })
       return true;
    },
    removewaterpic(file){
       delPic({id:this.waterpic}).then(res=>{
         if(res.success){
           this.$message.success(res.message);
            this.waterpic='';
            this.waterfileList=[];
         }
       })
       return true;
    },
    removeairpic(file){
       delPic({id:this.airpic}).then(res=>{
         if(res.success){
           this.$message.success(res.message);
           this.airpic='';
           this.airfileList=[];
         }
       })
       return true;
    },
    removesoilpic(file){
       delPic({id:this.soilpic}).then(res=>{
         if(res.success){
           this.$message.success(res.message);
           this.soilpic='';
           this.soilfileList=[];
         }
       })
       return true;
    },
    removencpic(file){
       delPic({id:this.ncpic}).then(res=>{
         if(res.success){
           this.$message.success(res.message);
           this.ncpic='';
           this.ncfileList=[];
         }
       })
       return true;
    },
    removetdpic(file){
       delPic({id:this.tdpic}).then(res=>{
         if(res.success){
           this.$message.success(res.message);
           this.tdpic='';
           this.tdfileList=[];
         }
       })
       return true;
    },
    removegppic(file){
       delPic({id:this.gppic}).then(res=>{
         if(res.success){
           this.$message.success(res.message);
           this.gppic='';
           this.gpfileList=[];
         }
       })
       return true;
    },
       basehandleChange (info) {
         
      if (info.file.status === 'uploading') {
        this.basefileList=info.fileList;
        console.log(this.basefileList)
        this.baseloading = true
        return
      }
      if (info.file.status === 'done') {
        // Get this url from response in real world.
        // console.log(info.file.response.result.path)
        
        this.basepic.push(info.file.response.result.id);
        getBase64(info.file.originFileObj, (imageUrl) => {
          this.baseimageUrl = imageUrl
          this.baseloading = false
        })
      }
    },
    waterhandleChange (info) {
      
      if (info.file.status === 'uploading') {
        this.waterfileList=info.fileList;
        this.waterloading = true
        return
      }
      if (info.file.status === 'done') {
        // Get this url from response in real world.
        //console.log(info.file.response.result.path)
        
        this.waterpic=info.file.response.result.id
        getBase64(info.file.originFileObj, (imageUrl) => {

          this.waterimageUrl = imageUrl
          this.waterloading = false
        })
      }
    },
    airhandleChange (info) {
      
      if (info.file.status === 'uploading') {
        this.airfileList=info.fileList;
        this.airloading = true
        return
      }
      if (info.file.status === 'done') {
        // Get this url from response in real world.
        //console.log(info.file.response.result.path)
        
        this.airpic=info.file.response.result.id
        getBase64(info.file.originFileObj, (imageUrl) => {

          this.airimageUrl = imageUrl
          this.airloading = false
        })
      }
    },
    soilhandleChange (info) {
      if (info.file.status === 'uploading') {
        this.soilfileList=info.fileList;
        this.soilloading = true
        return
      }
      if (info.file.status === 'done') {
        // Get this url from response in real world.
        //console.log(info.file.response.result.path)
        
        this.soilpic=info.file.response.result.id
        getBase64(info.file.originFileObj, (imageUrl) => {

          this.soilimageUrl = imageUrl
          this.soilloading = false
        })
      }
    },
    nchandleChange (info) {
      if (info.file.status === 'uploading') {
        this.ncfileList=info.fileList;
        this.ncloading = true
        return
      }
      if (info.file.status === 'done') {
        // Get this url from response in real world.
        //console.log(info.file.response.result.path)
        
        this.ncpic=info.file.response.result.id
        getBase64(info.file.originFileObj, (imageUrl) => {

          this.ncimageUrl = imageUrl
          this.ncloading = false
        })
      }
    },
    tdhandleChange (info) {
      if (info.file.status === 'uploading') {
        this.tdfileList=info.fileList;
        this.tdloading = true
        return
      }
      if (info.file.status === 'done') {
        // Get this url from response in real world.
        //console.log(info.file.response.result.path)
        
        this.tdpic=info.file.response.result.id
        getBase64(info.file.originFileObj, (imageUrl) => {

          this.tdimageUrl = imageUrl
          this.tdloading = false
        })
      }
    },
    gphandleChange (info) {
      if (info.file.status === 'uploading') {
        this.gpfileList=info.fileList;
        this.gploading = true
        return
      }
      if (info.file.status === 'done') {
        // Get this url from response in real world.
        //console.log(info.file.response.result.path)
        
        this.gppic=info.file.response.result.id
        getBase64(info.file.originFileObj, (imageUrl) => {

          this.gpimageUrl = imageUrl
          this.gploading = false
        })
      }
    },
    delAllPic(){
      if(this.basepic.length>0){
        for(let i=0;i<this.basepic.length;i++){
          delPic({id:this.basepic[i]}).then(res=>{
            if(res.success){

            }
          })
        }
      //    delPic({id:this.basepic}).then(res=>{
      //    if(res.success){
      //      this.basepic='';
      //    }
      //  })
      }
       if(this.waterpic){
         delPic({id:this.waterpic}).then(res=>{
         if(res.success){
           this.waterpic='';
         }
       })
      }
       if(this.airpic){
         delPic({id:this.airpic}).then(res=>{
         if(res.success){
           this.airpic='';
         }
       })
      }
       if(this.soilpic){
         delPic({id:this.soilpic}).then(res=>{
         if(res.success){
           this.soilpic='';
         }
       })
      }
    },
    beforeUpload (file) {

        const isJPG = file.type === 'image/jpeg'
        const isPNG = file.type === 'image/png'
        if (!(isPNG||isJPG)) {
          this.$message.error('只允许上传jpg/png格式图片')
        }
        const isLt5M = file.size / 1024 / 1024 < 5
        if (!isLt5M) {
          this.$message.error('图片大小不能大于5M')
        }
        return (isJPG || isPNG) && isLt5M
    },
      handleSearch(){
         this.ssxarea=this.ssxarea1+this.ssxarea2+this.ssxarea3;
        this.baseAddress=this.address;
        if(this.ssxarea&&this.baseAddress){
           let that=this;
         AMap.plugin('AMap.Geocoder', function() {
           that.geocoder = new AMap.Geocoder({
           // city 指定进行编码查询的城市，支持传入城市名、adcode 和 citycode
          city: '100000'
          })

          let aaa=that.ssxarea+that.baseAddress;
          //console.log(aaa);
           that.geocoder.getLocation(aaa, function(status, result) {
    if (status === 'complete' && result.info === 'OK') {
      // result中对应详细地理坐标信息
      //console.log(result);
       var lnglat = result.geocodes[0].location
       that.form.setFieldsValue({longitude:lnglat.lng,latitude:lnglat.lat});
       if(that.markerb[0]){
       that.map.remove(that.markerb[0]);
       }
       if(that.markerb[2]){
       that.map.remove(that.markerb[2]);
       }
       if(that.markerb[1]){
       that.map.remove(that.markerb[1]);
       }
       that.markerb=[];
       that.markerb[0] = new AMap.Marker();
       that.map.add(that.markerb[0]);
       that.markerb[0].setPosition(lnglat);
       that.map.setFitView(that.markerb[0]);
    }else{
      this.$message.info("根据地址查询位置失败！");
    }
  })
         });
        }
      },
     changekey(activeKey){
       this.nowkey=activeKey;
     },
      changefirst(value,option){
        this.ssxarea1=option.componentOptions.children[0].text;
        this.city_code='';
        this.area_code='';
        this.secondmap=[];
        this.threemap=[];
        getSecondArea({parentCode:value}).then((res)=>{
            if(res.success){
              this.secondmap=res.result;
            }
        })
      },
      changescend(value,option){
        this.ssxarea2=option.componentOptions.children[0].text;
        this.area_code='';
        this.threemap=[];
        getSecondArea({parentCode:value}).then((res)=>{
          if(res.success){
            this.threemap=res.result;
          }
      })
      },
      changethree(value,option){
         this.ssxarea3=option.componentOptions.children[0].text;
         this.ssxarea4=value;
      },
      handleupdate(){
        this.ade=true;
        this.options=[];
        this.loadmap();
        this.form.resetFields('baseAddress');
      },
      mappoint(a){
        let b=[];
        if(!a.log||!a.lat){
          b=null;
        }else{
          b.push(a.log);
          b.push(a.lat);
        }
      //  console.log(b);
          let that = this
    MapLoader().then(AMap => {
       let googleLayer = new AMap.TileLayer({
              getTileUrl: 'http://mt{1,2,3,0}.google.cn/vt/lyrs=s&hl=zh-CN&gl=cn&x=[x]&y=[y]&z=[z]&s=Galile'
           });//定义谷歌卫星切片图层
        let roadNetLayer = new AMap.TileLayer.RoadNet({
          opacity:0
        }); //定义一个路网图层
      that.map = new AMap.Map('container', {
         center: b,
        zoom: 15,
         layers:[googleLayer,roadNetLayer],
        //viewMode:'3D'
        //mapStyle: 'amap://styles/dark',
      });
        if(a.log&&a.lat){
      that.markerb[1] = new AMap.Marker({
         position: new AMap.LngLat(a.log,a.lat),
        //position: new AMap.LngLat(null,null),
       });

       that.map.add(that.markerb[1]);
        }
       var clickHandler = function(e) {
         that.form.setFieldsValue({longitude:e.lnglat.getLng(),latitude:e.lnglat.getLat()});
        };
        // 绑定事件
        that.map.on('click', clickHandler);

        var markers = [];
        AMap.event.addListener(that.map, "click", addMarker);
        function addMarker(e){
        //  console.log(e);
           if(a.log&&a.lat){
             if(that.markerb[1]){
               that.map.remove(that.markerb[1]);
             }
          if(that.markerb[0]){
          that.map.remove(that.markerb[0]);
          }
           }
           for(var j=0;j<markers.length;j++){
              markers[j].setMap(null);
           }
           that.markerb[2] = new AMap.Marker({
                map: that.map,
                position: e.lnglat,
              });
           markers.push(that.markerb[2]);
          }
          that.map.on("complete", function(){
        //  console.log("地图加载完成！");
          var myEvent = new CustomEvent('done',{});
          if(window.dispatchEvent) {
            window.dispatchEvent(myEvent);
          } else {
            window.fireEvent(myEvent);
          }
        });
    })
      },
      reload(){
        this.gpzl={
          fruitColor:'',
          fruitShape:0,
          fruitPlumpness:0,
        };
        this.sugarContents=[];
        this.sugarContent='';
        this.detectionTime=null;
        this.nowkey='1';
        this.form.resetFields();
        this.form1.resetFields();
        this.form2.resetFields();
        this.form3.resetFields();
        this.address='';
        this.basefileList=[];
        this.waterfileList=[];
        this.airfileList=[];
        this.soilfileList=[];
        this.ncfileList=[];
        this.tdfileList=[];
        this.gpfileList=[];
        this.baseimageUrl='';
        this.waterimageUrl='';
        this.airimageUrl='';
        this.soilimageUrl='';
        this.basepic=[];
        this.waterpic='';
        this.airpic='';
        this.soilpic='';
        this.area_code='';
        this.province_code='';
        this.city_code='';
        this.ssxarea1='';
        this.ssxarea2='';
        this.ssxarea3='';
        this.ssxarea4='';
        this.aaa='1';
      },
      add(){
       this.reload();
       this.visible=true;
       this.title='新增';
       this.mappoint(this.loganglat);
       let that = this;
        window.addEventListener('done', function(){
          AMap.plugin(['AMap.Autocomplete','AMap.PlaceSearch'],function(){
          var autoOptions = {
            // 城市，默认全国
            city: '全国',
            // 使用联想输入的input的id
            input: "input1",
            citylimit:true
          }
          var autocomplete= new AMap.Autocomplete(autoOptions)

          var placeSearch = new AMap.PlaceSearch({
            city:'全国',
            map:that.map
          })
          AMap.event.addListener(autocomplete, 'select', function(e){
            //TODO 针对选中的poi实现自己的功能
          //  console.log(e.poi);
            if(e.poi.address.length>0){
              placeSearch.search(e.poi.name)
            }else{
              let aa=[];
              aa.push(e.poi.location.lng);
              aa.push(e.poi.location.lat);
              that.map.setCenter(aa);
            }
          })
        })
      });
      //  this.cretedmap();
      },
      handleOk(){
        const that = this;
        // 触发表单验证
        this.form.validateFields((err, values) => {
          var baseTestingVoList=[];
          var address={};
          this.form1.validateFields((err, values) => {
               Object.keys(values).forEach(function(key){
                 let a={};
                 a.envStandardsId=Number(key);
                 a.value=values[key];
                 if(a.value||a.value==0){
                 baseTestingVoList.push(a);
                 }
               });

          })
          this.form2.validateFields((err, values) => {
                Object.keys(values).forEach(function(key){
                 let a={};
                 a.envStandardsId=Number(key);
                 a.value=values[key];
                 if(a.value||a.value==0){
                 baseTestingVoList.push(a);
                 }
               });
          })
          this.form3.validateFields((err, values) => {
                Object.keys(values).forEach(function(key){
                 let a={};
                 a.envStandardsId=Number(key);
                 a.value=values[key];
                 if(a.value||a.value==0){
                 baseTestingVoList.push(a);
                 }
               });
          })
          this.form4.validateFields((err, values) => {
                Object.keys(values).forEach(function(key){
                 let a={};
                 a.envStandardsId=Number(key);
                 a.value=values[key];
                 if(a.value||a.value==0){
                 baseTestingVoList.push(a);
                 }
               });
          })
          if (!err) {
            address.province=this.ssxarea1;
            address.city=this.ssxarea2;
            address.area=this.ssxarea3;
            address.provinceCode=this.province_code;
            address.cityCode=this.city_code;
            address.areaCode=this.area_code;
            address.street=this.address;
            that.confirmLoading = true;
            let formData = values;
            formData.sugarContents=this.sugarContents;
            formData.address=address;
            formData.baseTestingVoList=baseTestingVoList;
            formData.areaCode=this.ssxarea4;
            formData.basePic=[];
            for(let i=0;i<this.basepic.length;i++){
              formData.basePic.push({id:this.basepic[i]});
            }
            formData.soilPic={id:this.soilpic};
            formData.waterPic={id:this.waterpic};
            formData.airPic={id:this.airpic};
            formData.pesticideResiduesPic={id:this.ncpic};
            formData.sugarContentPic={id:this.tdpic};
            formData.fruitReportPic={id:this.gppic};
            if(this.gpzl.fruitColor){
              formData.fruitGrading=this.gpzl;
            }else{
              formData.fruitGrading=null;
            }
            
          //  console.log(formData);
            if(this.title=="新增"){
             addBase(formData).then((res)=>{
               if(res.success){
                 that.$message.success(res.message);
                that.$parent.loadData();
                that.hideModal();
               }else{
                 that.$message.warning(res.message);
               }
             })
            }

          }
        })
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
#container {
  width: 620px;
  height: 430px;
}
/* .ditu{
  position: absolute;
  top:13.4%;
  right:2%;
} */
.jwd{
  position: absolute;
  bottom:46%;
  right:10%;
}
.allall{
  height:500px;
  overflow-y: auto;
}
.tp{
  width:530px;
  position: absolute;
  bottom: 0%;
  right:5.5%;
}
.tp1{
  position: absolute;
  bottom: 30%;
  right:45.5%
}
.tpp{
  position: absolute;
  bottom: 30%;
  right:25.5%;
}
.tpp1{
  position: absolute;
  bottom: 30%;
  right:5.5%;
}
.nc{
  position: absolute;
  bottom: 15%;
  right: 45.5%;
}
.td{
  position: absolute;
  bottom: 15%;
  right:25.5%;
}
.gp{
  position: absolute;
  bottom: 15%;
  right:5.5%;
}
.all{
  width:1050px;
  /* height:500px;
  overflow:auto */
}
.all::after,.jiange::after{
  clear: both;
  content: '';
  display: block;
  width: 0;
  height: 0;
}
.input{
  position: absolute;
  border-radius: 15px;
  width:35%;
  top:2%;
  left:52%;
  z-index: 999;
  background:rgba(255,255,255,1);
  padding:0.5rem 0.5rem;
}
.input span{
  color:rgb(0, 0, 0);
  font-size: 14px;
  margin-right: 10px;
  vertical-align:middle;
}
#input1{
  display: inline-block;
  width:64%;
  -web-kit-appearance:none;
  -moz-appearance: none;
  font-size:1.0em;
  height:25px;
  border-radius:4px;
  border:1px solid #1a85d6;
  color:#6a6f77;
  outline:0;
}
</style>
