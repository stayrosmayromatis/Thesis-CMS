<template>
  <v-dialog
    v-model="dialog"
    :scrollable="false"
    close-on-back
    :contained="false"
    width="100%"
    max-width="40rem"
    min-width="320px"
    attach="body"
  >
    <template v-slot:activator="{ props }">
      <v-btn
        class="button-dimensions-adjustment"
        color="primary"
        v-bind="props"
        @click="fillAutocomplete"
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
            :items="autoCompleteItems"
            :multiple="false"
            variant="plain"
            density="comfortable"
            v-model="modelValue"
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
</template>
<script lang="ts">
import { defineComponent, ref } from "vue";
import { useStore } from "vuex";
import { key } from "@/store/index";
import { BaseUser } from "@/models/BACKEND-MODELS/BaseUser";
import { computed } from '@vue/runtime-core';
interface AutocompleteMap extends BaseUser {
  title: string;
  value: string;
}
export default defineComponent({
  setup() {
    const store = useStore(key);
    let iterableItems: Array<BaseUser> = Array<BaseUser>();
    const autoCompleteItems = ref<Array<AutocompleteMap>>(
      new Array<AutocompleteMap>()
    );
    const modelValue = ref<any>();
    async function fillAutocomplete() {
      await delay(1000);
      iterableItems = store.getters.getSeededProfessors;
      if (!iterableItems || iterableItems.length === 0) {
        return;
      }
      iterableItems.forEach((item) => {
        const obj: AutocompleteMap = {
          title: item.displayNameEl ?? "",
          value: item.Guid ?? "",
          ...item,
        };
        autoCompleteItems.value.push(obj);
      });
    }
    const delay = async (time: number) => {
      return new Promise((resolve) => setTimeout(resolve, time));
    };
    const dialog = ref<boolean>(false);
    const dialogm1 = ref<string>("");
    return {
      dialog,
      dialogm1,
      autoCompleteItems,
      fillAutocomplete,
      modelValue
    };
  },
});
</script>

<style scoped>
/* .card-override {
  max-width: 40rem !important;
  min-width: 320px !important;
  width: 100% !important;
} */

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
