<template>
  <the-header :closeInstantlyDirective="closeInstantly"></the-header>
  <router-view @closeMobileView="closeMobileViewInstantly"></router-view>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted} from "vue";
import TheHeader from "@/components/UI/TheHeader.vue";
import { useAuth } from "@/composables/useAuth.composable";
import { usePeriod } from "@/composables/usePeriod.composable";

import { CourseController, InfoController } from "./config";
import { ApiResult } from "./models/DTO/ApiResult";
import { BaseUserAuthStateResponse } from "./models/BACKEND-MODELS/BaseUserAuthStateResponse";
import { useAxiosInstance } from "./composables/useInstance.composable";
import { AllProf } from "./models/BACKEND-MODELS/AllProf";
import { PersonalisedCoursesBySemesterResponse } from "./models/BACKEND-MODELS/PersonalisedCoursesBySemesterResponse";
import { LabSemesterEnum } from "./enums/LabSemesterEnum";
export default defineComponent({
  name: "App",
  components: {
    TheHeader,
  },
  setup() {
    // const { IsAuthenticated } = useAuth();
    // const {GetPeriodState} = usePeriod();
    const {MakeAPICall} = useAxiosInstance();
    onMounted( async () => {
      //const result = await MakeAPICall<ApiResult<BaseUserAuthStateResponse>>("/Info/","infos");
       const payload = Array<LabSemesterEnum>(LabSemesterEnum.A_XEIM,LabSemesterEnum.B_EAR,LabSemesterEnum.C_XEIM,LabSemesterEnum.D_EAR,LabSemesterEnum.E_XEIM,LabSemesterEnum.H_EAR);
       const result = await MakeAPICall<ApiResult<PersonalisedCoursesBySemesterResponse>,LabSemesterEnum[]>(CourseController,"courses-by-semester","POST",payload,true);
      console.log(result);

    });
    const closeInstantly = ref(false);

    const closeMobileViewInstantly = async (val: boolean) => {
      closeInstantly.value = true;
      await delay(1);
      closeInstantly.value = false;
    };
    const delay = async (time: number) => {
      return new Promise((resolve) => setTimeout(resolve, time));
    };

    return { closeInstantly, closeMobileViewInstantly };
  },
});
</script>

<style>
body {
  box-sizing: border-box;
  background-color: #f4f4ff;

}

html {
  overflow-y: auto !important;
  overflow-x: auto !important;
}
</style>
