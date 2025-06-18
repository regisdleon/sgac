<script setup lang="ts">
import { z } from 'zod'
import type { FormSubmitEvent } from "#ui/types";
import type { Professors } from "~/models/Professors";
import { useProfessorStore } from '~/stores/professor'
import { useRoute } from 'vue-router'

definePageMeta({ layout: 'dashboard' })

const toast = useToast()
const router = useRouter()
const professorsStore = useProfessorStore()
const route = useRoute()

const schema = z.object({
  id: z.string().optional(),
  nombre: z.string().min(1, 'Nombre requerido'),
  primerApellido: z.string().min(1, 'Primer apellido requerido'),
  segundoApellido: z.string().optional(),
  annosExperienciaCarrera: z.coerce.number().min(0, 'Debe ser un número positivo'),
  annosExperienciaMes: z.coerce.number().min(0, 'Debe ser un número positivo'),
  categoriaDocente: z.enum(['INSTRUCTOR', 'ASISTENTE', 'AUXILIAR', 'TITULAR', 'AD', 'ATD'], {
    required_error: 'Categoría docente requerida'
  }),
  gradoCientifico: z.enum(['DOCTOR', 'MASTER', 'NINGUNO'], {
    required_error: 'Grado científico requerido'
  }),
  correos: z.array(z.object({
    etiqueta: z.string(),
    correo: z.string().email('Correo inválido')
  })).min(1, 'Al menos un correo es requerido'),
  telefonos: z.array(z.object({
    etiqueta: z.string(),
    numero: z.string().min(1, 'Teléfono inválido')
  })).min(1, 'Al menos un teléfono es requerido'),
  drEspecialidadAfin: z.enum(['SI', 'NO']).nullable(),
});

type SchemaType = z.infer<typeof schema>;

const state = reactive<SchemaType>({
  id: undefined,
  nombre: '',
  primerApellido: '',
  segundoApellido: '',
  annosExperienciaCarrera: 0,
  annosExperienciaMes: 0,
  categoriaDocente: 'INSTRUCTOR',
  gradoCientifico: 'DOCTOR',
  correos: [{ etiqueta: 'personal', correo: '' }],
  telefonos: [{ etiqueta: 'personal', numero: '' }],
  drEspecialidadAfin: null,
});

const categoriasDocente = [
  { value: 'INSTRUCTOR', label: 'Instructor' },
  { value: 'ASISTENTE', label: 'Asistente' },
  { value: 'AUXILIAR', label: 'Auxiliar' },
  { value: 'TITULAR', label: 'Titular' },
  { value: 'AD', label: 'Adiestrado' },
  { value: 'ATD', label: 'ATD' }
];

const gradosCientificos = [
  { value: 'DOCTOR', label: 'Doctor' },
  { value: 'MASTER', label: 'Máster' },
  { value: 'NINGUNO', label: 'Ninguno' }
];

const drEspecialidadAfinOptions = [
  { value: null, label: 'Sin especificar' },
  { value: 'SI', label: 'Sí' },
  { value: 'NO', label: 'No' }
];

onMounted(async () => {
  const professorId = route.params.id as string
  if (professorId) {
    await professorsStore.fetchProfessorById(professorId)
  }
})

watchEffect(() => {
  if (professorsStore.currentProfessor) {
    state.id = professorsStore.currentProfessor.id
    state.nombre = professorsStore.currentProfessor.nombre
    state.primerApellido = professorsStore.currentProfessor.primerApellido
    state.segundoApellido = professorsStore.currentProfessor.segundoApellido
    state.annosExperienciaCarrera = professorsStore.currentProfessor.annosExperienciaCarrera
    state.annosExperienciaMes = professorsStore.currentProfessor.annosExperienciaMes
    state.categoriaDocente = professorsStore.currentProfessor.categoriaDocente
    state.gradoCientifico = professorsStore.currentProfessor.gradoCientifico
    state.correos = professorsStore.currentProfessor.correos
    state.telefonos = professorsStore.currentProfessor.telefonos
    state.drEspecialidadAfin = professorsStore.currentProfessor.drEspecialidadAfin ?? null;
  }
})

// Add debug logging for state changes
watch(state, (newState) => {
  console.log('Form state changed:', newState);
}, { deep: true });

// Add debug logging for current professor
watch(() => professorsStore.currentProfessor, (newProfessor) => {
  console.log('Current professor changed:', newProfessor);
}, { deep: true });

async function handleSubmit() {
  console.log('Form submitted');
  console.log('Current state:', state);
  console.log('Current professor:', professorsStore.currentProfessor);

  if (!professorsStore.currentProfessor?.id) {
    console.error('No professor ID found');
    toast.add({
      title: 'Error: No se encontró el profesor a actualizar.',
      color: 'error',
      icon: 'i-heroicons-exclamation-circle',
    });
    return;
  }

  try {
    const updatedProfessorData: Professors = {
      id: professorsStore.currentProfessor.id,
      nombre: state.nombre,
      primerApellido: state.primerApellido,
      segundoApellido: state.segundoApellido,
      annosExperienciaCarrera: state.annosExperienciaCarrera,
      annosExperienciaMes: state.annosExperienciaMes,
      categoriaDocente: state.categoriaDocente,
      gradoCientifico: state.gradoCientifico,
      correos: state.correos,
      telefonos: state.telefonos,
      drEspecialidadAfin: state.drEspecialidadAfin,
    };

    console.log('Submitting professor data:', updatedProfessorData);
    const result = await professorsStore.updateProfessor(updatedProfessorData);
    
    if (result) {
      toast.add({
        title: 'Profesor actualizado correctamente',
        color: 'success',
        icon: 'i-heroicons-check-circle'
      });
      professorsStore.clearCurrentProfessor();
      router.back();
    } else {
      throw new Error(professorsStore.error || 'Error al actualizar el profesor');
    }
  } catch (e) {
    console.error('Error updating professor:', e);
    toast.add({
      title: professorsStore.error || 'Error al actualizar el profesor',
      color: 'error',
      icon: 'i-heroicons-exclamation-circle'
    });
  }
}

function addEmail() {
  state.correos.push({ etiqueta: 'otro', correo: '' })
}

function removeEmail(index: number) {
  state.correos.splice(index, 1)
}

function addPhone() {
  state.telefonos.push({ etiqueta: 'otro', numero: '' })
}

function removePhone(index: number) {
  state.telefonos.splice(index, 1)
}
</script>

<template>
  <form @submit.prevent="handleSubmit" class="flex justify-center w-full">
    <UCard class="w-full max-w-2xl">
      <template #header>
        <div class="flex items-center justify-between">
          <h2 class="text-xl font-bold text-gray-900 dark:text-white">
            Actualizar profesor
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
          <UInput v-model="state.nombre" class="w-full" />
        </UFormField>

        <UFormField label="Primer Apellido" name="primerApellido" required>
          <UInput v-model="state.primerApellido" class="w-full" />
        </UFormField>

        <UFormField label="Segundo Apellido" name="segundoApellido">
          <UInput v-model="state.segundoApellido" class="w-full" />
        </UFormField>

        <UFormField label="Años de Experiencia en Carrera" name="annosExperienciaCarrera" required>
          <UInput v-model="state.annosExperienciaCarrera" type="number" class="w-full" />
        </UFormField>

        <UFormField label="Años de Experiencia en Mes" name="annosExperienciaMes" required>
          <UInput v-model="state.annosExperienciaMes" type="number" class="w-full" />
        </UFormField>

        <UFormField label="Categoría Docente" name="categoriaDocente" required>
          <USelect
            v-model="state.categoriaDocente"
            :items="categoriasDocente"
            placeholder="Seleccione categoría docente"
            class="w-full"
          />
        </UFormField>

        <UFormField label="Grado Científico" name="gradoCientifico" required>
          <USelect
            v-model="state.gradoCientifico"
            :items="gradosCientificos"
            placeholder="Seleccione grado científico"
            class="w-full"
          />
        </UFormField>

        <UFormField label="Dr. Especialidad Afín" name="drEspecialidadAfin">
          <USelect
            v-model="state.drEspecialidadAfin"
            :items="drEspecialidadAfinOptions"
            placeholder="Seleccione una opción"
            class="w-full"
          />
        </UFormField>

        <div class="space-y-4">
          <div class="flex justify-between items-center">
            <label class="block text-sm font-medium text-gray-700">Correos Electrónicos</label>
            <UButton size="xs" @click="addEmail">Agregar Correo</UButton>
          </div>
          <div v-for="(email, index) in state.correos" :key="index" class="flex gap-2">
            <UFormField :name="`correos.${index}.correo`" class="flex-1">
              <UInput v-model="state.correos[index].correo" type="email" class="w-full" />
            </UFormField>
            <UButton
              v-if="state.correos.length > 1"
              color="red"
              size="xs"
              @click="removeEmail(index)"
            >
              Eliminar
            </UButton>
          </div>
        </div>

        <div class="space-y-4">
          <div class="flex justify-between items-center">
            <label class="block text-sm font-medium text-gray-700">Teléfonos</label>
            <UButton size="xs" @click="addPhone">Agregar Teléfono</UButton>
          </div>
          <div v-for="(phone, index) in state.telefonos" :key="index" class="flex gap-2">
            <UFormField :name="`telefonos.${index}.numero`" class="flex-1">
              <UInput v-model="state.telefonos[index].numero" class="w-full" />
            </UFormField>
            <UButton
              v-if="state.telefonos.length > 1"
              color="red"
              size="xs"
              @click="removePhone(index)"
            >
              Eliminar
            </UButton>
          </div>
        </div>
      </div>

      <template #footer>
        <div class="flex justify-between flex-row">
          <UButton 
            size="lg" 
            type="button" 
            color="neutral" 
            label="Cancelar" 
            @click="router.back()" 
          />
          <UButton 
            size="lg" 
            type="submit" 
            color="primary" 
            label="Actualizar" 
            :loading="professorsStore.isLoading"
          />
        </div>
      </template>
    </UCard>
  </form>
</template>
