<template>

  <a-sub-menu
    :key="menuInfo.key"
    v-bind="$props"
    v-on="$listeners"
  >
    <span slot="title">
      <span>{{ menuInfo.name }}</span>
    </span>
    <template v-for="item in menuInfo.children">
      <a-menu-item
        v-if="item.children == undefined"
        :key="item.id"
        @click="addTab(item)"
      >
        <router-link :to=item.code><span>{{ item.name }}</span></router-link>
      </a-menu-item>
      <sub-menu
        v-else
        :key="item.id"
        :menu-info="item"
      />
    </template>
  </a-sub-menu>
</template>
<script>
  import { Menu } from 'ant-design-vue';
  export default {
    name: 'SubMenu',
    // must add isSubMenu: true
    // isSubMenu: true,
    props: {
      ...Menu.SubMenu.props,
      // Cannot overlap with properties within Menu.SubMenu.props
      menuInfo: {
        type: Object,
        default: ()=>({}),
      },
    },
    methods: {
      addTab(item) {
        this.$emit('addTab', item)
      }
    }
  };
</script>
