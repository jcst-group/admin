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
          label="菜单名称"
        >
          <a-radio-group  v-decorator="[
          'type',
          {
            rules: [{
              required: true, message: '请选择类型',
            }]
          }
        ]" buttonStyle="solid">
            <a-radio-button :value="1">菜单</a-radio-button>
            <a-radio-button :value="2">功能</a-radio-button>
          </a-radio-group>

        </a-form-item>


        <a-form-item
          label="菜单名称"
        >
          <a-input
            v-decorator="[
          'name',
          {
            rules: [{
              required: true, message: '请输入菜单名称',
            }]
          }
        ]"
          />
        </a-form-item>
        <a-form-item
          label="上级菜单"
          >
          <a-tree-select
            style="width:100%"
            :treeData="treeData"
            v-model="model.parentId"
            placeholder="请选择父级菜单"
            >
          </a-tree-select>
        </a-form-item>

        <a-form-item
          label="前端URL"
        >
          <a-input
            v-decorator="[
          'code',
          {
            rules: [{
              required: true, message: '请输入前端地址',
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
  import {updateMenu,addMenu} from '@/api/allapi'
  import {pick} from 'lodash'
  export default {
    data() {
      return {
        treeData:[],
        visible: false,
        title:"操作",
        model:{
          parentId:'-1',
        },
        initModel:{
          parentId:'-1',
        },
        form: this.$form.createForm(this),
      }
    },

    computed:{
      treeDatas(){
        let data = this.getTreeData(this.$store.state.resource.datas);
        return data
      }
    },
    methods: {

      loadTree(defaultValue){
        let datas = this.getTreeData(this.$store.state.resource.datas)

        if(defaultValue==undefined){
          let item = {};
          item.title = '根菜单';
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
         this.form.resetFields();
        this.edit();
      },
      edit(record){
         this.form.resetFields();
         this.model = this.initModel;
        if(record!=undefined){
          this.model = Object.assign({}, record);
          if(record.parentId!=undefined && record.parentId!=""){
            this.model.parentId = ""+record.parentId;
          }
        let fieldsVal = pick(this.model,'code','name','type');
        this.$nextTick(() => {
          this.form.setFieldsValue(fieldsVal)
        });
        }else{

        }
        /*console.log(this.model);
        let fieldsVal = pick(this.model,'code','name');
        this.$nextTick(() => {
          this.form.setFieldsValue(fieldsVal)
        });*/
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
              obj=addMenu(formData);
            }else{
              obj=updateMenu(formData);
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
        this.$store.dispatch("user/queryMenus");
      },
    },
    mounted() {
      this.$store.dispatch('resource/queryMenus')
    }
  }
</script>
