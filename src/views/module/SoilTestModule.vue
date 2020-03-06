/*
*   土壤检测添加模块
*/
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
          label="有机质含量%"
        >
          <a-input
            v-decorator="[
          'organicMaterial',

          {
            initialValue:record.organicMaterial,
            rules: [{ required: true, message: '请输入有机质含量%' }],
          }
        ]"
           v-if="isedit"
      />
      <template v-if="!isedit">{{record.organicMaterial}}</template>
        </a-form-item>
        <a-form-item
          v-bind="formItemLayout"
          label="氮含量(mg/kg)"
        >
          <a-input
            v-decorator="[
          'nitrogen',

          {
            initialValue:record.nitrogen,
            rules: [{ required: true, message: '请输入氮含量(mg/kg)' }],
          }
        ]"
         v-if="isedit"
      />
      <template v-if="!isedit">{{record.nitrogen}}</template>
        </a-form-item>
        <a-form-item
          v-bind="formItemLayout"
          label="磷含量(mg/kg)"
        >
          <a-input
            v-decorator="[
          'phosphorus',
          {
            initialValue:record.phosphorus,
            rules: [{ required: true, message: '请输入磷含量(mg/kg)' }],

          }
        ]"
          v-if="isedit"
      />
      <template v-if="!isedit">{{record.phosphorus}}</template>
        </a-form-item>
          <a-form-item
            v-bind="formItemLayout"
            label="钾含量(mg/kg)"
          >
            <a-input
              v-decorator="[
          'potassium',
          {
            initialValue:record.potassium,
            rules: [{ required: true, message: '请输入钾含量(mg/kg)' }],

          }
        ]"
            v-if="isedit"
      />
      <template v-if="!isedit">{{record.potassium}}</template>
          </a-form-item>
        <a-form-item
          v-bind="formItemLayout"
          label="微量元素含量(mg/kg)"
        >
          <a-input
            v-decorator="[
          'microelement',
          {
            initialValue:record.microelement,
            rules: [{ required: true, message: '请输入微量元素含量(mg/kg)' }],

          }
        ]"
          v-if="isedit"
      />
      <template v-if="!isedit">{{record.microelement}}</template>
        </a-form-item>
        <a-form-item
          v-bind="formItemLayout"
          label="检测时间"
          v-if="itiems"
        >
          <a-date-picker
            v-decorator="[
          'testTime',
          {
            initialValue:moment(record.testTime, 'YYYY-MM-DD'),
            rules: [{ required: true, message: '请输入检测时间' }],

          }
        ]"
          v-if="isedit"
      />
      <template v-if="!isedit">{{record.testTime}}</template>
        </a-form-item>
          <a-form-item
            v-bind="formItemLayout"
            label="检测时间"
            v-if="itiemss"
          >
            <a-date-picker
              v-decorator="[
          'testTime',
          {
            initialValue:record.testTime,
            rules: [{ required: true, message: '请输入检测时间' }],

          }
        ]"
           v-if="isedit"
      />
      <template v-if="!isedit">{{record.testTime}}</template>
          </a-form-item>
        <a-form-item
          v-bind="formItemLayout"
          label="备注"
        >
          <a-input
            v-decorator="[
          'remark',
          {
            initialValue:record.remark,
          }
        ]"
          v-if="isedit"
      />
      <template v-if="!isedit">{{record.remark}}</template>
        </a-form-item>
        </template>
        <template v-if="detail">
          <a-form-item
            v-bind="formItemLayout"
            label="所属基地"
          >
          <template>{{this.bnames}}</template>
          </a-form-item>
          <a-form-item
            v-bind="formItemLayout"
            label="地块"
          >
            <a-select
              v-decorator="[
          'lotId',
          {
            initialValue:Number(bases)?Number(bases):'暂无地块信息',
            rules: [{ required: true, message: '请选择地块' }],
          }
        ]"
            >
              <a-select-option v-for="v in baseinfos" :key="v.id" :value="v.id">{{v.lotName}}</a-select-option>
            </a-select>
          </a-form-item>
        </template>
        <template v-if="dels">
          <a-form-item
            v-bind="formItemLayout"
            label="所属基地"
          >
            <template>{{this.bnames}}</template>
          </a-form-item>
          <a-form-item
            v-bind="formItemLayout"
            label="地块"
          >
            <a-select
              v-decorator="[
          'lotId',
          {
            initialValue:Number(bases)?Number(bases):'暂无地块信息',
            rules: [{ required: true, message: '请选择地块' }],
          }
        ]"
            >
              <a-select-option v-for="v in baseinfoss" :key="v.id" :value="v.id">{{v.lotName}}</a-select-option>
            </a-select>
          </a-form-item>
        </template>
        <template v-if="detailss">
          <a-form-item
            v-bind="formItemLayout"
            label="所属基地"
          >
            <a-select
              v-decorator="[
          'baseName',
          {
            initialValue:String(base),
            rules: [{ required: true, message: '请选择基地' }],
          }
        ]"
            >
              <a-select-option v-for="v in baseinfo" :key="v.id" :value="v.id" @click="handleChange(v.id)">{{v.baseName}}</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item
            v-bind="formItemLayout"
            label="地块"
            v-if="dessss"
          >
            <a-select
              v-decorator="[
          'lotId',
          {
            initialValue:Number(bases)?Number(bases):'暂无地块信息',
            rules: [{ required: true, message: '请选择地块' }],
          }
        ]"
            >
              <a-select-option v-for="v in baseinfos" :key="v.id" :value="v.id">{{v.lotName}}</a-select-option>
            </a-select>
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
  import { updateSoilTest,insertSoilTest,insertSoilTestLotRel,getbaselist,getLotList,getLotListIn,delSoilLotRel,getBlocksByBaseId } from '@/api/userApi'
  export default {
    data() {
      return {
        isedit:true,
        itiems:true,
        itiemss:false,
        dessss:true,
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
        this.title="添加土壤检测信息";
        this.edit();
      },
      look(record){
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
          if(record.soilTestLotRelList.length==0){
              this.base="请选择基地";
              this.dessss=false;
          }
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
        if(record.soilTestLotRelList.length==0){
          this.$message.info('请先绑定所属地块');
        }else{
          this.bnames = record.soilTestLotRelList[0].bname;
          this.baseid = record.soilTestLotRelList[0].bid;
          this.soliWorkId = record.id;
          this.title="解除土壤所属地块";
          this.editsss(record);
          this.handleChanges();
        }
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
        this.form.resetFields();
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
        if(this.title=="添加土壤检测信息"){
          this.details=true;
          this.detail=false;
          this.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
              const userinfo=this.form.getFieldsValue(['organicMaterial','nitrogen','phosphorus','potassium','microelement','testTime','lotName','remark'])
              this.form.resetFields();
              console.log(userinfo);
              insertSoilTest(userinfo).then((res=>{
                if(res.success==true){
                  this.$message.info('添加成功！')
                  this.form.resetFields()
                  this.$parent.loadData()
                  this.visible=false;
                }else{
                  this.$message.info(res.message)
                }
              }))

              //this.$message.info(this.$store.state.user.addinfo)
              //console.log(this.form.getFieldsValue(['username','password','phone','sex','email']))
            }
          });
        }
        if(this.title=="编辑土壤检测信息"){
          this.details=true;
          this.detail=false;
          this.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
              const userinfo=this.form.getFieldsValue(['organicMaterial','nitrogen','phosphorus','potassium','microelement','testTime','lotName','remark'])
              userinfo.testTime=userinfo.testTime.format('YYYY-MM-DD');
              this.form.resetFields();
              userinfo.id=this.record.id
              updateSoilTest(userinfo).then((res=>{
                if(res.success==true){
                  this.$message.info(res.message)
                  this.form.resetFields()
                  this.$parent.loadData()
                  this.visible=false
                }else{
                  this.$message.info(res.message)
                }
              }))
            }
          });
        }
        if(this.title=="绑定土壤所属地块"){
          this.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
              const userinfo=this.form.getFieldsValue(['lotId']);
              userinfo.soilTestId=this.record.id;
              this.form.resetFields();
              if(this.dessss==false){
                this.$message.info('请选择所属基地');
              }else{
                if(userinfo.lotId!="暂无地块信息"){
                  insertSoilTestLotRel(userinfo).then((res=>{
                    if(res.success==true){
                      this.$message.info('添加成功！')
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
                  this.visible=true;
                }
              }
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
