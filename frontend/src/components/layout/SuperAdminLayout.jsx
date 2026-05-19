import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  FaTachometerAlt,
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaShieldAlt,
  FaMoon,
  FaSun
} from 'react-icons/fa'
import { useAuth } from '../../context/AuthContext'

function SuperAdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [darkMode, setDarkMode] = useState(false)
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false)
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const menuItems = [
    { icon: FaTachometerAlt, label: 'Dashboard', path: '/dashboard/super-admin' },
  ]

  useEffect(() => {
    const handleClickOutside = () => {
      setProfileDropdownOpen(false)
    }
    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [])

  return (
    <div className="min-h-screen bg-bgLight dark:bg-darkBg">
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-darkCard shadow-lg transform transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b border-borderLight dark:border-darkBorder">
            <Link to="/dashboard/super-admin" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <FaShieldAlt className="text-white text-sm" />
              </div>
              <span className="font-bold text-primary dark:text-darkText text-lg">Super Admin</span>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-textPrimary dark:text-darkText"
            >
              <FaTimes />
            </button>
          </div>

          <nav className="flex-1 p-4">
            <ul className="space-y-2">
              {menuItems.map((item) => (
                <li key={item.label}>
                  <Link
                    to={item.path}
                    className="flex items-center gap-3 px-4 py-2 rounded-lg text-textSecondary hover:bg-pink hover:text-primary transition group"
                    onClick={() => setSidebarOpen(false)}
                  >
                    <item.icon className="text-lg" />
                    <span>{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="p-4 border-t border-borderLight dark:border-darkBorder">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-2 w-full rounded-lg text-red-500 hover:bg-red-50 transition"
            >
              <FaSignOutAlt />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      <div className="lg:ml-64">
        <nav className="bg-white dark:bg-darkCard shadow-md sticky top-0 z-40">
          <div className="px-4 py-3 flex justify-between items-center">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-textPrimary dark:text-darkText"
            >
              <FaBars className="text-xl" />
            </button>

            <div className="flex items-center gap-4 ml-auto">
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="p-2 rounded-full hover:bg-pink transition-colors"
                title={darkMode ? 'Light Mode' : 'Dark Mode'}
              >
                {darkMode ? <FaSun className="text-yellow-400 text-lg" /> : <FaMoon className="text-primary text-lg" />}
              </button>

              
              <div className="relative">
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setProfileDropdownOpen(!profileDropdownOpen)
                  }}
                  className="flex items-center gap-2 p-2 rounded-lg hover:bg-pink transition-colors"
                >
                  <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center">
                    <FaShieldAlt className="text-white text-sm" />
                  </div>
                  <span className="hidden md:block text-sm text-textSecondary">
                    {user?.name || 'Super Admin'}
                  </span>
                </button>

                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-darkCard rounded-lg shadow-lg border border-borderLight z-50">
                    <div className="p-3 border-b border-borderLight">
                      <p className="font-semibold">{user?.name}</p>
                      <p className="text-xs text-textSecondary">{user?.email}</p>
                    </div>
                    <div className="border-t border-borderLight">
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-2 w-full text-red-500 hover:bg-red-50 transition text-left"
                      >
                        <FaSignOutAlt className="text-sm" />
                        <span>Logout</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </nav>

        <main className="p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  )
}

export default SuperAdminLayout