<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import { useRouter } from 'vue-router'

interface TodoItem {
  id: number
  title: string
  completed: boolean
}

const router = useRouter()

const displayedItems = ref<TodoItem[]>([])

const searchState = reactive({
  hasTyped: false,
  loading: false,
  isFiltering: false
})

const { data: allTodos, pending: pendingTodos } = useApiFetch<TodoItem[]>('todos/', {
  cacheTtlMs: 60_000
})

watch(allTodos, (todos) => {
  if (!searchState.isFiltering) {
    displayedItems.value = todos ?? []
  }
}, { immediate: true })

const listLoading = computed(() => (searchState.isFiltering ? searchState.loading : pendingTodos.value))

const handleResults = (results: TodoItem[]) => {
  if (searchState.isFiltering) {
    displayedItems.value = results
  } else {
    displayedItems.value = results.length ? results : (allTodos.value ?? [])
  }
}

const handleState = (state: { hasTyped: boolean, loading: boolean, isFiltering: boolean }) => {
  searchState.hasTyped = state.hasTyped
  searchState.loading = state.loading
  searchState.isFiltering = state.isFiltering

  if (!state.isFiltering) {
    displayedItems.value = allTodos.value ?? []
  }
}

const handleOpen = (id: number) => {
  router.push(`/product/${id}`)
}
</script>

<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Главная</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <Search
        @results="handleResults"
        @state="handleState"
        @open="handleOpen"
      />
      <List
        :items="displayedItems"
        :loading="listLoading"
        :has-typed="searchState.hasTyped"
        @open="handleOpen"
      />
    </ion-content>
  </ion-page>
</template>
