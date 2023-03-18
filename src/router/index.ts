
import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import { store }from '@/store/index';
import { login_redirect_url } from '@/config';
import {useAuth} from '@/composables/useAuth.composable'
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
    component : () => import('@/components/UI/LabAccordion.vue'),
    meta : {requiresAuth :true}
  },
  {
    path : "/submitted-labs",
    name : 'submittedLabs',
    component : () => import('@/components/UI/SubmitedLabList.vue'),
    meta : {requiresAuth :true}
  },
  {
    path : "/add-lab",
    name : 'addlab',
    component :  import('@/components/UI/AddLab.vue'),
    meta : {requiresAuth :true,requiresIsTeacher : true}
  },
  {
    path : "/enroll-in-department/:course_guid",
    name : 'enroll',
    component : () => import('@/components/UI/DepartmentCardsList.vue'),
    props : true,
    meta : {requiresAuth :true,requiresIsTeacher : false}
  },
  {
    path : "/poutsa",
    name : 'poutsa',
    component : () => import('@/components/UI/Admin/AdminPanelMenu.vue'),
    meta : {requiresAuth :true}
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes : routes
});

router.beforeEach(async (to,_,next) => {
  const  {IsAuthenticated} = useAuth();
  const isAuth = await IsAuthenticated(true);
  const storeIsAuth = store.getters.IsAuth;
  if(to.meta.requiresAuth === false && storeIsAuth == false){
    isAuth === false ? next() : next(false);
    return;
  }
  if(to.meta.requiresAuth === false && storeIsAuth == true){
    if(isAuth === true){
      SetNotAuthenticated();
    }
    next();
    return;
  }
  if(to.meta.requiresAuth === true && storeIsAuth === true)
  {
    isAuth === true ? next() : next({name:'red'});
    return;
  }
  if(to.meta.requiresAuth === true && storeIsAuth === false)
  {
    isAuth === true ? next() :  next({name:'red'});
    return;
  }
  next(false);
  return;
});

export default router;
