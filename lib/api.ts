import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add auth token to requests
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    // Try to get token from localStorage first (for backward compatibility)
    let token = localStorage.getItem('token')
    
    // If not found, try to get it from Zustand persisted storage
    if (!token) {
      try {
        const authStorage = localStorage.getItem('auth-storage')
        if (authStorage) {
          const auth = JSON.parse(authStorage)
          token = auth.state?.token || null
        }
      } catch (e) {
        // Ignore parsing errors
      }
    }
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
  }
  return config
})

export default api

