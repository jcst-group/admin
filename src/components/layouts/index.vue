<template>
  <a-layout id="components-layout-demo-custom-trigger" >
    <a-layout-sider
      :trigger="null"
      collapsible
      v-model="collapsed"
      :style='{minHeight: selectHeight}'
    >
    <div class="logo" style="height:50px;background-color:transparent;">
      <span style="font-size:16px;color:#fff;margin-left:10px;line-height: 50px;" v-if="!collapsed">农芯后台数据管理</span>
    </div>
    <side-menu
      @addTab='addTab'
      :menus="menus"
      :curRoute='curRoute'
      :curKey='curId'
    >
    </side-menu>
    </a-layout-sider>
    <a-layout style="overflow:auto;">
      <a-layout-header style="background: #fff; padding: 0; min-width:1200px;box-shadow: rgba(0, 0, 0, 0.1) 0px 0px 5px;">
        <a-icon
          class="trigger"
          :type="collapsed ? 'menu-unfold' : 'menu-fold'"
          @click="()=> collapsed = !collapsed"
        />
        <a-button type="primary" icon="poweroff" @click="logout" style="float:right;margin:16px;">退出</a-button>
        <div v-if="isshows" style="float:right;cursor: pointer;" @click="tonewpage">
          <span style="margin-right:24px">
            <a-badge :count="numbers" :overflowCount="999"><a-avatar shape="square" icon="message" style="background: #2c909c;"/></a-badge>
          </span>
        </div>
      </a-layout-header>
      <!-- <a-layout-header style="background: #fff; padding: 0; margin-top: 10px;boxShadow: rgba(0, 0, 0, 0.1) 0px 0px 5px; min-width: 1200px">
        <a-tabs v-model="curKey" type='editable-card' @change='selectTab' @edit='editTab' :hideAdd='true'>
          <a-tab-pane :closable="item.id !== '0'" :tab="item.tabName" :key="item.id" v-for="item in routeArr"></a-tab-pane>
        </a-tabs>
      </a-layout-header> -->
      <a-layout-content style="box-sizing: border-box;" :style="{marginTop: '20px', minWidth: '1200px',padding: '20px',background: '#fff', transform: 'translate:(-50%, -50%)' }">
        <!-- <keep-alive :include="curRouteArr">
          <router-view @test='test'></router-view>
        </keep-alive> -->
        <router-view></router-view>
      </a-layout-content>
      <a-layout-footer style="padding: 0px">
        <global-footer />
      </a-layout-footer>
    </a-layout>
  </a-layout>
</template>
<script>
 import SideMenu from '@/components/layouts/SideMenu'
 import GlobalFooter from '@/components/layouts/GlobalFooter'
 import {mapActions,mapGetters} from 'vuex'
 import {filterNoChild} from '@/utils/TreeDataUtil'
 import {getNum} from '@/api/ddwbApi'
 import {getRoute} from '@/api/allapi.js'
 import {getWaitHandle} from '@/api/permissonApi.js'
  export default {
    name: "GlobalLayout",
    components: {
      SideMenu,
      GlobalFooter
    },
    data(){
      return {
        collapsed: false,
        routeArr: [],
        curKey: '0',
        curRoute: '',
        num:'',
        curId: '',
        isshows:false,
      }
    },
    // created(){
    //   getWaitHandle().then(res =>{
    //     if(res.success){
    //       this.isshows = true;
    //       getNum().then(res => {
    //         if(res.success){
    //           this.num=res.result;
    //         }
    //       })
    //     }
    //   })
    // },
    methods: {
      ...mapActions({
        logout:'user/logout'
      }),
      test(route) {
        this.addTab(route)
      },
      tonewpage(){
        if(this.num>0){
          this.$router.push({ name: 'xukong'})
          this.addTab({
            code: '/waitHandle',
            id: '484'
          })
        }
      },
      editTab(index) {
        let activeKey = this.curKey
        let lastIndex
        this.routeArr.forEach((pane, i) => {
          if (pane.id === index) {
            lastIndex = i - 1
          }
        })
        const routeArr = this.routeArr.filter(pane => pane.id !== index)
        if (lastIndex >= 0 && activeKey === index) {
          activeKey = routeArr[lastIndex].id
          this.selectTab(activeKey)
          this.$router.push({
            path: routeArr[lastIndex].route
          })
        }
        this.routeArr = routeArr
        this.curKey = activeKey
      },
      addTab(item) {
        // if (!this.routeArr.some(ele => ele.route === item.code)) {
        //   getRoute({
        //     code: item.code
        //   }).then(res => {
        //     if (res.success) {
        //       this.routeArr.push({
        //         route: res.result.CODE,
        //         tabName: res.result.NAME,
        //         id: res.result.id + '',
        //         name: res.result.CODE
        //       })
        //       this.selectTab(res.result.id + '')
        //       this.curKey = res.result.id + ''
        //     }
        //   })
        // } else {
        //   this.curKey = item.id + ''
        // }
      },
      selectTab(index) {
        let curRoute = ''
        for (let i = 0; i < this.routeArr.length; i++) {
          if (index === this.routeArr[i].id) {
            curRoute = this.routeArr[i].route
            this.curId = this.routeArr[i].id
          }
        }
        this.$router.push({
          path: curRoute
        })
        this.curRoute = curRoute
      }
    },
    computed :{
      menus(){
        const filterMenus = filterNoChild(this.$store.state.user.menus);
        console.log(filterMenus)
        return this.$store.state.user.menus
      },
      curWdith() {
        return document.body.clientWidth - 200 + 'px'
      },
      selectHeight() {
        return document.body.clientHeight + 'px'
      },
      numbers(){
       if(this.$store.state.user.applynumber==''){
          return this.num
       }
       return this.$store.state.user.applynumber
      },
      curRouteArr() {
        return this.routeArr.map(ele => ele.name)
      }
    },
    mounted() {
      this.$store.dispatch("user/queryMenus");
      this.$router.push({
        path: '/nxhome'
      })
      // this.routeArr.push({
      //   route: '/nxhome',
      //   tabName: '首页',
      //   id: '0',
      //   name: '/nxhome'
      // })
    }
  }
</script>
<style>
.ant-layout-header{
  text-align: left;
}
.ant-layout-content{
  text-align: left;
  padding: 0;
}
#components-layout-demo-custom-trigger {
  height:100%
}
#components-layout-demo-custom-trigger .trigger {
  font-size: 18px;
  line-height: 64px;
  padding: 0 24px;
  cursor: pointer;
  transition: color .3s;
}

#components-layout-demo-custom-trigger .trigger:hover {
  color: #1890ff;
}

#components-layout-demo-custom-trigger .logo {
  height: 32px;
  background: rgba(255,255,255,.2);
  margin: 16px;
}
</style>
