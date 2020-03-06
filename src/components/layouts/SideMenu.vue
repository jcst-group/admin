<template>
    <a-menu
      mode="inline"
      theme="dark"
      :inlineCollapsed="collapsed"
      style="padding-bottom:40px"
    >
      <template v-for="item in menus">
        <a-menu-item v-if="item.children == undefined" :key="item.id">
          <router-link :to=item.code><span>{{item.name}}</span></router-link>
        </a-menu-item>
        <sub-menu v-bind="$attrs" v-on="$listeners" v-else :menu-info="item" :key="item.id"/>
      </template>
    </a-menu>
</template>

<script>
  import SubMenu from './SubMenu'
  export default {
    components: {
      'sub-menu': SubMenu,
    },
    data () {
      return {
        collapsed: false,
      }
    },
    props: {
      menus: {
        type: Array,
        required: true
      }
    },
    inheritAttrs: false,
    methods: {
      toggleCollapsed () {
        this.collapsed = !this.collapsed
      }
    },
  }
</script>
<style>
.ant-menu-submenu-title{
  text-align: left;
}
</style>

