<template>
  <div class="card">
    <v-card elevation="5" class="card-item">
      <div class="spacer">
        <v-card-title>
          {{ title }}
        </v-card-title>
        <v-card-text>
          {{ description }}
        </v-card-text>
        <v-chip outlined="true" class="card-chip">Α Χειμερινό</v-chip>
      </div>
    </v-card>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    title: String,
    description: String,
  },
  setup() {
    return {};
  },
});
</script>

<style scoped>
.card {
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
  min-width: 320px;
}
.card-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  flex-wrap: wrap;
  padding: 0;
  min-width: 320px;
}
.spacer {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0.5rem;
  min-width: 320px;
  width: 100%;
}
.card-chip {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0.5rem;
  padding: 0;
  font-weight: 500;
  border: 1px solid #09aa09;
  color: #09aa09;
  background: #f3f3f3;
  max-width: 16rem;
}
:deep(.v-card-text) {
  flex: 0;
  font-size: 0.875rem;
  font-weight: 400;
  letter-spacing: 0.0178571429em;
  padding: 0.5rem;
  text-transform: none;
}

@media (min-width: 769px) {
  .card {
    margin-bottom: 1.5rem;
    margin-top: 1.5rem;
    /* //min-width: 770px; */
  }
  .card-item {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    flex-wrap: nowrap;
  }
  .spacer {
    display: inline-flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    width: 100%;
  }
  :deep(.v-card-title) {
    display: block;
    flex: none;
    font-size: 1.25rem;
    font-weight: 500;
    -webkit-hyphens: auto;
    hyphens: auto;
    letter-spacing: 0.0125em;
    min-width: 0;
    overflow-wrap: normal;
    overflow: hidden;
    padding: 0.5rem 1rem;
    text-overflow: ellipsis;
    text-transform: none;
    white-space: nowrap;
    word-break: normal;
    word-wrap: break-word;
    width: 45%;
  }
  :deep(.v-card-text) {
    font-size: 0.875rem;
    font-weight: 500;
    letter-spacing: 0.0178571429em;
    text-transform: none;
    margin: 1rem 1rem;
    padding: 0;
    width: 40%;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    flex: 1;
  }
  .card-chip {
    width: 20%;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 0.5rem;
    padding: 0;
    font-weight: 500;
    border: 1px solid #09aa09;
    color: #09aa09;
    background: #f3f3f3;
    max-width: 6rem;
  }
}
@media (min-width: 1025px) {
  .card {
    margin-bottom: 1.5rem;
    margin-top: 1.5rem;
    min-width: 770px;
  }
  .card-item {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    flex-wrap: nowrap;
  }
  .spacer {
    display: inline-flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    width: 100%;
  }
  :deep(.v-card-title) {
    display: block;
    flex: none;
    font-size: 1.25rem;
    font-weight: 500;
    -webkit-hyphens: auto;
    hyphens: auto;
    letter-spacing: 0.0125em;
    min-width: 0;
    overflow-wrap: normal;
    overflow: hidden;
    padding: 0.5rem 1rem;
    text-overflow: ellipsis;
    text-transform: none;
    white-space: nowrap;
    word-break: normal;
    word-wrap: break-word;
    width: 45%;
  }
  :deep(.v-card-text) {
    font-size: 0.875rem;
    font-weight: 500;
    letter-spacing: 0.0178571429em;
    text-transform: none;
    margin: 1rem 1rem;
    padding: 0;
    width: 40%;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
  }
  .card-chip {
    width: 20%;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 0.5rem;
    padding: 0;
    font-weight: 500;
    border: 1px solid #09aa09;
    color: #09aa09;
    background: #f3f3f3;
    max-width: 6rem;
  }
}
</style>
