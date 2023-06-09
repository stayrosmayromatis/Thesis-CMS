<template>
    <div class="parent" v-if="show">
        <v-card elevation="5">
            <v-card-title>
                <div class="title">
                    {{title}}
                </div>
            </v-card-title>
            <v-card-text>
                <div class="text">
                    {{description}}
                </div>
            </v-card-text>
        </v-card>
    </div>
</template>

<script lang="ts">
import { defineComponent, toRefs } from 'vue'

export default defineComponent({
    props:{
        show:{
            type:Boolean,
            required:true,
            default:true
        },
        title :{
            type:String,
            required:false,
            default : "Δεν βρέθηκαν αποτελέσματα"
        },
        description :{
            type:String,
            required:false,
            default : "Δεν βρέθηκαν αποτελέσματα παρακαλώ κάντε πρώτα την δήλωση τίποτα"
        },
    },
    setup(props) {
        const {show} = toRefs(props);
        return {show};
    },
})
</script>
<style scoped>
.title {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
    width: 100%;
    text-align: center;
    padding: 0.5rem 0.5rem;
    text-transform: capitalize;
    white-space: normal;
    word-break: break-word;
    word-wrap: break-word;
}

.text {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
    width: 100%;
    text-align: center;
    padding: 0.5rem 0.5rem;
    white-space: normal;
    word-break: break-word;
    word-wrap: break-word;
}
@media (min-width: 769px) {

    .title {
        flex-direction: row;
        flex-wrap: nowrap;
    }

    .text {
        
        flex-direction: row;
        flex-wrap: nowrap;
    }
}
</style>