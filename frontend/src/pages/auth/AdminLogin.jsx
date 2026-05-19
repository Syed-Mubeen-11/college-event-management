import React, { useState } from 'react'
import { FaEnvelope, FaLock, FaArrowRight, FaUserTie, FaMoon, FaSun } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

function AdminLogin() {
  const [darkMode, setDarkMode] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  React.useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

      const navigate = useNavigate()
    const { login } = useAuth()

    const handleSubmit = async (e) => {
  e.preventDefault()
  setLoading(true)
  setError('')
  
  const result = await login(email, password, 'admin')
  
  if (result.success) {
  if (result.role === 'STUDENT') {
    navigate('/dashboard/student')
  } else if (result.role === 'INSTITUTION_ADMIN') {
    navigate('/dashboard/admin')
  } else if (result.role === 'SUPER_ADMIN') {
    navigate('/dashboard/super-secret')
  }
} else {
    setError(result.error || 'Invalid email or password')
  }
  
  setLoading(false)
}
  return (
    <div className="min-h-screen bg-bgLight dark:bg-darkBg transition-colors">
      {/* Navbar */}
      <nav className="bg-white dark:bg-darkCard shadow-md sticky top-0 z-50 transition-colors">
        <div className="px-4 sm:px-8 md:px-12 lg:px-16">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center gap-2 cursor-pointer">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <FaUserTie className="text-white text-sm" />
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

      {/* Login Form */}
      <div className="flex items-center justify-center px-4 py-12 md:py-20">
        <div className="max-w-md w-full">
          <div className="card p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <FaUserTie className="text-white text-3xl" />
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-primary dark:text-darkText">
                Admin Login
              </h1>
              <p className="text-textSecondary dark:text-darkTextSecondary mt-2">
                Manage events, students, and certificates
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit}>
              <div className="mb-5">
                <label className="label">Email Address</label>
                <div className="relative">
                  <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-textSecondary" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input-field pl-10"
                    placeholder="admin@college.edu"
                    required
                  />
                </div>
              </div>

              <div className="mb-6">
                <label className="label">Password</label>
                <div className="relative">
                  <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-textSecondary" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input-field pl-10"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full py-3 flex items-center justify-center gap-2"
              >
                {loading ? 'Logging in...' : 'Login'} 
                {!loading && <FaArrowRight />}
              </button>
            </form>

            {/* Footer Links */}
            <div className="mt-6 text-center">
              <Link to="/forgot-password" className="text-sm text-textSecondary hover:text-primary transition">
                Forgot Password?
              </Link>
              <p className="text-textSecondary text-sm mt-4">
                New Institution?{' '}
                <Link to="/register/institution" className="text-primary font-semibold hover:underline">
                  Register Here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminLogin