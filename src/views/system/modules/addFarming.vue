<template>
    <a-modal
        :title="title"
        v-model="visible"
        @ok="handleOk"
        style="top:10%;height: 90%"
        cancelText="取消"
        okText="确定"
        :maskClosable="false"
        class="add-farming">
        <a-form
            :form="form">
            <div class="form-wrapper">
                <a-form-item label='节气'>
                    <a-select
                    v-decorator="['solarTerm',{
                        initialValue:record.solarTerm ? record.solarTerm.displayName : '',
                        rules: [{required: true, message: '请选择节气'}]
                    }]">
                        <a-select-option 
                            v-for="item in jieqiDatas"
                            :key="item.value"
                            :value='item.code'>
                            {{item.displayName}}
                        </a-select-option>
                    </a-select>
                </a-form-item>
            </div>
            <div class="form-wrapper">
                <a-form-item label='候期'>
                    <a-select
                    v-decorator="['hou',{
                        initialValue:record.hou ? record.hou.displayName : '',
                        rules: [{required: true, message: '请选择候期'}]
                    }]">
                        <a-select-option 
                            v-for="item in houDatas"
                            :key="item.value"
                            :value='item.code'>
                            {{item.displayName}}
                        </a-select-option>
                    </a-select>
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
                <a-form-item label='农事项目'>
                    <a-select
                    v-decorator="['farmingItemId',{
                        initialValue:record.farmingItem ? record.farmingItem.farmingName : '',
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
        </a-form>
    </a-modal>
</template>
<script>
import {
    getallpermission,
    getAllFarming,
    getFarmByCrop,
    getAllLocation,
    getAllJieqi,
    getAllHou
} from "@/api/allapi"
import {addFarming, updateFarming} from "@/api/permissonApi"
export default {
    data() {
        return {
            visible: false,
            form: this.$form.createForm(this),
            title: '',
            getKey: '',
            curCrop: '',
            record: {},
            jieqiDatas: [],
            houDatas: [],
            farmingDatas: [],
            locationDatas: [],
            roleDatas: []
        }
    },
    methods: {
        handleOk() {
            if (this.title === '添加农事记录') {
                this.form.validateFieldsAndScroll((err, values) => {
                    if (!err) {
                        const params = this.form.getFieldsValue()
                        params.planYearId = this.getKey
                        let roles = [...params.roleIds]
                        for (let i = 0; i < roles.length; i++) {
                            var index = roles[i]
                            roles[i] = {
                                id: index
                            }
                        }
                        params.roleList = roles
                        addFarming(params).then(res => {
                            this.$message.info(res.message)
                            if (res.success) {
                                this.visible = false
                                this.$emit('tabTrigger')
                            }
                        })
                    }
                })
            } else {
                this.form.validateFieldsAndScroll((err, values) => {
                    if (!err) {
                        const params = this.form.getFieldsValue()
                        params.id = this.record.id
                        params.planYearId = this.getKey
                        params.hou = params.hou === this.record.hou.displayName ? this.record.hou.code : params.hou
                        params.isLocation = params.isLocation === this.record.isLocation.displayName ? this.record.isLocation.code : params.isLocation
                        params.solarTerm = params.solarTerm === this.record.solarTerm.displayName ? this.record.solarTerm.code : params.solarTerm
                        params.farmingItemId = params.farmingItemId === this.record.farmingItem.farmingName ? this.record.farmingItemId : params.farmingItemId
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
                                this.visible = false
                                this.$emit('tabTrigger')
                            }
                        })
                    }
                })
            }
        },
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
            } else {
                this.record = {}
            }
        },
        _getData() {
            getallpermission().then(res => {
                if (res.success) {
                    this.roleDatas = res.result
                }
            })
            getFarmByCrop({
                cropId: this.curCrop
            }).then(res => {
                if (res.success) {
                    this.farmingDatas = res.result
                }
            })
            getAllHou().then(res => {
                if (res.success) {
                    this.houDatas = res.result
                }
            })
            getAllJieqi().then(res => {
                if (res.success) {
                    this.jieqiDatas = res.result
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
<style lang="stylus">
    .add-farming
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
