<template>
    <div class="chip-separator" @click="emitToParentCloseMobile">
        <div class="chip-separator__left-chip">
            <v-chip class="chip-bg" :class="{
                'gray-out-card-chip-lab__details': (user_type === 2 && lab.CanSubmit === false) || (user_type === 1 && lab.IsAssistant === true),
            }" size="large">
                <div class="lab-chip__details">
                    <div class="lab-course__code">
                        {{ `${lab.CourseCode} ` }}
                    </div>
                    <div class="aligner">
                        {{ lab.CourseName }}
                    </div>
                </div>
            </v-chip>
        </div>
        <div class="chip-separator__right-chip">
            <v-tooltip :text="toolTipText" location="bottom"
                v-if="(user_type === 2 && lab.CanSubmit === false) || (user_type == 2 && lab.CanSubmit === true && lab.HasAlreadySubmitted === true)">
                <template v-slot:activator="{ props }">
                    <div class="chip-permitted">
                        <v-chip variant="text" density="default" v-bind="props" :rounded="20">
                            <!-- style="width: fit-content" -->
                            <div v-if="(user_type === 2 && lab.CanSubmit === false)">
                                <svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" viewBox="0 0 24 24">
                                    <path fill="#ff4646"
                                        d="M12 2c5.5 0 10 4.5 10 10s-4.5 10-10 10S2 17.5 2 12S6.5 2 12 2m0 2c-1.9 0-3.6.6-4.9 1.7l11.2 11.2c1-1.4 1.7-3.1 1.7-4.9c0-4.4-3.6-8-8-8m4.9 14.3L5.7 7.1C4.6 8.4 4 10.1 4 12c0 4.4 3.6 8 8 8c1.9 0 3.6-.6 4.9-1.7Z" />
                                </svg>
                            </div>
                            <div v-if="(user_type == 2 && lab.CanSubmit === true && lab.HasAlreadySubmitted === true)">
                                <svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" viewBox="0 0 24 24">
                                    <path fill="#00c900" d="M21 7L9 19l-5.5-5.5l1.41-1.41L9 16.17L19.59 5.59L21 7Z" />
                                </svg>
                            </div>
                        </v-chip>
                    </div>
                </template>
            </v-tooltip>
            <v-chip class="chip-attendance" :class="{
                'gray-out-card-chip-attendance': (user_type === 2 && lab!.CanSubmit === false) || (user_type === 1 && lab!.IsAssistant === true),
            }" size="large">
                <div>{{ lab!.CourseAttendanceString }}</div>
            </v-chip>
            <v-chip class="chip-semester" :class="{
                'gray-out-card-chip-semester': (user_type === 2 && lab!.CanSubmit === false) || (user_type === 1 && lab!.IsAssistant === true),
            }" size="large">
                <div>
                    {{ semesterReformer }}
                </div>
            </v-chip>
        </div>
    </div>
</template>    
<script lang="ts">
import { LabSemesterEnum } from '@/enums/LabSemesterEnum';
import { PersonAffiliation } from '@/enums/PersonAffiliationEnum';
import { PersonalisedCourseBySemester } from '@/models/BACKEND-MODELS/PersonalisedCoursesBySemesterResponse';
import { computedEager } from '@vueuse/core';
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
            // default: 2 
        }
    },
    emits: ['close-mobile'],
    setup(props, context) {
        const { lab, user_type } = toRefs(props);
        const semesterReformer = computedEager((): string => {
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
        });
        const toolTipText = computedEager(() => {
            if (!user_type.value || !lab.value)
                return "";

            if (user_type.value === PersonAffiliation.STUDENT) {
                if (lab.value.CanSubmit === false)
                    return "Δεν επιτρέπεται να δηλωθεί";

                if (lab.value.HasAlreadySubmitted === true)
                    return 'Εχετε ηδη μια θέση σε εργαστηριακό τμήμα'
            }
            if (user_type.value === PersonAffiliation.STAFF)
                return "";
            return "0";
        });
        const emitToParentCloseMobile = () => {
            context.emit("close-mobile");
        }
        return { lab, user_type, semesterReformer, toolTipText, emitToParentCloseMobile };
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

.chip-bg {
    background: #f7f7f7;
    border: 1px solid #1c4397;
    color: #1c4397;
    word-wrap: break-word;
    height: fit-content;
}

.lab-chip__details {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    height: fit-content;
}

.gray-out-card-chip-lab__details {
    background: #d1d3d8 !important;
    border: 1px solid #273864 !important;
    color: #273864 !important;
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
    font-weight: 500;
    width: fit-content;
    /* padding-bottom: 0.5rem;
    padding-left: 0.5rem;
    padding-right: 0.5rem; */
    padding: 0.5rem 0.5rem;
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

.gray-out-card-chip-attendance {
    background: #f9f9f9 !important;
    border: 1px solid #125e12 !important;
    color: #125e12 !important;
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

.gray-out-card-chip-semester {
    background: #f9f9f9 !important;
    border: 1px solid #303c64 !important;
    color: #303c64 !important;
}

.chip-permitted {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
    padding: 0;
    --v-chip-size: 0;
    --v-chip-height: 0;

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

    .lab-chip__details {
        padding: 0;
        flex-direction: row;
    }

    .lab-course__code {
        padding: 0;
    }

    .aligner {
        word-wrap: break-word;
        overflow-wrap: anywhere;
        overflow: visible;
        min-width: 8rem;
        max-width: 8rem;
    }

    @media (min-width: 769px) {
        .chip-separator__right-chip {
            flex: 2 0;
        }

        .aligner {
            white-space: nowrap;
            min-width: min-content;
            max-width: max-content;
        }
    }

    @media (min-width: 1025px) {
        .chip-separator__right-chip {
            flex: 2 0;
        }
    }
}
</style>