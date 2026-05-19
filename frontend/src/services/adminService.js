import api from './api'

const adminService = {
  // Dashboard
  getDashboardStats: async () => {
    const response = await api.get('/reports/dashboard')
    return response.data
  },

  // Events
  getEvents: async () => {
    const response = await api.get('/admin/events')
    return response.data
  },

  getEventById: async (eventId) => {
    const response = await api.get(`/admin/events/${eventId}`)
    return response.data
  },

  createEvent: async (eventData) => {
    const response = await api.post('/admin/events', eventData)
    return response.data
  },

  updateEvent: async (eventId, eventData) => {
    const response = await api.put(`/admin/events/${eventId}`, eventData)
    return response.data
  },

  deleteEvent: async (eventId) => {
    const response = await api.delete(`/admin/events/${eventId}`)
    return response.data
  },

  closeEventRegistration: async (eventId) => {
    const response = await api.put(`/admin/events/${eventId}/close`)
    return response.data
  },

  getEventParticipants: async (eventId) => {
    const response = await api.get(`/admin/events/${eventId}/participants`)
    return response.data
  },

  // Students
  getStudents: async () => {
    const response = await api.get('/admin/students')
    return response.data
  },

  addStudent: async (studentData) => {
    const response = await api.post('/admin/students', studentData)
    return response.data
  },

  updateStudent: async (studentId, studentData) => {
    const response = await api.put(`/admin/students/${studentId}`, studentData)
    return response.data
  },

    reopenEventRegistration: async (eventId) => {
    const response = await api.put(`/admin/events/${eventId}/reopen`)
    return response.data
    },

  deleteStudent: async (studentId) => {
    const response = await api.delete(`/admin/students/${studentId}`)
    return response.data
  },

  getStudentsByBranch: async (branch) => {
    const response = await api.get(`/admin/students/branch/${encodeURIComponent(branch)}`)
    return response.data
  },

  getStudentsByYear: async (year) => {
    const response = await api.get(`/admin/students/year/${encodeURIComponent(year)}`)
    return response.data
  },

  cancelRegistration: async (registrationId) => {
    const response = await api.delete(`/admin/registrations/${registrationId}/cancel`)
    return response.data
  },

  uploadStudents: async (file) => {
    const formData = new FormData()
    formData.append('file', file)
    const response = await api.post('/admin/students/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    return response.data
  },

    // Update profile
    updateProfile: async (profileData) => {
    const response = await api.put('/admin/profile', profileData)
    return response.data
    },

    // Get profile
    getProfile: async () => {
    const response = await api.get('/admin/profile')
    return response.data
    },

  // Reports
  getBranchWiseReport: async (eventId) => {
    const response = await api.get(`/reports/events/${eventId}/branch-wise`)
    return response.data
  },

  getYearWiseReport: async (eventId) => {
    const response = await api.get(`/reports/events/${eventId}/year-wise`)
    return response.data
  },

  getEventSummary: async (eventId) => {
    const response = await api.get(`/reports/events/${eventId}/summary`)
    return response.data
  },

  // Certificates
  getEventCertificates: async (eventId) => {
    const response = await api.get(`/admin/certificates/event/${eventId}`)
    return response.data
  },

  generateCertificate: async (eventId, studentId) => {
    const response = await api.post(`/admin/certificates/generate/${eventId}/${studentId}`)
    return response.data
  },

  generateAllCertificates: async (eventId) => {
    const response = await api.post(`/admin/certificates/generate/event/${eventId}`)
    return response.data
  },

  markAttendance: async (eventId, studentId, attended, percentage, grade) => {
    const response = await api.put(`/admin/certificates/attendance/${eventId}/${studentId}`, null, {
      params: { attended, percentage, grade }
    })
    return response.data
  }

  
}

export default adminService