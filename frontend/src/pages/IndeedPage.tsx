/**
 * ALEX 🎨 — Indeed-like Job Portal Page
 * Color scheme inspired by smarcsolutions.com:
 *   Primary Navy:   #0A1F44
 *   Accent Orange:  #F5821F
 *   Light BG:       #F4F6FA
 *   White:          #FFFFFF
 *   Text Gray:      #6B7280
 */
import { useEffect, useState } from 'react'
import { IndeedApplyModal } from '../components/indeed/IndeedApplyModal'
import { IndeedJobCard } from '../components/indeed/IndeedJobCard'
import { IndeedJobDetail } from '../components/indeed/IndeedJobDetail'
import { IndeedSearchBar } from '../components/indeed/IndeedSearchBar'
import { IndeedStats } from '../components/indeed/IndeedStats'
import { IndeedTrackModal } from '../components/indeed/IndeedTrackModal'

export interface Job {
  id: number
  title: string
  company: string
  location: string
  job_type: string
  salary_min?: number
  salary_max?: number
  description: string
  requirements?: string
  benefits?: string
  category?: string
  logo_url?: string
  is_active: string
  created_at: string
  application_count: number
}

const API = import.meta.env.VITE_API_URL ?? 'https://openclaw-multiagent.onrender.com'

export default function IndeedPage() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedJob, setSelectedJob] = useState<Job | null>(null)
  const [applyJob, setApplyJob] = useState<Job | null>(null)
  const [showTrack, setShowTrack] = useState(false)
  const [filters, setFilters] = useState({ q: '', location: '', job_type: '', category: '' })
  const [stats, setStats] = useState({ total_jobs: 0, total_applications: 0, total_companies: 0 })

  const fetchJobs = async (f = filters) => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (f.q) params.set('q', f.q)
      if (f.location) params.set('location', f.location)
      if (f.job_type) params.set('job_type', f.job_type)
      if (f.category) params.set('category', f.category)
      const res = await fetch(`${API}/api/indeed/jobs?${params}`)
      const data = await res.json()
      setJobs(Array.isArray(data) ? data : [])
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      const res = await fetch(`${API}/api/indeed/stats`)
      const data = await res.json()
      setStats(data)
    } catch { /* noop */ }
  }

  useEffect(() => {
    fetchJobs()
    fetchStats()
  }, [])

  const handleSearch = (f: typeof filters) => {
    setFilters(f)
    fetchJobs(f)
  }

  return (
    <div className="min-h-screen" style={{ background: '#F4F6FA' }}>
      {/* ── Header ── */}
      <header style={{ background: '#0A1F44' }} className="shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              style={{ background: '#F5821F' }}
              className="w-9 h-9 rounded-lg flex items-center justify-center font-bold text-white text-lg"
            >
              J
            </div>
            <div>
              <span className="text-white text-xl font-bold tracking-tight">JobPortal</span>
              <span style={{ color: '#F5821F' }} className="text-xl font-bold">Pro</span>
            </div>
          </div>
          <nav className="flex items-center gap-4">
            <button
              onClick={() => setShowTrack(true)}
              className="text-sm font-medium transition-colors"
              style={{ color: '#CBD5E1' }}
              onMouseEnter={e => (e.currentTarget.style.color = '#F5821F')}
              onMouseLeave={e => (e.currentTarget.style.color = '#CBD5E1')}
            >
              Track My Application
            </button>
            <button
              onClick={() => setShowTrack(true)}
              style={{ background: '#F5821F' }}
              className="px-4 py-2 text-white text-sm font-semibold rounded-lg hover:opacity-90 transition"
            >
              My Applications
            </button>
          </nav>
        </div>
      </header>

      {/* ── Hero / Search ── */}
      <div style={{ background: '#0A1F44' }} className="pb-10">
        <div className="max-w-7xl mx-auto px-4 pt-10 pb-4 text-center">
          <h1 className="text-white text-4xl font-bold mb-2">
            Find Your <span style={{ color: '#F5821F' }}>Dream Job</span>
          </h1>
          <p style={{ color: '#94A3B8' }} className="mb-8 text-lg">
            Thousands of opportunities waiting for you
          </p>
          <IndeedSearchBar filters={filters} onSearch={handleSearch} />
        </div>
        <IndeedStats stats={stats} />
      </div>

      {/* ── Main content ── */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Active filters display */}
        <div className="flex items-center justify-between mb-5">
          <h2 style={{ color: '#0A1F44' }} className="text-xl font-semibold">
            {loading ? 'Searching…' : `${jobs.length} Jobs Found`}
          </h2>
          {(filters.q || filters.location || filters.job_type || filters.category) && (
            <button
              onClick={() => handleSearch({ q: '', location: '', job_type: '', category: '' })}
              style={{ color: '#F5821F' }}
              className="text-sm font-medium hover:underline"
            >
              Clear filters
            </button>
          )}
        </div>

        <div className="flex gap-6">
          {/* Job list */}
          <div className="flex-1 space-y-4">
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="bg-white rounded-xl p-5 animate-pulse">
                  <div className="h-5 bg-gray-200 rounded w-2/3 mb-3" />
                  <div className="h-4 bg-gray-100 rounded w-1/3" />
                </div>
              ))
            ) : jobs.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-4xl mb-3">🔍</p>
                <p style={{ color: '#0A1F44' }} className="text-xl font-semibold">No jobs found</p>
                <p className="text-gray-500 mt-1">Try adjusting your search filters</p>
              </div>
            ) : (
              jobs.map(job => (
                <IndeedJobCard
                  key={job.id}
                  job={job}
                  isSelected={selectedJob?.id === job.id}
                  onClick={() => setSelectedJob(job)}
                  onApply={() => setApplyJob(job)}
                />
              ))
            )}
          </div>

          {/* Job detail panel */}
          {selectedJob && (
            <div className="w-[420px] shrink-0">
              <IndeedJobDetail
                job={selectedJob}
                onApply={() => setApplyJob(selectedJob)}
                onClose={() => setSelectedJob(null)}
              />
            </div>
          )}
        </div>
      </main>

      {/* ── Modals ── */}
      {applyJob && (
        <IndeedApplyModal
          job={applyJob}
          apiBase={API}
          onClose={() => setApplyJob(null)}
          onSuccess={() => { setApplyJob(null); fetchStats() }}
        />
      )}
      {showTrack && (
        <IndeedTrackModal
          apiBase={API}
          onClose={() => setShowTrack(false)}
        />
      )}
    </div>
  )
}
