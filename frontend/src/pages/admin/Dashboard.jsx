import { useState, useEffect } from 'react'
import { FaCalendarAlt, FaUsers, FaChartBar, FaCertificate, FaArrowRight } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import AdminLayout from '../../components/layout/AdminLayout'
import adminService from '../../services/adminService'
import toast from 'react-hot-toast'

function AdminDashboard() {
  const [stats, setStats] = useState({
    totalEvents: 0,
    totalStudents: 0,
    totalRegistrations: 0,
    upcomingEvents: 0
  })
  const [recentEvents, setRecentEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    console.log('AdminDashboard mounted')
    fetchDashboardData()
    fetchRecentEvents()
  }, [])

  const fetchDashboardData = async () => {
    try {
      console.log('Fetching dashboard stats...')
      const response = await adminService.getDashboardStats()
      console.log('Dashboard stats response:', response)
      setStats({
        totalEvents: response.institution?.totalEvents || 0,
        totalStudents: response.institution?.totalStudents || 0,
        totalRegistrations: response.institution?.totalRegistrations || 0,
        upcomingEvents: response.institution?.upcomingEvents || 0
      })
    } catch (err) {
      console.error('Error fetching stats:', err)
      setError(err.message)
      toast.error('Failed to load dashboard data')
    }
  }

  const fetchRecentEvents = async () => {
    try {
      console.log('Fetching recent events...')
      const response = await adminService.getEvents()
      console.log('Events response:', response)
      setRecentEvents(response.events?.slice(0, 5) || [])
    } catch (err) {
      console.error('Error fetching events:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="p-6 bg-red-100 rounded-lg">
          <p className="text-red-700">Error: {error}</p>
          <p className="text-sm text-red-600 mt-2">Check console for more details</p>
        </div>
      </AdminLayout>
    )
  }

  const statCards = [
    { 
      icon: FaCalendarAlt, 
      label: 'Total Events', 
      value: stats.totalEvents, 
      color: 'bg-primary',
      link: '/dashboard/admin/events'
    },
    { 
      icon: FaUsers, 
      label: 'Total Students', 
      value: stats.totalStudents, 
      color: 'bg-secondary',
      link: '/dashboard/admin/students'
    },
    { 
      icon: FaChartBar, 
      label: 'Registrations', 
      value: stats.totalRegistrations, 
      color: 'bg-green-500',
      link: '/dashboard/admin/reports'
    },
    { 
      icon: FaCertificate, 
      label: 'Upcoming Events', 
      value: stats.upcomingEvents, 
      color: 'bg-yellow-500',
      link: '/dashboard/admin/events'
    },
  ]

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-primary dark:text-darkText">
            Dashboard
          </h1>
          <p className="text-textSecondary dark:text-darkTextSecondary mt-1">
            Welcome back! Here's what's happening with your events.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((stat, index) => (
            <Link key={index} to={stat.link} className="card flex items-center gap-4 hover:shadow-lg transition">
              <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                <stat.icon className="text-white text-xl" />
              </div>
              <div>
                <p className="text-2xl font-bold text-primary dark:text-darkText">{stat.value}</p>
                <p className="text-sm text-textSecondary">{stat.label}</p>
              </div>
            </Link>
          ))}
        </div>

        <div className="card">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-primary dark:text-darkText">Recent Events</h2>
            <Link to="/dashboard/admin/events" className="text-secondary hover:underline flex items-center gap-1 text-sm">
              View All <FaArrowRight />
            </Link>
          </div>
          
          {loading ? (
            <div className="text-center py-8 text-textSecondary">Loading events...</div>
          ) : recentEvents.length === 0 ? (
            <div className="text-center py-8 text-textSecondary">No events created yet</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-borderLight">
                  <tr className="text-left text-sm text-textSecondary">
                    <th className="pb-2">Event Name</th>
                    <th className="pb-2">Date</th>
                    <th className="pb-2">Venue</th>
                    <th className="pb-2">Status</th>
                    <th className="pb-2">Registrations</th>
                    <th className="pb-2"></th>
                  </tr>
                </thead>
                <tbody>
                  {recentEvents.map((event) => (
                    <tr key={event.id} className="border-b border-borderLight">
                      <td className="py-3 font-medium text-primary dark:text-darkText">{event.title}</td>
                      <td className="py-3 text-sm text-textSecondary">
                        {new Date(event.startDate).toLocaleDateString()}
                      </td>
                      <td className="py-3 text-sm text-textSecondary">{event.venue}</td>
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
                        {event.registeredCount}/{event.capacity}
                      </td>
                      <td className="py-3">
                        <Link 
                          to={`/dashboard/admin/events/${event.id}`}
                          className="text-primary hover:underline text-sm"
                        >
                          View
                        </Link>
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

export default AdminDashboard