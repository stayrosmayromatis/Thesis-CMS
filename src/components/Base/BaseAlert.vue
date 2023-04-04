<template>
  <div class="outer-alert-container">
    <transition name="bounce">
      <v-alert v-if="showAlert" :title="title" closable :type="alertType" density="compact"></v-alert>
    </transition>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, toRefs } from "vue";

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
    const alertType = computed(() => {
      switch (alertTypeProp.value) {
        case "error":
          return "error";
        case "success":
          return "success";
        case "info":
          return "info";
        default:
          return "success";
      }
    });
    const showAlert = computed(() => {
      if (show.value === true) return true;
      if (show.value === false) return false;
    });
    return { alertType, showAlert, title };
  },
});
</script>
<style scoped>
.outer-alert-container {
  width: 100%;
  min-width: 320px;
  margin: 0.5rem 0.5rem;
  padding-left: 0.5rem;
  padding-right: 0.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

:deep(.v-alert) {
  border-radius: 1rem;
  width: fit-content;
  padding-left: 16px;
  padding-right: 0;
  margin-right: 1rem;
  text-align: center;
  white-space: pre-line;
  display: flex;

}

/* :deep(.v-alert) {
  border-radius: 1rem;
  width: fit-content;
  padding-bottom: 2px;
  padding-top: 2px;
  padding-left: 16px;
  padding-right: 0;
  margin-right: 1rem;
} */

:deep(.v-alert__close) {
  align-self: flex-start;
  margin-inline-start: 0;
}

:deep(.v-alert__prepend) {
  display: flex;
  align-items: center;
  justify-content: center;
  grid-area: prepend;
  margin-inline-end: 0.5rem;
  align-self: center;
}

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

@media (min-width: 769px) {
  .outer-alert-container {
    align-items: flex-end;
  }
}

@media (min-width: 1025px) {
}
</style>
