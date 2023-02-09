import { TypeStaff } from '@/enums/StaffTypeEnum';
import { useAxios } from '@vueuse/integrations/useAxios';

import { useAxiosInstance } from "@/composables/useInstance.composable";
import { useErrorFunctions } from "@/composables/throwError.composable";
import { ApiResult } from '@/models/DTO/ApiResult';
import { BaseUser } from '@/models/BACKEND-MODELS/BaseUser';
import { store } from '@/store/index';

interface AllProf {
  BaseUser: BaseUserResponse,
  Courses?: Array<any>,
  Periods?: Array<any>,
};
interface BaseUserResponse {
  Id: string,
  FourDigitId: string,
  EduPersonAffiliation: TypeStaff,
  DisplayNameEl: string
  DisplayNameEn: string
}
export function useProfessor() {
  const GetSeededProfessors = async () => {
    const { setBackendInstanceAuth } = useAxiosInstance();
    const { setError } = useErrorFunctions();
    const api_response = await useAxios('/user/get-all-prof',
      {
        method: 'GET'
      },
      setBackendInstanceAuth()
    );
    if (api_response.isFinished) {
      const api_res_data: ApiResult<Array<AllProf>> = api_response.data.value;
      if (!api_res_data || api_res_data.Status === false || !api_res_data.Status || !api_res_data.Data) {
        setError('Error fetching Teachers', "Try Again");
        return;
      }
      let arrayOfBaseUsers = new Array<Partial<BaseUser>>();
      const iterable: Array<AllProf> = api_response.data.value.Data
      for (const baseUser of iterable) {
        const obj: Partial<BaseUser> = {
          Guid: baseUser.BaseUser.Id,
          id: baseUser.BaseUser.FourDigitId,
          displayNameEn: baseUser.BaseUser.DisplayNameEn,
          displayNameEl: baseUser.BaseUser.DisplayNameEl,
          eduPersonAffiliation: baseUser.BaseUser.EduPersonAffiliation
        }
        arrayOfBaseUsers.push(obj);
      }
      if(!arrayOfBaseUsers ||arrayOfBaseUsers.length === 0 )
      {
         setError('Error fetching Teachers', "Try Again");
        return;
      }
      store.dispatch('setSeededProfessors', arrayOfBaseUsers);
    }
  }

  return { GetSeededProfessors };
};
