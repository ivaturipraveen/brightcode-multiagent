import { useEffect, useState, FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { apiUrl } from '../lib/api'

interface Freelancer {
  id: number
  name: string
  title: string
  bio: string | null
  skills: string[]
  hourly_rate: number | null
  availability: string | null
  rating: number
  total_jobs: number
  location: string | null
}

function Navbar() {
  return (
    <header className="sticky top-0 z-30 border-b border-black/5 bg-[#fbfbfd]/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link to="/freelance" className="text-xl font-bold text-slate-900">Bright<span className="text-[#d97757]">Talent</span></Link>
        <nav className="hidden items-center gap-8 text-sm font-medium text-slate-600 md:flex">
          <Link to="/freelance/jobs" className="hover:text-[#d97757] transition">Find Work</Link>
          <Link to="/freelance/freelancers" className="text-[#d97757] font-semibold">Find Talent</Link>
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

function initials(name: string) {
  return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
}

function StarRating({ rating }: { rating: number }) {
  return (
    <span>
      <span className="text-amber-400">{'★'.repeat(Math.floor(rating))}{'☆'.repeat(5 - Math.floor(rating))}</span>
      <span className="ml-1 text-xs font-medium text-slate-500">{rating.toFixed(1)}</span>
    </span>
  )
}

function JoinModal({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) {
  const [name, setName] = useState('')
  const [title, setTitle] = useState('')
  const [bio, setBio] = useState('')
  const [skillsInput, setSkillsInput] = useState('')
  const [hourlyRate, setHourlyRate] = useState('')
  const [location, setLocation] = useState('')
  const [availability, setAvailability] = useState('Full-time')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const inputCls = "w-full rounded-xl border border-black/10 bg-[#faf8f3] px-4 py-3 text-slate-900 outline-none focus:border-[#d97757] focus:ring-2 focus:ring-[#f0d8cf] transition text-sm"

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const skills = skillsInput.split(',').map(s => s.trim()).filter(Boolean)
      const res = await fetch(apiUrl('/freelance/freelancers'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, title, bio, skills, hourly_rate: hourlyRate ? parseFloat(hourlyRate) : null, location, availability }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.detail ?? 'Failed to create profile')
      onSuccess()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-8 overflow-y-auto" onClick={onClose}>
      <div className="w-full max-w-lg rounded-[2rem] bg-white p-8 shadow-[0_30px_90px_rgba(15,23,42,0.18)]" onClick={e => e.stopPropagation()}>
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Join as a Freelancer</h2>
            <p className="mt-1 text-sm text-slate-500">Create your profile and start getting hired</p>
          </div>
          <button onClick={onClose} className="text-2xl text-slate-400 hover:text-slate-700 leading-none">×</button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block space-y-1.5">
              <span className="text-xs font-semibold text-slate-700">Full Name <span className="text-[#d97757]">*</span></span>
              <input className={inputCls} required value={name} onChange={e => setName(e.target.value)} placeholder="Jane Smith" />
            </label>
            <label className="block space-y-1.5">
              <span className="text-xs font-semibold text-slate-700">Professional Title <span className="text-[#d97757]">*</span></span>
              <input className={inputCls} required value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Full-Stack Developer" />
            </label>
          </div>
          <label className="block space-y-1.5">
            <span className="text-xs font-semibold text-slate-700">Bio</span>
            <textarea className={inputCls + ' min-h-[90px] resize-none'} value={bio} onChange={e => setBio(e.target.value)} placeholder="Briefly describe your expertise and experience…" />
          </label>
          <label className="block space-y-1.5">
            <span className="text-xs font-semibold text-slate-700">Skills <span className="text-slate-400">(comma-separated)</span></span>
            <input className={inputCls} value={skillsInput} onChange={e => setSkillsInput(e.target.value)} placeholder="React, TypeScript, Node.js, Python" />
          </label>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block space-y-1.5">
              <span className="text-xs font-semibold text-slate-700">Hourly Rate ($)</span>
              <input type="number" className={inputCls} value={hourlyRate} onChange={e => setHourlyRate(e.target.value)} placeholder="e.g. 75" />
            </label>
            <label className="block space-y-1.5">
              <span className="text-xs font-semibold text-slate-700">Location</span>
              <input className={inputCls} value={location} onChange={e => setLocation(e.target.value)} placeholder="City, Country" />
            </label>
          </div>
          <label className="block space-y-1.5">
            <span className="text-xs font-semibold text-slate-700">Availability</span>
            <select className={inputCls} value={availability} onChange={e => setAvailability(e.target.value)}>
              <option>Full-time</option>
              <option>Part-time</option>
              <option>Contract</option>
            </select>
          </label>
          {error && <p className="rounded-xl border border-[#efc7ba] bg-[#fff4ef] px-4 py-3 text-sm text-[#a44b2f]">{error}</p>}
          <button type="submit" disabled={loading} className="w-full rounded-xl bg-[#d97757] py-3.5 text-sm font-semibold text-white hover:bg-[#b85c3d] transition disabled:opacity-60">
            {loading ? 'Creating profile…' : 'Create My Profile →'}
          </button>
        </form>
      </div>
    </div>
  )
}

export function FreelanceFreelancersPage() {
  const [freelancers, setFreelancers] = useState<Freelancer[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [minRate, setMinRate] = useState('')
  const [maxRate, setMaxRate] = useState('')
  const [showJoin, setShowJoin] = useState(false)
  const [joinSuccess, setJoinSuccess] = useState(false)

  function fetchFreelancers() {
    setLoading(true)
    const params = new URLSearchParams()
    if (minRate) params.set('min_rate', minRate)
    if (maxRate) params.set('max_rate', maxRate)
    if (search) params.set('search', search)
    fetch(apiUrl(`/freelance/freelancers?${params}`))
      .then(r => r.json())
      .then(setFreelancers)
      .catch(() => setFreelancers([]))
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchFreelancers() }, [])

  function handleJoinSuccess() {
    setShowJoin(false)
    setJoinSuccess(true)
    fetchFreelancers()
    setTimeout(() => setJoinSuccess(false), 4000)
  }

  const inputCls = "w-full rounded-xl border border-black/10 bg-[#faf8f3] px-4 py-2.5 text-sm text-slate-900 outline-none focus:border-[#d97757] focus:ring-2 focus:ring-[#f0d8cf] transition"

  const AVAILABILITY_COLORS: Record<string, string> = {
    'Full-time': 'bg-green-50 text-green-700 border-green-200',
    'Part-time': 'bg-blue-50 text-blue-700 border-blue-200',
    'Contract': 'bg-amber-50 text-amber-700 border-amber-200',
  }

  return (
    <div className="min-h-screen bg-[#fbfbfd]">
      <Navbar />

      {/* Header */}
      <div className="border-b border-black/5 bg-white px-6 py-10">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#d97757]">Talent pool</p>
              <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">Find Expert Freelancers</h1>
              <p className="mt-2 text-slate-500">Browse top-rated professionals ready to work on your next project.</p>
            </div>
            <button
              onClick={() => setShowJoin(true)}
              className="rounded-xl border border-[#d97757] px-6 py-3 text-sm font-semibold text-[#d97757] hover:bg-[#fff7f3] transition flex-shrink-0"
            >
              🙋 Join as Freelancer
            </button>
          </div>

          {joinSuccess && (
            <div className="mt-4 rounded-2xl border border-green-200 bg-green-50 px-5 py-4 text-sm font-medium text-green-700">
              ✅ Your profile has been created! Clients can now find and hire you.
            </div>
          )}

          {/* Search + filters */}
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
              <input
                className="w-full rounded-xl border border-black/10 bg-[#faf8f3] py-3 pl-11 pr-4 text-sm text-slate-900 outline-none focus:border-[#d97757] focus:ring-2 focus:ring-[#f0d8cf] transition"
                placeholder="Search by name, title, or skill…"
                value={search}
                onChange={e => setSearch(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && fetchFreelancers()}
              />
            </div>
            <input className={`w-32 ${inputCls}`} type="number" placeholder="Min $/hr" value={minRate} onChange={e => setMinRate(e.target.value)} />
            <input className={`w-32 ${inputCls}`} type="number" placeholder="Max $/hr" value={maxRate} onChange={e => setMaxRate(e.target.value)} />
            <button onClick={fetchFreelancers} className="rounded-xl bg-[#d97757] px-6 py-3 text-sm font-semibold text-white hover:bg-[#b85c3d] transition">Search</button>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="mx-auto max-w-7xl px-6 py-10">
        {loading ? (
          <div className="py-20 text-center text-slate-400">Loading freelancers…</div>
        ) : freelancers.length === 0 ? (
          <div className="rounded-[2rem] border border-dashed border-black/10 py-20 text-center">
            <p className="text-4xl mb-4">🔎</p>
            <p className="font-semibold text-slate-700">No freelancers found</p>
            <p className="mt-2 text-sm text-slate-500">Try adjusting your filters or <button onClick={() => setShowJoin(true)} className="text-[#d97757] hover:underline">be the first to join!</button></p>
          </div>
        ) : (
          <>
            <p className="mb-6 text-sm text-slate-500"><span className="font-bold text-slate-900">{freelancers.length}</span> freelancers available</p>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {freelancers.map(f => (
                <div key={f.id} className="rounded-[2rem] border border-black/5 bg-white p-6 shadow-[0_16px_50px_rgba(15,23,42,0.05)] hover:shadow-[0_20px_60px_rgba(217,119,87,0.1)] hover:border-[#e7d7cf] transition flex flex-col">
                  <div className="flex items-start gap-4">
                    <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-[#d97757] text-base font-bold text-white shadow-lg shadow-[#d97757]/20">
                      {initials(f.name)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-bold text-slate-900">{f.name}</p>
                      <p className="text-sm font-medium text-[#d97757]">{f.title}</p>
                      {f.location && <p className="text-xs text-slate-400 mt-0.5">📍 {f.location}</p>}
                    </div>
                  </div>

                  {f.bio && (
                    <p className="mt-4 text-sm text-slate-500 leading-relaxed">
                      {f.bio.slice(0, 120)}{f.bio.length > 120 ? '…' : ''}
                    </p>
                  )}

                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {f.skills.slice(0, 5).map(s => (
                      <span key={s} className="rounded-full border border-[#efc7ba] bg-[#fff7f3] px-2.5 py-0.5 text-xs font-medium text-[#b85c3d]">{s}</span>
                    ))}
                    {f.skills.length > 5 && <span className="rounded-full border border-black/10 px-2.5 py-0.5 text-xs text-slate-400">+{f.skills.length - 5}</span>}
                  </div>

                  <div className="mt-5 flex items-center justify-between">
                    <div className="space-y-0.5">
                      <StarRating rating={f.rating} />
                      <p className="text-xs text-slate-400">{f.total_jobs} jobs completed</p>
                    </div>
                    {f.hourly_rate && (
                      <span className="text-base font-bold text-slate-900">${f.hourly_rate}<span className="text-xs font-normal text-slate-400">/hr</span></span>
                    )}
                  </div>

                  <div className="mt-4 flex items-center justify-between gap-2">
                    {f.availability && (
                      <span className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${AVAILABILITY_COLORS[f.availability] ?? 'bg-slate-50 text-slate-600 border-slate-200'}`}>
                        {f.availability}
                      </span>
                    )}
                    <button className="ml-auto rounded-xl bg-[#d97757] px-4 py-2 text-xs font-semibold text-white hover:bg-[#b85c3d] transition">Hire Now</button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* CTA */}
      <section className="px-6 py-16 lg:px-8">
        <div className="mx-auto max-w-4xl rounded-[2.5rem] bg-[#faf8f3] border border-[#e7d7cf] px-8 py-12 text-center">
          <p className="text-3xl mb-3">🧑‍💻</p>
          <h2 className="text-2xl font-bold text-slate-900">Are you a freelancer?</h2>
          <p className="mt-3 text-slate-500">Join thousands of professionals. Create your free profile and start getting hired today.</p>
          <button onClick={() => setShowJoin(true)} className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#d97757] px-8 py-4 text-base font-semibold text-white hover:bg-[#b85c3d] transition shadow-lg shadow-[#d97757]/20">
            Create Free Profile →
          </button>
        </div>
      </section>

      {showJoin && <JoinModal onClose={() => setShowJoin(false)} onSuccess={handleJoinSuccess} />}
    </div>
  )
}
