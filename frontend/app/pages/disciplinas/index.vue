<script setup lang="ts">
import { ref, onMounted, watch, h, resolveComponent, computed } from 'vue'
import { useDisciplineStore } from '~/pages/disciplinas/store'
import { useCareerStore } from '~/stores/career'
import type { Discipline } from '~/types/discipline'
import type { Career } from '~/types/career'
import CustomTable from '~/components/tables/CustomTable.vue'
import { useRouter } from 'vue-router'
import ConfirmDeleteModal from "~/components/modals/ConfirmDeleteModal.vue"

const router = useRouter()
const disciplineStore = useDisciplineStore()
const careerStore = useCareerStore()

definePageMeta({ layout: 'dashboard' })

// Estado local
const selectedCareer = ref<Career | null>(null)
const disciplines = ref<Discipline[]>([])
const loading = ref(false)
const error = ref<string | null>(null)
const showConfirmModal = ref(false)

// Computed property for career options
const careerOptions = computed(() => {
  return careerStore.careers.map(career => ({
    label: career.nombre,
    value: career
  }))
})

// Columnas de la tabla
const columns = [
  {
    id: 'codigo',
    accessorKey: 'codigo',
    header: 'Código',
    sortable: true
  },
  {
    id: 'nombre',
    accessorKey: 'nombre',
    header: 'Nombre',
    sortable: true
  },
  {
    id: 'carrera',
    accessorKey: 'carrera',
    header: 'Carrera',
    sortable: true,
    cell: ({ row }) => formatCareerCell(row.original)
  },
  {
    id: 'action',
    header: () => h('div', { class: 'flex justify-end flex-row pr-8' }, 'Acciones'),
    cell: ({ row }) => h('div', { class: 'flex gap-2 justify-end flex-row' }, [
      h(resolveComponent('UButton'), {
        color: 'neutral',
        size: 'xs',
        onClick: () => {
          disciplineStore.currentDiscipline = row.original;
          router.push({
            path: '/disciplinas/actualizar-disciplina',
            query: { carreraId: row.original.carrera.id, id: row.original.id }
          });
        }
      }, { default: () => 'Editar' }),
      h(resolveComponent('UButton'), {
        color: 'error',
        size: 'xs',
        onClick: () => {
          disciplineStore.currentDiscipline = row.original;
          showConfirmModal.value = true;
        }
      }, { default: () => 'Eliminar' })
    ])
  }
]

// Cargar carreras al montar el componente
onMounted(async () => {
  try {
    console.log('Fetching careers...');
    await careerStore.fetchCareers()
    console.log('Careers after fetch:', careerStore.careers);
  } catch (err) {
    console.error('Error al cargar carreras:', err)
  }
})

// Observar cambios en la carrera seleccionada
watch(selectedCareer, async (newCareer) => {
  console.log('Selected career changed:', newCareer);
  if (newCareer) {
    loading.value = true
    error.value = null
    try {
      await disciplineStore.fetchDisciplines(newCareer.id)
      disciplines.value = disciplineStore.disciplines
      console.log('Disciplinas cargadas:', disciplines.value)
    } catch (err) {
      console.error('Error al cargar disciplinas:', err)
      error.value = 'Error al cargar las disciplinas'
    } finally {
      loading.value = false
    }
  } else {
    disciplines.value = []
  }
})

// Observar cambios en las disciplinas del store
watch(() => disciplineStore.disciplines, (newDisciplines) => {
  disciplines.value = newDisciplines
  console.log('Disciplinas en index.vue actualizadas:', disciplines.value)
}, { deep: true })

// Función para formatear la celda de carrera
const formatCareerCell = (row: Discipline) => {
  return row.carrera?.nombre || 'No asignada'
}

// Re-add full delete logic
function onDeleteConfirmed() {
  deleteDiscipline()
}

function onShowConfirmModalUpdate(value: boolean) {
  showConfirmModal.value = value
  if (!value) {
    disciplineStore.currentDiscipline = null
  }
}

const deleteDiscipline = async () => {
  if (!disciplineStore.currentDiscipline?.id) return

  try {
    const carreraId = disciplineStore.currentDiscipline.carrera.id;
    const success = await disciplineStore.deleteDiscipline(disciplineStore.currentDiscipline.id, carreraId);
    if (success) {
      // toast.add({
      //   title: 'Disciplina eliminada correctamente',
      //   color: 'success',
      // })
    }
  } catch (e) {
    // toast.add({
    //   title: 'Error al eliminar la disciplina',
    //   color: 'error',
    // })
  } finally {
    showConfirmModal.value = false
    disciplineStore.currentDiscipline = null
  }
}
</script>

<template>
  <UCard>
    <template #header>
      <div class="flex justify-between items-center">
        <h2 class="text-xl font-semibold">Disciplinas</h2>
        <UButton
            label="Nueva disciplina"
            @click="router.push('/disciplinas/registrar-disciplina/' + (selectedCareer ? `?carreraId=${selectedCareer.id}` : ''))"
        />
      </div>
    </template>

    <div class="flex flex-col gap-4">
      <!-- Selector de Carrera -->
      <div class="w-full max-w-md">
        <UFormGroup label="Carrera">
          <USelect
              v-model="selectedCareer"
              :items="careerOptions"
              item-attribute="label"
              value-attribute="value"
              placeholder="Seleccione una carrera"
              :loading="careerStore.isLoading"
              class="w-full"
          />
        </UFormGroup>
      </div>

      <!-- Tabla de Disciplinas -->
      <CustomTable
          :data="disciplines"
          :columns="columns"
          :loading="loading"
          :error="error"
          title="Listado de Disciplinas"
          empty-text="No hay disciplinas registradas para la carrera seleccionada"
      />
    </div>

    <ConfirmDeleteModal
        :open="showConfirmModal"
        :item="disciplineStore.currentDiscipline?.nombre || ''"
        @update:open="onShowConfirmModalUpdate"
        @deleted="onDeleteConfirmed"
    />
  </UCard>
</template>