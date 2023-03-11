import { InternalDataTransfter } from './../models/DTO/InternalDataTransfer';
import { TypeStaff } from "@/enums/StaffTypeEnum";
import { useAxios } from "@vueuse/integrations/useAxios";

import { useAxiosInstance } from "@/composables/useInstance.composable";
import { useErrorFunctions } from "@/composables/throwError.composable";
import { ApiResult } from "@/models/DTO/ApiResult";
import { BaseUser } from "@/models/BACKEND-MODELS/BaseUser";
import { store } from "@/store/index";
import { CreateProfRequest } from "@/components/UI/TeacherSelect.vue";
import { Ref, ref} from "vue";

interface AllProf {
  BaseUser: BaseUserResponse;
  Courses?: Array<any>;
  Periods?: Array<any>;
}
interface BaseUserResponse {
  Id: string;
  FourDigitId: string;
  EduPersonAffiliation: TypeStaff;
  DisplayNameEl: string;
  DisplayNameEn: string;
}
const SeedProfessorsArray = ref<Array<BaseUser>>(new Array<BaseUser>());
export function useProfessor() {
  const GetSeededProfessors = async () => {
    const { setBackendInstanceAuth } = useAxiosInstance();
    const { setError } = useErrorFunctions();
    const api_response = await useAxios(
      "/info/get-all-prof",
      {
        method: "GET",
      },
      setBackendInstanceAuth()
    );
    if (api_response.isFinished) {
      const api_res_data: ApiResult<Array<AllProf>> = api_response.data.value;
      if (
        !api_res_data ||
        api_res_data.Status === false ||
        !api_res_data.Status ||
        !api_res_data.Data
      ) {
        setError("Error fetching Teachers", "Try Again");
        return;
      }
      let arrayOfBaseUsers = new Array<Partial<BaseUser>>();
      const iterable: Array<AllProf> = api_response.data.value.Data;
      for (const baseUser of iterable) {
        const obj: Partial<BaseUser> = {
          Guid: baseUser.BaseUser.Id,
          id: baseUser.BaseUser.FourDigitId,
          displayNameEn: baseUser.BaseUser.DisplayNameEn,
          displayNameEl: baseUser.BaseUser.DisplayNameEl,
          eduPersonAffiliation: baseUser.BaseUser.EduPersonAffiliation,
        };
        arrayOfBaseUsers.push(obj);
      }
      if (!arrayOfBaseUsers || arrayOfBaseUsers.length === 0) {
        setError("Error fetching Teachers", "Try Again");
        return;
      }
      store.dispatch("setSeededProfessors", arrayOfBaseUsers);
      SeedProfessorsArray.value = store.getters.getSeededProfessors;
      return;
    }
  };

  const CreateProfessor = async (payload: CreateProfRequest):Promise<InternalDataTransfter<BaseUser>> => {
    const { setBackendInstanceAuth } = useAxiosInstance();
    const { setError } = useErrorFunctions();
    if (!payload) {
      setError("Error creating teacher", "Try Again");
      return {Status :false,Data : null,Error : "Error on creating professor"};
    }
    const api_response = await useAxios(
      "/createprofessor/create-professor",
      {
        method: "POST",
        data: payload,
      },
      setBackendInstanceAuth()
    );
    if (api_response.isFinished) {
      const api_res_data: ApiResult<BaseUserResponse> = api_response.data.value;
      if (
        !api_res_data ||
        api_res_data.Status === false ||
        !api_res_data.Status ||
        !api_res_data.Data
      ) {
        setError("Error fetching Teachers", "Try Again");
        return {Status :false,Data : null,Error : "Error on creating professor"};
      }
      const obj: BaseUser = {
        Guid: api_res_data.Data.Id,
        id: api_res_data.Data.FourDigitId,
        displayNameEn: api_res_data.Data.DisplayNameEn,
        displayNameEl: api_res_data.Data.DisplayNameEl,
        eduPersonAffiliation: api_res_data.Data.EduPersonAffiliation,
        titleEl : "",
        titleEn : ""
      };
      store.dispatch("addSeededProfessors", obj);
      SeedProfessorsArray.value = store.getters.getSeededProfessors;
      return {Status :true,Data : obj};
    }
    setError("Error creating teacher", "Try Again");
    return {Status :false,Data : null,Error : "Error on creating professor"};
  };

  return {
    SeedProfessorsArray,
    GetSeededProfessors,
    CreateProfessor
  };
}
