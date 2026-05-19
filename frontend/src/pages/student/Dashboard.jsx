import React, { useState, useEffect } from 'react'
import { FaCalendarAlt, FaUsers, FaCertificate, FaArrowRight } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import StudentLayout from '../../components/layout/StudentLayout'
import studentService from '../../services/studentService'

function Dashboard() {
  const [stats, setStats] = useState({
    totalEvents: 0,
    registeredEvents: 0,
    certificates: 0
  })
  const [recentEvents, setRecentEvents] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const eventsRes = await studentService.getUpcomingEvents()
      const myEventsRes = await studentService.getMyEvents()
      const certsRes = await studentService.getMyCertificates()
      
      setStats({
        totalEvents: eventsRes.events?.length || 0,
        registeredEvents: myEventsRes.registrations?.length || 0,
        certificates: certsRes.totalCertificates || 0
      })
      setRecentEvents(eventsRes.events?.slice(0, 3) || [])
    } catch (error) {
      console.error('Error fetching dashboard:', error)
    } finally {
      setLoading(false)
    }
  }

  const statCards = [
    { icon: FaCalendarAlt, label: 'Upcoming Events', value: stats.totalEvents, color: 'bg-primary' },
    { icon: FaUsers, label: 'My Registrations', value: stats.registeredEvents, color: 'bg-secondary' },
    { icon: FaCertificate, label: 'Certificates', value: stats.certificates, color: 'bg-green-500' },
  ]

  return (
    <StudentLayout>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-primary dark:text-darkText">
            Welcome back!
          </h1>
          <p className="text-textSecondary dark:text-darkTextSecondary mt-1">
            Here's what's happening with your events
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {statCards.map((stat, index) => (
            <div key={index} className="card flex items-center gap-4">
              <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                <stat.icon className="text-white text-xl" />
              </div>
              <div>
                <p className="text-2xl font-bold text-primary dark:text-darkText">{stat.value}</p>
                <p className="text-sm text-textSecondary">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Events */}
        <div className="card">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-primary dark:text-darkText">Upcoming Events</h2>
            <Link to="/dashboard/student/events" className="text-secondary hover:underline flex items-center gap-1 text-sm">
              View All <FaArrowRight />
            </Link>
          </div>
          
          {loading ? (
            <div className="text-center py-8 text-textSecondary">Loading...</div>
          ) : recentEvents.length === 0 ? (
            <div className="text-center py-8 text-textSecondary">No upcoming events available</div>
          ) : (
            <div className="space-y-3">
              {recentEvents.map((event) => (
                <div key={event.id} className="flex justify-between items-center p-3 bg-bgLight dark:bg-darkCard rounded-lg">
                  <div>
                    <h3 className="font-semibold text-primary dark:text-darkText">{event.title}</h3>
                    <p className="text-sm text-textSecondary">{event.venue}</p>
                    <p className="text-xs text-textSecondary mt-1">
                      {new Date(event.startDate).toLocaleDateString()}
                    </p>
                  </div>
                  <Link
                    to={`/dashboard/student/events/${event.id}`}
                    className="btn-primary py-1 px-3 text-sm"
                  >
                    View
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </StudentLayout>
  )
}

export default Dashboard