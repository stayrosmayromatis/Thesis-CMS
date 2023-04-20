import { ActivityStatus } from "@/enums/ActivityStatusEnum";
import { UserDataDetails } from "@/models/BACKEND-MODELS/UserDataDetails";

export interface BaseUserAuthStateResponse {
  IsAuth: boolean;
  UserDataDetails: UserDataDetails;
  PeriodInfo? : PeriodInfo;
}

export interface PeriodInfo {
  IsPeriodActive : boolean;
  SubmissionPeriodString : string;
  PeriodActivityStatus? : ActivityStatus 
}
