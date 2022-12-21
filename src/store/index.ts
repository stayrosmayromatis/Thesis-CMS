import { State } from "@/types/stateInterface.type";
import { createStore, Store } from "vuex";
import {state} from '@/store/state';
import getters from '@/store/getters';
import { InjectionKey } from "vue";
export const key : InjectionKey<Store<State>> = Symbol();

export const store = createStore<State>({
    state,
    getters,
    actions : {},
    mutations:{}
});