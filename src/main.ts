import '@fontsource-variable/inter'
import dayjs from 'dayjs'
import 'dayjs/locale/pt-br'
import { createPinia } from 'pinia'
import { createApp } from 'vue'
import App from './App.vue'
import { UNAUTHORIZED_EVENT } from './core/api/client'
import { i18n } from './core/i18n'
import { router } from './core/router'
import './core/styles/main.scss'
import 'vue-sonner/style.css'
import { useAuthStore } from './core/store/useAuthStore'

// Produto é pt-BR only no MVP (seção 6.3 de docs/infra/convencoes-frontend-infra.md)
// — mesmo critério já aplicado no `vue-i18n`, agora também no `dayjs`
// (nomes de mês/dia abreviados do `DatePicker`, ex. "fev" em vez de "feb").
dayjs.locale('pt-br')

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
