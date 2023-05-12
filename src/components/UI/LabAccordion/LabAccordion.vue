<template>
  <v-container class="sth-container" @click="emitMobileViewClose">
    <v-card elevation="5" class="parent-label">ΑΝΑΖΗΤΗΣΗ ΕΡΓΑΣΤΗΡΙΩΝ</v-card>
    <v-select :items="availableSemesters" label="Επιλέξτε ενα ή παραπάνω εξάμηνo" hide-selected chips persistent-hint
      density="comfortable" validate-on="blur" bg-color="#92B4F4" closable-chips :open-on-clear="false" clearable
      multiple return-object v-model="selectedSemesters" no-data-text="Ολα τα διαθέσιμα εξάμηνα έχουν επιλεχθεί"
      @update:model-value="requestLabs">
    </v-select>
    <base-spinner :show="isLoading"></base-spinner>
    <base-result-empty :show="personalisedCourses.length === 0" :title="resultEmptyTitle"
      :description="resutlEmptyDesc"></base-result-empty>
    <!-- <v-app> -->
    <v-expansion-panels v-if="personalisedCourses">
      <v-expansion-panel v-for="lab in personalisedCourses" :key="lab.CourseGUID" :readonly="isReadOnly(lab)">
        <v-expansion-panel-title expand-icon="mdi-plus" collapse-icon="mdi-minus">
          <lab-accordion-expansion-panel-title :lab="lab" :user_type="userType ?? 1" @close-mobile="emitMobileViewClose"></lab-accordion-expansion-panel-title>
        </v-expansion-panel-title>
        <v-expansion-panel-text>
          <lab-accordion-expansion-panel-text :lab="lab" :user_type="userType" @close-mobile="emitMobileViewClose"></lab-accordion-expansion-panel-text>
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>
    <!-- </v-app> -->
  </v-container>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";
import { DisplayedSemster } from "@/models/displayedsemester.type";
import { useDisplayedLabs } from "@/composables/displayedSemesterArray.composable";
import { CourseController } from "@/config";
import { useAxios } from "@vueuse/integrations/useAxios";
import { useAxiosInstance } from "@/composables/useInstance.composable";
import { ApiResult } from "@/models/DTO/ApiResult";
import BaseResultEmpty from "@/components/Base/BaseResultEmpty.vue";
import BaseSpinner from "@/components/Base/BaseSpinner.vue";
import { PersonalisedCourseBySemester, PersonalisedCoursesBySemesterResponse } from "@/models/BACKEND-MODELS/PersonalisedCoursesBySemesterResponse";
import { PersonAffiliation } from "@/enums/PersonAffiliationEnum";
import LabAccordionExpansionPanelText from "@/components/UI/LabAccordion/LabAccordionExpansionPanel/LabAccordionExpansionPanelText.vue";
import LabAccordionExpansionPanelTitle from "@/components/UI/LabAccordion/LabAccordionExpansionPanel/LabAccordionExpansionPanelTitle.vue";

export default defineComponent({
  emits: ["closeMobileView"],
  components: {
    BaseResultEmpty,
    BaseSpinner,
    LabAccordionExpansionPanelText,
    LabAccordionExpansionPanelTitle
  },
  setup(_, context) {
    const { DisplayedLabs, GetDisplayedLabs } = useDisplayedLabs();
    const availableSemesters = ref(new Array<DisplayedSemster>());
    const selectedSemesters = ref(new Array<DisplayedSemster>());
    const personalisedCourses = ref(new Array<PersonalisedCourseBySemester>());
    const resultEmptyTitle = ref("Κανένα Αποτέλεσμα προς εμφάνιση");
    const resutlEmptyDesc = ref(
      "Το φίλτρο επιλογής είναι κενό. Επιλέξτε εξάμηνο είτε συνδυασμο εξαμήνων απο την μπάρα φίλτρων παραπάνω, ώστε να ξεκινήση η διαδικασία αναζήτησης"
    );
    const isLoading = ref(false);
    const userType = ref<PersonAffiliation>();
    const { setBackendInstanceAuth } = useAxiosInstance();
    const RequestLabs = async () => {
      const requestArray = selectedSemesters.value.map((item) => item.value);
      isLoading.value = true;
      const personalised_api_response = await useAxios(
        CourseController + "courses-by-semester",
        {
          method: "POST",
          data: requestArray,
        },
        setBackendInstanceAuth()
      );
      if (personalised_api_response.isFinished.value) {
        isLoading.value = false;
        const personalised_response_data: ApiResult<PersonalisedCoursesBySemesterResponse> =
          personalised_api_response.data.value;
        console.log(personalised_response_data);

        if (
          !personalised_response_data ||
          personalised_response_data.Status === false ||
          !personalised_response_data.Status ||
          !personalised_response_data.Data
        ) {
          // do something!
          personalisedCourses.value = [];
          resultEmptyTitle.value = "Κάτι πήγε στραβά";
          resutlEmptyDesc.value =
            "Δοκιμάστε να καθαρίσετε τα επιλεγμένα φίλτρα απο την μπάρα ώστε να ξεκινήσει εκ νέου η διαδικάσια αναζήτησης";
          return;
        }
        if (
          !personalised_response_data.Data.Count ||
          personalised_response_data.Data.Count === 0 ||
          !personalised_response_data.Data.PersonalisedCourses
        ) {
          // do something about it!
          personalisedCourses.value = [];
          resultEmptyTitle.value = "Κανένα Αποτέλεσμα";
          resutlEmptyDesc.value =
            "Επιλέξτε Εξάμηνο είτε Συνδυασμο εξαμήνων απο την μπάρα φίλτρων παραπάνω, ώστε να ξεκινήση η διαδικασία αναζήτησης";
          return;
        }
        personalisedCourses.value = personalised_response_data.Data.PersonalisedCourses;
        userType.value = personalised_response_data.Data.UserType ?? undefined;//
      }
      isLoading.value = false;
    };
    const emitMobileViewClose = (): void => {
      context.emit("closeMobileView", true);
    };
    onMounted(async () => {
      emitMobileViewClose();
      await GetDisplayedLabs();
      availableSemesters.value = DisplayedLabs.value;
    });
    const isReadOnly = (lab?: PersonalisedCourseBySemester): boolean => {
      if (!userType.value || !lab)
        return true;
      if (userType.value === PersonAffiliation.ADMIN) return false;
      if (userType.value === PersonAffiliation.STAFF) return false;
      if (userType.value === PersonAffiliation.STUDENT && lab.CanSubmit === false) return true;
      return false;
    }

    return {
      userType,
      personalisedCourses,
      availableSemesters,
      selectedSemesters,
      resultEmptyTitle,
      resutlEmptyDesc,
      isLoading,
      requestLabs: RequestLabs,
      emitMobileViewClose,
      isReadOnly
    };
  },
});
</script>

<style scoped>
:deep(.v-field-label) {
  color: #ffffff;
  opacity: 1;
}

:deep(.v-field-label.v-field-label--floating) {
  color: #f3f3f3;
  opacity: 1;
}

.sth-container {
  width: 100%;
  padding: 0;
  margin-top: 1rem;
  min-width: 320px;
}

:deep(.v-expansion-panel--active:not(:first-child),
  .v-expansion-panel--active + .v-expansion-panel) {
  margin-top: 0;
}

:deep(.v-container) {
  min-width: 320px;
}

:deep(.v-expansion-panel-title__icon) {
  display: inline-flex;
  margin-right: -1rem;
  margin-bottom: -3.5rem;
  margin-top: -4px;
  user-select: none;
  margin-inline-start: auto;
}

.sth-container :deep(.v-field__clearable),
:deep(.v-field__append-inner) {
  padding-top: 0;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.sth-container :deep(.v-field__input) {
  padding-bottom: 6px;
}

.parent-label {
  margin-bottom: 1rem;
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

:deep(.parent) {
  margin: 0;
}

@media (min-width: 480px) {

  :deep(.v-expansion-panel-title__icon) {
    display: inline-flex;
    margin-right: 0;
    margin-bottom: -4px;
    margin-top: -4px;
    user-select: none;
    margin-inline-start: auto;
  }

}

@media (min-width: 769px) {
  .sth-container {
    margin: 2rem 1rem;
    width: inherit;
    max-width: 100%;

  }

  .parent-label {
    margin-top: 2rem;
    margin-bottom: 2rem;
    height: 3rem;
    font-size: 1.2rem;
  }
}

@media (min-width: 1025px) {
  :deep(.v-container) {
    max-width: 100%;
  }
}
</style>
