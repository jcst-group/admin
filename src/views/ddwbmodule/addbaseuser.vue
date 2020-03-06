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
    <div class="select">
      <div class="button">
          <a-button class="search-btn btn" type="primary" @click="search">查询</a-button>
          <a-button class="review-btn btn" type="primary" @click="review">重置</a-button>
        </div>
        <div class="input">
            <span class="title">基地范畴：</span>
           <a-select v-model="basecategory" class="inp">
              <a-select-option v-for="(v,k) in Categoryinfo1" :value="v.code" :key="k">{{v.displayName}}</a-select-option>
            </a-select>
            <span class="title">基地类型：</span>
             <a-select v-model="basetype" class="inp">
              <a-select-option v-for="(v,k) in Basetypeinfo1" :value="v.code" :key="k">{{v.displayName}}</a-select-option>
            </a-select>
            <span class="title">基地名称：</span>
            <a-input v-model="basevalue" class="inp"/>
        </div>
    </div>

     <a-table :columns="basecolumns" :dataSource="basedata" :pagination="ipagination1" @change="handleTableChange1" :rowKey="record => record.id" size="small" >
        <span slot="action" slot-scope="text, record">
             <a-switch :checked="baseid==record.id?true:false" @change='(checked)=>{selectbase(checked,record)}'/>
        </span>
     </a-table>

     <div class="center">
        <a-row :gutter="16" style="width:90%">
          <a-col :span="8"><div><span class="title1">选择的基地：</span><a-tag color="blue" v-if="base">{{base}}</a-tag></div></a-col>
          <a-col :span="16">
            <div>
               <a-row :gutter="16">
                 <a-col :span="6">
                    <span class="title1">选择的人员：</span>
                 </a-col>
                 <a-col :span="18" style="padding-top:15px;">
                   <a-tag color="blue"  v-for="(v,k) in paruser" :key="k" closable  @close="dellog(v)">{{v.realName}}</a-tag>
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
import {getBaseListAll,getALLBaseUserandrole,getBaseCategoryEnum,getBaseTypeEnum,addBaseUser} from '@/api/ddwbApi'

const basecolumns = [{
    title: '基地名称',
    dataIndex: 'baseName',
    key: 'baseName',
    align: 'center',
  },{
    title: '选择',
    dataIndex: 'action',
    key: 'action',
    scopedSlots: { customRender: 'action' },
    align: 'center',
  }]
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
  }
  //,{
  //   title: '选择',
  //   dataIndex: 'action1',
  //   key: 'action1',
  //   scopedSlots: { customRender: 'action1' },
  //   align: 'center',
  // }
  ]
export default {
  data(){
    return{
      basecolumns,
      ipagination1: {
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
      basedata: [],
      par1:{},
      Categoryinfo1:[],
      Basetypeinfo1:[],
      basecategory:'',
      basetype:'',
      basevalue:'',
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
      userdata: [],
      par2:{},
      uservalue:'',
      visible:false,
      title:'添加基地对应人员',
      base:'',
      baseid:'',
      paruser:[],
      deluser:[],
      userlist:[],
      Condition:[],
      Unit:[],
      datalist:[],
      form: this.$form.createForm(this),
    }
  },
  created(){
    this.loadData1();
    //this.loadData2();
  //  getALLBaseUserandrole().then(res=>{
  //    if(res.success){
  //     console.log(res);
  //    }
  //  });
   getBaseCategoryEnum().then((res)=>{
        if(res.success){
          this.Categoryinfo1=res.result;
        }
      });
   getBaseTypeEnum().then((res)=>{
         if(res.success){
          this.Basetypeinfo1=res.result;
        }
      });
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
               }
            }
        }
    },
    dellog(v){
      this.deluser.push(v);
      let cc=this.userlist.indexOf(v);
      let aa=this.userlist;
      this.userlist=[];
      for(let i=0;i<aa.length;i++){
        if(i!=cc){
          this.userlist.push(aa[i]);
        }
      }
    },
    selectbase(checked,record){
      this.baseid=record.id;
      this.base=record.baseName;
    },
    handleTableChange1(pagination) {
        this.ipagination1 = pagination;
        this.loadData1();
      },
      getQueryParams1() {
        let param = Object.assign({}, this.par1);
        param.pageNo = this.ipagination1.current;
        param.pageSize = this.ipagination1.pageSize;
        return param;
      },
      loadData1() {
        let params = this.getQueryParams1();//查询条件
        getBaseListAll(params)
          .then((res) => {
          //  console.log(res);
            if (res.success) {
              this.basedata = res.result.list;
              this.ipagination1.total = res.result.total;
            }
          });
      },
      review(){
        this.basevalue='';
        this.basecategory='';
        this.basetype='';
        this.par1={};
        this.loadData1();
      },
      search(){
        this.par1={};
        if(this.basevalue){
          this.par1.baseName=this.basevalue;
        }
        if(this.basecategory){
          this.par1.category=this.basecategory;
        }
        if(this.basetype){
          this.par1.baseType=this.basetype;
        }
       this.loadData1();
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
          //  console.log(res);
            if (res.success) {
              this.userdata = res.result.list;
              this.ipagination2.total = res.result.total;
        //       this.user=[];
        // this.userid=[];
            }
          });
      },
       review1(){
        this.uservalue='';
        this.par2={};
        this.loadData2();
      },
      search1(){
        this.par2={};
        if(this.uservalue){
          this.par2.realName=this.uservalue;
        }

       this.loadData2();
      },
    add(){
      this.userdata=[];
      this.base='';
      this.baseid='';
      this.paruser=[];
      this.deluser=[];
      this.userlist=[];
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

