import { LabSemesterEnum } from "@/enums/LabSemesterEnum";

export interface DisplaySemestersResponse{
    Count : number;
    Semesters : DisplaySemesters[];
};
export interface DisplaySemesters{
    DisplayTitle:string;
     SemesterEnum:LabSemesterEnum;
    SemesterInt:number;
}