<template>
  <teleport to="body">
    <v-dialog v-model="modal" attach="body" width="100%" max-width="50rem">
      <v-card>
        <v-card-title>
          <slot name="title">
            {{ innerTitle }}
          </slot>
        </v-card-title>

        <v-card-text>
          <slot name="description">
            {{ innerDescription }}
          </slot>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <div v-if="routeChangeAuthorizer" >
            <v-btn variant="text" color="red-darken-1" text @click="closeDialog(false)">ΑΚΥΡΩΣΗ</v-btn>
            <v-btn variant="text" color="blue-darken-1" text @click="closeDialog">ΟΚ</v-btn>
          </div>
          <div v-else>
          <v-btn variant="flat" color="red darken-1" text @click="closeModal">ΟΚ</v-btn>
        </div>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </teleport>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import {closeDialog} from 'vue3-promise-dialog';
export default defineComponent({
  props: {
    innerTitle: {
      required: false,
      type: String,
      default: 'The has been an error'
    },
    innerDescription: {
      required: false,
      type: String,
      default: 'The has been an error'
    },
    routeChangeAuthorizer:{
      type:Boolean,
      required:false,
      default:false
    }
  },
  emits:['close-modal'],
  setup(_,context) {
    const modal = ref(true);
    const closeModal = (): void => {
      modal.value = false;
      context.emit('close-modal');
    };
    function returnValue() {
      return true;
    }
    return { modal, closeModal,closeDialog,returnValue };
  },
});
</script>
<style scoped>
:deep(.v-card-title) {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  background-color: #aacaf3;
  padding: 1rem;
  text-transform: capitalize;
  font-size: 1rem;
  width: 100%;
  word-break: break-word;
  white-space: pre-line;
  text-align: center;
}

:deep(.v-card-text) {
  font-weight: 500;
  text-transform: capitalize;
}

:deep(.v-dialog.v-overlay__content) {
  background-color: black;
}

:deep(.v-card.v-theme--light.v-card--density-default.v-card--variant-elevated) {
  border-radius: 20px;
  margin: 0 1rem;
}

:deep(.v-card-actions) {
  display: flex;
  flex-direction: column;
  margin: 0;
  justify-content: center;
  align-items: center;
}

:deep(.v-card-actions .v-btn) {
  width: 7rem;
}

:deep(.v-overlay__content) {
  min-width: 320px;
}

@media (min-width: 769px) {
  :deep(.v-card-actions) {
    margin-right: 1rem;
    display: flex;
    flex-direction: row;
    margin-bottom: 0.5rem;
  }

  :deep(.v-card-actions .v-btn) {
    width: inherit;
  }

  :deep(.v-card.v-theme--light.v-card--density-default.v-card--variant-elevated) {
    border-radius: 20px;
    margin: 0 1rem;
  }
}
</style>
