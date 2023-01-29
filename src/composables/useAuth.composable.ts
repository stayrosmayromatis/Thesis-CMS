import { useStore } from "vuex";
import { key } from "@/store/index";
import { TypeStaff } from "@/enums/StaffTypeEnum";
import { UserDataDetails } from "@/models/BACKEND-MODELS/UserDataDetails";

export function useAuth() {

  const IsAuthenticated = (): boolean => {
    try {
      const store = useStore(key);
      return store.getters.IsAuth ?? false;
    } catch (error) {
      console.log(error);
      return false;
    }
  };
  const SetNotAuthenticated = ():void => {
    const store = useStore(key);
    store.commit('setAuthState',false);
    return;
  }
  const GetTypeStaff = (): TypeStaff | null => {
    try {
      const store = useStore(key);
      return store.getters.getStaffType ?? null;
    } catch (error) {
      console.log(error);
      return null;
    }
  };
  const IsTeacher = ():boolean =>IsAuthenticated() === true && GetTypeStaff() === TypeStaff.STAFF;
  const IsStudent = ():boolean => IsAuthenticated() === true &&  GetTypeStaff() === TypeStaff.STUDENT;

  const GetUserDataDetails = (): UserDataDetails | null => {
    try {
      const store = useStore(key);
      return store.getters.getUserDataDetails ?? null;
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  return { IsAuthenticated, GetTypeStaff,GetUserDataDetails ,SetNotAuthenticated,IsTeacher,IsStudent};
}
