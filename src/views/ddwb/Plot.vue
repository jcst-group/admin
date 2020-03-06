<template>
  <div>
    <a-row :gutter="16">
      <a-col :span="14">
        <div style="margin-bottom:10px;">
           <a-button class="but" @click="backToBase">返回基地管理</a-button>
        </div>
        <div class="fater">
            <div v-show="!isadd" class="input"><span>关键字搜索地点:</span><input id='input3' type="text"></div>
            <div id="container"><div class="point" @click="backpoint">回到标记点</div></div>
            <div class="loading"><a-spin :spinning="spinning" size="large"  tip="地图正在加载中..."></a-spin></div>
            <div class="addbut">
              <a-button v-show="!isadd" icon="plus" @click="addplot1">添加地块</a-button>
            </div>  
        </div>
      </a-col>
       <a-col :span="10">
        <!-- <div class="addbut">
          <a-button  type="primary" icon="plus" @click="addplot">添加地块</a-button>
        </div> -->
        <div style="width:100%;height:40px;"></div>
        <div class="table_a">
        <a-table
         :columns="columns"
         :rowKey="record=>record.id"
         :dataSource="plotdata"
         :pagination="ipagination"
         :scroll="{y: 700 }"
         :loading="loading"
         @change="handleTableChange"
         bordered
        >
        <a-popover slot="survey" slot-scope="text,record">
          <template slot="content">
            <p style="width:300px;">{{record.survey}}</p>
          </template>
          <span>{{f(text)}}</span>
        </a-popover>
         <span slot="editdel" slot-scope="text,record">
            <a-dropdown>
              <a class="ant-dropdown-link">
                操作 <a-icon type="down" />
              </a>
              <a-menu slot="overlay">
                <a-menu-item >
                  <a href="javascript:;" @click="edit(record)" style="white-space：nowrap">编辑</a>
                </a-menu-item >
                <a-menu-item >
                  <a href="javascript:;" @click="editCrop(record)" style="white-space：nowrap">作物规模管理</a>
                </a-menu-item >
                <a-menu-item >
                  <a href="javascript:;" @click="addpic(record)" style="white-space：nowrap">图片管理</a>
                </a-menu-item >
                <a-menu-item >
                  <a href="javascript:;" class="ant-dropdown-link">
                    <a-popconfirm title='确定删除该地块?' @confirm="() => del(record.id)" style="white-space：nowrap">
                      删除
                    </a-popconfirm>
                  </a>
              </a-menu-item>
              </a-menu>
          </a-dropdown>
           
         </span>
        </a-table>
        </div>
      </a-col>
    </a-row>
    <a-modal
        title="新增图片"
        v-model="vispic"
        :footer="null"
        :maskClosable="false"
        style="min-width:800px"
    >
    <div>地块图片：</div>
    <div style="height:100px;margin:20px 0 20px 0;">
        <a-upload
            name="file"
            action="/api2/pictureInfo/addLotPic"
            listType="picture-card"
            :fileList="hpfileList"
            @preview="hphandlePreview"
            :headers="headers"
            :data="picdata"
            :beforeUpload="beforeUpload"
            @change="hphandleChange"
            :remove="hpremovepic"
        >
            <div v-if="hpfileList.length < 6">
                <a-icon type="plus" />
                <div class="ant-upload-text">Upload</div>
            </div>
        </a-upload>
        <a-modal :visible="hppreviewVisible" :footer="null" @cancel="hphandleCancel">
            <img alt="example" style="width: 100%" :src="hppreviewImage" />
        </a-modal>
    </div>
    </a-modal>
    <addPlott ref="addplot"></addPlott>
    <editPlott ref="editplot"></editPlott>
    <editCropModal ref="editCropModal"></editCropModal>
  </div>
</template>
<script>
import Vue from 'vue'
import { ACCESS_TOKEN } from "@/store/mutation-types"
import {getPlotList,delPlot,addPlot,editPlot,getBaseListbyid,delPic} from '@/api/ddwbApi'
import MapLoader from '@/utils/loadMap.js'
import addPlott from '@/views/ddwbmodule/addplot'
import editPlott from '@/views/ddwbmodule/editplot'
import editCropModal from '@/views/ddwbmodule/editCropModal'

const columns = [
  {
    title: '地块名称',
    dataIndex: 'lotName',
    key: 'lotName',
    width:'25%',
    align: 'center',
  }, {
    title: '地块面积(亩)',
    dataIndex: 'lotAcreage',
    key: 'lotAcreage',
    width:'25%',
    align: 'center',
  },
  {
    title: '所属农户',
    dataIndex: 'user.realName',
    key: 'user.realName',
    width:'20%',
    align: 'center',
  },
  {
    title: '编辑',
    dataIndex: 'editdel',
    key: 'editdel',
    scopedSlots: { customRender: 'editdel' },
    width:'30%',
    align: 'center',
  }];

export default {
  components:{
    addPlott,
    editPlott,
    editCropModal
  },
  data(){
    return{
      vispic:false,
      hpfileList:[],
      headers:'',
      hppreviewVisible:false,
      hppreviewImage:'',
      picdata:'',
      //地块表格展示所需参数
      columns,
      plotdata:[],
      loading:false,
      isadd:false,
      ipagination: {
            current: 1,
            pageSize: 10,
            pageSizeOptions: ['10', '20', '50'],
            showTotal: (total, range) => {
             return range[0] + '-' + range[1] + '共' + total + '条';
            },
            showQuickJumper: true,
            showSizeChanger: true,
            total: 0
      },
      spinning:false,
      par:{},
      map:null,
      polygons:[],
      basemarker:null,
      //获取基地id与经纬度
      baseid:'',
      jwd:[],
      areacord:'',
      mapok:false,
      infoWindow:null,
      remove:false,
      path:[],
      pathArray:[],
      polygonattr:{
        path: null,
        fillColor: '#87ffc5', // 多边形填充颜色
        borderWeight: 0, // 线条宽度，默认为 1
        strokeColor: '#87ffc5', // 线条颜色
        strokeOpacity:0,
        fillOpacity:0.4
      },
      pol:null,
    }
  },
  watch:{
    plotdata:function(){
      if(this.mapok){
      this.addBlockOnMap(this.plotdata);
      }
    }
  },
  created(){
    const token = Vue.ls.get(ACCESS_TOKEN);
    this.headers = {"X-Access-Token":token};
    this.mapok=false;
    this.getbaseid();
    this.getbaselist();
    this.loadData();
    this.initMap();
  },
  mounted() {
    let that = this;
    window.addEventListener('mapload_done', function(){
      that.addBaseToMap();
      that.addBlockOnMap(that.plotdata);
      AMap.plugin(['AMap.Autocomplete','AMap.PlaceSearch'],function(){
          var autoOptions = {
            // 城市，默认全国
            city: '全国',
            // 使用联想输入的input的id
            input: "input3",
            citylimit:true
          }
          var autocomplete= new AMap.Autocomplete(autoOptions)

          var placeSearch = new AMap.PlaceSearch({
            city:'全国',
            map:that.map
          })
          AMap.event.addListener(autocomplete, 'select', function(e){
            //TODO 针对选中的poi实现自己的功能
           // console.log(e.poi);
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
  methods:{
    editCrop(record) {
      this.$refs.editCropModal.open(record)
    },
    backToBase(){
      this.$router.push('/baseInfo');
    },
    hphandlePreview (file) {
        this.hppreviewImage = file.url || file.thumbUrl
        this.hppreviewVisible = true
    },
    beforeUpload (file) {
        const isLt10M = file.size / 1024 / 1024 < 10
        if (!isLt10M) {
        this.$message.error('图片大小不能大于10M')
        }
        return isLt10M
    },
    hphandleChange (info) {
     // console.log(info);
        if(info.file.status === 'uploading'){
            this.hpfileList=info.fileList;
            return
        }
        if (info.file.status === 'done') {
            this.loadData();
        }
    },
    hpremovepic(file){
        let id='';
        let id1=file.uid;
        if(file.hasOwnProperty('response')){
            id=file.response.result.id;
        }else{
            id=file.uid;
        }
        delPic({id:id}).then(res=>{
            if(res.success){
              let index='';
              let newlist=this.hpfileList;
              this.hpfileList=[];
              for(let i=0; i<newlist.length;i++){
                if(newlist[i].uid!=id1){
                  this.hpfileList.push(newlist[i]);
                }
              }
              this.$message.success(res.message);
              this.loadData();
            }
        })
        return true;
    },
    hphandleCancel () {
      this.hppreviewVisible = false;
    },
    addpic(record){
      this.hpfileList=[];
      this.picdata={recordId:record.id};
      for(let i=0;i<record.pictureInfoList.length;i++){
        let pic=record.pictureInfoList[i];
        let url='/api2/pictureInfo/show/'+pic.pictureUrl
        let a={
            uid: pic.id,
            name: pic.pictureUrl,
            status: 'done',
            url: url,
        };
        this.hpfileList.push(a);
      }
      this.vispic=true;
    },
     backpoint(){
      if(this.basemarker){
        this.map.setFitView([ this.basemarker ]);
      }
    },
    getbaselist(){
      getBaseListbyid({id:this.baseid}).then(res=>{
        if(res.success){
         // console.log(res);
          this.baseinfo=res.result;
        }
      })
    },
    getbaseid(){
     this.baseid=this.$route.query.baseid;
     this.par={};
     this.par.baseId=this.baseid;
     this.areacord=this.$route.query.areacord;
     this.jwd=[];
     this.jwd.push(this.$route.query.log);
     this.jwd.push(this.$route.query.lat);
    },

    addBaseToMap(){
        var icon = new AMap.Icon({
          size: new AMap.Size(30, 30),
          image: require('../../assets/base.png'),
          imageOffset: new AMap.Pixel(0, 0),
          imageSize: new AMap.Size(30, 30)
        });
        this.basemarker=null;
        this.basemarker = new AMap.Marker({
          map: this.map,
          position: this.jwd,
          icon:icon,
          anchor:'center',
          offset: new AMap.Pixel(0,0),
        });
        this.map.setFitView([ this.basemarker ]);
        let that=this;
        that.basemarker.on("click",function(e) {that.infowindow1(e);});
    },
    addplot1(){
      // this.$refs.addplot.add(this.baseid,this.jwd,this.areacord);
      this.isadd=true;
      this.huadikuai();
    },
huadikuai(){
  if(this.pol!=null){
         this.pol.setMap(null);
         this.pol=null;
       }
        this.remove=false;
        this.path=[];
        this.pathArray=[];
        let that = this
        that.$message.warning("请在地图上点选一个多边形并保存");
        AMap.plugin('AMap.MouseTool',function(){
          var mouseTool = new AMap.MouseTool(that.map);
          mouseTool.polyline({
            strokeColor:'#87ffc5',
          });
          var markers = [];
          that.map.on("click", addMarker1);
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
                map: that.map,
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
                that.map.add(that.pol);
                that.$refs.addplot.add(that.baseid,that.path,Number(0.0015*AMap.GeometryUtil.ringArea(that.path)).toFixed(3));
                //that.form.setFieldsValue({lotAcreage:Number(0.0015*AMap.GeometryUtil.ringArea(that.path)).toFixed(3)});
                let myEvent = new CustomEvent('removeMarkerListener',{});
                that.map.off("click",addMarker1);
              });
            }}
        });
      },
      delpol(){
        this.pol.setMap(null);
        this.pol=null;
        this.polygonattr.path=null;
      },
     addBlockOnMap(remarks){
       if(this.polygons.length>0){
         for(let i=0;i<this.polygons.length;i++){
          this.polygons[i].setMap(null);
         }
       }
       if(this.pol!=null){
         this.pol.setMap(null);
       }
        this.polygons=[];
        for(let i=0;i<remarks.length;i++){
            let remark=remarks[i].remark;
            if(remark!=undefined && remark!=null && remark.trim()!=""){
                let remarkJson2 = eval('(' + remark + ')');
                let newPath = [];
                for(let i=0;i<remarkJson2.path.length;i++){
                  let point=remarkJson2.path[i];
                  newPath.push(new AMap.LngLat(point.lng,point.lat));
                }
                remarkJson2.path = newPath;
                let polygon2 = new AMap.Polygon(remarkJson2);
                this.polygons.push(polygon2);
                this.map.add(polygon2);
                this.map.setFitView();
            }
        }
        let that=this;
         for(let i=0;i<that.polygons.length;i++){
        that.polygons[i].on("click",function(e) {that.infowindow(e,i);});
        }
    },
    infowindow(e,i){
      this.info=[];
      this.getinfo(i);
          this.infoWindow = new AMap.InfoWindow({
          content: this.info.join(""),
          });
            this.infoWindow.open(this.map,[e.lnglat.lng,e.lnglat.lat]);

    },
    infowindow1(e){
          let info=[];
          info.push("<div style=\"width:175px;margin:20px 25px;\"><table>");
          info.push("<tr style=\"color:#fff;line-height:20px;\"><td style=\"width:80px;\">所属基地：</td><td>"+this.baseinfo.baseName+"</td></tr>");
          info.push("<tr style=\"color:#fff;line-height:20px;\"><td style=\"width:80px;\">基地地址：</td><td>"+this.baseinfo.address.province+this.baseinfo.address.city+this.baseinfo.address.area+this.baseinfo.address.street+"</td></tr>");
          info.push("</table></div>")
          this.infoWindow = new AMap.InfoWindow({
          content: info.join(""),
          });
            this.infoWindow.open(this.map,[e.lnglat.lng,e.lnglat.lat]);
    },
    getinfo(i){
        this.info = [];
        let soiltype=this.baseinfo.soilType!=null?this.baseinfo.soilType.displayName:'暂无'
        this.info.push("<div style=\"width:175px;margin:20px 25px;\"><table>");
        this.info.push("<tr style=\"color:#fff;line-height:20px;\"><td style=\"width:80px;\">所属基地：</td><td>"+this.baseinfo.baseName+"</td></tr>");
        this.info.push("<tr style=\"color:#fff;line-height:20px;\"><td style=\"width:80px;\">基地地址：</td><td>"+this.baseinfo.address.province+this.baseinfo.address.city+this.baseinfo.address.area+this.baseinfo.address.street+"</td></tr>");
        this.info.push("<tr style=\"color:#fff;line-height:20px;\"><td style=\"width:80px;\">所属农户：</td><td>"+this.plotdata[i].user.realName+"</td></tr>");
        this.info.push("<tr style=\"color:#fff;line-height:20px;\"><td style=\"width:80px;\">地块名称：</td><td>"+this.plotdata[i].lotName+"</td></tr>");
        this.info.push("<tr style=\"color:#fff;line-height:20px;\"><td style=\"width:80px;\">地块面积：</td><td>"+this.plotdata[i].lotAcreage+"亩</td></tr>");
        this.info.push("<tr style=\"color:#fff;line-height:20px;\"><td style=\"width:80px;\">土壤类型：</td><td>"+soiltype+"</td></tr>");
        this.info.push("</table></div>")

    },

     initMap(){
      let that = this
      that.spinning=true;
      MapLoader().then(AMap => {
        let googleLayer = new AMap.TileLayer({
              getTileUrl: 'http://mt{1,2,3,0}.google.cn/vt/lyrs=s&hl=zh-CN&gl=cn&x=[x]&y=[y]&z=[z]&s=Galile'
           });
        let roadNetLayer = new AMap.TileLayer.RoadNet({
          opacity:0
        });
        that.map = new AMap.Map('container', {
          zoom: 15,
          layers:[googleLayer,roadNetLayer],
        });
        this.map.on("complete", function(){
          that.mapok=true;
          that.spinning=false;
          var myEvent = new CustomEvent('mapload_done',{});
          if(window.dispatchEvent) {
            window.dispatchEvent(myEvent);
          } else {
            window.fireEvent(myEvent);
          }
        });
      })

    },
    handleTableChange(pagination) {
        this.ipagination = pagination;
        this.loadData();
      },
      getQueryParams() {
        let param = Object.assign({}, this.par);
        //let param = {};
        param.pageNo = this.ipagination.current;
        param.pageSize = this.ipagination.pageSize;
        return param;
      },
      loadData() {
        this.loading=true;
        let params = this.getQueryParams();//查询条件
        getPlotList(params)
          .then((res) => {
            if (res.success) {
              this.plotdata = res.result.list;
              this.ipagination.total = res.result.total;
              this.loading=false;
            }
          });
      },
    
    edit(record){
      this.$refs.editplot.edit(record,this.baseid,this.jwd,this.areacord);
    },
    del(id){
      delPlot({id:id}).then(res=>{
        if(res.success){
          this.$message.success("删除地块成功！");
          this.loadData();
        }else{
          this.$message.warning(res.message);
        }
      })
    },
  },
}
</script>
<style scoped>
.table_a >>> .ant-table-body::-webkit-scrollbar{
  width: 18px;
  height: 0px;
}
#container{
  width:100%;
  height: 800px;
}

.fater{
  width: 100%;
  height: 100%;
  position: relative;
}
.addbut{
  width:100%;
  height:50px;
  line-height: 50px;
  padding: 0 5px;
  background-color:rgba(35, 35, 35, 0.6);
  box-shadow: rgba(255, 255, 255, 0.5) 0px 0px 10px;
  position: absolute; 
  top:0;
}
.loading{
  position: absolute;
  left:49%;
  top:49%;
}
#container >>> .amap-info-content {
background-color:rgba(35, 35, 35, 0.6);
 border-radius:10px 10px;
box-shadow: rgba(255, 255, 255, 0.5) 0px 0px 10px;
}
#container >>> .amap-info-sharp{
border-top: 8px solid rgba(35, 35, 35, 0.6);
}
.point{
  position: absolute;
  bottom: 5%;
  right:5%;
  width:80px;
  height:30px;
  cursor: pointer;
  line-height: 30px;
  font-weight: bold;
  color:rgb(10, 84, 168);
  background: rgba(255,255,255,0.6);
  z-index: 99;
  padding: 0rem 0.5rem;
  border-radius: 15px;
}
.point:hover{
  color:rgb(255, 255, 255);
  background: rgba(10,84,168,0.8);
}
.input{
  position: absolute;
  border-radius: 15px;
  width:40%;
  top:7%;
  left:30%;
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
#input3{
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
