<template>
  <base-alert
    :show="showAlert"
    :alert-type-prop="typeOfAlert"
    :title="alertTitle"
  ></base-alert>
  <div class="parent">
    <base-spinner :show="showLoadingSpinner"></base-spinner>
    <div v-if="!showLoadingSpinner">
      <v-card elevation="3" class="admin-label">Διαχειριστες εφαρμογης</v-card>
      <v-card
        elevation="5"
        class="single-admin_card"
        v-for="admin of arrayOfAdmins"
        :key="admin.Id"
      >
        <div class="single-admin_card--item">
          <span>{{ admin.DisplayNameEl }}</span>
          <v-tooltip :text="'Διαγραφή διαχειριστή'" location="bottom">
            <template v-slot:activator="{ props }">
              <v-btn
                v-bind="props"
                class="delete-button"
                icon="mdi-trash-can"
                size="x-small"
                @click="setStateToAdminInterceptor(admin)"
              ></v-btn>
            </template>
          </v-tooltip>
        </div>
      </v-card>
      <div class="add-new__admin--container">
        <!-- <v-btn type="button" elevation="4" color="green"
          ><svg
            width="25"
            height="25"
            clip-rule="evenodd"
            fill-rule="evenodd"
            stroke-linejoin="round"
            stroke-miterlimit="2"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            style="margin-right: 0.5rem;"
          >
            <path
              d="m21 3.998c0-.478-.379-1-1-1h-16c-.62 0-1 .519-1 1v16c0 .621.52 1 1 1h16c.478 0 1-.379 1-1zm-16.5.5h15v15h-15zm6.75 6.752h-3.5c-.414 0-.75.336-.75.75s.336.75.75.75h3.5v3.5c0 .414.336.75.75.75s.75-.336.75-.75v-3.5h3.5c.414 0 .75-.336.75-.75s-.336-.75-.75-.75h-3.5v-3.5c0-.414-.336-.75-.75-.75s-.75.336-.75.75z"
              fill-rule="nonzero"
            />
          </svg>
          ΠΡΟΣΘΗΚΗ ΝΕΟΥ ΔΙΑΧΕΙΡΙΣΤΗ
        </v-btn> -->
        <teacher-select :seeded_professors="seededProfessors" :by_admin_option="true"
                        @emit-selected-teacher="setStateToAdmin"></teacher-select>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent, onMounted, ref} from 'vue';
import TeacherSelect from "@/components/UI/TeacherSelect.vue";
import {useProfessor} from "@/composables/useProfessors.composable";
import {BaseUser} from '@/models/BACKEND-MODELS/BaseUser';
import {useAlert} from '@/composables/showAlert.composable';
import {useAxios} from "@vueuse/integrations/useAxios";
import {AdminController} from "@/config";
import {useAxiosInstance} from "@/composables/useInstance.composable";
import {InternalDataTransfter} from "@/models/DTO/InternalDataTransfer";
import {AllAdminsResponse} from "@/models/BACKEND-MODELS/AllAdminsResponse";
import {ApiResult} from "@/models/DTO/ApiResult";
import {BaseUserResponse} from "@/models/BACKEND-MODELS/BaseUserResponse";
import BaseAlert from "@/components/Base/BaseAlert.vue";
import BaseSpinner from "@/components/Base/BaseSpinner.vue";

export default defineComponent({
  components: {
    TeacherSelect,
    BaseAlert,
    BaseSpinner
  },
  setup(props, context) {
    const {GetSeededProfessors, SeedProfessorsArray} = useProfessor();
    const {setBackendInstanceAuth} = useAxiosInstance();
    const {openAlert, setTypeOfAlert, typeOfAlert, showAlert, closeAlert, alertTitle} = useAlert();
    const seededProfessors = ref(new Array<BaseUser>());
    const arrayOfAdmins = ref(new Array<BaseUserResponse>());
    const showLoadingSpinner = ref(false);
    onMounted(async () => {
      context.emit("closeMobileView", true);
      closeAlert(1000);
      //SeedProfessorsSegment
      await GetSeededProfessors();
      seededProfessors.value = SeedProfessorsArray.value;

      const popAdminsIDT = await MakeApiCallToPopulateAdmins();
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
        openAlert("Αποτυχία διαγραφής διαχειριστή");
        await delay(1500);
        return;
      }
      const payloadToSetAdminState: Partial<BaseUser> = {
        Guid: selectedTeacher.Id,
      }
      return await setStateToAdmin(payloadToSetAdminState as BaseUser, true);
    }
    const setStateToAdmin = async (selectedTeacher?: BaseUser, removeAdmin: boolean = false): Promise<void> => {
      if (!selectedTeacher || !selectedTeacher.Guid)
        return;
      const changeAdminStateIDT = await MakeApiCallToChangeAdminState(selectedTeacher.Guid, removeAdmin);
      if (!changeAdminStateIDT.Status) {
        closeAlert(1000);
        setTypeOfAlert('error');
        openAlert("Αποτυχία αλλαγής κατάστασης διαχειριστή");
        await delay(1500);
        return;
      }
      const populateAdminsIDT = await MakeApiCallToPopulateAdmins();
      if (!populateAdminsIDT.Status) {
        closeAlert(1000);
        setTypeOfAlert('error');
        openAlert("Αποτυχία λήψης διαχειριστών");
        await delay(1500);
        return;
      }
      closeAlert(1000);
      setTypeOfAlert('success');
      openAlert("Επιτυχία αλλαγής κατάσταση διαχειριστή");
      await delay(1500);
      closeAlert(1000);
      return;
    };
    const MakeApiCallToPopulateAdmins = async (): Promise<InternalDataTransfter<boolean>> => {
      showLoadingSpinner.value = true;
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
          return {Status: false, Data: false, Error: "API Error"};
        arrayOfAdmins.value = get_all_admins_api_call_response.Data.Admins;
        showLoadingSpinner.value = false;
        return {Status: true, Data: true};
      }
      return {Status: false, Data: false, Error: "Request didn't finish"};
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
          return {Status: false, Data: false, Error: "Couldn't Add Admin"};
        }
        return {Status: true, Data: true};
      }
      return {Status: false, Data: false, Error: "Request didn't finish"};
    };
    const delay = async (time: number) => {
      return new Promise((resolve) => setTimeout(resolve, time));
    };
    return {
      arrayOfAdmins,
      seededProfessors,
      setStateToAdmin,
      typeOfAlert,
      showAlert,
      alertTitle,
      showLoadingSpinner,
      setStateToAdminInterceptor
    };
  },
});
</script>

<style scoped>
.parent {
  min-width: 320px;
  padding: 0;
  margin: 1.5rem 1.5rem;
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
