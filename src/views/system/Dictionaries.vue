/*
*   字典管理页面
*/
<template>
  <div style="width:100%;height:auto;padding:16px;background:white;">
    <div style="background:white;padding:10px 0 10px 0;">
      <div style="margin:0 1% 0 0;">

        <div>
          <div style="min-width:172px;margin-bottom:10px;margin-top:10px;">
            <a-button type="primary" html-type="submit" icon="search" @click="handleSearch">查询</a-button>
            <a-button type="primary" icon="reload" style="margin-left: 8px"  @click="handleReset">重置</a-button>
          </div>
          <div class="select">
            <a-form
              :form="form"
              @submit="handleSearch" >
              <div style="float:left;width:24.25%;height:50px;margin-right:1%;margin-bottom:10px;">
                <a-form-item>
                  <a-input
                    v-decorator="[
          'dictTypeName',

        ]"
                    addonBefore="字典分类名称"></a-input>
                </a-form-item>
              </div>
            </a-form>
          </div>

        </div>
      </div>
      <div style="margin: 0 0 16px 0;">
        <a-button
          type="primary"
          icon="plus"
          @click="add"
        >
          添加字典
        </a-button>
      </div>
      <div>
        <a-table :columns="columns"
                 :dataSource="datas"
                 :pagination="pagination"
                 :loading="loading"
                 rowKey="id"
                 bordered
                 @change="handleTableChange"
        >
  <span slot="item" slot-scope="text, record">
    <a @click="allItem(record)">查看数据字典项</a>
    </span>
          <span slot="action" slot-scope="text, record">
          <!--<a @click="handleEdit(record)">编辑</a>-->
          <!--<a-divider type="vertical" />-->
          <a-dropdown>
            <a class="ant-dropdown-link">
              更多 <a-icon type="down" />
            </a>
            <a-menu slot="overlay">
              <a-menu-item >
                <a href="javascript:;" @click="handlelook(record)">详情</a>
              </a-menu-item>

              <a-menu-item>
                <a-popconfirm title="确定删除吗?" @confirm="handleDelete(record.id)">
                  <a>删除</a>
                </a-popconfirm>
              </a-menu-item>
            </a-menu>
          </a-dropdown>
        </span>
        </a-table>
      </div>

    </div>
    <DictionaryListModule ref="dictionaryListModule"/>
    <DictionaryModule ref="dictionaryModule"/>
  </div>

</template>

<script>
  //import { version } from 'punycode';
  import DictionaryListModule from '@/views/module/DictionaryListModule'
  import DictionaryModule from '@/views/module/DictionaryModule'
  import { getDictTypeList,deleteDictType } from '@/api/userApi'

  const columns = [{
    title: '字典分类编号',
    dataIndex: 'dictTypeCode',
    key:'dictTypeCode',
  }, {
    title: '字典分类名称',
    dataIndex: 'dictTypeName',
    key:'dictTypeName',
  }, {
    title: '默认值',
    dataIndex: 'defaultValue',
    key:'defaultValue',
  }, {
    title: '创建时间',
    dataIndex: 'createTime',
    key:'createTime',
  },  {
    title: '创建人名称',
    dataIndex: 'createManId',
    key: 'createManId',
    //width: '11%',
  }, {
    title: '修改时间',
    dataIndex: 'updateTime',
    key: 'updateTime',

  }, {
    title: '修改人名称',
    dataIndex: 'updateManId',
    key: 'updateManId',

  }, {
    title: '字典管理项',
    dataIndex: 'item',
    key: 'item',
    scopedSlots: { customRender: 'item' },
    align:"center",
  }, {
    title: '操作',
    dataIndex: 'action',
    key: 'action',
    scopedSlots: { customRender: 'action' },
    align:"center",
  }];

  export default {
    components:{
      DictionaryListModule,
      DictionaryModule
    },
    data() {
      return {
        visible:false,
        loading: false,
        columns,
        userinfo:{},
        datas:[],
        pagination:{
          current: 1,
          pageSize: 10,
          pageSizeOptions: ['10', '20', '30'],
          showTotal: (total, range) => {
            return range[0] + "-" + range[1] + " 共" + total + "条"
          },
          showQuickJumper: true,
          showSizeChanger: true,
          total: 0},
        form: this.$form.createForm(this),
      }
    },
    created() {
      this.loadData();

    },
    methods: {
      /* imgurl(record){
         let imgshowapi = '/api/upload/show'
        // console.log(record)
               if(record.avatar){
                return imgshowapi+'?fileName='+record.avatar
               }
       },*/
      allItem(record){
        this.$refs.dictionaryModule.look(record);
      },
      add(){
        this.$refs.dictionaryListModule.add();
        this.$refs.dictionaryListModule.title="添加字典"
        this.$refs.dictionaryListModule.okText="确认添加"
      },
      handlelook(record){
        this.$refs.dictionaryListModule.look(record);
        this.$refs.dictionaryListModule.title="查看详情"
        this.$refs.dictionaryListModule.okText="确认"
        this.$refs.dictionaryListModule.pw=false
        this.$refs.dictionaryListModule.npw=true
      },
      handleTableChange(xx){
        console.log("handleTableChange")
        console.log(xx)
        this.pagination = xx
        this.loadData()
      },
      getQueryParams(){
        console.log(this.userInfo)
        let param = Object.assign({}, this.userinfo);
        // param.field = this.getQueryField();
        param.pageNo = this.pagination.current;
        param.pageSize = this.pagination.pageSize;
        //return filterObj(param);
        return param;
      },
      loadData(callback){
        this.loading = true;
        const params = this.getQueryParams()
        //this.$store.dispatch('user/getlist',params)
        getDictTypeList(params).then((res=>{
          if(res.success==true){
            this.loading = true;
            //this.$store.commit('user/SET_PROTESTLIST',res.result)
            this.datas = res.result.list;
            this.loading = false;
            this.pagination.total = res.result.total;
          }else{
            this.$message.info(res.message)
          }
        }))
        if(callback!=undefined){
          callback()
        }
        this.loading = false;
      },
      refreshTestItemModal(pid){
        this.loadData();
        const refreshPro = this.datas.filter(item => pid === item.id)[0]
        console.log("refreshTestItemModal")
        console.log(refreshPro)
        this.$refs.dictionaryListModule.look(refreshPro);
        this.$refs.dictionaryListModule.naddd = true;
        this.$refs.dictionaryListModule.add = false;
      },
      handleDelete: function(id){
        let that = this;
        deleteDictType({id: id}).then((res)=>{
          if(res.success){
            that.$message.success(res.message);
            that.loadData();
          }else{
            that.$message.warning(res.message);
          }
        });
      },
      handleEdit: function(record){
        this.$refs.dictionaryListModule.edit(record,1);
        this.$refs.dictionaryListModule.title="编辑字典"
        this.$refs.dictionaryListModule.okText="确认修改"
      },
      handleOk(){
        this.visible=false
      },
      handleReset () {
        this.form.resetFields();
        this.userinfo={};
        this.loadData();
      },
      handleSearch(e){
        e.preventDefault();
        this.form.validateFieldsAndScroll((err, values) => {
          if (!err) {
            this.userinfo=this.form.getFieldsValue(['dictTypeName'])
            for(let k in this.userinfo){
              if(this.userinfo[k]!=undefined && this.userinfo[k].trim()==''){
                this.userinfo[k] = undefined
              }
            }
            this.loadData()
          }
        });
      }
    },

  }
</script>
<style scoped>
  .select::after{
    clear:both;
    content:'';
    display:block;
    width:0;
    height:0;
  }

</style>
