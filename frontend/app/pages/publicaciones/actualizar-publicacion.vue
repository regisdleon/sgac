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
  anno: z.string().min(4, 'Debe ser un año válido').max(4),
  titulo: z.string().min(5, 'Título demasiado corto'),
  revista_editorial: z.string().min(2, 'Editorial requerida'),
  tipo_publicacion: z.string().min(1, 'Tipo requerido'),
  isbn_issn: z.string().min(5, 'ISBN/ISSN requerido'),
  base_datos_revista: z.string().min(1, 'Base de datos requerida'),
  verificacion_referencia: z.string().min(5, 'Referencia requerida'),
  nivel: z.string().min(1, 'Nivel requerido'),
})

type SchemaType = z.infer<typeof schema>;

const state = reactive<SchemaType>({
  anno: publicationStore.currentPublication?.anno?.toString() || '',
  titulo: publicationStore.currentPublication?.titulo || '',
  revista_editorial: publicationStore.currentPublication?.revista_editorial || '',
  tipo_publicacion: publicationStore.currentPublication?.tipo_publicacion || '',
  isbn_issn: publicationStore.currentPublication?.isbn_issn || '',
  base_datos_revista: publicationStore.currentPublication?.base_datos_revista || '',
  verificacion_referencia: publicationStore.currentPublication?.verificacion_referencia || '',
  nivel: publicationStore.currentPublication?.nivel?.toString() || '',
})

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
  'Q1',
  'Q2',
  'Q3',
  'Q4',
  'No indexado'
]

// Enviar datos
async function onSubmit(event: FormSubmitEvent<SchemaType>) {
  const result = await publicationStore.updatePublication(event.data)

  if (result) {
    toast.add({
      title: 'Publicación actualizada',
      description: 'La publicación se ha actualizado correctamente',
      color: 'success'
    })
    router.push('/publicaciones') // Redirigir a la lista
  } else {
    toast.add({
      title: 'Error',
      description: publicationStore.error || 'Error al actualizar la publicación',
      color: 'error',
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
          Actualizar publicación
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
                v-model="state.anno"
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
            />
          </UFormField>

        </div>
        <!-- ISBN/ISSN y Base de datos -->
        <UFormField label="ISBN/ISSN" name="isbn_issn" required>
          <UInput class="w-full" v-model="state.isbn_issn" placeholder="Identificador único"/>
        </UFormField>

        <UFormField label="Base de datos" name="base_datos_revista" required>
          <USelect class="w-full"
                   v-model="state.base_datos_revista"
                   :items="databaseOptions"
                   placeholder="Seleccione la base"
          />
        </UFormField>

        <!-- Referencia y Nivel -->
        <UFormField label="Referencia de verificación" name="verificacion_referencia" required>
          <UInput class="w-full" v-model="state.verificacion_referencia" placeholder="DOI, URL o referencia"/>
        </UFormField>

        <UFormField label="Nivel de indexación" name="nivel" required>
          <USelect class="w-full"
                   v-model="state.nivel"
                   :items="levelOptions"
                   placeholder="Seleccione el nivel"
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
              label="Actualizar"
              :loading="publicationStore.isLoading"
          />
        </div>
      </template>
    </UCard>
  </UForm>
</template>