<template>
  <div class="parent-card">
    <v-card elevation="5" class="parent-label">
      <label> Επιλογη Τμηματος: </label>
      <label class="label__lab-title">
        1601-2244 Δικτυα Υπολογιστων και Αρχιτεκτονικης Οργανωσης
      </label>
    </v-card>
    <div class="cards-overview">
      <department-card
        v-for="item in arrayfordisplay"
        :key="item.timestring"
        :department_name="item.department_name"
        :available_seats="item.available_seats"
        :duration="item.duration"
        :max_seats="item.max_seats"
        :timestring="item.timestring"
      ></department-card>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, toRefs, onMounted } from 'vue';
import DepartmentCard from "@/components/UI/DepartmentCard.vue";
export default defineComponent({
  props: {
    course_guid:{
      type:String,
      required:true
    }
  },
  components: {
    DepartmentCard,
  },
  setup(props) {
    const {course_guid} = toRefs(props);
    onMounted(() => {
      //Make the api call to fetch all labs according to that course_guid
    });
    const arrayfordisplay = [
      {
        duration: 2,
        max_seats: 50,
        available_seats: 30,
        department_name: "T1",
        timestring: "09:30-11:30",
      },
      {
        duration: 2,
        max_seats: 25,
        available_seats: 10,
        department_name: "T2",
        timestring: "10:30-12:30",
      },
      {
        duration: 2,
        max_seats: 30,
        available_seats: 0,
        department_name: "T3",
        timestring: "09:30-11:30",
      },
      {
        duration: 2,
        max_seats: 10,
        available_seats: 2,
        department_name: "T4",
        timestring: "14:30-16:30",
      },
      {
        duration: 2,
        max_seats: 50,
        available_seats: 30,
        department_name: "T1",
        timestring: "09:30-11:30",
      },
      {
        duration: 2,
        max_seats: 25,
        available_seats: 10,
        department_name: "T2",
        timestring: "10:30-12:30",
      },
      {
        duration: 2,
        max_seats: 30,
        available_seats: 0,
        department_name: "T3",
        timestring: "09:30-11:30",
      },
      {
        duration: 2,
        max_seats: 10,
        available_seats: 2,
        department_name: "T4",
        timestring: "14:30-16:30",
      },
      {
        duration: 2,
        max_seats: 50,
        available_seats: 30,
        department_name: "T1",
        timestring: "09:30-11:30",
      },
      {
        duration: 2,
        max_seats: 25,
        available_seats: 10,
        department_name: "T2",
        timestring: "10:30-12:30",
      },
      {
        duration: 2,
        max_seats: 30,
        available_seats: 0,
        department_name: "T3",
        timestring: "09:30-11:30",
      },
      {
        duration: 2,
        max_seats: 10,
        available_seats: 2,
        department_name: "T4",
        timestring: "14:30-16:30",
      },
      {
        duration: 2,
        max_seats: 50,
        available_seats: 30,
        department_name: "T1",
        timestring: "09:30-11:30",
      },
      {
        duration: 2,
        max_seats: 25,
        available_seats: 10,
        department_name: "T2",
        timestring: "10:30-12:30",
      },
      {
        duration: 2,
        max_seats: 30,
        available_seats: 0,
        department_name: "T3",
        timestring: "09:30-11:30",
      },
      {
        duration: 2,
        max_seats: 10,
        available_seats: 2,
        department_name: "T4",
        timestring: "14:30-16:30",
      },
    ];
    return { arrayfordisplay,course_guid };
  },
});
</script>

<style scoped>
.parent-card {
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
  min-width: 320px;
}
.parent-label {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: fit-content;
  text-transform: uppercase;
  min-width: 320px;
  font-size: 1rem;
  font-weight: 500;
  background-color: #aacaf3;
  padding: 0.5rem;
  margin-top: 1rem;
  margin-bottom: 1rem;
}
.label__lab-title {
  text-align: center;
  word-break: break-word;
}
.cards-overview {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-evenly;
  flex-wrap: wrap;
}
@media (min-width: 769px) {
  .parent-card {
    margin: 1.5rem 1.5rem;
  }
  .parent-label {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    height: fit-content;
    justify-content: center;
    font-size: 1.2rem;
    text-transform: uppercase;
    font-weight: 500;
    background-color: #aacaf3;
    padding: 1rem;
    margin-top: 1.5rem;
    margin-bottom: 1.5rem;
  }
  .cards-overview {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-evenly;
    flex-wrap: wrap;
  }
}
@media (min-width: 1025px) {
  .parent-card {
    margin: 1.5rem 1.5rem;
  }
  .parent-label {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 1rem;
    width: 100%;
    height: fit-content;
    justify-content: center;
    font-size: 1.2rem;
    text-transform: uppercase;
    font-weight: 500;
    background-color: #aacaf3;
    padding: 1rem;
    margin-top: 1.5rem;
    margin-bottom: 1.5rem;
  }
  .cards-overview {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-evenly;
    flex-wrap: wrap;
  }
}
</style>
