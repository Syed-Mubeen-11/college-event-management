import React, { useState } from 'react'
import { 
  FaBuilding, 
  FaEnvelope, 
  FaLock, 
  FaArrowRight, 
  FaUniversity,
  FaMoon, 
  FaSun,
  FaPhone,
  FaMapMarkerAlt,
  FaUser,
  FaCheckCircle,
  FaSpinner
} from 'react-icons/fa'
import { Link, useNavigate } from 'react-router-dom'
import authService from '../../services/authService'
import toast from 'react-hot-toast'

function InstitutionRegister() {
  const navigate = useNavigate()
  const [darkMode, setDarkMode] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  
  const [formData, setFormData] = useState({
    institutionName: '',
    emailDomain: '',
    contactEmail: '',
    contactPhone: '',
    address: '',
    adminName: '',
    adminEmail: '',
    adminPassword: '',
    confirmPassword: ''
  })

  React.useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
    setError('')
  }

  const validateForm = () => {
    if (formData.adminPassword !== formData.confirmPassword) {
      setError("Passwords don't match")
      return false
    }
    if (formData.adminPassword.length < 6) {
      setError("Password must be at least 6 characters")
      return false
    }
    if (!formData.institutionName.trim()) {
      setError("Institution name is required")
      return false
    }
    if (!formData.adminEmail.includes('@')) {
      setError("Valid email is required")
      return false
    }
    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setLoading(true)
    setError('')
    
    const registrationData = {
      institutionName: formData.institutionName,
      emailDomain: formData.emailDomain,
      contactEmail: formData.contactEmail,
      contactPhone: formData.contactPhone,
      address: formData.address,
      adminName: formData.adminName,
      adminEmail: formData.adminEmail,
      adminPassword: formData.adminPassword
    }
    
    try {
      const response = await authService.registerInstitution(registrationData)
      console.log('Registration success:', response)
      setSuccess(true)
      toast.success('Institution registered successfully!')
      
      // Redirect to admin login after 2 seconds
      setTimeout(() => {
        navigate('/login/admin')
      }, 2000)
      
    } catch (error) {
      console.error('Registration error:', error)
      const errorMsg = error.response?.data || 'Registration failed. Please try again.'
      setError(errorMsg)
      toast.error(errorMsg)
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-bgLight dark:bg-darkBg flex items-center justify-center px-4">
        <div className="card p-8 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaCheckCircle className="text-green-500 text-4xl" />
          </div>
          <h2 className="text-2xl font-bold text-primary dark:text-darkText mb-2">
            Registration Successful!
          </h2>
          <p className="text-textSecondary dark:text-darkTextSecondary mb-4">
            Your institution has been registered successfully.
            You can now login as admin.
          </p>
          <Link to="/login/admin" className="btn-primary inline-flex items-center gap-2">
            Go to Login <FaArrowRight />
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-bgLight dark:bg-darkBg transition-colors">
      {/* Navbar */}
      <nav className="bg-white dark:bg-darkCard shadow-md sticky top-0 z-50 transition-colors">
        <div className="px-4 sm:px-8 md:px-12 lg:px-16">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center gap-2 cursor-pointer">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <FaUniversity className="text-white text-sm" />
              </div>
              <span className="text-xl font-bold text-primary dark:text-darkText">EventElite</span>
            </Link>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-full hover:bg-pink transition-colors"
            >
              {darkMode ? <FaSun className="text-yellow-400" /> : <FaMoon className="text-primary" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Registration Form */}
      <div className="px-4 py-8 md:py-12">
        <div className="max-w-4xl mx-auto">
          <div className="card p-6 md:p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <FaBuilding className="text-white text-3xl" />
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-primary dark:text-darkText">
                Register Your Institution
              </h1>
              <p className="text-textSecondary dark:text-darkTextSecondary mt-2">
                Join EventElite and start managing college events
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Registration Form */}
            <form onSubmit={handleSubmit}>
              {/* Institution Details Section */}
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-primary dark:text-darkText mb-4 pb-2 border-b border-borderLight">
                  Institution Details
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="label">Institution Name *</label>
                    <div className="relative">
                      <FaBuilding className="absolute left-3 top-1/2 transform -translate-y-1/2 text-textSecondary" />
                      <input
                        type="text"
                        name="institutionName"
                        value={formData.institutionName}
                        onChange={handleChange}
                        className="input-field pl-10"
                        placeholder="e.g., MIT College of Engineering"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="label">Email Domain *</label>
                    <div className="relative">
                      <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-textSecondary" />
                      <input
                        type="text"
                        name="emailDomain"
                        value={formData.emailDomain}
                        onChange={handleChange}
                        className="input-field pl-10"
                        placeholder="e.g., mit.edu"
                        required
                      />
                    </div>
                    <p className="text-xs text-textSecondary mt-1">Used for student email validation</p>
                  </div>
                  <div>
                    <label className="label">Contact Email *</label>
                    <div className="relative">
                      <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-textSecondary" />
                      <input
                        type="email"
                        name="contactEmail"
                        value={formData.contactEmail}
                        onChange={handleChange}
                        className="input-field pl-10"
                        placeholder="contact@college.edu"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="label">Contact Phone *</label>
                    <div className="relative">
                      <FaPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-textSecondary" />
                      <input
                        type="tel"
                        name="contactPhone"
                        value={formData.contactPhone}
                        onChange={handleChange}
                        className="input-field pl-10"
                        placeholder="+91 XXXXXXXXXX"
                        required
                      />
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <label className="label">Address *</label>
                    <div className="relative">
                      <FaMapMarkerAlt className="absolute left-3 top-4 text-textSecondary" />
                      <textarea
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        className="input-field pl-10 min-h-[80px]"
                        placeholder="Full address of the institution"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Admin Details Section */}
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-primary dark:text-darkText mb-4 pb-2 border-b border-borderLight">
                  Admin Account Details
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="label">Admin Name *</label>
                    <div className="relative">
                      <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-textSecondary" />
                      <input
                        type="text"
                        name="adminName"
                        value={formData.adminName}
                        onChange={handleChange}
                        className="input-field pl-10"
                        placeholder="Full name"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="label">Admin Email *</label>
                    <div className="relative">
                      <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-textSecondary" />
                      <input
                        type="email"
                        name="adminEmail"
                        value={formData.adminEmail}
                        onChange={handleChange}
                        className="input-field pl-10"
                        placeholder="admin@college.edu"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="label">Password *</label>
                    <div className="relative">
                      <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-textSecondary" />
                      <input
                        type="password"
                        name="adminPassword"
                        value={formData.adminPassword}
                        onChange={handleChange}
                        className="input-field pl-10"
                        placeholder="Min 6 characters"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="label">Confirm Password *</label>
                    <div className="relative">
                      <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-textSecondary" />
                      <input
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className="input-field pl-10"
                        placeholder="Re-enter password"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full py-3 flex items-center justify-center gap-2 text-lg"
              >
                {loading ? <><FaSpinner className="animate-spin" /> Registering...</> : <>Register Institution <FaArrowRight /></>}
              </button>
            </form>

            {/* Footer Links */}
            <div className="mt-6 text-center">
              <p className="text-textSecondary text-sm">
                Already have an account?{' '}
                <Link to="/login/admin" className="text-primary font-semibold hover:underline">
                  Login here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default InstitutionRegister