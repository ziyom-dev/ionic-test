// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: false },
  modules: ['@nuxtjs/ionic', '@nuxtjs/tailwindcss'],
  css: ['~/assets/css/ionic-theme.css'],
  ssr: false,
  ionic: {
    
    config: {
      animated: true,

    
    }
  },
  hooks: {
    'app:resolve'(app) {
      app.plugins = app.plugins.map((plugin) => {
        if (plugin.src?.includes('@nuxtjs/ionic/dist/runtime/plugins/router') && !plugin.src.endsWith('.js')) {
          return {
            ...plugin,
            src: `${plugin.src}.js`
          }
        }
        return plugin
      })
    }
  },
  
  runtimeConfig: {
    public: {
      apiBaseUrl: '',
      siteUrl: 'https://jsonplaceholder.typicode.com/'
    }
  },
})
