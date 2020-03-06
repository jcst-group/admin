<template>
  <a-modal
    :title="title"
    v-model="visible"
    @ok="handleOk"
    @cancel="handelCancel"
    style="top:10%;height: 90%"
    cancelText="取消"
    okText="确定"
    :maskClosable="false"
    class="standard-modal"
  >
    <a-tabs v-model="curKye">
      <a-tab-pane tab="种子/种苗信息" key="1">
        <div>
          <a-form :form='form'>
            <div class="form-wrapper">
              <a-form-item label='品种名称'>
                <a-select
                  v-decorator="[
                    'cropId',
                        {
                            initialValue:record.cropId,
                            rules: [{ required: true, message: '请选择品种名称' }],
                        }
                    ]">
                  <a-select-option
                    v-for="item in cropDatas"
                    @click="changeCrop(item.id)"
                    :key="item.id"
                    :value='item.id'>
                    {{item.cropName}}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </div>
            <div class="form-wrapper">
              <a-form-item label='种子批次'>
                <a-select
                  :filterOption="filterBatch"
                  :showSearch='true'
                  v-decorator="[
                        'seedBatchId',
                            {
                                initialValue:this.seedBatch,
                                rules: [{ required: true, message: '请选择种子批次' }],
                            }
                        ]">
                  <a-select-option
                    v-for="item in seedDatas"
                    :key="item.id"
                    :value='item.id'>
                    <div class='hide-name' style="color: rgba(0,0,0,0.4)">{{item.batchName ? item.batchName : '非自种'}}</div>
                    <div class="crop-text">{{item.seedCode}}</div>
                  </a-select-option>
                </a-select>
              </a-form-item>
            </div>
            <div class="form-wrapper">
              <a-form-item label='检测图片'>
                <div class="upload-wrapper">
                  <a-upload
                    name="file"
                    listType="picture-card"
                    class="avatar-uploader"
                    :showUploadList="true"
                    action="/api2/pictureInfo/addSeedDetectionPic"
                    :beforeUpload="beforeUpload"
                    :headers="headers"
                    :fileList='fileList'
                    @change="handleChange"
                    @preview='avatarPreview'
                    :remove='avatarRemove'
                  >
                    <div v-if="fileList.length < 1" style="transform: translateY(15%)">
                      <a-icon type="plus"/>
                      <div class="ant-upload-text">Upload</div>
                    </div>
                  </a-upload>
                  <a-modal :visible="avatarVisible" :footer="null" @cancel="handleAvatarCancel">
                    <img alt="example" style="width: 100%" :src="imageUrl" />
                  </a-modal>
                </div>
              </a-form-item>
            </div>
            <div class="form-wrapper">
              <a-form-item label='检测报告'>
                <div class="upload-wrapper">
                  <a-upload
                    name="file"
                    listType="picture-card"
                    class="avatar-uploader"
                    :showUploadList="true"
                    action="/api2/pictureInfo/addSeedDetectionResultPic"
                    :beforeUpload="beforeUpload"
                    :headers="headers"
                    :fileList='fileListRep'
                    @change="handleChangeRep"
                    @preview='avatarPreviewRep'
                    :remove='avatarRemoveRep'
                  >
                    <div v-if="fileListRep.length < 1" style="transform: translateY(15%)">
                      <a-icon type="plus"/>
                      <div class="ant-upload-text">Upload</div>
                    </div>
                  </a-upload>
                  <a-modal :visible="avatarVisibleRep" :footer="null" @cancel="handleAvatarCancelRep">
                    <img alt="example" style="width: 100%" :src="imageUrlRep" />
                  </a-modal>
                </div>
              </a-form-item>
            </div>
            <div class="form-wrapper">
              <a-form-item label='检测时间'>
                <a-date-picker
                  style="width: 236px;"
                  v-decorator="[
                    'detectionTime',
                    {
            rules: [{ required: true, message: '请选择检测时间' }],
            initialValue:moment(this.detectionTime, 'YYYY-MM-DD')
          }
                  ]"
                  @change="onChange"
                />
              </a-form-item>
            </div>
          </a-form>
        </div>
      </a-tab-pane>
      <a-tab-pane tab="检测项目" key="2" forceRender>
        <div v-if="isSeedShow==true" style="height: 267px">
          <span>请先选中品种!</span>
        </div>
        <div v-if="isSeedShow==false&&recoveryDatas==''" style="height: 267px">
          <span>该品种暂无检测项目!</span>
        </div>
        <div v-if="isSeedShow==false&&recoveryDatas!=''">
          <a-form :form='forms'>
            <div class="form-wrapper" v-for="(item,index) in recoveryDatas" :key="index">
              <a-form-item :label="item.item+'('+item.unit.displayName+')'">
                <a-input-number v-decorator="[
                    String(item.id),
                    {
                        initialValue: record.detectionVoList ? (record.detectionVoList[index] ? record.detectionVoList[index].actValue : null) : null,
                        rules: [{ required: true, message: '不能为空'}],
                    }
                ]"/>
              </a-form-item>
            </div>
          </a-form>
        </div>
      </a-tab-pane>
    </a-tabs>

  </a-modal>
</template>
<script>
  import Vue from "vue";
  import { ACCESS_TOKEN } from "@/store/mutation-types";
  import {getAllCrop,delpicture,getRecoveryDetection,addSeedDetection,updateSeedDetection} from '@/api/permissonApi'
  import {getSeedAndBatch} from '@/api/allapi'
  import moment from 'moment';
  export default {
    data() {
      return {
        detectionVoListChange:[],
        detectionVoListvalue:[],
        detectionVoList:[],
        curKye:'1',
        seedBatch:'',
        seedBatchIds:'',
        SHOWURL:"/api2/pictureInfo/show/",
        seedBatchId:'',
        fileListss:"",
        fileListssRep:"",
        isUpfileListss:"",
        isUpfileListssRep:"",
        fileListssData:'',
        fileListssRepData:'',
        recoveryDatas: [],
        isSeedShow:true,
        removeList:[],//用于保存需要删除的图片ID
        addList:[],//用于保存增加的图片ID
        fileList: [],
        fileListRep:[],
        imageUrl: "",
        imageUrlRep:'',
        avatarVisible: false,
        avatarVisibleRep:false,
        avatarFileList: [],
        headers: "",
        seedDatas:[],
        detectionTime:'',
        dateString: '',
        familyDatas: [],
        loading: false,
        relationDatas: [],
        form: this.$form.createForm(this),
        forms: this.$form.createForm(this),
        unitDatas: [],
        cropDatas: [],
        stageDatas: [],
        categoryDatas: [],
        title: '',
        visible: false,
        record: {},
        familyColumns: [
          {
            title: '初加工批次',
            dataIndex: 'memberName',
            key: 'memberName',
            width: '24%',
            scopedSlots: {customRender: "memberName"},
            align: "center"
          },
          {
            title: '基地名称',
            dataIndex: 'relation.displayName',
            key: 'relation.displayName',
            width: '18%',
            scopedSlots: {customRender: "relation.displayName"},
            align: "center"
          },
          {
            title: '地块名称',
            dataIndex: 'sex.displayName',
            key: 'sex.displayName',
            width: '18%',
            scopedSlots: {customRender: "sex.displayName"},
            align: "center"
          },
          {
            title: '产出等级',
            dataIndex: 'identifyCode',
            key: 'identifyCode',
            scopedSlots: {customRender: "identifyCode"},
            align: "center"
          },
          {
            title: '产量',
            dataIndex: 'identifyCode',
            key: 'identifyCode',
            scopedSlots: {customRender: "identifyCode"},
            align: "center"
          },
          {
            title: '单位',
            dataIndex: 'occupation',
            key: 'occupation',
            scopedSlots: {customRender: "occupation"},
            align: "center"
          },
          {
            title: '操作',
            dataIndex: "action",
            key: "action",
            scopedSlots: {customRender: "action"},
            align: "center"
          }
        ]
      }
    },
    created() {
      const token = Vue.ls.get(ACCESS_TOKEN);
      this.headers = { "X-Access-Token": token };
      this._getAllDatas()
    },
    methods: {
      filterBatch(val, node) {
        return node.componentOptions.children[0].children[0].text.indexOf(val) > -1 || node.componentOptions.children[1].children[0].text.indexOf(val) > -1
      },
      handelCancel(){
        this.curKye='1';
        /*this.form.resetFields();
        this.detectionVoList=this.detectionVoListChange;
        console.log(this.detectionVoListChange);*/
      },
      handleChange ({ fileList,file }) {
        //this.fileList = fileList;
        if(file.status=="done"){
          //设置返回的图像id
          let result = file.response.result;
          let id = result.id;
          file = {};
          if(id!=undefined && this.addList.indexOf(id)==-1){
            file.uid = id;
            file.name=result.pictureUrl;
            file.url = this.SHOWURL+result.pictureUrl;
            //fileList = this.fileList;
            /*fileList.pop();
            fileList.push(file)*/
            this.addList.push(file.uid);
            this.fileListss={id:file.uid};
            this.fileList = fileList;
            this.fileListssData=file.name;
          }else{
            this.fileList = fileList;
          }
        }else{
          if(file.status!=undefined){
            this.fileList = fileList;
          }
        }
      },
      handleChangeRep({ fileList,file }){
        if(file.status=="done"){
          //设置返回的图像id
          let result = file.response.result;
          let id = result.id;
          file = {};
          if(id!=undefined && this.addList.indexOf(id)==-1){
            file.uid = id;
            file.name=result.pictureUrl;
            file.url = this.SHOWURL+result.pictureUrl;
            //fileList = this.fileList;
            /*fileList.pop();
            fileList.push(file)*/
            this.addList.push(file.uid);
            this.fileListssRep={id:file.uid};
            this.fileListRep = fileList;
            this.fileListssRepData=file.name;
          }else{
            this.fileListRep = fileList;
          }
        }else{
          if(file.status!=undefined){
            this.fileListRep = fileList;
          }
        }
      },
      avatarRemoveRep(file) {
        return new Promise((resolve) => {
          var that = this
          this.$confirm({
            title: '确定要删除该图片么',
            onCancel() {
              return resolve(false)
            },
            onOk() {
              if(file.response){
                delpicture({
                  id: file.response.result.id
                }).then(res => {
                  that.$message.info(res.message)
                  if (res.success) {
                    var delid = file.response.result.id;
                    that.fileListssRep="";
                    that.lock = false
                    return resolve(true)
                  }
                })
              }else{
                delpicture({
                  id: file.uid
                }).then(res => {
                  that.$message.info(res.message)
                  if (res.success) {
                    var delid = file.uid;
                    that.fileListssRep="";
                    that.lock = false
                    return resolve(true)
                  }
                })
              }
            }
          })
        }).then(res => {
          return res
        })
      },
      avatarRemove(file) {
        return new Promise((resolve) => {
          var that = this
          this.$confirm({
            title: '确定要删除该图片么',
            onCancel() {
              return resolve(false)
            },
            onOk() {
              if(file.response){
                delpicture({
                  id: file.response.result.id
                }).then(res => {
                  that.$message.info(res.message)
                  if (res.success) {
                    var delid = file.response.result.id;
                    that.fileListss="";
                    that.lock = false
                    return resolve(true)
                  }
                })
              }else{
                delpicture({
                  id: file.uid
                }).then(res => {
                  that.$message.info(res.message)
                  if (res.success) {
                    var delid = file.uid;
                    that.fileListss="";
                    that.lock = false
                    return resolve(true)
                  }
                })
              }
            }
          })
        }).then(res => {
          return res
        })
      },
      show(record){
        //处理初始化
        this.removeList =[];
        this.addList=[];
        this.removeList =[];
        this.addList=[];
        /*this.fileListss="";
        this.isUpfileListss="";
        this.isUpfileListssRep="";
        this.fileListssRep="";*/
        this.fileList=[];
        this.fileListRep=[];
        // 初始化图片列表，初始化上传的ID
        let pictureInfoList = record.detectionPic;
        if(record.detectionPic!=null){
          this.isUpfileListss=this.fileListssData=record.detectionPic.pictureUrl;
        }else{
          this.isUpfileListss=this.fileListssData=null;
        }
        let pictureInfoListRep = record.detectionResultPic;
        if(record.detectionResultPic!=null){
          this.isUpfileListssRep=this.fileListssRepData=record.detectionResultPic.pictureUrl;
        }else{
          this.isUpfileListssRep=this.fileListssRepData=null;
        }
        let fileList = [];
        let file = {};
        if(pictureInfoList!=null){
          let item = pictureInfoList;
          file.uid = item.id;
          file.name=item.pictureUrl;
          file.url = this.SHOWURL+item.pictureUrl;
          fileList.push(file);
          this.fileList = fileList;
        }
        let fileListRep = [];
        let fileRep = {};
        if(pictureInfoListRep!=null){
          let itemRep = pictureInfoListRep;
          fileRep.uid = itemRep.id;
          fileRep.name=itemRep.pictureUrl;
          fileRep.url = this.SHOWURL+itemRep.pictureUrl;
          fileListRep.push(fileRep);
          this.fileListRep = fileListRep;
        }
        this.visible=true;
      },
      handleCancel () {
        this.previewVisible = false
      },
      handlePreview (file) {
        this.previewImage = file.url || file.thumbUrl
        this.previewVisible = true
      },
      avatarPreview(file) {
        this.avatarVisible = true
        this.imageUrl = file.url || file.thumbUrl
      },
      avatarPreviewRep(file) {
        this.avatarVisibleRep = true
        this.imageUrlRep = file.url || file.thumbUrl
      },
      handleAvatarCancel() {
        this.avatarVisible = false
      },
      handleAvatarCancelRep(){
        this.avatarVisibleRep = false
      },
      beforeUpload(file) {
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
      changeCrop(cropId,value){
        if(value!=1){
          this.seedBatch=""
        }
        this.form.resetFields("seedBatchId");
        let param = {};
        param.cropId = cropId;
        getRecoveryDetection(param).then(res => {
            if(res.success){
              this.recoveryDatas = res.result;
            }
        });
        this.$nextTick(() => {
          this.isSeedShow=false;
        });
        getSeedAndBatch({cropId:cropId}).then(res => {
          if (res.success) {
            this.seedDatas = res.result
          }
        })
      },
      moment,
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
      getTime(){
        this.detectionTime=this.form.getFieldsValue(['detectionTime']).detectionTime.format('YYYY-MM-DD');
      },
      onChange(date, dateString) {
        this.dateString = dateString;
      },
      _getAllDatas() {
        getAllCrop().then(res => {
          if (res.success) {
            this.cropDatas = res.result
          }
        })
      },
      test(value, key, column) {
        this.familyLock = true
        const newData = [...this.familyDatas]
        const target = newData.filter(item => key === item.id)[0]
        if (target) {
          target.relation.code = value
          this.familyDatas = newData
        }
      },
      open(record) {
        this.detectionVoListChange=[];
        this.detectionVoList=[];
        this.visible = true
        this.forms.resetFields()
        this.form.resetFields()
        if (record !== undefined) {
          this.record = record;
          this.detectionTime=record.detectionTime;
          this.seedBatch=record.seedBatchId;
          /*this.detectionVoList=JSON.parse(JSON.stringify(record.detectionVoList))
          this.detectionVoListChange=JSON.parse(JSON.stringify(record.detectionVoList))*/
          this.changeCrop(this.record.cropId,1);
          this.show(this.record);
        } else {
          this.seedDatas=[];
          this.isSeedShow=true;
          this.fileListss="";
          this.fileListssRep="";
          this.addList="";
          this.fileListRep=[];
          this.fileList=[];
          this.record = {};
          this.detectionTime=this.getNowFormatDate();
        }
      },
      handleOk() {
        var isShow=false;
        var isShows=false;
        if (this.title === '新增') {
          var detectionRelList=[];
          this.form.validateFieldsAndScroll((err, values) => {
            this.forms.validateFieldsAndScroll((err, values) => {
              Object.keys(values).forEach(function (key) {
                let a = {};
                a.detectionId=Number(key);
                a.value=values[key];
                if(a.value){
                  detectionRelList.push(a);
                }
              })
            })
            if (!err) {
              const params = this.form.getFieldsValue()
              params.detectionRelList=detectionRelList;
              delete params.crop
              if(this.fileListss!=""){
                params.detectionPic=this.fileListss;
              }
              if(this.fileListssRep!=""){
                params.detectionResultPic=this.fileListssRep;
              }
              this.getTime();
              params.detectionTime=this.detectionTime;
              addSeedDetection(params).then(res => {
                this.$message.info(res.message)
                this.visible = false
                if (res.success) {
                  this.curKye='1'
                  this.fileList=[]
                  this.fileListRep=[]
                  this.$parent._loadData()
                }
              })
            }
          })
        } else {
          var detectionRelList = [];
          this.forms.validateFieldsAndScroll((err, values) => {
            if (!err) {
              isShow = true;
              Object.keys(values).forEach(function (key) {
                let a = {};
                a.detectionId = Number(key);
                a.value = values[key];
                if (a.value) {
                  detectionRelList.push(a);
                }
              })
            }
          })
          if(this.isSeedShow==false&&this.recoveryDatas==''){
            this.$message.warn('该品种暂无检测项目')
            return;
          }
          this.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
              isShows=true;
              const params = this.form.getFieldsValue();
              params.id = this.record.id
              params.detectionRelList = detectionRelList;
              delete params.crop
              if (this.isUpfileListss == null && this.fileListssData != null) {
                params.detectionPic = this.fileListss;
              }
              if (this.isUpfileListss != null && this.fileListssData != null && this.isUpfileListss != this.fileListssData) {
                params.detectionPic = this.fileListss;
              }
              if (this.isUpfileListssRep == null && this.fileListssRepData != null) {
                params.detectionResultPic = this.fileListssRep;
              }
              if (this.isUpfileListssRep != null && this.fileListssRepData != null && this.isUpfileListssRep != this.fileListssRepData) {
                params.detectionResultPic = this.fileListssRep;
              }
              this.getTime();
              params.detectionTime = this.detectionTime;
              if(isShow==true&&isShows==true) {
                updateSeedDetection(params).then(res => {
                  this.$message.info(res.message)
                  this.visible = false
                  if (res.success) {
                    this.curKye='1'
                    this.$parent._loadData()
                  }
                })
              }
            }
          })
        }
      },
      openHukou() {
        this.$refs.hukouMessage.visible = true
        this.$refs.hukouMessage.curUid = this.curUid
        this.$refs.hukouMessage.form.resetFields()
      }
    }
  }
</script>
<style lang="stylus">
  .standard-modal /deep/ .avatar-uploader > .ant-upload {
    width: 104px;
    height: 104px;
  }
  .standard-modal
    width: 900px !important

    .form-wrapper
      width 45%
      display inline-block

      .ant-form-item
        width 100%
        display inline-block

        .ant-form-item-control-wrapper
          width 60%
          display inline-block

        .ant-form-item-label
          width 150px
          vertical-align top

  .ant-input-number
    width: 200px

  .ant-modal-body
    padding: 12px

  .standard-modal /deep/ .ant-modal-body
    overflow-y: auto
    max-height: 450px
</style>
