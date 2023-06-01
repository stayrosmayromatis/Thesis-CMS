<template>
    <div class="container" @click="emitMobileViewClose">
        <suspense>
            <template #default>
                <base-dialog :show="isError" @close-modal="clearError">
                    <template #title>
                        <h1>{{ errorTitle }}</h1>
                    </template>
                    <template #description>
                        <p>{{ errorDescription }}</p>
                    </template>
                </base-dialog>
            </template>
            <template #fallback>
                <h1>ERROR</h1>
            </template>
        </suspense>
        <suspense>
            <template #default>
                <base-alert :alert-type-prop="'success'" :show="showAlert" :title="alertTitle"></base-alert>
            </template>
            <template #fallback>
                <h1>ERROR</h1>
            </template>
        </suspense>
        <div class="logo">
            <img class="mobile-view-picture" src="@/assets/ihu_logo.png" alt="IHU-LOGO-ALT" />
        </div>
        <div class="main">
            <div class="greeting-title">
                <p>Καλώς ήρθατε στο Σύστημα Δηλώσεων Εργαστηρίων του Τμήματος Μηχανικών Πληροφορικής και Ηλεκτρονικών
                    Συστημάτων.
                </p>
            </div>
            <div class="main-content">
                <p>Η εφαρμογή αναπτύχθηκε στα πλαίσια εκπόνησης πτυχιακής άσκησης.</p>
                <p>Σκοπός,η ευχρηστία και η καλύτερη οργάνωση στις δηλώσεις εργαστηρίων τόσο για φοιτητές, όσο και
                    για
                    συντονιστές.</p>
            </div>
            <div class="please-log-in">
                <p>Παρακαλώ συνδεθείτε μέσω
                    <router-link :to="{ name: 'red' }"> Apps</router-link>
                    για να συνεχίσετε στην εφαρμογή.
                </p>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineAsyncComponent, defineComponent, onMounted, ref } from 'vue'
import { useErrorFunctions } from '@/composables/throwError.composable';
//import BaseDialog from '@/components/Base/BaseDialog.vue';
//import BaseAlert from '@/components/Base/BaseAlert.vue';
const BaseDialog = defineAsyncComponent({
    loader: () => import('@/components/Base/BaseDialog.vue'),
    delay: 500,
    suspensible: false
});
const BaseAlert = defineAsyncComponent({
    loader: () => import('@/components/Base/BaseAlert.vue'),
    delay: 500,
    suspensible: false
});

import { useAlert } from '@/composables/showAlert.composable';
export default defineComponent({
    emits: ['closeMobileView'],
    components: {
        BaseDialog,
        BaseAlert
    },
    setup(_, context) {
        const { alertTitle, showAlert, openAlert, closeAlert } = useAlert();
        const { errorDescription, errorTitle, isError,clearError } = useErrorFunctions();
        onMounted(() => {
            emitMobileViewClose();
            closeAlert();
        });
        const emitMobileViewClose = (): void => {
            context.emit('closeMobileView', true);
        }
        return { emitMobileViewClose, isError, errorDescription, errorTitle, clearError, alertTitle, showAlert }
    }
})
</script>

<style scoped>
.container {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    min-width: 320px;
}

.mobile-view-picture {
    width: 21rem;
    height: 6rem;
}

.greeting-title {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    font-size: 1.2rem;
    font-weight: 600;
    text-align: center;
}

.logo {
    padding: 0.3rem;
    background-color: #d1dffd;
    margin: 1rem auto;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    -webkit-box-shadow: 0px 0px 6px 11px rgba(0, 0, 0, 0.06);
    box-shadow: 0px 0px 6px 11px rgba(0, 0, 0, 0.06);
    border: 0px none #f3f3f3;
}

.main {
    background-color: #d1dffd;
    margin: 1rem 1rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    -webkit-box-shadow: 0px 0px 6px 11px rgba(0, 0, 0, 0.06);
    box-shadow: 0px 0px 6px 11px rgba(0, 0, 0, 0.06);
    border: 0px none #f3f3f3;
    padding: 1rem;
    text-align: center;
}

.main-content {
    margin-top: 1.5rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    font-weight: 500;
    color: #5c5c5c;
}

.please-log-in {
    margin-top: 1.5rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    font-weight: 500;
    font-size: 1.5rem;
    color: #000000;
}

a {
    text-decoration: none;
}

@media (min-width: 769px) {

    .mobile-view-picture {
        width: 25rem;
        height: 8rem;
    }

    .logo {
        padding: 1rem auto;
        width: 32rem;
        border-radius: 21px 21px 21px 21px;
    }

    .main {
        width: fit-content;
        border-radius: 21px 21px 21px 21px;
    }
}

@media (min-width: 1025px) {

    .mobile-view-picture {
        width: 30rem;
        height: 9rem;
    }

    .logo {
        margin: 1.5rem auto;
        width: 48rem;
        border-radius: 21px 21px 21px 21px;
    }

    .main {
        margin: 1.5rem 1.5rem;
        padding: 1rem;
    }
}
</style>
