<template>
    <div class="export-panel-export-option__parent">
        <v-expansion-panel>
            <v-expansion-panel-title expand-icon="mdi-plus" collapse-icon="mdi-minus">
                <div class="export-panel-title-container">
                    <div class="export_left--chip">
                        <v-chip class="left_chip--bg" size="large">
                            <label id="courseCode">
                                {{ `${course.CourseCode}` }}
                            </label>
                            <label id="courseName">
                                {{ `${course.CourseName}` }}
                            </label>
                        </v-chip>
                    </div>
                    <div class="export_right--chips">
                        <v-chip class="chip-attendance" size="large">
                            <label>
                                {{ course.CourseAttendanceString }}
                            </label>
                        </v-chip>
                        <v-chip class="chip-semester" size="large">
                            <label>
                                {{ semesterReformer(course.Semester) }}
                            </label>
                        </v-chip>
                    </div>
                </div>
            </v-expansion-panel-title>
            <v-expansion-panel-text>
                <expansion-panel-text-export-option :course_code="course.CourseCode"></expansion-panel-text-export-option>
            </v-expansion-panel-text>
        </v-expansion-panel>
    </div>
</template>    
<script lang="ts">
import { LabSemesterEnum } from '@/enums/LabSemesterEnum';
import { PersonalisedCourseBySemester } from '@/models/BACKEND-MODELS/PersonalisedCoursesBySemesterResponse';
import { PropType, defineComponent, toRefs } from 'vue';
import ExpansionPanelTextExportOption from '@/components/UI/Admin/ExportOptions/ExpansionPanelTextExportOption.vue';
export default defineComponent({
    props: {
        course: {
            type: Object as PropType<PersonalisedCourseBySemester>,
            required: true,
            default: {}
        }
    },
    components: {
        ExpansionPanelTextExportOption
    },
    setup(props) {
        const { course } = toRefs(props);
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
        return { course, semesterReformer };
    }
});
</script>

<style scoped>
.export-panel-export-option__parent {
    width: 100%;
}

.export-panel-title-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    gap: 1rem;
    padding: 0 0.5rem
}

.export_left--chip {}

.export_right--chips {
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
    align-items: center;
    gap: 1rem;
}

.left_chip--bg {
    background: #f7f7f7;
    border: 1px solid #1c4397;
    color: #1c4397;
    gap: 0.5rem;
    height: fit-content;
    padding: 0.1rem 0.5rem;
    display: flex;
    flex-direction: row;
}

.left_chip--bg>label#courseCode {
    font-size: 1rem;
    text-align: center;
    padding: 0.5rem 0;
    width: fit-content;
    height: fit-content;
    max-width: 20rem;
    letter-spacing: 0.05rem;
}

.left_chip--bg>label#courseName {
    font-size: 1rem;
    word-wrap: break-word;
    text-align: center;
    white-space: pre-line;
    padding: 0.5rem 0;
    width: fit-content;
    height: fit-content;
    max-width: 20rem;
    letter-spacing: 0.05rem;
}

.chip-attendance {
    background: #f7f7f7;
    border: 1px solid #00c900;
    color: #00c900;
    word-wrap: break-word;
    width: fit-content;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    padding: 0.5rem 0.5rem;
    min-width: 5rem;
}

.chip-semester {
    background: #f7f7f7;
    border: 1px solid #0136e6;
    color: #0136e6;
    word-wrap: break-word;
    width: fit-content;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    padding: 0.5rem 0.5rem;
    min-width: 5rem;
}

.chip-attendance,
.chip-semester>label {
    text-align: center;
    font-size: 1.1rem;
}

@media (min-width: 769px) {
    .export-panel-title-container {
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        width: 100%;
        gap: 0;
    }

    .export_right--chips {
        justify-content: flex-end;
        align-items: center;
        gap: 1rem;

    }

    .left_chip--bg {
        padding: 0.3rem 2rem;
    }

    .left_chip--bg>label#courseCode,
    .left_chip--bg>label#courseName {
        max-width: 17rem;
        letter-spacing: 0.05rem;
        /* line-height: 1.3rem; */
        /* white-space: normal; */
        width: fit-content;

    }
}</style>