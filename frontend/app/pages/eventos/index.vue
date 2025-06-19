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

const tableKey = computed(() => {
  return eventStore.events.map(e => e.id).join('-');
});

function onShowConfirmModalUpdate( value : boolean ) {
  showConfirmModal.value = value
  if (!value) {
    eventStore.clearCurrentEvent()
  }
}

const { pending, error } = useAsyncData(
  'events',
  async () => {
    await eventStore.fetchEvents();
  },
  { server: false } // Deshabilitamos el renderizado en servidor para esta carga de datos
);

const columns : TableColumn<Event>[] = [
  { accessorKey : 'anno', header : 'Año' },
  { accessorKey : 'titulo', header : 'Título' },
  { accessorKey : 'titulo_corto', header : 'Título Corto' },
  {
    id: 'profesor',
    header: 'Profesor',
    accessorKey: 'profesor',
    cell: ({ row }) => {
      console.log('Row data for profesor:', row.original);
      const profesor = row.original.profesor;
      if (!profesor) return 'N/A';
      return `${profesor.nombre} ${profesor.primerApellido} ${profesor.segundoApellido || ''}`.trim();
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
              router.push( `/eventos/${row.original.id}` )
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
      :data="[...(eventStore.events || [])]"
      :columns="columns"
      :error="eventStore.error"
      empty-text="No hay eventos registrados"
      :loading="eventStore.isLoading"
      :key="tableKey"
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
