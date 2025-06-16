<script setup lang="ts">
import { z } from 'zod'
import type { Career } from "~/models/Career";
import type { FormSubmitEvent } from "@nuxt/ui/runtime/types";
import { useCareerStore } from "~/stores/career";

definePageMeta({ layout: 'dashboard' })

const router = useRouter()
const toast = useToast()
const careerStore = useCareerStore()
const route = useRoute()

// Tipos y esquemas - CORREGIDOS PARA COINCIDIR CON Career.ts
const schema = z.object({
  nombre: z.string().min(1, 'Nombre requerido').max(100, 'Máximo 100 caracteres'),
  modalidad: z.enum(['CURSO_DIURNO', 'CURSO_A_DISTANCIA', 'CURSO_POR_ENCUENTRO'], { required_error: 'Modalidad requerida' }),
  sede: z.string().min(1, 'Sede requerida').max(50, 'Máximo 50 caracteres'),
  anno_eval_ext: z.string().optional(),
  curso_evaluado: z.string().optional(),
  numero_eval_ext: z.number().optional(),
});

type SchemaType = z.infer<typeof schema>;

// Estado del formulario - Inicializado con valores por defecto
const state = reactive<SchemaType>({
  nombre: '',
  modalidad: 'CURSO_DIURNO', // Valor por defecto
  sede: '',
  anno_eval_ext: '',
  curso_evaluado: '',
  numero_eval_ext: 0,
});

// Cargar la carrera al montar el componente
onMounted(async () => {
  const careerId = route.params.id as string
  if (careerId) {
    await careerStore.fetchCareerById(careerId)
  }
})

// Observar careerStore.currentCareer y actualizar el estado del formulario
watchEffect(() => {
  if (careerStore.currentCareer) {
    state.nombre = careerStore.currentCareer.nombre
    state.modalidad = careerStore.currentCareer.modalidad
    state.sede = careerStore.currentCareer.sede
    state.anno_eval_ext = careerStore.currentCareer.anno_eval_ext
    state.curso_evaluado = careerStore.currentCareer.curso_evaluado
    state.numero_eval_ext = careerStore.currentCareer.numero_eval_ext
  }
})

async function onSubmit(event: FormSubmitEvent<SchemaType>) {
  if (!careerStore.currentCareer?.id) {
    toast.add({
      title: 'Error: No se encontró la carrera a actualizar.',
      color: 'error',
      icon: 'i-heroicons-exclamation-circle',
    });
    return;
  }

  // Mapear los datos del formulario al modelo Career
  const updatedCareerData: Career = {
    id: careerStore.currentCareer.id,
    nombre: state.nombre,
    modalidad: state.modalidad,
    sede: state.sede,
    anno_eval_ext: state.anno_eval_ext,
    curso_evaluado: state.curso_evaluado,
    numero_eval_ext: state.numero_eval_ext,
  };

  const result = await careerStore.updateCareer(updatedCareerData) // Llamar a updateCareer

  if (result) {
    toast.add({
      title: 'Carrera actualizada correctamente',
      icon: 'i-heroicons-check-circle',
    })
    careerStore.clearCurrentCareer()
    router.back()
  } else {
    toast.add({
      title: careerStore.error || 'Error al actualizar la carrera',
      icon: 'i-heroicons-exclamation-circle', // Icono de error
      color: 'error'
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
        title="Actualizar carrera"
        class="min-w-lg"
    >
      <template #header>
        <div class="flex items-center justify-between">
          <h2 class="text-lg font-semibold">
            Actualizar Carrera
          </h2>
          <UButton
              variant="ghost"
              icon="i-heroicons-x-mark-20-solid"
              @click="router.back()"
          />
        </div>
      </template>

      <div class="flex flex-col space-y-2">
        <!-- Campos del formulario, corregidos para coincidir con el modelo Career -->
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
              :items="['CURSO_DIURNO', 'CURSO_A_DISTANCIA', 'CURSO_POR_ENCUENTRO']"
              placeholder="Seleccione modalidad"
          />
        </UFormField>

        <UFormField label="Sede" name="sede" required>
          <UInput
              class="w-full"
              v-model="state.sede"
              placeholder="Ej: Sede Central"
          />
        </UFormField>

        <UFormField label="Año Evaluación Externa" name="anno_eval_ext">
          <UInput
              class="w-full"
              v-model="state.anno_eval_ext"
              placeholder="Ej: 2023"
          />
        </UFormField>

        <UFormField label="Curso Evaluado" name="curso_evaluado">
          <UInput
              class="w-full"
              v-model="state.curso_evaluado"
              placeholder="Ej: C2023"
          />
        </UFormField>

        <UFormField label="Número Evaluación Externa" name="numero_eval_ext">
          <UInput
              type="number"
              class="w-full"
              v-model="state.numero_eval_ext"
              placeholder="Ej: 1"
          />
        </UFormField>
      </div>

      <template #footer>
        <div class="flex justify-between gap-3 pt-4 ">
          <UButton
              type="button"
              color="neutral"
              label="Cancelar"
              @click="router.back()"
          />
          <UButton
              type="submit"
              color="primary"
              label='Actualizar'
              :loading="careerStore.isLoading"
          />
        </div>
      </template>
    </UCard>
  </UForm>
</template>