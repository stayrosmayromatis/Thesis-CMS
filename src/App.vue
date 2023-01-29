<template>
  <the-header :closeInstantlyDirective="closeInstantly">
  </the-header>
  <router-view @closeMobileView="closeMobileViewInstantly"> </router-view>
</template>

<script lang="ts">
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
      displayNameEl: string;
      titleEl: string;
      personalEntitlementEl: string;
      personalTitle: string;
      affiliation: string;
      isStaff: boolean;
      displayNameEn?: string;
      titleEn?: string;
      personalEntitlementEn?: string;
    }> = Array();
    onMounted(async () => {
      // const instance = axios.create({
      //   baseURL: "https://api.iee.ihu.gr",
      // });
      // const { data, isFinished } = await useAxios(
      //   "/user",
      //   {
      //     method: "GET",
      //     withCredentials: false,
      //     headers: {
      //       "Content-Type": "application/json",
      //       Accept: "*/*",
      //     },
      //   },
      //   instance
      // );
      // console.log(data);
      // if (data.value.length === 0 || !data.value.length) {
      //   console.log("error");
      //   return;
      // }
      // for (const record of data.value) {
      //   if (
      //     !record.id ||
      //     record.id === null ||
      //     record.id === undefined ||
      //     record.id === "" ||
      //     record.id === "9123" ||
      //     record.id === "5737" ||
      //     record.id === "5738"
      //   ) {
      //     continue;
      //   }
      //   if (record.title === "Dummy") continue;
      //   if (!record.displayName || !record["displayName;lang-el"]) continue;
      //   cooardinators.push({
      //     id: !record.id ? "-" : record.id,
      //     displayNameEl: !record["displayName;lang-el"]
      //       ? "-"
      //       : record["displayName;lang-el"],
      //     titleEl: !record["title;lang-el"] ? "-" : record["title;lang-el"],
      //     personalTitle: !record.personalTitle ? "-" : record.personalTitle,
      //     personalEntitlementEl: !record["eduPersonEntitlement;lang-el"]
      //       ? "-"
      //       : record["eduPersonEntitlement;lang-el"],
      //     isStaff: record.eduPersonAffiliation ? true : false,
      //     affiliation: !record.eduPersonAffiliation ? "-"
      //       : record.eduPersonAffiliation,
      //     //displayNameEn : !record.displayName ? "-" : record.displayName,
      //     //titleEn : !record.title ? "-" : record.title,
      //     //personalEntitlementEn :!record.eduPersonEntitlement ? "-" : record.eduPersonEntitlement,
      //   });
      // }
      // console.dir(cooardinators);

      //  const instance = axios.create({
      //   baseURL: "https://login.iee.ihu.gr",
      // });
      //  const { data, isFinished } = await useAxios(
      //   "/authorization/?client_id=63cc2af359d6a302d7af7528&response_type=code&scope=profile&redirect_uri=http://127.0.0.1:5132/",
      //   {
      //     method: "GET",
      //     headers: {
      //        "Content-Type": "text/html; charset=utf-8",
      //        Accept: "*/*",
      //       //"Referer": "https://127.0.0.1:5132",

      //     },
      //   },
      //   instance
      // );
      // console.log(data);
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
