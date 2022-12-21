import {useStore} from "vuex";
import {key} from "@/store/index";

export const isAuthenticated = ():boolean => {
    try {
        const store = useStore(key);
        return store.getters.IsAuth;
    } catch (error) {
        console.log(error);
        return false;
    }
}

