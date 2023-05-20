import { ActivityStatus } from "@/enums/ActivityStatusEnum";

export interface PeriodInfo {
    IsPeriodActive : boolean;
    SubmissionPeriodString? : string;
    PeriodActivityStatus? : ActivityStatus 
    PeriodActivityStatusString?:string;
  }