import Vue from 'vue'
import router from './router'
import store from './store'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import notification from 'ant-design-vue/es/notification'
import { ACCESS_TOKEN } from '@/store/mutation-types'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login','/load'] // no redirect whitelist

router.beforeEach((to, from, next) => {
 // start progress bar
  
  //后台管理端
  if (Vue.ls.get(ACCESS_TOKEN)) {
    /* has token */
    if (to.path === '/login') {
      next({ path: '/nxhome' })
      NProgress.done()
    } else if(to.path === '/'){
      next({ path: '/nxhome' })
      NProgress.done()
    } else {
      next()
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      // 在免登录白名单，直接进入
      next()
    } else {
      next({ path: '/login', query: { redirect: to.fullPath } })
      NProgress.done() // if current page is login will not trigger afterEach hook, so manually handle it
    }
  }
})

router.afterEach(() => {
  NProgress.done() // finish progress bar
})
