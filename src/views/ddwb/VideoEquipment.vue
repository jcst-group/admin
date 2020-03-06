<template>
 <div>
    <div class="addbut">
        <a-button class="btn" type="primary" icon="reload" @click="handleReset">重置</a-button>
        <a-button class="btn" type="primary" icon="search" v-if="showsss" @click="handleSearch">查询</a-button>    
        <a-button :disabled="canadd" class="btn" type="primary" icon="plus" @click="add">新增监控设备</a-button>
    </div>
    <div class="input">
        <span class="title">监控设备编号：</span>
        <a-input v-model="serialNumber" class="inp"/>
        <span class="title">监控设备名称：</span>
        <a-input v-model="videoName" class="inp"/>
    </div>
   <a-table :columns="columns"
            :dataSource="dataSource"
            :pagination="ipagination"
            @change="handleTableChange"
            :loading="loading"
            rowKey="id">
          <span slot="action" slot-scope="text, record">
            <a v-if="record.idd" @click="lookvideo1(record)">查看监控</a>
            <a v-if="!record.idd" @click="addchannel(record)">通道</a>
            <a-divider v-if="!record.idd" type="vertical"/>
            <a-popconfirm v-if="!record.idd" title="确定删除吗?" @confirm="handleDelete(record.id)">
              <a>删除</a>
            </a-popconfirm>
        </span>
        <span slot="action1" slot-scope="text, record">
          <a v-if="record.idd" @click="bangjd(record)" >编辑</a>
          <!-- <a v-if="!record.videoName&&record.status" @click="rbangjd(record)" style="color:red;">重绑基地</a> -->
          <a-divider v-if="record.idd" type="vertical"/>
          <!-- <a v-if="record.idd" @click="deljd(record)">取绑基地</a> -->       
          <a-popconfirm v-if="record.idd" title="确定删除吗?" @confirm="delchannel(record.idd)">
            <a>删除</a>
          </a-popconfirm>
        </span>
        </a-table>
        <!-- <a-table :columns="columns1" :dataSource="data1" >
          <span slot="action" slot-scope="text, record">
          <a @click="handleEdit(record)">编辑</a>
          <a-divider type="vertical"/>
          <a-popconfirm title="确定删除吗?" @confirm="handleDelete(record.id)">
            <a>删除</a>
          </a-popconfirm>
        </span>
        </a-table>   -->
        <AddEquipment ref="AddEquipment"/>
        <EditEquipment ref="EditEquipment"/>
        <AddEquipmentt ref="AddEquipmentt"/>
        <EditEquipmentt ref="EditEquipmentt"/>
        <LookVideo ref="lookvideo"/>
  </div>
</template>
<script>

  import AddEquipment from '@/views/ddwbmodule/addvideoequipment'
  import EditEquipment from '@/views/ddwbmodule/editvedioequipment'
  import AddEquipmentt from '@/views/ddwbmodule/addvediobase'
  import EditEquipmentt from '@/views/ddwbmodule/editvediobase'
  import LookVideo from '@/views/ddwbmodule/lookvideo'
  import {delVideoEquipment,getVideoEquipmentList,getYsToken,getVideoList,delVideoChannel}  from '@/api/ddwbApi'


  const columns = [{
    title: '监控设备编号',
    dataIndex: 'serialNumber',
    key: 'serialNumber',
    align:"center"
  }, {
    title: '监控设备名称',
    dataIndex: 'videoName',
    key: 'videoName',
    align:"center"
  },
  {
    title: '设备通道编号',
    dataIndex: 'channelNo',
    key: 'channelNo',
    align:"center"
  },
  {
    title: '设备通道名称',
    dataIndex: 'channelName',
    key: 'channelName',
    align:"center"
  },
  {
    title: '通道管理',
    dataIndex: 'action1',
    key: 'action1',
    scopedSlots: {customRender: 'action1'},
    align: "center",
  },
  {
    title: '操作',
    dataIndex: 'action',
    key: 'action',
    scopedSlots: {customRender: 'action'},
    align: "center",
  },];


  const i = 1;

  export default {
    components: {
      AddEquipment,
      EditEquipment,
      AddEquipmentt,
      EditEquipmentt,
      LookVideo,
    },
    data() {
      return {
        addresss: [],
        canadd:false,
        curLock: false,
        num:-1,
        oldvideolist:[],
        newvideolist:[],
        showsss:true,
        showssss:false,
        assss:false,
        aaaa:'暂无地块信息',
        columns,
        shows: false,
        shoos: false,
        base:'请选择所属基地',
        bases:'请选择监测地',
        basess:'',
        userinfo:{},
        baseinfo:[],
        baseinfoss:[],
        baseinfos:[],
        siteId:'',
        serialNumber:'',
        videoName:'',
        relationType:'',
        loading: false,
        queryParam: {},
        ipagination: {
          current: 1,
          pageSize: 10,
          pageSizeOptions: ['10', '20', '50'],
          showTotal: (total, range) => {
            return range[0] + "-" + range[1] + " 共" + total + "条"
          },
          showQuickJumper: true,
          showSizeChanger: true,
          total: 0
        },
        dataSource: [],
        form: this.$form.createForm(this),
      }
    },
    created() {
      //  getVideoList().then(res=>{
      //       if(res.success){
      //         this.oldvideolist=res.result;
      //         this.loading=true;
      //         getYsToken().then(res=>{
      //           if(res.success){
      //             let token='accessToken=' + res.result + '&pageStart=0&pageSize=50'
      //             this.getAddress(token);
      //           }
      //         })
      //       }
      //     })
      
    },
    methods: {
      lookvideo1(record){
        this.$refs.lookvideo.look(record);
      },
       delchannel(id) {
        let params = {};
        params.id = id;
        delVideoChannel(params).then((res) => {
          if (res.success) {
            this.$message.success(res.message);
            this.loadData();
          } else {
            this.$message.warning(res.message);
          }
        });
      },
      addchannel(record){
        this.$refs.AddEquipmentt.add(record);
      },
      bangjd(record){
        this.$refs.EditEquipmentt.edit(record);
      },
      handleChangeequipment(value){
        this.equipmentId=value;
      //  console.log(this.equipmentId);
      },
      getQueryParams() {
        let param = Object.assign({}, this.userinfo);
        param.pageNo = this.ipagination.current;
        param.pageSize = this.ipagination.pageSize;
      //  console.log(param);
        return param;
      },
      loadData(arg) {
        if (arg === 1) {
          this.ipagination.current = 1;
        }
         this.loading=true;
        let params = this.getQueryParams();//查询条件
      //  console.log(params);
        getVideoEquipmentList(params).then((res) => {
          if (res.success) {
            this.dataSource = res.result.list;
            for(let i=0;i<this.dataSource.length;i++){
              if(this.num<this.dataSource[i].id){
                this.num=this.dataSource[i].id
              }
            }
             for(let i=0;i<this.dataSource.length;i++){
               if(this.dataSource[i].videoChannel.length>0){
                this.dataSource[i].children=[];
               }
              for(let j=0;j<this.dataSource[i].videoChannel.length;j++){
                this.num++;
                let a={};
                a.id=this.num;
                a.idd=this.dataSource[i].videoChannel[j].id;
                a.name=this.dataSource[i].videoName;
                a.value=this.dataSource[i].id;
                a.channelNo=this.dataSource[i].videoChannel[j].channelNo;
                a.baseId=this.dataSource[i].videoChannel[j].baseId;
                a.channelName=this.dataSource[i].videoChannel[j].channelName;
                this.dataSource[i].children.push(a);
              }
            }
            this.ipagination.total = res.result.total;
            this.loading=false;
          }
        })
      },
      add(){
        this.$refs.AddEquipment.add();
      },
      handleEdit(record) {
        this.$refs.EditEquipment.edit(record);
      },
      handleReset(){
        this.serialNumber='';
        this.videoName='';
        this.userinfo={};
        this.loadData();
      },
      handleSearch(){
        this.userinfo={};
        if(this.serialNumber){
          this.userinfo.serialNumber=this.serialNumber;
        }
        if(this.videoName){
          this.userinfo.videoName=this.videoName;
        }
       this.loadData();
      },
      handleDelete(id) {
     //   console.log(id);
        var that = this;
        let params = {};
        params.id = id;
        delVideoEquipment(params).then((res) => {
          if (res.success) {
            that.$message.success(res.message);
            that.loadData();
          } else {
            that.$message.warning(res.message);
          }
        });
      },
      handleTableChange(pagination, filters, sorter) {
      //  console.log("handleTableChange pagination")
      //  console.log(pagination)
        if (Object.keys(sorter).length > 0) {
          this.isorter.column = sorter.field;
          this.isorter.order = "ascend" == sorter.order ? "asc" : "desc"
        }
        this.ipagination = pagination;
        this.loadData();
      },
    },
    mounted() {
      this.loadData();
    },

  }
</script>
<style scoped>
  .select::after {
    clear: both;
    content: '';
    display: block;
    width: 0;
    height: 0;
  }
  @media screen and (max-width: 1700px){

  }
  @media screen and (max-width: 1700px) {
    .aSelect{
      left: 30%;
      width: 150px !important;
    }
    .aSelect1{
      left: 32% !important;
      width: 150px !important;
    }
    .aSelect2{
      left: 32% !important;
      width: 150px !important;
    }
  }
  @media screen and (max-width: 1400px) {
    .aSelect{
      right: -70% !important;
    }
  }
</style>
<style lang='stylus' scoped>
    .btn
        float right
        background #2c909c
        border-color #2c909c
        color #fff
        line-height 18px
        margin-right 10px
    .inp
        width 10%
        margin-right 10px
    .input
        margin-bottom 20px    
</style>
