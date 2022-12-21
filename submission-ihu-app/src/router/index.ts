import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
const LabAccordion= () => import('@/components/UI/LabAccordion.vue');
const SubmittedLabList = () => import('@/components/UI/SubmitedLabList.vue');
const routes: Array<RouteRecordRaw> = [
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
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes : routes
})

export default router
