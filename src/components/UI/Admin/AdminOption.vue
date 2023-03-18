<template>
  <div class="parent">
    <v-card elevation="3" class="admin-label">Διαχειριστες εφαρμογης </v-card>
    <v-card
      elevation="5"
      class="single-admin_card"
      v-for="temp of tempArray"
      :key="temp.name"
    >
      <div class="single-admin_card--item">
        <span>{{ temp.name }}</span>
        <v-tooltip :text="'Διαγραφή διαχειριστή'" location="bottom">
          <template v-slot:activator="{ props }">
            <v-btn
              v-bind="props"
              class="delete-button"
              icon="mdi-trash-can"
              size="x-small"
            ></v-btn>
          </template>
        </v-tooltip>
      </div>
    </v-card>
    <div class="add-new__admin--container">
      <v-btn type="button" elevation="4" color="green"
        ><svg
          width="25"
          height="25"
          clip-rule="evenodd"
          fill-rule="evenodd"
          stroke-linejoin="round"
          stroke-miterlimit="2"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          style="margin-right: 0.5rem;"
        >
          <path
            d="m21 3.998c0-.478-.379-1-1-1h-16c-.62 0-1 .519-1 1v16c0 .621.52 1 1 1h16c.478 0 1-.379 1-1zm-16.5.5h15v15h-15zm6.75 6.752h-3.5c-.414 0-.75.336-.75.75s.336.75.75.75h3.5v3.5c0 .414.336.75.75.75s.75-.336.75-.75v-3.5h3.5c.414 0 .75-.336.75-.75s-.336-.75-.75-.75h-3.5v-3.5c0-.414-.336-.75-.75-.75s-.75.336-.75.75z"
            fill-rule="nonzero"
          />
        </svg>
        ΠΡΟΣΘΗΚΗ ΝΕΟΥ ΔΙΑΧΕΙΡΙΣΤΗ
      </v-btn>
    </div>
    <teacher-select :seeded_professors="seededProfessors"></teacher-select>
  </div>
</template>

<script lang="ts">
import { defineComponent ,onMounted} from "vue";
import TeacherSelect from "@/components/UI/TeacherSelect.vue";
import { useProfessor } from "@/composables/useProfessors.composable";
export default defineComponent({
  components:{
    TeacherSelect
  },
  setup(props, ctx) {
    const { GetSeededProfessors, SeedProfessorsArray } = useProfessor();
    const seededProfessors = ref(new Array<BaseUser>());
    onMounted(async ()=>{
      closeAlert(1000);
      //SeedProfessorsSegment
      await GetSeededProfessors();
      seededProfessors.value = SeedProfessorsArray.value;
      context.emit("closeMobileView", true);
      return;
    });
    const tempArray = [
      {
        name: "Δημήτριος Αμανατιάδης",
      },
      {
        name: "Δημήτριος Αμανατιάδης",
      },
      {
        name: "Δημήτριος Αμανατιάδης",
      },
      {
        name: "Δημήτριος Αμανατιάδης",
      },
      {
        name: "Δημήτριος Αμανατιάδης",
      },
    ];
    return { tempArray,seededProfessors };
  },
});
</script>

<style scoped>
.parent {
  min-width: 320px;
  padding: 0;
  margin: 1.5rem 1.5rem;
}
.admin-label {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1 0 auto;
  width: 100%;
  height: 2rem;
  text-transform: uppercase;
  min-width: 320px;
  font-size: 0.9rem;
  font-weight: 450;
  background-color: #dae3f7;
  word-wrap: break-word;
  word-break: break-word;
  text-align: center;
  padding: 1.2rem;
  margin-bottom: 1rem;
}
.single-admin_card {
  padding: 0.5rem;
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
}

.single-admin_card--item {
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
}
.single-admin_card--item > span {
  color: red;
  word-wrap: break-word;
  word-break: break-word;
  text-align: center;
  font-size: 1.2rem;
  hyphens: auto;
  font-weight: 400;
}
.delete-button {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  color: #f44336;
  background: #f7f7f7;
  border: 1px solid #f44336;
  margin: 0 !important;
  width: fit-content;
  padding: 0.6em !important;
  font-size: 0.8rem !important;
  border-radius: 2rem !important;
  height: 2rem !important;
}
.add-new__admin--container{
  display: flex;
  flex-direction: row;
  width: 100%;
  justify-content: center;
  align-items: center;
  margin: 1rem 0;
}
@media (min-width: 769px) {
  parent-label {
    margin-top: 2rem;
    margin-bottom: 2rem;
    display: flex;
    flex-direction: row;
    align-items: center;
    width: 100%;
    height: 3rem;
    justify-content: center;
    font-size: 1.2rem;
    text-transform: uppercase;
    font-weight: 500;
    background-color: #aacaf3;
    /* min-width: 769px; */
  }
}
@media (min-width: 1025px) {
  .parent-label {
    margin-top: 2rem;
    margin-bottom: 2rem;
    display: flex;
    flex-direction: row;
    align-items: center;
    width: 100%;
    height: 3rem;
    justify-content: center;
    font-size: 1.2rem;
    text-transform: uppercase;
    font-weight: 500;
    background-color: #aacaf3;
    /* min-width: 769px; */
  }
}
</style>
