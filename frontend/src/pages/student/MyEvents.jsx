import React, { useState, useEffect } from 'react'
import { FaCalendarAlt, FaMapMarkerAlt, FaCheckCircle, FaClock } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import StudentLayout from '../../components/layout/StudentLayout'
import studentService from '../../services/studentService'
import toast from 'react-hot-toast'

function MyEvents() {
  const [registrations, setRegistrations] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchMyEvents()
  }, [])

  const fetchMyEvents = async () => {
    try {
      const response = await studentService.getMyEvents()
      setRegistrations(response.registrations || [])
    } catch (error) {
      toast.error('Failed to load your events')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const isEventCompleted = (eventDate) => {
    return new Date(eventDate) < new Date()
  }

  if (loading) {
    return (
      <StudentLayout>
        <div className="flex justify-center items-center h-64">
          <div className="text-textSecondary">Loading your events...</div>
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
            My Registered Events
          </h1>
          <p className="text-textSecondary dark:text-darkTextSecondary mt-1">
            Events you have registered for
          </p>
        </div>

        {/* Registrations List */}
        {registrations.length === 0 ? (
          <div className="card text-center py-12">
            <FaCalendarAlt className="text-5xl text-textSecondary mx-auto mb-4" />
            <p className="text-textSecondary">You haven't registered for any events yet</p>
            <Link to="/dashboard/student/events" className="btn-primary inline-flex items-center gap-2 mt-4">
              Browse Events <FaCalendarAlt />
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {registrations.map((reg) => {
              const event = reg.event
              const completed = isEventCompleted(event.endDate)
              
              return (
                <div key={reg.id} className="card hover:shadow-lg transition-shadow">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-xl font-bold text-primary dark:text-darkText">
                          {event.title}
                        </h3>
                        {completed ? (
                          <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                            Completed
                          </span>
                        ) : (
                          <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full">
                            Upcoming
                          </span>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-4 text-sm text-textSecondary">
                        <div className="flex items-center gap-1">
                          <FaMapMarkerAlt className="text-secondary" />
                          <span>{event.venue}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <FaClock className="text-secondary" />
                          <span>{formatDate(event.startDate)} - {formatDate(event.endDate)}</span>
                        </div>
                      </div>
                      <p className="text-xs text-textSecondary mt-2">
                        Registered on: {formatDate(reg.registeredAt)}
                      </p>
                    </div>
                    
                    <Link
                      to={`/dashboard/student/events/${event.id}`}
                      className="btn-outline text-sm py-2 px-4"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </StudentLayout>
  )
}

export default MyEvents