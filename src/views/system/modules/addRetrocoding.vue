<template>
    <a-modal
        title="添加追溯"
        v-model="visible"
        @ok="handleOk"
        @cancel='handleCancel'
        style="top:10%;height: 90%"
        cancelText="取消"
        okText="确定"
        :maskClosable="false"
        class="add-retrocoding">
        <a-form
            :form="form">
            <div class="form-wrapper">
                <a-form-item label='批次编码'>
                    <a-select
                        :filterOption="filterBatch"
                        :showSearch='true'
                        @change="showCropDatas"
                        placeholder="请选择批次编码"
                        v-decorator="['retroCodeInfo.recoId', {
                            rules: [{required: true, message: '请选择批次编码'}]
                        }]">
                        <a-select-option
                            v-for="item in batchDatas"
                            :key="item.id"
                            :value='item.id'>
                            <div class='hide-name' style="color: rgba(0,0,0,0.4)">{{item.relationName}}</div>
                            <div class="crop-text">{{item.batchCode}}</div>
                        </a-select-option>
                    </a-select>
                </a-form-item>
            </div>
            <div class="form-wrapper">
                <a-form-item label='批次重量(kg)'>
                    <a-input
                        disabled
                        placeholder="选择批次编码后自动填入"
                        v-decorator="['residualOutput',{
                        rules: [{required: true, message: '请输入批次重量'}]
                    }]">
                    </a-input>
                </a-form-item>
            </div>
            <div class="form-wrapper">
                <a-form-item label='包装净重'>
                    <a-input
                        type='number'
                        v-decorator="['retroCodeInfo.netWeight', {
                        rules: [{required: true, message: '请输入包装净重'}]
                    }]">
                        <a-select slot="addonAfter" :value='curUnit' style="width: 90px" @change="selectUnit">
                            <a-select-option
                                v-for="item in unitDatas"
                                :key="item.value"
                                :value="item.code">
                                {{item.displayName}}
                            </a-select-option>
                        </a-select>
                    </a-input>
                </a-form-item>
            </div>
            <div class="form-wrapper">
                <a-form-item label='追溯码数量'>
                    <a-input-number
                        style="width:100%"
                        v-decorator="['codeQuantity',{
                        rules: [{required: true, message: '请输入追溯码数量'}]
                    }]">
                    </a-input-number>
                </a-form-item>
            </div>
            <div class="form-wrapper">
                <a-form-item label='作物规格'>
                    <a-input
                        v-decorator="['retroCodeInfo.specifications',{
                        rules: [{required: true, message: '请输入作物规格'}]
                    }]">
                    </a-input>
                </a-form-item>
            </div>
            <div class="form-wrapper">
                <a-form-item label='质检员'>
                    <a-input
                        v-decorator="['retroCodeInfo.qc',{
                        rules: [{required: true, message: '请输入质检员'}]
                    }]">
                    </a-input>
                </a-form-item>
            </div>
            <div class="form-wrapper">
                <a-form-item label='执行标准'>
                    <a-input
                        v-decorator="['retroCodeInfo.executeStandard']">
                    </a-input>
                </a-form-item>
            </div>
            <div class="form-wrapper" style="display:block; width:120%">
                <a-form-item label='注意事项'>
                    <a-textarea
                        :autosize='{minRows: 2, maxRows: 6}'
                        v-decorator="['retroCodeInfo.remarks']">
                    </a-textarea>
                </a-form-item>
            </div>
        </a-form>
    </a-modal>
</template>
<script>
import {getRetrocodingUnit, getBatchByType, getWeightAndRec, addRetrocoding} from '@/api/permissonApi'
export default {
    created () {
        getRetrocodingUnit().then(res => {
            if (res.success) {
                this.unitDatas = res.result
                this.curUnit = res.result[0].code
            }
        })
        getBatchByType().then(res => {
            if (res.success) {
                this.batchDatas = res.result
            }
        })
    },
    data() {
        return {
            curUnit: '',
            visible: false,
            form: this.$form.createForm(this),
            batchDatas: [],
            unitDatas: []
        }
    },
    methods: {
        filterBatch(val, node) {
            return node.componentOptions.children[0].children[0].text.indexOf(val) > -1 || node.componentOptions.children[1].children[0].text.indexOf(val) > -1
        },
        open() {
            this.visible = true
        },
        showCropDatas(val) {
            getWeightAndRec({
                batchId: val
            }).then((res) => {
                if (res.success) {
                    if (res.result.recoveryList) {
                        this.cropDatas = res.result.recoveryList
                    }
                    this.form.setFieldsValue({'residualOutput': res.result.yield})
                }
            })
        },
        selectUnit(val) {
            this.curUnit = val
        },
        handleOk() {
            this.form.validateFieldsAndScroll(err => {
                if (!err) {
                    let params = this.form.getFieldsValue()
                    params.retroCodeInfo.unit = this.curUnit
                    if (params.codeQuantity < 0) {
                        params.codeQuantity = Math.abs(params.codeQuantity)
                    }
                    if (params.retroCodeInfo.netWeight < 0) {
                        params.retroCodeInfo.netWeight = Math.abs(params.retroCodeInfo.netWeight)
                    }
                    addRetrocoding(params).then(res => {
                        this.$message.info(res.message)
                        if (res.success) {
                            this.visible = false
                            this.$parent._loadData()
                            this.curUnit = this.unitDatas[0].code
                            this.batchDatas = []
                            this.form.resetFields()
                        }
                    })
                }
            })
        },
        handleCancel() {
            this.curUnit = this.unitDatas[0].code
            this.batchDatas = []
            this.form.resetFields()
        }
    }
}
</script>
<style lang="stylus">
    .add-retrocoding
        width: 900px !important
        .form-wrapper
            width 45%
            display inline-block
            .ant-select-selection-selected-value
                .hide-name
                    display: none
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