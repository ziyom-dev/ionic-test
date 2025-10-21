<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Color Picker Demo</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <ColorRandomizer />
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/vue'
// ColorRandomizer is auto-imported from components/
</script>

