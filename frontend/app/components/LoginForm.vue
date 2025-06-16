<script setup>
import {ref} from "vue";
import {z} from "zod";

const emit = defineEmits(["login"]);

const schema = z.object({
  email: z.string().email("Formato incorrecto"),
  password: z.string(),
});

const form = ref({
  email: "",
  password: "",
});

const handleSubmit = async () => {
  emit("login", form.value);
};
</script>

<template>
  <div class="min-h-screen flex items-center justify-center py-12 px-4">
    <UForm
        :state="form"
        :schema="schema"
        @submit="handleSubmit"
        class="space-y-4"
    >
      <UCard
          class="min-w-md "
      >
        <h2 class="text-2xl font-bold text-center mb-6">
          SGAC
        </h2>


        <UFormField label="Correo electrónico" class="mb-4 block" name="email">
          <UInput
              v-model="form.email"
              placeholder="johndoe@gmail.com"
              class="w-full"
          />
        </UFormField>

        <UFormField label="Contraseña" class="mb-4 block" name="password">
          <UInput
              v-model="form.password"
              type="password"
              placeholder="********"
              class="w-full"
          />
        </UFormField>


        <div class="mt-8">
          <UButton type="submit" color="primary" block class="w-full py-2">
            Iniciar sessión
          </UButton>
        </div>


        <div class="text-center mt-4 text-sm text-gray-600 dark:text-gray-400">
          ¿No tienes una cuenta?
          <NuxtLink
              to="/auth/register"
              class="text-primary-600 hover:underline font-medium"
          >
            Regístrate aquí
          </NuxtLink>
        </div>
      </UCard>
    </UForm>
  </div>
</template>
