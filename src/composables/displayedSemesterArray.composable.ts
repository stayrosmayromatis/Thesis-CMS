import { LabSemesterEnum } from "@/enums/LabSemesterEnum";
import { DisplayedSemster } from "@/types/displayedsemester.type";

export const displayedLabs= ():Array<DisplayedSemster>=>{
    return [
        {
            title: "A XΕΙΜΕΡΙΝΟ",
            value:LabSemesterEnum.A_XEIM,
          },
          {
            title: "Β ΕΑΡΙΝΟ",
            value:LabSemesterEnum.B_EAR,
          },
          {
            title: "Γ ΧΕΙΜΕΡΙΝΟ",
            value:LabSemesterEnum.C_XEIM,
          },
          {
            title: "Δ ΕΑΡΙΝΟ",
            value:LabSemesterEnum.D_EAR,
          },
          {
            title: "Ε ΧΕΙΜΕΡΙΝΟ",
            value:LabSemesterEnum.E_XEIM,
          },
          {
            title: "ΣΤ ΕΑΡΙΝΟ",
            value:LabSemesterEnum.ST_EAR,
          },
          {
            title: "Ζ ΧΕΙΜΕΡΙΝΟ",
            value:LabSemesterEnum.Z_XEIM,
          },
    ];
}