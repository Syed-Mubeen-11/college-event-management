import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { FaArrowLeft, FaCalendarAlt, FaMapMarkerAlt, FaUsers, FaClock, FaDownload, FaCheckCircle, FaSpinner } from 'react-icons/fa'
import AdminLayout from '../../components/layout/AdminLayout'
import adminService from '../../services/adminService'
import toast from 'react-hot-toast'

function EventDetails() {
  const { eventId } = useParams()
  const navigate = useNavigate()
  const [event, setEvent] = useState(null)
  const [participants, setParticipants] = useState([])
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)

  useEffect(() => {
    fetchEventDetails()
    fetchParticipants()
  }, [eventId])

  const fetchEventDetails = async () => {
    try {
      const response = await adminService.getEventById(eventId)
      setEvent(response)
    } catch (error) {
      toast.error('Failed to load event details')
    }
  }

  const fetchParticipants = async () => {
    try {
      const response = await adminService.getEventParticipants(eventId)
      setParticipants(response.participants || [])
    } catch (error) {
      console.error('Error fetching participants:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCloseRegistration = async () => {
    try {
      await adminService.closeEventRegistration(eventId)
      toast.success('Registration closed successfully')
      fetchEventDetails()
    } catch (error) {
      toast.error('Failed to close registration')
    }
  }

  const handleGenerateCertificates = async () => {
    setGenerating(true)
    try {
      await adminService.generateAllCertificates(eventId)
      toast.success('Certificates generated successfully!')
    } catch (error) {
      toast.error('Failed to generate certificates')
    } finally {
      setGenerating(false)
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
      <AdminLayout>
        <div className="flex justify-center items-center h-64">
          <div className="text-textSecondary">Loading...</div>
        </div>
      </AdminLayout>
    )
  }

  if (!event) {
    return (
      <AdminLayout>
        <div className="text-center py-12">
          <p className="text-textSecondary">Event not found</p>
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
            onClick={() => navigate('/dashboard/admin/events')}
            className="p-2 rounded-full hover:bg-pink transition"
          >
            <FaArrowLeft className="text-primary" />
          </button>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-primary dark:text-darkText">
              {event.title}
            </h1>
            <p className="text-textSecondary dark:text-darkTextSecondary mt-1">
              Event Details & Participants
            </p>
          </div>
        </div>

        {/* Event Info Card */}
        <div className="card">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <FaCalendarAlt className="text-secondary text-xl" />
              <div>
                <p className="text-xs text-textSecondary">Start Date</p>
                <p className="font-medium">{formatDate(event.startDate)}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <FaClock className="text-secondary text-xl" />
              <div>
                <p className="text-xs text-textSecondary">End Date</p>
                <p className="font-medium">{formatDate(event.endDate)}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <FaMapMarkerAlt className="text-secondary text-xl" />
              <div>
                <p className="text-xs text-textSecondary">Venue</p>
                <p className="font-medium">{event.venue}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <FaUsers className="text-secondary text-xl" />
              <div>
                <p className="text-xs text-textSecondary">Registrations</p>
                <p className="font-medium">{participants.length} / {event.capacity}</p>
              </div>
            </div>
          </div>
          
          <div className="mt-4 p-3 bg-bgLight rounded-lg">
            <p className="text-sm text-textSecondary">{event.description || 'No description available'}</p>
          </div>

          <div className="flex flex-wrap gap-3 mt-6">
            <Link
              to={`/dashboard/admin/events/${eventId}/edit`}
              className="btn-primary inline-flex items-center gap-2"
            >
              Edit Event
            </Link>
            {event.status === 'UPCOMING' && (
              <button
                onClick={handleCloseRegistration}
                className="btn-secondary inline-flex items-center gap-2"
              >
                Close Registration
              </button>
            )}
            <button
              onClick={handleGenerateCertificates}
              disabled={generating || participants.length === 0}
              className="btn-primary inline-flex items-center gap-2"
            >
              {generating ? <><FaSpinner className="animate-spin" /> Generating...</> : <><FaDownload /> Generate Certificates</>}
            </button>
          </div>
        </div>

        {/* Participants Table */}
        <div className="card">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-primary dark:text-darkText">
              Participants ({participants.length})
            </h2>
          </div>

          {participants.length === 0 ? (
            <div className="text-center py-8 text-textSecondary">
              No students registered for this event yet
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-borderLight">
                  <tr className="text-left text-sm text-textSecondary">
                    <th className="pb-2">Student Name</th>
                    <th className="pb-2">Email</th>
                    <th className="pb-2">Branch</th>
                    <th className="pb-2">Year</th>
                    <th className="pb-2">Registered On</th>
                   </tr>
                </thead>
                <tbody>
                  {participants.map((participant) => (
                    <tr key={participant.studentId} className="border-b border-borderLight">
                      <td className="py-2 font-medium">{participant.studentName}</td>
                      <td className="py-2 text-sm text-textSecondary">{participant.email}</td>
                      <td className="py-2 text-sm text-textSecondary">{participant.branch}</td>
                      <td className="py-2 text-sm text-textSecondary">{participant.year}</td>
                      <td className="py-2 text-sm text-textSecondary">
                        {new Date(participant.registeredAt).toLocaleDateString()}
                      </td>
                     </tr>
                  ))}
                </tbody>
               </table>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  )
}

export default EventDetails