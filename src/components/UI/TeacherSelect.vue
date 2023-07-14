<template>
  <v-dialog v-model="dialog" :scrollable="false" :close-on-back="false" :contained="false" persistent width="100%"
    max-width="40rem" min-width="320px" attach="body">
    <template v-slot:activator="{ props }">
      <v-btn style="font-weight: 550 !important;"  v-if="!by_admin_option" class="button-dimensions-adjustment" :class="{
        'teacher-button-success': error_on_selected_teacher === false,
        'teacher-button-idle': !error_on_selected_teacher && !selectedTeacher,
        'teacher-button-failure': error_on_selected_teacher === true,
      }" v-bind="props">
      <div>
        <label for="">{{ lastNameProp }}</label>
      </div>
      </v-btn>
      <v-btn style="font-weight: 550 !important;" v-else class="button-dimensions-adjustment__admin" :class="{
        'teacher-button-success': error_on_selected_teacher === false,
        'teacher-button-idle': !error_on_selected_teacher && !selectedTeacher,
        'teacher-button-failure': error_on_selected_teacher === true,
      }" v-bind="props">
        <div style="display: flex; justify-content: center;align-items: center; gap: 0.3rem;">
        <svg width="25" height="25" viewBox="0 0 24 24"><path fill="white" d="M11 17h2v-4h4v-2h-4V7h-2v4H7v2h4v4Zm1 5q-2.075 0-3.9-.788t-3.175-2.137q-1.35-1.35-2.137-3.175T2 12q0-2.075.788-3.9t2.137-3.175q1.35-1.35 3.175-2.137T12 2q2.075 0 3.9.788t3.175 2.137q1.35 1.35 2.138 3.175T22 12q0 2.075-.788 3.9t-2.137 3.175q-1.35 1.35-3.175 2.138T12 22Zm0-2q3.35 0 5.675-2.325T20 12q0-3.35-2.325-5.675T12 4Q8.65 4 6.325 6.325T4 12q0 3.35 2.325 5.675T12 20Zm0-8Z"/></svg>
        <label style="cursor: pointer;">{{ lastNameProp }}</label>
      </div>
      </v-btn>
    </template>
    <div class="card-override">
      <v-card>
        <v-card-title>Επιλέξτε Καθηγητή</v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <div class="autocomplete-padder">
            <v-autocomplete :disabled="cantFindTeacherFlag" :autofocus="false" clearable label="Αναζητήστε εδώ"
              :items="autoCompleteItems" :item-title="'displayNameEl'" return-object :custom-filter="validationRules"
              :multiple="false" variant="plain" density="comfortable" v-model="selectedTeacher"
              @update:model-value="validateAutoComplete" :open-on-clear="false" :error-messages="errorMessage"
              no-data-text="Δεν βρέθηκαν καθηγητές. Παρακαλώ κάντε ανανέωση το παράθυρο."></v-autocomplete>
          </div>
        </v-card-text>
        <div class="cant-find-teacher-outer-div">
          <div class="cant-find-teacher">
            <v-card-title :class="{ 'gray-out': !cantFindTeacherFlag }">Δεν βρίσκω τον καθηγητή</v-card-title>
            <span>
              <v-switch color="primary" v-model="cantFindTeacherFlag" :value="true" hide-details></v-switch>
            </span>
          </div>
          <div class="cant-find-teacher-fields">
            <v-text-field label="Όνομα" variant="solo" :disabled="!cantFindTeacherFlag" v-model.trim="newName"
              :error-messages="errorMessageName" :error="errorOnName" @input="validateName"></v-text-field>
            <v-text-field label="Επώνυμο" variant="solo" :disabled="!cantFindTeacherFlag" v-model.trim="newSurname"
              :error-messages="errorMessageSurname" :error="errorOnSurname" @input="validateSurname"></v-text-field>
          </div>
        </div>
        <v-divider></v-divider>
        <v-card-actions>
          <v-btn color="red-darken-1" variant="text" @click="closeModal">
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
import {
  computed,
  defineComponent,
  onMounted,
  PropType,
  ref,
  toRefs,
} from "vue";
import { BaseUser } from "@/models/BACKEND-MODELS/BaseUser";
import { isNumber } from "@vueuse/shared";
import { useProfessor } from "@/composables/useProfessors.composable";
import { computedEager } from "@vueuse/core";
export interface CreateProfRequest {
  Firstname: string;
  Lastname: string;
}
export default defineComponent({
  props: {
    seeded_professors: {
      type: Object as PropType<Array<BaseUser>>,
      required: false,
      default: Array<BaseUser>(),
    },
    error_on_selected_teacher: {
      type: Boolean,
      required: false,
      default: false,
    },
    selected_teacher_by_edit_flag: {
      type: Boolean,
      required: false,
      default: false,
    },
    selected_teacher_by_edit_value: {
      type: Object as PropType<BaseUser>,
      required: false,
      default: undefined,
    },
    by_admin_option: {
      type: Boolean,
      required: false,
      default: false,
    },
    delete_selected_by_admin_option: {
      type: Boolean,
      required: false,
      default: false,
    }
  },
  emits: ["emit-selected-teacher"],
  setup(props, context) {
    const { CreateProfessor } = useProfessor();
    const errorMessage = ref<string>("");
    const error = ref<boolean>(false);

    const errorMessageName = ref<string>("");
    const errorOnName = ref<boolean>(false);

    const errorMessageSurname = ref<string>("");
    const errorOnSurname = ref<boolean>(false);

    const dialog = ref<boolean>(false);

    const newName = ref<string>("");
    const newSurname = ref<string>("");

    const { seeded_professors, error_on_selected_teacher, selected_teacher_by_edit_flag, selected_teacher_by_edit_value, by_admin_option, delete_selected_by_admin_option } = toRefs(props);
    const seeded_professors_reactive = seeded_professors;

    const selectedTeacher = ref<BaseUser>();
    const cantFindTeacherFlag = ref(false);
    const validationRules = (listOfTeachers:string, searchValue:string) => {
      // Split the teacher's name into first and last name
      const list = listOfTeachers.split(" ");
      if(!list || !list.length)
        return false;
      const [firstName, lastName] = list;
      // Convert both the first name, last name, and the search string to lowercase
      const teacherFirstName = convertGreekEmphasisToRegular(firstName.trim().toLowerCase());
      const teacherLastName = convertGreekEmphasisToRegular(lastName.trim().toLowerCase());
      const search = convertGreekEmphasisToRegular(searchValue.trim().toLowerCase());
      // Check if the first name or last name includes the search string
      return teacherFirstName.includes(search) || teacherLastName.includes(search);
      ;
    };
    const greekEmphasisMap = {
      "ά": "α",
      "έ": "ε",
      "ί": "ι",
      "ό": "ο",
      "ύ": "υ",
      "ή": "η",
      "ώ": "ω",
      "ϊ": "ι",
      "ϋ": "υ",
      "ΐ": "ι",
      "ΰ": "υ"
    };

    const convertGreekEmphasisToRegular = (text:string) => {
      for (const [emphasisChar, regularChar] of Object.entries(greekEmphasisMap)) {
        text = text.replace(new RegExp(emphasisChar, "g"), regularChar);
      }
      return text;
    }

    onMounted(() => {
      if (selected_teacher_by_edit_flag.value === true && selected_teacher_by_edit_value.value) {
        selectedTeacher.value = selected_teacher_by_edit_value.value;
        context.emit("emit-selected-teacher", selected_teacher_by_edit_value.value);
        return;
      }
    });
    const validateAutoComplete = () => {
      if (!selectedTeacher.value) {
        errorMessage.value = "Επιλέξτε καθηγητή παρακαλώ";
        error.value = true;
        return false;
      } else {
        errorMessage.value = "";
        error.value = false;
        return true;
      }
    };
    const configSelectedTeacher = async () => {
      if (cantFindTeacherFlag.value) {
        const isValidName = validateName();
        const isValidSurname = validateName();
        if (isValidName && isValidSurname) {
          const payload: CreateProfRequest = {
            Firstname: newName.value,
            Lastname: newSurname.value,
          };
          const profIDT = await CreateProfessor(payload);
          if (!profIDT || !profIDT.Status || !profIDT.Data) {
            context.emit("emit-selected-teacher", undefined);
            dialog.value = false;
          }
          selectedTeacher.value = profIDT.Data!;
          context.emit("emit-selected-teacher", selectedTeacher.value);
          newName.value = "";
          newSurname.value = "";
          cantFindTeacherFlag.value = false;
          errorMessage.value = "";
          error.value = false;
        } else {
          context.emit("emit-selected-teacher", undefined);
          dialog.value = false;
        }
      } else {
        if (!validateAutoComplete()) {
          selectedTeacher.value = undefined;
          context.emit("emit-selected-teacher", selectedTeacher.value);
        } else {
          context.emit("emit-selected-teacher", selectedTeacher.value);
        }
        dialog.value = false;
      }
    };
    const validateName = () => {
      if (!newName.value || !newName.value.trim().length || newName.value.trim() === " ") {
        errorMessageName.value = "Υποχρεωτικό όνομα";
        errorOnName.value = true;
        return false;
      } else if (isNumber(newName.value) || containsNumbers(newName.value)) {
        errorMessageName.value = "Οχι Ψηφία ή/και σύμβολα";
        errorOnName.value = true;
        return false;
      } else {
        errorMessageName.value = "";
        errorOnName.value = false;
        return true;
      }
    };
    const validateSurname = () => {
      if (!newSurname.value || !newSurname.value.trim().length || newSurname.value.trim() === " ") {
        errorMessageSurname.value = "Υποχρεωτικό επώνυμο";
        errorOnSurname.value = true;
        return false;
      } else if (
        isNumber(newSurname.value) ||
        containsNumbers(newSurname.value)
      ) {
        errorMessageSurname.value = "Οχι Ψηφία ή/και σύμβολα";
        errorOnSurname.value = true;
        return false;
      } else {
        errorMessageSurname.value = "";
        errorOnSurname.value = false;
        return true;
      }
    };
    const lastNameProp = computed(() => {
      if (!error_on_selected_teacher || !selectedTeacher.value) {
        return !by_admin_option.value ? "Καθηγητες" : "Νεος Διαχειριστης";
      }
      const splitted = selectedTeacher.value?.displayNameEl.split(" ");
      if (!splitted || splitted.length == 0) {
        return !by_admin_option.value ? "Καθηγητες" : "Νεος Διαχειριστης";
      }
      return splitted[splitted.length - 1];
    });
    const containsNumbers = (str: string) => {
      const pattern = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
      const numberpattern = /\d/;
      return Boolean(str.match(numberpattern) || str.match(pattern));
    }
    function closeModal() {
      selectedTeacher.value = undefined;
      context.emit("emit-selected-teacher", selectedTeacher.value);
      dialog.value = false;
    }
    const deleteSelectedByAdminOption = computedEager(() => {
      if (by_admin_option.value && delete_selected_by_admin_option.value) {
        selectedTeacher.value = undefined;
        context.emit("emit-selected-teacher", selectedTeacher.value);
        dialog.value = false;
      }
    });
    return {
      validationRules,
      error,
      dialog,
      autoCompleteItems: seeded_professors_reactive,
      selectedTeacher,
      errorMessage,
      validateAutoComplete,
      configSelectedTeacher,
      cantFindTeacherFlag,
      errorMessageName,
      errorMessageSurname,
      newName,
      newSurname,
      errorOnName,
      errorOnSurname,
      validateName,
      validateSurname,
      lastNameProp,
      closeModal
    };
  },
});
</script>

<style scoped>
.card-override {
  min-width: 320px;
}

.teacher-button-success {
  color: white !important;
  background-color: #4caf50 !important;
}

.teacher-button-idle {
  color: white !important;
  background-color: #156ed3 !important;
}

.teacher-button-failure {
  color: white !important;
  background-color: #ff4545 !important;
}

.cant-find-teacher {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  min-width: 320px;
}

.cant-find-teacher span {
  margin: 0 1rem;
}

.cant-find-teacher-fields {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: stretch;
  gap: 0.5rem;
  width: 100%;
  min-width: 320px;
}

.autocomplete-padder {
  padding: 0.5rem 0.5rem;
}

.cant-find-teacher-outer-div {
  display: flex;
  flex-direction: column;
  width: 100%;
  justify-content: center;
  align-items: center;
  min-width: 320px;
  padding: 1rem 1rem;
}

.gray-out {
  color: #f3f3f3;
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
  -webkit-hyphens : auto;
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
  overflow-wrap: break-word;
}

.button-dimensions-adjustment {
  width: 11rem;
  height: 3rem;
}

.button-dimensions-adjustment__admin {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: fit-content;
  height: 2.2rem;
  padding: 0 1rem;
  text-transform: uppercase;
  hyphens: auto;
  -webkit-hyphens: auto;
  letter-spacing: 1px;
  gap: 0.5rem;

}

@media (min-width: 769px) {
  .cant-find-teacher-fields {
    flex-direction: row;
    align-items: center;
    gap: 1rem;
  }
}

/* @media (min-width: 1025px) {} */
</style>
