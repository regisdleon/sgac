<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'
import CustomTable from '~/components/tables/CustomTable.vue'
import { h, resolveComponent } from "vue";
import type { Event } from "~/models/Event";
import { useEventStore } from "~/stores/event";
import ConfirmDeleteModal from "~/components/modals/ConfirmDeleteModal.vue";

const UButton = resolveComponent( 'UButton' )
definePageMeta( { layout : 'dashboard' } )

const toast = useToast()
const router = useRouter()
const showConfirmModal = ref( false )
const eventStore = useEventStore()

function onShowConfirmModalUpdate( value : boolean ) {
  showConfirmModal.value = value
  if (!value) {
    eventStore.clearCurrentEvent()
  }
}

onMounted( async () => {
  await eventStore.fetchEvents()
} )

onActivated(async () => {
  await eventStore.fetchEvents();
});

const columns : TableColumn<Event>[] = [
  { accessorKey : 'anno', header : 'Año' },
  { accessorKey : 'titulo', header : 'Título' },
  {
    id: 'titulo_corto',
    key: 'titulo_corto',
    header: 'Título Corto',
    cell: ({ row }) => {
      console.log('Row data for titulo_corto:', row.original);
      console.log('titulo_corto value:', row.original?.titulo_corto);
      return row.original?.titulo_corto || 'N/A';
    }
  },
  {
    id: 'clasificacion',
    key: 'clasificacion',
    header: 'Clasificación',
    accessorKey: 'clasificacion',
    cell: ({ row }) => {
      const clasificaciones: Record<string, string> = {
        'INTERNACIONAL': 'Internacional',
        'NACIONAL': 'Nacional',
        'PROVINCIAL': 'Provincial',
        'MUNICIPAL': 'Municipal',
        'DE_BASE': 'De base'
      };
      return row.original?.clasificacion ? (clasificaciones[row.original.clasificacion] || row.original.clasificacion) : 'N/A';
    }
  },
  {
    id : 'action',
    header : () => h( 'div', { class : 'flex justify-end flex-row pr-8' }, 'Acciones' ),
    cell : ( { row } ) =>
        h( 'div', { class : 'flex gap-2 justify-end flex-row' }, [
          h( UButton, {
            color : 'neutral',
            size : 'xs',
            onClick : () => {
              eventStore.currentEvent = row.original
              router.push( `/eventos/actualizar-evento/${row.original.id}` )
            }
          }, { default : () => 'Editar' } ),

          h( UButton, {
            color : 'error',
            size : 'xs',
            onClick : () => {
              eventStore.currentEvent = row.original
              showConfirmModal.value = true
            }
          }, { default : () => 'Eliminar' } )

        ] )
  }
]

const deleteEvent = async () => {
  if ( !eventStore.currentEvent?.id ) return

  try {
    const success = await eventStore.deleteEvent( eventStore.currentEvent.id )
    if ( success ) {
      toast.add( {
        title : 'Evento eliminado correctamente',
        color : 'success',
      } )
    }
  } catch ( e ) {
    toast.add( {
      title : 'Error al eliminar el evento',
      color : 'error',
    } )
  } finally {
    showConfirmModal.value = false
    eventStore.currentEvent = null
  }
}

</script>

<template>
  <CustomTable
      title="Eventos"
      :data="eventStore.events || []"
      :columns="columns"
      :error="eventStore.error"
      empty-text="No hay eventos registrados"
      :loading="eventStore.isLoading"
  >
    <template #register-button>
      <UButton @click="router.push('/eventos/registrar-evento/')">Registrar evento</UButton>
    </template>
  </CustomTable>
  <ConfirmDeleteModal
      :open="showConfirmModal"
      :item="eventStore.currentEvent?.titulo || ''"
      @update:open="(value) => { showConfirmModal = value; if (!value) eventStore.clearCurrentEvent() }"
      @deleted="deleteEvent"
      :loading="eventStore.isLoading"
  />
</template>
