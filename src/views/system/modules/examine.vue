<template>
    <a-modal
      width=60%
      v-model="visible"
      :title="title"
      ref="modal"
      :maskClosable="false"
      style="position: relative;min-width:1150px"
      class="examine-modal"
    >
        <div class="fater" v-if="islookmap">
            <div class="title">
                <span>地图定位信息：</span>
            </div>
            <div id="container" style="flex: 1"></div>
            <div class="loading"><a-spin :spinning="spinning" size="large"  tip="地图正在加载中..."></a-spin></div>
        </div>
        <div class="fater" v-show="false"></div>
        <div class="flex-wrapper">
            <div class="title">图片信息：</div>
            <div style="flex: 1;text-align:left" v-if="imgDatas.length > 0">
                <div class="btn-wrapper" v-for="item in imgDatas" :key="item.id">
                    <div class="show-img">
                        <img :src="'/api/pictureInfo/show/' + item.pictureUrl">
                        <div class="img-mask">
                            <a-icon type="eye" @click="openImage(item.pictureUrl)"/>
                        </div>
                    </div>
                </div>
                <a-modal :maskClosable='false' :visible="imgModal" :footer="null" @cancel='handleImgCancel' style="text-align:center">
                    <img :src="curUrl ? '/api/pictureInfo/show/' + curUrl : ''" alt="" width="100%">
                </a-modal>
            </div>
            <div style="flex: 1;text-align:left" v-else>
                <div class="btn-wrapper">
                    <div class="show-img">
                        <img src="../../../assets/noImg.png">
                    </div>
                </div>
            </div>
        </div>
        <div class='fater' v-if="record.subTime">
            <div class="title">
                <span>实际执行时间：</span>
            </div>
            <div style="line-height:30px;font-size: 20px">{{record.subTime}}</div>
        </div>
        <div class='examine-body' v-if="materialDatas.length > 0">
            <div class="title">
                <span>物料信息</span>
            </div>
            <a-table
                :columns="allColumns"
                :dataSource="materialDatas"
                :pagination='false'
                rowKey="id"
                bordered />
        </div>
        <div class='examine-body' v-if="deviceDatas.length > 0">
            <div class="title">设备信息</div>
            <a-table
                :columns="allColumns"
                :dataSource="deviceDatas"
                :pagination='false'
                rowKey="id"
                bordered />
        </div>
        <div class='examine-body' v-if="personDatas.length > 0">
            <div class="title">人员信息</div>
            <a-table
                style="width: 100%"
                :columns="allColumns"
                :dataSource="personDatas"
                :pagination='false'
                rowKey="id"
                bordered />
        </div>
        <div class="flex-wrapper">
            <div class="title">
                <span>语音备注：</span>
            </div>
            <audio v-if="visible" controls='controls' ref="audio" style="vertical-align: top; margin-right: 30px"></audio>
        </div>
        <div class="flex-wrapper" v-if="record.orderContent && record.orderContent.content && islookmap">
            <div class="title">
                <span>app返回备注：</span>
            </div>
            <div class="order-content">
                <span class="order-desc">{{record.orderContent ? record.orderContent.content : ''}}</span>
            </div>
        </div>
        <div class="flex-wrapper">
            <div class="title">
                <span>审批备注：</span>
            </div>
            <div class="desc">
                <a-textarea placeholder="审批备注" v-model="desc" :autosize='{minRows: 2, maxRows: 6}'/>
            </div>
        </div>
        <div slot='footer'>
            <a-button v-if="!lock" @click="handelCancel" style="background:#d9534f;color:#fff;border-color:#d9534f">{{cancelText}}</a-button>
            <a-button v-if="!lock" @click="handleOk" style="background:#1ABC9C;color:#fff;border-color:#1ABC9C">{{okText}}</a-button>
        </div>
    </a-modal>
</template>

<script>
import {getOrderLocal} from '@/api/ddwbApi'
import MapLoader from '@/utils/loadMap.js'
import {approvalWork,failedWork,returnWork,updateWork} from '@/api/permissonApi'
export default {
    data() {
        return {
            visible: false,
            lock:false,
            imgModal: false,
            title: '111',
            curUrl: '',
            okText: '',
            desc: '',
            cancelText: '',
            record: {},
            allColumns: [
                {
                    title: '计划单价',
                    dataIndex: 'preUnitPrice',
                    key: 'preUnitPrice',
                },
                {
                    title: '计划总量',
                    dataIndex: 'preUnitCount',
                    key: 'preUnitCount',
                },
                {
                    title: '计划费用',
                    dataIndex: 'preCal',
                    key: 'preCal',
                },
                {
                    title: '实际单价',
                    dataIndex: 'actUnitPrice',
                    key: 'actUnitPrice',
                },
                {
                    title: '实际总量',
                    dataIndex: 'actUnitCount',
                    key: 'actUnitCount',
                },
                {
                    title: '实际费用',
                    dataIndex: 'actCal',
                    key: 'actCal',
                }
            ],
            materialDatas: [],
            deviceDatas: [],
            personDatas: [],
            imgDatas: [],
            spinning:false,
            islookmap:false,
            mapinfo:{},
            map:null,
            basemarker:null,
            polygons:[],
            infoWindow:null,
        }
    },
    mounted(){
        let that = this;
        window.addEventListener('mapdone', function(){
            if(that.mapinfo.baseLongitude&&that.mapinfo.baseLatitude){
                let basejwd=[that.mapinfo.baseLongitude,that.mapinfo.baseLatitude];
                let baseimg=require('../../../assets/base.png');
                that.addBaseToMap(basejwd,baseimg);
            }
            if(that.mapinfo.longitude&&that.mapinfo.latitude){
                let jwd=[that.mapinfo.longitude,that.mapinfo.latitude];
                let img=require('../../../assets/dingwei.png');
                that.addBaseToMap(jwd,img);
            }
            if(that.mapinfo.lotList && that.mapinfo.lotList.length>0){
                that.addBlockOnMap(that.mapinfo.lotList);
            }
        });
    },
    methods: {
        addBlockOnMap(remarks){
            if(this.polygons.length>0){
                for(let i=0;i<this.polygons.length;i++){
                this.polygons[i].setMap(null);
                }
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
            let info=[];
            info.push("<div style=\"width:175px;margin:20px 25px;\"><table>");
            info.push("<tr style=\"color:#fff;line-height:20px;\"><td style=\"width:80px;\">地块名称：</td><td>"+this.mapinfo.lotList[i].lotName+"</td></tr>");
            info.push("</table></div>")
            this.infoWindow = new AMap.InfoWindow({
                content: info.join(""),
            });
            this.infoWindow.open(this.map,[e.lnglat.lng,e.lnglat.lat]);
        },
        addBaseToMap(jwd,img){
            var icon = new AMap.Icon({
                size: new AMap.Size(30, 30),
                image: img,
                imageOffset: new AMap.Pixel(0, 0),
                imageSize: new AMap.Size(30, 30)
            });
            this.basemarker = new AMap.Marker({
                map: this.map,
                position: jwd,
                icon:icon,
                anchor:'center',
                offset: new AMap.Pixel(0,0),
            });
            this.map.setFitView();
        },
        initMap(){
            this.islookmap=true;
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
                that.map.on("complete", function(){
                    that.spinning=false;
                    var myEvent = new CustomEvent('mapdone',{});
                    if (window.dispatchEvent) {
                        window.dispatchEvent(myEvent);
                    } else {
                        window.fireEvent(myEvent);
                    }
                });
            })
        },
        getjwd(id){
            getOrderLocal({orderId:id}).then(res=>{
                if(res.success){
                    if (res.result!=null) {
                        this.mapinfo=res.result;
                        this.initMap();
                    } else {
                        this.islookmap=false;
                    }
                }
            })
        },
        open(record) {
            this.islookmap=false;
            this.curUrl = ''
            this.record = record
            this.getjwd(this.record.id);
            this.materialDatas = record.materialActList
            this.deviceDatas = record.deviceActList
            this.personDatas = record.personnelActList
            this.imgDatas = record.pictureInfoList
            this.desc = record.remark ? record.remark : ''
            if (record.fileInfo && record.fileInfo !== null) {
                this.$nextTick(() => {
                    this.$refs.audio.src = '/api/fileInfo/getAudio' + (!record.fileInfo ? '' : '?fileUrl=' + record.fileInfo.fileUrl)
                })
            }
        },
        handleOk() {
            updateWork({
                id: this.record.id,
                remark: this.desc
            })
            if (this.title === '审核') {
                approvalWork({
                    id: this.record.id
                }).then(res => {
                    this.$message.info(res.message)
                    if (res.success) {
                        // let params = this.$parent.form.getFieldsValue()
                        // params.startTime = this.$parent.startTime
                        // params.endTime = this.$parent.endTime
                        // params.pageNo = this.$parent.pageNo
                        // params.pageSize = this.$parent.pageSize
                        // this.$parent._loadData(params)
                        this.$emit('fatherMethod');
                    }
                })
            } else {
                returnWork({
                   id: this.record.id
                }).then(res => {
                    this.$message.info(res.message)
                    if (res.success) {
                        // let params = this.$parent.form.getFieldsValue()
                        // params.startTime = this.$parent.startTime
                        // params.endTime = this.$parent.endTime
                        // params.pageNo = this.$parent.pageNo
                        // params.pageSize = this.$parent.pageSize
                        // this.$parent._loadData(params)
                        this.$emit('fatherMethod');
                    }
                })
            }
            this.desc = ''
            this.visible = false
        },
        handelCancel() {
            this.islookmap = false
            console.log(111)
            if (this.title === '审核') {
                updateWork({
                    id: this.record.id,
                    remark: this.desc
                })
                failedWork({
                    id: this.record.id
                }).then(res => {
                    this.$message.info(res.message)
                    if (res.success) {
                        // let params = this.$parent.form.getFieldsValue()
                        // params.startTime = this.$parent.startTime
                        // params.endTime = this.$parent.endTime
                        // params.pageNo = this.$parent.pageNo
                        // params.pageSize = this.$parent.pageSize
                        // this.$parent._loadData(params)
                        this.$emit('fatherMethod');
                    }
                })
            }
            this.desc = ''
            this.visible = false
        },
        openImage(picUrl) {
            this.imgModal = true
            this.curUrl = picUrl
        },
        handleImgCancel() {
            this.imgModal = false
            this.curUrl = ''
        }
    }
}
</script>
<style scoped>
#container >>> .amap-info-content {
background-color:rgba(35, 35, 35, 0.6);
 border-radius:10px 10px;
box-shadow: rgba(255, 255, 255, 0.5) 0px 0px 10px;
}
#container >>> .amap-info-sharp{
border-top: 8px solid rgba(35, 35, 35, 0.6);
}
</style>
<style lang='stylus'>
.examine-modal
    .flex-wrapper, .fater
        position relative
        text-align center
        display flex
        margin-bottom 30px
        .title
            font-size 20px
            width: 150px
            margin-right: 10px
            font-weight 600
            text-align left
            &::before
                content: " "
                display inline-block
                height 20px
                width 4px
                border-radius 2px
                background-color #2C909C
                margin-right 5px
                position relative
                top 3px
        #container
            width 400px
            height 300px
        .loading
            position absolute
            top 50%
            left 50%
        .order-content
            height 54px
            display inline-block
            .order-title
                font-size 20px
                font-weight 700
            .order-desc
                font-size 20px
                color #000
        .desc
            width 400px
        .btn-wrapper
            display inline-block
            margin-right 10px
            img
                width 100%
                height 100%
            .show-img
                position relative
                width 120px
                height 120px
                .img-mask
                    position absolute
                    top 0
                    right 0
                    left 0
                    bottom 0
                    background-color rgba(0, 0, 0, 0.5)
                    opacity 0
                    z-index 99
                    transition all 0.3s
                    i
                        font-size 30px
                        color rgba(255, 255, 255, 0.85)
                        transform translate(-50%, -50%)
                        position absolute
                        top 50%
                        left 50%
                &:hover
                    .img-mask
                        opacity 1
.examine-body
    margin-bottom 30px
    .title
        font-size 20px
        width: 150px
        margin-right: 10px
        font-weight 600
        text-align left
        margin-bottom 10px
        &::before
            content: " "
            display inline-block
            height 20px
            width 4px
            border-radius 2px
            background-color #2C909C
            margin-right 5px
            position relative
            top 3px
</style>
