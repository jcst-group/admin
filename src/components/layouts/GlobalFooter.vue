<template>
  <div class="footer">
    <div class="copyright" :class="{gray: this.colors === 'all', white: this.colors !== 'all'}">
      Copyright
      <a-icon type="copyright"/>
      All Rights Reserved <span>广东嘉承生态科技有限公司</span>
    </div>
    <div class="links">
      <a :class="{gray: this.colors === 'all', white: this.colors !== 'all'}" href="http://www.beian.miit.gov.cn">粤ICP备18155916号</a>
    </div>
  </div>
</template>

<script>
  export default {
    name: "LayoutFooter",
    props: {
      colors: {
        type: String,
        default: 'all'
      }
    }
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
      i{
        margin:0 8px 0 8px;
        
        position: relative;
        top:-1px;
      }
      a {
        &:hover {
          color: rgba(0, 0, 0, .65);
        }
        &:not(:last-child) {
          margin-right: 0px;
        }
      }
    }
    .copyright {
      font-size: 14px;
    }
    .gray {
      color:rgba(0, 0, 0, .45)
    }
    .white {
      color: #ffffff;
    }
  }
</style>
