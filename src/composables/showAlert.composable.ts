import { AlertType } from "@/components/Base/BaseAlert.vue";
import { ref } from "vue";
const typeOfAlert = ref<AlertType>("success");
const alertTitle = ref<string>("");
const showAlert = ref<boolean>(false);

export function useAlert() {
  const openAlert = (val: string) => {
    if ((showAlert.value === true)) {
      showAlert.value = false;
    }
    showAlert.value = true;
    alertTitle.value = val;
  };
  const closeAlert = (byTimerInSeconds: number | undefined = undefined) => {
    if (showAlert.value === true) {
      if (!byTimerInSeconds) {
        showAlert.value = false;
        alertTitle.value = "";
        return;
      }
      setTimeout(() => {
        showAlert.value = false;
        alertTitle.value = "";
      }, byTimerInSeconds);
    }
  };

  const setTypeOfAlert = (val: AlertType) => {
    if (!val) {
      typeOfAlert.value = "info";
      return;
    }
    if (val !== "success" && val !== "error" && val !== "info") {
      typeOfAlert.value = "success";
      return;
    }
    typeOfAlert.value = val;
  };
  return {
    typeOfAlert,
    alertTitle,
    showAlert,
    openAlert,
    closeAlert,
    setTypeOfAlert,
  };
}
