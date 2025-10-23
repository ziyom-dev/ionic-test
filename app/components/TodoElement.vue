<script setup lang="ts">
interface ITodo {
  userId: number
  id: number
  title: string
  completed: boolean
}
const { data: array } = await useApiFetch<[ITodo]>('todos/')
const router = useIonRouter()
function goToTodo(id: number) {
  router.push(`/todos/${id}`)
}
</script>

<template>
  <div>
    <ul style="column-count: 2;">
      
      <li style="margin-bottom: 10px;" v-for="todo in array" :key="todo.id">
        <ion-button 
         @click="goToTodo(todo.id)" router-direction="forward"
    
    
        
        >{{ todo.title }}</ion-button>
      </li>

    </ul>
  </div>
</template>
