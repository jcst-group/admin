<template>
    <div style="background:white;padding:10px 0 10px 0;" class="feed-back">
        <div style="margin:0 1% 0 0;">
            <div>
                <div class="button">
                    <i-button class="search-btn btn" style="margin-right:10px"  @click="_loadData">
                        <Icon type="md-refresh" class="icon"/>
                        刷新
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
            </div>
        </div>
        <div class="form-wrapper">
            <a-form :form='form' @submit="handleSearch">
                <div class="search-wrapper">
                    <span style="line-height:40px;margin-right:5px">基地名称：</span>
                    <a-form-item style="display:inline-block;width:300px">
                        <BaseSelect
                            v-decorator="['baseId']">
                        </BaseSelect>
                    </a-form-item>
                </div>
            </a-form>
        </div>
        <div style="margin-top:10px">
            <a-table
            :columns="feedBackColumns"
            :dataSource="dataSource"
            :pagination="pagination"
            :loading="loading"
            rowKey="id"
            bordered
            @change="changeTable"
            >
                <span slot="action" slot-scope="text, record">
                    <a @click="lookPic(record)">
                        <Icon type="md-image" />
                        查看图片
                    </a>
                </span>
            </a-table>
        </div>
        <a-modal
            title="查看图片"
            v-model="visible"
            :maskClosable="false"
            @cancel='closeModal'
            class="look-pic"
        >
            <div class="pic-wrapper" v-if="this.record.pictureInfoList && this.record.pictureInfoList.length > 0">
                <div v-for="item in this.record.pictureInfoList" :key="item.id" style="display:inline-block; margin-right:40px">
                    <!-- <a-button style="margin-right:10px;background:#1ABC9C;color:#fff;border-color:#1ABC9C">查看</a-button> -->
                    <div class="show-img">
                        <img :src="'/api2/pictureInfo/show/' + item.pictureUrl">
                        <div class="img-mask">
                            <a-icon type="eye"  @click="showPic(item)"/>
                        </div>
                    </div>
                </div>
            </div>
            <div class="pic-null" v-else style="font-size: 20px; font-weight:700">
                暂无图片
            </div>
            <div slot="footer">
                <a-button @click="closeModal" style="background:#1ABC9C;color:#fff;border-color:#1ABC9C">关闭</a-button>
            </div>
        </a-modal>
        <a-modal :visible="imgVisible" :footer="null" @cancel="handleCancel">
            <img style="width: 100%" :src="'/api2/pictureInfo/show/' + this.item.pictureUrl" />
        </a-modal>
    </div>
</template>
<script>
import {getFeedBack} from '@/api/permissonApi.js'
import BaseSelect from '@/components/selectComponents/baseSelect'

export default {
    name: 'feedBack',
    components: {
        BaseSelect
    },
    data() {
        return {
            loading: false,
            pageNo: null,
            pageSize: null,
            visible: false,
            imgVisible: false,
            record: {},
            item: {},
            form: this.$form.createForm(this),
            feedBackColumns: [
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
                    title: '报告内容',
                    dataIndex: 'content',
                    key: 'content'
                },
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
        this._loadData()
    },
    methods: {
        _loadData() {
            let params = this.form.getFieldsValue()
            if (params.baseId) {
                params.baseId = params.baseId.value
            }
            params.pageNo = this.pageNo
            params.pageSize = this.pageSize
            this.loading = true
            getFeedBack(params).then(res => {
                if (res.success) {
                    this.dataSource = res.result.list
                    this.$set(this.pagination, 'total', res.result.total)
                    this.$set(this.pagination, 'pageSize', res.result.pageSize)
                    this.$set(this.pagination, 'current', res.result.pageNum)
                }
                this.loading = false
            })
        },
        changeTable(page) {
            this.loading = true
            this.pageNo = page.current
            this.pageSize = page.pageSize
            this._loadData()
        },
        lookPic(record) {
            this.record = record
            this.visible = true
        },
        closeModal() {
            this.visible = false
            setTimeout(() => {
                this.record = {}
            }, 200)
        },
        showPic(item) {
            this.item = item
            this.imgVisible = true
        },
        handleSearch() {
            this._loadData()
        },
        handleReset() {
            this.form.resetFields()
            this._loadData()
        },
        handleCancel() {
            this.imgVisible = false,
            setTimeout(() => {
                this.item = {}
            }, 200)
        }
    },
}
</script>
<style lang="stylus">
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
    .feed-back
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
            width 50%
            display inline-block
            .ant-form-item
                width 80%
                display inline-block
                .ant-form-item-control-wrapper
                    width 60%
                    display inline-block
                .ant-form-item-label
                    width 150px
                    vertical-align top
</style>