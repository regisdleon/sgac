<script setup lang="ts">
import ProfileAccountSection from '~/pages/ajustes/components/ProfileAccount.vue'
import ProfilePersonalInfoSection from '~/pages/ajustes/components/ProfilePersonal.vue'
import ProfilePreferencesSection from '~/pages/ajustes/components/ProfilePreferencies.vue'
import ProfileSecuritySection from '~/pages/ajustes/components/ProfileSecurity.vue'
import { Badge, Lock, Settings, User } from 'lucide-vue-next'

import { ref } from 'vue'

definePageMeta( { layout : 'dashboard' } )

const currentTab = ref( 'cuenta' )

const tabs = [
  { key : 'cuenta', label : 'Cuenta', icon : User },
  { key : 'personal', label : 'Información personal', icon : Badge },
  { key : 'preferencias', label : 'Preferencias', icon : Settings },
  { key : 'security', label : 'Seguridad', icon : Lock }
]

const form = ref( {
  username : 'juanperez',
  name : 'Juan Pérez',
  email : 'juan@example.com',
  phone : '',
  bio : '',
  newsletter : true
} )

function handleSave( section : string ) {
  alert( `Sección "${ section }" actualizada` )
}
</script>

<template>
  <UContainer class="py-10">
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
      <!-- Menú lateral -->
      <div class="col-span-1">
        <UCard class="p-0">
          <ul>
            <li
                v-for="tab in tabs"
                :key="tab.key"
            >
              <button
                  @click="currentTab = tab.key"
                  class="flex cursor-pointer items-center w-full rounded my-1 px-4 py-3 text-left hover:bg-gray-50 transition-colors"
                  :class="currentTab === tab.key ? 'bg-gray-100 text-primary font-semibold' : 'text-gray-700'"
              >
                <component :is="tab.icon" class="w-5 h-5 mr-3"/>
                <span>{{ tab.label }}</span>
              </button>
            </li>
          </ul>
        </UCard>
      </div>
      <!-- Contenido -->
      <div class="col-span-1 md:col-span-3">
        <UCard>
          <template #header>
            <h2 class="text-2xl font-semibold text-center text-gray-800">Mi Perfil</h2>
          </template>

          <component
              :is="currentTab === 'cuenta' ? ProfileAccountSection : currentTab === 'personal' ? ProfilePersonalInfoSection : currentTab === 'security' ? ProfileSecuritySection : ProfilePreferencesSection"
              :form="form"
              @save="handleSave(currentTab)"
          />
        </UCard>
      </div>
    </div>
  </UContainer>
</template>
