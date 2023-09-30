import {
  createRouter,
  createWebHistory,
  NavigationGuardNext,
  RouteLocationNormalized,
  RouteRecordRaw,
} from "vue-router";
import { store } from "@/store/index";
import { login_redirect_url } from "@/config";
import { useAuth } from "@/composables/useAuth.composable";
import { TypeStaff } from "@/enums/StaffTypeEnum";
import { usePeriod } from "@/composables/usePeriod.composable";
const { SetNotAuthenticated } = useAuth();
const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "welcome",
    component: () => import("@/components/UI/WelcomePage.vue"),
    meta: { requiresAuth: false },
  },
  {
    path: "/sign-in",
    name: "sign-in",
    redirect: (to) => (window.location.href = login_redirect_url),
    meta: { requiresAuth: false },
  },
  {
    path: "/auth",
    name: "auth",
    component: () => import("@/components/Auth/Auth.vue"),
    meta: { requiresAuth: false },
  },
  {
    path: "/red",
    name: "red",
    redirect: (to) => (window.location.href = login_redirect_url),
  },
  {
    path: "/contact",
    name: "contact",
    component: () => import("@/components/UI/ContactUs/ContactUs.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/lab-list",
    name: "labList",
    component: () => import("@/components/UI/LabAccordion/LabAccordion.vue"),
    meta: { requiresAuth: true, requiredPeriodInitialized: true },
    beforeEnter: [protectPeriodInitializedRoutes],
  },
  {
    path: "/submitted-labs",
    name: "submittedLabs",
    component: () => import("@/components/UI/SubmittedLabs/SubmitedLabList.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/add-lab",
    name: "addlab",
    component: () => import("@/components/UI/AddLab.vue"),
    meta: { requiresAuth: true, requiresIsTeacher: true },
    beforeEnter: [protectTeacherRoutes],
  },
  {
    path: "/enroll-in-department/:course_guid",
    name: "enroll",
    component: () =>
      import("@/components/UI/Departments/DepartmentCardsList.vue"),
    props: true,
    meta: { requiresAuth: true, requiredPeriodInitialized: true },
    beforeEnter: [protectPeriodInitializedRoutes],
  },
  {
    path: "/administration",
    name: "admin",
    component: () => import("@/components/UI/Admin/AdminPanelMenu.vue"),
    props: true,
    meta: { requiresAuth: true, requiresIsTeacher: true },
    beforeEnter: [protectTeacherRoutes],
  },
  // {
  //   path: "/poutsa",
  //   name: "poutsa",
  //   component: () => import("@/components/Base/"),
  //   meta: { requiresAuth: true },
  // }
  ,{
    // path: "/:catchAll(.*)",
    path: "/:pathMatch(.*)*",
    name: "notFound",
    redirect: (to) => {
      return { name: "welcome" };
    },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes: routes,
  linkActiveClass: "router-link-active",
  linkExactActiveClass: "router-link-exact-active",
});

router.beforeEach(async (to:RouteLocationNormalized,from:RouteLocationNormalized,next:NavigationGuardNext) => {
  const {IsAuthenticated} = useAuth();
  if (store.getters.IsFirstTimeLogin && to.fullPath.trim() === "/") {
    // await IsAuthenticated(true);
    //store.dispatch("setFirstTimeLogin", false);
    console.log("trigger 0");
    return next();
  } else {
    await IsAuthenticated(true);
    const storeIsAuth = store.getters.IsAuth;
    if (to.meta.requiresAuth === false && storeIsAuth == false) {
      // console.log("trigger 1");
      return next();
    }
    if (to.meta.requiresAuth === false && storeIsAuth == true) {
      await SetNotAuthenticated();
      // console.log("trigger 2");
      return next();
    }
    if (to.meta.requiresAuth === true && storeIsAuth === false) {
      //console.log("trigger 3");
      return next({ name: "red" });
    }
    //console.log("passed 0");
    return next();
  }
});

async function protectTeacherRoutes(
  to: RouteLocationNormalized,
  _: RouteLocationNormalized,
  next: NavigationGuardNext
) {
  const { GetTypeStaff } = useAuth();
  const typeStaff = GetTypeStaff();
  return to.meta.requiresIsTeacher && typeStaff && (typeStaff === TypeStaff.STAFF || typeStaff === TypeStaff.ADMIN) ?  next() : next(false);
}

async function protectPeriodInitializedRoutes(
  to: RouteLocationNormalized,
  _: RouteLocationNormalized,
  next: NavigationGuardNext
) {
  const {
    GetPeriodState,
    IsPeriodActive,
  } = usePeriod();
  await GetPeriodState();
  if (!IsPeriodActive.value && !to.meta.requiredPeriodInitialized) return next();
  if (to.meta.requiredPeriodInitialized === true && IsPeriodActive.value) return next();
  return next({name: "submittedLabs"});
  
}

export default router;
