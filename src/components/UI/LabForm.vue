<template>
    <div class="form-control-add-field">
        <!-- <v-label text="Τμήμα:"></v-label> -->
        <input style="text-align: center;" type="text" placeholder="Τμήμα (π.χ. Τ1)" v-model="inputString">
        <date-picker v-model="timeFrom" time-picker disable-time-range-validation placeholder="Απο">
        </date-picker>
        <date-picker v-model="timeTo" time-picker disable-time-range-validation placeholder="Εως">
        </date-picker>
        <v-btn color="error" variant="outlined">
            Καταργηση
        </v-btn>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
export default defineComponent({
    props: {
        labCodeIndex: {
            required: false,
            type: Number,
            default: 1
        }
    },
    setup() {
        const timeFrom = ref("");
        const timeTo = ref("");
        const inputString = ""
        return { timeFrom, timeTo, inputString }
    },

})
</script>


<style scoped>
.form-control-add-field {
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    gap: 3rem;
    margin: 1rem auto;
}

:deep(.v-btn.v-btn--density-default) {
    background-color: #e99aa7;
    color: #e6415d;
}
</style>
