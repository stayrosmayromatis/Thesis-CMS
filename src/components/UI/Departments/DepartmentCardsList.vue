<template>
  <div class="parent-card">
    <base-alert :show="showAlert" :alert-type-prop="typeOfAlert" :title="alertTitle"></base-alert>
    <v-card elevation="5" class="parent-label">
      <div class="text-divider">
        <label id="titleText"> {{ TitleText }} </label>
        <label class="label__lab-title">{{ courseCode }}</label>
        <label class="label__lab-title">{{ courseName }}</label>
      </div>
    </v-card>
    <div class="cards-overview">
      <department-card v-for="lab of resultArray" :key="lab.LabId" :department_name="lab.LabName"
        :available_seats="lab.AvailableSeats" :duration="lab.Duration" :max_seats="lab.MaxSeats"
        :timestring="`${lab.FromString} - ${lab.ToString}`" :course_id="courseGuid" :ladb_id="lab.LabId"
        :completeness_percent="lab.CompletenessPercent" :user_type="userType"></department-card>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, toRefs, onMounted, ref, computed } from 'vue';
import DepartmentCard from "@/components/UI/Departments/DepartmentCard.vue";
import { InternalDataTransfter } from '@/models/DTO/InternalDataTransfer';
import { useAxios } from "@vueuse/integrations/useAxios";
import { useAxiosInstance } from "@/composables/useInstance.composable";
import { ApiResult } from "@/models/DTO/ApiResult";
import { CourseController } from "@/config";
import { CourseDepartment, CourseDepartmentsResponse } from '@/models/BACKEND-MODELS/CourseDepartmentsResponse';
import { useRouter } from 'vue-router';
import BaseAlert from '@/components/Base/BaseAlert.vue';
import { useAlert } from '@/composables/showAlert.composable';
import { PersonAffiliation } from '@/enums/PersonAffiliationEnum';
export default defineComponent({
  props: {
    course_guid: {
      type: String,
      required: true
    }
  },
  components: {
    DepartmentCard,
    BaseAlert
  },
  setup(props) {
    const { course_guid } = toRefs(props);
    const { setBackendInstanceAuth } = useAxiosInstance();
    const { openAlert, closeAlert, setTypeOfAlert, typeOfAlert, alertTitle, showAlert } = useAlert();
    const courseGuid = ref<string>();
    const courseCode = ref("");
    const courseName = ref("");
    const userType = ref<PersonAffiliation>();
    const router = useRouter();
    const resultArray = ref(new Array<CourseDepartment>());
    onMounted(async () => {
      //Make the api call to fetch all labs according to that course_guid
      closeAlert(1500);
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

      const getDepartmentsByCourseCallRequest = await useAxios(
        CourseController + `get-departments-by-course/${course_guid}`,
        {
          method: "GET",
        },
        setBackendInstanceAuth()
      );
      if (getDepartmentsByCourseCallRequest.isFinished) {
        const getDepartmentsByCourseCallResponse: ApiResult<CourseDepartmentsResponse> = getDepartmentsByCourseCallRequest.data.value;
        if (!getDepartmentsByCourseCallResponse || !getDepartmentsByCourseCallResponse.Status || !getDepartmentsByCourseCallResponse.Data) {
          return { Status: false, Data: false, Error: getDepartmentsByCourseCallResponse.Error };
        }
        resultArray.value = getDepartmentsByCourseCallResponse.Data.CourseDepartments;
        courseGuid.value = getDepartmentsByCourseCallResponse.Data.CourseId;
        courseCode.value = getDepartmentsByCourseCallResponse.Data.CourseCode;
        courseName.value = getDepartmentsByCourseCallResponse.Data.CourseName;
        userType.value = getDepartmentsByCourseCallResponse.Data.UserType;
        return { Status: true, Data: true };
      }
      return { Status: false, Data: false, Error: "Request didn't finish" };
    };
    const delay = async (time: number) => {
      return new Promise((resolve) => setTimeout(resolve, time));
    };
    const TitleText = computed(() => {
      if (!userType.value) {
        return "ΣΥΝΕΒΗ ΣΦΑΛΜΑ ΘΑ ΜΕΤΑΦΕΡΘΕΙΤΕ ΣΤΗΝ ΑΡΧΙΚΗ ΣΕ ΠΟΛΥ ΛΙΓΟ.";
      }
      if (userType.value === 2) {
        return "Επιλογη Τμηματος";
      }
      else {
        return "ΠΑΡΑΚΟΛΟΥΘΗΣΗ ΠΟΡΕΙΑΣ ΔΗΛΩΣΕΩΝ ΤΩΝ ΤΜΗΜΑΤΩΝ ΤΟΥ ΜΑΘΗΜΑΤΟΣ:";
      }
    });
    return { resultArray, courseGuid, courseCode,courseName, alertTitle, showAlert, typeOfAlert, userType, TitleText };
  },
});
</script>

<style scoped>
.parent-card {
  margin: 0.5rem auto;
  min-width: 320px;
}

.parent-label {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: fit-content;
  text-transform: uppercase;
  min-width: 320px;
  font-size: 1rem;
  font-weight: 500;
  background-color: #aacaf3;
  padding: 0.5rem;
  margin-top: 1rem;
  margin-bottom: 1rem;
  text-align: center;
}

.label__lab-title {
  text-align: center;
  white-space: break-spaces;
  color: #044091;
}
.text-divider{
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
.text-divider label#titleText{
  color:#555a69;
}
@media (min-width: 769px) {
  .parent-label {
    font-size: 1.1rem;
    padding: 0.5rem;
  }
}

@media (min-width: 1025px) {
  .parent-label {
    flex-direction: row;
    gap: 1rem;
  }
}
</style>