<template>
  <div class="parent-card-container">
    <v-card elevation="10" class="parent-card-container__border-radius" 
    :disabled="completeness_percent === 100 && user_type === 2"
    >
      <div class="parent-card__department-title">
        <v-card-title> {{ department_name }} </v-card-title>
      </div>
      <v-divider class="border-opacity" length="100%" thickness="1px" :vertical="false"></v-divider>
      <div class="parent-card__main-info">
        <v-card-text>
          <div class="parent-card__main-info__labels">
            <div class="label__hours">
              <label style="font-weight: 500; color: #696969;">Ώρες Εργαστηρίου</label>
              <label>{{ timestring }}</label>
            </div>
            <div class="label__duration">
              <label style="color: #696969">Διάρκεια</label>
              <label>{{ `~ ${duration > 1 ? `${duration} ώρες` : `${duration} ώρα`} ` }}</label>
            </div>
            <div class="label__max-seats">
              <label style="color: #696969">Χωριτηκότητα</label>
              <label>{{ max_seats }}</label>
            </div>

            <div class="label__available-seats">
              <label style="color: #696969">Διαθέσιμες Θέσεις</label>
              <label style="font-weight: 500;">{{ available_seats }}</label>
            </div>
            <v-divider style="max-width: 100%;
      border-top-width: 1px;
      width: 100%;
      opacity: 0.5;
      margin-top: 1rem;" length="100%" thickness="1px" :vertical="false"></v-divider>
            <div class="label__department-completeness">
              <label style="font-weight: 500;">Πληρότητα Τμήματος</label>
              <label style="font-weight: 500;">{{ `${completeness_percent}%` }}</label>
            </div>

          </div>
          <div class="progress-bar">
            <v-progress-linear :model-value="completeness_percent" :class="{
              'progress-bar__80-100': completeness_percent >= 80,
              'progress-bar__60-80': completeness_percent >= 60 && completeness_percent < 80,
              'progress-bar__40-60': completeness_percent >= 40 && completeness_percent < 60,
              'progress-bar__20-40': completeness_percent >= 20 && completeness_percent < 40,
              'progress-bar__0-20': completeness_percent >= 0 && completeness_percent < 20,
            }" height="15px" :striped="completeness_percent < 100 ? true : false" rounded="5rem" :rounded-bar="true"
              :tag="'div'"></v-progress-linear>
          </div>
          <div class="enroll-button">
            <v-tooltip :text="ToolTipText" location="bottom">
              <template v-slot:activator="{ props }">
                <v-btn v-bind="props" @click="handActionByUserType()" variant="outlined" :disabled="is_assistant"
                  :class="{ 'button__border-color': completeness_percent < 100, 'button__border-color__full': completeness_percent === 100 }"
                  :rounded="true">
                  <div class="enroll-button__inside">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 2048 2048">
                      <path fill="black"
                        d="M1848 896q42 0 78 15t64 42t42 63t16 78q0 39-15 76t-43 65l-717 719l-377 94l94-377l717-718q28-28 65-42t76-15zm51 249q21-21 21-51q0-31-20-50t-52-20q-14 0-27 4t-23 15l-692 694l-34 135l135-34l692-693zM640 896H512V768h128v128zm896 0H768V768h768v128zM512 1152h128v128H512v-128zm128-640H512V384h128v128zm896 0H768V384h768v128zM384 1664h443l-32 128H256V0h1536v743q-67 10-128 44V128H384v1536zm384-512h514l-128 128H768v-128z" />
                    </svg>
                    <label
                      :class="{ 'label__fill-color': completeness_percent < 100, 'label__fill-color__full': completeness_percent === 100 }">{{
                        ButtonText }}</label>
                  </div>
                </v-btn>
              </template>
            </v-tooltip>
          </div>
        </v-card-text>
      </div>
    </v-card>
  </div>
</template>

<script lang="ts">
import { useAlert } from "@/composables/showAlert.composable";
import { useAxiosInstance } from "@/composables/useInstance.composable";
import { CourseController, StudentsController } from "@/config";
import { CreateSubResponse } from "@/models/BACKEND-MODELS/CreateSubResponse";
import { ApiResult } from "@/models/DTO/ApiResult";
import { InternalDataTransfter } from "@/models/DTO/InternalDataTransfer";
//import { useAxios } from "@vueuse/integrations/useAxios";
import { defineComponent, computed, toRefs } from "vue";
import { useRouter } from 'vue-router';
export default defineComponent({
  props: {
    duration: {
      type: Number,
      required: false,
      default: 2
    },
    max_seats: {
      type: Number,
      required: false,
      default: 50
    },
    available_seats: {
      type: Number,
      required: false,
      default: 0
    },
    department_name: {
      type: String,
      required: false,
      default: 'T1'
    },
    timestring: {
      type: String,
      required: false,
      default: '09:30-11:30'
    },
    course_id: {
      type: String,
      required: true,
      default: undefined
    },
    ladb_id: {
      type: String,
      required: true,
      default: undefined
    },
    completeness_percent: {
      type: Number,
      required: true,
      default: 0
    },
    user_type: {
      type: Number,
      required: true,
      default: 2
    },
    is_assistant:{
      type: Boolean,
      required:true,
      default:false
    }
  },
  setup(props) {
    const { available_seats, duration, max_seats, department_name, timestring, ladb_id, course_id, completeness_percent, user_type,is_assistant } = toRefs(props);
    //const { setBackendInstanceAuth } = useAxiosInstance();
    const { MakeAPICall } = useAxiosInstance();
    const { setTypeOfAlert, openAlert, closeAlert } = useAlert();
    const router = useRouter();
    const ButtonText = computed(() => {
      if (completeness_percent.value >= 100) {
        return "ΠΛΗΡΕΣ";
      }
      if (!completeness_percent.value || completeness_percent.value < 100) {
        if (user_type.value === 2) { //STUDENT
          return "ΕΓΓΡΑΦΗ";
        }
        else {
          return "ΔΙΑΘΕΣΙΜΟ";
        }
      }
    });
    const ToolTipText = computed(() => {

      if (completeness_percent.value >= 100) {
        if (user_type.value === 2) {
          return "Μη διαθέσιμη δήλωση";
        } else {
          return "Το τμήμα είναι σε πληρότητα, τροποποιείστε το";
        }
      }
      if (!completeness_percent.value || completeness_percent.value < 100) {
        if (user_type.value === 2) {
          return "Επικυρώστε τη δήλωση σας";
        }
        else {
          return "Τροποποίηση";
        }
      }
    });
    const handActionByUserType = async () => {
      closeAlert();
      if (!user_type.value || !course_id.value || !ladb_id.value) {
        setTypeOfAlert("error");
        openAlert("Αποτυχία ενέργειας προσπαθήστε ξανά");
        closeAlert(1000);
        await delay(1000);
        return;
      }
      if (user_type.value === 2) {
        const finalRegisterIDT = await MakeTheFinalRegisterCall();
        if (!finalRegisterIDT.Status) {
          setTypeOfAlert("error");
          openAlert("Αποτυχία δήλωσης, προσπαθήστε ξανά");
          closeAlert(1000);
          await delay(1000);
          return;
        }
        setTypeOfAlert("success");
        openAlert("Επιτυχία δήλωσης");
        closeAlert(1000);
        await delay(1000);
        router.replace({ name: "submittedLabs" });
        return;
      }
      if (user_type.value === 1 || user_type.value === 12) {
        router.push({
          name: 'addlab', query: {
            editId: course_id.value!.trim().toString()
          }
        });
        return;
      }
      setTypeOfAlert("error");
      openAlert("Αποτυχία ενέργειας προσπαθήστε ξανά");
      closeAlert(1000);
      await delay(1000);
      return;
    };
    async function MakeTheFinalRegisterCall(): Promise<InternalDataTransfter<boolean>> {
      if (!course_id.value || !course_id.value)
        return { Status: false, Data: false, Error: "The parameters are null" };
      // const finalRegisterCallApiRequest = await useAxios(
      //   StudentsController + "create-student-submition",
      //   {
      //     method: "POST",
      //     data: {
      //       CourseId: course_id.value,
      //       LabId: ladb_id.value
      //     }
      //   },
      //   setBackendInstanceAuth()
      // );
      const registrationResult = await MakeAPICall<ApiResult<CreateSubResponse>,{CourseId:string,LabId:string}>(StudentsController,"create-student-submition","POST",{
            CourseId: course_id.value,
            LabId: ladb_id.value
          });
      // if (!finalRegisterCallApiRequest.isFinished.value)
      //   return { Status: false, Data: false, Error: "API Call didn't finish" };
      // const registrationResult: ApiResult<CreateSubResponse> = finalRegisterCallApiRequest.data.value;
      if (!registrationResult || !registrationResult.Status)
        return { Status: false, Data: false, Error: registrationResult.Error ?? "API Call didn't finish" };
      return { Status: true, Data: true };
    }
    const delay = async (time: number) => {
      return new Promise((resolve) => setTimeout(resolve, time));
    };
    return { available_seats, duration, max_seats, department_name, timestring, ButtonText, completeness_percent, handActionByUserType, ToolTipText };
  },
});
</script>

<style scoped>
.parent-card-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: fit-content;
  height: fit-content;
  min-width: 320px;
  padding: 1rem 1rem;
}

.parent-card-container__border-radius {
  border-radius: 32px;
  -moz-border-radius: 32px;
  -webkit-border-radius: 32px;
  min-width: 320px;
}

.parent-card__department-title {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 0.5rem 0.5rem;
}

.parent-card__department-title>.v-card-title {
  font-weight: 1000;
  font-size: 1.8rem;
}

.parent-card__main-info {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 0.5rem 0.5rem;
}

div.parent-card__main-info__labels {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  line-height: 1.4rem;
  font-weight: 400;
  gap: 0.5rem;
  min-width: 320px;
}

.label__hours label,
.label__duration label,
.label__max-seats label,
.label__available-seats label,
.label__available-seats label {
  flex: 1;
  -webkit-flex: 1;
  text-align: right;
  font-weight: 500;
}

.parent-card__main-info__labels>.label__department-completeness {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin-top: 0.5rem;
  flex: 1 0;
  -webkit-flex: 1 0;
  /* gap: 0.5rem;*/
}

.parent-card__main-info__labels>.label__available-seats {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 100%;
  flex: 1 0;
  -webkit-flex: 1 0;
  /* gap: 1.5rem; */
}

.parent-card__main-info__labels>.label__max-seats {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 100%;
  flex: 1 0;
  -webkit-flex: 1 0;
  /* gap: 1.5rem;*/
}

.parent-card__main-info__labels>.label__duration {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 100%;
  flex: 1 0;
  -webkit-flex: 1 0;
  /* gap: 1.5rem; */
}

.parent-card__main-info__labels>.label__hours {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 100%;
  /* gap: 1.5rem; */
  flex: 1 0;
  -webkit-flex: 1 0;
}

.parent-card__main-info>.v-card-text {
  font-weight: 400;
  font-size: 1rem;
}

.button__border-color {
  color: #272996;
  background-color: #f3f3f3;
}

.button__border-color__full {
  color: #ff4545;
  background-color: #f3f3f3;
}

.label__fill-color {
  color: #272996;
}

.label__fill-color__full {
  color: #ff4545;
}

.enroll-button {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 1rem;
}

.enroll-button__inside {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 0.5rem 0.5rem;
  cursor: pointer;
  gap: 0.3rem;
}

.enroll-button__inside>label {
  cursor: pointer;
}

.progress-bar {
  margin: 0.2rem 0;
  width: 100%;
}

.progress-bar__0-20 {
  color: green
}

.progress-bar__20-40 {
  color: darkgreen
}

.progress-bar__40-60 {
  color: yellowgreen
}

.progress-bar__60-80 {
  color: rgb(255, 166, 0)
}

.progress-bar__80-100 {
  color: #ff4545;
}

.border-opacity {
  opacity: 50%;
  margin: 0 1rem;
}
</style>
