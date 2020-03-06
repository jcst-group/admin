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
            label="类别名称"
          >
            <a-input
              v-decorator="[
          'category',
          {
            initialValue:record.name,
            rules: [{ required: true, message: '请输入类别名称'}],
          }
        ]"
            />
          </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>
<script>
  import { categoryUpdate } from '@/api/ddwbApi'
  export default {
    data() {
      return {
        visible:false,
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
      edit(record){
        this.form.resetFields();
        this.record=record;     
        this.visible=true;
      },
      handleOk(){
          this.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
              const userinfo=values;
              userinfo.id=this.record.id;
              categoryUpdate(userinfo).then((res=>{
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