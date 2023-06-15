<template>
  <the-header :closeInstantlyDirective="closeInstantly"></the-header>
  <router-view v-slot="{ Component }" @closeMobileView="closeMobileViewInstantly">
    <transition enter-active-class="animate__animated animate__fadeInUp"
      leave-active-class="animate__animated animate__fadeOutDown" mode="out-in">
      <component :is="Component"></component>
    </transition>
  </router-view>
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
    // const { IsAuthenticated } = useAuth();
    // const {GetPeriodState} = usePeriod();
    // onMounted( async () => {

    // });
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
  margin: 0 auto;
  min-width: 320px;
  max-width: 120rem;
}

html {
  overflow-y: auto !important;
  overflow-x: auto !important;
}

/* basic-animation actually */
/* .fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
} */

/* .router-animation-enter-from,
.router-animation-leave-to{
  opacity: 0;
}
.router-animation-enter-active,
.router-animation-leave-active{
  transition: opacity 0.5s ease-out;
} */


/* .router-animation-enter-active
{
  animation : animate-in 0.3s ease-in 0s 1 ease-in normal both;
}

.router-animation-leave-active{
  animation: animate-out 0.5s ease-in 0s 1 ease-in normal none;
}  */

/* @keyframes animate-in {
    0% {
     filter:blur(12px);
			opacity:0; 
      letter-spacing:0.5rem; 
		}
    50%{
      filter:blur(6px);
      opacity:0.5;
    }
		100% {
      filter:blur(0px); 
      opacity:1;
		}

} */
/* @keyframes animate-out {
  0% {
 filter:blur(0px);
    opacity:1;
		}
    50%{
     filter:blur(6px);
      opacity:0.5;
    }
		100% {
			 filter:blur(12px); 
			opacity:0;
      letter-spacing:0.5rem; 
		}
} */

.animate__animated.animate__fadeInUp {
  --animate-duration: 0.5s;
  --animate-delay: 0s;
}

.animate__animated.animate__fadeOutDown {
  --animate-duration: 0.5s;
  --animate-delay: 0;
}
</style>
