<template>
    <div class="positioner" v-if="showAlert">
            <v-alert 
            :title=title
            closable :type=alertType
            density="compact"
            ></v-alert>
    </div>
</template>

<script lang="ts">
import { computed, defineComponent, toRefs } from 'vue'

export default defineComponent({
    props:{
        title:{
            type:String,
            required : false,
            default:"Title"
        },
        isError:{
            type:Boolean,
            required:false,
            default:false
        },
        show:{
            type:Boolean,
            required:false,
            default:false
        }
    },
    setup(props){
        const {isError,show,title} = toRefs(props);
        const alertType = computed(() => {
            if(isError.value === true)
                return "error"
            if(isError.value === false)
                return "success"

        });
        const showAlert = computed(() => {
            if(show.value === true)
                return true;
            if(show.value === false)
                return false;
        })
        return{alertType,showAlert,title};
    }
})
</script>
<style scoped>
.positioner{
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin-top:0.5rem;
    margin-right: 0.5rem;
}
:deep(.v-alert){
    border-radius: 1rem;
    width: fit-content;
}
:deep(.v-alert__close)
{
    align-self: flex-start;
    margin-inline-start: 0;
}

@media (min-width: 769px) 
{
    .positioner{
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        justify-content: center;
        margin-top:0.5rem;
        margin-right: 0.5rem;
    }
}
@media (min-width: 1025px) 
{
    .positioner{
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        justify-content: center;
        margin-top:0.5rem;
        margin-right: 0.5rem;
    }
}
</style>