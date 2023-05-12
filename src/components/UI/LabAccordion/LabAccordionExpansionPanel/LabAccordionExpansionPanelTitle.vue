<template>
    <section>
        <div class="chip-separator">
            <div class="chip-separator__left-chip">
                <v-chip class="chip-bg" :class="{
                    'gray-out-card-chip-lab__details': (userType === 2 && lab.CanSubmit === false) || (userType === 1 && lab.IsAssistant === true),
                }" size="large" style="height: fit-content">
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
                <div>
                    <v-tooltip :text="toolTipText" location="bottom"
                        v-if="(userType === 2 && lab.CanSubmit === false) || (userType == 2 && lab.CanSubmit === true && lab.HasAlreadySubmitted === true)">
                        <template v-slot:activator="{ props }">
                            <v-chip variant="text" density="default" style="width: fit-content" v-bind="props"
                                :rounded="20">
                                <!-- rounder 20 if can submit === false -->
                                <div v-if="(userType === 2 && lab.CanSubmit === false)">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" viewBox="0 0 24 24">
                                        <path fill="#ff4646"
                                            d="M12 2c5.5 0 10 4.5 10 10s-4.5 10-10 10S2 17.5 2 12S6.5 2 12 2m0 2c-1.9 0-3.6.6-4.9 1.7l11.2 11.2c1-1.4 1.7-3.1 1.7-4.9c0-4.4-3.6-8-8-8m4.9 14.3L5.7 7.1C4.6 8.4 4 10.1 4 12c0 4.4 3.6 8 8 8c1.9 0 3.6-.6 4.9-1.7Z" />
                                    </svg>
                                </div>
                                <div
                                    v-else-if="(userType == 2 && lab.CanSubmit === true && lab.HasAlreadySubmitted === true)">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" viewBox="0 0 24 24">
                                        <path fill="#00c900" d="M21 7L9 19l-5.5-5.5l1.41-1.41L9 16.17L19.59 5.59L21 7Z" />
                                    </svg>
                                </div>
                            </v-chip>
                        </template>
                    </v-tooltip>
                </div>
                <v-chip class="chip-attendance" :class="{
                    'gray-out-card-chip-attendance': (userType === 2 && lab.CanSubmit === false) || (userType === 1 && lab.IsAssistant === true),
                }" size="large">
                    <div>{{ lab.CourseAttendanceString }}</div>
                </v-chip>
                <v-chip class="chip-semester" :class="{
                    'gray-out-card-chip-semester': (userType === 2 && lab.CanSubmit === false) || (userType === 1 && lab.IsAssistant === true),
                }" size="large">
                    <div>
                        {{ semesterReformer }}
                    </div>
                </v-chip>
            </div>
        </div>
    </section>
</template>    
<script lang="ts">
import { LabSemesterEnum } from '@/enums/LabSemesterEnum';
import { PersonAffiliation } from '@/enums/PersonAffiliationEnum';
import { PersonalisedCourseBySemester } from '@/models/BACKEND-MODELS/PersonalisedCoursesBySemesterResponse';
import { PropType, defineComponent, toRefs } from 'vue';

export default defineComponent({
    name: "LabAccordionExpansionPanelTitle",
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
    setup(props, _) {
        const { lab, user_type } = toRefs(props);
        const semesterReformer = (): string => {
            if (!lab.value || !lab.value.Semester)
                return "N/A";
            switch (lab.value.Semester) {
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
        const toolTipText = () => {
            if (!user_type.value || !lab.value) {
                return "";
            }
            if (user_type.value === PersonAffiliation.STUDENT) {
                if (lab.value.CanSubmit === false) {
                    return "Δεν επιτρέπεται να δηλωθεί";
                }
                if (lab.value.HasAlreadySubmitted === true) {
                    return 'Εχετε ηδη μια θέση σε εργαστηριακό τμήμα'
                }
            }
            if (user_type.value === PersonAffiliation.STAFF)
                return "";
        };
        return { lab, userType: user_type, semesterReformer, toolTipText };
    },
});
</script>
<style scoped>
.chip-separator {
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 0.5rem;
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

@media (min-width: 480px) {
    .chip-separator {
        flex-direction: row;
        justify-content: flex-start;
        margin: 0.5rem 0.5rem;
        width: fit-content;
        flex: 1 0;
    }

    .chip-separator__left-chip {
        flex: 1 0;
    }

    .chip-separator__right-chip {
        width: 5rem;
        justify-content: flex-end;
        flex: 1 0;
    }

}

@media (min-width: 769px) {
    .chip-separator__right-chip {
        flex: 2 0;
    }
}

@media (min-width: 1025px) {
    .chip-separator__right-chip {
        flex: 2 0;
    }
}
</style>