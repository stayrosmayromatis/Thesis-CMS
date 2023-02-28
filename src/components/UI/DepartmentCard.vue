<template>
  <div class="parent-card-container">
    <v-card elevation="10" class="parent-card-container__border-radius">
      <div class="parent-card__department-title">
        <v-card-title> T1 </v-card-title>
      </div>
      <v-divider
        class="border-opacity"
        length="100%"
        thickness="1px"
        :vertical="false"
      ></v-divider>
      <div class="parent-card__main-info">
        <v-card-text>
          <div class="parent-card__main-info__labels">
            <div class="label__hours">
              <label for="">Ώρες Εργαστηρίου:</label>
              <label for="">09:30 - 11:30</label>
            </div>
            <div class="label__duration">
              <label for="">Διάρκεια (ώρες):</label>
              <label for="">~ 2 ώρες</label>
            </div>
            <div class="label__max-seats">
              <label for="">Μέγιστες Θέσεις:</label>
              <label for="">50 </label>
            </div>

            <div class="label__available-seats">
              <label for="">Διαθέσιμες Θέσεις:</label>
              <label for="">30</label>
            </div>
            <div class="label__department-completeness">
              <label for="">Πληρότητα Τμήματος: </label>
              <label for="">45%</label>
            </div>
          </div>
          <div class="progress-bar">
            <v-progress-linear
              :model-value="`${(25/40)*100}`"
              color="light-blue"
              height="15px"
              :striped="true"
              rounded="5rem"
              :rounded-bar="true"
              :tag="'div'"
            ></v-progress-linear>
          </div>
          div 
        </v-card-text>
      </div>
    </v-card>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
export default defineComponent({
  setup() {
    return {};
  },
});
</script>

<style scoped>
.parent-card-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: fit-content;
  height: max-content;
  min-width: 320px;
  padding: 1rem 1rem;
}
.parent-card-container__border-radius {
  border-radius: 32px;
}
.parent-card__department-title {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 0.5rem 0.5rem;
}
.parent-card__department-title > .v-card-title {
  font-weight: 1000;
  font-size: 1.8rem;
}
.parent-card__main-info {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 0.5rem 0.5rem;
}
div.parent-card__main-info__labels {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  line-height: 2rem;
  font-weight: 400;
}

.parent-card__main-info__labels > .label__department-completeness {
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  align-items: center;
  width: 100%;
}
.parent-card__main-info__labels > .label__available-seats {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}
.parent-card__main-info__labels > .label__max-seats {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}
.parent-card__main-info__labels > .label__duration {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}
.parent-card__main-info__labels > .label__hours {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  gap: 1rem;
}
.parent-card__main-info > .v-card-text {
  font-weight: 400;
  font-size: 1.2rem;
}

.progress-bar{
  width:100%
}
.border-opacity {
  opacity: 50%;
  margin: 0 1rem;
}
</style>
