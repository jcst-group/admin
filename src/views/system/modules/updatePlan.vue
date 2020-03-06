<template>
    <a-modal
        title="编辑种植计划"
        v-model="visible"
        style="top:10%;height: 90%"
        :maskClosable="false"
        @cancel='handleCancel'
        class="update-plan">
        <template slot='footer'>
            <a-button @click="handleCancel">关闭</a-button>
        </template>
        <div class="title-wrapper" v-if="record.id">
            <span class="desc">名称：{{record.planName}}</span>
            <span class="desc">品种：{{record.crop.cropName}}</span>
            <span class="desc">产区：{{record.provenance}}</span>
            <a-button
                type="primary"
                icon="plus"
                style="margin-right: 10px;"
                @click="addYear(record.id)"
            >
                添加年
            </a-button>
            <a-popconfirm v-if="this.planYearList.length > 0" title="确定删除最后一年吗?" @confirm="deleteYear">
                <a>
                    <a-button
                        type="primary"
                        icon="delete"
                    >
                        删除年
                    </a-button>
                </a>
            </a-popconfirm>
        </div>
        <a-tabs
            v-model="activeKey"
            type="card"
            v-if="planYearList.length > 0"
            @change='changeTab'>
            <a-tab-pane 
                v-for="item in planYearList"
                :key="item.year.value"
                :tab='item.year.displayName'>
                <div class="plan-box">
                    <a-button
                        type="primary"
                        icon="plus"
                        @click="addRecord"
                        style="margin-bottom: 10px"
                    >
                        添加农事
                    </a-button>
                    <div>
                        <a-table
                        :columns="farmingColumns"
                        :dataSource="dataSource"
                        :loading="loading"
                        rowKey="id"
                        bordered
                        :pagination='false'
                        :scroll="{y: 285 }"
                        >
                            <span slot="roleList" slot-scope="text,record">
                                <span v-for="item in record.roleList" :key="item.id" style="margin-right:4px">
                                    <a-tag color="blue">{{item.name}}</a-tag>
                                </span>
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
                                <a-popconfirm title="确定删除吗?" @confirm="handleDelete(record.id)">
                                    <a>删除</a>
                                </a-popconfirm>
                            </span>
                        </a-table>
                    </div>
                </div>
            </a-tab-pane>
        </a-tabs>
        <addFarming ref="addFarming" @tabTrigger='changeTab(curKey)'></addFarming>
        <addAllResource ref="addAllResource" :parentRecord='this.record' @refreshParent='open'></addAllResource>
    </a-modal>
</template>
<script>
import {
    getAllFarming,
    getAllPlanYear,
    updateFarming,
    deleteFarming,
    addPlanYear,
    deletePlanYear
} from '@/api/permissonApi'
import addFarming from './addFarming'
import addAllResource from './addAllResource'
export default {
    components: {
        addFarming,
        addAllResource
    },
    data() {
        return {
            visible: false,
            activeKey: 1,
            record: {},
            loading:false,
            dataSource: [],
            planYearList: [],
            curKey: '',
            farmingColumns: [
                {
                    title: '节气',
                    dataIndex: 'solarTerm.displayName',
                    key: 'solarTerm.displayName',
                    width: 80
                },
                {
                    title: '候期',
                    dataIndex: 'hou.displayName',
                    key: 'hou.displayName',
                    width: 80
                },
                {
                    title: '农事周期',
                    dataIndex: 'farmingCycle',
                    key: 'farmingCycle',
                    width: 100
                },
                {
                    title: '农事项目',
                    dataIndex: 'farmingItem.farmingName',
                    key: 'farmingItem.farmingName',
                    width: 127
                },
                {
                    title: '是否定位',
                    dataIndex: 'isLocation.displayName',
                    key: 'isLocation.displayName',
                    width: 120
                },
                {
                    title: '角色',
                    dataIndex: 'roleList',
                    key: 'roleList',
                    scopedSlots: { customRender: "roleList" },
                    width: 232
                },
                {
                    title: '人资物料详情',
                    dataIndex: 'edit',
                    key: 'edit',
                    scopedSlots: { customRender: "edit" },
                    align: "center",
                    width: 270
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
        open(record) {
            this.record = record
            this.loading = true
            if (record.id) {
                getAllPlanYear({
                    planId: record.id
                }).then(res => {
                    if (res.success) {
                        this.planYearList = res.result
                        if (this.planYearList.length > 0) {
                            this.curKey = this.planYearList[0].id
                            this.activeKey = this.planYearList[0].year.value
                            getAllFarming({
                                planYearId: this.planYearList[0].id
                            }).then(res => {
                                if (res.success) {
                                    this.dataSource = res.result
                                }
                                this.loading = false
                            })
                        }
                    }
                })
            }
        },
        handleCancel() {
            this.visible = false
            this.activeKey = 1
        },
        changeTab(activeKey) {
            this.loading = true
            if (this.planYearList.length > 0) {
                for (let i = 0; i < this.planYearList.length; i++) {
                    if (activeKey === this.planYearList[i].year.value) {
                        this.curKey = this.planYearList[i].id
                    }
                }
            }
            getAllFarming({
                planYearId: this.curKey
            }).then(res => {
                if (res.success) {
                    this.loading = false
                    this.dataSource = res.result
                }
            })
        },
        addRecord() {
            this.$refs.addFarming.title = '添加农事记录',
            this.$refs.addFarming.curCrop = this.record.cropId
            this.$refs.addFarming.open()
            this.$refs.addFarming.getKey = this.curKey
        },
        handleEdit(record) {
            this.$refs.addFarming.title = '修改农事记录',
            this.$refs.addFarming.curCrop = this.record.cropId
            this.$refs.addFarming.open(record)
            this.$refs.addFarming.getKey = this.curKey
        },
        editMessage(record) {
            this.$refs.addAllResource.open(record)
        },
        handleDelete(id) {
            let key = this.curKey
            deleteFarming({
                id:id
            }).then(res => {
                this.$message.info(res.message)
                if (res.success) {
                    this.changeTab(key)
                }
            })
        },
        addYear(id) {
            if (this.record.id) {
                let len = this.planYearList.length
                addPlanYear({
                    planId:id,
                    year: this.planYearList.length > 0 ? this.planYearList[len - 1].year.code : null
                }).then(res => {
                    this.$message.info(res.message)
                    this.activeKey = 1
                    if (res.success) {
                        this.open(this.record)
                    }
                })
            }
        },
        deleteYear() {
            if (this.planYearList.length > 0) {
                deletePlanYear({
                    id: this.planYearList[this.planYearList.length - 1].id
                }).then(res => {
                    this.$message.info(res.message)
                    this.activeKey = 1
                    if (res.success) {
                        this.open(this.record)
                    }
                })
            }
        }
    }
}
</script>
<style lang="stylus">
    .update-plan
        width 1200px !important
        .change-year
            position absolute
            right 300px
            top 76px
        .plan-box
            height: 400px
        .title-wrapper
            width 100%
            margin-bottom 30px
            .desc
                margin-right 30px
                font-size 18px
                font-weight 800
</style>
