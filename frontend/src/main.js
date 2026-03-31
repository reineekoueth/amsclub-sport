import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'

const app = createApp(App)//promts de ne pas modifier le nom//
app.use(createPinia())
app.use(router)
app.mount('#app')
