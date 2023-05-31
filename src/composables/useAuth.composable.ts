import { store } from "@/store/index";
import { TypeStaff } from "@/enums/StaffTypeEnum";
import { UserDataDetails } from "@/models/BACKEND-MODELS/UserDataDetails";
import { useAxiosInstance } from "@/composables/useInstance.composable";
import { useAxios } from "@vueuse/integrations/useAxios";
import { InternalDataTransfter } from "@/models/DTO/InternalDataTransfer";
import { BaseUserAuthStateResponse } from "@/models/BACKEND-MODELS/BaseUserAuthStateResponse";
// import { PeriodInfo } from "@/models/BACKEND-MODELS/PeriodInfoResponse";
import { ApiResult } from "@/models/DTO/ApiResult";
import { StoreSth } from "@/store/actions";
import { useAlert } from "@/composables/showAlert.composable";
import { AuthClientController } from "@/config";
import { InfoController } from "@/config";
export function useAuth() {
  const IsAuthenticated = async (byInternalUse: boolean = false): Promise<boolean> => {
    try {
      const info_result = await MakeInfoCall();
      if (
        !info_result ||
        !info_result.Status ||
        !info_result.Data ||
        info_result.Error 
      ) {
        store.dispatch("setAuthState", false);
        store.dispatch("clearUserDataDetails");
        store.dispatch("clearSeededProfessors");
        // store.dispatch("clearPeriodInfo");
        return false;
      }
      const auth_response = await DetermineIfAuth(info_result.Data,byInternalUse);
      return auth_response.Status ?? false;
    } catch (error) {
      console.log(error);
      return false;
    }
  };
  const SetNotAuthenticated = async (): Promise<void> => {
    const { setBackendInstanceAuth } = useAxiosInstance();
    const { openAlert, setTypeOfAlert, closeAlert } = useAlert();
    closeAlert();
    const logout_response = await useAxios(
      AuthClientController+"sign-out",
      {
        method: "POST",
      },
      setBackendInstanceAuth()
    );
    if (!logout_response.isFinished.value) {
      setTypeOfAlert("error");
      openAlert("Ανεπιτυχής Αποσύνδεση");
      return;
    }
    const logOutResponse: ApiResult<string> = logout_response.data.value;
    if (logOutResponse.Status && logOutResponse.Data.trim().toLowerCase() === "OK".toLowerCase()) {
      setTypeOfAlert("success");
      openAlert("Επιτυχής Αποσύνδεση");
      store.dispatch("setAuthState", false);
      store.dispatch("clearUserDataDetails");
      store.dispatch("clearSeededProfessors");
      // store.dispatch("clearPeriodInfo");
    }
  };
  const GetTypeStaff = (): TypeStaff | undefined => {
    try {
      return store.getters.getStaffType;
      //getStaffTypeRes;
    } catch (error) {
      console.log(error);
      return undefined;
    }
  };
  const IsTeacher = (): boolean => {
    if (!store.getters.IsAuth) return false;
    const typeStaff = GetTypeStaff();
    if (!typeStaff) return false;
    return typeStaff === TypeStaff.STAFF || typeStaff == TypeStaff.ADMIN
      ? true
      : false;
  };
  const IsStudent = (): boolean => {
    if (!store.getters.IsAuth) return false;
    const typeStaff = GetTypeStaff();
    if (!typeStaff) return false;
    return typeStaff === TypeStaff.STUDENT || typeStaff === TypeStaff.ADMIN
      ? true
      : false;
  };
  const GetUserDataDetails = (): UserDataDetails | undefined => {
    try {
      return store.getters.getUserDataDetails;
    } catch (error) {
      console.log(error);
      return undefined;
    }
  };
  const MakeInfoCall = async (): Promise<InternalDataTransfter<BaseUserAuthStateResponse>> => {
    const { setBackendInstanceAuth } = useAxiosInstance();
    const info_response = await useAxios(
      InfoController+"infos",
      setBackendInstanceAuth()
    );
    if (!info_response.isFinished.value || ( info_response.isFinished.value && (!info_response.data.value || info_response.error.value))) {
      store.dispatch("setAuthState", false);
      store.dispatch("clearUserDataDetails");
      store.dispatch("clearSeededProfessors");
      // store.dispatch("clearPeriodInfo");
      return {
        Status: false,
        Data: null,
        Error: "Σφάλμα Εξουσιοδήτησης",
        Description: "Η διαδίκασία δεν ολοκληρώθηκε",
      };
    }
    const info_response_data: ApiResult<BaseUserAuthStateResponse> = info_response.data.value;
    if (
      !info_response_data ||
      !info_response_data.Status ||
      !info_response_data.Data
    ) {
      store.dispatch("setAuthState", false);
      store.dispatch("clearUserDataDetails");
      store.dispatch("clearSeededProfessors");
      // store.dispatch("clearPeriodInfo");
      return {
        Status: false,
        Data: null,
        Error: "Σφάλμα Εξουσιοδήτησης",
        Description: "Η διαδίκασία δεν ολοκληρώθηκε",
      };
    }
    return { Status: true, Data: info_response_data.Data };
  };
  const DetermineIfAuth = async (response: BaseUserAuthStateResponse,byInternalUse: boolean = false): Promise<InternalDataTransfter<boolean>> => {
    const theFalsyReponse = {
      Status: false,
      Data: false,
      Error: "Σφάλμα Αυθεντικοποίησης",
      Description: "Η διαδίκασία δεν ολοκληρώθηκε",
    };
    try {
      const { openAlert, setTypeOfAlert } = useAlert();
      if (!response || !response.IsAuth || !response.UserDataDetails) {
        store.dispatch("setAuthState", false);
        store.dispatch("clearUserDataDetails");
        store.dispatch("clearSeededProfessors");
        // store.dispatch("clearPeriodInfo");
        return theFalsyReponse;
      }
      const payload: StoreSth = {
        authState: response.IsAuth,
        isStudent:
          response.UserDataDetails?.EduPersonAffiliation === TypeStaff.STUDENT,
        isTeacher:
          response.UserDataDetails?.EduPersonAffiliation === TypeStaff.STAFF,
        isAdmin:
          response.UserDataDetails?.EduPersonAffiliation === TypeStaff.ADMIN,
        eduPersonAffiliation: response.UserDataDetails.EduPersonAffiliation,
      };
      if (response.UserDataDetails.EduPersonAffiliation === TypeStaff.STAFF) {
        store.dispatch("setIsTeacherState", payload);
        store.dispatch("setUserDataDetails", response.UserDataDetails);
        // store.dispatch("setPeriodInfo",response.PeriodInfo);
        if (!byInternalUse) {
          openAlert("Επιτυχής Σύνδεση");
          setTypeOfAlert("success");
        }
        return { Status: true, Data: true };
      }
      if (response.UserDataDetails.EduPersonAffiliation === TypeStaff.STUDENT) {
        store.dispatch("setIsStudentState", payload);
        store.dispatch("setUserDataDetails", response.UserDataDetails);
        // store.dispatch("setPeriodInfo",response.PeriodInfo);
        if (byInternalUse === false) {
          openAlert("Επιτυχής Σύνδεση");
          setTypeOfAlert("success");
        }
        return { Status: true, Data: true };
      }
      if (response.UserDataDetails.EduPersonAffiliation === TypeStaff.ADMIN) {
        store.dispatch("setIsAdminState", payload);
        store.dispatch("setUserDataDetails", response.UserDataDetails);
        // store.dispatch("setPeriodInfo",response.PeriodInfo);
        if (byInternalUse === false) {
          openAlert("Επιτυχής Σύνδεση");
          setTypeOfAlert("success");
        }
        return { Status: true, Data: true };
      }

      store.dispatch("setAuthState", false);
      store.dispatch("clearUserDataDetails");
      store.dispatch("clearSeededProfessors");
      // store.dispatch("clearPeriodInfo");
      return theFalsyReponse;
    } catch (_) {
      store.dispatch("setAuthState", false);
      store.dispatch("clearUserDataDetails");
      store.dispatch("clearSeededProfessors");
      // store.dispatch("clearPeriodInfo");
      return theFalsyReponse;
    }
  };

  return {
    IsAuthenticated,
    GetTypeStaff,
    GetUserDataDetails,
    SetNotAuthenticated,
    IsTeacher,
    IsStudent,
    MakeInfoCall,
    DetermineIfAuth,
    // GetPeriodInfo
  };
}
