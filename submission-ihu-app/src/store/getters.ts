import { State } from "@/types/stateInterface.type";

const IsAuth=(state: State) => {
        return state.isAuth;
    }
const IsStudent=(state: State) => {
        return state.isStudent;
    }
const IsTeacher=(state: State) => {
        return state.isTeacher;
    }
export default {IsAuth,IsStudent,IsTeacher};