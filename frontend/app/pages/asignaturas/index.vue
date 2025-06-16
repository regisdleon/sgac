<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'
import CustomTable from '~/components/tables/CustomTable.vue'
import { h, resolveComponent } from "vue";
import type { Subject } from "~/models/Subject";
import { useSubjectStore } from "~/pages/asignaturas/store";
import ConfirmDeleteModal from "~/components/modals/ConfirmDeleteModal.vue";

const UButton = resolveComponent( 'UButton' )
definePageMeta( { layout : 'dashboard' } )

const toast = useToast()
const router = useRouter()
const subjectStore = useSubjectStore()


const showConfirmModal = ref( false )

function onShowConfirmModalUpdate( value : boolean ) {
  showConfirmModal.value = value
}


onMounted( async () => {
  await subjectStore.fetchSubjects()
  console.log('Fetched subjects:', subjectStore.subjects);
} )

const columns : TableColumn<Subject>[] = [
  { accessorKey: 'codigo', header: 'Código' },
  { accessorKey: 'nombre', header: 'Nombre' },
  { accessorKey: 'anno', header: 'Año' },
  { accessorKey: 'semestre', header: 'Semestre' },
  {
    accessorKey: 'modalidad',
    header: 'Modalidad',
    cell: ({ row }) => h('span', row.original.modalidad || 'N/A')
  },
  {
    accessorKey: 'curriculo',
    header: 'Currículo',
    cell: ({ row }) => h('span', row.original.curriculo || 'N/A')
  },
  {
    accessorKey: 'disciplina',
    header: 'Disciplina',
    cell: ({ row }) => h('span', row.original.disciplina?.nombre || row.original.disciplina)
  },
  {
    id: 'action',
    header: () => h('div', { class: 'flex justify-end flex-row pr-8' }, 'Acciones'),
    cell: ({ row }) => h('div', { class: 'flex gap-2 justify-end flex-row' }, [
      h(UButton, {
        color: 'neutral',
        size: 'xs',
        onClick: () => {
          subjectStore.currentSubject = row.original
          router.push( '/asignaturas/actualizar-asignatura' )
        }
      }, { default: () => 'Editar' }),
      h(UButton, {
        color: 'error',
        size: 'xs',
        onClick: () => {
          subjectStore.currentSubject = row.original
          showConfirmModal.value = true
        }
      }, { default: () => 'Eliminar' })
    ])
  }
]

const deleteSubject = async () => {
  if ( !subjectStore.currentSubject?.id ) return

  try {
    const success = await subjectStore.deleteSubject( subjectStore.currentSubject )
    if ( success ) {
      toast.add( {
        title : 'Asignatura eliminada correctamente',
        color : 'success',
      } )
    }
  } catch ( e ) {
    toast.add( {
      title : 'Error al eliminar la asignatura',
      color : 'error',
    } )
  } finally {
    showConfirmModal.value = false
    subjectStore.currentSubject = null
  }
}


</script>

<template>
  <CustomTable
      title="Profesores"
      :data="subjectStore.subjects || []"
      :columns="columns"
      :error="subjectStore.error"
      empty-text="No hay profesores registrados"
      :loading="subjectStore.isLoading"
  >
    <template #register-button>
      <UButton @click="router.push('/asignaturas/registrar-asignatura/')">Registrar asignatura</UButton>
    </template>
  </CustomTable>
  <ConfirmDeleteModal
      :open="showConfirmModal"
      :item="subjectStore.currentSubject?.name || ''"
      @update:open="onShowConfirmModalUpdate"
      @deleted="deleteSubject"
  />
</template>
