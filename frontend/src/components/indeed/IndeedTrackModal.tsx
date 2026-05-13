/** ALEX 🎨 — Track application status modal */
import { useState } from 'react'

interface Application {
  id: number
  job_id: number
  applicant_name: string
  applicant_email: string
  status: string
  created_at: string
  updated_at: string
  reviewer_notes?: string
  job?: {
    title: string
    company: string
    location: string
    job_type: string
  }
}

interface Props {
  apiBase: string
  onClose: () => void
}

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; icon: string }> = {
  submitted:    { label: 'Submitted',     color: '#3B82F6', bg: '#EFF6FF', icon: '📤' },
  under_review: { label: 'Under Review',  color: '#8B5CF6', bg: '#F5F3FF', icon: '🔍' },
  interview:    { label: 'Interview',     color: '#F5821F', bg: '#FFF7ED', icon: '🎙' },
  offer:        { label: 'Offer',         color: '#10B981', bg: '#ECFDF5', icon: '🎉' },
  hired:        { label: 'Hired!',        color: '#059669', bg: '#D1FAE5', icon: '✅' },
  rejected:     { label: 'Not Selected',  color: '#EF4444', bg: '#FEF2F2', icon: '❌' },
}

const STEPS = ['submitted', 'under_review', 'interview', 'offer', 'hired']

function StatusProgress({ status }: { status: string }) {
  const currentIdx = STEPS.indexOf(status)
  return (
    <div className="flex items-center gap-0 mt-3">
      {STEPS.map((step, i) => {
        const cfg = STATUS_CONFIG[step]
        const done = i <= currentIdx && status !== 'rejected'
        const active = i === currentIdx && status !== 'rejected'
        return (
          <div key={step} className="flex items-center flex-1">
            <div
              className="flex flex-col items-center"
              style={{ minWidth: 40 }}
            >
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center text-xs transition-all"
                style={{
                  background: done ? cfg.color : '#E5E7EB',
                  color: done ? '#fff' : '#9CA3AF',
                  border: active ? `2px solid ${cfg.color}` : 'none',
                  boxShadow: active ? `0 0 0 3px ${cfg.color}30` : 'none',
                }}
              >
                {done ? '✓' : i + 1}
              </div>
              <span className="text-xs mt-1 text-center leading-tight"
                style={{ color: done ? cfg.color : '#9CA3AF', fontSize: 10 }}>
                {cfg.label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div
                className="flex-1 h-0.5 mb-4"
                style={{ background: i < currentIdx && status !== 'rejected' ? '#0A1F44' : '#E5E7EB' }}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}

export function IndeedTrackModal({ apiBase, onClose }: Props) {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [applications, setApplications] = useState<Application[] | null>(null)
  const [error, setError] = useState('')

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch(`${apiBase}/api/indeed/applications/track?email=${encodeURIComponent(email)}`)
      const data = await res.json()
      if (!res.ok) throw new Error(data.detail ?? 'Failed to fetch')
      setApplications(Array.isArray(data) ? data : [])
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(10,31,68,0.6)' }}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div style={{ background: '#0A1F44' }} className="rounded-t-2xl px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-white font-bold text-lg">Track Your Applications</h2>
            <p style={{ color: '#94A3B8' }} className="text-sm">Enter your email to see all your application statuses</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6">
          {/* Search form */}
          <form onSubmit={handleTrack} className="flex gap-3 mb-6">
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Enter your application email"
              className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-orange-400"
              style={{ color: '#0A1F44' }}
            />
            <button
              type="submit"
              disabled={loading}
              style={{ background: '#F5821F' }}
              className="px-5 py-2.5 text-white text-sm font-semibold rounded-xl hover:opacity-90 transition disabled:opacity-60"
            >
              {loading ? '…' : 'Track'}
            </button>
          </form>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-2.5 rounded-lg mb-4">
              {error}
            </div>
          )}

          {applications !== null && (
            applications.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-3xl mb-2">📭</p>
                <p style={{ color: '#0A1F44' }} className="font-semibold">No applications found</p>
                <p className="text-gray-400 text-sm mt-1">Double-check the email address you used to apply</p>
              </div>
            ) : (
              <div className="space-y-5">
                <p className="text-sm text-gray-500">{applications.length} application{applications.length !== 1 ? 's' : ''} found</p>
                {applications.map(app => {
                  const cfg = STATUS_CONFIG[app.status] ?? STATUS_CONFIG.submitted
                  return (
                    <div
                      key={app.id}
                      className="rounded-xl p-4"
                      style={{ border: '1px solid #E2E8F0' }}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold" style={{ color: '#0A1F44' }}>
                            {app.job?.title ?? `Job #${app.job_id}`}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {app.job?.company} · {app.job?.location}
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            Applied {new Date(app.created_at).toLocaleDateString('en-US', {
                              month: 'short', day: 'numeric', year: 'numeric'
                            })}
                          </p>
                        </div>
                        <span
                          className="px-3 py-1 rounded-full text-xs font-semibold"
                          style={{ background: cfg.bg, color: cfg.color }}
                        >
                          {cfg.icon} {cfg.label}
                        </span>
                      </div>

                      {app.status !== 'rejected' ? (
                        <StatusProgress status={app.status} />
                      ) : (
                        <div className="mt-3 text-sm text-red-500 bg-red-50 rounded-lg px-3 py-2">
                          ❌ Unfortunately your application was not selected at this time.
                        </div>
                      )}

                      {app.reviewer_notes && (
                        <div
                          className="mt-3 text-sm rounded-lg px-3 py-2"
                          style={{ background: '#F4F6FA', color: '#374151' }}
                        >
                          <span className="font-medium">📝 Reviewer note:</span> {app.reviewer_notes}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )
          )}
        </div>
      </div>
    </div>
  )
}
