<template>
  <div class="export-parent" @click="emitMobileViewClose">
    <base-spinner :show="showLoadingSpinner"></base-spinner>
    <base-alert :show="showAlert" :alert-type-prop="typeOfAlert" :title="alertTitle"></base-alert>
    <div v-if="!showLoadingSpinner">
      <v-card elevation="3" class="export-label"><label>{{ 'Εξαγωγη πορειας / καταστασης δηλωσεων' }}</label></v-card>
      <div class="just-for-show">
        <v-expansion-panels>
          <v-expansion-panel v-for=" course of personalisedCourses" :key="course.CourseGUID">
            <v-expansion-panel-title expand-icon="mdi-plus" collapse-icon="mdi-minus">
              <div class="export-panel-title-container">
                <div class="export_left--chip">
                  <v-chip class="left_chip--bg" size="large">
                    <label>
                      {{ `${course.CourseCode} ${course.CourseName}` }}
                    </label>
                  </v-chip>
                </div>
                <div class="export_right--chips">
                  <v-chip class="chip-attendance" size="large">
                    <label>
                      {{ course.CourseAttendanceString }}
                    </label>
                  </v-chip>
                  <v-chip class="chip-semester" size="large">
                    <label>
                      {{ semesterReformer(course.Semester) }}
                    </label>
                  </v-chip>
                </div>
              </div>
            </v-expansion-panel-title>
            <v-expansion-panel-text>
              <div class="export-panel-text-container">
                <div class="file-input__container">
                  <v-file-input v-model="files" placeholder="Upload your documents"
                    label="Ανέβασμα αρχείου προς επιβεβαίωση (cross-reference)" :multiple="false" counter
                    :counter-size-string="'Επιλέχθηκε αρχείο'" :accept="acceptableFileTypes" show-size
                    :persistent-hint="true" :prepend-icon="''" density="comfortable"
                    :variant="'solo'"
                    :hint="'Μέγιστο μέγεθος αρχείου 20Kb'" :rules="validationRules" :error="errorOnFileInput"
                    :error-messages="errorOnFileInputMessage" @click:clear="logIt" @update:model-value="logIt"
                    validate-on="input" chips>
                    <template v-slot:selection="{ fileNames }">
                      <template v-for="fileName in fileNames" :key="fileName">
                        <v-chip size="small" label color="primary" class="me-2">
                          {{ fileName }}
                        </v-chip>
                      </template>
                    </template>
                  </v-file-input>
                  <v-btn type="button" color="#a3cef1" elevation="4">
                  <div class="export--button">
                    <!-- <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
                      <path
                        d="M7 13h10v1h-10v-1zm0 4h5v-1h-5v1zm15-17v14.386c0 2.391-6.648 9.614-9.811 9.614h-10.189v-24h20zm-2 13.543v-6.543h-16v15h7.362c4.156 0 2.638-6 2.638-6s6 1.65 6-2.457zm-13-2.543h10v-1h-10v1z" />
                    </svg> -->
                    <label>
                      Ανεβασμα
                    </label>
                  </div>
                </v-btn>
                </div>
                <v-btn type="button" color="#a3cef1" elevation="4">
                  <div class="export--button">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
                      <path
                        d="M7 13h10v1h-10v-1zm0 4h5v-1h-5v1zm15-17v14.386c0 2.391-6.648 9.614-9.811 9.614h-10.189v-24h20zm-2 13.543v-6.543h-16v15h7.362c4.156 0 2.638-6 2.638-6s6 1.65 6-2.457zm-13-2.543h10v-1h-10v1z" />
                    </svg>
                    <label>
                      Εξαγωγη Δηλωσεων
                    </label>
                  </div>
                </v-btn>
              </div>
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref } from 'vue';
import BaseSpinner from '@/components/Base/BaseSpinner.vue';
import BaseDialog from '@/components/Base/BaseDialog.vue';
import BaseAlert from '@/components/Base/BaseAlert.vue';
import BaseResultEmpty from '@/components/Base/BaseResultEmpty.vue';
import { useAlert } from '@/composables/showAlert.composable';
import { useAxiosInstance } from '@/composables/useInstance.composable';
import { InternalDataTransfter } from '@/models/DTO/InternalDataTransfer';
import { CourseController } from '@/config';
import { useAxios } from '@vueuse/integrations/useAxios';
import { ApiResult } from '@/models/DTO/ApiResult';
import { PersonalisedCourseBySemester, PersonalisedCoursesBySemesterResponse } from '@/models/BACKEND-MODELS/PersonalisedCoursesBySemesterResponse';
import { useTimeObjectExtensions } from '@/composables/useTimeObjectExtensions.composable';
import { LabSemesterEnum } from '@/enums/LabSemesterEnum';
export default defineComponent({
  components: {
    BaseDialog,
    BaseAlert,
    BaseSpinner,
    BaseResultEmpty
  },
  emits: ['propagateCloseMobileView'],
  setup(_, context) {
    const showLoadingSpinner = ref(false);
    const personalisedCourses = ref(new Array<PersonalisedCourseBySemester>());
    const { showAlert, alertTitle, typeOfAlert, closeAlert, openAlert, setTypeOfAlert } = useAlert();
    const { scrollToTop } = useTimeObjectExtensions();
    const { setBackendInstanceAuth } = useAxiosInstance();
    const files = ref(new Array<globalThis.File>());
    const errorOnFileInput = ref(false);
    const errorOnFileInputMessage = ref("");
    const validationRules = [
      (value: Array<globalThis.File>) => {
        if (!value) {
          errorOnFileInput.value = true;
          errorOnFileInputMessage.value = "Δεν έχετε εισάγει αρχείο"
          return false;
        }
        if (!value.length) {
          errorOnFileInput.value = true;
          errorOnFileInputMessage.value = "Δεν έχετε εισάγει αρχείο"
          return false;
        }
        if (value[0].size > 21000) {
          errorOnFileInput.value = true;
          errorOnFileInputMessage.value = "Υπέρβαση επιτρεπόμενου ορίου των 20 kB"
          return false;
        }
        console.dir(value);
        return true;
      }
    ];
    const acceptableFileTypes = [
      "application/vnd.ms-excel",
      "application/msexcel",
      "application/x-msexcel",
      "application/x-ms-excel",
      "application/x-excel",
      "application/x-dos_ms_excel",
      "application/xls",
      "application/x-xls",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ]
    onMounted(async () => {
      emitMobileViewClose();
      closeAlert(1000);
      showLoadingSpinner.value = true;
      const getMyCoursesIDT = await GetMyCoursesCall();
      showLoadingSpinner.value = false;
      if (!getMyCoursesIDT.Status) {
        closeAlert(1000);
        setTypeOfAlert('error');
        openAlert("Αποτυχία ανάκτησης μαθημάτων");
        scrollToTop();
        await delay(1500);
        closeAlert(1000);
        return;
      }
      closeAlert(1000);
      setTypeOfAlert('success');
      openAlert("Επιτυχία ανάκτησης μαθημάτων");
      scrollToTop();
      await delay(1500);
      closeAlert(1000);
    });

    const GetMyCoursesCall = async (): Promise<InternalDataTransfter<boolean>> => {
      const getMyCoursesCall = await useAxios(
        CourseController + "get-my-courses",
        {
          method: "GET",
        },
        setBackendInstanceAuth()
      );
      if (getMyCoursesCall.isFinished) {
        const getMyCoursesResponse: ApiResult<PersonalisedCoursesBySemesterResponse> = getMyCoursesCall.data.value;
        if (!getMyCoursesResponse || !getMyCoursesResponse.Status || !getMyCoursesResponse.Data || !getMyCoursesResponse.Data.PersonalisedCourses || !getMyCoursesResponse.Data.Count) {
          return { Status: false, Data: false, Error: "API Error" };
        }
        personalisedCourses.value = getMyCoursesResponse.Data.PersonalisedCourses;
        return { Status: true, Data: true };
      }
      return { Status: false, Data: false, Error: "Request didn't finish" }
    }
    const delay = async (time: number) => {
      return new Promise((resolve) => setTimeout(resolve, time));
    };
    const emitMobileViewClose = (): void => {
      context.emit('propagateCloseMobileView', true);
    };
    const semesterReformer = (semester: LabSemesterEnum) => {
      if (!semester) return "N/A";
      switch (semester) {
        case LabSemesterEnum.A_XEIM:
          return "Α ";
        case LabSemesterEnum.B_EAR:
          return "Β ";
        case LabSemesterEnum.C_XEIM:
          return "Γ ";
        case LabSemesterEnum.D_EAR:
          return "Δ ";
        case LabSemesterEnum.E_XEIM:
          return "E ";
        case LabSemesterEnum.ST_EAR:
          return "ΣΤ ";
        case LabSemesterEnum.Z_XEIM:
          return "Ζ ";
        case LabSemesterEnum.H_EAR:
          return "Η ";
        case LabSemesterEnum.TH_XEIM:
          return "Θ ";
        case LabSemesterEnum.I_EAR:
          return "Ι ";
        case LabSemesterEnum.K_XEIM:
          return "Κ ";
        case LabSemesterEnum.L_EAR:
          return "Λ ";
        default:
          return "N/A";
      }
    };
    const logIt = () => {
      if (errorOnFileInput.value === true) {
        errorOnFileInput.value = false;
        errorOnFileInputMessage.value = "";
      }
    };
    const logAppend = () => {
      console.log("Click append now");
    }
    return { logAppend, logIt, emitMobileViewClose, showLoadingSpinner, personalisedCourses, showAlert, alertTitle, typeOfAlert, semesterReformer, files, acceptableFileTypes, validationRules, errorOnFileInput, errorOnFileInputMessage }
  }

});
</script>

<style scoped>
.export-parent {
  min-width: 320px;
  padding: 0;
  margin: 1rem 1.5rem;
  display: flex;
  flex-direction: column;
  width: inherit;
  justify-content: flex-start;
  align-items: inherit;
}

.export-label {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: fit-content;
  min-width: 320px;
  background-color: #dae3f7;
  padding: 1rem 0;
  margin-bottom: 1rem;
}

.export-label>label {
  word-wrap: break-word;
  text-align: center;
  font-size: 0.95rem;
  font-weight: 450;
  text-transform: uppercase;
  white-space: pre-line;
  word-break: break-word;
}

.export-panel-title-container,
.export-panel-text-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  gap: 1rem;
  padding: 0 0.5rem
}

.export_left--chip {}

.export_right--chips {
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  align-items: center;
  gap: 1rem;
}

.left_chip--bg {
  background: #f7f7f7;
  border: 1px solid #1c4397;
  color: #1c4397;
  gap: 0.5rem;
  height: fit-content;
  padding: 0.3rem 2rem;
}

.left_chip--bg>label {
  font-size: 1.1rem;
  word-wrap: break-word;
  text-align: center;
  white-space: pre-line;
  padding: 0.5rem 0;
  width: fit-content;
  height: fit-content;
  max-width: 20rem;
  letter-spacing: 0.05rem;
  line-height: 1.1rem;
}

.chip-attendance {
  background: #f7f7f7;
  border: 1px solid #00c900;
  color: #00c900;
  word-wrap: break-word;
  width: fit-content;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 0.5rem 0.5rem;
  min-width: 8rem;
}

.chip-semester {
  background: #f7f7f7;
  border: 1px solid #0136e6;
  color: #0136e6;
  word-wrap: break-word;
  width: fit-content;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 0.5rem 0.5rem;
  min-width: 8rem;
}

.chip-attendance,
.chip-semester>label {
  text-align: center;
  font-size: 1.1rem;
}

.export--button {
  width: fit-content;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 0.1rem 0.1rem;
  gap: 0.5rem;
}

.just-for-show :deep(.v-expansion-panel-text__wrapper) {
  padding: 1rem 0.5rem;
}
.file-input__container{
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
}
@media (min-width: 769px) {

  .export-panel-title-container,
  .export-panel-text-container {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    gap: 0;
  }

  .export_right--chips {
    justify-content: flex-end;
    align-items: center;
    gap: 1rem;

  }

  /* .left_chip--bg {
    background: #f7f7f7;
    border: 1px solid #1c4397;
    color: #1c4397;
    gap: 0.5rem;
    height: fit-content;
    padding: 0.3rem 2rem;
  } */

  .left_chip--bg>label {
    max-width: 35rem;
    letter-spacing: 0.05rem;
    line-height: 1.3rem;
    white-space: normal;
  }
  .file-input__container{
    width: fit-content;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 1rem;
}
}

@media (min-width: 1025px) {}
</style>
