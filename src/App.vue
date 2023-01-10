<template>
  <the-header></the-header>
  <router-view></router-view>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import TheHeader from "@/components/UI/TheHeader.vue";
export default defineComponent({
name: "App",
components: {
  TheHeader,
},
});
</script>

<style>
body{
  box-sizing: border-box;
  background-color: #f4f4ff;
}
</style>

