<script setup lang="ts">
import { z } from 'zod'
import type { FormSubmitEvent } from "#ui/types";
import { usePublicationStore } from "~/pages/publicaciones/store";
import { onMounted, reactive, watchEffect } from 'vue';
import { useRoute, useRouter } from 'vue-router';

definePageMeta( { layout : 'dashboard' } )

const toast = useToast()
const router = useRouter()
const route = useRoute()
const publicationStore = usePublicationStore()

const schema = z.object({
  id: z.string().optional(),
  anno: z.number().min(1900, 'Debe ser un año válido').max(new Date().getFullYear(), 'El año no puede ser en el futuro'),
  titulo: z.string().min(5, 'Título demasiado corto'),
  revistaEditorial: z.string().min(2, 'Editorial requerida'),
  tipoPublicacion: z.string().min(1, 'Tipo requerido'),
  isbnIssn: z.string().min(5, 'ISBN/ISSN requerido'),
  verificacionLibro: z.string().min(1, 'Verificación de libro requerida'),
  baseDatosRevista: z.string().min(1, 'Base de datos requerida'),
  verificacionReferencia: z.string().min(1, 'Referencia requerida'),
  nivel: z.number().min(1, 'Nivel mínimo es 1').max(4, 'Nivel máximo es 4'),
})

type SchemaType = z.infer<typeof schema>;

const state = reactive<SchemaType>({
  id: '',
  anno: new Date().getFullYear(),
  titulo: '',
  revistaEditorial: '',
  tipoPublicacion: '',
  isbnIssn: '',
  verificacionLibro: '',
  baseDatosRevista: '',
  verificacionReferencia: '',
  nivel: 1,
})

onMounted(async () => {
  const publicationId = route.params.id as string;
  if (publicationId) {
    await publicationStore.fetchPublicationById(publicationId);
  }
});

watchEffect(() => {
  if (publicationStore.currentPublication) {
    state.id = publicationStore.currentPublication.id;
    state.anno = publicationStore.currentPublication.anno;
    state.titulo = publicationStore.currentPublication.titulo;
    state.revistaEditorial = publicationStore.currentPublication.revistaEditorial;
    state.tipoPublicacion = publicationStore.currentPublication.tipoPublicacion;
    state.isbnIssn = publicationStore.currentPublication.isbnIssn;
    state.verificacionLibro = publicationStore.currentPublication.verificacionLibro;
    state.baseDatosRevista = publicationStore.currentPublication.baseDatosRevista;
    state.verificacionReferencia = publicationStore.currentPublication.verificacionReferencia;
    state.nivel = publicationStore.currentPublication.nivel;
  }
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

const levelOptions = [
  { label: 'Nivel 1', value: 1 },
  { label: 'Nivel 2', value: 2 },
  { label: 'Nivel 3', value: 3 },
  { label: 'Nivel 4', value: 4 }
]

// Enviar datos
async function onSubmit(e?: Event) {
  // Usar directamente el state
  const payload = {
    ...state,
    anno: Number(state.anno),
    nivel: Number(state.nivel),
  }
  const result = await publicationStore.updatePublication(payload)

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
  <form
      @submit.prevent="onSubmit"
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
          <UFormField label="Editorial" name="revistaEditorial" required>
            <UInput class="w-full" v-model="state.revistaEditorial" placeholder="Nombre de la editorial"/>
          </UFormField>

          <UFormField label="Tipo de publicación" name="tipoPublicacion" required>
            <USelect class="w-full"
                     v-model="state.tipoPublicacion"
                     :items="publicationTypes"
                     placeholder="Seleccione el tipo"
                     icon="i-heroicons-chevron-down-20-solid"
            />
          </UFormField>
        </div>

        <!-- ISBN/ISSN y Verificación de libro -->
        <UFormField label="ISBN/ISSN" name="isbnIssn" required>
          <UInput class="w-full" v-model="state.isbnIssn" placeholder="Identificador único"/>
        </UFormField>

        <UFormField label="Verificación de libro" name="verificacionLibro" required>
          <UInput class="w-full" v-model="state.verificacionLibro" placeholder="Verificación del libro"/>
        </UFormField>

        <UFormField label="Base de datos" name="baseDatosRevista" required>
          <UInput class="w-full" v-model="state.baseDatosRevista" placeholder="Nombre de la base de datos"/>
        </UFormField>

        <!-- Referencia y Nivel -->
        <UFormField label="Referencia de verificación" name="verificacionReferencia" required>
          <UInput class="w-full" v-model="state.verificacionReferencia" placeholder="DOI, URL o referencia"/>
        </UFormField>

        <UFormField label="Nivel" name="nivel" required>
          <USelect class="w-full"
                   v-model.number="state.nivel"
                   :items="levelOptions"
                   placeholder="Seleccione el nivel"
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
  </form>
</template>