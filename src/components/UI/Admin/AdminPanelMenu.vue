<template>
  <div class="parent">
    <v-card>
      <div>
        <v-tabs v-model="tab" bg-color="#dae3f7">
          <div class="tab-override">
            <v-tab
              v-for="cmp of component_loader"
              :key="cmp.id"
              :value="cmp.component"
              :slider-color="'#0a369d'"
              :stacked="true"
              :loading="loadingTest"
              :color="'#0a369d'"
              ripple
              elevation="2"
              class="tab-item_override"
              @click="sthComp"
              >{{ cmp.name }}</v-tab
            >
          </div>
        </v-tabs>
      </div>
      <suspense>
        <template #default>
          <keep-alive>
          <component :is="tab" />
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
} from "vue";
import { v4 as uuidv4 } from "uuid";
import BaseSpinner from "@/components/Base/BaseSpinner.vue";
export default defineComponent({
  components: {
    AdminOption: defineAsyncComponent({
      loader: () => import("@/components/UI/Admin/AdminOption.vue"),
      loadingComponent: BaseSpinner,
      delay: 200,
      suspensible:false
    }),
    ExportOption: defineAsyncComponent({
      loader: () => import("@/components/UI/Admin/ExportOption.vue"),
      loadingComponent: BaseSpinner,
      delay: 200,
      suspensible:false
    }),
    PeriodOption: defineAsyncComponent({
      loader: () => import("@/components/UI/Admin/PeriodOption.vue"),
      loadingComponent: BaseSpinner,
      delay: 200,
       suspensible:false
    }),
    BaseSpinner
  },
  setup(_, __) {
    const loadingTest = ref(true);
    onMounted(() => {
      setTimeout(() => {
        loadingTest.value = false;
      }, 2000);
    });
    const component_loader = [
      {
        id: uuidv4().toString(),
        name: "Διαχειριστες",
        value: 1,
        component: "AdminOption",
      },
      {
        id: uuidv4().toString(),
        name: "Διαχειριση Περιοδου",
        value: 2,
        component: "ExportOption",
      },
      {
        id: uuidv4().toString(),
        name: "Εξαγωγη Δηλωσεων",
        value: 3,
        component: "PeriodOption",
      },
    ];
    const tab = ref();
    const sthComp = () => {
      console.log(tab.value);
    };
    return { tab, component_loader, loadingTest, sthComp };
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
  color: rgb(10, 54, 157);
  caret-color: rgb(10, 54, 157);
  text-align: center;
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
