<template>
    <div class="export-panel-export-option-text__parent">
        <div class="theory-precedes__container">
            <label>Εχουν προηγηθεί οι δηλώσεις θεωρίας;</label>
            <span>

                <v-switch style="cursor: pointer;" color="primary" v-model="theoryPrecedesFlag" :value="true"
                    hide-details></v-switch>
            </span>

        </div>
        <transition name="file-input">
            <div class="sth" v-if="theoryPrecedesFlag">
                <div class="file-input__container">
                    <v-tooltip location="bottom" :text="'Μεταφόρτωση αρχείου'">
                        <template v-slot:activator="{ props }">

                            <v-btn type="button" v-bind="props" class="upload--button" :class="{
                                'upload-button--disabled': fileInputError,
                                'upload-button--enabled': !fileInputError
                            }" :disabled="fileInputError">
                                <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 24 24">
                                    <!-- fill="#f7f7f7" -->
                                    <path fill="white"
                                        d="M11 20H6.5q-2.28 0-3.89-1.57Q1 16.85 1 14.58q0-1.95 1.17-3.48q1.18-1.53 3.08-1.95q.63-2.3 2.5-3.72Q9.63 4 12 4q2.93 0 4.96 2.04Q19 8.07 19 11q1.73.2 2.86 1.5q1.14 1.28 1.14 3q0 1.88-1.31 3.19T18.5 20H13v-7.15l1.6 1.55L16 13l-4-4l-4 4l1.4 1.4l1.6-1.55Z" />
                                </svg>

                            </v-btn>
                        </template>
                    </v-tooltip>
                    <v-file-input v-model="files" placeholder="Upload your documents"
                        label="Αρχείο επιβεβαίωσης (cross-reference)" :multiple="false" counter
                        :counter-size-string="counterSizeString" :accept="acceptableFileTypes" show-size
                        :persistent-hint="true" :prepend-icon="''" density="comfortable" :variant="'underlined'"
                        :hint="fileInputHint" :rules="validationRules" :error="errorOnFileInput"
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
                </div>
            </div>
        </transition>
        <div class="export-button__container">
            <label>Εξάγεται τις δηλώσεις: </label>
            <v-tooltip :location="'bottom center'" :text="`Λήψη αρχείου δηλώσεων του ${course_code.trim()} `">
                <template  v-slot:activator="{ props }">
                    <v-btn  v-bind="props" type="button" class="export--button__override" density="default" rounded>
                        <div class="export--button" style="cursor: pointer;">
                            <svg xmlns="http://www.w3.org/2000/svg" width="27" height="27" viewBox="0 0 24 24">
                                <path fill="currentColor"
                                    d="m14 2l6 6v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8m4 18V9h-5V4H6v16h12m-6-1l-4-4h2.5v-3h3v3H16l-4 4Z" />
                            </svg>
                            <label style="cursor: pointer;">
                                Ληψη
                            </label>
                        </div>
                    </v-btn>
                </template>
            </v-tooltip>
        </div>
    </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue';

export default defineComponent({
    props: {
        course_code: {
            type: String,
            required: true,
            default: ""
        }
    },
    setup(props) {
        const files = ref(new Array<globalThis.File>());
        const theoryPrecedesFlag = ref(false);
        const errorOnFileInput = ref(false);
        const errorOnFileInputMessage = ref("");
        const counterSizeString = ref("Επιλέχθηκε αρχείο");
        const fileInputHint = ref('Μέγιστο μέγεθος αρχείου 20Kb, επιτρεπόμενα αρχεία .xls, .xlsx');
        const validationRules = [
            (value: Array<globalThis.File>) => {
                if (!value) {
                    errorOnFileInput.value = true;
                    errorOnFileInputMessage.value = "Δεν έχετε εισάγει αρχείο";
                    return false;
                }
                if (!value.length) {
                    errorOnFileInput.value = true;
                    errorOnFileInputMessage.value = "Δεν έχετε εισάγει αρχείο";
                    return false;
                }
                if (!value[0].name.includes('xls')) {
                    errorOnFileInput.value = true;
                    errorOnFileInputMessage.value = "Μη αποδεκτό format αρχείου";
                    counterSizeString.value = "Επιλέχθηκε λάθος αρχείο";
                    return false;
                }
                if (!acceptableFileTypes.includes(value[0].type)) {
                    errorOnFileInput.value = true;
                    errorOnFileInputMessage.value = "Μη αποδεκτό format αρχείου";
                    counterSizeString.value = "Επιλέχθηκε λάθος αρχείο";
                    return false;
                }
                if (value[0].size > 21000) {
                    errorOnFileInput.value = true;
                    errorOnFileInputMessage.value = "Μέγιστο επιτρεπόμενο όριο 20 kB";
                    counterSizeString.value = "Επιλέχθηκε λάθος αρχείο";
                    return false;
                }
                console.dir(value);
                fileInputHint.value = "Έτοιμο προς μεταφόρτωση";
                counterSizeString.value = "Επιλέχθηκε σωστό αρχείο";
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
        const fileInputError = computed(() => {
            return errorOnFileInput.value || !files.value || !files.value.length;
        });
        return {
            theoryPrecedesFlag, files, validationRules, errorOnFileInput, errorOnFileInputMessage,
            acceptableFileTypes, counterSizeString, fileInputHint, fileInputError,
            logIt, logAppend
        }
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
    /* gap: 0.5rem; */
}

.export--button__override {
    cursor: pointer;
    padding: 24px 22px;
    display: flex;
    flex-direction: row;
    color: #245d8b;
    background-color: #e9e9e9;
    border: 3px solid #245d8b;
}

.sth {
    border-left: dashed 3px #ccc;
    border-right: dashed 3px #ccc;
    width: 100%;
    height: 100%;
    background-color: #f0f0f0;
}

.export-button__container :deep(.v-btn--elevated:hover),
.file-input__container :deep(.v-btn--elevated:hover) {
    box-shadow: 0px 2px 4px -1px var(--v-shadow-key-umbra-opacity, rgba(0, 0, 0, 0.9)), 0px 4px 5px 0px var(--v-shadow-key-penumbra-opacity, rgba(0, 0, 0, 0.2)), 0px 1px 10px 0px var(--v-shadow-key-penumbra-opacity, rgba(0, 0, 0, 0.2));
}

.upload--button {
    width: 1rem;
    height: 3.5rem;
    border-radius: 28px !important;
    /* background-color: #1867C0; */
    border: 1px solid #1867C0;
    color: #1867C0;
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

.file-input-enter-active {
    animation: animate-in 0.3s ease-in 0s 1 normal both;
}

.file-input-leave-active {
    animation: animate-out 0.3s ease-out 0s 1 normal none;
}

@keyframes animate-in {
    0% {
        opacity: 0;
    }

    50% {
        opacity: 0.7;
    }

    100% {
        opacity: 1;
    }
}

@keyframes animate-out {
    0% {
        opacity: 1;
    }

    /* 50% {
        opacity: 0.5;
    } */

    100% {
        opacity: 0;
    }
}

.upload-button--disabled {
    background-color: #8bb3e1;
    border: 1px solid #8bb3e1;
    opacity: 0.8;
    box-shadow: none;
}

.upload-button--enabled {
    background-color: #1867C0;
    border: 1px solid #1867C0;
    opacity: 1;
    box-shadow: none;
}

@media(min-width: 769px) {
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
}
</style>