<script setup>
import { ref } from "vue";
const form = ref({
  name: "",
  username: "",
  password: "",
  confirmPassword: "",
});
</script>

<template>
  <div class="min-h-screen flex items-center justify-center py-12 px-4">
    <div
      class="max-w-md w-full mx-auto p-8 bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-gray-700/30"
    >
      <h2 class="text-2xl font-bold text-center mb-6 dark:text-white">
        Create Account
      </h2>

      <div class="space-y-6">
        <form @submit.prevent class="space-y-4">
          <UFormGroup label="Name" class="mb-4 block">
            <UInput
              v-model="form.name"
              placeholder="Enter your full name"
              class="w-full"
            />
          </UFormGroup>

          <UFormGroup label="Username" class="mb-4 block">
            <UInput
              v-model="form.username"
              placeholder="Choose a username"
              class="w-full"
            />
          </UFormGroup>

          <UFormGroup label="Password" class="mb-4 block">
            <UInput
              v-model="form.password"
              type="password"
              placeholder="Create a password"
              class="w-full"
            />
          </UFormGroup>

          <UFormGroup label="Confirm Password" class="mb-4 block">
            <UInput
              v-model="form.confirmPassword"
              type="password"
              placeholder="Confirm your password"
              class="w-full"
            />
          </UFormGroup>

          <div class="mt-6">
            <UButton type="submit" color="primary" block class="w-full py-2">
              Sign Up
            </UButton>
          </div>
        </form>

        <div class="relative flex items-center py-4">
          <div
            class="flex-grow border-t border-gray-200 dark:border-gray-600"
          ></div>
          <span
            class="flex-shrink mx-4 text-gray-400 dark:text-gray-500 text-sm"
            >or continue with</span
          >
          <div
            class="flex-grow border-t border-gray-200 dark:border-gray-600"
          ></div>
        </div>

        <div class="space-y-3">
          <UButton block class="w-full flex items-center justify-center">
            <template #leading>
              <UIcon name="i-simple-icons-github" class="mr-2" />
            </template>
            Sign up with GitHub
          </UButton>

          <UButton block class="w-full flex items-center justify-center">
            <template #leading>
              <UIcon name="i-heroicons-key" class="mr-2" />
            </template>
            Sign up with Passkey
          </UButton>
        </div>
      </div>
    </div>
  </div>
</template>
