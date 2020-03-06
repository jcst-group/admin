<template>
    <a-modal
        :title="title"
        v-model="visible"
        @ok="handleOk"
        @cancel='handelCancel'
        style="top:10%;height: 90%"
        cancelText="取消"
        okText="确定"
        :maskClosable="false"
        class="change-temporary">
        <a-form
            :form="form">
            <a-form-item v-if="this.title === '添加阶段' && record.children" label='阶段名称'>
                <a-input
                    v-decorator="['name',{
                        rules: [{required: true, message: '请输入阶段名称'}]
                    }]">
                </a-input>
            </a-form-item>
            <a-form-item v-if="!record.children" label='项目名称'>
                <a-input
                    v-decorator="['name',{
                        initialValue: record.name,
                        rules: [{required: true, message: '请输入项目名称'}]
                }]">
                </a-input>
            </a-form-item>
        </a-form>
    </a-modal>
</template>
<script>
import {addProjectManage} from '@/api/allapi'
export default {
    data() {
        return {
            form: this.$form.createForm(this),
            title: '',
            visible: false,
            record: {}
        }
    },
    methods: {
        open(record) {
            this.record = {}
            this.form.resetFields()
            this.visible = true
            this.record = record || {}
        },
        handleOk() {
            this.form.validateFieldsAndScroll((err, values) => {
                if (!err) {
                    let params = this.form.getFieldsValue()
                    if (this.record.id) {
                        params.parentId = this.record.id
                    }
                    addProjectManage(params).then(res => {
                        this.$message.info(res.message)
                        if (res.success) {
                            this.$parent._loadData()
                            this.visible = false
                            this.record = {}
                        }
                    })
                }
            })
        },
        handelCancel() {
            this.visible = false
            this.record = {}
        },
    },
}
</script>