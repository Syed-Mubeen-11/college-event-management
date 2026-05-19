import { useState, useEffect, useCallback } from 'react'
import { FaUniversity, FaUsers, FaCalendarAlt, FaShieldAlt, FaToggleOn, FaToggleOff, FaSyncAlt } from 'react-icons/fa'
import SuperAdminLayout from '../../components/layout/SuperAdminLayout'
import api from '../../services/api'
import toast from 'react-hot-toast'

function Dashboard() {
  const [stats, setStats] = useState(null)
  const [institutions, setInstitutions] = useState([])
  const [loading, setLoading] = useState(true)
  const [toggling, setToggling] = useState(null)

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const [dashboardRes, institutionsRes] = await Promise.all([
        api.get('/super-admin/dashboard'),
        api.get('/super-admin/institutions')
      ])
      setStats(dashboardRes.data)
      setInstitutions(institutionsRes.data.institutions || [])
    } catch (error) {
      toast.error(error.response?.data || 'Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const handleToggleInstitution = async (institutionId, currentStatus) => {
    setToggling(institutionId)
    try {
      const endpoint = currentStatus
        ? `/super-admin/institutions/${institutionId}/disable`
        : `/super-admin/institutions/${institutionId}/enable`
      await api.put(endpoint)
      toast.success(currentStatus ? 'Institution disabled' : 'Institution enabled')
      fetchData()
    } catch (error) {
      toast.error(error.response?.data || 'Failed to update institution')
    } finally {
      setToggling(null)
    }
  }

  if (loading && !stats) {
    return (
      <SuperAdminLayout>
        <div className="flex justify-center items-center h-64">
          <p className="text-textSecondary">Loading dashboard...</p>
        </div>
      </SuperAdminLayout>
    )
  }

  return (
    <SuperAdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-primary dark:text-darkText">
              System Dashboard
            </h1>
            <p className="text-textSecondary dark:text-darkTextSecondary mt-1">
              Overview of all institutions, users, and events
            </p>
          </div>
          <button
            onClick={fetchData}
            className="btn-primary flex items-center gap-2"
          >
            <FaSyncAlt /> Refresh
          </button>
        </div>

        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="card flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <FaUniversity className="text-blue-600 text-xl" />
              </div>
              <div>
                <p className="text-2xl font-bold text-primary dark:text-darkText">{stats.totalInstitutions}</p>
                <p className="text-sm text-textSecondary">Total Institutions</p>
                <p className="text-xs text-green-600">{stats.activeInstitutions} active</p>
              </div>
            </div>

            <div className="card flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <FaUsers className="text-green-600 text-xl" />
              </div>
              <div>
                <p className="text-2xl font-bold text-primary dark:text-darkText">{stats.totalUsers?.students || 0}</p>
                <p className="text-sm text-textSecondary">Total Students</p>
                <p className="text-xs text-textSecondary">{stats.totalUsers?.institutionAdmins || 0} admins</p>
              </div>
            </div>

            <div className="card flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <FaCalendarAlt className="text-purple-600 text-xl" />
              </div>
              <div>
                <p className="text-2xl font-bold text-primary dark:text-darkText">{stats.totalEvents}</p>
                <p className="text-sm text-textSecondary">Total Events</p>
                <p className="text-xs text-green-600">{stats.upcomingEvents} upcoming</p>
              </div>
            </div>

            <div className="card flex items-center gap-4">
              <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                <FaShieldAlt className="text-amber-600 text-xl" />
              </div>
              <div>
                <p className="text-2xl font-bold text-primary dark:text-darkText">{stats.totalUsers?.superAdmins || 0}</p>
                <p className="text-sm text-textSecondary">Super Admins</p>
                <p className="text-xs text-textSecondary">{stats.totalUsers?.total || 0} total users</p>
              </div>
            </div>
          </div>
        )}

        <div className="card">
          <h2 className="text-xl font-bold text-primary dark:text-darkText mb-4">
            All Institutions
          </h2>

          {institutions.length === 0 ? (
            <div className="text-center py-8 text-textSecondary">
              <FaUniversity className="text-4xl mx-auto mb-3" />
              <p>No institutions registered yet</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-borderLight">
                  <tr className="text-left text-sm text-textSecondary">
                    <th className="pb-3">Name</th>
                    <th className="pb-3">Email Domain</th>
                    <th className="pb-3">Contact</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {institutions.map((inst) => (
                    <tr key={inst.id} className="border-b border-borderLight hover:bg-pink/10 transition">
                      <td className="py-3 font-medium text-primary dark:text-darkText">
                        {inst.name}
                      </td>
                      <td className="py-3 text-sm text-textSecondary">
                        {inst.emailDomain || '-'}
                      </td>
                      <td className="py-3 text-sm text-textSecondary">
                        {inst.contactEmail || inst.contactPhone || '-'}
                      </td>
                      <td className="py-3">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          inst.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {inst.isActive ? 'Active' : 'Disabled'}
                        </span>
                      </td>
                      <td className="py-3">
                        <button
                          onClick={() => handleToggleInstitution(inst.id, inst.isActive)}
                          disabled={toggling === inst.id}
                          className={`flex items-center gap-1 px-3 py-1 rounded text-sm transition ${
                            inst.isActive
                              ? 'bg-red-100 text-red-600 hover:bg-red-200'
                              : 'bg-green-100 text-green-600 hover:bg-green-200'
                          }`}
                        >
                          {toggling === inst.id ? (
                            '...'
                          ) : inst.isActive ? (
                            <><FaToggleOff /> Disable</>
                          ) : (
                            <><FaToggleOn /> Enable</>
                          )}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </SuperAdminLayout>
  )
}

export default Dashboard