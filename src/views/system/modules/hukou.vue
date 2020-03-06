<template>
    <a-modal
      :title="title"
      v-model="visible"
      @ok="handleOk"
      style="top:5%;height: 90%; max-height:90%;overflow-y:hidden"
      cancelText="取消"
      okText="确定"
      :maskClosable="false"
      class="family-table"
    >
        <div style="margin: 0 0 16px 0;">
            <a-button
                type="primary"
                icon="plus"
                @click="openHukou"
            >
                添加家庭成员
            </a-button>
        </div>
        <a-table
            :columns="familyColumns"
            :dataSource="familyDatas"
            :loading="loading"
            :pagination='false'
            bordered
        >
            <template v-for="col in ['memberName', 'relation', 'sex.displayName', 'identifyCode', 'occupation', 'politicCountenance']"
                :slot="col" slot-scope="text, record">
                <div :key="col">
                    <a-input
                        v-if="record.editable && col !== 'relation' && col !== 'identifyCode'"
                        style="margin: -5px 0"
                        :value="text"
                        @change="e => handleChange(e.target.value, record.id, col)"
                    />
                    <a-input
                        maxlength='18'
                        v-else-if="record.editable && col === 'identifyCode'"
                        onkeyup="this.value=this.value.replace(/\D/g,'')"
                        style="margin: -5px 0"
                        :value="text"
                        @change="e => handleChange(e.target.value, record.id, col)"
                    />
                    <a-select
                        v-else-if="record.editable && col === 'relation'"
                        style="width:100%"
                        :defaultValue='record.relation'
                        mode='combobox'
                        @change="e => test(e, record.id, col)">
                        <a-select-option
                            v-for="(item,index) in relationDatas"
                            :key="index"
                            :value='item.value'>
                            {{item.value}}
                        </a-select-option>
                    </a-select>
                    <template v-else>{{text}}</template>
                </div>
            </template>
            <template slot='action' slot-scope="text,record">
                <div>
                    <span v-if="record.editable">
                        <a @click="saveFamily(record)" style="margin-right: 20px">保存</a>
                        <a-popconfirm title='确定要删除么?' @confirm="deleteFamily(record)">
                            <a>删除</a>
                        </a-popconfirm>
                    </span>
                    <span v-else>
                        <a @click="edit(record)">操作</a>
                    </span>
                </div>
            </template>
        </a-table>
        <hukouMessage @trigger='loadData' v-if="relationDatas.length > 0" ref="hukouMessage" :relation='relationDatas'></hukouMessage>
    </a-modal>
</template>
<script>
import {getFamilyMenber, updateFamilyMenber, deleteFamilyMenber} from '@/api/userApi'
import hukouMessage from './hukouMessage'
export default {
    components: {
        hukouMessage
    },
    data() {
        return {
            visible: false,
            title: '查看信息',
            record: {},
            uid: '',
            loading: false,
            familyDatas: [],
            relationDatas: [
                {
                    value: '父亲'
                },
                {
                    value: '母亲'
                },
                {
                    value: '儿子'
                },
                {
                    value: '女儿'
                },
                {
                    value: '配偶'
                }
            ],
            curUid: '',
            familyLock: false,
            familyColumns: [
                {
                    title: '家庭成员名称',
                    dataIndex: 'memberName',
                    key: 'memberName',
                    width: '16%',
                    scopedSlots: { customRender: "memberName" },
                },
                {
                    title: '关系',
                    dataIndex: 'relation',
                    key: 'relation',
                    width: '10%',
                    scopedSlots: { customRender: "relation" },
                },
                {
                    title: '性别',
                    dataIndex: 'sex.displayName',
                    key: 'sex.displayName',
                    width: '10%',
                    scopedSlots: { customRender: "sex.displayName" },
                },
                {
                    title: '身份证',
                    dataIndex: 'identifyCode',
                    key: 'identifyCode',
                    scopedSlots: { customRender: "identifyCode" },
                },
                {
                    title: '职业',
                    dataIndex: 'occupation',
                    key: 'occupation',
                    width: '10%',
                    scopedSlots: { customRender: "occupation" },
                },
                {
                    title: '政治面貌',
                    dataIndex: 'politicCountenance',
                    key: 'politicCountenance',
                    width: '13%',
                    scopedSlots: { customRender: "politicCountenance" },
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
        handleOk() {
            this.visible = false
        },
        test(value, key, column) {
            this.familyLock = true
            const newData = [...this.familyDatas]
            const target = newData.filter(item => key === item.id)[0]
            if (target) {
                target.relation = value
                this.familyDatas = newData
            }
        },
        edit (record) {
            this.$set(record, 'editable', true)
        },
        saveFamily (record) {
            let reg = /(\d{17}?(\d|X))|(^\d{15}$)/
            if (record.identifyCode && !reg.test(record.identifyCode)) {
                this.$message.warn('身份证不正确')
                return
            }
            if (this.familyLock) {
                let params = {
                    id: record.id,
                    relation: record.relation,
                    sex: record.sex.code,
                    memberName: record.memberName,
                    identifyCode: record.identifyCode,
                    occupation: record.occupation,
                    politicCountenance: record.politicCountenance
                }
                updateFamilyMenber(params).then(res => {
                    this.$message.info(res.message)
                    this.familyLock = false
                    if (res.success) {
                        this.loading = true
                        getFamilyMenber({
                            uid: this.curUid
                        }).then(res => {
                            if (res.success === true) {
                                this.familyDatas = res.result
                            } else {
                                this.$message.info(res.message)
                            }
                            this.loading = false
                        })
                    }
                })
            } else {
                record.editable = false
            }
        },
        deleteFamily (record) {
            if (record.id) {
                deleteFamilyMenber({id:record.id}).then(res => {
                    this.$message.info(res.message)
                    if (res.success) {
                         if (res.success) {
                            this.loading = true
                            getFamilyMenber({
                                uid: this.curUid
                            }).then(res => {
                                if (res.success === true) {
                                    this.familyDatas = res.result
                                } else {
                                    this.$message.info(res.message)
                                }
                                this.loading = false
                            })
                        }
                    } else {
                        record.editable = false
                    }
                })
            }
        },
        handleChange(value, key, column) {
            this.familyLock = true
            const newData = [...this.familyDatas]
            const target = newData.filter(item => key === item.id)[0]
            if (target) {
                target[column] = value
                this.familyDatas = newData
            }
        },
        add(record) {
            this.visible = true
            if (record.uid) {
                this.curUid = record.uid
            }
            this.loadData(record)
        },
        loadData(record) {
            this.loading = true
            this.$nextTick(() => {
                getFamilyMenber({
                    uid: this.curUid
                }).then(res => {
                    if (res.success === true) {
                        this.familyDatas = res.result
                    } else {
                        this.$message.info(res.message)
                    }
                    this.loading = false
                })
            })
        },
        openHukou() {
            this.$refs.hukouMessage.visible = true
            this.$refs.hukouMessage.curUid = this.curUid
            this.$refs.hukouMessage.form.resetFields()
        }
    }
}
</script>

<style lang="stylus">
    .family-table
        width: 1000px !important
</style>
