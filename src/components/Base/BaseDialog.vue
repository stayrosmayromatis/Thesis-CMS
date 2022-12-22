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
          <v-btn variant="flat" color="red darken-1" text @click="closeModal">ok</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </teleport>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";

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
  },
  setup() {
    const modal = ref(true);
    const closeModal = (): void => {
      modal.value = false;
    };
    return { modal, closeModal };
  },
});
</script>
<style scoped>
:deep(.v-card-title) {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: row;
  background-color: #aacaf3;
  padding: 1rem;
  text-transform: capitalize;
  font-size: 1.2rem;
}

:deep(.v-card-text) {
  font-weight: 500;
  text-transform: capitalize;
}

:deep(.v-dialog.v-overlay__content) {
  background-color: black;
}

:deep(.v-card.v-theme--light.v-card--density-default.v-card--variant-elevated) {
  border-radius: 35px;
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
  width: 25%;
}

:deep(.v-overlay__content) {
  min-width: 320px;
}

@media (min-width: 769px) {
  :deep(.v-card-actions) {
    margin-right: 1rem;
    display: flex;
    flex-direction: row;
  }

  :deep(.v-card-actions .v-btn) {
    width: inherit;
  }

  :deep(.v-card.v-theme--light.v-card--density-default.v-card--variant-elevated) {
    border-radius: 35px;
    margin: 0 1rem;
  }
}
</style>
