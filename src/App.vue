<template>
  <a-locale-provider :locale="locale">
    <div id="app">
  <!--    <div id="nav">
        <router-link to="/">Home</router-link> |
        <router-link to="/about">About</router-link> |
        <router-link to="/xx">xx</router-link>
      </div>-->
      <router-view/>
    </div>
  </a-locale-provider>
</template>
<script>
  import zhCN from 'ant-design-vue/lib/locale-provider/zh_CN'
  export default {
    data() {
      return {
        locale: zhCN,
      }
    },
    created() {
      // this.$router.push({
      //   path: '/users'
      // })
    },
  }
</script>
<style lang="scss">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
#nav {
  padding: 30px;
  a {
    font-weight: bold;
    color: #2c3e50;
    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
.ant-layout-sider {
background:#0F5D67 !important;
}
.ant-menu-dark, .ant-menu-dark .ant-menu-sub {
  background:#0F5D67 !important;
}
.ant-btn-primary{
  background:#2c909c !important;
  border-color:#2c909c !important;
}
.ant-menu.ant-menu-dark .ant-menu-item-selected, .ant-menu-submenu-popup.ant-menu-dark .ant-menu-item-selected{
  background-color: #059db1 !important;
}
a{
  color: #2c909c;
}
.ant-pagination-item-active{
  border-color:rgb(86, 194, 208) !important;
}
.ant-pagination-item-active a{
  color: rgb(86, 194, 208) !important;
}
.ant-pagination-item-active a:hover{
  color: rgb(86, 194, 208) !important;
}
.ant-radio-group-solid .ant-radio-button-wrapper-checked:not(.ant-radio-button-wrapper-disabled){
  background:#2c909c !important;
  border-color:#2c909c !important;
}
  /*#components-layout-demo-custom-trigger{*/
  /*  position: absolute;*/
  /*  width: 100%;*/
  /*  height: 100%;*/
  /*}*/
</style>
