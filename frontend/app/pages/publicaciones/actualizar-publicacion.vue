<script setup lang="ts">
import { z } from 'zod'
import type { FormSubmitEvent } from "#ui/types";
import { usePublicationStore } from "~/pages/publicaciones/store";

definePageMeta( { layout : 'dashboard' } )

const toast = useToast()
const router = useRouter()
const publicationStore = usePublicationStore()

const schema = z.object( {
  id : z.string().optional(),
  year : z.string().min( 4, 'Debe ser un año válido' ).max( 4 ),
  title : z.string().min( 5, 'Título demasiado corto' ),
  editorial : z.string().min( 2, 'Editorial requerida' ),
  type : z.string().min( 1, 'Tipo requerido' ),
  isbnIssn : z.string().min( 5, 'ISBN/ISSN requerido' ),
  dataBase : z.string().min( 1, 'Base de datos requerida' ),
  verificationReference : z.string().min( 5, 'Referencia requerida' ),
  level : z.string().min( 1, 'Nivel requerido' ),
} )

type SchemaType = z.infer<typeof schema>;

const state = reactive<SchemaType>( {
  year : publicationStore.currentPublication?.year!,
  title : publicationStore.currentPublication?.title!,
  editorial : publicationStore.currentPublication?.editorial!,
  type : publicationStore.currentPublication?.type!,
  isbnIssn : publicationStore.currentPublication?.isbnIssn!,
  dataBase : publicationStore.currentPublication?.dataBase!,
  verificationReference : publicationStore.currentPublication?.verificationReference!,
  level : publicationStore.currentPublication?.level!,
} )

// Opciones para los selects
const publicationTypes = [
  'Libro',
  'Artículo de revista',
  'Artículo de conferencia',
  'Capítulo de libro',
  'Reporte técnico',
  'Tesis'
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
async function onSubmit( event : FormSubmitEvent<SchemaType> ) {
  const result = await publicationStore.createPublication( event.data )

  if ( result ) {
    toast.add( {
      title : 'Publicación registrada',
      description : 'La publicación se ha guardado correctamente',
      color : 'success'
    } )
    router.push( '/publicaciones' ) // Redirigir a la lista
  } else {
    toast.add( {
      title : 'Error',
      description : publicationStore.error || 'Error al registrar la publicación',
      color : 'error',
    } )
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

          <UFormField class="w-full col-span-2" label="Título" name="title" required>
            <UInput class="w-full" v-model="state.title" placeholder="Título completo de la publicación"/>
          </UFormField>

          <UFormField class="w-full col-span-1" label="Año" name="year" required>
            <UInput
                class="w-full"
                v-model="state.year"
                type="number"
                min="1900"
                :max="new Date().getFullYear()"
                placeholder="Año"
            />
          </UFormField>
        </div>

        <div class="grid grid-cols-2 w-full gap-4">

          <!-- Editorial y Tipo -->
          <UFormField label="Editorial" name="editorial" required>
            <UInput class="w-full" v-model="state.editorial" placeholder="Nombre de la editorial"/>
          </UFormField>

          <UFormField label="Tipo de publicación" name="type" required>
            <USelect class="w-full"
                     v-model="state.type"
                     :items="publicationTypes"
                     placeholder="Seleccione el tipo"
            />
          </UFormField>

        </div>
        <!-- ISBN/ISSN y Base de datos -->
        <UFormField label="ISBN/ISSN" name="isbnIssn" required>
          <UInput class="w-full" v-model="state.isbnIssn" placeholder="Identificador único"/>
        </UFormField>

        <UFormField label="Base de datos" name="dataBase" required>
          <USelect class="w-full"
                   v-model="state.dataBase"
                   :items="databaseOptions"
                   placeholder="Seleccione la base"
          />
        </UFormField>

        <!-- Referencia y Nivel -->
        <UFormField label="Referencia de verificación" name="verificationReference" required>
          <UInput class="w-full" v-model="state.verificationReference" placeholder="DOI, URL o referencia"/>
        </UFormField>

        <UFormField label="Nivel de indexación" name="level" required>
          <USelect class="w-full"
                   v-model="state.level"
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