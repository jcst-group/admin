<template>
  <div class="all">
      <div class="header">
        <img src="assets/title.png" />
      </div>
      <div class="content"></div>
      <div class="footer"></div>
  </div>
</template>

<script>
    export default {
        name: "index"
    }
</script>

<style  scoped>
  .all {
    position: absolute;
    height: 100%;
    width: 100%;
    display: flex;
    background: url("assets/background3_03.png") no-repeat;
    -moz-background-size:100%,100%;
    -o-background-size:100%,100%;
    -webkit-background-size: 100%,100%;
    background-size: 100% 100%;
    flex-direction: column;
  }
  .header {
    flex: 1;
  }
  .content {
    flex: 5;
    background-color: red;
  }
  .footer {
    flex: 1.5;
    background-color: yellow;
  }
</style>
