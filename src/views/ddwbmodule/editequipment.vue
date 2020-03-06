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
            label="监测设备编号"
          >
            <a-input
            disabled
              v-decorator="[
          'equipmentId',
          {
            initialValue:record.equipmentId,
            rules: [{ required: true, message: '请输入监测设备' }],
          }
        ]"
            />
          </a-form-item>
          <a-form-item
            v-bind="formItemLayout"
            label="监测设备名称"
          >
            <a-input
              v-decorator="[
          'equipmentName',

          {
            initialValue:record.equipmentName,
            rules: [{ required: true, message: '请输入监测设备名称' }],
          }
        ]"
            />
          </a-form-item>
          <a-form-item
            v-bind="formItemLayout"
            label="设备所在基地"
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
            rules: [{ required: true, message: '请选择设基地' }],
          }
        ]"
            >
              <a-select-option v-for="(v,k) in baseList" :key="k" :value="v.id">{{v.baseName}}</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item
            v-bind="formItemLayout"
            label="设备安装地址"
          >
            <a-input
              v-decorator="[
          'equipmentAddress',
          {
            initialValue:record.equipmentAddress,
            rules: [{ required: true, message: '请输入设备安装地址' }],
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
  import { updateEquipment,getALLBaseList } from '@/api/ddwbApi'
  export default {
    data() {
      return {
        visible: false,
        baseList:[],
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
    created() {
        getALLBaseList().then(res=>{
            if(res.success){
                this.baseList=res.result;
            }
        })
    },
    methods: {
      filterOption(input, option) {
        return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
      },
      edit(record){
        this.form.resetFields();
        this.record=record;
        this.visible=true; 
      },
      handleOk(){
          this.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
              const userinfo=this.form.getFieldsValue(['equipmentId','equipmentName','baseId','equipmentAddress'])
              userinfo.id=this.record.id
              updateEquipment(userinfo).then((res=>{
                if(res.success==true){
                  this.$message.info(res.message)
                  this.$parent.loadData()
                  this.visible=false
                }else{
                  this.$message.info(res.message);
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