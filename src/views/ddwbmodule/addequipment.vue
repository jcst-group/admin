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
      :okButtonProps="isshow"
    >
      <a-form
        :form="form"
      >
          <a-form-item
            v-bind="formItemLayout"
            label="监测设备编号"
          >
            <a-input
            loading
            @blur="check1"
              v-decorator="[
          'equipmentId',
          {
            rules: [{ required: true, message: '请输入监测设备编号' }],
          }
        ]"
            >
            <a-spin v-if="!checkc" slot="suffix" size="small" />
            </a-input>
          </a-form-item>
          <a-form-item
            v-bind="formItemLayout"
            label="监测设备名称"
          >
            <a-input
              v-decorator="[
          'equipmentName',
          {
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
            rules: [{ required: true, message: '请选择基地' }],
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
  import { addEquipment,getALLBaseList,checkEquipment} from '@/api/ddwbApi'
  export default {
    data() {
      return {
        visible: false,
        baseList:[],
        check:false,
        checkc:true,
        isshow:{ props: {disabled: false} },
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
      check1(){
        let a=this.form.getFieldsValue(['equipmentId']).equipmentId;
        if(a){
          this.checkc=false;
          this.isshow.props.disabled=true;
          checkEquipment({equipmentId:a}).then(res=>{
            this.checkc=true;
            if(!res.success){
              this.$message.warning(res.message);
              this.check=true;
            }else{
              this.check=false;
              this.isshow.props.disabled=false;
            }
          })
        }
      },
      add(){
        this.form.resetFields();     
        this.checkc=true;
        this.isshow={ props: {disabled: false} };
        this.visible=true;
      },
      handleOk(){
        if(!this.check){        
          this.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
              const userinfo=this.form.getFieldsValue(['equipmentId','equipmentName','baseId','equipmentAddress'])
              addEquipment(userinfo).then((res=>{
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
        }else{
          this.$message.warning('请重新输入设备编号或名称！');
        }
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