<template>
    <div class="data-lose">
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
                        <div style="float:left;width:250px;height:50px;margin-bottom:10px;">
                            <span style="line-height:40px;margin-right:5px">设备：</span>
                            <a-form-item style="display:inline-block">
                                <a-select
                                v-decorator="['equipmentId']"
                                style="width: 180px">
                                    <a-select-option
                                        v-for="item in deviceDatas"
                                        :key="item.id"
                                        :value='item.id'>
                                        {{item.equipmentName}}
                                    </a-select-option>
                                </a-select>
                            </a-form-item>
                        </div>
                        <div style="float:left;width:500px;height:50px;margin-bottom:10px;">
                            <span style="line-height:40px;margin-right:5px">时间：</span>
                            <a-form-item style="display:inline-block">
                                <a-date-picker v-decorator="['startTime']" format='YYYY/MM/DD' @change="changeStartTime" :disabledDate='startDisable' />
                            </a-form-item>
                            <span style="line-height:40px;margin:0 15px">至</span>
                            <a-form-item style="display:inline-block">
                                <a-date-picker v-decorator="['endTime']" format='YYYY/MM/DD' @change="changeEndTime" :disabledDate='endDisable' />
                            </a-form-item>
                        </div>
                    </a-form>
                </div>
            </div>
        </div>
        <div>
            <a-table
            :columns="planColumns"
            :dataSource="dataSource"
            :pagination="pagination"
            :loading="loading"
            :rowKey="record => record.id"
            bordered
            @change="changeTable"
            >
                <span slot="loseName" slot-scope="text, record">
                    <a-tag color='red' v-for="(item,index) in record.content" :key="index">{{item}}</a-tag>
                </span>
            </a-table>
        </div>
    </div>
</template>
<script>
import {
    getEquipmentIdAndNameList,
    loseData
} from '@/api/ddwbApi'

const arr = [
                ["airTemperature", "大气温度"],
                ["airHumidity", "大气湿度"],
                ["airPressure", "大气压力"],
                ["windSpeed", "风速"],
                ["windDirection", "风向"],
                ["rainfall", "雨量"],
                ["illIntensity", "光照强度"],
                ["co2Value", "二氧化碳浓度"],
                ["pm25Value", "PM2.5浓度"],
                ["pm10Value", "PM10浓度"],
                ["soilTemperature", "土壤温度"],
                ["soilHumidity", "土壤湿度"],
                ["soilPh", "土壤PH值"],
                ["soilEc", "土壤EC值"],
                ["soilS", "土壤盐分"]
            ]
const dataMap = new Map(arr)

export default {
    name: 'datLose',
    data() {
        return {
            form: this.$form.createForm(this),
            deviceDatas: [{
                id: -1,
                equipmentName: '全部'
            }],
            dataSource: [],
            loading: false,
            startTime: undefined,
            endTime: undefined,
            pageNo: null,
            pageSize: null,
            planColumns: [
                {
                    title: '基地名称',
                    dataIndex: 'baseName',
                    key: 'baseName',
                    align: 'center'
                },
                {
                    title: '设备名称',
                    dataIndex: 'equipmentName',
                    key: 'equipmentName',
                    align: 'center'
                },
                {
                    title: '缺失数据名称',
                    dataIndex: 'loseName',
                    key: 'loseName',
                    scopedSlots: { customRender: "loseName" },
                    align: 'center'
                },
                {
                    title: '异常时间',
                    dataIndex: "monitorTime",
                    key: "monitorTime",
                    align: 'center'
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
        getEquipmentIdAndNameList().then(res => {
            if (res.success) {
                this.deviceDatas = this.deviceDatas.concat(res.result)
            }
        })
        this._loadData()
    },
    methods: {
        _loadData() {
            let params = this.form.getFieldsValue()
            params.startTime = this.startTime
            params.endTime = this.endTime
            params.pageNo = this.pageNo
            params.pageSize = this.pageSize
            if (params.equipmentId == -1) {
                delete params.equipmentId
            }
            if (!params.startTime) {
                delete params.startTime
            }
            if (!params.endTime) {
                delete params.endTime
            }
            this.loading = true
            loseData(params).then(res => {
                if (res.success) {
                    res.result.list.forEach(item => {
                        item.content = item.content.split(', ')
                        if (item.content.length > 0) {
                            item.content = item.content.map(ele => {
                                return dataMap.get(ele)
                            })
                        }
                    })
                    this.dataSource = res.result.list
                    this.$set(this.pagination, 'total', res.result.total)
                    this.$set(this.pagination, 'pageSize', res.result.pageSize)
                    this.$set(this.pagination, 'current', res.result.pageNum)
                }
                this.loading = false
            })
        },
        handleSearch() {
            this._loadData()
        },
        handleReset() {
            this.startTime = undefined
            this.endTime = undefined
            this.form.resetFields()
            this._loadData()
        },
        changeTable(page) {
            this.pageNo = page.current
            this.pageSize = page.pageSize
            this._loadData()
        },
        startDisable(currentDate) {
            const endTime = this.form.getFieldValue('endTime')
            if (!endTime || !currentDate) return
            return endTime.valueOf() < currentDate.valueOf() - 86400000
        },
        endDisable(currentDate) {
            const startTime = this.form.getFieldValue('startTime')
            if (!startTime || !currentDate) return
            return startTime.valueOf() > currentDate.valueOf()
        },
        changeStartTime(data, str) {
            this.startTime = str
        },
        changeEndTime(data, str) {
            this.endTime = str
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
    .slot-div
        height 35px
        line-height 35px
        width 100%
        border-bottom 1px dashed #d7d7d7
        &.red
            color red
    .slot-div:last-child
        border-bottom 0px
</style>