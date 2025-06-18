<script setup lang="ts">
import {
  Book,
  BookOpenCheck,
  CalendarFold,
  ComponentIcon,
  Component,
  Home,
  LayoutDashboard,
  Trophy,
  Users, LucidePenOff} from 'lucide-vue-next';
import Sidebar, { type SidebarItem } from '@/components/navigation/Sidebar.vue';

const { user } = useUserSession()

const sidebarItems: any[] = [
  { label: 'Dashboard', to: '/inicio', icon: Home },
  { label: 'Carreras', to: '/carreras', icon: ComponentIcon },
  { label: 'Profesores', to: '/profesores', icon: LucidePenOff },
  { label: 'Evaluación', to: '/evaluacion-profesor', icon: Users },
  { label: 'Asignaturas', to: '/asignaturas', icon: Book },
  { label: 'Disciplinas', to: '/disciplinas', icon: Component },
  { label: 'Eventos', to: '/eventos', icon: CalendarFold },
  { label: 'Premios', to: '/premios', icon: Trophy },
  { label: 'Publicaciones', to: '/publicaciones', icon: BookOpenCheck },
  { label: 'Reportes', to: '/reportes', icon: BookOpenCheck },
  user.value?.role === 'ADMIN'
    ? { label: 'Usuarios', to: '/usuarios', icon: Users }
    : null
].filter(Boolean)

</script>

<template>
  <Sidebar :items="sidebarItems">
    <template #logo>
      <LayoutDashboard class="w-6 h-6" />
    </template>
    <template #logo-text>
      MiApp
    </template>
  </Sidebar>
</template>
