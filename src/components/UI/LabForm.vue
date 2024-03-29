<template>
  <div class="form-control-add-field">
    <div class="mobile-form-control">
      <div class="div-input-placeholder">
        <input :class="{ 'error-border': department.errorOnDeptId }" @input="isInputEmpty" class="input-placeholder"
          type="text" name="input-placeholder" placeholder="(π.χ. Τ1)" v-model="department.deptId" />
      </div>
      <div class="slider-grow">
        <suspense>
          <template #default>
            <base-slider :min-value="minValue" :max-value="maxValue"
              v-model:starting-value="startingValue"></base-slider>
          </template>
        </suspense>
      </div>
    </div>
    <suspense>
      <template #default>
        <div class="mobile-date-picker">
          <date-picker :class="{ 'error-border': department.errorOnFromTime }" v-model="department.fromTime" time-picker
            disable-time-range-validation placeholder="Απο" @update:model-value="isFromTimeEmpty" :is-24="true"
            show-now-button position="center" select-text="Οκ" cancel-text="Άκυρο" now-button-label="Τώρα">
          </date-picker>
          <date-picker :class="{ 'error-border': department.errorOnToTime }" v-model="department.toTime" time-picker
            disable-time-range-validation placeholder="Έως" @update:model-value="isToTimeEmpty" :is-24="true"
            show-now-button position="center" select-text="Οκ" cancel-text="Άκυρο" now-button-label="Τώρα">
          </date-picker>
          <v-select class="v-input_max-width" :items="days" variant="solo" label="Ημέρα" hide-details
            density="comfortable" persistent-hint direction="horizontal" single-line v-model="department.day"></v-select>
          <div class="teacher-select-box">
            <teacher-select :selected_teacher_by_edit_flag="is_by_edit"
              :selected_teacher_by_edit_value="is_by_edit ? department.selectedTeacher : undefined"
              :error_on_selected_teacher="department.errorOnSelectedTeacher"
              @emit-selected-teacher="populateFormWithSelectedTeacher"
              :seeded_professors="seeded_professors_reactive"></teacher-select>
          </div>
        </div>
      </template>
    </suspense>
    <div class="mobile-actions">
      <v-btn color="error" variant="outlined" @click="deleteByDeptId()">
        Καταργηση
      </v-btn>
    </div>
  </div>
</template>

<script lang="ts">
import { defineAsyncComponent, defineComponent, onMounted, PropType, ref, toRefs, watch } from "vue";
import { daysOfWeek } from "@/composables/daysOfWeekArray.composable";
import { Department } from "@/models/department.type";
import { BaseUser } from "@/models/BACKEND-MODELS/BaseUser";
const TeacherSelect = defineAsyncComponent({
  loader: () => import("@/components/UI/TeacherSelect.vue"),
  delay: 500,
  suspensible: false
});
const BaseSlider = defineAsyncComponent({
  loader: () => import("@/components/Base/BaseSlider.vue"),
  delay: 500,
  suspensible: false
});
const DatePicker = defineAsyncComponent({
  loader: () => import('@vuepic/vue-datepicker'),
  delay: 500,
  suspensible: false
});


export default defineComponent({
  props: {
    department: {
      type: Object as PropType<Department>,
      required: true,
    },
    seeded_professors: {
      type: Object as PropType<Array<BaseUser>>,
      required: false,
      default: Array<BaseUser>()
    },
    is_by_edit: {
      type: Boolean,
      required: true,
      default: false
    }
  },
  components: {
    TeacherSelect,
    DatePicker,
    BaseSlider
  },
  emits: ["deleteByDeptId"],
  setup(props, context) {
    const days = daysOfWeek;
    const { department, seeded_professors, is_by_edit } = toRefs(props);
    const minValue = ref<number>(10);
    const maxValue = ref<number>(50);
    const startingValue = ref<number>(12);
    onMounted(() => {
      startingValue.value = is_by_edit.value && department ? department.value.numberOfStudents : 12;
      minValue.value = is_by_edit.value && department ? department.value.numberOfStudents : 10;
    })
    const populateFormWithSelectedTeacher = (teacher: BaseUser | undefined) => {
      if (!teacher) {
        department.value.selectedTeacher = undefined;
        department.value.errorOnSelectedTeacher = true;
        return;
      }
      department.value.selectedTeacher = teacher;
      department.value.errorOnSelectedTeacher = false;
      return;
    };
    //SeededProfessors for autocomplete
    const deleteByDeptId = () => {
      context.emit("deleteByDeptId", department.value.Guid);
    };
    const isInputEmpty = () => {
      department.value.deptId === "" ||
        department.value.deptId === " " ||
        department.value.deptId === null
        ? (department.value.errorOnDeptId = true)
        : (department.value.errorOnDeptId = false);
    };
    const isFromTimeEmpty = () => {
      department.value.fromTime === "" ||
        department.value.fromTime === " " ||
        department.value.fromTime === null
        ? (department.value.errorOnFromTime = true)
        : (department.value.errorOnFromTime = false);
    };
    const isToTimeEmpty = () => {
      department.value.toTime === "" ||
        department.value.toTime === " " ||
        department.value.toTime === null
        ? (department.value.errorOnToTime = true)
        : (department.value.errorOnToTime = false);
    };
    // const changeNumberOfStudents = (value: number) => {
    //   if(value > 0){
    //     department.value.numberOfStudents = value;
    //   }
    // };
    const clearErrors = () => {
      if (department.value.errorOnFromTime === true) {
        department.value.errorOnFromTime = false;
      }
      if (department.value.errorOnToTime === true) {
        department.value.errorOnToTime = false
      }
    };

    watch(startingValue,(value) => {
      department.value.numberOfStudents = value;
    });

    return {
      days,
      seeded_professors_reactive: seeded_professors,
      minValue,
      maxValue,
      startingValue,
      clearErrors,
      populateFormWithSelectedTeacher,
      deleteByDeptId,
      isInputEmpty,
      isFromTimeEmpty,
      isToTimeEmpty,
      //changeNumberOfStudents,
    };
  },
});
</script>

<style scoped>
.teacher-select-box {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  margin: 0.3rem;
}

.slider-grow {
  margin: 0 1rem;
  padding: 0 1.6rem;
  width: 100%;
}

.div-input-placeholder {
  width: 100%;
}

.input-placeholder {
  text-align: center;
  width: 100%;
}

.error-border {
  border: 0.1px solid #e6415d;
  border-radius: 5px;
  -moz-border-radius: 5px;
  -webkit-border-radius: 5px; 
}

.form-control-add-field {
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  margin: 0.5rem 0rem;
  min-width: 320px;
  gap: 0.5rem;
}

.form-control-add-field input {
  width: 100%;
  font-size: 1.1rem;
}

.mobile-form-control {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: 0.5rem 0;
  gap: 2.1rem;
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
  gap: 0.3rem;
  min-width: 320px;
}

.mobile-date-picker>* {
  width: 100%;
}

:deep(.dp__pointer.dp__input_readonly.dp__input.dp__input_icon_pad.dp__input_reg) {
  height: 3rem;
}

.v-input_max-width {
  max-width: 804px;
}

:deep(.v-btn.v-btn--density-default) {
  background-color: transparent;
  color: #e6415d;
}

:deep(.v-application__wrap) {
  backface-visibility: hidden;
  max-width: none;
  width: 10rem;
  min-height: 1rem;
  position: relative;
}

/* if min-width >= 804px and min-width < 1280px */
@media (min-width: 804px) {
  .div-input-placeholder {
    min-width: none;
    width: 20rem;
    max-width: none;
  }

  .input-placeholder {
    text-align: center;
    width: 7rem;
  }

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
    justify-content: space-evenly;
    flex-direction: row;
    align-items: center;
    margin: 0.5rem 1rem;
    width: 100%;
    margin-top: 2rem;
    gap: 0;
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

  .slider-grow {
    margin: 0;
  }
}

/* if min-width >= 1280px and min-width < 1920px */
@media (min-width: 1280px) {
  .input-placeholder {
    text-align: center;
    width: 7rem;
  }

  .mobile-form-control {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 0.5rem 0;
    width: 33%;
    gap: 0.2rem;
  }

  .form-control-add-field {
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    gap: 0; 
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
    gap: 0; 
    margin: 1rem auto;
  }
}
</style>
