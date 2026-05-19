import api from './api'

const studentService = {
  // Get all upcoming events
  getUpcomingEvents: async () => {
  const response = await api.get('/student/events')
  return response.data
},

  // Get event details
  getEventDetails: async (eventId) => {
    const response = await api.get(`/student/events/${eventId}`)
    return response.data
  },

  // Register for event
  registerForEvent: async (eventId) => {
    const response = await api.post(`/student/events/${eventId}/register`)
    return response.data
  },

  // Get my registered events
  getMyEvents: async () => {
    const response = await api.get('/student/my-events')
    return response.data
  },

  // Get my certificates
  getMyCertificates: async () => {
    const response = await api.get('/student/certificates/my-certificates')
    return response.data
  },

  // Download certificate
  downloadCertificate: async (certificateId) => {
    const response = await api.get(`/student/certificates/download/${certificateId}`, {
      responseType: 'blob'
    })
    return response
  }
}

export default studentService