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
                        <div style="float:left;width:270px;height:50px;margin-bottom:10px;">
                            <span style="line-height:40px;margin-right:5px">项目检测阶段：</span>
                            <a-form-item style="display:inline-block">
                                <a-select
                                v-decorator="['stage']"
                                style="width: 160px">
                                    <a-select-option 
                                        v-for="item in stageDatas"
                                        :key="item.value"
                                        :value='item.code'>
                                        {{item.displayName}}
                                    </a-select-option>
                                </a-select>
                            </a-form-item>
                        </div>
                        <div style="float:left;width:270px;height:50px;margin-bottom:10px;">
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
            添加检测标准
        </a-button>
        </div>
        <div>
            <a-table
            :columns="standardColumns"
            :dataSource="dataSource"
            :pagination="pagination"
            :loading="loading"
            rowKey="id"
            bordered
            @change="changeTable"
            >
                <span slot="standdete" slot-scope="text, record">
                    <span>{{record.minValue}}至{{record.maxValue}}</span>
                </span>
                <span slot="action" slot-scope="text, record">
                    <a @click="handleEdit(record)">编辑</a>
                    <a-divider type="vertical"/>
                    <a-popconfirm title="确定删除吗?" @confirm="handleDelete(record.id)">
                        <a>删除</a>
                    </a-popconfirm>
                </span>
            </a-table>
        </div>
        <Standard ref="standard"></Standard>
    </div>
    
</template>
<script>
import {getStandard,deleteStandard, getAllCrop, getAllStage} from '@/api/permissonApi'
import Standard from './modules/standardModule'
export default {
    name: 'standard',
    data() {
        return {
            dataSource: [],
            loading: false,
            form: this.$form.createForm(this),
            pageNo: null,
            pageSize: null,
            stageDatas: [{
                code: 0,
                value: 0,
                displayName: '全部'
            }],
            cropDatas: [{
                id: 0,
                cropName: '全部'
            }],
            pagination: {
                pageSizeOptions: ["10", "20", "50"],
                showTotal: (total, range) => {
                    return range[0] + "-" + range[1] + " 共" + total + "条";
                },
                showQuickJumper: true,
                showSizeChanger: true,
            },
            standardColumns: [
                {
                    title: '检测项目阶段',
                    dataIndex: 'stage.displayName',
                    key: 'stage.displayName'
                },
                {
                    title: '检测项目',
                    dataIndex: 'item',
                    key: 'item'
                },
                {
                    title: '单位',
                    dataIndex: 'unit.displayName',
                    key: 'unit.displayName'
                },
                {
                    title: '检测标准',
                    dataIndex: 'standdete',
                    key: 'standdete',
                    scopedSlots: { customRender: "standdete" },
                },
                {
                    title: '检测品种',
                    dataIndex: 'crop.cropName',
                    key: 'crop.cropName'
                },
                {
                    title: '项目类别',
                    dataIndex: 'itemCategory.displayName',
                    key: 'itemCategory.displayName'
                },
                {
                    title: '操作时间',
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
            ]
        }
    },
    components: {
        Standard
    },
    created() {
        this._loadData()
        getAllCrop().then(res => {
            if (res.success) {
                this.cropDatas = this.cropDatas.concat(res.result)
            }
        })
        getAllStage().then(res => {
            if (res.success) {
                this.stageDatas = this.stageDatas.concat(res.result)
            }
        })
    },
    methods: {
        _loadData() {
            this.loading = true
            let params = this.form.getFieldsValue()
            params.pageNo = this.pageNo
            params.pageSize = this.pageSize
            if (params.cropId === 0) {
                delete params.cropId
            }
            if (params.stage === 0) {
                delete params.stage
            }
            getStandard(params).then(res => {
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
            this.$refs.standard.title = '添加检测标准',
            this.$refs.standard.open()
        },
        handleEdit(record) {
            this.$refs.standard.title = '修改检测标准',
            this.$refs.standard.open(record)
        },
        handleDelete(id) {
            deleteStandard({
                id: id
            }).then(res => {
                this.$message.info(res.message)
                if (res.success) {
                    this._loadData()
                }
            })
        },
        changeTable(page) {
            this.loading = true
            this.pageNo = page.current
            this.pageSize = page.pageSize
            this._loadData()
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
