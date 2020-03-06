<template>
  <div>
    <a-modal
      v-model="visible"
      :title="title"
      @ok="handleOk"
      okText="保存"
      cancelText="取消"
      :maskClosable="false"
      class="role-modal"
    >
      <a-form :form="form">
        <div class="form-wrapper">
          <a-form-item
            label="角色名称"
          >
            <a-input
              v-decorator="[
                'name',
                {
                  rules: [{
                    required: true, message: '请输入角色名称',
                  }]
                }
              ]"
            />
          </a-form-item>
        </div>
        <div class="form-wrapper">
          <a-form-item 
          label='角色类型'
          >
            <a-select
            v-decorator="[
                'type',
                {
                  rules: [{
                    required: true, message: '请选择角色类型',
                  }]
                }
              ]">
                <a-select-option 
                    v-for="item in selectData"
                    :key="item.value"
                    :value='item.code'>
                    {{item.displayName}}
                </a-select-option>
            </a-select>
          </a-form-item>
        </div>
        <div class="form-wrapper">
          <a-form-item 
          label='备注'
          >
            <a-input 
            v-decorator="[
                'remark',
                {
                  rules: [{
                    required: true, message: '请填写备注',
                  }]
                }
              ]"/>
          </a-form-item>
        </div>
      </a-form>
    </a-modal>
  </div>
</template>
<script>
import { roleUpdate, roleAdd, roleType} from "@/api/permissonApi";
import { pick } from "lodash";
export default {
  data() {
    return {
      selectData: [],
      visible: false,
      title: "操作",
      model: {
        parentId: "-1"
      },
      initModel: {
        parentId: "-1"
      },
      form: this.$form.createForm(this)
    };
  },
  created() {
    roleType().then(res => {
      if (res.success) {
        this.selectData = res.result
      }
    })
  },
  methods: {
    add() {
      this.form.resetFields();
      this.edit();
    },
    edit(record) {
      this.form.resetFields();
      this.model = this.initModel;
      if (record != undefined) {
        this.model = Object.assign({}, record);
        let fieldsVal = pick(this.model, "name", "type" ,"remark");
        fieldsVal.type = fieldsVal.type.code
        setTimeout(() => {
          this.form.setFieldsValue(fieldsVal);
        }, 100);
      }
      /*console.log(this.model);
        let fieldsVal = pick(this.model,'code','name');
        this.$nextTick(() => {
          this.form.setFieldsValue(fieldsVal)
        });*/
      this.visible = true;
    },
    handleOk() {
      const that = this;
      // 触发表单验证
      this.form.validateFields((err, values) => {
        if (!err) {
          that.confirmLoading = true;
          let formData = Object.assign(this.model, values);
          let obj;
          let params = {
            id: formData.id,
            name: formData.name,
            type: formData.type,
            remark: formData.remark
          }
          if (!this.model.id) {
            obj = roleAdd(params);
          } else {
            obj = roleUpdate(params);
          }
          obj.then(res => {
              if (res.success) {
                that.$message.success(res.message);
                that.$emit("ok");
                this.$parent.loadData();
                that.hideModal();
              } else {
                that.$message.warning(res.message);
              }
          }).finally(() => {
              that.confirmLoading = false;
          });
        }
      });
    },
    showModal() {
      this.visible = true;
    },
    hideModal() {
      this.visible = false;
    }
  }
};
</script>
<style lang="stylus">
.role-modal
  .form-wrapper
            width 100%
        .ant-form-item-control-wrapper
            width 60%
            display inline-block
        .ant-form-item-label
            width 130px
            vertical-align top
</style>
