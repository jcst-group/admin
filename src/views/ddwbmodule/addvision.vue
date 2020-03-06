<template>
    <div>
        <a-modal title="新增" :visible="visible" cancelText="取消" okText="确定" :maskClosable="false" @ok="handleOk" @cancel="handleCancel">
            <a-form :form="form">
                <a-form-item label="愿景" v-bind="formItemLayout">
                    <a-input v-decorator="['expect',{rules: [{required: true, message: '请输入愿景!'}]}]"/>
                </a-form-item>

                <a-form-item label="图标" v-bind="formItemLayout">
                    <a-upload
                        name="file"
                        action="/api2/pictureInfo/addExpectPic"
                        listType="picture-card"
                        :fileList="visfileList"
                        @preview="vishandlePreview"
                        :headers="headers"
                        :beforeUpload="beforeUpload"
                        @change="vishandleChange"
                        :remove="visremovepic"
                    >
                        <div v-if="visfileList.length < 1">
                            <a-icon type="plus" />
                            <div class="ant-upload-text">Upload</div>
                        </div>
                    </a-upload>
                    <a-modal :visible="vispreviewVisible" :footer="null" @cancel="vishandleCancel">
                        <img alt="example" style="width: 100%" :src="vispreviewImage" />
                    </a-modal>
                </a-form-item>
            </a-form>
        </a-modal>
    </div>
</template>
<script>
import Vue from 'vue'
import { ACCESS_TOKEN } from "@/store/mutation-types"
import { addCompanyExpect,delPic } from '@/api/ddwbApi'

export default {
    data(){
        return{
            visfileList:[],
            vispreviewVisible:false,
            vispreviewImage:'',
            headers:'',
            visible: false,
            id:'',
            picid:'',
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
        const token = Vue.ls.get(ACCESS_TOKEN);
        this.headers = {"X-Access-Token":token};
    },
    mounted(){

    },
    methods:{
        vishandleCancel () {
            this.vispreviewVisible = false;
        },
        visremovepic(file){
            let id='';
            if(!file.hasOwnProperty('response')){
                id=file.uid;
            }else{
                id=file.response.result.id;
            }
            delPic({id:id}).then(res=>{
                if(res.success){
                this.$message.success(res.message);
                this.picid='';
                this.visfileList=[];
                }
            })
            return true;
        },
        vishandleChange (info) {
             if(info.file.status === 'uploading'){
                this.visfileList=info.fileList;
                return
            }
            if (info.file.status === 'done') {     
                this.picid=info.file.response.result.id;      
                //this.loadData();
            }
        },
        beforeUpload (file) {
            const isLt10M = file.size / 1024 / 1024 < 10
            if (!isLt10M) {
            this.$message.error('图片大小不能大于10M')
            }
            return isLt10M
        },
        vishandlePreview (file) {
            this.vispreviewImage = file.url || file.thumbUrl
            this.vispreviewVisible = true
        },
        add(id){
            this.form.resetFields();
            this.id=id;
            this.visfileList=[];
            this.vispreviewImage='';
            this.picid='';
            this.visible=true;
        },
        handleCancel(){
            if(this.picid){
                delPic({id:this.picid}).then(res=>{
                if(res.success){
                this.picid='';
                }
            })
            }
            this.visible=false;
        },
        handleOk(){
            if(this.picid){
                this.form.validateFields((err, values) => {
                    if(!err){
                        let par={};
                        par=values;
                        par.companyId=this.id;
                        if(this.picid){
                            par.pictureInfo={id:this.picid};
                        }
                        addCompanyExpect(par).then(res=>{
                            if(res.success){
                                this.$message.success(res.message);
                                this.$parent.visloadData();
                                this.visible=false;
                            }else{
                                this.$message.warning(res.message);
                            }
                        })
                    }
                })
            }else{
                this.$message.warning("请先上传一张图片！")
            }
        },
    },
}
</script>
<style scoped>

</style>