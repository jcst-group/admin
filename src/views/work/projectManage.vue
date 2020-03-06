<template>
    <div style="background:white;padding:10px 0 10px 0;">
        <div style="margin: 0 0 16px 0;">
            <a-button
                type="primary"
                icon="plus"
                @click="add"
            >
                添加项目
            </a-button>
        </div>
        <div>
            <a-table
                :columns="workColumns"
                :dataSource="dataSource"
                :pagination="false"
                :loading="loading"
                rowKey="id"
                bordered
                @change="changeTable"
            >
                <span v-if="record.children" slot="action" slot-scope="text, record">
                    <a @click="addTheme(record)">添加主题</a>
                    <a-divider type="vertical" />
                    <a-popconfirm title="确定删除吗?" @confirm="handleDelete(record.id)">
                        <a>删除项目</a>
                    </a-popconfirm>
                </span>
                <span v-else slot="action" slot-scope="text, record">
                    <a @click="addTheme(record)">编辑阶段</a>
                    <a-divider type="vertical" />
                    <a-popconfirm title="确定删除吗?" @confirm="handleDelete(record.id)">
                        <a>删除阶段</a>
                    </a-popconfirm>
                </span>
            </a-table>
        </div>
        <projectModal ref="projectModal"></projectModal>
    </div>
</template>
<script>
import projectModal from './projectModal'
import {getProjectManage,deleteProjectManage} from '@/api/allapi'
export default {
    name: 'projectManage',
    components: {
        projectModal
    },
    data() {
        return {
            dataSource: [],
            loading: false,
            pageNo: null,
            pageSize: null,
            workColumns: [
                {
                    title: '项目名称',
                    dataIndex: 'name',
                    key: 'name'
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
        this._loadData()
    },
    methods: {
        _filterData(data) {
            data = data.filter(item => {
                if (item.children.length > 0) {
                    item.children.filter(ele => {
                        return delete ele.children
                    })
                }
                return item
            })
            return data
        },
        _loadData() {
            this.loading = true
            getProjectManage().then(res => {
                if (res.success) {
                    this.dataSource = this._filterData(res.result)
                    // this.$set(this.pagination, 'total', res.result.total)
                    // this.$set(this.pagination, 'pageSize', res.result.pageSize)
                    // this.$set(this.pagination, 'current', res.result.pageNum)
                }
                this.loading = false
            })
        },
        add() {
            this.$refs.projectModal.title = '添加项目'
            this.$refs.projectModal.open()
        },
        handleDelete(id) {
            deleteProjectManage({
                id: id
            }).then(res => {
                this.$message.info(res.message)
                if (res.success) {
                    this._loadData()
                }
            })
        },
        addTheme(record) {
            if (record.children) {
                this.$refs.projectModal.title = '添加阶段'
            } else {
                this.$refs.projectModal.title = '编辑阶段'
            }
            this.$refs.projectModal.open(record)
        },
        changeTable(page) {
            this.pageNo = page.current
            this.pageSize = page.pageSize
            this._loadData()
        },
    }
}
</script>