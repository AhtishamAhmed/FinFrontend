import axios from 'axios'

// One axios instance for the whole app. Every feature's API module (authApi,
// walletsApi, ...) imports this instead of calling axios directly, so the
// base URL and auth header logic live in exactly one place.
export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Attach the JWT to every outgoing request, if we have one.
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})
