import { InternalDataTransfter } from '@/models/DTO/InternalDataTransfer';
//import { useAxios } from "@vueuse/integrations/useAxios";
import { useAxiosInstance } from "@/composables/useInstance.composable";
import { useErrorFunctions } from "@/composables/throwError.composable";
import { ApiResult } from "@/models/DTO/ApiResult";
import { BaseUser } from "@/models/BACKEND-MODELS/BaseUser";
import { store } from "@/store/index";
import { CreateProfRequest } from "@/components/UI/TeacherSelect.vue";
import { ref} from "vue";
import {AllProf} from "@/models/BACKEND-MODELS/AllProf";
import {BaseUserResponse} from "@/models/BACKEND-MODELS/BaseUserResponse";
import { CreateProfessorController, InfoController } from '@/config';
const SeedProfessorsArray = ref(new Array<BaseUser>());
export function useProfessor() {
  const GetSeededProfessors = async () => {
    const { MakeAPICall } = useAxiosInstance();
    const { setError } = useErrorFunctions();
    const api_response = await MakeAPICall<ApiResult<AllProf>>(InfoController,"get-all-prof","GET");
    if( !api_response ||
      !api_response.Status ||
      !api_response.Data ||
      !api_response.Data.Professors||
      !api_response.Data.Count){
        setError("Error fetching Teachers", "Try Again");
        return;
      }
      let arrayOfBaseUsers = new Array<Partial<BaseUser>>();
      const iterable = api_response.Data.Professors;

      for (const baseUser of iterable) {
        const obj: Partial<BaseUser> = {
          Guid: baseUser.Id,
          //id: undefined,
          displayNameEn: baseUser.DisplayNameEn,
          displayNameEl: baseUser.DisplayNameEl,
          eduPersonAffiliation: baseUser.EduPersonAffiliation,
        };
        arrayOfBaseUsers.push(obj);
      }
      if (!arrayOfBaseUsers || !arrayOfBaseUsers.length) {
        setError("Error fetching Teachers", "Try Again");
        return;
      }
      store.dispatch("setSeededProfessors", arrayOfBaseUsers);
      SeedProfessorsArray.value = store.getters.getSeededProfessors;
  };

  const CreateProfessor = async (payload: CreateProfRequest):Promise<InternalDataTransfter<BaseUser>> => {
    const { MakeAPICall } = useAxiosInstance();
    const { setError } = useErrorFunctions();
    if (!payload) {
      setError("Error creating teacher", "Try Again");
      return {Status :false,Data : null,Error : "Error on creating professor"};
    }
    const api_response = await MakeAPICall<ApiResult<BaseUserResponse>,CreateProfRequest>(CreateProfessorController,"create-professor","POST",payload);
    if (
      !api_response || !api_response.Status ||
      !api_response.Data
    ) {
      setError("Error fetching Teachers", "Try Again");
      return {Status :false,Data : null,Error : "Error on creating professor"};
    }
      const obj: BaseUser = {
        Guid: api_response.Data.Id,
        id: "",
        displayNameEn: api_response.Data.DisplayNameEn,
        displayNameEl: api_response.Data.DisplayNameEl,
        eduPersonAffiliation: api_response.Data.EduPersonAffiliation,
        titleEl : "",
        titleEn : ""
      };
      store.dispatch("addSeededProfessors", obj);
      SeedProfessorsArray.value = store.getters.getSeededProfessors;
      return {Status :true,Data : obj};
  };

  return {
    SeedProfessorsArray,
    GetSeededProfessors,
    CreateProfessor
  };
}
