import { State } from "@/models/stateInterface.type";
import { UserDataDetails } from '@/models/BACKEND-MODELS/UserDataDetails';
import { TypeStaff } from '@/enums/StaffTypeEnum';
import { BaseUser } from "@/models/BACKEND-MODELS/BaseUser";
import { PeriodInfo } from "@/models/BACKEND-MODELS/BaseUserAuthStateResponse";
const IsAuth=(state: State):boolean => {
        return state.IsAuth;
    }
const IsStudent=(state: State) => {
        return state.IsStudent;
    }
const IsTeacher=(state: State) => {
        return state.IsStudent;
    }
const getStaffType=(state:State):TypeStaff | undefined=>{
    return state.IsStaffType;
}
const getUserDataDetails = (state:State): UserDataDetails | undefined => {
  return state.UserDataDetails;
}
const getSeededProfessors = (state:State):Array<Partial<BaseUser>> => {
  return state.SeededProfessors ?? Array<BaseUser>();
}
const getPeriodInfo = (state:State) : PeriodInfo | undefined => {
  return state.PeriodInfo;
}
export default {
  getSeededProfessors,
  IsAuth,
  getPeriodInfo,
  IsStudent,IsTeacher,getStaffType,getUserDataDetails};
