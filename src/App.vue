<template>
  <the-header :closeInstantlyDirective="closeInstantly">
    <!-- <template #content>
      <router-view></router-view>
    </template> -->

  </the-header>
  <router-view @closeMobileView="closeMobileViewInstantly"> </router-view>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import TheHeader from "@/components/UI/TheHeader.vue";
export default defineComponent({
name: "App",
components: {
  TheHeader,
},
setup(){
  const closeInstantly = ref(false);

  const closeMobileViewInstantly = async () => {
    closeInstantly.value = true;
    await delay(0.1);
    closeInstantly.value = false;
  }
  const delay = async (time:number) => {
      return new Promise(resolve => setTimeout(resolve, time));
    }
  return{closeInstantly,closeMobileViewInstantly}
}
});
</script>

<style>
body{
  box-sizing: border-box;
  background-color: #f4f4ff;
}
</style>

