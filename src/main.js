// main.js
import { createApp } from 'vue'
import App from './App.vue'

// Import Vuetify
import { createVuetify } from 'vuetify'
import 'vuetify/styles'  // Global CSS has to be included
import '@mdi/font/css/materialdesignicons.css'  // Import Material Design Icons

// Import all components (by using all presets)
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

// Create Vuetify instance
const vuetify = createVuetify({
  components,
  directives,
})

// Create app
const app = createApp(App)

// Use Vuetify in the app
app.use(vuetify)

app.mount('#app')