import './assets/main.css'

import { createApp, h, provide } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import { DefaultApolloClient } from '@vue/apollo-composable'
import { apolloClient, setPiniaInstance } from './apollo'

const app = createApp({
    setup() {
        provide(DefaultApolloClient, apolloClient)
    },
    render: () => h(App)
})


const pinia = createPinia()

app.use(pinia)
setPiniaInstance(pinia)

app.use(router)

app.mount('#app')
