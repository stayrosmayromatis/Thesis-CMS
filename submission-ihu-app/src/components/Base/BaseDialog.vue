<template>
  <teleport to="body">
  <div v-if="modal">
    <v-dialog v-model="modal" attach="body" max-width="6000">
      <v-card>
        <v-card-title class="text-h5">
          {{ innerTitle }}
        </v-card-title>

        <v-card-text>
          {{ innerDescription }}
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red darken-1" text @click="closeModal"> Close </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
  </teleport>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";

export default defineComponent({
  props: {
    innerTitle: String,
    innerDescription: String,
  },
  setup() {
    const modal = ref(true);
    const closeModal = ():void => {
      modal.value =false;
      console.log(modal);
    };
    return { modal, closeModal };
  },
});
</script>
<style scoped>
</style>
