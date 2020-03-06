<template>
  <div>
    <a-modal
      :title="title"
      v-model="visible"
      @ok="handleOk"
      @cancel='deletePicture'
      style="top:5%;height: 90%;"
      cancelText="取消"
      :okText="okText"
      :maskClosable="false"
      class="user-modal"
    >
      <a-form
        :form="form"
      >
        <template v-if="npw">
          <a-form-item
            v-bind="formItemLayout"
            label="账号"
            class="form-passsword"
          >
            <a-input
              @blur='checkUsername'
              v-decorator="[
                'username',
                {
                  initialValue:record.username,
                  rules: [{ required: true, message: '用户名长度必须在6-32位内！',min:6,max:32 }],
                }
              ]"
              v-if="isedit"
            />
            <template v-if="!isedit">{{record.username}}</template>
          </a-form-item>
          <a-form-item
            v-bind="formItemLayout"
            label="真实姓名"
            class="form-passsword"
          >
            <a-input
              v-decorator="[
                'realName',
                {
                  initialValue:record.realName,
                  rules: [{ required: true, message: '请输入真实姓名' }],
                }
              ]"
              v-if="isedit"
            />
            <template v-if="!isedit">{{record.realName}}</template>
          </a-form-item>

        </template>
        <template v-if="pw">
          <a-form-item
            v-bind="formItemLayout"
            label="密码"
            class="form-passsword"
          >
            <a-input
              v-decorator="[
                'password',
                {
                  rules: [{
                    required: true, message: '密码长度必须在6-32位内！',min:6,max:32
                  }, {
                    validator: validateToNextPassword,
                  }],
                }
              ]"
              type="password"
            />
          </a-form-item>
          <a-form-item
            v-bind="formItemLayout"
            label="确认密码"
            class="form-passsword"
          >
            <a-input
              v-decorator="[
                'confirm',
                {
                  rules: [{
                    required: true, message: '请再输入一次密码',
                  }, {
                    validator: compareToFirstPassword,
                  }],
                }
              ]"
              type="password"
              @blur="handleConfirmBlur"
            />
          </a-form-item>
        </template>
        <template v-if="npw">
          <a-form-item
            v-bind="formItemLayout"
            label="性别"
            class="form-passsword"
          >
            <a-select
              v-decorator="[
                'sex',
                {
                  initialValue:String(this.record.sex ? this.record.sex.displayName : this.record.sex),
                  rules: [{ required: true, message: '请选择你的性别' }],
                }
              ]"
              v-if="isedit"
              >
              <a-select-option value=0>男</a-select-option>
              <a-select-option value=1>女</a-select-option>
            </a-select>
            <template v-if="!isedit">{{record.sex && record.sex.displayName === '女' ?'女':'男'}}</template>
          </a-form-item>
          <a-form-item
            v-bind="formItemLayout"
            label="手机号"
            class="form-passsword"
          >
            <a-input
              @blur='checkPhone'
              maxlength="11" onkeyup="this.value=this.value.replace(/\D/g,'')"
              v-decorator="[
                'phone',
                {initialValue:record.phone,
                  rules: [{
                    required: true, message: ' ',
                  },{
                    validator: displayResult,
                  }],
                }
              ]"
              style="width: 100%"
              v-if="isedit"
            />
            <template v-if="!isedit">{{record.phone}}</template>
          </a-form-item>
          <a-form-item
            v-bind="formItemLayout"
            label="身份证号"
            class="form-passsword"
          >
            <a-input
              maxlength='18'
              v-decorator="[
                'identifyCode',
                {initialValue:record.identifyCode,
                  rules: [{
                    message: '请正确填写身份证号',pattern: /(\d{17}?(\d|X))|(^\d{15}$)/
                  }]
                }
              ]"
              style="width: 100%"
              v-if="isedit"
            />
            <template v-if="!isedit">{{record.identifyCode}}</template>
          </a-form-item>
          <!-- <a-form-item
            v-bind="formItemLayout"
            label="邮箱"
            class="form-passsword"
          >
            <a-input
              v-decorator="[
                'email',
                {initialValue:record.email,
                  rules: [{
                    type: 'email', message: '这不是一个正确的邮箱',
                  }, {
                    required: false, message: '请输入邮箱',
                  }]
                }
              ]"
              v-if="isedit"
            />
            <template v-if="!isedit">{{record.email}}</template>
          </a-form-item> -->
        </template>
        <template v-if="tx">
          <a-form-item
            v-bind="formItemLayout"
            label="头像"
            class="form-passsword change-display"
          >
            <div class="upload-wrapper">
              <a-upload
                name="file"
                listType="picture-card"
                class="avatar-uploader"
                :showUploadList="true"
                action="/api2/pictureInfo/addUserHeadPic"
                :beforeUpload="beforeUpload"
                :headers="headers"
                :fileList='avatarFileList'
                @change="handleChange"
                @preview='avatarPreview'
                :remove='avatarRemove'
                v-if="isedit"
              >
                <div v-if="avatarFileList.length < 1" style="transform: translateY(15%)">
                  <a-icon type="plus"/>
                  <div class="ant-upload-text">Upload</div>
                </div>
              </a-upload>
              <a-modal :visible="avatarVisible" :footer="null" @cancel="handleAvatarCancel">
                <img alt="example" style="width: 100%" :src="imageUrl" />
              </a-modal>
            </div>
            <template v-if="!isedit"><img v-if="imageUrl" :src="imageUrl" alt="avatar" style="width:50px;height:50px;"/></template>
          </a-form-item>
        </template>
        <template v-if="tx">
          <a-form-item
            v-bind="formItemLayout"
            label="户口"
            class="form-passsword change-display"
          >
            <div class="upload-wrapper">
              <a-upload
                name="file"
                listType="picture-card"
                class="avatar-uploader"
                :showUploadList="true"
                action="/api2/pictureInfo/addUserHukouPic"
                :beforeUpload="beforeUpload"
                :headers="headers"
                :fileList='hukouFileList'
                @change="handleHukouChange"
                @preview='hukouPreview'
                :remove='hukouRemove'
                v-if="isedit"
              >
                <div v-if="hukouFileList.length < 1" style="transform: translateY(15%)">
                  <a-icon type="plus"/>
                  <div class="ant-upload-text">Upload</div>
                </div>
              </a-upload>
              <a-modal :visible="hukouVisible" :footer="null" @cancel="handleHukouCancel">
                <img alt="example" style="width: 100%" :src="hukouImageUrl" />
              </a-modal>
            </div>
            <template v-if="!isedit"><img v-if="hukouImageUrl" :src="hukouImageUrl" alt="hukou" style="width:50px;height:50px;"/></template>
          </a-form-item>
        </template>
        <template v-if="tx">
          <a-form-item
            v-bind="formItemLayout"
            label="身份证"
            class="form-passsword change-display"
          >
            <div class="upload-wrapper">
              <a-upload
                name="file"
                listType="picture-card"
                class="avatar-uploader"
                :showUploadList="true"
                action="/api2/pictureInfo/addIdentifyCodePic"
                :beforeUpload="beforeUpload"
                :headers="headers"
                :fileList='indentFileList'
                @change="handleIndentChange"
                @preview='indentPreview'
                :remove='indentRemove'
                v-if="isedit"
              >
                <div v-if="indentFileList.length < 1" style="transform: translateY(15%)">
                  <a-icon type="plus"/>
                  <div class="ant-upload-text">Upload</div>
                </div>
              </a-upload>
              <a-modal :visible="indentVisible" :footer="null" @cancel="handleIndentCancel">
                <img alt="example" style="width: 100%" :src="indentImageUrl" />
              </a-modal>
            </div>
            <template v-if="!isedit"><img v-if="indentImageUrl" :src="indentImageUrl" alt="identify" style="width:50px;height:50px;"/></template>
          </a-form-item>
        </template>
      </a-form>
    </a-modal>
  </div>
</template>
<script>
function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener("load", () => callback(reader.result));
  reader.readAsDataURL(img);
}
import Vue from "vue";
import { ACCESS_TOKEN } from "@/store/mutation-types";

import { pick } from "lodash";
import { addInfo, updateUser,checkUser, delpicture} from "@/api/userApi";
export default {
  data() {
    return {
      isedit: true,
      tx: true,
      pw: false,
      npw: true,
      record: {},
      loading: false,
      hukouLoading: false,
      indentLoading: false,
      imgLock: true,
      imageUrl: "",
      hukouImageUrl: '',
      indentImageUrl: '',
      headers: "",
      avatarsrc: "",
      hukouSrc: '',
      indentSrc: '',
      confirmDirty: false,
      visible: false,
      title: "操作",
      okText: "",
      avatarFileList: [],
      avatarVisible: false,
      hukouFileList: [],
      hukouVisible: false,
      indentFileList: [],
      indentVisible: false,
      phoneLock: true,
      userLock: true,
      form: this.$form.createForm(this),
      formItemLayout: {
        labelCol: {
          xs: { span: 24 },
          sm: { span: 8 }
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 16 }
        }
      },
      tailFormItemLayout: {
        wrapperCol: {
          xs: {
            span: 24,
            offset: 0
          },
          sm: {
            span: 16,
            offset: 8
          }
        }
      }
    };
  },
  created() {
    const token = Vue.ls.get(ACCESS_TOKEN);
    this.headers = { "X-Access-Token": token };  
  },
  methods: {
    checkPhone(e) {
      if ((Object.keys(this.record).length > 1 && e.target.value !== this.record.username) || Object.keys(this.record).length === 1) {
        checkUser({
          phone: e.target.value
        }).then(res => {
          if (!res.success) {
            this.$message.warn(res.message)
          }
          this.phoneLock = res.success
        })
      }
    },
    checkUsername(e) {
      let length = e.target.value.length
      if (e.target.value == parseInt(e.target.value) && (parseInt(e.target.value) + '').length == length) {
        this.userLock = false
        this.$message.warn('用户名不可以只有数字')
        return
      }
      if ((Object.keys(this.record).length > 1 && e.target.value !== this.record.username) || Object.keys(this.record).length === 1) {
        checkUser({
          username: e.target.value
        }).then(res => {
          if (!res.success) {
            this.$message.warn(res.message)
          }
          this.userLock = res.success
        })
      }
    },
    handleChange(info) {
      if (!this.imgLock) {
        return
      }
      this.avatarFileList = info.fileList
      if (info.file.response && info.file.response.result) {
        this.avatarsrc = {
          id: info.file.response.result.id
        }
      }
    },
    handleHukouChange(info) {
      if (!this.imgLock) {
        return
      }
      this.hukouFileList = info.fileList
      if (info.file.response && info.file.response.result) {
        this.hukouSrc = {
          id: info.file.response.result.id
        }
      }
    },
    handleIndentChange(info) {
      if (!this.imgLock) {
        return
      }
      this.indentFileList = info.fileList
      if (info.file.response && info.file.response.result) {
        this.indentSrc = {
          id: info.file.response.result.id
        }
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
    add() {
      this.record = {};
      this.imageUrl = "";
      this.hukouImageUrl = ""
      this.indentImageUrl = ''
      this.record.sex = {displayName: '', value: 0};
      this.isedit = true;
      this.avatarsrc = "";
      this.hukouSrc = ""
      this.indentSrc = ''
      this.avatarFileList = []
      this.hukouFileList = []
      this.indentFileList = []
      this.form.resetFields();
      this.edit();
    },
    editpw(record) {
      this.form.resetFields();
      if (record != " " && record != undefined) {
        this.record = record;
      }
      this.visible = true;
    },
    look(record) {
      this.form.resetFields();
      this.isedit = false;
      if (record != " " && record != undefined) {
        if (!record.avatar) {
          this.tx = false;
        } else {
          this.tx = true;
        }
      }
      if (record != " " && record != undefined) {
        this.record = record;
        if (this.record.sex == null) {
          this.record.sex = {displayName: '', value: 0};
        }
        //console.log(record)
        let imgshowapi = "/api2/pictrueInfo/show";
        if (record.headPic) {
          this.imageUrl = imgshowapi + "?fileName=" + record.headPic.pictureUrl;
          this.avatarsrc = record.headPic;
        } else {
          this.imageUrl = "";
        }
      }
      this.visible = true;
    },
    edit(record) {
      this.form.resetFields();
      this.isedit = true;
      this.avatarFileList = []
      this.hukouFileList = []
      this.indentFileList = []
      if (record != " " && record != undefined) {
        this.record = record;
        this.avatarsrc = "";
        this.hukouSrc = ""
        this.indentSrc = ""
        if (this.record.sex == null) {
          this.record.sex = {displayName: '', value: 0};
        }
        let imgshowapi = "/api2/pictureInfo/show/";
        if (record.headPic) {
          this.avatarFileList.push({
            uid: record.headPic.id,
            name: record.headPic.pictureUrl,
            status:'done',
            url: imgshowapi + record.headPic.pictureUrl
          })
        }
        if (record.hukouPic) {
          this.hukouFileList.push({
            uid: record.hukouPic.id,
            name: record.hukouPic.pictureUrl,
            status:'done',
            url: imgshowapi + record.hukouPic.pictureUrl
          })
        }
        if (record.identifyCodePic) {
          this.indentFileList.push({
            uid: record.identifyCodePic.id,
            name: record.identifyCodePic.pictureUrl,
            status:'done',
            url: imgshowapi + record.identifyCodePic.pictureUrl
          })
        } else {
          this.indentImageUrl = "";
        }
      }
      this.visible = true;
    },
    handleOk() {
      if (this.title == "添加用户") {
        this.form.validateFieldsAndScroll((err, values) => {
          if (!err) {
            const userinfo = this.form.getFieldsValue([
              "username",
              "realName",
              "password",
              "phone",
              "sex",
              "identifyCode"
            ]);
            if (userinfo.sex == 1) {
              userinfo.sex = 'WOMAN'
            } else {
              userinfo.sex = 'MAN'
            }
            //console.log(this.avatarsrc);
            userinfo.headPic = this.avatarsrc ? this.avatarsrc : null
            userinfo.hukouPic = this.hukouSrc ? this.hukouSrc : null
            userinfo.identifyCodePic = this.indentSrc ? this.indentSrc : null
            //urif=Object.assign(userinfo,{avatar:getimgurl()})
            //getimgurl();
            //this.$store.dispatch('user/adduser',userinfo)
            if (this.phoneLock && this.userLock) {
                addInfo(userinfo).then(res => {
                  if (res.success == true) {
                    this.phoneLock = true
                    this.userLock = true
                    this.$message.info("添加成功！");
                    this.$parent.loadData();
                    this.form.resetFields();
                    this.visible = false;
                  } else {
                    this.$message.info(res.message);
                  }
                });
            } else {
                !this.phoneLock ? this.$message.warn('手机号重复，请重新填写手机号') : this.$message.warn('用户名重复，请重新填写用户名')
            }
            //this.$message.info(this.$store.state.user.addinfo)
            //console.log(this.form.getFieldsValue(['username','password','phone','sex']))
          }
        });
      }
      if (this.title == "编辑用户") {
        this.form.validateFieldsAndScroll((err, values) => {
          if (!err) {
            const userinfo = this.form.getFieldsValue([
              "username",
              "realName",
              "phone",
              "sex",
              "identifyCode"
            ]);
            if (userinfo.sex == 1) {
              userinfo.sex = 'WOMAN'
            } else {
              userinfo.sex = 'MAN'
            }
            this.form.resetFields();
            if (this.avatarsrc) {
              userinfo.headPic = this.avatarsrc;
            }
            if (this.hukouSrc) {
              userinfo.hukouPic = this.hukouSrc;
            }
            if (this.indentSrc) {
              userinfo.identifyCodePic = this.indentSrc;
            }
            userinfo.uid = this.record.uid;
            if (this.phoneLock && this.userLock) {
              updateUser(userinfo).then(res => {
                if (res.success == true) {
                  this.phoneLock = true
                  this.userLock = true
                  this.$message.info(res.message);
                  //this.$store.dispatch('user/getlist',{pageNo:"1",pageSize:"30"})
                  this.$parent.loadData();
                  this.visible = false;
                } else {
                  this.form.resetFields("username");
                  this.$message.info(res.message);
                }
              });
              return
            } else {
              !this.phoneLock ? this.$message.warn('手机号重复，请重新填写手机号') : this.$message.warn('用户名重复，请重新填写用户名')
            }
          }
        });
      }
      if (this.title == "修改密码") {
        this.form.validateFieldsAndScroll((err, values) => {
          if (!err) {
            const userinfo = this.form.getFieldsValue(["password"]);
            this.form.resetFields();
            userinfo.uid = this.record.uid;
            updateUser(userinfo).then(res => {
              if (res.success == true) {
                this.$message.info(res.message);
                //this.$store.dispatch('user/getlist',{pageNo:"1",pageSize:"30"})
                this.$parent.loadData();
                this.visible = false;
              } else {
                this.$message.info(res.message);
              }
            });
          }
        });
      }
      if (this.title == "查看详情") {
        this.visible = false;
      }
    },
    deletePicture() {
      if (this.isedit) {
        this.phoneLock = true
        this.userLock = true
        if (this.avatarsrc !== '' && this.avatarsrc.id) {
          delpicture({
            id: this.avatarsrc.id
          }).then(res => {})
        }
        if (this.hukouSrc !== '' && this.hukouSrc.id) {
          delpicture({
            id: this.hukouSrc.id
          }).then(res => {})
        }
        if (this.indentSrc !== '' && this.indentSrc.id) {
          delpicture({
            id: this.indentSrc.id
          }).then(res => {})
        } 
      }
    },
    handleConfirmBlur(e) {
      const value = e.target.value;
      this.confirmDirty = this.confirmDirty || !!value;
    },
    compareToFirstPassword(rule, value, callback) {
      const form = this.form;
      if (value && value !== form.getFieldValue("password")) {
        callback("两次密码不一样");
      } else {
        callback();
      }
    },
    displayResult(rule, value, callback) {
      if (value.length != 11) {
        callback("请输入正确的手机号");
      } else {
        callback();
      }
    },
    validateToNextPassword(rule, value, callback) {
      const form = this.form;
      if (value && this.confirmDirty) {
        form.validateFields(["confirm"], { force: true });
      }
      callback();
    },
    avatarPreview(file) {
      this.avatarVisible = true
      this.imageUrl = file.url || file.thumbUrl
    },
    handleAvatarCancel() {
      this.avatarVisible = false
    },
    avatarRemove(file) {
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
    hukouPreview(file) {
      this.hukouVisible = true
      this.hukouImageUrl = file.url || file.thumbUrl
    },
    handleHukouCancel() {
      this.hukouVisible = false
    },
    hukouRemove(file) {
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
    indentPreview(file) {
      this.indentVisible = true
      this.indentImageUrl = file.url || file.thumbUrl
    },
    handleIndentCancel() {
      this.indentVisible = false
    },
    indentRemove(file) {
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
    }
  }
};
</script>
<style lang='stylus'>
.user-modal
  .change-display
    display inline-block
    width 47%
    .ant-form-item-control-wrapper
      display inline-block
      width 100px
    .ant-form-item-label
      display inline-block
  .form-passsword
    margin 0 auto 10px
    .ant-form-item-label
      width 100px
  .upload-wrapper
    overflow hidden
    height 100px
    width 100px
    .ant-upload-list-item-info
        & > span
          display inline-block
          height 100%
          width 100%
    .ant-upload
      height 100%
      width 100px
    .ant-upload-list, .ant-upload
      display inline-block
  .ant-upload-select-picture-card i {
    font-size: 32px;
    color: #999;
  }
  .ant-upload-select-picture-card .ant-upload-text {
    margin-top: 8px;
    color: #666;
  }
</style>

