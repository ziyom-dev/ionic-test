<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Color Picker Demo  <ion-icon :icon="ioniconsImage"></ion-icon> </ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      
      <ColorRandomizer />
      <TodoElement />
    </ion-content>
   <ion-footer>
    <ion-toolbar>
      <ion-title>Footer Content</ion-title>
    </ion-toolbar>
   </ion-footer>
  </ion-page>
</template>

<script setup lang="ts">

</script>

