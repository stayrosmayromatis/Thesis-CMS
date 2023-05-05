<template>
  <base-alert :show="showAlert" :alert-type-prop="typeOfAlert" :title="alertTitle"></base-alert>
  <base-dialog :show="showConfirmDeletionModal" :route-change-authorizer="true" :inner-title="confirmDeletionInnerTitle"
    :inner-description="confirmDeletionInnerDescription"></base-dialog>
  <div class="parent" @click="emitMobileViewClose">
    <base-spinner :show="showLoadingSpinner"></base-spinner>
    <div v-if="!showLoadingSpinner">
      <v-card elevation="3" class="admin-label">Διαχειριστες εφαρμογης</v-card>
      <v-card elevation="5" class="single-admin_card" v-for="admin of arrayOfAdmins" :key="admin.Id">
        <div class="single-admin_card--item">
          <v-chip class="chip-bg" size="large">
            <span>{{ admin.DisplayNameEl }}</span>
          </v-chip>
          <v-tooltip :text="'Διαγραφή διαχειριστή'" location="bottom">
            <template v-slot:activator="{ props }">
              <v-btn v-bind="props" class="delete-button" icon="mdi-trash-can" size="x-small"
                @click="setStateToAdminInterceptor(admin)"></v-btn>
            </template>
          </v-tooltip>
        </div>
      </v-card>
      <div class="add-new__admin--container">
        <teacher-select :seeded_professors="seededProfessors" :by_admin_option="true"
          @emit-selected-teacher="setStateToAdmin"></teacher-select>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import TeacherSelect from "@/components/UI/TeacherSelect.vue";
import { useProfessor } from "@/composables/useProfessors.composable";
import { BaseUser } from '@/models/BACKEND-MODELS/BaseUser';
import { useAlert } from '@/composables/showAlert.composable';
import { useAxios } from "@vueuse/integrations/useAxios";
import { AdminController } from "@/config";
import { useAxiosInstance } from "@/composables/useInstance.composable";
import { InternalDataTransfter } from "@/models/DTO/InternalDataTransfer";
import { AllAdminsResponse } from "@/models/BACKEND-MODELS/AllAdminsResponse";
import { ApiResult } from "@/models/DTO/ApiResult";
import { BaseUserResponse } from "@/models/BACKEND-MODELS/BaseUserResponse";
import BaseAlert from "@/components/Base/BaseAlert.vue";
import BaseSpinner from "@/components/Base/BaseSpinner.vue";
import BaseDialog from "@/components/Base/BaseDialog.vue";
import { confirm } from "@/composables/dialog.composable";
export default defineComponent({
  components: {
    TeacherSelect,
    BaseAlert,
    BaseSpinner,
    BaseDialog
  },
  emits: ['propagateCloseMobileView'],
  setup(_, context) {
    const { GetSeededProfessors, SeedProfessorsArray } = useProfessor();
    const { setBackendInstanceAuth } = useAxiosInstance();
    const { openAlert, setTypeOfAlert, typeOfAlert, showAlert, closeAlert, alertTitle } = useAlert();
    const seededProfessors = ref(new Array<BaseUser>());
    const arrayOfAdmins = ref(new Array<BaseUserResponse>());
    const showLoadingSpinner = ref(false);
    const showConfirmDeletionModal = ref(false);
    const confirmDeletionInnerTitle = ref("ΠΡΟΕΙΔΟΠΟΙΗΣΗ");
    const confirmDeletionInnerDescription = ref("");
    onMounted(async () => {
      emitMobileViewClose()
      closeAlert(1000);
      //SeedProfessorsSegment
      await GetSeededProfessors();
      seededProfessors.value = SeedProfessorsArray.value;
      showLoadingSpinner.value = true;
      const popAdminsIDT = await MakeApiCallToPopulateAdmins();
      showLoadingSpinner.value = false;
      if (!popAdminsIDT.Status) {
        closeAlert(1000);
        setTypeOfAlert('error');
        openAlert("Αποτυχία λήψης διαχειριστών");
        await delay(1500);
      }
    });
    const setStateToAdminInterceptor = async (selectedTeacher: BaseUserResponse) => {
      if (!selectedTeacher) {
        closeAlert(1000);
        setTypeOfAlert('error');
        openAlert("Αποτυχία αλλαγής καταστάσεως διαχειριστή");
        await delay(1500);
        return;
      }
      showConfirmDeletionModal.value = true;
      confirmDeletionInnerDescription.value = `Είστε σίγουρος οτι θέλετε να <span style="color:#ff4545;">διαγράψετε</span> τις διαχειριστικές ιδιότητες
                                              του χρήστη <span style="color:#1867C0;">${selectedTeacher.DisplayNameEl}</span>;
                                              Σε περίπτωση <span style="color:#ff4545;">λάθους</span> μπορεί να <span style="color: green;">ξαναπροστεθεί</span> ως <span style="color:#1867C0;">διαχειριστής</span>.`;
      if (await confirm()) {
        showConfirmDeletionModal.value = false;
        const payloadToSetAdminState: Partial<BaseUser> = {
          Guid: selectedTeacher.Id,
        }
        showLoadingSpinner.value = true;
        const setStateIDT = await setStateToAdmin(payloadToSetAdminState as BaseUser, true);
        if(!setStateIDT.Status){
          showLoadingSpinner.value = false;
          closeAlert(1000);
          setTypeOfAlert('error');
          openAlert(setStateIDT.Data!);
          await delay(1500);
          return;
        }
        showLoadingSpinner.value = false;
        closeAlert(1000);
        setTypeOfAlert('success');
        openAlert("Επιτυχία αλλαγής κατάσταση διαχειριστή");
        await delay(1500);
        closeAlert(1000);
      }
      showConfirmDeletionModal.value = false;
      
    }
    const setStateToAdmin = async (selectedTeacher?: BaseUser, removeAdmin: boolean = false): Promise<InternalDataTransfter<string>> => {
      if (!selectedTeacher || !selectedTeacher.Guid)
        return {Status :false,Data:"Αποτυχία",Error:"Αποτυχία"};
      const changeAdminStateIDT = await MakeApiCallToChangeAdminState(selectedTeacher.Guid, removeAdmin);
      if (!changeAdminStateIDT.Status) {
        return {Status :false,Data:"Αποτυχία αλλαγής κατάστασης διαχειριστή",Error:"Αποτυχία αλλαγής κατάστασης διαχειριστή"};
      }
      const populateAdminsIDT = await MakeApiCallToPopulateAdmins();
      if (!populateAdminsIDT.Status) {
        return {Status :false,Data:"Αποτυχία λήψης διαχειριστών",Error:"Αποτυχία λήψης διαχειριστών"};
      }
      return {Status :true,Data:"OK"};
    };
    const MakeApiCallToPopulateAdmins = async (): Promise<InternalDataTransfter<boolean>> => {
      const get_all_admins_api_call = await useAxios(
        AdminController + "get-admins",
        {
          method: "GET",
        },
        setBackendInstanceAuth()
      );
      if (get_all_admins_api_call.isFinished) {
        const get_all_admins_api_call_response: ApiResult<AllAdminsResponse> = get_all_admins_api_call.data.value;
        if (!get_all_admins_api_call_response || !get_all_admins_api_call_response.Status || !get_all_admins_api_call_response.Data || !get_all_admins_api_call_response.Data.Admins || !get_all_admins_api_call_response.Data.Count)
          return { Status: false, Data: false, Error: "API Error" };
        arrayOfAdmins.value = get_all_admins_api_call_response.Data.Admins;
        return { Status: true, Data: true };
      }
      return { Status: false, Data: false, Error: "Request didn't finish" };
    };
    const MakeApiCallToChangeAdminState = async (baseUserId: string, removeAdmin: boolean = false): Promise<InternalDataTransfter<boolean>> => {
      const change_admin_state_call = await useAxios(
        AdminController + `change-admin-state/${baseUserId}/${removeAdmin}`,
        {
          method: "POST",
        },
        setBackendInstanceAuth()
      );
      if (change_admin_state_call.isFinished) {
        const change_admin_state_call_response: ApiResult<boolean> = change_admin_state_call.data.value;
        if (!change_admin_state_call_response || !change_admin_state_call_response.Status || !change_admin_state_call_response.Data) {
          return { Status: false, Data: false, Error: "Couldn't Add Admin" };
        }
        return { Status: true, Data: true };
      }
      return { Status: false, Data: false, Error: "Request didn't finish" };
    };
    const delay = async (time: number) => {
      return new Promise((resolve) => setTimeout(resolve, time));
    };
    const emitMobileViewClose = (): void => {
      context.emit('propagateCloseMobileView', true);
    };
    return {
      emitMobileViewClose,
      arrayOfAdmins,
      seededProfessors,
      setStateToAdmin,
      typeOfAlert,
      showAlert,
      alertTitle,
      showLoadingSpinner,
      setStateToAdminInterceptor,
      showConfirmDeletionModal,
      confirmDeletionInnerTitle,
      confirmDeletionInnerDescription
    };
  },
});
</script>

<style scoped>
.parent {
  min-width: 320px;
  padding: 0;
  margin: 1rem 1.5rem;
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

.single-admin_card--item>span {
  color: #1c4397;
  word-wrap: break-word;
  word-break: break-word;
  text-align: center;
  font-size: 1.1rem;
  hyphens: auto;
  font-weight: 400;
  white-space: break-spaces;
}

.chip-bg {
  background: #f7f7f7;
  border: 1px solid #1c4397;
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
    margin-top: 0.5rem;
    margin-bottom: 0.5rem;
    height: 3rem;
    font-size: 1rem;
    background-color: #dae3f7;
  }
}

@media (min-width: 1025px) {}
</style>
