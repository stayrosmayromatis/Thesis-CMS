<template>
    <v-app>
        <v-slider v-model="startingValueComp" direction="horizontal" :min="minValue"
            :max="maxValue" :show-ticks="showTicks" hide-details :step="1" thumb-label="always">
            <template v-slot:thumb-label="{ modelValue }">
                {{ `${modelValue} άτομα` }}
            </template>
        </v-slider>
    </v-app>
</template>
<script lang="ts">
import { computed } from 'vue';
import { defineComponent} from 'vue'

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
            type: Number,
            required: false,
            default: 0
        }

    },
    emits: ['update:starting-value'],
    setup(props, context) {
        //const numberValue = ref<number>();
        //const { startingValue } = toRefs(props);

        const startingValueComp = computed({
            set: (value) => {
                context.emit('update:starting-value', value)
            },
            get: ()=> {
                return props.startingValue;
            }
        })

        // onMounted(() => {
        //     numberValue.value = startingValue.value;
        // });
        // onUpdated(() => {
        //     numberValue.value = startingValue.value;
        // });
        // const changeNumberValue = (value: number) => {
        //     if (value && value > 0) {
        //         numberValue.value = value;
        //         context.emit('update:model-value', numberValue.value)
        //     }
        // }
        return {
            //numberValue,
            //changeNumberValue,
            startingValueComp
        }
    },
})
</script>

<style scoped>
:deep(.v-slider-thumb__label) {
    font-size: 0.8rem;
    min-width: 35px;
    height: 30px;
    width: 70px;
}
</style>
