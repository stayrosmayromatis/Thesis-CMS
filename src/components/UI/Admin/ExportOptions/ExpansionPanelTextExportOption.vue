<template>
    <div class="export-panel-export-option-text__parent">
        <div class="theory-precedes__container">
            <label>Εχουν προηγηθεί οι δηλώσεις θεωρίας;</label>
            <span>

                <v-switch color="primary" v-model="theoryPrecedesFlag" :value="true" hide-details></v-switch>
            </span>

        </div>
        <div class="sth" v-if="theoryPrecedesFlag">
            <v-divider class="divider"></v-divider>
            <div class="file-input__container">
                <v-file-input v-model="files" placeholder="Upload your documents"
                    label="Αρχείο επιβεβαίωσης (cross-reference)" :multiple="false" counter
                    :counter-size-string="'Επιλέχθηκε αρχείο'" :accept="acceptableFileTypes" show-size
                    :persistent-hint="true" :prepend-icon="''" density="comfortable" :variant="'underlined'"
                    :hint="'Μέγιστο μέγεθος αρχείου 20Kb'" :rules="validationRules" :error="errorOnFileInput"
                    :error-messages="errorOnFileInputMessage" @click:clear="logIt" @update:model-value="logIt"
                    validate-on="input" chips>
                    <template v-slot:selection="{ fileNames }">
                        <template v-for="fileName in fileNames" :key="fileName">
                            <v-chip size="small" label color="primary" class="me-2">
                                {{ fileName }}
                            </v-chip>
                        </template>
                    </template>
                </v-file-input>
                <v-tooltip location="bottom" :text="'Μεταφόρτωση αρχείου'">
                    <template v-slot:activator="{ props }">
                        <v-btn type="button" v-bind="props" class="upload--button">
                            <!-- <div class="export--button">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
                            <path
                                d="M7 13h10v1h-10v-1zm0 4h5v-1h-5v1zm15-17v14.386c0 2.391-6.648 9.614-9.811 9.614h-10.189v-24h20zm-2 13.543v-6.543h-16v15h7.362c4.156 0 2.638-6 2.638-6s6 1.65 6-2.457zm-13-2.543h10v-1h-10v1z" />
                        </svg>
                        <label>
                            Ανεβασμα
                        </label>
                    </div> -->
                            <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 24 24">
                                <path fill="#f7f7f7"
                                    d="M11 20H6.5q-2.28 0-3.89-1.57Q1 16.85 1 14.58q0-1.95 1.17-3.48q1.18-1.53 3.08-1.95q.63-2.3 2.5-3.72Q9.63 4 12 4q2.93 0 4.96 2.04Q19 8.07 19 11q1.73.2 2.86 1.5q1.14 1.28 1.14 3q0 1.88-1.31 3.19T18.5 20H13v-7.15l1.6 1.55L16 13l-4-4l-4 4l1.4 1.4l1.6-1.55Z" />
                            </svg>
                        </v-btn>
                    </template>
                </v-tooltip>
            </div>
            <v-divider class="divider"></v-divider>
        </div>
        <div class="export-button__container">
            <label>Εξάγεται την πορεία σε αρχείο: </label>
            <v-btn type="button" color="#a3cef1" style="cursor: pointer;">
                <div class="export--button" style="cursor: pointer;">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
                        <path
                            d="M7 13h10v1h-10v-1zm0 4h5v-1h-5v1zm15-17v14.386c0 2.391-6.648 9.614-9.811 9.614h-10.189v-24h20zm-2 13.543v-6.543h-16v15h7.362c4.156 0 2.638-6 2.638-6s6 1.65 6-2.457zm-13-2.543h10v-1h-10v1z" />
                    </svg>
                    <label style="cursor: pointer;">
                        Εξαγωγη Δηλωσεων
                    </label>
                </div>
            </v-btn>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

export default defineComponent({
    setup(props) {
        const files = ref(new Array<globalThis.File>());
        const theoryPrecedesFlag = ref(false);
        const errorOnFileInput = ref(false);
        const errorOnFileInputMessage = ref("");
        const validationRules = [
            (value: Array<globalThis.File>) => {
                if (!value) {
                    errorOnFileInput.value = true;
                    errorOnFileInputMessage.value = "Δεν έχετε εισάγει αρχείο"
                    return false;
                }
                if (!value.length) {
                    errorOnFileInput.value = true;
                    errorOnFileInputMessage.value = "Δεν έχετε εισάγει αρχείο"
                    return false;
                }
                if (value[0].size > 21000) {
                    errorOnFileInput.value = true;
                    errorOnFileInputMessage.value = "Υπέρβαση επιτρεπόμενου ορίου των 20 kB"
                    return false;
                }
                console.dir(value);
                return true;
            }
        ];
        const acceptableFileTypes = [
            "application/vnd.ms-excel",
            "application/msexcel",
            "application/x-msexcel",
            "application/x-ms-excel",
            "application/x-excel",
            "application/x-dos_ms_excel",
            "application/xls",
            "application/x-xls",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        ]
        const logIt = () => {
            if (errorOnFileInput.value === true) {
                errorOnFileInput.value = false;
                errorOnFileInputMessage.value = "";
            }
        };
        const logAppend = () => {
            console.log("Click append now");
        };
        return { theoryPrecedesFlag, files, validationRules, errorOnFileInput, errorOnFileInputMessage, acceptableFileTypes, logIt, logAppend }
    }
});
</script>

<style scoped>
.export-panel-export-option-text__parent {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    gap: 1rem;
    padding: 0 0.5rem
}

.theory-precedes__container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 0;
    width: 100%;
}

.theory-precedes__container label,
.export-button__container>label {
    font-weight: 500;
    font-size: 1rem;
    text-align: center;
    white-space: pre-line;
    word-break: break-word;
}

.divider {
    margin: 0 0.3rem;
    opacity: 0.2;
    border: 0.1px solid rgb(0, 0, 0);
    width: 100%;
    height: 1px;
    margin: 0.5rem 0;
}

.export-button__container {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    width: 100%;
    gap: 0.5rem;
    margin: 0.5rem auto;
}

.export--button {
    width: fit-content;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    padding: 0.1rem 0.1rem;
    gap: 0.5rem;
}

.sth {
    width: 100%;
}

.export-button__container :deep(.v-btn--elevated:hover),
.file-input__container :deep(.v-btn--elevated:hover) {
    box-shadow: 0px 2px 4px -1px var(--v-shadow-key-umbra-opacity, rgba(0, 0, 0, 0.9)), 0px 4px 5px 0px var(--v-shadow-key-penumbra-opacity, rgba(0, 0, 0, 0.2)), 0px 1px 10px 0px var(--v-shadow-key-penumbra-opacity, rgba(0, 0, 0, 0.2));
}

.upload--button {
    width: 1rem;
    height: 3.5rem;
    border-radius: 28px !important;
    background-color: #00C900;
    border: 1px solid #00c900;
    color: #00C900;
}
.file-input__container {
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    gap: 0.5rem;
    margin: 2rem 0;
    padding: 2rem 1rem;
}

@media(min-width: 320px) {
    .export-panel-export-option-text__parent {
        /* flex-direction: row;
        justify-content: space-between;
        align-items: center;
        width: 100%;
        gap: 0; */
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        width: 100%;
        gap: 0;
        /* padding: 0 0.5rem */
    }

    .file-input__container {
        width: 100%;
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        gap: 1rem;
    }

    .theory-precedes__container {
        display: flex;
        flex-direction: row;

        justify-content: center;
        align-items: center;
        gap: 1rem;
    }
}</style>