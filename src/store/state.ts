
import { State } from "@/models/stateInterface.type";
export const state =():State=>{
    const stateObj : State = {
        IsAuth:false,
        IsStudent:false,
        IsTeacher:false,
        IsStaffType:null,
        UserDataDetails : null
    };
    return stateObj;
}



