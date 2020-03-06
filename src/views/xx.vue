<template>
  <div class="home">
    {{name}}
    <button type="button" @click="xx()">xx</button>
  </div>

</template>
<script>
import {loadAMapJS} from '@/utils/asyncLoadJs'
let loadedAMapJS = false // 是否加载完js
export default {
  name: 'home',
  data(){
    return{
      name: 'info'
    };
  },
  created () {
    console.log("create now")
    // 判断是否加载过
    if (!loadedAMapJS) {
      loadAMapJS().then(() => {
        loadedAMapJS = true
      })
    }
  },
  mounted(){
    // 循环判断有没有加载完 写在mounted生命周期里是应为高德的api依赖dom
    let interval = setInterval(() => {
      if (loadedAMapJS) {
        clearInterval(interval)
        this.init()
      }
    }, 300)
  },
  methods: {
    xx() {
      console.log('xx');
      //this.data().name = 'xx';
    },
    init(){
      console.log("init");
    }
  },
};
</script>
