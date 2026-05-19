import React, { useState, useEffect } from 'react'
import { FaPlus, FaEdit, FaTrash, FaEye, FaCalendarAlt, FaMapMarkerAlt, FaUsers, FaClock, FaToggleOn, FaToggleOff } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import AdminLayout from '../../components/layout/AdminLayout'
import adminService from '../../services/adminService'
import toast from 'react-hot-toast'

function Events() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState(null)

  useEffect(() => {
    fetchEvents()
  }, [])

  const fetchEvents = async () => {
    try {
      const response = await adminService.getEvents()
      setEvents(response.events || [])
    } catch (error) {
      toast.error('Failed to load events')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    try {
      await adminService.deleteEvent(selectedEvent.id)
      toast.success('Event deleted successfully')
      fetchEvents()
      setShowDeleteModal(false)
      setSelectedEvent(null)
    } catch (error) {
      toast.error('Failed to delete event')
    }
  }

  const handleCloseRegistration = async (eventId) => {
    try {
      await adminService.closeEventRegistration(eventId)
      toast.success('Registration closed successfully')
      fetchEvents()
    } catch (error) {
      toast.error('Failed to close registration')
    }
  }

  const handleReopenRegistration = async (eventId) => {
    try {
      await adminService.reopenEventRegistration(eventId)
      toast.success('Registration reopened successfully')
      fetchEvents()
    } catch (error) {
      toast.error('Failed to reopen registration')
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
      <AdminLayout>
        <div className="flex justify-center items-center h-64">
          <div className="text-textSecondary">Loading events...</div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-primary dark:text-darkText">
              Events
            </h1>
            <p className="text-textSecondary dark:text-darkTextSecondary mt-1">
              Manage your college events
            </p>
          </div>
          <Link to="/dashboard/admin/events/create" className="btn-primary flex items-center gap-2">
            <FaPlus /> Create Event
          </Link>
        </div>

        {/* Events Table */}
        <div className="card">
          {events.length === 0 ? (
            <div className="text-center py-12">
              <FaCalendarAlt className="text-5xl text-textSecondary mx-auto mb-4" />
              <p className="text-textSecondary">No events created yet</p>
              <Link to="/dashboard/admin/events/create" className="btn-primary inline-flex items-center gap-2 mt-4">
                <FaPlus /> Create Your First Event
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-borderLight">
                  <tr className="text-left text-sm text-textSecondary">
                    <th className="pb-3">Event Name</th>
                    <th className="pb-3">Date</th>
                    <th className="pb-3">Venue</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3">Registrations</th>
                    <th className="pb-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {events.map((event) => (
                    <tr key={event.id} className="border-b border-borderLight hover:bg-pink/10 transition">
                      <td className="py-3 font-medium text-primary dark:text-darkText">
                        {event.title}
                      </td>
                      <td className="py-3 text-sm text-textSecondary">
                        {formatDate(event.startDate)} - {formatDate(event.endDate)}
                      </td>
                      <td className="py-3 text-sm text-textSecondary">
                        {event.venue}
                      </td>
                      <td className="py-3">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          event.status === 'UPCOMING' ? 'bg-green-100 text-green-700' :
                          event.status === 'COMPLETED' ? 'bg-gray-100 text-gray-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {event.status}
                        </span>
                      </td>
                      <td className="py-3 text-sm text-textSecondary">
                        {event.registeredCount} / {event.capacity}
                      </td>
                      <td className="py-3">
                        <div className="flex items-center gap-2">
                          {/* View Details */}
                          <Link 
                            to={`/dashboard/admin/events/${event.id}`}
                            className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition"
                            title="View Details"
                          >
                            <FaEye />
                          </Link>
                          
                          {/* Edit Event */}
                          <Link 
                            to={`/dashboard/admin/events/${event.id}/edit`}
                            className="p-2 text-yellow-500 hover:bg-yellow-50 rounded-lg transition"
                            title="Edit"
                          >
                            <FaEdit />
                          </Link>
                          
                          {/* Close/Reopen Registration Toggle */}
                          {event.status === 'UPCOMING' && (
                            <button
                              onClick={() => handleCloseRegistration(event.id)}
                              className="p-2 text-orange-500 hover:bg-orange-50 rounded-lg transition"
                              title="Close Registration"
                            >
                              <FaToggleOn />
                            </button>
                          )}
                          {event.status === 'CLOSED' && (
                            <button
                              onClick={() => handleReopenRegistration(event.id)}
                              className="p-2 text-green-500 hover:bg-green-50 rounded-lg transition"
                              title="Reopen Registration"
                            >
                              <FaToggleOff />
                            </button>
                          )}
                          
                          {/* Delete Event */}
                          <button
                            onClick={() => {
                              setSelectedEvent(event)
                              setShowDeleteModal(true)
                            }}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition"
                            title="Delete"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedEvent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-darkCard rounded-lg p-6 max-w-md w-full mx-4">
            <h2 className="text-xl font-bold text-primary dark:text-darkText mb-4">Confirm Delete</h2>
            <p className="text-textSecondary mb-6">
              Are you sure you want to delete "{selectedEvent.title}"? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 border border-borderLight rounded-button hover:bg-gray-100 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-500 text-white rounded-button hover:bg-red-600 transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}

export default Events