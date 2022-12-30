import { State } from "@/types/stateInterface.type";

export const state =():State=>{
    const stateObj : State = {
        isAuth:true,
        isStudent:false,
        isTeacher:false
    };
    return stateObj;
}



