<script setup lang="ts">
interface TodoItem {
  id: number
  title: string
  completed: boolean
}

const props = withDefaults(defineProps<{
  items?: TodoItem[]
  loading?: boolean
  hasTyped?: boolean
}>(), {
  items: () => [],
  loading: false,
  hasTyped: false
})

const emit = defineEmits<{
  (e: 'open', id: number): void
}>()

const handleOpen = (id: number) => emit('open', id)
</script>

<template>
  <ion-card>
    <ion-list lines="inset">
      <template v-if="props.items.length">
        <ion-item
          v-for="item in props.items"
          :key="item.id"
          button
          detail
          @click="handleOpen(item.id)"
        >
          <ion-label>
            <h2 class="font-semibold">{{ item.title }}</h2>
            <p class="text-xs text-gray-500">
              {{ item.completed ? 'Выполнено' : 'В работе' }}
            </p>
          </ion-label>
        </ion-item>
      </template>
      <ion-item v-else-if="props.loading">
        <ion-label class="text-center text-sm text-gray-500">
          Загрузка...
        </ion-label>
      </ion-item>
      <ion-item v-else>
        <ion-label class="text-center text-sm text-gray-500">
          {{ props.hasTyped ? 'Ничего не найдено' : 'Список пуст' }}
        </ion-label>
      </ion-item>
    </ion-list>
  </ion-card>
</template>
