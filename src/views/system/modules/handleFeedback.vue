<template>
    <a-modal
        width=60%
        v-model="handleVisible"
        title="处理病虫害"
        ref="modal"
        :maskClosable="false"
        style="min-width:1150px"
        @ok='handleOK'
        @cancel='handleCancel'
        class="handle-feedback">
        <div class="flex-wrapper">
            <div class="title">图片信息：</div>
            <div class="img-wrapper" v-if="this.record.pictureInfoList && this.record.pictureInfoList.length > 0">
                <div class="btn-wrapper">
                    <div class="show-img" v-for="item in this.record.pictureInfoList" :key="item.id">
                        <img :src="'/api/pictureInfo/show/' + item.pictureUrl">
                        <div class="img-mask">
                            <a-icon type="eye" @click="openImage(item.pictureUrl)"/>
                        </div>
                    </div>
                </div>
                <a-modal :maskClosable='false' :visible="imgModal" :footer="null" @cancel='handleImgCancel' style="text-align:center">
                    <img :src="curUrl ? '/api/pictureInfo/show/' + curUrl : ''" alt="" width="100%">
                </a-modal>
            </div>
        </div>
        <div class="flex-wrapper" :style="{'margin-bottom': this.type === 'BCH' ? '10px' : '30px'}" v-if="this.record.content">
            <div class="title" style="margin-bottom: 10px">报告内容：</div>
            <div style="font-size: 18px;color:#999999;line-height:33px">{{record.content}}</div>
        </div>
        <div class="table-wrapper" v-if="this.type === 'BCH'">
            <div style="margin: 0 0 10px 0;">
                <a-button
                    type="primary"
                    icon="plus"
                    @click="addBCH"
                >
                    添加处理病虫害
                </a-button>
            </div>
            <a-table :pagination="false" :columns="columns" :dataSource="data"  :rowKey="record => record.index" bordered>
                <template slot="illName" slot-scope="text, record">
                    <a-select
                        :filterOption='filterName'
                        style="width: 150px"
                        :value="text"
                        @change="handleIll($event, record)"
                        mode='combobox'>
                            <a-select-option
                                v-for="item in illData"
                                :key="item.id"
                                :value='item.illnessName'>
                                {{item.illnessName}}
                            </a-select-option>
                    </a-select>
                </template>
                <template slot="planName" slot-scope="text, record">
                    <a-select
                        :filterOption='filterName'
                        @change="changeRecordPlan($event, record)"
                        :value="text"
                        style="width: 150px"
                        mode='combobox'>
                            <a-select-option
                                v-for="item in planData"
                                :key="item.id"
                                :value='item.planName'>
                                {{item.planName}}
                            </a-select-option>
                    </a-select>
                </template>
                <template slot="method" slot-scope="text, record">
                    <a-textarea :value="text" @change="e => changeMark(e.target.value, record)" :autosize="{minRows: 2, maxRows: 6}"/>
                </template>
                <span slot="action" slot-scope="text, record">
                    <a-popconfirm title="确定删除吗?" @confirm="deleteData(record.index)">
                        <a>删除</a>
                    </a-popconfirm>
                </span>
            </a-table>
        </div>
        <div class="flex-wrapper">
            <span class="title">处理备注：</span>
            <a-textarea v-model="remark" style="width:400px; vertical-align: middle" :autosize="{minRows: 2, maxRows: 6}"/>
        </div>
    </a-modal>
</template>
<script>
import {processFeedback, getAllIllness, getAlltreat, updateFeed} from '@/api/permissonApi'

export default {
    props: ['type'],
    data() {
        return {
            handleVisible: false,
            record: {},
            imgModal: false,
            curUrl: '',
            remark: '',
            data: [],
            illData: [],
            planData: [],
            columns: [
                {
                    title: ()=>{
                        return(
                            <div>
                                <span style='color:red;margin-right:5px'>*</span>
                                <span>病虫害名称</span>
                            </div>
                        )
                    },
                    key: 'illName',
                    dataIndex: 'illName',
                    scopedSlots: { customRender: 'illName' },
                },
                {
                    title: ()=>{
                        return(
                            <div>
                                <span style='color:red;margin-right:5px'>*</span>
                                <span>治疗名称</span>
                            </div>
                        )
                    },
                    key: 'planName',
                    dataIndex: 'planName',
                    scopedSlots: { customRender: 'planName' },
                },
                {
                    title: ()=>{
                        return(
                            <div>
                                <span style='color:red;margin-right:5px'>*</span>
                                <span>治疗方法</span>
                            </div>
                        )
                    },
                    key: 'method',
                    dataIndex: 'method',
                    width: '50%',
                    scopedSlots: { customRender: 'method' },
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
    methods: {
        filterName(value, option) {
            return option.componentOptions.children[0].text.indexOf(value) > -1 ? true : false
        },
        open(record) {
            console.log(record)
            if (this.type) {
                getAllIllness().then(res => {
                    if (res.success) {
                        this.illData = res.result
                    }
                })
                this.record = {}
                this.record = {...record}
                if (this.record.illFeedbackPlans) {
                    this.record.illFeedbackPlans.map((item, index) => {
                        item.index = index
                    })
                }
                this.data = JSON.parse(JSON.stringify(record.illFeedbackPlans))
                this.remark = record.answerContent
            } else {
                this.record = {...record}
                this.remark = record.remark
            }
            this.handleVisible = true
        },
        openImage(picUrl) {
            this.imgModal = true
            this.curUrl = picUrl
        },
        handleImgCancel() {
            this.imgModal = false
            this.curUrl = ''
        },
        addBCH() {
            this.data.push({
                index: this.data.length,
                method: ''
            })
        },
        deleteData(index) {
            this.data.splice(index, 1)
            this.data.map((item, ele) => {
                item.index > index ? item.index -= 1 : item.index
            })
        },
        handleIll(val, record) {
            this.planData = []
            record.planName = ''
            record.method = ''
            let id = null
            for (let i = 0; i < this.illData.length; i++) {
                if (val === this.illData[i].illnessName) {
                    id = this.illData[i].id
                }
            }
            if (id) {
                getAlltreat({
                    illId: id
                }).then(res => {
                    if (res.success) {
                        this.planData = res.result
                    }
                })
            }
            record.illName = val
        },
        changeRecordPlan(val, record) {
            let method
            for (let i = 0; i < this.planData.length; i++) {
                if (val === this.planData[i].planName) {
                    method = this.planData[i].method
                }
            }
            record.planName = val
            if (method) {
                record.method = method
            }
        },
        changeMark(val, record) {
            record.method = val
        },
        handleCancel() {
            this.remark = '',
            this.data = []
            this.planData = []
            this.handleVisible = false
        },
        handleOK() {
            if (this.remark) {
                if (this.type === 'BCH') {
                    var arr = this.data.filter(item => {
                        return item.method && item.illName && item.planName
                    })
                    processFeedback({
                        id: this.record.id,
                        illFeedbackPlans: arr,
                        answerContent: this.remark
                    }).then(res => {
                        if (res.success) {
                            this.handleVisible = false
                            this.remark = ''
                            this.data = []
                            this.planData = []
                            this.$parent._loadData()
                        }
                        this.$message.info(res.message)
                    })
                } else {
                    updateFeed({
                        id: this.record.id,
                        remark: this.remark
                    }).then(res => {
                        if (res.success) {
                            this.handleVisible = false
                            this.remark = ''
                            this.$parent._loadData()
                        }
                        this.$message.info(res.message)
                    })
                }
            } else {
                this.$message.warn('必须填写处理备注')
            }
        }
    }
}
</script>
<style lang="stylus" scoped>
    .handle-feedback
        .table-wrapper
            margin-bottom 30px
        .flex-wrapper
            position relative
            text-align center
            display flex
            margin-bottom 30px
            .title
                font-size 20px
                width: 110px
                margin-right: 10px
                font-weight 600
                text-align left
                &::before
                    content: " "
                    display inline-block
                    height 20px
                    width 4px
                    border-radius 2px
                    background-color #2C909C
                    margin-right 5px
                    position relative
                    top 3px
            .btn-wrapper
                img
                    width 100%
                    height 100%
                .show-img
                    position relative
                    display inline-block
                    margin-right 10px
                    width 120px
                    height 120px
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
        .handle-body
            width 90%
            margin 0px auto 30px
            .img-wrapper
                margin-bottom 20px
</style>
