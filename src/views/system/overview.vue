<template>
    <div class="overview">  
        <div class="header-wrapper">
            <div class="button">
                <i-button class="review-btn btn" @click="exportMessages">
                    <Icon type="md-download" class="icon"/>
                    导出
                </i-button>
                <i-button class="review-btn btn" style="margin-right:10px" @click="handleReset">
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
                        <span style="line-height:40px;margin-right:5px">种植计划：</span>
                        <a-form-item style="display:inline-block">
                            <a-select
                                @change="batchBySelect"
                                v-decorator="['planId']"
                                style="width: 230px">
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
                        <span style="line-height:40px;margin-right:5px">基地名称：</span>
                        <a-form-item style="display:inline-block">
                            <!-- <a-select
                                v-decorator="['baseId']"
                                @change="batchBySelect"
                                style="width: 230px">
                                <a-select-option 
                                    v-for="item in baseDatas"
                                    :key="item.id"
                                    :value='item.id'>
                                    {{item.baseName}}
                                </a-select-option>
                            </a-select> -->
                            <BaseSelect
                                :hasAll='true'
                                style="width: 230px"
                                @handleChange='batchBySelect'
                                ref="baseSelect"
                                v-decorator="['baseId']">
                            </BaseSelect>
                        </a-form-item>
                    </div>
                    <div class="search-wrapper">
                        <span style="line-height:40px;margin-right:5px">种植批次：</span>
                        <a-form-item style="display:inline-block">
                            <a-select
                                :showSearch='true'
                                v-decorator="['batchId']"
                                placeholder="请先选择基地或种植计划"
                                style="width: 230px">
                                <a-select-option 
                                    v-for="item in batchDatas"
                                    :key="item.id"
                                    :value='item.batchName'>
                                    {{item.batchName}}
                                </a-select-option>
                            </a-select>
                        </a-form-item>
                    </div>
                    <div class="search-wrapper">
                        <span style="line-height:40px;margin-right:5px">工单类型：</span>
                        <a-form-item style="display:inline-block">
                            <a-select
                                v-decorator="['type']"
                                style="width: 230px">
                                <a-select-option 
                                    v-for="item in typeDatas"
                                    :key="item.value"
                                    :value='item.code'>
                                    {{item.displayName}}
                                </a-select-option>
                            </a-select>
                        </a-form-item>
                    </div>
                    <div class="search-wrapper">
                        <span style="line-height:40px;margin-right:5px">执行日期：</span>
                        <a-form-item style="display:inline-block">
                            <a-range-picker 
                                @change='dataPick'
                                v-decorator="[
                                    'monitorTime'
                                ]"
                            />
                        </a-form-item>
                    </div>
                    <div class="search-wrapper" style="display:block">
                        <span style="line-height:40px;margin-right:5px">审核状态：</span>
                        <a-form-item style="display:inline-block">
                            <a-radio-group
                                @change="() => {this.$nextTick(_loadData)}"
                                v-decorator="['status', {
                                    initialValue: 'ALL'
                                }]">
                                <a-radio
                                    v-for="item in statusDatas"
                                    :key="item.value"
                                    :value="item.code">
                                    {{item.displayName}}
                                </a-radio>
                            </a-radio-group>
                        </a-form-item>
                    </div>
                </a-form>
            </div>
        </div>
        <div style="width: 100%">
            <a-table
            :columns="overviewColumns"
            :dataSource="workDatas"
            :pagination="pagination"
            :loading="loading"
            :rowKey="(record) => record.id"
            bordered
            @change="changeTable"
            style="max-width: 100%"
            >
                <span slot="role" slot-scope="text, record">
                    <div v-for="item in record.roleList" :key="item.id" style="display:inline-block; margin-right : 5px; margin-top: 5px">
                        <a-tag color='blue'>{{item.name}}</a-tag>
                    </div>
                </span>
                <div slot="orderExecutor" slot-scope="text, record" class="show-text">
                    <div v-for="(item,index) in record.orderExecutor" :key="item.uid" v-show="index < 4 || record.showText === '收起'">
                        {{item.realName}}
                    </div>
                    <a class="show-more" v-show="record.orderExecutor.length > 5" @click="showMore(record)">{{record.showText}}</a>
                </div>
                <span slot="user" slot-scope="text, record">
                    <span style="margin-right : 5px">
                        {{record.user ? record.user.userName : ''}}
                    </span>
                </span>
                <span slot="allowedExecute" slot-scope="text, record">
                    <a-switch @change="val => changeWork(val, record)" :defaultChecked='record.allowedExecute'></a-switch>
                </span>
                <span slot="action" slot-scope="text, record" style="white-space:nowrap">
                    <a @click="handleEdit(record)">审核</a>
                    <a-divider type="vertical"/>
                    <a @click="openRoleModal(record)">更改角色</a>
                </span>
            </a-table>
        </div>
        <examine ref="examine"></examine>
        <a-modal
            title="更改角色"
            :visible='roleModal'
            @ok='handleRoleOk'
            :maskClosable='false'
            @cancel='handleRoleCancel'>
            <a-select
                v-if="roleModal"
                :defaultValue='roleDefaultValue'
                @change="changeRole"
                :filterOption='filterRole'
                :destroyOnClose='true'
                mode='multiple'
                style="width: 100%">
                <a-select-option 
                    v-for="item in roleData"
                    :key="item.id"
                    :value='item.id'>
                    {{item.name}}
                </a-select-option>
            </a-select>
        </a-modal>
    </div>
</template>

<script>
import {queryAllBase, getallpermission} from '@/api/allapi'
import {getBatchByBase, getAllBatch, getAllWorkType, getAllWorklist, getAllWorkStatus, exportWorkList, updateOrderRole, getPlantingAll, updateAllowedExecute} from '@/api/permissonApi'
import examine from './modules/examine.vue'
import BaseSelect from '@/components/selectComponents/baseSelect'

export default {
    name: 'overview',
    components: {
        examine,
        BaseSelect
    },
    data() {
        return {
            loading:false,
            roleModal: false,
            pageSize: null,
            pageNo: null,
            curBatchId: null,
            record: {},
            roleData: [],
            roleDefaultValue: [],
            batchDatas: [],
            planDatas: [{
                id: -1,
                planName: '全部'
            }],
            baseDatas: [{
                id: -1,
                baseName: '全部'
            }],
            typeDatas: [{
                value: -1,
                code: 'ALL',
                displayName: '全部'
            }],
            workDatas: [],
            statusDatas: [{
                value: -1,
                code: 'ALL',
                displayName: '全部'
            }],
            overviewColumns: [
                {
                    title: '预计开始日期',
                    dataIndex: 'executionTime',
                    key: 'executionTime',
                    width: 110,
                },
                {
                    title: '预计结束日期',
                    dataIndex: 'endTime',
                    key: 'endTime',
                    width: 110,
                },
                {
                    title: '种植批次',
                    dataIndex: 'cropBatch.batchName',
                    key: 'cropBatch.batchName',
                    width: 250,
                },
                {
                    title: '农事名称',
                    dataIndex: 'farmingItem.farmingName',
                    key: 'farmingItem.farmingName',
                    width: 110,
                },
                {
                    title: '对应角色',
                    dataIndex: 'role',
                    key: 'role',
                    scopedSlots: { customRender: "role" },
                    width: 200
                },
                {
                    title: '可执行人员',
                    dataIndex: 'orderExecutor',
                    key: 'orderExecutor',
                    scopedSlots: { customRender: "orderExecutor" },
                    width: 120
                },
                {
                    title: '执行人员',
                    dataIndex: 'user.realName',
                    key: 'user.realName',
                    width: 80
                },
                {
                    title: '执行时间',
                    dataIndex: 'subTime',
                    key: 'subTime',
                    width: 110
                },
                {
                    title: '工单类型',
                    dataIndex: 'type.displayName',
                    key: 'type.displayName',
                    width: 110
                },
                {
                    title: '审核状态',
                    dataIndex: 'status.displayName',
                    key: 'status.displayName',
                    width: 120,
                    
                },
                {
                    title: '允许时间外执行',
                    dataIndex: "allowedExecute",
                    key: "allowedExecute",
                    scopedSlots: { customRender: "allowedExecute" },
                    align: "center",
                    width: 120,
                    
                },
                {
                    title: '操作',
                    dataIndex: "action",
                    key: "action",
                    scopedSlots: { customRender: "action" },
                    align: "center",
                    width: 182,
                    
                }
            ],
            pagination: {
                pageSizeOptions: ["10", "20", "50"],
                showTotal: (total, range) => {
                    return range[0] + "-" + range[1] + " 共" + total + "条";
                },
                showQuickJumper: true,
                showSizeChanger: true,
            },
            form: this.$form.createForm(this),
        }
    },
    created() {
        this._initDatas()
        this._loadData()
    },
    methods: {
        showMore(record) {
            if (record.showText === '收起') {
                record.showText = '展开'
            } else {
                record.showText = '收起'
            }
        },
        _initDatas() {
            getAllWorkType().then(res => {
                if (res.success) {
                    this.typeDatas = this.typeDatas.concat(res.result)
                }
            })
            getAllWorkStatus().then(res => {
                if (res.success) {
                    this.statusDatas = this.statusDatas.concat(res.result)
                }
            })
            getallpermission().then(res => {
                if (res.success) {
                    this.roleData = res.result
                }
            })
            getPlantingAll().then(res => {
                if (res.success) {
                    this.planDatas = this.planDatas.concat(res.result)
                }
            })
        },
        _loadData() {
            let params = this.form.getFieldsValue()
            params.startTime = this.startTime
            params.endTime = this.endTime
            params.pageNo = this.pageNo
            params.pageSize = this.pageSize
            if (params.planId == -1) {
                delete params.planId
            }
            if (params.batchId == -1) {
                delete params.batchId
            }
            if (params.baseId == -1) {
                delete params.baseId
            }
            if (params.status == 'ALL') {
                delete params.status
            }
            if (params.type == 'ALL') {
                delete params.type
            }
            if (params.monitorTime) {
                delete params.monitorTime
            }
            if (params.batchId ) {
                var arr = this.batchDatas.filter(ele => params.batchId === ele.batchName)
                params.batchId = arr.length > 0 ? arr[0].id : null
            }
            this.loading = true
            getAllWorklist(params).then(res => {
                if (res.success) {
                    this.workDatas = res.result.list.map(item => {
                        item.showText = '展开'
                        item.showAll = item.orderExecutor.length < 4
                        return item
                    })
                    this.$set(this.pagination, 'total', res.result.total)
                    this.$set(this.pagination, 'pageSize', res.result.pageSize)
                    this.$set(this.pagination, 'current', res.result.pageNum)
                }
                this.loading = false
            })
        },
        changeWork(val, record) {
            updateAllowedExecute({
                id: record.id,
                allowedExecute: val
            }).then(res => {
                this.$message.info(res.message)
            })
        },
        handleEdit(record) {
            if (record.status.displayName === '待审核') {
                this.$refs.examine.title = '审核',
                this.$refs.examine.cancelText = '审核不通过',
                this.$refs.examine.okText = '审核通过'
                this.$refs.examine.lock = false
            } else if (record.status.displayName === '审核已通过') {
                this.$refs.examine.title = '查看详情'
                this.$refs.examine.cancelText = '关闭',
                this.$refs.examine.okText = '退回审核'
                this.$refs.examine.lock = false
            } else {
                this.$refs.examine.title = '查看'
                this.$refs.examine.lock = true
            }
            this.$refs.examine.visible = true
            this.$refs.examine.open(record)
        },
        handleReset() {
            this.startTime = null
            this.endTime = null
            this.batchDatas = []
            this.form.resetFields()
            this.$refs.baseSelect.selectValue = null
            this._loadData()
        },
        handleSearch() {
            this._loadData()
        },
        dataPick(date, dateString) {
            if (date.length > 1) {
                this.startTime = dateString[0]
                this.endTime = dateString[1]
            } else {
                this.startTime = null
                this.endTime = null
            }
        },
        changeTable(page) {
            this.pageSize = page.pageSize
            this.pageNo = page.current
            this._loadData()
        },
        batchBySelect() {
            this.form.resetFields(['batchId'])
            this.batchDatas = []
            this.$nextTick(() => {
                let params = this.form.getFieldsValue(['planId', 'baseId'])
                if (params.planId == -1) {
                    delete params.planId
                }
                if (params.baseId == -1) {
                    delete params.baseId
                }
                getAllBatch(params).then(res => {
                    if (res.success) {
                        if (res.result.length > 0) {
                            this.batchDatas.push({
                                id: -1,
                                batchName: '全部'
                            })
                        }
                        this.batchDatas = this.batchDatas.concat(res.result)
                    }
                })
            })
        },
        openRoleModal(record) {
            let arr = []
            this.record = record
            record.roleList.forEach(item => {
                this.roleDefaultValue.push(item.id)
            })
            this.roleModal = true
        },
        filterRole(inputValue, option) {
            return option.componentOptions.children[0].text.indexOf(inputValue) > -1 ? true : false
        },
        changeRole(value) {
            this.roleDefaultValue = value
        },
        handleRoleOk() {
            if (this.roleDefaultValue.length > 0) {
                updateOrderRole({
                    roleIds: this.roleDefaultValue,
                    orderId: this.record.id
                }).then(res => {
                    if (res.success) {
                        this.roleDefaultValue = []
                        this.roleModal = false
                        this._loadData()
                    }
                    this.$message.info(res.message)
                })
            } else {
                this.$message.info('必须选择一个角色')
            }
        },
        handleRoleCancel() {
            this.roleModal = false
            this.roleDefaultValue = []
        },
        exportMessages() {
            let params = this.form.getFieldsValue()
            let first = 0
            params.startTime = this.startTime
            params.endTime = this.endTime
            if (params.planId == -1) {
                delete params.planId
            }
            if (params.batchId == -1) {
                delete params.batchId
            }
            if (params.baseId == -1) {
                delete params.baseId
            }
            if (params.status == 'ALL') {
                delete params.status
            }
            if (params.type == 'ALL') {
                delete params.type
            }
            if (params.monitorTime) {
                delete params.monitorTime
            }
            if (params.batchId ) {
                var arr = this.batchDatas.filter(ele => params.batchId === ele.batchName)
                params.batchId = arr.length > 0 ? arr[0].id : null
            }
            let api = '/api/workOrder/export'
            for (var prop in params) {
                if (params[prop]) {
                    if (first == 0) {
                        api += '?' + prop + '=' + params[prop]
                        first++
                    } else {
                        api += '&' + prop + '=' + params[prop]
                    }
                }
            }
            exportWorkList(params).then(res => {
                let a = document.createElement('a')
                a.href = api
                var evt = document.createEvent("MouseEvents");  
                evt.initEvent("click",true,true);  
                a.dispatchEvent(evt); 
            })
        }
    }
}
</script>

<style lang='stylus' scoped>
    .overview
        .header-wrapper
            overflow hidden
        .form-wrapper
            float left
            width 70%
            margin-bottom 10px
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
        .show-text
            position relative
            .show-more
                position absolute
                width 30px
                right 10px
                bottom 0
</style>
<style lang="stylus">
.overview .ant-table-thead > tr > th, .ant-table-tbody > tr > td {
  padding: 16px 8px
}
</style>
