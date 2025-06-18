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
  { 
    accessorKey: 'anno', 
    header: 'Año',
    cell: ({ row }) => row.original.anno || 'N/A'
  },
  { 
    accessorKey: 'titulo', 
    header: 'Título',
    cell: ({ row }) => row.original.titulo || 'N/A'
  },
  { 
    accessorKey: 'revistaEditorial', 
    header: 'Revista/Editorial',
    cell: ({ row }) => row.original.revistaEditorial || 'N/A'
  },
  { 
    accessorKey: 'tipoPublicacion', 
    header: 'Tipo de Publicación',
    cell: ({ row }) => {
      const tipos: Record<string, string> = {
        'articulo': 'Artículo',
        'libro': 'Libro',
        'libro_digital': 'Libro Digital',
        'capitulo_libro': 'Capítulo de Libro',
        'texto_carrera': 'Texto de la Carrera',
        'material_docente': 'Material Docente Interno',
        'patente': 'Patente'
      };
      return row.original.tipoPublicacion ? tipos[row.original.tipoPublicacion] || row.original.tipoPublicacion : 'N/A';
    }
  },
  { 
    accessorKey: 'isbnIssn', 
    header: 'ISBN/ISSN',
    cell: ({ row }) => row.original.isbnIssn || 'N/A'
  },
  { 
    accessorKey: 'verificacionLibro', 
    header: 'Verificación Libro',
    cell: ({ row }) => row.original.verificacionLibro || 'N/A'
  },
  { 
    accessorKey: 'baseDatosRevista', 
    header: 'Base de Datos',
    cell: ({ row }) => row.original.baseDatosRevista || 'N/A'
  },
  { 
    accessorKey: 'verificacionReferencia', 
    header: 'Verificación Referencia',
    cell: ({ row }) => row.original.verificacionReferencia || 'N/A'
  },
  { 
    accessorKey: 'nivel', 
    header: 'Nivel',
    cell: ({ row }) => row.original.nivel ? `Nivel ${row.original.nivel}` : 'N/A'
  },
  {
    id: 'action',
    header: () => h('div', { class: 'flex justify-end flex-row pr-8' }, 'Acciones'),
    cell: ({ row }) =>
      h('div', { class: 'flex gap-2 justify-end flex-row' }, [
        h(UButton, {
          color: 'neutral',
          size: 'xs',
          onClick: () => {
            publicationStore.currentPublication = row.original
            router.push('/publicaciones/actualizar-publicacion')
          }
        }, { default: () => 'Editar' }),

        h(UButton, {
          color: 'error',
          size: 'xs',
          onClick: () => {
            publicationStore.currentPublication = row.original
            showConfirmModal.value = true
          }
        }, { default: () => 'Eliminar' })
      ])
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
  <ConfirmDeleteModal :open="showConfirmModal" :item="publicationStore.currentPublication?.titulo || ''"
                      @update:open="onShowConfirmModalUpdate" @deleted="deletePublication"/>

</template>
