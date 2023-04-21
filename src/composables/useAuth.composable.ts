import { store } from "@/store/index";
import { TypeStaff } from "@/enums/StaffTypeEnum";
import { UserDataDetails } from "@/models/BACKEND-MODELS/UserDataDetails";
import { useAxiosInstance } from "@/composables/useInstance.composable";
import { useAxios } from "@vueuse/integrations/useAxios";
import { InternalDataTransfter } from "@/models/DTO/InternalDataTransfer";
import { BaseUserAuthStateResponse, PeriodInfo } from "@/models/BACKEND-MODELS/BaseUserAuthStateResponse";
import { ApiResult } from "@/models/DTO/ApiResult";
import { StoreSth } from "@/store/actions";
import { useAlert } from "@/composables/showAlert.composable";
export function useAuth() {
  const IsAuthenticated = async (byInternalUse: boolean = false): Promise<boolean> => {
    try {
      const info_result = await MakeInfoCall();
      if (
        !info_result ||
        info_result.Status === false ||
        info_result.Error ||
        !info_result.Data
      ) {
        store.dispatch("setAuthState", false);
        store.dispatch("clearUserDataDetails");
        store.dispatch("clearSeededProfessors");
        store.dispatch("clearPeriodInfo");
        return false;
      }
      const auth_response = await DetermineIfAuth(
        info_result.Data,
        byInternalUse
      );
      // if (
      //   !auth_response ||
      //   auth_response.Status === false ||
      //   auth_response.Data === false ||
      //   auth_response.Error
      // ) {
       
      //   return false;
      // }
      return auth_response.Status;
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
      "/authclient/sign-out",
      {
        method: "POST",
      },
      setBackendInstanceAuth()
    );
    if (logout_response.isFinished) {
      const logOutResponse: ApiResult<string> = logout_response.data.value;
      if (logOutResponse.Data === "OK") {
        setTypeOfAlert("success");
        openAlert("Επιτυχής Αποσύνδεση");
        store.dispatch("setAuthState", false);
        store.dispatch("clearUserDataDetails");
        store.dispatch("clearSeededProfessors");
        store.dispatch("clearPeriodInfo");
        return;
      }
    }
    setTypeOfAlert("error");
    openAlert("Ανεπιτυχής Αποσύνδεση");
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
  const GetPeriodInfo = (): PeriodInfo | undefined => {
    try{
      return store.getters.getPeriodInfo;
    }
    catch(err){
      console.log(err);
      return undefined;
    }
  }
  const MakeInfoCall = async (): Promise<
    InternalDataTransfter<BaseUserAuthStateResponse>
  > => {
    const { setBackendInstanceAuth } = useAxiosInstance();
    const info_response = await useAxios(
      "/info/infos",
      setBackendInstanceAuth()
    );
    if (
      info_response.isFinished.value &&
      (!info_response.data.value || info_response.error.value)
    ) {
      store.dispatch("setAuthState", false);
        store.dispatch("clearUserDataDetails");
        store.dispatch("clearSeededProfessors");
        store.dispatch("clearPeriodInfo");
      return {
        Status: false,
        Data: null,
        Error: "Σφάλμα Εξουσιοδήτησης",
        Description: "Η διαδίκασία δεν ολοκληρώθηκε",
      };
    }
    const info_response_data: ApiResult<BaseUserAuthStateResponse> =
      info_response.data.value;
    if (
      !info_response_data ||
      info_response_data.Status === false ||
      !info_response_data.Status ||
      !info_response_data.Data
    ) {
       store.dispatch("setAuthState", false);
        store.dispatch("clearUserDataDetails");
        store.dispatch("clearSeededProfessors");
        store.dispatch("clearPeriodInfo");
      return {
        Status: false,
        Data: null,
        Error: "Σφάλμα Εξουσιοδήτησης",
        Description: "Η διαδίκασία δεν ολοκληρώθηκε",
      };
    }
    return { Status: true, Data: info_response_data.Data };
  };
  const DetermineIfAuth = async (
    response: BaseUserAuthStateResponse,
    byInternalUse: boolean = false
  ): Promise<InternalDataTransfter<boolean>> => {
    const { openAlert, setTypeOfAlert } = useAlert();
    if (!response) {
        store.dispatch("setAuthState", false);
        store.dispatch("clearUserDataDetails");
        store.dispatch("clearSeededProfessors");
        store.dispatch("clearPeriodInfo");
      return {
        Status: false,
        Data: false,
        Error: "Σφάλμα Αυθεντικοποίησης",
        Description: "Η διαδίκασία δεν ολοκληρώθηκε",
      };
    }
    if (response.IsAuth === false || !response.IsAuth) {
      store.dispatch("setAuthState", false);
        store.dispatch("clearUserDataDetails");
        store.dispatch("clearSeededProfessors");
        store.dispatch("clearPeriodInfo");
      return {
        Status: false,
        Data: false,
        Error: "Σφάλμα Αυθεντικοποίησης",
        Description: "Η διαδίκασία δεν ολοκληρώθηκε",
      };
    }
    if (!response.UserDataDetails) {
      store.dispatch("setAuthState", false);
        store.dispatch("clearUserDataDetails");
        store.dispatch("clearSeededProfessors");
        store.dispatch("clearPeriodInfo");
      return {
        Status: false,
        Data: false,
        Error: "Σφάλμα Αυθεντικοποίησης",
        Description: "Η διαδίκασία δεν ολοκληρώθηκε",
      };
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
      store.dispatch("setPeriodInfo",response.PeriodInfo);
      if (byInternalUse === false) {
        openAlert("Επιτυχής Σύνδεση");
        setTypeOfAlert("success");
      }
      return { Status: true, Data: true };
    } else if (
      response.UserDataDetails.EduPersonAffiliation === TypeStaff.STUDENT
    ) {
      store.dispatch("setIsStudentState", payload);
      store.dispatch("setUserDataDetails", response.UserDataDetails);
      store.dispatch("setPeriodInfo",response.PeriodInfo);
      if (byInternalUse === false) {
        openAlert("Επιτυχής Σύνδεση");
        setTypeOfAlert("success");
      }
      return { Status: true, Data: true };
    } else if (
      response.UserDataDetails.EduPersonAffiliation === TypeStaff.ADMIN
    ) {
      store.dispatch("setIsAdminState", payload);
      store.dispatch("setUserDataDetails", response.UserDataDetails);
      store.dispatch("setPeriodInfo",response.PeriodInfo);
      if (byInternalUse === false) {
        openAlert("Επιτυχής Σύνδεση");
        setTypeOfAlert("success");
      }
      return { Status: true, Data: true };
    } else {
      store.dispatch("setAuthState", false);
        store.dispatch("clearUserDataDetails");
        store.dispatch("clearSeededProfessors");
        store.dispatch("clearPeriodInfo");
    
      return {
        Status: false,
        Data: false,
        Error: "Σφάλμα Αυθεντικοποίησης",
        Description: "Η διαδίκασία δεν ολοκληρώθηκε",
      };
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
    GetPeriodInfo
  };
}
