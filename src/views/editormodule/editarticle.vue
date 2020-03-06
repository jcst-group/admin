<template>
    <div>
        <a-modal
            :title="title"
            v-model="visible"
            @ok="handleOk"
            style="min-width:1000px"
            cancelText="取消"
            okText="确定"
            :maskClosable="false"
            :confirmLoading="confirmLoading"
            @cancel="handleCancel"
        >
            <a-form :form="form">
                <a-row :gutter="16">
                    <a-col :span="12">
                        <a-form-item
                            v-bind="formItemLayout"
                            label="标题"
                        >
                            <a-input
                                v-decorator="[
                                    'title',
                                    {
                                        initialValue:record.title,
                                        rules: [{ required: true, message: '请输入标题'}],
                                    }
                                ]"
                            />
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                            <a-form-item
                            v-bind="formItemLayout"
                            label="类别"
                        >
                            <a-input 
                                v-if="isshow"
                                @focus="change()"
                                v-decorator="[
                                    'categoryId',
                                    {
                                        initialValue:record.category?record.category.category:null,
                                        rules: [{ required: true, message: '请输入类别'}],
                                    }
                                ]"
                            />
                            <a-cascader v-if="!isshow" :options="Categoryinfo" :fieldNames="{ label: 'name', value: 'id', children: 'children' }" changeOnSelect 
                                v-decorator="[
                                'categoryId',
                                {
                                    rules: [{
                                        required: true, message: '请选择类别',
                                    }]
                                }
                                ]">
                            </a-cascader>
                        </a-form-item>
                    </a-col>
                </a-row>
                <a-row :gutter="16">
                    <a-col :span="12">
                        <a-form-item
                            v-bind="formItemLayout"
                            label="作者"
                        >
                            <a-input
                                v-decorator="[
                                    'author',
                                    {
                                        initialValue:record.author,
                                        rules: [{ required: true, message: '请输入作者'}],
                                    }
                                ]"
                            />
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item
                            v-bind="formItemLayout"
                            label="引用于"
                        >
                            <a-input
                                v-decorator="[
                                    'cropFrom',
                                    {
                                        initialValue:record.cropFrom,
                                        rules: [{ required: false, message: '请输入'}],
                                    }
                                ]"
                            />
                        </a-form-item>
                    </a-col>
                </a-row>
                <a-row :gutter="16">
                    <a-col :span="12">
                        <a-form-item
                            v-bind="formItemLayout"
                            label="原文链接"
                        >
                            <a-input
                                v-decorator="[
                                    'httpUrl',
                                    {
                                        initialValue:record.httpUrl,
                                        rules: [{ required: false, message: '请输入'}],
                                    }
                                ]"
                            />
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <!-- <a-form-item
                            v-bind="formItemLayout"
                            label="状态"
                        >
                            <a-input
                                v-decorator="[
                                    'status',
                                    {
                                    rules: [{ required: true, message: '请输入状态'}],
                                    }
                                ]"
                            />
                        </a-form-item> -->
                    </a-col>
                </a-row>
            </a-form>
            <a-upload
                v-show="false"
                name="file"
                action="/api2/pictureInfo/addArticlePic"
                listType="picture-card"
                :headers="headers"
                :beforeUpload="beforeUpload"
                @change="handleChange"
            >
            </a-upload>
            <quill-editor
                id="editor2"
                ref="myTextEditor"
                v-model="content"
                :options="editorOption"
                @blur="onEditorBlur($event)"
                @focus="onEditorFocus($event)"
                @ready="onEditorReady($event)"
                @change="onEditorChange($event)">
            </quill-editor>
            <!-- <a-button style="float:right;margin-top:50px;" type="primary" @click="add">提交</a-button> -->
        </a-modal>
    </div>
</template>
<script>
import Vue from 'vue'
import { ACCESS_TOKEN } from "@/store/mutation-types"
import { delCPic,categoryList,articleUpdate,articleAdd } from '@/api/ddwbApi'
import VueQuillEditor from 'vue-quill-editor'
Vue.use(VueQuillEditor);

export default {
    data () {
        return {
            title:'',
            delpicid:[],
            confirmLoading:false,
            isshowid:true,
            isshow:true,
            record:{},
            visible:false,
            Categoryinfo:null,
            form: this.$form.createForm(this),
            formItemLayout: {
                labelCol: {
                    xs: { span: 24 },
                    sm: { span: 4 },
                },
                wrapperCol: {
                    xs: { span: 24 },
                    sm: { span: 16 },
                },
            },
            oldpicid:[],
            oldoicname:[],
            fileList:[],
            headers:'',
            content: null,
            editorOption: {
                modules: {
                    toolbar:{
                        container:[
                            ["bold", "italic", "underline", "strike"], // 加粗 斜体 下划线 删除线
                            ["blockquote", "code-block"], // 引用  代码块
                            [{ header: 1 }, { header: 2 }], // 1、2 级标题
                            [{ list: "ordered" }, { list: "bullet" }], // 有序、无序列表
                            [{ script: "sub" }, { script: "super" }], // 上标/下标
                            [{ indent: "-1" }, { indent: "+1" }], // 缩进
                            // [{'direction': 'rtl'}],                         // 文本方向
                            [{ size: ["small", false, "large", "huge"] }], // 字体大小
                            [{ header: [1, 2, 3, 4, 5, 6, false] }], // 标题
                            [{ color: [] }, { background: [] }], // 字体颜色、字体背景颜色
                            [{ font: [] }], // 字体种类
                            [{ align: [] }], // 对齐方式
                            ["clean"], // 清除文本格式
                            ["link", "image", "video"] // 链接、图片、视频
                        ], //工具菜单栏配置
                        handlers: {
                            'image': function (value) {
                                if (value) {
                                    document.querySelector('.ant-upload input').click()
                                } else {
                                    this.quill.format('image', false);
                                }
                            }
                        }
                        } 
                },
                placeholder: '', //提示
                readyOnly: false, //是否只读
                theme: 'snow', //主题 snow/bubble
                syntax: true, //语法检测
            }
        }
    },
    created(){
        const token = Vue.ls.get(ACCESS_TOKEN);
        this.headers = {"X-Access-Token":token};
        categoryList().then(res=>{
            if(res.success){
                this.Categoryinfo=res.result;
            }
        })
    },
    mounted() {
        // console.log('this is my editor',this.editor);
    }, 
    computed: {
        editor() {
            return this.$refs.myTextEditor.quillEditor;
        }
    },
    methods: {
        change(){
            this.isshow=false;
        },
         add(){
            this.title='添加'
            this.delpicid=[];
            this.isshowid=true;
            this.record={};
            this.content='';
            this.oldpicid=[]
            this.oldpicname=[]
            this.isshow=false;
            this.form.resetFields();     
            this.visible=true;
        },
        edit(record){
            this.title='编辑'
            this.delpicid=[];
            this.isshow=true;
            this.isshowid=false;
            this.record=record;
            this.content=record.content;
            this.form.resetFields();
            this.oldpicid=[]
            this.oldpicname=[]
            for(let i=0;i<this.record.pictureInfos.length;i++){
                this.oldpicid.push(this.record.pictureInfos[i].id);
                this.oldpicname.push(this.record.pictureInfos[i].pictureUrl);
            }  
            this.visible=true;
        },
        handleCancel(){
            for(let i=0;i<this.delpicid.length;i++){
                delCPic({id:this.delpicid[i]}).then(res=>{})
            }
        },
        beforeUpload (file) {
            const isJPG = file.type === 'image/jpeg'
            const isPNG = file.type === 'image/png'
            if (!(isPNG||isJPG)) {
                this.$message.error('只允许上传jpg/png格式图片')
            }
            const isLt5M = file.size / 1024 / 1024 < 5
            if (!isLt5M) {
                this.$message.error('图片大小不能大于5M')
            }
            return (isJPG || isPNG) && isLt5M
        },
        handleChange(info){
            if (info.file.status === 'uploading') {
                return
            }
            if (info.file.status === 'done') {
                console.log(info.file.response.result);
                let quill = this.$refs.myTextEditor.quill
                if(info.file.response.success){
                    let length = quill.getSelection().index;
                    let picurl=info.file.response.result.pictureUrl;
                    quill.insertEmbed(length, 'image', picurl)
                    quill.setSelection(length + 1)
                    this.oldpicid.push(info.file.response.result.id)
                    this.delpicid.push(info.file.response.result.id)
                    this.oldoicname.push(info.file.response.result.pictureUrl);
                } else {
                    this.$message.error('图片插入失败')
                }
            }
        },
        // 失去焦点
        onEditorBlur(editor) {},
        // 获得焦点
        onEditorFocus(editor) {},
        // 开始
        onEditorReady(editor) {},
        // 值发生变化
        onEditorChange(editor) {
            this.content = editor.html;
                console.log(editor);
        },
        handleOk(){
            this.form.validateFieldsAndScroll((err, values) => {
                if (!err) {
                    this.confirmLoading=true;
                    const userinfo=values;
                    if(!this.isshowid){
                        userinfo.id=this.record.id;
                    }
                    if(!this.isshow){
                        userinfo.categoryId=userinfo.categoryId[userinfo.categoryId.length-1];
                    }else{
                        userinfo.categoryId=this.record.categoryId;
                    }
                    userinfo.content=this.content;
                    let newpicname=[];
                    let newpicid=[];
                    let parid=[];
                    newpicname=this.content.split('<img');
                    for(let i=1;i<newpicname.length;i++){
                        for(let j=0;j<this.oldoicname.length;j++){
                            if(newpicname[i].indexOf(this.oldoicname[j])!=-1){
                                newpicid.push(j);
                            }
                        }
                    }
                    this.oldpicid.forEach((item,index,arr)=>{
                        if(newpicid.indexOf(index)==-1){
                            delCPic({id:item}).then(res=>{})
                        }else{
                            let aa={};
                            aa.id=item;
                            parid.push(aa);
                        }
                    })
                    userinfo.pictureInfos=parid;
                    if(!this.isshowid){
                        articleUpdate(userinfo).then((res=>{
                            if(res.success==true){
                                this.$message.info(res.message)
                                this.$parent.loadData()
                                this.confirmLoading=false;
                                this.visible=false;
                            }else{
                                this.$message.warning(res.message)
                            }
                        }))
                    }else{
                        articleAdd(userinfo).then((res=>{
                            if(res.success==true){
                                this.$message.info(res.message)
                                this.$parent.loadData()
                                this.confirmLoading=false;
                                this.visible=false;
                            }else{
                                this.$message.warning(res.message)
                            }
                        }))
                    }
                }
            }); 
        },
    },
}
</script>
<style>
/* .editor {
    line-height: normal !important;
    height: 500px;
} */
.quill-editor{
    height:500px;
}
.ql-container{
    height:410px;
}
.ql-snow .ql-tooltip[data-mode=link]::before {
    content: "请输入链接地址:";
}

.ql-snow .ql-tooltip.ql-editing a.ql-action::after {
    border-right: 0px;
    content: '保存';
    padding-right: 0px;
}

.ql-snow .ql-tooltip[data-mode=video]::before {
    content: "请输入视频地址:";
}

.ql-snow .ql-picker.ql-size .ql-picker-label::before,
.ql-snow .ql-picker.ql-size .ql-picker-item::before {
    content: '14px';
}

.ql-snow .ql-picker.ql-size .ql-picker-label[data-value=small]::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value=small]::before {
    content: '10px';
}

.ql-snow .ql-picker.ql-size .ql-picker-label[data-value=large]::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value=large]::before {
    content: '18px';
}

.ql-snow .ql-picker.ql-size .ql-picker-label[data-value=huge]::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value=huge]::before {
    content: '32px';
}

.ql-snow .ql-picker.ql-header .ql-picker-label::before,
.ql-snow .ql-picker.ql-header .ql-picker-item::before {
    content: '文本';
}

.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="1"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="1"]::before {
    content: '标题1';
}

.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="2"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="2"]::before {
    content: '标题2';
}

.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="3"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="3"]::before {
    content: '标题3';
}

.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="4"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="4"]::before {
    content: '标题4';
}

.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="5"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="5"]::before {
    content: '标题5';
}

.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="6"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="6"]::before {
    content: '标题6';
}

.ql-snow .ql-picker.ql-font .ql-picker-label::before,
.ql-snow .ql-picker.ql-font .ql-picker-item::before {
    content: '标准字体';
}

.ql-snow .ql-picker.ql-font .ql-picker-label[data-value=serif]::before,
.ql-snow .ql-picker.ql-font .ql-picker-item[data-value=serif]::before {
    content: '衬线字体';
}

.ql-snow .ql-picker.ql-font .ql-picker-label[data-value=monospace]::before,
.ql-snow .ql-picker.ql-font .ql-picker-item[data-value=monospace]::before {
    content: '等宽字体';
}
</style>