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
 <!-- <template v-if="!isadd">
 <a-form-item
      v-bind="formItemLayout"
      label="商店url"
    >
    <a-input-search 
     @search="onSearch" 
     enterButton="查询" 
     size="large"
     v-decorator="[
          'shopUrl',
          {
            rules: [{
              required: true, message: '请输入商店url查询！',
            }],
          }
        ]"
        
      />
    </a-form-item> 
    </template>-->
    <template v-if="!isadd">
        <a-form-item
     v-bind="formItemLayout"
    label="商店url"
      >
        <a-input
              v-decorator="[
          'shopUrl',
          {
            initialValue:this.baseShop.shopUrl,
            rules: [{ required: true, message: '请输入商店url！' }],
          }
        ]"
      />
    </a-form-item>
    <a-form-item
     v-bind="formItemLayout"
    label="商店名称"
      >
        <a-input
              v-decorator="[
          'shopName',
          {
            initialValue:this.baseShop.shopName,
            rules: [{ required: true, message: '请输入商店名称！' }],
          }
        ]"
      />
    </a-form-item>
     <a-form-item
      v-bind="formItemLayout"
      label="是否展示"
    >
      <a-select
      v-decorator="[
          'isShow',
          {
            initialValue:this.baseShop.isShow?String(this.baseShop.isShow):'0',
            rules: [{ required: true, message: '请选择是否展示！' }],
          }
        ]"
        >
      <a-select-option value=0>不展示</a-select-option>
      <a-select-option value=1>展示</a-select-option>
  </a-select>
    </a-form-item>
    <a-form-item
     v-bind="formItemLayout"
      label="商店简介"
    >
        <a-input
              v-decorator="[
          'shopInfo',
          {
            initialValue:this.baseShop.shopInfo,
            rules: [{ required: true, message: '请输入商店简介！' }],
          }
        ]"
      />
    </a-form-item>
    </template>
    <template v-if="isadd">
    <span>该商店已经存在，是否直接绑定这个商店：</span>
    <br/>
    <span style="color:red;">{{this.shop}}</span>
    </template>
  </a-form>
    </a-modal>
  </div>
</template>
<script>
 import Vue from 'vue'
 import { ACCESS_TOKEN } from "@/store/mutation-types"

  import {pick} from 'lodash'
  import { addInfo,updateUser } from '@/api/userApi'
  import {updatebasepic,basepicDelete,shopurlcheck,addShop,updateShop,updatebaseshop} from '@/api/allapi'
  export default {
    data() {
      return {
          isadd:false,
          url:'',
        uploadData:{},
        record:{},
        loading: false,
        imageUrl: '',
        headers:{},
        avatarsrc:'',
        visible: false,
        title:"操作",
        okText:"",
        panoramaUrl:"",
        baseShop:{},
        shopid:'',
        shop:'',
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
    methods: {
      /*cancel () {
          basepicDelete({id:file.uid}).then((res=>{
          if(res.success==true){
            console.log(res);
            let message = res.message;
            this.$message.info(message);
            this.$parent.loadData();
            //console.log(result);
          }else{
            this.$message.info(res.message)
          }
        }));
        this.visible = false;
      },*/
        handleChange (info) {
      if (info.file.status === 'uploading') {
        this.loading = true
        return
      }
      if (info.file.status === 'done') {
        // Get this url from response in real world.
        //console.log(info.file.response.result.id)
        this.avatarsrc=info.file.response.result.id
        getBase64(info.file.originFileObj, (imageUrl) => {

          this.imageUrl = imageUrl
          this.loading = false
        })
      }
    },
    addshop(a){
     addShop(a).then((res)=>{
        //console.log(res);
        if(res.success){
        this.$message.info(res.message);
        this.$parent.loadData();
        this.form.resetFields();
        this.visible=false;
        }else{
            this.$message.info(res.message);
        }
     })
    },
    updateshop(a){
      updateShop(a).then((res)=>{
       if(res.success){
        this.$message.info(res.message);
        this.$parent.loadData();
        this.form.resetFields();
        this.visible=false;
        }else{
            this.$message.info(res.message);
        }
      })
    },
    bindshop(a){
      updatebaseshop(a).then((res)=>{
        if(res.success){
        this.$message.info('绑定成功！');
        this.$parent.loadData();
        this.form.resetFields();
        this.visible=false;
        }else{
            this.$message.info(res.message);
        }
      })
    },
        add(record){
          this.isadd=false;
          this.form.resetFields();
        //   this.record=record;
        //   this.uploadData.baseId=record.id;
        //   this.imageUrl='';
        //   this.title="添加全景图"
        //   this.form.resetFields('panoramaUrl');
        //   this.panoramaUrl='';
        this.record=record;
        if(record.baseShop==null){
          this.title='新增商店';
          this.okText='确认添加';
          this.baseShop={};
        }else if(record.baseShop!==null){
          this.title='修改商店';
          this.okText='确认修改';
          this.baseShop=record.baseShop;
        }
          this.visible=true;
        },
        edit(record){
          this.uploadData.baseId=record.id;
           if(record.basePanoramaList.length>0){
          this.title="编辑全景图"
          this.form.resetFields('panoramaUrl');
          this.panoramaUrl='';
          
           if(record!=" "&&record!=undefined){
            this.record=record
            let imgshowapi = '/api/upload/show'
            if(record.basePanoramaList.length>0){
            this.imageUrl=imgshowapi+'?fileName='+record.basePanoramaList[0].picUrl;
            this.panoramaUrl=record.basePanoramaList[0].panoramaUrl;
            }else{
               this.imageUrl='';
               this.panoramaUrl='';
            }
          }
          this.visible=true
           }else{
             //this.$message.info("暂无全景图信息,请先添加！")
          this.record=record;
          //this.uploadData.baseId=record.id;
          this.imageUrl='';
          this.title="添加全景图"
          this.form.resetFields('panoramaUrl');
          this.panoramaUrl='';
          this.visible=true;
           }
        },
      handleOk(){
                this.form.validateFieldsAndScroll((err, values) => {
              if (!err) {
               const userinfo=this.form.getFieldsValue(['shopUrl','shopName','isShow','shopInfo']);
                if(this.title=='新增商店'){
               shopurlcheck({url:userinfo.shopUrl}).then((res)=>{
                   if(res.success){
                       userinfo.baseInfo={id:this.record.id};
                    this.addshop(userinfo);
                   }else{
                     this.shopid=res.result.id;
                     this.shop=res.result.shopUrl;
                     this.title='绑定商店';
                     this.okText='确认绑定';
                     this.isadd=true;
                     this.form.resetFields();
                     //this.visible=false;
                     //this.$message.info('该商店已经存在，请直接绑定！');
                   }
               }) 
               }else if(this.title=='修改商店'){
                       userinfo.id=this.record.baseShop.id;
                       if(userinfo.shopUrl==this.baseShop.shopUrl){
                       this.updateshop(userinfo);
                       }else{
                          shopurlcheck({url:userinfo.shopUrl}).then((res)=>{
                       if(res.success){
                         this.updateshop(userinfo);
                       }else{
                       this.shopid=res.result.id;
                       this.shop=res.result.shopUrl;
                       this.title='绑定商店';
                       this.okText='确认绑定';
                       this.isadd=true;
                       this.form.resetFields();
                      // this.visible=false;
                       //this.$message.info('该商店已经存在，请直接绑定！');
                   }
               }) 
                       }
                     }
                     else{
                       let a={};
                       a.baseId=this.record.id;
                       a.shopId=this.shopid;
                       this.bindshop(a);
                     }

                     }
                })
               
              
    //     if(this.title=="添加全景图"){
    //        this.form.validateFieldsAndScroll((err, values) => {
    //     if (!err) {
    //      const userinfo=this.form.getFieldsValue(['panoramaUrl'])
    //      userinfo.id = this.avatarsrc;
    //       updatebasepic(userinfo).then((res=>{
    //         if(res.success==true){
    //           this.$message.info('添加成功！')
    //            this.form.resetFields('panoramaUrl');
    //            this.$parent.loadData();
    //           this.visible=false;
    //         }else{
    //           this.$message.info(res.message)
    //           this.visible=false;
    //         }
    //       }))
    //     }
    //   });
    //     }
    //     if(this.title=="编辑全景图"){
    //     this.form.validateFieldsAndScroll((err, values) => {
    //     if (!err) {
    //      const userinfo=this.form.getFieldsValue(['panoramaUrl'])
    //      if(this.avatarsrc){
    //        userinfo.id=this.avatarsrc
    //      }else{
    //        userinfo.id = this.record.basePanoramaList[0].id;
    //      }
    //       updatebasepic(userinfo).then((res=>{
    //         if(res.success==true){
    //           this.$message.info('修改成功！')
    //            this.form.resetFields('panoramaUrl');
    //            this.$parent.loadData();
    //           this.visible=false;
    //         }else{
    //           this.$message.info(res.message)
    //           this.visible=false;
    //         }
    //       }))
    //     }
    //   });
    //     }
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

