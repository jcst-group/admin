/*
*   字典管理修改模块
*/
<template>
  <div>
    <a-modal
      :title="title"
      v-model="visible"
      @ok="handleOk"
      style="top:5%;height: 90%;"
      cancelText="取消"
      :okText="okText"
      width="845px"
      :maskClosable="false"
    >

      <template v-if="naddd">
        <div style="margin: 0 0 16px 10px;">
          <a-button
            type="primary"
            icon="plus"
            @click="plus"
          >
            添加数据字典项
          </a-button>
        </div>
        <a-table :columns="columns"
                 rowKey="id"
                 :dataSource="data"
        >
          <template v-for="col in ['dictName', 'dictValue', 'dictFieldType','dictFieldLength','createTime','createManId','updateTime','updateManId']" :slot="col" slot-scope="text, record, index">
            <div :key="col">
              <a-input
                v-if="record.editable"
                style="margin: -5px 0"
                :value="text"
                @change="e => handleChange(e.target.value, record.id, col)"
              />
              <template v-else>{{text}}</template>
            </div>
          </template>

          <template slot="operation" slot-scope="text, record, index">
            <div class='editable-row-operations'>
        <span v-if="record.editable">
          <a @click="() => save(record.id)" style="margin-right: 10px">保存</a>
          <a-popconfirm title='确定撤销修改?' @confirm="() => cancel(record.id)">
            <a>取消</a>
          </a-popconfirm>
        </span>
              <span v-else>
          <a @click="() => edit(record.id)" style="margin-right: 10px">编辑</a>
           <a-popconfirm title='确定要删除该数据吗?' @confirm="()=>deleteRecord(record.id)">
            <a>删除</a>
          </a-popconfirm>

        </span>
            </div>
          </template>

        </a-table>
      </template>
      <template v-if="addd">
        <a-form
          :form="form"
        >
          <a-form-item
            v-bind="formItemLayout"
            label="名称"
          >
            <a-input
              v-decorator="[
          'dictName',

          {
            rules: [{ required: true, message: '请输入名称' }],
          }
        ]"
            />
          </a-form-item>
          <a-form-item
            v-bind="formItemLayout"
            label="参数值"
          >
            <a-input
              v-decorator="[
          'dictValue',
          {
            rules: [{ required: true, message: '请输入参数值' }],

          }
        ]"
            />
          </a-form-item>
          <a-form-item
            v-bind="formItemLayout"
            label="字段类型"
          >
            <a-input
              v-decorator="[
          'dictFieldType',
          {
            rules: [{ required: true, message: '请输入字段类型' }],

          }
        ]"
            />
          </a-form-item>
          <a-form-item
            v-bind="formItemLayout"
            label="字段长度"
          >
            <a-input
              v-decorator="[
          'dictFieldLength',
          {
            rules: [{ required: true, message: '请输入字段长度' }],

          }
        ]"
            />
          </a-form-item>
        </a-form>
      </template>
    </a-modal>
  </div>
</template>

<script>
  import Vue from 'vue'
  import { ACCESS_TOKEN } from "@/store/mutation-types"
  import { insertDictionary,deleteDictionary,updateDictionary } from '@/api/userApi'

  const columns = [{
    title: '名称',
    dataIndex: 'dictName',
    scopedSlots: { customRender: 'dictName' },
  }, {
    title: '参数值',
    dataIndex: 'dictValue',
    scopedSlots: { customRender: 'dictValue' },
  }, {
    title: '字段类型',
    dataIndex: 'dictFieldType',
    scopedSlots: { customRender: 'dictFieldType' },
  }, {
    title: '字段长度',
    dataIndex: 'dictFieldLength',
    scopedSlots: { customRender: 'dictFieldLength' },
  }, {
    title: '创建时间',
    dataIndex: 'createTime',
    scopedSlots: { customRender: 'createTime' },
  }, {
    title: '创建人名称',
    dataIndex: 'createManId',
    scopedSlots: { customRender: 'createManId' },
  }, {
    title: '修改时间',
    dataIndex: 'updateTime',
    scopedSlots: { customRender: 'updateTime' },
  }, {
    title: '修改人名称',
    dataIndex: 'updateManId',
    scopedSlots: { customRender: 'updateManId' },
  }, {
    title: '操作',
    dataIndex: 'operation',
    scopedSlots: { customRender: 'operation' },
  }]

  export default {
    data () {
      return {
        okText:'',
        title:'',
        addd:false,
        naddd:true,
        record:{},
        visible: false,
        data:[],
        columns,
        form: this.$form.createForm(this),
        formItemLayout: {
          labelCol: {
            xs: { span: 24 },
            sm: { span: 8 },
          },
          wrapperCol: {
            xs: { span: 24 },
            sm: { span: 16 },
          },
        },
        tailFormItemLayout: {
          wrapperCol: {
            xs: {
              span: 24,
              offset: 0,
            },
            sm: {
              span: 16,
              offset: 8,
            },
          },
        },
      }
    },

    methods: {
      plus(){
        this.addd=true
        this.naddd=false
        this.title="添加数据字典项"
        this.okText="增加"
      },
      add(){

      },
      deleteRecord(key){
        const param ={};
        param.id = key;
        deleteDictionary(param).then((res)=>{
          if(res.success){
            this.$message.success(res.message);
            this.visible=false;
            this.form.resetFields();
            this.$parent.loadData();
            //this.$parent.refreshTestItemModal(this.record.id);
            //const newrecord = this.$store.state.user.protestlist.list.filter(product=>this.record.id===product.id)[0];
            //console.log(newrecord)
            //this.look(newrecord)
            //this.$parent.loadItems(this.record.id);
          }else{
            this.$message.warning(res.message);
          }
        })
      },
      save(key){
        console.log("key:"+key)
        const newData = [...this.data]
        const target = newData.filter(item => key === item.id)[0]
        if (target) {
          delete target.editable
          updateDictionary(target).then((res)=>{
            if(res.success){
              this.$message.success(res.message);
              this.$emit('loadData');
              this.cancel(target.id)
            }else{
              this.$message.warning(res.message);
            }
          })
        }
      },
      handleChange (value, key, column) {
        console.log("value:"+value+" key:"+key+" column:"+column)
        const newData = [...this.data]
        const target = newData.filter(item => key === item.id)[0]
        if (target) {
          target[column] = value
          this.data = newData
        }
        console.log(this.data)
      },
      edit (key) {
        console.log("key:"+key)
        const newData = [...this.data]
        const target = newData.filter(item => key === item.id)[0]
        if (target) {
          target.editable = true
          this.data = newData
        }
        console.log(newData)
      },
      cancel(key){
        console.log("key:"+key)
        const newData = [...this.data]
        const target = newData.filter(item => key === item.id)[0]
        if (target) {
          delete target.editable
          this.data = newData
        }
        console.log(newData)
      },
      /* handleOk(){
           this.visible=false
       },*/
      look(record){
        this.record=record
        this.data=record.dictionaryList
        this.visible=true
        this.addd=false
        this.naddd=true
        this.title="查看数据字典项"
        this.okText="返回"
      },
      recallDataBack(){

      },
      handleOk(){
        if(this.okText=="增加"){
          this.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
              const userinfo=this.form.getFieldsValue(['dictName','dictValue','dictFieldType','dictFieldLength'])
              //console.log("我要看的：")
              //console.log(this.data)
              userinfo.dictTypeId=this.record.id
              insertDictionary(userinfo).then((res=>{
                if(res.success==true){
                  this.$message.info('添加成功！')
                  this.form.resetFields()
                  this.visible=false;
                  this.$parent.loadData();
                }else{
                  this.$message.info(res.message)
                  this.visible=false;
                }
              }))

              //this.$message.info(this.$store.state.user.addinfo)
              //console.log(this.form.getFieldsValue(['username','password','phone','sex','email']))
            }
          });
        }
        if(this.okText=="返回"){
          this.visible=false
        }
      }
    },
  }
</script>
<style scoped>
</style>
