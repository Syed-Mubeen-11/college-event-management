import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/protected/ProtectedRoute'
import LandingPage from './pages/landing/LandingPage'
import StudentLogin from './pages/auth/StudentLogin'
import AdminLogin from './pages/auth/AdminLogin'
import InstitutionRegister from './pages/auth/InstitutionRegister'
import StudentDashboard from './pages/student/Dashboard'
import StudentEvents from './pages/student/Events'
import StudentMyEvents from './pages/student/MyEvents'
import StudentCertificates from './pages/student/Certificates'
import StudentProfile from './pages/student/Profile'
import StudentEventDetails from './pages/student/EventDetails'
import AdminDashboard from './pages/admin/Dashboard'
import AdminEvents from './pages/admin/Events'
import CreateEvent from './pages/admin/CreateEvent'
import AdminStudents from './pages/admin/Students'
import AdminReports from './pages/admin/Reports'
import AdminCertificates from './pages/admin/Certificates'
import EventDetails from './pages/admin/EventDetails'
import EditEvent from './pages/admin/EditEvent'
import AdminProfile from './pages/admin/Profile'


function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login/student" element={<StudentLogin />} />
          <Route path="/login/admin" element={<AdminLogin />} />
          <Route path="/register/institution" element={<InstitutionRegister />} />

          {/* Student Routes */}
          <Route path="/dashboard/student" element={
            <ProtectedRoute allowedRoles={['STUDENT']}>
              <StudentDashboard />
            </ProtectedRoute>
          } />
          <Route path="/dashboard/student/events" element={
            <ProtectedRoute allowedRoles={['STUDENT']}>
              <StudentEvents />
            </ProtectedRoute>
          } />
          <Route path="/dashboard/student/events/:eventId" element={
            <ProtectedRoute allowedRoles={['STUDENT']}>
              <StudentEventDetails />
            </ProtectedRoute>
          } />
          <Route path="/dashboard/student/my-events" element={
            <ProtectedRoute allowedRoles={['STUDENT']}>
              <StudentMyEvents />
            </ProtectedRoute>
          } />
          <Route path="/dashboard/student/certificates" element={
            <ProtectedRoute allowedRoles={['STUDENT']}>
              <StudentCertificates />
            </ProtectedRoute>
          } />
          <Route path="/dashboard/student/profile" element={
            <ProtectedRoute allowedRoles={['STUDENT']}>
              <StudentProfile />
            </ProtectedRoute>
          } />

          {/* Admin Routes */}
          <Route path="/dashboard/admin" element={
            <ProtectedRoute allowedRoles={['INSTITUTION_ADMIN']}>
              <AdminDashboard />
            </ProtectedRoute>
          } />
          <Route path="/dashboard/admin/events" element={
            <ProtectedRoute allowedRoles={['INSTITUTION_ADMIN']}>
              <AdminEvents />
            </ProtectedRoute>
          } />
          <Route path="/dashboard/admin/events/create" element={
            <ProtectedRoute allowedRoles={['INSTITUTION_ADMIN']}>
              <CreateEvent />
            </ProtectedRoute>
          } />
          <Route path="/dashboard/admin/students" element={
            <ProtectedRoute allowedRoles={['INSTITUTION_ADMIN']}>
              <AdminStudents />
            </ProtectedRoute>
          } />
          <Route path="/dashboard/admin/reports" element={
            <ProtectedRoute allowedRoles={['INSTITUTION_ADMIN']}>
              <AdminReports />
            </ProtectedRoute>
          } />
          <Route path="/dashboard/admin/certificates" element={
            <ProtectedRoute allowedRoles={['INSTITUTION_ADMIN']}>
              <AdminCertificates />
            </ProtectedRoute>
          } />

        <Route path="/dashboard/admin/events/:eventId" element={
          <ProtectedRoute allowedRoles={['INSTITUTION_ADMIN']}>
            <EventDetails />
          </ProtectedRoute>
        } />
        <Route path="/dashboard/admin/events/:eventId/edit" element={
          <ProtectedRoute allowedRoles={['INSTITUTION_ADMIN']}>
            <EditEvent />
          </ProtectedRoute>
        } />
        <Route path="/dashboard/admin/profile" element={
          <ProtectedRoute allowedRoles={['INSTITUTION_ADMIN']}>
            <AdminProfile />
          </ProtectedRoute>
        } />

        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App