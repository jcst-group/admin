<template>
    <a-modal
        :title="title"
        v-model="visible"
        @ok="handleOk"
        @cancel='cancelModal'
        style="top:5%;height: 90%; max-height:90%;overflow-y:hidden"
        cancelText="取消"
        okText="确定"
        :maskClosable="false"
        class="add-farming-item">
        <a-form :form='form'>
            <div class="form-wrapper">
                <a-form-item label='作物名称'>
                    <a-select
                    v-if="cropDatas.length > 0" 
                    @change="_changeForm"
                    v-decorator="[
                        'cropId',
                            {
                                initialValue:record.crop ? record.crop.cropName : '',
                                rules: [{ required: true, message: '请选择作物名称' }],
                            }
                        ]">
                        <a-select-option 
                            v-for="item in cropDatas"
                            :key="item.id"
                            :value='item.id'>
                            {{item.cropName}}
                        </a-select-option>
                    </a-select>
                </a-form-item>
            </div>
            <div class="form-wrapper">
                <a-form-item label='农事名称'>
                    <a-input 
                        @change="_changeForm"
                        v-decorator="[
                            'farmingName',
                            {
                                initialValue:record.farmingName,
                                rules: [{ required: true, message: '请输入农事名称'}],
                            }
                        ]" />
                </a-form-item>
            </div>
            <div class="form-wrapper" style="width:100%">
                <a-form-item label='方法'>
                    <a-textarea @change="_changeForm" :autosize={minRows:2,maxRows:6} v-decorator="[
                        'method',
                        {
                            initialValue:record.method,
                            rules: [{ required: true, message: '请输入方法'}],
                        }
                    ]" />
                </a-form-item>
            </div>
            <div class="form-wrapper">
                <a-form-item
                    label="指导图片"
                    class="form-passsword change-display"
                >
                    <div 
                        class="upload-wrapper">
                        <a-upload
                            name="file"
                            listType="picture-card"
                            :multiple='true'
                            action="/api2/pictureInfo/addFarmingItemPic"
                            :beforeUpload="beforeUpload"
                            :headers="headers"
                            :fileList='fileList'
                            @change="handleIndentChange"
                            @preview="handlePreview"
                            :remove='removePic'
                        >
                            <div v-if="fileList.length < 4" style="transform:translateY(50%)">
                                <a-icon type="plus" style="font-size:20px"  />
                                <div class="ant-upload-text">Upload</div>
                            </div>
                        </a-upload>
                        <a-modal :visible="picVisible" :footer="null" @cancel="handleCancel">
                            <img alt="example" style="width: 100%" :src="picImage" />
                        </a-modal>
                    </div>
                </a-form-item>
            </div>
        </a-form>
    </a-modal>
</template>
<script>
function getBase64(img, callback) {
    const reader = new FileReader();
    reader.addEventListener("load", () => callback(reader.result));
    reader.readAsDataURL(img);
}
import {
    addFarmingItem,
    updateFarmingItem
} from '@/api/permissonApi'
import {delpicture} from '@/api/userApi'
import Vue from "vue";
import { ACCESS_TOKEN } from "@/store/mutation-types";
export default {
    props: {
        cropDatas: {
            default() {
                return []
            }
        }
    },
    data() {
        return {
            title: '添加农事项目',
            visible: false,
            record: {},
            form: this.$form.createForm(this),
            lock: true,
            uploadIndex: 0,
            fileList: [],
            fileId: [],
            headers: "",
            picVisible: false,
            picImage: '',
            delPic: false,
            imgLock: true
        }
    },
    created() {
        const token = Vue.ls.get(ACCESS_TOKEN);
        this.headers = { "X-Access-Token": token };
    },
    methods: {
        open(record) {
            if (record) {
                let imgshowapi = "/api2/pictureInfo/show/"
                record.pictureInfoList.forEach(item => {
                    this.fileList.push({
                        uid: item.id,
                        name: item.pictureUrl,
                        status:'done',
                        url: imgshowapi + item.pictureUrl
                    })
                    this.fileId.push({
                        id: item.id
                    })
                })
            } else {
                this.picList = []
            }
            this.record = record ? record : {}
            this.visible = true
            this.form.resetFields()
        },
        _changeForm() {
            this.lock = false
        },
        beforeUpload(file) {
            const isJPG = file.type === "image/jpeg";
            const isPNG = file.type === "image/png";
            if (!(isPNG || isJPG)) {
                this.$message.error("只允许上传jpg/png格式图片");
            }
            const isLt5M = file.size / 1024 / 1024 < 5;
            if (!isLt5M) {
                this.$message.error("图片大小不能大于5M");
            }
            this.imgLock = (isJPG || isPNG) && isLt5M
            return (isJPG || isPNG) && isLt5M;
        },
        handleIndentChange(info) {
            if (!this.imgLock) {
                return
            }
            this.fileList = info.fileList
            if (info.file.response && info.file.response.result) {
                this.fileId.push({
                    id: info.file.response.result.id
                })
            }
            this.lock = false
            // console.log(this.fileList)
        },
        handlePreview(file) {
            this.picVisible = true
            this.picImage = file.url || file.thumbUrl
        },
        handleCancel() {
            this.picVisible = false
        },
        cancelModal() {
            this.fileList = []
            this.fileId = []
        },
        removePic(file) {
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
                                that.lock = false
                                return resolve(true)
                            }
                        })
                    }
                })
            }).then(res => {
                return res
            })
        },
        handleOk() {
            if (!this.lock) {
                if (this.title === '添加农事项目') {
                    this.form.validateFieldsAndScroll((err, values) => {
                        if (!err) {
                            const params = this.form.getFieldsValue()
                            params.cropId = String(params.cropId)
                            params.pictureInfoList = this.fileId
                            addFarmingItem(params).then(res => {
                                this.$message.info(res.message)
                                this.visible = false
                                this.lock = true
                                this.fileList = []
                                this.fileId = []
                                if (res.success) {
                                    this.$parent._loadData()
                                }
                            })
                        }
                    })
                } else {
                    const params = this.form.getFieldsValue()
                    if (this.record.cropId) {
                        params.cropId = typeof params.cropId === 'number' ? params.cropId : this.record.cropId
                    }
                    params.id = this.record.id
                    delete params.crop
                    params.pictureInfoList = this.fileId
                    updateFarmingItem(params).then(res => {
                        this.$message.info(res.message)
                        this.visible = false
                        this.lock = true
                        this.fileList = []
                        this.fileId = []
                        if (res.success) {
                            this.$parent._loadData()
                        }
                    })
                }
            }
        }
    }
}
</script>
<style lang='stylus'>
    .add-farming-item
        width: 900px !important
        .form-wrapper
            width 45%
            display inline-block
            .ant-form-item
                width 100%
                display inline-block
                .ant-form-item-control-wrapper
                    width 60%
                    display inline-block
                .ant-form-item-label
                    width 150px
                    vertical-align top
        .form-wrapper:last-child
            width 100%
            .ant-form-item-control-wrapper
                width 70%
        .change-display
            display inline-block
            width 47%
            .ant-form-item-control-wrapper
                display inline-block
                width 100px
                .ant-form-item-children
                    display flex
                    span
                        margin-left 20px
                    span:nth-of-type(1)
                        margin-left 0
            .ant-form-item-label
                display inline-block
        .form-passsword
            margin 0 auto 10px
            .ant-form-item-label
                width 100px
        .upload-wrapper
            overflow hidden
            .ant-upload-list-item-info
                & > span
                    display inline-block
                    height 100%
                    width 100%
            .ant-upload-list, .ant-upload
                display inline-block
</style>
