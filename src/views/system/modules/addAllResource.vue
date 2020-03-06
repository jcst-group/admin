<template>
    <a-modal
        title="物料/设备信息"
        v-model="visible"
        style="top:10%;height: 90%"
        :maskClosable="false"
        @cancel='handleCancel'
        :closable='false'
        :keyboard='false'
        class="all-resource">
        <template slot='footer'>
            <a-button @click="handleCancel">关闭</a-button>
        </template>
        <a-table
            :columns="materialColumns"
            :dataSource="materialDatas"
            :pagination='false'
            rowKey="id"
            bordered
            :loading='materialLoading'
        >
            <template v-for="col in ['materialName', 'company', 'unitMu', 'unitPrice', 'pictureInfo', 'prepareDay']" 
                :slot="col" slot-scope="text, record">
                <div :key="col">
                    <a-input
                        v-if="record.editable && (col === 'materialName' || col === 'company')"
                        style="margin: -5px 0"
                        :value="text"
                        @change="e => handleMaterialChange(e.target.value, record.id, col)"
                    />
                    <a-input
                        v-else-if="record.editable && (col === 'unitMu' || col === 'unitPrice' || col === 'prepareDay')"  
                        style="margin: -5px 0;width:100%"
                        :value="text"
                        onkeyup="this.value=this.value.replace(/[^(\d|.)]/g,'')"
                        @change="e => handleMaterialChange(e.target.value, record.id, col)"  
                    />
                    <div class="upload-wrapper" v-else-if="col === 'pictureInfo'" @click="getRecord(record)">
                        <a-icon style="cursor:pointer;color:#2d8cf0" type="file" @click="editMessage(record)"/>
                    </div>
                    <template v-else>{{text}}</template>
                </div>
            </template>
            <span slot='action' slot-scope="text,record">
                <div v-if="!record.editable">
                    <a @click="changeLock(record)">编辑</a>
                </div>
                <div v-else>
                    <a @click="saveMaterials(record)" style="margin-right: 20px">保存</a>
                    <a-popconfirm title='确定要删除么?' @confirm="deleteMaterials(record)">
                        <a>删除</a>
                    </a-popconfirm>
                </div>
            </span>
        </a-table>
        <a-table
            :columns="deviceColumns"
            :dataSource="deviceDatas"
            :pagination='false'
            rowKey="id"
            bordered
            style="margin:20px 0"
            :loading='deviceLoading'>
            <template v-for="col in ['deviceName', 'company', 'unitMu', 'rent', 'prepareDay']" 
                :slot="col" slot-scope="text, record">
                <div :key="col">
                    <a-input
                        v-if="record.editable && (col === 'deviceName' || col === 'company')"
                        style="margin: -5px 0"
                        :value="text"
                        @change="e => handleChange(e.target.value, record.id, col)"
                    />
                    <a-input
                        v-else-if='record.editable'
                        style="margin: -5px 0;width:100%"
                        :value="text"
                        onkeyup="this.value=this.value.replace(/[^(\d|.)]/g,'')"
                        @change="e => handleChange(e.target.value, record.id, col)"  
                    />
                    <template v-else>{{text}}</template>
                </div>
            </template>
            <span slot='action' slot-scope="text,record">
                <div v-if="!record.editable">
                    <a @click="changeLock(record)">编辑</a>
                </div>
                <div v-else>
                    <a @click="saveDevices(record)" style="margin-right: 20px">保存</a>
                    <a-popconfirm title='确定要删除么?' @confirm="deleteDevices(record)">
                        <a>删除</a>
                    </a-popconfirm>
                </div>
            </span>
        </a-table>
        <a-table
            :columns="personnelColumns"
            :dataSource="personnelDatas"
            :pagination='false'
            rowKey="id"
            bordered
            :loading='personnelLoading'>
            <template v-for="col in ['personnelName', 'unitMu', 'laborCosts', 'prepareDay']" 
                :slot="col" slot-scope="text, record">
                <div :key="col">
                    <a-input
                        v-if="record.editable && col === 'personnelName'"
                        style="margin: -5px 0"
                        :value="text"
                        @change="e => handlePersonnelChange(e.target.value, record.id, col)"
                    />
                    <a-input
                        v-else-if='record.editable'
                        style="margin: -5px 0;width:100%"
                        :value="text"
                        onkeyup="this.value=this.value.replace(/[^(\d|.)]/g,'')"
                        @change="e => handlePersonnelChange(e.target.value, record.id, col)"  
                    />
                    <template v-else>{{text}}</template>
                </div>
            </template>
            <span slot='action' slot-scope="text,record">
                <div v-if="!record.editable">
                    <a @click="changeLock(record)">编辑</a>
                </div>
                <div v-else>
                    <a @click="savePersonnels(record)" style="margin-right: 20px">保存</a>
                    <a-popconfirm title='确定要删除么?' @confirm="deletePersonnels(record)">
                        <a>删除</a>
                    </a-popconfirm>
                </div>
            </span>
        </a-table>
        <uploadImg @saveImg='saveImg' ref="uploadImg"></uploadImg>
    </a-modal>
</template>
<script>
import {
    getResourceUnit,
    getTemporaryUnit,
    getAllDevice,
    addDevice,
    updateDevice,
    deleteDevice,

    getAllMaterial,
    addMaterial,
    updateMaterial,
    deleteMaterial,

    getAllPersonnel,
    addPersonnel,
    updatePersonnel,
    deletePersonnel,
} from "@/api/permissonApi"
import uploadImg from './uploadImg'
export default {
    components: {
        uploadImg
    },
    props: {
        parentRecord: {
            type: Object,
            default() {
                return {}
            }
        },
        parentName: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            materialVisible: false,
            visible: false,
            deviceDatas: [],
            materialDatas: [],
            personnelDatas: [],
            deviceLoading: false,
            materialLoading: false,
            personnelLoading: false,
            loading: false,
            imgLock: true,
            record: {},
            materialIndex: '',
            materialsrc: '',
            materialImageUrl: '',
            deviceColumns: [
                {
                    title: () => {
                        return (
                            <div>
                                <span style='color:red'>*</span>设备信息
                                <a-icon
                                    type="plus"
                                    style='color:#2d8cf0;cursor:pointer;margin-left:10px'
                                    onclick={this.addDevices}/>
                            </div>
                        )
                    },
                    dataIndex: 'deviceName',
                    key: 'deviceName',
                    scopedSlots: {customRender: 'deviceName'}
                },
                {
                    title: () => {
                        return (
                            <div>
                                <span style='color:red'>*</span>单位
                            </div>
                        )
                    },
                    dataIndex: 'company',
                    key: 'company',
                    scopedSlots: {customRender: 'company'}
                },
                {
                    title: () => {
                        if (this.allUnits) {
                            return (
                                <div>
                                    <span style='color:red'>*</span>{this.allUnits.deviceUnit}
                                </div>
                            )
                        } else {
                            return (
                                <div>
                                    <span style='color:red'>*</span>单位/亩
                                </div>
                            )
                        }
                    },
                    dataIndex: 'unitMu',
                    key: 'unitMu',
                    scopedSlots: {customRender: 'unitMu'}
                },
                {
                    title: () => {
                        return (
                            <div>
                                <span style='color:red'>*</span>设备租金（元）
                            </div>
                        )
                    },
                    dataIndex: 'rent',
                    key: 'rent',
                    scopedSlots: {customRender: 'rent'}
                },
                {   
                    title: () => {
                        return (
                            <div>
                                <span style='color:red'>*</span>提前准备天数
                            </div>
                        )
                    },
                    dataIndex: 'prepareDay',
                    key: 'prepareDay',
                    scopedSlots: {customRender: 'prepareDay'}
                },
                // {
                //     title: '检查报告',
                //     dataIndex: 'ff',
                //     key: 'ff'
                // },
                {
                    title: '操作',
                    dataIndex: "action",
                    key: "action",
                    scopedSlots: { customRender: "action" },
                    align: "center",
                    width: '13%'
                }
            ],
            materialColumns: [
                {
                    title: () => {
                        return (
                            <div>
                                <span style='color:red'>*</span>物料信息
                                <a-icon
                                    type="plus"
                                    style='color:#2d8cf0;cursor:pointer;margin-left:10px'
                                    onclick={this.addMaterials}/>
                            </div>
                        )
                    },
                    dataIndex: 'materialName',
                    key: 'materialName',
                    scopedSlots: {customRender: 'materialName'},
                    width: '15%'
                },
                {
                    title: () => {
                        return (
                            <div>
                                <span style='color:red'>*</span>单位
                            </div>
                        )
                    },
                    dataIndex: 'company',
                    key: 'company',
                    scopedSlots: {customRender: 'company'},
                    width: '15%'
                },
                {
                    title: () => {
                        if (this.allUnits) {
                            return (
                                <div>
                                    <span style='color:red'>*</span>{this.allUnits.materialUnit}
                                </div>
                            )
                        } else {
                            return (
                                <div>
                                    <span style='color:red'>*</span>单位/亩
                                </div>
                            )
                        }
                    },
                    dataIndex: 'unitMu',
                    key: 'unitMu',
                    scopedSlots: {customRender: 'unitMu'}
                },
                {
                    title: () => {
                        return (
                            <div>
                                <span style='color:red'>*</span>物料单价（元）
                            </div>
                        )
                    },
                    dataIndex: 'unitPrice',
                    key: 'unitPrice',
                    scopedSlots: {customRender: 'unitPrice'}
                },
                {   
                    title: () => {
                        return (
                            <div>
                                <span style='color:red'>*</span>提前准备天数
                            </div>
                        )
                    },
                    dataIndex: 'prepareDay',
                    key: 'prepareDay',
                    scopedSlots: {customRender: 'prepareDay'}
                },
                {
                    title: '检查报告',
                    dataIndex: 'pictureInfo',
                    key: 'pictureInfo',
                    scopedSlots: {customRender: 'pictureInfo'}
                },
                {
                    title: '操作',
                    dataIndex: "action",
                    key: "action",
                    scopedSlots: { customRender: "action" },
                    align: "center",
                    width: '13%'
                }
            ],
            personnelColumns: [
                {
                    title: () => {
                        return (
                            <div>
                                <span style='color:red'>*</span>人员信息
                                <a-icon
                                    type="plus"
                                    style='color:#2d8cf0;cursor:pointer;margin-left:10px'
                                    onclick={this.addPersonnels}/>
                            </div>
                        )
                    },
                    dataIndex: 'personnelName',
                    key: 'personnelName',
                    scopedSlots: {customRender: 'personnelName'}
                },
                {
                    title: () => {
                        if (this.allUnits) {
                            return (
                                <div>
                                    <span style='color:red'>*</span>{this.allUnits.personnelUnit}
                                </div>
                            )
                        } else {
                            return (
                                <div>
                                    <span style='color:red'>*</span>人天/亩
                                </div>
                            )
                        }
                    },
                    dataIndex: 'unitMu',
                    key: 'unitMu',
                    scopedSlots: {customRender: 'unitMu'}
                },
                {
                    title: () => {
                        return (
                            <div>
                                <span style='color:red'>*</span>人工费用（元/人天）
                            </div>
                        )
                    },
                    dataIndex: 'laborCosts',
                    key: 'laborCosts',
                    scopedSlots: {customRender: 'laborCosts'}
                },
                {   
                    title: () => {
                        return (
                            <div>
                                <span style='color:red'>*</span>提前准备天数
                            </div>
                        )
                    },
                    dataIndex: 'prepareDay',
                    key: 'prepareDay',
                    scopedSlots: {customRender: 'prepareDay'}
                },
                {
                    title: '操作',
                    dataIndex: "action",
                    key: "action",
                    scopedSlots: { customRender: "action" },
                    align: "center",
                    width: '13%'
                }
            ]
        }
    },
    methods: {
        saveImg(record) {
            this.saveMaterials(record)
        },
        getRecord(record) {
            this.materialDatas.forEach((item,index) => {
                if (item.id === record.id) {
                    this.materialIndex = index
                }
            })
        },
        materialPreview(file) {
            this.materialVisible = true
            setTimeout(() => {
                this.materialDatas[this.materialIndex].pictureInfo.pictureUrl = file.url || file.thumbUrl
            }, 10)
        },
        materialRemove(file) {
            return new Promise((resolve) => {
                var that = this
                this.$confirm({
                    title: '确定要删除该图片么',
                    onCancel() {
                        return resolve(false)
                    },
                    onOk() {
                        delpicture({
                            id: file.response ? file.response.result.id : file.uid 
                        }).then(res => {
                            that.$message.info(res.message)
                            if (res.success) {
                                return resolve(true)
                            }
                        })
                    }
                })
            }).then(res => {
                return res
            })
        },
        handleMaterialCancel() {
            this.materialVisible = false
        },
        changeMaterialDatas(record) {
            let imgshowapi = "/api2/pictureInfo/show/"
            getAllMaterial({
                farmingId: record.farmingId ? record.farmingId : record.id
            }).then(res => {
                if (res.success) {
                    this.materialDatas = res.result
                    this.materialDatas.forEach(item => {
                        if (item.pictureInfo && item.pictureInfo.pictureUrl) {
                            item.picture = item.pictureInfo.pictureUrl
                        }
                    })
                }
                this.materialLoading = false
            })
        },
        open(record) {
            this.visible = true
            this.record = record
            this.materialsrc = ''
            this.materialImageUrl = ''
            this.deviceLoading = true
            this.materialLoading = true
            this.personnelLoading = true
            if (this.parentName === 'temporary') {
                getTemporaryUnit({
                    farmingId: record.id
                }).then(res => {
                    if (res.success) {
                        this.allUnits = res.result
                    }
                })
            } else {
                getResourceUnit({
                    farmingId: record.id
                }).then(res => {
                    if (res.success) {
                        this.allUnits = res.result
                    }
                })
            }
            getAllDevice({
                farmingId: record.id
            }).then(res => {
                if (res.success) {
                    this.deviceDatas = res.result
                }
                this.deviceLoading = false
            })
            this.changeMaterialDatas(record)
            getAllPersonnel({
                farmingId: record.id
            }).then(res => {
                if (res.success) {
                    this.personnelDatas = res.result
                }
                this.personnelLoading = false
            })

        },
        editMessage(record) {
            this.$refs.uploadImg.open(record)
        },
        handleCancel() {
            if (this.personnelDatas.length === 0 && (this.deviceDatas.length > 0 || this.materialDatas.length > 0)) {
                this.$message.error('必须填写人员信息')
            } else {
                this.visible = false
            }
            // if (this.materialsrc !== '' && this.materialsrc.id) {
            //     delpicture({
            //         id: this.materialsrc.id
            //     }).then(res => {})
            // }
        },
        handleChange(value, key, column) {
            const newData = [...this.deviceDatas]
            const target = newData.filter(item => key === item.id)[0]
            if (target) {
                target[column] = value
                this.deviceDatas = newData
            }
        },
        handleMaterialChange(value, key, column) {
            const newData = [...this.materialDatas]
            const target = newData.filter(item => key === item.id)[0]
            if (target) {
                target[column] = value
                this.materialDatas = newData
            }
        },
        handlePersonnelChange(value, key, column) {
            const newData = [...this.personnelDatas]
            const target = newData.filter(item => key === item.id)[0]
            if (target) {
                target[column] = value
                this.personnelDatas = newData
            }
        },
        addDevices() {
            this.deviceDatas.push({
                id: this.deviceDatas.length + 1,
                editable: true,
            })
        },
        saveDevices(record) {
            if (record.deviceName && record.company && record.unitMu && record.rent && record.prepareDay) {
                if (record.farmingId) {
                    updateDevice(record).then(res => {
                        this.$message.info(res.message)
                        if (res.success) {
                            this.deviceLoading = true
                            getAllDevice({
                                farmingId: record.farmingId
                            }).then(res => {
                                if (res.success) {
                                    this.$emit('refreshParent', this.parentRecord)
                                    this.deviceDatas = res.result
                                }
                                this.deviceLoading = false
                            })
                        }
                    })
                } else {
                    delete record.id
                    record.farmingId = this.record.id
                    addDevice(record).then(res => {
                        this.$message.info(res.message)
                        if (res.success) {
                            this.deviceLoading = true
                            getAllDevice({
                                farmingId: record.farmingId
                            }).then(res => {
                                if (res.success) {
                                    this.$emit('refreshParent', this.parentRecord)
                                    this.deviceDatas = res.result
                                }
                                this.deviceLoading = false
                            })
                        }
                    })
                }
            } else {
                this.$message.error('请将信息填写完整')
            }
        },
        deleteDevices(record) {
            let key = record.id
            if (record.farmingId === undefined) {
                this.deviceDatas.splice(record.id - 1, 1)
                this.deviceDatas.forEach(item => {
                    if (!item.farmingId && item.id > key) {
                        item.id -= 1
                    }
                })
            } else {
                deleteDevice({
                    id: record.id
                }).then(res => {
                    this.$message.info(res.message)
                    if (res.success) {
                        this.deviceLoading = true
                        getAllDevice({
                            farmingId: record.farmingId
                        }).then(res => {
                            if (res.success) {
                                this.$emit('refreshParent', this.parentRecord)
                                this.deviceDatas = res.result
                            }
                            this.deviceLoading = false
                        })
                    }
                })
            }
        },
        addMaterials() {
            this.materialDatas.push({
                id: this.materialDatas.length + 1 + '',
                editable: true,
                fileList: null
            })
        },
        saveMaterials(record) {
            if (record.materialName && record.company && record.unitMu && record.unitPrice && record.prepareDay) {
                if (record.farmingId) {
                    record.pictureInfo = record.src
                    updateMaterial(record).then(res => {
                        this.$message.info(res.message)
                        if (res.success) {
                            this.materialLoading = true
                            this.changeMaterialDatas(record)
                            this.$emit('refreshParent', this.parentRecord)
                        }
                    })
                } else {
                    delete record.id
                    record.farmingId = this.record.id
                    record.pictureInfo = record.src
                    addMaterial(record).then(res => {
                        this.$message.info(res.message)
                        if (res.success) {
                            this.materialLoading = true
                            this.changeMaterialDatas(record)
                            this.$emit('refreshParent', this.parentRecord)
                        }
                    })
                }
            } else {
                this.$message.error('请将信息填写完整')
            }
        },
        deleteMaterials(record) {
            let key = record.id
            if (record.farmingId === undefined) {
                this.materialDatas.splice(record.id - 1, 1)
                this.materialDatas.forEach(item => {
                    if (!item.farmingId && item.id > key) {
                        item.id -= 1
                    }
                })
            } else {
                deleteMaterial({
                    id: record.id
                }).then(res => {
                    this.$message.info(res.message)
                    if (res.success) {
                        this.$emit('refreshParent', this.parentRecord)
                        this.materialLoading = true
                        this.changeMaterialDatas(record)
                    }
                })
            }
        },
        addPersonnels() {
            this.personnelDatas.push({
                id: this.personnelDatas.length + 1,
                editable: true,
            })
        },
        savePersonnels(record) {
            if (record.personnelName && record.unitMu && record.laborCosts && record.prepareDay) {
                if (record.farmingId) {
                    updatePersonnel(record).then(res => {
                        this.$message.info(res.message)
                        if (res.success) {
                            this.personnelLoading = true
                            getAllPersonnel({
                                farmingId: record.farmingId
                            }).then(res => {
                                if (res.success) {
                                    this.$emit('refreshParent', this.parentRecord)
                                    this.personnelDatas = res.result
                                }
                                this.personnelLoading = false
                            })
                        }
                    })
                } else {
                    delete record.id
                    record.farmingId = this.record.id
                    addPersonnel(record).then(res => {
                        this.$message.info(res.message)
                        if (res.success) {
                            this.personnelLoading = true
                            getAllPersonnel({
                                farmingId: record.farmingId
                            }).then(res => {
                                if (res.success) {
                                    this.$emit('refreshParent', this.parentRecord)
                                    this.personnelDatas = res.result
                                }
                                this.personnelLoading = false
                            })
                        }
                    })
                }
            } else {
                this.$message.error('请将信息填写完整')
            }
        },
        deletePersonnels(record) {
            let key = record.id
            if (record.farmingId === undefined) {
                this.personnelDatas.splice(record.id - 1, 1)
                this.personnelDatas.forEach(item => {
                    if (!item.farmingId && item.id > key) {
                        item.id -= 1
                    }
                })
            } else {
                deletePersonnel({
                    id: record.id
                }).then(res => {
                    this.$message.info(res.message)
                    if (res.success) {
                        this.personnelLoading = true
                        getAllPersonnel({
                            farmingId: record.farmingId
                        }).then(res => {
                            if (res.success) {
                                this.$emit('refreshParent', this.parentRecord)
                                this.personnelDatas = res.result
                            }
                            this.personnelLoading = false
                        })
                    }
                })
            }
        },
        changeLock(record) {
            this.$set(record, 'editable', true)
        }
    }
}
</script>
<style lang="stylus">
    .all-resource
        width 1000px !important
        .ant-modal-body
            max-height 500px !important
            overflow-y auto 
        .upload-wrapper
            overflow hidden
            text-align center
            width 100px
            .ant-upload
                height 100%
                width 100px
            .ant-upload-list, .ant-upload
                display inline-block
        .ant-table-thead > tr > th, .ant-table-tbody > tr > td
            padding: 10px
</style>
