import { useState, useEffect } from 'react'
import { FiCheckCircle, FiXCircle, FiRefreshCw } from 'react-icons/fi'
import { checkHealth } from '../services/api'

function Status() {
  const [status, setStatus] = useState({
    backend: { status: 'checking', message: '' },
    database: { status: 'checking', message: '' },
    llm: { status: 'checking', message: '' },
  })
  const [lastChecked, setLastChecked] = useState(null)
  const [loading, setLoading] = useState(true)

  const fetchStatus = async () => {
    setLoading(true)
    try {
      const data = await checkHealth()
      setStatus(data)
      setLastChecked(new Date())
    } catch (error) {
      setStatus({
        backend: { status: 'error', message: 'Backend unreachable' },
        database: { status: 'unknown', message: 'Cannot check' },
        llm: { status: 'unknown', message: 'Cannot check' },
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStatus()
  }, [])

  const StatusIcon = ({ status }) => {
    if (status === 'checking' || loading) {
      return <FiRefreshCw className="text-xl text-yellow-500 animate-spin" />
    }
    if (status === 'online' || status === 'connected' || status === 'available') {
      return <FiCheckCircle className="text-xl text-green-600" />
    }
    return <FiXCircle className="text-xl text-red-600" />
  }

  const getStatusLabel = (status) => {
    if (status === 'checking' || loading) return 'Checking'
    if (status === 'online' || status === 'connected' || status === 'available') return 'Operational'
    if (status === 'error') return 'Error'
    return 'Unknown'
  }

  const getStatusColor = (status) => {
    if (status === 'checking' || loading) return 'bg-yellow-100 text-yellow-700'
    if (status === 'online' || status === 'connected' || status === 'available') return 'bg-green-100 text-green-700'
    return 'bg-red-100 text-red-700'
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gh-text mb-2">System Status</h1>
        <p className="text-gh-muted">Monitor the health of all services</p>
      </div>

      <div className="space-y-4 mb-8">
        {/* Backend */}
        <div className="card p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <StatusIcon status={status.backend.status} />
              <div>
                <h3 className="text-sm font-semibold text-gh-text">Backend API</h3>
                <p className="text-xs text-gh-muted">
                  {status.backend.message || 'Node.js + Express'}
                </p>
              </div>
            </div>
            <span className={`px-3 py-1 rounded text-xs font-medium ${getStatusColor(status.backend.status)}`}>
              {getStatusLabel(status.backend.status)}
            </span>
          </div>
        </div>

        {/* Database */}
        <div className="card p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <StatusIcon status={status.database.status} />
              <div>
                <h3 className="text-sm font-semibold text-gh-text">Database</h3>
                <p className="text-xs text-gh-muted">
                  {status.database.message || 'MongoDB Atlas'}
                </p>
              </div>
            </div>
            <span className={`px-3 py-1 rounded text-xs font-medium ${getStatusColor(status.database.status)}`}>
              {getStatusLabel(status.database.status)}
            </span>
          </div>
        </div>

        {/* LLM */}
        <div className="card p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <StatusIcon status={status.llm.status} />
              <div>
                <h3 className="text-sm font-semibold text-gh-text">LLM Service</h3>
                <p className="text-xs text-gh-muted">
                  {status.llm.message || 'Groq API'}
                </p>
              </div>
            </div>
            <span className={`px-3 py-1 rounded text-xs font-medium ${getStatusColor(status.llm.status)}`}>
              {getStatusLabel(status.llm.status)}
            </span>
          </div>
        </div>
      </div>

      <div className="card p-4">
        <div className="flex items-center justify-between">
          <div>
            {lastChecked && (
              <p className="text-xs text-gh-muted">
                Last checked: {lastChecked.toLocaleString()}
              </p>
            )}
          </div>
          <button
            onClick={fetchStatus}
            disabled={loading}
            className="btn btn-secondary text-xs disabled:opacity-50"
          >
            <FiRefreshCw className={`inline mr-1.5 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="mt-8 card p-4 bg-blue-50 border-blue-200">
        <h3 className="text-sm font-semibold text-blue-900 mb-2">Tech Stack</h3>
        <ul className="text-xs text-blue-800 space-y-1">
          <li>• Frontend: React + Vite + Tailwind CSS</li>
          <li>• Backend: Node.js + Express.js</li>
          <li>• Database: MongoDB Atlas (Free Tier)</li>
          <li>• LLM: Groq API (Llama 3.1 70B)</li>
        </ul>
      </div>
    </div>
  )
}

export default Status