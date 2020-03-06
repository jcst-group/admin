<template>
    <div>
        <a-modal title="新增" :visible="visible" cancelText="取消" okText="确定" :maskClosable="false" @ok="handleOk" @cancel="handleCancel">
            <a-form :form="form">
                <a-form-item label="有机肥(kg)" v-bind="formItemLayout">
                    <a-input v-decorator="['organicFat',{rules: [{required: true, message: '请输入有机肥!'}]}]"/>
                </a-form-item>

                 <a-form-item label="普通肥(kg)" v-bind="formItemLayout">
                    <a-input v-decorator="['ordinaryFat',{rules: [{required: true, message: '请输入普通肥!'}]}]"/>
                </a-form-item>

                <a-form-item label="年份" v-bind="formItemLayout">
                    <DatePicker type="year" :clearable="false" :value='curDate' @on-change="handleChangeyear"></DatePicker>
                </a-form-item>
            </a-form>
        </a-modal>
    </div>
</template>
<script>
import { addFertilizers } from '@/api/ddwbApi'
export default {
    data(){
        return{
            visible: false,
            id:'',
            curDate:null,
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
        handleChangeyear(value){
            this.curDate=value;
        },
        add(id){
            this.form.resetFields();
            this.curDate=null;
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
                    par.companyId=this.id;
                    if(this.curDate){
                        par.year=this.curDate;
                    }
                    addFertilizers(par).then(res=>{
                        if(res.success){
                            this.$message.success(res.message);
                            this.$parent.ferloadData();
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