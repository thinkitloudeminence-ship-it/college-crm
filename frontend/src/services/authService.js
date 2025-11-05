import axios from 'axios'

const API_URL = '/api/auth'

// Create axios instance with default config
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || '',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const user = JSON.parse(localStorage.getItem('user'))
    if (user && user.token) {
      config.headers.Authorization = `Bearer ${user.token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Add response interceptor to handle common errors
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

const authService = {
  // Login user
  async login(email, password, userType = 'employee') {
    const response = await api.post(API_URL + '/login', {
      email,
      password,
      userType,
    })

    if (response.data) {
      localStorage.setItem('user', JSON.stringify(response.data))
    }

    return response.data
  },

  // Logout user
  logout() {
    localStorage.removeItem('user')
    // Optional: Call logout API to invalidate token
    return api.get(API_URL + '/logout')
  },

  // Check if user is authenticated
  async checkAuth() {
    const response = await api.get(API_URL + '/me')
    return response.data
  },

  // Change password
  async changePassword(currentPassword, newPassword) {
    const response = await api.put(API_URL + '/change-password', {
      currentPassword,
      newPassword,
    })
    return response.data
  },

  // Forgot password
  async forgotPassword(email) {
    const response = await api.post(API_URL + '/forgot-password', { email })
    return response.data
  },
}

export default authService