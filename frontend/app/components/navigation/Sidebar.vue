<script setup lang="ts">
import type { Component, FunctionalComponent } from 'vue';
import { ref } from 'vue';
import { Menu } from 'lucide-vue-next';

export interface SidebarItem {
  label: string;
  to: string;
  icon: FunctionalComponent;
}

const props = defineProps<{
  items: SidebarItem[]
}>();

const isCollapsed = ref(false);

function toggleSidebar() {
  isCollapsed.value = !isCollapsed.value;
}
</script>

<template>
  <aside :class="[
    'bg-white shadow-md h-full flex flex-col transition-width duration-300 rounded-r-lg',
    isCollapsed ? 'w-20' : 'w-64'
  ]">
    <!-- Logo + Toggle -->
    <div :class="['h-[80px] px-4 shadow-sm flex items-center', isCollapsed ? 'justify-center' : 'justify-between']">
      <NuxtLink to="/inicio"
        :class="['text-primary-600 flex items-center space-x-2', isCollapsed ? 'hidden' : 'text-2xl font-bold']">
        <slot name="logo" />
        <span v-if="!isCollapsed">
          <slot name="logo-text">MiApp</slot>
        </span>
      </NuxtLink>

      <button @click="toggleSidebar" class="focus:outline-none cursor-pointer ">
        <Menu class="w-6 h-6 " />
      </button>
    </div>

    <!-- Navegación -->
    <nav class="flex-1 p-4 space-y-2 overflow-y-auto">
      <NuxtLink v-for="item in items" :key="item.to" :to="item.to"
        class="flex items-center space-x-3 hover:bg-primary-100 rounded-md px-4 py-2"
        active-class="text-black bg-primary-100">
        <component :is="item.icon" class="w-5 h-5" />
        <span v-if="!isCollapsed">{{ item.label }}</span>
      </NuxtLink>
    </nav>
  </aside>
</template>

<style scoped>
.transition-width {
  transition-property: width;
}
</style>
