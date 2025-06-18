<script setup lang="ts">
import { ref, watchEffect } from 'vue';
import { useEvaluationStore } from './store';
import { useProfessorStore } from '~/stores/professor';
import { IndicadorEvaluacion, EvaluacionValor } from '~/models/Evaluation';
import { useRouter } from 'vue-router';

const evaluationStore = useEvaluationStore();
const professorStore = useProfessorStore();
const router = useRouter();

const state = ref({
  profesor: '',
  indicador: '' as IndicadorEvaluacion | '',
  fecha: '',
  evaluacion: '' as EvaluacionValor | '',
});

const indicadorOptions = Object.values(IndicadorEvaluacion).map(val => ({ value: val, label: val }));
const evaluacionOptions = [
  { value: 'R', label: 'Regular' },
  { value: 'B', label: 'Bien' },
  { value: 'E', label: 'Excelente' },
  { value: 'NP', label: 'No Presentado' },
];
const profesorOptions = professorStore.professors.map(p => ({ value: p.id, label: `${p.nombre} ${p.primerApellido}` }));

watchEffect(() => {
  if (evaluationStore.currentEvaluation) {
    state.value.profesor = evaluationStore.currentEvaluation.profesor;
    state.value.indicador = evaluationStore.currentEvaluation.indicador;
    state.value.fecha = evaluationStore.currentEvaluation.fecha;
    state.value.evaluacion = evaluationStore.currentEvaluation.evaluacion;
  }
});

async function onSubmit() {
  if (!evaluationStore.currentEvaluation) return;
  await evaluationStore.updateEvaluation({
    id: evaluationStore.currentEvaluation.id,
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
      <h2 class="text-xl font-bold">Actualizar evaluación a profesor</h2>
    </template>
    <form @submit.prevent="onSubmit" class="flex flex-col gap-4">
      <UFormField label="Profesor" name="profesor" required>
        <USelect v-model="state.profesor" :items="profesorOptions" placeholder="Seleccione un profesor" class="w-full" />
      </UFormField>
      <UFormField label="Indicador" name="indicador" required>
        <USelect v-model="state.indicador" :items="indicadorOptions" placeholder="Seleccione un indicador" class="w-full" />
      </UFormField>
      <UFormField label="Fecha" name="fecha" required>
        <UInput v-model="state.fecha" type="date" class="w-full" />
      </UFormField>
      <UFormField label="Evaluación" name="evaluacion" required>
        <USelect v-model="state.evaluacion" :items="evaluacionOptions" placeholder="Seleccione una evaluación" class="w-full" />
      </UFormField>
      <div class="flex justify-between mt-4">
        <UButton type="button" color="neutral" @click="router.back()">Cancelar</UButton>
        <UButton type="submit" color="primary">Actualizar</UButton>
      </div>
    </form>
  </UCard>
</template> 