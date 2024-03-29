<template>
  <base-dialog :show="showConfirmDeletionModal" :route-change-authorizer="true" :inner-title="confirmDeletionInnerTitle"
    :inner-description="confirmDeletionInnerDescription"></base-dialog>
  <div class="admin-option-parent" @click="emitMobileViewClose">

    <base-spinner :show="showLoadingSpinner"></base-spinner>
    <div v-if="!showLoadingSpinner && arrayOfAdmins && arrayOfAdmins.length">
      <v-card elevation="5" class="admin-label">Διαχειριστές εφαρμογής</v-card>
      <v-card>
      <div class="overlay-container">
        <div class="admin-list">
          <v-card elevation="5" class="single-admin_card" v-for="admin of arrayOfAdmins" :key="admin.Id">
            <div class="single-admin_card--item">
              <v-tooltip :text="'Διαγραφή διαχειριστή'" location="bottom">
                <template v-slot:activator="{ props }">
                  <v-btn v-bind="props" class="delete-button" icon="mdi-trash-can" size="x-small"
                    @click="setStateToAdminInterceptor(admin)"></v-btn>
                </template>
              </v-tooltip>
              <v-chip class="chip-bg" size="large">
                <span>{{ admin.DisplayNameEl }}</span>
              </v-chip>
            </div>
          </v-card>
        </div>
        <!-- </div> -->
        <div class="add-new__admin--container">
          <teacher-select :seeded_professors="SeedProfessorsArray" :by_admin_option="true"
            :delete_selected_by_admin_option="delete_selected_by_admin_option"
            @emit-selected-teacher="setStateToAdmin"></teacher-select>
        </div>
      </div>
      </v-card>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import TeacherSelect from "@/components/UI/TeacherSelect.vue";
import { useProfessor } from "@/composables/useProfessors.composable";
import { BaseUser } from '@/models/BACKEND-MODELS/BaseUser';
import { useAlert } from '@/composables/showAlert.composable';
import { AdminController } from "@/config";
import { useAxiosInstance } from "@/composables/useInstance.composable";
import { InternalDataTransfter, InternalErrorObject, ProjectErrorCodes } from "@/models/DTO/InternalDataTransfer";
import { AllAdminsResponse } from "@/models/BACKEND-MODELS/AllAdminsResponse";
import { ApiResult } from "@/models/DTO/ApiResult";
import { BaseUserResponse } from "@/models/BACKEND-MODELS/BaseUserResponse";
import BaseSpinner from "@/components/Base/BaseSpinner.vue";
import BaseDialog from "@/components/Base/BaseDialog.vue";
import { confirm } from "@/composables/dialog.composable";
export default defineComponent({
  components: {
    TeacherSelect,
    BaseSpinner,
    BaseDialog
  },
  emits: ['propagateCloseMobileView'],
  setup(_, context) {
    const { GetSeededProfessors, SeedProfessorsArray } = useProfessor();
    //const { setBackendInstanceAuth } = useAxiosInstance();
    const { MakeAPICall } = useAxiosInstance();
    const { openAlert, setTypeOfAlert, closeAlert, } = useAlert();

    const arrayOfAdmins = ref(new Array<BaseUserResponse>());
    const showLoadingSpinner = ref(true);
    const showConfirmDeletionModal = ref(false);
    const confirmDeletionInnerTitle = ref("ΠΡΟΕΙΔΟΠΟΙΗΣΗ");
    const confirmDeletionInnerDescription = ref("");
    const delete_selected_by_admin_option = ref(false);
    onMounted(async () => {
      emitMobileViewClose()
      closeAlert();
      if (!SeedProfessorsArray || !SeedProfessorsArray.value || !SeedProfessorsArray.value.length) {
        await GetSeededProfessors();
      }
      const popAdminsIDT = await MakeApiCallToPopulateAdmins();
      if (!popAdminsIDT.Status) {
        setTypeOfAlert('error');
        openAlert("Αποτυχία λήψης διαχειριστών");
        await delay(1500);
        closeAlert(1000);
      }
    });
    const setStateToAdminInterceptor = async (selectedTeacher: BaseUserResponse) => {
      if (!selectedTeacher) {
        setTypeOfAlert('error');
        openAlert("Αποτυχία αλλαγής κατάστασης διαχειριστή");
        await delay(1500);
        closeAlert(1000);
        return;
      }
      showConfirmDeletionModal.value = true;
      confirmDeletionInnerDescription.value = `Είστε σίγουρος ότι θέλετε να <span style="color:#ff4545;">διαγράψετε</span> τις διαχειριστικές ιδιότητες
                                              του χρήστη <span style="color:#1867C0;">${selectedTeacher.DisplayNameEl}</span>;
                                              Σε περίπτωση <span style="color:#ff4545;">λάθους</span> μπορεί να <span style="color: green;">ξαναπροστεθεί</span> ως <span style="color:#1867C0;">διαχειριστής</span>.`;
      if (await confirm()) {
        showConfirmDeletionModal.value = false;
        const payloadToSetAdminState: Partial<BaseUser> = {
          Guid: selectedTeacher.Id,
        }
        showLoadingSpinner.value = true;
        const setStateIDT = await setStateToAdmin(payloadToSetAdminState as BaseUser, true);
        showLoadingSpinner.value = false;
        setTypeOfAlert(!setStateIDT || !setStateIDT.Status ? 'error' : 'success');
        openAlert(!setStateIDT || !setStateIDT.Status ? setStateIDT.Data! : "Επιτυχία αλλαγής κατάσταση διαχειριστή");
        await delay(1500);
        closeAlert(1000);
      }
      showConfirmDeletionModal.value = false;

    }
    const setStateToAdmin = async (selectedTeacher?: BaseUser, removeAdmin: boolean = false): Promise<InternalDataTransfter<string>> => {
      if (!selectedTeacher || !selectedTeacher.Guid)
        return { Status: false, Data: "Αποτυχία", Error: "Αποτυχία" };
      const changeAdminStateIDT = await MakeApiCallToChangeAdminState(selectedTeacher.Guid, removeAdmin);
      if (!changeAdminStateIDT || !changeAdminStateIDT.Status) {
        const error = changeAdminStateIDT?.Error as InternalErrorObject;
        if(error.ErrorCode === ProjectErrorCodes.AlreadyExists){
          delete_selected_by_admin_option.value = true;
          closeAlert();
          setTypeOfAlert('error');
          openAlert("Αποτυχία είναι ήδη διαχειριστής");
          await delay(1500);
          closeAlert(1000);
          delete_selected_by_admin_option.value = false;
        }
        return { Status: false, Data: "Αποτυχία αλλαγής κατάστασης διαχειριστή", Error: "Αποτυχία αλλαγής κατάστασης διαχειριστή" };
      }
      const populateAdminsIDT = await MakeApiCallToPopulateAdmins();
      if (!populateAdminsIDT.Status) {
        return { Status: false, Data: "Αποτυχία λήψης διαχειριστών", Error: "Αποτυχία λήψης διαχειριστών" };
      }
      if (!removeAdmin) {
        delete_selected_by_admin_option.value = true;
        await delay(1000);
        delete_selected_by_admin_option.value = false;
        closeAlert(1000);
        setTypeOfAlert('success');
        openAlert("Επιτυχία αλλαγής κατάστασης σε διαχειριστή");
        await delay(1500);
        closeAlert(1000);
      }
      return { Status: true, Data: "OK" };
    };
    const MakeApiCallToPopulateAdmins = async (): Promise<InternalDataTransfter<boolean>> => {
      const get_all_admins_api_call_response = await MakeAPICall<ApiResult<AllAdminsResponse>>(AdminController, "get-admins", "GET");
      showLoadingSpinner.value = false;
      if (!get_all_admins_api_call_response || !get_all_admins_api_call_response.Status || !get_all_admins_api_call_response.Data || !get_all_admins_api_call_response.Data.Admins || !get_all_admins_api_call_response.Data.Count)
        return { Status: false, Data: false, Error: "API Error" };
      arrayOfAdmins.value = get_all_admins_api_call_response.Data.Admins;
      return { Status: true, Data: true };
    };
    const MakeApiCallToChangeAdminState = async (baseUserId: string, removeAdmin: boolean = false): Promise<InternalDataTransfter<boolean>> => {
      const change_admin_state_call_response = await MakeAPICall<ApiResult<boolean>, Object>(AdminController, `change-admin-state/${baseUserId}/${removeAdmin}`, "POST", {});
      if (!change_admin_state_call_response || !change_admin_state_call_response.Status || !change_admin_state_call_response.Data) {
        return { Status: false, Data: false, Error: change_admin_state_call_response?.Error };
      }
      return { Status: true, Data: true };
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
      delete_selected_by_admin_option,
      SeedProfessorsArray,
      setStateToAdmin,
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
.admin-option-parent {
  min-width: 320px;
  padding-top: 1.2rem;
  display: flex;
  flex-direction: column;
  justify-content: end;
}

.admin-list {
  display: flex;
  flex-direction: row;
  justify-content: left;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.1rem;
  width: 90%;
}

.admin-label {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1 0 auto;
  -webkit-flex: 1 0 auto;
  width: 100%;
  height: 3rem;
  min-width: 320px;
  font-size: 0.95rem;
  font-weight: 450;
  background-color: var(--header-label-background-color);
  color: var(--header-label-text-color);
  word-wrap: break-word;
  overflow-wrap: break-word;
  word-break: break-word;
  text-align: center;
  padding: 1.2rem;
  margin-bottom: 1.2rem;
}

.single-admin_card {
  padding: 0.5rem;
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
  box-shadow: var(--card-box-shadow);
  -moz-box-shadow: var(--card-box-shadow);
  -webkit-box-shadow: var(--card-box-shadow);
  border-radius: 999px;
  -moz-border-radius: 999px;
  -webkit-border-radius: 999px;
}

.single-admin_card--item {
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: 0.3rem;
}

.single-admin_card--item>span {
  color: #1c4397;
  word-wrap: break-word;
  overflow-wrap: break-word;
  word-break: break-word;
  text-align: center;
  font-size: 1.1rem;
  hyphens: auto;
  -webkit-hyphens: auto;
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
  -moz-border-radius: 2rem !important;
  -webkit-border-radius: 2rem !important;
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

.overlay-container {
  display: flex;
  width: 100%;
  flex-direction: column;
}

.admin-list {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
}

@media (min-width: 470px) {
  .overlay-container {
    display: flex;
    flex-direction: column;
    margin: 0 auto;
    width: 80%;
    padding: 0.5rem 0.5rem;
  }

  .admin-list {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-start;
    flex-wrap: wrap;
    gap: 0.5rem;
    width: 100%;
  }
}

@media (min-width: 769px) {
  .overlay-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding-right: 5rem;
    padding: 1rem 2rem;
  }

  .admin-label {
    margin-bottom: 0.5rem;
    height: 3rem;
  }

  .admin-list {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    gap: 0.2rem;
    flex-wrap: wrap;
    height: fit-content;
    width: 100%;
    max-width: 100%;
    max-height: fit-content;
  }
}

@media (min-width: 1025px) {
  .overlay-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding-right: 5rem;
    padding: 1rem 5rem;
  }

  .admin-label {
    margin-bottom: 0.5rem;
    height: 3rem;
  }

  .admin-list {
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    justify-content: center;
    flex-wrap: wrap;
    gap: 0.5rem;
    flex-wrap: wrap;
    height: fit-content;
    width: 90%;
    max-width: fit-content;
  }
}
</style>
