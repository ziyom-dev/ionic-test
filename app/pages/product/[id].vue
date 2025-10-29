<script setup lang="ts">
import { inject } from 'vue'
import type { RouteLocationNormalizedLoaded } from 'vue-router'

const route = inject<RouteLocationNormalizedLoaded>('route')

if (!route) throw new Error('Route not provided!')

const id = route.params.id

interface TodoItem {
  id: number
  title: string
  completed: boolean
}

const { data: res } = await useApiFetch<TodoItem>(`todos/${id}`)
</script>

<template>
  <ion-page>
     <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start" >
          <ion-back-button default-href="/" text="" class="!flex items-center justify-center" />
        </ion-buttons>
        <ion-title>Product {{ id }}</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content >
     <div class="p-5">
      <h1> {{ res?.title }}</h1>
      <p>Status: {{ res?.completed ? 'Completed' : 'Pending' }}</p>
     </div>
      
    </ion-content>
  </ion-page>
</template>
