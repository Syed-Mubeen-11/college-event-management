import { useState, useEffect, useRef } from 'react'
import { FaPlus, FaEdit, FaTrash, FaUsers, FaFilter, FaUpload, FaCheckCircle, FaTimesCircle } from 'react-icons/fa'
import AdminLayout from '../../components/layout/AdminLayout'
import adminService from '../../services/adminService'
import toast from 'react-hot-toast'

function Students() {
  const [students, setStudents] = useState([])
  const [filteredStudents, setFilteredStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedStudent, setSelectedStudent] = useState(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [uploadFile, setUploadFile] = useState(null)
  const [uploadLoading, setUploadLoading] = useState(false)
  const [uploadResult, setUploadResult] = useState(null)
  const fileInputRef = useRef(null)
  const [filterBranch, setFilterBranch] = useState('')
  const [filterYear, setFilterYear] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    branch: '',
    year: ''
  })

  const branches = [
    'Computer Science Engineering (CSE)',
    'Electronics & Communication (ECE)',
    'Mechanical Engineering (ME)',
    'Civil Engineering (CE)',
    'Information Technology (IT)',
    'Electrical Engineering (EE)',
    'Other'
  ]

  const years = ['1st Year', '2nd Year', '3rd Year', '4th Year']

  useEffect(() => {
    fetchStudents()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [filterBranch, filterYear, students])

  const fetchStudents = async () => {
    try {
      const response = await adminService.getStudents()
      setStudents(response.students || [])
      setFilteredStudents(response.students || [])
    } catch (error) {
      toast.error('Failed to load students')
    } finally {
      setLoading(false)
    }
  }

  const applyFilters = () => {
    let filtered = [...students]
    if (filterBranch) {
      filtered = filtered.filter(s => s.branch === filterBranch)
    }
    if (filterYear) {
      filtered = filtered.filter(s => s.year === filterYear)
    }
    setFilteredStudents(filtered)
  }

  const clearFilters = () => {
    setFilterBranch('')
    setFilterYear('')
  }

  const handleAddStudent = async (e) => {
    e.preventDefault()
    try {
      await adminService.addStudent(formData)
      toast.success('Student added successfully')
      setShowAddModal(false)
      setFormData({ name: '', email: '', password: '', branch: '', year: '' })
      fetchStudents()
    } catch (error) {
      toast.error(error.response?.data || 'Failed to add student')
    }
  }

  const handleEditStudent = async (e) => {
    e.preventDefault()
    try {
      await adminService.updateStudent(selectedStudent.id, {
        name: formData.name,
        branch: formData.branch,
        year: formData.year
      })
      toast.success('Student updated successfully')
      setShowEditModal(false)
      setSelectedStudent(null)
      setFormData({ name: '', email: '', password: '', branch: '', year: '' })
      fetchStudents()
    } catch (error) {
      toast.error('Failed to update student')
    }
  }

  const handleDeleteStudent = async () => {
    try {
      await adminService.deleteStudent(selectedStudent.id)
      toast.success('Student deleted successfully')
      fetchStudents()
      setShowDeleteModal(false)
      setSelectedStudent(null)
    } catch (error) {
      toast.error('Failed to delete student')
    }
  }

  const openEditModal = (student) => {
    setSelectedStudent(student)
    setFormData({
      name: student.name,
      email: student.email,
      password: '',
      branch: student.branch || '',
      year: student.year || ''
    })
    setShowEditModal(true)
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-64">
          <div className="text-textSecondary">Loading students...</div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center flex-wrap gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-primary dark:text-darkText">
              Students
            </h1>
            <p className="text-textSecondary dark:text-darkTextSecondary mt-1">
              Manage your college students
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => {
                setShowUploadModal(true)
                setUploadResult(null)
                setUploadFile(null)
              }}
              className="btn-secondary flex items-center gap-2"
            >
              <FaUpload /> Upload Excel
            </button>
            <button
              onClick={() => setShowAddModal(true)}
              className="btn-primary flex items-center gap-2"
            >
              <FaPlus /> Add Student
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="card">
          <div className="flex flex-wrap gap-4 items-end">
            <div className="flex-1 min-w-[150px]">
              <label className="label">Filter by Branch</label>
              <select
                value={filterBranch}
                onChange={(e) => setFilterBranch(e.target.value)}
                className="input-field"
              >
                <option value="">All Branches</option>
                {branches.map(branch => (
                  <option key={branch} value={branch}>{branch}</option>
                ))}
              </select>
            </div>
            <div className="flex-1 min-w-[150px]">
              <label className="label">Filter by Year</label>
              <select
                value={filterYear}
                onChange={(e) => setFilterYear(e.target.value)}
                className="input-field"
              >
                <option value="">All Years</option>
                {years.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
            <button
              onClick={clearFilters}
              className="btn-secondary flex items-center gap-2"
            >
              <FaFilter /> Clear Filters
            </button>
          </div>
        </div>

        {/* Students Table */}
        <div className="card">
          {filteredStudents.length === 0 ? (
            <div className="text-center py-12">
              <FaUsers className="text-5xl text-textSecondary mx-auto mb-4" />
              <p className="text-textSecondary">No students found</p>
              <button
                onClick={() => setShowAddModal(true)}
                className="btn-primary inline-flex items-center gap-2 mt-4"
              >
                <FaPlus /> Add Your First Student
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-borderLight">
                  <tr className="text-left text-sm text-textSecondary">
                    <th className="pb-3">Name</th>
                    <th className="pb-3">Email</th>
                    <th className="pb-3">Branch</th>
                    <th className="pb-3">Year</th>
                    <th className="pb-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.map((student) => (
                    <tr key={student.id} className="border-b border-borderLight hover:bg-pink/10 transition">
                      <td className="py-3 font-medium text-primary dark:text-darkText">
                        {student.name}
                      </td>
                      <td className="py-3 text-sm text-textSecondary">
                        {student.email}
                      </td>
                      <td className="py-3 text-sm text-textSecondary">
                        {student.branch || '-'}
                      </td>
                      <td className="py-3 text-sm text-textSecondary">
                        {student.year || '-'}
                      </td>
                      <td className="py-3">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => openEditModal(student)}
                            className="p-2 text-yellow-500 hover:bg-yellow-50 rounded-lg transition"
                            title="Edit"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedStudent(student)
                              setShowDeleteModal(true)
                            }}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition"
                            title="Delete"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Add Student Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-darkCard rounded-lg p-6 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-primary dark:text-darkText mb-4">Add New Student</h2>
            <form onSubmit={handleAddStudent} className="space-y-4">
              <div>
                <label className="label">Full Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="label">Email *</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="label">Password *</label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="input-field"
                  placeholder="Min 6 characters"
                  required
                />
              </div>
              <div>
                <label className="label">Branch *</label>
                <select
                  value={formData.branch}
                  onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                  className="input-field"
                  required
                >
                  <option value="">Select Branch</option>
                  {branches.map(branch => (
                    <option key={branch} value={branch}>{branch}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label">Year *</label>
                <select
                  value={formData.year}
                  onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                  className="input-field"
                  required
                >
                  <option value="">Select Year</option>
                  {years.map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false)
                    setFormData({ name: '', email: '', password: '', branch: '', year: '' })
                  }}
                  className="px-4 py-2 border border-borderLight rounded-button hover:bg-gray-100 transition"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Add Student
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Student Modal */}
      {showEditModal && selectedStudent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-darkCard rounded-lg p-6 max-w-md w-full mx-4">
            <h2 className="text-xl font-bold text-primary dark:text-darkText mb-4">Edit Student</h2>
            <form onSubmit={handleEditStudent} className="space-y-4">
              <div>
                <label className="label">Full Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="label">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  className="input-field"
                  disabled
                />
              </div>
              <div>
                <label className="label">Branch</label>
                <select
                  value={formData.branch}
                  onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                  className="input-field"
                >
                  <option value="">Select Branch</option>
                  {branches.map(branch => (
                    <option key={branch} value={branch}>{branch}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label">Year</label>
                <select
                  value={formData.year}
                  onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                  className="input-field"
                >
                  <option value="">Select Year</option>
                  {years.map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false)
                    setSelectedStudent(null)
                    setFormData({ name: '', email: '', password: '', branch: '', year: '' })
                  }}
                  className="px-4 py-2 border border-borderLight rounded-button hover:bg-gray-100 transition"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedStudent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-darkCard rounded-lg p-6 max-w-md w-full mx-4">
            <h2 className="text-xl font-bold text-primary dark:text-darkText mb-4">Confirm Delete</h2>
            <p className="text-textSecondary mb-6">
              Are you sure you want to delete "{selectedStudent.name}"? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 border border-borderLight rounded-button hover:bg-gray-100 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteStudent}
                className="px-4 py-2 bg-red-500 text-white rounded-button hover:bg-red-600 transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Upload Students Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-darkCard rounded-lg p-6 max-w-lg w-full mx-4">
            <h2 className="text-xl font-bold text-primary dark:text-darkText mb-4">Upload Students via Excel</h2>
            
            {!uploadResult ? (
              <>
                <div className="mb-4">
                  <label className="label">Select Excel File (.xlsx)</label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed border-borderLight rounded-lg hover:border-primary transition cursor-pointer"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <div className="text-center">
                      <FaUpload className="mx-auto text-3xl text-textSecondary mb-3" />
                      <p className="text-sm text-textSecondary">
                        {uploadFile ? uploadFile.name : 'Click to upload or drag and drop'}
                      </p>
                      <p className="text-xs text-textSecondary mt-1">Excel files only (.xlsx)</p>
                    </div>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".xlsx,.xls"
                    className="hidden"
                    onChange={(e) => setUploadFile(e.target.files[0])}
                  />
                </div>

                <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-sm text-textSecondary">
                  <p className="font-medium mb-1">Required format:</p>
                  <p>Columns: Name, Email, Password, Branch, Year</p>
                  <p className="text-xs mt-1">First row should contain headers (will be skipped)</p>
                </div>

                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setShowUploadModal(false)}
                    className="px-4 py-2 border border-borderLight rounded-button hover:bg-gray-100 transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={async () => {
                      if (!uploadFile) {
                        toast.error('Please select a file')
                        return
                      }
                      setUploadLoading(true)
                      try {
                        const result = await adminService.uploadStudents(uploadFile)
                        setUploadResult(result)
                        if (result.successCount > 0) {
                          toast.success(`${result.successCount} students added`)
                          fetchStudents()
                        }
                      } catch (error) {
                        toast.error(error.response?.data || 'Upload failed')
                      } finally {
                        setUploadLoading(false)
                      }
                    }}
                    disabled={!uploadFile || uploadLoading}
                    className="btn-primary disabled:opacity-50"
                  >
                    {uploadLoading ? 'Uploading...' : 'Upload'}
                  </button>
                </div>
              </>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 text-green-600">
                    <FaCheckCircle />
                    <span className="font-medium">{uploadResult.successCount} Success</span>
                  </div>
                  {uploadResult.failureCount > 0 && (
                    <div className="flex items-center gap-2 text-red-500">
                      <FaTimesCircle />
                      <span className="font-medium">{uploadResult.failureCount} Failed</span>
                    </div>
                  )}
                </div>

                {uploadResult.errors?.length > 0 && (
                  <div className="max-h-48 overflow-y-auto border border-borderLight rounded-lg">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50 dark:bg-gray-800">
                        <tr>
                          <th className="px-3 py-2 text-left">Row</th>
                          <th className="px-3 py-2 text-left">Error</th>
                        </tr>
                      </thead>
                      <tbody>
                        {uploadResult.errors.map((err, i) => (
                          <tr key={i} className="border-t border-borderLight">
                            <td className="px-3 py-2 text-red-500">{err.row}</td>
                            <td className="px-3 py-2 text-textSecondary">{err.message}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    onClick={() => {
                      setShowUploadModal(false)
                      setUploadResult(null)
                      setUploadFile(null)
                    }}
                    className="btn-primary"
                  >
                    Done
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </AdminLayout>
  )
}

export default Students