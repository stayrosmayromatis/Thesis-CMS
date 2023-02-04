<template>
    <div class="container" @click="emitMobileViewClose">
        <base-dialog v-if="error === true" @close-modal="clearError">
            <template #title>
                <h1>{{errorTit}}</h1>
            </template>
            <template #description>
                <p>{{errorDesc}}</p>
            </template>
        </base-dialog>
        <base-alert :alert-type-prop="'success'" :show="showAlert" :title="alertTitle"></base-alert>
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
                    <a href="https://google.com"> Apps</a>
                    για να συνεχίσετε στην εφαρμογή.
                </p>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'
import { useErrorFunctions } from '@/composables/throwError.composable';
import BaseDialog from '../Base/BaseDialog.vue';
import BaseAlert from '@/components/Base/BaseAlert.vue';
import { useAlert } from '@/composables/showAlert.composable';
export default defineComponent({
    emits: ['closeMobileView'],
    components:{
        BaseDialog,
        BaseAlert
    },
    setup(_, context) {
        const error = ref(false);
        const errorDesc = ref<string>();
        const errorTit = ref<string>();
        const {alertTitle,showAlert,openAlert,closeAlert} = useAlert();
        onMounted(() => {
            const {clearError,errorDescription,errorTitle,isError,setError,} = useErrorFunctions();
            error.value = isError.value;
            errorDesc.value=errorDescription.value;
            errorTit.value= errorTitle.value;
            if(showAlert.value === false){
                setTimeout(() => {
                    openAlert('Επιτυχής Σύνδεση');
                },1000)
                setTimeout(() => {
                    closeAlert();
                },360000)
            }
            context.emit('closeMobileView', true);
            return;
        });
        const emitMobileViewClose = (): void => {
            context.emit('closeMobileView', true);
            return;
        }
        const clearError = () => {
            const {clearError} = useErrorFunctions();
            clearError();
        }
        return { emitMobileViewClose,error,errorDesc, errorTit,clearError,alertTitle,showAlert}
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
}

.logo {
    padding: 0.3rem;
    background-color: #d1dffd;
    margin-top: 1rem;
    margin-bottom: 1rem;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    -webkit-box-shadow: 0px 0px 6px 11px rgba(0, 0, 0, 0.06);
    box-shadow: 0px 0px 6px 11px rgba(0, 0, 0, 0.06);
    border: 0px none #f3f3f3;
    /* border-radius: 21px 21px 21px 21px; */
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
    /* border-radius: 21px 21px 21px 21px; */
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
    .container {
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: center;
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

    .mobile-view-picture {
        width: 25rem;
        height: 8rem;
    }

    .logo {
        padding: 1rem;
        background-color: #d1dffd;
        margin-top: 1rem;
        margin-bottom: 1rem;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 32rem;
        -webkit-box-shadow: 0px 0px 6px 11px rgba(0, 0, 0, 0.06);
        box-shadow: 0px 0px 6px 11px rgba(0, 0, 0, 0.06);
        border: 0px none #f3f3f3;
        border-radius: 21px 21px 21px 21px;
    }

    .main {
        background-color: #d1dffd;
        margin: 1rem 1rem;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        width: fit-content;
        -webkit-box-shadow: 0px 0px 6px 11px rgba(0, 0, 0, 0.06);
        box-shadow: 0px 0px 6px 11px rgba(0, 0, 0, 0.06);
        border: 0px none #f3f3f3;
        border-radius: 21px 21px 21px 21px;
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
}

@media (min-width: 1025px) {
    .container {
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: center;
    }

    .mobile-view-picture {
        width: 30rem;
        height: 9rem;
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
        padding: 1rem;
        background-color: #d1dffd;
        margin-top: 1.5rem;
        margin-bottom: 1.5rem;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 48rem;
        -webkit-box-shadow: 0px 0px 6px 11px rgba(0, 0, 0, 0.06);
        box-shadow: 0px 0px 6px 11px rgba(0, 0, 0, 0.06);
        border: 0px none #f3f3f3;
        border-radius: 21px 21px 21px 21px;
    }

    .main {
        background-color: #d1dffd;
        margin: 1.5rem 1.5rem;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        width: fit-content;
        -webkit-box-shadow: 0px 0px 6px 11px rgba(0, 0, 0, 0.06);
        box-shadow: 0px 0px 6px 11px rgba(0, 0, 0, 0.06);
        border: 0px none #f3f3f3;
        border-radius: 21px 21px 21px 21px;
        padding: 1rem;
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
}
</style>
