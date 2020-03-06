import {login,queryUsers,getMenus,logout,getUserList,addInfo,getFarmerlist,getProducttestlist} from '@/api/userApi'
import { ACCESS_TOKEN,USER_INFO } from "@/store/mutation-types"
import Vue from 'vue'

const state = {
  users:[],
  token: '',
  username:'',
  avatar: '',
  info: {},
  menus:[],
  userData:{},
  worklist:[],
  //addinfo:"",
  editlist:[],
  //olddata:{},
  farmData:{},
  protestlist:{}
}

const getters ={

}

const mutations = {
  SET_PROTESTLIST:(state,data)=>{
   state.protestlist=data
  },
  SET_TOKEN: (state,token) =>{
    state.token = token
  },
  SET_NAMEANDAVATAR(state,{username,avatar}){
    state.avatar = avatar
    state.username = username
  },
  SET_INFO(state,info){
    state.info = info
  },
  SET_USERS(state,users){
    state.users = users
  },
  SET_MENUS(state,menus){
    state.menus = menus
  },
  SET_USER: (state, userData) => {
    state.userData=userData
  },
  SET_FARM:(state, farmData) => {
    state.farmData=farmData
  },
 /* ADD_INFO:(state,info)=>{
    state.addinfo=info
  },*/
  SET_EDITLIST:(state,data)=>{
    state.editlist=data
  },
  SET_WORKLIST:(state,data)=>{
    state.worklist=data
  }
 /* SET_OLDDATA:(state,olddata)=>{
    state.olddata=olddata
  }*/
}

const actions = {
  getproducttestlist({commit},data){
    getProducttestlist(data).then(res=>{
      commit('SET_PROTESTLIST',res.result)
    })
  },
  getfarmlist({commit},data){
    getFarmerlist(data).then(res=>{
      commit('SET_FARM',res.result)
    })
  },
  getlist({ commit },data) {
    getUserList(data).then(res=>{
      const userdata = res.result
      commit('SET_USER', userdata)
    })
  },
  /*adduser({commit},data){
    addInfo(data).then(res=>{
      if(res.success==true) {
        commit('ADD_INFO','添加成功！')
      }else{
        commit('ADD_INFO',res.message)
      }
    })
},*/

  login({commit},userInfo){
    return new Promise((resolve,reject) => {
      login(userInfo)
        .then(response => {
          if (response.code == '200') {
            const result = response.result;
            Vue.ls.set(ACCESS_TOKEN, result.token, 7 * 24 * 60 * 60 * 1000)
            commit('SET_TOKEN', result.token)
            resolve()
          } else {
            reject(response)
          }
        })
        .catch(error => {
          reject(error)
        })
    })
  },
// 登出
  logout({ commit, state }) {
    return new Promise((resolve) => {
      commit('SET_TOKEN', '')
      Vue.ls.remove(ACCESS_TOKEN)
      logout(state.token).then(() => {
        resolve()
      }).catch(() => {
        resolve()
      })
    })
  },
//查询用户列表
  queryUsers({commit},params){
    return new Promise((resolve,reject) => {
      queryUsers(params).then(response =>{
        //const data = response.data;
        const result = response.result;
        commit("SET_USERS",result.list)
      }).catch(error => {
        reject(error)
      })
    })
  },
//更新用户
  updateUsers({commit},data){

  },

  queryMenus({commit}){
    return new Promise((resolve,reject) => {
      getMenus().then(response =>{
        console.log(response)
        const data = response.result;
        commit("SET_MENUS",data)
        //const
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




