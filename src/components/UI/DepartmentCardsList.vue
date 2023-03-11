<template>
  <div class="parent-card">
    <base-alert
    :show="showAlert"
    :alert-type-prop="typeOfAlert"
    :title="alertTitle"
    ></base-alert>
    <v-card elevation="5" class="parent-label">
      <label> Επιλογη Τμηματος: </label>
      <label class="label__lab-title">
        {{CourseInfo}}
      </label>
    </v-card>
    <div class="cards-overview">
      <department-card
        v-for="lab of resultArray"
        :key="lab.LabId"
        :department_name="lab.LabName"
        :available_seats="lab.AvailableSeats"
        :duration="lab.Duration"
        :max_seats="lab.MaxSeats"
        :timestring="`${lab.FromString} - ${lab.ToString}`"
        :course_id="courseGuid"
        :ladb_id="lab.LabId"
        :completeness_percent="lab.CompletenessPercent"
      ></department-card>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, toRefs, onMounted, ref, computed } from 'vue';
import DepartmentCard from "@/components/UI/DepartmentCard.vue";
import { InternalDataTransfter } from '@/models/DTO/InternalDataTransfer';
import { useAxios } from "@vueuse/integrations/useAxios";
import { useAxiosInstance } from "@/composables/useInstance.composable";
import { ApiResult } from "@/models/DTO/ApiResult";
import { CourseController } from "@/config";
import { CourseDepartment, CourseDepartmentsResponse } from '@/models/BACKEND-MODELS/CourseDepartmentsResponse';
import { useRouter } from 'vue-router';
import BaseAlert from '@/components/Base/BaseAlert.vue';
import { useAlert } from '@/composables/showAlert.composable';
export default defineComponent({
  props: {
    course_guid:{
      type:String,
      required:true
    }
  },
  components: {
    DepartmentCard,
    BaseAlert
  },
  setup(props) {
    const {course_guid} = toRefs(props);
    const {setBackendInstanceAuth} = useAxiosInstance();
    const {openAlert,closeAlert,setTypeOfAlert,typeOfAlert, alertTitle,showAlert} = useAlert();
    const courseGuid = ref<string>();
    const coursCode = ref("");
    const courseName = ref("");
    const router = useRouter();
    const resultArray = ref(new Array<CourseDepartment>() );
    onMounted(async () => {
      //Make the api call to fetch all labs according to that course_guid
      closeAlert(1500);
      const makeGetDepartmentsByCourseCallResponseIDT = await MakeGetDepartmentsByCourseCall(course_guid.value);
      if(!makeGetDepartmentsByCourseCallResponseIDT.Status || !makeGetDepartmentsByCourseCallResponseIDT.Data)
      {
        setTypeOfAlert("error");
        openAlert("Αποτυχία συστήματος επαναλάβετε την διαδικασία");

        await delay(1500);
        router.replace({name:'labList'});
      }

    });
    async function MakeGetDepartmentsByCourseCall(course_guid : string) : Promise<InternalDataTransfter<boolean>>
    {
      if(!course_guid)
        return {Status:false,Data:false,Error:"Guid null"};

      const getDepartmentsByCourseCallRequest = await useAxios(
        CourseController+`get-departments-by-course/${course_guid}`,
        {
          method: "GET",
        },
        setBackendInstanceAuth()
      );
      if(getDepartmentsByCourseCallRequest.isFinished)
      {
        const getDepartmentsByCourseCallResponse:ApiResult<CourseDepartmentsResponse> = getDepartmentsByCourseCallRequest.data.value;
        if(!getDepartmentsByCourseCallResponse || !getDepartmentsByCourseCallResponse.Status || !getDepartmentsByCourseCallResponse.Data)
        {
          return {Status:false,Data:false,Error:getDepartmentsByCourseCallResponse.Error};
        }
        //console.log(getDepartmentsByCourseCallResponse.Data);
        resultArray.value = getDepartmentsByCourseCallResponse.Data.CourseDepartments;
        courseGuid.value =getDepartmentsByCourseCallResponse.Data.CourseId;
        coursCode.value = getDepartmentsByCourseCallResponse.Data.CourseCode;
        courseName.value = getDepartmentsByCourseCallResponse.Data.CourseName;
        return {Status:true,Data:true};
      }
      return {Status:false,Data:false,Error:"Request didn't finish"};
    };
    const CourseInfo = computed(() => {
      if(coursCode.value && courseName.value)
        return `${coursCode.value} ${courseName.value}`;
      return "SHOULDN'T BE SEEING THIS";
    });
    const delay = async (time: number) => {
      return new Promise((resolve) => setTimeout(resolve, time));
    };
    return { resultArray,courseGuid,CourseInfo,alertTitle,showAlert,typeOfAlert };
  },
});
</script>

<style scoped>
.parent-card {
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
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
}
.label__lab-title {
  text-align: center;
  word-break: break-word;
}
.cards-overview {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-evenly;
  flex-wrap: wrap;
}
@media (min-width: 769px) {
  .parent-card {
    margin: 1.5rem 1.5rem;
  }
  .parent-label {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    height: fit-content;
    justify-content: center;
    font-size: 1.2rem;
    text-transform: uppercase;
    font-weight: 500;
    background-color: #aacaf3;
    padding: 1rem;
    margin-top: 1.5rem;
    margin-bottom: 1.5rem;
  }
  .cards-overview {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-evenly;
    flex-wrap: wrap;
  }
}
@media (min-width: 1025px) {
  .parent-card {
    margin: 1.5rem 1.5rem;
  }
  .parent-label {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 1rem;
    width: 100%;
    height: fit-content;
    justify-content: center;
    font-size: 1.2rem;
    text-transform: uppercase;
    font-weight: 500;
    background-color: #aacaf3;
    padding: 1rem;
    margin-top: 1.5rem;
    margin-bottom: 1.5rem;
  }
  .cards-overview {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-evenly;
    flex-wrap: wrap;
  }
}
</style>
