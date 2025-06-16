<script setup lang="ts">
import { h, resolveComponent } from 'vue'
import type { TableColumn } from '@nuxt/ui'
import type { Career } from "~/models/Career"
import CustomTable from "~/components/tables/CustomTable.vue"
import ConfirmDeleteModal from "~/components/modals/ConfirmDeleteModal.vue"
import { useCareerStore } from "~/stores/career"

definePageMeta({
  layout: 'dashboard'
})

const toast = useToast()
const careerStore = useCareerStore()
const router = useRouter()
const openModal = ref(false)
const UButton = resolveComponent('UButton')
const showDeleteModal = ref(false)
const isDeleting = ref(false)

// Cargar carreras al montar el componente
onMounted(async () => {
  await careerStore.fetchCareers()
})

watchEffect(() => {
  console.log('Carreras cargadas:', careerStore.careers)
})

const getModalidadColor = (modalidad: string) => {
  switch (modalidad) {
    case 'CURSO_DIURNO':
      return 'blue'
    case 'CURSO_A_DISTANCIA':
      return 'green'
    case 'CURSO_POR_ENCUENTRO':
      return 'purple'
    default:
      return 'gray'
  }
}

const getModalidadLabel = (modalidad: string) => {
  switch (modalidad) {
    case 'CURSO_DIURNO':
      return 'Curso Diurno'
    case 'CURSO_A_DISTANCIA':
      return 'Curso a Distancia'
    case 'CURSO_POR_ENCUENTRO':
      return 'Curso por Encuentro'
    default:
      return modalidad
  }
}

const confirmDelete = (career: Career) => {
  careerStore.currentCareer = career
  showDeleteModal.value = true
}

const handleDelete = async () => {
  if (!careerStore.currentCareer) return
  isDeleting.value = true
  console.log('Attempting to delete career:', careerStore.currentCareer.id)
  try {
    const success = await careerStore.deleteCareer(careerStore.currentCareer.id)
    if (success) {
      toast.add({
        title: 'Carrera eliminada correctamente',
        color: 'success',
      })
    }
  } catch (e) {
    toast.add({
      title: 'Error al eliminar la carrera',
      color: 'error',
    })
  } finally {
    isDeleting.value = false
    showDeleteModal.value = false
    careerStore.currentCareer = null
  }
}

const columns: TableColumn<Career>[] = [
  { accessorKey: 'nombre', header: 'Nombre' },
  { accessorKey: 'modalidad', header: 'Modalidad' },
  { accessorKey: 'sede', header: 'Sede' },
  { accessorKey: 'anno_eval_ext', header: 'Año Evaluación' },
  { accessorKey: 'curso_evaluado', header: 'Curso Evaluado' },
  { accessorKey: 'numero_eval_ext', header: 'Número Evaluación' },
  {
    id: 'action',
    header: () => h('div', { class: 'flex justify-end flex-row pr-8' }, 'Acciones'),
    cell: ({ row }) => h('div', { class: 'flex gap-2 justify-end flex-row' }, [
      h(UButton, {
        color: 'neutral',
        size: 'xs',
        onClick: () => {
          careerStore.currentCareer = row.original
          router.push('/carreras/actualizar-carrera')
        }
      }, { default: () => 'Editar' }),
      h(UButton, {
        color: 'error',
        size: 'xs',
        onClick: () => {
          careerStore.currentCareer = row.original
          showDeleteModal.value = true
        }
      }, { default: () => 'Eliminar' })
    ])
  }
]
</script>

<template>
  <div>
    <UCard>
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">Carreras</h2>
        </div>
      </template>
      <CustomTable
        title="Carreras"
        :data="careerStore.careers"
        :columns="columns"
        :error="careerStore.error"
        empty-text="No hay carreras registradas"
        :loading="careerStore.isLoading"
      >
        <template #register-button>
          <UButton @click="router.push('/carreras/registrar-carrera')">Registrar Carrera</UButton>
        </template>
      </CustomTable>
    </UCard>

    <ConfirmDeleteModal
      :open="showDeleteModal"
      :item="careerStore.currentCareer?.nombre || ''"
      @update:open="(value) => { showDeleteModal = value; if (!value) careerStore.clearCurrentCareer() }"
      @deleted="handleDelete"
      :loading="isDeleting"
    />
  </div>
</template>
