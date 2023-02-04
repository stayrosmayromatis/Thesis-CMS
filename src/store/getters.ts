import { State } from "@/models/stateInterface.type";
import { UserDataDetails } from '@/models/BACKEND-MODELS/UserDataDetails';
import { TypeStaff } from '@/enums/StaffTypeEnum';
const IsAuth=(state: State):boolean => {
        return state.IsAuth;
    }
const IsStudent=(state: State) => {
        return state.IsStudent;
    }
const IsTeacher=(state: State) => {
        return state.IsStudent;
    }
const getStaffType=(state:State):TypeStaff | null=>{
    return state.IsStaffType;
}
const getUserDataDetails = (state:State):UserDataDetails | null => {
  return state.UserDataDetails ?? null
}
export default {
  IsAuth,
  IsStudent,IsTeacher,getStaffType,getUserDataDetails};
