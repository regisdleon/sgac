<script setup lang="ts">
import { ref, onMounted, h, resolveComponent } from 'vue';
import { useEvaluationStore } from './store';
import CustomTable from '~/components/tables/CustomTable.vue';
import { useRouter } from 'vue-router';
import ConfirmDeleteModal from '~/components/modals/ConfirmDeleteModal.vue';

definePageMeta({
  layout: 'dashboard'
})

const router = useRouter();
const evaluationStore = useEvaluationStore();
const showConfirmModal = ref(false);

const columns = [
  { id: 'profesor', header: 'Profesor', accessorKey: 'profesor' },
  { id: 'indicador', header: 'Indicador', accessorKey: 'indicador' },
  { id: 'fecha', header: 'Fecha', accessorKey: 'fecha' },
  { id: 'evaluacion', header: 'Evaluación', accessorKey: 'evaluacion' },
  {
    id: 'actions',
    header: 'Acciones',
    cell: ({ row }) => h('div', { class: 'flex gap-2 justify-end' }, [
      h(resolveComponent('UButton'), {
        color: 'neutral', size: 'xs',
        onClick: () => {
          evaluationStore.setCurrentEvaluation(row.original);
          router.push('/evaluacion-profesor/actualizar-evaluacion');
        }
      }, { default: () => 'Editar' }),
      h(resolveComponent('UButton'), {
        color: 'error', size: 'xs',
        onClick: () => {
          evaluationStore.setCurrentEvaluation(row.original);
          showConfirmModal.value = true;
        }
      }, { default: () => 'Eliminar' })
    ])
  }
];

onMounted(async () => {
  await evaluationStore.fetchEvaluations();
});

const deleteEvaluation = async () => {
  if (!evaluationStore.currentEvaluation?.id) return;
  await evaluationStore.deleteEvaluation(evaluationStore.currentEvaluation.id);
  showConfirmModal.value = false;
  evaluationStore.clearCurrentEvaluation();
};
</script>

<template>
  <UCard>
    <template #header>
      <div class="flex justify-between items-center">
        <h2 class="text-xl font-semibold">Evaluación</h2>
        <UButton label="Registrar evaluación" @click="router.push('/evaluacion-profesor/registrar-evaluacion')" />
      </div>
    </template>
    <CustomTable
      :data="evaluationStore.evaluations"
      :columns="columns"
      :loading="evaluationStore.isLoading"
      :error="evaluationStore.error"
      title="Listado de Evaluaciones"
      empty-text="No hay evaluaciones registradas"
    />
    <ConfirmDeleteModal
      :open="showConfirmModal"
      :item="evaluationStore.currentEvaluation?.profesor || ''"
      @confirm="deleteEvaluation"
      @close="showConfirmModal = false"
    />
  </UCard>
</template> 