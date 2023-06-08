<template>
    <div class="card">
        <base-dialog :show="showConfirmDeletionModal" :route-change-authorizer="true"
            :inner-title="confirmDeletionInnerTitle" :inner-description="confirmDeletionInnerDescription"
            @close-modal="showConfirmDeletionModal = false"></base-dialog>
        <v-card class="card-item" :class="{ 'gray-out': IsAssistant }">
            <div class="card-title-group">
                <div class="chip-group">
                    <v-chip outlined="true" class="card-chip-semester"
                        :class="{ 'gray-out-card-chip-semester': IsAssistant }">{{ Semester }}</v-chip>
                    <v-chip outlined="true" :class="{ 'gray-out-card-chip-attendance': IsAssistant }"
                        class="card-chip-attendance">{{ lab.AttendanceString }}</v-chip>
                </div>
                <div class="media-button-group">
                    <div>
                        <v-tooltip :text="DeletionText" location="bottom">
                            <template v-slot:activator="{ props }">
                                <v-btn :class="{ 'not-visible-buttons': IsAssistant }" v-bind="props" class="delete-button"
                                    icon="mdi-trash-can" size="x-small" @click="CheckDelete"></v-btn>
                            </template>
                        </v-tooltip>
                    </div>
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
            <div class="main-content">
                <label class="lab-title">
                    {{ LabTitle }}
                </label>
            </div>
            <div class="main-details">
                <div class="lab-code">
                    <label>{{ LabCode }}</label>
                </div>
                <div class="lab-details">
                    <label>{{ LabDescription }}</label>
                    <label>{{ LabTimes }}</label>
                </div>
            </div>
        </v-card>
    </div>
</template>

<script lang="ts">
import { useAlert } from '@/composables/showAlert.composable';
import { useAxiosInstance } from '@/composables/useInstance.composable';
import { CourseController, InfoController } from '@/config';
import { LabSemesterEnum } from '@/enums/LabSemesterEnum';
import { PersonAffiliation } from '@/enums/PersonAffiliationEnum';
import { TypeStaff } from '@/enums/StaffTypeEnum';
import { SubmittedLab } from '@/models/BACKEND-MODELS/GenericSubmittedLabsResponse';
import { InfoAggregateObjectResponse } from '@/models/BACKEND-MODELS/InfoAggregateObjectResponse';
import { ApiResult } from '@/models/DTO/ApiResult';
import { InternalDataTransfter } from '@/models/DTO/InternalDataTransfer';
import { computedEager } from '@vueuse/core';
import { PropType, defineComponent, ref, toRefs } from 'vue';
import { useRouter } from 'vue-router';
import { confirm } from "@/composables/dialog.composable";
import BaseDialog from "@/components/Base/BaseDialog.vue";
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
    },
    components: {
        BaseDialog
    },
    name: "SubmittedLabCard",
    setup(props, context) {
        const { lab, personAffiliation, course_guid } = toRefs(props);
        const showConfirmDeletionModal = ref(false);
        const confirmDeletionInnerTitle = ref("ΠΡΟΕΙΔΟΠΟΙΗΣΗ");
        const confirmDeletionInnerDescription = ref("");
        const { MakeAPICall } = useAxiosInstance();
        const router = useRouter();
        const { closeAlert, openAlert, setTypeOfAlert } = useAlert();
        const LabCode = computedEager(() => {
            return `( ${lab.value.CourseCode.trim()} )`;
        });
        const LabTitle = computedEager(() => {
            return `${lab.value.CourseName.trim()}`;
        });
        const LabDescription = computedEager(() => {
            return `${lab.value.LabName.trim()} / ${lab.value.DayString.trim().charAt(0).toUpperCase() + lab.value.DayString.trim().slice(1).toLocaleLowerCase()}`;
        });
        const LabTimes = computedEager(() => {
            return `(${lab.value.From.trim()} - ${lab.value.To.trim()})`;
        });
        const Semester = computedEager(() => {
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
        const IsStaffOrAdmin = computedEager(() => {
            if (!personAffiliation.value) return false;
            if (
                personAffiliation.value === PersonAffiliation.STAFF ||
                personAffiliation.value === PersonAffiliation.ADMIN
            )
                return true;
            return false;
        });
        const DeletionText = computedEager(() => {
            if (!personAffiliation.value) return "Διαγραφή δηλωτέου ";
            if (personAffiliation.value === PersonAffiliation.STAFF || personAffiliation.value === PersonAffiliation.ADMIN)
                return "Διαγραφή εργαστηρίου";
            return "Διαγραφή δηλωτέου";
        });
        const IsAssistant = computedEager(() => !lab.value || !lab.value.IsAssistantProfessor ? false : true);
        const CheckDelete = async (): Promise<void> => {
            closeAlert();
            const makeInformationCallResponse = await MakeTheInformationCall();
            if (!makeInformationCallResponse.Status) {
                setTypeOfAlert('error');
                openAlert("Αποτυχία διαγραφής προσπαθήστε ξανά");
                closeAlert(1500);
                await delay(1500);
                showConfirmDeletionModal.value = false;
                return;
            }
            if (await confirm()) {
                const makeConfirmDeleteCallResponse = await MakeTheConfirmDeleteCall();
                showConfirmDeletionModal.value = false;
                if (!makeConfirmDeleteCallResponse.Status) {
                    setTypeOfAlert('error');
                    openAlert("Αποτυχία διαγραφής προσπαθήστε ξανά");
                    closeAlert(1500);
                    await delay(1500);
                    return;
                }
                context.emit("force-refetch");
                return;
            }
            showConfirmDeletionModal.value = false;
            return;
        }
        const MakeTheInformationCall = async (): Promise<InternalDataTransfter<boolean>> => {
            const api_response_dta = await MakeAPICall<ApiResult<InfoAggregateObjectResponse>>(InfoController, `deletion-informant/${lab.value.CourseGUID}/${lab.value.LabGUID}`, "GET");
            if (api_response_dta.Status && api_response_dta.Data) {
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
            //}
            showConfirmDeletionModal.value = false;
            return { Data: null, Status: false, Error: "Error" };
        };
        const MakeTheConfirmDeleteCall = async (): Promise<InternalDataTransfter<boolean>> => {
            const api_data_response = await MakeAPICall<ApiResult<boolean>, Object>(CourseController, `confirm-delete-submitted-course/${lab.value.CourseGUID}/${lab.value.LabGUID}`, "POST", {});
            return api_data_response ? { Data: api_data_response.Data, Status: api_data_response.Status } : { Data: null, Status: false, Error: "Error" };
        }
        const delay = (ms: number) => new Promise(res => setTimeout(res, ms));
        const redirectToEditComponent = async () => {
            if (course_guid.value) {
                await router.push({
                    name: 'addlab', query: {
                        editId: course_guid.value.trim().toString()
                    }
                });
            }
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
            showConfirmDeletionModal,
            CheckDelete,
            redirectToEditComponent
        }
    }
});
</script>

<style scoped>
.card-item {
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin: 0.5rem;
    width: min(50%, 1000px);
    min-width: 320px;
    height: 100%;
    border-radius: 16px;
    box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.2), 0 4px 6px -4px rgb(0 0 0 / 0.1);
    padding: 0.6rem;
}

.card-title-group {
    display: flex;
    justify-content: center;
    align-items: center;
    height: fit-content;

}

.chip-group {
    display: flex;
    flex: 1;
    justify-content: flex-start;
    align-items: center;
    gap: 0.5rem;
}

.media-button-group {
    display: flex;
    flex: 1;
    justify-content: flex-end;
    align-items: center;
    gap: 0.5rem;
}

.card-chip-attendance {
    width: fit-content;
    display: flex;
    justify-content: center;
    align-items: center;
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
    font-weight: 500;
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

.delete-button {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    color: #f44336;
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

.main-details {
    display: flex;
    flex-direction: row-reverse;
    justify-content: space-between;
    align-items: center;
    /* height: 100%; */
    padding: 0;
}

.main-details .lab-code {
    display: block;
    position: relative;
    bottom: -3px;
    left: -3px;
    color: #908E8B;
    width: fit-content;
    font-size: 1rem;
    font-weight: 450;
}

.main-details .lab-details {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    position: relative;
    bottom: 0px;
    right: -5px;
    font-size: 1rem;
    text-align: center;
    line-height: 20px;
    font-weight: 450;
    width: fit-content;
    color: #908E8B;
}

.main-content {
    width: 300px;
    text-align: left;
    word-wrap: break-word;
    white-space: break-spaces;
    font-weight: 600;
    line-height: 19px;
    padding: 2rem 0 2rem 0.5rem;
    font-family: "Inter", sans-serif;
}

@media screen and (min-width: 769px) {}

@media screen and (min-width: 1025px) {}
</style>