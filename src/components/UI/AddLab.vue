<template>
  <section>
    <base-spinner :show="showSpinner"></base-spinner>

    <base-dialog :show="showRouteLeaveModal" :route-change-authorizer="true" inner-title="ΠΡΟΕΙΔΟΠΟΙΗΣΗ"
      inner-description="Οι αλλαγές σας <span style='color:red;'>δεν καταχωρήθηκαν</span> και <span style='color:red;'>δεν θα αποθηκευτούν</span> ,</br>θα θέλατε να <span style='color:1E88E5;'>συνεχίσετε</span>;"
      @close-modal="showRouteLeaveModal = false"></base-dialog>
    <base-dialog :show="somethingWentWrongModal" :route-change-authorizer="false" inner-title="ΠΡΟΕΚΥΨΕ ΣΦΑΛΜΑ"
      inner-description="Η καταχώρηση ήταν μη-επιτυχής, κάντε ανανέωση και προσπαθείστε να ξανακάνετε καταχώρηση"
      @close-modal="somethingWentWrongModal = false"></base-dialog>
    <base-dialog :show="showConfirmDeletionModal" :route-change-authorizer="true" :inner-title="confirmDeletionInnerTitle"
      :inner-description="confirmDeletionInnerDescription" @close-modal="showConfirmDeletionModal = false"></base-dialog>
    <div class="outer-section" @click="emitMobileViewClose" v-if="!showSpinner">
      <base-alert :alert-type-prop="typeOfAlert" :show="showAlert" :title="alertTitle"></base-alert>
      <div>
        <v-card elevation="10" class="parent-label">
          <label> Φόρμα Εισαγωγής Εργαστηρίου </label>
        </v-card>
      </div>
      <div>
        <v-card elevation="5">
          <v-form @submit.prevent="submitForm">
            <v-container>
              <div :class="{ 'error-color': v$.semester.$error }">
                <v-chip-group>
                  <v-chip :class="{ 'active-chip': semester.isActive }" @click="clickOnChip(semester.value)"
                    v-for="semester of displayedSemester" :key="semester.title">{{ semester.title }}</v-chip>
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
                    item-title="title" :error-messages="errorOfAttendance" label="Παρακολούθηση" density="default"
                    return-object v-model="formState.attendance"
                    no-data-text="Δεν βρέθηκαν διαθέσιμες τιμές παρακολούθησης"></v-select>
                </div>
              </div>
              <v-divider inset></v-divider>
              <div class="label-centerer">
                <label for="year">Τμήματα / Ώρες / Διαθεσιμότητα</label>
              </div>
              <!-- <div class="info-centerer" v-if="departments.length">
              <base-alert :alert-type-prop="'info'" :show="true"
                :title="'Εαν επιθυμείτε να δηλώσετε το ίδιο τμήμα σε διαφορετική ήμερα/ώρα κρατήστε ίδιο το Αναγνωριστικό (π.χ. Τ1) και προσθέστε νέο τμήμα.'"></base-alert>
            </div> -->
              <div class="form-control-add-btn">
                <v-btn type="button" @click="addFormGroup" color="green">
                  <!-- elevation="4"  -->
                  <!-- <svg width="30" height="30"
                  clip-rule="evenodd" fill-rule="evenodd" stroke-linejoin="round" stroke-miterlimit="2"
                  viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="m21 3.998c0-.478-.379-1-1-1h-16c-.62 0-1 .519-1 1v16c0 .621.52 1 1 1h16c.478 0 1-.379 1-1zm-16.5.5h15v15h-15zm6.75 6.752h-3.5c-.414 0-.75.336-.75.75s.336.75.75.75h3.5v3.5c0 .414.336.75.75.75s.75-.336.75-.75v-3.5h3.5c.414 0 .75-.336.75-.75s-.336-.75-.75-.75h-3.5v-3.5c0-.414-.336-.75-.75-.75s-.75.336-.75.75z"
                    fill-rule="nonzero" />
                </svg> -->
                  <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 24 24">
                    <path fill="white"
                      d="M11 17h2v-4h4v-2h-4V7h-2v4H7v2h4v4Zm1 5q-2.075 0-3.9-.788t-3.175-2.137q-1.35-1.35-2.137-3.175T2 12q0-2.075.788-3.9t2.137-3.175q1.35-1.35 3.175-2.137T12 2q2.075 0 3.9.788t3.175 2.137q1.35 1.35 2.138 3.175T22 12q0 2.075-.788 3.9t-2.137 3.175q-1.35 1.35-3.175 2.138T12 22Zm0-2q3.35 0 5.675-2.325T20 12q0-3.35-2.325-5.675T12 4Q8.65 4 6.325 6.325T4 12q0 3.35 2.325 5.675T12 20Zm0-8Z" />
                  </svg>
                  <label>ΠΡΟΣΘΗΚΗ ΤΜΗΜΑΤΟΣ</label>
                </v-btn>
              </div>
              <lab-form v-for="department in departments" :key="department.Guid" :department="department"
                :seeded_professors="seededProfessors" @deleteByDeptId="removeFormGroup" :is_by_edit="isCallByEdit"
                @global-error="validateEachDepartment"></lab-form>
              <div class="submit-button" v-if="departments.length">
                <v-btn id="submit-btn" :disabled="buttonDisablity" type="submit">{{ isCallByEdit === true ? "ΕΝΗΜΕΡΩΣΗ" :
                  "ΚΑΤΑΧΩΡΗΣΗ" }}</v-btn>
              </div>
            </v-container>
          </v-form>
        </v-card>
      </div>
    </div>
  </section>
</template>
<script lang="ts">
import { computed, defineComponent } from "@vue/runtime-core";
import { useVuelidate } from "@vuelidate/core";
import { required, minLength, maxLength, helpers } from "@vuelidate/validators";
import { useDisplayedLabs } from "@/composables/displayedSemesterArray.composable";
import { LabSemesterEnum } from "@/enums/LabSemesterEnum";
import { reactive, Ref, ref, onMounted } from "vue";
import { DisplayedSemster } from "@/models/displayedsemester.type";
import LabForm from "@/components/UI/LabForm.vue";
import { Department } from "@/models/department.type";
import { DaysOfWeekEnum } from "@/enums/DaysOfWeekEnum";
import { Lab } from "@/models/lab.type";
import { isNumber } from "@vueuse/shared";
import { AttendanceEnum } from "@/enums/AttendanceEnums";
import BaseAlert from "@/components/Base/BaseAlert.vue";
import { useProfessor } from "@/composables/useProfessors.composable";
import { BaseUser } from "@/models/BACKEND-MODELS/BaseUser";
import { useAlert } from "@/composables/showAlert.composable";
import { onBeforeRouteLeave, useRoute, useRouter } from "vue-router";
import BaseDialog from "@/components/Base/BaseDialog.vue";
import { v4 as uuidv4 } from "uuid";
import {
  CreateCourseRequest,
  LaboratoryRequest,
} from "@/models/BACKEND-MODELS/CreateCourseRequest";
//import { useAxios } from "@vueuse/integrations/useAxios";
import { useAxiosInstance } from "@/composables/useInstance.composable";
import { ApiResult } from "@/models/DTO/ApiResult";
import { CreateCourseResponse } from "@/models/BACKEND-MODELS/CreateCourseResponse";
import { CourseController, InfoController } from "@/config";
import { InternalDataTransfter } from "@/models/DTO/InternalDataTransfer";
import { InfoUpdateCourseResponse } from "@/models/BACKEND-MODELS/InfoUpdateCourseResponse";
import { TimeObject } from "@/models/BACKEND-MODELS/TimeObject";
import { useTimeObjectExtensions } from "@/composables/useTimeObjectExtensions.composable";
import { InfoAggregateObjectResponse } from "@/models/BACKEND-MODELS/InfoAggregateObjectResponse";
import { TypeStaff } from "@/enums/StaffTypeEnum";
import { confirm } from "@/composables/dialog.composable";
import {
  UpdateCourseRequest,
  UpdateLaboratories,
} from "@/models/BACKEND-MODELS/UpdateCourseRequest";
import BaseSpinner from "@/components/Base/BaseSpinner.vue";
import { computedEager } from "@vueuse/core";
export default defineComponent({
  components: {
    LabForm,
    BaseAlert,
    BaseDialog,
    BaseSpinner
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
    //const { setBackendInstanceAuth } = useAxiosInstance();
    const { MakeAPICall } = useAxiosInstance();
    const { GetDisplayedLabs, DisplayedLabs } = useDisplayedLabs();
    const { GetSeededProfessors, SeedProfessorsArray } = useProfessor();
    const { toTimeString, scrollToTop } = useTimeObjectExtensions();
    const router = useRouter();
    const route = useRoute();
    const seededProfessors = ref(new Array<BaseUser>());
    const showRouteLeaveModal = ref(false);
    const somethingWentWrongModal = ref(false);
    const successFullSubmision = ref(false);
    const isCallByEdit = ref(false);
    const showConfirmDeletionModal = ref(false);
    const confirmDeletionInnerTitle = ref("ΠΡΟΕΙΔΟΠΟΙΗΣΗ");
    const confirmDeletionInnerDescription = ref("");
    const showSpinner = ref(false);
    onBeforeRouteLeave(async () => {
      closeAlert();
      if (successFullSubmision.value === true) return true;
      if (anythingIsPopulated.value === true) {
        showRouteLeaveModal.value = true;
        if (await confirm()) {
          showRouteLeaveModal.value = false;
          return true;
        } else {
          showRouteLeaveModal.value = false;
          return false;
        }
      } else {
        return true;
      }
    });
    onMounted(async () => {
      emitMobileViewClose();
      const hasQueryParams = Object.keys(route.query);
      const queryParamsLength = hasQueryParams.length;
      //DisplayedSemester
      await GetDisplayedLabs(true);
      displayedSemester.value = DisplayedLabs.value;
      //DisplayedSemester
      if (
        hasQueryParams &&
        hasQueryParams.includes("editId") &&
        queryParamsLength == 1
      ) {
        showSpinner.value = true;
        const courseInfoEditIDT = await MakeGetCourseInfoForEditCall(
          Object.values(route.query)[0]!.toString()
        );
        if (!courseInfoEditIDT || !courseInfoEditIDT.Status || !courseInfoEditIDT.Data) {
          await router.replace({ name: "submittedLabs" });
          return;
        }
        PopulateTheFormObjectInEditMode(courseInfoEditIDT.Data);
        isCallByEdit.value = true;
        showSpinner.value = false;
      }
      closeAlert(1000);
      //SeedProfessorsSegment
      await GetSeededProfessors();
      seededProfessors.value = SeedProfessorsArray.value;

    });
    //SeedProfessorsSegment
    const emitMobileViewClose = (): void => {
      context.emit("closeMobileView", true);
    };
    let deptIncremental = 1;
    const departments = ref(new Array<Department>());
    const displayedSemester = ref(new Array<DisplayedSemster>());
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
        if (allRestLabs && allRestLabs.length) {
          allRestLabs.forEach((lab) => {
            if (lab.isActive) lab.isActive = false;
          });
        }
      }
    };
    const addFormGroup = () => {
      if (!departments.value.length) {
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
    const removeFormGroup = async (deptGuid: string): Promise<void> => {
      if (!deptGuid) {
        return;
      }
      if (isCallByEdit && isCallByEdit.value === true) {
        const courseGuid = Object.values(route.query)[0]!.toString();
        const labGuid = deptGuid;
        const makeTheDeleteInfoCallIDT = await MakeTheDeleteInformationCall(
          labGuid,
          courseGuid
        );
        if (!makeTheDeleteInfoCallIDT || !makeTheDeleteInfoCallIDT.Status) {
          setTypeOfAlert("error");
          openAlert("Αποτυχία διαγραφής προσπαθήστε ξανά");
          closeAlert(1500);
          await delay(1500);
          showConfirmDeletionModal.value = false;
          return;
        }
        if (await confirm()) {
          const makeTheDeleteApiCall = await MakeTheDeleteApiCall(
            labGuid,
            courseGuid
          );
          showConfirmDeletionModal.value = false;
        }
        else {
          showConfirmDeletionModal.value = false;
          return;
        }
      }
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
      attendance: displayedAttendaceValues.find(w => w.value === AttendanceEnum.ΥΠ)
      //  {
      //   value: AttendanceEnum.ΥΠ,
      //   title: "ΥΠ",
      // }
      ,
    });
    const atLeaseOneDepartment = () => {
      return departments.value.length >= 1;
    };
    const atLeastOneAttendanceSelected = (value: number) => {
      return !!value;
      //return !value ? false : true;
    };
    const mustBeANumberOrDash = (value: string) => {
      const pattern = /^[0-9]{4}\-[0-9]{4}$/;
      // if (value.match(pattern)) {
      //   return true;
      // }
      // return false;
      return value.match(pattern) ? true : false;
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
          MustBeANumber: helpers.withMessage(
            "Ο κωδικός πρέπει να περιέχει μόνο αριθμούς και πάυλες",
            mustBeANumberOrDash
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
    // @ts-ignore
    const v$ = useVuelidate(rules, formState);

    const errorOfLabId = computed(() => v$.value.labId.$error ? v$.value.labId.$errors[0].$message.toString() : ""
      // if (v$.value.labId.$error) {
      //   return v$.value.labId.$errors[0].$message.toString();
      // }
      // return v$.value.labId.$error ? v$.value.labId.$errors[0].$message.toString() : "";
    );
    const errorOfLabTitle = computed(() => v$.value.labTitle.$error ? v$.value.labTitle.$errors[0].$message.toString() : ""
      //{
      //   if (v$.value.labTitle.$error) {
      //     return v$.value.labTitle.$errors[0].$message.toString();
      //   }
      //   return "";
      // }
    );
    const errorOfDescription = computed(() => v$.value.description.$error ? v$.value.description.$errors[0].$message.toString() : ""
      // {
      //   if (v$.value.description.$error) {
      //     return v$.value.description.$errors[0].$message.toString();
      //   }
      //   return "";
      // }
    );
    const errorOfAttendance = computed(() => v$.value.attendance.$error ? v$.value.attendance.$errors[0].$message.toString() : ""
      // {
      //   if (v$.value.attendance.$error) {
      //     return v$.value.attendance.$errors[0].$message.toString();
      //   }
      //   return "";
      // }
    );
    const buttonDisablity = computed(() => {
      if (
        !formState.labId ||
        !formState.labTitle ||
        !formState.semester ||
        !formState.description ||
        (!departments || !departments.value || !departments.value.length)
        //departments.value.length <= 0
      )
        return true;
      return false;
    });
    const validateEachDepartment = (dept: Department): boolean => {
      if (!dept.deptId || dept.deptId === " ") {
        dept.errorOnDeptId = true;
        return false;
      }

      if (!dept.fromTime) {
        dept.errorOnFromTime = true;
        return false;
      }

      if (!dept.toTime) {
        dept.errorOnToTime = true;
        return false;
      }
      // @ts-ignore
      if (dept.fromTime.hours > dept.toTime.hours || (dept.fromTime.hours == dept.toTime.hours && dept.fromTime.minutes >= dept.toTime.minutes)
      ) {
        dept.errorOnToTime = true;
        dept.errorOnFromTime = true;
        return false;
      }

      if (!dept.selectedTeacher) {
        dept.errorOnSelectedTeacher = true;
        dept.selectedTeacher = undefined;
        return false;
      }
      return true;
    };

    const submitForm = async () => {
      v$.value.$validate();
      let allDeptsAreCorrect: boolean | undefined = true;
      if (v$.value.$error) {
        console.log(v$.value.$errors);
        setTypeOfAlert("error");
        openAlert("Υπάρχουν λάθοι στην φόρμα παρακαλώ διορθώστε τα");
        scrollToTop();
        closeAlert(1500);
        return;
      }
      if (!formState.departments || !formState.departments.length) {
        console.log("There are errors");
        setTypeOfAlert("error");
        openAlert("Υπάρχουν λάθοι στην φόρμα παρακαλώ διορθώστε τα");
        scrollToTop();
        closeAlert(1500);
        return;
      }

      for (const dept of departments.value) {
        if (!validateEachDepartment(dept)) {
          allDeptsAreCorrect = false;
        }
        if (!isNumber(dept.numberOfStudents)) {
          dept.numberOfStudents = <number>dept.numberOfStudents;
        }
      }

      if (!allDeptsAreCorrect) {
        setTypeOfAlert("error");
        openAlert("Υπάρχουν λάθοι στην φόρμα παρακαλώ διορθώστε τα");
        scrollToTop();
        closeAlert(1500);
        return;
      }

      let requestToBeMade:
        | CreateCourseRequest
        | UpdateCourseRequest;
      if (isCallByEdit.value === true) {
        requestToBeMade = {
          CourseId: Object.values(route.query)[0]!.toString(),
          CourseCode: formState.labId,
          CourseName: formState.labTitle,
          Semester: formState.semester!,
          ShortDescription: formState.description!,
          CourseAttentance: formState.attendance!.value!,
          Labs: new Array<UpdateLaboratories>(),
        };
        for (const department of formState.departments) {
          requestToBeMade.Labs!.push({
            LabId: department.Guid,
            DaysOfWeek: department.day,
            // @ts-ignore
            From: toTimeString(department.fromTime),
            // @ts-ignore
            To: toTimeString(department.toTime),
            LabName: department.deptId,
            ProfId: department.selectedTeacher!.Guid!,
            Seats: department.numberOfStudents,
          });
        }
      } else {
        requestToBeMade = {
          CourseCode: formState.labId,
          CourseName: formState.labTitle,
          Semester: formState.semester!,
          ShortDescription: formState.description!,
          CourseAttentance: formState.attendance.value,
          Labs: new Array<LaboratoryRequest>(),
        };
        for (const department of formState.departments) {
          requestToBeMade.Labs!.push({
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
      }

      if (!requestToBeMade || !requestToBeMade.Labs) {
        somethingWentWrongModal.value = true;
        return;
      }

      const makeCreateCourseApiResponse = !isCallByEdit.value
        ? await MakeCreateCourseRequest(requestToBeMade as CreateCourseRequest)
        : await MakeUpdateCourseRequest(requestToBeMade as UpdateCourseRequest);
      closeAlert();
      if (
        !makeCreateCourseApiResponse ||
        !makeCreateCourseApiResponse.Status ||
        !makeCreateCourseApiResponse.Data
      ) {
        somethingWentWrongModal.value = true;
        setTypeOfAlert("error");
        openAlert(
          `Αποτυχία ${isCallByEdit.value === true ? "ενημέρωσης" : "καταχώρησης"
          } εργαστηρίου`
        );

        scrollToTop();
        closeAlert(1500);
        await delay(1500);
        somethingWentWrongModal.value = false;
        return;
      }
      setTypeOfAlert("success");
      openAlert(
        `Επιτυχής  ${isCallByEdit.value === true ? "ενημέρωση" : "καταχώρηση"
        } εργαστηρίου`
      );
      scrollToTop();
      closeAlert(1500);
      await delay(1500);
      somethingWentWrongModal.value = false;
      successFullSubmision.value = true;
      await router.replace({ name: 'submittedLabs' });
    };
    const anythingIsPopulated = computedEager(() => (formState.labId ||
      formState.labTitle ||
      formState.description ||
      formState.semester ||
      (departments.value && departments.value.length)) ? true : false);

    const MakeCreateCourseRequest = async (createCourseRequest: CreateCourseRequest): Promise<InternalDataTransfter<boolean>> => {
      if (!createCourseRequest)
        return { Status: false, Data: false, Error: "Request object null" };
      // const createCourseApiRequest = await useAxios(
      //   CourseController + "create-course",
      //   {
      //     method: "POST",
      //     data: createCourseRequest,
      //   },
      //   setBackendInstanceAuth()
      // );
      const createCourseApiRequest = await MakeAPICall<ApiResult<CreateCourseResponse>, CreateCourseRequest>(CourseController, "create-course", "POST", createCourseRequest);
      if (!createCourseApiRequest || !createCourseApiRequest.Status || !createCourseApiRequest.Data) {
        return {
          Status: false,
          Data: false,
          Error: "Request call returned false",
        };
      }
      return { Status: true, Data: true };

      //if (createCourseApiRequest.isFinished) {
      // const createCourseApiResponse: ApiResult<CreateCourseResponse> =
      //   createCourseApiRequest.data.value;
      // if (
      //   createCourseApiResponse.Status === false ||
      //   !createCourseApiResponse.Status ||
      //   !createCourseApiResponse.Data
      // ) {
      //   return {
      //     Status: false,
      //     Data: false,
      //     Error: "Request call returned false",
      //   };
      // }
      // return { Status: true, Data: true };

      // return {
      //   Status: false,
      //   Data: false,
      //   Error: "Request call never finished",
      // };
    };
    const MakeUpdateCourseRequest = async (updateCourseRequest: UpdateCourseRequest): Promise<InternalDataTransfter<boolean>> => {
      if (!updateCourseRequest)
        return { Status: false, Data: false, Error: "Request object null" };
      // const updateCourseApiRequest = await useAxios(
      //   CourseController + "update-course",
      //   {
      //     method: "POST",
      //     data: updateCourseRequest,
      //   },
      //   setBackendInstanceAuth()
      // );
      const updateCourseApiRequest = await MakeAPICall<ApiResult<CreateCourseResponse>, UpdateCourseRequest>(CourseController, "update-course", "POST", updateCourseRequest);
      if (!updateCourseApiRequest || !updateCourseApiRequest.Status || !updateCourseApiRequest.Data) {
        return {
          Status: false,
          Data: false,
          Error: "Request call returned false",
        };
      }
      return { Status: true, Data: true };
      //   if (updateCourseApiRequest.isFinished) {
      //   const updateCourseApiResponse: ApiResult<CreateCourseResponse> =
      //     updateCourseApiRequest.data.value;
      //   if (
      //     updateCourseApiResponse.Status === false ||
      //     !updateCourseApiResponse.Status ||
      //     !updateCourseApiResponse.Data
      //   ) {
      //     return {
      //       Status: false,
      //       Data: false,
      //       Error: "Request call returned false",
      //     };
      //   }
      //   return { Status: true, Data: true };
      // }
      // return {
      //   Status: false,
      //   Data: false,
      //   Error: "Request call never finished",
      // };
    };
    const MakeGetCourseInfoForEditCall = async (courseGuid: string): Promise<InternalDataTransfter<InfoUpdateCourseResponse>> => {
      if (!courseGuid)
        return { Status: false, Data: null, Error: "Request object null" };
      // const getCourseInfoForEditApiRequest = await useAxios(
      //   CourseController + "get-course-info-for-edit/" + courseGuid,
      //   {
      //     method: "GET",
      //   },
      //   setBackendInstanceAuth()
      // );
      const getCourseInfoForEditApiRequest = await MakeAPICall<ApiResult<InfoUpdateCourseResponse>>(CourseController, `get-course-info-for-edit/${courseGuid}`, "GET");
      if (!getCourseInfoForEditApiRequest || !getCourseInfoForEditApiRequest.Status || !getCourseInfoForEditApiRequest.Data) {
        return {
          Status: false,
          Data: null,
          Error: "Request call returned false",
        };
      }
      return { Status: true, Data: getCourseInfoForEditApiRequest.Data };
      //   if (getCourseInfoForEditApiRequest.isFinished) {
      //   const getCourseInfoForEditApiResponse: ApiResult<InfoUpdateCourseResponse> =
      //     getCourseInfoForEditApiRequest.data.value;
      //   if (
      //     getCourseInfoForEditApiResponse.Status === false ||
      //     !getCourseInfoForEditApiResponse.Status ||
      //     !getCourseInfoForEditApiResponse.Data
      //   ) {
      //     return {
      //       Status: false,
      //       Data: null,
      //       Error: "Request call returned false",
      //     };
      //   }
      //   return { Status: true, Data: getCourseInfoForEditApiResponse.Data };
      // }
      // return {
      //   Status: false,
      //   Data: null,
      //   Error: "Request call never finished",
      // };
    };
    const PopulateTheFormObjectInEditMode = (data: InfoUpdateCourseResponse) => {
      if (!data) return;
      formState.labId = data.CourseCode;
      formState.labTitle = data.CourseName;
      formState.attendance = displayedAttendaceValues.find(w => w.value === data.CourseAttendance) ?? {
        title: data.CourseAttendanceString,
        value: data.CourseAttendance,
      };



      displayedSemester.value.find((val) => {
        if (val.value === data.Semester) {
          val.isActive = true;
        }
      });
      formState.semester = data.Semester;
      formState.description = data.ShortDescription;
      formState.semester = data.Semester;
      formState.departments = data.Labs;
    };
    const MakeTheDeleteInformationCall = async (labGuid: string, courseGuid: string): Promise<InternalDataTransfter<boolean>> => {
      // const api_response = await useAxios(
      //   InfoController + `deletion-informant/${courseGuid}/${labGuid}`,
      //   { method: "GET" },
      //   setBackendInstanceAuth()
      // );
      const api_response_dta = await MakeAPICall<ApiResult<InfoAggregateObjectResponse>>(InfoController, `deletion-informant/${courseGuid}/${labGuid}`, "GET");
      //if (api_response.isFinished) {
      // const api_response_dta: ApiResult<InfoAggregateObjectResponse> =
      //   api_response.data.value;
      if (api_response_dta.Status && api_response_dta.Data) {
        if (
          api_response_dta.Data.PersonAffiliation &&
          (api_response_dta.Data.PersonAffiliation === TypeStaff.STAFF ||
            api_response_dta.Data.PersonAffiliation === TypeStaff.ADMIN)
        ) {
          if (
            (api_response_dta.Data.FoundRegistration === false ||
              !api_response_dta.Data.FoundRegistration) &&
            (api_response_dta.Data.CountOfStudentsSubmited === 0 ||
              !api_response_dta.Data.CountOfStudentsSubmited)
          ) {
            showConfirmDeletionModal.value = true;
            confirmDeletionInnerDescription.value = `Δεν βρέθηκαν δηλώσεις στο εργαστηριακό τμήμα <span style="color:green;">${api_response_dta.Data.LabName ?? ""}</span> 
                του μαθήματος <span style="color:green;">${api_response_dta.Data.CourseName ?? ""}</span>.
                Θα πραγματοποιηθεί <span style="color:#ff4545;">διαγραφή</span> του τμήματος.
                Θέλετε να προχωρήσετε σε <span style="color:#ff4545;">διαγραφή</span>; 
                Η ενεργεια είναι <span style="color:#ff4545;">μη αναστρέψιμη.</span> `;
            return { Data: true, Status: true };
          } else if (
            api_response_dta.Data.FoundRegistration === true &&
            api_response_dta.Data.CountOfStudentsSubmited > 0
          ) {
            //Found dilwseis what do you want to do?
            showConfirmDeletionModal.value = true;
            confirmDeletionInnerDescription.value = `Βρέθηκε(αν) <span style="color:green;">${api_response_dta.Data.CountOfStudentsSubmited}</span> δήλωση(εις) στo εργαστηριακό τμήμα <span style="color:green;">${api_response_dta.Data.LabName}</span> του μαθήματος <span style="color:green;">${api_response_dta.Data.CourseName}</span>.
              Θα πραγματοποιηθεί <span style="color:#ff4545;">διαγραφή</span> του τμήματος.
              Αυτο συνεπάγεται και στην <span style="color:#ff4545;">διαγραφή όλων των υπάρχοντων δηλώσεων των φοιτητών μέχρι αυτή τη στιγμή</span>.
              Θέλετε να προχωρήσετε σε <span style="color:#ff4545;">διαγραφή</span>; Η ενεργεια είναι <span style="color:#ff4545;">μη αναστρέψιμη.</span> `;
            return { Data: true, Status: true };
          } else if (
            (api_response_dta.Data.FoundRegistration === true &&
              !api_response_dta.Data.CountOfStudentsSubmited) ||
            api_response_dta.Data.CountOfStudentsSubmited === 0
          ) {
            //Dilwseis not found though do you wanna continue?
            showConfirmDeletionModal.value = true;
            confirmDeletionInnerDescription.value = `Δεν βρέθηκαν δηλώσεις στο εργαστηριακό τμήμα <span style="color:green;">${api_response_dta.Data.LabName ?? ""
              }</span> του μαθήματος <span style="color:green;">${api_response_dta.Data.CourseName ?? ""
              }</span>.
                                                      Θα πραγματοποιηθεί <span style="color:#ff4545;">διαγραφή</span> του τμήματος.
                                                      Θέλετε να προχωρήσετε σε <span style="color:#ff4545;">διαγραφή</span>; Η ενεργεια είναι <span style="color:#ff4545;">μη αναστρέψιμη.</span> `;
            return { Data: true, Status: true };
          } else {
            showConfirmDeletionModal.value = false;
            return { Data: null, Status: false, Error: "Error" };
          }
        } else {
          return { Data: null, Status: false, Error: "FatalError" };
        }
      }
      //}
      showConfirmDeletionModal.value = false;
      return { Data: null, Status: false, Error: "Error" };
    };
    const MakeTheDeleteApiCall = async (labGuid: string, courseGuid: string): Promise<InternalDataTransfter<boolean>> => {
      // const api_response = await useAxios(
      //   CourseController +
      //   `confirm-delete-submitted-course/${labGuid}/${courseGuid}`,
      //   { method: "POST" },
      //   setBackendInstanceAuth()
      // );
      const api_response = await MakeAPICall<ApiResult<boolean>, Object>(CourseController, `confirm-delete-submitted-course/${labGuid}/${courseGuid}`, "POST", {});
      // if(api_response){
      //   return {
      //     Data: api_response.Data,
      //     Status: api_response.Status,
      //   };
      // }
      return api_response ? { Data: api_response.Data, Status: api_response.Status, }
        :
        { Data: null, Status: false, Error: "Error" };
      // if (api_response.isFinished) {
      //   const api_data_response: ApiResult<boolean> = api_response.data.value;
      //   return {
      //     Data: api_data_response.Data,
      //     Status: api_data_response.Status,
      //   };
      // }
      //return { Data: null, Status: false, Error: "Error" };
    };
    const delay = async (time: number) => {
      return new Promise((resolve) => setTimeout(resolve, time));
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
      displayedAttendaceValues,
      seededProfessors,
      showAlert,
      typeOfAlert,
      alertTitle,
      showRouteLeaveModal,
      toTimeString,
      somethingWentWrongModal,
      isCallByEdit,
      showConfirmDeletionModal,
      confirmDeletionInnerTitle,
      confirmDeletionInnerDescription,
      showSpinner
    };
  },
});
</script>

<style scoped>
.outer-section {
  width: 100%;
  padding: 1rem 0.3rem;
  max-width: 100rem;
}

#submit-btn:disabled {
  width: 15rem;
  color: #f3f3f3;
}

:deep(.v-alert-title) {
  font-size: 1rem;
}

:deep(.v-card-text) {
  font-weight: 500;
  text-transform: inherit;
}

.form-control-add-btn :deep(.v-btn--elevated:hover),
.submit-button :deep(.v-btn--elevated:hover) {
  box-shadow: 0px 2px 4px -1px var(--v-shadow-key-umbra-opacity, rgba(0, 0, 0, 0.9)),
    0px 4px 5px 0px var(--v-shadow-key-penumbra-opacity, rgba(0, 0, 0, 0.2)),
    0px 1px 10px 0px var(--v-shadow-key-penumbra-opacity, rgba(0, 0, 0, 0.2));
}

/* .positioner {
  width: 100% !important;
} */

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

/* .parent-card { 
  
}*/

.parent-label {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 2rem;
  min-width: 320px;
  font-size: 0.95rem;
  font-weight: 500;
  background-color: var(--header-label-background-color);
  color: var(--header-label-text-color);
  padding: 1.2rem;
  margin-bottom: 1.2rem;
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
  margin: 1rem auto;
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
  gap: 0.3rem;
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
  .outer-section {
    padding: 2rem 0.5rem;
    margin: auto;
    width: inherit;
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
    margin: 1rem 1rem;
  }

  .parent-label {
    height: 3rem;
    font-size: 1.2rem;
  }

  :deep(.v-chip-group) {
    align-content: flex-start;
    max-width: 1024px;
    min-width: 769px;
    overflow-x: auto;
  }


  .form-first {
    flex-direction: row;
    gap: 1rem;
  }
}

@media (min-width: 1025px) {
  #submit-btn:disabled {
    min-width: 5rem;
    max-width: 10rem;
    width: 100%;
  }

  #submit-btn {
    min-width: 5rem;
    max-width: 10rem;
    width: 100%;
  }

  :deep(.v-chip-group) {
    align-items: center;
    column-gap: 1rem;
    /* flex-wrap: nowrap; */
    max-width: 100%;
  }
}</style>
