<template>
    <div style="background:white;padding:10px 0 10px 0;">
        <div style="margin:0 1% 0 0; overflow:hidden">
            <div>
                <div class="button">
                    <i-button class="review-btn btn" @click="exportMessages">
                        <Icon type="md-download" class="icon"/>
                        导出
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
                <div class="select">
                    <a-form
                        :form="form"
                        @submit="handleSearch" >
                        <div style="float:left;width:270px;height:50px;margin-bottom:10px;">
                            <span style="line-height:40px;margin-right:5px">批次类型：</span>
                            <a-form-item style="display:inline-block">
                                <a-select
                                v-decorator="['type']"
                                style="width: 180px">
                                    <a-select-option 
                                        v-for="item in typeData"
                                        :key="item.value"
                                        :value='item.code'>
                                        {{item.displayName}}
                                    </a-select-option>
                                </a-select>
                            </a-form-item>
                        </div>
                        <div style="float:left;width:270px;height:50px;margin-bottom:10px;">
                            <a-form-item style="display:inline-block">
                                <a-input
                                    placeholder="请输入任意字符"
                                    addonBefore='批次编码'
                                    v-decorator="['batchCode']">
                                </a-input>
                            </a-form-item>
                        </div>
                        <div style="float:left;width:270px;height:50px;margin-bottom:10px;">
                            <a-form-item style="display:inline-block">
                                <a-input
                                    placeholder="请输入任意字符"
                                    addonBefore='追溯码	'
                                    v-decorator="['retroCode']">
                                </a-input>
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
                添加追溯
            </a-button>
        </div>
        <div style="width: 100%">
            <a-table
            :columns="retrocodingColumns"
            :dataSource="retrocodingDatas"
            :pagination="pagination"
            :loading="loading"
            rowKey="id"
            bordered
            @change="changeTable"
            style="max-width: 100%"
            >
                <span slot="netWeight" slot-scope="text, record">
                    <span style="margin-right : 5px">
                        {{record.retroCodeInfo.netWeight}}{{record.retroCodeInfo.unit.displayName}}
                    </span>
                </span>
                <span slot="batchCode" slot-scope="text, record">
                    <span style="margin-right : 5px">
                        {{record.retroCodeInfo.type.displayName === '初加工' ? record.retroCodeInfo.initialProBatch.initialProcessingCode : record.retroCodeInfo.recoveryBatch.recoveryCode}}
                    </span>
                </span>
                <span slot="action" slot-scope="text, record">
                    <a @click="showQr(record)">查看二维码</a>
                </span>
            </a-table>
        </div>
        <addRetrocoding ref="addRetrocoding" :typeDatas='typeData.slice(1, typeData.length)'></addRetrocoding>
        <batch-save-qr-modal ref="batchSaveQrModal"></batch-save-qr-modal>
    </div>
</template>
<script>
import {getRetrocoding, getRetroCodingType, exportRetrocoding} from '@/api/permissonApi'
import {getSourceUrl} from '@/api/allapi'
import addRetrocoding from "./modules/addRetrocoding"
import BatchSaveQrModal from '../patch/modules/BatchSaveQrModal'

export default {
    name: 'retrocoding',
    components: {
        addRetrocoding,
        BatchSaveQrModal
    },
    data() {
        return {
            form: this.$form.createForm(this),
            typeData: [{
                code: '',
                value: '0',
                displayName: '全部'
            }],
            retrocodingDatas: [],
            retrocodingColumns: [
                {
                    title: '追溯码',
                    dataIndex: 'retroCode',
                    key: 'retroCode'
                },
                {
                    title: '品种类型',
                    dataIndex: 'retroCodeInfo.crop.cropName',
                    key: 'retroCodeInfo.crop.cropName'
                },
                {
                    title: '批次编码',
                    dataIndex: 'netWeight',
                    scopedSlots: { customRender: "netWeight" },
                    key: 'netWeight'
                },
                {
                    title: '批次类型',
                    dataIndex: 'retroCodeInfo.type.displayName',
                    key: 'retroCodeInfo.type.displayName'
                },
                {
                    title: '批次编码',
                    dataIndex: 'batchCode',
                    scopedSlots: { customRender: "batchCode" },
                    key: 'batchCode'
                },
                {
                    title: '作物规格',
                    dataIndex: 'retroCodeInfo.specifications',
                    key: 'retroCodeInfo.specifications'
                },
                {
                    title: '产地',
                    dataIndex: 'retroCodeInfo.provenance',
                    key: 'retroCodeInfo.provenance'
                },
                {
                    title: '质检员',
                    dataIndex: 'retroCodeInfo.qc',
                    key: 'retroCodeInfo.qc'
                },
                {
                    title: '注意事项',
                    dataIndex: 'retroCodeInfo.remarks',
                    key: 'retroCodeInfo.remarks',
                    width: '15%'
                },
                {
                    title: '打码时间',
                    dataIndex: 'codingTime',
                    key: 'codingTime'
                },
                {
                    title: '操作',
                    dataIndex: "action",
                    key: "action",
                    scopedSlots: { customRender: "action" },
                    align: "center"
                }
            ],
            pageSize: null,
            pageNo: null,
            loading: false,
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
    mounted() {
        this._loadData()
        getRetroCodingType().then(res => {
            if (res.success) {
                this.typeData = this.typeData.concat(res.result)
            }
        })
    },
    methods: {
        _loadData() {
            let params = this.form.getFieldsValue()
            params.pageNo = this.pageNo
            params.pageSize = this.pageSize
            this.loading = true
            if (params.type === '') {
                delete params.type
            }
            if (params.batchCode === '') {
                delete params.batchCode
            }
            if (params.retroCode === '') {
                delete params.retroCode
            }
            getRetrocoding(params).then(res => {
                if (res.success) {
                    this.retrocodingDatas = res.result.list
                    this.$set(this.pagination, 'total', res.result.total)
                    this.$set(this.pagination, 'pageSize', res.result.pageSize)
                    this.$set(this.pagination, 'current', res.result.pageNum)
                }
                this.loading = false
            })
        },
        getShowUrl(record){
            if (window.location.hostname.indexOf('192.168') !== -1) {
                return 'http://' + window.location.hostname + ':8080' + '/#/index?retroCode=' + record.retroCode
            } else {
                getSourceUrl().then(res => {
                    if (res.success) {
                        var url = res.result.constant + "?retroCode=" + record.retroCode;
                        return url
                    }
                })
            }
        },
        exportMessages() {
            var params = this.form.getFieldsValue()
            var first = 0
            if (params.type === '') {
                delete params.type
            }
            if (params.batchCode === '') {
                delete params.batchCode
            }
            if (params.retroCode === '') {
                delete params.retroCode
            }
            let api = '/api2/retroCoding/export'
            for (var prop in params) {
                if (params[prop]) {
                    if (first == 0) {
                        api += '?' + prop + '=' + params[prop]
                        first++
                    } else {
                        api += '&' + prop + '=' + params[prop]
                    }
                }
            }
            exportRetrocoding(params).then(res => {
                let a = document.createElement('a')
                a.href = api
                var evt = document.createEvent("MouseEvents");  
                evt.initEvent("click",true,true);  
                a.dispatchEvent(evt); 
            })
        },
        handleSearch() {
            this._loadData()
        },
        handleReset() {
            this.form.resetFields()
            this._loadData()
        },
        add() {
            this.$refs.addRetrocoding.open()
        },
        showQr(record) {
            if (window.location.hostname.indexOf('192.168') !== -1) {
                let url = 'http://' + window.location.hostname + ':8080' + '/#/index?retroCode=' + record.retroCode
                this.$refs.batchSaveQrModal.show(url)
            } else {
                getSourceUrl().then(res => {
                    if (res.success) {
                        let url = res.result.constant + "?retroCode=" + record.retroCode;
                        this.$refs.batchSaveQrModal.show(url)
                    }
                })
            }
        },
        changeTable(page) {
            this.pageSize = page.pageSize
            this.pageNo = page.current
            this._loadData()
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