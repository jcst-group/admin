<template>
  <div>
    <a-modal
      width=60%
      v-model="visible"
      :title="title"
      @ok="handleOk"
      @cancel="delNewPic"
      okText="保存"
      ref="modal"
      cancelText="取消"
      :maskClosable="false"
      style="min-width:1150px"
    >
     <a-tabs v-model="activeKey">
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
            initialValue:record.baseName,
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
            initialValue:record.category?record.category.code:null,
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
            initialValue:record.baseType?record.baseType.code:null,
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
            initialValue:record.soilType?record.soilType.code:null,
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
       <div class="jiange">
         <a-select style="float:left;width:100%;margin-top:4px" v-model="area_code" @change="changethree">
        <a-select-option v-for="(v,k) in threemap" :value="v.areaCode" :key="k">{{v.areaName}}</a-select-option>
      </a-select>
         <!-- <a-input
         @blur="start"   -->
        </div>
        <div>
          <a-input
          placeholder="请输入具体地址"
          v-model="address"
          style="width: 100%;"
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
             initialValue:record.longitude,
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
            initialValue:record.latitude,
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
          label="海拔"
          v-bind="formItemLayout"
        >
          <a-input-number
            style="width:100%"
            v-decorator="[
          'altitude',
          {
            initialValue:record.altitude,
          }
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
            initialValue:record.frontStubble,
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
            initialValue:record.acreage,
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
            initialValue:record.position,
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
          {
            initialValue:(record.slope||record.slope==0)?String(record.slope):null,
          }
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
          {
            initialValue:record.panoramaUrl?record.panoramaUrl:null,
          }
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
    action="/api2/pictureInfo/addBasePic"
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
       <!-- <a-upload
    name="file"
    listType="picture-card"
    class="avatar-uploader"
    :showUploadList="false"
    action="/api2/pictureInfo/addWaterPic"
    :beforeUpload="beforeUpload"
    :headers="headers"
    @change="waterhandleChange"
    v-if="isedit"
  >
    <img v-if="waterimageUrl" :src="waterimageUrl" alt="水源" style="width:100px;height:100px;"/>
    <div v-else>
        <a-icon :type="waterloading ? 'loading' : 'plus'" />
        <div class="ant-upload-text">Upload</div>
    </div>
  </a-upload>
  <template v-if="!isedit"><img v-if="waterimageUrl" :src="waterimageUrl" alt="avatar" style="width:100px;height:100px;"/></template> -->
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
       <!-- <a-upload
    name="file"
    listType="picture-card"
    class="avatar-uploader"
    :showUploadList="false"
    action="/api2/pictureInfo/addAirPic"
    :beforeUpload="beforeUpload"
    :headers="headers"
    @change="airhandleChange"
    v-if="isedit"
  >
    <img v-if="airimageUrl" :src="airimageUrl" alt="大气" style="width:100px;height:100px;"/>
    <div v-else>
        <a-icon :type="airloading ? 'loading' : 'plus'" />
        <div class="ant-upload-text">Upload</div>
    </div>
  </a-upload>
  <template v-if="!isedit"><img v-if="airimageUrl" :src="airimageUrl" alt="avatar" style="width:100px;height:100px;"/></template> -->
    </a-form-item>
    </div>
    <div class="tpp1">
    <a-form-item
      label="土壤检测图片"
      style="display:inline-block;width:100%;"
    >
    <a-upload
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
      action="/api2/pictureInfo/addFruitReportPic"
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
          {initialValue:record.survey,}
        ]"
            style="width: 100%"
          >
          </a-textarea>
        </a-form-item>
      </a-form>
      </div>
       <div class="input"><span>关键字搜索地点:</span><input id='input2' type="text"></div>
      <div class="ditu" style="float:left;"><div id="container1">

        </div></div>
      </div>
      </div>
    </a-tab-pane>
    <a-tab-pane tab="水源检测" key="2">
      <div style="height:500px;">
      <a-form :form="form1">
        <div style="width:40%;float:left;margin-right:5%;" v-for="(v,k) in watertest" :key="k">
           <a-form-item
          :label="getlabel(v)"
          v-bind="formItemLayout1"
        >
          <a-input-number
            v-decorator="[
          String(v.id),
          {
            initialValue:threetest1[v.id]||threetest1[v.id]==0?String(threetest1[v.id]):null,
            rules: [{required: false}],
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
         <div style="width:40%;float:left;margin-right:5%;" v-for="(v,k) in airtest" :key="k">
           <a-form-item
          :label="getlabel(v)"
          v-bind="formItemLayout1"
        >
          <a-input-number
            v-decorator="[
          String(v.id),
          {
            initialValue:threetest2[v.id]||threetest2[v.id]==0?String(threetest2[v.id]):null,
            rules: [{required: false}],
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
         <div style="width:40%;float:left;margin-right:5%;" v-for="(v,k) in soiltest" :key="k">
           <a-form-item
          :label="getlabel(v)"
          v-bind="formItemLayout1"
        >
          <a-input-number
            v-decorator="[
          String(v.id),
          {
            initialValue:threetest3[v.id]||threetest3[v.id]==0?String(threetest3[v.id]):null,
            rules: [{required: false}],
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
         <div style="width:40%;float:left;margin-right:5%;" v-for="(v,k) in nctest" :key="k">
           <a-form-item
          :label="getlabel(v)"
          v-bind="formItemLayout1"
        >
          <a-input-number
            v-decorator="[
          String(v.id),
          {
            initialValue:threetest4[v.id]||threetest4[v.id]==0?String(threetest4[v.id]):null,
            rules: [{required: false}],
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
  import {saveWalker,updateWalker} from '@/api/allapi'
  import Vue from 'vue'
  import { ACCESS_TOKEN } from "@/store/mutation-types"
  import { getBaseCategoryEnum,getBaseTypeEnum,getChinaArea,getSecondArea,getSoilTypeEnum,getBaseAllTest,addBase,editBase,delPic,getFruitColorEnum } from '@/api/ddwbApi'
  import { insertBase,updateBase,basenamecheck } from '@/api/allapi'
  import { getmap } from '@/api/userApi'
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
        activeKey: '1',
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
        threetest1:{},
        threetest2:{},
        threetest3:{},
        threetest4:{},
        ade:true,
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
        record:{},
        markerb:[],
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
        newpic:[],
      }
    },
    created(){
      const token = Vue.ls.get(ACCESS_TOKEN);
      this.headers = {"X-Access-Token":token};
      this.loganglat.log=105.06;
      this.loganglat.lat=31.1;
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
     mounted(){


  },
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
      console.log(file);
      if(file.hasOwnProperty('response')){
        console.log(file.response.result.id);
        let a=this.newpic.indexOf(file.response.result.id);
        delete this.newpic[a];
        delPic({id:file.response.result.id}).then(res=>{
         if(res.success){
           this.$message.success(res.message);
           this.$parent.loadData();
           this.basepic=this.basepic.filter((v)=>{
             if(v!=file.response.result.id){
               return v;
             }
           });
           this.basefileList=this.basefileList.filter(v=>{
             if(v.hasOwnProperty('response')){
               if(v.response.result.id!=file.response.result.id){
                 return v;
               }
             }else{
               return v;
             }
           });
         }
       })
      }else{
        console.log(file.uid)
        delPic({id:file.uid}).then(res=>{
         if(res.success){
           this.$message.success(res.message);
           this.$parent.loadData();
           this.basefileList=this.basefileList.filter(v=>{
             if(v.hasOwnProperty('response')){
                 return v;
             }else{
               if(v.uid!=file.uid){
                return v;
               }
             }
           });
         }
       })
      }
      // let picid='';
      // if(this.basepic){
      //    picid=this.basepic;
      //    let a=this.newpic.indexOf(picid);
      //    delete this.newpic[a];
      // }else{
      //   picid=file.uid;
      // }
      //  delPic({id:picid}).then(res=>{
      //    if(res.success){
      //      this.$message.success(res.message);
      //      this.$parent.loadData();
      //      this.basepic='';
      //      this.basefileList=[];
      //    }
      //  })
      //  return true;
    },
    removewaterpic(file){
      let picid='';
      if(this.waterpic){
         picid=this.waterpic;
         let a=this.newpic.indexOf(picid);
         delete this.newpic[a];
      }else{
        picid=file.uid;
      }
       delPic({id:picid}).then(res=>{
         if(res.success){
           this.$message.success(res.message);
           this.$parent.loadData();
            this.waterpic='';
            this.waterfileList=[];
         }
       })
       return true;
    },
    removeairpic(file){
       let picid='';
      if(this.airpic){
         picid=this.airpic;
         let a=this.newpic.indexOf(picid);
         delete this.newpic[a];
      }else{
        picid=file.uid;
      }
       delPic({id:picid}).then(res=>{
         if(res.success){
           this.$message.success(res.message);
           this.$parent.loadData();
           this.airpic='';
           this.airfileList=[];
         }
       })
       return true;
    },
    removesoilpic(file){
       let picid='';
      if(this.soilpic){
         picid=this.soilpic;
         let a=this.newpic.indexOf(picid);
         delete this.newpic[a];
      }else{
        picid=file.uid;
      }
       delPic({id:picid}).then(res=>{
         if(res.success){
           this.$message.success(res.message);
           this.$parent.loadData();
           this.soilpic='';
           this.soilfileList=[];
         }
       })
       return true;
    },
    removencpic(file){
       let picid='';
      if(this.ncpic){
         picid=this.ncpic;
         let a=this.newpic.indexOf(picid);
         delete this.newpic[a];
      }else{
        picid=file.uid;
      }
       delPic({id:picid}).then(res=>{
         if(res.success){
           this.$message.success(res.message);
           this.$parent.loadData();
           this.ncpic='';
           this.ncfileList=[];
         }
       })
       return true;
    },
    removetdpic(file){
       let picid='';
      if(this.tdpic){
         picid=this.tdpic;
         let a=this.newpic.indexOf(picid);
         delete this.newpic[a];
      }else{
        picid=file.uid;
      }
       delPic({id:picid}).then(res=>{
         if(res.success){
           this.$message.success(res.message);
           this.$parent.loadData();
           this.tdpic='';
           this.tdfileList=[];
         }
       })
       return true;
    },
    removegppic(file){
       let picid='';
      if(this.gppic){
         picid=this.gppic;
         let a=this.newpic.indexOf(picid);
         delete this.newpic[a];
      }else{
        picid=file.uid;
      }
       delPic({id:picid}).then(res=>{
         if(res.success){
           this.$message.success(res.message);
           this.$parent.loadData();
           this.gppic='';
           this.gpfileList=[];
         }
       })
       return true;
    },
    delNewPic(){
      for(let a=0;a<this.newpic.length;a++){
        if(this.newpic[a]){
        delPic({id:this.newpic[a]}).then(res=>{});
        }
      }
    },
       basehandleChange (info) {
         
      if (info.file.status === 'uploading') {
        this.basefileList=info.fileList;
        this.baseloading = true
        return
      }
      if (info.file.status === 'done') {
        // Get this url from response in real world.
        //console.log(info.file.response.result.path)
        
        this.basepic.push(info.file.response.result.id)
        this.newpic.push(info.file.response.result.id);
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
        
        this.waterpic=info.file.response.result.id
        this.newpic.push(info.file.response.result.id);
      //  console.log(this.waterpic);
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
        this.airpic=info.file.response.result.id
        this.newpic.push(info.file.response.result.id);
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
        this.soilpic=info.file.response.result.id
        this.newpic.push(info.file.response.result.id);
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
        this.ncpic=info.file.response.result.id
        this.newpic.push(info.file.response.result.id);
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
        this.tdpic=info.file.response.result.id
        this.newpic.push(info.file.response.result.id);
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
        this.gppic=info.file.response.result.id
        this.newpic.push(info.file.response.result.id);
        getBase64(info.file.originFileObj, (imageUrl) => {

          this.gpimageUrl = imageUrl
          this.gploading = false
        })
      }
    },
    beforeUpload (file) {
        const isJPG = file.type === 'image/jpeg'
        const isPNG = file.type === 'image/png'
        if (!(isPNG||isJPG)) {
          this.$message.error('只允许上传jpg/png格式图片')
        }
        const isLt2M = file.size / 1024 / 1024 < 5
        if (!isLt2M) {
          this.$message.error('图片大小不能大于5M')
        }
        return (isJPG || isPNG) && isLt2M
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
      changefirst(value,option){
        this.address=''
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
      that.map = new AMap.Map('container1', {
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
          var myEvent = new CustomEvent('done1',{});
          if(window.dispatchEvent) {
            window.dispatchEvent(myEvent);
          } else {
            window.fireEvent(myEvent);
          }
        });
    })
      },
      reload(record){
        this.gpzl={
          fruitColor:'',
          fruitShape:-1,
          fruitPlumpness:-1,
        };
        this.sugarContents=[];
        this.sugarContent='';
        this.detectionTime=null;
       this.newpic=[];
       this.form.resetFields();
       this.form1.resetFields();
       this.form2.resetFields();
       this.form3.resetFields();
       this.threetest1={};
       this.threetest2={};
       this.threetest3={};
       this.threetest4={};
       this.basefileList=[];
       this.waterfileList=[];
       this.airfileList=[];
       this.soilfileList=[];
       this.ncfileList=[];
       this.tdfileList=[];
       this.gpfileList=[];
       if(record!=undefined){
         this.record=record;
       this.address=record.address.street;
       if(this.record.fruitGrading){
         this.gpzl.fruitColor=this.record.fruitGrading.fruitColor;
         this.gpzl.fruitShape=this.record.fruitGrading.fruitShape;
         this.gpzl.fruitPlumpness=this.record.fruitGrading.fruitPlumpness;
       }
       if(this.record.sugarContents){
         for(let i=0;i<this.record.sugarContents.length;i++){
           let par={};
           par.sugarContent=this.record.sugarContents[i].sugarContent;
           par.detectionTime=this.record.sugarContents[i].detectionTime;
           this.sugarContents.push(par);
         }
       }
       if(record.basePic.length>0){
         for(let i=0;i<record.basePic.length;i++){
            this.baseimageUrl='/api2/pictureInfo/show/'+record.basePic[i].pictureUrl;
            let a={
              uid: record.basePic[i].id,
              name: record.basePic[i].pictureUrl,
              status: 'done',
              url: this.baseimageUrl,
            };
            this.basefileList.push(a);
         }
         this.basepic=[];
       }else{
         this.baseimageUrl='';
         this.basepic=[];
       }
       if(record.waterPic){
       this.waterimageUrl='/api2/pictureInfo/show/'+record.waterPic.pictureUrl;
       let b={
        uid: record.waterPic.id,
        name: record.waterPic.pictureUrl,
        status: 'done',
        url: this.waterimageUrl,
      };
       this.waterfileList.push(b);
       this.waterpic='';
       }else{
        this.waterimageUrl='';
        this.waterpic='';
       }
       if(record.airPic){
       this.airimageUrl='/api2/pictureInfo/show/'+record.airPic.pictureUrl;
       let c={
        uid: record.airPic.id,
        name: record.airPic.pictureUrl,
        status: 'done',
        url: this.airimageUrl,
      };
       this.airfileList.push(c);
       this.airpic='';
       }else{
         this.airimageUrl='';
         this.airpic='';
       }
       if(record.soilPic){
       this.soilimageUrl='/api2/pictureInfo/show/'+record.soilPic.pictureUrl;
       let d={
        uid: record.soilPic.id,
        name: record.soilPic.pictureUrl,
        status: 'done',
        url: this.soilimageUrl,
      };
       this.soilfileList.push(d);
       this.soilpic='';
       }else{
         this.soilimageUrl='';
         this.soilpic='';
       }
       if(record.pesticideResiduesPic){
       this.ncimageUrl='/api2/pictureInfo/show/'+record.pesticideResiduesPic.pictureUrl;
       let d={
        uid: record.pesticideResiduesPic.id,
        name: record.pesticideResiduesPic.pictureUrl,
        status: 'done',
        url: this.ncimageUrl,
      };
       this.ncfileList.push(d);
       this.ncpic='';
       }else{
         this.ncimageUrl='';
         this.ncpic='';
       }
       if(record.sugarContentPic){
       this.tdimageUrl='/api2/pictureInfo/show/'+record.sugarContentPic.pictureUrl;
       let d={
        uid: record.sugarContentPic.id,
        name: record.sugarContentPic.pictureUrl,
        status: 'done',
        url: this.tdimageUrl,
      };
       this.tdfileList.push(d);
       this.tdpic='';
       }else{
         this.tdimageUrl='';
         this.tdpic='';
       }
       if(record.fruitReportPic){
        this.gpimageUrl='/api2/pictureInfo/show/'+record.fruitReportPic.pictureUrl;
        let d={
          uid: record.fruitReportPic.id,
          name: record.fruitReportPic.pictureUrl,
          status: 'done',
          url: this.gpimageUrl,
        };
        this.gpfileList.push(d);
        this.gppic='';
       }else{
         this.gpimageUrl='';
         this.gppic='';
       }
       this.area_code=record.address.areaCode;
       this.province_code=record.address.provinceCode;
        getSecondArea({parentCode:this.province_code}).then((res)=>{
            if(res.success){
              this.secondmap=res.result;
            }
        })

       this.city_code=record.address.cityCode;
        getSecondArea({parentCode:this.city_code}).then((res)=>{
            if(res.success){
              this.threemap=res.result;
            }
        })
       this.ssxarea1=record.address.province;
       this.ssxarea2=record.address.city;
       this.ssxarea3=record.address.area;
       this.ssxarea4=record.areaCode;
       let aa=this.record.baseTestingVoList;
       for(let i=0;i<aa.length;i++){
         if(aa[i].itemName.value==1){
           for(let j=0;j<this.watertest.length;j++){
         //    console.log(aa[i].envStandardsId);
             if(aa[i].envStandardsId==this.watertest[j].id){
               this.threetest1[aa[i].envStandardsId]=aa[i].value;
             }
           }
         }
         if(aa[i].itemName.value==2){
           for(let k=0;k<this.airtest.length;k++){
          //   console.log(aa[i].envStandardsId);
             if(aa[i].envStandardsId==this.airtest[k].id){
               this.threetest2[aa[i].envStandardsId]=aa[i].value;
             }
           }
         }
         if(aa[i].itemName.value==3){
           for(let l=0;l<this.soiltest.length;l++){
          //   console.log(aa[i].envStandardsId);
             if(aa[i].envStandardsId==this.soiltest[l].id){
               this.threetest3[aa[i].envStandardsId]=aa[i].value;
             }
           }
         }
         if(aa[i].itemName.value==4){
           for(let p=0;p<this.nctest.length;p++){
          //   console.log(aa[i].envStandardsId);
             if(aa[i].envStandardsId==this.nctest[p].id){
               this.threetest4[aa[i].envStandardsId]=aa[i].value;
             }
           }
         }
       }
          let a={};
        a.log=record.longitude;
        a.lat=record.latitude;
        this.mappoint(a);

        }
      },
      edit(record){
       this.activeKey = '1';
       this.reload(record);
       this.visible=true;
       this.title='编辑';

       let that = this;
        window.addEventListener('done1', function(){
          AMap.plugin(['AMap.Autocomplete','AMap.PlaceSearch'],function(){
          var autoOptions = {
            // 城市，默认全国
            city: record.areaCode,
            // 使用联想输入的input的id
            input: "input2",
            citylimit:true
          }
          var autocomplete= new AMap.Autocomplete(autoOptions)

          var placeSearch = new AMap.PlaceSearch({
            city:record.areaCode,
            map:that.map
          })
          AMap.event.addListener(autocomplete, 'select', function(e){
            //TODO 针对选中的poi实现自己的功能
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
                 if(values[key]||values[key]==0){
                  a.value=values[key];
                  baseTestingVoList.push(a);
                 }
               });

          })
          this.form2.validateFields((err, values) => {
                Object.keys(values).forEach(function(key){
                 let a={};
                 a.envStandardsId=Number(key);
                 if(values[key]||values[key]==0){
                  a.value=values[key];
                  baseTestingVoList.push(a);
                 }
               });
          })
          this.form3.validateFields((err, values) => {
                Object.keys(values).forEach(function(key){
                 let a={};
                 a.envStandardsId=Number(key);
                 if(values[key]||values[key]==0){
                  a.value=values[key];
                  baseTestingVoList.push(a);
                 }
               });
          })
          this.form4.validateFields((err, values) => {
                Object.keys(values).forEach(function(key){
                 let a={};
                 a.envStandardsId=Number(key);
                 if(values[key]||values[key]==0){
                  a.value=values[key];
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
            formData.address=address;
            formData.baseTestingVoList=baseTestingVoList;
            formData.areaCode=this.ssxarea4;
            formData.basePic=[];
            if(this.basepic.length>0){
              for(let i=0;i<this.basepic.length;i++){
                formData.basePic.push({id:this.basepic[i]});
              }
            }else{
              formData.basePic=null;
            }

            if(this.soilpic){
              formData.soilPic={id:this.soilpic};
            }else{
              formData.soilPic=null;
            }
            if(this.ncpic){
              formData.pesticideResiduesPic={id:this.ncpic};
            }else{
              formData.pesticideResiduesPic=null;
            }
            if(this.tdpic){
              formData.sugarContentPic={id:this.tdpic};
            }else{
              formData.sugarContentPic=null;
            }
            if(this.waterpic){
              formData.waterPic={id:this.waterpic};
            }else{
              formData.waterPic=null;
            }

            if(this.airpic){
              formData.airPic={id:this.airpic};
            }else{
              formData.airPic=null;
            }
            if(this.gppic){
              formData.fruitReportPic={id:this.gppic};
            }else{
              formData.fruitReportPic=null;
            }
            if(this.gpzl.fruitColor){
              formData.fruitGrading=this.gpzl;
            }else{
              formData.fruitGrading=null;
            }
            
            formData.id=this.record.id;
            formData.sugarContents=this.sugarContents;
          //  console.log(formData);
            if(this.title=="编辑"){
             editBase(formData).then((res)=>{
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
#container1 {
  position: relative;
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
  z-index: 99;
  background:rgba(255,255,255,1);
  padding:0.5rem 0.5rem;
}
.input span{
  color:rgb(0, 0, 0);
  font-size: 14px;
  margin-right: 10px;
  vertical-align:middle;
}
#input2{
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
