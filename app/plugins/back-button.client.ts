import { defineNuxtPlugin, useRouter } from '#app'
import { alertController, useBackButton } from '@ionic/vue'
import { Capacitor } from '@capacitor/core'
import { App as CapacitorApp } from '@capacitor/app'

export default defineNuxtPlugin(() => {
  if (import.meta.server) return

  const router = useRouter()

  const ensureAlert = async () => {
    const top = await alertController.getTop()
    if (top?.isConnected) return top

    const alert = await alertController.create({
      header: 'Выход',
      message: 'Вы уверены, что хотите закрыть приложение?',
      buttons: [
        {
          text: 'Отмена',
          role: 'cancel'
        },
        {
          text: 'Выйти',
          role: 'confirm',
          handler: () => {
            if (Capacitor.isNativePlatform() && Capacitor.isPluginAvailable('App')) {
              void CapacitorApp.exitApp()
            }
          }
        }
      ]
    })

    await alert.present()
    return alert
  }

  useBackButton(10, async () => {
    const currentRoute = router.currentRoute.value

    if (currentRoute.path !== '/') {
      const historyState = router.options.history.state as { back?: string } | undefined
      if (historyState?.back) {
        router.back()
      } else {
        router.push('/')
      }
      return
    }

    await ensureAlert()
  })
})
