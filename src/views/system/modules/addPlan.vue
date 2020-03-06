<template>
    <a-modal
        title="添加种植计划"
        v-model="visible"
        @ok="handleOk"
        style="top:10%;height: 90%"
        cancelText="取消"
        okText="确定"
        :maskClosable="false"
        class="add-plan">
        <a-form
            :form="form">
            <div class="form-wrapper">
                <a-form-item label='计划名称'>
                    <a-input
                        v-decorator="['planName',{
                        rules: [{required: true, message: '请输入计划名称'}]
                    }]">
                    </a-input>
                </a-form-item>
            </div>
            <div class="form-wrapper">
                <a-form-item label='品种'>
                    <a-select
                    v-decorator="['cropId',{
                        rules: [{required: true, message: '请选择品种'}]
                    }]">
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
                <a-form-item label='产区'>
                    <a-input
                        v-decorator="['provenance', {
                        rules: [{required: true, message: '请输入产区'}]
                    }]">
                    </a-input>
                </a-form-item>
            </div>
        </a-form>
    </a-modal>
</template>
<script>
import {addPlatingPlan} from '@/api/permissonApi'
export default {
    props: {
        cropDatas: {
            default() {
                return []
            }
        }
    },
    data() {
        return {
            visible: false,
            form: this.$form.createForm(this)
        }
    },
    methods: {
        handleOk() {
            this.form.validateFieldsAndScroll((err, values) => {
                if (!err) {
                    const params = this.form.getFieldsValue()
                    let index = this.cropDatas.findIndex(item => item.id === params.cropId)
                    params.calId = this.cropDatas[index].calId
                    addPlatingPlan(params).then(res => {
                        this.$message.info(res.message)
                        this.visible = false
                        if (res.success) {
                            this.$parent._loadData()
                        }
                    })
                }
            })
        },
    }
}
</script>
<style lang="stylus">
    .add-plan
        .form-wrapper
            width 100%
            .ant-form-item-control-wrapper
                width 60%
                display inline-block
            .ant-form-item-label
                width 130px
                vertical-align top
</style>
