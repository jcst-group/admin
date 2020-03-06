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
        class="theme-modal">
        <a-form
            :form="form">
            <div class="form-wrapper" v-if="!this.child">
                <a-form-item label="项目名称">
                    <a-select
                        @change="getThemeData"
                        v-decorator="['name', {
                            initialValue:record.project ? record.project.projectId : undefined,
                            rules: [{required: true, message: '请输入项目名称'}]
                        }]"
                        style="width: 230px">
                        <a-select-option 
                            v-for="item in projectDatas"
                            :key="item.id"
                            :value='item.id'>
                            {{item.name}}
                        </a-select-option>
                    </a-select>
                </a-form-item>
            </div>
            <div class="form-wrapper" v-if="!this.child">
                <a-form-item label="主题名称">
                    <a-select
                        placeholder="请先选择项目名称"
                        v-decorator="['projectId', {
                            initialValue:record.projectId,
                            rules: [{required: true, message: '请输入主题名称'}]
                        }]"
                        style="width: 230px">
                        <a-select-option 
                            v-for="item in themeDatas"
                            :key="item.id"
                            :value='item.id'>
                            {{item.name}}
                        </a-select-option>
                    </a-select>
                </a-form-item>
            </div>
            <div class="form-wrapper">
                <a-form-item label='分主题名称'>
                    <a-input
                        v-decorator="['themeName',{
                        initialValue:record.themeName,
                        rules: [{required: true, message: '请输入分主题名称'}]
                    }]">
                    </a-input>
                </a-form-item>
            </div>
            <div class="form-wrapper">
                <a-form-item label='处理人员'>
                    <a-input
                        v-decorator="['handlePerson',{
                        initialValue:record.handlePerson,
                        rules: [{required: true, message: '请输入处理人员'}]
                    }]">
                    </a-input>
                </a-form-item>
            </div>
            <div class="form-wrapper" style="width:100%">
                <a-form-item label='内容'>
                    <a-textarea
                        :autosize={minRows:2,maxRows:6} v-decorator="[
                        'content',
                        {
                            initialValue:record.content
                        }
                    ]" />
                </a-form-item>
            </div>
            <div class="form-wrapper">
                <a-form-item label='预计开始时间'>
                    <a-date-picker 
                        style="width:100%"
                        v-decorator="['expectStartTime', {
                            initialValue: record.expectStartTime ? moment(record.expectStartTime, 'YYYY-MM-DD') : null,
                            rules: [{required: true, message: '请选择预计开始时间'}]
                        }]"
                    />
                </a-form-item>
            </div>
            <div class="form-wrapper">
                <a-form-item label='预计结束时间'>
                    <a-date-picker 
                        style="width:100%"
                        v-decorator="['expectEndTime', {
                            initialValue: record.expectEndTime ? moment(record.expectEndTime, 'YYYY-MM-DD') : null,
                            rules: [{required: true, message: '请选择预计结束时间'}]
                        }]"
                    />
                </a-form-item>
            </div>
            <div class="form-wrapper">
                <a-form-item label='处理开始时间'>
                    <a-date-picker 
                        style="width:100%"
                        v-decorator="['handleStartTime', {
                            initialValue: record.handleStartTime ? moment(record.handleStartTime, 'YYYY-MM-DD') : null
                        }]"
                    />
                </a-form-item>
            </div>
            <div class="form-wrapper">
                <a-form-item label='处理结束时间'>
                    <a-date-picker 
                        style="width:100%"
                        v-decorator="['handleEndTime', {
                            initialValue: record.handleEndTime ? moment(record.handleEndTime, 'YYYY-MM-DD') : null
                        }]"
                    />
                </a-form-item>
            </div>
            <div class="form-wrapper" style="width:100%">
                <a-form-item label='备注'>
                    <a-textarea 
                        :autosize={minRows:2,maxRows:6} v-decorator="[
                        'remark',
                        {
                            initialValue:record.remark
                        }
                    ]" />
                </a-form-item>
            </div>
        </a-form>
    </a-modal>
</template>
<script>
import moment from 'moment'
import {addThemeManage, updateThemeManage,getProjectData} from '@/api/allapi'
export default {
    data() {
        return {
            title: '',
            visible: false,
            record: {},
            projectDatas: [],
            themeDatas: [],
            form: this.$form.createForm(this),
            child: false
        }
    },
    created() {
        getProjectData().then(res => {
            if (res.success) {
                this.projectDatas = res.result
            }
        })
    },
    methods: {
        moment,
        open(record, hasChild) {
            this.child = false
            if (hasChild) {
                this.child = hasChild
            }
            this.record = record || {}
            if (this.record.id && this.record.children) {
                this.getThemeData(this.record.project.projectId)
            }
            this.title = record ? '修改工作记录' : '添加工作记录'
            this.visible = true
        },
        getThemeData(value) {
            getProjectData({
                parentId: value
            }).then(res => {
                if (res.success) {
                    this.themeDatas = res.result
                }
            })
        },
        handleOk() {
            if (this.record.id && (!this.child || !this.record.children)) {
                this.form.validateFieldsAndScroll((err, values) => {
                    if (!err) {
                        const params = this.form.getFieldsValue()
                        params.id = this.record.id
                        let days = Math.abs(params.expectStartTime.diff(params.expectEndTime))/86400000 + 1
                        params.totalDays = parseInt(days)
                        params.expectStartTime = this.moment(params.expectStartTime).format('YYYY-MM-DD')
                        params.expectEndTime = this.moment(params.expectEndTime).format('YYYY-MM-DD')
                        if (params.handleStartTime) {
                            params.handleStartTime = this.moment(params.handleStartTime).format('YYYY-MM-DD')
                        }
                        if (params.handleEndTime) {
                            params.handleEndTime = this.moment(params.handleEndTime).format('YYYY-MM-DD')
                        }
                        updateThemeManage(params).then(res => {
                            this.$message.info(res.message)
                            if (res.success) {
                                this.form.resetFields()
                                this.themeDatas = []
                                this.$parent._loadData()
                                this.visible = false
                            }
                        })
                    }
                })
            } else {
                this.form.validateFieldsAndScroll((err, values) => {
                    if (!err) {
                        const params = this.form.getFieldsValue()
                        let days = Math.abs(params.expectStartTime.diff(params.expectEndTime))/86400000
                        params.totalDays = parseInt(days)
                        params.expectStartTime = this.moment(params.expectStartTime).format('YYYY-MM-DD')
                        params.expectEndTime = this.moment(params.expectEndTime).format('YYYY-MM-DD')
                        if (this.child) {
                            params.parentId = this.record.id
                        }
                        if (params.handleStartTime) {
                            params.handleStartTime = this.moment(params.handleStartTime).format('YYYY-MM-DD')
                        }
                        if (params.handleEndTime) {
                            params.handleEndTime = this.moment(params.handleEndTime).format('YYYY-MM-DD')
                        }
                        addThemeManage(params).then(res => {
                            this.$message.info(res.message)
                            if (res.success) {
                                this.form.resetFields()
                                this.themeDatas = []
                                this.$parent._loadData()
                                this.visible = false
                            }
                        })
                    }
                })
            }
        },
        handelCancel() {
            this.form.resetFields()
            this.themeDatas = []
        }
    },
}
</script>
<style lang="stylus">
    .theme-modal
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