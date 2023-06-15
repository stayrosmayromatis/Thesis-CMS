<!-- <template>
  <transition  type="animation" name="bounce">
    <div v-if="show" class="outer-alert-container">
      <v-alert :title="title" closable :type="alertTypeProp" density="compact" prominent
        tag="div" class="alert-override" :icon="mdiIconString" :close-icon="'mdi-window-close'"></v-alert>
    </div>
  </transition>
  <transition type="animation" name="bounce">
    <h1 v-if="showAlert">hello world</h1>
  </transition>
</template> -->

<!-- <script lang="ts">
import { computed, defineComponent, ref, toRefs } from "vue";

export default defineComponent({
  props: {
    title: {
      type: String,
      required: false,
      default: "Title",
    },
    alertTypeProp: {
      type: String,
      required: false,
      default: false,
    },
    show: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  setup(props) {
    const { alertTypeProp, show, title } = toRefs(props);
    
    const mdiIconString = computed(() => {
            if(!alertTypeProp.value) return 'mdi-information-outline';
            if (alertTypeProp.value === "error") {
                return 'mdi-alert-circle-outline'
            }
            if (alertTypeProp.value === "success") {
                return 'mdi-check';
            }
            if (alertTypeProp.value === "info") {
                return 'mdi-information-outline'
            }

        })
    return { alertTypeProp, show, title, mdiIconString };
  },
});
</script> -->
<!-- <style scoped>

.bounce-enter-active {
  animation: animate-in 0.3s ease-in 0s 1 normal both;
}

.bounce-leave-active {
  animation: animate-out 0.3s ease-out 0s 1 normal none;
}

@keyframes animate-in {
  0% {
    transform: translateX(-50px);
    opacity: 0;
    scale: 1;
  }

  50% {
    opacity: 0.7;
    scale: 1;
  }

  100% {
    transform: translateX(0px);
    opacity: 1;
    scale: 1;
  }
}

@keyframes animate-out {
  0% {
    transform: translateX(0px);
    opacity: 1;
    scale: 1;
  }

  50% {
    opacity: 0.7;
    scale: 1;
  }

  100% {
    transform: translateX(-50px);
    opacity: 0;
    scale: 1;
  }
}
.alert-override {
  border-radius: 9999px;
  width: fit-content;
  max-width: fit-content;
  height: fit-content;
  max-height: 200px;
  text-align: center;
  white-space: break-spaces;
  overflow-wrap: break-word;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.2rem;
}

.outer-alert-container {
  position: fixed;
  position: relative;
  z-index: 9999;
  position: fixed;
  justify-content: center;
  align-items: center;
  width: fit-content;
  align-self: center;
  right: 15px;
  margin: 0 auto;
}

.outer-alert-container :deep(.v-alert-title) {
  align-items: center;
  align-self: center;
  display: flex;
  font-size: 1.1rem;
  font-weight: 500;
  hyphens: auto;
  line-height: 1.5rem;
  overflow-wrap: normal;
  text-transform: none;
  word-break: normal;
  word-wrap: break-word;
}

.outer-alert-container :deep(div.v-alert__close) {
  align-self: center;
  margin-inline-start: 0;
}

.outer-alert-container :deep(.v-btn) {
  margin: 0 !important;
  padding: 0 !important;
  font-size: 0.9rem !important;
  padding: 0.7rem 0 !important;
}



@media (min-width: 769px) {
  .outer-alert-container {
    position: fixed;
    z-index: 9999;
    right: 10px;
  }

  .outer-alert-container :deep(.v-btn) {
    padding: 0 !important;
    font-size: 1.3rem !important;
    margin-right: 0.3rem !important;
    margin-left: 0.5rem !important;
  }
}
</style>  -->
