<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { usePrizeStore } from './store'

const router = useRouter()
const prizeStore = usePrizeStore()
const loading = ref(false)

const form = ref({
  nombre: ''
})

const handleSubmit = async () => {
  loading.value = true
  try {
    await prizeStore.createPrize(form.value)
    router.push('/premios')
  } catch (error) {
    console.error('Error al crear el premio:', error)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="container mx-auto p-4">
    <h1 class="text-2xl font-bold mb-6">Registrar Premio</h1>
    
    <form @submit.prevent="handleSubmit" class="max-w-lg">
      <div class="mb-4">
        <label for="nombre" class="block text-sm font-medium text-gray-700">Nombre del Premio</label>
        <input
          id="nombre"
          v-model="form.nombre"
          type="text"
          required
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>

      <div class="flex justify-end space-x-2">
        <button
          type="button"
          @click="$router.push('/premios')"
          class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Cancelar
        </button>
        <button
          type="submit"
          :disabled="loading"
          class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          {{ loading ? 'Guardando...' : 'Guardar' }}
        </button>
      </div>
    </form>
  </div>
</template>