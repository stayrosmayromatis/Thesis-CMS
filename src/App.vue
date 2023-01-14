<template>
  <the-header :closeInstantlyDirective="closeInstantly">
    <!-- <template #content>
      <router-view></router-view>
    </template> -->
  </the-header>
  <router-view @closeMobileView="closeMobileViewInstantly"> </router-view>
</template>

<script lang="ts">
import axios, { AxiosHeaders } from "axios";
import { useAxios } from "@vueuse/integrations/useAxios";
import { defineComponent, ref, onMounted } from "vue";
import TheHeader from "@/components/UI/TheHeader.vue";
export default defineComponent({
  name: "App",
  components: {
    TheHeader,
  },
  setup() {
    const cooardinators: Array<{
      id: string;
      displayNameEn?: string;
      displayNameEl: string;
      isStaff: boolean;
      affiliation: string;
      titleEn?: string;
      titleEl: string;
      personalTitle: string;
      personalEntitlementEn? : string,
      personalEntitlementEl :string
    }> = Array();
    onMounted(async () => {
      const instance = axios.create({
        baseURL: "https://api.iee.ihu.gr",
      });
      const { data, isFinished } = await useAxios(
        "/user",
        {
          method: "GET",
          withCredentials: false,
          headers: {
            "Content-Type": "application/json",
            Accept: "*/*",
          },
        },
        instance
      );
      console.log(data);
      if (data.value.length === 0 || !data.value.length) {
        console.log("error");
        return;
      }
      for (const record of data.value) {
        if (record.id === null
        || record.id === undefined
        || record.id === "" ||
        record.id === "9123" ||
        record.id === "5737" ||
        record.id === "5738" ) {
          continue;
        }
        if(record.title === "Dummy")
          continue;
        if(!record.displayName)
          continue;
        cooardinators.push({
          id : !record.id ? "-" : record.id,
          //displayNameEn : !record.displayName ? "-" : record.displayName,
          affiliation : !record.eduPersonAffiliation ? '-' : record.eduPersonAffiliation,
          personalTitle : !record.personalTitle ? "-" : record.personalTitle,
          //titleEn : !record.title ? "-" : record.title,
          isStaff: record.eduPersonAffiliation ? true : false,
          displayNameEl : !record["displayName;lang-el"] ? "-" : record["displayName;lang-el"],
          titleEl : !record["title;lang-el"] ? "-" : record["title;lang-el"],
          //personalEntitlementEn :!record.eduPersonEntitlement ? "-" : record.eduPersonEntitlement,
          personalEntitlementEl : !record["eduPersonEntitlement;lang-el"] ? "-" : record["eduPersonEntitlement;lang-el"]
        });
      }
      console.dir(cooardinators);
    });
    const closeInstantly = ref(false);

    const closeMobileViewInstantly = async () => {
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
</style>
