<template>
  <the-header :closeInstantlyDirective="closeInstantly"></the-header>
  <router-view @closeMobileView="closeMobileViewInstantly"></router-view>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted} from "vue";
import TheHeader from "@/components/UI/TheHeader.vue";
import { useAuth } from "@/composables/useAuth.composable";
import { usePeriod } from "@/composables/usePeriod.composable";

import { InfoController } from "./config";
import { ApiResult } from "./models/DTO/ApiResult";
import { BaseUserAuthStateResponse } from "./models/BACKEND-MODELS/BaseUserAuthStateResponse";
export default defineComponent({
  name: "App",
  components: {
    TheHeader,
  },
  setup() {
    // const { IsAuthenticated } = useAuth();
    // const {GetPeriodState} = usePeriod();
    onMounted( async () => {
      
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
