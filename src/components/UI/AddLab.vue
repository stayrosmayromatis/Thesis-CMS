<template>
    <div class="parent-card">
        <v-card elevation="5" class="parent-label">
            <v-card-title>
                ΦΟΡΜΑ ΕΙΣΑΓΩΓΗΣ ΕΡΓΑΣΤΗΡΙΟΥ
            </v-card-title>
        </v-card>
    </div>
    <div class="parent-card-form">
        <v-card elevation="5">
            <v-form>
                <v-container>
                    <div class="chip-in-row">
                        <v-chip-group>
                            <v-chip :class="{ 'active-chip': lab.isActive }" @click="clickOnChip(lab.value)"
                                v-for="lab in displayedSemester" :key="lab.title">{{ lab.title }}</v-chip>
                        </v-chip-group>
                    </div>
                    <v-text-field label="Κωδικός Εργαστηρίου" required></v-text-field>
                    <v-text-field label="Τίτλος Εργαστηρίου" required></v-text-field>
                    <v-text-field label="E-mail" required></v-text-field>
                </v-container>
            </v-form>
        </v-card>
    </div>
</template>
<script lang="ts">
import { defineComponent } from '@vue/runtime-core';
import { displayedLabs } from '@/composables/displayedSemesterArray.composable';
import { LabSemesterEnum } from '@/enums/LabSemesterEnum';
import { Ref, ref } from 'vue';
import { DisplayedSemster } from '@/types/displayedsemester.type';

export default defineComponent({
    setup() {
        const displayedSemester: Ref<Array<DisplayedSemster>> = ref(displayedLabs());

        const clickOnChip = (value: LabSemesterEnum) => {
            const lab = displayedSemester.value.find(lab => lab.value == value);
            if (lab) {
                lab.isActive = !lab.isActive
                const allRestLabs = displayedSemester.value.filter(restLab => restLab.value != lab.value);
                if (allRestLabs && allRestLabs != null && allRestLabs != undefined && allRestLabs.length > 1) {
                    allRestLabs.forEach((lab) => {
                        if (lab.isActive)
                            lab.isActive = false;
                    });
                }
            }
        }
        return { displayedSemester, clickOnChip };
    }
})
</script>

<style scoped>
.parent-card {
    margin-top: 1rem;
    margin-bottom: 1rem;
}

.parent-label {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 2rem;
    text-transform: uppercase;
    min-width: 320px;
    font-size: 0.95rem;
    font-weight: 500;
    background-color: #aacaf3;
    padding: 1.2rem;
}

.parent-card-form {
    margin-top: 2rem;
    margin-bottom: 2rem;
    margin-left: 1rem;
    margin-right: 1rem;
    height: 66vh;
}

.chip-in-row {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    gap: 1.6rem;
    margin: 1rem 0;
}

:deep(.v-chip.v-chip--density-default) {
    height: 2.5rem;
    font-size: 0.9rem;
    width: fit-content;
}


:deep(.v-chip.v-chip--density-default:hover) {
    color: #156ed3;
    cursor: pointer;
}

:deep(.v-chip-group) {
    display: flex;
    max-width: 100%;
    min-width: 0;
    overflow-x: auto;
    padding: 4px 0;
    flex-direction: row;
    gap: 1rem;
}

.active-chip {
    border: 1px solid #156ed3;
    color: #156ed3;
}

@media (min-width: 769px) {
    .parent-card {
        margin-top: 2rem;
        margin-bottom: 2rem;
        margin-left: 1rem;
        margin-right: 1rem;
    }

    .parent-label {
        display: flex;
        flex-direction: row;
        align-items: center;
        width: 100%;
        height: 3rem;
        justify-content: center;
        font-size: 1.2rem;
        text-transform: uppercase;
        font-weight: 500;
        background-color: #aacaf3;
        min-width: 769px;
    }
}

@media (min-width: 1025px) {
    .parent-card {
        margin-top: 2rem;
        margin-bottom: 2rem;
        margin-left: 1rem;
        margin-right: 1rem;
    }

    .parent-label {
        display: flex;
        flex-direction: row;
        align-items: center;
        width: 100%;
        height: 3rem;
        justify-content: center;
        font-size: 1.2rem;
        text-transform: uppercase;
        font-weight: 500;
        background-color: #aacaf3;
        min-width: 769px;
    }
}
</style>