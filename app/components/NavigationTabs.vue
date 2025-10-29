<script setup lang="ts">
import { cartOutline, searchOutline, personOutline, chatbubbleOutline } from 'ionicons/icons'


</script>
<template>
  <ion-footer class="p-0 fixed bottom-0 w-full border-t border-gray-200 bg-white">
    <ion-toolbar class="p-0" style="--padding-bottom: 0; --padding-top: 0;">
      <ion-list class="flex p-0 justify-between">
        <ion-item lines="none">
          <ion-nav-link   router-direction="forward" router-link="/">
            <ion-button fill="clear">
              <ion-icon :icon="searchOutline" size="large" color="primary"></ion-icon>
            </ion-button>
          </ion-nav-link>
        </ion-item>
        <ion-item lines="none"> 
          <ion-nav-link router-direction="forward" disabled router-link="/cart">
            <ion-button fill="clear">
                <ion-icon :icon="cartOutline" size="large" color="primary"></ion-icon>
            </ion-button>
          </ion-nav-link>
        </ion-item>
        <ion-item lines="none"> 
          <ion-nav-link router-direction="forward" disabled="true">
            <ion-button fill="clear" disabled>
               <ion-icon :icon="chatbubbleOutline" size="large" color="primary"></ion-icon>
            </ion-button>
          </ion-nav-link>
        </ion-item >
        <ion-item lines="none">
          <ion-nav-link router-direction="forward" router-link="/user">
            <ion-button fill="clear">
              <ion-icon :icon="personOutline" size="large" color="primary"></ion-icon>
            </ion-button>
          </ion-nav-link>
        </ion-item>
      </ion-list>
    </ion-toolbar>
  </ion-footer>
</template>


