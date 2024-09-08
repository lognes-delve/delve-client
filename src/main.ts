import { createApp } from "vue";
import App from "./App.vue";
import { createMemoryHistory, createRouter } from "vue-router";
import "./index.css";

// Page Components

import AuthView from './components/views/authView/AuthView.vue';

const routes = [
    {path : "/", component: AuthView}
]

const router = createRouter({
    history: createMemoryHistory(),
    routes
})

createApp(App)
    .use(router)
    .mount("#app");
