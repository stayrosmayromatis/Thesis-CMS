<template>
  <div @click="emitMobileViewClose">
    <base-dialog v-if="isError">
      <template #title>
        <h1>Http Error</h1>
      </template>
      <template #description>
        <p>An error over the api has occured.Please try later</p>
      </template>
    </base-dialog>
    <div class="parent-card">
      <v-card elevation="5" class="parent-label">Δηλωθεντα Εργαστήρια</v-card>
      <submited-lab
        v-for="sLab in sLabs"
        :key="sLab.labId"
        :title="sLab.title"
        :description="sLab.description"
      >
      </submited-lab>
      <div class="pdf-button">
        <v-btn color="#ff5454" @click="pushToPdf"
          ><svg
            xmlns="http://www.w3.org/2000/svg"
            width="30"
            height="30"
            viewBox="0 0 24 24"
          >
            <path
              d="M12.819 14.427c.064.267.077.679-.021.948-.128.351-.381.528-.754.528h-.637v-2.12h.496c.474 0 .803.173.916.644zm3.091-8.65c2.047-.479 4.805.279 6.09 1.179-1.494-1.997-5.23-5.708-7.432-6.882 1.157 1.168 1.563 4.235 1.342 5.703zm-7.457 7.955h-.546v.943h.546c.235 0 .467-.027.576-.227.067-.123.067-.366 0-.489-.109-.198-.341-.227-.576-.227zm13.547-2.732v13h-20v-24h8.409c4.858 0 3.334 8 3.334 8 3.011-.745 8.257-.42 8.257 3zm-12.108 2.761c-.16-.484-.606-.761-1.224-.761h-1.668v3.686h.907v-1.277h.761c.619 0 1.064-.277 1.224-.763.094-.292.094-.597 0-.885zm3.407-.303c-.297-.299-.711-.458-1.199-.458h-1.599v3.686h1.599c.537 0 .961-.181 1.262-.535.554-.659.586-2.035-.063-2.693zm3.701-.458h-2.628v3.686h.907v-1.472h1.49v-.732h-1.49v-.698h1.721v-.784z"
            /></svg
          >Μετατροπη σε PDF</v-btn
        >
      </div>

      <pdf-content
        @pdfCreated="pdfCreationCompleted"
        :callToGeneratePdf="callToGeneratePdf"
        :labs="sLabs"
      >
      </pdf-content>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, Ref } from "vue";
import SubmitedLab from "@/components/UI/SubmitedLab.vue";
import BaseDialog from "@/components/Base/BaseDialog.vue";
import PdfContent from "@/components/UI/PdfContent.vue";
import { LabSemesterEnum } from "@/enums/LabSemesterEnum";
import { Department } from "@/types/department.type";
export default defineComponent({
  components: {
    SubmitedLab,
    BaseDialog,
    PdfContent,
  },
  emits: ["closeMobileView"],
  setup(_, context) {
    const isError = false;
    const sLabs = ref([
      {
        labId: "1601",
        title: "Οργάνωση και αρχιτεκτονική",
        semester: LabSemesterEnum.A_XEIM,
        description: "Πληροφορίες Εργαστηρίου",
        departments: Array<Department>(),
      },
      {
        labId: "1602",
        title: "Δικτυα και αρχιτεκτονική",
        semester: LabSemesterEnum.B_EAR,
        description: "Πληροφορίες Εργαστηρίου",
        departments: Array<Department>(),
      },
      {
        labId: "1603",
        title: "Δομημένος Προγραμματισμός",
        semester: LabSemesterEnum.C_XEIM,
        description: "Πληροφορίες Εργαστηρίου",
        departments: Array<Department>(),
      },
      {
        labId: "1601",
        title: "Οργάνωση και αρχιτεκτονική",
        semester: LabSemesterEnum.A_XEIM,
        description: "Πληροφορίες Εργαστηρίου",
        departments: Array<Department>(),
      },
      {
        labId: "1602",
        title: "Δικτυα και αρχιτεκτονική",
        semester: LabSemesterEnum.B_EAR,
        description: "Πληροφορίες Εργαστηρίου",
        departments: Array<Department>(),
      },
      {
        labId: "1603",
        title: "Δομημένος Προγραμματισμός",
        semester: LabSemesterEnum.C_XEIM,
        description: "Πληροφορίες Εργαστηρίου",
        departments: Array<Department>(),
      },
    ]);
    const emitMobileViewClose = (): void => {
      context.emit("closeMobileView", true);
      return;
    };
    onMounted(() => {
      context.emit("closeMobileView", true);
      return;
    });
    const pdfCreationCompleted = (val: boolean) => {
      callToGeneratePdf.value = val;
    };
    const callToGeneratePdf = ref(false);
    const invokeGeneratePdf = () => {
      callToGeneratePdf.value = true;
    };
    return {
      sLabs,
      isError,
      emitMobileViewClose,
      pushToPdf: invokeGeneratePdf,
      pdfCreationCompleted,
      callToGeneratePdf,
    };
  },
});
</script>
<style scoped>
.parent-card {
  margin-top: 1rem;
  margin-bottom: 1rem;
}

.parent-label {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 2rem;
  text-transform: uppercase;
  min-width: 320px;
  font-size: 0.95rem;
  font-weight: 500;
  background-color: #aacaf3;
  padding: 1.2rem;
}

.dialog-header {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin: 0.5rem auto;
  background-color: #aacaf3;
}
.pdf-button {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  height: fit-content;
  margin: 1rem 1rem;
  width: 100%;
  min-width:320px;
}
:deep(.v-btn.v-btn--density-default) {
  border-radius: 1rem;
  font-size: 1rem;
  height: 2.5rem;
}
@media (min-width: 769px) {
  .parent-card {
    margin-top: 1rem;
    margin-bottom: 1rem;
    margin-left: 1rem;
    margin-right: 1rem;
  }

  .parent-label {
    display: flex;
    flex-direction: row;
    align-items: center;
    width: 100%;
    height: 3rem;
    justify-content: center;
    font-size: 1.2rem;
    text-transform: uppercase;
    font-weight: 500;
    background-color: #aacaf3;
    min-width: 769px;
  }
  .pdf-button {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
    height: fit-content;
    margin: 1rem 1rem;
    width: 100%;
  }
  :deep(.v-btn.v-btn--density-default) {
    border-radius: 1rem;
    font-size: 1rem;
    height: 2.5rem;
    margin-right: 1rem;
  }
}

@media (min-width: 1025px) {
  .parent-card {
    margin-top: 2rem;
    margin-bottom: 2rem;
    margin-left: 1rem;
    margin-right: 1rem;
  }

  .parent-label {
    display: flex;
    flex-direction: row;
    align-items: center;
    width: 100%;
    height: 3rem;
    justify-content: center;
    font-size: 1.2rem;
    text-transform: uppercase;
    font-weight: 500;
    background-color: #aacaf3;
    min-width: 769px;
  }
  .pdf-button {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
    height: fit-content;
    margin: 1rem 1rem;
    width: 100%;
  }
  :deep(.v-btn.v-btn--density-default) {
    border-radius: 1rem;
    font-size: 1rem;
    height: 2.5rem;
    margin-right: 1rem;
  }
}
</style>
