<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ChevronDown } from 'lucide-vue-next'
import CustomModal from '~/components/modals/CustomModal.vue'

const overlay = useOverlay()

async function openConfirm() {
  const modal = overlay.create( CustomModal, {
    props : {
      title : '¿Cerrar sesión?',
      description : '¿Estás seguro de que quieres cerrar sesión?',
      confirmText : 'Sí, cerrar sesión',
      cancelText : 'Cancelar',
      onConfirm : () => {
        // acción real, por ejemplo:
        clear()
        router.push( '/auth/login' )
      }
    }
  } )

  const result = await modal.open().result

  if ( result ) {
    // El usuario confirmó (onConfirm ya fue ejecutado dentro del modal)
    console.log( 'Confirmado por el usuario' )
  } else {
    // El usuario canceló
    console.log( 'Cancelado por el usuario' )
  }
}

const { clear, user } = useUserSession()

const router = useRouter()

const dropdownOpen = ref( false )

const showConfirm = ref( false )

function toggleDropdown() {
  dropdownOpen.value = !dropdownOpen.value
}

function goToProfile() {
  dropdownOpen.value = false
  router.push( '/ajustes/profile' )
}

</script>

<template>
  <div class="bg-white shadow px-6 h-[80px] flex justify-end items-center">
    <!-- User Popover -->
    <UPopover
        v-model:open="dropdownOpen"
        :dismissible="true"
        :ui="{ content: 'w-64 p-4 bg-white border border-gray-200 rounded-xl shadow-xl' }"
    >
      <!-- Avatar trigger -->
      <template #anchor>
        <button
            class="flex items-center gap-3 cursor-pointer focus:outline-none"
            @click="toggleDropdown"
            aria-haspopup="true"
            :aria-expanded="dropdownOpen"
            type="button"
        >
          <UAvatar
              src="https://i.pravatar.cc/100?img=3"
              alt="Avatar"
              size="md"
              class="ring-2 ring-primary-500"
          />
          <div class="text-left hidden sm:block">
            <p class="text-sm font-semibold text-gray-900">{{ user?.name }}</p>
            <p class="text-xs text-gray-500">{{ user?.email }}</p>
          </div>
          <ChevronDown
              :class="{ 'rotate-180': dropdownOpen }"
              class="w-4 h-4 transition-transform text-gray-500"
          />
        </button>
      </template>

      <!-- Dropdown content -->
      <template #content>
        <div class="flex flex-col gap-2">
          <div class="flex items-center gap-3 border-b pb-3 mb-2">
            <UAvatar src="https://i.pravatar.cc/100?img=3" alt="Avatar" size="sm"/>
            <div>
              <p class="text-sm font-medium text-gray-900">{{ user?.name }}</p>
              <p class="text-xs text-gray-500">{{ user?.email }}</p>
            </div>
          </div>
          <UButton variant="soft" color="neutral" label="Ver perfil" class="w-full" @click="goToProfile"/>
          <UButton label="Cerrar sesión" color="error" class='p-2' @click="openConfirm"/>
        </div>
      </template>
    </UPopover>
  </div>
</template>
