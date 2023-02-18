<template>
  <div class="card">
    <v-card elevation="5" class="card-item">
      <div class="spacer">
        <v-card-title>
          {{ LabName }}
        </v-card-title>
        <v-card-text>
          {{ LabDescription }}
        </v-card-text>
        <div class="chip-group">
          <v-chip outlined="true" class="card-chip-semester">{{
            Semester
          }}</v-chip>
          <v-chip outlined="true" class="card-chip">{{
            lab.AttendanceString
          }}</v-chip>
        </div>
        <div>
          
        </div>
      </div>
    </v-card>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, toRefs, computed } from "vue";
import { SubmittedLab } from "@/models/BACKEND-MODELS/StudentInfoResponse";
import { LabSemesterEnum } from "@/enums/LabSemesterEnum";

export default defineComponent({
  props: {
    title: String,
    description: String,
    lab: {
      type: Object as PropType<SubmittedLab>,
      required: true,
      default: null,
    },
  },
  setup(props) {
    const { lab } = toRefs(props);
    const LabName = computed(() => {
      return `(${lab.value.CourseCode.trim()}) ${lab.value.CourseName.trim()}`;
    });
    const LabDescription = computed(() => {
      return `${lab.value.LabName.trim()} / ${lab.value.DayString.trim()} (${lab.value.From.trim()} - ${lab.value.To.trim()})`;
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
          return 'N/A';
      }
    });
    return { LabName, LabDescription,Semester };
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
.card-chip-semester{
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
    white-space: nowrap;
    word-break: normal;
    word-wrap: break-word;
    width: 45%;
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
}
</style>
