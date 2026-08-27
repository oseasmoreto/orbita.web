import '@fontsource-variable/inter'
import { createPinia } from 'pinia'
import { createApp } from 'vue'
import App from './App.vue'
import { UNAUTHORIZED_EVENT } from './core/api/client'
import { i18n } from './core/i18n'
import { router } from './core/router'
import './core/styles/main.scss'
import { useAuthStore } from './core/store/useAuthStore'

const app = createApp(App)

app.config.errorHandler = (error, _instance, info) => {
  // biome-ignore lint/suspicious/noConsole: sem exception tracking client-side no MVP (seção 14)
  console.error('[unhandled error]', error, info)
}

app.use(createPinia())
app.use(router)
app.use(i18n)

window.addEventListener(UNAUTHORIZED_EVENT, () => {
  useAuthStore().clear()
  void router.push({ name: 'login' })
})

app.mount('#app')
