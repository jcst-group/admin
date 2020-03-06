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
            <div class="form-wrapper">
                <a-form-item label='农事名称'>
                    <a-input
                        v-decorator="['farmingName',{
                        initialValue:record.farmingName,
                        rules: [{required: true, message: '请输入农事名称'}]
                    }]">
                    </a-input>
                </a-form-item>
            </div>
            <div class="form-wrapper">
                <a-form-item label='农事周期'>
                    <a-input
                        onkeyup="this.value=this.value.replace(/\D/g,'')"
                        addonAfter='（天）'
                        v-decorator="['farmingCycle',{
                        initialValue:record.farmingCycle,
                        rules: [{required: true, message: '请输入农事周期'}]
                    }]">
                    </a-input>
                </a-form-item>
            </div>
            <div class="form-wrapper">
                <a-form-item label='品种'>
                    <a-select
                    @change="changeCrop"
                    v-decorator="['cropId',{
                        initialValue:record.crop ? record.crop.cropName : '',
                        rules: [{required: true, message: '请选择作物品种'}]
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
                <a-form-item label='计量单位'>
                    <a-select
                        disabled
                        placeholder="选择品种后自动带入"
                        v-decorator="['calId', {
                            initialValue: record.calId,
                            rules: [{
                                required: true, message: '请选择单位'
                            }]
                        }]"
                        style="width: 100%">
                        <a-select-option 
                            v-for="item in unitDatas"
                            :key="item.id"
                            :value='item.id'>
                            {{item.unit}}
                        </a-select-option>
                    </a-select>
                </a-form-item>
            </div>
            <div class="form-wrapper">
                <a-form-item label='农事项目'>
                    <a-select
                        placeholder="请先选择品种"
                        v-decorator="['farmingItemId',{
                            initialValue:record.farmingItem ? record.farmingItem.farmingName : undefined,
                            rules: [{required: true, message: '请选择农事项目'}]
                        }]">
                        <a-select-option 
                            v-for="item in farmingDatas"
                            :key="item.id"
                            :value='item.id'>
                            {{item.farmingName}}
                        </a-select-option>
                    </a-select>
                </a-form-item>
            </div>
            <div class="form-wrapper">
                <a-form-item label='是否定位'>
                    <a-select
                    v-decorator="['isLocation',{
                        initialValue:record.isLocation ? record.isLocation.displayName : '',
                        rules: [{required: true, message: '请选择是否定位'}]
                    }]">
                        <a-select-option 
                            v-for="item in locationDatas"
                            :key="item.value"
                            :value='item.code'>
                            {{item.displayName}}
                        </a-select-option>
                    </a-select>
                </a-form-item>
            </div>
            <div class="form-wrapper">
                <a-form-item label='角色'>
                    <a-select
                    mode='multiple'
                    :filterOption='filterRole'
                    v-decorator="['roleIds' ,{
                        initialValue:record.roleIds,
                        rules: [{required: true, message: '请选择角色'}]
                    }]">
                        <a-select-option 
                            v-for="item in roleDatas"
                            :key="item.id"
                            :value='item.id'>
                            {{item.name}}
                        </a-select-option>
                    </a-select>
                </a-form-item>
            </div>
            <div class="form-wrapper">
                <a-form-item label='开始时间'>
                    <a-date-picker 
                        style="width:100%"
                        v-decorator="['startTime', {
                            initialValue: record.startTime ? moment(record.startTime, 'YYYY-MM-DD') : null,
                            rules: [{required: true, message: '请选择开始时间'}]
                        }]"
                    />
                    <!-- <a-input
                    v-decorator="['startTime', {
                        initialValue:record.startTime,
                        rules: [{required: true, message: '请输入开始时间'}]
                    }]" /> -->
                </a-form-item>
            </div>
            <div class="form-wrapper" style="width:100%">
                <a-form-item label='备注'>
                    <a-textarea :autosize={minRows:2,maxRows:6} v-decorator="[
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
import {getAllFarming, getallpermission, getAllLocation, getFarmByCrop} from '@/api/allapi'
import {addTemporary, updateFarming, getAllCrop} from '@/api/permissonApi'
import {getAllUnit, getUnitByCrop} from '@/api/ddwbApi'
import moment from 'moment'
export default {
    data() {
        return {
            title: '',
            visible: false,
            form: this.$form.createForm(this),
            farmingDatas: [],
            locationDatas: [],
            roleDatas: [],
            cropDatas: [],
            record: {},
            moment: moment,
            unitDatas: []
        }
    },
    created() {
        getAllUnit().then(res => {
            if (res.success) {
                this.unitDatas = res.result
            }
        })
    },
    methods: {
        open(record) {
            this._getData()
            this.visible = true
            this.form.resetFields()
            if (record !== undefined) {
                let roleIds = []
                this.record = record
                this.record.roleList.forEach(item => {
                    roleIds.push(item.id)
                })
                this.record.roleIds = roleIds
                getFarmByCrop({
                    cropId: record.cropId
                }).then(res => {
                    if (res.success) {
                        this.farmingDatas = res.result
                    }
                })
            } else {
                this.record = {}
            }
        },
        filterRole(inputValue, option) {
            return option.componentOptions.children[0].text.indexOf(inputValue) > -1 ? true : false
        },
        handelCancel() {
            this.visible = false
            this.farmingDatas = []
        },
        handleOk() {
            if (this.title === '添加临时农事') {
                this.form.validateFieldsAndScroll((err, values) => {
                    if (!err) {
                        const params = this.form.getFieldsValue()
                        params.startTime = this.moment(params.startTime).format('YYYY-MM-DD')
                        let roles = [...params.roleIds]
                        for (let i = 0; i < roles.length; i++) {
                            var index = roles[i]
                            roles[i] = {
                                id: index
                            }
                        }
                        params.roleList = roles
                        addTemporary(params).then(res => {
                            this.$message.info(res.message)
                            if (res.success) {
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
                        params.id = this.record.id
                        params.cropId = params.cropId === this.record.crop.cropName ? this.record.cropId : params.cropId
                        params.isLocation = params.isLocation === this.record.isLocation.displayName ? this.record.isLocation.code : params.isLocation
                        params.farmingItemId = params.farmingItemId === this.record.farmingItem.farmingName ? this.record.farmingItemId : params.farmingItemId
                        params.startTime = this.moment(params.startTime).format('YYYY-MM-DD')
                        let roles = [...params.roleIds]
                        for (let i = 0; i < roles.length; i++) {
                            var index = roles[i]
                            roles[i] = {
                                id: index
                            }
                        }
                        params.roleList = roles
                        updateFarming(params).then(res => {
                            this.$message.info(res.message)
                            if (res.success) {
                                this.$parent._loadData()
                                this.visible = false
                            }
                        })
                    }
                })
            }
        },
        changeCrop(value) {
            this.form.setFieldsValue({
                farmingItemId: ''
            })
            getFarmByCrop({
                cropId: value
            }).then(res => {
                if (res.success) {
                    this.farmingDatas = res.result
                }
            })
            getUnitByCrop({
                cropId: value
            }).then(res => {
                this.form.setFieldsValue({
                    calId: res.result.id
                })
            })
        },
        _getData() {
            getAllCrop().then(res => {
                if (res.success) {
                    this.cropDatas = res.result
                }
            })
            getallpermission().then(res => {
                if (res.success) {
                    this.roleDatas = res.result
                }
            })
            getAllLocation().then(res => {
                if (res.success) {
                    this.locationDatas = res.result
                }
            })
        }
    }
}
</script>

<style lang='stylus'>
    .change-temporary
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
