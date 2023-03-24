<template>
  <base-spinner :show="showLoadingSpinner"></base-spinner>
  <base-alert :show="showAlert" :alert-type-prop="typeOfAlert" :title="alertTitle"></base-alert>
  <div v-if="!showLoadingSpinner" class="options-parent">
    <v-card elevation="3" class="admin-label">{{ `Τρεχων Περιοδος` }}</v-card>
    <div v-if="!currentlyActiveSsds.length">
      <base-result-empty :show="!currentlyActiveSsds.length"
                         :title="'Δεν βρέθηκαν περίοδοι'"
                         :description="'Δεν βρέθηκε καταχωρημένη κάποια περίοδος. Προσθέστε μια καινούργια περιόδο παρακάτω'"
      ></base-result-empty>
    </div>
    <div v-if="currentlyActiveSsds.length">
      <!--      <v-card elevation="3" class="admin-label">Διαχειριστες εφαρμογης</v-card>-->
      <v-card
        elevation="5"
        class="single-option_card"
        v-for="active of currentlyActiveSsds"
        :key="active.Id"
      >
        <div class="single-option_card--item">
          <span>{{ SemesterStringConverter(active) }}</span>
          <v-tooltip :text="'Διαγραφή περιόδου'" location="bottom">
            <template v-slot:activator="{ props }">
              <v-btn
                v-bind="props"
                class="delete-button"
                icon="mdi-trash-can"
                size="x-small"
              ></v-btn>
            </template>
          </v-tooltip>
        </div>
      </v-card>
    </div>
    <div v-if="!newPeriodContext" class="add-new__period-container--button">
      <v-btn color="green"
             elevation="4"
             type="button"
             @click="generateNewPeriod"
      >
        <svg
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
        Προσθηκη νεας περιοδου
      </v-btn>
    </div>
    <div v-if="newPeriodContext" class="add-new__period-container--form">
      <v-card elevation="3" class="admin-label">{{ `ΝΕΑ ΠΕΡΙΟΔΟΣ : ${SemesterStringConverter(newPeriodContext)}` }}
      </v-card>
      <div class="dates--container">
        <div class="from-date--container">
          <label for="">Ημερομηνία έναρξης περιόδου:</label>
          <date-picker
            :class="{ 'error-border': errorOnFromTime }"
            disable-time-range-validation
            v-model="fromTime"
            placeholder="Απο"
            required
            @update:model-value="isFromTimeEmpty"

          ></date-picker>
        </div>
        <div class="to-date--container">
          <label for="">Ημερομηνία λήξης περιόδου:</label>
          <date-picker
            :class="{ 'error-border': errorOnToTime }"
            disable-time-range-validation
            v-model="toTime"
            placeholder="Εως"
            required
            @update:model-value="isToTimeEmpty"
          ></date-picker>
        </div>
      </div>
      <div class="calculate-new-period__container">
        <v-btn color="#156ed3"
               class="calculate-new-period__button"
               elevation="4"
               type="button"
               @click="generateNewPeriod"
        >
          Υπολογισμος Προτεραιοτητων
        </v-btn>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent, onMounted, ref} from 'vue';
import BaseSpinner from '@/components/Base/BaseSpinner.vue';
import BaseDialog from '@/components/Base/BaseDialog.vue';
import BaseAlert from '@/components/Base/BaseAlert.vue';
import BaseResultEmpty from '@/components/Base/BaseResultEmpty.vue';
import {useAlert} from '@/composables/showAlert.composable';
import {useAxiosInstance} from '@/composables/useInstance.composable';
import {AdminController} from '@/config';
import {useAxios} from '@vueuse/integrations/useAxios';
import {InternalDataTransfter} from '@/models/DTO/InternalDataTransfer';
import {ApiResult} from '@/models/DTO/ApiResult';
import {SemesterSubmitionDateResponse} from '@/models/BACKEND-MODELS/SemesterSubmitionDateResponse';
import {SemesterSubmitionDateOverviewResponse} from "@/models/BACKEND-MODELS/SemesterSubmitionDateOverviewResponse";
import {PeriodicityEnum} from "@/enums/PeriodicityEnum";
import DatePicker from "@vuepic/vue-datepicker";
import {computedEager} from "@vueuse/core";

export default defineComponent({
  components:
    {
      DatePicker,
      BaseSpinner,
      BaseDialog,
      BaseAlert,
      BaseResultEmpty
    },
  emits: ['closeMobileView'],
  setup(props, context) {
    const showLoadingSpinner = ref(false);
    const {showAlert, alertTitle, typeOfAlert, closeAlert, openAlert, setTypeOfAlert} = useAlert();
    const {setBackendInstanceAuth} = useAxiosInstance();
    const currentlyActiveSsds = ref(new Array<SemesterSubmitionDateResponse>());
    const newPeriodContext = ref<SemesterSubmitionDateResponse>();
    const fromTime = ref();
    const toTime = ref();
    const errorOnFromTime =ref(false);
    const errorOnToTime =ref(false);
    const isFromTimeEmpty = computedEager(()=>{
      if(!fromTime.value){
        errorOnFromTime.value = true;
        return;
      }
      errorOnFromTime.value = false;
      return;
    });
    const isToTimeEmpty = computedEager(()=>{
      if(!toTime.value){
        errorOnToTime.value = true;
        return;
      }
      errorOnToTime.value = false;
      return;
    });
    const FetchCurrentlyActiveSsd = async (): Promise<InternalDataTransfter<boolean>> => {
      const currentlyActiveSsdCall = await useAxios(
        AdminController + "fetch-currently-active-ssd",
        {
          method: "GET",
        },
        setBackendInstanceAuth()
      );
      if (currentlyActiveSsdCall.isFinished) {
        const currentlyActiveSsdResponse: ApiResult<SemesterSubmitionDateOverviewResponse> = currentlyActiveSsdCall.data.value;
        if (!currentlyActiveSsdResponse || !currentlyActiveSsdResponse.Status || !currentlyActiveSsdResponse.Data) {
          return {Status: false, Data: false, Error: "API Error"};
        }
        console.log(currentlyActiveSsdResponse.Data);
        currentlyActiveSsds.value = currentlyActiveSsdResponse.Data.SemesterSubmitionDates;
        return {Status: true, Data: true};
      }
      return {Status: false, Data: false, Error: "Request didn't finish"};
    }
    const GenerateTheNewPeriodCall = async (): Promise<InternalDataTransfter<boolean>> => {
      const generateNewPeriodContext = await useAxios(
        AdminController + "generate-new-period",
        {
          method: "POST",
        },
        setBackendInstanceAuth()
      );
      if (generateNewPeriodContext.isFinished) {
        const newGeneratedPeriodContext: ApiResult<SemesterSubmitionDateResponse> = generateNewPeriodContext.data.value;
        if (!newGeneratedPeriodContext || !newGeneratedPeriodContext.Status || !newGeneratedPeriodContext.Data) {
          return {Status: false, Data: false, Error: "API Call Error"};
        }
        newPeriodContext.value = newGeneratedPeriodContext.Data;
        return {Status: true, Data: true}
      }
      return {Status: false, Data: false, Error: "Request didn't finish"};
    }
    const generateNewPeriod = async () => {
      const generateTheNewPeriodCallIDT = await GenerateTheNewPeriodCall();
      if (!generateTheNewPeriodCallIDT.Status) {
        closeAlert(1000);
        setTypeOfAlert('error');
        openAlert("Αποτυχία δημιουργίας νέας περιόδου");
        await delay(1500);
        closeAlert(1000);
      }
    }
    onMounted(async () => {
      context.emit("closeMobileView", true);
      closeAlert(1000);
      showLoadingSpinner.value = true;
      const currentlyActiveSsdsIDT = await FetchCurrentlyActiveSsd();
      showLoadingSpinner.value = false;
      if (!currentlyActiveSsdsIDT.Status) {
        closeAlert(1000);
        setTypeOfAlert('error');
        openAlert("Αποτυχία ανάκτησης περιόδων");
        await delay(1500);
        closeAlert(1000);
        return;
      }
    });
    const SemesterStringConverter = (ssd: SemesterSubmitionDateResponse) => {
      if (!ssd)
        return '';
      if (ssd.Semester.includes('EARINO') && ssd.Periodicity === PeriodicityEnum.EARINO) {
        return ssd.Semester.replace('EARINO', 'ΕΑΡΙΝΟ');
      }
      if (ssd.Semester.includes('XEIMERINO') && ssd.Periodicity === PeriodicityEnum.XEIMERINO) {
        return ssd.Semester.replace('XEIMERINO', 'ΧΕΙΜΕΡΙΝΟ');
      }
      return "";
    }
    const delay = async (time: number) => {
      return new Promise((resolve) => setTimeout(resolve, time));
    };
    return {
      showLoadingSpinner,
      showAlert,
      alertTitle,
      typeOfAlert,
      currentlyActiveSsds,
      newPeriodContext,
      SemesterStringConverter,
      generateNewPeriod,
      fromTime,
      toTime,
      errorOnFromTime,
      errorOnToTime,
      isFromTimeEmpty,
      isToTimeEmpty
    }
  }

});
</script>


<style scoped>
.options-parent {
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

:deep(.parent) {
  margin: 0;
}

.single-option_card {
  padding: 0.5rem;
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
}

.single-option_card--item {
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
}

.single-option_card--item > span {
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

.add-new__period-container--button {
  display: flex;
  flex-direction: row;
  width: 100%;
  justify-content: center;
  align-items: center;
  margin: 1rem 0;
}

.add-new__period-container--form {
  display: flex;
  flex-direction: column;
  width: 100%;
  justify-content: center;
  align-items: center;
  margin: 1rem 0;
}

.dates--container {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  width: 100%;
  gap: 1rem;
  margin: 1rem 1rem;
}

.dates--container > .from-date--container, .dates--container > .to-date--container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: stretch;
  width: 100%;
  text-align: center;
  gap: 0.5rem;
}
.calculate-new-period__container{
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 100%;
}
.calculate-new-period__button{
  background: #0a369d;
  color: white;
}
.error-border {
  border: 1px solid #ff4545;
  border-radius: 5px;
}
@media (min-width: 769px) {
  .admin-label {
    height: 3rem;
    font-size: 1rem;
    background-color: #dae3f7;
  }

  .dates--container {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    gap: 3rem;
    width: 100%;
  }

  .dates--container > .from-date--container, .dates--container > .to-date--container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: stretch;
    width: 100%;
    text-align: center;
    gap: 0.5rem;
  }
}

@media (min-width: 1025px) {
}
</style>
