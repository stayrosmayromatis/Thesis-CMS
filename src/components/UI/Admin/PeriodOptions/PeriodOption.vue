<template>
  <div class="options-parent" @click="emitMobileViewClose">
    <base-spinner :show="showLoadingSpinner"></base-spinner>
    <base-dialog :show="showBaseDialog" :inner-description="baseDialogDescription" :inner-title="baseDialogTitle"
      :routeChangeAuthorizer="true" :use-timer="true" @close-modal="showBaseDialog = false"></base-dialog>
    <div v-if="!showLoadingSpinner">
      <v-card elevation="5" class="period-label "><label>{{ currentlyActiveSsds.length ? 'Περιοδος προς προσθήκη' :
        `Περιοδος` }}</label></v-card>
      <div v-if="!currentlyActiveSsds.length">
        <base-result-empty :show="!currentlyActiveSsds.length" :title="'Δεν βρέθηκε περίοδος'"
          :description="'Δεν βρέθηκε καταχωρημένη κάποια περίοδος. Προσθέστε μια καινούργια περιόδο πατώντας το παρακάτω κουμπί και ακολουθήστε τα βήματα.'"></base-result-empty>
      </div>
      <div v-if="currentlyActiveSsds.length">
        <v-card elevation="5" class="single-option_card" v-for="active of currentlyActiveSsds" :key="active.SsdId">
          <div class="single-option_card--item">
            <div class="chip-separator__left-chip">
              <v-chip class="chip-bg">
                <!-- size="large" -->
                <span>{{ semesterStringConverter(active) }}</span>
              </v-chip>
            </div>
            <div class="chip-separator">
              <v-chip class="chip-activation" :class="{
                'chip-is-inactive': active.Active === 1,
                'chip-is-active': active.Active === 2,
                'chip-is-up-to-activation': active.Active === 3
              }">
                <!-- size="large" -->
                <label>
                  {{ semesterChipLabelConverter(active) }}
                </label>
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
      <div v-if="!newPeriodContext && !currentlyActiveSsds.length" class="add-new__period-container--button_container">
        <v-btn color="green" elevation="4" type="button" @click="generateNewPeriod">
          <div class="add-new__period-container--button_item">
            <svg width="30" height="30" clip-rule="evenodd" fill-rule="evenodd" stroke-linejoin="round"
              stroke-miterlimit="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path
                d="m21 3.998c0-.478-.379-1-1-1h-16c-.62 0-1 .519-1 1v16c0 .621.52 1 1 1h16c.478 0 1-.379 1-1zm-16.5.5h15v15h-15zm6.75 6.752h-3.5c-.414 0-.75.336-.75.75s.336.75.75.75h3.5v3.5c0 .414.336.75.75.75s.75-.336.75-.75v-3.5h3.5c.414 0 .75-.336.75-.75s-.336-.75-.75-.75h-3.5v-3.5c0-.414-.336-.75-.75-.75s-.75.336-.75.75z"
                fill-rule="nonzero" />
            </svg>
            <label>
              Προσθηκη νεας περιοδου
            </label>
          </div>
        </v-btn>
      </div>
      <div v-if="newPeriodContext" class="add-new__period-container--form">
        <v-card elevation="3" class="period-label ">
          <label>
            {{ `ΝΕΑ ΠΕΡΙΟΔΟΣ : ${semesterStringConverter(newPeriodContext)}` }}
          </label>
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
        <v-card elevation="3" class="period-label ">
          <label>{{ `Ημερομηνιακες Ομαδες Προτεραιοτητας` }}</label>
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
import { defineComponent, onMounted, ref } from 'vue';
import BaseSpinner from '@/components/Base/BaseSpinner.vue';
import BaseDialog from '@/components/Base/BaseDialog.vue';
// import BaseAlert from '@/components/Base/BaseAlert.vue';
import BaseResultEmpty from '@/components/Base/BaseResultEmpty.vue';
import { useAlert } from '@/composables/showAlert.composable';
import { useAxiosInstance } from '@/composables/useInstance.composable';
import { AdminController } from '@/config';
// import { useAxios } from '@vueuse/integrations/useAxios';
import { InternalDataTransfter } from '@/models/DTO/InternalDataTransfer';
import { ApiResult } from '@/models/DTO/ApiResult';
import DatePicker from '@vuepic/vue-datepicker';
import { SemesterSubmitionDateResponse } from '@/models/BACKEND-MODELS/SemesterSubmitionDateResponse';
import { SemesterSubmitionDateOverviewResponse } from "@/models/BACKEND-MODELS/SemesterSubmitionDateOverviewResponse";
import { PeriodicityEnum } from "@/enums/PeriodicityEnum";
import { GeneratedPrioritiesResponse } from '@/models/BACKEND-MODELS/GeneratedPrioritiesResponse';
import { SubmissionPeriodRequest } from '@/models/BACKEND-MODELS/SubmissionPeriodRequest';
import { confirm } from "@/composables/dialog.composable";
import { useTimeObjectExtensions } from '@/composables/useTimeObjectExtensions.composable';
import { ActivityStatus } from '@/enums/ActivityStatusEnum';
import { usePeriod } from '@/composables/usePeriod.composable';
export default defineComponent({
  components:
  {
    BaseSpinner,
    BaseDialog,
    BaseResultEmpty,
    DatePicker
  },
  emits: ['propagateCloseMobileView'],
  setup(_, context) {
    const showLoadingSpinner = ref(false);
    const { closeAlert, openAlert, setTypeOfAlert } = useAlert();
    //const { setBackendInstanceAuth } = useAxiosInstance();
    const { MakeAPICall } = useAxiosInstance();
    const { scrollToTop } = useTimeObjectExtensions();
    const {GetPeriodState} = usePeriod();
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
      emitMobileViewClose();
      fromTime.value = tomorrow;
      toTime.value = oneWeekAfterTomorrow;
      closeAlert(1000);
      showLoadingSpinner.value = true;
      const currentlyActiveSsdsIDT = await FetchCurrentlyActiveSsd();
      showLoadingSpinner.value = false;
      if (!currentlyActiveSsdsIDT.Status) {
        closeAlert(1000);
        setTypeOfAlert('error');
        openAlert("Αποτυχία ανάκτησης περιόδου");
        scrollToTop();
        await delay(1500);
        closeAlert(1000);
        return;
      }
      newPeriodContext.value = undefined;
      calculatedPriorites.value = undefined;
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
      // const currentlyActiveSsdCall = await useAxios(
      //   AdminController + "fetch-currently-active-ssd",
      //   {
      //     method: "GET",
      //   },
      //   setBackendInstanceAuth()
      // );
      const currentlyActiveSsdResponse = await MakeAPICall<ApiResult<SemesterSubmitionDateOverviewResponse>>(AdminController,"fetch-currently-active-ssd", "GET");
      // if (currentlyActiveSsdCall.isFinished) {
      //   const currentlyActiveSsdResponse: ApiResult<SemesterSubmitionDateOverviewResponse> = currentlyActiveSsdCall.data.value;
        if (!currentlyActiveSsdResponse || !currentlyActiveSsdResponse.Status || !currentlyActiveSsdResponse.Data) {
        return { Status: false, Data: false, Error: "API Error" };
      }
      currentlyActiveSsds.value = currentlyActiveSsdResponse.Data.SemesterSubmitionDates;
      return { Status: true, Data: true };
      //}
      //return { Status: false, Data: false, Error: "Request didn't finish" };
    };
    const GenerateTheNewPeriodCall = async (): Promise<InternalDataTransfter<boolean>> => {
      // const generateNewPeriodContext = await useAxios(
      //   AdminController + "generate-new-period",
      //   {
      //     method: "POST",
      //   },
      //   setBackendInstanceAuth()
      // );
      const newGeneratedPeriodContext = await MakeAPICall<ApiResult<SemesterSubmitionDateResponse>,Object>(AdminController,"generate-new-period", "POST",{});
      //if (generateNewPeriodContext.isFinished) {
      //const newGeneratedPeriodContext: ApiResult<SemesterSubmitionDateResponse> = generateNewPeriodContext.data.value;
      if (!newGeneratedPeriodContext || !newGeneratedPeriodContext.Status || !newGeneratedPeriodContext.Data) {
        return { Status: false, Data: false, Error: "API Call Error" };
      }
      newPeriodContext.value = newGeneratedPeriodContext.Data;
      return { Status: true, Data: true }
      //}
      //return { Status: false, Data: false, Error: "Request didn't finish" };
    };
    const CalculateThePrioritiesCall = async (): Promise<InternalDataTransfter<boolean>> => {
      if (!fromTime.value || !toTime.value)
        return { Status: false, Data: false, Error: "Invalid Payload" };
      const payload = {
        From: fromTime.value,
        To: toTime.value
      }
      // const calculateThePrioritiesCall = await useAxios(
      //   AdminController + "calculate-new-ssd-by-date",
      //   {
      //     method: "POST",
      //     data: payload
      //   },
      //   setBackendInstanceAuth()
      // );
      const calculateThePrioritiesCallResponse = await MakeAPICall<ApiResult<GeneratedPrioritiesResponse>,Object>(AdminController,"calculate-new-ssd-by-date", "POST",payload);
      //if (calculateThePrioritiesCall.isFinished) {
        //const calculateThePrioritiesCallResponse: ApiResult<GeneratedPrioritiesResponse> = calculateThePrioritiesCall.data.value;
      if (!calculateThePrioritiesCallResponse.Status || !calculateThePrioritiesCallResponse.Data) {
        return { Status: false, Data: false, Error: calculateThePrioritiesCallResponse.Error };
      }
      calculatedPriorites.value = calculateThePrioritiesCallResponse.Data
      return { Status: true, Data: true };
      //}
      //return { Status: false, Data: false, Error: "Request didn't finish" };
    };
    const DeletePastSubmissionCall = async (): Promise<InternalDataTransfter<boolean>> => {
      // const deletePastSubmissionsCall = await useAxios(
      //   AdminController + "delete-past-submission-periods",
      //   {
      //     method: "POST",
      //   },
      //   setBackendInstanceAuth()
      // );
      const deletePastSubmissionsResponse = await MakeAPICall<ApiResult<boolean>,Object>(AdminController,"delete-past-submission-periods", "POST",{});
      // if (deletePastSubmissionsCall.isFinished) {
       // const deletePastSubmissionsResponse: ApiResult<boolean> = deletePastSubmissionsCall.data.value;
      if (!deletePastSubmissionsResponse || !deletePastSubmissionsResponse.Status || !deletePastSubmissionsResponse.Data)
        return { Status: false, Data: false, Error: deletePastSubmissionsResponse?.Error ?? "Request not finished" };
      return { Status: true, Data: true };
      // }
      // return { Status: false, Data: false, Error: "Request not finished" };
    }
    const deletePastSubmissions = async () => {
      showBaseDialog.value = true;
      baseDialogDescription.value = `Με την <span style="color:#ff4545;">κατάργηση</span> της τρέχων περιόδου,
                                    <span style="color:#ff4545;">διαγράφονται όλες οι εγγραφές που συσχετίζονται</span>,
                                    όπως <span style="color:#1867C0">προτεραιότητες</span> που είναι σε ισχύ καθώς και <span style="color:#1867C0">υπάρχουσες</span> δηλώσεις των φοιτητών.
                                    Βεβαιωθείται οτι έχετε κάνει <span style="color:#1867C0;">Λήψη</span> των αρχείων για τα μαθήματα σας πηγαίνοντας,
                                                      <span style="color:#1867C0;">Διαχείριση -> Εξαγωγή Δηλώσεων</span> προτού προβείται στην ενέργεια.
                                    Θέλετε να προχωρήσετε σε <span style="color:#ff4545;">κατάργηση</span> της τρέχων περιόδου;`;
      if (await confirm()) {
        showBaseDialog.value = false;
        showLoadingSpinner.value = true;
        const deletePastSubmissionsIDT = await DeletePastSubmissionCall();
        if (!deletePastSubmissionsIDT.Status) {
          showLoadingSpinner.value = false;
          newPeriodContext.value = undefined;
          calculatedPriorites.value = undefined;
          closeAlert(1000);
          setTypeOfAlert('error');
          openAlert("Αποτυχία διαγραφής περιόδου");
          scrollToTop();
          await delay(1500);
          closeAlert(1000);
          return;
        }
        const currentlyActiveSsdsIDT = await FetchCurrentlyActiveSsd();
        if (!currentlyActiveSsdsIDT.Status) {
          showLoadingSpinner.value = false;
          newPeriodContext.value = undefined;
          calculatedPriorites.value = undefined;
          closeAlert(1000);
          setTypeOfAlert('error');
          openAlert("Αποτυχία ανάκτησης περιόδου");
          scrollToTop();
          await delay(1500);
          closeAlert(1000);
          return;
        }
        ///Need to Refetch the active period
        await GetPeriodState();
        showLoadingSpinner.value = false;
        newPeriodContext.value = undefined;
        calculatedPriorites.value = undefined;
        closeAlert(1000);
        setTypeOfAlert('success');
        openAlert("Επιτυχία διαγραφής περιόδου");
        scrollToTop();
        
        await delay(1500);
        closeAlert(1000);
        return;
      }
      showBaseDialog.value = false;
    }
    const generateNewPeriod = async () => {
      showBaseDialog.value = true;
      baseDialogDescription.value = `Με την επικύρωση <span style="color:green;">προσθήκης Νέας Περιόδου </span>, 
                                                      <span style="color:#ff4545;">διαγράφονται όλες οι προηγούμενες περίοδοι</span>,
                                                      καθώς και οι <span style="color:#ff4545;">προηγούμενες δηλώσεις των φοιτητών</span>.
                                                      Βεβαιωθείται οτι έχετε κάνει <span style="color:#1867C0;">Λήψη</span> των αρχείων για τα μαθήματα σας πηγαίνοντας,
                                                      <span style="color:#1867C0;">Διαχείριση -> Εξαγωγή Δηλώσεων</span> προτού προβείται στην ενέργεια.
                                                      Η διαδικασία είναι <span style="color:#ff4545;">μη αναστρέψιμη</span>.
                                                      Θέλετε να προσωρήσετε σε <span style="color:green;">έναρξη Νέας Περιόδου;</span>`;
      if (await confirm()) {
        showBaseDialog.value = false;
        showLoadingSpinner.value = true;
        const generateTheNewPeriodCallIDT = await GenerateTheNewPeriodCall();
        if (!generateTheNewPeriodCallIDT.Status) {
          showLoadingSpinner.value = false;
          newPeriodContext.value = undefined;
          calculatedPriorites.value = undefined;
          closeAlert(1000);
          setTypeOfAlert('error');
          openAlert("Αποτυχία δημιουργίας περιόδου");
          scrollToTop();
          await delay(1500);
          closeAlert(1000);
          return;
        }
        const currentlyActiveSsdsIDT = await FetchCurrentlyActiveSsd();
        if (!currentlyActiveSsdsIDT.Status) {
          showLoadingSpinner.value = false;
          newPeriodContext.value = undefined;
          calculatedPriorites.value = undefined;
          closeAlert(1000);
          setTypeOfAlert('error');
          openAlert("Αποτυχία ανάκτησης περιόδου");
          scrollToTop();
          await delay(1500);
          closeAlert(1000);
          return;
        }
        showLoadingSpinner.value = false;
        closeAlert(1000);
        setTypeOfAlert('success');
        openAlert("Επιτυχία δημιουργίας περιόδου");
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
        newPeriodContext.value = undefined;
        calculatedPriorites.value = undefined;
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
          newPeriodContext.value = undefined;
          calculatedPriorites.value = undefined;
          closeAlert(1000);
          setTypeOfAlert('error');
          openAlert("Αποτυχία εκκίνσης περιόδου");
          scrollToTop();
          await delay(1500);
          closeAlert(1000);
          return;
        }
        const currentlyActiveSsdsIDT = await FetchCurrentlyActiveSsd();
        if (!currentlyActiveSsdsIDT.Status) {
          showLoadingSpinner.value = false;
          newPeriodContext.value = undefined;
          calculatedPriorites.value = undefined;
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
        openAlert("Επιτυχία, αυτοποιημένη έναρξη");
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
      // const initiateSubmissionsCall = await useAxios(
      //   AdminController + "initiate-submission-period",
      //   {
      //     method: "POST",
      //     data: submissionPeriodRequest
      //   },
      //   setBackendInstanceAuth()
      // );
      const initiateSubmissionsResponse = await MakeAPICall<ApiResult<boolean>,SubmissionPeriodRequest>(AdminController,"initiate-submission-period","POST",submissionPeriodRequest);
      // if (initiateSubmissionsCall.isFinished) {
        //const initiateSubmissionsResponse: ApiResult<boolean> = initiateSubmissionsCall.data.value;
      if (!initiateSubmissionsResponse || !initiateSubmissionsResponse.Status)
        return { Status: false, Data: false, Error: initiateSubmissionsResponse?.Error ?? "Request didn't finish" };
      return { Status: true, Data: true };
      // }
      // return { Status: false, Data: false, Error: "Request didn't finish" };
    }
    const semesterStringConverter = (ssd: SemesterSubmitionDateResponse) => {
      if (!ssd || !ssd.Semester || !ssd.Periodicity)
        return '';
      if (ssd.Semester.includes('EARINO') && ssd.Periodicity === PeriodicityEnum.EARINO) {
        return ssd.Semester.replace('EARINO', 'ΕΑΡΙΝΟ').replace('_', "-").replaceAll('_', ' ');
      }
      if (ssd.Semester.includes('XEIMERINO') && ssd.Periodicity === PeriodicityEnum.XEIMERINO) {
        return ssd.Semester.replace('XEIMERINO', 'ΧΕΙΜΕΡΙΝΟ').replace('_', "-").replaceAll('_', ' ');
      }
      return "";
    }
    const semesterChipLabelConverter = (active: SemesterSubmitionDateResponse) => {
      if (!active)
        return "";
      const label = semesterLabelConverter(active.Active);
      if (!active.DateString)
        return label;
      switch (active.Active) {
        case ActivityStatus.ACTIVE:
          return `ΑΝΟΙΚΤΗ ΕΩΣ ${active.DateString}`;
        case ActivityStatus.INACTIVE:
          return `ΑΝΕΝΕΡΓΗ ΑΠΟ ${active.DateString}`;
        case ActivityStatus.TO_BE_ACTIVATED:
          return `ΠΡΟΣ ΔΡΟΜΟΛΟΓΗΣΗ ΣΤΙΣ ${active.DateString}`;
        default:
          return "ΑΝΕΝΕΡΓΗ";
      }
    };
    const semesterLabelConverter = (active: ActivityStatus) => {
      if (!active)
        return "ΑΝΕΝΕΡΓΗ";
      switch (active) {
        case ActivityStatus.ACTIVE:
          return "ΕΝΕΡΓΗ / ΑΝΟΙΚΤΗ";
        case ActivityStatus.INACTIVE:
          return "ΑΝΕΝΕΡΓΗ";
        case ActivityStatus.TO_BE_ACTIVATED:
          return "ΠΡΟΣ ΔΡΟΜΟΛΟΓΗΣΗ";
        default:
          return "ΑΝΕΝΕΡΓΗ";
      }
    };
    const delay = async (time: number) => {
      return new Promise((resolve) => setTimeout(resolve, time));
    };
    const dateFormater = (date: Date) => {
      const day = date.getUTCDate();
      const month = date.getMonth() + 1;
      const year = date.getUTCFullYear();
      return `${day}-${month}-${year}`;
    }
    const emitMobileViewClose = (): void => {
      context.emit('propagateCloseMobileView', true);
    };
    return {
      emitMobileViewClose,
      showBaseDialog,
      baseDialogTitle,
      baseDialogDescription,
      showLoadingSpinner,
      dateFormater,
      yearRange,
      dayNames,
      currentlyActiveSsds,
      newPeriodContext,
      semesterStringConverter,
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
      deletePastSubmissions,
      semesterLabelConverter,
      semesterChipLabelConverter
    }
  }

});
</script>


<style scoped>
.options-parent {
  min-width: 320px;
  padding: 0;
  margin: 1rem 1.5rem;
  display: flex;
  flex-direction: column;
  width: inherit;
  justify-content: flex-start;
  align-items: inherit;
}

.period-label {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 2rem;
  min-width: 320px;
  background-color:var(--header-label-background-color);
  color: var(--header-label-text-color);
  padding: 1.5rem 0;
  margin-bottom: 1rem;
}

.period-label>label {
  word-wrap: break-word;
  text-align: center;
  font-size: 0.95rem;
  font-weight: 450;
  white-space: pre-line;
  word-break: break-word;
}

:deep(.parent) {
  margin: 0;
}

.single-option_card {
  padding: 0.5rem;
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
  box-shadow: var(--card-box-shadow);
  border-radius: var(--card-border-radius);
}

.single-option_card--item {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
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
  font-size: 0.8rem;
  font-weight: 400;
  padding: 1rem 1rem;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  max-width: 8rem;
  border-radius: 16px;
}

.add-new__period-container--button_container {
  display: flex;
  flex-direction: row;
  width: 100%;
  justify-content: center;
  align-items: center;
  margin: 1rem 0;
}

.add-new__period-container--button_item {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
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
  font-size: 0.8rem;
  height: 2rem;
}

.chip-is-active {
  border: 1px solid #00c900 !important;
  color: #00c900 !important;
}

.chip-is-up-to-activation {
  border: 1px solid #0136e6 !important;
  color: #0136e6 !important;
}

.chip-is-inactive {
  border: 1px solid #ff4545 !important;
  color: #ff4545 !important;
}

.chip-separator {
  display: flex;
  flex-direction: column;
  width: 100%;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
}

.chip-bg {
  background: #f7f7f7;
  border: 1px solid #1c4397;
  color: #1c4397;
  word-wrap: break-word;
  gap: 0.5rem;
  height: 2rem;
  padding: 0.3rem 1.2rem;
}

.chip-bg>span {
  font-size: 0.9rem;
}

.chip-separator__left-chip {
  width: fit-content;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
}

.error-border {
  border: 1px solid #ff4545;
  border-radius: 5px;
}

@media (min-width: 769px) {
  .period-label {
    height: 3rem;
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
    gap: 0;
  }

  .chip-activation {
    padding: 1rem 2rem;
    font-size: 1rem;
  }

  .chip-separator {
    display: flex;
    flex-direction: row;
    width: fit-content;
    justify-content: flex-end;
    align-items: center;
    gap: 0.5rem;
    margin-left: 0.5rem;
  }

  .chip-bg>span {
    font-size: 1.05rem;
  }

  .delete-button {
    font-size: 1rem;
  }

}

@media (min-width: 1025px) {
  .chip-separator {
    gap: 1rem;
  }

  .chip-activation,
  .chip-bg {
    height: 2.5rem;
  }
}
</style>
