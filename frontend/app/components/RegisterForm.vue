<script setup>
import {ref} from "vue";
import {z} from "zod";

const form = ref({
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
});

const schema = z
    .object({
      name: z.string().min(1, "Name is required"),
      email: z.string().email("Invalid email"),
      password: z.string().min(8, "Must be at least 6 characters"),
      confirmPassword: z.string().min(6, "Must be at least 6 characters"),
    })
    .refine((data) => data.password === data.confirmPassword, {
      path: ["confirmPassword"],
      message: "Passwords do not match",
    });

const emit = defineEmits(["register"]);

const handleSubmit = async () => {
  emit("register", form.value);
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
        <h2 class="text-2xl font-bold text-center mb-6 dark:text-white">
          Registro
        </h2>

        <UFormField label="Nombre" class="mb-4 block" name="name">
          <UInput v-model="form.name" placeholder="John Doe" class="w-full"/>
        </UFormField>

        <UFormField label="Correo electrónico" class="mb-4 block" name="email">
          <UInput
              v-model="form.email"
              class="w-full"
              placeholder="johndoe@gmail.com"
          />
        </UFormField>

        <UFormField label="Contraseña" class="mb-4 block" name="password">
          <UInput
              v-model="form.password"
              type="password"
              class="w-full"
              placeholder="********"
          />
        </UFormField>

        <UFormField
            label="Confirmar contraseña"
            class="mb-4 block"
            name="confirmPassword"
        >
          <UInput
              v-model="form.confirmPassword"
              type="password"
              class="w-full"
              placeholder="********"
          />
        </UFormField>

        <div class="mt-6">
          <UButton type="submit" color="primary" block class="w-full py-2">
            Registrar
          </UButton>
        </div>

        <div class="text-center mt-4 text-sm text-gray-600 dark:text-gray-400">
          ¿Ya tienes cuenta?
          <NuxtLink to="/auth/login" class="text-primary-600 hover:underline">
            Inicia sesión
          </NuxtLink>

        </div>
      </UCard>
    </UForm>
  </div>
</template>
