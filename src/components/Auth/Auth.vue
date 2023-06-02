<template>
  <base-dialog :show="showErrorResult" :inner-description="showErrorDescription" :inner-title="showErrorTitle" :route-change-authorizer="false" @close-modal="closeModal"></base-dialog>
  <auth-in-progress v-if="!authenticationErrorOccured"></auth-in-progress>
</template>
<script lang="ts">
import { Ref, defineComponent, ref } from "vue";
import { onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useErrorFunctions } from "@/composables/throwError.composable";
import { useStore } from "vuex";
import { key } from "@/store/index";
import { useAxios } from "@vueuse/integrations/useAxios";
import { TypeStaff } from "@/enums/StaffTypeEnum";
import { useAxiosInstance } from "@/composables/useInstance.composable";
import { Student } from '@/models/BACKEND-MODELS/Student';
import { Staff } from '@/models/BACKEND-MODELS/Staff';
import { AccessTokenObject } from '@/models/accessTokenObject.type';
import { ApiResult } from '@/models/DTO/ApiResult';
import { InternalDataTransfter } from '@/models/DTO/InternalDataTransfer';
import { useAuth } from '@/composables/useAuth.composable';
import AuthInProgress from "@/components/Base/AuthInProgress.vue"
import BaseDialog from "@/components/Base/BaseDialog.vue";
import { AuthClientController } from "@/config";
export default defineComponent({
  components: {
    AuthInProgress,
    BaseDialog
  },
  emits: ["closeMobileView"],
  setup(_,context) {
    const route = useRoute();
    const router = useRouter();
    const store = useStore(key);
    const {
      setCustomInstance,
      //setBackendInstanceUnAuth,
    } = useAxiosInstance();
    const { MakeInfoCall, DetermineIfAuth } = useAuth();
    const {MakeAPICall} = useAxiosInstance();
    const showErrorResult = ref(false);
    const showErrorTitle=ref("Σφάλμα Αυθεντικοποίησης"); 
    const showErrorDescription = ref("Η διαδίκασία δεν ολοκληρώθηκε");
    const authenticationErrorOccured = ref(false);
    onMounted(async () => {
      context.emit("closeMobileView");
      const hasQueryParams = Object.keys(route.query);
      const queryParamsLength = hasQueryParams.length;
      if(!hasQueryParams || !queryParamsLength || queryParamsLength <= 1 || queryParamsLength >= 3){
        await setErrorPushToHome("Σφάλμα Αυθεντικοποίησης", "Η διαδίκασία δεν ολοκληρώθηκε");
        return;
      }
      const makeAccessCallResponse = await makeAccessTokenCall();
      if (!makeAccessCallResponse || !makeAccessCallResponse.Status || makeAccessCallResponse.Error || !makeAccessCallResponse.Data){
          await setErrorPushToHome(
          "Σφάλμα Αυθεντικοποίησης",
          "Η διαδίκασία δεν ολοκληρώθηκε"
        );
        return;
      }
      const makeProfileCallResponse = await makeProfileCall(makeAccessCallResponse.Data);
      if (!makeProfileCallResponse || !makeProfileCallResponse.Status || makeProfileCallResponse.Error || !makeProfileCallResponse.Data){
        await setErrorPushToHome(
          "Σφάλμα Αυθεντικοποίησης",
          "Η διαδίκασία δεν ολοκληρώθηκε"
        );
        return;
      }
      const signInResponse = await makeSignInCall(makeProfileCallResponse.Data);
      if (!signInResponse || !signInResponse.Status || signInResponse.Error || !signInResponse.Data){
        await setErrorPushToHome(
          "Σφάλμα Αυθεντικοποίησης",
          "Η διαδίκασία δεν ολοκληρώθηκε"
        );
        return;
      }
      const makeInfoCallResponse = await MakeInfoCall();
      if (!makeInfoCallResponse || !makeInfoCallResponse.Status || makeInfoCallResponse.Error || !makeInfoCallResponse.Data) {
        await setErrorPushToHome(
          makeInfoCallResponse.Error,
          makeInfoCallResponse.Description
        );
        return;
      }
      const determineIfAuthResponse = await DetermineIfAuth(makeInfoCallResponse.Data);
      if (!determineIfAuthResponse || !determineIfAuthResponse.Status || determineIfAuthResponse.Error || !determineIfAuthResponse.Data) {
        await setErrorPushToHome(
          determineIfAuthResponse.Error,
          determineIfAuthResponse.Description
        );
        return;
      }
      router.replace({ name: 'submittedLabs' });
      return;
    });

    const setErrorPushToHome = async (title?: string, description?: string): Promise<void> => {
      const { setError } = useErrorFunctions();
      setError(title ?? "Σφάλμα Αυθεντικοποίησης", description ?? "Η διαδίκασία δεν ολοκληρώθηκε");
      authenticationErrorOccured.value = true;
      showErrorResult.value = true;
      showErrorDescription.value = `Η αυθεντικοποίηση <span style="color:#ff4545"><b>απέτυχε</b></span>. 
                                    Προσπαθήστε εκ νέου την διαδικασία <span style="color:#ff4545">Σύνδεσης</span>. 
                                    Αυτόματη ανακατεύθυνση σε <span style="color:green">2 δευτερόλεπτα</span>`;
     
      store.dispatch("setAuthState", false);
      store.dispatch("clearUserDataDetails");
      store.dispatch("clearSeededProfessors");
      await delay(1000);
      await router.replace({ name: "welcome" });
    };
    const closeModal = async () => {
      showErrorResult.value = false;
    }
    const makeAccessTokenCall = async (): Promise<InternalDataTransfter<string>> => {
      if (!route.query.code) {
        await setErrorPushToHome("Σφάλμα Αυθεντικοποίησης", "Η διαδίκασία δεν ολοκληρώθηκε");
        return { Status: false, Data: null, Error: "error" };
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
      
      if (access_token_object.isFinished.value && (access_token_object.error.value || !access_token_object.data.value)) {
        await setErrorPushToHome("Σφάλμα Αυθεντικοποίησης", "Η διαδίκασία δεν ολοκληρώθηκε");
        return { Status: false, Data: null, Error: "error" };
      }
      return { Status: true, Data: access_token_object.data.value!.access_token };

    };
    const makeProfileCall = async (accessToken: string): Promise<InternalDataTransfter<Staff | Student>> => {
      if (!accessToken)
        return { Status: false, Data: null, Error: "error" };

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
        await setErrorPushToHome("Μη Εξουσιοδοτημένη Κλήση", "Προσπαθήστε ξανά");
        return { Status: false, Data: null, Error: "error" };
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
            dm:undefined,
          admin:undefined,
          am:undefined,
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
          dm:undefined,
          admin:undefined,
        };
      } else {
        await setErrorPushToHome("Μη Εξουσιοδοτημένη Κλήση", "Προσπαθήστε ξανά");
        return { Status: false, Data: null, Error: "error" };
      }
      if (!objectToPush) {
        await setErrorPushToHome("Μη Εξουσιοδοτημένη Κλήση", "Προσπαθήστε ξανά");
        return { Status: false, Data: null, Error: "error" };
      }
      return { Status: true, Data: objectToPush };
    };
    const makeSignInCall = async (object: Student | Staff): Promise<InternalDataTransfter<boolean>> => {
      if (!object)
        return { Status: false, Data: null, Error: "error" };
      
      const sign_in_response = await MakeAPICall<ApiResult<string>, Student | Staff>(AuthClientController,"sign-in","POST",object);
      //   const sign_in_response = await useAxios(
      //   AuthClientController+"sign-in",
      //   {
      //     method: "POST",
      //     data: object,
      //   },
      //   setBackendInstanceUnAuth()
      // );
      if (!sign_in_response || !sign_in_response.Status || !sign_in_response.Data ||  sign_in_response.Data !== "OK") {
        await setErrorPushToHome("Σφάλμα Αυθεντικοποίησης", "Προσπαθήστε ξανά");
        return { Status: false, Data: null, Error: "error" };
      }
      

      // if (sign_in_response.isFinished.value && (!sign_in_response.data.value || sign_in_response.error.value)) {
      //   await setErrorPushToHome("Σφάλμα Αυθεντικοποίησης", "Προσπαθήστε ξανά");
      //   return { Status: false, Data: null, Error: "error" };
      // }
      // const sign_in_response_data: ApiResult<string> = sign_in_response.data.value;
      // if (!sign_in_response_data || sign_in_response_data.Status === false || !sign_in_response_data.Status || !sign_in_response_data.Data) {
      //   await setErrorPushToHome("Σφάλμα Αυθεντικοποίησης", "Προσπαθήστε ξανά");
      //   return { Status: false, Data: null, Error: "error" };
      // }
      return { Status: true, Data: true };
    };
    const delay = (ms: number) => new Promise(res => setTimeout(res, ms));
    return {showErrorResult,showErrorDescription,showErrorTitle,authenticationErrorOccured,closeModal};
  },
});
</script>
