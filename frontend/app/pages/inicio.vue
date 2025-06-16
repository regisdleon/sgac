<script setup lang="ts">
import { useCareerStore } from "~/stores/career";

definePageMeta({ layout: 'dashboard' });

const careerStore = useCareerStore();

// Fetch careers when component is mounted
onMounted(async () => {
  await careerStore.fetchCareers();
});
</script>

<template>
  <div class="container mx-auto p-4">
    <h1 class="text-2xl font-bold mb-4">Dashboard</h1>
    
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <!-- Total Careers Card -->
      <UCard>
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold">Total Carreras</h3>
            <UIcon name="i-heroicons-academic-cap" class="text-primary-500" />
          </div>
        </template>
        <div class="text-3xl font-bold">
          {{ careerStore.careers.length }}
        </div>
      </UCard>

      <!-- Careers by Modality -->
      <UCard>
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold">Carreras por Modalidad</h3>
            <UIcon name="i-heroicons-presentation-chart-line" class="text-primary-500" />
          </div>
        </template>
        <div class="space-y-2">
          <div v-for="modality in ['Presencial', 'Virtual', 'Híbrida']" :key="modality" class="flex justify-between">
            <span>{{ modality }}:</span>
            <span class="font-semibold">{{ careerStore.careersByModality(modality).length }}</span>
          </div>
        </div>
      </UCard>

      <!-- Careers by Sede -->
      <UCard>
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold">Carreras por Sede</h3>
            <UIcon name="i-heroicons-building-office" class="text-primary-500" />
          </div>
        </template>
        <div class="space-y-2">
          <div v-for="sede in ['Principal', 'Norte', 'Sur', 'Oriente']" :key="sede" class="flex justify-between">
            <span>{{ sede }}:</span>
            <span class="font-semibold">{{ careerStore.careersBySede(sede).length }}</span>
          </div>
        </div>
      </UCard>
    </div>

    <!-- Recent Careers Table -->
    <div class="mt-8">
      <UCard>
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold">Carreras Recientes</h3>
            <UButton
              to="/carreras"
              color="primary"
              variant="ghost"
              icon="i-heroicons-arrow-right"
            >
              Ver todas
            </UButton>
          </div>
        </template>
        
        <UTable
          :rows="careerStore.sortedCareers.slice(0, 5)"
          :columns="[
            { id: 'name', key: 'name', label: 'Nombre' },
            { id: 'ces', key: 'ces', label: 'CES' },
            { id: 'modality', key: 'modality', label: 'Modalidad' },
            { id: 'sede', key: 'sede', label: 'Sede' }
          ]"
        />
      </UCard>
    </div>
  </div>
</template> 