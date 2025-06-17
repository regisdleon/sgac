<template>
  <!-- No changes to template section -->
</template>

<script setup lang="ts">
import { onMounted, reactive } from 'vue'
import { useRoute } from 'vue-router'
import { usePublicationStore } from '../stores/publication'

// Asegúrate de tener esta declaración o importa SchemaType correctamente
type SchemaType = {
  id: string
  anno: number
  titulo: string
  revistaEditorial: string
  tipoPublicacion: string
  isbnIssn: string
  verificacionLibro: string
  baseDatosRevista: string
  verificacionReferencia: string
  nivel: number
}

const route = useRoute()
const publicationStore = usePublicationStore()

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
  nivel: 1
})

onMounted(async () => {
  const publicationId = route.params.id as string
  if (publicationId) {
    const pub = await publicationStore.fetchPublicationById(publicationId)
    console.log('Fetched publication:', pub)
    if (pub) {
      state.id = pub.id
      state.anno = pub.anno
      state.titulo = pub.titulo
      state.revistaEditorial = pub.revistaEditorial
      state.tipoPublicacion = pub.tipoPublicacion
      state.isbnIssn = pub.isbnIssn
      state.verificacionLibro = pub.verificacionLibro
      state.baseDatosRevista = pub.baseDatosRevista
      state.verificacionReferencia = pub.verificacionReferencia
      state.nivel = pub.nivel
    }
  }
})
</script>

<style>
  /* No changes to style section */
</style> 