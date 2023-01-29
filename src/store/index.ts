import { State } from "@/models/stateInterface.type";
import { createStore, Store } from "vuex";
import {state} from '@/store/state';
import actions from '@/store/actions';
import mutations from '@/store/mutations';
import getters from '@/store/getters';
import { InjectionKey } from "vue";
export const key : InjectionKey<Store<State>> = Symbol();

export const store = createStore<State>({
    state,
    getters,
    actions,
    mutations
});
