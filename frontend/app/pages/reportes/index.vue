<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { useProfessorStore } from '~/stores/professor'
import CustomTable from '~/components/tables/CustomTable.vue'
import { usePublicationStore } from '~/pages/publicaciones/store'
import { useEventStore } from '~/pages/eventos/store'

definePageMeta({
  layout: 'dashboard'
})

const professorStore = useProfessorStore()
const showClaustroReport = ref(false)
const claustroData = ref([])
const isReady = ref(false)
const showExperienciaReport = ref(false)
const experienciaData = ref([])
const showGradosReport = ref(false)
const gradosData = ref([])
const showPublicacionesReport = ref(false)
const publicacionesData = ref([])
const showPonenciasReport = ref(false)
const ponenciasData = ref([])
const ponenciasColumns = [
  { accessorKey: 'clasificacion', header: 'CLASIFICACIÓN' },
  { accessorKey: '2021', header: '2021' },
  { accessorKey: '2022', header: '2022' },
  { accessorKey: '2023', header: '2023' },
  { accessorKey: '2024', header: '2024' },
  { accessorKey: '2025', header: '2025' },
  { accessorKey: 'total', header: 'TOTAL' },
]
console.log('ponenciasColumns:', ponenciasColumns)

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

const loadExperienciaData = () => {
  const professors = professorStore.professors
  const totalProfessors = professors.length
  const totalExpMes = professors.reduce((sum, p) => sum + (Number(p.annosExperienciaMes) || 0), 0)
  const avgExpMes = totalProfessors > 0 ? (totalExpMes / totalProfessors).toFixed(2) : 0
  const profs10Plus = professors.filter(p => Number(p.annosExperienciaMes) >= 10)
  const totalProfs10Plus = profs10Plus.length
  const avgExpMes10Plus = totalProfs10Plus > 0 ? (profs10Plus.reduce((sum, p) => sum + (Number(p.annosExperienciaMes) || 0), 0) / totalProfs10Plus).toFixed(2) : 0
  const porcentajeProfs10Plus = totalProfessors > 0 ? ((totalProfs10Plus / totalProfessors) * 100).toFixed(2) + '%' : '0%'
  experienciaData.value = [
    { descripcion: 'Experiencia del claustro', valor: avgExpMes },
    { descripcion: 'Total de profesores con más de 10 años de experiencia', valor: totalProfs10Plus },
    { descripcion: 'Porcentaje de profesores con más de 10 años de experiencia', valor: porcentajeProfs10Plus }
  ]
}

watch(isReady, (ready) => {
  if (ready) loadExperienciaData()
})

const experienciaTableData = computed(() => {
  return Array.isArray(experienciaData.value) ? experienciaData.value.map(obj => ({ ...obj })) : []
})

const experienciaColumns = [
  { accessorKey: 'descripcion', header: 'Descripción' },
  { accessorKey: 'valor', header: 'Valor' }
]

const loadGradosData = () => {
  const professors = professorStore.professors
  const totalClaustro = professors.length
  const doctores = professors.filter(p => p.gradoCientifico === 'DOCTOR')
  const totalDoctores = doctores.length
  const drAfin = doctores.filter(p => p.drEspecialidadAfin === 'SI')
  const totalDrAfin = drAfin.length
  const masters = professors.filter(p => p.gradoCientifico === 'MASTER')
  const totalMasters = masters.length
  const porcentajeDoctores = totalClaustro > 0 ? ((totalDoctores / totalClaustro) * 100).toFixed(2) + '%' : '0%'
  const porcentajeDrAfin = totalDoctores > 0 ? ((totalDrAfin / totalDoctores) * 100).toFixed(2) + '%' : '0%'
  const porcentajeMasters = totalClaustro > 0 ? ((totalMasters / totalClaustro) * 100).toFixed(2) + '%' : '0%'
  gradosData.value = [
    { grado: 'Dr.C', total: totalDoctores, porcentaje: porcentajeDoctores },
    { grado: 'Dr.C con especialidad afín', total: totalDrAfin, porcentaje: porcentajeDrAfin },
    { grado: 'Master en Ciencias', total: totalMasters, porcentaje: porcentajeMasters }
  ]
}

watch(isReady, (ready) => {
  if (ready) loadGradosData()
})

const gradosTableData = computed(() => {
  return Array.isArray(gradosData.value) ? gradosData.value.map(obj => ({ ...obj })) : []
})

const gradosColumns = [
  { accessorKey: 'grado', header: 'Grado científico' },
  { accessorKey: 'total', header: 'Total' },
  { accessorKey: 'porcentaje', header: '%' }
]

const publicacionesColumns = [
  { accessorKey: 'clasificacion', header: 'CLASIFICACIÓN' },
  { accessorKey: '2021', header: '2021' },
  { accessorKey: '2022', header: '2022' },
  { accessorKey: '2023', header: '2023' },
  { accessorKey: '2024', header: '2024' },
  { accessorKey: '2025', header: '2025' },
  { accessorKey: 'total', header: 'TOTAL' },
]

const publicationStore = usePublicationStore()

const loadPublicacionesData = async () => {
  await publicationStore.fetchPublications()
  const pubs = publicationStore.publications
  const years = [2021, 2022, 2023, 2024, 2025]
  // Inicializar estructura
  const rows = [
    { key: 'grupo1', label: 'ARTÍCULO GRUPO I', match: p => p.tipoPublicacion === 'articulo' && p.nivel === 1 },
    { key: 'grupo2', label: 'ARTÍCULO GRUPO II', match: p => p.tipoPublicacion === 'articulo' && p.nivel === 2 },
    { key: 'grupo3', label: 'ARTÍCULO GRUPO III', match: p => p.tipoPublicacion === 'articulo' && p.nivel === 3 },
    { key: 'grupo4', label: 'ARTÍCULO GRUPO IV', match: p => p.tipoPublicacion === 'articulo' && p.nivel === 4 },
    { key: 'sin_grupo', label: 'ARTÍCULO SIN GRUPO', match: p => p.tipoPublicacion === 'articulo' && (!p.nivel || p.nivel < 1 || p.nivel > 4) },
    { key: 'libro', label: 'LIBRO', match: p => p.tipoPublicacion === 'libro' },
    { key: 'capitulo_libro', label: 'CAPÍTULO DE LIBRO', match: p => p.tipoPublicacion === 'capitulo_libro' },
    { key: 'patente', label: 'PATENTES', match: p => p.tipoPublicacion === 'patente' },
    { key: 'libro_digital', label: 'LIBRO DIGITAL', match: p => p.tipoPublicacion === 'libro_digital' },
    { key: 'texto_carrera', label: 'TEXTO DE LA CARRERA', match: p => p.tipoPublicacion === 'texto_carrera' },
    { key: 'material_docente', label: 'MAT. DOCENTE INTERNO', match: p => p.tipoPublicacion === 'material_docente' },
  ]
  // Calcular conteos por fila y año
  const data = rows.map(row => {
    const counts = years.map(y => pubs.filter(p => row.match(p) && p.anno === y).length)
    const total = counts.reduce((a, b) => a + b, 0)
    return {
      clasificacion: row.label,
      '2021': counts[0],
      '2022': counts[1],
      '2023': counts[2],
      '2024': counts[3],
      '2025': counts[4],
      total
    }
  })
  // Filas especiales
  const grupos1a4_libros_patentes = {
    clasificacion: 'GRUPOS 1 AL 4, LIBROS Y PATENTES',
    ...years.reduce((acc, y, i) => {
      acc[y] = data[0][y] + data[1][y] + data[2][y] + data[3][y] + data[5][y] + data[6][y] + data[7][y] + data[8][y] + data[9][y] + data[10][y]
      return acc
    }, {}),
    total: data[0].total + data[1].total + data[2].total + data[3].total + data[5].total + data[6].total + data[7].total + data[8].total + data[9].total + data[10].total
  }
  const grupos1y2 = {
    clasificacion: 'GRUPOS 1 Y 2',
    ...years.reduce((acc, y) => {
      acc[y] = data[0][y] + data[1][y]
      return acc
    }, {}),
    total: data[0].total + data[1].total
  }
  const totalRow = {
    clasificacion: 'TOTAL',
    ...years.reduce((acc, y) => {
      acc[y] = data.reduce((sum, row) => sum + row[y], 0)
      return acc
    }, {}),
    total: data.reduce((sum, row) => sum + row.total, 0)
  }
  publicacionesData.value = [...data, grupos1a4_libros_patentes, grupos1y2, totalRow]
}

const eventStore = useEventStore()

const loadPonenciasData = async () => {
  await eventStore.fetchEvents()
  const events = eventStore.events
  const years = [2021, 2022, 2023, 2024, 2025]
  // Inicializar estructura
  const rows = [
    { key: 'INTERNACIONAL', label: 'INTERNACIONAL', match: e => e.clasificacion === 'INTERNACIONAL' },
    { key: 'NACIONAL', label: 'NACIONAL', match: e => e.clasificacion === 'NACIONAL' },
    { key: 'PROVINCIAL', label: 'PROVINCIAL', match: e => e.clasificacion === 'PROVINCIAL' },
    { key: 'MUNICIPAL', label: 'MUNICIPAL', match: e => e.clasificacion === 'MUNICIPAL' },
    { key: 'DE_BASE', label: 'DE BASE', match: e => e.clasificacion === 'DE_BASE' },
  ]
  // Calcular conteos por fila y año
  const data = rows.map(row => {
    const counts = years.map(y => events.filter(e => row.match(e) && e.anno === y).length)
    const total = counts.reduce((a, b) => a + b, 0)
    return {
      clasificacion: row.label,
      '2021': counts[0],
      '2022': counts[1],
      '2023': counts[2],
      '2024': counts[3],
      '2025': counts[4],
      total
    }
  })
  // Filas especiales
  const nacionalInternacional = {
    clasificacion: 'NACIONAL E INTERNACIONAL',
    ...years.reduce((acc, y) => {
      acc[y] = data[0][y] + data[1][y]
      return acc
    }, {}),
    total: data[0].total + data[1].total
  }
  const totalRow = {
    clasificacion: 'TOTAL',
    ...years.reduce((acc, y) => {
      acc[y] = data.reduce((sum, row) => sum + row[y], 0)
      return acc
    }, {}),
    total: data.reduce((sum, row) => sum + row.total, 0)
  }
  ponenciasData.value = [...data, nacionalInternacional, totalRow]
}

onMounted(() => {
  loadClaustroData()
  loadPublicacionesData()
  loadPonenciasData()
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

      <!-- Reporte de Experiencia del Claustro -->
      <div class="mb-6">
        <UButton
          @click="showExperienciaReport = !showExperienciaReport"
          variant="ghost"
          class="w-full flex justify-between items-center text-left"
        >
          <span class="font-semibold">Experiencia del claustro</span>
          <span :class="'ml-2 ' + (showExperienciaReport ? 'i-heroicons-chevron-up' : 'i-heroicons-chevron-down')" />
        </UButton>
        <Transition
          enter-active-class="transition ease-out duration-200"
          enter-from-class="opacity-0 transform scale-95"
          enter-to-class="opacity-100 transform scale-100"
          leave-active-class="transition ease-in duration-150"
          leave-from-class="opacity-100 transform scale-100"
          leave-to-class="opacity-0 transform scale-95"
        >
          <div v-if="showExperienciaReport" class="mt-4">
            <CustomTable
              v-if="isReady"
              title="Experiencia del claustro"
              :data="experienciaTableData"
              :columns="experienciaColumns"
              empty-text="No hay datos para el reporte de experiencia"
              :loading="professorStore.isLoading"
              :pageSize="10"
            />
          </div>
        </Transition>
      </div>

      <!-- Reporte de Grados Científicos -->
      <div class="mb-6">
        <UButton
          @click="showGradosReport = !showGradosReport"
          variant="ghost"
          class="w-full flex justify-between items-center text-left"
        >
          <span class="font-semibold">Reporte de grados científicos</span>
          <span :class="'ml-2 ' + (showGradosReport ? 'i-heroicons-chevron-up' : 'i-heroicons-chevron-down')" />
        </UButton>
        <Transition
          enter-active-class="transition ease-out duration-200"
          enter-from-class="opacity-0 transform scale-95"
          enter-to-class="opacity-100 transform scale-100"
          leave-active-class="transition ease-in duration-150"
          leave-from-class="opacity-100 transform scale-100"
          leave-to-class="opacity-0 transform scale-95"
        >
          <div v-if="showGradosReport" class="mt-4">
            <CustomTable
              v-if="isReady"
              title="Reporte de grados científicos"
              :data="gradosTableData"
              :columns="gradosColumns"
              empty-text="No hay datos para el reporte de grados científicos"
              :loading="professorStore.isLoading"
              :pageSize="10"
            />
          </div>
        </Transition>
      </div>

      <!-- Reporte de Publicaciones -->
      <div class="mb-6">
        <UButton
          @click="showPublicacionesReport = !showPublicacionesReport"
          variant="ghost"
          class="w-full flex justify-between items-center text-left"
        >
          <span class="font-semibold">Reporte de Publicaciones</span>
          <span :class="'ml-2 ' + (showPublicacionesReport ? 'i-heroicons-chevron-up' : 'i-heroicons-chevron-down')" />
        </UButton>
        <Transition
          enter-active-class="transition ease-out duration-200"
          enter-from-class="opacity-0 transform scale-95"
          enter-to-class="opacity-100 transform scale-100"
          leave-active-class="transition ease-in duration-150"
          leave-from-class="opacity-100 transform scale-100"
          leave-to-class="opacity-0 transform scale-95"
        >
          <div v-if="showPublicacionesReport" class="mt-4">
            <CustomTable
              :title="'Reporte de Publicaciones'"
              :data="publicacionesData"
              :columns="publicacionesColumns"
              empty-text="No hay datos para el reporte de publicaciones"
              :loading="publicationStore.isLoading"
              :pageSize="20"
            />
          </div>
        </Transition>
      </div>

      <!-- Reporte de Presentación de Ponencias en Eventos -->
      <div class="mb-6">
        <UButton
          @click="showPonenciasReport = !showPonenciasReport"
          variant="ghost"
          class="w-full flex justify-between items-center text-left"
        >
          <span class="font-semibold">Presentación de ponencias en eventos</span>
          <span :class="'ml-2 ' + (showPonenciasReport ? 'i-heroicons-chevron-up' : 'i-heroicons-chevron-down')" />
        </UButton>
        <Transition
          enter-active-class="transition ease-out duration-200"
          enter-from-class="opacity-0 transform scale-95"
          enter-to-class="opacity-100 transform scale-100"
          leave-active-class="transition ease-in duration-150"
          leave-from-class="opacity-100 transform scale-100"
          leave-to-class="opacity-0 transform scale-95"
        >
          <div v-if="showPonenciasReport" class="mt-4">
            <CustomTable
              :title="'Presentación de ponencias en eventos'"
              :data="ponenciasData"
              :columns="ponenciasColumns"
              empty-text="No hay datos para el reporte de ponencias en eventos"
              :loading="eventStore.isLoading"
              :pageSize="20"
            />
          </div>
        </Transition>
      </div>
    </UCard>
  </div>
</template> 