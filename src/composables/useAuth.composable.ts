import { store } from "@/store/index";
import { TypeStaff } from "@/enums/StaffTypeEnum";
import { UserDataDetails } from "@/models/BACKEND-MODELS/UserDataDetails";
import {useAxiosInstance} from '@/composables/useInstance.composable';
import { useAxios } from '@vueuse/integrations/useAxios';
import { InternalDataTransfter } from '@/models/DTO/InternalDataTransfer';
import { BaseUserAuthStateResponse } from '@/models/BACKEND-MODELS/BaseUserAuthStateResponse';
import { ApiResult } from '@/models/DTO/ApiResult';
import { StoreSth } from "@/store/actions";
import { useAlert } from "@/composables/showAlert.composable";
export function useAuth() {

  const IsAuthenticated = async (): Promise<boolean> => {
    try {
      const info_result = await MakeInfoCall();
      if(!info_result || info_result.Status === false || info_result.Error || !info_result.Data)
        return false;
      const auth_response = await DetermineIfAuth(info_result.Data);
      if(!auth_response || auth_response.Status === false ||auth_response.Data ===false ||  auth_response.Error)
        return false;
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  };
  const SetNotAuthenticated = async ():Promise<void> => {
    const {setBackendInstanceAuth} = useAxiosInstance();
    const {openAlert,setTypeOfAlert}=useAlert();
    const logout_response = await useAxios("/authclient/sign-out",
    {
      method:"POST",
    },
    setBackendInstanceAuth());
    if(logout_response.isFinished)
    {
      openAlert('Επιτυχής Αποσύνδεση');
      setTypeOfAlert('success');
    }
    store.dispatch('setAuthState',false);
    return;
  }
  const GetTypeStaff = (): TypeStaff | null => {
    try {
      return store.getters.getStaffType ?? null;
    } catch (error) {
      console.log(error);
      return null;
    }
  };
  const IsTeacher = async ():Promise<boolean> => await IsAuthenticated() === true && GetTypeStaff() === TypeStaff.STAFF;
  const IsStudent = async ():Promise<boolean> => await IsAuthenticated() === true &&  GetTypeStaff() === TypeStaff.STUDENT;

  const GetUserDataDetails = (): UserDataDetails | null => {
    try {
      return store.getters.getUserDataDetails ?? null;
    } catch (error) {
      console.log(error);
      return null;
    }
  };
  const MakeInfoCall = async ():Promise<InternalDataTransfter<BaseUserAuthStateResponse>>=>{
    const {setBackendInstanceAuth} = useAxiosInstance();
    const info_response = await useAxios("/info/infos",setBackendInstanceAuth());
    if (info_response.isFinished.value && ( !info_response.data.value || info_response.error.value) )
    {
      store.dispatch('setAuthState',false);
      return {Status:false,Data:null,Error: "Σφάλμα Εξουσιοδήτησης",Description:"Η διαδίκασία δεν ολοκληρώθηκε"};
    }
    const info_response_data: ApiResult<BaseUserAuthStateResponse> =info_response.data.value;
    if (!info_response_data || info_response_data.Status === false || !info_response_data.Status || !info_response_data.Data)
    {
      store.dispatch('setAuthState',false);
      return {Status:false,Data:null,Error: "Σφάλμα Εξουσιοδήτησης",Description:"Η διαδίκασία δεν ολοκληρώθηκε"};
    }
    return {Status:true,Data:info_response_data.Data}
  }
  const DetermineIfAuth = async (response:BaseUserAuthStateResponse):Promise<InternalDataTransfter<boolean>> => {
    const {openAlert,setTypeOfAlert,}=useAlert();
    if(!response)
    {
      store.dispatch('setAuthState',false);
      return {Status:false,Data:false,Error: "Σφάλμα Αυθεντικοποίησης",Description:"Η διαδίκασία δεν ολοκληρώθηκε"};
    }
    if(response.IsAuth === false || !response.IsAuth)
    {
      store.dispatch('setAuthState',false);
      return {Status:false,Data:false,Error: "Σφάλμα Αυθεντικοποίησης",Description:"Η διαδίκασία δεν ολοκληρώθηκε"};
    }
    if(!response.UserDataDetails)
    {
      store.dispatch('setAuthState',false);
      return {Status:false,Data:false,Error: "Σφάλμα Αυθεντικοποίησης",Description:"Η διαδίκασία δεν ολοκληρώθηκε"};
    }
    const payload:StoreSth = {
      authState:response.IsAuth,
      eduPersonAffiliation:response.UserDataDetails.EduPersonAffiliation
    }
    if(response.UserDataDetails.EduPersonAffiliation === TypeStaff.STAFF)
    {
      store.dispatch('setIsTeacherState',payload);
      store.dispatch('setUserDataDetails', response.UserDataDetails);
      openAlert('Επιτυχής Σύνδεση');
      setTypeOfAlert('success');
      return {Status:true,Data:true};
    }
    else if(response.UserDataDetails.EduPersonAffiliation === TypeStaff.STUDENT)
    {
      store.dispatch('setIsStudentState',payload);
      store.dispatch('setUserDataDetails', response.UserDataDetails);
      openAlert('Επιτυχής Σύνδεση');
      setTypeOfAlert('success');
      return {Status:true,Data:true};
    }
    else
    {
       store.dispatch('setAuthState',false);
       return {Status:false,Data:false,Error: "Σφάλμα Αυθεντικοποίησης",Description:"Η διαδίκασία δεν ολοκληρώθηκε"};
    }
  }

  return { IsAuthenticated, GetTypeStaff,GetUserDataDetails ,SetNotAuthenticated,IsTeacher,IsStudent,MakeInfoCall,DetermineIfAuth};
}
