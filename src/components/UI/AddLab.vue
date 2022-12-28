<template>
  <div class="parent-card">
    <v-card elevation="5" class="parent-label">
      <v-card-title> ΦΟΡΜΑ ΕΙΣΑΓΩΓΗΣ ΕΡΓΑΣΤΗΡΙΟΥ </v-card-title>
    </v-card>
  </div>
  <div class="parent-card-form">
    <v-card elevation="5">
      <v-form @submit.prevent="submitForm">
        <v-container>
          <div :class="{ 'error-color': v$.semester.$error }">
            <v-chip-group>
              <v-chip :class="{ 'active-chip': lab.isActive }" @click="clickOnChip(lab.value)"
                v-for="lab in displayedSemester" :key="lab.title">{{ lab.title }}</v-chip>
            </v-chip-group>
          </div>
          <v-divider inset></v-divider>
          <div class="label-centerer">
            <label for="year">Βασικά Στοιχεία</label>
          </div>
          <div class="form-first">
            <v-text-field :class="{ 'error-color': v$.labId.$error }" :error-messages="errorOfLabId"
              label="Κωδικός Εργαστηρίου" v-model.trim="formState.labId"></v-text-field>
            <v-text-field :class="{ 'error-color': v$.labTitle.$error }" :error-messages="errorOfLabTitle"
              label="Τίτλος Εργαστηρίου" v-model.trim="formState.labTitle"></v-text-field>
          </div>
          <v-divider inset></v-divider>
          <div class="label-centerer">
            <label for="year">Ώρες Διαθεσιμόςτητας</label>
          </div>
          <div class="form-control-add-btn">
            <v-btn type="button" @click="addFormGroup" elevation="4" color="green"><svg width="30" height="30"
                clip-rule="evenodd" fill-rule="evenodd" stroke-linejoin="round" stroke-miterlimit="2"
                viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="m21 3.998c0-.478-.379-1-1-1h-16c-.62 0-1 .519-1 1v16c0 .621.52 1 1 1h16c.478 0 1-.379 1-1zm-16.5.5h15v15h-15zm6.75 6.752h-3.5c-.414 0-.75.336-.75.75s.336.75.75.75h3.5v3.5c0 .414.336.75.75.75s.75-.336.75-.75v-3.5h3.5c.414 0 .75-.336.75-.75s-.336-.75-.75-.75h-3.5v-3.5c0-.414-.336-.75-.75-.75s-.75.336-.75.75z"
                  fill-rule="nonzero" />
              </svg>
              ΠΡΟΣΘΗΚΗ ΤΜΗΜΑΤΟΣ
            </v-btn>
          </div>
          <lab-form v-for="(department, index) in departments" :key="index" :department="department"
            @deleteByDeptId="removeFormGroup"></lab-form>
        </v-container>
        <v-btn :disabled="buttonDisablity" type="submit">Submit</v-btn>
      </v-form>
    </v-card>
  </div>
</template>
<script lang="ts">
import { computed, defineComponent } from "@vue/runtime-core";
import { useVuelidate } from '@vuelidate/core'
import { required, minLength, alphaNum, maxLength, helpers } from '@vuelidate/validators'

import { displayedLabs } from "@/composables/displayedSemesterArray.composable";
import { LabSemesterEnum } from "@/enums/LabSemesterEnum";
import { reactive, Ref, ref } from "vue";
import { DisplayedSemster } from "@/types/displayedsemester.type";
import LabForm from "./LabForm.vue";
import { Department } from "@/types/department.type";
import { DaysOfWeekEnum } from "@/enums/DaysOfWeekEnum";
import { log } from "console";

interface FormStateInterface {
  labTitle: string,
  labId: string,
  semester: LabSemesterEnum | null,
  departments: Array<Department>
}

export default defineComponent({
  components: {
    LabForm,
  },
  setup() {
    let deptIncremental = 1;
    const departments = ref(Array<Department>());
    const displayedSemester: Ref<Array<DisplayedSemster>> = ref(
      displayedLabs()
    );
    const clickOnChip = (value: LabSemesterEnum) => {
      const selectedLab = displayedSemester.value.find((lab) => lab.value == value);
      if (selectedLab) {
        selectedLab.isActive = !selectedLab.isActive;
        formState.semester = selectedLab.isActive ? selectedLab.value : null;
        // lab.semester = selectedLab.value;
        const allRestLabs = displayedSemester.value.filter(
          (restLab) => restLab.value != selectedLab.value
        );
        if (
          allRestLabs &&
          allRestLabs != null &&
          allRestLabs != undefined &&
          allRestLabs.length > 1
        ) {
          allRestLabs.forEach((lab) => {
            if (lab.isActive) lab.isActive = false;
          });
        }
      }
    };
    const addFormGroup = () => {
      departments.value.push({
        deptId: `T${deptIncremental++}`,
        fromTime: "",
        toTime: "",
        day: DaysOfWeekEnum.Δευτέρα,
      });
    };
    const removeFormGroup = (deptId: string) => {
      if (deptId === null || deptId === undefined) return;
      departments.value = departments.value.filter(
        (val) => val.deptId !== deptId
      );
    };

    // -------FORM VALIDATION-------
    const formState = reactive<FormStateInterface>({
      labId: '',
      labTitle: '',
      semester: null,
      departments: Array<Department>()
    });
    const mustContainDash = (value: string) => {
      return value.includes('-') ? true : false;
    }
    const rules = computed(() => {
      return {
        labId: { Required: helpers.withMessage('Ο κωδικός είναι υποχρεωτικός', required), MaxLength: helpers.withMessage('Μέγιστο όριο 9 χαρακτήρες', maxLength(9)), MinLength: helpers.withMessage('Ελάχιστο όριο 9 χαρακτήρες', minLength(9)), MustContainDash: helpers.withMessage('Ο κωδικός πρέπει να περιέχει παύλα', mustContainDash) },
        labTitle: { Required: helpers.withMessage('Ο τίτλος είναι υποχρεωτικός', required), MaxLength: helpers.withMessage('Μέγιστο όριο 50 χαρακτήρες', maxLength(50)), MinLength: helpers.withMessage('Ελάχιστο όριο 10 χαρακτήρες', minLength(10)) },
        semester: { required },
        departments: { required, minLength: minLength(1) }
      }

    })
    const v$ = useVuelidate(rules, formState);

    const errorOfLabId = computed(() => {
      if (v$.value.labId.$error) {
        return v$.value.labId.$errors[0].$message.toString();
      }
      return '';
    });
    const errorOfLabTitle = computed(() => {
      if (v$.value.labTitle.$error) {
        return v$.value.labTitle.$errors[0].$message.toString();
      }
      return '';
    });
    const buttonDisablity = computed(() => {
      if (!formState.labId)
        return true;
      if (!formState.labTitle)
        return true;
      if (!formState.semester)
        return true;
      return false;
    })
    const submitForm = () => {
      v$.value.$validate();
      if(v$.value.$error){
        console.log(v$.value.$errors);
        
      }
      console.log(formState);
      
    };


    return {
      buttonDisablity,
      displayedSemester,
      clickOnChip,
      departments,
      addFormGroup,
      removeFormGroup,
      formState,
      v$,
      submitForm,
      errorOfLabId,
      errorOfLabTitle
    };
  },
});
</script>

<style scoped>
.error-color {
  color: #B00020;
}

.parent-card {
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
}

.parent-label {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 2rem;
  text-transform: uppercase;
  min-width: 320px;
  font-size: 0.95rem;
  font-weight: 500;
  background-color: #aacaf3;
  padding: 1.2rem;
}

.parent-card-form {
  /* height: 66vh; */
  min-width: 320px;
  max-width: 100%;
}

.form-first {
  width: 100%;
  display: flex;
  flex-direction: column;
}

.form-control {
  display: flex;
  flex-direction: row;
  width: 100%;
  justify-content: center;
  align-items: center;
  margin: 1rem 0;
  gap: 1rem;
}

.label-centerer {
  background-color: #f3f3f3;
  margin: 0.5rem auto;
  text-align: center;
  padding: 0.5rem;
  display: flex;
  flex-direction: row;
  justify-content: center;
}

.form-control-add-btn {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
}

:deep(.v-chip.v-chip--density-default) {
  height: 2.5rem;
  font-size: 0.9rem;
  width: fit-content;
}

:deep(.v-chip.v-chip--density-default:hover) {
  color: #156ed3;
  cursor: pointer;
}

:deep(.v-chip-group) {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  padding: 0;
  max-width: 768px;
  min-width: 320px;
  margin-bottom: 1rem;
}

:deep(.v-container) {
  padding: 0;
  overflow: hidden;
  margin: 0 1rem;
  max-width: 4000px;
  width: inherit;
}

.active-chip {
  border: 1px solid #156ed3;
  color: #156ed3;
}

:deep(.v-divider) {
  width: 100%;
  display: flex;
  margin: 0.5rem auto;
  border-color: #f3f3f3;
}

:deep(.v-divider--inset:not(.v-divider--vertical)) {
  max-width: 100%;
  margin-inline-start: 0px;
}

:deep(.v-btn__content) {
  display: flex;
  justify-content: center;
  align-items: center;
  width: fit-content;
  gap: 0.2rem;
}

@media (min-width: 769px) {
  .parent-card {
    margin-top: 1rem;
    margin-bottom: 1rem;
    margin-left: 1rem;
    margin-right: 1rem;
  }

  .parent-label {
    display: flex;
    flex-direction: row;
    align-items: center;
    width: 100%;
    height: 3rem;
    justify-content: center;
    font-size: 1.2rem;
    text-transform: uppercase;
    font-weight: 500;
    background-color: #aacaf3;
  }

  :deep(.v-chip-group) {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
    align-content: flex-start;
    margin-bottom: 1rem;
    margin-top: 1rem;
    max-width: 1024px;
    min-width: 769px;
    overflow-x: auto;
  }

  .parent-card-form {
    margin-left: 1rem;
    margin-right: 1rem;
    height: 66vh;
    min-width: 320px;
    max-width: 100%;
  }

  .parent-card {
    margin-top: 1rem;
    margin-bottom: 1rem;
  }

  .form-first {
    width: 100%;
    display: flex;
    flex-direction: row;
    gap: 1rem;
  }

  .label-centerer {
    background-color: #f3f3f3;
    margin: 0.5rem auto;
    text-align: center;
    padding: 0.5rem;
    display: flex;
    flex-direction: row;
    justify-content: center;
  }
}

@media (min-width: 1025px) {
  .parent-card {
    margin-top: 2rem;
    margin-bottom: 2rem;
    margin-left: 1rem;
    margin-right: 1rem;
  }

  .parent-label {
    display: flex;
    flex-direction: row;
    align-items: center;
    width: 100%;
    height: 3rem;
    justify-content: center;
    font-size: 1.2rem;
    text-transform: uppercase;
    font-weight: 500;
    background-color: #aacaf3;
    min-width: 769px;
  }

  .label-centerer {
    background-color: #f3f3f3;
    margin: 0.5rem auto;
    text-align: center;
    padding: 0.5rem;
    display: flex;
    flex-direction: row;
    justify-content: center;
  }

  :deep(.v-chip-group) {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    margin-bottom: 1rem;
    column-gap: 1rem;
    margin-top: 1rem;
    overflow-x: auto;
    flex-wrap: nowrap;
    max-width: 100%;
  }
}
</style>
