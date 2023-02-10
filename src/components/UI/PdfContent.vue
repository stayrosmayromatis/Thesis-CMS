<template>
  <div
    style="min-width: 320px"
    class="u-body u-xl-mode"
    data-lang="en"
    ref="pdfContent"
  >
    <header class="u-clearfix u-header u-header" id="sec-16ab">
      <a
        class="u-image u-logo u-image-1"
        data-image-width="504"
        data-image-height="145"
      >
        <img src="@/assets/ihu_logo.png" class="u-logo-image u-logo-image-1" />
      </a>
      <h1
        class="u-align-center u-text u-text-default-lg u-text-default-md u-text-default-sm u-text-default-xl u-text-1"
      >
        Αποδεικτικό Δήλωσης
      </h1>
    </header>
    <section
      class="u-border-2 u-border-black u-border-no-left u-border-no-right u-border-no-top u-clearfix u-section-1"
      id="sec-07de"
    >
      <div
        class="u-expanded-width-md u-expanded-width-sm u-expanded-width-xl u-expanded-width-xs u-layout-grid u-list u-list-1"
      >
        <div class="u-repeater u-repeater-1">
          <div
            class="u-container-style u-custom-item u-list-item u-repeater-item"
          >
            <div
              class="u-container-layout u-similar-container u-container-layout-1"
            >
              <p
                class="u-align-center-lg u-align-center-md u-align-center-sm u-align-center-xs u-align-left-xl u-custom-item u-text u-text-1"
              >
                {{ 'Όνομα: '+firstName }}
              </p>
            </div>
          </div>
          <div
            class="u-container-style u-custom-item u-list-item u-repeater-item"
          >
            <div
              class="u-container-layout u-similar-container u-container-layout-2"
            >
              <p
                class="u-align-center-lg u-align-center-md u-align-center-sm u-align-center-xs u-align-left-xl u-custom-item u-text u-text-2"
              >
              {{'Επώνυμο: '+lastName}}
              </p>
            </div>
          </div>
          <div
            class="u-container-style u-custom-item u-list-item u-repeater-item"
          >
            <div
              class="u-container-layout u-similar-container u-container-layout-3"
            >
              <p
                class="u-align-center-lg u-align-center-md u-align-center-sm u-align-center-xs u-align-left-xl u-custom-item u-text u-text-3"
              >
                Εξάμηνο: [[SEMESTER]]
              </p>
            </div>
          </div>
        </div>
      </div>
      <div
        class="table-header u-expanded-width u-table u-table-responsive u-table-1"
      >
        <table class="u-table-entity">
          <colgroup>
            <col width="11.8%" />
            <col width="22.5%" />
            <col width="18.8%" />
            <col width="13.8%" />
            <col width="10.9%" />
            <col width="22.2%" />
          </colgroup>
          <tbody class="u-table-alt-palette-1-light-3 u-table-body">
            <tr style="height: 93px; text-align:center;">
              <td
                class="u-border-1 u-border-grey-75 u-border-no-left u-border-no-right u-table-cell"
              >
                Κωδικός
              </td>
              <td
                class="u-border-1 u-border-grey-75 u-border-no-left u-border-no-right u-table-cell"
              >
                Όνομα Εργαστ.
              </td>
              <td
                class="u-border-1 u-border-grey-75 u-border-no-left u-border-no-right u-table-cell"
              >
                Τμήμα
              </td>
              <td
                class="u-border-1 u-border-grey-75 u-border-no-left u-border-no-right u-table-cell"
              >
                Ημέρα
              </td>
              <td
                class="u-border-1 u-border-grey-75 u-border-no-left u-border-no-right u-table-cell"
              >
                Ώρα
              </td>
              <td
                class="u-border-1 u-border-grey-75 u-border-no-left u-border-no-right u-table-cell"
              >
                Παρακολούθηση
              </td>
            </tr>
            <tr v-for="lab in labs" :key="lab.labId" style="height: 79px; text-align:center;">
              <td class="u-table-cell">{{ lab.labId }}</td>
              <td class="u-table-cell">{{ lab.title }}</td>
              <td class="u-table-cell">{{ "Τμήμα" }}</td>
              <td class="u-table-cell">{{ "Ημέρα" }}</td>
              <td class="u-table-cell">{{ "Ωρα" }}</td>
              <td class="u-table-cell">{{ "Παρακ" }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch, toRefs, PropType, onMounted } from 'vue';
import html2canvas from "html2canvas";
import jsPDF, { ImageOptions } from "jspdf";
import { useAuth } from '@/composables/useAuth.composable';
export default defineComponent({
  props: {
    labs: {
      type: Object,
      required: false,
      default: null,
    },
    callToGeneratePdf:{
      type: Boolean,
      required : true,
      default:false
    },
  },
  emits: ["pdfCreated"],
  setup(props, context) {
    const pdfContent = ref<HTMLElement>();
    const {GetUserDataDetails} = useAuth();
    const {labs,callToGeneratePdf} = toRefs(props);
    const firstName =ref<string>("");
    const lastName = ref<string>("");
    onMounted(() => {
      const userDetails = GetUserDataDetails();
      if(!userDetails)
      {
        firstName.value="";
        lastName.value="";
      }
      else{
        let splitted = userDetails.DisplayNameEl.replaceAll('-',' ').split(' ');
        if(!splitted || splitted.length === 0){
          firstName.value="";
          lastName.value="";
        }
        else{
          lastName.value = splitted[splitted.length-1];
          if(splitted.length >= 3){
            firstName.value = splitted[0]+" - "+splitted[1];
          }
          else{
            firstName.value = splitted[0];
          }
        }
      }
    });
    const generatePdf = async () => {
      if (!pdfContent.value)
        return;
      const doc = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: [400, 297], // 'a4',
        precision: 1,
      });
      const canvas = await html2canvas(pdfContent.value, {
        logging: true,
        scale: 1,
        useCORS: true,
        removeContainer:true,
        allowTaint: true,
      });
      const canvasBase64 = canvas.toDataURL();
      console.log(canvasBase64);
      const imgProps = doc.getImageProperties(canvasBase64);
      const pdfWidth = doc.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      const imageOptions: ImageOptions = {
        imageData: canvasBase64,
        format: "PNG",
        width: pdfWidth,
        height: pdfHeight,
        x: 0,
        y: 0,
      };
      doc.addImage(imageOptions as ImageOptions);
      window.open(URL.createObjectURL(doc.output("blob")));
      // doc.save('output.pdf');
      context.emit("pdfCreated", false);
    };
    watch(callToGeneratePdf,(val) => {
      if(val === true){
        generatePdf();
      }
    });
    return {labs, pdfContent, generatePdf, firstName,lastName};
  },
});
</script>
<style scoped>
@import "@/assets/pdf-styles/Home.css";
@import "@/assets/pdf-styles/nicepage.css";

</style>
