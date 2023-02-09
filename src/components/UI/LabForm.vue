<template>
  <div class="form-control-add-field">
    <div class="mobile-form-control">
      <div class="div-input-placeholder">
        <input
          :class="{ 'error-border': department.errorOnDeptId }"
          @input="isInputEmpty"
          class="input-placeholder"
          type="text"
          placeholder="(π.χ. Τ1)"
          v-model="department.deptId"
        />
      </div>
      <div class="slider-grow">
        <base-slider
          @update:model-value="changeNumberOfStudents"
          :min-value="10"
          :max-value="50"
          :starting-value="department.numberOfStudents"
        ></base-slider>
      </div>
    </div>

    <div class="mobile-date-picker">
      <date-picker
        :class="{ 'error-border': department.errorOnFromTime }"
        v-model="department.fromTime"
        time-picker
        disable-time-range-validation
        placeholder="Απο"
        @update:model-value="isFromTimeEmpty"
        required
      >
      </date-picker>
      <date-picker
        :class="{ 'error-border': department.errorOnToTime }"
        v-model="department.toTime"
        time-picker
        disable-time-range-validation
        placeholder="Εως"
        @update:model-value="isToTimeEmpty"
      >
      </date-picker>
      <v-select
        class="v-input_max-width"
        :items="days"
        variant="solo"
        label="Ημέρα"
        hide-details
        density="comfortable"
        persistent-hint
        direction="horizontal"
        single-line
        v-model="department.day"
      ></v-select>
      <div class="teacher-select-box">
        <teacher-select :is_valid="isValid" @emit-selected-teacher="populateFormWithSelectedTeacher" :seeded_professors="seeded_professors_reactive"></teacher-select>
      </div>
    </div>
    <div class="mobile-actions">
      <v-btn color="error" variant="outlined" @click="deleteByDeptId()">
        Καταργηση
      </v-btn>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent,PropType,ref,toRefs } from "vue";
import { daysOfWeek } from "@/composables/daysOfWeekArray.composable";
import { Department } from "@/models/department.type";
import TeacherSelect from "@/components/UI/TeacherSelect.vue";
import { BaseUser } from "@/models/BACKEND-MODELS/BaseUser";
export default defineComponent({
  props: {
    department: {
      type: Object as PropType<Department>,
      required: true,
    },
    seeded_professors : {
      type : Object as PropType<Array<BaseUser>>,
        required : false,
        default : Array<BaseUser>()
    }
  },
  components: {
    TeacherSelect,
  },
  emits: ["deleteByDeptId"],
  setup(props, context) {
    const days = daysOfWeek;
    const { department,seeded_professors } = toRefs(props);
    //SeededProfessors for autocomplete
    const isValid = ref(false);
    const seeded_professors_reactive = seeded_professors;
    const populateFormWithSelectedTeacher = (teacher:BaseUser | undefined) => {
      if(!teacher || teacher == undefined)
      {
        department.value.selectedTeacher = undefined;
        department.value.errorOnSelectedTeacher = true;
        isValid.value = false;
      }
      else
      {
        department.value.selectedTeacher = teacher;
        department.value.errorOnSelectedTeacher = false;
        isValid.value = true;
        
      }
      console.log(department.value);
      return;
    };
    //SeededProfessors for autocomplete
    const deleteByDeptId = () => {
      context.emit("deleteByDeptId", department.value.deptId);
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
    const changeNumberOfStudents = (value: number) => {
      if (value && value > 0) department.value.numberOfStudents = value;
    };
    return {
      days,
      deleteByDeptId,
      isInputEmpty,
      isFromTimeEmpty,
      isToTimeEmpty,
      changeNumberOfStudents,
      seeded_professors_reactive,
      populateFormWithSelectedTeacher,
      isValid
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
