<template>
  <div class="export-parent" @click="emitMobileViewClose">
    <base-spinner :show="showLoadingSpinner"></base-spinner>
    <div v-if="!showLoadingSpinner">
      <v-card elevation="5" class="export-label"><label>{{ 'Εξαγωγη πορειας / καταστασης δηλωσεων' }}</label></v-card>
      <div class="just-for-show">
        <v-expansion-panels>
          <div class="expansion-panel-export-option__container">
            <expansion-panel-export-option v-for=" course of personalisedCourses" :key="course.CourseGUID"
              :course="course">
            </expansion-panel-export-option>
          </div>
        </v-expansion-panels>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import BaseSpinner from '@/components/Base/BaseSpinner.vue';
import BaseDialog from '@/components/Base/BaseDialog.vue';
import BaseResultEmpty from '@/components/Base/BaseResultEmpty.vue';
import { useAlert } from '@/composables/showAlert.composable';
import { useAxiosInstance } from '@/composables/useInstance.composable';
import { InternalDataTransfter } from '@/models/DTO/InternalDataTransfer';
import { CourseController } from '@/config';
// import { useAxios } from '@vueuse/integrations/useAxios';
import { ApiResult } from '@/models/DTO/ApiResult';
import { PersonalisedCourseBySemester, PersonalisedCoursesBySemesterResponse } from '@/models/BACKEND-MODELS/PersonalisedCoursesBySemesterResponse';
import { useTimeObjectExtensions } from '@/composables/useTimeObjectExtensions.composable';
import ExpansionPanelExportOption from '@/components/UI/Admin/ExportOptions/ExpansionPanelExportOption.vue';

export default defineComponent({
  components: {
    BaseDialog,
    BaseSpinner,
    BaseResultEmpty,
    ExpansionPanelExportOption
  },
  emits: ['propagateCloseMobileView'],
  setup(_, context) {
    const showLoadingSpinner = ref(false);
    const personalisedCourses = ref(new Array<PersonalisedCourseBySemester>());
    const { closeAlert, openAlert, setTypeOfAlert } = useAlert();
    const { scrollToTop } = useTimeObjectExtensions();
    //const { setBackendInstanceAuth } = useAxiosInstance();
    const { MakeAPICall } = useAxiosInstance();

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
      // const getMyCoursesCall = await useAxios(
      //   CourseController + "get-my-courses",
      //   {
      //     method: "GET",
      //   },
      //   setBackendInstanceAuth()
      // );
      const getMyCoursesResponse = await MakeAPICall<ApiResult<PersonalisedCoursesBySemesterResponse>>(CourseController,"get-my-courses", "GET");
      //if (getMyCoursesCall.isFinished) {
        //const getMyCoursesResponse: ApiResult<PersonalisedCoursesBySemesterResponse> = getMyCoursesCall.data.value;
      if (!getMyCoursesResponse || !getMyCoursesResponse.Status || !getMyCoursesResponse.Data || !getMyCoursesResponse.Data.PersonalisedCourses || !getMyCoursesResponse.Data.Count) {
        return { Status: false, Data: false, Error: "API Error" };
      }
      personalisedCourses.value = getMyCoursesResponse.Data.PersonalisedCourses;
      return { Status: true, Data: true };
      // }
      // return { Status: false, Data: false, Error: "Request didn't finish" }
    }
    const delay = async (time: number) => {
      return new Promise((resolve) => setTimeout(resolve, time));
    };
    const emitMobileViewClose = (): void => {
      context.emit('propagateCloseMobileView', true);
    };
    return { emitMobileViewClose, showLoadingSpinner, personalisedCourses }
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
  background-color:var(--header-label-background-color);
  color: var(--header-label-text-color);
  padding: 1rem 0.5rem;
  margin-bottom: 1rem;
}

.export-label>label {
  word-wrap: break-word;
  text-align: center;
  font-size: 0.95rem;
  font-weight: 450;
  white-space: pre-line;
  word-break: break-word;
}

.expansion-panel-export-option__container {
  display: flex;
  flex-direction: column;
  align-items: self-start;
  justify-content: center;
  width: 100%;
  min-width: 320px;
}

/* @media (min-width: 769px) {}

@media (min-width: 1025px) {} */
</style>
