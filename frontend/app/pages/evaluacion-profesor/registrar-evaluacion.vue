<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useEvaluationStore } from './store';
import { useProfessorStore } from '~/stores/professor';
import { IndicadorEvaluacion } from '~/models/Evaluation';
import { useRouter } from 'vue-router';
import { useIndicadorEvaluacionStore } from './indicadorStore';

const evaluationStore = useEvaluationStore();
const professorStore = useProfessorStore();
const router = useRouter();
const indicadorStore = useIndicadorEvaluacionStore();

type EvaluacionValor = 'R' | 'B' | 'E' | 'NP';

const state = ref({
  profesor: '',
  indicador: '' as IndicadorEvaluacion | '',
  fecha: '',
  evaluacion: '' as EvaluacionValor | '',
});

onMounted(async () => {
  await professorStore.fetchProfessors();
  await indicadorStore.fetchIndicadores();
});

const evaluacionOptions = [
  { value: 'R', label: 'Regular' },
  { value: 'B', label: 'Bien' },
  { value: 'E', label: 'Excelente' },
  { value: 'NP', label: 'No Presentado' },
];

async function onSubmit() {
  await evaluationStore.createEvaluation({
    profesor: state.value.profesor,
    indicador: state.value.indicador as IndicadorEvaluacion,
    fecha: state.value.fecha,
    evaluacion: state.value.evaluacion as EvaluacionValor,
  });
  router.push('/evaluacion-profesor');
}
</script>

<template>
  <UCard class="w-full max-w-2xl mx-auto">
    <template #header>
      <h2 class="text-xl font-bold">Registrar evaluación a profesor</h2>
    </template>
    <form @submit.prevent="onSubmit" class="flex flex-col gap-4">
      <UFormField label="Profesor" name="profesor" required>
        <USelect
          v-model="state.profesor"
          :items="professorStore.professors.map(prof => ({ label: `${prof.nombre} ${prof.primerApellido} ${prof.segundoApellido || ''}`.trim(), value: prof.id }))"
          :disabled="professorStore.isLoading"
          placeholder="Seleccione un profesor"
          class="w-full"
        />
      </UFormField>
      <UFormField label="Indicador" name="indicador" required>
        <USelect
          v-model="state.indicador"
          :items="indicadorStore.indicadores.map(ind => ({ label: ind.nombre, value: ind.id }))"
          :disabled="indicadorStore.isLoading"
          placeholder="Seleccione un indicador"
          class="w-full"
        />
      </UFormField>
      <UFormField label="Fecha" name="fecha" required>
        <UInput v-model="state.fecha" type="date" class="w-full" />
      </UFormField>
      <UFormField label="Evaluación" name="evaluacion" required>
        <USelect v-model="state.evaluacion" :items="evaluacionOptions" placeholder="Seleccione una evaluación" class="w-full" />
      </UFormField>
      <div class="flex justify-between mt-4">
        <UButton type="button" color="neutral" @click="router.back()">Cancelar</UButton>
        <UButton
          type="submit"
          color="primary"
          :disabled="professorStore.isLoading || indicadorStore.isLoading || professorStore.professors.length === 0 || indicadorStore.indicadores.length === 0"
        >
          Registrar
        </UButton>
      </div>
    </form>
  </UCard>
</template> 