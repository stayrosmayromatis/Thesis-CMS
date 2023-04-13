import { TypeStaff } from "@/enums/StaffTypeEnum";
import { UserDataDetails } from "@/models/BACKEND-MODELS/UserDataDetails";
import { BaseUser } from "../models/BACKEND-MODELS/BaseUser";

export interface StoreSth {
  authState: boolean;
  isTeacher:boolean;
  isStudent:boolean;
  isAdmin : boolean;
  eduPersonAffiliation: TypeStaff;
}
const setAuthState = (context: any, authState: boolean) => {
  if (authState === null || authState === undefined) return;
  context.commit("setAuthState", authState);
};
const setIsTeacherState = (context: any, payload: StoreSth) => {
  if (
    !payload ||
    !payload.authState ||
    !payload.eduPersonAffiliation ||
    payload.eduPersonAffiliation !== TypeStaff.STAFF
  )
    return;
  context.commit("setIsTeacherState", payload);
};
const setIsStudentState = (context: any, payload: StoreSth) => {
  if (
    !payload ||
    !payload.authState ||
    !payload.eduPersonAffiliation ||
    payload.eduPersonAffiliation !== TypeStaff.STUDENT
  )
    return;
  context.commit("setIsStudentState", payload);
};
const setIsAdminState = (context: any, payload: StoreSth) => {
  if (
    !payload ||
    !payload.authState ||
    !payload.eduPersonAffiliation ||
    payload.eduPersonAffiliation !== TypeStaff.ADMIN
  )
    return;
  context.commit("setIsAdminState", payload);
};

const setUserDataDetails = (context: any, payload: UserDataDetails) => {
  if (!payload) return;
  context.commit("setUserDataDetails", payload);
};

const setSeededProfessors = (context: any, payload: Array<BaseUser>) => {
  if (!payload || payload.length === 0) return;
  context.commit("setSeededProfessors", payload);
};

const addSeededProfessors = (context:any,payload:BaseUser) => {
  if (!payload) return;
  context.commit("addSeededProfessors", payload);
}

export default {
  setAuthState,
  setIsTeacherState,
  setIsStudentState,
  setUserDataDetails,
  setSeededProfessors,
  addSeededProfessors,
  setIsAdminState
};
