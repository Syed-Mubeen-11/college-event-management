import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { 
  FaCalendarAlt, 
  FaUsers, 
  FaCertificate, 
  FaChartBar,
  FaShieldAlt,
  FaBuilding,
  FaMoon,
  FaSun,
  FaBars,
  FaTimes,
  FaArrowRight,
  FaUniversity,
  FaUserTie,
  FaUserGraduate
} from 'react-icons/fa'
import logo from '../../assets/logo.png'
import heroImage from '../../assets/hero.jpeg'
import institutionImg from '../../assets/institution.webp'
import adminImg from '../../assets/admin.avif'
import studentImg from '../../assets/students.png'

function LandingPage() {
  const [darkMode, setDarkMode] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  const features = [
    { icon: FaCalendarAlt, title: 'Event Management', desc: 'Create and manage events effortlessly' },
    { icon: FaUsers, title: 'Student Registration', desc: 'Easy registration with branch/year filtering' },
    { icon: FaCertificate, title: 'Certificate Generation', desc: 'Auto-generate beautiful PDF certificates' },
    { icon: FaChartBar, title: 'Real-time Reports', desc: 'Branch-wise and year-wise analytics' },
    { icon: FaShieldAlt, title: 'Secure Access', desc: 'Role-based access for all users' },
    { icon: FaBuilding, title: 'Multi-College', desc: 'Support for multiple institutions' },
  ]

  const roleCards = [
    {
      title: 'Institution',
      icon: FaUniversity,
      image: institutionImg,
      description: 'Register your college and start managing events',
      buttonText: 'Register Institution',
      buttonColor: 'primary',
      link: '/register/institution'
    },
    {
      title: 'Admin',
      icon: FaUserTie,
      image: adminImg,
      description: 'Manage events, students, and generate certificates',
      buttonText: 'Admin Login',
      buttonColor: 'primary',
      link: '/login/admin'
    },
    {
      title: 'Student',
      icon: FaUserGraduate,
      image: studentImg,
      description: 'Login to view events, register, and download certificates',
      buttonText: 'Student Login',
      buttonColor: 'primary',
      link: '/login/student'
    }
  ]

  return (
    <div className="min-h-screen">
      {/* Navbar */}
      <nav className="bg-white dark:bg-darkCard shadow-md sticky top-0 z-50 transition-colors">
        <div className="px-4 sm:px-8 md:px-12 lg:px-16">
          <div className="flex justify-between items-center h-20">
            {/* Logo - Increased Size */}
            <div className="flex items-center gap-3 cursor-pointer">
              <img src={logo} alt="EventElite" className="w-10 h-10 object-contain" />
              <span className="text-2xl font-bold text-primary dark:text-darkText">EventElite</span>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-8">
              <a href="#home" className="text-textSecondary dark:text-darkTextSecondary hover:text-primary dark:hover:text-secondary transition">Home</a>
              <a href="#features" className="text-textSecondary dark:text-darkTextSecondary hover:text-primary dark:hover:text-secondary transition">Features</a>
              <a href="#roles" className="btn-primary px-5 py-2 text-sm">Get Started</a>
              <a href="#contact" className="text-textSecondary dark:text-darkTextSecondary hover:text-primary dark:hover:text-secondary transition">Contact</a>
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="p-2 rounded-full hover:bg-pink transition-colors"
              >
                {darkMode ? <FaSun className="text-yellow-400 text-xl" /> : <FaMoon className="text-primary text-xl" />}
              </button>
            </div>

            {/* Mobile Menu Button */}
            <div className="flex items-center gap-3 md:hidden">
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="p-2 rounded-full hover:bg-pink transition-colors"
              >
                {darkMode ? <FaSun className="text-yellow-400" /> : <FaMoon className="text-primary" />}
              </button>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-textPrimary dark:text-darkText text-2xl"
              >
                {mobileMenuOpen ? <FaTimes /> : <FaBars />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-borderLight dark:border-darkBorder">
              <div className="flex flex-col gap-4">
                <a href="#home" className="text-textSecondary dark:text-darkTextSecondary hover:text-primary transition py-2" onClick={() => setMobileMenuOpen(false)}>Home</a>
                <a href="#features" className="text-textSecondary dark:text-darkTextSecondary hover:text-primary transition py-2" onClick={() => setMobileMenuOpen(false)}>Features</a>
                <a href="#roles" className="btn-primary text-center" onClick={() => setMobileMenuOpen(false)}>Get Started</a>
                <a href="#contact" className="text-textSecondary dark:text-darkTextSecondary hover:text-primary transition py-2" onClick={() => setMobileMenuOpen(false)}>Contact</a>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section - Removed Welcome Badge */}
      <section id="home" className="px-4 sm:px-8 md:px-12 lg:px-16 py-12 md:py-16">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          {/* Left Content */}
          <div className="flex-1 text-center lg:text-left">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary dark:text-darkText mb-6">
              Smart College <br />
              Event Management
            </h1>
            <p className="text-textSecondary dark:text-darkTextSecondary text-lg md:text-xl mb-8 max-w-2xl lg:mx-0 mx-auto leading-relaxed">
              Manage events, track registrations, and issue certificates - all in one place. The complete solution for modern college event management.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <a href="#roles" className="btn-primary inline-flex items-center gap-2">
                Get Started <FaArrowRight />
              </a>
              <a href="#features" className="btn-outline">Learn More</a>
            </div>
           </div>

          {/* Right Image */}
          <div className="flex-1 max-w-md lg:max-w-sm">
            <div className="card p-0 overflow-hidden">
              <img src={heroImage} alt="Event Management" className="w-full h-auto object-cover" />
              <div className="p-4 text-center">
                <p className="text-textSecondary dark:text-darkTextSecondary text-sm">Streamline your campus events</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="bg-white dark:bg-darkCard py-16 transition-colors">
        <div className="px-4 sm:px-8 md:px-12 lg:px-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-primary dark:text-darkText mb-4">
              Key Features
            </h2>
            <p className="text-textSecondary dark:text-darkTextSecondary text-lg max-w-2xl mx-auto">
              Everything you need to manage college events efficiently
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="card hover:scale-105 transition-transform duration-300 group">
                <feature.icon className="text-4xl text-primary dark:text-secondary mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="text-xl font-semibold text-textPrimary dark:text-darkText mb-2">{feature.title}</h3>
                <p className="text-textSecondary dark:text-darkTextSecondary">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Three Cards Section - Institution first, then Admin, then Student */}
      <section id="roles" className="py-16">
        <div className="px-4 sm:px-8 md:px-12 lg:px-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-primary dark:text-darkText mb-4">
              Get Started
            </h2>
            <p className="text-textSecondary dark:text-darkTextSecondary text-lg max-w-2xl mx-auto">
              Choose your role to access the platform
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {roleCards.map((card, index) => (
              <div key={index} className="card hover:scale-105 transition-all duration-300 text-center group">
                <div className="w-full h-52 mb-4 overflow-hidden rounded-lg">
                  <img 
                    src={card.image} 
                    alt={card.title} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <card.icon className="text-5xl text-primary dark:text-secondary mx-auto mb-3" />
                <h3 className="text-2xl font-bold text-primary dark:text-darkText mb-3">{card.title}</h3>
                <p className="text-textSecondary dark:text-darkTextSecondary mb-5 px-2">
                  {card.description}
                </p>
                <Link to={card.link} className={`btn-${card.buttonColor} w-full inline-flex items-center justify-center gap-2 py-3`}>
                {card.buttonText} <FaArrowRight />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer - Removed Copyright */}
      <footer id="contact" className="bg-white dark:bg-darkCard border-t border-borderLight dark:border-darkBorder py-8 transition-colors">
        <div className="px-4 sm:px-8 md:px-12 lg:px-16">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-center md:text-left">
              <div className="flex items-center gap-2 justify-center md:justify-start">
                <img src={logo} alt="EventElite" className="w-8 h-8 object-contain" />
                <span className="text-xl font-bold text-primary dark:text-darkText">EventElite</span>
              </div>
              <p className="text-textSecondary dark:text-darkTextSecondary text-sm mt-2">
                Smart College Event Management Platform
              </p>
            </div>
            <div className="flex flex-wrap gap-8 justify-center">
              <a href="#home" className="text-textSecondary dark:text-darkTextSecondary hover:text-primary dark:hover:text-secondary transition text-sm">Home</a>
              <a href="#features" className="text-textSecondary dark:text-darkTextSecondary hover:text-primary dark:hover:text-secondary transition text-sm">Features</a>
              <a href="#roles" className="text-textSecondary dark:text-darkTextSecondary hover:text-primary dark:hover:text-secondary transition text-sm">Get Started</a>
              <a href="#" className="text-textSecondary dark:text-darkTextSecondary hover:text-primary dark:hover:text-secondary transition text-sm">Privacy</a>
              <a href="#" className="text-textSecondary dark:text-darkTextSecondary hover:text-primary dark:hover:text-secondary transition text-sm">Terms</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage