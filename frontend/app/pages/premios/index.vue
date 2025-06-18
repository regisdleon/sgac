<script setup lang="ts">
import { h, resolveComponent, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { usePrizeStore } from './store';
import { useProfessorStore } from '~/stores/professor';
import type { Prize } from '~/models/Prize';
import CustomTable from '~/components/tables/CustomTable.vue';
import ConfirmDeleteModal from '~/components/modals/ConfirmDeleteModal.vue';

const UButton = resolveComponent('UButton');
const router = useRouter();
const prizeStore = usePrizeStore();
const professorStore = useProfessorStore();
const showDeleteModal = ref(false);

const selectedPrize = ref<Prize | null>(null);

definePageMeta({ layout: 'dashboard' });

onMounted(async () => {
  await professorStore.fetchProfessors();
  await prizeStore.fetchPrizes();
});

const columns = [
  {
    accessorKey: 'profesor',
    header: 'Profesor',
    cell: ({ row }: any) => {
      const profId = row.original.profesor;
      const prof = professorStore.getProfessorById ? professorStore.getProfessorById(profId) : null;
      return prof ? `${prof.nombre} ${prof.primerApellido || ''} ${prof.segundoApellido || ''}`.trim() : 'N/A';
    }
  },
  {
    accessorKey: 'anno',
    header: 'Año',
    cell: ({ row }: any) => row.original.anno || 'N/A'
  },
  {
    accessorKey: 'descripcion',
    header: 'Descripción',
    cell: ({ row }: any) => row.original.descripcion || 'N/A'
  },
  {
    accessorKey: 'clasificacion',
    header: 'Clasificación',
    cell: ({ row }: any) => {
      const clasificaciones: Record<string, string> = {
        'PREMIO_NACIONAL_ACC': 'Premio nacional de la ACC',
        'PREMIO_PROVINCIAL_ACC': 'Premio provincial de la ACC',
        'PREMIO_NACIONAL_CITMA': 'Premio nacional del CITMA',
        'PREMIO_PROVINCIAL_CITMA': 'Premio provincial del CITMA',
        'PREMIOS_EVENTOS_CIENTIFICOS': 'Premios de eventos científicos',
        'PREMIOS_CIENTIFICOS_INTERNACIONALES': 'Premios científicos internacionales',
        'DISTINCION_MINISTRO': 'Distinción del ministro',
        'PREMIO_RECTOR': 'Premio del rector',
        'PREMIO_DECANO': 'Premio de decano',
        'CONDECORACIONES_NACIONALES': 'Condecoraciones nacionales',
        'CONDECORACIONES_INTERNACIONALES': 'Condecoraciones internacionales',
        'RECONOCIMIENTOS_ORG_ESTUDIANTILES': 'Reconocimientos de las organizaciones estudiantiles',
        'OTROS_PREMIOS_CIENTIFICOS': 'Otros premios científicos',
        'OTROS': 'Otros',
      };
      return clasificaciones[row.original.clasificacion] || row.original.clasificacion || 'N/A';
    }
  },
  {
    id: 'actions',
    header: () => h('div', { class: 'flex justify-end flex-row pr-8' }, 'Acciones'),
    cell: ({ row }: any) => h('div', { class: 'flex gap-2 justify-end flex-row' }, [
      h(UButton, {
        color: 'neutral',
        size: 'xs',
        onClick: () => router.push(`/premios/actualizar-premio?id=${row.original.id}`)
      }, { default: () => 'Editar' }),
      h(UButton, {
        color: 'error',
        size: 'xs',
        onClick: () => {
          selectedPrize.value = row.original;
          showDeleteModal.value = true;
        }
      }, { default: () => 'Eliminar' })
    ])
  }
];

const deletePrize = async () => {
  if (!selectedPrize.value) return;
  await prizeStore.deletePrize(selectedPrize.value.id);
  showDeleteModal.value = false;
  selectedPrize.value = null;
};

function onShowConfirmModalUpdate(value: boolean) {
  showDeleteModal.value = value;
  if (!value) selectedPrize.value = null;
}
</script>

<template>
  <CustomTable
    title="Premios"
    :data="prizeStore.prizes"
    :columns="columns"
    :error="prizeStore.error"
    empty-text="No hay premios registrados"
    :loading="prizeStore.isLoading"
  >
    <template #register-button>
      <UButton @click="router.push('/premios/registrar-premio')">Registrar Premio</UButton>
    </template>
  </CustomTable>
  <ConfirmDeleteModal
    :open="showDeleteModal"
    :item="selectedPrize?.descripcion || ''"
    @update:open="onShowConfirmModalUpdate"
    @deleted="deletePrize"
  />
</template>
