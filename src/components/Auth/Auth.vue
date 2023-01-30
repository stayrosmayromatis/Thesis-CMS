<template></template>
<script lang="ts">
import { defineComponent } from "vue";
import { onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useErrorFunctions } from "@/composables/throwError.composable";
import { useStore } from "vuex";
import { key } from "@/store/index";
import { useAxios } from "@vueuse/integrations/useAxios";
import { TypeStaff } from "@/enums/StaffTypeEnum";
import { useAxiosInstance } from "@/composables/useInstance.composable";
import { Student} from '@/models/BACKEND-MODELS/Student';
import { Staff } from '@/models/BACKEND-MODELS/Staff';
import { AccessTokenObject } from '@/models/accessTokenObject.type';
import { ApiResult } from '@/models/DTO/ApiResult';
import { BaseUserAuthStateResponse } from '@/models/BACKEND-MODELS/BaseUserAuthStateResponse';
import { InternalDataTransfter } from '@/models/DTO/InternalDataTransfer';
import { StoreSth } from "@/store/actions";
import { useAlert } from "@/composables/showAlert.composable";

export default defineComponent({
  setup() {
    const route = useRoute();
    const router = useRouter();
    const store = useStore(key);
    const {
        setCustomInstance,
        setBackendInstanceUnAuth,
        setBackendInstanceAuth,
      } = useAxiosInstance();
    const {openAlert,setTitle,setTypeOfAlert,}=useAlert();
    onMounted(async () => {
      const hasQueryParams = Object.keys(route.query);
      const queryParamsLength = hasQueryParams.length;

      if (hasQueryParams) {
        if (queryParamsLength === 1) {
          setErrorPushToHome("Σφάλμα Αυθεντικοποίησης","Η διαδίκασία δεν ολοκληρώθηκε");
          return;
        }
        if (queryParamsLength === 2) {
          const makeAccessCallResponse = await makeAccessTokenCall();
          if(makeAccessCallResponse.Status === false || makeAccessCallResponse.Error || !makeAccessCallResponse.Data )
            return;
          const makeProfileCallResponse = await makeProfileCall(makeAccessCallResponse.Data);
          if(makeProfileCallResponse.Status === false || makeProfileCallResponse.Error || !makeProfileCallResponse.Data )
            return;
          const signInResponse = await makeSignInCall(makeProfileCallResponse.Data);
          if(signInResponse.Status === false || signInResponse.Error || !signInResponse.Data )
            return;
          const makeInfoCallResponse = await makeInfoCall();
           if(makeInfoCallResponse.Status === false || makeInfoCallResponse.Error || !makeInfoCallResponse.Data )
            return;
          await determineIfAuth(makeInfoCallResponse.Data);
          return;
        }
      }
      setErrorPushToHome(
        "Σφάλμα Αυθεντικοποίησης",
        "Η διαδίκασία δεν ολοκληρώθηκε"
      );
    });

    const setErrorPushToHome = (title: string, description: string): void => {
      const { setError } = useErrorFunctions();
      setError(title, description);
      store.dispatch("setAuthState", false);
      router.replace({ name: "welcome" });
      return;
    };
    const makeAccessTokenCall =async ():Promise<InternalDataTransfter<string>> => {
      if (!route.query.code) {
            setErrorPushToHome("Σφάλμα Αυθεντικοποίησης","Η διαδίκασία δεν ολοκληρώθηκε");
            return {Status : false,Data:null,Error:"error"};
          }
      const params = new URLSearchParams();
      params.append("client_id", import.meta.env.VITE_CLIENT_ID);
      params.append("client_secret", import.meta.env.VITE_CLIENT_SECRET);
      params.append("grant_type", "authorization_code");
      params.append("code", route.query.code.toString());
      const access_token_object = await useAxios<AccessTokenObject>(
        "/token",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Accept: "*/*",
          },
          data: params,
        },
        setCustomInstance("https://login.iee.ihu.gr")
      );
      if (access_token_object.isFinished.value && (access_token_object.error.value ||!access_token_object.data.value)) {
            setErrorPushToHome("Σφάλμα Αυθεντικοποίησης","Η διαδίκασία δεν ολοκληρώθηκε");
             return {Status : false,Data:null,Error:"error"};
      }
       return {Status : true,Data:access_token_object.data.value!.access_token,Error:null};

    };
    const makeProfileCall = async (accessToken:string):Promise<InternalDataTransfter<Staff|Student>> => {
      if(!accessToken )
           return {Status : false,Data:null,Error:"error"};

      const profileObject = await useAxios<any>(
        "/profile",
        {
          method: "GET",
          headers: {
            "Content-Type": "Type:application/json",
            Accept: "*/*",
            "x-access-token": `${accessToken}`,
          },
        },
        setCustomInstance("https://api.iee.ihu.gr")
      );
      if (profileObject.isFinished.value &&
        (profileObject.error.value || !profileObject.data.value)) {
        setErrorPushToHome("Μη Εξουσιοδοτημένη Κλήση", "Προσπαθήστε ξανά");
          return {Status : false,Data:null,Error:"error"};
      }

      let objectToPush: Staff | Student | null = null;
      //Determine where he is staff or student
      if (profileObject.data.value["eduPersonAffiliation"] === "staff") {
        objectToPush = {
          id: profileObject.data.value.id,
          displayNameEn: profileObject.data.value.displayName,
          displayNameEl: profileObject.data.value["displayName;lang-el"],
          eduPersonAffiliation: TypeStaff.STAFF,
          titleEn: profileObject.data.value.title,
          titleEl: profileObject.data.value["title;lang-el"],
          personalTitle: profileObject.data.value.personalTitle,
          eduPersonalEntitlementEn:
            profileObject.data.value.eduPersonalEntitlement,
          eduPersonalEntitlementEl:
            profileObject.data.value["eduPersonalEntitlement;lang-el"],
        };
      } else if (
        profileObject.data.value["eduPersonAffiliation"] === "student"
      ) {
        objectToPush = {
          id: profileObject.data.value.id,
          displayNameEn: profileObject.data.value.displayName,
          displayNameEl: profileObject.data.value["displayName;lang-el"],
          eduPersonAffiliation: TypeStaff.STUDENT,
          titleEn: profileObject.data.value.title,
          titleEl: profileObject.data.value["title;lang-el"],
          am: profileObject.data.value.am,
          userId: profileObject.data.value.uid,
          mail: profileObject.data.value.mail,
          regsem: profileObject.data.value.regsem,
          regyear: profileObject.data.value.regyear,
          semester: profileObject.data.value.sem,
        };
      } else {
        setErrorPushToHome("Μη Εξουσιοδοτημένη Κλήση", "Προσπαθήστε ξανά");
        return {Status : false,Data:null,Error:"error"};
      }
      if (!objectToPush) {
            setErrorPushToHome("Μη Εξουσιοδοτημένη Κλήση", "Προσπαθήστε ξανά");
            return {Status : false,Data:null,Error:"error"};
      }
      return {Status : true,Data:objectToPush,Error:null};
    };
    const makeSignInCall = async (object:Student | Staff):Promise<InternalDataTransfter<boolean>>=>
    {
      if(!object)
        return {Status : false,Data:null,Error:"error"};
      const sign_in_response = await useAxios(
          "/authclient/sign-in",
          {
            method: "POST",
            data: object,
          },
          setBackendInstanceUnAuth()
        );
        if (sign_in_response.isFinished.value &&(!sign_in_response.data.value ||sign_in_response.error.value))
        {
          setErrorPushToHome("Σφάλμα Αυθεντικοποίησης", "Προσπαθήστε ξανά");
          return {Status : false,Data:null,Error:"error"};
        }
        const sign_in_response_data: ApiResult<string> = sign_in_response.data.value;
        if (sign_in_response_data.Status === false ||!sign_in_response_data.Status || !sign_in_response_data.Data) {
          setErrorPushToHome("Σφάλμα Αυθεντικοποίησης", "Προσπαθήστε ξανά");
          return {Status : false,Data:null,Error:"error"};
        }
        return {Status:true,Data:true,Error:null};
    };
    const makeInfoCall = async ():Promise<InternalDataTransfter<BaseUserAuthStateResponse>>=>{
        const info_response = await useAxios("/info/infos",setBackendInstanceAuth());
        if (info_response.isFinished.value && ( !info_response.data.value || info_response.error.value) )
        {
            setErrorPushToHome(
              "Σφάλμα Εξουσιοδήτησης",
              "Η διαδίκασία δεν ολοκληρώθηκε"
            );
            return {Status:false,Data:null,Error:"error"};
          }
        const info_response_data: ApiResult<BaseUserAuthStateResponse> =info_response.data.value;
        if (!info_response_data || info_response_data.Status === false || !info_response_data.Status || !info_response_data.Data) {
          setErrorPushToHome(
            "Σφάλμα Εξουσιοδήτησης",
            "Η διαδίκασία δεν ολοκληρώθηκε"
          );
          return {Status:false,Data:null,Error:"error"};
        }
        return {Status:true,Data:info_response_data.Data,Error:null}
    }
    const determineIfAuth = async (response:BaseUserAuthStateResponse):Promise<void> => {
      if(!response)
      {
        store.dispatch('setAuthState',false);
        setErrorPushToHome("Σφάλμα Αυθεντικοποίησης","Η διαδίκασία δεν ολοκληρώθηκε");
      }
      if(response.IsAuth === false || !response.IsAuth)
      {
        store.dispatch('setAuthState',false);
        setErrorPushToHome("Σφάλμα Αυθεντικοποίησης","Η διαδίκασία δεν ολοκληρώθηκε");
      }
      if(!response.UserDataDetails)
      {
        store.dispatch('setAuthState',false);
        setErrorPushToHome("Σφάλμα Αυθεντικοποίησης","Η διαδίκασία δεν ολοκληρώθηκε");
      }
      const payload:StoreSth = {
        authState:response.IsAuth,
        eduPersonAffiliation:response.UserDataDetails.EduPersonAffiliation
      }
      if(response.UserDataDetails.EduPersonAffiliation === TypeStaff.STAFF)
      {
        store.dispatch('setIsTeacherState',payload);
        store.dispatch('setUserDataDetails', response.UserDataDetails);
        openAlert();
        setTitle('Επιτυχής Σύνδεση ως Καθηγητής');
        setTypeOfAlert('success');
        router.replace({name:'submittedLabs'});
      }
      else if(response.UserDataDetails.EduPersonAffiliation === TypeStaff.STUDENT)
      {
        store.dispatch('setIsStudentState',payload);
        store.dispatch('setUserDataDetails', response.UserDataDetails);
        openAlert();
        setTitle('Επιτυχής Σύνδεση ως Φοιτηής');
        setTypeOfAlert('success');
        router.replace({name:'submittedLabs'});
      }
      else
      {
         store.dispatch('setAuthState',false);
          setErrorPushToHome("Σφάλμα Αυθεντικοποίησης","Η διαδίκασία δεν ολοκληρώθηκε");
      }
      return;
    }
  },
});
</script>
