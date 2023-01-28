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
import axios from "axios";
export interface BaseUser {
  id: string;
  displayNameEn: string;
  displayNameEl: string;
  eduPersonAffiliation: TypeStaff;
  titleEn: string;
  titleEl: string;
}
export interface Student extends BaseUser {
  am: string;
  userId: string;
  mail?: string;
  regsem: string;
  regyear: string;
  semester: string;
}
export interface Staff extends BaseUser {
  personalTitle: string;
  eduPersonalEntitlementEn: string;
  eduPersonalEntitlementEl: string;
}
export interface AccessTokenObject {
  access_token: string;
  refresh_token: string;
  user: string;
}
export interface ApiResult<T> {
  Status: boolean;
  Data: T;
}
export interface BaseUserAuthStateResponse {
  IsAuth: boolean;
  SessionIdentified: string;
  UserDataDetails: UserDataDetails;
}
export interface UserDataDetails {
  FourDigitId: string;
  DisplayNameEn: string;
  DisplayNameEl: string;
  PersonAffiliation: string;
  EduPersonAffiliation: TypeStaff;
  EduPersonAffiliationString: string;
  TitleEn: string;
  TitleEl: string;
  Am: string;
  UserId: string;
  Mail: string;
  RegSem: string;
  RegYear: string;
  Semester: string;
  PersonalTitle: string;
  EduPersonalEntitlementEn: string;
  EduPersonalEntitlementEl: string;
}
export default defineComponent({
  setup() {
    const route = useRoute();
    const router = useRouter();
    const store = useStore(key);
    onMounted(async () => {
      const hasQueryParams = Object.keys(route.query);
      const queryParamsLength = hasQueryParams.length;
      const {
        setCustomInstance,
        setBackendInstanceUnAuth,
        setBackendInstanceAuth,
      } = useAxiosInstance();
      if (hasQueryParams) {
        if (queryParamsLength === 1) {
          setErrorPushToHome(
            "Σφάλμα Αυθεντικοποίησης",
            "Η διαδίκασία δεν ολοκληρώθηκε"
          );
          return;
        }
        if (queryParamsLength === 2) {
          if (!route.query.code) {
            setErrorPushToHome(
              "Σφάλμα Αυθεντικοποίησης",
              "Η διαδίκασία δεν ολοκληρώθηκε"
            );
            return;
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
          if ((access_token_object.isFinished.value &&
              access_token_object.error.value) ||
            !access_token_object.data.value) {
            setErrorPushToHome(
              "Σφάλμα Αυθεντικοποίησης",
              "Η διαδίκασία δεν ολοκληρώθηκε"
            );
            return;
          }
          const access_token = access_token_object.data.value.access_token;
          const profileObject = await useAxios<any>(
            "/profile",
            {
              method: "GET",
              headers: {
                "Content-Type": "Type:application/json",
                Accept: "*/*",
                "x-access-token": `${access_token}`,
              },
            },
            setCustomInstance("https://api.iee.ihu.gr")
          );
          if (profileObject.isFinished.value &&
            (profileObject.error.value || !profileObject.data.value)) {
            setErrorPushToHome("Μη Εξουσιοδοτημένη Κλήση", "Προσπαθήστε ξανά");
            return;
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
            return;
          }
          if (!objectToPush) {
            setErrorPushToHome("Μη Εξουσιοδοτημένη Κλήση", "Προσπαθήστε ξανά");
            return;
          }
          const sign_in_response = await useAxios(
            "/authclient/sign-in",
            {
              method: "POST",
              data: objectToPush,
            },
            setBackendInstanceUnAuth()
          );
          if ((sign_in_response.isFinished.value &&
              !sign_in_response.data.value) ||
            sign_in_response.error.value)
          {
            setErrorPushToHome("Σφάλμα Αυθεντικοποίησης", "Προσπαθήστε ξανά");
            return;
          }
          const sign_in_response_data: ApiResult<string> =sign_in_response.data.value;
          if (sign_in_response_data.Status === false ||!sign_in_response_data.Status) {
            setErrorPushToHome("Σφάλμα Αυθεντικοποίησης", "Προσπαθήστε ξανά");
            return;
          }

          const info_response = await useAxios(
            "/info/infos",
            setBackendInstanceAuth()
          );
          if (info_response.isFinished.value && ( !info_response.data.value || info_response.error.value) )
          {
             setErrorPushToHome(
                "Σφάλμα Εξουσιοδήτησης",
                "Η διαδίκασία δεν ολοκληρώθηκε"
              );
              return;
           }
          const info_response_data: ApiResult<BaseUserAuthStateResponse> =info_response.data.value;
          if (!info_response_data || info_response_data.Status === false || !info_response_data.Status) {
            setErrorPushToHome(
              "Σφάλμα Εξουσιοδήτησης",
              "Η διαδίκασία δεν ολοκληρώθηκε"
            );
            return;
          }
          console.log(info_response_data.Data);
          return;
        }
      }
      setErrorPushToHome(
        "Σφάλμα Αυθεντικοποίησης",
        "Η διαδίκασία δεν ολοκληρώθηκε"
      );
      return;
    });

    const setErrorPushToHome = (title: string, description: string): void => {
      const { setError } = useErrorFunctions();
      setError(title, description);
      store.dispatch("setAuthState", false);
      router.replace({ name: "welcome" });
      return;
    };
  },
});
</script>
