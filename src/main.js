import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router";
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import "./assets/theme.css";
import "./assets/dashboard.css";
import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";


const app = createApp(App);
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)
app.use(createPinia());
app.use(router);
app.use(pinia)
app.mount("#app");
app.use(Toast, {
  position: "top-right",
  timeout: 3000,
  closeOnClick: true,
  pauseOnHover: true,
});
