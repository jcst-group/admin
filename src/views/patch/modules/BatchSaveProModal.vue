<template>
    <div id="components-form-demo-advanced-search">
      <a-form :form="form">
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item
              label="作物名称"
              v-bind="formItemLayout">
              <a-input
                v-decorator="[
                  'cropName',
                  {
                    initialValue:record.cropName,
                    rules: [{
                      required: true, message: '请输入作物名称!',min:0,max:50
                    }]
                  }
                ]"
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item
              label="拼音码"
              v-bind="formItemLayout">
              <a-input
                v-decorator="[
                  'pinyinCode',
                  {
                    initialValue:record.pinyinCode,
                    rules: [{
                      required: true, message: '请输入拼音码!'
                    }]
                  }
                ]"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item
              label="作物描述"
              v-bind="formItemLayout">
              <a-textarea
              :rows="4"
                v-decorator="[
                  'describe',
                  {
                    initialValue:record.describe,
                    rules: [{
                      required: true, message: '请输入作物描述!'
                    }]
                  }
                ]"
                style="width: 100%"
              >
              </a-textarea>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item
              label="食用价值"
              v-bind="formItemLayout">
              <a-textarea
                :rows="4"
                v-decorator="[
                  'edibleValue',
                  {
                    initialValue:record.edibleValue,
                    rules: [{
                      required: true, message: '请输入食用价值!'
                    }]
                  }
                ]"
                style="width: 100%"
              >
              </a-textarea>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item
              label="作物价值"
              v-bind="formItemLayout">
              <a-textarea
                :rows="4"
                v-decorator="[
                  'medicinalValue',
                  {
                    initialValue:record.medicinalValue,
                    rules: [{
                      required: true, message: '请输入作物价值'
                    }]
                  }
                ]"
                style="width: 100%"
              >
              </a-textarea>
            </a-form-item>
          </a-col>
          <!-- <a-col :span="12">
            <a-form-item
              label="食用价值图片"
              style="margin-right:-50px"
              v-bind="formItemLayout">
              <a-upload
                name="file"
                action="/api/pictureInfo/addProEdiblePic"
                listType="picture-card"
                :fileList="efileList"
                @preview="handlePreview"
                :headers="headers"
                @change="ehandleChange"
                :remove="removeepic"
              >
                <div v-if="efileList.length < 1">
                  <a-icon type="plus" />
                  <div class="ant-upload-text">食用价值图片</div>
                </div>
              </a-upload>
              <a-modal :visible="imgVisible" :footer="null" @cancel="handleCancel">
                <img alt="example" style="width: 100%" :src="imgSrc" />
              </a-modal>
            </a-form-item>
          </a-col> -->
        </a-row>
        <a-row :gutter="24">
          <a-col :span="24">
            <a-form-item
              label="作物图片"
              class="form-wrapper"
              style="margin-right:-50px"
              v-bind="formItemLayout">
              <a-upload
                name="file"
                action="/api2/pictureInfo/addProCropPic"
                listType="picture-card"
                :fileList="mfileList"
                @preview="handlePreview"
                :headers="headers"
                @change="mhandleChange"
                :remove="removempic">
                <div v-if="mfileList.length < 4">
                  <a-icon type="plus" />
                  <div class="ant-upload-text">作物图片</div>
                </div>
              </a-upload>
              <a-modal :visible="imgVisible" :footer="null" @cancel="handleCancel">
                <img alt="example" style="width: 100%" :src="imgSrc" />
              </a-modal>
            </a-form-item>
          </a-col>
          <!-- <a-col :span="12">
            <a-form-item
              label="药用价值图片"
              style="margin-right:-50px"
              v-bind="formItemLayout">
              <a-upload
                name="file"
                action="/api/pictureInfo/addProMedicinalPic"
                listType="picture-card"
                :fileList="yfileList"
                @preview="handlePreview"
                :headers="headers"
                @change="yhandleChange"
                :remove="removeypic"
              >
                <div v-if="yfileList.length < 1">
                  <a-icon type="plus" />
                  <div class="ant-upload-text">药用价值图片</div>
                </div>
              </a-upload>
              <a-modal :visible="imgVisible" :footer="null" @cancel="handleCancel">
                <img alt="example" style="width: 100%" :src="imgSrc" />
              </a-modal>
            </a-form-item>
          </a-col> -->
        </a-row>
        <a-button type="primary" @click="reset" style="margin-right:20px">重置</a-button>
        <a-button type="primary" @click="save">保存</a-button>
      </a-form>
    </div>

</template>
<script>
  import Vue from 'vue'
  import { ACCESS_TOKEN } from "@/store/mutation-types"
  import moment from 'moment';
  import { getProTrace,
    addAgriculturalPro,
    updateAgriculturalPro,
    addProTrace } from '@/api/allapi'
  import { delPic } from '@/api/ddwbApi'

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
    {id:4,itemName:'暂无'},
  ];

  export default {
    data () {
      return {
        proPackings,
        storageMethods,
        suitableCrowds,
        attentions,
        batchId:undefined,
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
        record: {},
        headers: {},
        imgVisible:false,
        imgSrc: '',
        mfileList: [],
        efileList: [],
        yfileList: [],
        cropPic:[],
        ediblePic:'',
        medicinalPic:'',
      }
    },
    created() {
      const token = Vue.ls.get(ACCESS_TOKEN);
      this.headers = {"X-Access-Token":token};
    },
    mounted() {

    },
    methods: {
      moment,
      handleCancel() {
        this.imgVisible = false
      },
      handlePreview(file) {
        this.imgSrc = file.url || file.thumbUrl
        this.imgVisible = true
      },
      mhandleChange(info) {
        this.mfileList=info.fileList;
        if (info.file.status === 'done') {
          this.cropPic.push({
            id: info.file.response.result.id
          }) 
        }
      },
      removempic(file){
        delPic({id: file.response ? file.response.result.id : file.uid}).then(res=>{
          this.$message.success(res.message);
        })
        // if (this.record.batchId) {
        //   delPic({id: file.response ? file.response.result.id : file.uid}).then(res=>{
        //     this.$message.success(res.message);
        //   })
        // }
      },
      ehandleChange(info){
        this.efileList=info.fileList;
        if (info.file.status === 'done') {
          this.ediblePic=info.file.response.result.id
        }
      },
      removeepic(file){
        if (this.record.batchId) {
          delPic({id: file.uid}).then(res=>{
            if(res.success){
              this.$message.success(res.message);
              this.ediblePic='';
            }
          })
        }
      },
      yhandleChange(info){
        this.yfileList=info.fileList;
        if (info.file.status === 'done') {
          this.medicinalPic=info.file.response.result.id
        }
      },
      removeypic(file){
        if (this.record.batchId) {
          delPic({id: file.uid}).then(res=>{
            if(res.success){
              this.$message.success(res.message);
              this.medicinalPic='';
            }
          })
        }
      },
      save(){
         this.form.validateFieldsAndScroll(err => {
           if (!err) {
              const params = this.form.getFieldsValue()
              params.cropPic = []
              if (this.cropPic.length < 4 && this.mfileList.length > 0 && !this.mfileList[0].size) {
                params.cropPic.push({
                  pictureUrl: this.mfileList[0].name
                })
              }
              params.cropPic = params.cropPic.concat(this.cropPic)
              // if(this.ediblePic){
              //   params.ediblePic = {id:this.ediblePic};
              // } else {
              //   params.ediblePic = this.record.ediblePic ? {pictureUrl: this.record.ediblePic.pictureUrl} : null
              // }
              // if(this.medicinalPic){
              //   params.medicinalPic = {id:this.medicinalPic};
              // } else {
              //   params.medicinalPic = this.record.medicinalPic ? {pictureUrl: this.record.medicinalPic.pictureUrl} : null;
              // }
              params.id = this.record.id
              params.batchId = this.batchId
              addProTrace(params).then(res => {
                this.$message.info(res.message)
                if (res.success) {
                  this.init(params.batchId)
                  this.cropPic = []
                  this.mfileList = []
                }
              })
           }
         })
      },
      init(batchId){
        this.batchId = batchId;
        if(batchId!=undefined){
          let that = this;
          getProTrace({
            batchId: batchId
          }).then(res => {
            if (res.success) {
              this.record = res.result
              this.cropPic= []
              this.ediblePic = ''
              this.medicinalPic = ''
              if (this.record.cropPic) {
                if (!this.record.batchId) {
                  this.mfileList.push({
                    uid: this.record.cropPic.id,
                    name: this.record.cropPic.pictureUrl,
                    status: 'done',
                    url: '/api2/pictureInfo/show/'+this.record.cropPic.pictureUrl,
                  })
                } else {
                  this.record.cropPic.forEach(item => {
                    this.mfileList.push({
                      uid: item.id,
                      name: item.pictureUrl,
                      status: 'done',
                      url: '/api2/pictureInfo/show/'+item.pictureUrl,
                    })
                  })
                }
              }
              // if (this.record.ediblePic) {
              //   this.efileList.push({
              //     uid: this.record.ediblePic.id,
              //     name: this.record.ediblePic.pictureUrl,
              //     status: 'done',
              //     url: '/api/pictureInfo/show/'+this.record.ediblePic.pictureUrl
              //   })
              // }
              // if (this.record.medicinalPic) {
              //   this.yfileList.push({
              //     uid: this.record.medicinalPic.id,
              //     name: this.record.medicinalPic.pictureUrl,
              //     status: 'done',
              //     url: '/api/pictureInfo/show/'+this.record.medicinalPic.pictureUrl,
              //   })
              // }
            }
          })
        }
      },
      reset(){
        this.record = {}
        this.form.resetFields()
      }
    },
  }
</script>
<style lang="stylus">
  .form-wrapper
    .ant-form-item-label
      width 110px
  // #components-form-demo-advanced-search
  //   .ant-form-item 
  //     label::before
  //       content: '*'
  //       color: #f40
</style>
