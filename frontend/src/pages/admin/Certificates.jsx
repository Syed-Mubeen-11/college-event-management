import { useState, useEffect } from 'react'
import { FaCertificate, FaDownload, FaCheckCircle, FaSpinner, FaUsers, FaCalendarAlt, FaCheck, FaClock } from 'react-icons/fa'
import AdminLayout from '../../components/layout/AdminLayout'
import adminService from '../../services/adminService'
import toast from 'react-hot-toast'

function Certificates() {
  const [events, setEvents] = useState([])
  const [selectedEventId, setSelectedEventId] = useState('')
  const [participants, setParticipants] = useState([])
  const [certificates, setCertificates] = useState([])
  const [loading, setLoading] = useState(false)
  const [loadingEvents, setLoadingEvents] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [attendanceMarking, setAttendanceMarking] = useState(null)
  const [studentGrades, setStudentGrades] = useState({})

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
      setLoadingEvents(false)
    }
  }

  const fetchEventData = async () => {
    if (!selectedEventId) return

    setLoading(true)
    try {
      const [participantsData, certificatesData] = await Promise.all([
        adminService.getEventParticipants(selectedEventId),
        adminService.getEventCertificates(selectedEventId)
      ])
      setParticipants(participantsData.participants || [])
      setCertificates(certificatesData.certificates || [])
    } catch (error) {
      toast.error('Failed to load event data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (selectedEventId) {
      fetchEventData()
    }
  }, [selectedEventId])

  const handleMarkAttendance = async (studentId, attended, percentage) => {
    const grade = studentGrades[studentId] || 'A'
    setAttendanceMarking(studentId)
    try {
      await adminService.markAttendance(selectedEventId, studentId, attended, percentage, grade)
      toast.success('Attendance marked successfully')
      fetchEventData()
    } catch (error) {
      toast.error('Failed to mark attendance')
    } finally {
      setAttendanceMarking(null)
    }
  }

  const handleGenerateCertificate = async (studentId) => {
    try {
      await adminService.generateCertificate(selectedEventId, studentId)
      toast.success('Certificate generated successfully')
      fetchEventData()
    } catch (error) {
      toast.error(error.response?.data || error.message || 'Failed to generate certificate')
    }
  }

  const handleGenerateAllCertificates = async () => {
    setGenerating(true)
    try {
      await adminService.generateAllCertificates(selectedEventId)
      toast.success('All certificates generated successfully')
      fetchEventData()
    } catch (error) {
      toast.error(error.response?.data || error.message || 'Failed to generate certificates')
    } finally {
      setGenerating(false)
    }
  }

  const getEventTitle = () => {
    const event = events.find(e => e.id === parseInt(selectedEventId))
    return event ? event.title : ''
  }

  const isCertificateGenerated = (studentId) => {
    return certificates.some(c => c.student?.id === studentId)
  }

  const hasCertificates = certificates.length > 0

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-primary dark:text-darkText">
            Certificate Management
          </h1>
          <p className="text-textSecondary dark:text-darkTextSecondary mt-1">
            Mark attendance and generate certificates for event participants
          </p>
        </div>

        {/* Event Selection */}
        <div className="card">
          <div className="flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-1">
              <label className="label">Select Event</label>
              <select
                value={selectedEventId}
                onChange={(e) => setSelectedEventId(e.target.value)}
                className="input-field"
                disabled={loadingEvents}
              >
                <option value="">Choose an event...</option>
                {events.map((event) => (
                  <option key={event.id} value={event.id}>
                    {event.title} ({event.status} - {event.registeredCount}/{event.capacity} registered)
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Certificate Actions */}
        {selectedEventId && (
          <div className="card">
            <div className="flex flex-wrap justify-between items-center gap-4">
              <div>
                <h2 className="text-lg font-semibold text-primary dark:text-darkText">
                  {getEventTitle()}
                </h2>
                <p className="text-sm text-textSecondary">
                  {participants.length} students registered
                </p>
              </div>
              {participants.length > 0 && (
                <button
                  onClick={handleGenerateAllCertificates}
                  disabled={generating}
                  className="btn-primary flex items-center gap-2"
                >
                  {generating ? <><FaSpinner className="animate-spin" /> Generating...</> : <><FaDownload /> Generate All Certificates</>}
                </button>
              )}
            </div>
          </div>
        )}

        {/* Participants Table */}
        {selectedEventId && (
          <div className="card">
            <h2 className="text-xl font-bold text-primary dark:text-darkText mb-4">
              Participants & Certificates
            </h2>

            {loading ? (
              <div className="text-center py-8 text-textSecondary">Loading participants...</div>
            ) : participants.length === 0 ? (
              <div className="text-center py-8 text-textSecondary">
                No students registered for this event yet
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b border-borderLight">
                    <tr className="text-left text-sm text-textSecondary">
                      <th className="pb-3">Student Name</th>
                      <th className="pb-3">Email</th>
                      <th className="pb-3">Branch</th>
                      <th className="pb-3">Year</th>
                      <th className="pb-3">Attendance</th>
                      <th className="pb-3">Grade</th>
                      <th className="pb-3">Certificate</th>
                      <th className="pb-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {participants.map((student) => {
                      const hasCertificate = isCertificateGenerated(student.studentId)
                      return (
                        <tr key={student.studentId} className="border-b border-borderLight">
                          <td className="py-3 font-medium text-primary dark:text-darkText">
                            {student.studentName}
                          </td>
                          <td className="py-3 text-sm text-textSecondary">
                            {student.email}
                          </td>
                          <td className="py-3 text-sm text-textSecondary">
                            {student.branch || '-'}
                          </td>
                          <td className="py-3 text-sm text-textSecondary">
                            {student.year || '-'}
                          </td>
                          <td className="py-3">
                            <button
                              onClick={() => handleMarkAttendance(student.studentId, true, 100)}
                              disabled={attendanceMarking === student.studentId}
                              className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs hover:bg-green-200 transition"
                            >
                              {attendanceMarking === student.studentId ? '...' : 'Mark Present'}
                            </button>
                          </td>
                          <td className="py-3">
                            <select
                              className="input-field text-sm py-1 px-2 w-20"
                              value={studentGrades[student.studentId] || 'A'}
                              onChange={(e) => setStudentGrades(prev => ({ ...prev, [student.studentId]: e.target.value }))}
                            >
                              <option value="A">A</option>
                              <option value="B">B</option>
                              <option value="C">C</option>
                              <option value="D">D</option>
                              <option value="Pass">Pass</option>
                            </select>
                          </td>
                          <td className="py-3">
                            {hasCertificate ? (
                              <span className="flex items-center gap-1 text-green-600 text-sm">
                                <FaCheckCircle /> Generated
                              </span>
                            ) : (
                              <span className="text-gray-400 text-sm">Not generated</span>
                            )}
                          </td>
                          <td className="py-3">
                            {!hasCertificate ? (
                              <button
                                onClick={() => handleGenerateCertificate(student.studentId)}
                                className="btn-primary py-1 px-3 text-sm flex items-center gap-1"
                              >
                                <FaCertificate /> Generate
                              </button>
                            ) : (
                              <span className="text-green-600 text-sm">✓ Done</span>
                            )}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Certificate Summary */}
        {selectedEventId && certificates.length > 0 && (
          <div className="card bg-green-50 dark:bg-green-900/20">
            <div className="flex items-center gap-3">
              <FaCertificate className="text-green-600 text-2xl" />
              <div>
                <h3 className="font-semibold text-green-700 dark:text-green-400">
                  {certificates.length} Certificates Generated
                </h3>
                <p className="text-sm text-green-600 dark:text-green-500">
                  Certificates have been generated for {certificates.length} out of {participants.length} participants
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}

export default Certificates