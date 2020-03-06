import Vue from 'vue'
import axios from 'axios'
import store from '@/store'
import {Modal, notification} from 'ant-design-vue'
import { ACCESS_TOKEN } from "@/store/mutation-types"
import qs from	'qs'

const service = axios.create({
  timeout:5000
})

const err = (error) => {
  if (error.response) {
    let data = error.response.data
    const token = Vue.ls.get(ACCESS_TOKEN)
    switch (error.response.status) {
      case 403:
        notification.error({ message: '系统提示', description: '拒绝访问',duration: 4})
        break
      case 500:
        //notification.error({ message: '系统提示', description:'Token失效，请重新登录!',duration: 4})
        if(data.message=="Token失效，请重新登录"){
          // update-begin- --- author:scott ------ date:20190225 ---- for:Token失效采用弹框模式，不直接跳转----
          // store.dispatch('Logout').then(() => {
          //     window.location.reload()
          // })
          Modal.error({
            title: '登录已过期',
            content: '很抱歉，登录已过期，请重新登录',
            okText: '重新登录',
            mask: false,
            onOk: () => {
              store.dispatch('user/logout').then(() => {
                window.location.reload()
              })
            }
          })
          // update-end- --- author:scott ------ date:20190225 ---- for:Token失效采用弹框模式，不直接跳转----
        }
        break
      case 404:
        notification.error({ message: '系统提示', description:'很抱歉，资源未找到!',duration: 4})
        break
      case 504:
        notification.error({ message: '系统提示', description: '网络超时'})
        break
      case 401:
        notification.error({ message: '系统提示', description:'该账号无此权限!',duration: 4})
        if (token) {
          store.dispatch('logout').then(() => {
            setTimeout(() => {
              window.location.reload()
            }, 1500)
          })
        }
        break
      default:
        notification.error({
          message: '系统提示',
          description: data.message,
          duration: 4
        })
        break
    }
  }
  return Promise.reject(error)
};

service.interceptors.request.use(config=>{
    const token = Vue.ls.get(ACCESS_TOKEN);
    //const token = 'xx';
    // console.log("service.interceptors.request config");
    // console.log(config);
    if(token){
      config.headers['X-Access-Token'] = token
      if(config.method === 'get'){
        //如果是get请求，且params是数组类型如arr=[1,2]，则转换成arr=1&arr=2
        config.paramsSerializer = function(params) {
            return qs.stringify(params, {arrayFormat: 'repeat'})
        }
      }
    }

    return config
  },(error) =>{
    return Promise.reject(error)
  }
)
service.interceptors.response.use(
  response=>{
    // console.log("interceptors.response:", response)
    return response.data
  },err)




export  default service
