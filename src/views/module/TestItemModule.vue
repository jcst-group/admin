<template>
  <div>
     <a-modal
      :title="title"
      v-model="visible"
      @ok="handleOk"
      style="top:5%;height: 90%;"
      cancelText="取消"
      :okText="okText"
      :maskClosable="false"
    >

    <template v-if="naddd">
         <div style="margin: 0 0 16px 10px;">
      <a-button
        type="primary"
        icon="plus"
        @click="plus"
      >
        添加项目
      </a-button>
</div>
   <a-table :columns="columns"
    rowKey="id"
    :dataSource="data"

  >
     <template v-for="col in ['testItem', 'testValue', 'highest','unit']" :slot="col" slot-scope="text, record">
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

     <template slot="operation" slot-scope="text, record">
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
      label="测试项目"
    >
      <a-input
        v-decorator="[
          'testItem',

          {
            rules: [{ required: true, message: '请输入项目' }],
          }
        ]"
      />
    </a-form-item>
    <a-form-item
      v-bind="formItemLayout"
      label="值"
    >
      <a-input
        v-decorator="[
          'testValue',
          {
            rules: [{ required: true, message: '请输入值' }],

          }
        ]"
      />
    </a-form-item>
    <a-form-item
      v-bind="formItemLayout"
      label="最高值"
    >
      <a-input
        v-decorator="[
          'highest',
          {
            rules: [{ required: true, message: '请输入最高值' }],

          }
        ]"
      />
    </a-form-item>
     <a-form-item
      v-bind="formItemLayout"
      label="单位"
    >
      <a-input
        v-decorator="[
          'unit',
          {
            rules: [{ required: true, message: '请输入单位' }],

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
 import { additem } from '@/api/userApi'
import { deleteItem,updateItem } from '@/api/allapi'

const columns = [{
  title: '测试项目',
  dataIndex: 'testItem',
  scopedSlots: { customRender: 'testItem' },
}, {
  title: '平均值',
  dataIndex: 'testValue',
  scopedSlots: { customRender: 'testValue' },
}, {
  title: '最高值',
  dataIndex: 'highest',
  scopedSlots: { customRender: 'highest' },
}, {
  title: '单元',
  dataIndex: 'unit',
  scopedSlots: { customRender: 'unit' },
},{
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
       this.title="增加项目"
       this.okText="增加"
      },
      add(){

      },
    deleteRecord(key){
        console.log(" delete(key)")
      const param ={};
        param.id = key;
        deleteItem(param).then((res)=>{
          if(res.success){
            this.$message.success(res.message);
            this.$parent.loadData();
            var a=[];
            for(let i=0;i<this.data.length;i++){
              if(this.data[i].id!=key){
                a.push(this.data[i])
              }
            }
            this.data=a;
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
          updateItem(target).then((res)=>{
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
           console.log(this.record);
           this.data=record.testItemList
           this.visible=true
           this.addd=false
           this.naddd=true
           this.title="查看监测项目"
           this.okText="返回"
       },
        recallDataBack(){

        },
        handleOk(){
        if(this.okText=="增加"){
           this.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
             const userinfo=this.form.getFieldsValue(['testItem','testValue','highest','unit'])
             //console.log("我要看的：")
             //console.log(this.data)
             userinfo.produceTestId=this.record.id
              additem(userinfo).then((res=>{
                if(res.success==true){
                  this.$message.info('添加成功！')
                   this.form.resetFields();
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
