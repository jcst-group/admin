<template>
    <div style="background:white;padding:10px 0 10px 0;" class="bch-feedback">
        <div style="margin:0 1% 0 0;">
            <div>
                <div class="button">
                    <i-button class="review-btn btn" style="margin-right:10px" @click="handleReset">
                        <Icon type="md-sync" class="icon"/>
                        重置
                    </i-button>
                    <i-button class="search-btn btn" style="margin-right:10px"  @click="handleSearch">
                        <Icon type="md-search" class="icon"/>
                        查询
                    </i-button>
                </div>
            </div>
        </div>
        <div class="form-wrapper">
            <a-form :form='form' @submit="handleSearch">
                <div class="search-wrapper" style="width:300px">
                    <span style="line-height:40px;margin-right:5px">基地名称：</span>
                    <a-form-item style="display:inline-block;width:200px">
                        <BaseSelect
                            ref="baseSelect"
                            v-decorator="['baseId']">
                        </BaseSelect>
                    </a-form-item>
                </div>
                <div class="search-wrapper">
                    <span style="line-height:40px;margin-right:5px">审核状态：</span>
                    <a-form-item style="display:inline-block">
                        <a-radio-group
                            @change="() => {this.$nextTick(_loadData)}"
                            v-decorator="['status', {
                                initialValue: 'UNTREATED'
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
        <div style="margin-top:10px">
            <a-table
                :columns="BCHColumns"
                :dataSource="dataSource"
                :pagination="pagination"
                :loading="loading"
                rowKey="id"
                bordered
                @change="changeTable">
                <span slot="action" slot-scope="text, record">
                    <a @click="handleFeedback(record)">处理</a>
                </span>
            </a-table>
        </div>
        <handleFeed ref="handleFeed" type='BCH'></handleFeed>
    </div>
</template>
<script>
import BaseSelect from '@/components/selectComponents/baseSelect'
import {getIllFeedback, updateIllFeedback, deleteIllFeedback, getFeedStatus} from '@/api/permissonApi'
import handleFeed from './modules/handleFeedback'

export default {
    name: 'BCHfeedback',
    components: {
        BaseSelect,
        handleFeed
    },
    data() {
        return {
            loading: false,
            pageNo: null,
            pageSize: null,
            form: this.$form.createForm(this),
            statusDatas: [{
                value: -1,
                code: 'ALL',
                displayName: '全部'
            }],
            BCHColumns: [
                {
                    title: '时间',
                    dataIndex: 'feedbackTime',
                    key: 'feedbackTime'
                },
                {
                    title: '姓名',
                    dataIndex: 'user.realName',
                    key: 'user.realName'
                },
                {
                    title: '基地',
                    dataIndex: 'baseInfo.baseName',
                    key: 'baseInfo.baseName'
                },
                {
                    title: '处理状态',
                    dataIndex: 'status.displayName',
                    key: 'status.displayName'
                },
                // {
                //     title: '报告内容',
                //     dataIndex: 'content',
                //     key: 'content'
                // },
                {
                    title: '操作',
                    dataIndex: "action",
                    key: "action",
                    scopedSlots: { customRender: "action" },
                    align: "center"
                }
            ],
            dataSource: [],
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
        getIllFeedback({
            status: 'UNTREATED'
        }).then(res => {
            if (res.success) {
                this.dataSource = res.result.list
                this.$set(this.pagination, 'total', res.result.total)
                this.$set(this.pagination, 'pageSize', res.result.pageSize)
                this.$set(this.pagination, 'current', res.result.pageNum)
            }
        })
        getFeedStatus().then(res => {
            if (res.success) {
                this.statusDatas = this.statusDatas.concat(res.result)
            }
        })
    },
    methods: {
        _loadData() {
            let params = this.form.getFieldsValue()
            if (params.status === 'ALL') {
                delete params.status
            }
            params.pageNo = this.pageNo
            params.pageSize = this.pageSize
            this.loading = true
            getIllFeedback(params).then(res => {
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
            this.$refs.baseSelect.selectValue = null
            this._loadData()
        },
        handleSearch() {
            this._loadData()
        },
        changeTable(page) {
            this.loading = true
            this.pageNo = page.current
            this.pageSize = page.pageSize
            this._loadData()
        },
        handleFeedback(record) {
            this.$refs.handleFeed.open(record)
        }
    }
}
</script>
<style lang="stylus">
    .bch-feedback
        .btn
            float right
            background #2c909c
            border-color #2c909c
            color #fff
            line-height 18px
            margin-top 6px
            .icon
                font-size 18px
                vertical-align top
        .form-wrapper
            width 70%
            display inline-block
            .search-wrapper
                width 400px
                display inline-block
            .ant-form-item
                width 80%
                display inline-block
                .ant-form-item-control-wrapper
                    width 100%
                    display inline-block
                .ant-form-item-label
                    width 150px
                    vertical-align top
    .look-pic
        width 700px !important
        .show-img
            position relative
            width 150px
            height 200px
            img
                width 100%
                height 100%
            .img-mask
                position absolute
                top 0
                right 0
                left 0
                bottom 0
                background-color rgba(0, 0, 0, 0.5)
                opacity 0
                z-index 99
                transition all 0.3s
                i
                    font-size 30px
                    color rgba(255, 255, 255, 0.85)
                    transform translate(-50%, -50%)
                    position absolute
                    top 50%
                    left 50%
            &:hover
                .img-mask
                    opacity 1
</style>
