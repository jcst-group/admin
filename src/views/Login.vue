<template>
  <div class="login_box">
    <vue-particles
      color="#23DECB"
      :particleOpacity="0.9"
      :particlesNumber="60"
      shapeType="circle"
      :particleSize="5"
      linesColor="#23DECB"
      :linesWidth="2"
      :lineLinked="true"
      :lineOpacity="0.4"
      :linesDistance="150"
      :moveSpeed="2"
      :hoverEffect="true"
      hoverMode="grab"
      :clickEffect="true"
      clickMode="push"
    >
    </vue-particles>
    <div style="width: 100%;height: 200px;margin:auto;text-align: center;margin-top: 6%;position: absolute;top: 0%;">
      <img src="../assets/nongxin.png" style="width: 70px;margin-top: -2%;margin-right: 2%">
      <span class="login_span">农芯信息数据化管理中心</span>
      <span class="login_span1">Data-based management center</span>
    </div>
    <div style="width: 500px;height: 384px;background-color: rgba(83, 122, 107, 0.32);position: absolute;top: 10%;left: 0px;right: 0px;bottom: 0px;margin: auto;border-radius:10px 10px;">
      <div style="width: 100%;height: 126px;background-color:rgba(128, 128, 128, 0.28);padding-left: 10%;padding-top: 8%;position: relative;border-radius:10px 10px;">
        <span class="login_hear">立即登录</span>
        <span class="login_hears">Login to system</span>
        <a-icon type="lock" style="color: rgba(254, 254, 254, 0.73);font-size:40px;position: absolute;bottom: 28%;right: 10%"/>
      </div>
      <div style="width:400px;height:400px;margin:0 auto;padding-top: 8%;">
        <a-form
          id="components-form-demo-normal-login"
          :form="form"
          class="login-form"
          @submit="handleSubmit"
        >
          <div class="ainput">
            <a-form-item>
              <a-input
                v-decorator="[
          'username',
          { rules: [{ required: true, message: '请输入用户名' }] }
        ]"
                placeholder="用户名"
              >
                <a-icon
                  slot="prefix"
                  type="user"
                  style="color: rgba(0,0,0,.25)"
                />
              </a-input>
            </a-form-item>
          </div>
          <div class="ainput">
            <a-form-item>
              <a-input
                v-decorator="[
          'password',
          { rules: [{ required: true, message: '请输入密码' }] }
        ]"
                type="password"
                placeholder="密码"
              >
                <a-icon
                  slot="prefix"
                  type="lock"
                  style="color: rgba(0,0,0,.25)"
                />
              </a-input>
            </a-form-item>
          </div>
          <a-form-item>
            <a-button
              type="primary"
              html-type="submit"
              class="login-form-button"
              :disabled="loginBtn"
            >
              登录
            </a-button>
          </a-form-item>
        </a-form>
      </div>
    </div>
      <div style="position: absolute;bottom: 0;width: 98.5%">
        <Footer colors='login'></Footer>
      </div>
  </div>
</template>

<script>
import { mapActions } from "vuex"
import Vue from 'vue'
import { ACCESS_TOKEN } from "@/store/mutation-types"
import Footer from "@/components/layouts/GlobalFooter"
import VueParticles from 'vue-particles'
Vue.use(VueParticles)
  export default {
    beforeCreate () {
      this.form = this.$form.createForm(this);
     },
    data() {
      return {
        loginBtn: false,
      }
    },
    components:{
      Footer,
    },
    methods: {
      handleSubmit (e) {
        e.preventDefault();
        this.form.validateFields((err, values) => {
          if (!err) {
            this.loginBtn = true
            // console.log('Received values of form: ', values);
            this.$store.dispatch("user/login",values).then(()=>{
              this.$router.push({ path: 'nxhome' })
              this.$notification.success({
                message: '欢迎',
                description: `欢迎回来`,
              });
              this.loginBtn = false;

            }).catch(error=>{
              this.$notification[ 'error' ]({
                message: '登录失败',
                description: ((error.response || {}).data || {}).message || error.message || "请求出现错误，请稍后再试",
                duration: 4,
              });
              /*this.$notification[ 'error' ]({
                message: '登录失败',
                description: ((err.response || {}).data || {}).message || err.message || "请求出现错误，请稍后再试",
                duration: 4,
              });*/
              this.loginBtn = false;
            })
          }
        });
      },
    },
  };
</script>
<style scoped>
  .login_box{
    height: 100%;
    position: absolute;
    width: 100%;
    background: url("../assets/login.jpg") no-repeat !important;
    background-size: 100% 100%;
  }
  #components-form-demo-normal-login .login-form {
    max-width: 300px;
  }
  #components-form-demo-normal-login .login-form-forgot {
    float: right;
  }
  #components-form-demo-normal-login .login-form-button {
    width: 100%;
  }
  .login_span{
    font-family: MicrosoftYaHei;
    font-size: 63px;
    font-weight: normal;
    font-stretch: normal;
    line-height: 26px;
    letter-spacing: 14px;
    color: #fefefe;
  }
  .ant-btn-primary{
    background:linear-gradient(#2db3a8,#0D9168,#259188) !important;
    border-color:#269383 !important;
  }
  .login_hear{
    display: block;
    width: 118px;
    height: 24px;
    font-family: PingFang-SC-Regular;
    font-size: 22px;
    font-weight: normal;
    font-stretch: normal;
    line-height: 26px;
    letter-spacing: 7px;
    color: #ffffff;
    opacity: 0.9;
    margin-bottom: 2%;
  }
  .login_hears{
    width: 329px;
    height: 13px;
    font-family: SFProDisplay-Regular;
    font-size: 14px;
    font-weight: normal;
    font-stretch: normal;
    line-height: 26px;
    color: #fefefe;
  }
  .login_span1{
    position: absolute;
    top:38%;
    left:50%;
    transform: translate(-50%, -50%);
    font-family: PingFang-SC-Regular;
    font-size: 17px;
    font-weight: normal;
    font-stretch: normal;
    line-height: 26px;
    letter-spacing: 2px;
    color: #ffffff;
  }
  @media screen and (max-height: 700px) {
    .login_box{
      height: 130%;
    }
  }
</style>
<style>
  .ainput /deep/ .ant-form-explain{
    color: white;
  }
</style>
