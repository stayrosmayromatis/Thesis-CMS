import { TypeStaff } from "@/enums/StaffTypeEnum";
import { State } from "@/types/stateInterface.type";

const setAuthState = (state:State,authState:boolean) => {
    state.isAuth = authState;
    state.isTeacher = state.isStudent = false;
    state.isStaffType = undefined;
    return;
}
const setIsTeacherState = (state:State, teacherState: boolean) => {
    state.isTeacher = teacherState;
    if(!teacherState)
    {
        state.isStaffType = undefined;
        return;
    }
    state.isStaffType = TypeStaff.STAFF;
    return;
}
const setIsStudentState = (state:State, studentState: boolean) => {
    state.isStudent = studentState;
    if(!studentState)
    {
        state.isStaffType = undefined;
        return;
    }
    state.isStaffType = TypeStaff.STUDENT;
    return;
}
export default {setAuthState,setIsTeacherState,setIsStudentState};