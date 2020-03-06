<template>
 <div>
    <div style="margin-bottom:20px;" >
        <a-button style="margin-right:10px;" type="primary" icon="plus" @click="add">新增对应关系</a-button>     
    </div>
   <a-table 
            :columns="columns"
            :dataSource="dataSource"
            :pagination="ipagination"
            @change="handleTableChange"
            :loading="loading"
            bordered
            rowKey="id">
          <span slot="action" slot-scope="text, record">
          <a @click="handleEdit(record)">编辑</a>
          <a-divider type="vertical"/>
          <a-popconfirm title="确定删除吗?" @confirm="handleDelete(record.id)">
            <a>删除</a>
          </a-popconfirm>
        </span>
        </a-table>
        <AddEquipment ref="AddEquipment"/>
        <EditEquipment ref="EditEquipment"/>
  </div>
</template>
<script>
  import AddEquipment from '@/views/ddwbmodule/addvediobase'
  import EditEquipment from '@/views/ddwbmodule/editvediobase'
  import {delVideoChannel,getVideoChannelList}  from '@/api/ddwbApi'

  const columns = [{
    title: '监控设备名称',
    dataIndex: 'videoEquipment.videoName',
    key: 'videoEquipment.videoName',
    align:"center"
  }, {
    title: '通道',
    dataIndex: 'channelNo',
    key: 'channelNo',
    align:"center"
  },
  {
    title: '对应基地',
    dataIndex: 'baseName',
    key: 'baseName',
    align:"center"
  },
  {
    title: '操作',
    dataIndex: 'action',
    key: 'action',
    scopedSlots: {customRender: 'action'},
    align: "center",
  }];


  const i = 1;

  export default {
    components: {
      AddEquipment,
      EditEquipment,
    },
    data() {
      return {
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
    },
    methods: {
      handleChangeequipment(value){
        this.equipmentId=value;
      //  console.log(this.equipmentId);
      },
      getQueryParams() {
        // let param = Object.assign({}, this.userinfo);
        let param = {};
        param.pageNo = this.ipagination.current;
        param.pageSize = this.ipagination.pageSize;
       // console.log(param);
        return param;
      },
      loadData(arg) {
        if (arg === 1) {
          this.ipagination.current = 1;
        }
        this.loading=true;
        let params = this.getQueryParams();//查询条件
       // console.log(params);
        getVideoChannelList(params).then((res) => {
          if (res.success) {
            this.dataSource = res.result.list;
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

      handleDelete(id) {
        console.log(id);
        var that = this;
        let params = {};
        params.id = id;
        delVideoChannel(params).then((res) => {
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

</style>

