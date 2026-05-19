import React, { createContext, useState, useContext, useEffect } from 'react'
import authService from '../services/authService'

const AuthContext = createContext()

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const currentUser = authService.getCurrentUser()
    setUser(currentUser)
    setLoading(false)
  }, [])

  const login = async (email, password, roleType) => {
    try {
      let response
      if (roleType === 'student') {
        response = await authService.studentLogin(email, password)
      } else {
        response = await authService.adminLogin(email, password)
      }
      
      const userData = authService.getCurrentUser()
      console.log('User data after login:', userData)
      setUser(userData)
      return { success: true, role: userData?.role }
    } catch (error) {
      console.log('Login error:', error)
      return { success: false, error: error.response?.data || 'Login failed' }
    }
  }

  const superAdminLogin = async (secretKey) => {
    try {
      const response = await authService.superAdminLogin(secretKey)
      const userData = authService.getCurrentUser()
      setUser(userData)
      return { success: true, role: 'SUPER_ADMIN' }
    } catch (error) {
      return { success: false, error: error.response?.data || 'Super Admin login failed' }
    }
  }

  const logout = () => {
    authService.logout()
    setUser(null)
  }

  const registerInstitution = async (data) => {
    try {
      const response = await authService.registerInstitution(data)
      return { success: true, data: response }
    } catch (error) {
      return { success: false, error: error.response?.data || 'Registration failed' }
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, superAdminLogin, logout, registerInstitution }}>
      {children}
    </AuthContext.Provider>
  )
}