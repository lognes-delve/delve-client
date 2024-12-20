import { createApp } from "vue";
import App from "./App.vue";
import { createMemoryHistory, createRouter } from "vue-router";
import "./index.css";
import { initializeApp } from "firebase/app";
import { VueFire, VueFireAuth } from 'vuefire';
import Vuex from "vuex";

import { plugin, defaultConfig } from "@formkit/vue";

// Page Components

import AuthView from './views/authView/AuthView.vue';
import AppView from "./views/appView/AppView.vue";

const routes = [
    {path : "/", component: AuthView},
    {path : "/app", component: AppView}
]

const router = createRouter({
    history: createMemoryHistory(),
    routes
})

export const firebaseApp = initializeApp({
    apiKey : "AIzaSyDFzRgTi3sDqo_lcbbzB5Ne9DFvAoqGRpw" // the web api key is safe to be public
})

createApp(App)
    .use(
        VueFire, {
            firebaseApp,
            modules : [
                VueFireAuth(),
            ]
        }
    )
    .use(Vuex)
    .use(router)
    .use(plugin, defaultConfig)
    .mount("#app");