<template>
    <div class="temporary-farm">
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
                    <a-form-item style="display:inline-block">
                        <a-input
                            placeholder="请输入任意字符"
                            addonBefore='农事名称'
                            v-decorator="['farmingName']">
                        </a-input>
                    </a-form-item>
                </a-form>
            </div>
        </div>
        <div style="margin: 0 0 16px 0;">
            <a-button
                type="primary"
                icon="plus"
                @click="addFarm"
            >
                添加临时农事
            </a-button>
        </div>
        <div style="width: 100%">
            <a-table
                :columns="farmColumns"
                :dataSource="farmDatas"
                :pagination="pagination"
                :loading="loading"
                rowKey="id"
                bordered
                @change="changeTable"
                style="max-width: 100%">
                <span slot="roleList" slot-scope="text,record">
                    <a-tag color='blue' v-for="item in record.roleList" :key="item.id" style="margin-right:4px">
                        {{item.name}}
                    </a-tag>
                </span>
                <span slot="edit" slot-scope="text,record" @click="editMessage(record)">
                    <a-tag color='blue'>物料：{{record.totalMaterial}}</a-tag>
                    <a-tag color='blue'>设备：{{record.totalDevice}}</a-tag>
                    <a-tag color='blue'>人员：{{record.totalPersonnel}}</a-tag>
                    <!-- <a-icon style="cursor:pointer;color:#2d8cf0" type="file"/> -->
                </span>
                <span slot="action" slot-scope="text, record">
                    <a @click="handleEdit(record)">编辑</a>
                    <a-divider type="vertical"/>
                    <a-dropdown>
                        <a class="ant-dropdown-link">
                        更多 <a-icon type="down" />
                        </a>
                        <a-menu slot="overlay">
                            <a-menu-item >
                                <a @click="manageTemporary(record)">临时工单管理</a>
                            </a-menu-item>
                            <a-menu-item >
                                <a-popconfirm title="确定删除吗?" @confirm="handleDelete(record.id)">
                                    <a>删除</a>
                                </a-popconfirm>
                            </a-menu-item>
                        </a-menu>
                    </a-dropdown>
                </span>
            </a-table>
        </div>
        <changeTemporary ref="changeTemporary"></changeTemporary>
        <addAllResource ref="addAllResource" parentName='temporary'></addAllResource>
        <manageTemporary ref='manageTemporary'></manageTemporary>
    </div>
</template>

<script>
import {getAllTemporary, deleteFarming} from '@/api/permissonApi'
import changeTemporary from './modules/changeTemporary.vue'
import addAllResource from './modules/addAllResource'
import manageTemporary from './modules/manageTemporary'
export default {
    name: 'temporaryFarm',
    components: {
        changeTemporary,
        addAllResource,
        manageTemporary
    },
    data() {
        return {
            form: this.$form.createForm(this),
            pageNo: null,
            pageSize: null,
            farmColumns: [
                {
                    title: '农事名称',
                    dataIndex: 'farmingName',
                    key: 'farmingName'
                },
                {
                    title: '农事周期',
                    dataIndex: 'farmingCycle',
                    key: 'farmingCycle'
                },
                {
                    title: '品种',
                    dataIndex: 'crop.cropName',
                    key: 'crop.cropName'
                },
                {
                    title: '农事项目',
                    dataIndex: 'farmingItem.farmingName',
                    key: 'farmingItem.farmingName'
                },
                {
                    title: '是否需要定位',
                    dataIndex: 'isLocation.displayName',
                    key: 'isLocation.displayName'
                },
                {
                    title: '角色',
                    dataIndex: 'roleList',
                    key: 'roleList',
                    scopedSlots: { customRender: "roleList" },
                },
                {
                    title: '人资物料详情',
                    dataIndex: 'edit',
                    key: 'edit',
                    scopedSlots: { customRender: "edit" },
                    align: "center"
                },
                {
                    title: '开始时间',
                    dataIndex: 'startTime',
                    key: 'startTime'
                },
                {
                    title: '备注',
                    dataIndex: 'remark',
                    key: 'remark',
                    class: 'table-method',
                    width: '20%'
                },
                {
                    title: '操作',
                    dataIndex: "action",
                    key: "action",
                    scopedSlots: { customRender: "action" },
                    align: "center"
                }
            ],
            farmDatas: [],
            loading: false,
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
        this._loadData()
    },
    methods: {
        _loadData() {
            let params = this.form.getFieldsValue();
            params.pageNo = this.pageNo
            params.pageSize = this.pageSize
            this.loading = true
            getAllTemporary(params).then(res => {
                if (res.success) {
                    this.farmDatas = res.result.list
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
        addFarm() {
            this.$refs.changeTemporary.open()
            this.$refs.changeTemporary.title = '添加临时农事'
        },
        editMessage(record) {
            this.$refs.addAllResource.open(record)
        },
        handleEdit(record) {
            this.$refs.changeTemporary.open(record)
            this.$refs.changeTemporary.title = '修改临时农事'
        },
        handleDelete(id) {
            deleteFarming({
                id:id
            }).then(res => {
                this.$message.info(res.message)
                if (res.success) {
                    this._loadData()
                }
            })
        },
        manageTemporary(record) {
            this.$refs.manageTemporary.open(record)
        },
        changeTable(page) {
            this.pageNo = page.current
            this.pageSize = page.pageSize
            this._loadData()
        }
    }
}
</script>

<style lang='stylus' scoped>
    .temporary-farm
        .header-wrapper
            overflow hidden
        .form-wrapper
            float left
            width 27%
            margin-bottom 10px
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
        .table-method
            white-space pre-line
</style>
