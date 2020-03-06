//import api from '@/api/allapi';
import {queryUsers} from '@/api/userApi'

const state = {
  all: []
}

const getters ={

}

/**
 * mutations是唯一改为state的办法
 * 每个 mutation 都有一个字符串的 事件类型 (type) 和 一个 回调函数 (handler)。
 * 并且它会接受 state 作为第一个参数
 * @type {{setProducts()}}
 */
const mutations = {
  setProducts(state,products) {
    state.all = products
  }
}

/**
 *     Action 提交的是 mutation，而不是直接变更状态。
 *     Action 可以包含任意异步操作。
 *     Action 函数接受一个与 store 实例具有相同方法和属性的 context 对象，
 *     因此你可以调用 context.commit 提交一个 mutation，
 *     或者通过 context.state 和 context.getters 来获取 state 和 getters。
 * @type {{}}
 */
/*const actions = {
  getxx(context){
    api.getProducts(prducts =>{
      context.commit('setProducts',prducts);
    });
    const param = {}
    queryUsers(param).then(response=>{
      console.log(response)
    })
  }
}*/

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  //actions
}
