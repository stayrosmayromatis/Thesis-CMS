
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
import router from "@/router";
import {store,key} from '@/store/index';
import '@vuepic/vue-datepicker/dist/main.css'
import "./global-styles/global-styles.css"
const app = createApp(App)
//app.config.globalProperties.$http = 
registerPlugins(app)
app.use(store,key);
app.use(router);
app.mount('#app')
