<template>
  <div>
    <div class="all_1">
    <a-modal
      title="编辑"
      v-model="visible"
      @ok="handleOk"
      @cancel="delNewPic"
      :confirmLoading="confirmLoading"
      okText="保存"
      cancelText="取消"
      :maskClosable="false"
      style="min-width:800px;"
      >
       <a-form :form="form">
        <a-row :gutter="16">
        <a-form-item
          label="作物名称"
          v-bind="formItemLayout"
        >
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
        </a-row>
        <a-row :gutter="16">
        <a-form-item
          label="拼音码"
          v-bind="formItemLayout"
        >
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
        </a-row>
        <a-row :gutter="16">
            <a-form-item
              label="计量单位"
              v-bind="formItemLayout">
              <a-select
                v-decorator="['calId', {
                  initialValue: record.calId,
                  rules: [{
                    required: true, message: '请选择单位'
                  }]
                }]"
                style="width: 100%">
                    <a-select-option 
                        v-for="item in unitDatas"
                        :key="item.id"
                        :value='item.id'>
                        {{item.unit}}
                    </a-select-option>
                </a-select>
            </a-form-item>
        </a-row>
    <a-row :gutter="16" style="position: relative">
      <a-form-item
        label="作物描述"
        v-bind="formItemLayout">
        <a-textarea
          :maxlength='290'
          :autosize='{minRows: 9, maxRows: 9}'
          placeholder="输入作物描述"
          v-decorator="[
            'describe',
            {
              initialValue:record.describe
            }
          ]"
          style="width: 100%">
        </a-textarea>
      </a-form-item>
      <a-upload
        style="position: absolute;bottom: 24px;left: 200px;"
        name="file"
        action="/api2/pictureInfo/addCropPic"
        :data='cropPicId'
        listType="picture-card"
        :fileList="mfileList"
        @preview="mhandlePreview"
        :headers="headers"
        :beforeUpload="beforeUpload"
        @change="mhandleChange"
        :remove="removempic"
      >
        <div v-if="mfileList.length < 3">
          <a-icon type="plus" />
          <div class="ant-upload-text">作物图片</div>
        </div>
      </a-upload>
      <a-modal :visible="mpreviewVisible" :footer="null" @cancel="mhandleCancel">
        <img alt="example" style="width: 100%" :src="mpreviewImage" />
      </a-modal>
    </a-row>
    <a-row :gutter="16" style="position: relative">
      <a-form-item
        label="食用价值"
        v-bind="formItemLayout">
        <a-textarea
          :maxlength='290'
          :autosize='{minRows: 9, maxRows: 9}'
          placeholder="输入食用价值"
          v-decorator="[
            'edibleValue',
            {
              initialValue:record.edibleValue
            }
          ]"
          style="width: 100%"
        >
        </a-textarea>
      </a-form-item>
      <a-upload
        style="position: absolute;bottom: 24px;left: 200px;"
        name="file"
        action="/api2/pictureInfo/addEdibleValuePic"
        :data='cropPicId'
        listType="picture-card"
        :fileList="efileList"
        @preview="ehandlePreview"
        :headers="headers"
        :beforeUpload="beforeUpload"
        @change="ehandleChange"
        :remove="removeepic">
        <div v-if="efileList.length < 3">
          <a-icon type="plus" />
          <div class="ant-upload-text">食用价值图片</div>
        </div>
      </a-upload>
      <a-modal :visible="epreviewVisible" :footer="null" @cancel="ehandleCancel">
        <img alt="example" style="width: 100%" :src="epreviewImage" />
      </a-modal>
    </a-row>
    <a-row :gutter="16" style="position: relative">
      <a-form-item
        label="作物价值"
        v-bind="formItemLayout">
        <a-textarea
          :maxlength='290'
          :autosize='{minRows: 9, maxRows: 9}'
          placeholder="输入作物价值"
          v-decorator="[
            'medicinalValue',
            {
              initialValue:record.medicinalValue
            }
          ]"
          style="width: 100%">
        </a-textarea>
      </a-form-item>
      <a-upload
        style="position: absolute;bottom: 24px;left: 200px;"
        name="file"
        action="/api2/pictureInfo/addMedicinalValuePic"
        :data='cropPicId'
        listType="picture-card"
        :fileList="yfileList"
        :beforeUpload="beforeUpload"
        @preview="yhandlePreview"
        :headers="headers"
        @change="yhandleChange"
        :remove="removeypic">
        <div v-if="yfileList.length < 3">
          <a-icon type="plus" />
          <div class="ant-upload-text">作物价值图片</div>
        </div>
      </a-upload>
      <a-modal :visible="ypreviewVisible" :footer="null" @cancel="yhandleCancel">
        <img alt="example" style="width: 100%" :src="ypreviewImage" />
      </a-modal>
    </a-row>
        <a-button type="primary" icon="plus" @click="addcaishou">新增采收品</a-button>
      </a-form>
       <br/>
       <a-table :pagination="false" :columns="columns" :dataSource="data"  :rowKey="record=>record.key" bordered>
    <template slot="harvestedName" slot-scope="text, record">
        <a-input
          style="margin: -5px 0"
          :value="text"
          @change="e => handleChange(e.target.value, record.key, 'harvestedName')"
        />
    </template>
     <template slot="type" slot-scope="text, record">
       <a-select
         style="width:100%;"
         :value="text"
         @change="e=> handleChange(e,record.key,'type')"
         >
              <a-select-option v-for="(v,k) in type" :value="v.code" :key="k">{{v.displayName}}</a-select-option>
      </a-select>
    </template>
     <template slot="describe" slot-scope="text, record">
       <a-input
          style="margin: -5px 0"
          :value="text"
          @change="e => handleChange(e.target.value, record.key, 'describe')"
        />
    </template>
    <span slot="ation" slot-scope="text, record">
       <!-- <span><a href="javascript:;" @click="addcanchengpin(record)">产成品管理</a></span>
       <a-divider type="vertical" /> -->
       <span><a-popconfirm title="删除后将无法恢复，确定删除吗？" @confirm="delcsp(record)" okText="确定" cancelText="取消">
          <a href="javascript:;">删除</a>
        </a-popconfirm></span> 
        
    </span>
     <!-- <span slot="ation" slot-scope="text, record">
        <a href="javascript:;" @click="addcanchengpin(record)">添加产成品</a>
        <a-popconfirm title="删除后将无法恢复，确定删除吗？" @confirm="delcsp(record)" okText="确定" cancelText="取消">
          <a href="javascript:;">删除采收品</a>
        </a-popconfirm>
    </span> -->
  </a-table>
   <!-- <a-modal
      title="添加产成品"
      v-model="visible2"
      @ok="handleOk2"
      okText="确定"
      cancelText="取消"
      style="min-width:700px;"
      :maskClosable="false"
      >
      <a-button style="margin-bottom:10px;" type="primary" icon="plus" @click="addcanchen">新增产成品</a-button>
       <a-table :pagination="false"  :columns="columns1" :dataSource="data1"  :rowKey="record=>record.id" bordered>
    <template v-for="col in ['productName', 'level','describe']" :slot="col" slot-scope="text, record">
      <div :key="col">
        <a-input
          style="margin: -5px 0"
          :value="text"
          @change="e => handleChange1(e.target.value, record.id, col)"
        />
      </div>
    </template>
     <span slot="ation1" slot-scope="text, record">
          <a href="javascript:;" @click="delccp(record.id)">删除</a>
    </span>
  </a-table>
       </a-modal> -->
    </a-modal>
    </div>
  </div>
</template>
<script>
  import Vue from 'vue'
  import { ACCESS_TOKEN } from "@/store/mutation-types"
  import { editCrop,delPic,getPucType,delCsp,getAllUnit } from '@/api/ddwbApi'

export default {
  data(){
    return{
      unitDatas: [],
      columns:[{
  title:()=>{
          return(
            <div>
              <span style='color:red;margin-right:5px'>*</span>
              <span>采收品名称</span>
            </div>
          )
        },
  key:'harvestedName',
  dataIndex: 'harvestedName',
  width: '20%',
  scopedSlots: { customRender: 'harvestedName' },
}, {
  title:()=>{
          return(
            <div>
              <span style='color:red;margin-right:5px'>*</span>
              <span>采收品类型</span>
            </div>
          )
        },
  key:'type',
  dataIndex: 'type',
  width: '20%',
  scopedSlots: { customRender: 'type' },
}, {
  title: '采收品描述',
  key:'describe',
  dataIndex: 'describe',
  width: '30%',
  scopedSlots: { customRender: 'describe' },
}, {
  title:'操作',
  key:'ation',
  dataIndex:'ation',
  align:'center',
  width:'30%',
  scopedSlots:{ customRender: 'ation' },
}],
      data:[],
      columns1:[{
  title:()=>{
          return(
            <div>
              <span style='color:red;margin-right:5px'>*</span>
              <span>产成品名称</span>
            </div>
          )
        },
  key:'productName',
  dataIndex: 'productName',
  width: '25%',
  scopedSlots: { customRender: 'productName' },
}, {
  title:()=>{
          return(
            <div>
              <span style='color:red;margin-right:5px'>*</span>
              <span>产成品等级</span>
            </div>
          )
        },
  key:'level',
  dataIndex: 'level',
  width: '25%',
  scopedSlots: { customRender: 'level' },
}, {
  title: '产成品描述',
  key:'describe',
  dataIndex: 'describe',
  width: '40%',
  scopedSlots: { customRender: 'describe' },
}, {
  title:'操作',
  key:'ation1',
  dataIndex:'ation1',
  width:'10%',
  scopedSlots:{ customRender: 'ation1' },
}],
      data1:[],
      dataindex:0,
      dataindex1:0,
      nowcaishoupingid:'',
      cropPicId: {},
      visible1:false,
      visible2:false,
       cropPic:'',
       ediblePic:'',
       medicinalPic:'',
       visible:false,
       confirmLoading:false,
       mfileList:[],
       mpreviewVisible:false,
       mpreviewImage:'',
       efileList:[],
       epreviewVisible:false,
       epreviewImage:'',
       yfileList:[],
       ypreviewVisible:false,
       ypreviewImage:'',
       headers:{},
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
      formItemLayout1: {
        labelCol: {
          xs: { span: 24},
          sm: { span: 8 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 16 },
        },
      },
      form: this.$form.createForm(this),
      type:[],
      record:{},
      newpic:[],
    }
  },
  created(){
    const token = Vue.ls.get(ACCESS_TOKEN);
    this.headers = {"X-Access-Token":token};
    getPucType().then(res=>{
      if(res.success){
        this.type=res.result;
      }
    })
    getAllUnit().then(res => {
      if (res.success) {
        this.unitDatas = res.result
      }
    })
  },
  methods:{
    delccp(id){
      let bb=[];
      for(let i=0;i<this.data1.length;i++){
        if(this.data1[i].id!=id){
          bb.push(this.data1[i]);
        }
      }
      this.data1=bb;
    },
    delcsp(record){
      if(record.id!==undefined){
        delCsp({id:record.id}).then(res=>{
          if(res.success){
            this.$message.success("删除成功！");
            let aa=[];
            for(let i=0;i<this.data.length;i++){
              if(this.data[i].id!=record.id){
                aa.push(this.data[i]);
              }
            }
            this.data=aa;
          }else{
            this.$message.warning("无法删除！");
          }
        })
      }else{
      let bb=[];
      for(let i=0;i<this.data.length;i++){
        if(this.data[i].key!=record.key){
          bb.push(this.data[i]);
        }
      }
      this.data=bb;
      }
    },
    handleChange (value, key, column) {
      const newData = [...this.data]
      const target = newData.filter(item => key === item.key)[0]
      if (target) {
        target[column] = value
        this.data = newData
      }
    },
     handleChange1 (value, key, column) {
      const newData1 = [...this.data1]
      const target1 = newData1.filter(item => key === item.id)[0]
      if (target1) {
        target1[column] = value
        this.data1 = newData1
      }
    },
    handleOk2(){
      for(let i=0;i<this.data.length;i++){
        if(this.data[i].id==this.nowcaishoupingid){
          this.data[i].cropProductList=this.data1;
        }
      }
       this.visible2=false;
    },
    mhandlePreview(file){
      this.mpreviewImage = file.url || file.thumbUrl
      this.mpreviewVisible = true
    },
    mhandleChange(info){
      if(info.file.status === 'uploading'){
        this.mfileList=info.fileList;
        return
      }
      if (info.file.status === 'done') {
        this.$message.success('图片上传成功')
        this.newpic.push(info.file.response.result.id);
        this.cropPic=info.file.response.result.id
      }
    },
    removempic(file){
        // let delid='';
        // if(this.cropPic){
        //   delid = this.cropPic;
        //   let a = this.newpic.indexOf(delid);
        //   delete this.newpic[a];
        // } else {
        //   delid = file.uid;
        // }
        let delId = file.response ? file.response.result.id : file.uid
        if (!delId) return
        delPic({
          id: delId
        }).then(res=>{
          if(res.success){
            this.mfileList = this.mfileList.filter(item => {
              let id = item.response ? item.response.result.id : item.uid 
              return id !== delId
            })
            this.$message.success(res.message);
            this.cropPic='';
            this.$parent.loadData();
            return true;
          }
        })
    },
    mhandleCancel(){
       this.mpreviewVisible = false;
    },
     ehandlePreview(file){
      this.epreviewImage = file.url || file.thumbUrl
      this.epreviewVisible = true
    },
    ehandleChange(info){
      if(info.file.status === 'uploading'){
        this.efileList=info.fileList;
        return
      }
      if (info.file.status === 'done') {
        this.$message.success('图片上传成功')
        this.newpic.push(info.file.response.result.id);
        this.ediblePic=info.file.response.result.id
      }
    },
    removeepic(file){
      //  let delid='';
      //  if(this.ediblePic){
      //    delid=this.ediblePic;
      //     let a=this.newpic.indexOf(delid);
      //    delete this.newpic[a];
      //  }else{
      //    delid=file.uid;
      //  }
      let delId = file.response ? file.response.result.id : file.uid
      if (!delId) return
      delPic({
        id: delId
      }).then(res=>{
        if(res.success){
          this.efileList = this.efileList.filter(item => {
            let id = item.response ? item.response.result.id : item.uid 
            return id !== delId
          })
          this.$message.success(res.message);
          this.cropPic='';
          this.$parent.loadData();
          return true;
        }
      })
    },
    ehandleCancel(){
       this.epreviewVisible = false;
    },

    yhandlePreview(file){
      this.ypreviewImage = file.url || file.thumbUrl
      this.ypreviewVisible = true
    },
    yhandleChange(info){
      if(info.file.status === 'uploading'){
        this.yfileList=info.fileList;
        return
      }
      if (info.file.status === 'done') {
        this.$message.success('图片上传成功')
        this.newpic.push(info.file.response.result.id);
        this.medicinalPic=info.file.response.result.id
      }
    },
    removeypic(file){
      //  let delid='';
      //  if(this.medicinalPic){
      //    delid=this.medicinalPic;
      //     let a=this.newpic.indexOf(delid);
      //    delete this.newpic[a];
      //  }else{
      //    delid=file.uid;
      //  }
      let delId = file.response ? file.response.result.id : file.uid
      if (!delId) return
      delPic({
        id: delId
      }).then(res=>{
        if(res.success){
          this.yfileList = this.yfileList.filter(item => {
            let id = item.response ? item.response.result.id : item.uid 
            return id !== delId
          })
          this.$message.success(res.message);
          this.cropPic='';
          this.$parent.loadData();
          return true;
        }
      })
    },
    yhandleCancel(){
       this.ypreviewVisible = false;
    },
    // delAllPic(){
    //   if(this.cropPic){
    //      delPic({id:this.cropPic}).then(res=>{
    //      if(res.success){
    //        this.cropPic='';
    //      }
    //    })
    //   }
    // },
    delNewPic(){
      this.$parent.loadData();
    },
    beforeUpload (file) {
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
    addcaishou(){
      this.data.push({key:this.dataindex});
      this.dataindex++;
    },
    addcanchen(){
          this.data1.push({id:this.dataindex1});
          this.dataindex1++;
    },
    addcanchengpin(record){
        this.nowcaishoupingid=record.id;
        if(record.cropProductList.length>0){
          let aalist=[];
          for(let i=0;i<record.cropProductList.length;i++){
            aalist.push(record.cropProductList[i].id);
          }
          this.dataindex1=Math.max.apply(null, aalist)+1;
          this.data1=record.cropProductList;
        }else{
          this.dataindex1=0;
          this.data1=[];
        }
        this.visible2=true;
    },

    edit(record){
      this.newpic=[];
      this.form.resetFields();
      this.record={};
      this.record=record;
      this.cropPicId = {recordId: record.id}
      this.data=[];
      this.data=record.harvestedProductList;
      this.dataindex=0;
      // let aalist=[];
      for(let i=0;i<this.data.length;i++){
              this.data[i].type=this.data[i].type.code;
              this.data[i].key=this.dataindex;
              this.dataindex++;
              // aalist.push(this.data[i].key);
            }
      // this.dataindex=Math.max.apply(null, aalist)+1;
      this.mfileList=[];
      this.efileList=[];
      this.yfileList=[];
      this.cropPic='';
      this.ediblePic='';
      this.medicinalPic='';
       if(record.cropPicList){
        record.cropPicList.forEach(item => {
          this.mfileList.push({
            uid: item.id,
            name: item.pictureUrl,
            status:'done',
            url: '/api2/pictureInfo/show/' + item.pictureUrl
          })
        })
        this.cropPic='';
       }else{
         this.cropPic='';
       }
       if(record.ediblePicList){
         record.ediblePicList.forEach(item => {
           this.efileList.push({
              uid: item.id,
              name: item.pictureUrl,
              status:'done',
              url: '/api2/pictureInfo/show/' + item.pictureUrl
            })
         })
        this.ediblePic='';
       } else {
         this.ediblePic='';
       }
      if(record.medicinalPicList){
        record.medicinalPicList.forEach(item => {
          this.yfileList.push({
            uid: item.id,
            name: item.pictureUrl,
            status:'done',
            url: '/api2/pictureInfo/show/' + item.pictureUrl
          })
        })
        this.medicinalPic='';
      }else{
        this.medicinalPic='';
      }
      this.visible=true;
    },
    handleOk(){
        this.form.validateFields((err, values) => {
          if(!err){
            let par = values;
            if(this.cropPic){
            par.cropPic={id:this.cropPic};
            }
            else{
              par.cropPic=null;
            }
            if(this.ediblePic){
            par.ediblePic={id:this.ediblePic};
            }else{
              par.ediblePic=null
            }
            if(this.medicinalPic){
            par.medicinalPic={id:this.medicinalPic};
            }else{
              par.medicinalPic=null;
            }
            par.harvestedProductList=this.data;
            par.id=this.record.id;
            editCrop(par).then(res=>{
              if(res.success){
                this.$message.success(res.message);
                this.$parent.loadData();
                this.visible=false;
              }else{
                this.$message.warning(res.message);
              }
            })
          }
        });
    },
  },
}
</script>
<style scoped>
.all_1{
  width:100%;
  overflow-y: auto;
}
</style>
