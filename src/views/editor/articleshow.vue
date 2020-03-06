<template>
    <div>
        <div class="menu">
            <a-menu v-model="current" mode="horizontal">
                <a-menu-item key="mail">Navigation One </a-menu-item>
                <a-menu-item key="app">Navigation Two </a-menu-item>
                <a-menu-item key="mail1">Navigation One1 </a-menu-item>
                <a-menu-item key="mail2">Navigation One2 </a-menu-item>
                <a-menu-item key="mail3">Navigation One3 </a-menu-item>
                <a-menu-item key="mail4">Navigation One4 </a-menu-item>
                <a-menu-item key="alipay">Navigation Four</a-menu-item>
                </a-menu>
        </div>
        <div style="width:870px;margin:0 auto;">
            <div class="title">{{title}}</div>
            <a-divider/>
            <span>作者：</span><span>{{author}}</span><span style="margin-left:20px;">{{createTime}}</span>
            <span style="margin-left:30px;" v-if="updateTime">修改时间：</span><span v-if="updateTime">{{updateTime}}</span>
            <span style="margin-left:50px;" v-if="cropFrom||httpUrl">引用于：</span><a v-if="httpUrl&&cropFrom" :href="httpUrl">{{cropFrom}}</a><a v-if="httpUrl&&!cropFrom" :href="httpUrl">原文链接</a><span v-if="!httpUrl&&cropFrom">{{cropFrom}}</span>
             <span style="margin-left:50px;" v-if="!cropFrom&&!httpUrl">原创</span>
            <a-divider/>
            <div class="ql-editor" v-html="content"></div>
        </div>
    </div>
</template>
<script>
import { selById } from '@/api/ddwbApi'
export default {
    data(){
        return{
            current: ['mail'],
            content:null,
            title:'',
            author:'',
            createTime:'',
            updateTime:'',
            httpUrl:'',
            cropFrom:'',
        }
    },
    created(){
        
        selById({id:this.$route.query.id}).then(res=>{
            if(res.success){
                this.content=res.result.content;
                this.title=res.result.title;
                this.author=res.result.author;
                this.createTime=res.result.createTime;
                this.updateTime=res.result.updateTime;
                this.httpUrl=res.result.httpUrl;
                this.cropFrom=res.result.cropFrom;
            }
        })
    },
    methods:{
    }
}
</script>
<style scoped>
.menu{
    width:100%;
    margin-bottom: 10px;
}
.title{
    width:100%;
    text-align: center;
    font-weight: bold;
    font-size: 35px;
    color:#000;
}
</style>