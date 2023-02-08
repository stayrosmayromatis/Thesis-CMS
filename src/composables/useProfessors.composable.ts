import { useAxios } from '@vueuse/integrations/useAxios';

import {useAxiosInstance} from "@/composables/useInstance.composable";
import {useErrorFunctions} from "@/composables/throwError.composable";
import { ApiResult } from '../models/DTO/ApiResult';
import { BaseUser } from '../models/BACKEND-MODELS/BaseUser';
import { store } from '@/store/index';

interface AllProf {
  BaseUser : BaseUser,
  Courses? :Array<any>,
  Periods? :Array<any>,
};
interface GetAllProfResponse{
  AllProfessors : Array<AllProf>
};
export function useProfessor(){
  const GetSeededProfessors = async ()=>{
    const {setBackendInstanceAuth} = useAxiosInstance();
    const {setError} = useErrorFunctions();
    const api_response = await useAxios('/user/get-all-prof',
      {
        method:'GET'
      },
      setBackendInstanceAuth()
    );
    if(api_response.isFinished)
    {
      const api_res_data:ApiResult<GetAllProfResponse> = api_response.data.value;
      if(!api_res_data || api_res_data.Status === false || !api_res_data.Status || !api_res_data.Data)
      {
        setError('Error fetching Teachers',"Try Again");
        return;
      }
      let arrayOfBaseUsers = new Array<Partial<BaseUser>>();
      for(const baseUser of api_res_data.Data){

        console.log(baseUser.BaseUser);
        const obj:Partial<BaseUser> = {
          Guid : baseUser.BaseUser.Id,
          id : baseUser.BaseUser.FourDigitId,
          displayNameEn : baseUser.BaseUser.DisplayNameEn,
          displayNameEl: baseUser.BaseUser.DisplayNameEl,
          eduPersonAffiliation : baseUser.BaseUser.EduPersonAffiliation
        }
        arrayOfBaseUsers.push(obj);
      }
      store.dispatch('setSeededProfessors',arrayOfBaseUsers);
      console.log(arrayOfBaseUsers);

    }
  }

  return {GetSeededProfessors};
};
