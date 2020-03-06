<template>
    <a-modal
        title="作物规模管理"
        v-model="visible"
        @ok="handleOk"
        @cancel='handleCancel'
        style="top:5%;height: 90%;"
        :maskClosable="false"
        class="edit-crop-modal">
        <div style="margin: 0 0 16px 0;">
            <a-button
                type="primary"
                icon="plus"
                @click="addCrop"
            >
                添加作物
            </a-button>
        </div>
        <div class="table-wrapper">
            <a-table
                class='batch-modal-table'
                :columns="cropColumns"
                :dataSource="dataSource"
                :pagination="false"
                :loading="loading"
                :rowKey="record => record.id"
                bordered>
                <template slot="scale" slot-scope="text, record">
                    <a-input-number @change="val => changeScale(val, record)" style="width: 100%" :value='text'/>
                </template>
                <span slot="action" slot-scope="text, record">
                    <a-popconfirm title="确定删除该作物？" @confirm="deleteCrop(record)">
                        <a>删除</a>
                    </a-popconfirm>
                </span>
            </a-table>
        </div>
        <div class="add-crop">
            <a-modal
                title="添加作物"
                v-model="cropVisible"
                @ok="handleCropOk"
                @cancel='handleCropCancel'
                style="top:5%;height: 90%;"
                :maskClosable="false"
                class="add-crop-modal">
                <a-form :form="form">
                    <div class="form-wrapper">
                        <a-form-item label='作物'>
                            <a-select
                                @change="getUnitByCrop"
                                v-decorator="[
                                    'cropId',
                                    {
                                        rules: [{
                                            required: true, message: '请选择作物!'
                                        }]
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
                        <a-form-item label='单位'>
                            <a-input
                                disabled
                                placeholder="选择作物后自动带入"
                                v-decorator="[
                                    'calId',
                                    {
                                        rules: [{
                                            required: true, message: '请选择作物!'
                                        }]
                                    }
                                ]"/>
                        </a-form-item>
                    </div>
                    <div class="form-wrapper">
                        <a-form-item label='规模'>
                            <a-input-number
                                v-decorator="[
                                    'scale',
                                    {
                                        rules: [{
                                            required: true, message: '请添加规模!'
                                        }]
                                    }
                                ]"
                                style="width: 100%"/>
                        </a-form-item>
                    </div>
                </a-form>
            </a-modal>
        </div>
    </a-modal>
</template>
<script>
import {getScaleByPlot, getUnitByCrop,addCropScale,updateCropScale,deleteCropScale} from '@/api/ddwbApi'
import {getAllCrop} from '@/api/permissonApi'

export default {
    data() {
        return {
            form: this.$form.createForm(this),
            record: {},
            calId: '',
            visible: false,
            cropVisible: false,
            loading: false,
            cropDatas: [],
            dataSource: [],
            cropColumns: [
                {
                    title: '品种',
                    dataIndex: 'cropName',
                    key: 'cropName'
                },
                {
                    title: '规模',
                    dataIndex: 'scale',
                    key: 'scale',
                    scopedSlots: { customRender: "scale" }
                },
                {
                    title: '单位',
                    dataIndex: 'unit',
                    key: 'unit'
                },
                {
                    title: '操作',
                    dataIndex: 'action',
                    key: 'action',
                    scopedSlots: { customRender: "action" }
                }
            ]
        }
    },
    methods: {
        _loadData(record) {
            getScaleByPlot({
                lotId: record.id
            }).then(res => {
                if (res.success) {
                    this.dataSource = res.result
                }
            })
        },
        open(record) {
            this.record = record
            this.visible = true
            this._loadData(record)
        },
        changeScale(val, record) {
            record.scale = val
        },
        addCrop() {
            this.cropVisible = true
            getAllCrop().then(res => {
                if (res.success) {
                    this.cropDatas = res.result
                }
            })
        },
        getUnitByCrop(val) {
            getUnitByCrop({
                cropId: val
            }).then(res => {
                if (res.success) {
                    this.calId = res.result.id
                    this.form.setFieldsValue({calId: res.result.unit})
                }
            })
        },
        handleCropOk() {
            this.form.validateFieldsAndScroll((err, values) => {
                if (!err) {
                    const params = this.form.getFieldsValue()
                    params.calId = this.calId
                    params.lotId = this.record.id
                    addCropScale(params).then(res => {
                        this.$message.info(res.message)
                        if (res.success) {
                            this.calId = ''
                            this.form.resetFields()
                            this._loadData(this.record)
                            this.cropVisible = false
                        }
                    })
                }
            })
        },
        handleCropCancel() {
            this.calId = ''
            this.form.resetFields()
        },
        handleCancel() {
            this.record = {}
        },
        handleOk() {
            updateCropScale({
                jsonStr: JSON.stringify(this.dataSource)
            }).then(res => {
                this.$message.info(res.message)
            })
        },
        deleteCrop(record) {
            deleteCropScale({
                lotId: this.record.id,
                lotCalId: record.id
            }).then(res => {
                this.$message.info(res.message)
                if (res.success) {
                    this._loadData(this.record)
                }
            })
        }
    },
}
</script>
<style lang="stylus">
    .edit-crop-modal
        width: 700px !important
    .add-crop-modal
        .form-wrapper
            width 100%
            .ant-form-item-control-wrapper
                width 60%
                display inline-block
            .ant-form-item-label
                width 130px
                vertical-align top
</style>