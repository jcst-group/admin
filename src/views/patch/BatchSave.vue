<template>
  <div>
    <a-row :gutter="16">
      <a-button style="margin-left:10px;float: left;" @click="backToBatch">返回批次管理</a-button>
    </a-row>
    <!-- <div style=" padding: 20px;">
      <a-row :gutter="16">
        <a-col :span="8" >
          <a-avatar shape="square"  :size="64" style="text-align: center;" icon="user" />
          <a-card title="产品信息" :bordered=false>
            <p ><span style="">产品信息：</span>
              <span v-if="write" style="color: #1c4cff;">已填写</span>
              <span v-else style="color: #b43400;">未填写</span>
            </p>

            <p ><span style="">产品图片：</span>
              <span style="color: #1c4cff;font-size: large;margin-right: 5px;">{{reportCount}}</span>份
            </p>

            <p ><span style="">耕作记录合计：</span>
              <span style="color: #1c4cff;font-size: large;margin-right: 5px;">{{recordCount}}</span>条
            </p>
            <p ><span style="">采集数据条数：</span>
              <span style="color: #1c4cff;font-size: large;margin-right: 5px;">{{eqvData}}</span>条
            </p>
            <p v-if="write" style="color: #1c4cff;font-size: large;">已填写</p>
            <p v-else style="color: #b43400;font-size: large;" onclick="openPro">未填写</p>
          </a-card>
        </a-col>
        <a-col :span="6">
          <a-card title="产品图片" :bordered=false>
            <p><span style="color: #1c4cff;font-size: large;">{{picCount}}</span>张</p>
          </a-card>
        </a-col>
        <a-col :span="8">
          <a-card title="报告文件合计" :bordered=false>
            <p><span style="color: #1c4cff;font-size: large;">{{reportCount}}</span>份</p>
          </a-card>
        </a-col>
        <a-col :span="8">
          <a-card title="耕作记录合计" :bordered=false>
            <p><span style="font-size: large;">合计：</span><span style="color: #36a653;font-size: large;">{{recordCount}}</span>条</p>
            <p><span style="font-size: large;">展示：</span><span style="color: #1c4cff;font-size: large;">{{showRecordCount}}</span>条</p>
            <p><span style="font-size: large;">隐藏：</span><span style="color:  #b43400;font-size: large;">{{unShowRecordCount}}</span>条</p>
          </a-card>
        </a-col>

      </a-row>
    </div> -->
    <a-row :gutter="16" style="margin-top:30px">
      <a-col :span="16">
        <a-collapse defaultActiveKey="1" accordion>
          <a-collapse-panel header="产品信息表" key="1">
            <batch-save-pro-modal ref="batchMoreModal"></batch-save-pro-modal>
            <!--<a-col :span="8" style="height: 600px;overflow-y: scroll;">
              <iframe ref="iframe" src="http://localhost:800/demo/#/index" @load="loaded"></iframe>
            &lt;!&ndash; <img src="@/assets/pro_pic.jpg"  style="width: 100%;"/>&ndash;&gt;
            </a-col>-->
          </a-collapse-panel>
          <!-- <a-collapse-panel :forceRender=true header="产品图片" key="2">
            <batch-save-img  ref="batchSaveImg" :picCount="changePicCount"></batch-save-img>
          </a-collapse-panel> -->
          <!-- <a-collapse-panel :forceRender=true header="报告文件" key="3" :disabled='false'>
            <batch-save-file ref="batchSaveFile"></batch-save-file>
          </a-collapse-panel> -->
          <a-collapse-panel :forceRender=true header="耕作记录展示管理" key="4" :disabled='false'>
            <batch-save-records ref="batchSaveRecords"></batch-save-records>
          </a-collapse-panel>
          <a-collapse-panel :forceRender=true header="设备数据分析" key="5" :disabled='false'>
            <batch-save-eqv-data ref="batchSaveEqvData"></batch-save-eqv-data>
          </a-collapse-panel>
          <!--<a-collapse-panel :forceRender=true header="其他信息" key="6" :disabled='false'>
            <batch-save-records ref="batchSaveRecords"></batch-save-records>
          </a-collapse-panel>-->
        </a-collapse>
      </a-col>
      <a-col :span="8">
        <div style=" padding: 20px;">
          <a-button type="primary" @click="updateView">刷新页面</a-button>
          <!-- <a-button type="primary" style="float: right;margin-left:10px;" @click="batchSave" >封存</a-button>   -->
          <a-button style="float: right;margin-left:10px;" @click="showqr">预览</a-button>
        </div>
        <iframe  ref="iframe" v-if="viewUpdate" style="width: 100%;min-height: 800px;" :src="iframeUrl" scrolling="auto"  ></iframe>
      </a-col>
    </a-row>
    <batch-save-qr-modal ref="batchSaveQrModal"></batch-save-qr-modal>
  </div>
</template>
<script>
import moment from 'moment';
import BatchSaveProModal from './modules/BatchSaveProModal'
import { getProTrace ,packagingBatch,getSourceUrl} from '@/api/allapi'
// import BatchSaveImg from './modules/BatchSaveImg'
// import BatchSaveFile from './modules/BatchSaveFile'
import BatchSaveRecords from './modules/BatchSaveRecords'
import BatchSaveQrModal from './modules/BatchSaveQrModal'
import BatchSaveEqvData from './modules/BatchSaveEqvData'
const proPackings = [
  {id:1,itemName:'真空包装'},
  {id:2,itemName:'无菌包装'},
  {id:3,itemName:'充气包装'},
];
const storageMethods = [
  {id:1,itemName:'放置干燥阴凉处或者冷藏'},
  {id:2,itemName:'常温存储'},
];
const suitableCrowds = [
  {id:1,itemName:'所有人'},
  {id:2,itemName:'老人和小孩'},
  {id:3,itemName:'妇女'},
];
const attentions = [
  {id:1,itemName:'孕妇禁用'},
  {id:2,itemName:'高血压人群禁用'},
  {id:3,itemName:'低血压人群禁用'},
];




  export default {
    name: 'batchSave',
    components:{
      // BatchSaveFile,
      BatchSaveProModal,
      // BatchSaveImg,
      BatchSaveRecords,
      BatchSaveQrModal,
      BatchSaveEqvData

    },
    data () {
      return {
        proPackings,
        storageMethods,
        suitableCrowds,
        attentions,
        iframeUrl:'',
        batchId:0,
        pro:{
          proDate:'',
        },
        form: this.$form.createForm(this),
      }
    },
    created() {
      this.pro.proDate = this.getNowFormatDate();
    },
    mounted() {
      let batchId = this.getBatchId();
      this.$refs.batchMoreModal.init(batchId);
      // this.$refs.batchSaveImg.show(batchId);
      // this.$refs.batchSaveFile.edit(batchId);
      this.$refs.batchSaveRecords.loadData(batchId);
      this.$refs.batchSaveEqvData.loadData(batchId);
      this.batchId = batchId;
      this.getShowUrl()
      this.$store.commit('pro/SET_VIEWUPDATE',true)
    },
    computed: {
      eqvData(){
        return this.$store.state.pro.eqvData
      },
      viewUpdate(){
        return this.$store.state.pro.viewUpdate
      },
      write(){
        return this.$store.state.pro.write
      },
      picCount(){
        return this.$store.state.pro.picCount
      },
      reportCount(){
        return this.$store.state.pro.reportCount
      },
      recordCount(){
        return this.$store.state.pro.recordCount
      },
      showRecordCount(){
        return this.$store.state.pro.showRecordCount
      },
      unShowRecordCount(){
        return this.$store.state.pro.unShowRecordCount
      }
    },
    methods: {
      moment,
      getShowUrl(){
        if (window.location.hostname.indexOf('192.168') !== -1) {
          this.iframeUrl = 'http://' + window.location.hostname + ':8080/#/index?batchId=' + this.getBatchId();
          console.log(this.iframeUrl)
        } else {
          getSourceUrl().then(res => {
            if (res.success) {
              this.iframeUrl = res.result.constant + "?batchId=" + this.getBatchId();
            }
          })
        }
      },
      showqr(){
        if (window.location.hostname.indexOf('192.168') !== -1) {
          var url = 'http://' + window.location.hostname + ':8080/#/index?batchId=' + this.getBatchId();
          this.$refs.batchSaveQrModal.show(url)
        } else {
          getSourceUrl().then(res => {
            if (res.success) {
              var url = res.result.constant + "?batchId=" + this.getBatchId();
              this.$refs.batchSaveQrModal.show(url)
            }
          })
        }
      },
      changePicCount(count){
        this.picCount = count;
      },
      getBatchId(){
        return this.$route.query.batchId;
      },
      updateView(){
        this.$store.commit('pro/SET_VIEWUPDATE',false)
        let that = this;
        setTimeout(()=>{
          that.$store.commit('pro/SET_VIEWUPDATE',true);
        }, 1000);
      },
      getNowFormatDate() {
        var date = new Date();
        var seperator1 = "-";
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var strDate = date.getDate();
        if (month >= 1 && month <= 9) {
          month = "0" + month;
        }
        if (strDate >= 0 && strDate <= 9) {
          strDate = "0" + strDate;
        }
        var currentdate = year + seperator1 + month + seperator1 + strDate;
        return currentdate;
      },
      backToBatch(){
        this.$router.push('/batch')
      },
      batchSave(){
        let batch = {};
        batch.id = this.batchId;
        packagingBatch(batch).then((res)=>{
          if(res.success==true){
            this.$message.info(res.message);
          }else{
            this.$message.info(res.message)
          }
        })

      }
    },
  }
</script>
