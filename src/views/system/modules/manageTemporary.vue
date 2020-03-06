<template>
    <a-modal
        title="临时工单管理"
        v-model="visible"
        style="top:10%;height: 90%;"
        :maskClosable="false"
        class="manage-temporary">
            <!-- <div style="margin: 0 0 16px 0;">
                <a-button
                    type="primary"
                    icon="plus"
                    @click="addAll"
                    style="margin-right:30px"
                >
                    全部添加
                </a-button>
                <a-button
                    type="primary"
                    icon="delete"
                    @click="cancelAll"
                >
                    全部取消
                </a-button>
            </div> -->
            <div class="header-wrapper">
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
                            <a-form-item style="display:inline-block" label='种植计划'>
                                <a-select
                                    placeholder="请选择种植计划"
                                    style="width: 200px"
                                    v-decorator="['planId']">
                                    <a-select-option 
                                        v-for="item in planDatas"
                                        :key="item.id"
                                        :value='item.id'>
                                        {{item.planName}}
                                    </a-select-option>
                                </a-select>
                            </a-form-item>
                        </div>
                        <div class="search-wrapper">
                            <a-form-item style="display:inline-block">
                                <a-input
                                    placeholder="请输入批次名称"
                                    addonBefore='批次名称'
                                    v-decorator="['batchName']">
                                </a-input>
                            </a-form-item>
                        </div>
                        <div class="search-wrapper" style="width: 100%">
                            <a-form-item style="display:inline-block">
                                <span>工单状态：</span>
                                <a-radio-group
                                    v-decorator="['isEstablish']">
                                    <a-radio value="是">是</a-radio>
                                    <a-radio value="否">否</a-radio>
                                </a-radio-group>
                            </a-form-item>
                        </div>
                    </a-form>
                </div>
                <div style="height: 50px;overflow: hidden;width: 100%">
                    <a-button
                        type="primary"
                        @click="changeSelectOption('add')"
                        style="margin-right: 20px"
                    >
                        创建工单
                    </a-button>
                    <a-button
                        type="primary"
                        @click="changeSelectOption('remove')"
                    >
                        撤销工单
                    </a-button>
                </div>
            </div>
            <a-table
                :columns="manageColumns"
                :dataSource="manageDatas"
                :pagination="pagination"
                :loading="loading"
                :rowSelection="{onChange: onSelectChange, selectedRowKeys: this.selectDatas}"
                rowKey="id"
                bordered
                @change="changeTable"
                style="max-width: 100%">
                <span slot="orderStatus" slot-scope="text, record">
                    {{!record.orderStatus ? '未创建工单' : record.orderStatus.displayName}}
                </span>
                <span slot="action" slot-scope="text, record">
                    <a-popconfirm title="确定执行此操作吗?" @confirm="handleChange(record)">
                        <a>{{record.isEstablish === '否' ? '创建工单' : '撤销工单'}}</a>
                    </a-popconfirm>
                </span>
            </a-table>
            <div slot="footer">
                <a-button @click="() => {this.visible = false}">关闭</a-button>
            </div>
    </a-modal>
</template>

<script>
import {manageTemporaryWork, addTemporaryOrder, revokeTemporaryOrder, getPlantingAll} from '@/api/permissonApi'
export default {
    data() {
        return {
            visible: false,
            loading: false,
            manageColumns: [
                {
                    title: '批次名称',
                    dataIndex: 'batchName',
                    key: 'batchName'
                },
                {
                    title: '已创建临时工单',
                    dataIndex: 'isEstablish',
                    key: 'isEstablish'
                },
                {
                    title: '临时工单状态',
                    dataIndex: 'orderStatus',
                    key: 'orderStatus',
                    scopedSlots: { customRender: "orderStatus" }
                },
                {
                    title: '操作',
                    dataIndex: "action",
                    key: "action",
                    scopedSlots: { customRender: "action" },
                    align: "center"
                }
            ],
            manageDatas: [],
            planDatas: [],
            selectDatas: [],
            record: {},
            pageSize: null,
            pageNo: null,
            pagination: {
                pageSizeOptions: ["10", "20", "50"],
                showTotal: (total, range) => {
                    return range[0] + "-" + range[1] + " 共" + total + "条";
                },
                showQuickJumper: true,
                showSizeChanger: true,
            },
            form: this.$form.createForm(this)
        }
    },
    created() {
        getPlantingAll().then(res => {
            if (res.success) {
                this.planDatas = res.result
            }
        })
    },
    methods: {
        _loadData(params) {
            this.loading = true
            manageTemporaryWork(Object.assign({
                farming: this.record.id,
                batchName: params === undefined ? null : params.batchName
            }, params)).then(res => {
                if (res.success) {
                    this.manageDatas = res.result.list
                    this.$set(this.pagination, 'total', res.result.total)
                    this.$set(this.pagination, 'pageSize', res.result.pageSize)
                    this.$set(this.pagination, 'current', res.result.pageNum)
                }
                this.loading = false
            })
        },
        _changeOrder(type, record) {
            if (type === 'add') {
                addTemporaryOrder({
                    batchIds: record ? [record.id] : this.selectDatas,
                    farmingId: this.record.id
                }).then(res => {
                    this.$message.info(res.message)
                    if (res.success) {
                        this.selectDatas = []
                        let params = this.form.getFieldsValue()
                        params.pageSize = this.pageSize
                        params.pageNo = this.pageNo
                        this._loadData(params)
                    }
                }).catch(err => {
                    new Error(err)
                })
            } else if (type === 'remove') {
                revokeTemporaryOrder({
                    batchIds: record ? [record.id] : this.selectDatas,
                    farmingId: this.record.id
                }).then(res => {
                    this.$message.info(res.message)
                    if (res.success) {
                        this.selectDatas = []
                        let params = this.form.getFieldsValue()
                        params.pageSize = this.pageSize
                        params.pageNo = this.pageNo
                        this._loadData(params)
                    }
                })
            }
        },
        open(record) {
            this.form.resetFields()
            this.visible = true
            this.record = record
            this._loadData()
        },
        handleChange(record) {
            if (record && record.isEstablish === '否') {
                this._changeOrder('add', record)
            } else if (record) {
                this._changeOrder('remove', record)
            }
        },
        handleSearch() {
            const userinfo = this.form.getFieldsValue();
            userinfo.pageSize = this.pageSize
            userinfo.pageNo = this.pageNo
            this._loadData(userinfo)
        },
        handleReset() {
            this.form.resetFields()
            this._loadData()
        },
        onSelectChange (selectedRowKeys, selectedRows) {
            this.selectDatas = selectedRowKeys
        },
        changeSelectOption(type) {
            if (this.selectDatas.length == 0) {
                this.$message.warn('请先选择批次')
                return
            }
            this._changeOrder(type)
        },
        changeTable(page) {
            let params = this.form.getFieldsValue()
            params.pageSize = page.pageSize
            params.pageNo = page.current
            this.pageSize = page.pageSize
            this.pageNo = page.current
            this.loading = true
            this._loadData(params)
        }
    }
}
</script>

<style lang='stylus'>
    .manage-temporary
        width 900px !important
        .header-wrapper
            overflow hidden
        .form-wrapper
            float left
            width 70%
            margin-bottom 10px
            .ant-form-item-control-wrapper
                display: inline-block
            .search-wrapper
                margin-right 20px
                display inline-block
                height 50px
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
