import {addMenu,updateMenu,deleteMenu} from '@/api/allapi'
import {getMenus} from '@/api/userApi'
import Vue from 'vue'
const state = {
  datas:[],
  resources:[],
}



const getters ={

}

const mutations = {
  SET_DATAS(state,datas){
    state.datas = datas
  },
  SET_RESOURCES(state,resources){
    state.resources = resources
  }
}



const actions = {
  queryMenus({commit}){
    getMenus().then(res=>{
      const result = res.result;
      commit('SET_DATAS', result)
    })
  },
  addMenu({commit},data){
    addMenu(data).then(res=>{
      if(res.success!==true) {
        commit('ADD_INFO',res.msg)
      }else{
        commit('ADD_INFO','添加成功！')
      }
    })
  },

  updateMenu({commit},data){
    return new Promise((resolve,reject) => {
      getMenus().then(response =>{
        const data = response.result;
        //const
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },




}
export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}




