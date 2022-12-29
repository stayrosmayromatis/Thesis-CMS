<template>
  <v-container class="sth-container">
    <v-select :items="availableSemesters" label="Επιλέξτε ενα ή παραπάνω εξάμηνo" hide-selected chips persistent-hint
      density="comfortable" validate-on="blur" bg-color="#92B4F4" closable-chips open-on-clear clearable multiple
      @update:model-value="logSelectedLabs">
    </v-select>
    <v-app>
      <v-expansion-panels v-if="labs">
        <v-expansion-panel v-for="lab in labs" :key="lab.labId">
          <v-expansion-panel-title>
            <v-chip class="chip-bg" size="large">
              <div class="large-font">{{ lab.labId }} - {{ lab.labTitle }}</div>
            </v-chip>
          </v-expansion-panel-title>
          <v-expansion-panel-text>
            <div class="classOne">
              <p>{{ lab.description }}</p>
              <v-btn color="#a3cef1" elevation="4">Πανε στην δηλωση</v-btn>
            </div>
          </v-expansion-panel-text>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-app>
  </v-container>
</template>

<script lang="ts">
import { defineComponent, ref, Ref } from "vue";
import { LabSemesterEnum } from '@/enums/LabSemesterEnum';
import { Lab } from '@/types/lab.type';
import { DisplayedSemster } from "@/types/displayedsemester.type";
import { displayedLabs } from '@/composables/displayedSemesterArray.composable';
import { Department } from "@/types/department.type";
export default defineComponent({
  setup() {
    const displayLabs: Array<DisplayedSemster> = displayedLabs();
    const selectedLabs: Ref<Array<LabSemesterEnum>> = ref(Array<LabSemesterEnum>());

    const logSelectedLabs = (displayedLabs: Array<LabSemesterEnum>) => {
      selectedLabs.value = [];
      displayedLabs.forEach(displayedLab => {
        console.log(displayedLab);
        selectedLabs.value.push(displayedLab);

      });
      console.log(selectedLabs.value);
    }
    const labs = ref([
      {
        labId: "1601",
        labTitle: "Οργάνωση και αρχιτεκτονική",
        semester: LabSemesterEnum.A_XEIM,
        description: "Πληροφορίες Εργαστηρίου",
        departments: undefined
      },
      {
        labId: "1602",
        labTitle: "Δικτυα και αρχιτεκτονική",
        semester: LabSemesterEnum.B_EAR,
        description: "Πληροφορίες Εργαστηρίου",
        departments: undefined
      },
      {
        labId: "1603",
        labTitle: "Δομημένος Προγραμματισμός",
        semester: LabSemesterEnum.C_XEIM,
        description: "Πληροφορίες Εργαστηρίου",
        departments: undefined
      }
    ]);

    return { labs, availableSemesters: displayLabs, selectedLabs, logSelectedLabs };
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

.classOne>p {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.classOne>button {
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
  margin: 0;
  min-width: 320px;
}

:deep(.v-expansion-panel--active:not(:first-child), .v-expansion-panel--active+.v-expansion-panel) {
  margin-top: 0;
}

@media (min-width: 769px) {
  .sth-container {
    margin: 1rem 1rem;
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

  .classOne>p {
    width: fit-content;
    display: flex;
    justify-content: center;
    align-items: center;
  }

}

@media (min-width:1025px) {
  :deep(.v-container) {
    max-width: 100%;
  }

}
</style>
