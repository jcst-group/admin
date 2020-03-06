<template>
    <div>
        <a-modal title="编辑" :visible="visible" cancelText="取消" okText="确定" :maskClosable="false" @ok="handleOk" @cancel="handleCancel">
            <a-form :form="form">
                <a-form-item label="企业名称" v-bind="formItemLayout">
                    <a-input v-decorator="['companyName',{initialValue:record.companyName,rules: [{required: true, message: '请输入企业名称!'}]}]"/>
                </a-form-item>

                 <a-form-item label="地理位置" v-bind="formItemLayout">
                    <a-input v-decorator="['companyAddress',{initialValue:record.companyAddress,rules: [{required: true, message: '请输入地理位置!'}]}]"/>
                </a-form-item>

                <a-form-item label="主要品种" v-bind="formItemLayout">
                    <a-input v-decorator="['platCrop',{initialValue:record.platCrop,rules: [{required: true, message: '请输入主要品种!'}]}]"/>
                </a-form-item>

                <a-form-item label="管理面积(亩)" v-bind="formItemLayout">
                    <a-input v-decorator="['manageArea',{initialValue:record.manageArea,rules: [{required: true, message: '请输入管理面积!'}]}]"/>
                </a-form-item>

                 <a-form-item label="服务面积(亩)" v-bind="formItemLayout">
                    <a-input v-decorator="['serviceArea',{initialValue:record.serviceArea,rules: [{required: true, message: '请输入服务面积!'}]}]"/>
                </a-form-item>

                <a-form-item label="管理合作社(个)" v-bind="formItemLayout">
                    <a-input v-decorator="['manageCooperation',{initialValue:record.manageCooperation,rules: [{required: true, message: '请输入管理合作社!'}]}]"/>
                </a-form-item>

                <a-form-item label="公司简介" v-bind="formItemLayout">
                    <a-textarea autosize  v-decorator="['companyProfile',{initialValue:record.companyProfile,rules: [{required: true, message: '请输入公司简介!'}]}]"/>
                </a-form-item>
            </a-form>
        </a-modal>
    </div>
</template>
<script>
import { updateCompany } from '@/api/ddwbApi'
export default {
    data(){
        return{
            visible: false,
            record:{},
            form: this.$form.createForm(this),
            formItemLayout: {
                labelCol: {
                xs: { span: 24 },
                sm: { span: 6  },
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
    mounted(){

    },
    methods:{
        edit(record){
            this.form.resetFields();
            this.record=record;
            this.visible=true;
        },
        handleCancel(){
            this.visible=false;
        },
        handleOk(){
            this.form.validateFields((err, values) => {
                if(!err){
                    let par={};
                    par=values;
                    par.id=this.record.id;
                    updateCompany(par).then(res=>{
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
    },
}
</script>
<style scoped>

</style>