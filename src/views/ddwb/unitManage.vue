<template>
    <div class="unit-manage" style="background:white;padding:10px 0 10px 0;">
        <div style="margin: 0 0 16px 0;">
            <a-button
                type="primary"
                icon="plus"
                @click="add"
            >
                添加计量单位
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
                    <a-popconfirm title="确定删除吗?" @confirm="handleDelete(record.id)">
                        <a>删除</a>
                    </a-popconfirm>
                </span>
            </a-table>
            <changeUnit ref="changeUnit"></changeUnit>
        </div>
    </div>
</template>
<script>
import {getUnitList, deleteUnitList} from '@/api/ddwbApi'
import changeUnit from '@/views/ddwbmodule/changeUnitModule'

export default {
    name: 'unitManage',
    components: {
        changeUnit
    },
    data() {
        return {
            dataSource: [],
            pageNo: null,
            pageSize: null,
            loading: false,
            planColumns: [
                {
                    title: '作物计量单位',
                    dataIndex: 'unit',
                    key: 'unit'
                },
                {
                    title: '人资计量单位',
                    dataIndex: 'personnelUnit',
                    key: 'personnelUnit'
                },
                {
                    title: '物料计量单位',
                    dataIndex: 'materialUnit',
                    key: 'materialUnit'
                },
                {
                    title: '设备计量单位',
                    dataIndex: 'deviceUnit',
                    key: 'deviceUnit'
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
        _loadData() {
            let params = {}
            params.pageNo = this.pageNo
            params.pageSize = this.pageSize
            this.loading = true
            getUnitList(params).then(res => {
                if (res.success) {
                    this.dataSource = res.result.list
                    this.$set(this.pagination, 'total', res.result.total)
                    this.$set(this.pagination, 'pageSize', res.result.pageSize)
                    this.$set(this.pagination, 'current', res.result.pageNum)
                }
                this.loading = false
            })
        },
        add() {
            this.$refs.changeUnit.open()
        },
        handleDelete(id) {
            deleteUnitList({
                id: id
            }).then(res => {
                if (res.success) {
                    this._loadData()
                }
                this.$message.info(res.message)
            })
        },
        changeTable(page) {
            this.pageNo = page.current
            this.pageSize = page.pageSize
            this._loadData()
        },
    },
}
</script>
<style lang="stylus" scoped>

</style>