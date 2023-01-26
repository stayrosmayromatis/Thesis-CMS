import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
const LabAccordion= () => import('@/components/UI/LabAccordion.vue');
const SubmittedLabList = () => import('@/components/UI/SubmitedLabList.vue');
const AddLab = () => import('@/components/UI/AddLab.vue');
const WelcomePage = () => import('@/components/UI/WelcomePage.vue');
const PdfContent = () => import('@/components/UI/PdfContent.vue');
const login_red_url = `https://login.iee.ihu.gr/authorization/?client_id=${import.meta.env.VITE_CLIENT_ID}&response_type=code&scope=profile&redirect_uri=${import.meta.env.VITE_REDIRECT_URI}`
const routes: Array<RouteRecordRaw> = [
  {
    path : "/",
    name : 'welcome',
    component : WelcomePage,
    props : false
  },
  {
    path : "/sign-in",
    name : 'sign-in',
    redirect: (to)=> window.location.href = login_red_url,
  },
  {
    path : "/auth",
    name : 'auth',
    props:false,
    component : () => import("@/components/Auth/Auth.vue")
  },

  {
    path : "/lab-list",
    name : 'labList',
    component : LabAccordion,
    props : true
  },
  {
    path : "/submitted-labs",
    name : 'submittedLabs',
    component : SubmittedLabList,
    props : true
  },
  {
    path : "/add-lab",
    name : 'addlab',
    component : AddLab,
    props : true
  },
  {
    path : "/poutsa",
    name : 'poutsa',
    component : PdfContent,
    props : true
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes : routes
})

export default router
