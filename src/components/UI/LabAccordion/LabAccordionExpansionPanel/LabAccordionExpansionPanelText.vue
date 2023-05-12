<template>
    <div class="lab-accordion-expansion-panel-text-parent">
        <label>{{ lab.ShortDescription }}</label>
        <div class="lab-details_if_submitted">
            <div v-if="userType === 2">
                <div v-if="(
                    lab.CanSubmit === true &&
                    lab.HasAlreadySubmitted === true &&
                    lab.LabInfo
                )
                    ">
                    <div class="lab-details_if_submitted__chose">
                        <div class="view-aligner">
                            <label>{{ `Επιλέχθηκε το εργαστήριο` }}</label>
                            <label>{{ `${lab.LabInfo?.LabName} / ${lab.LabInfo?.Daystring} (${lab.LabInfo?.FromTimeString} -
                                                            ${lab.LabInfo?.ToTimeString})` }}</label>
                            <!-- <label>{{ `Επιλέχθηκε το εργαστήριο ${lab.LabInfo?.LabName} / ${lab.LabInfo?.Daystring} (${lab.LabInfo?.FromTimeString} -
                                          ${lab.LabInfo?.ToTimeString})` }}</label> -->
                        </div>
                        <div>
                            <v-tooltip :text="`Κατέχετε ηδη μια θέση στο εργαστήριο ${lab.LabInfo?.LabName}`"
                                :location="'bottom'">
                                <template v-slot:activator="{ props }">
                                    <v-chip variant="text" density="default" style="width: fit-content" v-bind="props">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" viewBox="0 0 24 24">
                                            <path fill="#00c900"
                                                d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10s10-4.5 10-10S17.5 2 12 2m0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8s8 3.59 8 8s-3.59 8-8 8m4.59-12.42L10 14.17l-2.59-2.58L6 13l4 4l8-8l-1.41-1.42Z" />
                                        </svg>
                                    </v-chip>
                                </template>
                            </v-tooltip>
                        </div>
                    </div>
                </div>
                <div v-if="(
                    lab.CanSubmit === false &&
                    lab.HasAlreadySubmitted === false &&
                    lab.DeniedReason
                )
                    ">
                    <div class="lab-details_if_submitted__chose">
                        <div class="view-aligner">
                            <label>{{ deniedReasonHandler }}</label>
                            <label>{{ deniedReasonTextWithDates }}</label>
                            <!-- <label>Θυρίδα προτεραιότητας κλειστή.</label>
                      <label>{{ `Δήλώσεις ανοικτές απο 17-05-2023, εως 17-05-2023` }}</label> -->
                        </div>
                        <div>
                            <v-tooltip :text="`Απαγορεύεται η δήλωση`" :location="'bottom'">
                                <template v-slot:activator="{ props }">
                                    <v-chip variant="text" density="default" style="width: fit-content" v-bind="props">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" viewBox="0 0 24 24">
                                            <path fill="#ff4646"
                                                d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10s10-4.47 10-10S17.53 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8s8 3.59 8 8s-3.59 8-8 8zm3.59-13L12 10.59L8.41 7L7 8.41L10.59 12L7 15.59L8.41 17L12 13.41L15.59 17L17 15.59L13.41 12L17 8.41z" />
                                        </svg>
                                    </v-chip>
                                </template>
                            </v-tooltip>
                        </div>
                    </div>
                </div>
            </div>
            <!-- <div v-if="userType === 1">

              </div> -->

            <v-btn v-if="(userType === 2 &&
                lab.CanSubmit === true &&
                lab.HasAlreadySubmitted === false &&
                !lab.LabInfo) || (userType === 1)
                " @click="pushToHandle(lab.CourseGUID)" color="#a3cef1" elevation="4">{{ userType === 2 ? 'Δηλωσε το' :
        user_type === 1 ? 'Πορεια Δηλωσης' : 'Επιλογη' }}</v-btn>
        </div>
    </div>
</template>

<script lang="ts">
import { PermissionDeniedToSubmitReason } from '@/enums/PermissionDeniedToSubmitReason';
import { PersonAffiliation } from '@/enums/PersonAffiliationEnum';
import { PersonalisedCourseBySemester } from '@/models/BACKEND-MODELS/PersonalisedCoursesBySemesterResponse';
import { computedEager } from '@vueuse/core';
import { onMounted } from 'vue';
import { PropType, toRefs } from 'vue';
import { defineComponent } from 'vue';
import { useRouter } from 'vue-router';


export default defineComponent({
    name: 'LabAccordionExpansionPanelText',
    props: {
        lab: {
            type: Object as PropType<PersonalisedCourseBySemester>,
            required: true,
            default: {}
        },
        user_type: {
            type: Number as PropType<PersonAffiliation>,
            required: true,
            default: undefined
        }
    },
    setup(props) {
        const { lab, user_type } = toRefs(props);
        const router = useRouter();
        const pushToHandle = (guid: string) => {
            if (!guid) return;
            router.push({
                name: "enroll",
                params: {
                    course_guid: guid,
                },
            });
            return;
        };
        const deniedReasonTextWithDates = computedEager((): string => {
            let result = "";
            if (!lab.value)
                return result;
            if (lab.value.DeniedReason && lab.value.DeniedReason === PermissionDeniedToSubmitReason.NOT_AT_VALID_DATE) {
                if (lab.value.CanSubmitAfter && lab.value.CanSubmitAfterString) {
                    result += + `Δυνατότητα δήλωσης απο ${lab.value.CanSubmitAfterString}, `
                }
                if (lab.value.CanSubmitUntil && lab.value.CanSubmitUntilString) {
                    result += `εως ${lab.value.CanSubmitUntilString}.`
                }
            }
            return result;
        });

        const deniedReasonHandler = computedEager((): string => {
            let result = "Δεν υπάρχει δυνατότητα δήλωσης";
            if (!lab.value || !lab.value.DeniedReason)
                return result;
            switch (lab.value.DeniedReason) {
                case PermissionDeniedToSubmitReason.NOT_AT_VALID_DATE:
                    return "Θυρίδα προτεραιότητας κλειστή. ";
                case PermissionDeniedToSubmitReason.NOT_AT_VALID_SEMESTER:
                    return "Δεν βρίσκεστε στο τυπικό εξάμηνο του μαθήματος";
                default:
                    return result;
            }
        });
        return { lab, userType: user_type, deniedReasonTextWithDates, deniedReasonHandler, pushToHandle }
    }
});
</script>

<style scoped>
.lab-accordion-expansion-panel-text-parent {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 0.5rem;
    margin: 0.5rem 0.5rem;
    width: 100%;
}

.lab-accordion-expansion-panel-text-parent>label {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    white-space: pre-line;
    word-break: break-word;
}

.lab-accordion-expansion-panel-text-parent>button {
    width: fit-content;
    display: flex;
    justify-content: center;
    align-items: center;
}

.lab-details_if_submitted {
    display: flex;
    flex: 1 0;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    width: 100%;
}

.lab-details_if_submitted>label {
    font-weight: 400;
    font-size: 1rem;
    width: fit-content;
    text-align: center;
    white-space: pre-line;
    word-break: inherit;
}

.lab-details_if_submitted__chose {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: inherit;
    gap: 0.5rem;
}

.lab-details_if_submitted__chose>label {
    text-align: center;
}

.lab-details_if_submitted__chose .view-aligner {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
}

.view-aligner label {
    word-break: break-word;
    word-wrap: break-word;
    text-align: center;
}

@media (min-width: 480px) {
    .lab-accordion-expansion-panel-text-parent>label {
        text-align: left;
    }
}

@media (min-width: 769px) {
    .lab-accordion-expansion-panel-text-parent {
        flex-direction: row;
        justify-content: space-between;
        margin: 0.5rem 0.5rem;
    }

    .lab-accordion-expansion-panel-text-parent>label {
        width: fit-content;
    }

    .lab-details_if_submitted {
        justify-content: flex-end;
    }

    .lab-details_if_submitted__chose {
        flex-direction: row;
    }

    .lab-details_if_submitted__chose .view-aligner {
        align-items: flex-end;
    }
}
</style>