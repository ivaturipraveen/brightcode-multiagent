import { useEffect, useState, FormEvent } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { apiUrl } from '../lib/api'

interface Job {
  id: number
  title: string
  description: string
  budget_min: number | null
  budget_max: number | null
  budget_type: string
  skills: string[]
  category: string | null
  is_remote: boolean
  duration: string | null
  client_name: string
  created_at: string
}

const CATEGORIES = [
  'Design & Creative', 'Development', 'Writing', 'Marketing',
  'Video & Animation', 'Data Science', 'Finance', 'Customer Service',
]

function Navbar() {
  return (
    <header className="sticky top-0 z-30 border-b border-black/5 bg-[#fbfbfd]/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link to="/freelance" className="text-xl font-bold text-slate-900">Bright<span className="text-[#d97757]">Talent</span></Link>
        <nav className="hidden items-center gap-8 text-sm font-medium text-slate-600 md:flex">
          <Link to="/freelance/jobs" className="text-[#d97757] font-semibold">Find Work</Link>
          <Link to="/freelance/freelancers" className="hover:text-[#d97757] transition">Find Talent</Link>
          <Link to="/freelance/post-job" className="hover:text-[#d97757] transition">Post a Job</Link>
        </nav>
        <div className="flex items-center gap-3">
          <Link to="/login" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition">Sign In</Link>
          <Link to="/freelance/post-job" className="rounded-xl bg-[#d97757] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#b85c3d] transition">Post a Job</Link>
        </div>
      </div>
    </header>
  )
}

function ApplyModal({ job, onClose }: { job: Job; onClose: () => void }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [coverLetter, setCoverLetter] = useState('')
  const [bid, setBid] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')

  const inputCls = "w-full rounded-xl border border-black/10 bg-[#faf8f3] px-4 py-3 text-slate-900 outline-none focus:border-[#d97757] focus:ring-2 focus:ring-[#f0d8cf] transition text-sm"

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch(apiUrl(`/freelance/jobs/${job.id}/proposals`), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ freelancer_name: name, freelancer_email: email, cover_letter: coverLetter, bid_amount: bid ? parseFloat(bid) : null }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.detail ?? 'Failed to submit proposal')
      setSuccess(data.message)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4" onClick={onClose}>
      <div className="w-full max-w-lg rounded-[2rem] bg-white p-8 shadow-[0_30px_90px_rgba(15,23,42,0.18)]" onClick={e => e.stopPropagation()}>
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Apply for this Job</h2>
            <p className="mt-1 text-sm text-slate-500 line-clamp-1">{job.title}</p>
          </div>
          <button onClick={onClose} className="text-2xl text-slate-400 hover:text-slate-700 leading-none">×</button>
        </div>
        {success ? (
          <div className="rounded-2xl border border-green-200 bg-green-50 px-6 py-5 text-center">
            <p className="text-2xl mb-2">🎉</p>
            <p className="font-semibold text-green-800">{success}</p>
            <p className="mt-1 text-sm text-green-600">The client will review your proposal and reach out.</p>
            <button onClick={onClose} className="mt-4 rounded-xl bg-[#d97757] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#b85c3d] transition">Close</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block space-y-1.5">
                <span className="text-xs font-semibold text-slate-700">Full Name <span className="text-[#d97757]">*</span></span>
                <input className={inputCls} required value={name} onChange={e => setName(e.target.value)} placeholder="Jane Smith" />
              </label>
              <label className="block space-y-1.5">
                <span className="text-xs font-semibold text-slate-700">Email <span className="text-[#d97757]">*</span></span>
                <input type="email" className={inputCls} required value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" />
              </label>
            </div>
            <label className="block space-y-1.5">
              <span className="text-xs font-semibold text-slate-700">Your Bid Amount <span className="text-slate-400">(optional)</span></span>
              <input type="number" className={inputCls} value={bid} onChange={e => setBid(e.target.value)} placeholder={job.budget_type === 'hourly' ? 'Your hourly rate ($)' : 'Your fixed bid ($)'} />
            </label>
            <label className="block space-y-1.5">
              <span className="text-xs font-semibold text-slate-700">Cover Letter <span className="text-[#d97757]">*</span></span>
              <textarea className={inputCls + ' min-h-[120px] resize-none'} required value={coverLetter} onChange={e => setCoverLetter(e.target.value)} placeholder="Tell the client why you're the best fit for this project..." />
            </label>
            {error && <p className="rounded-xl border border-[#efc7ba] bg-[#fff4ef] px-4 py-3 text-sm text-[#a44b2f]">{error}</p>}
            <button type="submit" disabled={loading} className="w-full rounded-xl bg-[#d97757] py-3.5 text-sm font-semibold text-white hover:bg-[#b85c3d] transition disabled:opacity-60">
              {loading ? 'Submitting…' : 'Submit Proposal →'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}

export function FreelanceJobsPage() {
  const [searchParams] = useSearchParams()
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState(searchParams.get('category') ?? '')
  const [remoteOnly, setRemoteOnly] = useState(false)
  const [budgetType, setBudgetType] = useState('')
  const [minBudget, setMinBudget] = useState('')
  const [maxBudget, setMaxBudget] = useState('')
  const [applyJob, setApplyJob] = useState<Job | null>(null)

  function fetchJobs() {
    setLoading(true)
    const params = new URLSearchParams()
    if (category) params.set('category', category)
    if (remoteOnly) params.set('is_remote', 'true')
    if (search) params.set('search', search)
    fetch(apiUrl(`/freelance/jobs?${params}`))
      .then(r => r.json())
      .then((data: Job[]) => {
        let filtered = data
        if (budgetType) filtered = filtered.filter(j => j.budget_type === budgetType)
        if (minBudget) filtered = filtered.filter(j => (j.budget_max ?? 0) >= parseFloat(minBudget))
        if (maxBudget) filtered = filtered.filter(j => (j.budget_min ?? 0) <= parseFloat(maxBudget))
        setJobs(filtered)
      })
      .catch(() => setJobs([]))
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchJobs() }, [])

  function budgetLabel(job: Job) {
    if (!job.budget_min && !job.budget_max) return 'Negotiable'
    const suffix = job.budget_type === 'hourly' ? '/hr' : ''
    if (job.budget_min && job.budget_max) return `$${job.budget_min}–$${job.budget_max}${suffix}`
    if (job.budget_max) return `Up to $${job.budget_max}${suffix}`
    return `From $${job.budget_min}${suffix}`
  }

  function timeAgo(iso: string) {
    const ms = Date.now() - new Date(iso).getTime()
    const d = Math.floor(ms / 86400000)
    if (d === 0) return 'Today'
    if (d === 1) return 'Yesterday'
    return `${d}d ago`
  }

  const inputCls = "w-full rounded-xl border border-black/10 bg-[#faf8f3] px-4 py-2.5 text-sm text-slate-900 outline-none focus:border-[#d97757] focus:ring-2 focus:ring-[#f0d8cf] transition"

  return (
    <div className="min-h-screen bg-[#fbfbfd]">
      <Navbar />

      {/* Search bar */}
      <div className="border-b border-black/5 bg-white px-6 py-6">
        <div className="mx-auto flex max-w-7xl items-center gap-3">
          <div className="relative flex-1">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
            <input
              className="w-full rounded-xl border border-black/10 bg-[#faf8f3] py-3 pl-11 pr-4 text-sm text-slate-900 outline-none focus:border-[#d97757] focus:ring-2 focus:ring-[#f0d8cf] transition"
              placeholder="Search jobs by title, skill, or keyword…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && fetchJobs()}
            />
          </div>
          <button onClick={fetchJobs} className="rounded-xl bg-[#d97757] px-6 py-3 text-sm font-semibold text-white hover:bg-[#b85c3d] transition">Search</button>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="flex gap-8">
          {/* Sidebar Filters */}
          <aside className="hidden w-72 flex-shrink-0 lg:block">
            <div className="sticky top-24 rounded-[2rem] border border-black/5 bg-white p-6 shadow-[0_16px_50px_rgba(15,23,42,0.05)] space-y-6">
              <h3 className="font-bold text-slate-900">Filters</h3>
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Category</label>
                <select className={inputCls} value={category} onChange={e => setCategory(e.target.value)}>
                  <option value="">All Categories</option>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Budget Type</label>
                <div className="flex gap-2">
                  {['', 'fixed', 'hourly'].map(bt => (
                    <button key={bt} onClick={() => setBudgetType(bt)} className={`flex-1 rounded-lg py-2 text-xs font-semibold border transition ${budgetType === bt ? 'bg-[#d97757] text-white border-[#d97757]' : 'border-black/10 text-slate-600 hover:border-[#d97757] hover:text-[#d97757]'}`}>
                      {bt === '' ? 'All' : bt.charAt(0).toUpperCase() + bt.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Budget Range ($)</label>
                <div className="flex gap-2">
                  <input className={inputCls} type="number" placeholder="Min" value={minBudget} onChange={e => setMinBudget(e.target.value)} />
                  <input className={inputCls} type="number" placeholder="Max" value={maxBudget} onChange={e => setMaxBudget(e.target.value)} />
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setRemoteOnly(!remoteOnly)}
                  className={`relative h-6 w-11 rounded-full transition ${remoteOnly ? 'bg-[#d97757]' : 'bg-slate-200'}`}
                >
                  <span className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${remoteOnly ? 'translate-x-5' : ''}`} />
                </button>
                <span className="text-sm font-medium text-slate-700">Remote only</span>
              </div>
              <button onClick={fetchJobs} className="w-full rounded-xl bg-[#d97757] py-3 text-sm font-semibold text-white hover:bg-[#b85c3d] transition">Apply Filters</button>
              <button onClick={() => { setCategory(''); setBudgetType(''); setMinBudget(''); setMaxBudget(''); setRemoteOnly(false); setSearch('') }} className="w-full rounded-xl border border-black/10 py-2.5 text-sm font-medium text-slate-600 hover:border-[#d97757] hover:text-[#d97757] transition">Reset</button>
            </div>
          </aside>

          {/* Jobs Grid */}
          <main className="flex-1 min-w-0">
            <div className="mb-6 flex items-center justify-between">
              <p className="text-sm text-slate-500"><span className="font-bold text-slate-900">{jobs.length}</span> jobs found</p>
              <Link to="/freelance/post-job" className="rounded-xl border border-[#d97757] px-4 py-2 text-sm font-semibold text-[#d97757] hover:bg-[#fff7f3] transition">+ Post a Job</Link>
            </div>
            {loading ? (
              <div className="py-20 text-center text-slate-400">Loading jobs…</div>
            ) : jobs.length === 0 ? (
              <div className="rounded-[2rem] border border-dashed border-black/10 py-20 text-center">
                <p className="text-4xl mb-4">📭</p>
                <p className="font-semibold text-slate-700">No jobs found</p>
                <p className="mt-2 text-sm text-slate-500">Try adjusting your filters or <Link to="/freelance/post-job" className="text-[#d97757] hover:underline">post the first job!</Link></p>
              </div>
            ) : (
              <div className="grid gap-5 sm:grid-cols-2">
                {jobs.map(job => (
                  <div key={job.id} className="rounded-[2rem] border border-black/5 bg-white p-6 shadow-[0_16px_50px_rgba(15,23,42,0.05)] flex flex-col hover:shadow-[0_20px_60px_rgba(217,119,87,0.1)] hover:border-[#e7d7cf] transition">
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <div className="flex items-center gap-2">
                        {job.category && <span className="rounded-full bg-[#fff7f3] border border-[#efc7ba] px-2.5 py-0.5 text-xs font-medium text-[#b85c3d]">{job.category}</span>}
                        {job.is_remote && <span className="rounded-full bg-green-50 border border-green-200 px-2.5 py-0.5 text-xs font-medium text-green-700">🌐 Remote</span>}
                      </div>
                      <span className="text-xs text-slate-400">{timeAgo(job.created_at)}</span>
                    </div>
                    <h3 className="font-bold text-slate-900 text-base leading-snug">{job.title}</h3>
                    <p className="mt-2 text-sm text-slate-500 leading-relaxed flex-1">{job.description.slice(0, 120)}{job.description.length > 120 ? '…' : ''}</p>
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {job.skills.slice(0, 4).map(s => (
                        <span key={s} className="rounded-full border border-black/10 px-2.5 py-0.5 text-xs font-medium text-slate-600">{s}</span>
                      ))}
                    </div>
                    <div className="mt-5 flex items-center justify-between">
                      <div>
                        <span className="text-base font-bold text-[#d97757]">{budgetLabel(job)}</span>
                        {job.duration && <span className="ml-2 text-xs text-slate-400">· {job.duration}</span>}
                      </div>
                      <button onClick={() => setApplyJob(job)} className="rounded-xl bg-[#d97757] px-4 py-2 text-sm font-semibold text-white hover:bg-[#b85c3d] transition">Apply Now</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>

      {applyJob && <ApplyModal job={applyJob} onClose={() => setApplyJob(null)} />}
    </div>
  )
}
