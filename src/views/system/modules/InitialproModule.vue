<template>
  <a-modal
    :title="title"
    v-model="visible"
    @ok="handleOk"
    style="top:6%;height: 90%"
    cancelText="取消"
    okText="确定"
    :maskClosable="false"
    class="rec-modal"
    @cancel="closeModal"
  >
    <a-tabs v-model="activeKey">
      <a-tab-pane tab="采收信息" key="1">
        <div class="tab-box01">
          <a-form :form='form'>
            <div class="form-wrapper">
              <a-form-item label='种植计划'>
                <a-select
                  :disabled="Boolean(record.plantingPlan)"
                  v-if="planDatas.length > 0"
                  @change="getDec"
                  v-decorator="[
                    'planId',
                        {
                            initialValue:record.plantingPlan ? record.plantingPlan.planName : '',
                            rules: [{ required: true, message: '请选择种植计划' }],
                        }
                    ]">
                  <a-select-option
                    v-for="item in planDatas"
                    :key="item.id"
                    :value='item.id'>
                    {{item.planName}}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </div>
            <div class="form-wrapper">
              <a-form-item label='检测时间'>
                <a-date-picker
                  style="width:100%"
                  v-decorator="['detectionTime', {
                      initialValue: record.detectionTime ? moment(record.detectionTime, 'YYYY-MM-DD') : null,
                      rules: [{required: true, message: '请选择检测时间'}]
                  }]"
                />
              </a-form-item>
            </div>
            <div class="form-wrapper">
              <a-form-item label='抽样数量'>
                <a-input-number style="width: 236px" v-decorator="[
                      'samplingQuantity',
                      {
                          initialValue:record.samplingQuantity,
                          rules: [{ required: true, message: '请输入抽样数量'}],
                      }
                  ]"/>
              </a-form-item>
            </div>
            <div class="form-wrapper">
              <a-form-item label='抽样标准'>
                <a-input v-decorator="[
                      'samplingCriteria',
                      {
                          initialValue:record.samplingCriteria,
                          rules: [{ required: true, message: '请输入抽样标准'}],
                      }
                  ]"/>
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
                    action="/api2/pictureInfo/addInitProDetectionPic"
                    :beforeUpload="beforeUpload"
                    :headers="headers"
                    :fileList='fileList'
                    @change="handleChanges"
                    @preview='handlePreview'
                    :remove='remove'
                  >
                    <div v-if="fileList.length < 1" style="transform: translateY(50%)">
                      <a-icon type="plus"/>
                      <div class="ant-upload-text">Upload</div>
                    </div>
                  </a-upload>
                  <a-modal :visible="imgVisible" :footer="null" @cancel="handleImgCancel">
                    <img alt="example" style="width: 100%" :src="imgUrl"/>
                  </a-modal>
                </div>
              </a-form-item>
            </div>
          </a-form>
        </div>
        <div style="margin: 0px 0px 10px 16px;">
          <a-button
            type="primary"
            icon="plus"
            @click="addBatch"
          >
            添加初加工批次
          </a-button>
        </div>
        <a-table
          :columns="batchColumns"
          :dataSource="batchDatas"
          :loading="loading"
          :pagination='false'
          bordered
          id="initalpros"
        >
          <span slot="proItemList01" slot-scope="proItemList" style="text-align: center" class="slot-box">
          <div class="slot-div" v-for="(v,k) in proItemList" :key="k"><span>{{v.proName}}</span></div>
          </span>
          <span slot="proItemList02" slot-scope="proItemList" style="text-align: center" class="slot-box">
           <div class="slot-div" v-for="(v,k) in proItemList" :key="k"><span>{{v.proLevel}}</span></div>
          </span>
          <span slot="proItemList03" slot-scope="proItemList" style="text-align: center" class="slot-box">
           <div class="slot-div" v-for="(v,k) in proItemList" :key="k"><span>{{v.weightCount}}</span></div>
          </span>
          <span slot="proItemList04" slot-scope="proItemList" style="text-align: center" class="slot-box">
           <div class="slot-div" v-for="(v,k) in proItemList" :key="k"><span>{{v.unit.displayName}}</span></div>
          </span>
          <template slot='action' slot-scope="text,record">
            <div>
              <a-popconfirm title='确定要删除么?' @confirm="deleteBatch(record)">
                <a>删除</a>
              </a-popconfirm>
            </div>
          </template>
        </a-table>
      </a-tab-pane>
      <a-tab-pane tab="检测项目" key="2" forceRender>
        <a-form :form='form' v-if="decDatas.length > 0">
          <div
            class="form-wrapper"
            v-for="(item,index) in decDatas"
            :key="item.id">
            <a-form-item :label="item.item+'('+item.unit.displayName+')'">
              <a-input-number v-decorator="[
                    item.id + 'value',
                    {
                        initialValue: record.detectionVoList ? (record.detectionVoList[index] ? record.detectionVoList[index].actValue : null) : null,
                        rules: [{ required: true, message: '请输入' + item.item}],
                    }
                ]"/>
            </a-form-item>
          </div>
        </a-form>
        <div v-else style="font-size: 20px; font-weight: 800">暂无数据</div>
      </a-tab-pane>
    </a-tabs>
    <InitProVoBatch ref="InitProVoBatch" @setData='getBatchDatas' :batchDatas='recoveryDatas'></InitProVoBatch>
  </a-modal>
</template>
<script>
  import {
    addInitProDetectio,
    updateInitProDetectio,
    getIniproDetection,
    getInitProVoByPlanId
  } from '@/api/permissonApi'
  import {delpicture} from "@/api/userApi"
  import InitProVoBatch from './addnItProVoBatch'
  import moment from 'moment'
  import Vue from "vue";
  import {ACCESS_TOKEN} from "@/store/mutation-types";

  export default {
    props: {
      planDatas: {
        default() {
          return []
        },
        type: Array
      }
    },
    components: {
      InitProVoBatch
    },
    data() {
      return {
        moment,
        imgLock: true,
        activeKey: '1',
        imgUrl: '',
        imgSrc: '',
        imgDecUrl: '',
        imgDecSrc: '',
        batchDatas: [],
        loading: false,
        fileList: [],
        decFileList: [],
        relationDatas: [],
        decDatas: [],
        form: this.$form.createForm(this),
        recoveryDatas: [],
        title: '',
        visible: false,
        imgVisible: false,
        imgDecVisible: false,
        record: {},
        batchColumns: [
          {
            title: '初加工名称',
            dataIndex: 'initialName',
            key: 'initialName',
            align: "center"
          },
          {
            title: '初加工批次',
            dataIndex: 'initialProcessingCode',
            key: 'initialProcessingCode',
            align: "center"
          },
          {
            title: '产成品',
            dataIndex: 'proItemList',
            key: 'proItemList01',
            scopedSlots: {customRender: "proItemList01"},
            align: "center"
          },
          {
            title: '等级',
            dataIndex: 'proItemList',
            key: 'proItemList02',
            scopedSlots: {customRender: "proItemList02"},
            align: "center"
          },
          {
            title: '产量',
            dataIndex: 'proItemList',
            key: 'proItemList03',
            scopedSlots: {customRender: "proItemList03"},
            align: "center"
          },
          {
            title: '单位',
            dataIndex: 'proItemList',
            key: 'proItemList04',
            scopedSlots: {customRender: "proItemList04"},
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
      this.headers = {"X-Access-Token": token};
    },
    methods: {
      closeModal(){
        this.recoveryDatas=[];
      },
      open(record) {
        this.activeKey = '1'
        this.visible = true
        this.fileList = []
        this.decFileList = []
        this.imgDecUrl = ''
        this.imgDecSrc = ''
        this.imgUrl = ''
        this.imgSrc = ''
        this.form.resetFields()
        this.record = record ? record : {}
        let imgshowapi = "/api2/pictureInfo/show/"
        if (record) {
          let arr = [...record.initProVoList]
          this.batchDatas = arr
          this.decDatas = record.detectionVoList
          if (record.detectionPic) {
            this.fileList.push({
              uid: record.detectionPic.id,
              name: record.detectionPic.pictureUrl,
              status: 'done',
              url: imgshowapi + record.detectionPic.pictureUrl
            })
          }
          if (record.detectionResultPic) {
            this.decFileList.push({
              uid: record.detectionResultPic.id,
              name: record.detectionResultPic.pictureUrl,
              status: 'done',
              url: imgshowapi + record.detectionResultPic.pictureUrl
            })
          }
          getInitProVoByPlanId({
            planId: record.planId
          }).then(res => {
            if (res.success) {
              this.recoveryDatas = res.result
            }
          })
        } else {
          this.batchDatas = []
          this.decDatas = []
        }
      },
      getDec(value) {
        getInitProVoByPlanId({
          planId: value
        }).then(res => {
          if (res.success) {
            this.recoveryDatas = res.result
          }
        })
        this.planDatas.forEach(item => {
          if (item.id === value) {
            getIniproDetection({
              cropId: item.cropId
            }).then(res => {
              if (res.success) {
                this.decDatas = res.result
              }
            })
          }
        })
      },
      getBatchDatas(datas) {
        this.batchDatas = datas
      },
      addBatch() {
        this.$refs.InitProVoBatch.visible = true
        this.$refs.InitProVoBatch.rowSelection.selectedRowKeys = []
        this.recoveryDatas.forEach((item, index) => {
          for (let i = 0; i < this.batchDatas.length; i++) {
            if (item.id === this.batchDatas[i].id) {
              this.$refs.InitProVoBatch.rowSelection.selectedRowKeys.push(index)
            }
          }
        })
      },
      handleImgCancel() {
        this.imgVisible = false
      },
      handlePreview(file) {
        this.imgUrl = file.url || file.thumbUrl
        this.imgVisible = true
      },
      handleDecChanges(info) {
        if (!this.imgLock) {
          return
        }
        this.decFileList = info.fileList;
        if (info.file.response && info.file.response.result) {
          this.imgDecSrc = {
            id: info.file.response.result.id
          }
        }
      },
      handleDecPreview(file) {
        this.imgDecUrl = file.url || file.thumbUrl
        this.imgDecVisible = true
      },
      handleDecCancel() {
        this.imgDecVisible = false
      },
      handleChanges(info) {
        if (!this.imgLock) {
          return
        }
        this.fileList = info.fileList;
        if (info.file.response && info.file.response.result) {
          this.imgSrc = {
            id: info.file.response.result.id
          }
        }
      },
      beforeUpload(file) {
        const isJPG = file.type === "image/jpeg";
        const isPNG = file.type === "image/png";
        if (!(isPNG || isJPG)) {
          this.$message.error("只允许上传jpg/png格式图片");
        }
        const isLt5M = file.size / 1024 / 1024 < 5;
        if (!isLt5M) {
          this.$message.error("图片大小不能大于5M");
        }
        this.imgLock = (isJPG || isPNG) && isLt5M
        return (isJPG || isPNG) && isLt5M;
      },
      remove(file) {
        return new Promise((resolve) => {
          var that = this
          let id = file.response ? file.response.result.id : file.uid
          this.$confirm({
            title: '确定要删除该图片么',
            onCancel() {
              return resolve(false)
            },
            onOk() {
              delpicture({
                id: id
              }).then(res => {
                that.$message.info(res.message)
                if (res.success) {
                  return resolve(true)
                }
              })
            }
          })
        }).then(res => {
          return res
        })
      },
      deleteBatch(record) {
        let index
        let arr = this.batchDatas
        for (let i = 0; i < this.batchDatas.length; i++) {
          if (this.batchDatas[i].id === record.id) {
            index = i
          }
        }
        arr.splice(index, 1)
        this.batchDatas = arr
      },
      handleOk() {
        this.form.validateFieldsAndScroll((err, values) => {
          if (!err) {
            if (this.title === '新增') {
              let params = this.form.getFieldsValue()
              params.detectionTime = this.moment(params.detectionTime).format('YYYY-MM-DD')
              params.initproDetRelList = []
              params.detectionRelList = []
              params.detectionPic = this.imgSrc ? this.imgSrc : null
              this.decDatas.forEach(item => {
                params.detectionRelList.push({
                  detectionId: item.id,
                  value: params[item.id + 'value']
                })
              })
              this.batchDatas.forEach(item => {
                params.initproDetRelList.push({
                  initproId: item.id
                })
              })
              if(params.samplingCriteria.length>50){
                this.$message.warn("抽样标准填写不能超过50个字符");
                return;
              }
              if (params.initproDetRelList.length === 0) {
                this.$message.info('必须选择要检测的批次')
                return
              }
              addInitProDetectio(params).then(res => {
                this.$message.info(res.message)
                if (res.success) {
                  this.visible = false
                  this.recoveryDatas = []
                  this.$parent._loadData()
                }
              })
            } else {
              let params = this.form.getFieldsValue()
              params.initproDetRelList = []
              params.detectionRelList = []
              params.detectionTime = this.moment(params.detectionTime).format('YYYY-MM-DD')
              params.planId = typeof params.planId === "number" ? params.planId : this.record.planId
              params.id = this.record.id
              params.detectionPic = this.imgSrc ? this.imgSrc : null
              this.decDatas.forEach(item => {
                params.detectionRelList.push({
                  detectionId: item.id,
                  value: params[item.id + 'value']
                })
              })
              this.batchDatas.forEach(item => {
                params.initproDetRelList.push({
                  initproId: item.id
                })
              })
              if (params.initproDetRelList.length === 0) {
                this.$message.info('必须选择要检测的批次')
                return
              }
              updateInitProDetectio(params).then(res => {
                this.$message.info(res.message)
                if (res.success) {
                  this.visible = false
                  this.recoveryDatas = []
                  this.$parent._loadData()
                }
              })
            }
          }
        })
      },
    }
  }
</script>
<style lang="stylus">
  .slot-div
    height 30px
    line-height 30px

  .slot-div:last-child
    border-bottom 0px

  .rec-modal
    width: 900px !important

    .upload-wrapper
      overflow hidden
      height 120px
      width 120px
      margin-top 15px

      .ant-upload-list-item-info, .ant-upload-select-picture-card
        & > span
          display inline-block
          height 100%
          width 100%

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
      width 200px

    .ant-modal-body
      padding 12px

    .tab-box01 /deep/ .ant-form-item
      margin-bottom 5px

    #initalpros /deep/ .ant-table-tbody > tr > td{
      padding: 0px 0px !important;
    }

    #initalpros
      overflow: auto;
      max-height: 200px;
</style>
