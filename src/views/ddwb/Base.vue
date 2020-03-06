<template>
    <div class="temp">
        <div class="button">
          <a-button class="review-btn btn" type="primary" icon="reload" @click="review">重置</a-button>
          <a-button class="search-btn btn" type="primary" icon="search" @click="search">查询</a-button>
          <a-button class="add-btn btn" type="primary" icon="plus" @click="addbase">新增</a-button>
          <!-- <a-button class="delete-btn btn" type="primary" icon="delete">删除</a-button> -->
        </div>
        <div class="input">
            <span class="title">基地范畴：</span>
           <a-select v-model="basecategory" class="inp">
              <a-select-option v-for="(v,k) in Categoryinfo" :value="v.code" :key="k">{{v.displayName}}</a-select-option>
            </a-select>
            <span class="title">基地类型：</span>
             <a-select v-model="basetype" class="inp">
              <a-select-option v-for="(v,k) in Basetypeinfo" :value="v.code" :key="k">{{v.displayName}}</a-select-option>
            </a-select>
            <span class="title">基地名称：</span>
            <a-input v-model="basevalue" class="inp"/>
        </div>
        <!-- <div class="dropdown">
            <Dropdown style="margin-top: 20px" trigger='click'>
                <Button type="primary">
                    下拉菜单
                    <Icon type="ios-arrow-down"></Icon>
                </Button>
                <DropdownMenu slot="list">
                    <DropdownItem>驴打滚</DropdownItem>
                    <DropdownItem>炸酱面</DropdownItem>
                    <DropdownItem>豆汁儿</DropdownItem>
                    <DropdownItem>冰糖葫芦</DropdownItem>
                    <DropdownItem>北京烤鸭</DropdownItem>
                </DropdownMenu>
            </Dropdown>
        </div> -->
        <div class="btable">
            <a-table :columns="columns"
                :dataSource="dataSource"
                :pagination="ipagination"
                @change="handleTableChange"
                :rowKey="record => record.id"
                :customRow="clicktab"
                :loading="loading"
                bordered
                >
                <span slot="lookplot" slot-scope="text, record">
                    <router-link :to="{path:'/plot',query: { baseid:record.id,log:record.longitude,lat:record.latitude,areacord:record.areaCode }}" >管理地块</router-link>
                </span>
                <span slot="action" slot-scope="text, record">
                  <a-dropdown>
                      <a class="ant-dropdown-link">
                        操作 <a-icon type="down" />
                      </a>
                      <a-menu slot="overlay">
                        <!-- <a-menu-item >
                          <a href="javascript:;" @click="look(record)">查看</a>
                          </a-menu-item > -->
                          <a-menu-item >
                          <a href="javascript:;" @click="edit(record)">编辑</a>
                        </a-menu-item>
                          <a-menu-item >
                            <a-popconfirm title="是否删除该基地?" @confirm="del(record)" okText="确定" cancelText="取消">
                          <a href="javascript:;">删除</a>
                          </a-popconfirm>
                        </a-menu-item>
                      </a-menu>
                  </a-dropdown>

    </span>
            </a-table>
        </div>
        <lookBase ref="lookBase"/>
        <addBase ref="addBase"/>
        <editBase ref="editbase"/>
    </div>
</template>
<script>
import {getBaseList,delBase,getBaseCategoryEnum,getBaseTypeEnum} from '@/api/ddwbApi'
import lookBase from '@/views/ddwbmodule/base'
import addBase from '@/views/ddwbmodule/addbase'
import editBase from '@/views/ddwbmodule/editbase'

const columns = [{
    title: '基地编号',
    dataIndex: 'baseCode',
    key: 'baseCode',
    align: 'center',
  },{
    title: '基地名称',
    dataIndex: 'baseName',
    key: 'baseName',
    align: 'center',
  }, {
    title: '基地范畴',
    dataIndex: 'category.displayName',
    key: 'category.value',
    align: 'center',
  }, {
    title: '基地类型',
    dataIndex: 'baseType.displayName',
    key: 'baseType.value',
    align: 'center',
  },{
    title: '面积(亩)',
    dataIndex: 'acreage',
    key: 'acreage',
    align: 'center',
  },{
    title: '基地地址',
    dataIndex: 'address.street',
    key: 'address.street',
    align: 'center',
  },{
    title: '查看地块',
    dataIndex: 'lookplot',
    key: 'lookplot',
    scopedSlots: { customRender: 'lookplot' },
    align: 'center',
  },{
    title: '操作',
    dataIndex: 'action',
    key: 'action',
    scopedSlots: { customRender: 'action' },
    align: 'center',
  }];


export default {
    name: 'baseInfo',
    components:{
      lookBase,
      addBase,
      editBase,
    },
    data() {
        return {
            value: '',
            columns,
            basevalue:'',
            basecategory:-1,
            basetype:-1,
            Categoryinfo:[],
            Basetypeinfo:[],
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
           dataSource: [],
           par:{},
           loading:false,
        }
    },
    created(){
      this.loadData();
      getBaseCategoryEnum().then((res)=>{
        if(res.success){
          this.Categoryinfo=res.result;
          this.Categoryinfo.unshift({value: -1, code: -1, displayName: "全部"})
        }
      })
      getBaseTypeEnum().then((res)=>{
         if(res.success){
          this.Basetypeinfo=res.result;
          this.Basetypeinfo.unshift({value: -1, code: -1, displayName: "全部"})
        }
      })
    },
    methods:{
     clicktab(record, index){
        return {
            on: {
               click: () => {
                    //console.log(record,index)
               }
            }
        }
    },
      handleTableChange(pagination) {
        this.ipagination = pagination;
        this.loadData();
      },
      getQueryParams() {
        let param = Object.assign({}, this.par);
        param.pageNo = this.ipagination.current;
        param.pageSize = this.ipagination.pageSize;
        return param;
      },
      loadData() {
        this.loading=true;
        let params = this.getQueryParams();//查询条件
        getBaseList(params)
          .then((res) => {
            //console.log(res);
            if (res.success) {
              this.dataSource = res.result.list;
              this.ipagination.total = res.result.total;
              this.loading=false;
            }
          });
      },
      addbase(){
        this.$refs.addBase.add();
      },
      edit(record){
        this.$refs.editbase.edit(record);
      },
      look(record){
        this.$refs.lookBase.look(record);
      },
      del(record){
        let a={id:record.id};
        delBase(a)
           .then((res)=>{
              if (res.success) {
                this.$message.success(res.message);
                this.loadData();
              } else {
                this.$message.warning(res.message);
              }
        })
      },
      review(){
        this.basevalue='';
        this.basecategory=-1;
        this.basetype=-1;
        this.par={};
        this.loadData();
      },
      search(){
        this.par={};
        if(this.basevalue){
          this.par.baseName=this.basevalue;
        }
        if(this.basecategory&&this.basecategory!=-1){
          this.par.category=this.basecategory;
        }
        if(this.basetype&&this.basetype!=-1){
          this.par.baseType=this.basetype;
        }
       this.loadData();
      },
    }
}
</script>
<style lang='stylus' scoped>
    .btn
        float right
        background #2c909c
        border-color #2c909c
        color #fff
        line-height 18px
        margin-right 10px
    .title
        margin-right 5px
        line-height 32px
    .inp
        width 10%
        margin-right 10px
    .btable
        margin-top 10px
        width 100%
</style>
