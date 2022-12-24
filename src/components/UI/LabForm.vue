<template>
  <div class="form-control-add-field">
    <div class="mobile-form-control">
      <input
        style="text-align: center"
        type="text"
        placeholder="Τμήμα (π.χ. Τ1)"
        v-model="department.deptId"
      />
    </div>
    <div class="mobile-date-picker">
      <date-picker
        v-model="department.fromTime"
        time-picker
        disable-time-range-validation
        placeholder="Απο"
      >
      </date-picker>
      <date-picker
        v-model="department.toTime"
        time-picker
        disable-time-range-validation
        placeholder="Εως"
      >
      </date-picker>

      <v-select
        class="v-input_max-width"
        :items="daysOfWeek"
        variant="solo"
        label="Ημέρα"
        hide-details
        density="comfortable"
        persistent-hint
        direction="horizontal"
        single-line
        v-model="department.day"
      ></v-select>
    </div>
    <div class="mobile-actions">
      <v-btn color="error" variant="outlined" @click="deleteByDeptId()"> Καταργηση </v-btn>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref ,PropType } from "vue";
import { daysOfWeek } from "@/composables/daysOfWeekArray.composable";
import { DaysOfWeek } from "@/types/daysOfWeek.type";
import {Department} from '@/types/department.type'
export default defineComponent({
  props: {
    department:{
      type: Object as PropType<Department>,
      required : true,
    }
  },
  emits:['deleteByDeptId'],
  setup(props,context) {
    const days: Array<DaysOfWeek> = daysOfWeek;
    const deleteByDeptId = ()=>{
      context.emit('deleteByDeptId',props.department.deptId);
    }
    return { daysOfWeek,deleteByDeptId };
  },
});
</script>

<style scoped>
.form-control-add-field {
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  margin: 0.5rem 0rem;
  min-width: 320px;
}
.form-control-add-field input {
  width: 100%;
  font-size: 1.1rem;
}
.mobile-form-control {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0.5rem 0;
  width: 100%;
}
.mobile-date-picker {
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
  align-items: center;
  min-width: 320px;
}
.mobile-date-picker > * {
  width: 100%;
}

:deep(
    .dp__pointer.dp__input_readonly.dp__input.dp__input_icon_pad.dp__input_reg
  ) {
  height: 3rem;
}

.v-input_max-width {
  max-width: 804px;
}
:deep(.v-btn.v-btn--density-default) {
  background-color: #e99aa7;
  color: #e6415d;
}
/* if min-width >= 804px and min-width < 1280px */
@media (min-width: 804px) {
  .form-control-add-field {
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    margin: 0.5rem 0;
  }
  .mobile-form-control {
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 0.5rem 0;
    width: 33%;
  }
  .mobile-date-picker {
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: center;
    gap: 2.5rem;
    margin: 0.5rem 1rem;
    align-items: center;
  }

  .mobile-actions {
    width: 33%;
    margin-top: 0.5rem;
    margin-bottom: 0.5rem;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    height: 3rem;
  }
}
/* if min-width >= 1280px and min-width < 1920px */
@media (min-width: 1280px) {
  .form-control-add-field {
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    gap: 3rem;
    margin: 1rem auto;
  }
}
/* if min-width > =1920px */
@media (min-width: 1920px) {
  .form-control-add-field {
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    gap: 7rem;
    margin: 1rem auto;
  }
}
</style>
