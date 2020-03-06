<template>
    <a-modal
        :title="title"
        v-model="visible"
        @ok="handleOk"
        style="top:5%;height: 90%"
        cancelText="取消"
        okText="确定"
        :maskClosable="false"
        class="message-modal"
    >
        <a-form :form='form'>
            <div class="form-wrapper">
                <a-form-item label='家庭成员名称' class="form-title">
                    <a-input v-decorator="[
                    'memberName',
                    {
                        initialValue:record.memberName,
                        rules: [{ required: true, message: '请输入家庭成员名称'}],
                    }
                    ]"
                    class="form-input" />
                </a-form-item>
            </div>
            <div class="form-wrapper">
                <a-form-item label='关系' class="form-title">
                    <a-select
                    v-if="relation.length > 0"
                    mode='combobox'
                    v-decorator="[
                        'relation',
                        {
                            initialValue:record.relation,
                            rules: [{ required: true, message: '请选择与用户的关系'}],
                        }
                    ]">
                        <a-select-option
                            v-for="(item,index) in relation"
                            :key="index"
                            :value='item.value'>
                            {{item.value}}
                        </a-select-option>
                    </a-select>
                </a-form-item>
            </div>
            <div class="form-wrapper">
                <a-form-item label='性别'>
                    <a-select
                    v-decorator="[
                        'sex',
                            {
                                initialValue:String(record.sex ? record.sex.displayName : ''),
                                rules: [{ required: true, message: '请选择你的性别' }],
                            }
                        ]">
                        <a-select-option value='MAN'>男</a-select-option>
                        <a-select-option value='WOMAN'>女</a-select-option>
                    </a-select>
                </a-form-item>
            </div>
            <div class="form-wrapper">
                <a-form-item label='身份证号'>
                    <a-input maxlength='18' v-decorator="['identifyCode', {rules: [{ message: '请正确填写身份证号',pattern: /(\d{17}?(\d|X))|(^\d{15}$)/}]
                }]" />
                </a-form-item>
            </div>
            <div class="form-wrapper">
                <a-form-item label='职业'>
                    <a-input v-decorator="['occupation']" />
                </a-form-item>
            </div>
            <div class="form-wrapper">
                <a-form-item label='政治面貌'>
                    <a-input v-decorator="['politicCountenance' ]" />
                </a-form-item>
            </div>
        </a-form>
    </a-modal>
</template>
<script>
import {addFamilyMenber} from '@/api/userApi'
export default {
    data() {
        return {
            title: '完善信息',
            visible: false,
            record: {},
            form: this.$form.createForm(this),
            curUid: ''
        }
    },
    props: {
        relation: {
            type: Array,
            default() {
                return []
            }
        }
    },
    methods: {
        handleOk() {
            this.form.validateFieldsAndScroll(err => {
                if (!err) {
                    const familyInfo = this.form.getFieldsValue()
                    familyInfo.userId = String(this.curUid)
                    addFamilyMenber(familyInfo).then(res => {
                        this.$message.info(res.message)
                        this.visible = false
                        this.$emit('trigger')
                    })
                }
            })
        }
    }
}
</script>
<style lang="stylus">
    .message-modal
        .form-wrapper
            .ant-form-item-control-wrapper
                width 60%
                display inline-block
            .ant-form-item-label
                width 130px
                vertical-align top
</style>
