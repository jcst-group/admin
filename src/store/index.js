/*import Vue from 'vue'
import Vuex from 'vuex'
import product from './modules/product'
import api from '@/api/allapi'
Vue.use(Vuex);

export default new Vue.Store({
  /!*modules: {
    product
  },*!/
});*/

import Vue from 'vue';
import Vuex from 'vuex';
import product from './modules/product'
import pro from './modules/pro'
import user from './modules/user'
import resource from './modules/resource'
Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    product:product,
    user:user,
    resource:resource,
    pro:pro,
  }
});
