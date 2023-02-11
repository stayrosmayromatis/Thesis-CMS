import { openDialog } from 'vue3-promise-dialog';
import BaseDialogVue from '@/components/Base/BaseDialog.vue';

export async function confirm() {
  return await openDialog(BaseDialogVue);
}
