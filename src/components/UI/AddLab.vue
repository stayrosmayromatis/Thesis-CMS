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
                    <v-text-field label="Κωδικός Εργαστηρίου" required></v-text-field>
                    <v-text-field label="Τίτλος Εργαστηρίου" required></v-text-field>
                    <v-select  :items="displayedSemester" 
                    label="Εξάμηνο" 
                    chips 
                    hide-selected
                    density="comfortable"
                    validate-on="blur" 
                    clearable 
                    bg-color="#f3f3f3" 
                    full-width
                    open-on-clear>
                    </v-select>
                    <v-text-field label="E-mail" required></v-text-field>
                    <v-text-field label="E-mail" required></v-text-field>
                    <v-text-field label="E-mail" required></v-text-field>
                    <v-text-field label="E-mail" required></v-text-field>
                    <v-text-field label="E-mail" required></v-text-field>
                    <v-text-field label="E-mail" required></v-text-field>
                    <v-text-field label="E-mail" required></v-text-field>
                    <v-text-field label="E-mail" required></v-text-field>
                    <v-text-field label="E-mail" required></v-text-field>
                    <v-text-field label="E-mail" required></v-text-field>
                </v-container>
            </v-form>
        </v-card>
    </div>
</template>
<script lang="ts">
import { defineComponent } from '@vue/runtime-core';
import { displayedLabs } from '@/composables/displayedSemesterArray.composable';

export default defineComponent({
    setup() {
        const displayedSemester = displayedLabs();

        return { displayedSemester };
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