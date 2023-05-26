<template>
  <div class="card">
    <base-dialog :show="showConfirmDeletionModal" :route-change-authorizer="true" :inner-title="confirmDeletionInnerTitle"
      :inner-description="confirmDeletionInnerDescription" @close-modal="showConfirmDeletionModal = false"></base-dialog>
    <!-- elevation="5" -->
    <v-card class="card-item" :class="{ 'gray-out': IsAssistant }">
      <div class="spacer">
        <div class="lab-code">
          {{ LabCode }}
        </div>
        <v-card-title>
          {{ LabTitle }}
        </v-card-title>
        <v-card-text>
          <div class="times-separator">
            <div>
              {{ LabDescription }}
            </div>
            <div>
              {{ LabTimes }}
            </div>
          </div>
        </v-card-text>
        <div class="chip-group">
          <v-chip outlined="true" class="card-chip-semester" :class="{ 'gray-out-card-chip-semester': IsAssistant }">{{
            Semester }}</v-chip>
          <v-chip outlined="true" :class="{ 'gray-out-card-chip-attendance': IsAssistant }" class="card-chip">{{
            lab.AttendanceString }}</v-chip>
          <div class="media-button-group">
            <div>
              <v-tooltip :text="DeletionText" location="bottom">
                <template v-slot:activator="{ props }">
                  <v-btn :class="{ 'not-visible-buttons': IsAssistant }" v-bind="props" class="delete-button"
                    icon="mdi-trash-can" size="x-small" @click="CheckDelete"></v-btn>
                </template>
              </v-tooltip>
            </div>
            <!-- <v-icon></v-icon> -->
            <!-- Διαγραφη -->
            <div v-if="IsStaffOrAdmin">
              <v-tooltip text="Τροποποίηση Εργαστηρίου" location="bottom">
                <template v-slot:activator="{ props }">
                  <v-btn :class="{ 'not-visible-buttons': IsAssistant }" v-bind="props" class="edit-button"
                    icon="mdi-pencil" size="x-small" @click="redirectToEditComponent"></v-btn>
                </template>
              </v-tooltip>
            </div>
          </div>
        </div>
      </div>
    </v-card>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, toRefs, computed, ref } from "vue";
import { SubmittedLab } from "@/models/BACKEND-MODELS/GenericSubmittedLabsResponse";
import { LabSemesterEnum } from "@/enums/LabSemesterEnum";
import { PersonAffiliation } from "@/enums/PersonAffiliationEnum";
import { useAxios } from "@vueuse/integrations/useAxios";
import { InfoController, CourseController } from "@/config";
import { useAxiosInstance } from "@/composables/useInstance.composable";
import { ApiResult } from "@/models/DTO/ApiResult";
import { InfoAggregateObjectResponse } from "@/models/BACKEND-MODELS/InfoAggregateObjectResponse";
import BaseDialog from "@/components/Base/BaseDialog.vue";
import { TypeStaff } from "@/enums/StaffTypeEnum";
import { confirm } from "@/composables/dialog.composable";
import { useAlert } from "@/composables/showAlert.composable";
import { InternalDataTransfter } from '@/models/DTO/InternalDataTransfer';
import { useRouter } from "vue-router";
export default defineComponent({
  props: {
    title: String,
    description: String,
    lab: {
      type: Object as PropType<SubmittedLab>,
      required: true,
      default: null,
    },
    course_guid: {
      type: String,
      required: false,
      default: null,
    },
    personAffiliation: {
      type: Number as PropType<PersonAffiliation>,
        required: true,
        default: undefined
    },
    // personAffiliation: {
    //   type: Object as PropType<PersonAffiliation>,
    //   required: true,
    //   default: null,
    // },
  },
  components: {
    BaseDialog,
  },
  emits: ["force-refetch"],
  setup(props, context) {
    const { lab, personAffiliation, course_guid } = toRefs(props);
    const showConfirmDeletionModal = ref(false);
    const confirmDeletionInnerTitle = ref("ΠΡΟΕΙΔΟΠΟΙΗΣΗ");
    const confirmDeletionInnerDescription = ref("");
    const { setBackendInstanceAuth } = useAxiosInstance();
    const router = useRouter();
    const {
      closeAlert,
      openAlert,
      setTypeOfAlert,
      showAlert,
      alertTitle,
      typeOfAlert,
    } = useAlert();
    const LabCode = computed(() => {
      return `(${lab.value.CourseCode.trim()})`;
    });
    const LabTitle = computed(() => {
      return `${lab.value.CourseName.trim()}`;
    });
    const LabDescription = computed(() => {
      return `${lab.value.LabName.trim()} / ${lab.value.DayString.trim()}`;
    });
    const LabTimes = computed(() => {
      return `(${lab.value.From.trim()} - ${lab.value.To.trim()})`;
    });
    const Semester = computed(() => {
      switch (lab.value.Semester) {
        case LabSemesterEnum.A_XEIM:
          return "Α ΕΞΑΜΗΝΟ";
        case LabSemesterEnum.B_EAR:
          return "Β ΕΞΑΜΗΝΟ";
        case LabSemesterEnum.C_XEIM:
          return "Γ ΕΞΑΜΗΝΟ";
        case LabSemesterEnum.D_EAR:
          return "Δ ΕΞΑΜΗΝΟ";
        case LabSemesterEnum.E_XEIM:
          return "E ΕΞΑΜΗΝΟ";
        case LabSemesterEnum.ST_EAR:
          return "ΣΤ ΕΞΑΜΗΝΟ";
        case LabSemesterEnum.Z_XEIM:
          return "Ζ ΕΞΑΜΗΝΟ";
        case LabSemesterEnum.H_EAR:
          return "Η ΕΞΑΜΗΝΟ";
        case LabSemesterEnum.TH_XEIM:
          return "Θ ΕΞΑΜΗΝΟ";
        default:
          return "Χ/Ε";
      }
    });
    const IsStaffOrAdmin = computed(() => {
      if (!personAffiliation.value) return false;
      if (
        personAffiliation.value === PersonAffiliation.STAFF ||
        personAffiliation.value === PersonAffiliation.ADMIN
      )
        return true;
      return false;
    });
    const DeletionText = computed(() => {
      if (!personAffiliation.value) return "Διαγραφή δηλωτέου ";
      if (
        personAffiliation.value === PersonAffiliation.STAFF ||
        personAffiliation.value === PersonAffiliation.ADMIN
      )
        return "Διαγραφή εργαστηρίου";
      return "Διαγραφή δηλωτέου";
    });
    const IsAssistant = computed(() => {
      if (
        !lab.value ||
        lab.value.IsAssistantProfessor === false ||
        !lab.value.IsAssistantProfessor
      )
        return false;
      return true;
    });
    const CheckDelete = async (): Promise<void> => {
      const makeInformationCallResponse = await MakeTheInformationCall();
      if (!makeInformationCallResponse.Status) {
        setTypeOfAlert('error');
        openAlert("Αποτυχία διαγραφής προσπαθήστε ξανά");
        setTimeout(() => {
          closeAlert();
        }, 1500);
        showConfirmDeletionModal.value = false;
        return;
      }
      if (await confirm()) {
        const makeConfirmDeleteCallResponse = await MakeTheConfirmDeleteCall();
        showConfirmDeletionModal.value = false;
        if (!makeConfirmDeleteCallResponse.Status) {
          setTypeOfAlert('error');
          openAlert("Αποτυχία διαγραφής προσπαθήστε ξανά");
          setTimeout(() => {
            closeAlert();
          }, 1500);
          return;
        }
        context.emit("force-refetch");
        return;
      }
      showConfirmDeletionModal.value = false;
      return;
    }
    const MakeTheInformationCall = async (): Promise<InternalDataTransfter<boolean>> => {
      const api_response = await useAxios(InfoController + `deletion-informant/${lab.value.CourseGUID}/${lab.value.LabGUID}`, { method: "GET" }, setBackendInstanceAuth());
      if (api_response.isFinished) {
        const api_response_dta: ApiResult<InfoAggregateObjectResponse> = api_response.data.value;
        if (api_response_dta.Status === true && api_response_dta.Data) {
          if (api_response_dta.Data.PersonAffiliation && api_response_dta.Data.PersonAffiliation === TypeStaff.STAFF) {
            if ((api_response_dta.Data.FoundRegistration === false || !api_response_dta.Data.FoundRegistration) &&
              (api_response_dta.Data.CountOfStudentsSubmited === 0 || !api_response_dta.Data.CountOfStudentsSubmited)) {
              showConfirmDeletionModal.value = true;
              confirmDeletionInnerDescription.value = `Δεν βρέθηκαν δηλώσεις στο εργαστηριακό τμήμα <span style="color:green;">${api_response_dta.Data.LabName}</span> του μαθήματος <span style="color:green;">${api_response_dta.Data.CourseName}</span>.
                                                      Θα πραγματοποιηθεί <span style="color:#ff4545;">διαγραφή</span> του τμήματος.
                                                      Θέλετε να προχωρήσετε σε <span style="color:#ff4545;">διαγραφή</span>; Η ενεργεια είναι <span style="color:#ff4545;">μη αναστρέψιμη.</span> `;
              return { Data: true, Status: true };
            } else if (api_response_dta.Data.FoundRegistration === true && api_response_dta.Data.CountOfStudentsSubmited > 0) {
              //Found dilwseis what do you want to do?
              showConfirmDeletionModal.value = true;
              confirmDeletionInnerDescription.value = `Βρέθηκε(αν) <span style="color:green;">${api_response_dta.Data.CountOfStudentsSubmited}</span> δήλωση(εις) στo εργαστηριακό τμήμα <span style="color:green;">${api_response_dta.Data.LabName}</span> του μαθήματος <span style="color:green;">${api_response_dta.Data.CourseName}</span>.
              Θα πραγματοποιηθεί <span style="color:#ff4545;">διαγραφή</span> του τμήματος.
              Αυτο συνεπάγεται και στην <span style="color:#ff4545;">διαγραφή όλων των υπάρχοντων δηλώσεων των φοιτητών μέχρι αυτή τη στιγμή</span>.
              Θέλετε να προχωρήσετε σε <span style="color:#ff4545;">διαγραφή</span>; Η ενεργεια είναι <span style="color:#ff4545;">μη αναστρέψιμη.</span> `;
              return { Data: true, Status: true };
            }
            else if ((api_response_dta.Data.FoundRegistration === true && !api_response_dta.Data.CountOfStudentsSubmited) || api_response_dta.Data.CountOfStudentsSubmited === 0) {
              //Dilwseis not found though do you wanna continue?
              showConfirmDeletionModal.value = true;
              confirmDeletionInnerDescription.value = `Δεν βρέθηκαν δηλώσεις στο εργαστηριακό τμήμα <span style="color:green;">${api_response_dta.Data.LabName}</span> του μαθήματος <span style="color:green;">${api_response_dta.Data.CourseName}</span>.
                                                      Θα πραγματοποιηθεί <span style="color:#ff4545;">διαγραφή</span> του τμήματος.
                                                      Θέλετε να προχωρήσετε σε <span style="color:#ff4545;">διαγραφή</span>; Η ενεργεια είναι <span style="color:#ff4545;">μη αναστρέψιμη.</span> `;
              return { Data: true, Status: true };
            }
            else {
              showConfirmDeletionModal.value = false;
              return { Data: null, Status: false, Error: "Error" };
            }
          } if (api_response_dta.Data.PersonAffiliation && api_response_dta.Data.PersonAffiliation === TypeStaff.STUDENT) {
            if (api_response_dta.Data.FoundRegistration === false || !api_response_dta.Data.FoundRegistration) {
              showConfirmDeletionModal.value = false;
              return { Data: null, Status: false, Error: "Error" };
            }
            showConfirmDeletionModal.value = true;
            confirmDeletionInnerDescription.value = `Είστε σίγουροι οτι θέλετε να απεγγραφείτε απο το εργαστηριακό τμήμα <span style="color:green;">${api_response_dta.Data.LabName} </span> του μαθήματος <span style="color:green;">${api_response_dta.Data.CourseCode} ${api_response_dta.Data.CourseName}</span>.
            Η ενέργεια είναι <span style="color:#ff4545;">μη αναστρέψιμη</span>.`;
            return { Data: true, Status: true };
          }
        }
      }
      showConfirmDeletionModal.value = false;
      return { Data: null, Status: false, Error: "Error" };
    };
    const MakeTheConfirmDeleteCall = async (): Promise<InternalDataTransfter<boolean>> => {
      const api_response = await useAxios(CourseController + `confirm-delete-submitted-course/${lab.value.CourseGUID}/${lab.value.LabGUID}`, { method: "POST", }, setBackendInstanceAuth());
      if (api_response.isFinished) {
        const api_data_response: ApiResult<boolean> = api_response.data.value;
        return { Data: api_data_response.Data, Status: api_data_response.Status }
      }
      return { Data: null, Status: false, Error: "Error" };
    }

    const redirectToEditComponent = () => {
      if (!course_guid.value)
        return;
      router.push({
        name: 'addlab', query: {
          editId: course_guid.value.trim().toString()
        }
      });
    }
    return {
      confirmDeletionInnerDescription,
      confirmDeletionInnerTitle,
      LabCode,
      LabDescription,
      Semester,
      IsStaffOrAdmin,
      DeletionText,
      IsAssistant,
      LabTitle,
      LabTimes,
      CheckDelete,
      showConfirmDeletionModal,
      redirectToEditComponent
    };
  },
});
</script>

<style scoped>
.card {
  min-width: 320px;
  margin: 0.5rem 0.3rem;
}

.card-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  flex-wrap: wrap;
  padding: 0;
  min-width: 320px;
  box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.2), 0 4px 6px -4px rgb(0 0 0 / 0.1);
  border-radius: 12px;
}

.spacer {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0.5rem;
  min-width: 320px;
  width: 100%;
}

.card-chip {
  width: fit-content;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0.5rem;
  padding: 1rem 2rem;
  font-weight: 500;
  border: 1px solid #09aa09;
  color: #09aa09;
  background: #f3f3f3;
  max-width: 16rem;
}

.card-chip-semester {
  background: #f7f7f7;
  border: 1px solid #1c4397;
  color: #1c4397;
  max-width: 16rem;
  width: fit-content;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0.5rem;
  padding: 1rem 2rem;
  font-weight: 500;
}

.chip-group {
  display: flex;
  flex-direction: row;
  flex: 1 0;
  align-items: center;
  justify-content: center;
  width: 100%;
}

:deep(.v-card-text) {
  flex: 0;
  font-size: 0.875rem;
  font-weight: 400;
  letter-spacing: 0.0178571429em;
  padding: 0.5rem;
  text-transform: none;
}

.delete-button {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  /* color: white; */
  color: #f44336;
  /* background: #f44336; */
  background: #f7f7f7;
  border: 1px solid #f44336;
  margin: 0 !important;
  width: fit-content;
  padding: 0.6em !important;
  font-size: 0.8rem !important;
  border-radius: 2rem !important;
  height: 2rem !important;
}

.delete-button:hover {
  color: #f7f7f7;
  /* background: #f44336; */
  background: #f44336;
}

.edit-button:hover {
  color: #f7f7f7;
  /* background: #f44336; */
  background: #1c4397;
}

.edit-button {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  background: #f7f7f7;
  border: 1px solid #1c4397;
  color: #1c4397;
  margin: 0 !important;
  width: fit-content;
  padding: 0.6em !important;
  font-size: 0.8rem !important;
  border-radius: 2rem !important;
  height: 2rem !important;
}

:deep(.v-card-title) {
  display: block;
  flex: none;
  font-size: 1.25rem;
  font-weight: 500;
  hyphens: auto;
  letter-spacing: 0.0125em;
  min-width: 0;
  overflow-wrap: normal;
  overflow: hidden;
  padding: 0.5rem 1rem;
  text-overflow: clip;
  text-transform: none;
  white-space: inherit;
  word-break: break-word;
  word-wrap: break-word;
  text-align: center;
}

.media-button-group {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
}

.gray-out {
  background-color: #f1eeee;
}

.gray-out-card-chip-semester {
  background: #d1d3d8 !important;
  border: 1px solid #273864 !important;
  color: #273864 !important;
}

.gray-out-card-chip-attendance {
  background: #f9f9f9 !important;
  border: 1px solid #125e12 !important;
  color: #125e12 !important;
}

.not-visible-buttons {
  visibility: hidden;
}

.lab-code {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 0.5rem 1rem;
  font-weight: 500;
  font-size: 1.25rem;
  hyphens: auto;
  -ms-hyphens: auto;
  -moz-hyphens: auto;
  -webkit-hyphens: auto;
  text-overflow: ellipsis;
  letter-spacing: 0.0125em;
  overflow: hidden;
  text-transform: none;
  white-space: inherit;
  word-break: break-all;
  text-align: center;
  word-wrap: break-word;
}

@media (min-width: 769px) {
  .card {
    margin: 1.5rem 0.3rem;
  }

  .card-item {
    flex-direction: row;
    justify-content: center;
    flex-wrap: nowrap;
  }

  .spacer {
    display: inline-flex;
    flex-direction: row;
    justify-content: space-between;
  }

  :deep(.v-card-title) {
    flex: 1 0;
    -webkit-hyphens: auto;
    letter-spacing: 0.0125em;
    text-overflow: ellipsis;
    white-space: initial;
    word-wrap: unset;
    width: 45%;
  }

  :deep(.v-card-text) {
    font-weight: 500;
    margin: 1rem 1rem;
    padding: 0;
    width: fit-content;
    display: flex;
    flex-direction: row;
    justify-content: center;
    flex: 1 0;
    text-overflow: ellipsis;
    text-transform: none;
    white-space: initial;
    word-break: break-word;
    text-align: center;
    word-wrap: unset;
  }

  .card-chip {
    max-width: 6rem;
  }

  .chip-group {
    justify-content: flex-end;
    width: fit-content;
  }
}

@media (min-width: 1025px) {
  /* .card {
    min-width: 770px;
  } */

  .spacer {
    justify-content: flex-start;
  }

  :deep(.v-card-title) {
    white-space: nowrap;
    word-break: normal;
    word-wrap: break-word;
    text-align: inherit;
  }

  /* :deep(.v-card-text) {
    flex: 1;
  } */

  .times-separator {
    display: flex;
    flex-direction: row;
    gap: 0.5rem;
    justify-content: flex-start;
    align-items: center;
    width: 100%;
  }
}
</style>
