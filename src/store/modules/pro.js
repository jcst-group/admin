import {login,queryUsers,getMenus,logout,getUserList,addInfo,getFarmerlist,getProducttestlist} from '@/api/userApi'
import { ACCESS_TOKEN,USER_INFO } from "@/store/mutation-types"
import Vue from 'vue'

const state = {
  write:false,
  picCount:0,
  reportCount:0,
  recordCount:0,
  eqvData:0,
  showRecordCount:0,
  unShowRecordCount:0,
  viewUpdate:false,
  proId:undefined,
  picList:[],
}

const getters ={

}

const mutations = {
  SET_EQVDATA:(state,data)=>{
    state.eqvData=data
  },
  SET_WRITE:(state,data)=>{
   state.write=data
  },
  SET_VIEWUPDATE:(state,data)=>{
    state.viewUpdate=data
  },
  SET_PIC_COUNT: (state,token) =>{
    state.picCount = token
  },
  SET_REPORT_COUNT(state,data){
    state.reportCount = data
  },
  SET_RECORD_COUNT(state,data){
    state.recordCount = data
  },
  SET_SHOW_RECORD_COUNT(state,data){
    state.showRecordCount = data
  },
  SET_UNSHOW_RECORD_COUNT(state,data){
    state.unShowRecordCount = data
  },
  SET_PROID(state,data){
    state.proId = data
  },
  SET_PICLIST(state,data){
    state.picList = data
  },
}

const actions = {



}
export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}




