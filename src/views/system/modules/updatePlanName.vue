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
        class="update-planname">
        <a-form
            :form="form">
            <div class="form-wrapper">
                <a-form-item label='计划名称'>
                    <a-input
                        v-decorator="['planName',{
                        initialValue:record.planName,
                        rules: [{required: true, message: '请输入计划名称'}]
                    }]">
                    </a-input>
                </a-form-item>
            </div>
        </a-form>
    </a-modal>
</template>

<script>
import {updatePlatingPlan, copyPlan} from '@/api/permissonApi'
export default {
    data() {
        return {
            visible: false,
            record: {},
            form: this.$form.createForm(this),
            title: '修改种植计划名称'
        }
    },
    methods: {
        open(record) {
            this.record = {...record}
            if (this.title === '复制计划') {
                this.record.planName = ''
            }
        },
        handleOk() {
            this.form.validateFieldsAndScroll(err => {
                if (!err) {
                    if (this.title === '复制计划') {
                        copyPlan({
                            id: this.record.id,
                            planName: this.form.getFieldValue('planName')
                        }).then(res => {
                            this.$message.info(res.message)
                            if (res.success) {
                                this.form.resetFields()
                                this.$parent._loadData()
                                this.visible = false
                            }
                        })
                    } else {
                        updatePlatingPlan({
                            id: this.record.id,
                            planName: this.form.getFieldValue('planName')
                        }).then(res => {
                            this.$message.info(res.message)
                            if (res.success) {
                                this.form.resetFields()
                                this.$parent._loadData()
                                this.visible = false
                            }
                        })
                    }
                }
            })
        },
        handleCancel() {
            this.form.resetFields()
        }
    }
}
</script>

<style lang='stylus'>

</style>
