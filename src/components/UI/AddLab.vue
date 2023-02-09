<template>
  <div @click="emitMobileViewClose">
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
                <v-chip
                  :class="{ 'active-chip': lab.isActive }"
                  @click="clickOnChip(lab.value)"
                  v-for="lab in displayedSemester"
                  :key="lab.title"
                  >{{ lab.title }}</v-chip
                >
              </v-chip-group>
            </div>
            <v-divider inset></v-divider>
            <div class="label-centerer">
              <label for="year">Βασικά Στοιχεία</label>
            </div>
            <div class="form-first">
              <v-text-field
                :class="{ 'error-color': v$.labId.$error }"
                :error-messages="errorOfLabId"
                label="Κωδικός Εργαστηρίου"
                v-model.trim="formState.labId"
              ></v-text-field>
              <v-text-field
                :class="{ 'error-color': v$.labTitle.$error }"
                :error-messages="errorOfLabTitle"
                label="Τίτλος Εργαστηρίου"
                v-model.trim="formState.labTitle"
              ></v-text-field>
            </div>
            <div class="form-first">
              <v-text-field
                :class="{ 'error-color': v$.description.$error }"
                :error-messages="errorOfDescription"
                label="Περιγραφή Εργαστηρίου"
                v-model.trim="formState.description"
              ></v-text-field>
              <div class="percent49-5">
                <v-select
                  :class="{ 'error-color': v$.labTitle.$error }"
                  :items="displayedAttendaceValues"
                  :error-messages="errorOfAttendance"
                  label="Παρακολούθηση"
                  density="default"
                  v-model="formState.attendance"
                ></v-select>
              </div>
            </div>
            <v-divider inset></v-divider>
            <div class="label-centerer">
              <label for="year">Ώρες Διαθεσιμόςτητας</label>
            </div>
            <div class="info-centerer">
              <base-alert
                :alert-type-prop="'info'"
                :show="true"
                :title="'Εαν θέτε να δηλώσετε το ίδιο τμήμα σε διαφορετική ήμερα/ώρα κρατήστε ίδιο το Αναγνωριστικό (Τ)'"
              ></base-alert>
            </div>
            <div class="form-control-add-btn">
              <v-btn
                type="button"
                @click="addFormGroup"
                elevation="4"
                color="green"
                ><svg
                  width="30"
                  height="30"
                  clip-rule="evenodd"
                  fill-rule="evenodd"
                  stroke-linejoin="round"
                  stroke-miterlimit="2"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="m21 3.998c0-.478-.379-1-1-1h-16c-.62 0-1 .519-1 1v16c0 .621.52 1 1 1h16c.478 0 1-.379 1-1zm-16.5.5h15v15h-15zm6.75 6.752h-3.5c-.414 0-.75.336-.75.75s.336.75.75.75h3.5v3.5c0 .414.336.75.75.75s.75-.336.75-.75v-3.5h3.5c.414 0 .75-.336.75-.75s-.336-.75-.75-.75h-3.5v-3.5c0-.414-.336-.75-.75-.75s-.75.336-.75.75z"
                    fill-rule="nonzero"
                  />
                </svg>
                ΠΡΟΣΘΗΚΗ ΤΜΗΜΑΤΟΣ
              </v-btn>
            </div>
            <lab-form
              v-for="(department, index) in departments"
              :key="index"
              :department="department"
              :seeded_professors="seededProfessors"
              @deleteByDeptId="removeFormGroup"
              @global-error="validateEachDepartment"
            ></lab-form>
            <div class="submit-button">
              <v-btn id="submit-btn" :disabled="buttonDisablity" type="submit"
                >ΚΑΤΑΧΩΡΗΣΗ</v-btn
              >
            </div>
          </v-container>
        </v-form>
      </v-card>
    </div>
  </div>
</template>
<script lang="ts">
import { computed, defineComponent } from "@vue/runtime-core";
import { useVuelidate } from "@vuelidate/core";
import { required, minLength, maxLength, helpers } from "@vuelidate/validators";

import { displayedLabs } from "@/composables/displayedSemesterArray.composable";
import { LabSemesterEnum } from "@/enums/LabSemesterEnum";
import { reactive, Ref, ref, onMounted } from "vue";
import { DisplayedSemster } from "@/models/displayedsemester.type";
import LabForm from "./LabForm.vue";
import { Department } from "@/models/department.type";
import { DaysOfWeekEnum } from "@/enums/DaysOfWeekEnum";
import { Lab } from "@/models/lab.type";
import { isNumber } from "@vueuse/shared";
import { AttendanceEnum } from "@/enums/AttendanceEnums";
import BaseAlert from "@/components/Base/BaseAlert.vue";
import {useProfessor} from "@/composables/useProfessors.composable";
import { useStore } from "vuex";
import { key } from "@/store";
import { BaseUser } from "@/models/BACKEND-MODELS/BaseUser";
export default defineComponent({
  components: {
    LabForm,
    BaseAlert,
  },
  emits: ["closeMobileView"],
  setup(_, context) {
    const {GetSeededProfessors} = useProfessor();
    const store= useStore(key);
    const seededProfessors = ref<Array<BaseUser>>(new Array<BaseUser>());
    onMounted(async () => {
      
      //SeedProfessorsSegment
      await GetSeededProfessors();
      seededProfessors.value = store.getters.getSeededProfessors;
      while(!seededProfessors.value || seededProfessors.value.length == 0)
      {
        await GetSeededProfessors();
        seededProfessors.value = store.getters.getSeededProfessors;
      }
      context.emit("closeMobileView", true);
      return;
    });
    //SeedProfessorsSegment
    const emitMobileViewClose = (): void => {
      context.emit("closeMobileView", true);
      return;
    };
    let deptIncremental = 1;
    const show = true;
    const departments = ref(Array<Department>());
    const displayedSemester: Ref<Array<DisplayedSemster>> = ref(
      displayedLabs()
    );
    const clickOnChip = (value: LabSemesterEnum) => {
      const selectedLab = displayedSemester.value.find(
        (lab) => lab.value == value
      );
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
      if (departments.value.length === 0) {
        deptIncremental = 1;
      }
      departments.value.push({
        deptId: `T${deptIncremental++}`,
        fromTime: "",
        toTime: "",
        day: DaysOfWeekEnum.Δευτέρα,
        numberOfStudents: 30,
      });
    };
    const removeFormGroup = (deptId: string) => {
      if (deptId === null || deptId === undefined) return;
      departments.value = departments.value.filter(
        (val) => val.deptId !== deptId
      );
    };
    //Just the initial values
    const displayedAttendaceValues = Array(
      {
        value: AttendanceEnum.ΥΠ,
        title: "ΥΠ",
      },
      {
        value: AttendanceEnum.ΠΡ,
        title: "ΠΡ",
      },
      {
        value: AttendanceEnum.ΥΠ_ΠΡ,
        title: "ΥΠ ΠΡ",
      }
    );
    // -------FORM VALIDATION-------

    const formState = reactive<Lab>({
      labId: "",
      labTitle: "",
      description: "",
      semester: null,
      departments,
      attendance: {
        value: AttendanceEnum.ΥΠ,
        title: "ΥΠ",
      },
    });
    const mustContainDash = (value: string) => {
      return value.includes("-") ? true : false;
    };
    const atLeaseOneDepartment = () => {
      return departments.value.length >= 1 ? true : false;
    };
    const atLeastOneAttendanceSelected = (value: number) => {
      return !value ? false : true;
    };
    const rules = computed(() => {
      return {
        labId: {
          Required: helpers.withMessage(
            "Ο κωδικός είναι υποχρεωτικός",
            required
          ),
          MaxLength: helpers.withMessage(
            "Μέγιστο όριο 9 χαρακτήρες",
            maxLength(9)
          ),
          MinLength: helpers.withMessage(
            "Ελάχιστο όριο 9 χαρακτήρες",
            minLength(9)
          ),
          MustContainDash: helpers.withMessage(
            "Ο κωδικός πρέπει να περιέχει παύλα",
            mustContainDash
          ),
        },
        labTitle: {
          Required: helpers.withMessage(
            "Ο τίτλος είναι υποχρεωτικός",
            required
          ),
          MaxLength: helpers.withMessage(
            "Μέγιστο όριο 50 χαρακτήρες",
            maxLength(50)
          ),
          MinLength: helpers.withMessage(
            "Ελάχιστο όριο 10 χαρακτήρες",
            minLength(10)
          ),
        },
        description: {
          Required: helpers.withMessage(
            "H Περιγραφή είναι υποχρεωτική",
            required
          ),
          MaxLength: helpers.withMessage(
            "Μέγιστο όριο 200 χαρακτήρες",
            maxLength(200)
          ),
          MinLength: helpers.withMessage(
            "Ελάχιστο όριο 10 χαρακτήρες",
            minLength(10)
          ),
        },
        semester: { required },
        departments: {
          Required: helpers.withMessage(
            "Τα τμήματα είναι υποχρεωτικά",
            required
          ),
          AtLeaseOneCount: helpers.withMessage(
            "Απαιτείται τουλάχιστον 1 τμήμα",
            atLeaseOneDepartment
          ),
        },
        attendance: {
          Required: helpers.withMessage(
            "Πεδίο Παρακολούθησης Υποχρεωτικό",
            required
          ),
          AtLeastOneAttendanceSelected: helpers.withMessage(
            "Απαιτείται τουλάχιστον μία επιλεγμένη παρακολούθηση",
            atLeastOneAttendanceSelected
          ),
        },
      };
    });
    const v$ = useVuelidate(rules, formState);

    const errorOfLabId = computed(() => {
      if (v$.value.labId.$error) {
        return v$.value.labId.$errors[0].$message.toString();
      }
      return "";
    });
    const errorOfLabTitle = computed(() => {
      if (v$.value.labTitle.$error) {
        return v$.value.labTitle.$errors[0].$message.toString();
      }
      return "";
    });
    const errorOfDescription = computed(() => {
      if (v$.value.description.$error) {
        return v$.value.description.$errors[0].$message.toString();
      }
      return "";
    });
    const errorOfAttendance = computed(() => {
      if (v$.value.attendance.$error) {
        return v$.value.attendance.$errors[0].$message.toString();
      }
      return "";
    });
    const buttonDisablity = computed(() => {
      if (
        !formState.labId ||
        !formState.labTitle ||
        !formState.semester ||
        !formState.description ||
        departments.value.length <= 0
      )
        return true;
      return false;
    });
    const validateEachDepartment = (dept: Department) => {
      if (dept.deptId === "" || dept.deptId === " " || dept.deptId === null) {
        dept.errorOnDeptId = true;
      }

      if (
        dept.fromTime === "" ||
        dept.fromTime === " " ||
        dept.fromTime === null
      ) {
        dept.errorOnFromTime = true;
      }

      if (dept.toTime === "" || dept.toTime === " " || dept.toTime === null) {
        dept.errorOnToTime = true;
      }
      if(dept.selectedTeacher === null || dept.selectedTeacher === undefined || !dept.selectedTeacher){
        dept.errorOnSelectedTeacher = true;
      }
      if (
        dept.errorOnDeptId === true ||
        dept.errorOnFromTime === true ||
        dept.errorOnToTime === true || 
        dept.errorOnSelectedTeacher === true
      ) {
        console.log("There are errors");
        return false;
      }
      return true;
    };
    const submitForm = () => {
      v$.value.$validate();
      if (v$.value.$error) {
        console.log(v$.value.$errors);
        return;
      }
      let allDeptsAreCorrect = true;
      if (!formState.departments || formState.departments.length == 0) {
        console.log("There are errors");
        return;
      }
      for (let dept of formState.departments) {
        if (validateEachDepartment(dept) === false) {
          allDeptsAreCorrect = false;
        }
        if (!isNumber(dept.numberOfStudents)) {
          dept.numberOfStudents = <number>dept.numberOfStudents;
        }
        continue;
      }

      if (!allDeptsAreCorrect) return;
      console.log(formState);
    };
    return {
      emitMobileViewClose,
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
      errorOfLabTitle,
      errorOfDescription,
      errorOfAttendance,
      validateEachDepartment,
      show,
      displayedAttendaceValues,
      seededProfessors
    };
  },
});
</script>

<style scoped>
#submit-btn:disabled {
  width: 15rem;
}

#submit-btn {
  color: white;
  width: 15rem;
  background-color: #156ed3;
}
.percent49-5 {
  width: 100%;
}
.submit-button {
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  flex-grow: 1;
  margin: 1rem 0rem;
}

.error-color {
  color: #b00020;
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
  gap: 0.3rem;
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
  margin: 1rem auto;
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
  margin: 1rem 1rem;
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

:deep(.positioner) {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: fit-content;
  margin: 1rem 1rem;
  text-align: center;
}

.info-centerer {
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
@media (min-width: 769px) {
  #submit-btn:disabled {
    color: #f3f3f3;
    width: 15rem;
  }
  .percent49-5 {
    width: 49.5%;
  }
  #submit-btn {
    color: white;
    width: 15rem;
    background-color: #156ed3;
  }

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
    margin: 1rem auto;
    text-align: center;
    padding: 0.5rem;
    display: flex;
    flex-direction: row;
    justify-content: center;
  }
}

@media (min-width: 1025px) {
  #submit-btn:disabled {
    color: #f3f3f3;
    min-width: 5rem;
    max-width: 10rem;
    width: 100%;
  }
  .percent49-5 {
    width: 49.5%;
  }
  #submit-btn {
    color: white;
    min-width: 5rem;
    max-width: 10rem;
    background-color: #156ed3;
    width: 100%;
  }

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
    margin: 1rem auto;
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
