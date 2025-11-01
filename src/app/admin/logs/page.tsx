'use client'

import { useState, useEffect } from 'react'
import { Lock, Eye, EyeOff, LogOut, RefreshCw, Search, ChevronLeft, ChevronRight } from 'lucide-react'

interface VisitorLog {
  id: string
  timestamp: string
  page: string
  ip: string
  user_agent: string
  country?: string
  city?: string
  region?: string
  timezone?: string
  latitude?: number
  longitude?: number
}

interface PaginationInfo {
  page: number
  limit: number
  total: number
  totalPages: number
}

interface Stats {
  pageViews: Array<{ page: string; count: number }>
  countries: Array<{ country: string; count: number }>
}

export default function AdminLogsPage() {
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [logs, setLogs] = useState<VisitorLog[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [filter, setFilter] = useState('')
  const [pagination, setPagination] = useState<PaginationInfo>({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0
  })
  const [stats, setStats] = useState<Stats>({
    pageViews: [],
    countries: []
  })

  useEffect(() => {
    // Check if already authenticated in session
    const auth = sessionStorage.getItem('adminAuth')
    if (auth === 'true') {
      setIsAuthenticated(true)
      fetchLogs(1)
    }
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/track-visitor?page=1&limit=20', {
        headers: {
          'Authorization': `Bearer ${password}`
        }
      })

      if (response.ok) {
        sessionStorage.setItem('adminAuth', 'true')
        sessionStorage.setItem('adminPassword', password)
        setIsAuthenticated(true)
        const data = await response.json()
        setLogs(data.logs || [])
        setPagination(data.pagination)
        setStats(data.stats)
      } else {
        setError('Onjuist wachtwoord')
      }
    } catch (err) {
      setError('Fout bij inloggen')
    } finally {
      setLoading(false)
    }
  }

  const fetchLogs = async (page: number) => {
    setLoading(true)
    try {
      const storedPassword = sessionStorage.getItem('adminPassword')
      const response = await fetch(`/api/track-visitor?page=${page}&limit=20`, {
        headers: {
          'Authorization': `Bearer ${storedPassword}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setLogs(data.logs || [])
        setPagination(data.pagination)
        setStats(data.stats)
      } else {
        setIsAuthenticated(false)
        sessionStorage.removeItem('adminAuth')
        sessionStorage.removeItem('adminPassword')
      }
    } catch (err) {
      setError('Fout bij ophalen logs')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    sessionStorage.removeItem('adminAuth')
    sessionStorage.removeItem('adminPassword')
    setIsAuthenticated(false)
    setLogs([])
    setPassword('')
  }

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      fetchLogs(newPage)
    }
  }

  const filteredLogs = logs.filter(log => {
    if (!filter) return true
    const searchTerm = filter.toLowerCase()
    return (
      log.page.toLowerCase().includes(searchTerm) ||
      log.ip.toLowerCase().includes(searchTerm) ||
      log.country?.toLowerCase().includes(searchTerm) ||
      log.city?.toLowerCase().includes(searchTerm)
    )
  })

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>

        <div className="relative w-full max-w-md">
          {/* Decorative blob */}
          <div className="absolute -top-10 -right-10 w-72 h-72 bg-blue-500 rounded-full filter blur-3xl opacity-20 animate-pulse"></div>
          <div className="absolute -bottom-10 -left-10 w-72 h-72 bg-purple-500 rounded-full filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '1s' }}></div>

          <div className="relative bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-8 text-center">
              <div className="w-20 h-20 bg-white/20 backdrop-blur-lg rounded-2xl mx-auto mb-4 flex items-center justify-center">
                <Lock className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-white mb-2">
                Admin Dashboard
              </h1>
              <p className="text-blue-100">
                Bezoeker Analytics Portal
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleLogin} className="p-8 space-y-6">
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-white mb-2">
                  Wachtwoord
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 pr-12 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm transition-all"
                    placeholder="Voer wachtwoord in"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="bg-red-500/20 border border-red-500/30 text-red-100 px-4 py-3 rounded-xl text-sm backdrop-blur-sm">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 rounded-xl font-semibold transition-all duration-300 disabled:opacity-50 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                {loading ? 'Laden...' : 'Inloggen'}
              </button>
            </form>

            {/* Footer */}
            <div className="px-8 pb-8 text-center">
              <p className="text-sm text-white/60">
                Frisspits Analytics • Beveiligd Dashboard
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const topPage = stats.pageViews[0]
  const topCountry = stats.countries[0]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Bezoeker Logs
            </h1>
            <p className="text-gray-600 mt-1">
              Totaal {pagination.total} bezoekers • Pagina {pagination.page} van {pagination.totalPages}
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => fetchLogs(pagination.page)}
              className="flex items-center gap-2 bg-white text-blue-600 px-5 py-2.5 rounded-xl font-semibold hover:bg-blue-50 transition-all duration-300 shadow-md hover:shadow-lg border border-blue-100"
            >
              <RefreshCw className="w-4 h-4" />
              Ververs
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-gradient-to-r from-red-500 to-red-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:from-red-600 hover:to-red-700 transition-all duration-300 shadow-md hover:shadow-lg"
            >
              <LogOut className="w-4 h-4" />
              Uitloggen
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-xl p-6 text-white">
            <h3 className="text-sm font-semibold opacity-90 mb-2">Totaal Bezoekers</h3>
            <p className="text-4xl font-bold">{pagination.total}</p>
          </div>
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl shadow-xl p-6 text-white">
            <h3 className="text-sm font-semibold opacity-90 mb-2">Top Pagina</h3>
            <p className="text-2xl font-bold truncate">{topPage?.page || 'N/A'}</p>
            <p className="text-sm opacity-75">{topPage?.count || 0} bezoeken</p>
          </div>
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl shadow-xl p-6 text-white">
            <h3 className="text-sm font-semibold opacity-90 mb-2">Top Land</h3>
            <p className="text-2xl font-bold">{topCountry?.country || 'N/A'}</p>
            <p className="text-sm opacity-75">{topCountry?.count || 0} bezoeken</p>
          </div>
        </div>

        {/* Search */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Zoek op pagina, IP, land of stad..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>
        </div>

        {/* Logs Table */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Tijd
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Pagina
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Locatie
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    IP
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Browser
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                      <div className="flex items-center justify-center gap-3">
                        <RefreshCw className="w-5 h-5 animate-spin" />
                        Laden...
                      </div>
                    </td>
                  </tr>
                ) : filteredLogs.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                      Geen logs gevonden
                    </td>
                  </tr>
                ) : (
                  filteredLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-blue-50/50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(log.timestamp).toLocaleString('nl-NL')}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-lg">
                          {log.page}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {log.city && log.country ? (
                          <div>
                            <div className="font-medium">{log.city}, {log.country}</div>
                            {log.region && <div className="text-xs text-gray-400">{log.region}</div>}
                          </div>
                        ) : (
                          <span className="text-gray-400">Onbekend</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-600 bg-gray-50 rounded">
                        {log.ip}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">
                        {log.user_agent}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {!loading && pagination.totalPages > 1 && (
            <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  Toont <span className="font-medium">{((pagination.page - 1) * pagination.limit) + 1}</span> tot{' '}
                  <span className="font-medium">{Math.min(pagination.page * pagination.limit, pagination.total)}</span> van{' '}
                  <span className="font-medium">{pagination.total}</span> resultaten
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={pagination.page === 1}
                    className="flex items-center gap-1 px-4 py-2 rounded-lg bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Vorige
                  </button>

                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                      let pageNum
                      if (pagination.totalPages <= 5) {
                        pageNum = i + 1
                      } else if (pagination.page <= 3) {
                        pageNum = i + 1
                      } else if (pagination.page >= pagination.totalPages - 2) {
                        pageNum = pagination.totalPages - 4 + i
                      } else {
                        pageNum = pagination.page - 2 + i
                      }

                      return (
                        <button
                          key={pageNum}
                          onClick={() => handlePageChange(pageNum)}
                          className={`px-4 py-2 rounded-lg transition-all ${
                            pagination.page === pageNum
                              ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold'
                              : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          {pageNum}
                        </button>
                      )
                    })}
                  </div>

                  <button
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={pagination.page === pagination.totalPages}
                    className="flex items-center gap-1 px-4 py-2 rounded-lg bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    Volgende
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
