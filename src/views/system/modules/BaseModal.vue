<template>
  <div>
    <a-modal
      width=60%
      v-model="visible"
      :title="title"
      @ok="handleOk"
      okText="保存"
      ref="modal"
      cancelText="取消"
      :maskClosable="false"
      style="position: relative;min-width:1150px"
    >
    <div class="all">
    <div style="width:40%;float:left;margin-right:10px;">
      <a-form :form="form">
        <a-form-item
          label="基地名称"
        >
          <a-input
            v-decorator="[
          'baseName',
          {
            rules: [{
              required: true, message: '请输入基地名称',
            }]
          }
        ]"
          />
        </a-form-item>

        <a-form-item
        label="基地地址"
      >
      <a-button type="primary" @click="handleupdate" v-if="!ade">修改地址</a-button>
      <a-cascader :options="options" placeholder="请选择省/市/(县，区)" @change="onChangmap" v-if="ade"/>
       <div>
         <!-- <a-input
         @blur="start"   -->
         <a-input
        :disabled="!ade"
          placeholder="请输入具体地址"
          v-decorator="[
          'baseAddress',
          {
            rules: [{ required: true, message: '请输入具体地址' }],
          }
        ]"
          style="width: 100%"
        >
        </a-input>
        </div>
      </a-form-item>
      <div class="jwd">
       <a-form-item
          label="经度"
          style="display:inline-block;width:45%;margin-right:10%"
        >
          <a-input
          disabled
            v-decorator="[
          'log',
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
          style="display:inline-block;width:45%;"
        >
          <a-input
          disabled
            v-decorator="[
          'lat',
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
          label="面积(亩)"
        >
          <a-input
            v-decorator="[
          'baseAcreage',
        ]"
            style="width: 100%"
          >
          </a-input>
        </a-form-item>
        <a-form-item
          label="规模(棵)"
        >
          <a-input
            v-decorator="[
          'baseScale',
        ]"
            style="width: 100%"
          >
          </a-input>
        </a-form-item>
        <a-form-item
          label="简介"
        >
          <a-textarea
          :rows="4"
            v-decorator="[
          'intro',
        ]"
            style="width: 100%"
          >
          </a-textarea>
        </a-form-item>
      </a-form>
      </div>
      <div class="ditu" style="float:left;"><div id="container"></div></div>
      </div>
    </a-modal>
  </div>
</template>
<script>
  import {saveWalker,updateWalker} from '@/api/allapi'
  import { insertBase,updateBase,basenamecheck } from '@/api/allapi'
  import { getmap } from '@/api/userApi'
  import {pick} from 'lodash'
  import MapLoader from '@/utils/loadMap.js'
  import axios from 'axios'
  export default {
    name:'workerModal',
    data() {
      return {
        ade:true,
        //showmap:false,
        //butinfo:'选择经纬度',
        address:[],
        label:[],
        options: [],
        confirmDirty: false,
        treeData:[],
        visible: false,
        title:"操作",
        oldname:'',
        par:{},
        ssxarea:'',
        baseAddress:'',
        geocoder:{},
        loganglat:{},
        model:{},
        markerb:[],
        form: this.$form.createForm(this),
      }
    },
    created(){
      axios.get("/ip",{params:{key:'baaf2c20e8d1d3c6f5678f6d12c0078f'}}).then((res)=>{
        console.log(res);
        if(res.data.rectangle){
          let a=res.data.rectangle.split(';');
         // console.log(a);
          //console.log((Number(a[0].split(',')[0])+Number(a[1].split(',')[0]))/2)
          this.loganglat.log=(Number(a[0].split(',')[0])+Number(a[1].split(',')[0]))/2;
          this.loganglat.lat=(Number(a[0].split(',')[1])+Number(a[1].split(',')[1]))/2;
        }else{
          this.loganglat.log=null;
          this.loganglat.lat=null;
        }
        console.log(this.loganglat);
     });
    },
    methods: {
      handleupdate(){
        this.ade=true;
        this.options=[];
        this.loadmap();
        this.form.resetFields('baseAddress');
      },
      start(){
        this.baseAddress=this.form.getFieldsValue(['baseAddress']).baseAddress;
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
      // adechange(value){
      //   this.baseAddress=this.form.getFieldsValue(['baseAddress']).baseAddress;
      //   if(this.baseAddress==undefined){
      //   this.baseAddress=value.data;
      //   }else{
      //   this.baseAddress+=value.data;
      //   }
      //   console.log(value.data);
      // },
      onChangmap(value,selectedOptions){
        this.ssxarea='';
        //console.log(selectedOptions);
        if(selectedOptions){
        for(let i=0;i<selectedOptions.length;i++){
           this.ssxarea+=selectedOptions[i].label;
        }
        let that=this;
         AMap.plugin('AMap.Geocoder', function() {
           that.geocoder = new AMap.Geocoder({
           // city 指定进行编码查询的城市，支持传入城市名、adcode 和 citycode
          city: '100000'
          })

          // let aaa=that.ssxarea+that.form.getFieldsValue(['baseAddress']).baseAddress;
          // console.log(aaa);
           that.geocoder.getLocation(that.ssxarea, function(status, result) {
    if (status === 'complete' && result.info === 'OK') {
      // result中对应详细地理坐标信息
      console.log(result);
       var lnglat = result.geocodes[0].location
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
       console.log(lnglat);
       that.markerb[0].setPosition(lnglat);
       that.map.setFitView(that.markerb[0]);
       that.form.setFieldsValue({log:lnglat.lng,lat:lnglat.lat});
       //that.loganglat.log=lnglat.lng;
       //that.loganglat.lat=lnglat.lat;
    }else{
      this.$message.info("根据地址查询位置失败！");
    }
  })
         });
        }
        this.label=[];
        this.address=[];
        this.par={};
        for(let i=0;i<value.length;i++){
          let a=value[i].split('-');
          this.address.push(a[1]);
          this.label.push(a[0]);
        }
        if(value.length>1){
        this.par.province=this.address[0];
        this.par.provinceCode=this.label[0];
        this.par.city=this.address[1];
        this.par.cityCode=this.label[1];
        this.par.area=this.address[2];
        this.par.areaCode=this.label[2];
        }else{
          this.par.province=this.address[0];
          this.par.provinceCode=this.label[0];
        }
      },
      handleConfirmBlur  (e) {
      const value = e.target.value;
      this.confirmDirty = this.confirmDirty || !!value;
    },

      compareToFirstPassword  (rule, value, callback) {
        const form = this.form;
        if (value && value !== form.getFieldValue('walkerPassword')) {
          callback('两次密码不一样');
        } else {
          callback();
        }
      },
      validateToNextPassword  (rule, value, callback) {
        const form = this.form;
        if (value && this.confirmDirty) {
          form.validateFields(['confirm'], { force: true });
        }
        callback();
      },
      loadmap(){
  getmap().then((res)=>{
          console.log('地区列表................');
          console.log(res);
          for(let i=0;i<res.result.length;i++){
            var a={};
            a.value=res.result[i].id+'-'+res.result[i].name;
            a.label=res.result[i].name;
            a.children=[];
            if(res.result[i].children.length>0){
              for(let j=0;j<res.result[i].children.length;j++){
                var b={};
                b.value=res.result[i].children[j].id+'-'+res.result[i].children[j].name;
                b.label=res.result[i].children[j].name;
                b.children=[];
                if(res.result[i].children[j].children.length>0){
                  for(let k=0;k<res.result[i].children[j].children.length;k++){
                    var c={};
                    c.value=res.result[i].children[j].children[k].id+'-'+res.result[i].children[j].children[k].name;
                    c.label=res.result[i].children[j].children[k].name;
                    b.children.push(c);
                  }
                }
                a.children.push(b);
              }
            }
            this.options.push(a);
          }
        });
      },
      mappoint(a){
        let b=[];
        if(!a.log||!a.lat){
          b=null;
        }else{
          b.push(a.log);
          b.push(a.lat);
        }
        console.log(b);
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
         that.form.setFieldsValue({log:e.lnglat.getLng(),lat:e.lnglat.getLat()});
        };
        // 绑定事件
        that.map.on('click', clickHandler);

        var markers = [];
        AMap.event.addListener(that.map, "click", addMarker);
        function addMarker(e){
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
    })
      },
      add () {
      this.options=[];
      this.loadmap();
      this.baseAddress='';
      this.mappoint(this.loganglat);
      this.edit();
      },
      edit(record){
        console.log("baseModal edit record")
        console.log(record)
        this.form.resetFields();
        this.ade=true;
        this.visible = true;
        console.log(this.model)
        if(record!=undefined){
          let a={};
        a.log=record.log;
        a.lat=record.lat;
        this.mappoint(a);
          this.ade=false;
          this.oldname=record.baseName;
          this.model = Object.assign({}, record);
          let fieldsVal = pick(this.model,'baseName','baseAcreage','baseName','baseAddress','baseScale','intro','lat','log');
          console.log(fieldsVal);
          this.$nextTick(() => {
            this.form.setFieldsValue(fieldsVal)
          });
        };



      },
      handleOk(){
        const that = this;
        // 触发表单验证
        this.form.validateFields((err, values) => {
          if (!err) {
            that.confirmLoading = true;
            let formData = Object.assign(this.model, values);
            /*formData.log=this.log;
            formData.lat=this.lat;*/
            let a=formData.baseAddress;
            let obj;
            let b={};
            b.baseName=formData.baseName;
            console.log(formData)
            if(this.title=="新增"){
               basenamecheck(b).then((res)=>{
                if(res.success){
                   formData.baseAddress=this.address.join('')+a;
                   this.par.address=this.address.join('')+a;
                   formData.address=this.par;
                  insertBase(formData).then((res)=>{
                    if(res.success){
                      that.$message.success(res.message);
                      that.$parent.loadData();
                      that.$parent.loadbase();
                    }
                    else{
                      that.$message.warning(res.message);
                    }
                  }).finally(()=>{
                    that.confirmLoading = false;
                    that.hideModal();
                  });

                }else{
                  this.form.resetFields('baseName')
                 this.$message.info(res.message)
                }
              });
            }else if(this.title=="编辑"){
              if(that.oldname==b.baseName){
                if(this.ade){
                 formData.baseAddress=this.address.join('')+a;
                 this.par.address=this.address.join('')+a;
                 formData.address=this.par;
                }else{
                  formData.address=this.model.address;
                }
                updateBase(formData).then((res)=>{
              if(res.success){
                that.$message.success(res.message);
                that.$parent.loadData();
                that.$parent.loadbase();
              }else{
                that.$message.warning(res.message);
              }
            }).finally(() => {
              that.confirmLoading = false;
              that.hideModal();
            });
              }else if(that.oldname!=b.baseName){
                  basenamecheck(b).then((res)=>{
                if(res.success){
                  if(this.ade){
                 formData.baseAddress=this.address.join('')+a;
                 this.par.address=this.address.join('')+a;
                 formData.address=this.par;
                }else{
                  formData.address=this.model.address;
                }
                  updateBase(formData).then((res)=>{
                    if(res.success){
                      that.$message.success(res.message);
                      that.$parent.loadData();
                      that.$parent.loadbase();
                    }
                    else{
                      that.$message.warning(res.message);
                    }
                  }).finally(()=>{
                    that.confirmLoading = false;
                    that.hideModal();
                  });

                }else{
                  this.form.resetFields('baseName')
                 this.$message.info(res.message)
                }
              });
              }

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
      // latandlog(){
      //   if(this.showmap){
      //     this.showmap=false;
      //     this.butinfo='选择经纬度';
      //   }else{
      //   this.showmap=true;
      //   this.butinfo='关闭地图';
      //   }
      // },
    }
  }
</script>
<style scoped>
#container {
  width: 630px;
  height: 480px;
}
/* .ditu{
  position: absolute;
  top:13.4%;
  right:2%;
} */
.jwd{
  position: absolute;
  bottom:10%;
  right:26%;
}
.all{
  width:1150px;
}
.all::after{
  clear: both;
  content: '';
  display: block;
  width: 0;
  height: 0;
}
</style>
