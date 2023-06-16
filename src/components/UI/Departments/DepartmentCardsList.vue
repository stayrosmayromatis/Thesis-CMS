<template>
  <section>
    <base-spinner :show="showSpinner"></base-spinner>
    <base-alert :show="showAlert" :alert-type-prop="typeOfAlert" :title="alertTitle"></base-alert>
    <div class="parent-card">
      <div class="outer-parent-label" v-if="!showSpinner">
        <v-card elevation="10" class="parent-label">
          <div class="text-divider">
            <label id="titleText"> {{ TitleText }} </label>
          </div>
          <div class="label__lab-title-divider">
            <label class="label__lab-title">{{ `${courseCode} ${courseName}` }}</label>
          </div>
        </v-card>
      </div>
      <suspense>
        <template #default>
          <div class="cards-overview">
            <department-card v-for="lab of resultArray" :key="lab.LabId" :department_name="lab.LabName"
              :available_seats="lab.AvailableSeats" :duration="lab.Duration" :max_seats="lab.MaxSeats"
              :timestring="`${lab.FromString} - ${lab.ToString}`" :course_id="courseGuid" :ladb_id="lab.LabId"
              :completeness_percent="lab.CompletenessPercent" :user_type="userType"></department-card>
          </div>
        </template>
      </suspense>
    </div>
  </section>
</template>
<script lang="ts">
import { defineComponent, toRefs, onMounted, ref, computed, defineAsyncComponent } from 'vue';
//import DepartmentCard from "@/components/UI/Departments/DepartmentCard.vue";
const DepartmentCard = defineAsyncComponent({
  loader: () => import("@/components/UI/Departments/DepartmentCard.vue"),
  delay: 2000,
  suspensible: false
});

import { InternalDataTransfter } from '@/models/DTO/InternalDataTransfer';
//import { useAxios } from "@vueuse/integrations/useAxios";
import { useAxiosInstance } from "@/composables/useInstance.composable";
import { ApiResult } from "@/models/DTO/ApiResult";
import { CourseController } from "@/config";
import { CourseDepartment, CourseDepartmentsResponse } from '@/models/BACKEND-MODELS/CourseDepartmentsResponse';
import { useRouter } from 'vue-router';
import BaseAlert from '@/components/Base/BaseAlert.vue';
import { useAlert } from '@/composables/showAlert.composable';
import { PersonAffiliation } from '@/enums/PersonAffiliationEnum';
import BaseSpinner from '@/components/Base/BaseSpinner.vue';
export default defineComponent({
  props: {
    course_guid: {
      type: String,
      required: true
    }
  },
  components: {
    DepartmentCard,
    BaseAlert,
    BaseSpinner
  },
  setup(props) {
    const { course_guid } = toRefs(props);
    //const { setBackendInstanceAuth } = useAxiosInstance();
    const { MakeAPICall } = useAxiosInstance();
    const { openAlert, closeAlert, setTypeOfAlert, typeOfAlert, alertTitle, showAlert } = useAlert();
    const courseGuid = ref<string>();
    const courseCode = ref("");
    const courseName = ref("");
    const userType = ref<PersonAffiliation>();
    const router = useRouter();
    const resultArray = ref(new Array<CourseDepartment>());
    const showSpinner = ref(false);
    onMounted(async () => {
      //Make the api call to fetch all labs according to that course_guid
      closeAlert();
      const makeGetDepartmentsByCourseCallResponseIDT = await MakeGetDepartmentsByCourseCall(course_guid.value);
      if (!makeGetDepartmentsByCourseCallResponseIDT.Status || !makeGetDepartmentsByCourseCallResponseIDT.Data) {
        setTypeOfAlert("error");
        openAlert("Αποτυχία συστήματος επαναλάβετε την διαδικασία");
        await delay(1500);
        router.replace({ name: 'labList' });
      }

    });
    async function MakeGetDepartmentsByCourseCall(course_guid: string): Promise<InternalDataTransfter<boolean>> {
      if (!course_guid)
        return { Status: false, Data: false, Error: "Guid null" };
      showSpinner.value = true;
      const getDepartmentsByCourseCallResponse = await MakeAPICall<ApiResult<CourseDepartmentsResponse>>(CourseController, `get-departments-by-course/${course_guid}`, "GET");
      if (!getDepartmentsByCourseCallResponse || !getDepartmentsByCourseCallResponse.Status || !getDepartmentsByCourseCallResponse.Data) {
        return { Status: false, Data: false, Error: getDepartmentsByCourseCallResponse.Error ?? "Request didn't finish" };
      }
      resultArray.value = getDepartmentsByCourseCallResponse.Data.CourseDepartments;
      courseGuid.value = getDepartmentsByCourseCallResponse.Data.CourseId;
      courseCode.value = getDepartmentsByCourseCallResponse.Data.CourseCode;
      courseName.value = getDepartmentsByCourseCallResponse.Data.CourseName;
      userType.value = getDepartmentsByCourseCallResponse.Data.UserType;
      showSpinner.value = false;
      return { Status: true, Data: true };
    };
    const delay = async (time: number) => {
      return new Promise((resolve) => setTimeout(resolve, time));
    };
    const TitleText = computed(() => {
      if (!userType.value) {
        return "Συνέβη σφάλμα θα μεταφερθείτε στην αρχική σε πολύ λιγό.";
      }
      if (userType.value === PersonAffiliation.STUDENT) {
        return "Επιλογη Τμηματος";
      }
      return "Παρακολούθηση δηλώσεων μαθήματος:";
    });
    return { showSpinner, resultArray, courseGuid, courseCode, courseName, alertTitle, showAlert, typeOfAlert, userType, TitleText };
  },
});
</script>

<style scoped>
.parent-card {
  width: 100%;
  padding: 1rem 0.3rem;
  max-width: 100rem;
}

.parent-label {
  margin-bottom: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: fit-content;
  min-width: 320px;
  font-size: 0.95rem;
  font-weight: 500;
  background-color: var(--header-label-background-color);
  color: var(--header-label-text-color);
  padding: 0.5rem;
}

.label__lab-title {
  text-align: center;
  white-space: break-spaces;
  color: var(--header-label-color);
}

.text-divider {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.label__lab-title-divider {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.cards-overview {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-evenly;
  flex-wrap: wrap;
}

.text-divider label#titleText {
  color: var(--header-label-text-color);
  /* #555a69; */
}

/* div.outer-parent-label {
  padding: 0;
} */

@media (min-width: 769px) {

  .parent-card {
    padding: 2rem 0.5rem;
    margin: auto;
    width: inherit;
  }

  .parent-label {
    height: fit-content;
    margin-bottom: 1.2rem;
    font-size: 1.2rem;
  }

  /* div.outer-parent-label {
    padding: 0 1rem;
  } */
}

@media (min-width: 1025px) {
  .parent-label {
    flex-direction: row;
    gap: 1rem;
  }
}
</style>
