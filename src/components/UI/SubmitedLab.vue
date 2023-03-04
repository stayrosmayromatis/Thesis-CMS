<template>
  <div class="card">
    <base-dialog
      v-if="showConfirmDeletionModal"
      :route-change-authorizer="true"
      :inner-title="confirmDeletionInnerTitle"
      :inner-description="confirmDeletionInnerDescription"
    ></base-dialog>
    <v-card
      elevation="5"
      class="card-item"
      :class="{ 'gray-out': IsAssistant }"
    >
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
          <v-chip
            outlined="true"
            class="card-chip-semester"
            :class="{ 'gray-out-card-chip-semester': IsAssistant }"
            >{{ Semester }}</v-chip
          >
          <v-chip
            outlined="true"
            :class="{ 'gray-out-card-chip-attendance': IsAssistant }"
            class="card-chip"
            >{{ lab.AttendanceString }}</v-chip
          >
          <!-- <v-btn class="delete-button" variant="tonal">
                    <v-icon icon="mdi-cancel"></v-icon>
                    Διαγραφη
                  </v-btn> -->
          <div class="media-button-group">
            <div>
              <v-tooltip :text="DeletionText" location="bottom">
                <template v-slot:activator="{ props }">
                  <v-btn
                    :class="{ 'not-visible-buttons': IsAssistant }"
                    v-bind="props"
                    class="delete-button"
                    icon="mdi-trash-can"
                    size="x-small"
                    @click="CheckDelete"
                  ></v-btn>
                </template>
              </v-tooltip>
            </div>
            <!-- <v-icon></v-icon> -->
            <!-- Διαγραφη -->
            <div v-if="IsStaffOrAdmin">
              <v-tooltip text="Τροποποίηση Εργαστηρίου" location="bottom">
                <template v-slot:activator="{ props }">
                  <v-btn
                    :class="{ 'not-visible-buttons': IsAssistant }"
                    v-bind="props"
                    class="edit-button"
                    icon="mdi-pencil"
                    size="x-small"
                  ></v-btn>
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
import { InfoController } from "@/config";
import { useAxiosInstance } from "@/composables/useInstance.composable";
import { ApiResult } from "../../models/DTO/ApiResult";
import { InfoAggregateObjectResponse } from "@/models/BACKEND-MODELS/InfoAggregateObjectResponse";
import BaseDialog from "@/components/Base/BaseDialog.vue";
import { TypeStaff } from "@/enums/StaffTypeEnum";
import { confirm } from "@/composables/dialog.composable";
export default defineComponent({
  props: {
    title: String,
    description: String,
    lab: {
      type: Object as PropType<SubmittedLab>,
      required: true,
      default: null,
    },
    personAffiliation: {
      type: Object as PropType<PersonAffiliation>,
      required: true,
      default: null,
    },
  },
  components: {
    BaseDialog,
  },
  setup(props) {
    const { lab, personAffiliation } = toRefs(props);
    const showConfirmDeletionModal = ref(false);
    const confirmDeletionInnerTitle = ref("ΠΡΟΕΙΔΟΠΟΙΗΣΗ");
    const confirmDeletionInnerDescription = ref("");
    const { setBackendInstanceAuth } = useAxiosInstance();
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
        case LabSemesterEnum.I_EAR:
          return "Ι ΕΞΑΜΗΝΟ";
        case LabSemesterEnum.K_XEIM:
          return "Κ ΕΞΑΜΗΝΟ";
        case LabSemesterEnum.L_EAR:
          return "Λ ΕΞΑΜΗΝΟ";
        default:
          return "N/A";
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
      //call to an endpoint depending on the courseGUID it detects if someone has a submittion or
      //and inform him about deleting it
      //if he is a teacher and wants to delete that course check if there is any student submittion with that
      //Guid and infom him
      const api_response = await useAxios(
        InfoController + `deletion-informant/${lab.value.CourseGUID}`,
        {
          method: "GET",
        },
        setBackendInstanceAuth()
      );
      if (api_response.isFinished) {
        const api_response_dta: ApiResult<InfoAggregateObjectResponse> = api_response.data.value;
        console.log(api_response_dta);
        if (api_response_dta.Status === true && api_response_dta.Data) {
          if (api_response_dta.Data.PersonAffiliation && api_response_dta.Data.PersonAffiliation === TypeStaff.STAFF) {
            if (
              api_response_dta.Data.FoundRegistration === true &&
              api_response_dta.Data.CountOfStudentsSubmited > 0
            ) {
              //Found dilwseis what do you want to do?
              showConfirmDeletionModal.value = true;
              confirmDeletionInnerDescription.value = `Βρέθηκε(αν) <span style="color:green;">${api_response_dta.Data.CountOfStudentsSubmited}</span> δήλωση(εις) στα εργαστηριακά τμήματα του μαθήματος <span style="color:green;">${api_response_dta.Data.CourseName}</span>.
              Θα πραγματοποιηθεί <span style="color:#ff4545;">διαγραφή</span> όλων των τμημάτων.
              Αυτο συνεπάγεται και στην <span style="color:#ff4545;">διαγραφή όλων των υπάρχοντων δηλώσεων των φοιτητών μέχρι αυτή τη στιγμή</span>.
              Θέλετε να προχωρήσετε σε <span style="color:#ff4545;">διαγραφή</span>;
              Η ενεργεια είναι <span style="color:#ff4545;">μη αναστρέψιμη</span> `;
            }
            else if (
              api_response_dta.Data.FoundRegistration === true &&
              !api_response_dta.Data.CountOfStudentsSubmited || api_response_dta.Data.CountOfStudentsSubmited === 0
            ) {
              //Dilwseis not found though do you wanna continue?
              showConfirmDeletionModal.value = true;
              confirmDeletionInnerDescription.value = `Δεν βρέθηκαν δηλώσεις στα εργαστηριακά τμήματα του μαθήματος <span style="color:green;">${api_response_dta.Data.CourseName}</span>.
                                                      Θα πραγματοποιηθεί <span style="color:#ff4545;">διαγραφή</span> όλων των συνδεδεμένων τμημάτων.
                                                      Θέλετε να προχωρήσετε σε <span style="color:#ff4545;">διαγραφή</span>;
                                                      Η ενεργεια είναι <span style="color:#ff4545;">μη αναστρέψιμη</span> `;
            }
            else
            {
              showConfirmDeletionModal.value = false;
                return;
            }
          }
          else if (api_response_dta.Data.PersonAffiliation && api_response_dta.Data.PersonAffiliation === TypeStaff.STUDENT)
          {
            if(api_response_dta.Data.FoundRegistration === true){
              showConfirmDeletionModal.value = true;
              confirmDeletionInnerDescription.value = `Είστε σίγουροι οτι θέλετε να απεγγραφείτε απο το εργαστηριακό τμήμα <span style="color:green;">${api_response_dta.Data.LabName} </span> του μαθήματος <span style="color:green;">${api_response_dta.Data.CourseCode} ${api_response_dta.Data.CourseName}</span>.
              Η ενέργεια είναι <span style="color:#ff4545;">μη αναστρέψιμη</span>.`;
            }
            else
            {
              showConfirmDeletionModal.value = false;
              return;
            }
          }
          else
          {
            showConfirmDeletionModal.value = false;
            return;
          }
          if (await confirm()) {
            console.log("confirmed");
          }
        }
        showConfirmDeletionModal.value = false;
        return;
      }
    };
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
    };
  },
});
</script>

<style scoped>
.card {
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
  min-width: 320px;
}

.card-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  flex-wrap: wrap;
  padding: 0;
  min-width: 320px;
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
    margin-bottom: 1.5rem;
    margin-top: 1.5rem;
    /* //min-width: 770px; */
  }

  .card-item {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    flex-wrap: nowrap;
  }

  .spacer {
    display: inline-flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    width: 100%;
  }

  :deep(.v-card-title) {
    display: block;
    flex: 1 0;
    font-size: 1.25rem;
    font-weight: 500;
    -webkit-hyphens: auto;
    hyphens: auto;
    letter-spacing: 0.0125em;
    min-width: 0;
    overflow-wrap: normal;
    overflow: hidden;
    padding: 0.5rem 1rem;
    text-overflow: ellipsis;
    text-transform: none;
    white-space: initial;
    word-break: break-word;
    word-wrap: unset;
    width: 45%;
    text-align: center;
  }

  :deep(.v-card-text) {
    font-size: 0.875rem;
    font-weight: 500;
    letter-spacing: 0.0178571429em;
    text-transform: none;
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
    max-width: 6rem;
  }

  .chip-group {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
    width: fit-content;
    flex: 1 0;
  }
}

@media (min-width: 1025px) {
  .card {
    margin-bottom: 1.5rem;
    margin-top: 1.5rem;
    min-width: 770px;
  }

  .card-item {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    flex-wrap: nowrap;
  }

  .spacer {
    display: inline-flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    width: 100%;
  }

  :deep(.v-card-title) {
    display: block;
    flex: 1 0;
    font-size: 1.25rem;
    font-weight: 500;
    -webkit-hyphens: auto;
    hyphens: auto;
    letter-spacing: 0.0125em;
    min-width: 0;
    overflow-wrap: normal;
    overflow: hidden;
    padding: 0.5rem 1rem;
    text-overflow: ellipsis;
    text-transform: none;
    white-space: nowrap;
    word-break: normal;
    word-wrap: break-word;
    width: 45%;
    text-align: inherit;
  }

  :deep(.v-card-text) {
    font-size: 0.875rem;
    font-weight: 500;
    letter-spacing: 0.0178571429em;
    text-transform: none;
    margin: 1rem 1rem;
    padding: 0;
    width: fit-content;
    display: flex;
    flex-direction: row;
    justify-content: center;
    flex: 1;
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
    max-width: 6rem;
  }

  .chip-group {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
    width: fit-content;
    flex: 1 0;
  }

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
