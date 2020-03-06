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
        <a-form-item
          v-bind="formItemLayout"
          label="地区"
          v-if="optionss"
        >
          <a-cascader :options="options" placeholder="请选择省/市/(县，区)" @change="onChangmap" />
        </a-form-item>
    <a-form-item
      v-bind="formItemLayout"
      label="农产品名称"
    >
      <a-tree-select
        style="width:100%"
        :treeData="crops"
        @change="changeTree"
        v-decorator="[
              'produceName',
              {
                initialValue:produce.cropId ,
                rules: [{ required: true, message: '请选择农产品名称' }],
              }
            ]"
        v-if="isedit"
      >
      </a-tree-select>
      <template v-if="!isedit">{{record.produceName}}</template>
      <!--<a-input
        v-decorator="[
          'produceName',
          {
            initialValue:record.produceName,
            rules: [{ required: true, message: '请输入产品名称' }],
          }
        ]"
      v-if="isedit"
      />-->
    </a-form-item>
        <a-form-item
          v-bind="formItemLayout"
          label="所属批次"
        >
          <a-select
            v-decorator="[
          'batchId',
          {
            initialValue:base,
            rules: [{ required: true, message: '请选择所属批次' }],
          }
        ]"
            :disabled="!isedit"
          >
            <a-select-option v-for="v in baseinfo" :value="v.id" :key="v.id">{{v.batchName}}</a-select-option>
          </a-select>
        </a-form-item>
    <a-form-item
      v-bind="formItemLayout"
      label="收成时间"
    >
      <a-date-picker
        v-decorator="[
          'harvestTime',
          {
            rules: [{ required: true, message: '请输入收成时间' }],
            initialValue:moment(harvestTime, 'YYYY-MM-DD')
          }
        ]"
     v-if="isedit"
      />
      <template v-if="!isedit">{{harvestTime}}</template>
    </a-form-item>
    <a-form-item
      v-bind="formItemLayout"
      label="测试时间"
    >
      <a-date-picker
        v-decorator="[
          'testTime',
          {
            initialValue:moment(testTime, 'YYYY-MM-DD'),
            rules: [{ required: true, message: '请输入测试时间' }]
          }
        ]"
      v-if="isedit"
      />
      <template v-if="!isedit">{{testTime}}</template>
    </a-form-item>
     <a-form-item
      v-bind="formItemLayout"
      label="检测次数"
    >
      <a-input
        v-decorator="[
          'testSequence',
          {
            initialValue:record.testSequence,
            rules: [{ required: true, message: '请输入检测次数' }],

          }
        ]"
      v-if="isedit"
      />
      <template v-if="!isedit">{{record.testSequence}}</template>
    </a-form-item>
  </a-form>
    </a-modal>
  </div>
</template>
<script>
 import Vue from 'vue'
 import { ACCESS_TOKEN } from "@/store/mutation-types"

  import {pick} from 'lodash'
  import { addpro,updateUser,updateproduce,getAllBaseInfo,inputCrops,getBatchByCropId,getAllArea,getCropsByAreaCode } from '@/api/userApi'
  import moment from 'moment';
  export default {
    data() {
      return {
        optionss:false,
        areaCode:'',
        address:[],
        label:[],
        par:{},
        options: [],
        produce:{},
        initrecord:{
          baseId:null,
          cropId:null,
        },
        cropsName:'',
        cropsId:0,
        crops:[],
        isedit:true,
        base:'',
        baseinfo:[],
        record:{},
        harvestTime:'',
        testTime:'',
        loading: false,
        visible: false,
        title:"操作",
        userinfo:{},
        baseId:-1,
        dateString:'',
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
      /*inputCrops().then((res=>{
        if(res.success){
          this.crops=this.getTreeData(res.result)
        }else{
          this.$message.info(res.message)
        }
      }))*/
  },
    methods: {
      loadmap(){
        getAllArea().then((res)=>{
          console.log('地区列表................');
          console.log(res);
          for(let i=0;i<res.result.length;i++){
            var a={};
            a.value=res.result[i].id+'-'+res.result[i].name;
            a.label=res.result[i].name;
            a.children=[];
            if(res.result[i].children.length>0){
              for(let j=0;j<res.result[i].children.length;j++){
                var b={};
                b.value=res.result[i].children[j].id+'-'+res.result[i].children[j].name;
                b.label=res.result[i].children[j].name;
                b.children=[];
                if(res.result[i].children[j].children.length>0){
                  for(let k=0;k<res.result[i].children[j].children.length;k++){
                    var c={};
                    c.value=res.result[i].children[j].children[k].id+'-'+res.result[i].children[j].children[k].name;
                    c.label=res.result[i].children[j].children[k].name;
                    b.children.push(c);
                  }
                }
                a.children.push(b);
              }
            }
            this.options.push(a);
          }
        });
      },
      onChangmap(value){
        this.produceName='';
        this.form.resetFields('produceName');
        this.baseinfo=[];
        this.form.resetFields('batchId');
        this.label=[];
        this.address=[];
        this.par={};
        this.areaCode="";
        for(let i=0;i<value.length;i++){
          let a=value[i].split('-');
          this.address.push(a[1]);
          this.label.push(a[0]);
        }
        if(value.length>1){
          this.areaCode=this.label[2];
          this.par.province=this.address[0];
          this.par.provinceCode=this.label[0];
          this.par.city=this.address[1];
          this.par.cityCode=this.label[1];
          this.par.area=this.address[2];
          this.par.areaCode=this.label[2];
        }else{
          this.par.province=this.address[0];
          this.par.provinceCode=this.label[0];
          this.areaCode=this.par.provinceCode;
        }
        let params = {};
        params.areaCode=this.areaCode;
        if(this.areaCode!=null&&this.areaCode!=""){
          getCropsByAreaCode(params).then((res=>{
            if(res.success){
              this.crops=this.getTreeData(res.result)
            }else{
              this.$message.info(res.message)
            }
          }))
        }else{
          this.crops="";
          this.baseinfo="";
          this.form.resetFields();
        }
      },
      changeTree(value,label,extra){
        this.cropsId=value;
        this.cropsName=label[0];
        this.base="";
        this.form.resetFields();
        let params = {};
        params.cropId=value;
        params.areaCode=this.areaCode;
        getBatchByCropId(params).then((res=>{
          this.baseinfo=res.result;
        }))
      },
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
            item.value = data.id;
            item.key = data.id;
            return item;
          }else{
            let item = {};
            item.title = data.name;
            item.value = data.id;
            item.key = data.id;
            item.children = this.getTreeData(data.children);
            return item;

          }
        }
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
        onChange(date, dateString){
          this.dateString = dateString;
        },
        add(){
          this.optionss=true;
          this.label=[];
          this.address=[];
          this.par={};
          this.options=[];
          this.loadmap();
          this.record=this.initrecord;
          this.produce.cropId="";
          this.form.resetFields();
          /*this.base=1042;*/
          this.title="添加产品监测";
          this.edit();
          this.harvestTime=this.getNowFormatDate();
          this.testTime=this.getNowFormatDate();
        },
        look(record){
           this.title="查看详情";
          if(record!=" "&&record!=undefined){
           if(!record.avatar){
             this.tx=false
           }
           else{
             this.tx=true
           }
          }
        this.edit(record)
        },
        edit(record,a){
          this.form.resetFields();
          this.base="";
          if(a==1){
            this.optionss=false;
            if(record.batch!=null){
              this.produce.cropId=record.batch.cropId;
              this.cropsName=record.produceName;
              this.areaCode=record.batch.baseInfo.areaId;
            }
            let paramss = {};
            paramss.areaCode=this.areaCode;
            getCropsByAreaCode(paramss).then((res=>{
              if(res.success){
                this.crops=this.getTreeData(res.result)
              }else{
                this.$message.info(res.message)
              }
            }))
            let params = {};
            params.cropId=this.produce.cropId;
            params.areaCode=this.areaCode;
            getBatchByCropId(params).then((res=>{
              this.baseinfo=res.result;
            }));
          this.title="编辑产品监测";
        }
        if(this.title=="查看详情"){
          this.optionss=false;
        this.isedit=false;
          this.areaCode=record.batch.baseInfo.areaId;
          this.produce.cropId=record.batch.cropId;
          let params = {};
          params.cropId=this.produce.cropId;
          params.areaCode=this.areaCode;
          getBatchByCropId(params).then((res=>{
            this.baseinfo=res.result;
          }));
        }else{
          this.isedit=true;
        }
          if(record!=" "&&record!=undefined){
            this.harvestTime=record.harvestTime;
            this.testTime=record.testTime;
            this.record=record;
            if(record.batch!=null&&record.batch!=""){
              this.base=record.batch.id
            }
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
          }else{
            /*this.harvestTime=record.harvestTime;
            this.testTime=record.testTime;
            this.record=record*/
          }
        this.visible=true
        },
      /*handleUp(id){
          this.baseId = id;
      },*/
      handleOk(){
        if(this.title=="添加产品监测"){
           this.form.validateFieldsAndScroll((err, values) => {
        if (!err) {
         const userinfo=this.form.getFieldsValue(['testSequence','batchId']);
          userinfo.produceName=this.cropsName;
         this.getTime();
          userinfo.harvestTime=this.userinfo.harvestTime;
          userinfo.testTime=this.userinfo.testTime;
         this.form.resetFields();
          if(userinfo.batchId=="暂无所属批次信息"){
            this.$message.info("请选择所属批次")
          }else{
            addpro(userinfo).then((res=>{
              if(res.success==true){
                this.$message.info('添加成功！')
                this.form.resetFields()
                this.$parent.loadData()
                this.visible=false;
              }else{
                this.$message.info(res.message)
                this.visible=false;
              }
            }))
          }

         //this.$message.info(this.$store.state.user.addinfo)
         //console.log(this.form.getFieldsValue(['username','password','phone','sex','email']))
        }
      });
        }
        if(this.title=="编辑产品监测"){
        this.form.validateFieldsAndScroll((err, values) => {
        if (!err) {
         const userinfo=this.form.getFieldsValue(['testSequence','batchId']);
         userinfo.produceName=this.cropsName;
         this.getTime();
          userinfo.harvestTime=this.userinfo.harvestTime;
          userinfo.testTime=this.userinfo.testTime;
          this.form.resetFields();
          userinfo.id=this.record.id;
          if(userinfo.batchId=="暂无所属批次信息"){
            this.$message.info("请选择所属批次");
          }else{
            updateproduce(userinfo).then((res=>{
              if(res.success==true){
                this.$message.info(res.message)
                this.$parent.loadData()
                this.visible=false
              }else{
                this.$message.info(res.message)
              }
            }))
          }
        }
      });
        }
        if(this.title=="查看详情"){
          this.visible=false
        }
      },
      getTime(){
        this.userinfo.harvestTime=this.form.getFieldsValue(['harvestTime']).harvestTime.format('YYYY-MM-DD');
        this.userinfo.testTime=this.form.getFieldsValue(['testTime']).testTime.format('YYYY-MM-DD');
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
