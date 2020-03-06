<template>
    <div>
        <div class="addbut" style="margin-bottom:20px;">  
            <a-button  type="primary" icon="plus" @click="add">新增阈值</a-button>
        </div>
        <div class="scroll">
            <!-- <div style="min-width:4000px"> -->
        <a-table 
            :columns="columns"
            :dataSource="dataSource"
            @change="handleTableChange"
            :rowKey="record => record.id"
            :loading="loading"
            :pagination='false'
            :scroll="{ x: 4500 }"
            >
            <span slot="status" slot-scope="text, record">
              <a-switch :defaultChecked='record.status === 1' @change='changeCurStatus($event, record)' />
            </span>
            <span slot="action" slot-scope="text, record" style="white-space:nowrap">
                <a @click="handleEdit(record)">编辑</a>
                <a-divider type="vertical"/>
                <a-popconfirm title="确定删除吗?" @confirm="handleDelete(record.id)">
                    <a>删除</a>
                </a-popconfirm>
            </span>
        </a-table>
        <!-- </div> -->
        </div>
        <addWarnEnv ref="AddWarnEnv"/>
        <editWarnEnv ref="EditWarnEnv"/>
    </div>
</template>
<script>
import {getWarnEnvList,delWarnEnv,changeStatus} from '@/api/ddwbApi'
import addWarnEnv from '@/views/ddwbmodule/addwarnenv'
import editWarnEnv from '@/views/ddwbmodule/editwarnenv'

const columns = [{
    title: '设备名称',
    dataIndex: 'equipment.equipmentName',
    align:"center",
    fixed: 'left',
    width:200,
  },{
    title: '启用状态',
    dataIndex: 'status',
    scopedSlots: {customRender: 'status'},
    align:"center",
    fixed: 'left',
    width:130,
  },{
    title: '开始时间',
    dataIndex: 'startTime',
    align:"center",
    fixed: 'left',
    width:150,
  },{
    title: '结束时间',
    dataIndex: 'endTime',
    align:"center",
    fixed: 'left',
    width:150,
  },{
    title: '最低大气温度值(℃)',
    dataIndex: 'minairtemperature',
    align:"center",
    width:150,
  }, {
    title: '最高大气温度值(℃)',
    dataIndex: 'maxairtemperature',
    align:"center",
    width:150,
  }, {
    title: '最低空气湿度值(%)',
    dataIndex: 'minairhumidity',
    align:"center",
    width:150,
  }, {
    title: '最高空气湿度值(%)',
    dataIndex: 'maxairhumidity',
    align:"center",
    width:150,
  },{
    title: '最低土壤温度值(℃)',
    dataIndex: 'minsoiltemperature',
    align:"center",
    width:150,
  },{
    title: '最高土壤温度值(℃)',
    dataIndex: 'maxsoiltemperature',
    align:"center",
    width:150,
  },{
    title: '最低土壤湿度值(%)',
    dataIndex: 'minsoilhumidity',
    align:"center",
    width:150,
  },{
    title: '最高土壤湿度值(%)',
    dataIndex: 'maxsoilhumidity',
    align:"center",
    width:150,
  },{
    title: '最低土壤PH值',
    dataIndex: 'minsoilph',
    align:"center",
    width:150,
  },{
    title: '最高土壤PH值',
    dataIndex: 'maxsoilph',
    align:"center",
    width:150,
  },{
    title: '最低光照强度值(Lux)',
    dataIndex: 'minillIntensity',
    align:"center",
    width:150,
  },{
    title: '最高光照强度值(Lux)',
    dataIndex: 'maxillIntensity',
    align:"center",
    width:150,
  },{
    title: '最高降雨量值(mm)',
    dataIndex: 'maxrainfall',
    align:"center",
    width:150,
  },{
    title: '最低CO2浓度(ppm)',
    dataIndex: 'minco2',
    align:"center",
    width:150,
  },{
    title: '最高CO2浓度(ppm)',
    dataIndex: 'maxco2',
    align:"center",
    width:150,
  },{
    title: '最低PM2.5浓度(ug/m3)',
    dataIndex: 'minpm25',
    align:"center",
    width:150,
  },{
    title: '最高PM2.5浓度(ug/m3)',
    dataIndex: 'maxpm25',
    align:"center",
    width:150,
  },{
    title: '最低PM10浓度(ug/m3)',
    dataIndex: 'minpm10',
    align:"center",
    width:150,
  },{
    title: '最高PM10浓度(ug/m3)',
    dataIndex: 'maxpm10',
    align:"center",
    width:150,
  },{
    title: '最大风速(m/s)',
    dataIndex: 'maxwindspeed',
    align:"center",
    width:150,
  },{
    title: '最低土壤EC值(uS/cm)',
    dataIndex: 'minsoilec',
    align:"center",
    width:150,
  },{
    title: '最高土壤EC值(uS/cm)',
    dataIndex: 'maxsoilec',
    align:"center",
    width:150,
  },{
    title: '最低土壤盐分(ppm)',
    dataIndex: 'minsoils',
    align:"center",
    width:150,
  },{
    title: '最高土壤盐分(ppm)',
    dataIndex: 'maxsoils',
    align:"center",
    width:150,
  },  {
    title: '操作',
    dataIndex: 'action',
    scopedSlots: {customRender: 'action'},
    align: "center",
    fixed: 'right',
    width:150,
  }];
export default {
    name: "warnenv",
    components:{
        addWarnEnv,
        editWarnEnv
    },
    data(){
        return{
            columns,
            loading: false,
            ipagination: {
                current: 1,
                pageSize: 10,
                pageSizeOptions: ['10', '20', '50'],
                showTotal: (total, range) => {
                    return range[0] + '-' + range[1] + '共' + total + '条';
                },
                showQuickJumper: true,
                showSizeChanger: true,
                total: 0
            },
            dataSource:[],
        }
    },
    created(){
        this.loadData();
    },
    mounted(){

    },
    methods:{
        // getQueryParams() {
        //     let param = {};
        //     param.pageNo = this.ipagination.current;
        //     param.pageSize = this.ipagination.pageSize;
        //     return param;
        // },
        changeCurStatus(val, record) {
          changeStatus({
            id: record.id,
            status: Number(val)
          }).then(res => {
            this.$message.info(res.message)
          })
        },
        loadData() {
            console.log(111)
            this.loading=true;
            // let params = this.getQueryParams();
            getWarnEnvList().then((res) => {
            if (res.success) {
                this.dataSource = res.result;
              //  console.log(res)
                // this.ipagination.total = res.result.total;
                this.loading=false;
            }
            })
        },
        handleTableChange(pagination) {
            this.ipagination = pagination;
            this.loadData();
        },
        add(){
            this.$refs.AddWarnEnv.add();     
        },
        handleEdit(record){
            this.$refs.EditWarnEnv.edit(record);
        },
        handleDelete(id){
            delWarnEnv({id:id}).then(res=>{
                if(res.success){
                    this.$message.success(res.message);
                    this.loadData();
                }else{
                    this.$message.warning(res.message);
                }
            })
        },
    },
}
</script>
<style lang='stylus' scoped>
    .scroll
        width 100%
        padding-bottom 5px
        margin-top 20px
        overflow-x auto
    .scroll::-webkit-scrollbar
        width 0px
        height 5px
    .scroll::-webkit-scrollbar-thumb
        border-radius 10px
        -webkit-box-shadow inset 0 0 5px rgba(0,0,0,1)
        background #535353
    .scroll::-webkit-scrollbar-track
        -webkit-box-shadow inset 0 0 5px rgba(0,0,0,0.2)
        border-radius 10px
        background #EDEDED
</style>