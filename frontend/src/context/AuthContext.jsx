// import React, { createContext, useState, useContext, useEffect } from 'react'
// import axios from 'axios'

// const AuthContext = createContext()

// export const useAuth = () => {
//   const context = useContext(AuthContext)
//   if (!context) {
//     throw new Error('useAuth must be used within an AuthProvider')
//   }
//   return context
// }

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null)
//   const [loading, setLoading] = useState(true)

//   useEffect(() => {
//     const token = localStorage.getItem('token')
//     if (token) {
//       axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
//       fetchUser()
//     } else {
//       setLoading(false)
//     }
//   }, [])

//   const fetchUser = async () => {
//     try {
//       const response = await axios.get('/api/auth/me')
//       setUser(response.data.user)
//     } catch (error) {
//       localStorage.removeItem('token')
//       delete axios.defaults.headers.common['Authorization']
//     } finally {
//       setLoading(false)
//     }
//   }

//   const login = async (email, password) => {
//     try {
//       const response = await axios.post('/api/auth/login', { 
//         email, 
//         password,
//         deviceInfo: navigator.userAgent,
//         location: 'Office'
//       })
//       const { token, user } = response.data
      
//       localStorage.setItem('token', token)
//       axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
//       setUser(user)
      
//       return { success: true }
//     } catch (error) {
//       return { 
//         success: false, 
//         message: error.response?.data?.message || 'Login failed' 
//       }
//     }
//   }

//   const logout = async () => {
//     try {
//       await axios.post('/api/auth/logout')
//     } catch (error) {
//       console.error('Logout error:', error)
//     } finally {
//       localStorage.removeItem('token')
//       delete axios.defaults.headers.common['Authorization']
//       setUser(null)
//     }
//   }

//   const value = {
//     user,
//     login,
//     logout,
//     loading // Make sure this is included
//   }

//   return (
//     <AuthContext.Provider value={value}>
//       {children}
//     </AuthContext.Provider>
//   )
// }


import React, { createContext, useState, useContext, useEffect } from 'react'
import axios from 'axios'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
      fetchUser()
    } else {
      setLoading(false)
    }
  }, [])

  const fetchUser = async () => {
    try {
      const response = await axios.get('/api/auth/me')
      setUser(response.data.user)
    } catch (error) {
      localStorage.removeItem('token')
      delete axios.defaults.headers.common['Authorization']
    } finally {
      setLoading(false)
    }
  }

  const login = async (email, password) => {
    try {
      const response = await axios.post('/api/auth/login', { 
        email, 
        password,
        deviceInfo: navigator.userAgent,
        location: 'Office'
      })
      const { token, user } = response.data
      
      localStorage.setItem('token', token)
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
      setUser(user)
      
      return { success: true }
    } catch (error) {
      // Rate limiting error handle karo
      if (error.response?.status === 429) {
        return { 
          success: false, 
          message: 'Too many login attempts. Please wait a minute and try again.' 
        }
      }
      
      return { 
        success: false, 
        message: error.response?.data?.message || 'Login failed' 
      }
    }
  }

  const logout = async () => {
    try {
      await axios.post('/api/auth/logout')
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      localStorage.removeItem('token')
      delete axios.defaults.headers.common['Authorization']
      setUser(null)
    }
  }

  const value = {
    user,
    login,
    logout,
    loading
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}