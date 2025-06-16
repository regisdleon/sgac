import { useRuntimeConfig } from '#imports'

export const createApiClient = () => {
  const config = useRuntimeConfig()
  const baseURL = config.public.backendBaseUrl
  let authToken: string | null = null

  const apiClient = {
    setAuthToken(token: string) {
      authToken = token
    },

    clearAuthToken() {
      authToken = null
    },

    async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
      const url = `${baseURL}${endpoint}`
      const headers = {
        'Content-Type': 'application/json',
        ...(authToken ? { 'Authorization': `Bearer ${authToken}` } : {}),
        ...options.headers,
      }

      try {
        const response = await fetch(url, {
          ...options,
          headers,
        })

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        return await response.json()
      } catch (error) {
        console.error('API request failed:', error)
        throw error
      }
    },

    async get<T>(endpoint: string, options: RequestInit = {}) {
      return this.request<T>(endpoint, { ...options, method: 'GET' })
    },

    async post<T>(endpoint: string, data: any, options: RequestInit = {}) {
      return this.request<T>(endpoint, {
        ...options,
        method: 'POST',
        body: JSON.stringify(data),
      })
    },

    async put<T>(endpoint: string, data: any, options: RequestInit = {}) {
      return this.request<T>(endpoint, {
        ...options,
        method: 'PUT',
        body: JSON.stringify(data),
      })
    },

    async delete<T>(endpoint: string, options: RequestInit = {}) {
      return this.request<T>(endpoint, { ...options, method: 'DELETE' })
    },
  }

  return apiClient
} 