<template>
  <div>
    <a-modal
      :title="title"
      v-model="visible"
      @ok="handleOk"
      :afterClose="handleClose"
      style="top:5%;height: 90%;"
      cancelText="取消"
      :okText="okText"
      :maskClosable="false"
    >
      <a-form
        :form="form"
      >
        <template>
          <a-form-item
            v-bind="formItemLayout"
            label="设备名称"
          >
            <a-select
              v-decorator="[
          'equipmentId',
          {
            initialValue:equ,
            rules: [{ required: true, message: '请选择设备名称' }],
          }
        ]"
              v-if="isedit"
            >
              <a-select-option v-for="v in equipments" :key="v.id" :value="v.id" @click="shandChangeBas(v.id)">{{v.equipmentName}}</a-select-option>
            </a-select>
            <template v-if="!isedit">{{record.equipmentId}}</template>
          </a-form-item>
          <a-form-item
            v-bind="formItemLayout"
            label="监测地类型"
          >
            <a-select
              v-model="this.name"
              v-decorator="[
                    'val',
                    {
                      initialValue:String(basesss),
                      rules: [{ required: true, message: '请选择监测地' }],
                    }
                  ]"
            >
              <a-select-option v-for="val in optionss"   :key="val.name" :value="val.id" @click="handChangez(val.id)">{{val.name}}</a-select-option>
            </a-select>
            <template v-if="!isedit">{{record.equipmentName}}</template>
          </a-form-item>
          <a-form-item
            v-bind="formItemLayout"
            label="基地名称"
          >
            <a-select
              v-decorator="[
          'baseId',
          {
            initialValue:basena,
            rules: [{ required: true, message: '请输入基地名称' }],
          }
        ]"
              v-if="isedit"
            >
              <a-select-option v-for="v in baseinfoss" :key="v.id" :value="v.id" @click="handChangeBas2(v.id)">{{v.baseName}}</a-select-option>
            </a-select>
            <template v-if="!isedit">{{record.baseInfo.baseName}}</template>
          </a-form-item>
          <a-form-item
            v-bind="formItemLayout"
            label="地块名称"
            v-if="lotShow"
          >
            <a-select
              v-decorator="[
          'lotId',
          {
            initialValue:lotna,
            rules: [{ required: true, message: '请选择地块' }],
          }
        ]"
            >
              <a-select-option v-for="v in baseinfos" :key="v.id" :value="v.id">{{v.lotName}}</a-select-option>
            </a-select>
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
  import { updateEquipmentSiteRel,insertEquipmentSiteRel,getBaseIdAndBaseName,getLotIdAndName,getEquipmentIdAndNameList,getEquipmentIdAndNameListMe,getBaseIdAndBaseNameMe,getLotIdAndNameByBaseIdMe} from '@/api/userApi'
  export default {
    data() {
      return {
        equipmentId:-1,
        valss:'',
        options:['基地', '地块'],
        optionss:[{name:'基地',id:0}, {name:'地块',id:1}],
        lotShow:false,
        vals:"",
        val:"",
        isedit:true,
        itiems:true,
        itiemss:false,
        dessss:false,
        detailss:false,
        details:true,
        isss:true,
        soliWorkId:'',
        name:'',
        bnames:'',
        basena:'',
        base:'请选择基地',
        basessss:'',
        basesss:'',
        bases:'',
        lotna:'',
        equ:'',
        baseId:-1,
        lotId:-1,
        baseinfo:[],
        baseinfos:[],
        baseinfoss:[],
        equipments:[],
        record:{},
        groupDatas: [],
        loading: false,
        visible: false,
        title:"操作",
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
        this.baseinfos="";
        this.detailss=false;
        this.details=true;
        this.basena="";
        this.detail=false;
        this.dels=false;
        this.record={}
        this.isedit=true;
        this.edit();
        this.lotna="";
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
        if(record!=" "&&record!=undefined){
          this.record=record
        }
        this.visible=true
      },
      edit(record,a){
        if(this.vals=="地块"||this.basess=="地块"){
          this.lotShow=true;
        }else{
          this.lotShow=false;
        }
        if(a==1){
          this.basena="";
          this.name=this.basesss;
          this.detailss=true;
          this.details=false;
          this.basesss="";
          this.lotShow=false;
          let parameter = {};
          if(record.equipmentId!=null){
            parameter.equipmentId=record.equipmentId;
          }else{
            parameter.equipmentId=""
          }
          getEquipmentIdAndNameListMe(parameter).then((res=>{
            this.equipments = res.result;
          }));
          record.relationType==1?this.basesss="基地":this.basesss="地块";
          record.relationType==1?this.vals=0:this.vals=1;
          this.equ = record.equipmentId;
          this.equ=Number(this.equ);
          this.name=this.basesss;
          this.title="编辑土壤检测信息";
          let param = {};
          if(record.baseInfo!=null){
            this.basena=record.baseInfo.id;
            param.baseId=record.baseInfo.id;
          }else{
            param.baseId=""
          }
          getBaseIdAndBaseNameMe(param).then((res=>{
            this.baseinfoss=res.result;
          }));
          let parameters = {};
          parameters.baseId=this.basena;
          if(this.basena!=null&&this.basena!=""&&this.basena!=undefined){
            if(record.lot!=""&&record.lot!=undefined&&record.lot!=null) {
              parameters.lotId=record.lot.id;
              getLotIdAndNameByBaseIdMe(parameters).then((res => {
                this.baseinfos = res.result;
              }));
            }
          }
          if(record.lot!=""&&record.lot!=undefined&&record.lot!=null){
            this.lotna=record.lot.id;
            this.lotShow=true;
          }
          if(this.vals==1){
            this.lotShow=true;
          }
          if(this.valss=="地块"){
            this.lotShow=true;
          }
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
        this.detail=false;
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
        this.detail=false;
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
      handChange(val){
        this.vals=val;
        if(val=="地块"){
          this.lotShow=true;
        }else{
          this.lotShow=false;
        }
        let parameter = {};
        getBaseIdAndBaseNameMe(parameter).then((res=>{
          this.baseinfoss=res.result;
          this.basena=res.result[0].id;
          let parameters = {};
          parameters.baseId=this.basena;
          if(this.lotna!=""){
            parameters.lotId=this.lotna;
          }else{
            parameters.lotId="";
          }
          getLotIdAndNameByBaseIdMe(parameters).then((res=>{
              this.baseinfos=res.result;
              this.lotna=res.result[0].id;
            }));
        }));
      },
      shandChangeBas(id){
      },
      handChangeBas(BasId){
        this.lotna="";
        if(this.vals=="地块"){
          let parameter = {};
          parameter.baseId=BasId;
          if(this.lotna!=""){
            parameter.lotId=this.lotna;
          }else{
            parameter.lotId="";
          }
          getLotIdAndNameByBaseIdMe(parameter).then((res => {
              this.baseinfos = res.result;
              this.lotna = res.result[0].id;
            }));
        }
      },
      handChangeBas2(BasId){
        this.lotna="";
        let parameter = {};
        parameter.baseId=BasId;
        if(this.lotna!=""){
          parameter.lotId=this.lotna;
        }else{
          parameter.lotId="";
        }
        getLotIdAndNameByBaseIdMe(parameter).then((res => {
            this.baseinfos = res.result;
            this.lotna = res.result[0].id;
          }));
      },
      handChangez(val){
        this.vals=val;
        if(val==1){
          this.lotShow=true;
        }else{
          let parameter = {};
          if(this.basena!=""){
            parameter.baseId=this.basena;
          }
          getBaseIdAndBaseNameMe(parameter).then((res=>{
            this.baseinfoss=res.result;
            if(this.baseinfoss!="") {
              this.bases=res.result[0].id;
            }else{
              this.bases=false;
            };
          }));
          this.lotShow=false;
        }
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
      },
      handleOk(){
        if(this.title=="新增关联数据"){
          this.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
              var userinfo=this.form.getFieldsValue(['equipmentId','baseId']);
              if(this.vals=="基地"){
                userinfo.relationType=1;
              }else if(this.vals=="地块"){
                userinfo=this.form.getFieldsValue(['lotId','equipmentId','baseId']);
                userinfo.relationType=2;
              }
              this.form.resetFields();
              console.log(userinfo);
              insertEquipmentSiteRel(userinfo).then((res=>{
                if(res.success==true){
                  this.$message.info('添加成功！');
                  this.form.resetFields();
                  this.$parent.loadData();
                  this.lotShow=false;
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
        if(this.title=="编辑关联数据"){
          this.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
              var userinfo=this.form.getFieldsValue(['equipmentId','baseId']);
              if(this.vals==0){
                userinfo.relationType=1;
              }else if(this.vals==1){
                userinfo=this.form.getFieldsValue(['lotId','equipmentId','baseId']);
                userinfo.relationType=2;
              }
              this.form.resetFields();
              userinfo.id=this.record.id;
              updateEquipmentSiteRel(userinfo).then((res=>{
                if(res.success==true){
                  this.$message.info(res.message)
                  this.form.resetFields()
                  this.$parent.loadData()
                  this.visible=false
                }else{
                  this.$message.info(res.message);
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
      handleClose(){
        this.form.resetFields();
      }
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
