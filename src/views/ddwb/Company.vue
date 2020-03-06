<template>
    <div>
        <div style="margin-bottom:10px;">
            <a-button v-if="companylength==0" style="margin-right:15px;" class="btn" type="primary" icon="plus" @click="add">添加公司</a-button>
            <a-button  style="margin-right:15px;" type="primary" icon="edit" @click="addpic3">编辑公司简介图片</a-button>
            <a-button  style="margin-right:15px;" type="primary" icon="edit" @click="addpic1">编辑管理模式图片</a-button>
            <a-button  style="margin-right:15px;" type="primary" icon="edit" @click="addpic2">编辑公司荣誉图片</a-button>
            <a-button  style="margin-right:15px;" type="primary" icon="edit" @click="addvedio1">编辑公司介绍视频</a-button>
            <a-button  type="primary" icon="edit" @click="addvedio2">编辑产品介绍视频</a-button>
        </div>
        <a-table :pagination="false" :rowKey="record => record.id" :columns="columns" :dataSource="data" :loading="loading" bordered>
             <a-popover slot="companyProfile" slot-scope="text">
                <template slot="content">
                <div style="width:400px" v-html="f2(text)">{{f2(text)}}</div>   
                </template>
                <span>{{h(text)}}</span>
            </a-popover>
            <span slot="ation1" slot-scope="text, record">
                <a href="javascript:;" @click="edit(record)">编辑</a>
            </span>
        </a-table>
        
        <div style="margin:20px 0 10px 0;">
            <a-button  class="btn" type="primary" icon="plus" @click="addser">新增服务团队人员</a-button>
        </div>
        <a-table @change="handleTableChange1" :pagination="ipagination1" :rowKey="record => record.id" :columns="sercolumns" :dataSource="serdata" :loading="serloading" bordered>
            <span slot="ation" slot-scope="text, record">
                <a href="javascript:;" @click="editser(record)">编辑</a>
                <a-divider type="vertical" />
                <a-popconfirm title="是否删除该团队人员？" @confirm="serdel(record.id)" okText="确认" cancelText="取消">
                    <a href="javascript:;">删除</a>
                </a-popconfirm>
            </span>
        </a-table>  

        <div style="margin:20px 0 10px 0;">
            <a-button  class="btn" type="primary" icon="plus" @click="addfer">新增用肥</a-button>
        </div>
        <a-table @change="handleTableChange" :pagination="ipagination" :rowKey="record => record.id" :columns="fercolumns" :dataSource="ferdata" :loading="ferloading" bordered>
            <span slot="ation" slot-scope="text, record">
                <a href="javascript:;" @click="editfer(record)">编辑</a>
                <a-divider type="vertical" />
                <a-popconfirm title="是否删除该用肥情况？" @confirm="ferdel(record.id)" okText="确认" cancelText="取消">
                    <a href="javascript:;">删除</a>
                </a-popconfirm>
            </span>
        </a-table>  

        <div style="margin:20px 0 10px 0;">
            <a-button  class="btn" type="primary" icon="plus" @click="addvis">新增预期愿景</a-button>
        </div>
        <a-table @change="handleTableChange2" :pagination="ipagination2" :rowKey="record => record.id" :columns="viscolumns" :dataSource="visdata" :loading="visloading" bordered>
            <span slot="ation" slot-scope="text, record">
                <a href="javascript:;" @click="editvis(record)">编辑</a>
                <a-divider type="vertical" />
                <a-popconfirm title="是否删除该愿景？" @confirm="visdel(record.id)" okText="确认" cancelText="取消">
                    <a href="javascript:;">删除</a>
                </a-popconfirm>
            </span>
        </a-table>  

        <a-modal
            title="新增图片"
            v-model="vispic3"
            :footer="null"
            :maskClosable="false"
        >
         <div>公司简介图片：</div>
            <div style="height:100px;margin:20px 0 20px 0;">
                <a-upload
                    name="file"
                    action="/api2/companyInfo/addComPicture"
                    listType="picture-card"
                    :fileList="cfileList"
                    @preview="chandlePreview"
                    :headers="headers"
                    :beforeUpload="beforeUpload"
                    :data="cdata"
                    @change="chandleChange"
                    :remove="cremovepic"
                >
                    <div v-if="cfileList.length < 1">
                        <a-icon type="plus" />
                        <div class="ant-upload-text">Upload</div>
                    </div>
                </a-upload>
                <a-modal :visible="cpreviewVisible" :footer="null" @cancel="chandleCancel">
                    <img alt="example" style="width: 100%" :src="cpreviewImage" />
                </a-modal>
            </div>
        </a-modal>
        <a-modal
            title="新增图片"
            v-model="vispic1"
            :footer="null"
            :maskClosable="false"
        >
         <div>管理模式图片：</div>
                <div style="height:100px;margin:20px 0 20px 0;">
                    <a-upload
                        name="file"
                        action="/api2/companyInfo/addMPicure"
                        listType="picture-card"
                        :fileList="mpfileList"
                        @preview="mphandlePreview"
                        :headers="headers"
                        :beforeUpload="beforeUpload"
                        @change="mphandleChange"
                        :data="cdata"
                        :remove="mpremovepic"
                    >
                        <div v-if="mpfileList.length < 1">
                            <a-icon type="plus" />
                            <div class="ant-upload-text">Upload</div>
                        </div>
                    </a-upload>
                    <a-modal :visible="mppreviewVisible" :footer="null" @cancel="mphandleCancel">
                        <img alt="example" style="width: 100%" :src="mppreviewImage" />
                    </a-modal>
                </div>
            </a-modal>
              <a-modal
            title="新增图片"
            v-model="vispic2"
            :footer="null"
            :maskClosable="false"
            style="min-width:800px"
        >
                <div>荣誉图片：</div>
                <div style="height:100px;margin:20px 0 20px 0;">
                    <a-upload
                        name="file"
                        action="/api2/companyInfo/addHPicure"
                        listType="picture-card"
                        :fileList="hpfileList"
                        @preview="hphandlePreview"
                        :headers="headers"
                        :beforeUpload="beforeUpload"
                        @change="hphandleChange"
                        :data="cdata"
                        :remove="hpremovepic"
                    >
                        <div v-if="hpfileList.length < 6">
                            <a-icon type="plus" />
                            <div class="ant-upload-text">Upload</div>
                        </div>
                    </a-upload>
                    <a-modal :visible="hppreviewVisible" :footer="null" @cancel="hphandleCancel">
                        <img alt="example" style="width: 100%" :src="hppreviewImage" />
                    </a-modal>
                </div>
              </a-modal>
              <a-modal
            title="新增视频"
            v-model="visvedio1"
            :footer="null"
            :maskClosable="false"
        >
                <div style="margin-bottom:20px;">公司介绍视频：</div>
                    <a-upload name="file" :fileList="cmp4list" :remove="removefile" :multiple="false" action="/api2/companyInfo/uploadVideoCompany" :headers="headers" :data="cdata" :beforeUpload="cfilebeforeUpload" @change="filehandleChange">
                        <a-button v-if="cmp4list.length < 1">
                        <a-icon type="upload" /> 点击上传公司介绍视频
                        </a-button>
                    </a-upload>
              </a-modal>
              <a-modal
            title="新增视频"
            v-model="visvedio2"
            :footer="null"
            :maskClosable="false"
        >
                     <div style="margin-bottom:20px;">产品介绍视频：</div>
                     <a-upload name="file" :fileList="pmp4list" :remove="removefile" :multiple="false" action="/api2/companyInfo/uploadVideoProduct" :headers="headers" :data="cdata" :beforeUpload="pfilebeforeUpload" @change="filehandleChange1">
                        <a-button v-if="pmp4list.length < 1">
                        <a-icon type="upload" /> 点击上传产品介绍视频
                        </a-button>
                    </a-upload>              
              </a-modal>

        <AddCompany ref="addcompany"></AddCompany>
        <EditCompany ref="editcompany"></EditCompany>
        <AddFer ref="addfert"></AddFer>
        <EditFer ref="editfert"></EditFer>
        <AddSer ref="addsert"></AddSer>
        <EditSer ref="editsert"></EditSer>
        <AddVision ref="addvision"></AddVision>
        <EditVision ref="editvision"></EditVision>
    </div>
</template>
<script>
import Vue from 'vue'
import { ACCESS_TOKEN } from "@/store/mutation-types"
import { getCompanyList,delCompany,getFertilizersList,delFertilizers,delPic,delFile,getTeamList,delTeam,getCompanyExpect,updateCompanyExpect,delCompanyExpect } from '@/api/ddwbApi'
import AddCompany from '@/views/ddwbmodule/addCompany'
import AddFer from '@/views/ddwbmodule/addFertilizers'
import AddSer from '@/views/ddwbmodule/addTeam'
import EditCompany from '@/views/ddwbmodule/editCompany'
import EditFer from '@/views/ddwbmodule/editFertilizers'
import EditSer from '@/views/ddwbmodule/editTeam'
import AddVision from '@/views/ddwbmodule/addvision'
import EditVision from '@/views/ddwbmodule/editvision'

export default {
    name: "company",
    components:{
        AddCompany,
        EditCompany,
        AddFer,
        EditFer,
        AddSer,
        EditSer,
        AddVision,
        EditVision,
    },
    data(){
        return{
            cdata:'',
            vispic1:false,
            vispic2:false,
            vispic3:false,
            visvedio1:false,
            visvedio2:false,
            columns:[{
                title: '企业名称',
                align:'center',
                width:'15%',
                dataIndex: 'companyName',
            },{
                title: '地理位置',
                align:'center',
                width:'15%',
                dataIndex: 'companyAddress' ,
            },{
                title: '主要品种',
                align:'center',
                width:'10%',
                dataIndex: 'platCrop' ,
            },{
                title: '管理面积(亩)',
                align:'center',
                width:'10%',
                dataIndex:'manageArea',
            },{
                title: '服务面积(亩)',
                align:'center',
                width:'10%',
                dataIndex:'serviceArea',
            },{
                title: '管理合作社(个)',
                align:'center',
                width:'10%',
                dataIndex:'manageCooperation',
            },{
                title: '公司简介',
                align:'center',
                width:'30%',
                dataIndex: 'companyProfile', 
                scopedSlots:{ customRender: 'companyProfile' }, 
            },{
                title:'操作',
                align:'center',
                dataIndex:'ation1',
                width:'10%',
                scopedSlots:{ customRender: 'ation1' },
            }],
            data:[],
            loading:false,
            companylength:'',
            ipagination: {
                current: 1,
                pageSize: 3,
                pageSizeOptions: ['3', '10', '50'],
                showTotal: (total, range) => {
                    return range[0] + '-' + range[1] + '共' + total + '条';
                },
                showQuickJumper: true,
                showSizeChanger: true,
                total: 0
            },
            ipagination1: {
                current: 1,
                pageSize: 3,
                pageSizeOptions: ['3', '10', '50'],
                showTotal: (total, range) => {
                    return range[0] + '-' + range[1] + '共' + total + '条';
                },
                showQuickJumper: true,
                showSizeChanger: true,
                total: 0
            },
            ipagination2: {
                current: 1,
                pageSize: 3,
                pageSizeOptions: ['3', '10', '50'],
                showTotal: (total, range) => {
                    return range[0] + '-' + range[1] + '共' + total + '条';
                },
                showQuickJumper: true,
                showSizeChanger: true,
                total: 0
            },
            visloading:false,
            ferloading:false,
            serloading:false,
            fercolumns:[{
                title:'有机肥(kg/亩)',
                align:'center',
                width:'25%',
                dataIndex: 'organicFat',
            },{
                title: '普通肥(kg/亩)',
                align:'center',
                width:'25%',
                dataIndex: 'ordinaryFat' ,
            },{
                title: '年份',
                align:'center',
                width:'25%',
                dataIndex: 'year' ,
            },{
                title:'操作',
                align:'center',
                dataIndex:'ation',
                width:'25%',
                scopedSlots:{ customRender: 'ation' },
            }],
            sercolumns:[{
                title:'姓名',
                align:'center',
                width:'20%',
                dataIndex: 'name',
            },{
                title: '专业',
                align:'center',
                width:'20%',
                dataIndex: 'major' ,
            },{
                title: '学校',
                align:'center',
                width:'20%',
                dataIndex: 'school' ,
            },{
                title: '学历',
                align:'center',
                width:'20%',
                dataIndex: 'education' ,
            },{
                title:'操作',
                align:'center',
                dataIndex:'ation',
                width:'20%',
                scopedSlots:{ customRender: 'ation' },
            }],
            viscolumns:[{
                title:'愿景',
                align:'center',
                width:'25%',
                dataIndex: 'expect',
            },{
                title:'操作',
                align:'center',
                dataIndex:'ation',
                width:'20%',
                scopedSlots:{ customRender: 'ation' },
            }],
            visdata:[],
            ferdata:[],
            serdata:[],
            cfileList:[],
            mpfileList:[],
            hpfileList:[],
            headers:'',
            mppreviewVisible:false,
            mppreviewImage:'',
            cpreviewVisible:false,
            cpreviewImage:'',
            hppreviewVisible:false,
            hppreviewImage:'',
            cmp4list:[],
            pmp4list:[],
        }
    },
    created(){
        const token = Vue.ls.get(ACCESS_TOKEN);
        this.headers = {"X-Access-Token":token};
        this.loadData();
        this.ferloadData();
        this.serloadData();
        this.visloadData();
    },
    mounted(){
        
    },
    methods:{
        h(text){
            if(text!=null){
                let a=text.split('');
                let b=[];
                if(a.length>100){
                    for(let i=0;i<100;i++){
                    b.push(a[i]);
                    }
                    let c=b.join('')+'...';
                    return c;
                }else{
                    return text;
                }
                }
                return text;
        },
        addvedio1(){
            if(this.data.length==0){
                this.$message.warning("请等待表格加载完毕或先添加公司！")
            }else{
                this.visvedio1=true;
            }
        },
         addvedio2(){
            if(this.data.length==0){
                this.$message.warning("请等待表格加载完毕或先添加公司！")
            }else{
                this.visvedio2=true;
            }
        },
        addpic1(){
            if(this.data.length==0){
                this.$message.warning("请等待表格加载完毕或先添加公司！")
            }else{
                this.vispic1=true;
            }
        },
        addpic2(){
            if(this.data.length==0){
                this.$message.warning("请等待表格加载完毕或先添加公司！")
            }else{
                this.vispic2=true;
            }
        },
        addpic3(){
            if(this.data.length==0){
                this.$message.warning("请等待表格加载完毕或先添加公司！")
            }else{
                this.vispic3=true;
            }
        },
        removefile(file){
            let id='';
            if(!file.hasOwnProperty('type')&&file.hasOwnProperty('uid')){
                id=file.uid;
                delFile({id:id}).then(res=>{
                    if(res.success){
                    this.$message.success(res.message);
                    this.loadData();
                    }
                })
            }
            return true;
        },
         cfilebeforeUpload (file) {
            const nameL = file.name.length < 120
            const isMP4 = file.type === 'video/mp4'
            const isOGG = file.type === 'audio/ogg'
            if(!nameL) {
                this.$message.error('视频名称过长(1~120个字符)')
            }
            if (!(isMP4||isOGG)) {
                this.$message.error('只允许上传mp4/ogg格式视频')
            }
            const isLt50M = file.size / 1024 / 1024 < 50
            if (!isLt50M) {
                this.$message.error('视频大小不能大于50M')
            }
            return (isMP4||isOGG) && isLt50M && nameL
        },
        pfilebeforeUpload (file) {
            const nameL = file.name.length < 120
            const isMP4 = file.type === 'video/mp4'
            const isOGG = file.type === 'audio/ogg'
            if(!nameL) {
                this.$message.error('视频名称过长(1~120个字符)')
            }
            if (!(isMP4||isOGG)) {
                this.$message.error('只允许上传mp4/ogg格式视频')
            }
            const isLt50M = file.size / 1024 / 1024 < 50
            if (!isLt50M) {
                this.$message.error('视频大小不能大于50M')
            }
            if(!((isMP4||isOGG) && isLt50M)){
                this.pmp4list=[];
            }
            return (isMP4||isOGG) && isLt50M && nameL
        },
        filehandleChange (info) {
            if(info.file.status === 'uploading'){
                this.cmp4list=info.fileList;
                return
            }
            if (info.file.status === 'done') {            
                this.loadData();
            }
        },
        filehandleChange1 (info) {
            if(info.file.status === 'uploading'){
                this.pmp4list=info.fileList;
                return
            }
            if (info.file.status === 'done') {
                this.loadData();
            }
        },
        mphandlePreview (file) {
            this.mppreviewImage = file.url || file.thumbUrl
            this.mppreviewVisible = true
        },
         chandlePreview (file) {
            this.cpreviewImage = file.url || file.thumbUrl
            this.cpreviewVisible = true
        },
        hphandlePreview (file) {
            this.hppreviewImage = file.url || file.thumbUrl
            this.hppreviewVisible = true
        },
        beforeUpload (file) {
            const isLt10M = file.size / 1024 / 1024 < 10
            if (!isLt10M) {
            this.$message.error('图片大小不能大于10M')
            }
            return isLt10M
        },
        mphandleChange (info) {
             if(info.file.status === 'uploading'){
                this.mpfileList=info.fileList;
                return
            }
            if (info.file.status === 'done') {           
                this.loadData();
            }
        },
        chandleChange (info) {
             if(info.file.status === 'uploading'){
                this.cfileList=info.fileList;
                return
            }
            if (info.file.status === 'done') {           
                this.loadData();
            }
        },
        mpremovepic(file){
            let id='';
            if(file.hasOwnProperty('uid')){
                id=file.uid;
            }else{
                id=file.response.result.id;
            }
            delPic({id:id}).then(res=>{
                if(res.success){
                this.$message.success(res.message);
                this.loadData();
                }
            })
            return true;
        },
        cremovepic(file){
           // console.log(file);
            let id='';
            if(file.hasOwnProperty('uid')){
                id=file.uid;
            }else{
                id=file.response.result.id;
            }
            delPic({id:id}).then(res=>{
                if(res.success){
                this.$message.success(res.message);
                this.loadData();
                }
            })
            return true;
        },
        mphandleCancel () {
            this.mppreviewVisible = false;
        },
        chandleCancel () {
            this.cpreviewVisible = false;
        },
        hphandleChange (info) {
           // console.log(info);
            if(info.file.status === 'uploading'){
                this.hpfileList=info.fileList;
                return
            }
            if (info.file.status === 'done') {
                this.loadData();
            }
        },
        hpremovepic(file){
           // console.log(file);
            let id='';
            if(file.hasOwnProperty('uid')){
                id=file.uid;
            }else{
                id=file.response.result.id;
            }
            delPic({id:id}).then(res=>{
                if(res.success){
                this.$message.success(res.message);
                this.loadData();
                }
            })
            return true;
        },
        hphandleCancel () {
            this.hppreviewVisible = false;
        },
        f2(text) {
            return text.replace(/\n/g, "<br/>");
        },
        loadData() {
            this.loading=true;
            let param={};
            param.pageNo = 1;
            param.pageSize = 1;
            getCompanyList(param).then(res=>{
                if(res.success){
                this.data=res.result.list;
                if(this.data.length>0){
                this.cdata={id:this.data[0].id};
                this.mpfileList=[];
                this.hpfileList=[];
                this.cfileList=[];
                this.cmp4list=[];
                this.pmp4list=[];
                if(this.data[0].videoCompany){
                    let mp4=this.data[0].videoCompany;
                    let url='/api2/fileInfo/getVideo?fileUrl='+mp4.fileUrl
                    let a={
                        uid: mp4.id,
                        name: mp4.fileName,
                        status: 'done',
                        url: url,
                    };
                    this.cmp4list.push(a);
                }
                if(this.data[0].videoProduct){
                    let mp4=this.data[0].videoProduct;
                    let url='/api2/fileInfo/getVideo?fileUrl='+mp4.fileUrl
                    let a={
                        uid: mp4.id,
                        name: mp4.fileName,
                        status: 'done',
                        url: url,
                    };
                    this.pmp4list.push(a);
                }
                for(let i=0;i<this.data[0].honorPicture.length;i++){
                    let pic=this.data[0].honorPicture[i];
                    let url='/api2/pictureInfo/show/'+pic.pictureUrl
                    let a={
                        uid: pic.id,
                        name: pic.pictureUrl,
                        status: 'done',
                        url: url,
                    };
                    this.hpfileList.push(a);
                }
                for(let i=0;i<this.data[0].managePicture.length;i++){
                    let pic=this.data[0].managePicture[i];
                    let url='/api2/pictureInfo/show/'+pic.pictureUrl
                    let a={
                        uid: pic.id,
                        name: pic.pictureUrl,
                        status: 'done',
                        url: url,
                    };
                    this.mpfileList.push(a);
                }
                 for(let i=0;i<this.data[0].companyPicture.length;i++){
                    let pic=this.data[0].companyPicture[i];
                    let url='/api2/pictureInfo/show/'+pic.pictureUrl
                    let a={
                        uid: pic.id,
                        name: pic.pictureUrl,
                        status: 'done',
                        url: url,
                    };
                    this.cfileList.push(a);
                }
                this.companylength=this.data.length;
               
                }
                 this.loading=false;
                }
            })
        },
        add(){
            this.$refs.addcompany.add();
        },
        edit(record){
           this.$refs.editcompany.edit(record);
        },
        del(id){
            delCompany({id:id}).then(res=>{
                if(res.success){
                    this.$message.success(res.message);
                    this.loadData();
                }else{
                    this.$message.warning(res.message);
                }
            })
        },
        handleTableChange2(pagination) {
            this.ipagination2 = pagination;
            this.visloadData();
        },
        getQueryParams2() {
            // let param = Object.assign({}, this.par);
            let param = {};
            param.pageNo = this.ipagination2.current;
            param.pageSize = this.ipagination2.pageSize;
            return param;
        },
        visloadData() {
            this.visloading=true;
            let params = this.getQueryParams2();//查询条件
            getCompanyExpect(params)
            .then((res) => {
                if (res.success) {
                this.visdata = res.result.list;
                this.ipagination2.total = res.result.total;
                this.visloading=false;
                }
            });
        },
        handleTableChange1(pagination) {
            this.ipagination1 = pagination;
            this.serloadData();
        },
        handleTableChange(pagination) {
            this.ipagination = pagination;
            this.ferloadData();
        },
        getQueryParams1() {
            // let param = Object.assign({}, this.par);
            let param = {};
            param.pageNo = this.ipagination1.current;
            param.pageSize = this.ipagination1.pageSize;
            return param;
        },
        serloadData() {
            this.serloading=true;
            let params = this.getQueryParams1();//查询条件
            getTeamList(params)
            .then((res) => {
                if (res.success) {
                this.serdata = res.result.list;
                this.ipagination1.total = res.result.total;
                this.serloading=false;
                }
            });
        },
        getQueryParams() {
            // let param = Object.assign({}, this.par);
            let param = {};
            param.pageNo = this.ipagination.current;
            param.pageSize = this.ipagination.pageSize;
            return param;
        },
        ferloadData() {
            this.ferloading=true;
            let params = this.getQueryParams();//查询条件
            getFertilizersList(params)
            .then((res) => {
                if (res.success) {
                this.ferdata = res.result.list;
                this.ipagination.total = res.result.total;
                this.ferloading=false;
                }
            });
        },
        addfer(){
            this.$refs.addfert.add(this.data[0].id);
        },
        addvis(){
            this.$refs.addvision.add(this.data[0].id);
        },
        editfer(record){
            this.$refs.editfert.edit(record,this.data[0].id);
        },
        visdel(id){
            delCompanyExpect({id:id}).then(res=>{
               if(res.success){
                    this.$message.success(res.message);
                    this.visloadData();
                }else{
                    this.$message.warning(res.message);
                }
            })
        },
        ferdel(id){
            delFertilizers({id:id}).then(res=>{
                if(res.success){
                    this.$message.success(res.message);
                    this.ferloadData();
                }else{
                    this.$message.warning(res.message);
                }
            })
        },
        addser(){
            this.$refs.addsert.add(this.data[0].id);
        },
        editser(record){
            this.$refs.editsert.edit(record,this.data[0].id);
        },
        editvis(record){
            this.$refs.editvision.edit(record,this.data[0].id);
        },
        serdel(id){
            delTeam({id:id}).then(res=>{
                if(res.success){
                    this.$message.success(res.message);
                    this.serloadData();
                }else{
                    this.$message.warning(res.message);
                }
            })
        },
    },
}
</script>