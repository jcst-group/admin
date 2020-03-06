import axios from '@/utils/request'

const BASE_PRE = '/api2';

export function login(paramter){
  return axios({
    url: BASE_PRE+'/user/login',
    method: 'post',
    data:paramter
  })
}

export function logout() {
  return axios({
    url: BASE_PRE+'/account/logout',
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

export function queryUsers(params){
  return axios({
    url: BASE_PRE+'/user/list',
    method: 'get',
    params:params
  })
}

export function checkUser(params){
  return axios({
    url: BASE_PRE+'/user/checkUser',
    method: 'get',
    params:params
  })
}


export function delbase(params){
  return axios({
    url: BASE_PRE+'/man/deleteBsm',
    method: 'get',
    params:params
  })
}

export function registUser(data){
  return axios({
    url: BASE_PRE+'/user/regist',
    method: 'post',
    params:data
  })
}

export function deleteUser(id){
  return axios({
    url: BASE_PRE+'/user/delete',
    method: 'get',
    params:id
  })
}
export function deleteproduce(id){
  return axios({
    url: BASE_PRE+'/producttest/delete',
    method: 'get',
    params:id
  })
}
export function deletefarm(id){
  return axios({
    url: BASE_PRE+'/farmer/delete',
    method: 'get',
    params:id
  })
}

export function getMenus(){
  return axios({
    //url: BASE_PRE+'/resource/menus',
    url: BASE_PRE+'/resource/getUserMenu',
    method: 'get',
    //params:id
  })
}

export function addInfo(parameter){
  return axios({
    url: BASE_PRE+'/user/add',
    method: 'post',
    data: parameter
  })
}
export function addfarm(parameter){
  return axios({
    url: BASE_PRE+'/farmer/insert',
    method: 'post',
    data: parameter
  })
}

export function updatefarm(parameter){
  return axios({
    url:BASE_PRE+'/farmer/update',
    method:'post',
    data:parameter
  })
}

export function updatefarmpw(parameter){
  return axios({
    url:BASE_PRE+'/farmer/updatePassword',
    method:'post',
    data:parameter
  })
}
export function additem(parameter){
  return axios({
    url: BASE_PRE+'/testitem/add',
    method: 'post',
    data: parameter
  })
}

export function distri(parameter){
  return axios({
    url: BASE_PRE+'/man/distri',
    method: 'post',
    data: parameter
  })
}
export function deleteservice(parameter){
  return axios({
    url: BASE_PRE+'/man/delete',
    method: 'get',
    params:parameter
  })
}
export function addservice(parameter){
  return axios({
    url: BASE_PRE+'/man/insert',
    method: 'post',
    data: parameter
  })
}
export function updateservice(parameter){
  return axios({
    url:BASE_PRE+'/man/update',
    method:'post',
    data:parameter
  })
}
export function getUserList(parameter){
  return axios({
    url: BASE_PRE+'/user/list',
    method: 'get',
    params: parameter
  })
}
export function delworkposition(parameter){
  return axios({
    url: BASE_PRE+'/man/deletePsm',
    method: 'get',
    params: parameter
  })
}
export function updateUser(parameter){
  return axios({
    url:BASE_PRE+'/user/update',
    method:'post',
    data:parameter
  })
}
export function updateproduce(parameter){
  return axios({
    url:BASE_PRE+'/producttest/update',
    method:'post',
    data:parameter
  })
}
export function distriWorkPosition(parameter){
  return axios({
    url:BASE_PRE+'/man/distriOnePosition',
    method:'post',
    data:parameter
  })
}
export function getservicepostlist(){
  return axios({
    url:BASE_PRE+'/workPosition/all',
    method:'get',
  })
}

export function getUsers(parameter){
  return axios({
    url:BASE_PRE+'/user/list',
    method:'get',
    params:parameter
  })
}
export function getFarmerlist(parameter){
  return axios({
    url:BASE_PRE+'/farmer/list',
    method:'get',
    params:parameter
  })
}

export function getServicelist(parameter){
  return axios({
    url:BASE_PRE+'/man/list',
    method:'get',
    params:parameter
  })
}
export function getProducttestlist(parameter){
  return axios({
    url:BASE_PRE+'/producttest/list',
    method:'get',
    params:parameter
  })
}


export function addpro(parameter){
  return axios({
    url:BASE_PRE+'/producttest/add',
    method:'post',
    data:parameter
  })
}

export function getworklist(parameter){
  return axios({
    url:BASE_PRE+'/workOrder/list',
    method:'get',
    params:parameter
  })
}

export function addworklist(parameter){
  return axios({
    url:BASE_PRE+'/workOrder/insert',
    method:'post',
    data:parameter
  })
}
export function updateworklist(parameter){
  return axios({
    url:BASE_PRE+'/workOrder/update',
    method:'post',
    data:parameter
  })
}

export function disbase(parameter){
  return axios({
    url:BASE_PRE+'/man/distriOneBase',
    method:'post',
    data:parameter
  })
}
export function getbaselist(parameter){
  return axios({
    url:BASE_PRE+'/baseInfo/all',
    method:'get',
    params:parameter
  })
}
export function getwalkerlist(parameter){
  return axios({
    url:BASE_PRE+'/walker/listall',
    method:'get',
    params:parameter
  })
}
export function sendorder(parameter){
  return axios({
    url:BASE_PRE+'/workOrder/sendorder',
    method:'get',
    params:parameter
  })
}
export function getDictTypeList(parameter){
  return axios({
    url:BASE_PRE+'/dictType/list',
    method:'get',
    params:parameter
  })
}
export function insertDictType(parameter){
  return axios({
    url:BASE_PRE+'/dictType/insert',
    method:'post',
    data:parameter
  })
}
export function updateDictType(parameter){
  return axios({
    url:BASE_PRE+'/dictType/update',
    method:'post',
    data:parameter
  })
}
export function deleteDictType(parameter){
  return axios({
    url:BASE_PRE+'/dictType/delete',
    method:'get',
    params:parameter
  })
}
export function insertDictionary(parameter){
  return axios({
    url:BASE_PRE+'/dictionary/insert',
    method:'post',
    data:parameter
  })
}
export function deleteDictionary(parameter){
  return axios({
    url:BASE_PRE+'/dictionary/delete',
    method:'get',
    params:parameter
  })
}
export function updateDictionary(parameter){
  return axios({
    url:BASE_PRE+'/dictionary/update',
    method:'post',
    data:parameter
  })
}
export function getSoilTestList(parameter){
  return axios({
    url:BASE_PRE+'/soiltest/list',
    method:'get',
    params:parameter
  })
}
export function insertSoilTest(parameter){
  return axios({
    url:BASE_PRE+'/soiltest/insert',
    method:'post',
    data:parameter
  })
}
export function updateSoilTest(parameter){
  return axios({
    url:BASE_PRE+'/soiltest/update',
    method:'post',
    data:parameter
  })
}
export function deleteSoilTest(parameter){
  return axios({
    url:BASE_PRE+'/soiltest/delete',
    method:'get',
    params:parameter
  })
}
export function getAllBaseInfo(parameter){
  return axios({
    url:BASE_PRE+'/batch/all',
    method:'get',
    params:parameter
  })
}
export function getBlocksByBaseId(parameter){
  return axios({
    url:BASE_PRE+'/block/getBlockByBaseId',
    method:'get',
    params:parameter
  })
}
export function insertSoilTestLotRel(parameter){
  return axios({
    url:BASE_PRE+'/soiltest/insertSoilTestLotRel',
    method:'post',
    data:parameter
  })
}
export function getBasicInfo(parameter){
  return axios({
    url:BASE_PRE+'/baseInfo/getBaseById',
    method:'get',
    params:parameter
  })
}

export function getBlockInfo(parameter){
  return axios({
    url:BASE_PRE+'/block/getBlockByBaseId',
    method:'get',
    params:parameter
  })
}


export function loginHome(parameter){
  return axios({
    url:BASE_PRE+'/nxAccount/login',
    method:'post',
    data:parameter
  })
}

export function getvaseaccountlist(parameter){
  return axios({
    url:BASE_PRE+'/baseAccount/getNxAccount',
    method:'get',
    params:parameter
  })
}
export function baseaccountdelete(parameter){
  return axios({
    url:BASE_PRE+'/baseAccount/delete',
    method:'get',
    params:parameter
  })
}
export function baseaccountadd(parameter){
  return axios({
    url:BASE_PRE+'/baseAccount/add',
    method:'post',
    data:parameter
  })
}
export function baseaccountupdate(parameter){
  return axios({
    url:BASE_PRE+'/baseAccount/update',
    method:'post',
    data:parameter
  })
}
export function baseaccountpassword(parameter){
  return axios({
    url:BASE_PRE+'/baseAccount/updatePassword',
    method:'post',
    data:parameter
  })
}
export function getfarlist(parameter){
  return axios({
    url:BASE_PRE+'/farmer/getAllFarmerName',
    method:'get',
    params :parameter
  })
}
export function bindfarbas(parameter){
  return axios({
    url:BASE_PRE+'/baseInfo/insertFarmerRelation',
    method:'post',
    data:parameter
  })
}

export function delfarbas(parameter){
  return axios({
    url:BASE_PRE+'/baseInfo/deleteFarmerRelation',
    method:'get',
    params :parameter
  })
}

export function delbasepic (parameter){
  return axios({
    url:BASE_PRE+'/baseInfo/deletePicture',
    method:'get',
    params :parameter
  })
}
export function getmap (parameter){
  return axios({
    url:BASE_PRE+'/area/getAllArea',
    method:'get',
    params :parameter
  })
}
export function getLotList (parameter){
  return axios({
    url:BASE_PRE+'/lot/getLotList',
    method:'get',
    params :parameter
  })
}
export function getLotListIn (parameter){
  return axios({
    url:BASE_PRE+'/lot/getLotListIn',
    method:'get',
    params :parameter
  })
}
export function delSoilLotRel (parameter){
  return axios({
    url:BASE_PRE+'/soiltest/delSoilLotRel',
    method:'get',
    params :parameter
  })
}
export function getEquipmentList (parameter){
  return axios({
    url:BASE_PRE+'/equipment/list',
    method:'get',
    params :parameter
  })
}
export function insertEquipment(parameter){
  return axios({
    url:BASE_PRE+'/equipment/insert',
    method:'post',
    data:parameter
  })
}
export function updateEquipment(parameter){
  return axios({
    url:BASE_PRE+'/equipment/update',
    method:'post',
    data:parameter
  })
}
export function deleteEquipment (parameter){
  return axios({
    url:BASE_PRE+'/equipment/delete',
    method:'get',
    params :parameter
  })
}
export function getEquipmentSiteList (parameter){
  return axios({
    url:BASE_PRE+'/equipment/equipmentSiteList',
    method:'get',
    params :parameter
  })
}
export function insertEquipmentSiteRel(parameter){
  return axios({
    url:BASE_PRE+'/equipment/insertEquipmentSiteRel',
    method:'post',
    data:parameter
  })
}
export function getBaseIdAndBaseName (parameter){
  return axios({
    url:BASE_PRE+'/baseInfo/getBaseIdAndBaseNameNotIn',
    method:'get',
    params :parameter
  })
}
export function deleteEquipmentSiteRel (parameter){
  return axios({
    url:BASE_PRE+'/equipment/deleteEquipmentSiteRel',
    method:'get',
    params :parameter
  })
}
export function updateEquipmentSiteRel (parameter){
  return axios({
    url:BASE_PRE+'/equipment/updateEquipmentSiteRel',
    method:'post',
    data :parameter
  })
}
export function getLotIdAndName (parameter){
  return axios({
    url:BASE_PRE+'/lot/getLotIdAndNameByBaseIdNotIn',
    method:'get',
    params :parameter
  })
}
export function getEquipmentIdAndNameList (parameter){
  return axios({
    url:BASE_PRE+'/equipment/getEquipmentIdAndNameList',
    method:'get',
    params :parameter
  })
}
export function inputCrops (parameter){
  return axios({
    url:BASE_PRE+'/common/input/crops',
    method:'get',
    params :parameter
  })
}
export function getBatchByCropId (parameter){
  return axios({
    url:BASE_PRE+'/batch/getBatchByCropId',
    method:'get',
    params :parameter
  })
}
export function getAllArea (parameter){
  return axios({
    url:BASE_PRE+'/area/getAllArea',
    method:'get',
    params :parameter
  })
}
export function getCropsByAreaCode (parameter){
  return axios({
    url:BASE_PRE+'/common/input/getCropsByAreaCode',
    method:'get',
    params :parameter
  })
}
export function getList(parameter){
  return axios({
    url:BASE_PRE+'/equipFactroy/getList',
    method:'get',
    params :parameter
  })
}
export function getEquipmentIdAndNameListNotIn(parameter){
  return axios({
    url:BASE_PRE+'/equipment/getEquipmentIdAndNameListNotIn',
    method:'get',
    params :parameter
  })
}
export function getEquipmentIdAndNameListMe(parameter){
  return axios({
    url:BASE_PRE+'/equipment/getEquipmentIdAndNameListMe',
    method:'get',
    params :parameter
  })
}
export function getBaseIdAndBaseNameMe(parameter){
  return axios({
    url:BASE_PRE+'/baseInfo/getBaseIdAndBaseNameMe',
    method:'get',
    params :parameter
  })
}
export function getLotIdAndNameByBaseIdMe(parameter){
  return axios({
    url:BASE_PRE+'/lot/getLotIdAndNameByBaseIdMe',
    method:'get',
    params :parameter
  })
}
export function getBaseIdAndBaseNames (parameter){
  return axios({
    url:BASE_PRE+'/baseInfo/getBaseIdAndBaseName',
    method:'get',
    params :parameter
  })
}
export function getLotIdAndNameByBaseIds (parameter){
  return axios({
    url:BASE_PRE+'/lot/getLotIdAndNameByBaseId',
    method:'get',
    params :parameter
  })
}

export function changeStatus (parameter){
  return axios({
    url:BASE_PRE+'/user/updateStatus',
    method:'get',
    params :parameter
  })
}

// 获取用户家庭成员
export function getFamilyMenber (parameter){
  return axios({
    url:BASE_PRE+'/familyMenber/getFamilyMemberByUid',
    method:'get',
    params :parameter
  })
}

export function deleteFamilyMenber (parameter){
  return axios({
    url:BASE_PRE+'/familyMenber/delete',
    method:'get',
    params :parameter
  })
}

export function updateFamilyMenber (parameter){
  return axios({
    url:BASE_PRE+'/familyMenber/update',
    method:'post',
    data :parameter
  })
}

export function addFamilyMenber (parameter){
  return axios({
    url:BASE_PRE+'/familyMenber/add',
    method:'post',
    data :parameter
  })
}

export function getRelation (parameter) {
  return axios({
    url:BASE_PRE+'/enum/getFamilyMenberRelationEnum',
    method:'get',
    params :parameter
  })
}

export function delpicture (parameter) {
  return axios({
    url:BASE_PRE+'/pictureInfo/delete',
    method:'get',
    params :parameter
  })
}

