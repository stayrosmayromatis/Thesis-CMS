<template>
    <div class="parent">
        <v-card elevation="5">
            <v-card-title>
                <div class="loading-container">
                    <div class="title">Πραγματοποιείται αυθεντικοποίηση</div>
                    <div class="loading"></div>
                </div>
            </v-card-title>
        </v-card>
    </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
    setup() {
        return {};
    },
})
</script>
<style scoped>
.parent {
    margin: 1rem 0;
    min-width: 320px;
}

.title {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
    width: fit-content;
    text-align: center;
    padding: 0.5rem 0.5rem;
    text-transform: capitalize;
    white-space: normal;
    word-break: break-word;
    word-wrap: break-word;
    overflow-wrap: break-word;
}

.loading-container {
    display: flex;
    flex-direction: column;
    width: 100%;
    justify-content: center;
    align-items: center;
}

.loading {
    font-size: 30px;
}

.loading:after {
    overflow: hidden;
    display: inline-block;
    vertical-align: bottom;
    -webkit-animation: ellipsis steps(4, end) 900ms infinite;
    animation: ellipsis steps(4, end) 2000ms infinite;
    content: "\2026";
    /* ascii code for the ellipsis character */
    width: 0px;
}

@keyframes ellipsis {
    to {
        width: 1.25em;
    }
}

@-webkit-keyframes ellipsis {
    to {
        width: 1.25em;
    }
}

@media (min-width: 769px) {
    .parent {
        margin: 1.5rem 1.5rem;
    }

    .title {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        flex-wrap: nowrap;
    }

    .loading-container {
        display: flex;
        flex-direction: row;
        width: 100%;
        justify-content: center;
        align-items: center;
    }
}

@media (min-width: 1025px) {
    .parent {
        margin: 1.5rem 1.5rem;
    }

    .title {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        flex-wrap: nowrap;
    }

    .loading-container {
        display: flex;
        flex-direction: row;
        width: 100%;
        justify-content: center;
        align-items: center;
    }
}</style>
