import axios from '@/utils/request'
const BASE_PRE = '/api2'
//post
export function postAction(url,parameter) {
  return axios({
    url: BASE_PRE+url,
    method:'post' ,
    data: parameter
  })
}

//get
export function getAction(url,parameter) {
  return axios({
    url: BASE_PRE+url,
    method: 'get',
    params: parameter
  })
}
