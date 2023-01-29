
import { UserDataDetails } from "@/models/BACKEND-MODELS/UserDataDetails";
import { State } from "@/models/stateInterface.type";
import { StoreSth } from "@/store/actions";

const setAuthState = (state: State, authState: boolean) => {
  state.IsAuth = authState;
  state.IsTeacher = state.IsStudent = false;
  state.IsStaffType = null;
  state.UserDataDetails = null;
};
const setIsTeacherState = (state: State, payload:StoreSth) => {
  state.IsAuth = true;
  state.IsTeacher = payload.authState;
  state.IsStaffType = payload.eduPersonAffiliation;
};
const setIsStudentState = (state: State, payload:StoreSth) => {
  state.IsAuth = true;
  state.IsStudent = payload.authState;
  state.IsStaffType = payload.eduPersonAffiliation;
};
const setUserDataDetails = (state:State,payload:UserDataDetails) =>
{
  state.UserDataDetails = payload;
}
export default { setAuthState, setIsTeacherState, setIsStudentState,setUserDataDetails };
