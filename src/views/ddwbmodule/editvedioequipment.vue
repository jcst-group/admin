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
            label="监控设备编号"
          >
            <a-input
              v-decorator="[
          'serialNumber',
          {
            initialValue:record.serialNumber,
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
            initialValue:record.videoName,
            rules: [{ required: true, message: '请输入监控设备名称' }],
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
  import { updateVideoEquipment } from '@/api/ddwbApi'
  export default {
    data() {
      return {
        visible: false,
        record:{},
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
    //   check1(){
    //     let a=this.form.getFieldsValue(['equipmentId']).equipmentId;
    //     let b=this.form.getFieldsValue(['equipmentName']).equipmentName;
    //     if(a&&b){
    //       checkEquipment({equipmentId:a,equipmentName:b}).then(res=>{
    //         if(!res.success){
    //           this.$message.warning('设备编号或设备名称重复！');
    //           this.check=true;
    //         }
    //       })
    //     }
    //   },
    //   check2(){
    //     let a=this.form.getFieldsValue(['equipmentId']).equipmentId;
    //     let b=this.form.getFieldsValue(['equipmentName']).equipmentName;
    //     if(a&&b){
    //       checkEquipment({equipmentId:a,equipmentName:b}).then(res=>{
    //         if(!res.success){
    //           this.$message.warning('设备编号或设备名称重复！');
    //           this.check=true;
    //         }
    //       })
    //     }
    //   },
      edit(record){
        this.form.resetFields();
        this.record={};
        this.record=record;     
        this.visible=true;
      },
      handleOk(){
        // if(!this.check){
          this.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
              const userinfo=values;
              userinfo.id=this.record.id;
              updateVideoEquipment(userinfo).then((res=>{
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