
import { InfoController ,CreateProfessorController,CourseController,StudentsController,AdminController } from '@/config';
import { AuthClientController } from '@/config';
import { store } from '@/store/index';
import { useAxios } from "@vueuse/integrations/useAxios";
import axios, { HttpStatusCode } from "axios";
import router from '@/router';
type AllowedControllers = typeof InfoController | typeof AuthClientController | typeof CourseController | typeof CreateProfessorController | typeof StudentsController | typeof AdminController;
type AllowedMethods = "GET" | "POST";
export function useAxiosInstance() {
  const setBackendInstanceUnAuth = () => {
    return axios.create({
      baseURL: import.meta.env.VITE_BACKEND_BASE_URI,
      withCredentials: true,
    });
  };
  const setBackendInstanceAuth = () => {
    return axios.create({
      baseURL: import.meta.env.VITE_BACKEND_BASE_URI,
      withCredentials: true,
    });
  };
  const setCustomInstance = (uri: string) => {
    return axios.create({
      baseURL: uri,
    });
  };

  const MakeAPICall = async <TResult,TPayload = undefined>(
    controller: AllowedControllers,
    endpoint: string,
    method: AllowedMethods = "GET",
    data?: TPayload,
    useBackEnd: boolean = true,
    customUri?: string
  ) => {
    try {
      if(useBackEnd && !controller && !endpoint ){
        throw new Error("No controller or endpoint provided");
      }
      if(useBackEnd && controller && !endpoint){
        throw new Error("No endpoint provided");
      }
      if(useBackEnd &&!controller || !endpoint || !method){
        throw new Error("Controller or Endpoint is undefined");
      }
      if(useBackEnd && controller && endpoint && method === "POST" && !data){
        throw new Error("Not sending payload on POST method");
      }
      if(controller && endpoint && method === "GET" && data){
        throw new Error("Get method does not accept payload");
      }
      if(!useBackEnd && !customUri){
        throw new Error("No custom uri provided");
      }
      const httpCall = await useAxios(
        controller + endpoint,
        {
          method: method,
          data: data,
        },
        useBackEnd ? setBackendInstanceAuth() : setCustomInstance(customUri!)
      );
      if(!httpCall.isFinished.value || httpCall.isAborted.value || httpCall.isCanceled.value){
        throw new Error("Http call did not finish ");
      }
      if (
        httpCall.error.value &&
        httpCall.error.value.response &&
        httpCall.error.value.response.status
      ) {
        switch (httpCall.error.value.response.status as HttpStatusCode) {
          case HttpStatusCode.BadRequest:
            throw new Error(`400 Bad Request of endpoint ${controller + endpoint}`);
          case HttpStatusCode.Unauthorized:
            await KickHimOutRN();
            throw new Error(`401 Unauthroized of endpoint ${controller + endpoint}`);
          case HttpStatusCode.Forbidden:
            await KickHimOutRN();
            throw new Error(`403 Forbidden of endpoint ${controller + endpoint}`);
          case HttpStatusCode.NotFound:
            throw new Error(`404 NotFound of endpoint ${controller + endpoint}`);
          case HttpStatusCode.InternalServerError:
            throw new Error(`500 ISE of endpoint ${controller + endpoint}`);
          default:
            throw new Error(`Generic Error occured at MakeAPICall of endpoint ${controller + endpoint}`);   
        }
      }
      if (
        httpCall.response.value &&
        (httpCall.response.value.status as HttpStatusCode) ===
          HttpStatusCode.Ok &&
        httpCall.response.value.statusText.trim().toLowerCase() ==
          "Ok".toLowerCase()
      ) {
        if(httpCall.response.value.data){
          const returnedVal = httpCall.response.value.data as TResult;
          if(!returnedVal){
            throw new Error("Data response couldn't be parsed");
          }
          return returnedVal;
        }
      }
      throw new Error("Couldn't parse Http Response Object")
    } 
    catch (error:any ) {
      console.error(`Api error call on exception with message: ${error}`);
      return  undefined;
    }
  };
  const KickHimOutRN = async () => {
    if(!store.getters.IsFirstTimeLogin){
      store.dispatch("setAuthState", false);
      store.dispatch("clearUserDataDetails");
      store.dispatch("clearSeededProfessors");
      store.dispatch("setFirstTimeLogin", true);
      await router.replace({ name: 'red' });
    }
  };

  return {
    setBackendInstanceUnAuth,
    setBackendInstanceAuth,
    setCustomInstance,
    MakeAPICall,
  };
}
//OLD CREDENTIALS
// VITE_CLIENT_ID=63d28218cf6c955cc75f458c
// VITE_CLIENT_SECRET=6bzk9trfo4y8rx32qmkkmai10hkte9agnks9qg0phr9wgsoe9g
//VITE_REDIRECT_URI=http://127.0.0.1:5132/auth
//VITE_BACK_END_URI = http://localhost:5301/api

//NEW CREDENTIALS DHLWSEIS 6 APP\
// VITE_BASE_URI=http://localhost:5132/
// VITE_REDIRECT_URI=http://localhost:5132/auth
// VITE_BACK_END_URI = http://localhost:5301/api
// VITE_CLIENT_ID=63da7a8d7cf7bb02d67317e5
// VITE_CLIENT_SECRET=0o603mdj68ppdziwfcmhbh73v8rr7tfs3874q57no64h4yra89
