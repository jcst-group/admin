<template>
    <div class="farming-item">
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
                    <span style="line-height:40px;margin-right:5px">作物品种名称：</span>
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
                </a-form>
            </div>
        </div>
        <div style="margin: 0 0 16px 0;">
            <a-button
                type="primary"
                icon="plus"
                @click="add"
            >
                添加自定义农事
            </a-button>
        </div>
        <div style="width: 100%">
            <a-table
            :columns="planColumns"
            :dataSource="farmingItemDatas"
            :pagination="pagination"
            :loading="loading"
            rowKey="id"
            bordered
            @change="changeTable"
            style="max-width: 100%"
            >
                <!-- <div slot="method" slot-scope="text, record">
                    <span v-html="text"></span>
                </div> -->
                <span slot="action" slot-scope="text, record">
                    <a @click="handleEdit(record)">编辑</a>
                    <a-divider type="vertical"/>
                    <a-popconfirm title="确定删除吗?" @confirm="handleDelete(record.id)">
                        <a>删除</a>
                    </a-popconfirm>
                </span>
            </a-table>
        </div>
        <addFarmingModal :cropDatas='cropDatas.slice(1, cropDatas.length)' ref="addFarmingModal"></addFarmingModal>
    </div>
</template>
<script>
import {
    getAllCrop,
    getAllFarmingItem,
    deleteFarmingItem
} from '@/api/permissonApi'
import addFarmingModal from './modules/addFarmingItem'
export default {
    name: 'farmingItem',
    components: {
        addFarmingModal
    },
    created() {
        getAllCrop().then(res => {
            if (res.success) {
                this.cropDatas = this.cropDatas.concat(res.result)
            }
        })
        this._loadData()
    },
    data() {
        return {
            cropDatas: [{
                id: 0,
                cropName: '全部'
            }],
            farmingItemDatas: [],
            loading: false,
            pageNo: null,
            pageSize: null,
            form: this.$form.createForm(this),
            planColumns: [
                {
                    title: '农事名称',
                    dataIndex: 'farmingName',
                    key: 'farmingName'
                },
                {
                    title: '作物名称',
                    dataIndex: 'crop.cropName',
                    key: 'crop.cropName',
                },
                {
                    title: '方法',
                    dataIndex: 'method',
                    key: 'method',
                    class: 'table-method',
                    width:'30%'
                },
                {
                    title: '指导图片数量',
                    dataIndex: 'pictureInfoList.length',
                    key: 'pictureInfoList.length'
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
    methods: {
        _loadData() {
            let params = this.form.getFieldsValue();
            params.pageNo = this.pageNo
            params.pageSize = this.pageSize
            this.loading = true
            if (params.cropId === 0) {
                delete params.cropId
            }
            getAllFarmingItem(params).then(res => {
                if (res.success) {
                    this.farmingItemDatas = res.result.list
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
            this.$refs.addFarmingModal.open()
            this.$refs.addFarmingModal.title = '添加农事项目'
        },
        handleEdit(record) {
            this.$refs.addFarmingModal.open(record)
            this.$refs.addFarmingModal.title = '修改农事项目'
        },
        handleDelete(id) {
            deleteFarmingItem({
                id: id
            }).then(res => {
                this.$message.info(res.message)
                if (res.success) {
                    this._loadData()
                }
            })
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
    .farming-item
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
