import { createApp } from 'vue'
import { createPinia } from 'pinia'

// Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { aliases, mdi } from 'vuetify/iconsets/mdi'
import '@mdi/font/css/materialdesignicons.css'; // Ensure this is imported
// import 'corecomponentsHJ/dist/hjcorecomponents.css'

import Toast from "vue-toastification";
// Import the CSS or use your own!
import "vue-toastification/dist/index.css";

import App from './App.vue'
import router from './router'

const vuetify = createVuetify({
    components,
    directives,
    icons: {
        defaultSet: 'mdi',
        aliases,
        sets: {
            mdi,
        }
    }
})

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(vuetify)
app.use(Toast)
// app.use(vue3GoogleLogin, {
//     clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID
// })

app.mount('#app')
