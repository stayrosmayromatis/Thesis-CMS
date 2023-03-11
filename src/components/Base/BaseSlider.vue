<template>
    <v-app>
        <v-slider @update:model-value="changeNumberValue" direction="horizontal" 
        :model-value="numberValue" 
        :min="minValue" :max="maxValue"
            :show-ticks="showTicks" hide-details :step="1" thumb-label="always">
            <template v-slot:thumb-label="{ modelValue }">
                {{ `${modelValue} άτομα` }}
            </template>
        </v-slider>
    </v-app>
</template>
<script lang="ts">
import { defineComponent,ref } from 'vue'

export default defineComponent({
    props: {
        minValue: {
            type: Number,
            required: true,
            default: 10
        },
        maxValue: {
            type: Number,
            required: true,
            default: 50
        },
        showTicks: {
            type: Boolean,
            required: false,
            default: false
        },
        startingValue: {
            type:Number,
            required: true,
            default: 30
        }

    },
    emits:['update:model-value'],
    setup(props,context) {
        const numberValue = ref(props.startingValue);

        const changeNumberValue = (value:number) => {
            if(value && value > 0){
                numberValue.value=value;
                context.emit('update:model-value',numberValue.value)
            }
        }
        return {numberValue,changeNumberValue}
    },
})
</script>

<style scoped>
:deep(.v-slider-thumb__label){
    font-size: 0.8rem;
    min-width: 35px;
    height: 30px;
    width: 70px;
}
</style>
