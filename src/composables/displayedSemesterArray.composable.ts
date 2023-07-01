import { LabSemesterEnum } from "@/enums/LabSemesterEnum";
import { ref } from "vue";
import { useAxiosInstance } from "./useInstance.composable";
import { CourseController } from "@/config";
import { ApiResult } from "@/models/DTO/ApiResult";
import { DisplaySemestersResponse } from "@/models/BACKEND-MODELS/DisplaySemestersResponse";

const DisplayedLabs = ref([
  {
    title: "A XΕΙΜΕΡΙΝΟ",
    value: LabSemesterEnum.A_XEIM,
    isActive: false,
  },
  {
    title: "Β ΕΑΡΙΝΟ",
    value: LabSemesterEnum.B_EAR,
    isActive: false,
  },
  {
    title: "Γ ΧΕΙΜΕΡΙΝΟ",
    value: LabSemesterEnum.C_XEIM,
    isActive: false,
  },
  {
    title: "Δ ΕΑΡΙΝΟ",
    value: LabSemesterEnum.D_EAR,
    isActive: false,
  },
  {
    title: "Ε ΧΕΙΜΕΡΙΝΟ",
    value: LabSemesterEnum.E_XEIM,
    isActive: false,
  },
  {
    title: "ΣΤ ΕΑΡΙΝΟ",
    value: LabSemesterEnum.ST_EAR,
    isActive: false,
  },
  {
    title: "Ζ ΧΕΙΜΕΡΙΝΟ",
    value: LabSemesterEnum.Z_XEIM,
    isActive: false,
  },
  {
    title: "Η ΕΑΡΙΝΟ",
    value: LabSemesterEnum.H_EAR,
    isActive: false,
  },
  {
    title: "Θ ΧΕΙΜΕΡΙΝΟ",
    value: LabSemesterEnum.TH_XEIM,
    isActive: false,
  },
  {
    title: "Χ/Ε",
    value: LabSemesterEnum.GREATER,
    isActive: false,
  },
]);
export function useDisplayedLabs() {
  const GetDisplayedLabs = async (returnAllAsInitialized: boolean = false) => {
    if (returnAllAsInitialized){
      DisplayedLabs.value = [
        {
          title: "A XΕΙΜΕΡΙΝΟ",
          value: LabSemesterEnum.A_XEIM,
          isActive: false,
        },
        {
          title: "Β ΕΑΡΙΝΟ",
          value: LabSemesterEnum.B_EAR,
          isActive: false,
        },
        {
          title: "Γ ΧΕΙΜΕΡΙΝΟ",
          value: LabSemesterEnum.C_XEIM,
          isActive: false,
        },
        {
          title: "Δ ΕΑΡΙΝΟ",
          value: LabSemesterEnum.D_EAR,
          isActive: false,
        },
        {
          title: "Ε ΧΕΙΜΕΡΙΝΟ",
          value: LabSemesterEnum.E_XEIM,
          isActive: false,
        },
        {
          title: "ΣΤ ΕΑΡΙΝΟ",
          value: LabSemesterEnum.ST_EAR,
          isActive: false,
        },
        {
          title: "Ζ ΧΕΙΜΕΡΙΝΟ",
          value: LabSemesterEnum.Z_XEIM,
          isActive: false,
        },
        {
          title: "Η ΘΕΡΙΝΟ",
          value: LabSemesterEnum.H_EAR,
          isActive: false,
        },
        {
          title: "Θ ΧΕΙΜΕΡΙΝΟ",
          value: LabSemesterEnum.TH_XEIM,
          isActive: false,
        },
        {
          title: "Χ/Ε",
          value: LabSemesterEnum.GREATER,
          isActive: false,
        },
      ]
      return;
    }
    const { MakeAPICall } = useAxiosInstance();
    const getSemestersCall = await MakeAPICall<
      ApiResult<DisplaySemestersResponse>
    >(CourseController, "semesters", "GET");
    if (
      getSemestersCall &&
      getSemestersCall.Status &&
      getSemestersCall.Data &&
      getSemestersCall.Data.Count
    ) {
      DisplayedLabs.value = getSemestersCall.Data.Semesters.map((semester) => {
        return {
          title: semester.DisplayTitle,
          value: semester.SemesterEnum,
          isActive: false,
        };
      });
    }
  };
  return { DisplayedLabs, GetDisplayedLabs };
}
