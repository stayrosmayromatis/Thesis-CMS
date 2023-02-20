<template>
    <div class="parent">
        <v-card elevation="5">
            <div class="title">
                <v-card-title>
                    ΔΕΝ ΒΡΗΚΑ ΤΙΠΟΤΑ ΜΠΡΟ
                </v-card-title>
            </div>
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