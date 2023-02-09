<template>
  <v-dialog
    v-model="dialog"
    :scrollable="false"
    :close-on-back="false"
    :contained="false"
    width="100%"
    max-width="40rem"
    min-width="320px"
    attach="body"
  >
    <template v-slot:activator="{ props }">
      <v-btn
      class="button-dimensions-adjustment"
        :class="{ 'teacher-button-success' : isValid === true  , 'teacher-button-failure' : !isValid} "
        v-bind="props"
      >
        {{isValid ? selectedTeacher?.displayNameEl.split(' ')[1] : "Καθηγητες" }}
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
            :item-title="'displayNameEl'"
            return-object
            :multiple="false"
            variant="plain"
            density="comfortable"
            v-model="selectedTeacher"
            @update:model-value="validateAutoComplete"
            :open-on-clear="false"
            :error-messages="errorMessage"
          ></v-autocomplete>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-btn color="red-darken-1" variant="text" @click="configSelectedTeacher">
            Κλεισιμο
          </v-btn>
          <v-btn color="blue-darken-1" variant="text" @click="configSelectedTeacher">
            Επιλογή
          </v-btn>
        </v-card-actions>
      </v-card>
    </div>
  </v-dialog>
</template>
<script lang="ts">
import { defineComponent, PropType, ref, toRefs } from "vue";
import { BaseUser } from "@/models/BACKEND-MODELS/BaseUser";
export default defineComponent({
  props:
  {
    seeded_professors : {
        type : Object as PropType<Array<BaseUser>>,
        required : false,
        default : Array<BaseUser>()
    },
    is_valid:{
      type:Boolean,
      required:false
    }
  },
  emits:['emit-selected-teacher'],
  setup(props,context) {
    const errorMessage = ref<string>('');
    const error = ref<boolean>(false);
    const {seeded_professors , is_valid} = toRefs(props);
    const seeded_professors_reactive = seeded_professors;
    const isValid = is_valid;
    const selectedTeacher = ref<BaseUser>();
    const delay = async (time: number) => {
      return new Promise((resolve) => setTimeout(resolve, time));
    };
    const validateAutoComplete =() => {
      if(!selectedTeacher.value ){
        errorMessage.value="Επιλέξτε καθηγητή παρακαλώ"
        error.value = true;
        return false;
      }
      else{
        errorMessage.value=""
        error.value = false;
        return true;
      }
    }
    const configSelectedTeacher = () => {
      if(!validateAutoComplete() ){
        context.emit('emit-selected-teacher',undefined);
      }
      else{
        context.emit('emit-selected-teacher',selectedTeacher.value);
      }
      dialog.value = false;
    };
    const dialog = ref<boolean>(false);
    return {
      error,
      dialog,
      autoCompleteItems:seeded_professors_reactive,
      selectedTeacher,
      errorMessage,
      validateAutoComplete,
      configSelectedTeacher,
      isValid
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

.teacher-button-success{
  color: white !important;
  background-color: #4CAF50 !important;
}
.teacher-button-failure{
  color: white !important;
  background-color: #156ed3 !important;
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
