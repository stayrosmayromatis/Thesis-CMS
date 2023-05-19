<template>
  <div @click="emitMobileViewClose">
    <!-- <base-dialog v-if="isError">
      <template #title>
        <h1>Http Error</h1>
      </template>
      <template #description>
        <p>An error over the api has occured.Please try later</p>
      </template>
    </base-dialog> -->
    <base-alert :alert-type-prop="typeOfAlert" :show="showAlert" :title="alertTitle">
    </base-alert>
    <div class="parent-card">

      <v-card elevation="10" class="parent-label">Δηλωθεντα Εργαστήρια</v-card>

      <base-result-empty :show="showLabsNotFound" :title="showEmptyResultTitle"
        :description="showEmptyResultDescription"></base-result-empty>
      <base-spinner :show="showSpinner"></base-spinner>

      <div v-if="!showLabsNotFound">
        <submited-lab v-for="sLab in sLabs" :key="sLab.CourseGUID" :person-affiliation="personAffiliation" :lab="sLab"
          :course_guid="sLab.CourseGUID" @force-refetch="populateSubmittedLabs(true)"></submited-lab>
        <div class="pdf-button">
          <v-btn color="#ff5454" @click="pushToPdf">
            <svg style="margin-right: 0.3rem;" fill="white" xmlns="http://www.w3.org/2000/svg" width="25" height="25"
              viewBox="0 0 24 24">
              <path
                d="M12.819 14.427c.064.267.077.679-.021.948-.128.351-.381.528-.754.528h-.637v-2.12h.496c.474 0 .803.173.916.644zm3.091-8.65c2.047-.479 4.805.279 6.09 1.179-1.494-1.997-5.23-5.708-7.432-6.882 1.157 1.168 1.563 4.235 1.342 5.703zm-7.457 7.955h-.546v.943h.546c.235 0 .467-.027.576-.227.067-.123.067-.366 0-.489-.109-.198-.341-.227-.576-.227zm13.547-2.732v13h-20v-24h8.409c4.858 0 3.334 8 3.334 8 3.011-.745 8.257-.42 8.257 3zm-12.108 2.761c-.16-.484-.606-.761-1.224-.761h-1.668v3.686h.907v-1.277h.761c.619 0 1.064-.277 1.224-.763.094-.292.094-.597 0-.885zm3.407-.303c-.297-.299-.711-.458-1.199-.458h-1.599v3.686h1.599c.537 0 .961-.181 1.262-.535.554-.659.586-2.035-.063-2.693zm3.701-.458h-2.628v3.686h.907v-1.472h1.49v-.732h-1.49v-.698h1.721v-.784z" />
            </svg>
            Μετατροπη σε PDF
          </v-btn>
        </div>

        <pdf-content @pdfCreated="pdfCreationCompleted" :callToGeneratePdf="callToGeneratePdf" :labs="sLabs"
          :person-affiliation="personAffiliation">
        </pdf-content>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";
import SubmitedLab from "@/components/UI/SubmittedLabs/SubmitedLab.vue";
//import BaseDialog from "@/components/Base/BaseDialog.vue";
import PdfContent from "@/components/UI/PdfContent.vue";
import BaseAlert from '@/components/Base/BaseAlert.vue';
import { useAlert } from "@/composables/showAlert.composable";
import { useAxiosInstance } from '@/composables/useInstance.composable';
import { InfoController } from '@/config';
import { useAxios } from "@vueuse/integrations/useAxios";
import { ApiResult } from '@/models/DTO/ApiResult';
import { GenericSubmittedLabsResponse, SubmittedLab } from '@/models/BACKEND-MODELS/GenericSubmittedLabsResponse';
import { PersonAffiliation } from "@/enums/PersonAffiliationEnum";
import BaseResultEmpty from '@/components/Base/BaseResultEmpty.vue'
import BaseSpinner from "@/components/Base/BaseSpinner.vue";
export default defineComponent({
  components: {
    SubmitedLab,
    //  BaseDialog,
    PdfContent,
    BaseAlert,
    BaseResultEmpty,
    BaseSpinner
  },
  emits: ["closeMobileView"],
  setup(_, context) {
    //const isError = false;
    const showLabsNotFound = ref(false);
    const showSpinner = ref(false);
    const showEmptyResultTitle = ref("");
    const showEmptyResultDescription = ref("");
    const { alertTitle, typeOfAlert, showAlert, closeAlert, openAlert, setTypeOfAlert } = useAlert();
    const sLabs = ref(new Array<SubmittedLab>());
    const personAffiliation = ref(PersonAffiliation.STUDENT);
    const { setBackendInstanceAuth } = useAxiosInstance();
    const emitMobileViewClose = (): void => {
      context.emit("closeMobileView", true);
    };
    onMounted(async () => {
      emitMobileViewClose();
      if (showAlert.value === true) {
        setTimeout(() => {
          openAlert(alertTitle.value);
        }, 1000)
        setTimeout(() => {
          closeAlert();
        }, 1500)
      }
      await populateSubmittedLabs();
      return;
    });
    const pdfCreationCompleted = (val: boolean) => {
      callToGeneratePdf.value = val;
    };
    const callToGeneratePdf = ref(false);
    const invokeGeneratePdf = () => {
      callToGeneratePdf.value = true;
    };

    const populateSubmittedLabs = async (byInternalCall = false): Promise<void> => {
      showSpinner.value = true;
      const apiGetInfos = await useAxios(
        InfoController + "get-submitted-labs-info",
        {
          method: 'GET'
        },
        setBackendInstanceAuth()
      );
      if (apiGetInfos.isFinished) {
        const getInfoData: ApiResult<GenericSubmittedLabsResponse> = apiGetInfos.data.value;
        if (getInfoData.Status === false || !getInfoData.Status) {
          showSpinner.value = false;
          showEmptyResultTitle.value = "Δεν βρέθηκαν δηλωμένα εργαστήρια";
          showEmptyResultDescription.value = "Δεν έχουν βρεθεί καταχωρημένα εργαστήρια/τμήματα στον λογαριασμό σας, παρακαλώ πραγματοποιήστε πρώτα την δήλωση σας";
          return;
        }
        if (!getInfoData.Data || getInfoData.Data.Count === 0 || !getInfoData.Data.Count || !getInfoData.Data.SubmittedLabs) {
          showLabsNotFound.value = true;
          showEmptyResultTitle.value = "Δεν βρέθηκαν δηλωμένα εργαστήρια";
          showEmptyResultDescription.value = "Δεν έχουν βρεθεί καταχωρημένα εργαστήρια/τμήματα στον λογαριασμό σας, παρακαλώ πραγματοποιήστε πρώτα την δήλωση σας";
          showSpinner.value = false;
          return;
        }
        sLabs.value = getInfoData.Data.SubmittedLabs;
        personAffiliation.value = !getInfoData.Data.UserType ? PersonAffiliation.STUDENT : getInfoData.Data.UserType;
        showSpinner.value = false;
        if (byInternalCall === true) {
          if (showAlert.value === true) {
            closeAlert();
          }
          setTypeOfAlert('success');
          openAlert("Επιτυχία διαγραφής ");
          setTimeout(() => {
            closeAlert();
          }, 1500);
        }
        console.log(sLabs.value);
        console.log(personAffiliation.value);
      }
    }
    return {
      sLabs,
      //isError,
      emitMobileViewClose,
      pushToPdf: invokeGeneratePdf,
      pdfCreationCompleted,
      callToGeneratePdf,
      alertTitle,
      typeOfAlert,
      showAlert,
      personAffiliation,
      showLabsNotFound,
      showSpinner,
      showEmptyResultTitle,
      showEmptyResultDescription,
      populateSubmittedLabs
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
  /* text-transform: uppercase; */
  min-width: 320px;
  font-size: 0.95rem;
  font-weight: 500;
  background-color: var( --header-label-background-color);
  color: var(--header-label-text-color);
  padding: 1.2rem;
  margin-bottom: 1.2rem;
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
  min-width: 320px;
  color: white;
}

:deep(.v-btn.v-btn--density-default) {
  border-radius: 1rem;
  font-size: 1rem;
  height: 2.5rem;
}
:deep(.v-btn--elevated:hover) {
  box-shadow: 0px 2px 4px -1px var(--v-shadow-key-umbra-opacity, rgba(0, 0, 0, 0.9)), 
  0px 4px 5px 0px var(--v-shadow-key-penumbra-opacity, rgba(0, 0, 0, 0.2)), 
  0px 1px 10px 0px var(--v-shadow-key-penumbra-opacity, rgba(0, 0, 0, 0.2));
}


@media (min-width: 769px) {
  .parent-card {
    margin-top: 1rem;
    margin-bottom: 1rem;
    margin-left: 1rem;
    margin-right: 1rem;
  }

  .parent-label {
    height: 3rem;
    font-size: 1.2rem;
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
