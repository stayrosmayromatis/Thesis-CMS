import { SubmittedLab } from './../models/BACKEND-MODELS/GenericSubmittedLabsResponse';

import { createRouter, createWebHistory, NavigationGuardNext, RouteLocationNormalized, RouteRecordRaw } from 'vue-router'
import { store }from '@/store/index';
import { login_redirect_url } from '@/config';
import {useAuth} from '@/composables/useAuth.composable'
import { TypeStaff } from '@/enums/StaffTypeEnum';
const {SetNotAuthenticated} = useAuth();
const routes: Array<RouteRecordRaw> = [
  {
    path : "/",
    name : 'welcome',
    component : import('@/components/UI/WelcomePage.vue'),
    meta:{requiresAuth :false}
  },
  {
    path : "/sign-in",
    name : 'sign-in',
    redirect: (to)=> window.location.href = login_redirect_url,
    meta : {requiresAuth :false}
  },
  {
    path : "/auth",
    name : 'auth',
    component : () => import("@/components/Auth/Auth.vue"),
    meta : {requiresAuth :false}
  },
  {
    path:"/red",
    name:"red",
    redirect: (to) => window.location.href = login_redirect_url
  },
  {
    path : "/lab-list",
    name : 'labList',
    component : () => import('@/components/UI/LabAccordion/LabAccordion.vue'),
    meta : {requiresAuth :true,requiredPeriodInitialized : true},
    beforeEnter : [protectPeriodInitializedRoutes]
  },
  {
    path : "/submitted-labs",
    name : 'submittedLabs',
    component : () => import('@/components/UI/SubmittedLabs/SubmitedLabList.vue'),
    meta : {requiresAuth :true}
  },
  {
    path : "/add-lab",
    name : 'addlab',
    component :  import('@/components/UI/AddLab.vue'),
    meta : {requiresAuth :true,requiresIsTeacher : true},
    beforeEnter:[protectTeacherRoutes]
  },
  {
    path : "/enroll-in-department/:course_guid",
    name : 'enroll',
    component : () => import('@/components/UI/Departments/DepartmentCardsList.vue'),
    props : true,
    meta : {requiresAuth :true,
    requiredPeriodInitialized : true
    }
    ,
    beforeEnter : [protectPeriodInitializedRoutes]
  },
  {
    path : "/administration",
    name : 'admin',
    component : () => import('@/components/UI/Admin/AdminPanelMenu.vue'),
    props : true,
    meta : {requiresAuth :true,requiresIsTeacher : true},
    beforeEnter:[protectTeacherRoutes]
  },
  {
    path : "/poutsa",
    name : 'poutsa',
    component : () => import('@/components/UI/Admin/AdminPanelMenu.vue'),
    meta : {requiresAuth :true}
  },
  {
     path: "/:catchAll(.*)",
     name: "notFound",
     redirect: (to)=>{
      return {name:'welcome'}
     }
     
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes : routes
});

router.beforeEach(async (to,_,next) => {
  const  {IsAuthenticated} = useAuth();
  //const isAuth = await IsAuthenticated(true);
  await IsAuthenticated(true);
  const storeIsAuth = store.getters.IsAuth;
  if(to.meta.requiresAuth === false && storeIsAuth == false){
    return next();
    //OLD IMPLE
    // isAuth === false ? next() : next(false);
    return;
  }
  if(to.meta.requiresAuth === false && storeIsAuth == true){
    SetNotAuthenticated();
    return next();
    //OLD IMPLE
    // if(isAuth === true){
    //   SetNotAuthenticated();
    // }
    // next();
    // return;
  }
  // if(to.meta.requiresAuth === true && storeIsAuth === true)
  // {
  //   isAuth === true ? next() : next({name:'red'});
  //   return;
  // }
  if(to.meta.requiresAuth === true && storeIsAuth === false)
  {
    //isAuth === true ? next() :  next({name:'red'});
    return next({name:'red'});
  }
  //next(false);
  return next();
  // return;
});

async function protectTeacherRoutes(to:RouteLocationNormalized,from:RouteLocationNormalized,next:NavigationGuardNext){
  const  {GetTypeStaff} = useAuth();
  const typeStaff = GetTypeStaff();
  if(!typeStaff || !to.meta.requiresIsTeacher)
    return next(false);
  if(to.meta.requiresIsTeacher === true && (typeStaff === TypeStaff.STAFF || typeStaff === TypeStaff.ADMIN)){
    return next();
  }
  // if(to.meta.requiresIsTeacher === false && (typeStaff === TypeStaff.STAFF || typeStaff === TypeStaff.ADMIN)){
  //   next({name:'submittedLabs'});
  //   return;
  // }
  next(false);
  
}

async function protectPeriodInitializedRoutes(to:RouteLocationNormalized,from:RouteLocationNormalized,next:NavigationGuardNext){
  const {GetPeriodInfo} = useAuth();
  const periodInfo = GetPeriodInfo();
  if(!periodInfo || !to.meta.requiredPeriodInitialized )
    return next(false);
  if(to.meta.requiredPeriodInitialized === true && (periodInfo.IsPeriodActive === false || !periodInfo.IsPeriodActive))
    return next(false);
  next();
}
export default router;
