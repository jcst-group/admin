import { getAction,postAction} from '@/api/manage'
import { get } from 'https';

/**
 *  权限有关的api
 */
const queryUserMenu = (params)=>getAction("",params);

const roleResource = (params)=>getAction("/resource/list",params);
const roleQuery = (params)=>getAction("/role/list",params);
const roleAdd = (params)=>postAction("/role/add",params);
const roleUpdate = (params)=>postAction("/role/update",params);
const roleDelete = (params)=>getAction("/role/delete",params);
const roleResourceUpdate = (params)=>postAction("/role/addResourceToRole",params);
const getAllRoleType = (params)=>getAction("/enum/getAllRoleTypeEnum",params);

// 检测标准
const addStandard = (params)=>postAction("/detectionItems/add",params);
const updateStandard = (params)=>postAction("/detectionItems/update",params);
const deleteStandard = (params)=>getAction("/detectionItems/delete",params);
const getStandard = (params)=>getAction("/detectionItems/list",params);

//检测标准的选择
const getAllCrop = (params)=>getAction("/crop/all",params);
const getAllCategory = (params)=>getAction("/enum/getDetectionCategoryEnum",params);
const getAllStage = (params)=>getAction("/enum/getDetectionStageEnum",params);
const getAllUnit = (params)=>getAction("/enum/getDetectionUnitEnum",params);

const roleType = (params) => getAction('/enum/getRoleTypeEnum', params)

// 所有权限
const boardResource = (params) => getAction('/showResource/list', params)
const appResource = (params) => getAction('/appResource/list', params)

// 种植计划
const getAllPlan = (params)=>getAction("/plantingPlan/list",params);
const addPlatingPlan = (params)=>postAction("/plantingPlan/add",params);
const updatePlatingPlan = (params)=>postAction("/plantingPlan/update",params);
const deletePlatingPlan = (params)=>getAction("/plantingPlan/delete",params);
const copyPlan = (params) => getAction("/plantingPlan/copyPlan",params);

// 农事活动
const getAllFarming = (params)=>getAction("/farming/list",params);
const addFarming = (params)=>postAction("/farming/add",params);
const updateFarming = (params)=>postAction("/farming/update",params);
const deleteFarming = (params)=>getAction("/farming/delete",params);
const getAllPlanYear = (params)=>getAction("/planYear/getPlanYearByPlanId",params);

const addPlanYear = (params)=>postAction("/planYear/add",params);
const deletePlanYear = (params)=>getAction("/planYear/delete",params);

// 人资物料信息
const getResourceUnit = (params) => getAction('/calculateUnit/selectByFarmingId', params)
const getTemporaryUnit = (params) => getAction('/calculateUnit/selectByTemporaryFarming', params)
// 设备信息
const getAllDevice = (params)=>getAction("/deviceInfo/list",params);
const addDevice = (params)=>postAction("/deviceInfo/add",params);
const deleteDevice = (params)=>getAction("/deviceInfo/delete",params);
const updateDevice = (params)=>postAction("/deviceInfo/update",params);

// 物料信息
const getAllMaterial = (params)=>getAction("/materialInfo/list",params);
const addMaterial = (params)=>postAction("/materialInfo/add",params);
const deleteMaterial = (params)=>getAction("/materialInfo/delete",params);
const updateMaterial = (params)=>postAction("/materialInfo/update",params);

// 人员信息
const getAllPersonnel = (params)=>getAction("/personnelInfo/list",params);
const addPersonnel = (params)=>postAction("/personnelInfo/add",params);
const deletePersonnel = (params)=>getAction("/personnelInfo/delete",params);
const updatePersonnel = (params)=>postAction("/personnelInfo/update",params);

// 自定义农事
const getAllFarmingItem = (params)=>getAction("/farmingItem/list",params);
const addFarmingItem = (params)=>postAction("/farmingItem/add",params);
const updateFarmingItem = (params)=>postAction("/farmingItem/update",params);
const deleteFarmingItem = (params)=>getAction("/farmingItem/delete",params);

//自定义初加工
const getAllProcessing = (params)=>getAction("/processing/list",params);
const getAllProcess= (params)=>getAction("/processing/all",params);
const addProcessing = (params)=>postAction("/processing/add",params);
const updateProcessing = (params)=>postAction("/processing/update",params);
const deleteProcessing= (params)=>getAction("/processing/delete",params);

//获取所有批次
const getAllCropBatchs = (params)=>getAction("/cropBatch/all",params);
const getRecoveryVo = (params)=>getAction("/recoveryBatch/getRecoveryVo",params);

//采收批次
const addRecoveryBatch = (params)=>postAction("/recoveryBatch/add",params);
const getRecoveryBatch = (params)=>getAction("/cropBatch/getBatchAndRecovery",params);
const deleteRecoveryBatch= (params)=>getAction("/recoveryBatch/delete",params);
const updateRecoveryBatch = (params)=>postAction("/recoveryBatch/update",params);
const getUnitEnum= (params)=>getAction("/enum/getUnitEnum",params);

// 工单操作
const updateStatus = (params)=>getAction("/cropBatch/updateStatus",params);
const addWorkOrder = (params)=>getAction("/workOrder/add",params);
const cancelWorkOrder = (params)=>getAction("/workOrder/revokeWorkOrder",params);

// 准备事项
const getBatchByBase = (params)=>getAction("/cropBatch/selectByBaseId",params);
const getAllBatch = (params)=>getAction("/cropBatch/all",params);
const getBatchYear = (params)=>getAction("/prepareItem/getYear",params)
const getPerpareList = (params)=>getAction("/prepareItem/list",params)
const exportMessage = (params)=>getAction("/prepareItem/export",params)

//工单总览
const getAllWorkType = (params)=>getAction("/enum/getWorkOrderTypeEnum",params)
const getAllWorklist = (params) => getAction("/workOrder/list", params)
const getAllWorkStatus = (params) => getAction("enum/getWorkOrderStatusEnum", params)
const approvalWork = (params) => getAction("/workOrder/setAuditApproval", params)
const failedWork = (params) => getAction("/workOrder/setAuditFailed", params)
const returnWork = (params) => getAction("/workOrder/setNotAudited", params)
const updateWork = (params) => postAction("/workOrder/update", params)
const exportWorkList = (params) => getAction("/workOrder/export",params)
const updateOrderRole = (params) => getAction("/workOrder/updateOrderRole", params)

// 临时农事
const addTemporary = (params) => postAction("/farming/addTemporaryFarming", params)
const getAllTemporary = (params) => getAction("/farming/temporaryFarmingList", params)
const manageTemporaryWork = (params) => getAction("/cropBatch/unFinishBatch", params)
const addTemporaryOrder = (params) => getAction("/workOrder/addTemporaryOrder", params)
const revokeTemporaryOrder = (params) => getAction("/workOrder/revokeTemporaryOrder", params)
//种子/种苗检测
const getseedAll = (params)=>getAction("/seed/all",params);
const addSeedDetection = (params)=>postAction("/seedDetection/add",params);
const getSeedDetection = (params)=>getAction("/seedDetection/list",params);
const deleteSeedDetection= (params)=>getAction("/seedDetection/delete",params);
const updateSeedDetection= (params)=>postAction("/seedDetection/update",params);

//初加工批次
const getPlantingAll = (params)=>getAction("/plantingPlan/all",params);
const getIdAndNameById = (params)=>getAction("/crop/getIdAndNameById",params);
const getHarvestedByCropId = (params)=>getAction("/harvestedPro/getHarvestedByCropId",params);
const selectByCropId = (params)=>getAction("/processing/selectByCropId",params);
const getCropProductByHarvestedId = (params)=>getAction("/cropPro/getCropProductByHarvestedId",params);
const getRecoveryByPlanId = (params)=>getAction("/recoveryBatch/getRecoveryByPlanId",params);
const addProbatch = (params)=>postAction("/probatch/add",params);
const getProbatchAll = (params)=>getAction("/probatch/list",params);
const deleteProbatchAll = (params)=>getAction("/probatch/delete",params);
const updateProbatchAll = (params)=>postAction("/probatch/update",params);
const getRecoveryData = (params) => getAction("/recoveryBatch/getAllRecovery", params)

//照片
const delpicture = (params)=>getAction("/pictureInfo/delete",params);

//获取采收检测项
const getRecoveryDetection = (params)=>getAction("/detectionItems/getSeedDetection",params);

//种子登记
const getSeedAll = (params)=>getAction("/seed/list",params);
const getSeedTypeEnum = (params)=>getAction("/enum/getSeedTypeEnum",params);
const getSelfSpeciesEnum = (params)=>getAction("/enum/getSelfSpeciesEnum",params);
const getRecoveryByCropId = (params)=>getAction("/recoveryBatch/getRecoveryByCropId",params);
const addSeedAdd = (params)=>postAction("/seed/add",params);
const deleteSeedAll= (params)=>getAction("/seed/delete",params);
const updateSeedAll= (params)=>postAction("/seed/update",params);

//初加工检测
const getProDetectio = (params)=>getAction("/initProDetectio/list",params);
const deleteProDetectio= (params)=>getAction("/initProDetectio/delete",params);
const getInitProVoByPlanId = (params)=>getAction("/probatch/getInitProVoByPlanId",params);
const getIniproDetection = (params) => getAction('/detectionItems/getIniproDetection', params)
const addInitProDetectio = (params) => postAction("/initProDetectio/add", params)
const updateInitProDetectio = (params) => postAction("/initProDetectio/update", params)

// 采收检测
const getAllRecovery = (params) => getAction('/recoveryDetection/list', params)
const addRecoveryDet = (params) => postAction("/recoveryDetection/add", params)
const updateRecoveryDet = (params) => postAction("/recoveryDetection/update", params)
const deleteRecoveryDet = (params) => getAction("/recoveryDetection/delete", params)
const getBatchByPlan = (params) => getAction("/recoveryBatch/getRecoveryByPlanId", params)
const getDetByCrop = (params) => getAction('/detectionItems/getRecoveryDetection', params)

// 巡视反馈
const getFeedBack = (params) => getAction('/feedBack/list', params)

// 追溯打码
const getRetrocoding = (params) => getAction('/retroCoding/list', params)
const getRetroCodingType = (params) => getAction('/enum/getRetroCodingTypeEnum', params)
const exportRetrocoding = (params) => getAction('/retroCoding/export', params)
const getRetrocodingUnit = (params) => getAction('/enum/getRetroCodingUnitEnum', params)
const getBatchByType = (params) => getAction('/retroCoding/getBatchByType', params)
const getWeightAndRec = (params) => getAction('/retroCoding/getResidualOutput', params)
const addRetrocoding = (params) => postAction('/retroCoding/add', params)

// 病虫害反馈
const getIllFeedback = (params) => getAction('/illFeedback/list', params)
const updateIllFeedback = (params) => postAction('/illFeedback/update', params)
const deleteIllFeedback = (params) => getAction('/illFeedback/delete', params)
const getFeedStatus = (params) => getAction('enum/getIllFeedbackStatusEnum', params)
const processFeedback = (params) => postAction('/illFeedback/processFeedback', params)
const getAllIllness = (params) => getAction('/illness/all', params)
const getAlltreat = (params) => getAction('/treatmentPlan/selectByIllId', params)

export {
  queryUserMenu,

  roleResource,
  roleQuery,
  roleAdd,
  roleUpdate,
  roleDelete,
  roleResourceUpdate,
  roleType,
  getAllRoleType,

  getStandard,
  addStandard,
  updateStandard,
  deleteStandard,

  getAllCrop,
  getAllCategory,
  getAllStage,
  getAllUnit,

  appResource,
  boardResource,

  getAllPlan,
  addPlatingPlan,
  updatePlatingPlan,
  deletePlatingPlan,
  copyPlan,

  getAllFarming,
  addFarming,
  updateFarming,
  deleteFarming,
  getAllPlanYear,

  addPlanYear,
  deletePlanYear,

  getResourceUnit,
  getTemporaryUnit,
  getAllDevice,
  addDevice,
  updateDevice,
  deleteDevice,

  getAllMaterial,
  addMaterial,
  updateMaterial,
  deleteMaterial,

  getAllPersonnel,
  addPersonnel,
  updatePersonnel,
  deletePersonnel,

  getAllFarmingItem,
  addFarmingItem,
  updateFarmingItem,
  deleteFarmingItem,

  getAllProcessing,
  getAllProcess,
  addProcessing,
  updateProcessing,
  deleteProcessing,

  getAllCropBatchs,
  getRecoveryVo,

  addRecoveryBatch,
  getRecoveryBatch,
  deleteRecoveryBatch,
  updateRecoveryBatch,
  getUnitEnum,

  updateStatus,
  addWorkOrder,
  cancelWorkOrder,

  getBatchByBase,
  getAllBatch,
  getBatchYear,
  getPerpareList,
  exportMessage,

  getAllWorkType,
  getAllWorklist,
  getAllWorkStatus,
  approvalWork,
  failedWork,
  returnWork,
  updateWork,
  exportWorkList,
  updateOrderRole,

  addTemporary,
  getAllTemporary,
  manageTemporaryWork,
  addTemporaryOrder,
  revokeTemporaryOrder,
  getseedAll,
  addSeedDetection,
  getSeedDetection,
  deleteSeedDetection,
  updateSeedDetection,

  delpicture,

  getRecoveryDetection,

  getPlantingAll,
  getIdAndNameById,
  getHarvestedByCropId,
  selectByCropId,
  getCropProductByHarvestedId,
  getRecoveryByPlanId,
  addProbatch,
  getProbatchAll,
  deleteProbatchAll,
  updateProbatchAll,
  getRecoveryData,

  getSeedAll,
  getSeedTypeEnum,
  getSelfSpeciesEnum,
  getRecoveryByCropId,
  addSeedAdd,
  deleteSeedAll,
  updateSeedAll,

  getAllRecovery,
  addRecoveryDet,
  updateRecoveryDet,
  deleteRecoveryDet,
  getBatchByPlan,
  getDetByCrop,

  getProDetectio,
  deleteProDetectio,
  getInitProVoByPlanId,
  getIniproDetection,
  addInitProDetectio,
  updateInitProDetectio,

  getFeedBack,

  getRetrocoding,
  getRetroCodingType,
  exportRetrocoding,
  getRetrocodingUnit,
  getBatchByType,
  getWeightAndRec,
  addRetrocoding,
  
  getIllFeedback,
  updateIllFeedback,
  deleteIllFeedback,
  getFeedStatus,
  processFeedback,
  getAllIllness,
  getAlltreat
}
