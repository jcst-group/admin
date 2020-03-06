<template>
    <a-modal
        title="检查报告"
        v-model="outVisible"
        style="top:10%;height: 90%"
        :maskClosable="false"
        @ok='handelOk'
        class="chack-message">
        <div class="upload-img">
            <a-upload
                name="file"
                listType="picture-card"
                class="avatar-uploader"
                :showUploadList="true"
                action="/api2/pictureInfo/addMaterialPic"
                :beforeUpload="beforeUpload"
                :headers="headers"
                :fileList='fileList'
                @change="handleChange"
                @preview='preview'
                :remove='remove'>
                <div v-if="fileList.length < 1">
                    <a-icon type="plus"/>
                    <div class="ant-upload-text">图片上传</div>
                </div>
            </a-upload>
            <a-modal :visible="visible" :footer="null" @cancel="handleCancel">
                <img alt="example" style="width: 100%" :src="imageUrl" />
            </a-modal>
        </div>
    </a-modal>
</template>

<script>
import {delpicture} from "@/api/userApi";
import Vue from "vue";
import { ACCESS_TOKEN } from "@/store/mutation-types";
export default {
    data() {
        return {
            record: {},
            visible: false,
            outVisible: false,
            imgLock: true,
            delLock: true,
            fileList: [],
            imageUrl: ''
        }
    },
    created() {
        const token = Vue.ls.get(ACCESS_TOKEN);
        this.headers = { "X-Access-Token": token };
    },
    methods: {
        open(record) {
            this.fileList = []
            this.delLock = true
            let imgshowapi = "/api2/pictureInfo/show/";
            this.outVisible = true
            this.imageUrl = ''
            this.record = record
            if (record.pictureInfo) {
                this.fileList.push({
                    uid: record.pictureInfo.id,
                    name: record.pictureInfo.pictureUrl,
                    status:'done',
                    url: imgshowapi + record.pictureInfo.pictureUrl
                })
            }
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
        handleChange(info) {
            if (!this.imgLock) {
                return
            }
            this.fileList = info.fileList
            if (info.file.response && info.file.response.result) {
                this.record.src = {
                    id: info.file.response.result.id
                }
            }
        },
        handelOk() {
            this.$nextTick(() => {
                this.outVisible = false
                if (!this.delLock && this.record.src) {
                    this.$set(this.record, 'src', null)
                }
                this.$emit('saveImg', this.record)
                // if (this.record.src) {
                //     this.$emit('saveImg', this.record)
                //     // this.$parent.saveMaterials(this.record)
                // }
            })
        },
        handleCancel() {
            this.visible = false
        },
        preview(file) {
            this.visible = true
            this.imageUrl = file.url || file.thumbUrl
        },
        remove(file) {
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
                            if (res.success) {
                                that.lock = false
                                that.delLock = false
                                return resolve(true)
                            }
                        })
                    }
                })
            }).then(res => {
                return res
            })
         }
    }
}
</script>

<style lang='stylus'>
    .chack-message
        .ant-modal-body
            height: 200px
        .ant-upload-list-item-info
            & > span
                display inline-block
                height 100%
                width 100%
        .upload-img
            .avatar-uploader
                .ant-upload
                    width 104px
                    height 104px
</style>
