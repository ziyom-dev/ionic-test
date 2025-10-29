<script setup lang="ts">
import { onBeforeUnmount, ref } from 'vue'
import { debounce } from 'lodash'

interface TodoItem {
  id: number
  title: string
  completed: boolean
}

const searchQuery = ref('')
const searchResults = ref<TodoItem[]>([])
const hasTyped = ref(false)
const isFiltering = ref(false)
const loading = ref(false)

const emit = defineEmits<{
  (e: 'results', payload: TodoItem[]): void
  (e: 'state', payload: { hasTyped: boolean, loading: boolean, isFiltering: boolean }): void
  (e: 'open', id: number): void
}>()

const notifyState = () => {
  emit('state', {
    hasTyped: hasTyped.value,
    loading: loading.value,
    isFiltering: isFiltering.value
  })
}

const runSearch = debounce(async (rawQuery: string) => {
  const query = rawQuery.trim()
  if (query.length < 2) {
    loading.value = false
    isFiltering.value = false
    searchResults.value = []
    emit('results', [])
    notifyState()
    return
  }

  isFiltering.value = true
  loading.value = true
  notifyState()

  try {
    const response = await useApiFetch<TodoItem[]>('todos/', {
      query: {
        q: query,
        _limit: 5
      }
    })

    searchResults.value = response.data.value ?? []
    emit('results', searchResults.value)
  } catch (error) {
    console.error('Ошибка при поиске задач:', error)
    searchResults.value = []
    emit('results', [])
  } finally {
    loading.value = false
    notifyState()
  }
}, 350)

const handleQueryChange = (value: string | null | undefined) => {
  searchQuery.value = value ?? ''
  hasTyped.value = searchQuery.value.length > 0
  notifyState()

  if (searchQuery.value.trim().length < 2) {
    runSearch.cancel()
    loading.value = false
    isFiltering.value = false
    searchResults.value = []
    emit('results', [])
    notifyState()
    return
  }

  runSearch(searchQuery.value)
}

const clearSearch = () => {
  searchQuery.value = ''
  hasTyped.value = false
  isFiltering.value = false
  loading.value = false
  searchResults.value = []
  runSearch.cancel()
  emit('results', [])
  notifyState()
}

const openProduct = (id: number) => {
  emit('open', id)
  clearSearch()
}

onBeforeUnmount(() => {
  runSearch.cancel()
})
</script>

<template>
  <div class="flex flex-col gap-4 p-4">
    <ion-searchbar
      :value="searchQuery"
      placeholder="Найдите свой товар..."
      animated
      show-cancel-button="focus"
      @ionInput="handleQueryChange($event.detail.value)"
      @ionClear="clearSearch"
      @keyup.enter.prevent="searchResults[0] && openProduct(searchResults[0].id)"
    />

    <div v-if="loading" class="flex justify-center pt-2">
      <ion-spinner name="dots" />
    </div>
  </div>
</template>
