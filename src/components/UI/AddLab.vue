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
                    <!-- <div class="chip-in-row"> -->
                    <v-chip-group>
                        <v-chip :class="{ 'active-chip': lab.isActive }" @click="clickOnChip(lab.value)"
                            v-for="lab in displayedSemester" :key="lab.title">{{ lab.title }}</v-chip>
                    </v-chip-group>
                    <v-divider inset></v-divider>
                    <!-- </div> -->
                    <div class="label-centerer">
                        <label for="year">Βασικά Στοιχεία</label>
                    </div>
                    <div class="form-first">
                        <v-text-field label="Κωδικός Εργαστηρίου" required></v-text-field>
                        <v-text-field label="Τίτλος Εργαστηρίου" required></v-text-field>
                    </div>
                    <v-divider inset></v-divider>
                    <div class="label-centerer">
                        <label for="year">Ώρες Διαθεσιμόςτητας</label>
                    </div>
                    <div class="form-control">
                        <div class="form-control-add-btn">
                            <v-btn width="14rem" elevation="4" color="green"><svg width="30" height="30"
                                    clip-rule="evenodd" fill-rule="evenodd" stroke-linejoin="round"
                                    stroke-miterlimit="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="m21 3.998c0-.478-.379-1-1-1h-16c-.62 0-1 .519-1 1v16c0 .621.52 1 1 1h16c.478 0 1-.379 1-1zm-16.5.5h15v15h-15zm6.75 6.752h-3.5c-.414 0-.75.336-.75.75s.336.75.75.75h3.5v3.5c0 .414.336.75.75.75s.75-.336.75-.75v-3.5h3.5c.414 0 .75-.336.75-.75s-.336-.75-.75-.75h-3.5v-3.5c0-.414-.336-.75-.75-.75s-.75.336-.75.75z"
                                        fill-rule="nonzero" />
                                </svg>ΠΡΟΣΘΗΚΗ ΤΜΗΜΑΤΟΣ
                            </v-btn>
                        </div>
                        <div class="form-control-add-field">
                            <div class=" ">
                                <label for="lab_dept_id">Κωδικός Τμήματος:</label>
                            </div>
                            <div class=" ">
                                <input type="text" name="lab_dept_id">
                            </div>
                            <date-picker v-model="timeFrom" time-picker disable-time-range-validation placeholder="Απο">
                            </date-picker>
                            <date-picker v-model="timeTo" time-picker disable-time-range-validation placeholder="Εως">
                            </date-picker>
                        </div>
                    </div>

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
        const timeFrom = ref("");
        const timeTo = ref("");

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
        return { displayedSemester, clickOnChip, timeFrom, timeTo };
    }
})
</script>

<style scoped>
.parent-card {
    margin-top: 0.5rem;
    margin-bottom: 0.5rem;
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
    height: 66vh;
    min-width: 320px;
    max-width: 100%;
}

.form-first {
    width: 100%;
    display: flex;
    flex-direction: column;
}

.form-control {
    display: flex;
    width: 100%;
    justify-content: flex-start;
    align-items: center;
    margin: 1rem 0;
    gap: 0.5rem;
    height: 5rem;
}

.form-control-add-btn {
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
    width: 14rem;
}

.form-control-add-field {
    display: flex;
    justify-content: center;
    margin: 1rem 1rem;
    align-items: center;
    gap: 0.5rem;
    width: 100%;
}

.label-for-lab-id {
    margin: 0;
}

/* .chip-in-row {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
} */

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
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    padding: 0;
    max-width: 768px;
    min-width: 320px;
    margin-bottom: 1rem;
}

:deep(.v-container) {
    padding: 0;
    overflow: hidden;
}


.active-chip {
    border: 1px solid #156ed3;
    color: #156ed3;
}

:deep(.v-divider) {
    width: 100%;
    display: flex;
    margin: 0.5rem auto;
    border-color: #f3f3f3;
}

:deep(.v-divider--inset:not(.v-divider--vertical)) {
    max-width: 100%;
    margin-inline-start: 0px;
}

:deep(.v-btn__content) {
    display: flex;
    justify-content: center;
    align-items: center;
    width: fit-content;
    gap: 0.2rem;
}

@media (min-width: 769px) {
    .parent-card {
        margin-top: 1rem;
        margin-bottom: 1rem;
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

    :deep(.v-chip-group) {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        justify-content: center;
        align-content: flex-start;
        margin-bottom: 1rem;
        margin-top: 1rem;
        max-width: 1024px;
        min-width: 769px;
        overflow-x: auto;
    }

    .parent-card-form {
        margin-left: 1rem;
        margin-right: 1rem;
        height: 66vh;
        min-width: 320px;
        max-width: 100%;
    }

    .parent-card {
        margin-top: 1rem;
        margin-bottom: 1rem;
    }

    .form-first {
        width: 100%;
        display: flex;
        flex-direction: row;
        gap: 1rem;
    }

    .label-centerer {
        background-color: #f3f3f3;
        margin: 0.5rem auto;
        text-align: center;
        padding: 0.5rem;
        display: flex;
        flex-direction: row;
        justify-content: center;
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

    :deep(.v-chip-group) {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        margin-bottom: 1rem;
        column-gap: 1rem;
        margin-top: 1rem;
        overflow-x: auto;
        flex-wrap: nowrap;
        max-width: 100%;
    }
}
</style>