import { Link } from 'react-router-dom'
import { useState, useEffect, useCallback } from 'react'
import {
  submitStatusReport,
  getStatusPeriods,
  getStatusSummary,
  deleteStatusReport,
  StatusReportOut,
  StatusReportSummary,
  StatusReportCreate,
} from '../lib/api'

// ── helpers ──────────────────────────────────────────────────────────────────
function currentWeekPeriod(): { period: string; label: string } {
  const now = new Date()
  const startOfYear = new Date(now.getFullYear(), 0, 1)
  const week = Math.ceil(
    ((now.getTime() - startOfYear.getTime()) / 86400000 + startOfYear.getDay() + 1) / 7
  )
  const pad = (n: number) => String(n).padStart(2, '0')
  const period = `${now.getFullYear()}-W${pad(week)}`
  // Label: "Week 20, May 2026"
  const month = now.toLocaleString('en-US', { month: 'long' })
  const label = `Week ${week}, ${month} ${now.getFullYear()}`
  return { period, label }
}

const STATUS_OPTIONS = [
  { value: 'on-track', label: '✅ On Track', color: 'emerald' },
  { value: 'at-risk', label: '⚠️ At Risk', color: 'amber' },
  { value: 'blocked', label: '🚫 Blocked', color: 'red' },
] as const

type StatusValue = 'on-track' | 'at-risk' | 'blocked'

function statusBadge(status: StatusValue) {
  const map: Record<StatusValue, string> = {
    'on-track': 'bg-emerald-50 text-emerald-700 ring-emerald-200',
    'at-risk': 'bg-amber-50 text-amber-700 ring-amber-200',
    'blocked': 'bg-red-50 text-red-700 ring-red-200',
  }
  const labels: Record<StatusValue, string> = {
    'on-track': '✅ On Track',
    'at-risk': '⚠️ At Risk',
    'blocked': '🚫 Blocked',
  }
  return (
    <span className={`inline-flex items-center rounded-lg px-2.5 py-1 text-xs font-medium ring-1 ${map[status]}`}>
      {labels[status]}
    </span>
  )
}

const DEPARTMENTS = [
  'Engineering', 'Product', 'Design', 'Marketing', 'Sales',
  'Operations', 'HR', 'Finance', 'Customer Success', 'Legal', 'Other',
]

const BLANK_FORM: StatusReportCreate = {
  submitter_name: '',
  submitter_email: '',
  department: '',
  period: currentWeekPeriod().period,
  period_label: currentWeekPeriod().label,
  accomplishments: '',
  blockers: '',
  next_steps: '',
  overall_status: 'on-track',
}

// ── Main Component ────────────────────────────────────────────────────────────
export function ReportPage() {
  const [view, setView] = useState<'submit' | 'executive'>('submit')
  const [form, setForm] = useState<StatusReportCreate>(BLANK_FORM)
  const [submitting, setSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [submitError, setSubmitError] = useState('')

  // Executive view state
  const [periods, setPeriods] = useState<string[]>([])
  const [selectedPeriod, setSelectedPeriod] = useState<string>('')
  const [summary, setSummary] = useState<StatusReportSummary | null>(null)
  const [loadingExec, setLoadingExec] = useState(false)
  const [execError, setExecError] = useState('')
  const [filterDept, setFilterDept] = useState<string>('all')
  const [expandedId, setExpandedId] = useState<number | null>(null)

  const loadPeriods = useCallback(async () => {
    try {
      const ps = await getStatusPeriods()
      setPeriods(ps)
      if (ps.length > 0) setSelectedPeriod(ps[0])
    } catch {
      // no periods yet
    }
  }, [])

  const loadSummary = useCallback(async (period: string) => {
    if (!period) return
    setLoadingExec(true)
    setExecError('')
    setSummary(null)
    try {
      const s = await getStatusSummary(period)
      setSummary(s)
    } catch {
      setExecError('No reports found for this period yet.')
    } finally {
      setLoadingExec(false)
    }
  }, [])

  useEffect(() => {
    if (view === 'executive') {
      loadPeriods()
    }
  }, [view, loadPeriods])

  useEffect(() => {
    if (selectedPeriod) loadSummary(selectedPeriod)
  }, [selectedPeriod, loadSummary])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setSubmitError('')
    try {
      await submitStatusReport(form)
      setSubmitSuccess(true)
      setForm(BLANK_FORM)
    } catch (err: unknown) {
      setSubmitError(err instanceof Error ? err.message : 'Submission failed.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Remove this report?')) return
    try {
      await deleteStatusReport(id)
      if (selectedPeriod) loadSummary(selectedPeriod)
    } catch {
      alert('Failed to delete report.')
    }
  }

  const filteredReports: StatusReportOut[] = (summary?.reports ?? []).filter(
    (r) => filterDept === 'all' || r.department === filterDept
  )

  return (
    <div className="min-h-screen bg-[#f5f5f7] text-slate-900">
      {/* ── Nav ── */}
      <header className="sticky top-0 z-20 border-b border-black/5 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
          <Link to="/" className="text-lg font-semibold tracking-tight">Brightcone</Link>
          <div className="flex items-center gap-1 rounded-xl bg-slate-100 p-1">
            <button
              onClick={() => { setView('submit'); setSubmitSuccess(false) }}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                view === 'submit' ? 'bg-white shadow text-slate-900' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              📝 Submit Report
            </button>
            <button
              onClick={() => setView('executive')}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                view === 'executive' ? 'bg-white shadow text-slate-900' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              📊 Executive View
            </button>
          </div>
          <Link to="/" className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 transition">
            ← Home
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-10 lg:px-8">

        {/* ── SUBMIT VIEW ── */}
        {view === 'submit' && (
          <>
            <div className="mb-8">
              <p className="text-sm font-medium uppercase tracking-[0.22em] text-slate-400">Team Updates</p>
              <h1 className="mt-1 text-3xl font-semibold tracking-tight">Submit Your Status Report</h1>
              <p className="mt-2 text-slate-500 text-sm max-w-xl">
                Share your weekly update — what you accomplished, any blockers, and what's coming up. 
                All reports are consolidated for executive review.
              </p>
            </div>

            {submitSuccess && (
              <div className="mb-6 flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm text-emerald-800">
                <span className="mt-0.5 text-lg">✅</span>
                <div>
                  <p className="font-semibold">Report submitted successfully!</p>
                  <p className="mt-0.5 text-emerald-700">Your update has been recorded and is now available in the executive view.</p>
                </div>
                <button onClick={() => setSubmitSuccess(false)} className="ml-auto text-emerald-500 hover:text-emerald-700 text-lg leading-none">×</button>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Who are you */}
              <div className="rounded-[1.5rem] border border-black/5 bg-white p-6 shadow-sm">
                <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-400">Your Info</h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">Full Name <span className="text-red-400">*</span></label>
                    <input
                      name="submitter_name"
                      value={form.submitter_name}
                      onChange={handleChange}
                      required
                      placeholder="Jane Smith"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">Work Email <span className="text-red-400">*</span></label>
                    <input
                      name="submitter_email"
                      type="email"
                      value={form.submitter_email}
                      onChange={handleChange}
                      required
                      placeholder="jane@company.com"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">Department <span className="text-red-400">*</span></label>
                    <select
                      name="department"
                      value={form.department}
                      onChange={handleChange}
                      required
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition"
                    >
                      <option value="">Select department…</option>
                      {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">Reporting Period</label>
                    <input
                      name="period_label"
                      value={form.period_label}
                      onChange={handleChange}
                      readOnly
                      className="w-full rounded-xl border border-slate-200 bg-slate-100 px-4 py-2.5 text-sm text-slate-500 cursor-default"
                    />
                  </div>
                </div>
              </div>

              {/* Status */}
              <div className="rounded-[1.5rem] border border-black/5 bg-white p-6 shadow-sm">
                <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-400">Overall Status</h2>
                <div className="flex flex-wrap gap-3">
                  {STATUS_OPTIONS.map((opt) => (
                    <label
                      key={opt.value}
                      className={`flex cursor-pointer items-center gap-2.5 rounded-xl border-2 px-5 py-3 text-sm font-medium transition select-none ${
                        form.overall_status === opt.value
                          ? opt.color === 'emerald'
                            ? 'border-emerald-400 bg-emerald-50 text-emerald-800'
                            : opt.color === 'amber'
                            ? 'border-amber-400 bg-amber-50 text-amber-800'
                            : 'border-red-400 bg-red-50 text-red-800'
                          : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="overall_status"
                        value={opt.value}
                        checked={form.overall_status === opt.value}
                        onChange={handleChange}
                        className="sr-only"
                      />
                      {opt.label}
                    </label>
                  ))}
                </div>
              </div>

              {/* Content */}
              <div className="rounded-[1.5rem] border border-black/5 bg-white p-6 shadow-sm space-y-5">
                <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400">Weekly Update</h2>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Accomplishments <span className="text-red-400">*</span>
                    <span className="ml-2 font-normal text-slate-400">What did you get done this week?</span>
                  </label>
                  <textarea
                    name="accomplishments"
                    value={form.accomplishments}
                    onChange={handleChange}
                    required
                    rows={4}
                    placeholder="• Shipped feature X&#10;• Resolved 3 critical bugs&#10;• Completed design review with stakeholders"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition resize-none"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Blockers & Risks
                    <span className="ml-2 font-normal text-slate-400">Anything slowing you down?</span>
                  </label>
                  <textarea
                    name="blockers"
                    value={form.blockers}
                    onChange={handleChange}
                    rows={3}
                    placeholder="• Waiting on API credentials from IT&#10;• Unclear requirements for component Y"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition resize-none"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Next Steps
                    <span className="ml-2 font-normal text-slate-400">What's the plan for next week?</span>
                  </label>
                  <textarea
                    name="next_steps"
                    value={form.next_steps}
                    onChange={handleChange}
                    rows={3}
                    placeholder="• Complete integration testing&#10;• Present demo to stakeholders&#10;• Kick off sprint planning"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition resize-none"
                  />
                </div>
              </div>

              {submitError && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{submitError}</div>
              )}

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex items-center gap-2 rounded-xl bg-indigo-600 px-8 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 disabled:opacity-60"
                >
                  {submitting ? (
                    <>
                      <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.37 0 0 5.37 0 12h4z" />
                      </svg>
                      Submitting…
                    </>
                  ) : 'Submit Report →'}
                </button>
              </div>
            </form>
          </>
        )}

        {/* ── EXECUTIVE VIEW ── */}
        {view === 'executive' && (
          <>
            <div className="mb-8 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm font-medium uppercase tracking-[0.22em] text-slate-400">Executive Review</p>
                <h1 className="mt-1 text-3xl font-semibold tracking-tight">Consolidated Status Dashboard</h1>
              </div>
              {/* Period picker */}
              <div className="flex items-center gap-3">
                <label className="text-sm text-slate-500">Period:</label>
                {periods.length === 0 ? (
                  <span className="text-sm text-slate-400 italic">No reports yet</span>
                ) : (
                  <select
                    value={selectedPeriod}
                    onChange={(e) => setSelectedPeriod(e.target.value)}
                    className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm focus:border-indigo-400 focus:outline-none"
                  >
                    {periods.map((p) => <option key={p} value={p}>{p}</option>)}
                  </select>
                )}
              </div>
            </div>

            {loadingExec && (
              <div className="py-20 text-center text-sm text-slate-400">Loading reports…</div>
            )}
            {execError && !loadingExec && (
              <div className="rounded-2xl border border-slate-200 bg-white px-8 py-16 text-center">
                <p className="text-4xl mb-3">📭</p>
                <p className="text-slate-500 text-sm">{execError}</p>
                <p className="mt-2 text-xs text-slate-400">Ask your team to submit their reports using the <button onClick={() => setView('submit')} className="text-indigo-500 underline">Submit Report</button> tab.</p>
              </div>
            )}

            {summary && !loadingExec && (
              <>
                {/* Summary header */}
                <div className="mb-2 text-xs font-semibold uppercase tracking-widest text-slate-400">
                  {summary.period_label} · {summary.total} report{summary.total !== 1 ? 's' : ''} collected
                </div>

                {/* Stat cards */}
                <div className="mb-8 grid gap-4 sm:grid-cols-4">
                  {[
                    { label: 'Total Reports', value: summary.total, icon: '📋', color: 'text-slate-900', bg: 'bg-slate-50' },
                    { label: 'On Track', value: summary.on_track, icon: '✅', color: 'text-emerald-700', bg: 'bg-emerald-50' },
                    { label: 'At Risk', value: summary.at_risk, icon: '⚠️', color: 'text-amber-700', bg: 'bg-amber-50' },
                    { label: 'Blocked', value: summary.blocked, icon: '🚫', color: 'text-red-700', bg: 'bg-red-50' },
                  ].map((s) => (
                    <div key={s.label} className="rounded-[1.5rem] border border-black/5 bg-white p-6 shadow-sm">
                      <div className={`mb-3 inline-flex h-10 w-10 items-center justify-center rounded-2xl text-xl ${s.bg}`}>{s.icon}</div>
                      <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">{s.label}</p>
                      <p className={`mt-2 text-3xl font-semibold tracking-tight ${s.color}`}>{s.value}</p>
                    </div>
                  ))}
                </div>

                {/* Department filter */}
                <div className="mb-5 flex flex-wrap items-center gap-2">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Filter by dept:</span>
                  {['all', ...summary.departments].map((d) => (
                    <button
                      key={d}
                      onClick={() => setFilterDept(d)}
                      className={`rounded-lg px-3 py-1.5 text-xs font-medium transition border ${
                        filterDept === d
                          ? 'border-indigo-400 bg-indigo-50 text-indigo-700'
                          : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                      }`}
                    >
                      {d === 'all' ? 'All Departments' : d}
                    </button>
                  ))}
                </div>

                {/* Reports list */}
                <div className="space-y-3">
                  {filteredReports.length === 0 && (
                    <div className="rounded-2xl border border-slate-200 bg-white px-6 py-12 text-center text-sm text-slate-400">
                      No reports for this department in this period.
                    </div>
                  )}
                  {filteredReports.map((r) => (
                    <div
                      key={r.id}
                      className="rounded-[1.5rem] border border-black/5 bg-white shadow-sm overflow-hidden"
                    >
                      {/* Report header row */}
                      <div
                        className="flex cursor-pointer items-center gap-4 px-6 py-4 hover:bg-slate-50/60 transition"
                        onClick={() => setExpandedId(expandedId === r.id ? null : r.id)}
                      >
                        {/* Avatar */}
                        <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-indigo-100 text-sm font-semibold text-indigo-700">
                          {r.submitter_name.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-slate-900 truncate">{r.submitter_name}</p>
                          <p className="text-xs text-slate-400 truncate">{r.submitter_email} · {r.department}</p>
                        </div>
                        <div className="flex items-center gap-3 flex-shrink-0">
                          {statusBadge(r.overall_status)}
                          <span className="text-xs text-slate-400 hidden sm:block">
                            {new Date(r.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </span>
                          <span className={`text-slate-400 transition-transform ${expandedId === r.id ? 'rotate-180' : ''}`}>▾</span>
                        </div>
                      </div>

                      {/* Expanded body */}
                      {expandedId === r.id && (
                        <div className="border-t border-slate-100 px-6 py-5 space-y-4 bg-slate-50/40">
                          <Section title="✅ Accomplishments" content={r.accomplishments} />
                          {r.blockers && <Section title="⚠️ Blockers & Risks" content={r.blockers} />}
                          {r.next_steps && <Section title="🗓 Next Steps" content={r.next_steps} />}
                          <div className="flex justify-end">
                            <button
                              onClick={() => handleDelete(r.id)}
                              className="text-xs text-red-400 hover:text-red-600 transition"
                            >
                              🗑 Remove report
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Footer */}
                <p className="mt-6 text-center text-xs text-slate-400">
                  Executive view · {summary.period_label} · Generated {new Date().toLocaleString('en-US', { timeZone: 'UTC', timeZoneName: 'short' })}
                </p>
              </>
            )}
          </>
        )}
      </main>
    </div>
  )
}

// ── Sub-component ─────────────────────────────────────────────────────────────
function Section({ title, content }: { title: string; content: string }) {
  const lines = content.split('\n').filter(Boolean)
  return (
    <div>
      <p className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-slate-500">{title}</p>
      <ul className="space-y-1">
        {lines.map((line, i) => (
          <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
            <span className="mt-0.5 text-slate-400 flex-shrink-0">·</span>
            <span>{line.replace(/^[•\-*]\s*/, '')}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
