<template>
    <section class="container" @click="emitMobileViewClose">
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
            <div class="greeting_label">
                <label> Σχετικά με το Σύστημα Δηλώσεων</label>
            </div>
            <div class="contact-container">
                <div class="contact-text">
                    <p>To Σύστημα Δηλώσεων Εργαστηριακών Τμημάτων είναι αποτέλεσμα εκπόνησης Πτυχιακής Εργασίας του
                        Τμήματος Μηχανικών Πληροφορικής και Ηλεκτρονικών Συστημάτων (πρώην Τμήμα Μηχανικών
                        Πληροφορικής).</p>
                    <p>Για την ορθό σχεδιασμό και λειτουργία του συστήματος χρειάστηκε η άψογη συνεργασία των φοιτητών
                        <b><i> Μαυρομάτη Σταύρου </i></b> και <b> <i>Κύρκου Πέτρου </i></b>υπο την επίβλεψη του
                        <b><i>κ.Αμανατιάδη Δημήτριου</i></b>,
                        ως Συντονιστή της Πτυχιακής Εργασίας, στα παρακάτω θέματα:
                    </p>
                </div>
                <div class="contact-list">
                    <ul>
                        <li>
                            <div class="list-option">
                                <label style="font-weight: 500;">
                                    Αμανατιάδης Δημήτριος
                                </label>
                                <label class="list-option-text">Αρχική Ιδέα, Σχεδιασμός και Καθοδήγηση, Επίβλεψη πορείας
                                    ανάπτυξης ( <a href="mailto:dima@ihu.gr?subject=Submissions Issue 2225:">dima@ihu.gr</a>
                                    )</label>
                            </div>
                        </li>
                        <li>
                            <div class="list-option">
                                <label style="font-weight: 500;">
                                    Μαυρομάτης Σταύρος
                                </label>
                                <label class="list-option-text">Αρχική Ιδέα, Σχεδιασμός και Υλοποίηση FrontEnd της
                                    εφαρμογής, Σχεδιασμός Βάσης
                                    Δεδομένων
                                    ( <a
                                        href="mailto:it174896@it.teithe.gr?subject=Submissions Issue 2225">it174896@it.teithe.gr</a>
                                    )</label>
                            </div>
                        </li>
                        <li>
                            <div class="list-option">
                                <label style="font-weight: 500;">
                                    Πέτρος Κύρκος
                                </label>
                                <label class="list-option-text">Αρχική Ιδέα, Σχεδιασμός και Υλοποίηση BackEnd της εφαρμογής,
                                    Σχεδιασμός Βάσης
                                    Δεδομένων (
                                    <a
                                        href="mailt:it164692@it.teithe.gr?subject=Submissions Issue 2225">it164692@it.teithe.gr</a>
                                    )</label>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
            <div class="bugs-content">
                <p>Για οποιαδήποτε Bugs ή λοιπά θέματα παρουσιαστούν κατα τη χρήση της υπηρεσίας πραγματοποιήστε επικοινωνία
                    μέσω email (παραπάνω) συμπληρώνοντας ως πρόθεμα του μηνύματος <b><i>"Submissions Issue (2225)"</i></b>
                </p>
            </div>
        </div>
        <h1>Ευχαριστούμε</h1>
    </section>
</template>

<script lang="ts">
import { defineAsyncComponent, defineComponent, onMounted, ref } from 'vue'
import { useErrorFunctions } from '@/composables/throwError.composable';
import { useAlert } from '@/composables/showAlert.composable';
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

export default defineComponent({
    emits: ['closeMobileView'],
    components: {
        BaseDialog,
        BaseAlert
    },
    setup(props, context) {
        const { alertTitle, showAlert, openAlert, closeAlert } = useAlert();
        const { errorDescription, errorTitle, isError, clearError } = useErrorFunctions();
        const emitMobileViewClose = (): void => {
            context.emit('closeMobileView', true);
        }
        onMounted(() => {
            emitMobileViewClose();
        });

        return { emitMobileViewClose, isError, errorDescription, errorTitle, clearError, alertTitle, showAlert }
    }
})
</script>

<style scoped>
ul {
    list-style: none;
}

/* .contact-tasks {
    text-align: center;
    margin-left: 1.35rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
} */

.bugs-content p {
    text-align: center;
    font-size: 1.1rem;
    color: black;
    margin:0.1rem auto;
}

.list-option {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin: 0.5rem auto;
}

.list-option .list-option-text {
    width: 75%;
    min-width: 50%;
    text-align: center;
}

.contact-list {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    margin-top: 1rem;
    margin-bottom: 1rem;
    margin-left: 0.5rem;
}

.contact-list li {
    margin: 0.3rem auto;
    text-align: center;
}

.container {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    min-width: 320px;
}

.logo {
    padding: 0.3rem;
    background-color: #d1dffd;
    margin: 1rem auto;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    -moz-box-shadow: 0px 0px 6px 11px rgba(0, 0, 0, 0.06);
    -webkit-box-shadow: 0px 0px 6px 11px rgba(0, 0, 0, 0.06);
    box-shadow: 0px 0px 6px 11px rgba(0, 0, 0, 0.06);
    border: 0px none #f3f3f3;
}

.mobile-view-picture {
    width: 21rem;
    height: 6rem;
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
    -moz-box-shadow: 0px 0px 6px 11px rgba(0, 0, 0, 0.06);
    box-shadow: 0px 0px 6px 11px rgba(0, 0, 0, 0.06);
    border: 0px none #f3f3f3;
    padding: 1rem;
    text-align: center;
}

.greeting_label {
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 1.3rem;
    text-align: center;
    color: black;
    font-weight: 700;
    margin-top: 1rem;
    margin-bottom: 1rem;
    margin-left: 1rem;
}

.contact-container {}

.contact-text {
    text-align: center;
    font-size: 1rem;
    color: black;
    margin: 0.2rem auto
}

@media (min-width:769px) {
    .logo {
        padding: 1rem auto;
        width: 32rem;
        border-radius: 21px 21px 21px 21px;
        -moz-border-radius: 21px 21px 21px 21px;
        -webkit-border-radius: 21px 21px 21px 21px;
    }

    .mobile-view-picture {
        width: 25rem;
        height: 8rem;
    }

    .main {
        width: fit-content;
        border-radius: 21px 21px 21px 21px;
        -moz-border-radius: 21px 21px 21px 21px;
        -webkit-border-radius: 21px 21px 21px 21px;
    }

    .contact-text {
        font-size: 1.1rem;
    }

    .greeting_label {
        justify-content: flex-start;
    }
}

@media (min-width: 1025px) {
    .logo {
        margin: 1.5rem auto;
        width: 48rem;
        border-radius: 21px 21px 21px 21px;
    }

    .mobile-view-picture {
        width: 30rem;
        height: 9rem;
    }

    .main {
        align-items: flex-start;
        margin: 1.5rem 1.5rem;
        padding: 1rem;
    }

    .contact-text {
        text-align: left;
        margin-top: 0.5rem;
        margin-bottom: 1rem;
        margin-right: 0.5rem;
        margin-left: 0.5rem;
    }

    .contact-list{
        justify-content:flex-start;
    }

    .list-option {
        flex-direction: row;
        justify-content: space-between;
        width:100%;
    }

    .list-option .list-option-text {
        width: 650px;
        text-align: left;
        margin-left:2rem;
    }
}
</style>