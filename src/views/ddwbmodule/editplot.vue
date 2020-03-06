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
      style="min-width:1150px"
    >
      <div class="allall">
      <div class="all" style="position: relative;">
    <div style="width:40%;float:left;margin-right:10px;">
      <a-form :form="form">
        <a-form-item
          label="地块名称"
          v-bind="formItemLayout"
        >
          <a-input
            v-decorator="[
          'lotName',
          {
            initialValue:record.lotName,
            rules: [{
              required: true, message: '请输入地块名称',min:0,max:50
            }]
          }
        ]"
          />
        </a-form-item>

        <a-form-item
          label="所属农户"
          v-bind="formItemLayout"
        >
        <a-select
          showSearch
          placeholder="输入关键字查询"
          optionFilterProp="children"
          :filterOption="filterOption"
          v-decorator="[
          'userId',
          {
            initialValue:Number(record.userId),
            rules: [{
              required: true, message: '请选择农户！',
            }]
          }
        ]">
              <a-select-option v-for="(v,k) in userinfo" :value="v.uid" :key="k">{{v.realName}}({{v.phone}})</a-select-option>
            </a-select>
        </a-form-item>

        <a-form-item
          label="面积(亩)"
          v-bind="formItemLayout"
        >
          <a-input
            v-decorator="[
          'lotAcreage',
          {
            initialValue:String(record.lotAcreage),
            rules: [{
              required: true, message: '请输入面积',min:0,max:10
            }]
          }
        ]"
        style="width: 100%"
          />
        </a-form-item>
        <a-form-item
          label="海拔"
          v-bind="formItemLayout"
        >
          <a-input
            v-decorator="[
          'altitude',
          {
            initialValue:record.altitude,
            rules: [{ required: false}],
          }
        ]"
            style="width: 100%"
          >
          </a-input>
        </a-form-item>

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
        <a-button v-show="!isedit" style="margin-left:38%;margin-bottom:5%;" type="primary" @click="huadikuai">点击后重新画地块</a-button>
        <a-row :gutter="16">
          <a-col :span="6" style="text-align:right;">
            <span>选择颜色：</span>
          </a-col>
          <a-col :span="18">
              <a-radio-group  @change="onChange" v-model="value">
    <a-radio :value="1"><div style="width:20px;height:20px;background:#87ffc5;display:inline-block;"></div></a-radio>
    <a-radio :value="2"><div style="width:20px;height:20px;background:#bd60ff;display:inline-block;"></div></a-radio>
    <a-radio :value="3"><div style="width:20px;height:20px;background:#fcffa5;display:inline-block;"></div></a-radio>
    <a-radio :value="4"><div style="width:20px;height:20px;background:#ff8b56;display:inline-block;"></div></a-radio>
    <a-radio :value="5"><div style="width:20px;height:20px;background:#ff9bbb;display:inline-block;"></div></a-radio>
    <a-radio :value="6"><div style="width:20px;height:20px;background:#2c6e4a;display:inline-block;"></div></a-radio>
    <a-radio :value="7"><div style="width:20px;height:20px;background:#4d956d;display:inline-block;"></div></a-radio>
    <a-radio :value="8"><div style="width:20px;height:20px;background:#b5e9f4;display:inline-block;"></div></a-radio>
    <a-radio :value="9"><div style="width:20px;height:20px;background:#fec9b9;display:inline-block;"></div></a-radio>
    <a-radio :value="10"><div style="width:20px;height:20px;background:#d68c45;display:inline-block;"></div></a-radio>
  </a-radio-group>
          </a-col>
        </a-row>


      </a-form>
      </div>
      <div v-show="!isedit" class="input"><span>关键字搜索地点:</span><input id='input4' type="text"></div>
      <div class="ditu" style="float:left;"><div id="container2"></div></div>
       <div class="plot_but" v-if="!endedit1&&pol" @click="edit_plot">编辑地块</div>
       <div class="endeditt" v-if="endedit1" @click="endedit">结束编辑</div>
      </div>
      </div>

    </a-modal>
  </div>
</template>
<script>
  import { getAllFarm,addPlot,editPlot } from '@/api/ddwbApi'
  import MapLoader from '@/utils/loadMap.js'
  export default {
    data() {
      return {
        userinfo:[],
        isedit:false,
        addmap:null,
        visible: false,
        title:"操作",
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
        form: this.$form.createForm(this),
        polygonattr:{
        path: null,
        fillColor: '#87ffc5', // 多边形填充颜色
        borderWeight: 0, // 线条宽度，默认为 1
        strokeColor: '#87ffc5', // 线条颜色
        strokeOpacity:0,
        fillOpacity:0.4
      },
      path:[],
      pathArray:[],
      pol:null,
      loganglat:{},
      marker:null,
      remove:false,
      baseid:'',
      areacord:'',
      value:'',
      record:{},
      endedit1:false,
      polyEditor:null,
      }
    },
    created(){
      getAllFarm().then((res)=>{
         if(res.success){
          this.userinfo=res.result;
        }
      })
    },
    methods: {
      filterOption(input, option) {
        return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
      },
       onChange (e) {
      switch (e.target.value) {
        case 1:
          this.polygonattr.fillColor=	'#87ffc5';
          this.polygonattr.strokeColor='#87ffc5';
          break;
        case 2:
          this.polygonattr.fillColor=	'#bd60ff';
          this.polygonattr.strokeColor='#bd60ff';
          break;
        case 3:
          this.polygonattr.fillColor=	'#fcffa5';
          this.polygonattr.strokeColor='#fcffa5';
          break;
        case 4:
          this.polygonattr.fillColor=	'#ff8b56';
          this.polygonattr.strokeColor='#ff8b56';
          break;
        case 5:
          this.polygonattr.fillColor=	'#ff9bbb';
          this.polygonattr.strokeColor='#ff9bbb';
          break;
        case 6:
          this.polygonattr.fillColor=	'#2c6e4a';
          this.polygonattr.strokeColor='#2c6e4a';
          break;
        case 7:
          this.polygonattr.fillColor=	'#4d956d';
          this.polygonattr.strokeColor='#4d956d';
          break;
        case 8:
          this.polygonattr.fillColor=	'#b5e9f4';
          this.polygonattr.strokeColor='#b5e9f4';
          break;
        case 9:
          this.polygonattr.fillColor=	'#fec9b9';
          this.polygonattr.strokeColor='#fec9b9';
          break;
        case 10:
          this.polygonattr.fillColor=	'#d68c45';
          this.polygonattr.strokeColor='#d68c45';
          break;          
        default:
          break;
      }
      if(this.pol){
      this.pol.setMap(null);
      this.pol = new AMap.Polygon(this.polygonattr);
      this.addmap.add(this.pol);
      }
       },
       huadikuai(){
         if(this.endedit1){
           this.$message.warning("请先结束编辑！");
         }else{
         this.remove=false;
         this.path=[];
         this.pathArray=[];
         this.form.resetFields(['lotAcreage']);
         if(this.pol!=null){
           this.pol.setMap(null);
           this.pol=null;
         }
      let that = this
      that.$message.warning("请在地图上点选一个多边形并保存");
      AMap.plugin('AMap.MouseTool',function(){
        var mouseTool = new AMap.MouseTool(that.addmap);
        mouseTool.polyline({
          strokeColor:that.polygonattr.strokeColor,
        });
        var markers = [];

        that.addmap.on("click", addMarker1);

        function addMarker1(e){
          that.pathArray.push(e.lnglat);
          if(!that.remove){
            var icon1 = new AMap.Icon({
              size: new AMap.Size(20, 20),    // 图标尺寸
              image: require('../../assets/point.png'),  // Icon的图像
              imageOffset: new AMap.Pixel(0, 0),  // 图像相对展示区域的偏移量，适于雪碧图等
              imageSize: new AMap.Size(20, 20)   // 根据所设置的大小拉伸或压缩图片
            });
            var marker = new AMap.Marker({
              map: that.addmap,
              position: e.lnglat,
              icon: icon1,
              anchor:'center',
              offset: new AMap.Pixel(0,0),
            });
            markers.push(marker);
            //鼠标点击marker
            AMap.event.addListener(marker, 'click', function (e) {
              that.remove=true;
              for(let j=0;j<markers.length;j++){
                markers[j].setMap(null);
              }
              mouseTool.close(true);
              if(that.pathArray.length>1){
                for(let i=0;i<that.pathArray.length;i++){
                  let point=that.pathArray[i];
                  that.path.push(new AMap.LngLat(point.lng,point.lat));
                }
              }
              that.polygonattr.path = that.path;
              that.pol = new AMap.Polygon(that.polygonattr);
              that.addmap.add(that.pol);
              that.form.setFieldsValue({lotAcreage:Number(0.0015*AMap.GeometryUtil.ringArea(that.path)).toFixed(3)});
              let myEvent = new CustomEvent('removeMarkerListener',{});
              that.addmap.off("click",addMarker1);
            });
          }}
      });
         }
    },
     edit_plot(){
       this.isedit=true;
      let that=this;
       AMap.plugin('AMap.PolyEditor',function(){//异步加载插件
           that.polyEditor = new AMap.PolyEditor(that.addmap, that.pol);
           that.polyEditor.open();
           that.endedit1=true;
            that.polyEditor.on('end', function(event) {
            that.endedit1=false;
            that.form.setFieldsValue({lotAcreage:Number(0.0015*AMap.GeometryUtil.ringArea(that.pol.getPath())).toFixed(3)});
            that.polygonattr.path=that.pol.getPath();
              })
        });
    },
     endedit(){
      this.polyEditor.close();
      this.isedit=false;
    },
      mappoint(a){
        let b=[];
        if(!a.log||!a.lat){
          b=null;
        }else{
          b.push(a.log);
          b.push(a.lat);
        }
          let that = this
    MapLoader().then(AMap => {
       let googleLayer = new AMap.TileLayer({
              getTileUrl: 'http://mt{1,2,3,0}.google.cn/vt/lyrs=s&hl=zh-CN&gl=cn&x=[x]&y=[y]&z=[z]&s=Galile'
           });//定义谷歌卫星切片图层
        let roadNetLayer = new AMap.TileLayer.RoadNet({
          opacity:0
        }); //定义一个路网图层
      that.addmap = new AMap.Map('container2', {
         center: b,
        zoom: 15,
         layers:[googleLayer,roadNetLayer],
      });
        if(a.log&&a.lat){
      that.marker = new AMap.Marker({
         position: new AMap.LngLat(a.log,a.lat),
       });
       that.addmap.add(that.marker);
        }
        if(that.record.remark){
            let remarkJson2 = eval('(' + that.record.remark + ')');
            switch (remarkJson2.fillColor) {
              case '#87ffc5':
                that.value=1;
                break;
              case '#bd60ff':
                that.value=2;
                break;
              case '#fcffa5':
                that.value=3;
                break;
              case '#ff8b56':
                that.value=4;
                break;
              case '#ff9bbb':
                that.value=5;
                break;
              case '#2c6e4a':
                that.value=6;
                break;
              case '#4d956d':
                that.value=7;
                break;
              case '#b5e9f4':
                that.value=8;
                break;
              case '#fec9b9':
                that.value=9;
                break; 
              case '#d68c45':
                that.value=10;
                break;          
              default:
                break;
            }
            let newPath = [];

            for(let i=0;i<remarkJson2.path.length;i++){
            let point=remarkJson2.path[i];
            newPath.push(new AMap.LngLat(point.lng,point.lat));
            }
            remarkJson2.path = newPath;
            that.polygonattr=remarkJson2;
            that.pol = new AMap.Polygon(remarkJson2);
            that.addmap.add(that.pol);
            that.addmap.setFitView();
          }
        AMap.plugin(['AMap.Autocomplete','AMap.PlaceSearch'],function(){
          var autoOptions = {
            // 城市，默认全国
            city: that.areacord,
            // 使用联想输入的input的id
            input: "input4",
            citylimit:true
          }
          var autocomplete= new AMap.Autocomplete(autoOptions)

          var placeSearch = new AMap.PlaceSearch({
            city:that.areacord,
            map:that.addmap
          })
          AMap.event.addListener(autocomplete, 'select', function(e){
            //TODO 针对选中的poi实现自己的功能
            if(e.poi.address.length>0){
              placeSearch.search(e.poi.name)
            }else{
              let aa=[];
              aa.push(e.poi.location.lng);
              aa.push(e.poi.location.lat);
              that.addmap.setCenter(aa);
            }
          })
        })

    })
      },
      edit(record,id,jwd,areacord){
       this.form.resetFields();
       this.isedit=false;
       this.record=record;
       this.pol=null;
       this.baseid=id;
       this.endedit1=false;
       this.areacord=areacord;
       this.visible=true;
       this.title='新增';
       this.loganglat.log=jwd[0];
       this.loganglat.lat=jwd[1];
       this.mappoint(this.loganglat);
      },
      handleOk(){
        if(this.pol){
        const that = this;
        // 触发表单验证
        that.form.validateFields((err, values) => {
          if (!err) {
            let formData = values;
            formData.remark=JSON.stringify(this.polygonattr);
            formData.baseId=that.baseid;
            formData.id=that.record.id;
            editPlot(formData).then(res=>{
            if(res.success){
                   that.$message.success(res.message);
                   that.$parent.loadData();
                   that.hideModal();
               }else{
                   that.$message.warning(res.message);
               }
           })
            // addPlot(formData).then(res=>{
            //     if(res.success){
            //        that.$message.success(res.message);
            //        that.$parent.loadData();
            //        that.hideModal();
            //    }else{
            //        that.$message.warning(res.message);
            //    }
            // })
          }
        })
        }else{
          that.$message.warning("请先画一个地块！")
        }
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
#container2 {
  width: 620px;
  height: 450px;
}
.allall{
  height:500px;
  overflow-y: auto;
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
  width:35%;
  border-radius: 15px;
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
#input4{
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
.endeditt{
  position: absolute;
  bottom: 10%;
  right:5%;
  z-index:99;
  cursor: pointer;
  width:75px;
  height:30px;
  line-height: 30px;
  border-radius: 15px;
  padding: 0rem 0.5rem;
  font-weight: bold;
  color:rgb(10, 84, 168);
  background: rgba(255,255,255,0.6);
}
.plot_but{
  position: absolute;
  bottom: 10%;
  right:47%;
  cursor: pointer;
  z-index:99;
  width:75px;
  height:30px;
  line-height: 30px;
  border-radius: 15px;
  padding: 0rem 0.5rem;
  font-weight: bold;
  color:rgb(10, 84, 168);
  background: rgba(255,255,255,0.6);
}
.endeditt:hover,.plot_but:hover{
  color:rgb(255, 255, 255);
  background: rgba(10,84,168,0.8);}
</style>
