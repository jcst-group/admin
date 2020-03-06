import Vue from 'vue';
import Vuex from 'vuex';
import api from '@/api/allapi'
Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    token: '',
    count: 0,
    all:[
      {"id": 1, "title": "iPad 4 Mini", "price": 500.01, "inventory": 2}
    ]
  },
  getters:{
    getTokenLength:state=>{
      return state.token.length;
    }
  },
  mutations: {
    increase() {
      this.state.count = this.state.count + 1;
    },
    gettoken() {
      this.state.token = this.state.token +'xx';
    },
    setProducts(state,products){
      state.all = products
    }
  },
  actions: {
    increase(context){
      context.commit("increase");
    },
    getProducts(context){
      api.getProducts(prducts =>{
        context.commit('setProducts',prducts);
      });
    }
  },
});
