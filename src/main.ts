import './assets/main.css'
import 'jsvectormap/dist/jsvectormap.css'
import 'flatpickr/dist/flatpickr.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
// import VueApexCharts from 'vue3-apexcharts'
import { Toaster } from 'vue-sonner'

const app = createApp(App)

app.use(router)
// app.use(VueApexCharts)
app.component('Toaster', Toaster)

app.mount('#app')
