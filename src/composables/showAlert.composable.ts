import { ref } from 'vue'
const typeOfAlert = ref<string>('success');
const title = ref<string>("")
const showAlert = ref<boolean>(false);

export function useAlert() {
    const openAlert = () => {
        showAlert.value = true;
    }
    const closeAlert = () => {
        showAlert.value = false;
    }
    const setTitle = (val:string) => {
        title.value = val;
    }
    const clearTitle = () => {
        title.value = "";
    }
    const setTypeOfAlert = (val:string) => {
        if(!val)
        {
            typeOfAlert.value = 'success';    
            return;
        }
        if(val !== 'success' && val !== 'error' && val !== 'info' )
        {
            typeOfAlert.value = 'success';    
            return;
        }
        typeOfAlert.value = val;
    } 
    return { typeOfAlert,title,showAlert,openAlert,closeAlert, setTitle, clearTitle,setTypeOfAlert };
}
