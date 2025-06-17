<script setup lang="ts">
import { z } from 'zod'
import type { FormSubmitEvent } from "#ui/types";
import { usePublicationStore } from "~/pages/publicaciones/store";

definePageMeta( { layout : 'dashboard' } )

const toast = useToast()
const router = useRouter()
const publicationStore = usePublicationStore()

const schema = z.object({
  id: z.string().optional(),
  anno: z.number().min(1900, 'Debe ser un año válido').max(new Date().getFullYear(), 'El año no puede ser en el futuro'),
  titulo: z.string().min(5, 'Título demasiado corto'),
  revista_editorial: z.string().min(2, 'Editorial requerida'),
  tipo_publicacion: z.string().min(1, 'Tipo requerido'),
  isbn_issn: z.string().min(5, 'ISBN/ISSN requerido'),
  verificacion_libro: z.string().min(1, 'Verificación de libro requerida'),
  base_datos_revista: z.string().min(1, 'Base de datos requerida'),
  verificacion_referencia: z.string().min(1, 'Referencia requerida'),
  nivel: z.number().min(0, 'Nivel requerido'),
  clasificacion: z.string().min(1, 'Clasificación requerida'),
})

type SchemaType = z.infer<typeof schema>;

const state = reactive<SchemaType>({
  anno: new Date().getFullYear(),
  titulo: '',
  revista_editorial: '',
  tipo_publicacion: '',
  isbn_issn: '',
  base_datos_revista: '',
  verificacion_libro: '',
  verificacion_referencia: '',
  nivel: 1,
  clasificacion: '',
})

onMounted(async () => {
  await publicationStore.fetchPublicationClassifications();
});

// Opciones para los selects
const publicationTypes = [
  { label: 'Artículo', value: 'articulo' },
  { label: 'Libro', value: 'libro' },
  { label: 'Libro Digital', value: 'libro_digital' },
  { label: 'Capítulo de Libro', value: 'capitulo_libro' },
  { label: 'Texto de la Carrera', value: 'texto_carrera' },
  { label: 'Material Docente Interno', value: 'material_docente' },
  { label: 'Patente', value: 'patente' }
]

const databaseOptions = [
  'Scopus',
  'Web of Science',
  'IEEE Xplore',
  'Springer Link',
  'ScienceDirect',
  'SciELO',
  'Google Scholar',
  'Otro'
]

const levelOptions = [
  { label: 'Q1', value: 1 },
  { label: 'Q2', value: 2 },
  { label: 'Q3', value: 3 },
  { label: 'Q4', value: 4 },
  { label: 'No indexado', value: 0 }
]

// Enviar datos
async function onSubmit(event: FormSubmitEvent<SchemaType>) {
  const payload = {
    ...event.data,
    anno: Number(event.data.anno),
    nivel: Number(event.data.nivel),
  }
  console.log('Payload being sent:', payload)
  const result = await publicationStore.createPublication(payload)

  if (result) {
    toast.add({
      title: 'Publicación registrada',
      description: 'La publicación se ha guardado correctamente',
      color: 'success',
      icon: 'i-heroicons-check-circle-20-solid'
    })
    router.push('/publicaciones') // Redirigir a la lista
  } else {
    toast.add({
      title: 'Error',
      description: publicationStore.error || 'Error al registrar la publicación',
      color: 'error',
      icon: 'i-heroicons-exclamation-circle-20-solid'
    })
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
    <UCard
        class="w-full max-w-2xl"
    >
      <template #header>
        <h2 class="text-xl font-bold text-gray-900 dark:text-white">
          Registrar publicación
        </h2>
      </template>

      <div class="flex flex-col space-y-2 w-full">
        <!-- Título y Año -->
        <div class="grid grid-cols-3 w-full gap-4">
          <UFormField class="w-full col-span-2" label="Título" name="titulo" required>
            <UInput class="w-full" v-model="state.titulo" placeholder="Título completo de la publicación"/>
          </UFormField>

          <UFormField class="w-full col-span-1" label="Año" name="anno" required>
            <UInput
                class="w-full"
                v-model.number="state.anno"
                type="number"
                min="1900"
                :max="new Date().getFullYear()"
                placeholder="Año"
            />
          </UFormField>
        </div>

        <div class="grid grid-cols-2 w-full gap-4">
          <!-- Editorial y Tipo -->
          <UFormField label="Editorial" name="revista_editorial" required>
            <UInput class="w-full" v-model="state.revista_editorial" placeholder="Nombre de la editorial"/>
          </UFormField>

          <UFormField label="Tipo de publicación" name="tipo_publicacion" required>
            <USelect class="w-full"
                     v-model="state.tipo_publicacion"
                     :items="publicationTypes"
                     placeholder="Seleccione el tipo"
                     icon="i-heroicons-chevron-down-20-solid"
            />
          </UFormField>
        </div>

        <!-- ISBN/ISSN y Base de datos -->
        <UFormField label="ISBN/ISSN" name="isbn_issn" required>
          <UInput class="w-full" v-model="state.isbn_issn" placeholder="Identificador único"/>
        </UFormField>

        <UFormField label="Verificación de libro" name="verificacion_libro" required>
          <UInput class="w-full" v-model="state.verificacion_libro" placeholder="Verificación del libro"/>
        </UFormField>

        <UFormField label="Base de datos" name="base_datos_revista" required>
          <USelect class="w-full"
                   v-model="state.base_datos_revista"
                   :items="databaseOptions"
                   placeholder="Seleccione la base"
                   icon="i-heroicons-chevron-down-20-solid"
          />
        </UFormField>

        <!-- Referencia y Nivel -->
        <UFormField label="Referencia de verificación" name="verificacion_referencia" required>
          <UInput class="w-full" v-model="state.verificacion_referencia" placeholder="DOI, URL o referencia"/>
        </UFormField>

        <UFormField label="Nivel de indexación" name="nivel" required>
          <USelect class="w-full"
                   v-model.number="state.nivel"
                   :items="levelOptions"
                   placeholder="Seleccione el nivel"
                   icon="i-heroicons-chevron-down-20-solid"
          />
        </UFormField>

        <UFormField label="Clasificación" name="clasificacion" required>
          <USelect class="w-full"
                   v-model="state.clasificacion"
                   :items="publicationStore.classifications.map(c => ({ label: c.nombre, value: c.id }))"
                   placeholder="Seleccione la clasificación"
                   icon="i-heroicons-chevron-down-20-solid"
          />
        </UFormField>
      </div>

      <template #footer>
        <div class="flex justify-between">
          <UButton
              type="button"
              color="neutral"
              label="Cancelar"
              icon="i-heroicons-x-mark-20-solid"
              @click="router.back()"
          />
          <UButton
              type="submit"
              color="primary"
              label="Registrar publicación"
              :loading="publicationStore.isLoading"
              icon="i-heroicons-check-circle-20-solid"
          />
        </div>
      </template>
    </UCard>
  </UForm>
</template>