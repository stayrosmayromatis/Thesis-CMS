<template>
  <base-alert :show="showAlert" :alert-type-prop="typeOfAlert" :title="alertTitle"></base-alert>
  <v-card elevation="3" class="admin-label">{{ `Τρεχουμενη περιοδος` }}</v-card>
  <base-result-empty :show="true"></base-result-empty>
  <!-- <base-dialog v-if="showConfirmDeletionModal" :route-change-authorizer="true" :inner-title="confirmDeletionInnerTitle"
    :inner-description="confirmDeletionInnerDescription"></base-dialog> -->
  <div class="parent">
    <base-spinner :show="showLoadingSpinner"></base-spinner>
    <div v-if="!showLoadingSpinner">
      <v-card elevation="3" class="admin-label">{{AdminLabel}} </v-card>
      <!-- <v-card elevation="5" class="single-admin_card" v-for="admin of arrayOfAdmins" :key="admin.Id">
        <div class="single-admin_card--item">
          <span>{{ admin.DisplayNameEl }}</span>
          <v-tooltip :text="'Διαγραφή διαχειριστή'" location="bottom">
            <template v-slot:activator="{ props }">
              <v-btn v-bind="props" class="delete-button" icon="mdi-trash-can" size="x-small"
                @click="setStateToAdminInterceptor(admin)"></v-btn>
            </template>
          </v-tooltip>
        </div>
      </v-card> -->
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref ,computed} from 'vue';
import BaseSpinner from '@/components/Base/BaseSpinner.vue';
import BaseDialog from '@/components/Base/BaseDialog.vue';
import BaseAlert from '@/components/Base/BaseAlert.vue';
import BaseResultEmpty from '@/components/Base/BaseResultEmpty.vue';
import { useAlert } from '@/composables/showAlert.composable';
import { useAxiosInstance } from '@/composables/useInstance.composable';
import { AdminController } from '@/config';
import { useAxios } from '@vueuse/integrations/useAxios';
import { InternalDataTransfter } from '@/models/DTO/InternalDataTransfer';
import { ApiResult } from '@/models/DTO/ApiResult';
import { ActivityStatus } from '@/enums/ActivityStatusEnum';
import { SemesterSubmitionDateResponse } from '@/models/BACKEND-MODELS/SemesterSubmitionDateResponse';
export default defineComponent({
  components:
  {
    BaseSpinner,
    BaseDialog,
    BaseAlert,
    BaseResultEmpty
  },
  emits:['closeMobileView'],
  setup(props, context) {
    const showLoadingSpinner = ref(false);
    const {showAlert,alertTitle,typeOfAlert,closeAlert,openAlert,setTypeOfAlert} = useAlert();
    const {setBackendInstanceAuth} = useAxiosInstance();
    const semesterActivity = ref<ActivityStatus>();
    const semesterIsActive = ref();
    const AdminLabel = computed(() => {
      if(semesterIsActive.value)
      {
        return ``
        //return `Τρέχων περίοδος ${semesterPeriodString.value}, κατάστη : ΕΝΕΡΓΗ`
      }
      //return `Τρέχων περίοδος ${semesterPeriodString.value}, κατάστη : ΑΝΕΝΕΡΓΗ`
      return ``
    });
    const MakeInitialPeriodCalculation = async ():Promise<InternalDataTransfter<boolean>> => {
     
      const getInitialPeriodCalculationApiCall = await useAxios(
        AdminController + "initial-period-calculation",
        {
          method: "GET",
        },
        setBackendInstanceAuth()
      );
      if(getInitialPeriodCalculationApiCall.isFinished){
        var getInitialPeriodCalculationApiResponse : ApiResult<SemesterSubmitionDateResponse> = getInitialPeriodCalculationApiCall.data.value;
          if(!getInitialPeriodCalculationApiResponse || !getInitialPeriodCalculationApiResponse.Status || !getInitialPeriodCalculationApiResponse.Data)
          {
            return {Status: false, Data: false, Error: "API Error"};
          }
          console.log(getInitialPeriodCalculationApiResponse.Data);
          semesterIsActive.value = getInitialPeriodCalculationApiResponse.Data.IsActive;
          semesterActivity.value = getInitialPeriodCalculationApiResponse.Data.Active;
          return {Status: true, Data: true};
      }
      return {Status: false, Data: false, Error: "Request didn't finish"};
    }
    onMounted(async () => {
      context.emit("closeMobileView", true);
      closeAlert(1000);
      showLoadingSpinner.value = true;
      var initialPeriodCalculationIDT = await MakeInitialPeriodCalculation();
      showLoadingSpinner.value = false;
      if(!initialPeriodCalculationIDT.Status)
      {
        closeAlert(1000);
        setTypeOfAlert('error');
        openAlert("Αποτυχία αλλαγής κατάστασης διαχειριστή");
        await delay(1500);
        return;
      }
    });
    const delay = async (time: number) => {
      return new Promise((resolve) => setTimeout(resolve, time));
    };
    return {showLoadingSpinner,showAlert,alertTitle,typeOfAlert,AdminLabel}
  }

});
</script>


<style scoped>
.parent {
  min-width: 320px;
  padding: 0;
  margin: 1.5rem 1.5rem;
  display: flex;
  flex-direction: column;
  justify-content: end;
}

.admin-label {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1 0 auto;
  width: 100%;
  height: 2rem;
  text-transform: uppercase;
  min-width: 320px;
  font-size: 0.9rem;
  font-weight: 450;
  background-color: #dae3f7;
  word-wrap: break-word;
  word-break: break-word;
  text-align: center;
  padding: 1.2rem;
  margin-bottom: 1rem;
}

.single-admin_card {
  padding: 0.5rem;
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
}

.single-admin_card--item {
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
}

.single-admin_card--item > span {
  color: red;
  word-wrap: break-word;
  word-break: break-word;
  text-align: center;
  font-size: 1.2rem;
  hyphens: auto;
  font-weight: 400;
}

.delete-button {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  color: #f44336;
  background: #f7f7f7;
  border: 1px solid #f44336;
  margin: 0 !important;
  width: fit-content;
  padding: 0.6em !important;
  font-size: 0.8rem !important;
  border-radius: 2rem !important;
  height: 2rem !important;
}

.add-new__admin--container {
  display: flex;
  flex-direction: row;
  width: 100%;
  justify-content: center;
  align-items: center;
  margin: 1rem 0;
}

@media (min-width: 769px) {
  .admin-label {
    margin-top: 2rem;
    margin-bottom: 2rem;
    height: 3rem;
    font-size: 1rem;
    background-color: #dae3f7;
  }
}

@media (min-width: 1025px) {
}
</style>
