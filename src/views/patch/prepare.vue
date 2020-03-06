<template>
    <div class="prepare">
        <div class="header-wrapper">
            <div class="button">
                <i-button class="review-btn btn" @click="exportMessages">
                    <Icon type="md-download" class="icon"/>
                    导出
                </i-button>
                <i-button class="search-btn btn" style="margin-right:10px"  @click="handleReset">
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
                    <div style="display: inline-block; margin-right: 16px">
                        <span style="line-height:40px;margin-right:5px">种植计划：</span>
                        <a-form-item style="display:inline-block">
                            <a-select
                                @change="selectBatch"
                                placeholder="请选择种植计划"
                                v-decorator="['planId']"
                                style="width: 200px">
                                <a-select-option
                                    v-for="item in planDatas"
                                    :key="item.id"
                                    :value='item.id'>
                                    {{item.planName}}
                                </a-select-option>
                            </a-select>
                        </a-form-item>
                    </div>
                    <div style="display: inline-block">
                        <span style="line-height:40px;margin-right:5px">种植批次：</span>
                        <a-form-item style="display:inline-block">
                            <a-select
                                @search='searchBatch'
                                @focus='focusSelect'
                                @inputKeydown='getNewBatch'
                                :filterOption="false"
                                :showSearch='true'
                                :notFoundContent="fetching ? undefined : '无匹配数据'"
                                placeholder="请先选择种植批次"
                                v-decorator="['batchId']"
                                style="width: 200px">
                                    <a-spin v-if="fetching" slot="notFoundContent" size="small"/>
                                    <a-select-option 
                                        v-for="item in batchDatas"
                                        :key="item.id"
                                        :value='item.id'>
                                        {{item.batchName}}
                                    </a-select-option>
                            </a-select>
                        </a-form-item>
                    </div>
                </a-form>
            </div>
        </div>
        <div style="margin: 0 0 16px 0;">
            <a-radio-group :value='getYear' @change="getCurYear" buttonStyle="solid">
                <a-radio-button
                    v-for="(item,key) in yearDatas"
                    :key="key"
                    :value='item'>
                    {{item}}
                </a-radio-button>
            </a-radio-group>
        </div>
        <div style="width: 100%">
            <a-table
            :columns="prepareColumns"
            :dataSource="prepareDatas"
            :pagination="pagination"
            :loading="loading"
            rowKey="id"
            bordered
            @change="changeTable"
            style="max-width: 100%"
            >
                <span slot="time" slot-scope="text, record">
                    {{record.startTime}}至{{record.endTime}}
                </span>
            </a-table>
        </div>
    </div>
</template>

<script>
import {getAllBatch, getBatchYear,getPerpareList,exportMessage, getPlantingAll} from '@/api/permissonApi'
export default {
    name: 'prepare',
    data() {
        return {
            fetching: false,
            curValue: '',
            timer: '',
            planDatas: [],
            batchDatas: [],
            prepareDatas: [],
            pageSize: null,
            pageNo: null,
            downloadUrl: '',
            prepareColumns: [
                {
                    title: '农事项目',
                    dataIndex: 'farmingItem.farmingName',
                    key: 'farmingItem.farmingName'
                },
                {
                    title: '物资名称',
                    dataIndex: 'materialName',
                    key: 'materialName'
                },
                {
                    title: '数量',
                    dataIndex: 'num',
                    key: 'num'
                },
                {
                    title: '单位',
                    dataIndex: 'company',
                    key: 'company'
                },
                {
                    title: '最少人数',
                    dataIndex: 'minPerson',
                    key: 'minPerson'
                },
                {
                    title: '预算费用',
                    dataIndex: 'budgetCosts',
                    key: 'budgetCosts'
                },
                {
                    title: '农事周期',
                    dataIndex: 'time',
                    key: 'time',
                    scopedSlots: { customRender: "time" }
                },
                {
                    title: '到位日期',
                    dataIndex: 'inplaceTime',
                    key: 'inplaceTime'
                },
            ],
            pagination: {
                pageSizeOptions: ["10", "20", "50"],
                showTotal: (total, range) => {
                    return range[0] + "-" + range[1] + " 共" + total + "条";
                },
                showQuickJumper: true,
                showSizeChanger: true,
            },
            loading: false,
            yearDatas: ['全部'],
            curBatchId: '',
            getYear: '',
            form: this.$form.createForm(this),
        }
    },
    created() {
        this._loadData()
        getPlantingAll().then(res => {
            if (res.success) {
                this.planDatas = res.result
            }
        })
    },
    methods: {
        focusSelect() {
            this._loadData()
        },
        searchBatch(value) {
            this.curValue = value
        },
        getNewBatch() {
            this.batchDatas = []
            this.fetching = true
            clearTimeout(this.timer)
            this.timer = setTimeout(() => {
                let params = this.form.getFieldsValue(['planId'])
                params.batchName = this.curValue
                getAllBatch(params).then(res => {
                    this.fetching = false
                    if (res.success) {
                        this.batchDatas = res.result
                    }
                })
            }, 800)
        },
        _loadData() {
            let params = this.form.getFieldsValue(['planId'])
            getAllBatch(params).then(res => {
                if (res.success) {
                    this.batchDatas = res.result
                }
            })
        },
        exportMessages() {
            if (this.curBatchId && this.getYear) {
                if (this.prepareDatas.length > 0) {
                    let year = this.getYear
                    if (this.getYear === '全部') {
                        year = null
                    }
                    exportMessage({
                        batchId: this.curBatchId,
                        year: year,
                    }).then(res => {
                        let a = document.createElement('a')
                        let y = year === null ? '' : '&year=' +  year
                        a.href = '/api2/prepareItem/export?batchId=' + this.curBatchId + y
                        var evt = document.createEvent("MouseEvents");  
                        evt.initEvent("click",true,true);  
                        a.dispatchEvent(evt);
                    })
                } else {
                    this.$message.warn('暂无数据导出')
                }
            } else {
                this.$message.warn('请先选择种植批次')
            }
        },
        getCurYear(e) {
            this.getYear = e.target.value
            this.getList()
        },
        getList() {
            if (this.curBatchId) {
                let year = this.getYear
                if (this.getYear === '全部') {
                    year = null
                }
                this.loading = true
                getPerpareList({
                    batchId:this.curBatchId,
                    year: year,
                    pageNo: this.pageNo ? this.pageNo : 1,
                    pageSize: this.pageSize ? this.pageSize : 10
                }).then(res => {
                    if (res.success) {
                        this.prepareDatas = res.result.list
                        this.$set(this.pagination, 'total', res.result.total)
                        this.$set(this.pagination, 'pageSize', res.result.pageSize)
                        this.$set(this.pagination, 'current', res.result.pageNum)
                    }
                    this.loading = false
                })
            } else {
                this.$message.warn('请先选择种植批次')
            }
        },
        changeTable(page) {
            if (!this.curBatchId) {
                return this.$message.warn('请先选择种植批次')
            }
            this.loading = true
            this.pageSize = page.pageSize
            this.pageNo = page.current
            let info = this.form.getFieldsValue()
            this.curBatchId = info.batchId
            this.getList()
        },
        selectBatch(value) {
            this.form.resetFields(['batchId'])
            getAllBatch({
                planId: value
            }).then(res => {
                if (res.success) {
                    this.batchDatas = res.result
                }
            })
        },
        handleSearch() {
            const userinfo = this.form.getFieldsValue();
            this.yearDatas = ['全部']
            this.getYear = ''
            if (userinfo.batchId) {
                getBatchYear({
                    batchId: userinfo.batchId,
                }).then(res => {
                    if (res.success) {
                        var len = res.result[1] - res.result[0]
                        this.curBatchId = userinfo.batchId
                        this.getYear = '全部'
                        this.getList()
                        if (len > 1) {
                            this.yearDatas.push(res.result[0])
                            for (let i = 1; i < len; i++) {
                                res.result[i] = res.result[i - 1] + 1
                                this.yearDatas.push(res.result[i])
                            }
                        } else {
                            this.yearDatas = this.yearDatas.concat(res.result)
                        }
                    }
                })
            } else {
                this.$message.warn('请先选择种植批次')
            }
        },
        handleReset() {
            this.form.resetFields()
            this.yearDatas = ['全部']
            this.prepareDatas = []
            this.getYear = ''
            this.curBatchId = ''
            this._loadData()
        }
    }
}
</script>

<style lang='stylus' scoped>
    .prepare
        .header-wrapper
            overflow hidden
        .form-wrapper
            float left
            width 700px
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
</style>
