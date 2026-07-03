import '@/assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import PrimeVue from 'primevue/config'
import Aura from '@primeuix/themes/aura'

import ToastService from 'primevue/toastservice'

import '@/utility/bandaid.js'

const app = createApp(App)
app.use(PrimeVue, {
  theme: {
    preset: Aura,
    options: {
      darkModeSelector: false || 'none',
    },
  },
})
app.use(ToastService)
app.mount('#app')
