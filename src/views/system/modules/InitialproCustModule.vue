<template>
  <a-modal :title="title" v-model="visible" @ok="handleOk" style="top:10%;height: 90%" cancelText="取消" okText="确定" :maskClosable="false" class="standard-modal">
    <a-form :form='form'>
      <div class="form-wrapper">
        <a-form-item label='作物名称'>
          <a-select v-if="cropDatas.length > 0" v-decorator="[
                        'crop.id',
                            {
                                initialValue:record.crop ? record.crop.cropName : '',
                                rules: [{ required: true, message: '请选择作物名称' }],
                            }
                        ]">
            <a-select-option v-for="item in cropDatas" :key="item.id" :value='item.id'>
              {{item.cropName}}
            </a-select-option>
          </a-select>
        </a-form-item>
      </div>
      <div class="form-wrapper">
        <a-form-item label='加工事件'>
          <a-input placeholder="请输入10位以内任意字符" v-decorator="[
                    'processingName',
                    {
                        initialValue:record.processingName,
                        rules: [{
                        required: true, message: '请输入加工事件',
                        }],
                    }
                ]" />
        </a-form-item>
      </div>
      <div class="form-wrapper">
        <a-form-item label='方法'>
          <a-textarea :autosize="{ minRows: 4, maxRows: 6 }" placeholder="请输入100位以内任意字符" v-decorator="[
                    'methods',
                    {
                        initialValue:record.methods,
                        rules: [{
                        required: true, message: '请输入方法',
                        }],
                    }
                ]" />
        </a-form-item>
      </div>
    </a-form>
  </a-modal>
</template>
<script>
  import { getAllCrop, addProcessing,updateProcessing } from '@/api/permissonApi'
  import ATextarea from "ant-design-vue/es/input/TextArea";

  export default {
    components: {
      ATextarea
    },
    data() {
      return {
        familyDatas: [],
        loading: false,
        relationDatas: [],
        form: this.$form.createForm(this),
        unitDatas: [],
        cropDatas: [],
        stageDatas: [],
        categoryDatas: [],
        title: '',
        visible: false,
        record: {},
      }
    },
    created() {
      this._getAllDatas()
    },
    methods: {
      _getAllDatas() {
        getAllCrop().then(res => {
          if(res.success) {
            this.cropDatas = res.result;
          }
        })
      },
      test(value, key, column) {
        this.familyLock = true
        const newData = [...this.familyDatas]
        const target = newData.filter(item => key === item.id)[0]
        if(target) {
          target.relation.code = value
          this.familyDatas = newData
        }
      },
      open(record) {
        this.visible = true
        this.form.resetFields()
        if(record !== undefined) {
          this.record = record
        } else {
          this.record = {}
        }
      },
      handleOk() {
        if(this.title === '新增') {
          this.form.validateFieldsAndScroll((err, values) => {
            if(!err) {
              const params = this.form.getFieldsValue()
              params.cropId = String(params.crop.id)
              params.methods = params.methods
              params.processingName = params.processingName
              if(params.processingName.length>10){
                this.$message.warn("加工事件名称不能超过10位")
              }else if(params.methods.length>100){
                this.$message.warn("方法不能超过100个字符")
              }else{
                addProcessing(params).then(res => {
                  this.$message.info(res.message)
                  this.visible = false
                  if(res.success) {
                    this.$parent._loadData()
                  }
                })
              }
            }
          })
        } else {
          const params = this.form.getFieldsValue()
          if(this.record.cropId) {
            params.cropId = typeof params.crop.id === 'number' ? params.crop.id : this.record.cropId
          }
          params.id = this.record.id
          params.methods = params.methods
          params.processingName = params.processingName
          delete params.crop
          if(params.processingName.length>10){
            this.$message.warn("加工事件名称不能超过10位")
          }else if(params.methods.length>100){
            this.$message.warn("方法不能超过100个字符")
          }else {
            updateProcessing(params).then(res => {
              this.$message.info(res.message)
              this.visible = false
              if (res.success) {
                this.$parent._loadData()
              }
            })
          }
        }
      },
      openHukou() {
        this.$refs.hukouMessage.visible = true
        this.$refs.hukouMessage.curUid = this.curUid
        this.$refs.hukouMessage.form.resetFields()
      }
    }
  }
</script>
<style lang="stylus">
  .standard-modal
    width: 900px !important

    .form-wrapper
      width 45%
      display inline-block

      .ant-form-item
        width 100%
        display inline-block

        .ant-form-item-control-wrapper
          width 60%
          display inline-block

        .ant-form-item-label
          width 150px
          vertical-align top

  .ant-input-number
    width: 200px

  .ant-modal-body
    padding: 12px

  .tab-box01 /deep/ .ant-form-item
    margin-bottom: 5px;

  .standard-modal /deep/ .ant-modal-body
    overflow-y: auto;
    max-height: 450px;
</style>
