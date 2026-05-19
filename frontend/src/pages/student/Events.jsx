import { useState, useEffect } from 'react'
import { FaCalendarAlt, FaMapMarkerAlt, FaUsers, FaClock, FaArrowRight } from 'react-icons/fa'
import StudentLayout from '../../components/layout/StudentLayout'
import studentService from '../../services/studentService'
import toast from 'react-hot-toast'

function Events() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [registering, setRegistering] = useState(null)

  useEffect(() => {
    fetchEvents()
  }, [])

  const fetchEvents = async () => {
    try {
      const response = await studentService.getUpcomingEvents()
      console.log('API Response:', response)
      setEvents(response.events || [])
    } catch (error) {
      toast.error('Failed to load events')
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async (eventId) => {
    setRegistering(eventId)
    try {
      await studentService.registerForEvent(eventId)
      toast.success('✅ Registered successfully!')
      fetchEvents()
    } catch (error) {
      toast.error(error.response?.data || 'Registration failed')
    } finally {
      setRegistering(null)
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <StudentLayout>
        <div className="flex justify-center items-center h-64">
          <div className="text-textSecondary">Loading events...</div>
        </div>
      </StudentLayout>
    )
  }

  return (
    <StudentLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-primary dark:text-darkText">
            Upcoming Events
          </h1>
          <p className="text-textSecondary dark:text-darkTextSecondary mt-1">
            Browse and register for events
          </p>
        </div>

        {/* Events Grid - Fixed rendering */}
        {events.length === 0 ? (
          <div className="card text-center py-12">
            <FaCalendarAlt className="text-5xl text-textSecondary mx-auto mb-4" />
            <p className="text-textSecondary">No upcoming events available</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events && events.map((event) => {
              const availableSpots = (event.capacity || 0) - (event.registeredCount || 0)
              const isFull = availableSpots <= 0
              
              return (
                <div key={event.id} className="card hover:scale-105 transition-transform duration-300">
                  <div className="w-full h-32 bg-gradient-primary rounded-lg mb-4 flex items-center justify-center">
                    <FaCalendarAlt className="text-white text-4xl" />
                  </div>
                  
                  <h3 className="text-xl font-bold text-primary dark:text-darkText mb-2">
                    {event.title}
                  </h3>
                  
                  <p className="text-textSecondary text-sm mb-4 line-clamp-2">
                    {event.description || 'No description available'}
                  </p>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-textSecondary">
                      <FaMapMarkerAlt className="text-secondary" />
                      <span>{event.venue}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-textSecondary">
                      <FaClock className="text-secondary" />
                      <span>{formatDate(event.startDate)} - {formatDate(event.endDate)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-textSecondary">
                      <FaUsers className="text-secondary" />
                      <span>{event.registeredCount || 0} / {event.capacity || 0} registered</span>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-primary rounded-full h-2 transition-all"
                        style={{ width: `${((event.registeredCount || 0) / (event.capacity || 1)) * 100}%` }}
                      />
                    </div>
                    <p className="text-xs text-textSecondary mt-1">
                      {availableSpots} spots available
                    </p>
                  </div>
                  
                  <button
                    onClick={() => handleRegister(event.id)}
                    disabled={registering === event.id || isFull}
                    className={`w-full py-2 rounded-button font-semibold transition-all flex items-center justify-center gap-2 ${
                      isFull 
                        ? 'bg-gray-300 cursor-not-allowed text-gray-500'
                        : 'btn-primary'
                    }`}
                  >
                    {registering === event.id ? (
                      'Registering...'
                    ) : isFull ? (
                      'Event Full'
                    ) : (
                      <>
                        Register Now <FaArrowRight />
                      </>
                    )}
                  </button>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </StudentLayout>
  )
}

export default Events