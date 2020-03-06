<template>
  <div>
    <a-modal
      title="新增"
      v-model="visible"
      @ok="handleOk"
      style="top:5%;height: 90%;"
      cancelText="取消"
      okText="确定"
      :maskClosable="false"
    >
      <a-form
        :form="form"
      >
          <!-- <a-form-item
            v-bind="formItemLayout"
            label="监控设备"
          >
          <a-select
            showSearch
          placeholder="输入关键字查询"
          optionFilterProp="children"
          :filterOption="filterOption"
              v-decorator="[
          'serialNumber',
          {
            rules: [{ required: true, message: '请选择监控设备' }],
          }
        ]"
            >
              <a-select-option v-for="(v,k) in videolist" :key="k" :value="v.value">{{v.label}}</a-select-option>
            </a-select>
          </a-form-item> -->
           <a-form-item
            v-bind="formItemLayout"
            label="监控设备编号"
          >
            <a-input
              v-decorator="[
          'serialNumber',
          {
            rules: [{ required: true, message: '请输入监控设备编号' }],
          }
        ]"
            />
          </a-form-item>
          <a-form-item
            v-bind="formItemLayout"
            label="监控设备名称"
          >
            <a-input
              v-decorator="[
          'videoName',
          {
            rules: [{ required: true, message: '请输入监控设备名称'}],
          }
        ]"
            />
          </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>
<script>
  import Vue from 'vue'
  import axios from 'axios'
  import { addVideoEquipment,getYsToken } from '@/api/ddwbApi'
  export default {
    data() {
      return {
        videolist:[],
        visible: false,
        baseList:[],
        check:false,
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
      }
    },
    created(){
    },
    methods: {
      //  filterOption(input, option) {
      //   return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
      // },
      add(){
        this.form.resetFields();     
        // this.videolist=list;
        this.visible=true;
      },
      handleOk(){
        // if(!this.check){
          this.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
              const userinfo=values;
              // for(let i=0;i<this.videolist.length;i++){
              //   if(this.videolist[i].value==userinfo.serialNumber){
              //     userinfo.videoName=this.videolist[i].label;
              //   }
              // }
              addVideoEquipment(userinfo).then((res=>{
                if(res.success==true){
                  this.$message.info(res.message)
                  this.$parent.loadData()
                  this.visible=false;
                }else{
                  this.$message.warning(res.message)
                }
              }))
            }
          }); 
        // }else{
        //   this.$message.warning('请重新输入设备编号或名称！');
        // }
      },
    }
  }

</script>
<style scoped>
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