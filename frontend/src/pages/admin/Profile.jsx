import { useState, useEffect } from 'react'
import { FaUser, FaEnvelope, FaBuilding, FaSave } from 'react-icons/fa'
import AdminLayout from '../../components/layout/AdminLayout'
import adminService from '../../services/adminService'
import toast from 'react-hot-toast'

function Profile() {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    institutionName: ''
  })

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      const data = await adminService.getProfile()
      setFormData({
        name: data.name || '',
        email: data.email || '',
        institutionName: data.institutionName || ''
      })
    } catch (error) {
      toast.error('Failed to load profile')
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
    try {
      await adminService.updateProfile({
        name: formData.name
      })
      toast.success('Profile updated successfully')
      fetchProfile() // Refresh data
    } catch (error) {
      toast.error('Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-primary dark:text-darkText">
            My Profile
          </h1>
          <p className="text-textSecondary dark:text-darkTextSecondary mt-1">
            View your account information
          </p>
        </div>

        <div className="card max-w-2xl">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="label">Full Name</label>
              <div className="relative">
                <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-textSecondary" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="input-field pl-10"
                  required
                />
              </div>
            </div>

            <div>
              <label className="label">Email Address</label>
              <div className="relative">
                <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-textSecondary" />
                <input
                  type="email"
                  value={formData.email}
                  className="input-field pl-10 bg-gray-100 dark:bg-gray-800 cursor-not-allowed"
                  disabled
                />
              </div>
            </div>

            <div>
              <label className="label">Institution</label>
              <div className="relative">
                <FaBuilding className="absolute left-3 top-1/2 transform -translate-y-1/2 text-textSecondary" />
                <input
                  type="text"
                  value={formData.institutionName}
                  className="input-field pl-10 bg-gray-100 dark:bg-gray-800 cursor-not-allowed"
                  disabled
                />
              </div>
            </div>

            <div className="flex justify-end pt-4">
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

export default Profile