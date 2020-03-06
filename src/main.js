import 'babel-polyfill'
import Vue from 'vue';
import Storage from 'vue-ls';
import 'ant-design-vue/dist/antd.css';
import Antd from 'ant-design-vue';
import App from './App.vue';
import router from './router';
import store from '@/store/index';
import '@/permission' // permission control
//import store from './storeold'
import config from '@/defaultSettings';
import iView from 'iview';
import 'iview/dist/styles/iview.css';

import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

Vue.use(iView);

Vue.config.productionTip = false;

Vue.use(Storage, config.storageOptions);
Vue.use(Antd);
new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');
