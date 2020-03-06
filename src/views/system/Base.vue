<template>
  <div style="width:100%;height:auto;padding:1px;background:white;">
    <div style="background:white;padding:10px 0 10px 0;width:100%;">
      <div style="margin:0 1% 0 0;">

        <div>
          <div style="min-width:172px;margin-bottom:10px;margin-top:10px;">
            <a-button type="primary" html-type="submit" icon="search" @click="handleSearch">查询</a-button>
            <a-button type="primary" icon="reload" style="margin-left: 8px" @click="handleReset">重置</a-button>
          </div>
          <div class="select">
            <a-form
              :form="form"
              @submit="handleSearch">
              <div style="float:left;width:30%;height:50px;margin-right:1%;margin-bottom:10px;">
      <a-form-item
      v-bind="formItemLayout"
      label="地区查询"
    >
      <a-tree-select
    :dropdownStyle="{ maxHeight: '400px', overflow: 'auto' }"
    :treeData="treeData"
    @change="onchange"
    :value="value"
  />
    </a-form-item>
              </div>
              <div style="float:left;width:30%;height:50px;margin-right:1%;margin-bottom:10px;">
                <a-form-item
                v-bind="formItemLayout"
      label="基地名称"
    >
    <a-input
            v-decorator="[
          'baseName',
        ]"
          >
          </a-input>
       <!-- <a-select

      v-decorator="[
          'baseName',
        ]"
         >
     <a-select-option v-for="(v,k) in baseinfo" :value="v.baseName" :key="k">{{v.baseName}}</a-select-option>
  </a-select> -->
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
          @click="handleAdd"
        >
          添加基地
        </a-button>
      </div>
      <div style="width:100%;">
        <a-table :columns="columns"
                 :dataSource="dataSource"
                 :pagination="ipagination"
                 @change="handleTableChange"
                 rowKey="id">
           <span slot="add" slot-scope="text, record">
      <!--<a @click="handleplot(record)">管理地块</a>-->

             <router-link :to="{path:'/plot',query: { baseid:record.id,log:record.log,lat:record.lat }}" >管理<br/>地块</router-link>
    </span>
    <!-- <a slot="intro" slot-scope="text" href="javascript:;">{{f(text)}}</a> -->
    <!-- <a-popconfirm slot="intro" slot-scope="text,record" :title="record.intro">
                  <a>{{f(text)}}</a>
    </a-popconfirm> -->
     <a-popover slot="intro" slot-scope="text,record">
    <template slot="content">
      <p style="width:500px;">{{record.intro}}</p>
    </template>
    <span>{{f(text)}}</span>
  </a-popover>
  <a-popover slot="baseShop.shopName" slot-scope="text,record">
    <template slot="content">
      <p style="width:400px;">
        <span>网址：</span>
        <br/>
        <a :href="record.baseShop?record.baseShop.shopUrl:'#'" target="view_window" >{{record.baseShop?record.baseShop.shopUrl:null}}</a>
        <br/>
        <span>店铺简介：</span>
        <br/>
        <span>{{record.baseShop?record.baseShop.shopInfo:'暂无'}}</span>
        </p>
    </template>
    <span>{{h(text)}}</span>
  </a-popover>
     <span slot="farmer" slot-scope="farmer">
      <a-tag v-for="tag in farmer" color="rgb(60, 158, 171)" :key="tag.fid">{{tag.fname}}</a-tag>
    </span>
          <span slot="action" slot-scope="text, record" style="display:block;width:160px;">
      <a @click="handleEdit(record)">修改</a>
      <a-divider type="vertical"/>
      <a href="javascript:;" class="ant-dropdown-link">
        <a-popconfirm title='确定删除该基地?' @confirm="() => handleDelete(record.id)">
          删除
        </a-popconfirm>
      </a>
      <a-divider type="vertical"/>
       <a-dropdown>
            <a class="ant-dropdown-link">
              更多 <a-icon type="down" />
            </a>
            <a-menu slot="overlay">
              <a-menu-item >
                <a href="javascript:;" @click="bindnh(record)">绑定农户</a>
                </a-menu-item >
                <a-menu-item >
                <a href="javascript:;" @click="bindnh1(record)">解除绑定</a>
              </a-menu-item>
               <a-menu-item >
                <a href="javascript:;" @click="lookpic(record)">查看相册</a>
              </a-menu-item>
              <a-menu-item >
                <a href="javascript:;" @click="editshop(record)">编辑商店</a>
              </a-menu-item >
              <a-menu-item >
                <a href="javascript:;" @click="lookbasepic(record)">编辑全景图</a>
              </a-menu-item >
            </a-menu>
          </a-dropdown>

    </span>

        </a-table>
      </div>

    </div>
    <BaseModal ref="usermodule"/>
    <PlotModule ref="plotmodule"/>
    <DistributionFar ref="distributionfar"/>
    <BasePic ref="basepic"/>
    <Baseimg ref="baseimg"/>
    <Baseimglook ref="baseimglook"/>
    <BaseShop ref="baseshop"/>
  </div>

</template>

<script>
  //import { version } from 'punycode';
  import BaseModal from './modules/BaseModal';
  import DistributionFar from '@/views/module/DistributionFar'
  import BaseShop from '@/views/module/BaseShop'
  import Baseimg from '@/views/patch/modules/BaseImg'
  import Baseimglook from '@/views/patch/modules/BaseImglook'
  import BasePic from '@/views/module/BasePic'
  import PlotModule from '@/views/module/PlotModule';
  import { queryBase, deleteBase } from '@/api/allapi';
  import { getbaselist,getmap } from '@/api/userApi'

  const columns = [{
    title: '基地名称',
    dataIndex: 'baseName',
    key: 'baseName',
    align: 'center',
  }, {
    title: '基地地址',
    dataIndex: 'baseAddress',
    key: 'baseAddress',
    align: 'center',
  }, {
    title: '面积(亩)',
    dataIndex: 'baseAcreage',
    key: 'baseAcreage',
    align: 'center',
    //width: '11%',
  }, {
    title: '规模(棵)',
    dataIndex: 'baseScale',
    key: 'baseScale',
    align: 'center',
  }, {
    title: '经度',
    dataIndex: 'log',
    key: 'log',
    align: 'center',
  }, {
    title: '纬度',
    dataIndex: 'lat',
    key: 'lat',
    align: 'center',
  }, {
    title: '基地状态',
    dataIndex: 'baseStatus',
    key: 'baseStatus',
    align: 'center',
     customRender:function (text) {
              if(text==0){
                return "冻结";
              }else if(text==1){
                return "正常";
              }else{
                return text;
              }
            },
  },{
  title: '所属农户',
  dataIndex: 'farmer',
  scopedSlots: { customRender: 'farmer' },
  align: 'center',
},  {
    title: '管理地块',
    dataIndex: 'add',
    key: 'add',
    scopedSlots: { customRender: 'add' },
    align: 'center',
  }, {
    title: '简介',
    dataIndex: 'intro',
    key: 'intro',
    scopedSlots: { customRender:'intro'},
    // customRender:(text)=> {
    //           if(text!=null){
    //           let a=text.split('');
    //           let b=[];
    //           if(a.length>20){
    //             for(let i=0;i<20;i++){
    //               b.push(a[i]);
    //             }
    //             let c=b.join('')+'...';
    //             return c;
    //           }else{
    //             return text;
    //           }
    //           }
    //           return text;
    //         },
    width:100,
    align: 'center',
  },{
    title: '商店',
    dataIndex: 'baseShop.shopName',
    key: 'baseShop.shopName',
    scopedSlots: { customRender:'baseShop.shopName'},
    align: 'center',
  },{
    title: '操作',
    dataIndex: 'action',
    key: 'action',
    scopedSlots: { customRender: 'action' },
    align: 'center',
  }];

  const i = 1;
  export default {
    name: 'WorkerList',
    components: {
      BaseModal,
      PlotModule,
      DistributionFar,
      BasePic,
      Baseimg,
      Baseimglook,
      BaseShop,
    },
    data() {
      return {
      treeData:[],
      value:'',
      area:'',
        baseinfo:[],
        columns,
        loading: false,
        userinfo: {},
        ipagination: {
          current: 1,
          pageSize: 10,
          pageSizeOptions: ['10', '20', '30'],
          showTotal: (total, range) => {
            return range[0] + '-' + range[1] + '共' + total + '条';
          },
          showQuickJumper: true,
          showSizeChanger: true,
          total: 0
        },
        dataSource: [],
        form: this.$form.createForm(this),
        formItemLayout: {
        labelCol: {
          xs: { span: 24 },
          sm: { span: 6 ,offset: 2},
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 16 },
        },
      },

      };
    },
    created() {
    //  getbaselist().then((res=>{
    //         this.baseinfo=res.result
    //       }))
          this.loadmap();
  },
    methods: {
      loadmap(){
        this.treeData=[];
  getmap().then((res)=>{
          for(let i=0;i<res.result.length;i++){
            var a={};
            a.value=String(res.result[i].id)+'-'+'1';
            a.key=String(res.result[i].id);
            a.title=res.result[i].name;
            a.children=[];
            if(res.result[i].children.length>0){
              for(let j=0;j<res.result[i].children.length;j++){
                var b={};
                b.value=String(res.result[i].children[j].id)+'-'+'2';
                b.key=String(res.result[i].children[j].id);
                b.title=res.result[i].children[j].name;
                b.children=[];
                if(res.result[i].children[j].children.length>0){
                  for(let k=0;k<res.result[i].children[j].children.length;k++){
                    var c={};
                    c.value=String(res.result[i].children[j].children[k].id)+'-'+'3';
                    c.key=String(res.result[i].children[j].children[k].id);
                    c.title=res.result[i].children[j].children[k].name;
                    b.children.push(c);
                  }
                }
                a.children.push(b);
              }
            }
            this.treeData.push(a);
          }
        });
      },
       onchange (value, label, extra) {
      // console.log('onchange_value', value);
      // console.log('onchange_lable', label);
      this.value=value;
      let a=value.split('-');
      this.area=a;
    },
     h(text){
      if(text!=null){
              let a=text.split('');
              let b=[];
              if(a.length>5){
                for(let i=0;i<5;i++){
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
      f(text) {
              if(text!=null){
              let a=text.split('');
              let b=[];
              if(a.length>15){
                for(let i=0;i<15;i++){
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
      lookbasepic(record){
        this.$refs.baseimg.edit(record);
      },
     editshop(record){
        this.$refs.baseshop.add(record);
      },
      loadbase(){
         getbaselist().then((res=>{
            this.baseinfo=res.result
          }))
      },
      lookpic(record){
        this.$refs.basepic.show(record);
        this.$refs.basepic.title = '查看相册';
      },
      bindnh(record){
         this.$refs.distributionfar.add(record);
        this.$refs.distributionfar.title = '绑定农户';
      },
      bindnh1(record){
        this.$refs.distributionfar.del(record);
        this.$refs.distributionfar.title = '解除绑定';
      },
      getQueryParams() {
        let param = Object.assign({}, this.userinfo);
        // param.field = this.getQueryField();
        param.pageNo = this.ipagination.current;
        param.pageSize = this.ipagination.pageSize;
        //return filterObj(param);
        return param;
      },
      loadData(arg) {
        let params = this.getQueryParams();//查询条件
        queryBase(params)
          .then((res) => {
            if (res.success) {
              this.dataSource = res.result.list;
              this.ipagination.total = res.result.total;
            }
          });
      },
      ok() {
        this.loadData();
      },
      handleplot(record) {
        this.$refs.plotmodule.edit(record);
      },
      handleEdit(record) {
        this.$refs.usermodule.edit(record);
        this.$refs.usermodule.title = '编辑';
      },
      handleAdd() {
        this.$refs.usermodule.add();
        this.$refs.usermodule.title = '新增';
      },
      handleDelete(id) {
        console.log(id);
        var that = this;
        let params = {};
        params.id = id;
        deleteBase(params)
          .then((res) => {
            if (res.success) {
              that.$message.success(res.message);
              that.loadData();
            } else {
              that.$message.warning(res.message);
            }
          });
      },
      handleReset() {

        this.loading = true;
        this.userinfo = {};
        this.value='';
        this.area='';
        this.form.resetFields();
        this.loadData();
        this.loading = false;
      },
      handleTableChange(pagination) {
        this.ipagination = pagination;
        this.loadData();
      },
      handleSearch(e) {
        e.preventDefault();
        this.userinfo = this.form.getFieldsValue(['baseName']);
        this.userinfo.areaCode=this.area[0];
        this.userinfo.level=this.area[1];
        console.log(this.userinfo);
        for (let k in this.userinfo) {
          if (this.userinfo[k] != undefined && this.userinfo[k].trim() == '') {
            this.userinfo[k] = undefined;
          }
        }
        this.loadData();
      }

    },
    mounted() {
      this.loadData();

    },

  };
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
