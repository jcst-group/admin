<template>
  <div>
    <a-modal
      title="编辑"
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
          <a-form-item
            v-bind="formItemLayout"
            label="监控设备名称"
          >
          <a-select
          disabled
          showSearch
          placeholder="输入关键字查询"
          optionFilterProp="children"
          :filterOption="filterOption"
          v-decorator="[
          'serialId',
          {
              initialValue:record.value,
            rules: [{
              required: true, message: '请选择监控设备！'
            }]
          }
        ]">
              <a-select-option v-for="(v,k) in equimentlist" :value="v.id" :key="k">{{v.videoName}}</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item
            v-bind="formItemLayout"
            label="通道编号"
          >
            <a-input-number
            disabled
            style="width:100%"
              v-decorator="[
          'channelNo',
          {
              initialValue:record.channelNo,
            rules: [{ required: true, message: '请输入通道号！' }],
          }
        ]"
            />
          </a-form-item>
           <a-form-item
            v-bind="formItemLayout"
            label="通道名称"
          >
            <a-input
            style="width:100%"
              v-decorator="[
          'channelName',
          {
              initialValue:record.channelName,
            rules: [{ required: true, message: '请输入1~10位字符的通道名称！',min:0,max:10 }],
          }
        ]"
            />
          </a-form-item>
           <a-form-item
            v-bind="formItemLayout"
            label="基地"
          >
          <a-select
          showSearch
          placeholder="输入关键字查询"
          optionFilterProp="children"
          :filterOption="filterOption"
          v-decorator="[
          'baseId',
          {
              initialValue:record.baseId,
            rules: [{
              required: true, message: '请选择基地！',
            }]
          }
        ]">
              <a-select-option v-for="(v,k) in baselist" :value="v.id" :key="k">{{v.baseName}}</a-select-option>
            </a-select>
          </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>
<script>
  import Vue from 'vue'
  import { updateVideoChannel,getVideoEquipment,getALLBaseList } from '@/api/ddwbApi'
  export default {
    data() {
      return {
        visible: false,
        baselist:[],
        record:{},
        equimentlist:[],
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
       getVideoEquipment().then(res=>{
           if(res.success){
               this.equimentlist=res.result;
           }
       })
       getALLBaseList().then(res=>{
           if(res.success){
               this.baselist=res.result;
           }
       })
    },
    methods: {
        filterOption(input, option) {
        return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
      },
      edit(record){
        this.form.resetFields();
        this.record={};
        this.record=record;     
        this.visible=true;
      },
      handleOk(){
          this.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
              const userinfo=values;
              userinfo.id=this.record.idd;
              updateVideoChannel(userinfo).then((res=>{
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