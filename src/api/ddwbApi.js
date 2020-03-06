import { getAction,postAction} from '@/api/manage'

const getBaseList = (params)=>getAction("/baseInfo/list",params);
const getBaseListAll = (params)=>getAction("/baseInfo/selectAll",params);
const delBase = (params)=>getAction("/baseInfo/delete",params);
const getBaseTypeEnum = (params)=>getAction("/enum/getBaseTypeEnum",params);
const getBaseCategoryEnum = (params)=>getAction("/enum/getCategoryEnum",params);
const getChinaArea = (params)=>getAction("/area/getAreaByLevel",params);
const getSecondArea = (params)=>getAction("/area/getAreaByParentCode",params);
const getSoilTypeEnum = (params)=>getAction("/enum/getSoilTypeEnum",params);
const getBaseAllTest = (params)=>getAction("/envStandards/all",params);
const addBase = (params)=>postAction("/baseInfo/add",params);
const editBase = (params)=>postAction("/baseInfo/update",params);
const getEnvStandards = (params)=>getAction("/enum/getEnvStandardsEnum",params);
const getEnvStandardsList = (params)=>getAction("/envStandards/list",params);
const delEnvStandards = (params)=>getAction("/envStandards/delete",params);
const getUnit = (params)=>getAction("/enum/getDetectionUnitEnum",params);
const addEnvStandards = (params)=>postAction("/envStandards/add",params);
const editEnvStandards = (params)=>postAction("/envStandards/update",params);
const addBaseUser = (params)=>postAction("/baseUserRel/add",params);
const delBaseUser = (params)=>getAction("/baseUserRel/delete",params);
const getBaseUserList = (params)=>getAction("/baseUserRel/list",params);
const getALLBaseList = (params)=>getAction("/baseInfo/all",params);
const getALLBaseUserList = (params)=>getAction("/user/all",params);
const getALLBaseUserandrole = (params)=>getAction("/user/getUserAndRole",params);
const getPlotList = (params)=>getAction("/lot/list",params);
const delPlot = (params)=>getAction("/lot/delete",params);
const addPlot = (params)=>postAction("/lot/add",params);
const editPlot = (params)=>postAction("/lot/update",params);
const getAllUser = (params)=>getAction("/user/all",params);
const getPlotById= (params)=>getAction("/lot/getLotById",params);
const delPic= (params)=>getAction("/pictureInfo/delete",params);
const getScaleByPlot = (params) => getAction('/lot/getLotScaleByLotId', params);
const getUnitByCrop = (params) => getAction('/calculateUnit/selectByCropId', params)
const addCropScale = (params) => postAction('/lot/addLotScale', params)
const updateCropScale = (params) => getAction('/lot/updateLotScale', params)
const deleteCropScale = (params) => getAction('/lot/deleteLotScale', params)
const getCropList= (params)=>getAction("/crop/list",params);
const addCrop = (params)=>postAction("/crop/add",params);
const delCrop= (params)=>getAction("/crop/delete",params);
const editCrop = (params)=>postAction("/crop/update",params);
const getPucType= (params)=>getAction("/enum/getHarvestedTypeEnum",params);
const getBaseWithoutUser= (params)=>getAction("/baseInfo/getBaseWithoutUser",params);
const getBaseListbyid = (params)=>getAction("/baseInfo/selectByPrimaryKey",params);
const getallplan = (params)=>getAction("/plantingPlan/all",params);
const getBatchByPlanId = (params)=>getAction("/cropBatch/getBatchByPlanId",params);
const getBudgetList = (params)=>getAction("/budget/list",params);
const delCsp = (params)=>getAction("/harvestedPro/delete",params);
const getAllCrop = (params)=>getAction("/crop/all",params);
const getAllBusiness = (params)=>getAction("/budget/getBusinessReport",params);
const getAllFarm = (params)=>getAction("/user/getFarmer",params);


/*公司信息管理*/
const getCompanyList = (params)=>getAction("/companyInfo/list",params);
const addCompany = (params)=>postAction("/companyInfo/insert",params);
const updateCompany = (params)=>postAction("/companyInfo/update",params);
const delCompany = (params)=>getAction("/companyInfo/delete",params);
/*公司信息管理*/

/*愿景信息管理*/
const getCompanyExpect = (params)=>getAction("/companyExpect/list",params);
const addCompanyExpect = (params)=>postAction("/companyExpect/add",params);
const delCompanyExpect = (params)=>getAction("/companyExpect/delete",params);
const updateCompanyExpect = (params)=>postAction("/companyExpect/update",params);
/*愿景信息管理*/


/*用肥情况管理*/
const getFertilizersList = (params)=>getAction("/fertilizers/list",params);
const addFertilizers = (params)=>postAction("/fertilizers/insert",params);
const updateFertilizers = (params)=>postAction("/fertilizers/update",params);
const delFertilizers = (params)=>getAction("/fertilizers/delete",params);
/*用肥情况管理*/ 
const delFile = (params)=>getAction("/fileInfo/delete",params);

/*设备管理*/
const addEquipment = (params)=>postAction("/equipment/insert",params);
const updateEquipment = (params)=>postAction("/equipment/update",params);
const delEquipment = (params)=>getAction("/equipment/delete",params);
const getEquipmentList =(params)=>getAction("/equipment/list",params);
/*设备管理*/

/*预警值*/
const addWarnEnv = (params)=>postAction("/warnEnv/insert",params);
const updateWarnEnv = (params)=>postAction("/warnEnv/update",params);
const delWarnEnv =(params)=>getAction("/warnEnv/delete",params);
const getWarnEnvList =(params)=>getAction("/warnEnv/list",params);
const getEquipmentIdAndNameList =(params)=>getAction("/equipment/getEquipmentIdAndNameList",params);
/*预警值*/

const changeStatus = (params) => getAction("/warnEnv/updateStatus", params)
const getOrderLocal =(params)=>getAction("/workOrder/getOrderLocal",params);
/*监测数据*/
const getEnvmonitorList = (params)=>getAction("/envmonitor/list",params);
const delEnvmonitor = (params)=>getAction("/envmonitor/delete",params);
const getEnvChart = (params)=>getAction("/envmonitor/getEnvChart",params); 
/*监测数据*/

/*监测设备校验*/
const checkEquipment = (params)=>getAction("/equipment/checkId",params);
/*监测设备校验*/

/*服务团队*/
const getTeamList = (params)=>getAction("/team/list",params);
const delTeam = (params)=>getAction("/team/delete",params);
const addTeam = (params)=>postAction("/team/insert",params);
const updateTeam = (params)=>postAction("/team/update",params);
/*服务团队*/

/*监控设备*/
const addVideoEquipment = (params)=>postAction("/videoEquipment/insert",params);
const updateVideoEquipment = (params)=>postAction("/videoEquipment/update",params);
const delVideoEquipment = (params)=>getAction("/videoEquipment/delete",params);
const getVideoEquipmentList = (params)=>getAction("/videoEquipment/list",params);
const getVideoEquipment = (params)=>getAction("/videoEquipment/getList",params);
/*监控设备*/

/*通道与基地对应关系*/
const addVideoChannel = (params)=>postAction("/videoChannel/insert",params);
const updateVideoChannel = (params)=>postAction("/videoChannel/update",params);
const delVideoChannel = (params)=>getAction("/videoChannel/delete",params);
const getVideoChannelList = (params)=>getAction("/videoChannel/list",params);
/*通道与基地对应关系*/

// 监测数据异常
const warnData = (params)=>getAction("/warnRecord/getWarnRecord",params);
const getDeviceBase = (params)=>getAction("/baseInfo/getBaseEquipment",params);

// 监测数据缺失
const loseData = (params) => getAction("/monitorLack/list", params)

// 计量单位管理
const getUnitList = (params) => getAction('/calculateUnit/list', params)
const addUnitList = (params) => postAction('/calculateUnit/add', params)
const updateUnitList = (params) => postAction('/calculateUnit/update', params)
const deleteUnitList = (params) => getAction('/calculateUnit/delete', params)

// 药材管理
const getAllUnit = (params) => getAction('/calculateUnit/all', params)
//获取有监控设备的基地
const getBaseEquipment = (params) => getAction("/baseInfo/getBaseEquipment",params)

//获取监控视频的token
const getYsToken = (params) => getAction("/common/getYsToken",params)

//获取所有监控设备
const getVideoList = (params)=>getAction("/videoEquipment/getVideoList",params);

/*内容管理系统*/
const categoryAdd = (params)=>postAction("/category/add",params);
const categoryDel = (params)=>getAction("/category/delete",params);
const categoryList = (params)=>getAction("/category/list",params);
const categoryUpdate = (params)=>postAction("/category/update",params);
const articleList = (params)=>getAction("/article/list",params); 
const articleAdd = (params)=>postAction("/article/add",params); 
const articleUpdate = (params)=>postAction("/article/update",params); 
const articleDel = (params)=>getAction("/article/delete",params); 
const delCPic = (params)=>getAction("/pictureInfo/delete",params);
const selById = (params)=>getAction("/article/selectById",params);
/*内容管理系统*/

/*果实颜色*/
const getFruitColorEnum = (params)=>getAction("/enum/getFruitColorEnum",params);
/*果实颜色*/

export {
  getFruitColorEnum,
  addCompanyExpect,
  delCompanyExpect,
  updateCompanyExpect,
  getCompanyExpect,
  selById,
  articleUpdate,
  articleDel,
  delCPic,
  articleAdd,
  articleList,
  categoryUpdate,
  categoryList,
  categoryDel,
  categoryAdd,
  getVideoList,
  getYsToken,
  getBaseEquipment,
  addVideoChannel,
  updateVideoChannel,
  delVideoChannel,
  getVideoChannelList,

  addVideoEquipment,
  updateVideoEquipment,
  delVideoEquipment,
  getVideoEquipmentList,
  getVideoEquipment,

  getTeamList,
  delTeam,
  addTeam,
  updateTeam,

  checkEquipment,
  getBaseListAll,
  /*******/
  getEnvmonitorList,
  delEnvmonitor,
  getEnvChart,
  /*******/

  changeStatus,
  getOrderLocal,
  getAllFarm,
  getEquipmentIdAndNameList,
  /********/
  addWarnEnv,
  updateWarnEnv,
  delWarnEnv,
  getWarnEnvList,
  /********/

  /********/
  addEquipment,
  updateEquipment,
  delEquipment,
  getEquipmentList,
  /********/

  /********/
  getCompanyList,
  addCompany,
  updateCompany,
  delCompany,
 /********/
  
 /*******/
 getFertilizersList,
 addFertilizers,
 updateFertilizers,
 delFertilizers,
 /*******/
 delFile,

  getBaseList,
  delBase,
  getBaseTypeEnum,
  getBaseCategoryEnum,
  getChinaArea,
  getSecondArea,
  getSoilTypeEnum,
  getBaseAllTest,
  addBase,
  editBase,
  getEnvStandards,
  getEnvStandardsList,
  delEnvStandards,
  getUnit,
  addEnvStandards,
  editEnvStandards,
  addBaseUser,
  delBaseUser,
  getBaseUserList,
  getALLBaseList,
  getALLBaseUserList,
  getALLBaseUserandrole,
  getPlotList,
  delPlot,
  addPlot,
  editPlot,
  getAllUser,
  getPlotById,
  delPic,
  getScaleByPlot,
  getUnitByCrop,
  addCropScale,
  updateCropScale,
  deleteCropScale,
  getCropList,
  addCrop,
  delCrop,
  editCrop,
  getPucType,
  getBaseWithoutUser,
  getBaseListbyid,
  getallplan,
  getBatchByPlanId,
  getBudgetList,
  delCsp,
  getAllCrop,
  getAllBusiness,

  warnData,
  getDeviceBase,

  loseData,

  getUnitList,
  addUnitList,
  updateUnitList,
  deleteUnitList,
  getAllUnit
}
