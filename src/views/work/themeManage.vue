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
                        :form="form">
                        <div class="search-wrapper">
                            <span style="line-height:40px;margin-right:5px">处理人员：</span>
                            <a-form-item style="display:inline-block;">
                                <a-input
                                    style="width: 200px"
                                    placeholder="请输入处理人员名称"
                                    v-decorator="['handlePerson']">
                                </a-input>
                            </a-form-item>
                        </div>
                        <div class="search-wrapper" style='display: inline-block; margin-right:30px'>
                            <span style="line-height:40px;margin-right:5px">项目名称：</span>
                            <a-form-item style="display:inline-block;">
                                <a-select
                                    @change="getThemeData"
                                    v-decorator="['name']"
                                    style="width: 230px">
                                    <a-select-option 
                                        v-for="item in projectDatas"
                                        :key="item.id"
                                        :value='item.id'>
                                        {{item.name}}
                                    </a-select-option>
                                </a-select>
                            </a-form-item>
                        </div>
                        <div class="search-wrapper" style='display: inline-block'>
                            <span style="line-height:40px;margin-right:5px">主题名称：</span>
                            <a-form-item style="display:inline-block;">
                                <a-select
                                    placeholder="请先选择项目名称"
                                    v-decorator="['projectId']"
                                    style="width: 230px">
                                    <a-select-option 
                                        v-for="item in themeDatas"
                                        :key="item.id"
                                        :value='item.id'>
                                        {{item.name}}
                                    </a-select-option>
                                </a-select>
                            </a-form-item>
                        </div>
                        <div class="search-wrapper">
                            <span style="line-height:40px;margin-right:5px">完成状态：</span>
                            <a-form-item style="display:inline-block">
                                <a-radio-group
                                    v-decorator="['status', {
                                        initialValue: 'INCOMPLETE'
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
        </div>
        <div style="margin: 0 0 16px 0;">
            <a-button
                type="primary"
                icon="plus"
                @click="add"
            >
                添加工作记录
            </a-button>
        </div>
        <div>
            <a-table
                :columns="workColumns"
                :dataSource="dataSource"
                :pagination="pagination"
                :loading="loading"
                rowKey="id"
                bordered
                @change="changeTable">
                <span slot="expectStartTime" :style="{color: getColor(record)}" slot-scope="text, record">
                    {{text}}
                </span>
                <a-popover :title="false" slot="content" slot-scope="text" style="max-width:170px">
                    <template slot="content">
                        <p style="white-space:pre-line">{{text}}</p>
                    </template>
                    <div style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap">{{text}}</div>
                </a-popover>
                <a-popover :title="false" slot="remark" slot-scope="text" style="max-width:170px">
                    <template slot="content">
                        <p style="white-space:pre-line">{{text}}</p>
                    </template>
                    <div style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap">{{text}}</div>
                </a-popover>
                <span slot="files" slot-scope="text, record" @click="showFiles(record)" v-if="record.fileInfos">
                    <a-tag color="blue">
                        数量：{{record.fileInfos.length}}
                    </a-tag>
                </span>
                <span slot="action" slot-scope="text, record" style="white-space:nowrap">
                    <a-popconfirm title="确定完成?" @confirm="finishWork(record)">
                        <a>完成</a>
                    </a-popconfirm>
                    <a-divider type="vertical"/>
                    <a-dropdown>
                        <a class="ant-dropdown-link">
                            更多 <a-icon type="down" />
                        </a>
                        <a-menu slot="overlay">
                            <a-menu-item >
                                <a @click="updateData(record)">编辑</a>
                            </a-menu-item>
                            <a-menu-item >
                                <a-popconfirm title="确定删除吗?" @confirm="handleDelete(record)">
                                    <a>删除</a>
                                </a-popconfirm>
                            </a-menu-item>
                            <a-menu-item v-if="record.children">
                                <a @click="addChild(record)">添加子任务</a>
                            </a-menu-item>
                        </a-menu>
                    </a-dropdown>
                </span>
            </a-table>
        </div>
        <themeModal ref="themeModal"></themeModal>
        <a-modal
            title="文件详情"
            v-model="fileVisible"
            style="top:10%;height: 90%"
            :footer='null'
            :maskClosable="false"
            @cancel='initFile'
            class="theme-modal">
            <a-upload
                name="file"
                action="/api2/fileInfo/uploadTaskFile"
                :data='{relationId: this.fileId}'
                :fileList='fileList'
                :headers="headers"
                @change="handleChange">
                <a-button> <a-icon type="upload" /> 上传文件 </a-button>
            </a-upload>
        </a-modal>
    </div>
</template>
<script>
import Vue from 'vue'
import { ACCESS_TOKEN } from "@/store/mutation-types"
import themeModal from './themeModal'
import moment from 'moment'
import {getWorkStatus, getThemeManage, deleteThemeManage, updateThemeStauts, deleteFile, getProjectData} from '@/api/allapi'
export default {
    name: 'themeManage',
    components: {
        themeModal
    },
    data() {
        return {
            fileVisible: false,
            fileList: [],
            fileId: null,
            form: this.$form.createForm(this),
            loading: false,
            dataSource: [],
            statusDatas: [],
            projectDatas: [],
            themeDatas: [],
            workColumns: [
                {
                    title: '所属项目',
                    dataIndex: 'project.projectName',
                    key: 'project.projectName'
                },
                {
                    title: '项目阶段',
                    dataIndex: 'project.themeName',
                    key: 'project.themeName'
                },
                {
                    title: '任务',
                    dataIndex: 'themeName',
                    key: 'themeName'
                },
                {
                    title: '内容',
                    dataIndex: 'content',
                    key: 'content',
                    scopedSlots: { customRender: "content" },
                },
                {
                    title: '处理人员',
                    dataIndex: 'handlePerson',
                    key: 'handlePerson'
                },
                {
                    title: '预计开始时间',
                    dataIndex: 'expectStartTime',
                    key: 'expectStartTime',
                    scopedSlots: { customRender: "expectStartTime" },
                },
                {
                    title: '预计结束时间',
                    dataIndex: 'expectEndTime',
                    key: 'expectEndTime'
                },
                {
                    title: '处理开始时间',
                    dataIndex: 'handleStartTime',
                    key: 'handleStartTime'
                },
                {
                    title: '处理结束时间',
                    dataIndex: 'handleEndTime',
                    key: 'handleEndTime'
                },
                {
                    title: '总天数',
                    dataIndex: 'totalDays',
                    key: 'totalDays'
                },
                {
                    title: '完成状态',
                    dataIndex: 'status.displayName',
                    key: 'status.displayName'
                },
                {
                    title: '备注',
                    dataIndex: 'remark',
                    key: 'remark',
                    scopedSlots: { customRender: "remark" },
                },
                {
                    title: '文件',
                    dataIndex: 'files',
                    key: 'files',
                    scopedSlots: { customRender: "files" },
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
        const token = Vue.ls.get(ACCESS_TOKEN);
        this.headers = {"X-Access-Token":token};
        getWorkStatus().then(res => {
            if (res.success) {
                this.statusDatas = res.result
            }
        })
        getProjectData().then(res => {
            if (res.success) {
                this.projectDatas = res.result
            }
        })
    },
    mounted() {
        this._loadData()
    },
    methods: {
        getThemeData(value) {
            this.form.resetFields(['projectId'])
            getProjectData({
                parentId: value
            }).then(res => {
                if (res.success) {
                    this.themeDatas = res.result
                }
            })
        },
        _loadData() {
            let params = this.form.getFieldsValue();
            params.pageNo = this.pageNo
            params.pageSize = this.pageSize
            this.loading = true
            if (params.name && !params.projectId) {
                params.projectId = params.name
            }
            getThemeManage(params).then(res => {
                if (res.success) {
                    this.dataSource = res.result.list
                    this.$set(this.pagination, 'total', res.result.total)
                    this.$set(this.pagination, 'pageSize', res.result.pageSize)
                    this.$set(this.pagination, 'current', res.result.pageNum)
                    if (this.fileId) {
                        let curData = res.result.list.filter(item => {
                            return item.id === this.fileId
                        })
                        if (curData.length) {
                            if (!curData[0].fileInfos.length) this.fileList = []
                            this.fileList = curData[0].fileInfos.map(item => {
                                return {
                                    uid: item.id,
                                    name: item.fileName,
                                    status:'done',
                                    url: `/api2/fileInfo/downFile?fileUrl=${item.fileUrl}&fileName=${item.fileName}`
                                }
                            })
                        }
                    }
                }
                this.loading = false
            })
        },
        getColor(record) {
            if (!record.handleStartTime) {
                var diffDate = moment(record.expectStartTime).diff() - moment().diff()
                return diffDate < 0 ? 'red' : (diffDate / 84000000 < 1 ? 'gold' : 'black')
            }
            return 'black'
        },
        changeTable(page) {
            this.pageNo = page.current
            this.pageSize = page.pageSize
            this._loadData()
        },
        handleReset() {
            this.form.resetFields()
            this._loadData()
        },
        handleSearch() {
            this._loadData()
        },
        add() {
            this.$refs.themeModal.open()
        },
        updateData(record) {
            if (record.status.displayName === '已完成') {
                this.$message.warn('已完成，不可编辑')
                return
            }
            if (record.children) {
                this.$refs.themeModal.open(record)
            } else {
                this.$refs.themeModal.open(record, true)
            }
        },
        addChild(record) {
            this.$refs.themeModal.open(record, true)
        },
        finishWork(record) {
            if (record.status.displayName === '已完成') {
                return
            }
            updateThemeStauts({
                id: record.id
            }).then(res => {
                this.$message.info(res.message)
                if (res.success) {
                    this._loadData()
                }
            })
        },
        handleDelete(record) {
            if (record.status.displayName === '已完成') {
                this.$message.warn('已完成，不可删除')
                return
            }
            deleteThemeManage({
                id: record.id
            }).then(res => {
                this.$message.info(res.message)
                if (res.success) {
                    this._loadData()
                }
            })
        },
        showFiles(record) {
            this.fileVisible = true
            this.fileId = record.id
            if (record.fileInfos.length) {
                this.fileList = record.fileInfos.map(item => {
                    return {
                        uid: item.id,
                        name: item.fileName,
                        status:'done',
                        url: `/api2/fileInfo/downFile?fileUrl=${item.fileUrl}&fileName=${item.fileName}`
                    }
                })
            }
        },
        handleChange(info) {
            if (info.file.status === 'uploading') {
                this.fileList = info.fileList
                return
            }
            if (info.file.status === "removed") {
                let id = info.file.response ? info.file.response.result.id : info.file.uid
                deleteFile({
                    id: id
                }).then(res => {
                    this.$message.info(res.message)
                    if (res.success) {
                        this._loadData()
                    }
                })
                return
            }
            if (info.file.responese && info.file.responese.success) {
                this.fileList.push({
                    uid: info.responese.result.id,
                    name: info.responese.result.fileName,
                    status:'done',
                    url: `/api2/fileInfo/downFile?fileUrl=${info.responese.result.fileUrl}&fileName=${info.responese.result.fileName}`
                })
            }
            if (info.file.status === 'done') {
                this.$message.info(info.file.response.message);
                this._loadData()
            } else if (info.file.status === 'error') {
                this.$message.error(`${info.file.name} 文件上传失败.`);
            }
        },
        initFile() {
            this.fileList = []
            this.fileId = null
        }
    },
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