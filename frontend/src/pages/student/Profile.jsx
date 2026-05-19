import React, { useState } from 'react'
import { FaUser, FaEnvelope, FaGraduationCap, FaCalendarAlt, FaSave } from 'react-icons/fa'
import StudentLayout from '../../components/layout/StudentLayout'
import { useAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'

function Profile() {
  const { user } = useAuth()
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    branch: user?.branch || '',
    year: user?.year || ''
  })
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    // TODO: Update profile API
    setTimeout(() => {
      toast.success('Profile updated successfully!')
      setLoading(false)
    }, 1000)
  }

  return (
    <StudentLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-primary dark:text-darkText">
            My Profile
          </h1>
          <p className="text-textSecondary dark:text-darkTextSecondary mt-1">
            View and edit your profile information
          </p>
        </div>

        <div className="card">
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
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="input-field pl-10"
                  disabled
                />
              </div>
            </div>

            <div>
              <label className="label">Branch</label>
              <div className="relative">
                <FaGraduationCap className="absolute left-3 top-1/2 transform -translate-y-1/2 text-textSecondary" />
                <select
                  name="branch"
                  value={formData.branch}
                  onChange={handleChange}
                  className="input-field pl-10"
                >
                  <option value="">Select Branch</option>
                  <option>Computer Science Engineering (CSE)</option>
                  <option>Electronics & Communication (ECE)</option>
                  <option>Mechanical Engineering (ME)</option>
                  <option>Civil Engineering (CE)</option>
                  <option>Information Technology (IT)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="label">Year</label>
              <div className="relative">
                <FaCalendarAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-textSecondary" />
                <select
                  name="year"
                  value={formData.year}
                  onChange={handleChange}
                  className="input-field pl-10"
                >
                  <option value="">Select Year</option>
                  <option>1st Year</option>
                  <option>2nd Year</option>
                  <option>3rd Year</option>
                  <option>4th Year</option>
                </select>
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full py-3 flex items-center justify-center gap-2">
              {loading ? 'Saving...' : 'Save Changes'} <FaSave />
            </button>
          </form>
        </div>
      </div>
    </StudentLayout>
  )
}

export default Profile