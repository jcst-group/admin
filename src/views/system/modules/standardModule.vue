<template>
    <a-modal
      :title="title"
      v-model="visible"
      @ok="handleOk"
      style="top:10%;height: 90%"
      cancelText="取消"
      okText="确定"
      :maskClosable="false"
      class="standard-modal"
    >
        <a-form :form='form'>
            <div class="form-wrapper">
                <a-form-item label='作物名称'>
                    <a-select
                    v-if="cropDatas.length > 0" 
                    v-decorator="[
                        'crop.id',
                            {
                                initialValue:record.crop ? record.crop.cropName : '',
                                rules: [{ required: true, message: '请选择作物名称' }],
                            }
                        ]">
                        <a-select-option 
                            v-for="item in cropDatas"
                            :key="item.id"
                            :value='item.id'>
                            {{item.cropName}}
                        </a-select-option>
                    </a-select>
                </a-form-item>
            </div>
            <div class="form-wrapper">
                <a-form-item label='检测类型'>
                    <a-select
                    v-if="stageDatas.length > 0" 
                    v-decorator="[
                        'stage.code',
                            {
                                initialValue:record.stage ? record.stage.displayName : '',
                                rules: [{ required: true, message: '请选择检测类型' }],
                            }
                        ]">
                        <a-select-option 
                            v-for="item in stageDatas"
                            :key="item.value"
                            :value='item.code'>
                            {{item.displayName}}
                        </a-select-option>
                    </a-select>
                </a-form-item>
            </div>
            <div class="form-wrapper">
                <a-form-item label='项目类别'>
                    <a-select
                        v-if="categoryDatas.length > 0" 
                        v-decorator="[
                            'itemCategory.code',
                                {
                                    initialValue:record.itemCategory ? record.itemCategory.displayName : '',
                                    rules: [{ required: true, message: '请选择项目类别' }],
                                }
                            ]">
                        <a-select-option 
                            v-for="item in categoryDatas"
                            :key="item.value"
                            :value='item.code'>
                            {{item.displayName}}
                        </a-select-option>
                    </a-select>
                </a-form-item>
            </div>
            <div class="form-wrapper">
                <a-form-item label='检测项目名称'>
                    <a-input v-decorator="[
                    'item',
                    {
                        initialValue:record.item,
                        rules: [{ required: true, message: '请输入检测项目名称'}],
                    }
                ]" />
                </a-form-item>
            </div>
            <div class="form-wrapper">
                <a-form-item label='检测单位'>
                    <a-select 
                        v-if="unitDatas.length > 0" 
                        v-decorator="[
                            'unit.code',
                            {
                                initialValue:record.unit ? record.unit.displayName : '',
                                rules: [{ required: true, message: '请选择单位'}],
                            }
                        ]">
                        <a-select-option 
                            v-for="item in unitDatas"
                            :key="item.value"
                            :value='item.code'>
                            {{item.displayName}}
                        </a-select-option>
                    </a-select>
                </a-form-item>
            </div>
            <div class="form-wrapper">
                <a-form-item label='检测标准最小值'>
                    <a-input-number style="width:100%" v-decorator="[
                    'minValue',
                    {
                        initialValue:record.minValue,
                        rules: [{ required: true, message: '请输入检测标准最小值'}],
                    }
                ]" />
                </a-form-item>
            </div>
            <div class="form-wrapper">
                <a-form-item label='检测标准最大值'>
                    <a-input-number style="width:100%" v-decorator="[
                    'maxValue',
                    {
                        initialValue:record.maxValue,
                        rules: [{ required: true, message: '请输入检测标准最大值'}],
                    }
                ]" />
                </a-form-item>
            </div>
        </a-form>
    </a-modal>
</template>
<script>
import {getAllCrop,getAllCategory,getAllStage,getAllUnit,addStandard,updateStandard} from '@/api/permissonApi'
export default {
    data() {
        return {
            form: this.$form.createForm(this),
            unitDatas: [],
            cropDatas: [],
            stageDatas: [],
            categoryDatas: [],
            title: '',
            visible: false,
            record: {}
        }
    },
    created () {
        this._getAllDatas()
    },
    methods: {
        _getAllDatas() {
            getAllCrop().then(res => {
                if (res.success) {
                    this.cropDatas = res.result
                }
            })
            getAllCategory().then(res => {
                if (res.success) {
                    this.categoryDatas = res.result
                }
            })
            getAllStage().then(res => {
                if (res.success) {
                    this.stageDatas = res.result
                }
            })
            getAllUnit().then(res => {
                if (res.success) {
                    this.unitDatas = res.result
                }
            })
        },
        open(record) {
            this.visible = true
            this.form.resetFields()
            if (record !== undefined) {
                this.record = record
            } else {
                this.record = {}
            }
        },
        handleOk() {
            if (this.title === '添加检测标准') {
                this.form.validateFieldsAndScroll((err, values) => {
                    if (!err) {
                        const params = this.form.getFieldsValue()
                        params.cropId = String(params.crop.id)
                        params.itemCategory = params.itemCategory.code
                        params.stage = params.stage.code
                        params.unit = params.unit.code
                        delete params.crop
                        addStandard(params).then(res => {
                            this.$message.info(res.message)
                            this.visible = false
                            if (res.success) {
                                this.$parent._loadData()
                            }
                        })
                    }
                })
            } else {
                const params = this.form.getFieldsValue()
                if (this.record.cropId) {
                    params.cropId = typeof params.crop.id === 'number' ? params.crop.id : this.record.cropId
                }
                params.id = this.record.id
                params.itemCategory = this.record.itemCategory.displayName === params.itemCategory.code ? this.record.itemCategory.code : params.itemCategory.code
                params.stage = this.record.stage.displayName === params.stage.code ? this.record.stage.code : params.stage.code
                params.unit = this.record.unit.displayName === params.unit.code ? this.record.unit.code : params.unit.code
                delete params.crop
                updateStandard(params).then(res => {
                    this.$message.info(res.message)
                    this.visible = false
                    if (res.success) {
                        this.$parent._loadData()
                    }
                })
            }
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
</style>
