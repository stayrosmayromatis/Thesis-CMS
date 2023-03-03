<template>
  <v-container class="sth-container" @click="emitMobileViewClose">
    <v-card elevation="5" class="parent-label">ΑΝΑΖΗΤΗΣΗ ΕΡΓΑΣΤΗΡΙΩΝ</v-card>

    <v-select
      :items="availableSemesters"
      label="Επιλέξτε ενα ή παραπάνω εξάμηνo"
      hide-selected
      chips
      persistent-hint
      density="comfortable"
      validate-on="blur"
      bg-color="#92B4F4"
      closable-chips
      :open-on-clear="false"
      clearable
      multiple
      return-object
      v-model="selectedSemesters"
      no-data-text="Ολα τα διαθέσιμα εργαστήρια έχουν επιλεχθεί"
      @update:model-value="requestLabs"
    >
    </v-select>
    <div>
      <base-spinner :show="isLoading"></base-spinner>
    </div>
    <div>
      <base-result-empty
        :show="personalisedCourses.length === 0"
        :title="resultEmptyTitle"
        :description="resutlEmptyDesc"
      ></base-result-empty>
    </div>
    <!-- <v-app> -->
    <v-expansion-panels v-if="personalisedCourses">
      <v-expansion-panel
        v-for="lab in personalisedCourses"
        :key="lab.CourseGUID"
        :readonly="lab.CanSubmit === false"
      >
        <!-- :disabled="lab.CanSubmit === false" -->
        <div>
          <v-expansion-panel-title
            expand-icon="mdi-plus"
            collapse-icon="mdi-minus"
          >
            <div class="chip-separator">
              <div class="chip-separator__left-chip">
                <v-chip
                  class="chip-bg"
                  :class="{
                    'gray-out-card-chip-lab__details': lab.CanSubmit === false,
                  }"
                  size="large"
                  style="height: fit-content"
                >
                  <div class="lab-chip__details">
                    <div class="lab-course__code">
                      {{ lab.CourseCode + " " }}
                    </div>
                    <div class="aligner">
                      {{ lab.CourseName }}
                    </div>
                  </div>
                </v-chip>
              </div>
              <div class="chip-separator__right-chip">
                <div v-if="lab.CanSubmit === false">
                  <v-tooltip
                    :text="'Δεν επιτρέπεται να δηλωθεί'"
                    location="bottom"
                  >
                    <template v-slot:activator="{ props }">
                      <v-chip
                        variant="text"
                        density="default"
                        style="width: fit-content"
                        :rounded="20"
                        v-bind="props"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="35"
                          height="35"
                          viewBox="0 0 24 24"
                        >
                          <path
                            fill="#ff4646"
                            d="M12 2c5.5 0 10 4.5 10 10s-4.5 10-10 10S2 17.5 2 12S6.5 2 12 2m0 2c-1.9 0-3.6.6-4.9 1.7l11.2 11.2c1-1.4 1.7-3.1 1.7-4.9c0-4.4-3.6-8-8-8m4.9 14.3L5.7 7.1C4.6 8.4 4 10.1 4 12c0 4.4 3.6 8 8 8c1.9 0 3.6-.6 4.9-1.7Z"
                          />
                        </svg>
                      </v-chip>
                    </template>
                  </v-tooltip>
                </div>
                <div
                  v-if="
                    lab.CanSubmit === true && lab.HasAlreadySubmitted === true
                  "
                >
                  <v-tooltip
                    :text="'Εχετε ηδη μια θέση σε εργαστηριακό τμήμα'"
                    location="bottom"
                  >
                    <template v-slot:activator="{ props }">
                      <v-chip
                        variant="text"
                        density="default"
                        style="width: fit-content"
                        v-bind="props"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="35"
                          height="35"
                          viewBox="0 0 24 24"
                        >
                          <path
                            fill="#00c900"
                            d="M21 7L9 19l-5.5-5.5l1.41-1.41L9 16.17L19.59 5.59L21 7Z"
                          />
                        </svg>
                      </v-chip>
                    </template>
                  </v-tooltip>
                </div>
                <v-chip
                  class="chip-attendance"
                  :class="{
                    'gray-out-card-chip-attendance': lab.CanSubmit === false,
                  }"
                  size="large"
                >
                  <div>{{ lab.CourseAttendanceString }}</div>
                </v-chip>
                <v-chip
                  class="chip-semester"
                  :class="{
                    'gray-out-card-chip-semester': lab.CanSubmit === false,
                  }"
                  size="large"
                >
                  <div>
                    {{ semesterReformer(lab.Semester) }}
                  </div>
                </v-chip>
              </div>
            </div>
          </v-expansion-panel-title>
        </div>
        <v-expansion-panel-text>
          <div class="classOne">
            <p>{{ lab.ShortDescription }}</p>
            <div class="lab-details_if_submitted">
              <p
                style="font-weight: 400; font-size: 1rem"
                v-if="
                  lab.CanSubmit === true &&
                  lab.HasAlreadySubmitted === true &&
                  lab.LabInfo
                "
              >
                {{
                  `Επιλέχθηκε το εργαστήριο ${lab.LabInfo?.LabName} / ${lab.LabInfo?.Daystring} (${lab.LabInfo?.FromTimeString} - ${lab.LabInfo?.ToTimeString})`
                }}
              </p>
              <v-btn
                v-if="
                  lab.CanSubmit === true &&
                  lab.HasAlreadySubmitted === false &&
                  !lab.LabInfo
                "
                @click="pushToEnroll(lab.CourseGUID)"
                color="#a3cef1"
                elevation="4"
                >Δηλωσε το</v-btn
              >
              <v-tooltip
                :text="`Κατέχετε ηδη μια θέση στο εργαστήριο ${lab.LabInfo?.LabName}`"
                :location="'bottom'"
              >
                <template v-slot:activator="{ props }">
                  <v-chip
                    v-if="
                      lab.CanSubmit === true && lab.HasAlreadySubmitted === true
                    "
                    variant="text"
                    density="default"
                    style="width: fit-content"
                    v-bind="props"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="35"
                      height="35"
                      viewBox="0 0 24 24"
                    >
                      <path
                        fill="#00c900"
                        d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10s10-4.5 10-10S17.5 2 12 2m0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8s8 3.59 8 8s-3.59 8-8 8m4.59-12.42L10 14.17l-2.59-2.58L6 13l4 4l8-8l-1.41-1.42Z"
                      />
                    </svg>
                  </v-chip>
                </template>
              </v-tooltip>
            </div>
          </div>
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>
    <!-- </v-app> -->
  </v-container>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";
import { LabSemesterEnum } from "@/enums/LabSemesterEnum";
import { DisplayedSemster } from "@/models/displayedsemester.type";
import { useDisplayedLabs } from "@/composables/displayedSemesterArray.composable";
import { AttendanceEnum } from "@/enums/AttendanceEnums";
import { CourseController } from "@/config";
import { useAxios } from "@vueuse/integrations/useAxios";
import { useAxiosInstance } from "@/composables/useInstance.composable";
import { ApiResult } from "@/models/DTO/ApiResult";
import BaseResultEmpty from "@/components/Base/BaseResultEmpty.vue";
import BaseSpinner from "@/components/Base/BaseSpinner.vue";
import { useRouter } from "vue-router";
export interface PersonalisedCoursesBySemester {
  PersonalisedCourses: Array<PersonalisedCourseBySemester>;
  Count: number;
}
export interface PersonalisedCourseBySemester {
  CourseGUID: string;
  CourseName: string;
  CourseCode: string;
  Semester: LabSemesterEnum;
  SemesterString: string;
  ShortDescription: string;
  CourseChip: Array<string>;
  CourseAttendance: AttendanceEnum;
  CourseAttendanceString: string;
  CanSubmit: boolean;
  HasAlreadySubmitted: boolean;
  LabInfo: SubmittedLabInfo;
}
export interface SubmittedLabInfo {
  LabName: string;
  Daystring: string;
  FromTimeString: string;
  ToTimeString: string;
}
export default defineComponent({
  emits: ["closeMobileView"],
  components: {
    BaseResultEmpty,
    BaseSpinner,
  },
  setup(_, context) {
    const router = useRouter();
    const { DisplayedLabs, GetDisplayedLabs } = useDisplayedLabs();
    const availableSemesters = ref(new Array<DisplayedSemster>());
    const selectedSemesters = ref(new Array<DisplayedSemster>());
    const personalisedCourses = ref(new Array<PersonalisedCourseBySemester>());
    const resultEmptyTitle = ref("Κανένα Αποτέλεσμα προς εμφάνιση");
    const resutlEmptyDesc = ref(
      "Το φίλτρο επιλογής είναι κενό. Επιλέξτε εξάμηνο είτε συνδυασμο εξαμήνων απο την μπάρα φίλτρων παραπάνω, ώστε να ξεκινήση η διαδικασία αναζήτησης"
    );
    const isLoading = ref(false);
    const { setBackendInstanceAuth } = useAxiosInstance();
    const requestLabs = async () => {
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
      if (personalised_api_response.isFinished) {
        isLoading.value = false;
        const personalised_response_data: ApiResult<PersonalisedCoursesBySemester> =
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
        personalisedCourses.value =
          personalised_response_data.Data.PersonalisedCourses;
      }
      isLoading.value = false;
    };
    const emitMobileViewClose = (): void => {
      context.emit("closeMobileView", true);
      return;
    };
    const semesterReformer = (semester: LabSemesterEnum) => {
      if (!semester) return "N/A";
      switch (semester) {
        case LabSemesterEnum.A_XEIM:
          return "Α ";
        case LabSemesterEnum.B_EAR:
          return "Β ";
        case LabSemesterEnum.C_XEIM:
          return "Γ ";
        case LabSemesterEnum.D_EAR:
          return "Δ ";
        case LabSemesterEnum.E_XEIM:
          return "E ";
        case LabSemesterEnum.ST_EAR:
          return "ΣΤ ";
        case LabSemesterEnum.Z_XEIM:
          return "Ζ ";
        case LabSemesterEnum.H_EAR:
          return "Η ";
        case LabSemesterEnum.TH_XEIM:
          return "Θ ";
        case LabSemesterEnum.I_EAR:
          return "Ι ";
        case LabSemesterEnum.K_XEIM:
          return "Κ ";
        case LabSemesterEnum.L_EAR:
          return "Λ ";
        default:
          return "N/A";
      }
    };
    const pushToEnroll = (guid: string) => {
      if (!guid) return;
      router.push({
        name: "enroll",
        params: {
          course_guid: guid,
        },
      });
      return;
    };
    onMounted(() => {
      GetDisplayedLabs();
      availableSemesters.value = DisplayedLabs.value;
      context.emit("closeMobileView", true);
      return;
    });
    return {
      personalisedCourses,
      availableSemesters,
      selectedSemesters,
      resultEmptyTitle,
      resutlEmptyDesc,
      requestLabs,
      isLoading,
      emitMobileViewClose,
      semesterReformer,
      pushToEnroll,
    };
  },
});
</script>

<style scoped>
.aligner {
  text-align: center;
  text-overflow: ellipsis;
  text-transform: none;
  white-space: pre-line;
  word-break: break-word;
  word-wrap: normal;
  font-size: 1rem;
  -webkit-hyphens: auto;
  hyphens: auto;
  letter-spacing: 0.0125em;
  /* min-width: 0; */
  /* overflow-wrap: normal; */
  /* overflow: hidden; */
  font-weight: 500;
  width: fit-content;
  /* padding: 0.6rem 0.5rem; */
  padding-bottom: 0.5rem;
  padding-left: 0.5rem;
  padding-right: 0.5rem;
}
.lab-course__code {
  font-weight: 500;
  padding-top: 0.5rem;
  font-size: 1rem;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}
.lab-chip__details {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  height: fit-content;
}
.chip-bg {
  background: #f7f7f7;
  border: 1px solid #1c4397;
  color: #1c4397;
  word-wrap: break-word;
}
.chip-separator {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 0.3rem;
  align-items: center;
  width: 100%;
  margin: 0;
}
.chip-separator__left-chip {
  width: fit-content;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
}
.chip-separator__right-chip {
  width: fit-content;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  gap: 0.5rem;
}
.chip-attendance {
  background: #f3f3f3;
  /* border: 1px solid black; */
  border: 1px solid #00c900;
  color: #00c900;
  word-wrap: break-word;
  width: inherit;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}
.chip-semester {
  background: #f3f3f3;
  /* border: 1px solid black; */
  border: 1px solid #0136e6;
  color: #0136e6;
  word-wrap: break-word;
  width: inherit;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}
.classOne {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  margin: 0.5rem 0.5rem;
  width: 100%;
}

.classOne > p {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  white-space: pre-line;
  word-break: break-word;
}

.classOne > button {
  width: fit-content;
  display: flex;
  justify-content: center;
  align-items: center;
}

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

:deep(
    .v-expansion-panel--active:not(:first-child),
    .v-expansion-panel--active + .v-expansion-panel
  ) {
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
.gray-out-card-chip-lab__details {
  background: #d1d3d8 !important;
  border: 1px solid #273864 !important;
  color: #273864 !important;
}
.gray-out-card-chip-semester {
  background: #f9f9f9 !important;
  border: 1px solid #303c64 !important;
  color: #303c64 !important;
}
.gray-out-card-chip-attendance {
  background: #f9f9f9 !important;
  border: 1px solid #125e12 !important;
  color: #125e12 !important;
}
.lab-details_if_submitted {
  display: flex;
  flex: 1 0;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
}
.lab-details_if_submitted > p {
  font-weight: 400;
  font-size: 1rem;
  width: fit-content;
  align-items: center;
  text-align: center;
  white-space: break-spaces;
  word-break: inherit;
}
@media (min-width: 480px) {
  .aligner {
    text-align: center;
    text-overflow: ellipsis;
    text-transform: none;
    white-space: pre-line;
    word-break: break-word;
    word-wrap: break-word;
    font-size: 1rem;
    -webkit-hyphens: auto;
    hyphens: auto;
    letter-spacing: 0.0125em;
    overflow-wrap: anywhere;
    overflow: visible;
    font-weight: 500;
    width: fit-content;
    padding: 0.5rem 0.5rem;
    min-width: 8rem;
    max-width: 8rem;
  }
  .lab-course__code {
    font-weight: 500;
    font-size: 1rem;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    padding: 0;
  }
  .lab-chip__details {
    display: flex;
    padding: 0;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
  }
  .chip-separator {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    margin: 0.5rem 0.5rem;
    width: fit-content;
    flex: 1 0;
  }
  .chip-separator__left-chip {
    width: fit-content;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    flex: 1 0;
  }
  .chip-separator__right-chip {
    width: 5rem;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-end;
    flex: 1 0;
  }
  .chip-attendance {
    background: #f3f3f3;
    border: 1px solid #00c900;
    color: #00c900;
    word-wrap: break-word;
    width: inherit;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
  }
  .chip-semester {
    background: #f3f3f3;
    border: 1px solid #0136e6;
    color: #0136e6;
    word-wrap: break-word;
    width: inherit;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
  }
  :deep(.v-expansion-panel-title__icon) {
    display: inline-flex;
    margin-right: 0;
    margin-bottom: -4px;
    margin-top: -4px;
    user-select: none;
    margin-inline-start: auto;
  }
  .classOne {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    gap: 0.5rem;
    margin: 0.5rem 0.5rem;
    width: 100%;
  }

  .classOne > p {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: left;
    white-space: pre-line;
    word-break: break-word;
  }

  .classOne > button {
    width: fit-content;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
@media (min-width: 769px) {
  .sth-container {
    margin: 2rem 1rem;
    width: inherit;
    max-width: 100%;
    min-width: 320px;
  }
  .lab-course__code {
    font-weight: 500;
    font-size: 1rem;
    display: flex;
    flex-direction: row;
    justify-content: center;
    padding: 0;
    align-items: center;
  }
  .aligner {
    text-align: center;
    text-overflow: ellipsis;
    text-transform: none;
    white-space: nowrap;
    word-break: break-word;
    word-wrap: break-word;
    font-size: 1rem;
    -webkit-hyphens: auto;
    hyphens: auto;
    letter-spacing: 0.0125em;
    overflow-wrap: anywhere;
    overflow: visible;
    font-weight: 500;
    width: fit-content;
    padding: 0.5rem 0.5rem;
    min-width: min-content;
    max-width: max-content;
  }
  .classOne {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    margin: 0.5rem 0.5rem;
  }

  .classOne > p {
    width: fit-content;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .chip-separator {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    margin: 0.5rem 0.5rem;
    width: fit-content;
    flex: 1 0;
  }
  .chip-separator__left-chip {
    width: fit-content;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    flex: 1 0;
  }
  .chip-separator__right-chip {
    width: 5rem;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-end;
    flex: 2 0;
  }
  .chip-attendance {
    background: #f3f3f3;
    border: 1px solid #00c900;
    color: #00c900;
    word-wrap: break-word;
    width: inherit;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
  }
  .chip-semester {
    background: #f3f3f3;
    border: 1px solid #0136e6;
    color: #0136e6;
    word-wrap: break-word;
    width: inherit;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
  }
  :deep(.v-expansion-panel-title__icon) {
    display: inline-flex;
    margin-right: 0;
    margin-bottom: -4px;
    margin-top: -4px;
    user-select: none;
    margin-inline-start: auto;
  }
  .parent-label {
    margin-top: 2rem;
    margin-bottom: 2rem;
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
    /* min-width: 769px; */
  }
}

@media (min-width: 1025px) {
  :deep(.v-container) {
    max-width: 100%;
  }
  .lab-course__code {
    font-weight: 500;
    font-size: 1rem;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    padding: 0;
  }
  .chip-separator {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    margin: 0.5rem 0.5rem;
    width: fit-content;
    flex: 1 0;
  }
  .chip-separator__left-chip {
    width: fit-content;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    flex: 1 0;
  }
  .chip-separator__right-chip {
    width: 5rem;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-end;
    flex: 2 0;
  }
  .chip-attendance {
    background: #f3f3f3;
    border: 1px solid #00c900;
    color: #00c900;
    word-wrap: break-word;
    width: inherit;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
  }
  .chip-semester {
    background: #f3f3f3;
    border: 1px solid #0136e6;
    color: #0136e6;
    word-wrap: break-word;
    width: inherit;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
  }
  :deep(.v-expansion-panel-title__icon) {
    display: inline-flex;
    margin-right: 0;
    margin-bottom: -4px;
    margin-top: -4px;
    user-select: none;
    margin-inline-start: auto;
  }
  .parent-label {
    margin-top: 2rem;
    margin-bottom: 2rem;
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
    /* min-width: 769px; */
  }
}
</style>
