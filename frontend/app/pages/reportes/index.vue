<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useProfessorStore } from '~/stores/professor'
import CustomTable from '~/components/tables/CustomTable.vue'

definePageMeta({
  layout: 'dashboard'
})

const professorStore = useProfessorStore()
const showClaustroReport = ref(false)
const claustroData = ref([])
const isReady = ref(false)

const columns = [
  { accessorKey: 'categoria', header: 'Categoría' },
  { accessorKey: 'cantidad', header: 'Cantidad' }
]

const loadClaustroData = async () => {
  await professorStore.fetchProfessors()
  
  const professors = professorStore.professors
  
  // Contar profesores por categoría usando categoriaDocente
  const titulares = professors.filter(p => p.categoriaDocente === 'TITULAR').length
  const auxiliares = professors.filter(p => p.categoriaDocente === 'AUXILIAR').length
  const asistentes = professors.filter(p => p.categoriaDocente === 'ASISTENTE').length
  const adiestrados = professors.filter(p => p.categoriaDocente === 'AD').length
  const atd = professors.filter(p => p.categoriaDocente === 'ATD').length
  const instructores = professors.filter(p => p.categoriaDocente === 'INSTRUCTOR').length
  
  // Cálculos
  const totalClaustro = titulares + auxiliares + asistentes + adiestrados + atd + instructores
  const totalTitularesAuxiliares = titulares + auxiliares
  const porcentajeTitularesAuxiliares = totalClaustro > 0 ? ((totalTitularesAuxiliares / totalClaustro) * 100).toFixed(1) : 0
  
  claustroData.value = [
    { categoria: 'Profesores Titulares', cantidad: Number(titulares) },
    { categoria: 'Profesores Auxiliares', cantidad: Number(auxiliares) },
    { categoria: 'Profesores Asistentes', cantidad: Number(asistentes) },
    { categoria: 'Profesores Adiestrados', cantidad: Number(adiestrados) },
    { categoria: 'Profesores ATD', cantidad: Number(atd) },
    { categoria: 'Profesores Instructores', cantidad: Number(instructores) },
    { categoria: 'Total del Claustro', cantidad: Number(totalClaustro) },
    { categoria: 'Total Titulares y Auxiliares', cantidad: Number(totalTitularesAuxiliares) },
    { categoria: 'Porcentaje Titulares y Auxiliares', cantidad: Number(porcentajeTitularesAuxiliares) }
  ]
  isReady.value = true
  console.log('claustroData:', claustroData.value)
}

const claustroTableData = computed(() => {
  return Array.isArray(claustroData.value) ? claustroData.value.map(obj => ({ ...obj })) : []
})

onMounted(() => {
  loadClaustroData()
})
</script>

<template>
  <div>
    <UCard>
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">Reportes</h2>
        </div>
      </template>
      
      <!-- Reporte de Claustro -->
      <div class="mb-6">
        <UButton
          @click="showClaustroReport = !showClaustroReport"
          variant="ghost"
          class="w-full flex justify-between items-center text-left"
        >
          <span class="font-semibold">Reporte de Claustro</span>
          <span :class="'ml-2 ' + (showClaustroReport ? 'i-heroicons-chevron-up' : 'i-heroicons-chevron-down')" />
        </UButton>
        <Transition
          enter-active-class="transition ease-out duration-200"
          enter-from-class="opacity-0 transform scale-95"
          enter-to-class="opacity-100 transform scale-100"
          leave-active-class="transition ease-in duration-150"
          leave-from-class="opacity-100 transform scale-100"
          leave-to-class="opacity-0 transform scale-95"
        >
          <div v-if="showClaustroReport" class="mt-4">
            <CustomTable
              v-if="isReady"
              title="Reporte de Claustro"
              :data="claustroTableData"
              :columns="columns"
              empty-text="No hay datos para el reporte de claustro"
              :loading="professorStore.isLoading"
              :pageSize="20"
            />
          </div>
        </Transition>
      </div>
    </UCard>
  </div>
</template> 