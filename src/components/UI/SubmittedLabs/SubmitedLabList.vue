<template>
  <main>
    <section class="outer-section" @click="emitMobileViewClose">
      <base-alert :alert-type-prop="typeOfAlert" :show="showAlert" :title="alertTitle"></base-alert>
      <div class="parent-card">
        <v-card elevation="10" class="parent-label">{{isTeacher}}</v-card>
        <base-result-empty :show="!showSpinner && !showLabsIfFound" :title="showEmptyResultTitle"
          :description="showEmptyResultDescription"></base-result-empty>
        <base-spinner :show="showSpinner"></base-spinner>
        <suspense>
          <template #default>
            <div v-if="!showSpinner && showLabsIfFound">
              <div class="temp-class">
                <submitted-lab-card v-for="sLab in sLabs" :key="sLab.CourseGUID" :person-affiliation="personAffiliation"
                  :lab="sLab" :course_guid="sLab.CourseGUID"
                  @force-refetch="populateSubmittedLabs(true)"></submitted-lab-card>
              </div>
              <div style=" margin: 1rem 1rem;"></div>
              <div class="pdf_button_container">
                <v-tooltip style="text-align: center;" text='Εκτύπωση σε Pdf' location="bottom center">
                  <template v-slot:activator="{ props }">
                    <v-btn v-bind=props class="pdf-button-refactor" size="large" :rounded="true" @click="pushToPdf">
                      <svg width="30" height="30" viewBox="0 0 24 24">
                        <path fill="white"
                          d="M18 7H6V3h12v4M6 21v-4H2v-6c0-1.66 1.34-3 3-3h14c1.66 0 3 1.34 3 3v2.81c-.88-.51-1.9-.81-3-.81c-1.23 0-2.36.37-3.31 1H8v5h5c0 .7.13 1.37.35 2H6m12-10c0 .55.45 1 1 1s1-.45 1-1s-.45-1-1-1s-1 .45-1 1m5.5 6L22 15.5L18.5 19l-2-2l-1.5 1.5l3.5 3.5l5-5" />
                      </svg>
                    </v-btn>
                  </template>
                </v-tooltip>
              </div>
              <pdf-content @pdfCreated="pdfCreationCompleted" :callToGeneratePdf="callToGeneratePdf" :labs="sLabs"
                :person-affiliation="personAffiliation">
              </pdf-content>
            </div>
          </template>
        </suspense>
      </div>
    </section>
  </main>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, defineAsyncComponent, computed } from "vue";
import { useAlert } from "@/composables/showAlert.composable";
import { useAxiosInstance } from '@/composables/useInstance.composable';
import { InfoController } from '@/config';
import { ApiResult } from '@/models/DTO/ApiResult';
import { GenericSubmittedLabsResponse, SubmittedLab } from '@/models/BACKEND-MODELS/GenericSubmittedLabsResponse';
import { PersonAffiliation } from "@/enums/PersonAffiliationEnum";
const SubmittedLabCard = defineAsyncComponent({
  loader: () => import("@/components/UI/SubmittedLabs/SubmittedLabCard.vue"),
  delay: 5000,
  suspensible: false
});
import BaseResultEmpty from '@/components/Base/BaseResultEmpty.vue'
import BaseSpinner from "@/components/Base/BaseSpinner.vue";
const PdfContent = defineAsyncComponent({
  loader: () => import("@/components/UI/PdfContent.vue"),
  delay: 5000,
  suspensible: false
});
import BaseAlert from '@/components/Base/BaseAlert.vue';

export default defineComponent({
  components: {
    SubmittedLabCard,
    PdfContent,
    BaseAlert,
    BaseResultEmpty,
    BaseSpinner
  },
  emits: ["closeMobileView"],
  setup(_, context) {
    const showLabsIfFound = ref(false);
    const showSpinner = ref(true);
    const showEmptyResultTitle = ref("Δεν βρέθηκαν δηλωμένα εργαστήρια");
    const showEmptyResultDescription = ref("Δεν έχουν βρεθεί καταχωρημένα εργαστήρια/τμήματα στον λογαριασμό σας, παρακαλώ πραγματοποιήστε πρώτα την δήλωση σας");
    const { alertTitle, typeOfAlert, showAlert, closeAlert, openAlert, setTypeOfAlert } = useAlert();
    const sLabs = ref(new Array<SubmittedLab>());
    const personAffiliation = ref(PersonAffiliation.STUDENT);
    const callToGeneratePdf = ref(false);
    const { MakeAPICall } = useAxiosInstance();
    const emitMobileViewClose = (): void => {
      context.emit("closeMobileView", true);
    };
    onMounted(async () => {
      emitMobileViewClose();
      closeAlert();
      await populateSubmittedLabs();
    });
    const pdfCreationCompleted = (val: boolean) => {
      callToGeneratePdf.value = val;
    };
    const isTeacher = computed(():string => {
      if(!personAffiliation.value) return "Δηλωθέντα Εργαστήριακά Τμήματα";
      return personAffiliation.value === PersonAffiliation.STAFF || personAffiliation.value === PersonAffiliation.ADMIN ? "Τα εργαστηριά μου" : "Δηλωθέντα Εργαστήριακά Τμήματα";
    });
    const invokeGeneratePdf = () => {
      callToGeneratePdf.value = true;
    };
    const delay = (ms: number) => new Promise(res => setTimeout(res, ms));
    const populateSubmittedLabs = async (byInternalCall = false): Promise<void> => {
      const getInfoData = await MakeAPICall<ApiResult<GenericSubmittedLabsResponse>>(InfoController, "get-submitted-labs-info", "GET");
      if (!getInfoData || !getInfoData.Status || !getInfoData.Data || !getInfoData.Data.Count || !getInfoData.Data.SubmittedLabs) {
        showLabsIfFound.value = false;
        showSpinner.value = false;
        return;
      }
      sLabs.value = getInfoData.Data.SubmittedLabs;
      personAffiliation.value = !getInfoData.Data.UserType ? PersonAffiliation.STUDENT : getInfoData.Data.UserType;
      showLabsIfFound.value = true;
      showSpinner.value = false;
      if (byInternalCall) {
        closeAlert();
        setTypeOfAlert('success');
        openAlert("Επιτυχία διαγραφής");
        await delay(1500);
        closeAlert(1500);
      }
    }
    return {
      sLabs,
      emitMobileViewClose,
      pushToPdf: invokeGeneratePdf,
      pdfCreationCompleted,
      callToGeneratePdf,
      alertTitle,
      typeOfAlert,
      showAlert,
      personAffiliation,
      showLabsIfFound,
      showSpinner,
      showEmptyResultTitle,
      showEmptyResultDescription,
      isTeacher,
      populateSubmittedLabs
    };
  },
});
</script>
<style scoped>
.outer-section {
  width: 100%;
  padding: 1rem 0.3rem;
  max-width: 100rem;
}

.temp-class {
  min-width: 320px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  column-gap: 0;
}

.parent-label {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 2rem;
  /* text-transform: uppercase; */
  min-width: 320px;
  font-size: 0.95rem;
  font-weight: 500;
  background-color: var(--header-label-background-color);
  color: var(--header-label-text-color);
  padding: 1.2rem;
  margin-bottom: 1.2rem;
}

.pdf-button-refactor {
  border-radius: 9999px !important;
  -webkit-border-radius: 9999px !important;
  -moz-border-radius: 9999px !important;
  width: 3rem !important;
  height: 5rem !important;
  padding: 0.5rem !important;
  background-color: #ff4545;
}

.pdf_button_container {
  position: fixed;
  z-index: 1000;
  right: 0.5rem;
  bottom: 0.5rem;
}

.outer-section :deep(.v-btn.v-btn--density-default) {
  border-radius: 1rem;
  -moz-border-radius: 1rem;
  -webkit-border-radius: 1rem;
  font-size: 1rem;
  height: 2.5rem;
}

.outer-section :deep(.v-btn--elevated:hover) {
  box-shadow: 0px 2px 4px -1px var(--v-shadow-key-umbra-opacity, rgba(0, 0, 0, 0.9)),
    0px 4px 5px 0px var(--v-shadow-key-penumbra-opacity, rgba(0, 0, 0, 0.2)),
    0px 1px 10px 0px var(--v-shadow-key-penumbra-opacity, rgba(0, 0, 0, 0.2));
  -webkit-box-shadow: 0px 2px 4px -1px var(--v-shadow-key-umbra-opacity, rgba(0, 0, 0, 0.9)),
    0px 4px 5px 0px var(--v-shadow-key-penumbra-opacity, rgba(0, 0, 0, 0.2)),
    0px 1px 10px 0px var(--v-shadow-key-penumbra-opacity, rgba(0, 0, 0, 0.2));
  -moz-box-shadow: 0px 2px 4px -1px var(--v-shadow-key-umbra-opacity, rgba(0, 0, 0, 0.9)),
    0px 4px 5px 0px var(--v-shadow-key-penumbra-opacity, rgba(0, 0, 0, 0.2)),
    0px 1px 10px 0px var(--v-shadow-key-penumbra-opacity, rgba(0, 0, 0, 0.2));
}


@media (min-width: 769px) {

  .outer-section {
    padding: 2rem 0.5rem;
    margin: auto;
    width: inherit;
  }

  .temp-class {
    column-gap: 0;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
  }

  .parent-label {
    height: 3rem;
    font-size: 1.2rem;
  }
  .outer-section :deep(.v-btn.v-btn--density-default) {
    border-radius: 1rem;
    -moz-border-radius: 1rem;
    -webkit-border-radius: 1rem;
    font-size: 1rem;
    height: 2.5rem;
    margin-right: 1rem;
  }

  .pdf_button_container {
    right: 1.5rem;
    bottom: 1.5rem;
  }

  .pdf-button-refactor {
    width: 5rem !important;
    height: 5rem !important;
  }
}

@media (min-width: 1025px) {
  .temp-class {
    flex-direction: row;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    column-gap: 1.5rem;
  }

  .outer-section :deep(.v-btn.v-btn--density-default) {
    border-radius: 1rem;
    -moz-border-radius: 1rem;
    -webkit-border-radius: 1rem;
    font-size: 1rem;
    height: 2.5rem;
    margin-right: 1rem;
  }

  .pdf_button_container {
    right: 3rem;
    bottom: 3rem;
  }
}
</style>
