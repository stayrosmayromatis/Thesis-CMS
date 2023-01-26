import { TypeStaff } from './../enums/StaffTypeEnum';
import { State } from "@/types/stateInterface.type";

export const state =():State=>{
    const stateObj : State = {
        isAuth:false,
        isStudent:false,
        isTeacher:false,
        isStaffType:undefined
    };
    return stateObj;
}



