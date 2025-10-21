<template>
  <ion-card :style="{ backgroundColor: color, color: textColor }">
    <ion-card-header>
      <ion-card-title>Random Color</ion-card-title>
      <ion-card-subtitle>{{ color.toUpperCase() }}</ion-card-subtitle>
    </ion-card-header>
    <ion-card-content>
      <ion-button expand="block" @click="randomize">Pick Random Color</ion-button>
    </ion-card-content>
  </ion-card>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { IonButton, IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent } from '@ionic/vue'

const color = ref('#4CAF50')

function randomHex() {
  const n = Math.floor(Math.random() * 0xffffff)
  return `#${n.toString(16).padStart(6, '0')}`
}

function randomize() {
  color.value = randomHex()
}

// Ensure contrast (simple YIQ-based contrast)
const textColor = computed(() => {
  const hex = color.value.replace('#', '')
  const r = parseInt(hex.substring(0, 2), 16)
  const g = parseInt(hex.substring(2, 4), 16)
  const b = parseInt(hex.substring(4, 6), 16)
  const yiq = (r * 299 + g * 587 + b * 114) / 1000
  return yiq >= 160 ? '#000000' : '#ffffff'
})
</script>

<style scoped>
ion-card {
  transition: background-color 200ms ease;
}
</style>

