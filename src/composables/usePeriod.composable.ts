import { Ref, ref } from "vue";
import { useAxiosInstance } from "@/composables/useInstance.composable";
import { useAxios } from "@vueuse/integrations/useAxios";
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
        const {setBackendInstanceAuth} = useAxiosInstance();
        const getPeriodStateCall = await useAxios(
            CourseController+'period/state',
            {
                method:'GET'
            },
            setBackendInstanceAuth()
        )
        if(!getPeriodStateCall ||!getPeriodStateCall.isFinished.value){
            IsPeriodActive.value = false;
            return;
        }
        const periodState:ApiResult<PeriodInfo> = getPeriodStateCall.data.value;
        if(!periodState || !periodState.Status || !periodState.Data){
            IsPeriodActive.value = false;
            return;
        }
        if(periodState.Data){
            IsPeriodActive.value = periodState.Data.IsPeriodActive;
            PeriodActivityStatus.value = periodState.Data.PeriodActivityStatus ?? undefined;
            PeriodActivityStatusString.value = periodState.Data.PeriodActivityStatusString ?? undefined;
            SubmissionPeriodString.value = periodState.Data.SubmissionPeriodString ?? undefined;
        }
    }
    return {IsPeriodActive, PeriodActivityStatusString,PeriodActivityStatus,SubmissionPeriodString,GetPeriodState};
}