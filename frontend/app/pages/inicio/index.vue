<script setup lang="ts">
import { useCareerStore } from '~/stores/career';
import { onMounted, computed } from 'vue';

definePageMeta({
  requiresAuth: true,
  layout: 'dashboard',
});

const careerStore = useCareerStore();

onMounted(() => {
  careerStore.fetchCareers();
});

const careersByModality = computed(() => {
  const counts = {
    CURSO_DIURNO: 0,
    CURSO_A_DISTANCIA: 0,
    CURSO_POR_ENCUENTRO: 0,
  };
  
  careerStore.careers.forEach(career => {
    if (career.modalidad in counts) {
      counts[career.modalidad as keyof typeof counts]++;
    }
  });
  
  return [
    { modality: 'Curso Diurno', count: counts.CURSO_DIURNO },
    { modality: 'Curso a Distancia', count: counts.CURSO_A_DISTANCIA },
    { modality: 'Curso por Encuentro', count: counts.CURSO_POR_ENCUENTRO },
  ];
});

</script>

<template>
  <div class="space-y-6">
    <h1 class="text-3xl font-bold">Inicio</h1>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <!-- Card para Carreras por Modalidad -->
      <div class="bg-white p-6 rounded-lg shadow-md">
        <h2 class="text-xl font-semibold mb-4">Carreras por Modalidad</h2>
        <div v-if="careerStore.isLoading" class="text-center">Cargando...</div>
        <div v-else>
          <ul class="space-y-2">
            <li v-for="item in careersByModality" :key="item.modality" class="flex justify-between items-center">
              <span>{{ item.modality }}</span>
              <span class="font-bold bg-primary-100 text-primary-800 px-2 py-1 rounded-full text-sm">{{ item.count }}</span>
            </li>
          </ul>
        </div>
      </div>
      
      <!-- Aquí se pueden añadir más tarjetas de información -->
      
    </div>
  </div>
</template>
