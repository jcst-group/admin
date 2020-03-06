import Vue from 'vue';
import Router from 'vue-router';
import Layout from '@/components/layouts/index.vue';


Vue.use(Router);

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/login',
      component: () =>import('@/views/Login.vue'),
      hidden: true,
    },
    {
      path: '/visual',
      component: () =>import('@/visual/index.vue'),
      hidden: true,
    },
    {
      path: '/',
      name: 'home',
      component: Layout,
      children: [
        {
          path: '/nxhome',
          name: 'nxhome',
          meta: '首页',
          component: () => import(/* webpackChunkName: "about" */ './views/ddwb/Home.vue'),
        },
        {
          path: '/baseInfo',
          name:'baseInfo',
          component: () =>import('@/views/ddwb/Base.vue'),
          hidden: true,
        },
        {
          path: '/businessreport',
          name:'businessreport',
          component: () =>import('@/views/ddwb/BusinessReport.vue'),
          hidden: true,
        },
        {
          path: '/budgetereport',
          name:'budgetereport',
          component: () =>import('@/views/ddwb/BudgeteReport.vue'),
          hidden: true,
        },
        {
          path: '/company',
          name:'company',
          meta: '公司介绍',
          component: () =>import('@/views/ddwb/Company.vue'),
          hidden: true,
        },
        {
          path: '/plot',
          name:'plot',
          component: () =>import('@/views/ddwb/Plot.vue'),
          hidden: true,
        },
        {
          path: '/medicine',
          name:'medicine',
          component: () =>import('@/views/ddwb/Medicine.vue'),
          hidden: true,
        },
        {
          path: '/envstandards',
          name:'envstandards',
          component: () =>import('@/views/ddwb/baseEnvStandards.vue'),
          hidden: true,
        },
        {
          path: '/baseuser',
          name:'baseuser',
          component: () =>import('@/views/ddwb/baseUser.vue'),
          hidden: true,
        },
        {
          path: '/equipment',
          name: 'equipment',
          component:() => import('./views/ddwb/Equipment.vue')
        },
        {
          path: '/videoequipment',
          name: 'videoequipment',
          component:() => import('./views/ddwb/VideoEquipment.vue')
        },
        {
          path: '/warnenv',
          name: 'warnenv',
          component:() => import('./views/ddwb/WarnEnv.vue')
        },
        {
          path: '/datareport',
          name: 'datareport',
          component:() => import('./views/ddwb/DataReport.vue')
        },
        {
          path: '/about',
          name: 'about',
          component: () => import(/* webpackChunkName: "about" */ './views/About.vue'),
        },
        {
          path: '/users',
          name: 'users',
          component: () => import(/* webpackChunkName: "about" */ './views/system/User.vue'),
        },
        {
          path: '/standard/deteitem',
          name: 'standard',
          component: () => import(/* webpackChunkName: "about" */ './views/system/standard.vue'),
        },
        {
          path: '/roles',
          name: 'roles',
          component: () => import(/* webpackChunkName: "about" */ './views/system/Role.vue'),
        },
        {
          path: 'nx/worker',
          name: 'nxWorker',
          component: () => import(/* webpackChunkName: "about" */ './views/nx/Worker.vue'),
        },
        {
          path: 'nx/envmonitor',
          name: 'nxEnvMonitor',
          component: () => import(/* webpackChunkName: "about" */ './views/nx/EnvMonitor.vue'),
        },
        {
          path: '/resources',
          name: 'resources',
          component: () => import(/* webpackChunkName: "about" */ './views/system/Resource.vue'),
        },
        {
          path: '/service',
          name: 'service',
          component:() => import('./views/system/Service.vue')
        },
        {
          path: '/testdata',
          name: 'testdata',
          component:() => import('./views/system/TestData.vue')
        },
        {
          path: '/dictionaries',
          name: 'dictionaries',
          component:() => import('./views/system/Dictionaries.vue')
        },
        {
          path: '/soiltest',
          name: 'soiltest',
          component:() => import('./views/system/Soiltest.vue')
        },
        {
          path: '/batch',
          name: 'batch',
          component:() => import('./views/patch/Batch.vue')
        },
        {
          path: '/batch/save',
          name: 'batchSave',
          component:() => import(/* webpackChunkName: "fail" */ './views/patch/BatchSave.vue')
        },
        {
          path: '/prepare',
          name: 'prepare',
          component: () => import(/* webpackChunkName: "fail" */ './views/patch/prepare.vue')
        },
        {
          path: '/baseaccount',
          name: 'baseaccount',
          component:() => import(/* webpackChunkName: "fail" */ './views/system/BaseAccount.vue')
        },
        {
          path: '/permission',
          name: 'permission',
          component: () => import(/* webpackChunkName: "fail" */ '@/views/system/Permission.vue')
        },
        {
          path: '/template',
          name: 'temp',
          component:() => import(/* webpackChunkName: "fail" */ './views/system/temp.vue')
        },
        {
          path: '/plan',
          name: 'plan',
          component: () => import(/* webpackChunkName: "fail" */ './views/system/plan.vue')
        },
        {
          path: '/farmingItem',
          name: 'farmingItem',
          component: () => import(/* webpackChunkName: "fail" */ './views/system/farmingItem.vue')
        },
        {
          path: '/recovery/detection',
          name: 'recovery',
          component: () => import(/* webpackChunkName: "fail" */ './views/system/RecDetection.vue'),
        },
        {
          path: '/initialpro/detection',
          name: 'initialpro',
          component: () => import(/* webpackChunkName: "fail" */ './views/system/Initialpro.vue'),
        },
        // {
        //   path: '/seed/detection',
        //   name: 'seed',
        //   component: () => import(/* webpackChunkName: "fail" */ './views/system/Seed.vue'),
        // },
        // {
        //   path: '/initialpro/methods',
        //   name: 'initialproCust',
        //   component: () => import('./views/system/InitialproCust.vue'),
        // },
        {
          path: '/recovery/batch',
          name: 'recBatch',
          component: () => import('./views/system/RecBatch.vue'),
        },
        {
          path: '/workorder/overview',
          name: 'overview',
          component: () => import('./views/system/overview.vue')
        },
        {
          path: '/feedback',
          name: 'feedBack',
          component: () => import('./views/system/feedBack.vue')
        },
        {
          path: '/BCHfeedback',
          name: 'BCHfeedback',
          component: () => import('./views/system/BCHfeedback.vue')
        },
        {
          path: '/retrocoding',
          name: 'retrocoding',
          component: () => import('./views/system/retrocoding.vue')
        },
        {
          path: '/temporary/farming',
          name: 'temporaryFarm',
          component: () => import('./views/system/temporaryFarm.vue')
        },
        {
          path: '/seed',
          name: 'seedsRegister',
          component: () => import('./views/system/SeedsRegister.vue'),
        },
        // {
        //   path: '/initialpro/batch',
        //   name: 'initialproBatch',
        //   component: () => import('./views/system/InitialproBatch.vue'),
        //  },
         {
          path: '/dataerror',
          name: 'dataError',
          component: () => import('./views/ddwb/dataError.vue'),
         },
         {
          path: '/unitManage',
          name: 'unitManage',
          component: () => import('./views/ddwb/unitManage.vue'),
         },
         {
          path: '/datalose',
          name: 'dataLose',
          component: () => import('./views/ddwb/dataLose.vue'),
         },
         {
          path: '/articleclassificaion',
          name: 'articleclassificaion',
          component: () => import('./views/editor/articleClassificaion.vue'),
         },
         {
          path: '/editor',
          name: 'editor',
          component: () => import('./views/editor/editor.vue'),
         },
         {
          path: '/articleshow',
          name: 'articleshow',
          component: () => import('./views/editor/articleshow.vue'),
         },
         // {
         //  path: '/test',
         //  name: 'test',
         //  component: () => import('./views/editor/test.vue'),
         //  path: '/projectManage',
         //  name: 'projectManage',
         //  component: () => import('./views/work/projectManage.vue'),
         // },
         {
          path: '/themeManage',
          name: 'themeManage',
          component: () => import('./views/work/themeManage.vue'),
         },
        {
          path: '/404',
          component: () => import(/* webpackChunkName: "fail" */ '@/views/exception/404')
        },
      ],
    },
    {
      path: '*', redirect: '/404', hidden: true
    }

  ],
});
