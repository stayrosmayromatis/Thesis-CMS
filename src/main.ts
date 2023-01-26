
/**
 * main.ts
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Components
import App from '@/App.vue'

// Composables
import { createApp } from 'vue'

// Plugins
import { registerPlugins } from '@/plugins'
import router from "./router";
import {store,key} from '@/store/index';
import  DatePicker  from '@vuepic/vue-datepicker';
import BaseSlider from '@/components/Base/BaseSlider.vue'
import '@vuepic/vue-datepicker/dist/main.css'
const app = createApp(App)
app.component('date-picker',DatePicker);
app.component('base-slider',BaseSlider);
registerPlugins(app)
app.use(store,key);
app.use(router);
app.mount('#app')
