<template>
  <v-select :items="availableSemesters" 
  label="Επιλέξτε ενα ή παραπάνω εξάμηνo" 
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
  <v-app>
    <v-expansion-panels v-if="labs">
      <v-expansion-panel v-for="lab in labs" :key="lab.labId">
        <v-expansion-panel-title>
          <v-chip class="chip-bg" size="large">
            <div class="large-font">{{lab.labId }} - {{ lab.title }}</div>
          </v-chip>
        </v-expansion-panel-title>
        <v-expansion-panel-text>
          <div class="classOne">
            <p>{{lab.description}}</p>
            <v-btn color="#a3cef1" elevation="4">Πανε στην δηλωση</v-btn>
          </div>
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>
  </v-app>
</template>

<script lang="ts">
import { defineComponent, ref, Ref } from "vue";
import {LabSemesterEnum} from '@/enums/LabSemesterEnum';
import {Lab} from '@/types/lab.type';
import { DisplayedSemster } from "@/types/displayedsemester.type";

export default defineComponent({
  setup() {
    const displayLabs:Array<DisplayedSemster>=[
    {
      title: "A XΕΙΜΕΡΙΝΟ",
      value:LabSemesterEnum.A_XEIM,
    },
    {
      title: "Β ΕΑΡΙΝΟ",
      value:LabSemesterEnum.B_EAR,
    },
    {
      title: "Γ ΕΑΡΙΝΟ",
      value:LabSemesterEnum.C_XEIM,
    },

  ]

    const selectedLabs: Ref<Array<LabSemesterEnum>> = ref(Array<LabSemesterEnum>());

    const logSelectedLabs = (displayedLabs:Array<LabSemesterEnum>) => {
      selectedLabs.value = [];
      displayedLabs.forEach(displayedLab => {
        console.log(displayedLab);
       selectedLabs.value.push(displayedLab);
        
     });
     console.log(selectedLabs.value);
    }
    const labs:Ref<Array<Lab>> = ref([
      {
        labId:1601,
        title : "Οργάνωση και αρχιτεκτονική",
        semester : LabSemesterEnum.A_XEIM,
        description:"Πληροφορίες Εργαστηρίου"
      },
      {
        labId:1602,
        title : "Δικτυα και αρχιτεκτονική",
        semester : LabSemesterEnum.B_EAR,
        description:"Πληροφορίες Εργαστηρίου"
      },
      {
        labId:1603,
        title : "Δομημένος Προγραμματισμός",
        semester : LabSemesterEnum.C_XEIM,
        description:"Πληροφορίες Εργαστηρίου"
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
}

.large-font {
  font-weight: 600;
}

.classOne {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
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
</style>
