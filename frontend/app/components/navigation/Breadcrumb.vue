<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { BreadcrumbItem } from '@nuxt/ui'

const route = useRoute()
const router = useRouter()

// Opcional: mapea segmentos a labels e iconos (personalízalo)
const labelMap : Record<string, string> = {
  dashboard : 'Dashboard',
  components : 'Components',
  breadcrumb : 'Breadcrumb'
}

const iconMap : Record<string, string> = {
  dashboard : 'i-lucide-layout-dashboard',
  components : 'i-lucide-box',
  breadcrumb : 'i-lucide-link'
}

// Computed que genera breadcrumb items a partir del path
const breadcrumbItems = computed<BreadcrumbItem[]>( () => {
  // Obtenemos el path limpio sin query ni hash
  const fullPath = route.path.split( '?' )[ 0 ].split( '#' )[ 0 ]

  // Dividimos el path en segmentos, ignoramos primer vacío por '/'
  const segments = fullPath.split( '/' ).filter( Boolean )

  // Construimos items acumulando el path
  let accumulatedPath = ''
  const items = segments.map( ( seg ) => {
    accumulatedPath += '/' + seg

    return {
      label : labelMap[ seg ] || seg.charAt( 0 ).toUpperCase() + seg.slice( 1 ), // Capitaliza si no hay labelMap
      to : accumulatedPath,
      icon : iconMap[ seg ] || undefined
    }
  } )

  // Opcionalmente agregar item Home manualmente al inicio
  items.unshift( {
    label : 'Home',
    to : '/',
    icon : 'i-lucide-home'
  } )

  return items
} )
</script>

<template>
  <UBreadcrumb :items="breadcrumbItems"/>
</template>
