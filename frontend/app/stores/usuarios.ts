import { defineStore } from 'pinia'

interface User {
  id: number
  email: string
  name: string
  // Add other user properties as needed
}

interface UserState {
  users: User[]
  currentUser: User | null
  loading: boolean
  error: string | null
}

export const useUserStore = defineStore('users', {
  state: (): UserState => ({
    users: [],
    currentUser: null,
    loading: false,
    error: null
  }),

  getters: {
    getUsers: (state) => state.users,
    getCurrentUser: (state) => state.currentUser,
    isLoading: (state) => state.loading
  },

  actions: {
    async fetchUsers() {
      this.loading = true
      try {
        const response = await fetch('/api/users')
        const data = await response.json()
        this.users = data
        this.error = null
      } catch (error) {
        this.error = 'Error al cargar usuarios'
        console.error('Error fetching users:', error)
      } finally {
        this.loading = false
      }
    },

    async createUser(userData: Partial<User>) {
      this.loading = true
      try {
        const response = await fetch('/api/users', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(userData)
        })
        const data = await response.json()
        this.users.push(data)
        this.error = null
        return data
      } catch (error) {
        this.error = 'Error al crear usuario'
        console.error('Error creating user:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    async updateUser(id: number, userData: Partial<User>) {
      this.loading = true
      try {
        const response = await fetch(`/api/users/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(userData)
        })
        const data = await response.json()
        const index = this.users.findIndex(user => user.id === id)
        if (index !== -1) {
          this.users[index] = data
        }
        this.error = null
        return data
      } catch (error) {
        this.error = 'Error al actualizar usuario'
        console.error('Error updating user:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    async deleteUser(id: number) {
      this.loading = true
      try {
        await fetch(`/api/users/${id}`, {
          method: 'DELETE'
        })
        this.users = this.users.filter(user => user.id !== id)
        this.error = null
      } catch (error) {
        this.error = 'Error al eliminar usuario'
        console.error('Error deleting user:', error)
        throw error
      } finally {
        this.loading = false
      }
    }
  }
})

export const useUsuariosStore = defineStore('usuarios', {
  state: () => ({
    usuarios: [],
    loading: false,
    error: null
  }),

  actions: {
    async fetchUsuarios() {
      this.loading = true
      try {
        // Implement your API call here
        // const response = await $fetch('/api/usuarios')
        // this.usuarios = response
      } catch (error) {
        this.error = error
      } finally {
        this.loading = false
      }
    }
  },

  getters: {
    getUsuarios: (state) => state.usuarios,
    isLoading: (state) => state.loading,
    hasError: (state) => state.error !== null
  }
}) 