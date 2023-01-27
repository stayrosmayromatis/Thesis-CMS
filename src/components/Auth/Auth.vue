<template>

</template>
<script lang="ts">
import { defineComponent } from 'vue'
import { onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useErrorFunctions } from '@/composables/throwError.composable';
import { useStore } from 'vuex';
import { key } from '@/store/index';
import { useAxios } from '@vueuse/integrations/useAxios';
import axios, { AxiosHeaders } from "axios";
interface dynamicComponent {
    [x:string]: string;
}
export default defineComponent({
    
    setup() {
        const route = useRoute();
        const router = useRouter();
        onMounted(async () => {
            const hasQueryParams = Object.keys(route.query);
            const queryParamsLength = hasQueryParams.length;
            const { setError } = useErrorFunctions();
            const store = useStore(key);
            if (hasQueryParams) {
                if (queryParamsLength === 1) {
                    setError("Σφάλμα Αυθεντικοποίησης", "Η διαδίκασία δεν ολοκληρώθηκε");
                    store.dispatch('setAuthState', false);
                    router.replace({ name: 'welcome' });
                    return;
                }
                else if (queryParamsLength === 2) {
                    if (!route.query.code) {
                        setError("Σφάλμα Αυθεντικοποίησης", "Η διαδίκασία δεν ολοκληρώθηκε");
                        store.dispatch('setAuthState', false);
                        router.replace({ name: 'welcome' });
                        return;
                    }
                    else 
                    {
                        const params = new URLSearchParams();
                        params.append("client_id", import.meta.env.VITE_CLIENT_ID);
                        params.append("client_secret", import.meta.env.VITE_CLIENT_SECRET)
                        params.append("grant_type", "authorization_code");
                        params.append("code", route.query.code.toString());
                        let instance = axios.create({
                            baseURL: "https://login.iee.ihu.gr",
                        });
                        const access_token_object = await useAxios<{
                            access_token: string,
                            refresh_token: string,
                            user: string
                        }
                        >(
                            "/token", {
                                method: "POST",
                            headers: {
                                "Content-Type": "application/x-www-form-urlencoded",
                                Accept: "*/*",
                            },
                            data: params
                        }, instance
                        );
                        if (access_token_object.isFinished.value) {
                            if (access_token_object.error.value) 
                            {
                                setError(`Σφάλμα Αυθεντικοποίησης ${access_token_object.error.value.code}`, `Προσπαθήστε ξανά`);
                                store.dispatch('setAuthState', false);
                                router.replace({ name: 'welcome' });
                                return;
                            }
                            const access_token = access_token_object.data.value?.access_token;
                            instance = axios.create({
                                baseURL: "https://api.iee.ihu.gr"
                            });
                            const profileObject = await useAxios<any>(
                                "/profile",
                                {
                                    method: "GET",
                                    headers: {
                                        "Content-Type": "Type:application/json",
                                        Accept: "*/*",
                                        "x-access-token": `${access_token}`
                                    },
                                },
                                instance
                            );
                            if(profileObject.isFinished.value)
                            {
                                if(profileObject.error.value)
                                {
                                    console.log(profileObject.error.value);
                                    setError(`Μη Εξουσιοδοτημένη Κλήση`, `Προσπαθήστε ξανά`);
                                    store.dispatch('setAuthState', false);
                                    router.replace({ name: 'welcome' });
                                    return;
                                }
                                console.log(profileObject.data.value);
                                return;
                                

                            }
                            setError("Σφάλμα Αυθεντικοποίησης", "Η διαδίκασία δεν ολοκληρώθηκε");
                            store.dispatch('setAuthState', false);
                            router.replace({ name: 'welcome' });
                            return;
                        }
                        setError(`Σφάλμα Αυθεντικοποίησης ${route.query.error_reason}`, `${route.query.error_description}`);
                        store.dispatch('setAuthState', false);
                        router.replace({ name: 'welcome' });
                        return;
                    }
                }
                else if (queryParamsLength > 2) {
                    if (route.query.error && route.query.error_reason && route.query.error_description) {
                        setError(`Σφάλμα Εξουσιοδήτησης`, `Παρακαλώ αποδεχθέιτε την εφαρμογή`);
                        store.dispatch('setAuthState', false);
                        router.replace({ name: 'welcome' });
                    }
                    setError("Σφάλμα Αυθεντικοποίησης", "Η διαδίκασία δεν ολοκληρώθηκε");
                    store.dispatch('setAuthState', false);
                    router.replace({ name: 'welcome' });
                }
            }
            setError("Σφάλμα Αυθεντικοποίησης", "Η διαδίκασία δεν ολοκληρώθηκε");
            router.replace({ name: 'welcome' });
            return;
        });
    },
})
</script>
