<script setup lang="ts">
import DashboardSidebar from '@/components/layouts/DashboardSidebar.vue';
import DashboardNavbar from '@/components/layouts/DashboardNavbar.vue';
import DashboardFooter from '@/components/layouts/DashboardFooter.vue';
</script>

<template>
  <div class="flex h-screen bg-white text-gray-800">
    <DashboardSidebar/>
    <div class="flex flex-col flex-1">
      <DashboardNavbar/>
      <main class="p-4 flex-1 overflow-y-auto">
        <slot/>
      </main>
      <DashboardFooter/>
    </div>
  </div>
</template>
