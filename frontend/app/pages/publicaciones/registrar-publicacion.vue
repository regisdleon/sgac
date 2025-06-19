<script setup lang="ts">
import { z } from 'zod'
import type { FormSubmitEvent } from "#ui/types";
import { usePublicationStore } from "~/pages/publicaciones/store";
import { useProfessorStore } from '~/stores/professor'
import { useCareerStore } from '~/stores/career'

definePageMeta( { layout : 'dashboard' } )

const toast = useToast()
const router = useRouter()
const publicationStore = usePublicationStore()
const professorStore = useProfessorStore()
const careerStore = useCareerStore()
const selectedCareer = computed(() => careerStore.selectedCareer)
const filteredProfessors = computed(() => {
  if (!selectedCareer.value) return []
  return professorStore.professors.filter(p => p.carreraId === selectedCareer.value.id)
})
const authorPrincipal = ref(null)
const coauthors = ref([])

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
  anno: new Date().getFullYear(),
  titulo: '',
  revistaEditorial: '',
  tipoPublicacion: '',
  isbnIssn: '',
  baseDatosRevista: '',
  verificacionLibro: '',
  verificacionReferencia: '',
  nivel: 1,
})

onMounted(async () => {
  await publicationStore.fetchPublicationClassifications();
  await professorStore.fetchProfessors();
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
async function onSubmit(event: FormSubmitEvent<SchemaType>) {
  const payload = {
    ...event.data,
    anno: Number(event.data.anno),
    nivel: Number(event.data.nivel),
  }
  const result = await publicationStore.createPublication(payload)
  if (result) {
    // Crear relación autor principal
    if (authorPrincipal.value) {
      await $fetch(`/api/publicaciones/${result.id}/profesores`, {
        method: 'POST',
        body: { profesor: authorPrincipal.value, participacion: 'AUTOR_PRINCIPAL' }
      })
    }
    // Crear relaciones coautores
    for (const coauthorId of coauthors.value) {
      await $fetch(`/api/publicaciones/${result.id}/profesores`, {
        method: 'POST',
        body: { profesor: coauthorId, participacion: 'COAUTOR' }
      })
    }
    toast.add({
      title: 'Publicación registrada',
      description: 'La publicación se ha guardado correctamente',
      color: 'success',
      icon: 'i-heroicons-check-circle-20-solid'
    })
    router.push('/publicaciones')
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

        <!-- NUEVO: Autor principal y Coautores -->
        <div class="grid grid-cols-2 w-full gap-4">
          <UFormField label="Autor principal" required>
            <USelect
              v-model="authorPrincipal"
              :items="professorStore.professors.map(prof => ({ label: `${prof.nombre} ${prof.primerApellido} ${prof.segundoApellido || ''}`, value: prof.id }))"
              placeholder="Seleccione el autor principal"
            />
          </UFormField>
          <UFormField label="Coautores">
            <USelect
              v-model="coauthors"
              :items="professorStore.professors.map(prof => ({ label: `${prof.nombre} ${prof.primerApellido} ${prof.segundoApellido || ''}`, value: prof.id }))"
              multiple
              placeholder="Seleccione los coautores"
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

        <!-- ISBN/ISSN y Base de datos -->
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