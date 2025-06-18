<script setup lang="ts">
import { ref, onMounted, reactive, watchEffect } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { usePrizeStore } from './store'
import { useProfessorStore } from '~/stores/professor'
const toast = useToast()

definePageMeta({ layout: 'dashboard' })

const router = useRouter()
const route = useRoute()
const prizeStore = usePrizeStore()
const professorStore = useProfessorStore()
const loading = ref(false)

const state = reactive({
  profesor: '',
  anno: new Date().getFullYear(),
  descripcion: '',
  clasificacion: ''
})

// Opciones de clasificación: value = clave, label = visible
const clasificaciones = [
  { value: 'PREMIO_NACIONAL_ACC', label: 'Premio nacional de la ACC' },
  { value: 'PREMIO_PROVINCIAL_ACC', label: 'Premio provincial de la ACC' },
  { value: 'PREMIO_NACIONAL_CITMA', label: 'Premio nacional del CITMA' },
  { value: 'PREMIO_PROVINCIAL_CITMA', label: 'Premio provincial del CITMA' },
  { value: 'PREMIOS_EVENTOS_CIENTIFICOS', label: 'Premios de eventos científicos' },
  { value: 'PREMIOS_CIENTIFICOS_INTERNACIONALES', label: 'Premios científicos internacionales' },
  { value: 'DISTINCION_MINISTRO', label: 'Distinción del ministro' },
  { value: 'PREMIO_RECTOR', label: 'Premio del rector' },
  { value: 'PREMIO_DECANO', label: 'Premio de decano' },
  { value: 'CONDECORACIONES_NACIONALES', label: 'Condecoraciones nacionales' },
  { value: 'CONDECORACIONES_INTERNACIONALES', label: 'Condecoraciones internacionales' },
  { value: 'RECONOCIMIENTOS_ORG_ESTUDIANTILES', label: 'Reconocimientos de las organizaciones estudiantiles' },
  { value: 'OTROS_PREMIOS_CIENTIFICOS', label: 'Otros premios científicos' },
  { value: 'OTROS', label: 'Otros' }
]

onMounted(async () => {
  await professorStore.fetchProfessors()
  const id = route.query.id || route.params.id
  if (id) {
    const premio = await prizeStore.fetchPrizeById(id)
    if (premio) {
      state.profesor = premio.profesor || ''
      state.anno = Number(premio.anno) || new Date().getFullYear()
      state.descripcion = premio.descripcion || ''
      state.clasificacion = premio.clasificacion || ''
    }
  }
})

const handleSubmit = async () => {
  if (!prizeStore.currentPrize) return
  loading.value = true
  try {
    await prizeStore.updatePrize({
      id: prizeStore.currentPrize.id,
      profesor: state.profesor,
      anno: Number(state.anno),
      descripcion: state.descripcion,
      clasificacion: state.clasificacion
    })
    toast.add({
      title: 'Premio actualizado',
      description: 'El premio se ha actualizado correctamente',
      color: 'success'
    })
    router.push('/premios')
  } catch (error) {
    console.error('Error al actualizar el premio:', error)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div v-if="prizeStore.currentPrize">
    <UForm :state="state" @submit.prevent="handleSubmit" class="flex justify-center w-full">
      <UCard class="w-full max-w-2xl">
        <template #header>
          <h2 class="text-xl font-bold text-gray-900 dark:text-white">
            Actualizar Premio
          </h2>
        </template>
        <div class="flex flex-col space-y-4">
          <!-- Profesor -->
          <UFormField label="Profesor" name="profesor" required>
            <USelect
              class="w-full"
              v-model="state.profesor"
              :items="professorStore.professors.map(prof => ({
                label: `${prof.nombre} ${prof.primerApellido} ${prof.segundoApellido}`,
                value: prof.id
              }))"
              placeholder="Seleccione un profesor"
            />
          </UFormField>
          <!-- Año y Clasificación -->
          <div class="grid grid-cols-2 gap-4">
            <UFormField label="Año" name="anno" required>
              <UInput
                class="w-full"
                v-model="state.anno"
                type="number"
                min="1900"
                :max="new Date().getFullYear()"
              />
            </UFormField>
            <UFormField label="Clasificación" name="clasificacion" required>
              <USelect
                class="w-full"
                v-model="state.clasificacion"
                :items="clasificaciones"
                option-attribute="label"
                value-attribute="value"
                placeholder="Seleccione la clasificación"
              />
            </UFormField>
          </div>
          <!-- Descripción -->
          <UFormField label="Descripción" name="descripcion" required>
            <UTextarea
              class="w-full"
              v-model="state.descripcion"
              placeholder="Descripción del premio..."
              :rows="4"
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
              :loading="loading"
              label="Actualizar"
            />
          </div>
        </template>
      </UCard>
    </UForm>
  </div>
  <div v-else class="flex justify-center items-center h-64">
    <span class="text-gray-500">Cargando datos del premio...</span>
  </div>
</template>