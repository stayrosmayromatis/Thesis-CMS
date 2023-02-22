<template>
  <div @click="emitMobileViewClose">
    <div class="parent-card">
      <v-card elevation="5" class="parent-label">
        <v-card-title> ΦΟΡΜΑ ΕΙΣΑΓΩΓΗΣ ΕΡΓΑΣΤΗΡΙΟΥ </v-card-title>
      </v-card>
    </div>
    <base-alert :alert-type-prop="validationAlertType" :show="validationAlertShow"
      :title="validationAlertTitle"></base-alert>
    <base-dialog v-if="showRouteLeaveModal" :route-change-authorizer="true" inner-title="ΠΡΟΕΙΔΟΠΟΙΗΣΗ"
      inner-description="Οι αλλαγές σας δεν καταχωρήθηκαν και δεν θα αποθηκευτούν, θα θέλατε να συνεχίσετε;"></base-dialog>
    <base-dialog v-if="somethingWentWrongModal" :route-change-authorizer="false" inner-title="FATAL ERROR"
      inner-description="Η καταχώρηση ήταν μη-επιτυχής, κάντε ανανέωση και προσπαθείστε να ξανακάνετε καταχώρηση"></base-dialog>
    <div class="parent-card-form">
      <v-card elevation="5">
        <v-form @submit.prevent="submitForm">
          <v-container>
            <div :class="{ 'error-color': v$.semester.$error }">
              <v-chip-group>
                <v-chip :class="{ 'active-chip': semester.isActive }" @click="clickOnChip(semester.value)"
                  v-for="semester in displayedSemester" :key="semester.title">{{ semester.title }}</v-chip>
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
            <div class="form-first">
              <v-text-field :class="{ 'error-color': v$.description.$error }" :error-messages="errorOfDescription"
                label="Περιγραφή Εργαστηρίου" v-model.trim="formState.description"></v-text-field>
              <div class="percent49-5">
                <v-select :class="{ 'error-color': v$.labTitle.$error }" :items="displayedAttendaceValues"
                  :error-messages="errorOfAttendance" label="Παρακολούθηση" density="default"
                  v-model="formState.attendance"></v-select>
              </div>
            </div>
            <v-divider inset></v-divider>
            <div class="label-centerer">
              <label for="year">Τμήματα / Ώρες / Διαθεσιμότητα</label>
            </div>
            <div class="info-centerer">
              <base-alert :alert-type-prop="'info'" :show="true"
                :title="'Εαν επιθυμείτε να δηλώσετε το ίδιο τμήμα σε διαφορετική ήμερα/ώρα κρατήστε ίδιο το Αναγνωριστικό (π.χ. Τ1) και προσθέστε νέο τμήμα.'"></base-alert>
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
            <lab-form v-for="department in departments" :key="department.Guid" :department="department"
              :seeded_professors="seededProfessors" @deleteByDeptId="removeFormGroup"
              @global-error="validateEachDepartment"></lab-form>
            <div class="submit-button">
              <v-btn id="submit-btn" :disabled="buttonDisablity" type="submit">ΚΑΤΑΧΩΡΗΣΗ</v-btn>
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
import { useDisplayedLabs } from "@/composables/displayedSemesterArray.composable";
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
import { useProfessor } from "@/composables/useProfessors.composable";
import { BaseUser } from "@/models/BACKEND-MODELS/BaseUser";
import { useAlert } from "@/composables/showAlert.composable";
import { onBeforeRouteLeave, useRouter } from "vue-router";
import BaseDialog from "@/components/Base/BaseDialog.vue";
import { confirm } from '@/composables/dialog.composable';
import { v4 as uuidv4 } from 'uuid';
import { CreateCourseRequest, LaboratoryRequest } from "@/models/BACKEND-MODELS/CreateCourseRequest";
import { useAxios } from "@vueuse/integrations/useAxios";
import { useAxiosInstance } from "@/composables/useInstance.composable";
import { ApiResult } from "@/models/DTO/ApiResult";
import { CreateCourseResponse } from "@/models/BACKEND-MODELS/CreateCourseResponse";
export interface TimeObject {
  hours: number,
  minutes: number,
  seconds: number
}
export default defineComponent({
  components: {
    LabForm,
    BaseAlert,
    BaseDialog
  },
  emits: ["closeMobileView"],
  setup(_, context) {
    const {
      openAlert,
      setTypeOfAlert,
      alertTitle,
      typeOfAlert,
      showAlert,
      closeAlert,
    } = useAlert();
    const { setBackendInstanceAuth } = useAxiosInstance();
    const { GetDisplayedLabs, DisplayedLabs } = useDisplayedLabs();
    const { GetSeededProfessors, SeedProfessorsArray } = useProfessor();
    const router = useRouter();
    const validationAlertShow = showAlert;
    const validationAlertType = typeOfAlert;
    const validationAlertTitle = alertTitle;
    const seededProfessors = ref<Array<BaseUser>>(new Array<BaseUser>());
    const showRouteLeaveModal = ref(false);
    const somethingWentWrongModal = ref(false);
    const successFullSubmision = ref(false);
    onBeforeRouteLeave(async () => {
      if (successFullSubmision.value === true)
        return true;
      if (anythingIsPopulated.value === true) {
        showRouteLeaveModal.value = true;
        if (await confirm()) {
          showRouteLeaveModal.value = false;
          return true;
        }
        else {
          showRouteLeaveModal.value = false;
          return false;
        }
      }
      else {
        return true;
      }
    });
    onMounted(async () => {
      if (showAlert.value === true) {
        setTimeout(() => {
          closeAlert();
        }, 1000);
      }
      //DisplayedSemester
      GetDisplayedLabs();
      displayedSemester.value = DisplayedLabs.value;
      //DisplayedSemester

      //SeedProfessorsSegment
      await GetSeededProfessors();
      seededProfessors.value = SeedProfessorsArray.value;
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
    const displayedSemester = ref<Array<DisplayedSemster>>(new Array<DisplayedSemster>());
    // const displayedSemester: Ref<Array<DisplayedSemster>> = ref(
    //   displayedLabs()
    // );
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
        Guid: uuidv4().toString(),
        deptId: `T${deptIncremental++}`,
        fromTime: "",
        toTime: "",
        day: DaysOfWeekEnum.Δευτέρα,
        numberOfStudents: 30,
      });
    };
    const removeFormGroup = (deptGuid: string) => {
      if (deptGuid === null || deptGuid === undefined) return;
      departments.value = departments.value.filter(
        (val) => val.Guid !== deptGuid
      );
    };
    //Just the initial values
    const displayedAttendaceValues = Array(
      {
        value: AttendanceEnum.ΥΠ,
        title: "ΥΠΟΧΡΕΩΤΙΚΗ",
      },
      {
        value: AttendanceEnum.ΠΡ,
        title: "ΠΡΟΑΙΡΕΤΙΚΗ",
      },
      {
        value: AttendanceEnum.ΥΠ_ΠΡ,
        title: "ΥΠΟΧΡΕΩΤΙΚΗ - ΠΡΟΑΙΡΕΤΙΚΗ",
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
    const atLeaseOneDepartment = () => {
      return departments.value.length >= 1 ? true : false;
    };
    const atLeastOneAttendanceSelected = (value: number) => {
      return !value ? false : true;
    };
    const mustBeANumberOrDash = (value: string) => {
      const pattern = /^[0-9]{4}\-[0-9]{4}$/;
      if (value.match(pattern)) {
        return true
      }
      return false;
    }
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
          MustBeANumber: helpers.withMessage("Ο κωδικός πρέπει να περιέχει μόνο αριθμούς και πάυλες", mustBeANumberOrDash)
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
    const v$ = useVuelidate(rules,formState);

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
        formState.semester === null ||
        !formState.description ||
        departments.value.length <= 0
      )
        return true;
      return false;
    });
    const validateEachDepartment = (dept: Department): boolean => {
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
      if (
        dept.selectedTeacher === null ||
        dept.selectedTeacher === undefined ||
        !dept.selectedTeacher
      ) {
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
    function toTimeString(timeObject: TimeObject): string {
      let result: string = "";
      if (timeObject.hours < 10) {
        result = `0${timeObject.hours}:`;
      }
      else {
        result = `${timeObject.hours}:`;
      }
      if (timeObject.minutes < 10) {
        result += `0${timeObject.minutes}:`
      }
      else {
        result += `${timeObject.minutes}:`
      }
      if (timeObject.seconds < 10) {
        result += `0${timeObject.seconds}`
      }
      else {
        result += `${timeObject.seconds}`
      }
      return result;
    }
    const submitForm = async () => {
      v$.value.$validate();
      if (v$.value.$error) {
        console.log(v$.value.$errors);
        openAlert("Υπάρχουν λάθοι στην φόρμα παρακαλώ διορθώστε τα");
        setTypeOfAlert("error");
        return;
      }
      let allDeptsAreCorrect = true;
      if (!formState.departments || formState.departments.length == 0) {
        console.log("There are errors");
        openAlert("Υπάρχουν λάθοι στην φόρμα παρακαλώ διορθώστε τα");
        setTypeOfAlert("error");
        return;
      }
      for (let dept of formState.departments) {
        if (validateEachDepartment(dept) === false) {
          allDeptsAreCorrect = false;
        }
        if (!isNumber(dept.numberOfStudents)) {
          dept.numberOfStudents = <number>dept.numberOfStudents;
        }
      }

      if (!allDeptsAreCorrect) {
        openAlert("Υπάρχουν λάθοι στην φόρμα παρακαλώ διορθώστε τα");
        setTypeOfAlert("error");
        return;
      }
      const createCourseRequest: CreateCourseRequest =
      {
        CourseCode: formState.labId,
        CourseName: formState.labTitle,
        Semester: formState.semester!,
        ShortDescription: formState.description!,
        CourseAttentance: formState.attendance!.value!,
        Labs: Array<LaboratoryRequest>(),
      };
      if (!createCourseRequest)
        return;

      for (const department of formState.departments) {
        createCourseRequest.Labs!.push({
          DaysOfWeekEnums: department.day,
          // @ts-ignore
          From: toTimeString(department.fromTime),
          // @ts-ignore
          To: toTimeString(department.toTime),
          LabName: department.deptId,
          ProfId: department.selectedTeacher!.Guid!,
          Seats: department.numberOfStudents,

        });
      }
      const createCourseApiRequest = await useAxios('/course/create-course',
        {
          method: 'POST',
          data: createCourseRequest
        },
        setBackendInstanceAuth()
      );
      if (createCourseApiRequest.isFinished) {
        const createCourseApiResponse: ApiResult<CreateCourseResponse> = createCourseApiRequest.data.value;
        if (createCourseApiResponse.Status === false || !createCourseApiResponse.Status) {
          somethingWentWrongModal.value = true;
          return;
        }
        openAlert("Επιτυχής καταχώρηση εργαστηρίου");
        setTypeOfAlert("success");
        setTimeout(() => {
          closeAlert();
          successFullSubmision.value = true;
          router.replace({ name: 'labList' })
        }, 1500);
      }

      // if (showAlert.value === true) {
      //   closeAlert();
      // }
    };
    const anythingIsPopulated = computed(() => {
      if (
        formState.labId ||
        formState.labTitle ||
        formState.description ||
        formState.semester ||
        (departments.value && departments.value.length > 0)
      )
        return true;
      return false;
    });



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
      seededProfessors,
      validationAlertShow,
      validationAlertType,
      validationAlertTitle,
      showRouteLeaveModal,
      toTimeString,
      somethingWentWrongModal
    };
  },
});
</script>

<style scoped>
#submit-btn:disabled {
  width: 15rem;
}

:deep(.v-alert-title) {
  font-size: 1rem;
}

:deep(.v-card-text) {
  font-weight: 500;
  text-transform: inherit;
}

.positioner {
  width: 100% !important;
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
