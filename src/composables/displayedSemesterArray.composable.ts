import { LabSemesterEnum } from "@/enums/LabSemesterEnum";
import { DisplayedSemster } from "@/models/displayedsemester.type";
import { ref } from "vue";
import { useAxiosInstance } from "./useInstance.composable";
import { useAxios } from "@vueuse/integrations/useAxios";
import { CourseController } from "@/config";
import { ApiResult } from "@/models/DTO/ApiResult";
import { DisplaySemestersResponse } from "@/models/BACKEND-MODELS/DisplaySemestersResponse";

const DisplayedLabs = ref([
  {
      title: "A XΕΙΜΕΡΙΝΟ",
      value:LabSemesterEnum.A_XEIM,
      isActive:false
    },
    {
      title: "Β ΕΑΡΙΝΟ",
      value:LabSemesterEnum.B_EAR,
      isActive:false
    },
    {
      title: "Γ ΧΕΙΜΕΡΙΝΟ",
      value:LabSemesterEnum.C_XEIM,
      isActive:false
    },
    {
      title: "Δ ΕΑΡΙΝΟ",
      value:LabSemesterEnum.D_EAR,
      isActive:false
    },
    {
      title: "Ε ΧΕΙΜΕΡΙΝΟ",
      value:LabSemesterEnum.E_XEIM,
      isActive:false
    },
    {
      title: "ΣΤ ΕΑΡΙΝΟ",
      value:LabSemesterEnum.ST_EAR,
      isActive:false
    },
    {
      title: "Ζ ΧΕΙΜΕΡΙΝΟ",
      value:LabSemesterEnum.Z_XEIM,
      isActive:false
    },
    {
      title: "Η ΧΕΙΜΕΡΙΝΟ",
      value:LabSemesterEnum.H_EAR,
      isActive:false
    },
    {
      title: "Θ ΧΕΙΜΕΡΙΝΟ",
      value:LabSemesterEnum.TH_XEIM,
      isActive:false
    },
    {
      title: "Χ/Ε",
      value:LabSemesterEnum.GREATER,
      isActive:false
    },
]);
export function useDisplayedLabs() {
  const GetDisplayedLabs = async () =>{
    const { setBackendInstanceAuth}= useAxiosInstance();
    const getSemestersCall = await useAxios(
      CourseController+"semesters",
      {
        method: "GET",
      },
      setBackendInstanceAuth()
    );
    if(getSemestersCall.isFinished.value){
      const result:ApiResult<DisplaySemestersResponse> = getSemestersCall.data.value;
      if(result.Status && result.Data && result.Data.Count){
        DisplayedLabs.value = result.Data.Semesters.map((semester)=>{
          return {
            title:semester.DisplayTitle,
            value:semester.SemesterEnum,
            isActive:false
          }
        });
      }
    }
  }
  return {DisplayedLabs,GetDisplayedLabs}
}

