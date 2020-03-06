<template>
  <div>
<a-modal
      v-model="visible"
      :title="title"
      @ok="handleOk"
      okText="保存"
      ref="modal"
      cancelText="取消"
      :maskClosable="false"
    >
      <a-form :form="form">
        <a-form-item
        v-bind="formItemLayout"
          label="环境条件"
        >
        <span>{{record.itemName?record.itemName.displayName:null}}</span>
         <!-- <a-select
          v-decorator="[
          'itemName',
          {
            initialValue:record.itemName?record.itemName.code:null,
            rules: [{
              required: true, message: '请选择检测项目名称',
            }]
          }
        ]">
              <a-select-option v-for="(v,k) in Condition" :value="v.code" :key="k">{{v.displayName}}</a-select-option>
            </a-select> -->
        </a-form-item>

        <a-form-item
        v-bind="formItemLayout"
          label="检测项目"
        >
         <a-input
            v-decorator="[
          'item',
          {
            initialValue:record.item,
            rules: [{
              required: true, message: '请输入检测项目',
            }]
          }
        ]"
          />
        </a-form-item>

         <a-form-item
         v-bind="formItemLayout"
          label="检测单位"
        >
        <a-select
          v-decorator="[
          'unit',
          {
            initialValue:record.unit?record.unit.code:null,
            rules: [{
              required: true, message: '请选择检测单位',
            }]
          }
        ]">
              <a-select-option v-for="(v,k) in Unit" :value="v.code" :key="k">{{v.displayName}}</a-select-option>
            </a-select>
        </a-form-item>

        <a-form-item
        v-bind="formItemLayout"
          label="检测标准MIN值"
        >
          <a-input-number
          style="width:100%"
            v-decorator="[
          'minValue',
          {
            initialValue:record.minValue,
            rules: [{
              required: true, message: '请输入检测标准MIN值',
            },{
              validator: minvalue,
            }]
          }
        ]"
          />
        </a-form-item>
        <a-form-item
        v-bind="formItemLayout"
          label="检测标准MAX值"
        >
          <a-input-number
          style="width:100%"
            v-decorator="[
          'maxValue',
          {
            initialValue:record.maxValue,
            rules: [{
              required: true, message: '请输入检测标准MAX值',
            },{
              validator: maxvalue,
            }]
          }
        ]"
        @blur="handleConfirmBlur"
          />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>
<script>
import {getEnvStandards,getUnit,addEnvStandards,editEnvStandards} from '@/api/ddwbApi'
export default {
  data(){
    return{
      visible:false,
      title:'编辑',
      Condition:[],
      Unit:[],
      record:{},
      confirmDirty:true,
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
      form: this.$form.createForm(this),
    }
  },
  created(){
     getEnvStandards().then((res)=>{
      if(res.success){
        this.Condition=res.result;
      }
    })
    getUnit().then((res)=>{
      if(res.success){
        this.Unit=res.result;
      }
    })
  },
  methods:{
    handleConfirmBlur  (e) {
      const value = e.target.value;
      this.confirmDirty = this.confirmDirty || value;
    },
    maxvalue  (rule, value, callback) {
      const form = this.form;
      if (value && value < form.getFieldValue('minValue')) {
        callback('最小值不能大于最大值！');
      } else {
        callback();
      }
    },
    minvalue  (rule, value, callback) {
      const form = this.form;
      if (value && this.confirmDirty) {
        form.validateFields(['maxValue'], { force: true });
      }
      callback();
    },
    edit(record){
     // console.log(record);
     this.form.resetFields();
     this.record=record;
     this.visible=true;
    },
    handleOk(){
     this.form.validateFields((err, values) => {
       if (!err) {
         let formData = values;
         formData.id=this.record.id;
         editEnvStandards(formData).then((res)=>{
           if(res.success){
                 this.$message.success(res.message);
                this.$parent.loadData();
                this.visible=false;
               }else{
                 this.$message.warning(res.message);
               }
         })
       }
     })
    },
  }
}
</script>
<style scoped>

</style>

