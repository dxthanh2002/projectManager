import { createApp } from "vue";
import { createPinia } from "pinia";
import "./css/style.css";
import App from "./App.vue";
import router from "./router";

const pinia = createPinia();

import ToastPlugin from 'vue-toast-notification';
import 'vue-toast-notification/dist/theme-sugar.css';

const app = createApp(App);
app.use(pinia);
app.use(router);
app.use(ToastPlugin, {
    position: 'top-right',
    duration: 5000,
    dismissible: true
});

// initialize auth store from storage so token persists across reloads
import { useAuthStore } from "./store/useAuthStore";
const auth = useAuthStore();
auth.loadFromStorage();

app.mount("#app");
