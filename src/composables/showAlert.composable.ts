import { ref } from 'vue'
const isError = ref<boolean>(false);
const title = ref<string>("")
const showAlert = ref<boolean>(false);

export function useAlert() {
    const invokeAlert = (val:boolean) => {
        showAlert.value = val;
    }
    const setTitle = (val:string) => {
        title.value = val;
    }
    const setTypeOfAlert = (val:boolean) => {
        isError.value = val;
    } 
    return { invokeAlert, setTitle, setTypeOfAlert };
}
