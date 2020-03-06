<template>
    <a-modal
        title="选择采收批次"
        v-model="visible"
        @ok="handleOk"
        @cancel="handleCancel"
        style="top:10%;height: 90%"
        cancelText="取消"
        okText="确定"
        :maskClosable="false"
        class="add-rec-modal"
    >
        <div class="header-wrapper" style="margin-bottom: 15px">
            <div class="button">
                <i-button class="review-btn btn" @click="handleReset">
                    <Icon type="md-sync" class="icon"/>
                    重置
                </i-button>
                <i-button class="search-btn btn" style="margin-right:10px"  @click="handleSearch">
                    <Icon type="md-search" class="icon"/>
                    查询
                </i-button>
            </div>
            <div class="form-wrapper">
                <a-form :form='form' @submit="handleSearch">
                    <div class="search-wrapper">
                        <span style="line-height:40px;margin-right:5px">基地名称：</span>
                        <a-form-item style="display:inline-block;width: 230px">
                            <BaseSelect
                                v-if="visible"
                                style="width: 230px"
                                :hasAll='true'
                                v-decorator="['baseId']">
                            </BaseSelect>
                        </a-form-item>
                    </div>
                    <div class="search-wrapper">
                        <a-form-item style="display:inline-block">
                            <a-input
                                placeholder="请输入种植批次名称"
                                addonBefore='种植批次'
                                v-decorator="['batchName']">
                            </a-input>
                        </a-form-item>
                    </div>
                </a-form>
            </div>
        </div>
        <a-table
            style="max-height: 500px; overflow:auto"
            :columns="batchColumns"
            :dataSource="batchDatas"
            :pagination='false'
            :rowSelection='rowSelection'
        >
        </a-table>
    </a-modal>
</template>

<script>
import BaseSelect from '@/components/selectComponents/baseSelect'
import {getBatchByPlan} from '@/api/permissonApi'

let checkedDatas = []
export default {
    components: {
        BaseSelect
    },
    props: {
        batchDatas: {
            type: Array,
            default() {
                return []
            }
        }
    },
    data() {
        return {
            form: this.$form.createForm(this),
            curPlanId: null,
            visible: false,
            rowSelection: {
                columnTitle: '选择',
                onChange(selectedRowKeys, selectedRows) {
                    this.selectedRowKeys = selectedRowKeys
                    checkedDatas = selectedRows
                },
                selectedRowKeys: []
            },
            batchColumns: [
                {
                    title: '种植批次',
                    dataIndex: 'batchName',
                    key: 'batchName',
                    align: "center"
                },
                {
                    title: '采收批次',
                    dataIndex: 'recoveryCode',
                    key: 'recoveryCode',
                    align: "center"
                },
                {
                    title: '基地名称',
                    dataIndex: 'baseName',
                    key: 'baseName',
                    align: "center"
                },
                {
                    title: '数量',
                    dataIndex: 'yield',
                    key: 'yield',
                    align: "center"
                },
                {
                    title: '单位',
                    dataIndex: 'unit.displayName',
                    key: 'unit.displayName',
                    align: "center"
                }
            ]
        }
    },
    methods: {
        handleOk() {
            this.visible = false
            this.$emit('setData', checkedDatas)
        },
        handleCancel() {
            this.$emit('changeData', this.allBatchDatas)
        },
        handleReset() {
            this.form.resetFields()
            this.$emit('changeData')
        },
        handleSearch() {
            let params = this.form.getFieldsValue()
            if (params.baseId && params.baseId.value) {
                params.baseId = params.baseId.value
            }
            params.planId = this.curPlanId
            getBatchByPlan(params).then(res => {
                if (res.success) {
                    this.$emit('changeData', res.result)
                }
            })
        }
    }
}
</script>

<style lang='stylus'>
    .add-rec-modal
        width 900px !important
        .search-wrapper
            display inline-block
            width 320px
            vertical-align middle
        .btn
            float right
            background #2c909c
            border-color #2c909c
            color #fff
            line-height 18px
            margin-top 6px
            .icon
                font-size 18px
                vertical-align middle
</style>
