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
        <button @click="generatePdf">Download as PDF</button>
      </div>
      <div style="width: 100%;
                      display: flex;
                      flex-direction: column;
                    justify-content: center;
                  align-items: center; " ref="pdfContent">
        <h1>My HTML Template</h1>
        <table style="border: 1px solid black">
          <tr>
            <th>Key</th>
            <th>Title</th>
            <th>Description</th>
          </tr>
          <tr v-for="(sLab, index) in sLabs" :key="index">
            <td>{{ sLab.labId }}</td>
            <td>{{ sLab.title }}</td>
            <td>{{ sLab.description }}</td>
          </tr>
        </table>
      </div>
      <v-card elevation="5" class="parent-label">Δηλωθεντα Εργαστήρια</v-card>
      <submited-lab v-for="sLab in sLabs" :key="sLab.labId" :title="sLab.title" :description="sLab.description">
      </submited-lab>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, Ref } from "vue";
import SubmitedLab from "@/components/UI/SubmitedLab.vue";
import BaseDialog from "@/components/Base/BaseDialog.vue";

import { LabSemesterEnum } from "@/enums/LabSemesterEnum";
import { Department } from "@/types/department.type";
import jsPDF, { ImageOptions } from "jspdf";
import html2canvas from "html2canvas";
export default defineComponent({
  components: {
    SubmitedLab,
    BaseDialog,
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
    const pdfContent = ref<HTMLElement>();
    const generatePdf = async () => {
      const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: 'a4', //[210, 297],
        precision: 2,
      });

      if (pdfContent.value) {
        // doc.html(pdfContent.value,
        //   {
        //     callback: async function (doc: jsPDF) {
        //       //doc.save('output.pdf')
        //     },
        //     margin: [0, 0, 0, 0],
        //     autoPaging: 'text',
        //     x: 0,
        //     y: 0,
        //     width: 210, //target width in the PDF document
        //     //windowWidth: 675 ,
        //     windowWidth: window.innerWidth //window width in CSS pixels
        //   });
          const canvas = await html2canvas(pdfContent.value, {
                logging: true,
                scale: 5,
                //  width: 200,
                //  height: 113,
                useCORS: true,
                //allowTaint: false,
          });
         
          const imgProps = doc.getImageProperties(canvas.toDataURL());
          const pdfWidth = doc.internal.pageSize.getWidth();
          const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
           const imageOptions :ImageOptions ={
            imageData : canvas.toDataURL(),
            format : "PNG",
            width : pdfWidth,
            height:pdfHeight,
            x:0,
            y:0
          }
          doc.addImage(imageOptions as ImageOptions); //
          window.open(URL.createObjectURL(doc.output('blob')));
          
      
         
        //doc.save("output.pdf");
      }
    };
    return { sLabs, isError, emitMobileViewClose, generatePdf, pdfContent };
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
