<script setup lang="ts">
import { z } from 'zod'
import type { FormSubmitEvent } from "#ui/types";
import { useSubjectStore } from "~/pages/asignaturas/store";

definePageMeta( { layout : 'dashboard' } )

const toast = useToast()
const router = useRouter()
const subjectStore = useSubjectStore()

const schema = z.object({
  nombre: z.string().min(1, 'Nombre requerido'),
  codigo: z.string().min(1, 'Código requerido'),
  anno: z.number().min(1, 'Año requerido').max(6, 'Año inválido'),
  semestre: z.number().min(1, 'Semestre requerido').max(2, 'Semestre inválido'),
  modalidad: z.enum(['DIURNO', 'A_DISTANCIA', 'POR_ENCUENTRO'], {
    required_error: 'Modalidad requerida'
  }),
  curriculo: z.enum(['BASE', 'PROPIO', 'OPTATIVA', 'ELECTIVA'], {
    required_error: 'Currículo requerido'
  }),
  disciplina: z.string().min(1, 'Disciplina requerida'),
});

type SchemaType = z.infer<typeof schema>;

const state = reactive<SchemaType>({
  nombre: '',
  codigo: '',
  anno: 1,
  semestre: 1,
  modalidad: 'DIURNO',
  curriculo: 'BASE',
  disciplina: '',
});

const anosAcademicos = [
  { value: 1, label: 'Primer Año' },
  { value: 2, label: 'Segundo Año' },
  { value: 3, label: 'Tercer Año' },
  { value: 4, label: 'Cuarto Año' },
  { value: 5, label: 'Quinto Año' },
  { value: 6, label: 'Sexto Año' }
];

const semestres = [
  { value: 1, label: 'Primer Semestre' },
  { value: 2, label: 'Segundo Semestre' }
];

const modalidades = [
  { value: 'DIURNO', label: 'Curso Diurno' },
  { value: 'A_DISTANCIA', label: 'Curso a Distancia' },
  { value: 'POR_ENCUENTRO', label: 'Curso por Encuentro' }
];

const curriculos = [
  { value: 'BASE', label: 'Base' },
  { value: 'PROPIO', label: 'Propio' },
  { value: 'OPTATIVA', label: 'Optativa' },
  { value: 'ELECTIVA', label: 'Electiva' }
];

// Enviar datos
async function onSubmit(event: FormSubmitEvent<SchemaType>) {
  console.log('Submitting subject data:', event.data);
  const result = await subjectStore.createSubject(event.data);

  if (result) {
    toast.add({
      title: 'Asignatura creada correctamente',
      color: 'success',
      icon: 'i-heroicons-check-circle'
    });
    router.back();
  } else {
    toast.add({
      title: subjectStore.error || 'Error al crear la asignatura',
      color: 'error',
      icon: 'i-heroicons-exclamation-circle'
    });
  }
}
</script>

<template>
  <UForm
    :schema="schema"
    :state="state"
    @submit="onSubmit"
    class="flex justify-center w-full"
  >
    <UCard class="w-full max-w-2xl">
      <template #header>
        <div class="flex items-center justify-between">
          <h2 class="text-xl font-bold text-gray-900 dark:text-white">
            Registrar asignatura
          </h2>
          <UButton
            variant="ghost"
            icon="i-heroicons-x-mark-20-solid"
            @click="router.back()"
          />
        </div>
      </template>

      <div class="flex flex-col space-y-4">
        <UFormField label="Nombre" name="nombre" required>
          <UInput v-model="state.nombre" class="w-full" placeholder="Ej: Matemática I"/>
        </UFormField>

        <UFormField label="Código" name="codigo" required>
          <UInput v-model="state.codigo" class="w-full" placeholder="Ej: MAT-101"/>
        </UFormField>

        <div class="grid grid-cols-2 gap-4">
          <UFormField label="Año" name="anno" required>
            <USelect
              v-model="state.anno"
              :items="anosAcademicos"
              placeholder="Seleccione el año"
              class="w-full"
            />
          </UFormField>

          <UFormField label="Semestre" name="semestre" required>
            <USelect
              v-model="state.semestre"
              :items="semestres"
              placeholder="Seleccione el semestre"
              class="w-full"
            />
          </UFormField>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <UFormField label="Modalidad" name="modalidad" required>
            <USelect
              v-model="state.modalidad"
              :items="modalidades"
              placeholder="Seleccione la modalidad"
              class="w-full"
            />
          </UFormField>

          <UFormField label="Currículo" name="curriculo" required>
            <USelect
              v-model="state.curriculo"
              :items="curriculos"
              placeholder="Seleccione el currículo"
              class="w-full"
            />
          </UFormField>
        </div>

        <UFormField label="Disciplina" name="disciplina" required>
          <USelect
            v-model="state.disciplina"
            :items="[]"
            placeholder="Seleccione la disciplina"
            class="w-full"
          />
        </UFormField>
      </div>

      <template #footer>
        <div class="flex justify-between">
          <UButton
            type="button"
            color="neutral"
            label="Cancelar"
            @click="router.back()"
          />
          <UButton
            type="submit"
            color="primary"
            label="Registrar"
            :loading="subjectStore.isLoading"
          />
        </div>
      </template>
    </UCard>
  </UForm>
</template>