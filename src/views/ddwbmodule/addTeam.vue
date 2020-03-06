<template>
    <div>
        <a-modal title="新增" :visible="visible" cancelText="取消" okText="确定" :maskClosable="false" @ok="handleOk" @cancel="handleCancel">
            <a-form :form="form">
                <a-form-item label="姓名" v-bind="formItemLayout">
                    <a-input v-decorator="['name',{rules: [{required: true, message: '请输入姓名!'}]}]"/>
                </a-form-item>

                 <a-form-item label="专业" v-bind="formItemLayout">
                    <a-input v-decorator="['major',{rules: [{required: true, message: '请输入专业!'}]}]"/>
                </a-form-item>

                <a-form-item label="学校" v-bind="formItemLayout">
                    <a-input v-decorator="['school',{rules: [{required: true, message: '请输入学校!'}]}]"/>
                </a-form-item>

                <a-form-item label="学历" v-bind="formItemLayout">
                    <a-input v-decorator="['education',{rules: [{required: true, message: '请输入学历!'}]}]"/>
                </a-form-item>
            </a-form>
        </a-modal>
    </div>
</template>
<script>
import { addTeam } from '@/api/ddwbApi'
export default {
    data(){
        return{
            visible: false,
            id:'',
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
        add(id){
            this.form.resetFields();
            this.id=id;
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
                    addTeam(par).then(res=>{
                        if(res.success){
                            this.$message.success(res.message);
                            this.$parent.serloadData();
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