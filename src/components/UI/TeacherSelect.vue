<template>
  <!-- <v-row> -->
    <!-- justify="center" -->
    <v-dialog
      v-model="dialog"
      scrollable
      close-on-back
      contained
      class="dialog-override"
    >
      <template v-slot:activator="{ props }">
        <v-btn
          class="button-dimensions-adjustment"
          color="primary"
          v-bind="props"
        >
          Καθηγητες
        </v-btn>
      </template>
      <div class="card-override">
        <v-card>
          <v-card-title>Επιλέξτε Καθηγητή</v-card-title>
          <v-divider></v-divider>
          <v-card-text>
            <v-autocomplete
              autofocus
              clearable
              label="Αναζητήστε εδώ"
              :items="[
                'California',
                'Colorado',
                'Florida',
                'Georgia',
                'Texas',
                'Wyoming',
              ]"
              :multiple="false"
              variant="plain"
              density="comfortable"
              :open-on-clear="false"
            ></v-autocomplete>
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions>
            <v-btn color="red-darken-1" variant="text" @click="dialog = false">
              Κλεισιμο
            </v-btn>
            <v-btn color="blue-darken-1" variant="text" @click="dialog = false">
              Επιλογή
            </v-btn>
          </v-card-actions>
        </v-card>
      </div>
    </v-dialog>
  <!-- </v-row> -->
</template>
<script lang="ts">
import { defineComponent, ref } from "vue";
export default defineComponent({
  setup() {
    const dialog = ref<boolean>(false);
    const dialogm1 = ref<string>("");
    return { dialog, dialogm1 };
  },
});
</script>

<style scoped>
:deep(.v-dialog--scrollable .v-overlay__content) {
  display: flex;
  flex-direction: row;
  width: 100%;
  justify-content: center;
  align-items: center;
}
:deep(.v-dialog) {
  align-items: center;
  justify-content: center;
  margin: auto;
  min-width: 320px;
}

.card-override {
  max-width: 40rem;
  min-width: 320px;
  width: 100%;
}

:deep(.v-card-actions) {
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  min-height: 52px;
  padding: 0.5rem;
}

:deep(.v-card-title) {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  font-weight: 500;
  hyphens: auto;
  letter-spacing: 0.0125em;
  min-width: 0;
  overflow-wrap: normal;
  overflow: hidden;
  padding: 0.5rem 1rem;
  text-overflow: ellipsis;
  text-transform: none;
  white-space: pre-line;
  word-break: normal;
  word-wrap: break-word;
}

.button-dimensions-adjustment {
  width: 11rem;
  height: 3rem;
}
</style>
