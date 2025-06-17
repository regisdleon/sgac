<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'
import CustomTable from '~/components/tables/CustomTable.vue'
import { h, resolveComponent } from "vue";
import { usePublicationStore } from "~/pages/publicaciones/store";
import type { Publication } from "~/models/Publication";
import ConfirmDeleteModal from "~/components/modals/ConfirmDeleteModal.vue";

const UButton = resolveComponent( 'UButton' )
definePageMeta( { layout : 'dashboard' } )

const router = useRouter()
const toast = useToast()
const showConfirmModal = ref( false )
const publicationStore = usePublicationStore()

function onShowConfirmModalUpdate( value : boolean ) {
  showConfirmModal.value = value
}


onMounted( async () => {
  await publicationStore.fetchPublications()
} )

const columns : TableColumn<Publication>[] = [
  { accessorKey : 'anno', header : 'Año' },
  { accessorKey : 'titulo', header : 'Título' },
  { accessorKey : 'revista_editorial', header : 'Revista/Editorial' },
  { accessorKey : 'tipo_publicacion', header : 'Tipo de Publicación' },
  { accessorKey : 'isbn_issn', header : 'ISBN/ISSN' },
  { accessorKey : 'base_datos_revista', header : 'Base de Datos' },
  { accessorKey : 'nivel', header : 'Nivel' },
  { accessorKey : 'clasificacion', header : 'Clasificación', cell: ({ row }) => h('span', publicationStore.getClassificationNameById(row.original.clasificacion)) },
  {
    id : 'action',
    header : () => h( 'div', { class : 'flex justify-end flex-row pr-8' }, 'Acciones' ),
    cell : ( { row } ) =>
        h( 'div', { class : 'flex gap-2 justify-end flex-row' }, [
          h( UButton, {
            color : 'neutral',
            size : 'xs',
            onClick : () => {
              publicationStore.currentPublication = row.original
              router.push( '/publicaciones/actualizar-publicacion' )
            }
          }, { default : () => 'Editar' } ),

          h( UButton, {
            color : 'error',
            size : 'xs',
            onClick : () => {
              publicationStore.currentPublication = row.original
              showConfirmModal.value = true
            }
          }, { default : () => 'Eliminar' } )

        ] )
  }
]

const deletePublication = async () => {
  if ( !publicationStore.currentPublication?.id ) return

  try {
    const success = await publicationStore.deletePublication( publicationStore.currentPublication.id )
    if ( success ) {
      console.log( success )
      toast.add( {
        title : `Publicación eliminada`,
        color : 'success',
        icon: 'i-heroicons-check-circle-20-solid'
      } )
    }
  } catch ( e ) {
    toast.add( {
      title : `Error al eliminar`,
      color : 'error',
      icon: 'i-heroicons-exclamation-circle-20-solid'
    } )
  } finally {
    showConfirmModal.value = false
    publicationStore.currentPublication = null
  }
}
</script>

<template>
  <CustomTable
      title="Publicaciones"
      :data="publicationStore.publications || []"
      :columns="columns"
      :error="publicationStore.error"
      empty-text="No hay publicaciones registrados"
      :loading="publicationStore.isLoading"
      icon="i-heroicons-magnifying-glass-20-solid"
  >
    <template #register-button>
      <UButton @click="router.push('/publicaciones/registrar-publicacion/')" icon="i-heroicons-plus-20-solid">Registrar publicación</UButton>
    </template>
  </CustomTable>
  <ConfirmDeleteModal :open="showConfirmModal" :item="publicationStore.currentPublication?.title || ''"
                      @update:open="onShowConfirmModalUpdate" @deleted="deletePublication"/>

</template>
