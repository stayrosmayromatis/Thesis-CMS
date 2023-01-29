
import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import { store }from '@/store/index';
const LabAccordion= () => import('@/components/UI/LabAccordion.vue');
const SubmittedLabList = () => import('@/components/UI/SubmitedLabList.vue');
const AddLab = () => import('@/components/UI/AddLab.vue');
const WelcomePage = () => import('@/components/UI/WelcomePage.vue');
const login_red_url = `https://login.iee.ihu.gr/authorization/?client_id=${import.meta.env.VITE_CLIENT_ID}&response_type=code&scope=profile&redirect_uri=${import.meta.env.VITE_REDIRECT_URI}`

const routes: Array<RouteRecordRaw> = [
  {
    path : "/",
    name : 'welcome',
    component : WelcomePage,
    props : false,
    meta:{requiresAuth :false}
  },
  {
    path : "/sign-in",
    name : 'sign-in',
    redirect: (to)=> window.location.href = login_red_url,
    meta : {requiresAuth :false}
  },
  {
    path : "/auth",
    name : 'auth',
    props:false,
    component : () => import("@/components/Auth/Auth.vue"),
    meta : {requiresAuth :false}
  },

  {
    path : "/lab-list",
    name : 'labList',
    component : LabAccordion,
    props : true,
    meta : {requiresAuth :true}
  },
  {
    path : "/submitted-labs",
    name : 'submittedLabs',
    component : SubmittedLabList,
    props : true,
    meta : {requiresAuth :true}
  },
  {
    path : "/add-lab",
    name : 'addlab',
    component : AddLab,
    props : true,
    meta : {requiresAuth :true,requiresIsTeacher : true}
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes : routes
})

router.beforeEach( (to,from,next) => {

  if(to.meta.requiresAuth === false && store.getters.IsAuth === false){
    next();
    return;
  }
  if(to.meta.requiresAuth === true && store.getters.IsAuth === true)
  {
    next();
    return;
  }
  next({name:'welcome'});
  return;
});

export default router;
