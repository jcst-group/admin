<template>
    <a-modal
        :title="title"
        v-model="visible"
        @ok="handleOk"
        @cancel='handleCancel'
        style="top:10%;height: 90%"
        cancelText="取消"
        okText="确定"
        :maskClosable="false"
        class="change-unit">
        <a-form :form="form">
            <div class="form-wrapper">
                <a-form-item label='作物计量单位'>
                    <a-input
                        v-decorator="['unit',{
                        rules: [{required: true, message: '请输入作物计量单位'}]
                    }]">
                    </a-input>
                </a-form-item>
            </div>
            <div class="form-wrapper">
                <a-form-item label='人资计量单位'>
                    <a-input
                        v-decorator="['personnelUnit', {
                        rules: [{required: true, message: '请输入人资计量单位'}]
                    }]">
                    </a-input>
                </a-form-item>
            </div>
            <div class="form-wrapper">
                <a-form-item label='物料计量单位'>
                    <a-input
                        v-decorator="['materialUnit', {
                        rules: [{required: true, message: '请输入物料计量单位'}]
                    }]">
                    </a-input>
                </a-form-item>
            </div>
            <div class="form-wrapper">
                <a-form-item label='设备计量单位'>
                    <a-input
                        v-decorator="['deviceUnit', {
                        rules: [{required: true, message: '请输入设备计量单位'}]
                    }]">
                    </a-input>
                </a-form-item>
            </div>
        </a-form>
    </a-modal>
</template>
<script>
import {addUnitList,updateUnitList} from '@/api/ddwbApi'

export default {
    data() {
        return {
            visible: false,
            title: '',
            record: {},
            form: this.$form.createForm(this)
        }
    },
    methods: {
        open(record) {
            if (record) {
                this.title = '添加计量单位'
            } else {
                this.title = '修改计量单位'
            }
            this.visible = true
            this.record = record || {}
        },
        handleOk() {
            this.form.validateFieldsAndScroll(err => {
                if (!err) {
                    let params = this.form.getFieldsValue()
                    addUnitList(params).then(res => {
                        if (res.success) {
                            this.visible = false
                            this.form.resetFields()
                            this.$parent._loadData()
                        }
                        this.$message.info(res.message)
                    })
                }
            })
        },
        handleCancel() {
            this.form.resetFields()
        }
    },
}
</script>
<style lang="stylus">
    .change-unit
        .form-wrapper
            width 100%
            .ant-form-item-control-wrapper
                width 60%
                display inline-block
            .ant-form-item-label
                width 130px
                vertical-align top
</style>