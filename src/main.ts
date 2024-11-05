import { createApp } from 'vue'
import { useModules } from '~/modules'
import App from './App.vue'
import '~/assets'

const app = createApp(App)
useModules(app)
app.mount('#app').$nextTick(async () => {
  // eslint-disable-next-line no-console
  console.log('mounted')
  await useInitialization()
  window.addEventListener('contextmenu', (ev) => {
    ev.preventDefault()
  })
})
