
import { State } from "@/models/stateInterface.type";
import { BaseUser } from '../models/BACKEND-MODELS/BaseUser';
export const state =():State=>{
    const stateObj : State = {
        IsAuth:false,
        IsStudent:false,
        IsTeacher:false,
        IsStaffType:undefined,
        UserDataDetails : undefined,
        SeededProfessors : Array<BaseUser>(),
        PeriodInfo : undefined
    };
    return stateObj;
}



