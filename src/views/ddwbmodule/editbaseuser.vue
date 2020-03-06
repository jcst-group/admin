<template>
  <div>
<a-modal
      v-model="visible"
      :title="title"
      @ok="handleOk"
      okText="确认"
      ref="modal"
      cancelText="取消"
      :maskClosable="false"
      style="min-width:900px"
    >
     <div class="center">
        <a-row :gutter="16" style="width:90%">
          <a-col :span="8"><div><span class="title1">基地：</span><a-tag color="blue" v-if="base">{{base}}</a-tag></div></a-col>
          <a-col :span="16">
            <div>
               <a-row :gutter="16">
                 <a-col :span="6">
                    <span class="title1">选择的人员：</span>
                 </a-col>
                 <a-col :span="18" style="padding-top:15px;">
                   <template v-for="(v,k) in paruser ">
                    <a-tag v-if="distory" color="blue" :key="k"  closable  @close="dellog(v)">{{v.realName}}</a-tag>
                   </template>
                 </a-col>
                </a-row>
              </div>
          </a-col>
        </a-row>
     </div>

     <div class="select">
      <div class="button">
          <a-button class="search-btn btn" type="primary" @click="search1">查询</a-button>
          <a-button class="review-btn btn" type="primary" @click="review1">重置</a-button>
        </div>
        <div class="input">
            <span class="title">人员名称：</span>
            <a-input v-model="uservalue" class="inp"/>
        </div>
    </div>

     <a-table :columns="usercolumns" :dataSource="userdata" :pagination="ipagination2" @change="handleTableChange2" :rowKey="record => record.uid" size="small" :customRow="clicktab" >
        <span slot="realName" slot-scope="text, record">
            {{text}}({{record.phone}})
        </span>
        <span slot="roleList" slot-scope="text, record">
            <a-tag color="cyan" v-for="(v,k) in record.roleList" :key="k">{{v.name}}</a-tag>
        </span>
     </a-table>



    </a-modal>
  </div>
</template>
<script>
import {getBaseList,getALLBaseUserandrole,getBaseCategoryEnum,getBaseTypeEnum,addBaseUser} from '@/api/ddwbApi'
  const usercolumns = [{
    title: '人员账号',
    dataIndex: 'username',
    key: 'username',
    align: 'center',
  },{
    title: '人员名称',
    dataIndex: 'realName',
    key: 'realName',
    scopedSlots: { customRender: 'realName' },
    align: 'center',
  },{
    title: '人员角色',
    dataIndex: 'roleList',
    key: 'roleList',
    scopedSlots: { customRender: 'roleList' },
    align: 'center',
  }]
export default {
  data(){
    return{
      usercolumns,
      ipagination2: {
        current: 1,
        pageSize: 5,
        pageSizeOptions: ['5', '10'],
        showTotal: (total, range) => {
          return range[0] + '-' + range[1] + '共' + total + '条';
        },
        showQuickJumper: true,
        showSizeChanger: true,
        total: 0
      },
      base:'',
      baseid:'',
      userdata: [],
      par2:{},
      uservalue:'',
      visible:false,
      title:'修改基地对应人员',
      paruser:[],
      deluser:[],
      userlist:[],
      Condition:[],
      Unit:[],
      datalist:[],
      distory:true,
      //oldlength:'',
      form: this.$form.createForm(this),
    }
  },
  created(){
    //this.loadData2();
  //  getALLBaseUserandrole().then(res=>{
  //    if(res.success){
  //     console.log(res);
  //    }
  //  });
  },
  methods:{
    listnumber(arr1,arr2,l){
      let i=0;
      for(let j=0;j<arr1.length;j++){
        if(arr1[j].uid==l.uid){
          i++;
        }
      }
      let k=0;
      for(let j=0;j<arr2.length;j++){
        if(arr2[j].uid==l.uid){
          k++;
        }
      }
      if(i==k){
        return true;
      }else{
        return false;
      }
    },
     clicktab(record, index){
        return {
            on: {
               click: () => {
                 let aaa=true;
                 for(let i=0;i<this.paruser.length;i++){
                   if(this.paruser[i].uid==record.uid){
                     aaa=false;
                   }
                 }
                    if(aaa){
                      this.paruser.push(record);
                      this.userlist.push(record);
                    }else{
                      if(this.listnumber(this.paruser,this.deluser,record)){
                        this.paruser.push(record);
                        this.userlist.push(record);
                      }
                    }
                  //  console.log(this.paruser);
               }
            }
        }
    },
    dellog(v){
      this.deluser.push(v);
      var cc='';
      for(let i=0;i<this.userlist.length;i++){
        if(this.userlist[i].uid==v.uid){
          cc=i;
        }
      } 
      var aa=this.userlist;
      this.userlist=[];
      for(let i=0;i<aa.length;i++){
        if(i!=cc){
          this.userlist.push(aa[i]);
        }
      }
    },
      handleTableChange2(pagination) {
        this.ipagination2 = pagination;
        this.loadData2();
      },
      getQueryParams2() {
        let param = Object.assign({}, this.par2);
        param.pageNo = this.ipagination2.current;
        param.pageSize = this.ipagination2.pageSize;
        return param;
      },
      loadData2() {
        let params = this.getQueryParams2();//查询条件
        getALLBaseUserandrole(params)
          .then((res) => {
            if (res.success) {
              this.userdata = res.result.list;
              this.ipagination2.total = res.result.total;
              this.user=[];
        this.userid=[];
            }
          });
      },
       review1(){
        this.uservalue='';
        this.par2={};
        this.loadData2();
      },
      search1(){
        if(this.uservalue){
          this.par2.realName=this.uservalue;
        }
       this.loadData2();
      },
    edit(record){
      //this.oldlength=record.userList.length;
      this.base=record.baseInfo.baseName;
      this.baseid=record.baseInfo.id;
      this.paruser=[];
      this.deluser=[];
      this.userlist=[];
      this.userdata=[];
      this.distory = false;//销毁组件
     this.$nextTick(() => {
       this.distory = true;//重建组件
     });
      for(let i=0;i<record.userList.length;i++){
        this.paruser.push({realName:record.userList[i].realName,uid:record.userList[i].uid});
        this.userlist.push({realName:record.userList[i].realName,uid:record.userList[i].uid});
      }
      this.loadData2();
      this.visible=true;
    },
    handleOk(){
      if(!this.baseid||!(this.userlist.length>0)){
        this.$message.warning('未选择基地或对应人员！');
      }else{
        let a={};
        a.baseId=this.baseid;
        a.userList=[];
        for(let i=0;i<this.userlist.length;i++){
          a.userList.push({uid:this.userlist[i].uid});
        }
        addBaseUser(a).then(res=>{
          if(res.success){
            this.$message.success(res.message);
            this.visible=false;
            this.$parent.loadData();
          }else{
            this.$message.warning(res.message);
          }
        })
      }
    },
  }
}
</script>
<style scoped>
.button{
  float: right;
}
.btn{
  width:60px;
  height:30px;
}
.search-btn{
  margin-right:5px;
}
.inp{
  width:15%;
  margin-right:10px;
}
.select{
  margin-bottom:5px;
}
.center{
  width:100%;
  height:50px;
  overflow-y: auto;
  background-color: rgba(240,255,255,1);
  margin:10px 0 20px 0;
}
.title1{
  line-height: 50px;
  font-size: 16px;
  font-weight: bold;
}
</style>

