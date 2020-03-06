<template>
  <div>
    <a-modal
      v-model="visible"
      :title="title"
      @ok="handleOk"
      okText="保存"
      cancelText="取消"
      :maskClosable="false"
    >
      <a-form :form="form">
        <a-form-item
          label="权限名称"
        >
          <a-input
            v-decorator="[
          'name',
          {
            rules: [{
              required: true, message: '请输入权限名称',
            }]
          }
        ]"
          />
        </a-form-item>
        <a-form-item
          label="上级权限"
          >
          <a-tree-select
            style="width:100%"
            :treeData="treeData"
            v-model="model.parentId"
            placeholder="请选择父级权限"
            >
          </a-tree-select>
        </a-form-item>

        <a-form-item
          label="接口url"
        >
          <a-input
            v-decorator="[
          'code',
          {
            rules: [{
              required: true, message: '请输入接口地址',
            }]
          }
        ]"
          />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>
<script>
  import {updatepermission,addpermission,getpermission} from '@/api/allapi'
  import {pick} from 'lodash'
  export default {
    data() {
      return {
        treeData:[],
        data:[],
        visible: false,
        title:"操作",
        model:{
          parentId:'-1',
        },
        form: this.$form.createForm(this),
      }
    },
    created(){
        getpermission().then((res)=>{ this.data=res.result});
    },
    methods: {
        load(){
            getpermission().then((res)=>{ this.data=res.result});
        },
      loadTree(defaultValue){
        let datas = this.getTreeData(this.data);
        
        if(defaultValue==undefined){
          let item = {};
          item.title = '根权限';
          item.value = '-1';
          item.key = '0';
          datas.unshift(item);
        }
        this.treeData = datas
        return datas

      },
      getTreeData(data){
        if(data instanceof  Array){
          let xx = [];
          for(let o in data){
            let obj = data[o]
            let item = this.getTreeData(obj);
             xx.push(item);
          }
          return xx;
        }else if(data instanceof Object){
          if(data.children!=undefined && data.children.length==0){
            let item = {};
            item.title = data.name;
            item.value = data.id;
            item.key = data.id;
            return item;
          }else{
            let item = {};
            item.title = data.name;
            item.value = data.id;
            item.key = data.id;
            item.children = this.getTreeData(data.children);
            return item;

          }
        }
      },
      add () {
          this.load();
          this.model={};
        this.form.resetFields();
        this.edit();
      },
      edit(record){
        this.form.resetFields();
        this.load();
        this.model={};
        if(record!=undefined){
          this.model = Object.assign({}, record);
          if(record.parentId!=undefined && record.parentId!=""){
            this.model.parentId = ""+record.parentId;
          }
        let fieldsVal = pick(this.model,'code','name');
        this.$nextTick(() => {
          this.form.setFieldsValue(fieldsVal)
        });
        }  
        this.visible = true;
        this.loadTree()
      },
      handleOk(){
        const that = this;
        // 触发表单验证
        this.form.validateFields((err, values) => {
          if (!err) {
            that.confirmLoading = true;
            let formData = Object.assign(this.model, values);
            let obj;
            if(!this.model.id){
              obj=addpermission(formData);
            }else{
              obj=updatepermission(formData);
            }
            obj.then((res)=>{
              if(res.success){
                that.$message.success(res.message);
                that.$emit('ok');
              }else{
                that.$message.warning(res.message);
              }
            }).finally(() => {
              that.confirmLoading = false;
              that.hideModal();
            })
          }
        })
      },
      showModal() {
        this.visible = true
      },
      hideModal() {
        this.visible = false
        this.$parent.loadData();
      },
    }
  }
</script>
