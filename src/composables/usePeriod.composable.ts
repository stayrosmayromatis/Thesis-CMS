import { Ref, ref } from "vue";
import { useAxiosInstance } from "@/composables/useInstance.composable";
//import { useAxios } from "@vueuse/integrations/useAxios";
import { CourseController } from "@/config";
import { ApiResult } from "@/models/DTO/ApiResult";
import { PeriodInfo } from "@/models/BACKEND-MODELS/PeriodInfoResponse";
import { ActivityStatus } from "@/enums/ActivityStatusEnum";
const IsPeriodActive =ref(false);
const PeriodActivityStatusString: Ref<string|undefined> = ref();
const PeriodActivityStatus :Ref<ActivityStatus|undefined> = ref();
const SubmissionPeriodString : Ref<string|undefined> = ref();
export function usePeriod(){
    const GetPeriodState = async () => {
        //const {setBackendInstanceAuth} = useAxiosInstance();
        const {MakeAPICall} = useAxiosInstance();
        // const getPeriodStateCall = await useAxios(
        //     CourseController+'period/state',
        //     {
        //         method:'GET'
        //     },
        //     setBackendInstanceAuth()
        // )
        const getPeriodStateCall = await MakeAPICall<ApiResult<PeriodInfo>>(CourseController,'period/state','GET');
        if(!getPeriodStateCall ||!getPeriodStateCall.Status || !getPeriodStateCall.Data){
        //if(!getPeriodStateCall ||!getPeriodStateCall.isFinished.value){
            IsPeriodActive.value = false;
            return;
        }
        // const periodState:ApiResult<PeriodInfo> = getPeriodStateCall.data.value;
        // if(!periodState || !periodState.Status || !periodState.Data){
        //     IsPeriodActive.value = false;
        //     return;
        //}
        if(getPeriodStateCall.Data){
            IsPeriodActive.value = getPeriodStateCall.Data.IsPeriodActive;
            PeriodActivityStatus.value = getPeriodStateCall.Data.PeriodActivityStatus ?? undefined;
            PeriodActivityStatusString.value = getPeriodStateCall.Data.PeriodActivityStatusString ?? undefined;
            SubmissionPeriodString.value = getPeriodStateCall.Data.SubmissionPeriodString ?? undefined;
        }
        // if(periodState.Data){
        //     IsPeriodActive.value = periodState.Data.IsPeriodActive;
        //     PeriodActivityStatus.value = periodState.Data.PeriodActivityStatus ?? undefined;
        //     PeriodActivityStatusString.value = periodState.Data.PeriodActivityStatusString ?? undefined;
        //     SubmissionPeriodString.value = periodState.Data.SubmissionPeriodString ?? undefined;
        // }
    }
    return {IsPeriodActive, PeriodActivityStatusString,PeriodActivityStatus,SubmissionPeriodString,GetPeriodState};
}