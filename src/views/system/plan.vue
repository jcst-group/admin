<template>
    <div style="background:white;padding:10px 0 10px 0;">
        <div style="margin:0 1% 0 0; overflow:hidden">
            <div>
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
                <div class="select">
                    <a-form
                        :form="form"
                        @submit="handleSearch" >
                        <div style="float:left;width:250px;height:50px;margin-bottom:10px;">
                            <a-form-item style="display:inline-block">
                                <a-input
                                    placeholder="请输入任意字符"
                                    addonBefore='计划名'
                                    v-decorator="['planName']">
                                </a-input>
                            </a-form-item>
                        </div>
                        <div style="float:left;width:250px;height:50px;margin-bottom:10px;">
                            <span style="line-height:40px;margin-right:5px">品种：</span>
                            <a-form-item style="display:inline-block">
                                <a-select
                                v-decorator="['cropId']"
                                style="width: 160px">
                                    <a-select-option 
                                        v-for="item in cropDatas"
                                        :key="item.id"
                                        :value='item.id'>
                                        {{item.cropName}}
                                    </a-select-option>
                                </a-select>
                            </a-form-item>
                        </div>
                    </a-form>
                </div>
            </div>
        </div>
        <div style="margin: 0 0 16px 0;">
            <a-button
                type="primary"
                icon="plus"
                @click="add"
            >
                添加计划
            </a-button>
        </div>
        <div>
            <a-table
            :columns="planColumns"
            :dataSource="dataSource"
            :pagination="pagination"
            :loading="loading"
            rowKey="id"
            bordered
            @change="changeTable"
            >
                <span slot="action" slot-scope="text, record">
                    <!-- <a @click="updateName(record)">编辑名称</a>
                    <a-divider type="vertical"/>
                    <a @click="handleEdit(record)">计划管理</a>
                    <a-divider type="vertical"/>
                    <a-popconfirm title="确定删除吗?" @confirm="handleDelete(record.id)">
                        <a>删除</a>
                    </a-popconfirm> -->
                    <a @click="updateName(record)">编辑名称</a>
                    <a-divider type="vertical" />
                    <a-dropdown>
                        <a class="ant-dropdown-link">
                            更多 <a-icon type="down" />
                        </a>
                        <a-menu slot="overlay">
                            <a-menu-item >
                                <a @click="handleEdit(record)">计划管理</a>
                            </a-menu-item>
                            <a-menu-item>
                                <a-popconfirm title="确定删除吗?" @confirm="handleDelete(record.id)">
                                    <a>删除计划</a>
                                </a-popconfirm>
                            </a-menu-item>
                            <a-menu-item >
                                <a @click="repeatPlan(record)">复制计划</a>
                            </a-menu-item>
                        </a-menu>
                    </a-dropdown>
                </span>
            </a-table>
        </div>
        <addPlan ref="addPlan" :cropDatas='cropDatas.slice(1, cropDatas.length)'></addPlan>
        <updatePlan ref="updatePlan"></updatePlan>
        <updatePlanName ref="updatePlanName"></updatePlanName>
    </div>
</template>
<script>
import {
    getAllCrop,
    getAllPlan,
    updatePlatingPlan,
    deletePlatingPlan
} from '@/api/permissonApi'
import addPlan from './modules/addPlan.vue'
import updatePlan from './modules/updatePlan.vue'
import updatePlanName from './modules/updatePlanName'
export default {
    name: 'plan',
    components: {
        addPlan,
        updatePlan,
        updatePlanName
    },
    data () {
        return {
            cropDatas: [{
                id: 0,
                cropName: '全部'
            }],
            form: this.$form.createForm(this),
            dataSource: [],
            loading: false,
            pageNo: null,
            pageSize: null,
            planColumns: [
                {
                    title: '计划名称',
                    dataIndex: 'planName',
                    key: 'planName'
                },
                {
                    title: '品种',
                    dataIndex: 'crop.cropName',
                    key: 'crop.cropName'
                },
                {
                    title: '产地',
                    dataIndex: 'provenance',
                    key: 'provenance'
                },
                {
                    title: '创建时间',
                    dataIndex: 'createTime',
                    key: 'createTime'
                },
                {
                    title: '操作',
                    dataIndex: "action",
                    key: "action",
                    scopedSlots: { customRender: "action" },
                    align: "center"
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
        }
    },
    created() {
        getAllCrop().then(res => {
            if (res.success) {
                this.cropDatas = this.cropDatas.concat(res.result)
            }
        })
        this._loadData()
    },
    methods: {
        _loadData() {
            let params = this.form.getFieldsValue();
            params.pageNo = this.pageNo
            params.pageSize = this.pageSize
            this.loading = true
            if (params.cropId === 0) {
                delete params.cropId
            }
            getAllPlan(params).then(res => {
                if (res.success) {
                    this.dataSource = res.result.list
                    this.$set(this.pagination, 'total', res.result.total)
                    this.$set(this.pagination, 'pageSize', res.result.pageSize)
                    this.$set(this.pagination, 'current', res.result.pageNum)
                }
                this.loading = false
            })
        },
        handleReset() {
            this.form.resetFields()
            this._loadData()
        },
        handleSearch() {
            this._loadData()
        },
        add() {
            this.$refs.addPlan.visible = true
            this.$refs.addPlan.form.resetFields()
        },
        changeTable(page) {
            this.pageNo = page.current
            this.pageSize = page.pageSize
            this._loadData()
        },
        handleEdit(record) {
            this.$refs.updatePlan.visible = true
            var list = record ? record : {}
            this.$refs.updatePlan.open(list)
        },
        handleDelete(id) {
            deletePlatingPlan({
                id:id
            }).then(res => {
                this.$message.info(res.message)
                if (res.success) {
                    this._loadData()
                }
            })
        },
        updateName(record) {
            this.$refs.updatePlanName.title = '修改种植计划名称'
            this.$refs.updatePlanName.open(record)
            this.$refs.updatePlanName.visible = true
        },
        repeatPlan(record) {
            this.$refs.updatePlanName.title = '复制计划'
            this.$refs.updatePlanName.open(record)
            this.$refs.updatePlanName.visible = true
        }
    }
}
</script>
<style lang="stylus" scoped>
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
