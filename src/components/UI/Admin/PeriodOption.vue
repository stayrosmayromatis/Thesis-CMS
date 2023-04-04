<template>
  <div class="options-parent">
    <base-spinner :show="showLoadingSpinner"></base-spinner>
    <base-alert :show="showAlert" :alert-type-prop="typeOfAlert" :title="alertTitle"></base-alert>
    <div>
      <base-dialog :show="showBaseDialog" :inner-description="baseDialogDescription" :inner-title="baseDialogTitle"
        :routeChangeAuthorizer="true" @close-modal="showBaseDialog = false"></base-dialog>
    </div>
    <div v-if="!showLoadingSpinner">
      <v-card elevation="3" class="admin-label">{{ `Τρεχων Περιοδος` }}</v-card>
      <div v-if="!currentlyActiveSsds.length">
        <base-result-empty :show="!currentlyActiveSsds.length" :title="'Δεν βρέθηκαν περίοδοι'"
          :description="'Δεν βρέθηκε καταχωρημένη κάποια περίοδος. Προσθέστε μια καινούργια περιόδο παρακάτω'"></base-result-empty>
      </div>
      <div v-if="currentlyActiveSsds.length">
        <v-card elevation="5" class="single-option_card" v-for="active of currentlyActiveSsds" :key="active.SsdId">
          <div class="single-option_card--item">
            <span>{{ SemesterStringConverter(active) }}</span>
            <!-- :class="{
                    'gray-out-card-chip-semester':(userType === 2 && lab.CanSubmit === false) || (userType === 1 && lab.IsAssistant === true) ,
                  }" -->
            <div class="chip-separator">
              <v-chip class="chip-activation" :class="{
                'chip-is-active': active.Active === 2,
                'chip-is-inactive': active.Active === 1,
                'chip-is-up-to-activation': active.Active === 3
              }" size="medium">
                <div>
                  {{ 'THIS IS A TEST' }}
                </div>
              </v-chip>
              <v-tooltip :text="'Διαγραφή περιόδου'" location="bottom">
                <template v-slot:activator="{ props }">
                  <!-- <v-btn v-bind="props" class="delete-button" icon="mdi-trash-can" size="x-small"></v-btn> -->
                  <v-btn v-bind="props" color="error" variant="elevated" class="delete-button"
                    @click="deletePastSubmissions">
                    Καταργηση
                  </v-btn>
                </template>
              </v-tooltip>
            </div>
          </div>
        </v-card>
      </div>
      <div v-if="!newPeriodContext" class="add-new__period-container--button">
        <v-btn color="green" elevation="4" type="button" @click="generateNewPeriod">
          <svg width="30" height="30" clip-rule="evenodd" fill-rule="evenodd" stroke-linejoin="round"
            stroke-miterlimit="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path
              d="m21 3.998c0-.478-.379-1-1-1h-16c-.62 0-1 .519-1 1v16c0 .621.52 1 1 1h16c.478 0 1-.379 1-1zm-16.5.5h15v15h-15zm6.75 6.752h-3.5c-.414 0-.75.336-.75.75s.336.75.75.75h3.5v3.5c0 .414.336.75.75.75s.75-.336.75-.75v-3.5h3.5c.414 0 .75-.336.75-.75s-.336-.75-.75-.75h-3.5v-3.5c0-.414-.336-.75-.75-.75s-.75.336-.75.75z"
              fill-rule="nonzero" />
          </svg>
          Προσθηκη νεας περιοδου
        </v-btn>
      </div>
      <div v-if="newPeriodContext" class="add-new__period-container--form">
        <v-card elevation="3" class="admin-label">{{ `ΝΕΑ ΠΕΡΙΟΔΟΣ : ${SemesterStringConverter(newPeriodContext)}` }}
        </v-card>
        <v-card elevation="3" class="dates--card">
          <div class="dates--container">
            <div class="from-date--container">
              <label for="">Ημερομηνία έναρξης περιόδου:</label>
              <date-picker :class="{ 'error-border': errorOnFromTime }" v-model="fromTime" disable-time-range-validation
                @cleared="determine" @open="determine" :start-date="tomorrow" :min-date="tomorrow" placeholder="Από"
                prevent-min-max-navigation show-now-button position="center" select-text="Οκ" cancel-text="Άκυρο"
                now-button-label="Τώρα" :enable-time-picker="false" :month-change-on-arrows="true" :day-names="dayNames"
                :offset="20" @update:model-value="isFromTimeEmpty" no-today :month-change-on-scroll="'inverse'"
                :year-range="yearRange" :format="dateFormater"></date-picker>
            </div>
            <div class="to-date--container">
              <label for="">Ημερομηνία λήξης περιόδου:</label>
              <date-picker :class="{ 'error-border': errorOnToTime }" disable-time-range-validation v-model="toTime"
                placeholder="Έως" show-now-button prevent-min-max-navigation :min-date="oneWeekAfterTomorrow"
                :start-date="oneWeekAfterTomorrow" position="center" cancel-text="Άκυρο" now-button-label="Τώρα"
                :day-names="dayNames" :offset="20" :month-change-on-arrows="true" :month-change-on-scroll="'inverse'"
                @cleared="determine" @open="determine" :year-range="yearRange" :enable-time-picker="false" no-today
                :format="dateFormater" @update:model-value="isToTimeEmpty"></date-picker>
            </div>
          </div>
          <div class="calculate-new-period__container">
            <v-btn :disabled="!fromTime || !toTime" color="#156ed3" class="calculate-new-period__button" elevation="4"
              type="button" @click="calculatePriorities">
              Υπολογισμος Προτεραιοτητων
            </v-btn>
          </div>
        </v-card>
      </div>
      <div v-if="calculatedPriorites">
        <v-card elevation="3" class="admin-label">{{ `Ημερομηνιακες Ομαδες Προτεραιοτητας` }}
        </v-card>
        <v-card elevation="3" class="calculated_priorities--card">
          <div class="calculated_priorities--container">
            <div class="calculated_priorities--container_start-end">
              <div class="calculated_priorities--container_start">
                <label>Ημερομηνία έναρξης: </label>
                <label>{{ calculatedPriorites.From.Formatted }}</label>
              </div>
              <div class="calculated_priorities--container_end">
                <label>Ημερομηνία λήξης: </label>
                <label>{{ calculatedPriorites.To.Formatted }}</label>
              </div>
            </div>
            <div class="calculated_priorities--container_highest">
              <label>Μέγιστη Προτεραιοτητα </label>
              <div class="calculated_priorities--container_highest-outer">
                <div class="calculated_priorities--container_highest-from">
                  <label>Απο: {{ calculatedPriorites.HighestPriorityDate.Formatted }}</label>
                </div>
                <div class="calculated_priorities--container_highest-to">
                  <label>Έως: {{ calculatedPriorites.To.Formatted }}</label>
                </div>
              </div>
            </div>
            <div class="calculated_priorities--container_moderate">
              <label>Μέτρια Προτεραιοτητα </label>
              <div class="calculated_priorities--container_moderate-outer">
                <div class="calculated_priorities--container_moderate-from">
                  <label>Απο: {{ calculatedPriorites.ModeratePriorityDate.Formatted }}</label>
                </div>
                <div class="calculated_priorities--container_moderate-to">
                  <label>Έως: {{ calculatedPriorites.To.Formatted }}</label>
                </div>
              </div>
            </div>
            <div class="calculated_priorities--container_lowest">
              <label>Χαμηλότερη Προτεραιοτητα</label>
              <div class="calculated_priorities--container_lowest-outer">
                <div class="calculated_priorities--container_lowest-from">
                  <label>Απο: {{ calculatedPriorites.LowestPriorityDate.Formatted }}</label>
                </div>
                <div class="calculated_priorities--container_lowest-to">
                  <label>Έως: {{ calculatedPriorites.To.Formatted }}</label>
                </div>
              </div>
            </div>
          </div>
          <v-btn :disabled="!fromTime || !toTime" color="green" class="calculate-new-period__button" elevation="4"
            type="button" @click="initiateSubmissionPeriod">
            επικυρωση περιοδου
          </v-btn>
        </v-card>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref, toRefs } from 'vue';
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
import { SemesterSubmitionDateResponse } from '@/models/BACKEND-MODELS/SemesterSubmitionDateResponse';
import { SemesterSubmitionDateOverviewResponse } from "@/models/BACKEND-MODELS/SemesterSubmitionDateOverviewResponse";
import { PeriodicityEnum } from "@/enums/PeriodicityEnum";
import { GeneratedPrioritiesResponse } from '@/models/BACKEND-MODELS/GeneratedPrioritiesResponse';
import { SubmissionPeriodRequest } from '@/models/BACKEND-MODELS/SubmissionPeriodRequest';
import { confirm } from "@/composables/dialog.composable";
import { useTimeObjectExtensions } from '@/composables/useTimeObjectExtensions.composable';
export default defineComponent({
  components:
  {
    BaseSpinner,
    BaseDialog,
    BaseAlert,
    BaseResultEmpty
  },
  emits: ['closeMobileView'],
  setup(props, context) {
    const showLoadingSpinner = ref(false);
    const { showAlert, alertTitle, typeOfAlert, closeAlert, openAlert, setTypeOfAlert } = useAlert();
    const { setBackendInstanceAuth } = useAxiosInstance();
    const { scrollToTop } = useTimeObjectExtensions();
    const currentlyActiveSsds = ref(new Array<SemesterSubmitionDateResponse>());
    const newPeriodContext = ref<SemesterSubmitionDateResponse>();
    const fromTime = ref(new Date());
    const toTime = ref<Date>();
    const errorOnFromTime = ref(false);
    const errorOnToTime = ref(false);
    let tomorrow = new Date(new Date().setDate(new Date().getDate() + 1));
    let oneWeekAfterTomorrow = new Date(new Date().setDate(tomorrow.getDate() + 7));
    const dayNames = ['Δε', 'Τρ', 'Τε', 'Πε', 'Πα', 'Σα', 'Κυ']
    const yearRange: Array<number> = [new Date().getFullYear(), new Date().getFullYear() + 1];
    const calculatedPriorites = ref<GeneratedPrioritiesResponse>();
    const showBaseDialog = ref(false);
    const baseDialogTitle = ref("ΠΡΟΕΙΔΟΠΟΙΗΣΗ");
    const baseDialogDescription = ref("");
    onMounted(async () => {
      context.emit("closeMobileView", true);
      fromTime.value = tomorrow;
      toTime.value = oneWeekAfterTomorrow;
      closeAlert(1000);
      showLoadingSpinner.value = true;
      const currentlyActiveSsdsIDT = await FetchCurrentlyActiveSsd();
      showLoadingSpinner.value = false;
      if (!currentlyActiveSsdsIDT.Status) {
        closeAlert(1000);
        setTypeOfAlert('error');
        openAlert("Αποτυχία ανάκτησης περιόδων");
        scrollToTop();
        await delay(1500);
        closeAlert(1000);
        return;
      }
    });
    const isFromTimeEmpty = () => {
      if (!fromTime.value) {
        errorOnFromTime.value = true;
        return;
      }
      errorOnFromTime.value = false;
    };
    const isToTimeEmpty = () => {
      if (!toTime.value) {
        errorOnToTime.value = true;
        return;
      }
      errorOnToTime.value = false;
    };
    const determine = () => {
      if (calculatedPriorites.value) {
        calculatedPriorites.value = undefined;
      }
    };
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
          return { Status: false, Data: false, Error: "API Error" };
        }
        currentlyActiveSsds.value = currentlyActiveSsdResponse.Data.SemesterSubmitionDates;
        return { Status: true, Data: true };
      }
      return { Status: false, Data: false, Error: "Request didn't finish" };
    };
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
          return { Status: false, Data: false, Error: "API Call Error" };
        }
        newPeriodContext.value = newGeneratedPeriodContext.Data;
        console.log("Paok");
        console.log(newPeriodContext.value);
        return { Status: true, Data: true }
      }
      return { Status: false, Data: false, Error: "Request didn't finish" };
    };
    const CalculateThePrioritiesCall = async (): Promise<InternalDataTransfter<boolean>> => {
      if (!fromTime.value || !toTime.value)
        return { Status: false, Data: false, Error: "Invalid Payload" };
      const payload = {
        From: fromTime.value,
        To: toTime.value
      }
      const calculateThePrioritiesCall = await useAxios(
        AdminController + "calculate-new-ssd-by-date",
        {
          method: "POST",
          data: payload
        },
        setBackendInstanceAuth()
      );
      if (calculateThePrioritiesCall.isFinished) {
        const calculateThePrioritiesCallResponse: ApiResult<GeneratedPrioritiesResponse> = calculateThePrioritiesCall.data.value;
        if (!calculateThePrioritiesCallResponse.Status || !calculateThePrioritiesCallResponse.Data) {
          return { Status: false, Data: false, Error: calculateThePrioritiesCallResponse.Error };
        }
        calculatedPriorites.value = calculateThePrioritiesCallResponse.Data
        return { Status: true, Data: true };
      }
      return { Status: false, Data: false, Error: "Request didn't finish" };
    };
    const DeletePastSubmissionCall = async (): Promise<InternalDataTransfter<boolean>> => {
      const deletePastSubmissionsCall = await useAxios(
        AdminController + "delete-past-submission-periods",
        {
          method: "POST",
        },
        setBackendInstanceAuth()
      );
      if (deletePastSubmissionsCall.isFinished) {
        const deletePastSubmissionsResponse: ApiResult<boolean> = deletePastSubmissionsCall.data.value;
        if (!deletePastSubmissionsResponse || !deletePastSubmissionsResponse.Status || !deletePastSubmissionsResponse.Data)
          return { Status: false, Data: false, Error: deletePastSubmissionsResponse?.Error };
        return { Status: true, Data: true };
      }
      return { Status: false, Data: false, Error: "Request not finished" };
    }
    const deletePastSubmissions = async () => {
      showBaseDialog.value = true;
      baseDialogDescription.value = `Με την <span style="color:#ff4545;">κατάργηση</span> της τρέχων περιόδου,
                                    <span style="color:#ff4545;">διαγράφονται όλες οι εγγραφές που συσχετίζονται</span>,
                                    όπως οι προτεραιότητες που είναι ενεργές καθώς και οι δηλώσεις των φοιτητών.
                                    Θέλετε να προχωρήσετε σε <span style="color:#ff4545;">καταργήσετε</span> την τρέχων περίοδο;`;
      if (await confirm()) {
        showBaseDialog.value = false;
        showLoadingSpinner.value = true;
        const deletePastSubmissionsIDT = await DeletePastSubmissionCall();
        if (!deletePastSubmissionsIDT.Status) {
          showLoadingSpinner.value = false;
          closeAlert(1000);
          setTypeOfAlert('error');
          openAlert("Αποτυχία διαγραφής τρέχουσας περιόδου");
          scrollToTop();
          await delay(1500);
          closeAlert(1000);
          return;
        }
        const currentlyActiveSsdsIDT = await FetchCurrentlyActiveSsd();
        if (!currentlyActiveSsdsIDT.Status) {
          showLoadingSpinner.value = false;
          closeAlert(1000);
          setTypeOfAlert('error');
          openAlert("Αποτυχία ανάκτησης περιόδων");
          scrollToTop();
          await delay(1500);
          closeAlert(1000);
          return;
        }
        showLoadingSpinner.value = false;
        closeAlert(1000);
        setTypeOfAlert('success');
        openAlert("Επιτυχία διαγραφής παλαιάς τρέχουσας περιόδου");
        scrollToTop();
        await delay(1500);
        closeAlert(1000);
        return;
      }
      showBaseDialog.value = false;
    }
    const generateNewPeriod = async () => {
      showBaseDialog.value = true;
      baseDialogDescription.value = `Με την επικύρσωη <span style="color:green;">προσθήκης Νέας Περιόδου </span>, 
                                                      <span style="color:#ff4545;">διαγράφονται όλες οι προηγούμενες περίοδοι</span>,
                                                      καθώς και οι <span style="color:#ff4545;">προηγούμενες δηλώσεις των φοιτητών</span>. 
                                                      Η διαδικασία είναι <span style="color:#ff4545;">μη αναστρέψιμη</span>.
                                                      Θέλετε να προσωρήσετε σε <span style="color:green;">έναρξη Νέας Περιόδου;</span>`;
      if (await confirm()) {
        showBaseDialog.value = false;
        console.log("empaaa");
        showLoadingSpinner.value = true;
        const generateTheNewPeriodCallIDT = await GenerateTheNewPeriodCall();
        if (!generateTheNewPeriodCallIDT.Status) {
          showLoadingSpinner.value = false;
          closeAlert(1000);
          setTypeOfAlert('error');
          openAlert("Αποτυχία δημιουργίας νέας περιόδου");
          scrollToTop();
          await delay(1500);
          closeAlert(1000);
          return;
        }
        const currentlyActiveSsdsIDT = await FetchCurrentlyActiveSsd();
        if (!currentlyActiveSsdsIDT.Status) {
          showLoadingSpinner.value = false;
          closeAlert(1000);
          setTypeOfAlert('error');
          openAlert("Αποτυχία ανάκτησης περιόδων");
          scrollToTop();
          await delay(1500);
          closeAlert(1000);
          return;
        }
        showLoadingSpinner.value = false;
        closeAlert(1000);
        setTypeOfAlert('success');
        openAlert("Επιτυχία δημιουργίας νέας περιόδου");
        scrollToTop();
        await delay(1500);
        closeAlert(1000);
        return;
      }
      showBaseDialog.value = false;
    };
    const calculatePriorities = async () => {
      showLoadingSpinner.value = true;
      const calculatePrioritiesIDT = await CalculateThePrioritiesCall();
      showLoadingSpinner.value = false;
      if (!calculatePrioritiesIDT.Status) {
        closeAlert(1000);
        setTypeOfAlert('error');
        openAlert("Αποτυχία υπολογισμού προτεραιοτήτων");
        scrollToTop();
        await delay(1500);
        closeAlert(1000);
        return;
      }
      closeAlert(1000);
      setTypeOfAlert('success');
      openAlert("Επιτυχία υπολογισμού προτεραιοτήτων");
      scrollToTop();
      await delay(1500);
      closeAlert(1000);
    };
    const initiateSubmissionPeriod = async (): Promise<void> => {
      showBaseDialog.value = true;
      baseDialogDescription.value = `Ειστε έτοιμοι να ξεκινήσετε την <span style="color:green;"> περίοδο </span>, 
                                      Παρακαλώ <span style="color:green;">επαληθεύστε</span> τις επιλογές σας,
                                      Έχετε την επιλογή της <span style="color:green;">διόρθωσης πριν την επικύρωση</span>.
                                      Θέλετε να προσωρήσετε σε <span style="color:green;">επικύρωση της  Νέας Περιόδου;</span>`;
      if (await confirm()) {
        showBaseDialog.value = false;
        showLoadingSpinner.value = true;
        const initiateSubResponse = await InitiateSubmissionPeriodCall();
        if (!initiateSubResponse.Status) {
          showBaseDialog.value = false;
          closeAlert(1000);
          setTypeOfAlert('error');
          openAlert("Αποτυχία εκκίνσης νέας περιόδου");
          scrollToTop();
          await delay(1500);
          closeAlert(1000);
          return;
        }
        const currentlyActiveSsdsIDT = await FetchCurrentlyActiveSsd();
        if (!currentlyActiveSsdsIDT.Status) {
          showLoadingSpinner.value = false;
          closeAlert(1000);
          setTypeOfAlert('error');
          openAlert("Αποτυχία ανάκτησης περιόδων");
          scrollToTop();
          await delay(1500);
          closeAlert(1000);
          return;
        }
        showLoadingSpinner.value = false;
        newPeriodContext.value = undefined;
        calculatedPriorites.value = undefined;
        closeAlert(1000);
        setTypeOfAlert('success');
        openAlert("Επιτυχία, η περίοδος ξεκινάει αυτοματοποιημένα");
        scrollToTop();
        await delay(1500);
        closeAlert(1000);
      }
      showBaseDialog.value = false;
    }
    const InitiateSubmissionPeriodCall = async (): Promise<InternalDataTransfter<boolean>> => {
      if (!newPeriodContext.value?.SsdId || !fromTime.value || !toTime.value)
        return { Status: false, Data: false, Error: "Invalid Payload" };

      const submissionPeriodRequest: SubmissionPeriodRequest = {
        SsdId: newPeriodContext.value!.SsdId,
        From: fromTime.value!,
        To: toTime.value!
      };
      const initiateSubmissionsCall = await useAxios(
        AdminController + "initiate-submission-period",
        {
          method: "POST",
          data: submissionPeriodRequest
        },
        setBackendInstanceAuth()
      );
      if (initiateSubmissionsCall.isFinished) {
        const initiateSubmissionsResponse: ApiResult<boolean> = initiateSubmissionsCall.data.value;
        if (!initiateSubmissionsResponse || !initiateSubmissionsResponse.Status)
          return { Status: false, Data: false, Error: initiateSubmissionsResponse?.Error };
        return { Status: true, Data: true };
      }
      return { Status: false, Data: false, Error: "Request didn't finish" };
    }
    const SemesterStringConverter = (ssd: SemesterSubmitionDateResponse) => {
      if (!ssd)
        return '';
      if (ssd.Semester.includes('EARINO') && ssd.Periodicity === PeriodicityEnum.EARINO) {
        return ssd.Semester.replace('EARINO', 'ΕΑΡΙΝΟ').replace('_',"-").replaceAll('_',' ');
      }
      if (ssd.Semester.includes('XEIMERINO') && ssd.Periodicity === PeriodicityEnum.XEIMERINO) {
        return ssd.Semester.replace('XEIMERINO', 'ΧΕΙΜΕΡΙΝΟ').replace('_',"-").replaceAll('_',' ');
      }
      return "";
    }
    const delay = async (time: number) => {
      return new Promise((resolve) => setTimeout(resolve, time));
    };
    const dateFormater = (date: Date) => {
      const day = date.getUTCDate();
      const month = date.getMonth() + 1;
      const year = date.getUTCFullYear();
      return `${day}-${month}-${year}`;
    }
    return {
      showBaseDialog,
      baseDialogTitle,
      baseDialogDescription,
      showLoadingSpinner,
      showAlert,
      dateFormater,
      yearRange,
      dayNames,
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
      isToTimeEmpty,
      calculatePriorities,
      calculatedPriorites,
      tomorrow,
      oneWeekAfterTomorrow,
      initiateSubmissionPeriod,
      determine,
      deletePastSubmissions
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
  width: inherit;
  justify-content: flex-start;
  align-items: inherit;
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
  padding: 1.2rem 0;
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
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0.5rem 0.5rem;
}

.single-option_card--item>span {
  color: black;
  word-wrap: break-word;
  word-break: break-word;
  text-align: center;
  font-size: 1.3rem;
  hyphens: auto;
  font-weight: 400;
  padding: 0.5rem 0.5rem;
}

.delete-button {
  background: #c91616 !important;
  margin: 0 !important;
  height: 2.4rem !important;
  font-size: 1rem;
  font-weight: 400;
  padding: 1rem 1rem;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  border-radius: 16px;
}

/* {
    width: 33%;
    margin-top: 0.5rem;
    margin-bottom: 0.5rem;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    height: 3rem;
  } */

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
}

.dates--container>.from-date--container,
.dates--container>.to-date--container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: stretch;
  width: 100%;
  text-align: center;
  gap: 0.5rem;
}

.calculated_priorities--card {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1rem 1rem;
}

.calculate-new-period__container {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 100%;
  padding: 1rem 0;
}

.calculated_priorities--container {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.calculated_priorities--container_start-end {
  display: flex;
  flex-direction: row;
  gap: 1rem;
  justify-content: center;
  align-items: center;
  margin-bottom: 0.5rem;
}

.calculated_priorities--container_lowest,
.calculated_priorities--container_highest,
.calculated_priorities--container_moderate {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  justify-content: center;
  align-items: center;
  padding: 0.5rem 0.5rem;
  outline: 1px solid #dae3f7;
  margin-bottom: 0.5rem;
}

.calculated_priorities--container_lowest>label,
.calculated_priorities--container_highest>label,
.calculated_priorities--container_moderate>label {
  font-size: 1.1rem;
  font-weight: 500;
}

.calculated_priorities--container_start,
.calculated_priorities--container_end {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  padding: 0.5rem 0.5rem;
  outline: 1px solid #dae3f7;
}

.calculated_priorities--container_highest-outer,
.calculated_priorities--container_moderate-outer,
.calculated_priorities--container_lowest-outer {
  display: flex;
  width: 100%;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.calculated_priorities--container_highest-from,
.calculated_priorities--container_highest-to {}

.calculated_priorities--container_start>label,
.calculated_priorities--container_end>label {
  font-size: 1.1rem;
  font-weight: 500;
  text-align: center;
  word-break: break-word;
  white-space: pre-line;
}

.calculate-new-period__button {
  background: #0a369d;
  color: white;
}

.dates--card {
  width: 100%;
  flex-direction: column;
  display: flex;
  padding: 1rem 1rem;
}

.chip-activation {
  background: #f9f9f9 !important;
  border: 1px solid #0136e6;
  width: 50%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 0.2rem 1rem;
  text-align: center;
  font-size: 1rem !important;
  max-width: 50%;
}

.chip-is-active {
  background: #f9f9f9 !important;
  border: 1px solid #00c900 !important;
  color: #00c900 !important;
}

.chip-is-up-to-activation {
  background: #f9f9f9 !important;
  border: 1px solid #0136e6 !important;
  color: #0136e6 !important;
}

.chip-is-inactive {
  background: #f9f9f9 !important;
  border: 1px solid #ff4545 !important;
  color: #ff4545 !important;
}

.chip-separator {
  display: flex;
  flex-direction: column;
  width: 100%;
  flex: 1 0 auto;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;

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

  .dates--container>.from-date--container,
  .dates--container>.to-date--container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: stretch;
    width: 100%;
    text-align: center;
    gap: 0.5rem;
  }

  .calculated_priorities--container_highest-outer,
  .calculated_priorities--container_moderate-outer,
  .calculated_priorities--container_lowest-outer {
    flex-direction: row;
    gap: 1rem;
  }

  .single-option_card--item {
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }

  .chip-activation {
    background: #f9f9f9 !important;
    border: 1px solid #0136e6;
    width: fit-content;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    padding: 0.4rem 0.5rem;
    text-align: center;
    font-size: 1rem !important;
  }

  .chip-separator {
    display: flex;
    flex-direction: row;
    width: fit-content;
    flex: 1 0 auto;
    justify-content: flex-end;
    align-items: center;
    gap: 2rem;
  }
}

@media (min-width: 1025px) {}
</style>
