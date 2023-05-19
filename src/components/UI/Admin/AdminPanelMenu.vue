<template>
  <div class="parent" @click="emitMobileViewClose">
    <v-card>
      <div>
        <!-- ITS A WORK IN PROGRESS -->
        <v-tabs v-if="isTeacher" v-model="tab" bg-color="#dae3f7">
          <div class="tab-override">            
            <v-tab v-for="cmp of component_loader" :key="cmp.id" :value="cmp.component" :slider-color="'#0a369d'"
              :stacked="true" :color="'#0a369d'" ripple elevation="2" class="tab-item_override"
              >{{ cmp.name }}</v-tab> 
          </div>
        </v-tabs>
      </div>
      <suspense>
        <template #default>
          <keep-alive>
            <component @propagateCloseMobileView = "emitMobileViewClose" :is="tab" />
          </keep-alive>
        </template>
        <template #fallback>
          <base-spinner :show="true"></base-spinner>
        </template>
      </suspense>
    </v-card>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  onMounted,
  defineAsyncComponent,
Ref,
} from "vue";
import { v4 as uuidv4 } from "uuid";
import BaseSpinner from "@/components/Base/BaseSpinner.vue";
import { useAuth } from "@/composables/useAuth.composable";
import { TypeStaff } from "@/enums/StaffTypeEnum";
const AdminOption = defineAsyncComponent({
  loader: () => import("@/components/UI/Admin/AdminOptions/AdminOption.vue"),
  loadingComponent: BaseSpinner,
  delay: 10,
  suspensible: true
});
const ExportOption = defineAsyncComponent({
  loader: () => import("@/components/UI/Admin/ExportOptions/ExportOption.vue"),
  loadingComponent: BaseSpinner,
  delay: 10,
  suspensible: true
});
const PeriodOption = defineAsyncComponent({
  loader: () => import("@/components/UI/Admin/PeriodOptions/PeriodOption.vue"),
  loadingComponent: BaseSpinner,
  delay: 10,
  suspensible: true
});

export default defineComponent({
  components: {
    AdminOption,
    ExportOption,
    PeriodOption,
    BaseSpinner
  },
  emits: ['closeMobileView'],
  setup(_, context) {
    const isAdmin = ref(false);
    const isTeacher = ref(false);
    const { GetUserDataDetails } = useAuth();
    const tab = ref();
    const component_loader:Ref<Array<{
      id: string,
        name: string,
        component: string,
    }> >= ref([
      {
        id: uuidv4().toString(),
        name: "Εξαγωγη Δηλωσεων",
        component: "ExportOption",
      },
    ]);
    onMounted(() => {
      emitMobileViewClose();
      determineIsAdmin();
      determineIsTeacher();
      addTheAdminComponent();
    });
    const determineIsAdmin = () => {
      const details = GetUserDataDetails();
      if(!details){
        isAdmin.value = false;
        return;
      }
      if(details?.Admin === false){
        isAdmin.value = false;
        return;
      }
      isAdmin.value = true;
    };
    const determineIsTeacher =() => {
      const details = GetUserDataDetails();
      if(!details){
        isTeacher.value = false;
        return;
      }
      if(details?.EduPersonAffiliation === TypeStaff.STAFF || details?.EduPersonAffiliation === TypeStaff.ADMIN){
        isTeacher.value = true;
        return;
      }
      isTeacher.value = false;
      return;
    };
    const addTheAdminComponent = () => {
      if(isAdmin.value == true){
        component_loader.value = [...component_loader.value,{
          id: uuidv4().toString(),
          name: "Διαχειριση Περιοδου",
          component: "PeriodOption",  
        },{
        id: uuidv4().toString(),
        name: "Διαχειριστες",
        component: "AdminOption",
      }];
      }
    };
  
   
    const emitMobileViewClose = (): void => {
      context.emit('closeMobileView', true);
    }
    return { emitMobileViewClose,tab, component_loader ,isAdmin,isTeacher};
  },
});
</script>

<style scoped>
.parent {
  margin: 1rem 0;
  min-width: 320px;
}

.tab-override {
  word-wrap: break-word;
  word-break: break-word;
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 1 0 auto;
}

.tab-item_override {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  flex: 1 2 80px;
  font-size: 0.8rem;
  padding: 0;
  min-width: 80px !important;
  color: var(--header-label-text-color);
  caret-color: #0a369d;
  text-align: center;
}
.tab-override .v-btn{
  text-transform: none;
  background-color: var(--admin-panel-manu-options-background-color);
 
}
@media (min-width: 769px) {
  .parent {
    margin: 1rem 1rem;
  }

  .tab-item_override {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    flex: 1 0 auto;
    font-size: 1rem;
    padding: 0;
    min-width: fit-content;
    color: rgb(10, 54, 157);
    caret-color: rgb(10, 54, 157);
    text-align: center;
  }
}

@media (min-width: 1025px) {
  .parent {
    margin: 2rem 1rem;
  }
}
</style>
