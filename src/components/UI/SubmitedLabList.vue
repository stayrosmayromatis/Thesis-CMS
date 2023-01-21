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
      <div>
        <button @click="pushToPdf">Μετατροπή σε PDF</button>
      </div>
      <v-card elevation="5" class="parent-label">Δηλωθεντα Εργαστήρια</v-card>
      <submited-lab
        v-for="sLab in sLabs"
        :key="sLab.labId"
        :title="sLab.title"
        :description="sLab.description"
      >
      </submited-lab>
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
import { useRouter } from "vue-router";
export default defineComponent({
  components: {
    SubmitedLab,
    BaseDialog,
    PdfContent,
  },
  emits: ["closeMobileView"],
  setup(_, context) {
    const isError = false;
    const router = useRouter();
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

    const generatePdf = () => {
      router.push({ name: "poutsa" });
    };

    return { sLabs, isError, emitMobileViewClose, pushToPdf:generatePdf };
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
}
</style>
