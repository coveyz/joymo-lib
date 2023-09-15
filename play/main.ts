import { createApp } from 'vue'

  ; (async () => {
    const apps = import.meta.glob('./src/*.vue')
    const name = location.pathname.replace(/^\//, '') || 'App'
    const file = apps[`./src/${name}.vue`]

    console.log({ apps, name, file })

    if (!file) {
      location.pathname = 'App'
      return
    }
    const App = (await file()).default


    console.log('APP=>', App)


    const app = createApp(App)

    app.mount('#play')
  })()
