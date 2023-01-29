<template>
  <v-container class="sth-container" @click="emitMobileViewClose">
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
      open-on-clear
      clearable
      multiple
      @update:model-value="logSelectedLabs"
    >
    </v-select>
    <!-- <v-app> -->
    <v-expansion-panels v-if="labs">
      <v-expansion-panel v-for="lab in labs" :key="lab.labId">
        <v-expansion-panel-title>
          <div class="chip-separator">
            <div class="chip-separator__left-chip">
              <v-chip class="chip-bg" size="large">
                <div class="large-font">
                  {{ lab.labId }} - {{ lab.labTitle }}
                </div>
              </v-chip>
            </div>
            <div class="chip-separator__right-chip">
              <v-chip class="chip-attendance" size="large">
                <div class="large-font">{{ lab.attendance?.title }}</div>
              </v-chip>
            </div>
          </div>
        </v-expansion-panel-title>
        <v-expansion-panel-text>
          <div class="classOne">
            <p>{{ lab.description }}</p>
            <v-btn color="#a3cef1" elevation="4">Πανε στην δηλωση</v-btn>
          </div>
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>
    <!-- </v-app> -->
  </v-container>
</template>

<script lang="ts">
import { defineComponent, ref, Ref, onMounted } from "vue";
import { LabSemesterEnum } from "@/enums/LabSemesterEnum";
import { DisplayedSemster } from "@/models/displayedsemester.type";
import { displayedLabs } from "@/composables/displayedSemesterArray.composable";
import { AttendanceEnum } from "@/enums/AttendanceEnums";
import { Lab } from "@/models/lab.type";
export default defineComponent({
  emits: ["closeMobileView"],
  setup(_, context) {
    const displayLabs: Array<DisplayedSemster> = displayedLabs();
    const selectedLabs: Ref<Array<LabSemesterEnum>> = ref(
      Array<LabSemesterEnum>()
    );

    const logSelectedLabs = (displayedLabs: Array<LabSemesterEnum>) => {
      selectedLabs.value = [];
      displayedLabs.forEach((displayedLab) => {
        console.log(displayedLab);
        selectedLabs.value.push(displayedLab);
      });
      console.log(selectedLabs.value);
    };
    const labs: Ref<Array<Lab>> = ref([
      {
        labId: "1601",
        labTitle: "Οργάνωση και αρχιτεκτονική",
        semester: LabSemesterEnum.A_XEIM,
        description: "Πληροφορίες Εργαστηρίου",
        departments: undefined,
        attendance: {
          title: "ΥΠ",
          value: AttendanceEnum.ΥΠ,
        },
        // attendance : AttendanceEnum.ΥΠ
      },
      {
        labId: "1602",
        labTitle: "Δικτυα και αρχιτεκτονική",
        semester: LabSemesterEnum.B_EAR,
        description: "Πληροφορίες Εργαστηρίου",
        departments: undefined,
        attendance: {
          title: "ΥΠ_ΠΡ",
          value: AttendanceEnum.ΥΠ_ΠΡ,
        },
      },
      {
        labId: "1603",
        labTitle: "Δομημένος Προγραμματισμός",
        semester: LabSemesterEnum.C_XEIM,
        description: "Πληροφορίες Εργαστηρίου",
        departments: undefined,
        attendance: {
          title: "ΠΡ",
          value: AttendanceEnum.ΠΡ,
        },
      },
      {
        labId: "1601",
        labTitle: "Οργάνωση και αρχιτεκτονική",
        semester: LabSemesterEnum.A_XEIM,
        description: "Πληροφορίες Εργαστηρίου",
        departments: undefined,
        attendance: {
          title: "ΥΠ",
          value: AttendanceEnum.ΥΠ,
        },
      },
      {
        labId: "1602",
        labTitle: "Δικτυα και αρχιτεκτονική",
        semester: LabSemesterEnum.B_EAR,
        description: "Πληροφορίες Εργαστηρίου",
        departments: undefined,
        attendance: {
          title: "ΥΠ_ΠΡ",
          value: AttendanceEnum.ΥΠ_ΠΡ,
        },
      },
      {
        labId: "1603",
        labTitle: "Δομημένος Προγραμματισμός",
        semester: LabSemesterEnum.C_XEIM,
        description: "Πληροφορίες Εργαστηρίου",
        departments: undefined,
        attendance: {
          title: "ΠΡ",
          value: AttendanceEnum.ΠΡ,
        },
      },
    ]);

    const emitMobileViewClose = (): void => {
      context.emit("closeMobileView", true);
      return;
    };
    onMounted(() => {
      context.emit("closeMobileView", true);
      return;
    });
    return {
      labs,
      availableSemesters: displayLabs,
      selectedLabs,
      logSelectedLabs,
      emitMobileViewClose,
    };
  },
});
</script>

<style scoped>
.chip-bg {
  background-color: #03045e;
  border: 1px solid black;
  color: #f3f3f3;
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
  width: 5rem;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
}
.chip-attendance {
  background-color: #00c900;
  border: 1px solid black;
  color: #000000;
  word-wrap: break-word;
  width: inherit;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}
.large-font {
  font-weight: 600;
}

.classOne {
  min-width: 320px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  margin: 0.5rem 0.5rem;
}

.classOne > p {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
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
@media (min-width: 480px) {
  .chip-separator {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    margin: 0;
    margin-right: 1rem;
  }
  .chip-separator__left-chip {
    width: 20rem;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
  }
  .chip-separator__right-chip {
    width: 5rem;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
  }
  .chip-attendance {
    background-color: #00c900;
    border: 1px solid black;
    color: #000000;
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
}
@media (min-width: 769px) {
  .sth-container {
    margin: 2rem 1rem;
    width: inherit;
    max-width: 100%;
    min-width: 320px;
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
    justify-content: space-between;
    align-items: center;
    width: 100%;
    margin: 0;
    margin-right: 1rem;
  }
  .chip-separator__left-chip {
    width: 20rem;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
  }
  .chip-separator__right-chip {
    width: 5rem;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
  }
  .chip-attendance {
    background-color: #00c900;
    border: 1px solid black;
    color: #000000;
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
}

@media (min-width: 1025px) {
  :deep(.v-container) {
    max-width: 100%;
  }
  .chip-separator {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    margin: 0.5rem 0.5rem;
    width: fit-content;
  }
  .chip-separator__left-chip {
    width: 20rem;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
  }
  .chip-separator__right-chip {
    width: 5rem;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
  }
  .chip-attendance {
    background-color: #00c900;
    border: 1px solid black;
    color: #000000;
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
}
</style>
