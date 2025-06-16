<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'
import CustomTable from '~/components/tables/CustomTable.vue'
import type { Professors } from "~/models/Professors";
import { h, resolveComponent } from "vue";
import { useProfessorStore } from "~/pages/profesores/store";

const UButton = resolveComponent( 'UButton' )
definePageMeta( { layout : 'dashboard' } )

const router = useRouter()
const showConfirmModal = ref( false )
const professorsStore = useProfessorStore()


onMounted( async () => {
  await professorsStore.fetchProfessors()
} )

const columns : TableColumn<Professors>[] = [
  {
    accessorKey : 'name',
    header : 'Nombre completo',
    cell : ( { row } ) =>
        `${ row.original.name } ${ row.original.lastName } ${ row.original.secondLastName }`
  },
  { accessorKey : 'categoryDegree', header : 'Categoría Docente' },
  { accessorKey : 'scientificCategory', header : 'Categoría Científica' },
  { accessorKey : 'scientificDegree', header : 'Grado Científico' },
  {
    accessorKey : 'contacts.phones',
    header : 'Teléfonos',
    cell : ( { row } ) => row.original.contacts.phones.join( ', ' )
  },
  {
    accessorKey : 'contacts.emails',
    header : 'Correos',
    cell : ( { row } ) => row.original.contacts.emails.join( ', ' )
  },
  {
    id : 'action',
    header : () => h( 'div', { class : 'flex justify-end flex-row pr-8' }, 'Acciones' ),
    cell : ( { row } ) =>
        h( 'div', { class : 'flex gap-2 justify-end flex-row' }, [
          h( UButton, {
            color : 'primary',
            size : 'xs',
            onClick : () => {
              professorsStore.currentProfessor = row.original
              router.push( '/profesores/actualizar-profesor' )
            }
          }, { default : () => 'Editar' } ),

          h( UButton, {
            color : 'error',
            size : 'xs',
            onClick : () => {
              professorsStore.currentProfessor = row.original
              showConfirmModal.value = true
            }
          }, { default : () => 'Eliminar' } )

        ] )
  }
]
</script>

<template>
  <CustomTable
      title="Profesores"
      :data="professorsStore.professors || []"
      :columns="columns"
      :error="professorsStore.error"
      empty-text="No hay profesores registrados"
      :loading="professorsStore.isLoading"
  >
    <template #register-button>
      <UButton @click="router.push('/profesores/registrar-profesor/')">Registrar profesor</UButton>
    </template>
  </CustomTable>
</template>
