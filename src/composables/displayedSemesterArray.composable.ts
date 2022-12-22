import { LabSemesterEnum } from "@/enums/LabSemesterEnum";
import { DisplayedSemster } from "@/types/displayedsemester.type";

export const displayedLabs= ():Array<DisplayedSemster>=>{
    return [
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
    ];
}