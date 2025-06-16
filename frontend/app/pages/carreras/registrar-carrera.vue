<script setup lang="ts">
import { z } from 'zod'
import type { Career } from "~/models/Career";
import type { FormSubmitEvent } from "@nuxt/ui/runtime/types";
import { useCareerStore } from "~/stores/career";

definePageMeta({ layout: 'dashboard' })

const router = useRouter()
const toast = useToast()
const careerStore = useCareerStore()

// Tipos y esquemas
const schema = z.object({
  nombre: z.string().min(1, 'Nombre requerido').max(255, 'Máximo 255 caracteres'),
  modalidad: z.enum(['CURSO_DIURNO', 'CURSO_A_DISTANCIA', 'CURSO_POR_ENCUENTRO'], {
    errorMap: () => ({ message: 'Modalidad requerida' })
  }),
  sede: z.string().min(1, 'Sede requerida').max(255, 'Máximo 255 caracteres'),
  anno_eval_ext: z.string().min(1, 'Año de evaluación requerido').max(255, 'Máximo 255 caracteres'),
  curso_evaluado: z.string().min(1, 'Curso evaluado requerido').max(255, 'Máximo 255 caracteres'),
  numero_eval_ext: z.number().min(0, 'Número de evaluación debe ser mayor o igual a 0')
});

type SchemaType = z.infer<typeof schema>;

// Estado del formulario
const state = reactive<SchemaType>({
  nombre: '',
  modalidad: 'CURSO_DIURNO',
  sede: '',
  anno_eval_ext: new Date().getFullYear().toString(),
  curso_evaluado: '0',
  numero_eval_ext: 0
});

async function onSubmit(event: FormSubmitEvent<SchemaType>) {
  if (careerStore.isLoading) return;
  
  try {
    const result = await careerStore.createCareer(event.data)

    if (result) {
      toast.add({
        title: 'Carrera creada correctamente',
        description: 'La carrera ha sido registrada exitosamente',
        icon: 'i-heroicons-check-circle',
        color: 'green'
      })
      router.push('/carreras')
    } else {
      toast.add({
        title: 'Error al crear la carrera',
        description: careerStore.error || 'Ha ocurrido un error al intentar crear la carrera',
        icon: 'i-heroicons-exclamation-circle',
        color: 'red'
      })
    }
  } catch (error) {
    toast.add({
      title: 'Error al crear la carrera',
      description: error instanceof Error ? error.message : 'Ha ocurrido un error inesperado',
      icon: 'i-heroicons-exclamation-circle',
      color: 'red'
    })
  }
}
</script>

<template>
  <UForm
    :schema="schema"
    :state="state"
    @submit="onSubmit"
    class="justify-center flex w-full items-center"
  >
    <UCard
      title="Registrar carrera"
      class="min-w-lg"
    >
      <template #header>
        <div class="flex items-center justify-between">
          <h2 class="text-lg font-semibold">
            Registrar Nueva Carrera
          </h2>
          <UButton
            variant="ghost"
            icon="i-heroicons-x-mark-20-solid"
            @click="router.back()"
          />
        </div>
      </template>

      <div class="flex flex-col space-y-2">
        <UFormField label="Nombre de la carrera" name="nombre" required>
          <UInput
            class="w-full"
            v-model="state.nombre"
            placeholder="Ej: Ingeniería de Software"
          />
        </UFormField>

        <UFormField label="Modalidad" name="modalidad" required>
          <USelect
            class="w-full"
            v-model="state.modalidad"
            :items="[
              { label: 'Curso Diurno', value: 'CURSO_DIURNO' },
              { label: 'Curso a Distancia', value: 'CURSO_A_DISTANCIA' },
              { label: 'Curso por Encuentro', value: 'CURSO_POR_ENCUENTRO' }
            ]"
            placeholder="Seleccione modalidad"
          />
        </UFormField>

        <UFormField label="Sede" name="sede" required>
          <USelect
            class="w-full"
            v-model="state.sede"
            :items="['Principal', 'Norte', 'Sur', 'Oriente']"
            placeholder="Seleccione sede"
          />
        </UFormField>

        <UFormField label="Año de evaluación" name="anno_eval_ext" required>
          <UInput
            class="w-full"
            v-model="state.anno_eval_ext"
            type="number"
            placeholder="Año de evaluación"
          />
        </UFormField>

        <UFormField label="Curso evaluado" name="curso_evaluado" required>
          <UInput
            class="w-full"
            v-model="state.curso_evaluado"
            placeholder="Curso evaluado"
          />
        </UFormField>

        <UFormField label="Número de evaluación" name="numero_eval_ext" required>
          <UInput
            class="w-full"
            v-model="state.numero_eval_ext"
            type="number"
            placeholder="Número de evaluación"
          />
        </UFormField>
      </div>

      <template #footer>
        <div class="flex justify-between gap-3 pt-4">
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
            :loading="careerStore.isLoading"
          />
        </div>
      </template>
    </UCard>
  </UForm>
</template>