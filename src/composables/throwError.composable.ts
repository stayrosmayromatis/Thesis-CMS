import { ref } from 'vue'
const isError = ref<boolean>(false);
const errorTitle = ref<string>("")
const errorDescription = ref<string>("")

export function useErrorFunctions() {

    const setError = (title: string, description: string) => {
        if (!isError.value) {
            errorTitle.value = title;
            errorDescription.value = description;
            isError.value = true;
            return;
        }
        errorTitle.value = title;
        errorDescription.value = description;
        return;
    }
    const clearError = () => {
        if (isError.value) {
            errorTitle.value = "";
            errorDescription.value = "";
            isError.value = false;
            return;
        }
        errorTitle.value = "";
        errorDescription.value = "";
        return;
    }

    return { setError, clearError, isError, errorTitle, errorDescription }
}
