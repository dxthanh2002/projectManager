import { createApp } from "vue";
import { createPinia } from "pinia";
import "./css/style.css";
import App from "./App.vue";
import router from "./router";

const pinia = createPinia();

const app = createApp(App);
app.use(pinia).use(router);

// initialize auth store from storage so token persists across reloads
import { useAuthStore } from "./store/useAuthStore";
const auth = useAuthStore();
auth.loadFromStorage();

app.mount("#app");
