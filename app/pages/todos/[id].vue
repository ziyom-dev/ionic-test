<script setup lang="ts">
import { Capacitor } from '@capacitor/core'
import { LocalNotifications } from '@capacitor/local-notifications'
import { isPlatform } from '@ionic/vue'
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const id = computed(() => route.params.id as string | undefined)

const { data: item } = await useApiFetch<ITodo>(`todos/${id.value}`)

const notificationsAvailable = ref(Capacitor.isPluginAvailable('LocalNotifications'))
const hasPermission = ref(false)
const isHybrid = isPlatform('hybrid') || isPlatform('ios') || isPlatform('android')

onMounted(async () => {
  if (!notificationsAvailable.value) {
    console.warn('[notifications] LocalNotifications plugin not available')
    return
  }

  try {
    const { display } = await LocalNotifications.checkPermissions()
    if (display === 'granted') {
      hasPermission.value = true
      return
    }

    const request = await LocalNotifications.requestPermissions()
    hasPermission.value = request.display === 'granted'
  }
  catch (error) {
    notificationsAvailable.value = false
    console.error('[notifications] Failed to check permissions', error)
  }
})

const scheduleNotification = async () => {
  if (!notificationsAvailable.value || !hasPermission.value || !item.value?.title) {
    console.warn('[notifications] Cannot schedule notification', {
      notificationsAvailable: notificationsAvailable.value,
      hasPermission: hasPermission.value,
      hasTitle: !!item.value?.title
    })
    return
  }

  try {
    await LocalNotifications.schedule({
      notifications: [
        {
          title: 'Todo reminder',
          body: item.value.title,
          id: Date.now(),
          schedule: isHybrid ? { at: new Date(Date.now() + 1000) } : undefined,
          extra: {
            todoId: item.value.id
          }
        }
      ]
    })
  }
  catch (error) {
    console.error('[notifications] Failed to schedule notification', error)
  }
}

interface ITodo {
  userId: number
  id: number
  title: string
  completed: boolean
}
</script>

<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>

        <ion-title>
          {{ id }}
          
        </ion-title>
         <ion-chip slot="start"> {{ id }}</ion-chip>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
    
      {{ item?.title }} - {{ item?.completed ? 'Completed' : 'Not Completed' }}


     <!-- СУДА КНОПКУ -->
     <ion-button
       expand="block"
       @click="scheduleNotification"
       :disabled="!item?.title || !notificationsAvailable || !hasPermission"
     >
       Push reminder
     </ion-button>
     <ion-text v-if="!notificationsAvailable" color="medium">
       Push notifications not available in this environment.
     </ion-text>
     <ion-text v-else-if="!hasPermission" color="medium">
       grant notification permission on the device to enable push.
     </ion-text>
    </ion-content>
  </ion-page>
</template>
