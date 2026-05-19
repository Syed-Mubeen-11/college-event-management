import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { FaArrowLeft, FaSave, FaCalendarAlt, FaMapMarkerAlt, FaUsers, FaAlignLeft } from 'react-icons/fa'
import AdminLayout from '../../components/layout/AdminLayout'
import adminService from '../../services/adminService'
import toast from 'react-hot-toast'

function EditEvent() {
  const { eventId } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    venue: '',
    startDate: '',
    endDate: '',
    capacity: ''
  })

  useEffect(() => {
    fetchEvent()
  }, [eventId])

  const fetchEvent = async () => {
    try {
      const event = await adminService.getEventById(eventId)
      setFormData({
        title: event.title || '',
        description: event.description || '',
        venue: event.venue || '',
        startDate: event.startDate ? event.startDate.slice(0, 16) : '',
        endDate: event.endDate ? event.endDate.slice(0, 16) : '',
        capacity: event.capacity || ''
      })
    } catch (error) {
      toast.error('Failed to load event')
      navigate('/dashboard/admin/events')
    } finally {
      setFetching(false)
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    const eventData = {
      title: formData.title,
      description: formData.description,
      venue: formData.venue,
      startDate: formData.startDate,
      endDate: formData.endDate,
      capacity: parseInt(formData.capacity)
    }

    try {
      await adminService.updateEvent(eventId, eventData)
      toast.success('Event updated successfully!')
      navigate(`/dashboard/admin/events/${eventId}`)
    } catch (error) {
      toast.error(error.response?.data || 'Failed to update event')
    } finally {
      setLoading(false)
    }
  }

  if (fetching) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-64">
          <div className="text-textSecondary">Loading event details...</div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(`/dashboard/admin/events/${eventId}`)}
            className="p-2 rounded-full hover:bg-pink transition"
          >
            <FaArrowLeft className="text-primary" />
          </button>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-primary dark:text-darkText">
              Edit Event
            </h1>
            <p className="text-textSecondary dark:text-darkTextSecondary mt-1">
              Update event information
            </p>
          </div>
        </div>

        {/* Form */}
        <div className="card max-w-2xl">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="label">Event Title *</label>
              <div className="relative">
                <FaCalendarAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-textSecondary" />
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="input-field pl-10"
                  placeholder="Enter event title"
                  required
                />
              </div>
            </div>

            <div>
              <label className="label">Description</label>
              <div className="relative">
                <FaAlignLeft className="absolute left-3 top-3 text-textSecondary" />
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="input-field pl-10 min-h-[100px]"
                  placeholder="Describe your event"
                />
              </div>
            </div>

            <div>
              <label className="label">Venue *</label>
              <div className="relative">
                <FaMapMarkerAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-textSecondary" />
                <input
                  type="text"
                  name="venue"
                  value={formData.venue}
                  onChange={handleChange}
                  className="input-field pl-10"
                  placeholder="Event venue"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="label">Start Date & Time *</label>
                <input
                  type="datetime-local"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="label">End Date & Time *</label>
                <input
                  type="datetime-local"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  className="input-field"
                  required
                />
              </div>
            </div>

            <div>
              <label className="label">Capacity *</label>
              <div className="relative">
                <FaUsers className="absolute left-3 top-1/2 transform -translate-y-1/2 text-textSecondary" />
                <input
                  type="number"
                  name="capacity"
                  value={formData.capacity}
                  onChange={handleChange}
                  className="input-field pl-10"
                  placeholder="Maximum number of students"
                  min="1"
                  required
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={() => navigate(`/dashboard/admin/events/${eventId}`)}
                className="px-4 py-2 border border-borderLight rounded-button hover:bg-gray-100 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="btn-primary flex items-center gap-2"
              >
                {loading ? 'Saving...' : <><FaSave /> Save Changes</>}
              </button>
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  )
}

export default EditEvent