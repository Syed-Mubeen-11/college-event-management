import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { FaCalendarAlt, FaMapMarkerAlt, FaUsers, FaClock, FaArrowLeft, FaCheckCircle } from 'react-icons/fa'
import StudentLayout from '../../components/layout/StudentLayout'
import studentService from '../../services/studentService'
import toast from 'react-hot-toast'

function EventDetails() {
  const { eventId } = useParams()
  const navigate = useNavigate()
  const [event, setEvent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [registering, setRegistering] = useState(false)
  const [isRegistered, setIsRegistered] = useState(false)

  useEffect(() => {
    fetchEventDetails()
  }, [eventId])

  const fetchEventDetails = async () => {
    try {
      const response = await studentService.getEventDetails(eventId)
      setEvent(response.event)
      setIsRegistered(response.isRegistered || false)
    } catch (error) {
      toast.error('Failed to load event details')
      navigate('/dashboard/student/events')
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async () => {
    setRegistering(true)
    try {
      await studentService.registerForEvent(eventId)
      toast.success('✅ Registered successfully!')
      setIsRegistered(true)
      fetchEventDetails()
    } catch (error) {
      toast.error(error.response?.data || 'Registration failed')
    } finally {
      setRegistering(false)
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <StudentLayout>
        <div className="flex justify-center items-center h-64">
          <div className="text-textSecondary">Loading event details...</div>
        </div>
      </StudentLayout>
    )
  }

  if (!event) {
    return (
      <StudentLayout>
        <div className="text-center py-12">
          <p className="text-textSecondary">Event not found</p>
        </div>
      </StudentLayout>
    )
  }

  const availableSpots = event.capacity - event.registeredCount
  const isFull = availableSpots === 0
  const isEventCompleted = new Date(event.endDate) < new Date()

  return (
    <StudentLayout>
      <div className="space-y-6">
        {/* Back Button */}
        <button
          onClick={() => navigate('/dashboard/student/events')}
          className="flex items-center gap-2 text-textSecondary hover:text-primary transition"
        >
          <FaArrowLeft /> Back to Events
        </button>

        {/* Event Details */}
        <div className="card">
          {/* Header */}
          <div className="w-full h-48 bg-gradient-primary rounded-lg mb-6 flex items-center justify-center">
            <FaCalendarAlt className="text-white text-6xl" />
          </div>

          <h1 className="text-2xl md:text-3xl font-bold text-primary dark:text-darkText mb-4">
            {event.title}
          </h1>

          {/* Status Badge */}
          <div className="flex flex-wrap gap-2 mb-6">
            {isEventCompleted ? (
              <span className="px-3 py-1 bg-green-100 text-green-700 text-sm rounded-full">Completed</span>
            ) : event.status === 'CLOSED' ? (
              <span className="px-3 py-1 bg-red-100 text-red-700 text-sm rounded-full">Registration Closed</span>
            ) : (
              <span className="px-3 py-1 bg-yellow-100 text-yellow-700 text-sm rounded-full">Upcoming</span>
            )}
            {isRegistered && (
              <span className="px-3 py-1 bg-green-100 text-green-700 text-sm rounded-full flex items-center gap-1">
                <FaCheckCircle /> Registered
              </span>
            )}
          </div>

          {/* Description */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-primary dark:text-darkText mb-2">About this event</h3>
            <p className="text-textSecondary">{event.description || 'No description available'}</p>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="flex items-center gap-3 p-3 bg-bgLight rounded-lg">
              <FaMapMarkerAlt className="text-secondary text-xl" />
              <div>
                <p className="text-xs text-textSecondary">Venue</p>
                <p className="font-medium">{event.venue}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-bgLight rounded-lg">
              <FaClock className="text-secondary text-xl" />
              <div>
                <p className="text-xs text-textSecondary">Date & Time</p>
                <p className="font-medium">{formatDate(event.startDate)} - {formatDate(event.endDate)}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-bgLight rounded-lg">
              <FaUsers className="text-secondary text-xl" />
              <div>
                <p className="text-xs text-textSecondary">Capacity</p>
                <p className="font-medium">{event.registeredCount} / {event.capacity} registered</p>
                <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                  <div 
                    className="bg-primary rounded-full h-1.5"
                    style={{ width: `${(event.registeredCount / event.capacity) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Registration Button */}
          {!isEventCompleted && !isRegistered && (
            <button
              onClick={handleRegister}
              disabled={registering || isFull || event.status === 'CLOSED'}
              className={`btn-primary w-full py-3 text-lg ${
                (isFull || event.status === 'CLOSED') ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {registering ? 'Registering...' : isFull ? 'Event Full' : event.status === 'CLOSED' ? 'Registration Closed' : 'Register for Event'}
            </button>
          )}

          {isRegistered && !isEventCompleted && (
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-green-700">✅ You are registered for this event!</p>
            </div>
          )}

          {isEventCompleted && (
            <div className="text-center p-4 bg-gray-100 rounded-lg">
              <p className="text-textSecondary">This event has been completed</p>
            </div>
          )}
        </div>
      </div>
    </StudentLayout>
  )
}

export default EventDetails