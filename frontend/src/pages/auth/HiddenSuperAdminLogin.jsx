import React, { useState, useEffect } from 'react'
import { FaShieldAlt, FaArrowRight, FaMoon, FaSun, FaSpinner } from 'react-icons/fa'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

function HiddenSuperAdminLogin() {
  const [darkMode, setDarkMode] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { superAdminLogin } = useAuth()

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  useEffect(() => {
    const key = searchParams.get('key')
    if (!key) {
      setError('Access denied: Missing secret key')
      setLoading(false)
      return
    }

    handleSuperAdminLogin(key)
  }, [])

  const handleSuperAdminLogin = async (key) => {
    setLoading(true)
    setError('')

    const result = await superAdminLogin(key)

    if (result.success) {
      navigate('/dashboard/super-admin')
    } else {
      setError(result.error || 'Authentication failed')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-bgLight dark:bg-darkBg transition-colors flex items-center justify-center">
      <div className="max-w-md w-full px-4">
        <div className="card p-8 text-center">
          <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
            <FaShieldAlt className="text-white text-3xl" />
          </div>

          <h1 className="text-2xl font-bold text-primary dark:text-darkText mb-2">
            Super Admin Access
          </h1>
          <p className="text-textSecondary dark:text-darkTextSecondary mb-6">
            Hidden authentication portal
          </p>

          {loading ? (
            <div className="flex flex-col items-center gap-3 py-8">
              <FaSpinner className="text-3xl text-primary animate-spin" />
              <p className="text-textSecondary">Authenticating...</p>
            </div>
          ) : error ? (
            <div className="space-y-4">
              <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
                {error}
              </div>
              <Link to="/" className="btn-primary inline-flex items-center gap-2">
                Back to Home <FaArrowRight />
              </Link>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}

export default HiddenSuperAdminLogin