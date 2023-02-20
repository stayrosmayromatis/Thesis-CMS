<template>
    <div class="parent">
        <v-card elevation="5">
            <v-card-title>
                <div class="title">
                    ΔΕΝ ΒΡΗΚΑ ΤΙΠΟΤΑ ΜΠΡΟ
                </div>
            </v-card-title>
            <div class="text">
                <v-card-text>
                    ρε μπρο νταξει τώρα τι να κάνουμε
                </v-card-text>
            </div>
        </v-card>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
    setup() {
        return {}
    },
})
</script>
<style scoped>
.parent {
    margin-top: 1rem;
    margin-bottom: 1rem;
    padding: 1rem 1rem;
    min-width: 320px;
}

.title {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    flex-wrap: wrap;
    padding: 0;
    min-width: 320px;
    width: 100%;
    text-align: center;
}

.text {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    flex-wrap: wrap;
    padding: 0;
    min-width: 320px;
    width: 100%;
    text-align: center;
}

/* :deep(.v-card-title) {
    display: block;
    flex: none;
    font-size: 1.25rem;
    font-weight: 500;
    hyphens: auto;
    letter-spacing: 0.0125em;
    min-width: 0;
    overflow-wrap: normal;
    overflow: hidden;
    padding: 0.5rem 1rem;
    text-overflow: clip;
    text-transform: none;
    white-space: inherit;
    word-break: break-word;
    word-wrap: break-word;
    text-align: center;
}

:deep(.v-card-text) {
    flex: 0;
    font-size: 0.875rem;
    font-weight: 400;
    letter-spacing: 0.0178571429em;
    padding: 0.5rem;
    text-transform: none;
} */


@media (min-width: 769px) {
    .parent {
        margin-top: 1rem;
        margin-bottom: 1rem;
        margin-left: 1rem;
        margin-right: 1rem;
    }

    .title {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        flex-wrap: nowrap;
    }

    .text {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        flex-wrap: nowrap;

    }
}

@media (min-width: 1025px) {
    .parent {
        margin-top: 2rem;
        margin-bottom: 2rem;
        margin-left: 1rem;
        margin-right: 1rem;
    }

    .title {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        flex-wrap: nowrap;
    }

    .text {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        flex-wrap: nowrap;
    }
}
</style>