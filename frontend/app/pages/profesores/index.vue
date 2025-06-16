<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'
import CustomTable from '~/components/tables/CustomTable.vue'
import type { Professors } from "~/models/Professors";
import { h, resolveComponent } from "vue";
import { useProfessorStore } from "~/stores/professor";
import { UAvatar } from "#components";
import ConfirmDeleteModal from "~/components/modals/ConfirmDeleteModal.vue";

const UButton = resolveComponent( 'UButton' )
definePageMeta( { layout : 'dashboard' } )

const toast = useToast()
const router = useRouter()
const showConfirmModal = ref( false )
const professorsStore = useProfessorStore()

function onShowConfirmModalUpdate( value : boolean ) {
  showConfirmModal.value = value
  if (!value) {
    professorsStore.clearCurrentProfessor()
  }
}

onMounted(async () => {
  console.log('Index mounted - fetching professors');
  await professorsStore.fetchProfessors();
  console.log('Professors after fetch:', professorsStore.professors);
})

onActivated(async () => {
  console.log('Index activated - fetching professors');
  await professorsStore.fetchProfessors();
  console.log('Professors after fetch:', professorsStore.professors);
})

watch(() => professorsStore.professors, (newProfessors) => {
  console.log('Professors array changed:', newProfessors);
}, { deep: true });

const columns : TableColumn<Professors>[] = [
  {
    id: 'nombre',
    key: 'nombre',
    header: 'Nombre',
    accessorKey: 'nombre'
  },
  {
    id: 'primerApellido',
    key: 'primerApellido',
    header: 'Primer Apellido',
    accessorKey: 'primerApellido'
  },
  {
    id: 'segundoApellido',
    key: 'segundoApellido',
    header: 'Segundo Apellido',
    accessorKey: 'segundoApellido'
  },
  {
    id: 'annosExperienciaCarrera',
    key: 'annosExperienciaCarrera',
    header: 'Experiencia Carrera',
    accessorKey: 'annosExperienciaCarrera'
  },
  {
    id: 'annosExperienciaMes',
    key: 'annosExperienciaMes',
    header: 'Experiencia MES',
    accessorKey: 'annosExperienciaMes'
  },
  {
    id: 'categoriaDocente',
    key: 'categoriaDocente',
    header: 'Categoría Docente',
    accessorKey: 'categoriaDocente',
    cell: ({ row }) => {
      console.log('DEBUG_FINAL: Full row object:', row);
      console.log('DEBUG_FINAL: row.original:', row.original);
      console.log('DEBUG_FINAL: row.original.categoriaDocente:', row.original?.categoriaDocente);
      const categorias: Record<string, string> = {
        'INSTRUCTOR': 'Instructor',
        'ASISTENTE': 'Asistente',
        'AUXILIAR': 'Auxiliar',
        'TITULAR': 'Titular',
        'AD': 'Adiestrado',
        'ATD': 'ATD'
      };
      const renderedValue = row.original?.categoriaDocente ? (categorias[row.original.categoriaDocente] || row.original.categoriaDocente) : 'N/A';
      return renderedValue;
    }
  },
  {
    id: 'gradoCientifico',
    key: 'gradoCientifico',
    header: 'Grado Científico',
    accessorKey: 'gradoCientifico',
    cell: ({ row }) => {
      console.log('DEBUG_FINAL: Full row object:', row);
      console.log('DEBUG_FINAL: row.original:', row.original);
      console.log('DEBUG_FINAL: row.original.gradoCientifico:', row.original?.gradoCientifico);
      const grados: Record<string, string> = {
        'DOCTOR_EN_CIENCIA': 'Doctor en Ciencia',
        'DOCTOR_EN_CIENCIAS': 'Doctor en Ciencias'
      };
      const renderedValue = row.original?.gradoCientifico ? (grados[row.original.gradoCientifico] || row.original.gradoCientifico) : 'N/A';
      return renderedValue;
    }
  },
  {
    id: 'correos',
    key: 'correos',
    header: 'Correos',
    accessorKey: 'correos',
    cell: ({ row }) => {
      console.log('DEBUG_FINAL: Full row object:', row);
      console.log('DEBUG_FINAL: row.original:', row.original);
      console.log('DEBUG_FINAL: row.original.correos:', row.original?.correos);
      const renderedValue = row.original?.correos?.map(c => c.correo).join(', ') || 'N/A';
      return renderedValue;
    }
  },
  {
    id: 'telefonos',
    key: 'telefonos',
    header: 'Teléfonos',
    accessorKey: 'telefonos',
    cell: ({ row }) => {
      console.log('DEBUG_FINAL: Full row object:', row);
      console.log('DEBUG_FINAL: row.original:', row.original);
      console.log('DEBUG_FINAL: row.original.telefonos:', row.original?.telefonos);
      const renderedValue = row.original?.telefonos?.map(t => t.numero).join(', ') || 'N/A';
      return renderedValue;
    }
  },
  {
    id: 'actions',
    key: 'actions',
    header: 'Acciones',
    cell: ({ row }) => h('div', { class: 'flex gap-2 justify-end' }, [
      h(UButton, {
        color: 'neutral',
        size: 'xs',
        onClick: () => {
          professorsStore.setCurrentProfessor(row.original)
          router.push('/profesores/actualizar-profesor')
        }
      }, { default: () => 'Editar' }),
      h(UButton, {
        color: 'error',
        size: 'xs',
        onClick: () => {
          professorsStore.setCurrentProfessor(row.original)
          showConfirmModal.value = true
        }
      }, { default: () => 'Eliminar' })
    ])
  }
]

const deleteProfessor = async () => {
  if ( !professorsStore.currentProfessor?.id ) return

  try {
    const success = await professorsStore.deleteProfessor( professorsStore.currentProfessor.id )
    if ( success ) {
       toast.add( {
         title : 'Profesor eliminado correctamente',
         color : 'success',
       } )
     }
   } catch ( e ) {
     toast.add( {
       title : 'Error al eliminar el profesor',
       color : 'error',
     } )
   } finally {
     showConfirmModal.value = false
     professorsStore.clearCurrentProfessor()
   }
}
</script>

<template>
  <div>
    <CustomTable
      title="Profesores"
      :data="professorsStore.professors"
      :columns="columns"
      :error="professorsStore.error"
      empty-text="No hay profesores registrados"
      :loading="professorsStore.isLoading"
      @update:search="(term) => console.log('Search term:', term)"
    >
      <template #register-button>
        <UButton @click="router.push('/profesores/registrar-profesor/')">Registrar profesor</UButton>
      </template>
    </CustomTable>
    <ConfirmDeleteModal 
      :open="showConfirmModal" 
      :item="professorsStore.currentProfessor?.nombre || ''"
      @update:open="onShowConfirmModalUpdate" 
      @deleted="deleteProfessor"
    />
  </div>
</template>
