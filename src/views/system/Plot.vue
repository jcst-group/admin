<template>
<div class="main" style="width:100%;height:auto;padding:16px;background:white;">
  <div class="main" style="background:white;padding:10px 0 10px 0;">

<div style="margin: 0 0 16px 10px;">
      <a-button
        @click="backToBase"
      >
        返回基地管理
      </a-button>
      <a-button
        type="primary"
        icon="plus"
        @click="addBlock"
        style="margin-left: 10px;"
      >
        添加地块
      </a-button>
</div>

    <a-modal
      :title="title"
      v-model="visible"
      @ok="handleOk"
      @cancel="cancel"
      style="top:5%;height: 90%;"
      cancelText="取消"
      :okText="okText"
    >
      <a-form
        :form="form"
      >
        <a-form-item
          label="地块名"
        >
          <a-input
            v-decorator="[
          'lotName',

          {
            initialValue:block.lotName,
            rules: [{ required: true, message: '请输入地块名' }],
          }
        ]"
          />
        </a-form-item>
         <a-form-item
          label="种植作物"
        >
                  <a-tree-select
            style="width:100%"
            :treeData="crops"
            v-decorator="[
              'cropId',
              {
                initialValue:block.crop?String(block.crop.id):null,
              }
            ]"
            placeholder="请选择作物"
          >
          </a-tree-select>
          <!-- <a-input
            v-decorator="[
          'cropId',

          {
            initialValue:block.cropId,

          }
        ]"
          /> -->
        </a-form-item>
         <a-form-item
          label="土地类型"
        >
          <a-tree-select
            style="width:100%"
            :treeData="land"
            v-decorator="[
              'landId',
              {
                initialValue:block.land?String(block.land.id):null,
              }
            ]"
            placeholder="请选择土地类型"
          >
          </a-tree-select>
        </a-form-item>
         <a-form-item
          label="土壤类型"
        >
         <a-tree-select
            style="width:100%"
            :treeData="soil"
            v-decorator="[
              'soilId',
              {
                initialValue:block.soil?String(block.soil.id):null,
              }
            ]"
            placeholder="请选择土壤类型"
          >
          </a-tree-select>
        </a-form-item>
        <a-form-item
          label="地块面积(亩)"
        >
          <a-input
            v-decorator="[
          'lotAcreage',

          {
            initialValue:Number(block.lotAcreage).toFixed(3),
            rules: [{ required: true, message: '请输入地块面积' }],
          }
        ]"
          v-show="false"
          />
          <template><span style="font-size:30px;">{{Number(block.lotAcreage).toFixed(3)}}亩</span></template>
        </a-form-item>
         <a-form-item
          label="标记颜色"
        >
         <a-radio-group @change="onChange" v-model="value">
    <a-radio :value="1"><div style="width:20px;height:20px;background:#FFF68F;display:inline-block;"></div></a-radio>
    <a-radio :value="2"><div style="width:20px;height:20px;background:#9ACD32;display:inline-block;"></div></a-radio>
    <a-radio :value="3"><div style="width:20px;height:20px;background:#4169E1;display:inline-block;"></div></a-radio>
    <a-radio :value="4"><div style="width:20px;height:20px;background:#8B1C62;display:inline-block;"></div></a-radio>
  </a-radio-group>
        </a-form-item>
      </a-form>
    </a-modal>

    <div class="father">
    <div id="container"></div>
     <div class="endcard" style="width: 75px" @click="endedit" v-if="isendedit">结束编辑</div>
    <div class="loading"><a-spin :spinning="spinning" size="large"  tip="地图正在加载中..."></a-spin></div>
    </div>

<div id="plottable">
  <a-table :columns="columns"
           :dataSource="dataSource"
           :pagination="ipagination"
           rowKey="id" >
    <span slot="action" slot-scope="text, record">
      <a  @click="handleEdit(record)">编辑</a>
      <a-divider type="vertical" />
      <a href="javascript:;" class="ant-dropdown-link">
        <a-popconfirm title='确定删除该地块?' @confirm="() => handleDelete(record.id)">
          删除
        </a-popconfirm>
      </a>
    </span>
  </a-table>
</div>
  </div>

</div>

</template>

<script>
import MapLoader from '@/utils/loadMap.js'
import {queryBase,getBlockByBaseId,deleteBlock, blockAdd, blockUpdate,queryBaseById,getCrops,landlist,soillist} from '@/api/allapi'

const columns = [{
  title: '地块名称',
  dataIndex: 'lotName',
  key:'lotName',
}, {
  title: '面积（亩）',
  dataIndex: 'lotAcreage',
  key: 'lotAcreage',
  //width: '11%',
},{
  title: '操作',
  dataIndex: 'action',
  key: 'action',
  scopedSlots: { customRender: 'action' },
  align:"center",
}];

const i = 1;

export default {
  data() {
    return {
      value:1,
      crops:[],
      land:[],
      soil:[],
      visible:false,
      title:'',
      okText:'',
      baseInfo:null,
      map: null,
      pathArray:[],
      path:[],
      polygons:[],
      currentPol:{},
      remove:false,
      center:[],
      columns,
      block:{},
      info:[],
      spinning:false,
      infoWindow:null,
      ipagination:{//分页参数
        current: 1,
        pageSize: 10,
        pageSizeOptions: ['10', '20', '30'],
        showTotal: (total, range) => {
          return " 共" + total + "条"
        }, },
      loading: false,
      userinfo:{},
      polygonattr:{
        path: null,
        fillColor: '#FFF68F', // 多边形填充颜色
        borderWeight: 2, // 线条宽度，默认为 1
        strokeColor: '#FFF68F', // 线条颜色
        strokeOpacity:0.8,
        fillOpacity:0.1
      },
      dataSource:[],
      isendedit:false,
      polyEditor:{},
      form:this.$form.createForm(this)
    }
    },
created(){
getCrops({}).then((res)=>{
          if(res.success){
            this.crops=this.getTreeData(res.result)
          }else{
            this.$message.info(res.message)
          }
          console.log(res);
        });
landlist({}).then((res)=>{
         if(res.success){
           this.land=this.getTreeData(res.result);
         }else{
           this.$message.info(res.message);
         }
});
soillist({}).then((res)=>{
         if(res.success){
           this.soil=this.getTreeData(res.result);
         }else{
           this.$message.info(res.message);
         }
});
},
  mounted () {

      //this.initMap();



      //first 获取基地ID
      console.log("这里这里.......")
      console.log(this.$route.query);
      console.log(this.getBaseId());
      let baseId = this.getBaseId();
      this.center.push(this.$route.query.log);
      this.center.push(this.$route.query.lat);
      /**
       * second
       * 1、根据ID查询基地信息
       * 2、将基地的点刷新到地图上
       *
       */
       queryBaseById({'baseId':baseId}).then((res)=>{
        if(res.success){
          console.log(res);
          this.baseInfo = res.result;
          //this.dataSource = res.result;
          //this.addBaseToMap();
          this.initMap();
        }
       });
       let that = this;
      window.addEventListener('xx', function(){
        console.log('监听者事件监听到事件完成');
        that.addBaseToMap();
        that.loadData();
        that.addGoogleMap();
      });



      /**
       * 针对地块信息的操作
       * 1、查询地块信息
       * 2、将有效的地块信息刷新到地图上
       * 3、针对地块信息的操作
       */


  },
  methods:{
    getTreeData(data){
        console.log(data)
        if(data instanceof  Array){
          let xx = [];
          for(let o in data){
            let obj = data[o]
            let item = this.getTreeData(obj);
            xx.push(item);
          }
          return xx;
        }else if(data instanceof Object){
          if(data.children!=undefined && data.children.length==0){
            let item = {};
            item.title = data.name;
            item.value = String(data.id);
            item.key = String(data.id);
            return item;
          }else{
            let item = {};
            item.title = data.name;
            item.value = String(data.id);
            item.key = String(data.id);
            item.children = this.getTreeData(data.children);
            return item;

          }
        }
      },
    endedit(){
      this.polyEditor.close();
    },
     onChange (e) {
      switch (e.target.value) {
        case 1:
          this.polygonattr.fillColor=	'#FFF68F';
          this.polygonattr.strokeColor='#FFF68F';
          break;
        case 2:
          this.polygonattr.fillColor=	'#9ACD32';
          this.polygonattr.strokeColor='#9ACD32';
          break;
        case 3:
          this.polygonattr.fillColor=	'#4169E1';
          this.polygonattr.strokeColor='#4169E1';
          break;
        case 4:
          this.polygonattr.fillColor=	'#8B1C62';
          this.polygonattr.strokeColor='#8B1C62';
          break;
        default:
          break;
      }
     console.log("颜色改变...........");
     console.log(e.target.value);
     console.log(this.polygonattr.fillColor);
     console.log(this.polygonattr.strokeColor);
    },
    addGoogleMap(){
      /*let googleMapLayer = new AMap.TileLayer({ //图层
        getTileUrl: 'http://mt0.google.cn/vt/lyrs=s&hl=zh-CN&gl=cn&x=[x]&y=[y]&z=[z]&s=Galile'
      });
      this.map.add(googleMapLayer);*/
    },
    initMap(){
      let that = this
      that.spinning=true;
      MapLoader().then(AMap => {
       /* let googleMapLayer = new AMap.TileLayer({ //图层
          getTileUrl: 'http://mt0.google.cn/vt/lyrs=s&hl=zh-CN&gl=cn&x=[x]&y=[y]&z=[z]&s=Galile'
        });
        let roadnet=new AMap.TileLayer.RoadNet({
          opacity:0
        });*/
        let googleLayer = new AMap.TileLayer({
              getTileUrl: 'http://mt{1,2,3,0}.google.cn/vt/lyrs=s&hl=zh-CN&gl=cn&x=[x]&y=[y]&z=[z]&s=Galile'
           });//定义谷歌卫星切片图层
        let roadNetLayer = new AMap.TileLayer.RoadNet({
          opacity:0
        }); //定义一个路网图层
        that.map = new AMap.Map('container', {
          center: that.center,
          zoom: 15,
          layers:[googleLayer,roadNetLayer], //设置图层
           /*layers: [
            // 卫星
            new AMap.TileLayer.Satellite(),
            // 路网
            new AMap.TileLayer.RoadNet()
        ],*/
          //viewMode:'3D',

        });
        /* var satellite = new AMap.TileLayer.Satellite({
        map:  that.map,
    });*/
        this.map.on("complete", function(){
          console.log("地图加载完成！");
          that.spinning=false;
          var myEvent = new CustomEvent('xx',{});
          if(window.dispatchEvent) {
            window.dispatchEvent(myEvent);
          } else {
            window.fireEvent(myEvent);
          }
        });
      })

    },
    handleEdit(record){
      if(this.isendedit){
        this.$message.info("请先结束正在编辑的内容！");
      }else{
        if(this.infoWindow!={}&&this.infoWindow!=null){
          //console.log(this.infoWindow);
        this.infoWindow.close();
        }
        this.block={};
        this.form.resetFields();
      if(record!=" "&&record!=undefined){
        this.block=record
        let remarkJson = eval('(' + this.block.remark + ')');
        //var polyEditor = new AMap.PolyEditor(this.map, polygon)
         switch (remarkJson.fillColor) {
        case '#FFF68F':
          this.value=1;
          this.polygonattr.fillColor=	'#FFF68F';
          this.polygonattr.strokeColor='#FFF68F';
          break;
        case '#9ACD32':
          this.value=2;
          this.polygonattr.fillColor=	'#9ACD32';
          this.polygonattr.strokeColor='#9ACD32';
          break;
        case '#4169E1':
          this.value=3;
          this.polygonattr.fillColor=	'#4169E1';
          this.polygonattr.strokeColor='#4169E1';
          break;
        case '#8B1C62':
          this.value=4;
          this.polygonattr.fillColor=	'#8B1C62';
          this.polygonattr.strokeColor='#8B1C62';
          break;
        default:
          break;
      }
        this.title="编辑地图信息";
        this.okText="确认修改";
      }
      this.$message.warning("请点击地块的点进行修改！修改后点击结束修改按钮完成修改！");
      let a=[];
      a.push(record);
      this.addBlockOnMap(a,1);
      console.log("handleEdit")
      console.log(this.block)
      //this.visible=true
      }
    },
    addBaseToMap(){
      console.log("addBaseToMap");
      console.log(this.baseInfo);
      console.log(this.map);
      if(this.baseInfo!=undefined && this.baseInfo!=null){
        this.center[0] = this.baseInfo.log;
        this.center[1] = this.baseInfo.lat;
      }
      this.map.setCenter(this.center);
       var icon = new AMap.Icon({
              size: new AMap.Size(30, 30),    // 图标尺寸
              image: require('../../assets/base.png'),  // Icon的图像
              imageOffset: new AMap.Pixel(0, 0),  // 图像相对展示区域的偏移量，适于雪碧图等
              imageSize: new AMap.Size(30, 30)   // 根据所设置的大小拉伸或压缩图片
            });
      let marker1 = new AMap.Marker({
        map: this.map,
        position: this.center,
        icon:icon,
        anchor:'center',
        offset: new AMap.Pixel(0,0),
      });

      // let infoWindow = new AMap.InfoWindow({
      //   offset: new AMap.Pixel(0,0),
      //   anchor: 'center',
      //   content:this.baseInfo.baseName,
      // });

      // //鼠标点击marker弹出自定义的信息窗体
      //  AMap.event.addListener(marker1, 'click', function () {
      //   infoWindow.open(this.map, this.center);
      // });

      //infoWindow.open(this.map,this.center)
    },
    getBaseId(){
      return this.$route.query.baseid;
    },
    getBaseInfo(){

    },
    getBlocks(){

    },
    addBlock(){
      if(this.isendedit){
        this.$message.info("请先结束正在编辑的内容！");
      }else{
      this.block={};
      let that = this
      that.$message.warning("请在地图上点选一个多边形并保存");
      AMap.plugin('AMap.MouseTool',function(){//异步加载插件
        var mouseTool = new AMap.MouseTool(that.map);
        mouseTool.polyline({
          strokeColor:that.polygonattr.strokeColor,
          //同Polyline的Option设置
        });
        var markers = [];
        console.log(that.map)
        //that.map.on("click", e=>that.addMarker(e,mouseTool));
        that.map.on("click", addMarker);
        //window.addEventListener('removeMarkerListener',()=>);
        function addMarker(e){
          that.pathArray.push(e.lnglat);
          if(!that.remove){
            var icon = new AMap.Icon({
              size: new AMap.Size(20, 20),    // 图标尺寸
              image: require('../../assets/point.png'),  // Icon的图像
              imageOffset: new AMap.Pixel(0, 0),  // 图像相对展示区域的偏移量，适于雪碧图等
              imageSize: new AMap.Size(20, 20)   // 根据所设置的大小拉伸或压缩图片
            });
            var marker = new AMap.Marker({
              map: that.map,
              position: e.lnglat,
              icon: icon,
              anchor:'center',
              offset: new AMap.Pixel(0,0),
            });
            markers.push(marker);
            //鼠标点击marker
            AMap.event.addListener(marker, 'click', function (e) {
              //mouseTool.polyline.end()
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
              console.log("path");
              console.log(that.path);
              let polygon = new AMap.Polygon(that.polygonattr);
              that.currentPol = polygon;
              //console.log("看这里...............");
              //console.log(polygon);

              that.map.add(polygon);
              that.polygons.push(polygon);
              //that.block.lotName='';
              that.block.lotAcreage =Number(0.0015*AMap.GeometryUtil.ringArea(that.path)).toFixed(3);//1平方米=0.0015亩
              that.visible = true;
              let myEvent = new CustomEvent('removeMarkerListener',{});
              that.map.off("click",addMarker);

              //that.unsetMap();
            });
          }}
      });
      }
    },

    addBlockOnMap(a,b){
      let that=this;
      console.log("addBlockOnMap");
      if(this.polygons.length>0){
       for(let j=0;j<this.polygons.length;j++){
          this.polygons[j].setMap(null);
        }
      }
      this.polygons=[];
        //infoWindow.open(this.map, this.center);
      for(let i=0;i<a.length;i++){
        let item = a[i];
        if(item.remark!=undefined && item.remark!=null && item.remark.trim()!=""){
          let remarkJson2 = eval('(' + item.remark + ')');
          //let polygon = new AMap.Polygon(remarkJson2);
         // console.log(remarkJson2.path);
          let newPath = [];
          for(let i=0;i<remarkJson2.path.length;i++){
            let point=remarkJson2.path[i];
            newPath.push(new AMap.LngLat(point.lng,point.lat));
          }
          remarkJson2.path = newPath;
          let polygon2 = new AMap.Polygon(remarkJson2);
          this.polygons.push(polygon2);
          this.map.add(polygon2);
          if(b==1){
          let that=this;
          // var polyEditor = new AMap.PolyEditor(map, polygon)
          AMap.plugin('AMap.PolyEditor',function(){//异步加载插件
           that.polyEditor = new AMap.PolyEditor(that.map, polygon2);
           that.polyEditor.open();
           that.isendedit=true;
           console.log(that.isendedit);
            that.polyEditor.on('end', function(event) {
            console.log(polygon2.getPath());
            that.isendedit=false;
            that.block.lotAcreage =  Number(0.0015*AMap.GeometryUtil.ringArea(polygon2.getPath())).toFixed(3);
            that.polygonattr.path=polygon2.getPath();
            that.visible=true
        // event.target 即为编辑后的多边形对象
              })
        });
        }
        }
      }
      that.map.setFitView();
        console.log(this.baseInfo);
        for(let i=0;i<that.polygons.length;i++){
        that.polygons[i].on("click",function(e) {that.infowindow(e,i);});
        }
    },
    infowindow(e,i){
      console.log(i);
      //console.log(info);
      this.info=[];
      this.getinfo(i);
          this.infoWindow = new AMap.InfoWindow({
          content: this.info.join(""),
          });
            this.infoWindow.open(this.map,[e.lnglat.lng,e.lnglat.lat]);

    },
    getinfo(i){
        let a=this.baseInfo.farmer.length?this.baseInfo.farmer[0].fname:'未绑定农户';
        let b=this.dataSource[i].crop?this.dataSource[i].crop.cropName:'暂无作物';
        let c=this.dataSource[i].land?this.dataSource[i].land.landName:'暂无';
        let d=this.dataSource[i].soil?this.dataSource[i].soil.soilName:'暂无';
        this.info = [];
        // this.info.push("<div style=\"width:175px;margin:20px 25px;\"><div><span style=\"color:#fff;line-height:20px;\">所属基地："+this.baseInfo.baseName+"</span></div> ");
        // this.info.push("<div><span style=\"color:#fff;line-height:20px;\">基地地址："+this.baseInfo.baseAddress+"</span></div>");
        // this.info.push("<div><span style=\"color:#fff;line-height:20px;\">所属农户："+a+"</span></div>");
        // this.info.push("<div><span style=\"color:#fff;line-height:20px;\">地块名称："+this.dataSource[i].lotName+"</span></div>");
        // this.info.push("<div><span style=\"color:#fff;line-height:20px;\">地块面积："+this.dataSource[i].lotAcreage+"亩</span></div>");
        // this.info.push("<div><span style=\"color:#fff;line-height:20px;\">地块作物："+b+"</span></div>");
        // this.info.push("<div><span style=\"color:#fff;line-height:20px;\">土地类型："+c+"</span></div>");
        // this.info.push("<div><span style=\"color:#fff;line-height:20px;\">土壤类型："+d+"</span></div>");
        // this.info.push("</div>")
        this.info.push("<div style=\"width:175px;margin:20px 25px;\"><table>");
        this.info.push("<tr style=\"color:#fff;line-height:20px;\"><td style=\"width:80px;\">所属基地：</td><td>"+this.baseInfo.baseName+"</td></tr>");
        this.info.push("<tr style=\"color:#fff;line-height:20px;\"><td style=\"width:80px;\">基地地址：</td><td>"+this.baseInfo.baseAddress+"</td></tr>");
        this.info.push("<tr style=\"color:#fff;line-height:20px;\"><td style=\"width:80px;\">所属农户：</td><td>"+a+"</td></tr>");
        this.info.push("<tr style=\"color:#fff;line-height:20px;\"><td style=\"width:80px;\">地块名称：</td><td>"+this.dataSource[i].lotName+"</td></tr>");
        this.info.push("<tr style=\"color:#fff;line-height:20px;\"><td style=\"width:80px;\">地块面积：</td><td>"+this.dataSource[i].lotAcreage+"亩</td></tr>");
        this.info.push("<tr style=\"color:#fff;line-height:20px;\"><td style=\"width:80px;\">地块作物：</td><td>"+b+"</td></tr>");
        this.info.push("<tr style=\"color:#fff;line-height:20px;\"><td style=\"width:80px;\">土地类型：</td><td>"+c+"</td></tr>");
        this.info.push("<tr style=\"color:#fff;line-height:20px;\"><td style=\"width:80px;\">土壤类型：</td><td>"+d+"</td></tr>");
        this.info.push("</table></div>")

    },
    handleOk(){
      let that = this;
      that.form.validateFields((err, values) => {
        if (!err) {
          let obj;
          that.confirmLoading = true;
          if(!that.block.id){
            that.block.remark = JSON.stringify(that.polygonattr);
            that.block.baseId = that.getBaseId();
            let formData = Object.assign(that.block, values);
            console.log(formData)
            obj=blockAdd(formData);
          }else{
            let remarkJson = eval('(' + that.block.remark + ')');
            remarkJson.fillColor=that.polygonattr.fillColor;
            remarkJson.strokeColor=that.polygonattr.strokeColor;
            remarkJson.path=that.polygonattr.path;
            that.block.remark = JSON.stringify(remarkJson);
            let formData = Object.assign(that.block, values);
            obj=blockUpdate(formData);
          }
          obj.then((res)=>{
            if(res.success){
              that.$message.success(res.message);
              that.$emit('ok');
              that.form.resetFields();
              that.value=1;
            }else{
              that.$message.warning(res.message);
            }
          }).finally(() => {
            that.confirmLoading = false;
            that.hideModal();
            that.loadData();
            that.unsetMap();
            that.addBlockOnMap(that.dataSource);
          })
        }
      })
    },
    unsetMap(){
      console.log("unsetMap");
      this.remove = false;
      this.path = [];
      this.pathArray = [];
      this.map.off('click', this.addMarker);
    },
    cancel(){
      this.unsetMap();
      this.map.remove(this.currentPol);
      this.addBlockOnMap(this.dataSource);
    },
    hideModal(){
      this.value=1;
      this.polygonattr.fillColor=	'#FFF68F';
      this.polygonattr.strokeColor='#FFF68F';
      this.visible = false;
    },
    getQueryParams(){
      let param = {};
      param.baseId = this.getBaseId();
      return param;
    },
    handleDelete(fid){
      if(this.isendedit){
        this.$message.info("请先结束正在编辑的内容！");
      }else{
      deleteBlock({id:fid}).then((res)=>{
        if(res.success){
          this.$message.success(res.message);
          this.isendedit=false;
          this.initMap();
        }else{
          this.$message.warning(res.message);
        }
      });
      }
    },
    loadData(arg){
      console.log("loadData");

      let params = this.getQueryParams();//查询条件
      getBlockByBaseId(params).then((res)=>{
        if(res.success){
          this.dataSource = res.result;
          let a=this.dataSource;
          this.addBlockOnMap(a);
        }
      })
    },
    backToBasebackToBase(){
       console.log("backToBase");
      this.$router.push('/base')
    },



}
}
</script>
<style scoped>
.select::after,.main::after{
  clear:both;
  content:'';
  display:block;
  width:0;
  height:0;
}
#container {
  float: left;
  width: 65%;
  height: 640px;
  margin-left: 1%;
}
#plottable{
  float: left;
  width: 32%;
  height: 100px;
  margin-left: 1%;
  margin-right: 1%;
}
.father{
  position: relative;
}
.endcard {
    display: block;
    min-width: 4rem;
    word-wrap: break-word;
    background-color: #fff;
    background-clip: border-box;
    border-radius: .25rem;
    width: 4rem;
    border-width: 0;
    border-radius: 0.4rem;
    box-shadow: 0 2px 6px 0 rgba(114, 124, 245, .5);
    position: absolute;
    bottom: -39rem;
    right: 35%;
    z-index: 9999;
    padding: 0.5rem 0.5rem;
}
.endcard:hover{
  color: #fff;
  background-color: #25A5F7;
}
.loading{
  position: absolute;
  right:65%;
  bottom: -20rem;
}
#container >>> .amap-info-content {
background-color:rgba(35, 35, 35, 0.6);
 border-radius:10px 10px;
box-shadow: rgba(255, 255, 255, 0.5) 0px 0px 10px;
}
#container >>> .amap-info-sharp{
border-top: 8px solid rgba(35, 35, 35, 0.6);
}
</style>
