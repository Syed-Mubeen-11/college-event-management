import api from './api'

const authService = {
  // Student Login
  studentLogin: async (email, password) => {
  const response = await api.post('/auth/login', { email, password })
  if (response.data.token) {
    localStorage.setItem('token', response.data.token)
    localStorage.setItem('user', JSON.stringify({
      id: response.data.userId,
      email: email,
      role: response.data.role,        // ← Important
      institutionId: response.data.institutionId,
      institutionName: response.data.institutionName
    }))
  }
  return response.data
},

  // Admin Login
 adminLogin: async (email, password) => {
  const response = await api.post('/auth/login', { email, password })
  if (response.data.token) {
    localStorage.setItem('token', response.data.token)
    localStorage.setItem('user', JSON.stringify({
      id: response.data.userId,
      name: response.data.name || email.split('@')[0],
      email: email,
      role: response.data.role,
      institutionId: response.data.institutionId,
      institutionName: response.data.institutionName || 'Institution'
    }))
  }
  return response.data
},

  // Institution Registration
  registerInstitution: async (data) => {
    const response = await api.post('/auth/register/institution', data)
    return response.data
  },

  // Logout
  logout: () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    window.location.href = '/'
  },

  // Get current user
  getCurrentUser: () => {
    const user = localStorage.getItem('user')
    return user ? JSON.parse(user) : null
  },

  // Check if logged in
  isLoggedIn: () => {
    return localStorage.getItem('token') !== null
  }
}

export default authService