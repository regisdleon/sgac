<style>
@import "tailwindcss";
@import "@nuxt/ui";
</style>


<script setup lang="ts">

definePageMeta( {
  middleware : ["auth"],
} );

const toaster = {
  position : 'top-right',
  expand : false,
  duration : 3000,
}

</script>

<template>
  <div>
    <UApp :toaster='toaster'>
      <NuxtLayout>
        <NuxtPage/>
      </NuxtLayout>
    </UApp>
  </div>
</template>
