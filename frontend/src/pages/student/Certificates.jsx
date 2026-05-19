import { useState, useEffect } from 'react'
import { FaCertificate, FaDownload, FaCheckCircle } from 'react-icons/fa'
import StudentLayout from '../../components/layout/StudentLayout'
import studentService from '../../services/studentService'
import toast from 'react-hot-toast'

function Certificates() {
  const [certificates, setCertificates] = useState([])
  const [loading, setLoading] = useState(true)
  const [downloading, setDownloading] = useState(null)

  useEffect(() => {
    fetchCertificates()
  }, [])

  const fetchCertificates = async () => {
    try {
      const response = await studentService.getMyCertificates()
      setCertificates(response.certificates || [])
    } catch (error) {
      toast.error('Failed to load certificates')
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = async (certificateId, certificateUniqueId) => {
  setDownloading(certificateId)
  try {
    const response = await studentService.downloadCertificate(certificateId)
    
    // Get the blob from response
    const blob = response.data
    
    // Create download link
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `certificate_${certificateUniqueId}.pdf`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
    
    toast.success('Certificate downloaded successfully!')
  } catch (error) {
    console.error('Download error:', error)
    toast.error('Failed to download certificate')
  } finally {
    setDownloading(null)
  }
}

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <StudentLayout>
        <div className="flex justify-center items-center h-64">
          <div className="text-textSecondary">Loading certificates...</div>
        </div>
      </StudentLayout>
    )
  }

  return (
    <StudentLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-primary dark:text-darkText">
            My Certificates
          </h1>
          <p className="text-textSecondary dark:text-darkTextSecondary mt-1">
            Download your achievement certificates
          </p>
        </div>

        {certificates.length === 0 ? (
          <div className="card text-center py-12">
            <FaCertificate className="text-5xl text-textSecondary mx-auto mb-4" />
            <p className="text-textSecondary">No certificates available yet</p>
            <p className="text-sm text-textSecondary mt-2">
              Complete events to receive certificates
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {certificates.map((cert) => (
              <div key={cert.id} className="card hover:shadow-lg transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-gradient-primary rounded-lg flex items-center justify-center">
                    <FaCertificate className="text-white text-3xl" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-primary dark:text-darkText">
                      {cert.event?.title || 'Event Certificate'}
                    </h3>
                    <p className="text-sm text-textSecondary mt-1">
                      Issued: {formatDate(cert.issueDate)}
                    </p>
                    <p className="text-xs text-textSecondary mt-1 break-all">
                      ID: {cert.certificateUniqueId}
                    </p>
                    <div className="flex items-center gap-2 mt-3">
                      <FaCheckCircle className="text-green-500 text-sm" />
                      <span className="text-xs text-green-600">Verified</span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDownload(cert.id, cert.certificateUniqueId)}
                    disabled={downloading === cert.id}
                    className="btn-secondary py-2 px-4 text-sm flex items-center gap-2 disabled:opacity-50"
                  >
                    {downloading === cert.id ? (
                      'Downloading...'
                    ) : (
                      <>
                        <FaDownload /> Download
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </StudentLayout>
  )
}

export default Certificates