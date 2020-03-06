<template>
  <div class="footer">
    <div class="copyright">
      Copyright
      <a-icon type="copyright"/>
      All Rights Reserved <span>广东嘉承生态科技有限公司</span>
    </div>
    <div class="links">
      <a href="http://www.beian.miit.gov.cn">粤ICP备18155916号</a>
    </div>
  </div>
</template>

<script>
  export default {
    name: "LayoutFooter",
  }
</script>

<style lang="scss" scoped>
  .footer {
    padding: 0 16px;
    margin: 48px 0 24px;
    text-align: center;
    .links {
      vertical-align:bottom;
      margin-top: 8px;
      span{
        color: #ffffffd6;
      }
      i{
        margin:0 8px 0 8px;
        color: #ffffffd6;
        position: relative;
        top:-1px;
      }
      a {
        color: #ffffffd6;

        &:hover {
          color: white;
        }

        &:not(:last-child) {
          margin-right: 0px;
        }
      }
    }
    .copyright {
      color: #ffffffd6;
      font-size: 14px;
    }
  }
</style>
