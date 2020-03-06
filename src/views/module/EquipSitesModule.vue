<template>
  <div>
    <a-modal
      :title="title"
      v-model="visible"
      @ok="handleOk"
      style="top:5%;height: 90%;"
      cancelText="取消"
      :okText="okText"
      :maskClosable="false"
    >
      <a-form
        :form="form"
      >
        <template v-if="details">
          <a-form-item
            v-bind="formItemLayout"
            label="监测设备名称"
          >
            <a-input
              v-decorator="[
          'equipmentId',

          {
            initialValue:record.equipmentId,
            rules: [{ required: true, message: '请选择监测设备名称' }],
          }
        ]"
              v-if="isedit"
            />
            <template v-if="!isedit">{{record.equipment.equipmentName}}</template>
          </a-form-item>
          <a-form-item
            v-bind="formItemLayout"
            label="监测地类型"
          >
            <a-input
              v-decorator="[
          'equipmentName',

          {
            initialValue:record.equipmentName,
            rules: [{ required: true, message: '请输入监测地类型' }],
          }
        ]"
              v-if="isedit"
            />
            <template v-if="!isedit">{{this.relationType}}</template>
          </a-form-item>
          <a-form-item
            v-bind="formItemLayout"
            label="基地名称"
          >
            <a-input
              v-decorator="[
          'equipmentName',
          {
            initialValue:record.equipmentName,
            rules: [{ required: true, message: '请输入监测地类型' }],
          }
        ]"
              v-if="isedit"
            />
            <template v-if="!isedit">{{record.baseInfo.baseName}}</template>
          </a-form-item>
          <a-form-item
            v-bind="formItemLayout"
            label="地块名称"
            v-if="isShows"
          >
            <a-input
              v-decorator="[
          'equipmentName',
          {
            initialValue:record.equipmentName,
            rules: [{ required: true, message: '请输入监测地类型' }],
          }
        ]"
              v-if="isedit"
            />
            <template v-if="!isedit">{{record.lot.lotName}}</template>
          </a-form-item>
        </template>
      </a-form>
    </a-modal>
  </div>
</template>
<script>
  import Vue from 'vue'
  import moment from 'moment';
  import { ACCESS_TOKEN } from "@/store/mutation-types"
  import {pick} from 'lodash'
  import { insertEquipment,updateEquipment } from '@/api/userApi'
  export default {
    data() {
      return {
        equipmentNameAll:'',
        isShows:false,
        relationType:'',
        isedit:true,
        itiems:true,
        itiemss:false,
        dessss:false,
        detailss:false,
        isss:true,
        soliWorkId:'',
        bnames:'',
        base:'请选择基地',
        bases:'',
        baseId:-1,
        baseinfo:[],
        baseinfos:[],
        baseinfoss:[],
        record:{},
        groupDatas: [],
        loading: false,
        visible: false,
        title:"操作",
        details: true,
        detail: true,
        des: false,
        dels:false,
        okText:"",
        form: this.$form.createForm(this),
        formItemLayout: {
          labelCol: {
            xs: { span: 24 },
            sm: { span: 8 },
          },
          wrapperCol: {
            xs: { span: 24 },
            sm: { span: 16 },
          },
        },
        tailFormItemLayout: {
          wrapperCol: {
            xs: {
              span: 24,
              offset: 0,
            },
            sm: {
              span: 16,
              offset: 8,
            },
          },
        },
      }
    },
    created() {
      const token = Vue.ls.get(ACCESS_TOKEN);
    },
    methods: {
      moment,
      add(){
        this.details=true;
        this.detail=false;
        this.dels=false;
        this.detailss=false;
        this.record={}
        this.isedit=true;
        this.edit();
      },
      look(record){
        if(record.baseInfo==null){
          record.baseInfo="";
        }
        if(record.equipmentName==null){
          this.equipmentNameAll='';
        }else{
          this.equipmentNameAll=record.equipment.equipmentName;
        }
        if(record.relationType==1){
          this.relationType="基地";
          this.isShows=false;
        }else{
          this.relationType="地块";
          this.isShows=true;
        }
        if(record!=" "&&record!=undefined){
          if(!record.avatar){
            this.tx=false
          }
          else{
            this.tx=true
          }
        }
        this.isedit=false;
        this.title="查看详情";
        this.edit(record);
      },
      adds(record){
        this.detail=true;
        this.dels=false;
        this.detailss=false;
        this.title="绑定土壤所属地块";
        if(record.soilTestLotRelList.length>0){
          if(record.soilTestLotRelList[0].bname!=undefined){
            this.bnames = record.soilTestLotRelList[0].bname;
            this.baseid = record.soilTestLotRelList[0].bid;
            this.soliWorkId = record.id;
            this.edit(record);
            this.isss=false;
            this.handleChangess();
          }
        }else{
          getbaselist().then((res=>{
            this.baseinfo=res.result;
          }));
          this.edits(record);
        }
      },
      del(record){
        this.detail=false;
        this.dels=true;
        this.detailss=false;
        this.bnames = record.soilTestLotRelList[0].bname;
        this.baseid = record.soilTestLotRelList[0].bid;
        this.soliWorkId = record.id;
        this.title="解除土壤所属地块";
        this.editsss(record);
        this.handleChanges();
      },
      editsss(record){
        this.details=false;
        this.detail=false;
        this.detailss=false;
        if(record!=" "&&record!=undefined){
          this.record=record
        }
        this.visible=true
      },
      edit(record,a){
        if(a==1){
          this.title="编辑土壤检测信息";
        }
        if(this.title=="查看详情"){
          this.isedit=false;
        }else{
          this.isedit=true;
        }
        this.itiems=true;
        this.itiemss=false;
        if(record==undefined){
          this.itiems=false;
          this.itiemss=true;
          this.isedit=true;
        }
        this.details=true;
        this.detail=false;
        this.detailss=false;
        this.dels=false;
        if(record!=" "&&record!=undefined){
          this.record=record
          /*if(this.record.sex==null){
            this.record.sex=''
          }
          //console.log(record)
          let imgshowapi = '/api/upload/show'
          if(record.avatar){
          this.imageUrl=imgshowapi+'?fileName='+record.avatar
          }else{
             this.imageUrl=''
          }*/
        }
        this.visible=true
      },
      edits(record){
        this.details=false;
        this.detail=false;
        this.dels=false;
        this.detailss=true;
        if(record!=" "&&record!=undefined){
          this.record=record
          /*if(this.record.sex==null){
            this.record.sex=''
          }
          //console.log(record)
          let imgshowapi = '/api/upload/show'
          if(record.avatar){
          this.imageUrl=imgshowapi+'?fileName='+record.avatar
          }else{
             this.imageUrl=''
          }*/
        }
        this.visible=true
      },
      handleChange(id) {/*
        this.details=false;
        this.detail=false;
        this.detailss=true;
        this.dels=false;*/
        this.dessss=true;
        let parameter = new Object();
        parameter.baseId =this.baseId =id;
        getBlocksByBaseId(parameter).then((res=>{
          this.baseinfos=res.result;
          if(this.baseinfos!="") {
            this.bases=res.result[0].id;
          }else{
            this.bases=false;
          };
        }));
      },
      handleChangess() {
        this.des=true;
        let parameter = {};
        parameter.baseId =this.baseid;
        parameter.soilTestId =this.soliWorkId;
        getLotList(parameter).then((res=>{
          this.baseinfos=res.result;
          if(this.baseinfos!="") {
            this.bases=res.result[0].id;
          }else{
            this.bases=false;
          };
        }));
      },
      handleChanges(){
        let parameter = {};
        parameter.baseId =this.baseid;
        parameter.soilTestId =this.soliWorkId;
        getLotListIn(parameter).then((res=>{
          this.baseinfoss=res.result;
          if(this.baseinfoss!="") {
            this.bases=res.result[0].id;
          }else{
            this.bases=false;
          };
        }));
      },
      handleOk(){
        if(this.title=="新增监测设备"){
          this.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
              const userinfo=this.form.getFieldsValue(['equipmentId','equipmentName'])
              this.form.resetFields();
              insertEquipment(userinfo).then((res=>{
                if(res.success==true){
                  this.$message.info('添加成功！')
                  this.form.resetFields()
                  this.$parent.loadData()
                  this.visible=false;
                }else{
                  this.$message.info("已存在该监测设备id");
                }
              }))

              //this.$message.info(this.$store.state.user.addinfo)
              //console.log(this.form.getFieldsValue(['username','password','phone','sex','email']))
            }
          });
        }
        if(this.title=="编辑监测设备"){
          this.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
              const userinfo=this.form.getFieldsValue(['equipmentId','equipmentName'])
              this.form.resetFields();
              userinfo.id=this.record.id
              updateEquipment(userinfo).then((res=>{
                if(res.success==true){
                  this.$message.info(res.message)
                  this.form.resetFields()
                  this.$parent.loadData()
                  this.visible=false
                }else{
                  this.$message.info("已存在该监测设备id");
                }
              }))
            }
          });
        }
        if(this.title=="查看详情"){
          this.visible=false
        }
        if(this.title=="解除土壤所属地块"){
          this.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
              const userinfo=this.form.getFieldsValue(['lotId']);
              userinfo.id=this.record.id;
              this.form.resetFields();
              if(userinfo.lotId!="暂无地块信息"){
                delSoilLotRel(userinfo).then((res=>{
                  if(res.success==true){
                    this.$message.info('删除成功！')
                    this.form.resetFields()
                    this.visible=false;
                    this.$parent.loadData()
                  }else{
                    this.$message.info(res.message)
                    this.visible=false;
                  }
                }))
              }else {
                this.$message.info('暂无地块信息');
                this.visible=false;
              }
            }
          });

        }
      },

    }
  }

</script>
<style>
  .avatar-uploader > .ant-upload {
    width: 50px;
    height: 50px;
  }
  .ant-upload-select-picture-card i {
    font-size: 32px;
    color: #999;
  }

  .ant-upload-select-picture-card .ant-upload-text {
    margin-top: 8px;
    color: #666;
  }
</style>
