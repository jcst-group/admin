<template>
  <div>
    <a-modal
      title="查看"
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
            label="监测设备编号"
          >
            <span>{{record.equipmentId}}</span>
          </a-form-item>
          <a-form-item
            v-bind="formItemLayout"
            label="监测设备名称"
          >
            <span>{{record.equipmentName}}</span>
          </a-form-item>
          <a-form-item
            v-bind="formItemLayout"
            label="设备所在基地"
          >
            <span>{{record.baseName}}</span>
          </a-form-item>
          <a-form-item
            v-bind="formItemLayout"
            label="设备安装地址"
          >
            <span>{{record.equipmentAddress}}</span>
          </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>
<script>
  import Vue from 'vue'
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
    methods: {
      look(record){
        this.record=record;
        this.visible=true;
      },
      handleOk(){
       this.visible=false;
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