<template>
  <div>
     <a-modal
      title="地块管理"
      v-model="visible"
      @ok="handleOk"
      style="top:5%;height: 90%;"
      cancelText="取消"
      okText="确认"
      width="850px"
      :maskClosable="false"
    >
     <div id="container"></div>
     <div class="input-card">
    <h4>下属行政区查询</h4>
    <div class="input-item">
        <div class="input-item-prepend"><span class="input-item-text" >省市区</span></div>
        <select id='province' style="width:100px" onchange='search(this)'></select>
    </div>
    <div class="input-item">
        <div class="input-item-prepend"><span class="input-item-text" >地级市</span></div>
        <select id='city' style="width:100px" onchange='search(this)'></select>
    </div>
    <div class="input-item">
        <div class="input-item-prepend"><span class="input-item-text" >区县</span></div>
        <select id='district' style="width:100px" onchange='search(this)'></select>
    </div>
    <div class="input-item">
        <div class="input-item-prepend"><span class="input-item-text" >街道</span></div>
        <select id='street' style="width:100px" onchange='setCenter(this)'></select>
    </div>
</div>
    </a-modal>
  </div>
</template>
<script>
import MapLoader from '@/utils/loadMap.js'
export default {
  data () {
    return {
      map: null,
      visible:false,
      pathArray:[],
      path:[],
      remove:false,
      center:[]
    }
  },
  mounted () {
     /*MapLoader().then(AMap => {
        that.map = new AMap.Map('container', {
            center: [116.397428, 39.90923],
            zoom: 20,
        });
        var clickHandler = function(e) {
            alert('您在[ '+e.lnglat.getLng()+','+e.lnglat.getLat()+' ]的位置点击了地图！');
        };
        // 绑定事件
        that.map.on('click', clickHandler);
        })*/
  },
  methods: {
    add(){
        this.visible=true;
       
    },
    edit(record){
             this.pathArray=[];
             this.path=[];
             this.remove=false;
          this.visible=true;
       this.center.push(record.log);
       this.center.push(record.lat);
           let that = this
    MapLoader().then(AMap => {
      that.map = new AMap.Map('container', {
         center: [116.397428, 39.90923],
        zoom: 20,
        //viewMode:'3D'
        //mapStyle: 'amap://styles/dark',
      });
      var clickHandler = function(e) {
  alert('您在[ '+e.lnglat.getLng()+','+e.lnglat.getLat()+' ]的位置点击了地图！');
};

// 绑定事件
that.map.on('click', clickHandler);
 var markers = [];
             AMap.event.addListener(that.map, "click", addMarker);
              function addMarker(e){
              that.pathArray.push(e.lnglat);
              if(!that.remove){
              var marker = new AMap.Marker({
                  map: that.map,
                  position: e.lnglat,
              });
              markers.push(marker);
              }
              }

    /* var pathArray=[];
      var path=[];
      var remove=false;*/
     /* AMap.plugin('AMap.MouseTool',function(){//异步加载插件
        var mouseTool = new AMap.MouseTool(that.map);
         mouseTool.polyline({
              strokeColor:'#A0522D'
              //同Polyline的Option设置
            });
            var markers = [];
             AMap.event.addListener(that.map, "click", addMarker);
              function addMarker(e){
              that.pathArray.push(e.lnglat);
              if(!that.remove){
              var marker = new AMap.Marker({
                  map: that.map,
                  position: e.lnglat,
              });
              markers.push(marker);

            //鼠标点击marker
            AMap.event.addListener(marker, 'click', function (e) {
           //mouseTool.polyline.end()
            that.remove=true;
           for(var j=0;j<markers.length;j++){
              markers[j].setMap(null);
           }

           mouseTool.close(true);
           if(that.pathArray.length>1){
             for(var i=0;i<that.pathArray.length;i++){
                let point=that.pathArray[i];
                that.path.push(new AMap.LngLat(point.lng,point.lat));
              }
           }
              var polygon = new AMap.Polygon({
                  path: that.path,
                  fillColor: '#BCEE68', // 多边形填充颜色
                  borderWeight: 1, // 线条宽度，默认为 1
                  strokeColor: '#A0522D', // 线条颜色
                  strokeOpacity:0.8,
                  fillOpacity:0.2
              });
              that.map.add(polygon);
              var area = AMap.GeometryUtil.ringArea(that.path);
              console.log(area);
              console.log(that.path);

});
	}}
    });*/

    })

      },
      handleOk(){

      }
  }
}
</script>
<style>
#container {
  width: 800px;
  height: 400px;
}
.input-card{
  background:white;
  width:200px;
  height:250px;
  position: absolute;
  bottom: 10%;
  right:0;
}
</style>
