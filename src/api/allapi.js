import { getAction,postAction} from '@/api/manage'

/**
 *  公共模块
 */

// 获取顶部天气接口
const getWeather = params => getAction('/weather/getWeatherArea', params)

const getFileByBatchId = (params)=>getAction("/nxFileInfo/getFileByBatchId",params);
const deleteFileById = (params)=>getAction("/nxFileInfo/delete",params);


const addMenu = (params)=>postAction("/resource/add",params);
const allmenus = (params)=>getAction("/resource/getUserMenu",params);
const updateMenu = (params)=>postAction("/resource/update",params);
const deleteMenu = (params)=>getAction("/resource/delete",params);

const queryEnv = (params)=>getAction("/envmonitor/listBySiteId",params);
const envmonitorList = (params)=>getAction("/envmonitor/list",params);
const deleteEnv = (params)=>getAction("/envmonitor/delete",params);
const saveEnv = (params)=>postAction("/envmonitor/save",params);
const updateEnv = (params)=>postAction("/envmonitor/update",params);

const queryWalker = (params)=>getAction("/walker/list",params);
const deleteWalker = (params)=>getAction("/walker/delete",params);
const saveWalker = (params)=>postAction("/walker/add",params);
const updateWalker = (params)=>postAction("/walker/update",params);

const addItem = (params)=>postAction("/testitem/add",params);
const updateItem = (params)=>postAction("/testitem/update",params);
const deleteItem = (params)=>getAction("/testitem/delete",params);

const queryBase = (params)=>getAction("/baseInfo/list",params);
const queryAllBase = (params)=>getAction("/baseInfo/all",params);
const updateBase = (params)=>postAction("/baseInfo/update",params);
const insertBase = (params)=>postAction("/baseInfo/insert",params);
const deleteBase = (params)=>getAction("/baseInfo/delete",params);

const queryFarmer = (params)=>getAction("/farmer/list",params);

const queryBaseById = (params)=>getAction("/baseInfo/queryBaseInfoById",params);
const deleteBlock = (params)=>getAction("/block/delete",params);
const getBlockByBaseId = (params)=>getAction("/lot/all",params);
const blockAdd = (params)=>postAction("/block/add",params);
const blockUpdate = (params)=>postAction("/block/update",params);

const queryBatch = (params)=>getAction("/cropBatch/list",params);
const batchAdd = (params)=>postAction("/cropBatch/add",params);
const batchUpdate = (params)=>postAction("/cropBatch/update",params);
const batchDelete = (params)=>getAction("/cropBatch/delete",params);
const getBatchCount = (params)=>getAction("/batch/getBatchCount",params);
const selectByBaseId = (params)=>getAction("/batch/selectByBaseId",params);
const getBatchEnvironment = (params)=>getAction('/batchEnvironment/getBatchEnvironment',params);
const getPlanDatas = (params) => getAction('/plantingPlan/selectByCropIdAndCalId', params)
const getLotScale = (params) => getAction('/lot/getLotScale', params)

const workerOrderDelete = (params)=>getAction("/workOrder/delete",params);
const selectWorkOrderByBatchId = (params)=>getAction("/workOrder/selectWorkOrderByBatchId",params);

const farmingRecordAll = (params)=>getAction("/farmingRecord/all",params);
const farmingRecordDelete = (params)=>getAction("/farmingRecord/delete",params);
const farmingRecordList = (params)=>getAction("/farmingRecord/list",params);
const farmingRecordInsert = (params)=>postAction("/farmingRecord/insert",params);
const farmingRecordUpdate = (params)=>postAction("/farmingRecord/update",params);

const picDelete = (params)=>getAction("/pictureInfo/delete",params);
const basepicDelete = (params)=>getAction("/basePanorama/delete",params);
const updatebasepic = (params)=>postAction("/basePanorama/update",params);

const getAgriculturalPro = (params)=>getAction("/anadromous/agriculturalPro/getAgriculturalPro",params);
const addAgriculturalPro = (params)=>postAction("/anadromousManage/addAgriculturalPro",params);
const updateAgriculturalPro = (params)=>postAction("/anadromousManage/updateAgriculturalPro",params);
const proAddPicture = (params)=>postAction("/anadromousManage/addPicture",params);
const getRecordByBatchId = (params)=>getAction("/anadromous/agriculturalPro/getFarmingRecord",params);

const getAllByBatchId = (params)=>getAction("/farmingRecord/getFarmingRecord",params);
const updateStatus = (params)=>getAction("/farmingRecord/updateStatus",params);
const packagingBatch = (params)=>postAction("/batch/packagingBatch",params);
const addShop= (params)=>postAction("/baseShop/add",params);
const updateShop= (params)=>postAction("/baseShop/update",params);
const updatebaseshop= (params)=>postAction("/baseShop/updateBaseShopRel",params);

//异步校验
const basenamecheck = (params)=>getAction("/baseInfo/checkBaseName",params);
const sernumcheck = (params)=>getAction("/walker/checkPhone",params);
const baseacountcheck = (params)=>getAction("/baseAccount/checkAccount",params);
const farmnumcheck = (params)=>getAction("/farmer/checkPhone",params);
const seraccountcheck = (params)=>getAction("/man/checkAccount",params);
const shopurlcheck = (params)=>getAction("/baseShop/checkByUrl",params);

//权限管理
const getpermission = (params)=>getAction("/resource/getAllResource",params);
const delpermission = (params)=>getAction("/resource/delete",params);
const addpermission = (params)=>postAction("/resource/addBackstageResource",params);
const updatepermission = (params)=>postAction("/resource/updateBackstageResource",params);
const getallpermission = (params)=>getAction("/role/all",params);
const adduserrole = (params)=>postAction("/user/addRoleToUser",params);
const selrole = (params)=>getAction("/role/userRole",params);

const test =(params)=>getAction("test/getFileUrl",params);

const showpicture =(params)=>getAction("/upload/show",params);
const landlist =(params)=>getAction("/common/input/lands",params);
const soillist =(params)=>getAction("/common/input/soils",params);
const getbase =(params)=>getAction("/baseInfo/getBaseInfosByAreaCode",params);
const updatepd = (params)=>postAction("/walker/updatePassword",params);
const getrecord =(params)=>getAction("/farmingRecord/selectByWorkOrderId",params);
const getrecordByBO = (params)=>getAction("/farmingRecord/selectByWorkOrderIdOrBatchId",params);
const getpici =(params)=>getAction("/batch/getIdAndNameByBaseId",params);
const getjihua =(params)=>getAction("/workOrder/selectWorkOrderByBatchId",params);

const costInsert =(params)=>postAction("/farmingCost/insert",params);
const costUpdate =(params)=>postAction("/farmingCost/update",params);

const delmomey =(params)=>getAction("/farmingCost/delete",params);


// 费用接口
const insertLabourCost = (params) => postAction("/labourCost/insert", params)
const insertPesticidesCost = (params) => postAction("/pesticidesCost/insert", params)
const insertManuresCost = (params) => postAction("/manureCost/insert", params)

const updatelabourCost = (params) => postAction("/labourCost/update", params)
const updatepesticidesCost = (params) => postAction("/pesticidesCost/update", params)
const updatemanureCost = (params) => postAction("/manureCost/update", params)

const deletelabourCost = (params) => getAction('/labourCost/delete', params)
const deletepesticidesCost = (params) => getAction('/pesticidesCost/delete', params)
const deletemanureCost = (params) => getAction('/manureCost/delete', params)

const addtest =(params)=>postAction("/batch/addBatchEnvironment",params);
const gettest =(params)=>getAction("/batch/getEnvironmentByBatchId",params);





// 获取农事下拉列表
const getAllFarming =(params)=>getAction("/farmingItem/all",params);
const getAllHou =(params)=>getAction("/enum/getHouEnum",params);
const getAllLocation =(params)=>getAction("/enum/getLocationEnum",params);
const getAllJieqi =(params)=>getAction("/enum/getSolarTermsEnum",params);
const getFarmByCrop = (params) => getAction("/farmingItem/getFarmingItemByCropId", params) 

const getAllPlan = (params)=>getAction("/plantingPlan/all",params);
const getAllBatch = (params) => getAction('/seed/all', params)
const getSeedAndBatch = (params) => getAction('/seed/getSeedAndBatch', params)

//溯源管理
const getProTrace = (params) => getAction('proTraceability/getProTraceability', params)
const addProTrace = (params) => postAction('proTraceability/add', params)
const getOrderByBatch = (params) => getAction('workOrder/getOrderByBatchId', params)
const addBatchEnvironment = (params) => postAction('/batchEnvironment/add', params)
const getSourceUrl = (params) => getAction('/common/getTraceabilityUrl', params)

// 工作总结
const addProjectManage = params => postAction('/projectManage/add', params)
const getProjectManage = params => getAction('/projectManage/list', params)
const deleteProjectManage = params => getAction('/projectManage/delete', params)
const getWorkStatus = params => getAction('/enum/getThemeEnum', params)
const getThemeManage = params => getAction('/themeManage/list', params)
const deleteThemeManage = params => getAction('/themeManage/delete', params)
const updateThemeManage = params => postAction('/themeManage/update', params)
const addThemeManage = params => postAction('/themeManage/add', params)
const updateThemeStauts = params => getAction('/themeManage/updateStatus', params)
const getProjectData = params => getAction('/projectManage/selectByParentId', params)
const deleteFile = params => getAction('/fileInfo/delete', params)

export {
  getWeather,

  getFileByBatchId,
  deleteFileById,

  addMenu,
  allmenus,
  updateMenu,
  deleteMenu,

  queryEnv,
  envmonitorList,
  deleteEnv,
  saveEnv,
  updateEnv,

  queryWalker,
  deleteWalker,
  saveWalker,
  updateWalker,

  addItem,
  updateItem,
  deleteItem,

  queryBase,
  queryAllBase,
  updateBase,
  insertBase,
  deleteBase,

  queryFarmer,

  queryBaseById,
  getBlockByBaseId,
  blockAdd,
  blockUpdate,
  deleteBlock,

  queryBatch,
  batchAdd,
  batchUpdate,
  batchDelete,
  getBatchCount,
  selectByBaseId,
  getBatchEnvironment,
  getPlanDatas,
  getLotScale,

  workerOrderDelete,
  selectWorkOrderByBatchId,

  farmingRecordAll,
  farmingRecordDelete,
  farmingRecordList,
  farmingRecordInsert,
  farmingRecordUpdate,

  picDelete,
  basepicDelete,
  updatebasepic,

  getAgriculturalPro,
  addAgriculturalPro,
  updateAgriculturalPro,
  proAddPicture,

  getAllByBatchId,
  updateStatus,
  packagingBatch,

  basenamecheck,
  sernumcheck,
  baseacountcheck,
  farmnumcheck,
  seraccountcheck,
  shopurlcheck,


  getpermission,
  delpermission,
  updatepermission,
  addpermission,
  getallpermission,
  adduserrole,
  selrole,
  addShop,
  updateShop,
  updatebaseshop,
  test,

  showpicture,
  landlist,
  soillist,
  getbase,
  updatepd,
  getrecord,
  getrecordByBO,
  getpici,
  getjihua,

  costInsert,
  costUpdate,
  delmomey,


  insertLabourCost,
  insertPesticidesCost,
  insertManuresCost,

  updatelabourCost,
  updatepesticidesCost,
  updatemanureCost,
  
  deletelabourCost,
  deletepesticidesCost,
  deletemanureCost,

  addtest,
  gettest,

  getAllFarming,
  getFarmByCrop,
  getAllLocation,
  getAllJieqi,
  getAllHou,
  getAllPlan,
  getAllBatch,
  getSeedAndBatch,

  getProTrace,
  addProTrace,
  getOrderByBatch,
  addBatchEnvironment,
  getSourceUrl,

  addProjectManage,
  getProjectManage,
  deleteProjectManage,
  getWorkStatus,
  getThemeManage,
  addThemeManage,
  updateThemeManage,
  deleteThemeManage,
  updateThemeStauts,
  getProjectData,
  deleteFile
}
