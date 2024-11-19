import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import PrimeVue from 'primevue/config';
import Aura from '@primevue/themes/aura';
import ToastService from 'primevue/toastservice';
import { createPinia } from 'pinia'
import { router } from './router';

const pinia = createPinia()
const app = createApp(App)

app.use(PrimeVue, {
  theme: {
      preset: Aura
  }
});
app.use(ToastService);
app.use(pinia);
app.use(router);

app.mount('#app')
