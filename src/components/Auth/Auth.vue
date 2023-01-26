<template>

</template>
<script lang="ts">
import { defineComponent } from 'vue'
import { onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useErrorFunctions } from '@/composables/throwError.composable';
import { useStore } from 'vuex';
import {key} from '@/store/index';
export default defineComponent({
    setup() {
        const route = useRoute();
        const router = useRouter();
        onMounted(() => {
            const hasQueryParams = Object.keys(route.query);
            const queryParamsLength = hasQueryParams.length;
            const store = useStore(key);
            if (hasQueryParams) {
                if (queryParamsLength === 1) {
                    console.log(route.query);
                }
                else if (queryParamsLength === 2) {
                    if (route.query.code) {
                        //call the api that does this
                        console.log(route.query.code);
                    }
                }
                else if (queryParamsLength > 2) {
                    if (route.query.error && route.query.error_reason && route.query.error_description) {
                        //call the api that does this
                    }
                }
                else {
                    //Do what?
                    //redirect to main page with NOT SIGNED IN STATE
                    //MAYBE WITH AN ERROR POP UP THAT SAYS THIS
                    const { setError } = useErrorFunctions();
                    setError("Σφάλμα Χρήσης", "Η διαδίκασία αυθεντίκοποιησης δεν ολοκληρώθηκε");
                    store.dispatch('setAuthState',false);
                    router.replace({ name: 'welcome' });
                }
            }
            else {
                //Do what?
                //redirect to main page with NOT SIGNED IN STATE
                //MAYBE WITH AN ERROR POP UP THAT SAYS THIS
                const { setError } = useErrorFunctions();
                setError("Σφάλμα Χρήσης", "Η διαδίκασία αυθεντίκοποιησης δεν ολοκληρώθηκε");
                router.replace({ name: 'welcome' });
            }
        });
    },
})
</script>
