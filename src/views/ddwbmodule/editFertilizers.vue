<template>
    <div>
        <a-modal title="编辑" :visible="visible" cancelText="取消" okText="确定" :maskClosable="false" @ok="handleOk" @cancel="handleCancel">
            <a-form :form="form">
                <a-form-item label="有机肥(kg)" v-bind="formItemLayout">
                    <a-input v-decorator="['organicFat',{initialValue:record.organicFat,rules: [{required: true, message: '请输入有机肥!'}]}]"/>
                </a-form-item>

                 <a-form-item label="普通肥(kg)" v-bind="formItemLayout">
                    <a-input v-decorator="['ordinaryFat',{initialValue:record.ordinaryFat,rules: [{required: true, message: '请输入普通肥!'}]}]"/>
                </a-form-item>

                <a-form-item label="年份" v-bind="formItemLayout">
                    <DatePicker type="year" :clearable="false" :value='curDate' @on-change="handleChangeyear"></DatePicker>
                </a-form-item>
            </a-form>
        </a-modal>
    </div>
</template>
<script>
import { updateFertilizers } from '@/api/ddwbApi'
export default {
    data(){
        return{
            visible: false,
            id:'',
            record:{},
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
        edit(record,id){
            this.form.resetFields();
            this.curDate='';
            this.id=id;
            this.record=record;
            this.curDate=record.year;
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
                    par.companyId=this.id;
                    if(this.curDate){
                        par.year=this.curDate;
                    }
                    updateFertilizers(par).then(res=>{
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