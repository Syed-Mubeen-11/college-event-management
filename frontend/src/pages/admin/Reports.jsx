import React, { useState, useEffect } from 'react'
import { FaChartBar, FaChartPie, FaCalendarAlt, FaUsers, FaDownload, FaArrowRight } from 'react-icons/fa'
import AdminLayout from '../../components/layout/AdminLayout'
import adminService from '../../services/adminService'
import toast from 'react-hot-toast'

function Reports() {
  const [events, setEvents] = useState([])
  const [selectedEventId, setSelectedEventId] = useState('')
  const [branchReport, setBranchReport] = useState(null)
  const [yearReport, setYearReport] = useState(null)
  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(false)
  const [loadingEvents, setLoadingEvents] = useState(true)

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

  const fetchReports = async () => {
    if (!selectedEventId) {
      toast.error('Please select an event')
      return
    }

    setLoading(true)
    try {
      const [branchData, yearData, summaryData] = await Promise.all([
        adminService.getBranchWiseReport(selectedEventId),
        adminService.getYearWiseReport(selectedEventId),
        adminService.getEventSummary(selectedEventId)
      ])
      setBranchReport(branchData)
      setYearReport(yearData)
      setSummary(summaryData)
    } catch (error) {
      toast.error('Failed to load reports')
    } finally {
      setLoading(false)
    }
  }

  const getEventTitle = () => {
    const event = events.find(e => e.id === parseInt(selectedEventId))
    return event ? event.title : ''
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-primary dark:text-darkText">
            Reports & Analytics
          </h1>
          <p className="text-textSecondary dark:text-darkTextSecondary mt-1">
            View event statistics and registration insights
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
                    {event.title} ({event.status})
                  </option>
                ))}
              </select>
            </div>
            <button
              onClick={fetchReports}
              disabled={!selectedEventId || loading}
              className="btn-primary flex items-center gap-2"
            >
              {loading ? 'Loading...' : <><FaChartBar /> Generate Report</>}
            </button>
          </div>
        </div>

        {/* Reports Content */}
        {branchReport && yearReport && summary && (
          <div className="space-y-6">
            {/* Summary Card */}
            <div className="card">
              <h2 className="text-xl font-bold text-primary dark:text-darkText mb-4">
                Event Summary: {getEventTitle()}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="text-center p-3 bg-bgLight rounded-lg">
                  <p className="text-2xl font-bold text-primary">{summary.registrationStats?.totalRegistered || 0}</p>
                  <p className="text-sm text-textSecondary">Total Registered</p>
                </div>
                <div className="text-center p-3 bg-bgLight rounded-lg">
                  <p className="text-2xl font-bold text-primary">{summary.event?.capacity || 0}</p>
                  <p className="text-sm text-textSecondary">Total Capacity</p>
                </div>
                <div className="text-center p-3 bg-bgLight rounded-lg">
                  <p className="text-2xl font-bold text-primary">{summary.registrationStats?.availableSpots || 0}</p>
                  <p className="text-sm text-textSecondary">Available Spots</p>
                </div>
                <div className="text-center p-3 bg-bgLight rounded-lg">
                  <p className="text-2xl font-bold text-primary">{summary.registrationStats?.utilization || '0%'}</p>
                  <p className="text-sm text-textSecondary">Utilization</p>
                </div>
              </div>
            </div>

            {/* Branch Wise Report */}
            <div className="card">
              <h2 className="text-xl font-bold text-primary dark:text-darkText mb-4">
                Branch-wise Registration
              </h2>
              {branchReport.branchWise && Object.keys(branchReport.branchWise).length === 0 ? (
                <p className="text-textSecondary">No registrations yet</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="border-b border-borderLight">
                      <tr className="text-left text-sm text-textSecondary">
                        <th className="pb-2">Branch</th>
                        <th className="pb-2">Number of Students</th>
                        <th className="pb-2">Percentage</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(branchReport.branchWise || {}).map(([branch, count]) => (
                        <tr key={branch} className="border-b border-borderLight">
                          <td className="py-2">{branch}</td>
                          <td className="py-2">{count}</td>
                          <td className="py-2">
                            {((count / branchReport.totalRegistered) * 100).toFixed(1)}%
                          </td>
                        </tr>
                      ))}
                    </tbody>
                   </table>
                </div>
              )}
            </div>

            {/* Year Wise Report */}
            <div className="card">
              <h2 className="text-xl font-bold text-primary dark:text-darkText mb-4">
                Year-wise Registration
              </h2>
              {yearReport.yearWise && Object.keys(yearReport.yearWise).length === 0 ? (
                <p className="text-textSecondary">No registrations yet</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="border-b border-borderLight">
                      <tr className="text-left text-sm text-textSecondary">
                        <th className="pb-2">Year</th>
                        <th className="pb-2">Number of Students</th>
                        <th className="pb-2">Percentage</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(yearReport.yearWise || {}).map(([year, count]) => (
                        <tr key={year} className="border-b border-borderLight">
                          <td className="py-2">{year}</td>
                          <td className="py-2">{count}</td>
                          <td className="py-2">
                            {((count / yearReport.totalRegistered) * 100).toFixed(1)}%
                          </td>
                        </tr>
                      ))}
                    </tbody>
                   </table>
                </div>
              )}
            </div>

            {/* Recent Registrations */}
            {summary.recentRegistrations && summary.recentRegistrations.length > 0 && (
              <div className="card">
                <h2 className="text-xl font-bold text-primary dark:text-darkText mb-4">
                  Recent Registrations
                </h2>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="border-b border-borderLight">
                      <tr className="text-left text-sm text-textSecondary">
                        <th className="pb-2">Student Name</th>
                        <th className="pb-2">Branch</th>
                        <th className="pb-2">Year</th>
                        <th className="pb-2">Registered On</th>
                       </tr>
                    </thead>
                    <tbody>
                      {summary.recentRegistrations.map((reg, index) => (
                        <tr key={index} className="border-b border-borderLight">
                          <td className="py-2">{reg.studentName}</td>
                          <td className="py-2">{reg.branch || '-'}</td>
                          <td className="py-2">{reg.year || '-'}</td>
                          <td className="py-2">{new Date(reg.registeredAt).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                   </table>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </AdminLayout>
  )
}

export default Reports