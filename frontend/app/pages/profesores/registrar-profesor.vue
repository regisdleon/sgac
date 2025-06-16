<script setup lang="ts">
import { z } from 'zod'
import type { FormSubmitEvent } from "#ui/types";
import type { Professors } from "~/models/Professors";
import { useProfessorStore } from '~/stores/professor'

definePageMeta({ layout: 'dashboard' })

const toast = useToast()
const router = useRouter()
const professorsStore = useProfessorStore()

const schema = z.object({
  nombre: z.string().min(1, 'Nombre requerido'),
  primerApellido: z.string().min(1, 'Primer apellido requerido'),
  segundoApellido: z.string().optional(),
  annosExperienciaCarrera: z.coerce.number().min(0, 'Debe ser un número positivo'),
  annosExperienciaMes: z.coerce.number().min(0, 'Debe ser un número positivo'),
  categoriaDocente: z.enum(['INSTRUCTOR', 'ASISTENTE', 'AUXILIAR', 'TITULAR', 'AD', 'ATD'], {
    required_error: 'Categoría docente requerida'
  }),
  gradoCientifico: z.enum(['DOCTOR_EN_CIENCIA', 'DOCTOR_EN_CIENCIAS'], {
    required_error: 'Grado científico requerido'
  }),
  correos: z.array(z.object({
    etiqueta: z.string(),
    correo: z.string().email('Correo inválido')
  })).min(1, 'Al menos un correo es requerido'),
  telefonos: z.array(z.object({
    etiqueta: z.string(),
    numero: z.string().min(1, 'Teléfono inválido')
  })).min(1, 'Al menos un teléfono es requerido')
});

type SchemaType = z.infer<typeof schema>;

const state = reactive<SchemaType>({
  nombre: '',
  primerApellido: '',
  segundoApellido: '',
  annosExperienciaCarrera: 0,
  annosExperienciaMes: 0,
  categoriaDocente: 'INSTRUCTOR',
  gradoCientifico: 'DOCTOR_EN_CIENCIA',
  correos: [{ etiqueta: 'personal', correo: '' }],
  telefonos: [{ etiqueta: 'personal', numero: '' }]
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
  { value: 'DOCTOR_EN_CIENCIA', label: 'Doctor en Ciencia' },
  { value: 'DOCTOR_EN_CIENCIAS', label: 'Doctor en Ciencias' }
];

async function onSubmit(event: FormSubmitEvent<SchemaType>) {
  try {
    const result = await professorsStore.createProfessor(event.data)
    if (result) {
      toast.add({
        title: 'Profesor registrado correctamente',
        color: 'success'
      })
      router.push('/profesores')
    }
  } catch (e) {
    toast.add({
      title: 'Error al registrar el profesor',
      color: 'error'
    })
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
  <UForm :schema="schema" :state="state" @submit="onSubmit" class="flex justify-center w-full">
    <UCard class="w-full max-w-2xl">
      <template #header>
        <h2 class="text-xl font-bold text-gray-900 dark:text-white">
          Registrar profesor
        </h2>
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
          <UButton size="lg" type="button" color="neutral" label="Cancelar" @click="router.back()" />
          <UButton size="lg" type="submit" color="primary" label="Registrar" :loading="professorsStore.isLoading" />
        </div>
      </template>
    </UCard>
  </UForm>
</template>
