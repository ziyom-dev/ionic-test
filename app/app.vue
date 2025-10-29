<script setup lang="ts">
import { IonApp, IonRouterOutlet, createAnimation } from '@ionic/vue'
import { useRoute } from 'vue-router'

const route = useRoute()

provide('route', route)




const fadeTransition = (_baseEl: HTMLElement, opts?: any) => {
  const enteringEl = opts?.enteringEl
  const leavingEl = opts?.leavingEl

  if (!enteringEl) {
    return createAnimation()
  }

  const animation = createAnimation()
    .duration(550)
    .easing('ease-in-out')
    .addAnimation(
      createAnimation()
        .addElement(enteringEl)
        .duration(250)
        .easing('ease-in-out')
        .fromTo('opacity', '0', '1')
    )

  if (leavingEl) {
    animation.addAnimation(
      createAnimation()
        .addElement(leavingEl)
        .duration(500)
        .easing('ease-in-out')
        .fromTo('opacity', '1', '0')
    )
  }

  return animation
}
</script>


<template>
  <ion-app>
     <ion-router-outlet :animation="fadeTransition" >
      <NuxtPage />
    </ion-router-outlet>
    <NavigationTabs />
  </ion-app>
</template>

