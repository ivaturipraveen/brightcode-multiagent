import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { apiUrl } from '../lib/api'

interface Stats {
  total_jobs: number
  total_freelancers: number
  total_proposals: number
}

interface Freelancer {
  id: number
  name: string
  title: string
  bio: string
  skills: string[]
  hourly_rate: number
  rating: number
  total_jobs: number
  location: string
  availability: string
}

interface Job {
  id: number
  title: string
  description: string
  budget_min: number
  budget_max: number
  budget_type: string
  skills: string[]
  category: string
  is_remote: boolean
  duration: string
  created_at: string
}

const CATEGORIES = [
  { icon: '🎨', label: 'Design & Creative' },
  { icon: '💻', label: 'Development' },
  { icon: '✍️', label: 'Writing' },
  { icon: '📣', label: 'Marketing' },
  { icon: '🎬', label: 'Video & Animation' },
  { icon: '📊', label: 'Data Science' },
  { icon: '💰', label: 'Finance' },
  { icon: '🎧', label: 'Customer Service' },
]

function Navbar() {
  return (
    <header className="sticky top-0 z-30 border-b border-black/5 bg-[#fbfbfd]/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link to="/freelance" className="flex items-center gap-2">
          <span className="text-xl font-bold text-slate-900">Bright<span className="text-[#d97757]">Talent</span></span>
        </Link>
        <nav className="hidden items-center gap-8 text-sm font-medium text-slate-600 md:flex">
          <Link to="/freelance/jobs" className="hover:text-[#d97757] transition">Find Work</Link>
          <Link to="/freelance/freelancers" className="hover:text-[#d97757] transition">Find Talent</Link>
          <Link to="/freelance/post-job" className="hover:text-[#d97757] transition">Post a Job</Link>
        </nav>
        <div className="flex items-center gap-3">
          <Link to="/login" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition">Sign In</Link>
          <Link to="/freelance/post-job" className="rounded-xl bg-[#d97757] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#b85c3d] transition">
            Post a Job
          </Link>
        </div>
      </div>
    </header>
  )
}

function StarRating({ rating }: { rating: number }) {
  return (
    <span className="text-amber-400">
      {'★'.repeat(Math.floor(rating))}{'☆'.repeat(5 - Math.floor(rating))}
      <span className="ml-1 text-slate-600 text-xs font-medium">{rating.toFixed(1)}</span>
    </span>
  )
}

function initials(name: string) {
  return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
}

export function FreelanceLandingPage() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [freelancers, setFreelancers] = useState<Freelancer[]>([])
  const [jobs, setJobs] = useState<Job[]>([])
  const [howTab, setHowTab] = useState<'client' | 'freelancer'>('client')

  useEffect(() => {
    fetch(apiUrl('/freelance/stats')).then(r => r.json()).then(setStats).catch(() => {})
    fetch(apiUrl('/freelance/freelancers')).then(r => r.json()).then((d: Freelancer[]) => setFreelancers(d.slice(0, 6))).catch(() => {})
    fetch(apiUrl('/freelance/jobs')).then(r => r.json()).then((d: Job[]) => setJobs(d.slice(0, 6))).catch(() => {})
  }, [])

  const clientSteps = [
    { n: '01', title: 'Post a Job', desc: 'Describe your project and set your budget in minutes.' },
    { n: '02', title: 'Review Proposals', desc: 'Get proposals from qualified freelancers within hours.' },
    { n: '03', title: 'Hire & Pay', desc: 'Choose the best fit and pay securely when milestones are met.' },
  ]
  const freelancerSteps = [
    { n: '01', title: 'Create Profile', desc: 'Showcase your skills, portfolio, and set your rate.' },
    { n: '02', title: 'Browse Jobs', desc: 'Find projects that match your expertise and interests.' },
    { n: '03', title: 'Get Paid', desc: 'Submit proposals, win projects, and receive secure payments.' },
  ]

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

  return (
    <div className="min-h-screen bg-[#fbfbfd] text-slate-900">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden px-6 pb-24 pt-24 lg:px-8">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#fff7f3] via-[#fbfbfd] to-[#fbfbfd]" />
        <div className="relative mx-auto max-w-4xl text-center">
          <div className="mb-6 inline-flex rounded-full border border-[#e7d7cf] bg-[#fff7f3] px-4 py-1.5 text-sm font-medium text-[#b85c3d]">
            🚀 The smarter way to find & hire talent
          </div>
          <h1 className="text-5xl font-bold tracking-tight text-slate-900 lg:text-6xl">
            Find World-Class Talent.<br />
            <span className="text-[#d97757]">Instantly.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-500">
            Connect with top freelancers across design, development, marketing, and more.
            Post your first job free — get proposals within hours.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link to="/freelance/jobs" className="rounded-xl bg-[#d97757] px-8 py-4 text-base font-semibold text-white hover:bg-[#b85c3d] transition shadow-lg shadow-[#d97757]/20">
              Browse Jobs →
            </Link>
            <Link to="/freelance/freelancers" className="rounded-xl border border-[#d97757] px-8 py-4 text-base font-semibold text-[#d97757] hover:bg-[#fff7f3] transition">
              Find Talent
            </Link>
          </div>

          {/* Stats bar */}
          {stats && (
            <div className="mx-auto mt-16 grid max-w-2xl grid-cols-3 divide-x divide-black/5 rounded-2xl border border-black/5 bg-white py-6 shadow-[0_16px_50px_rgba(15,23,42,0.05)]">
              {[
                { value: stats.total_jobs, label: 'Open Jobs' },
                { value: stats.total_freelancers, label: 'Freelancers' },
                { value: stats.total_proposals, label: 'Proposals Sent' },
              ].map(s => (
                <div key={s.label} className="text-center">
                  <div className="text-3xl font-bold text-[#d97757]">{s.value.toLocaleString()}</div>
                  <div className="mt-1 text-xs font-medium text-slate-500">{s.label}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Categories */}
      <section className="px-6 py-20 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#d97757]">Browse by category</p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">Find the expertise you need</h2>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-8">
            {CATEGORIES.map(cat => (
              <Link
                key={cat.label}
                to={`/freelance/jobs?category=${encodeURIComponent(cat.label)}`}
                className="group flex flex-col items-center gap-3 rounded-2xl border border-black/5 bg-white p-5 text-center shadow-[0_8px_30px_rgba(15,23,42,0.04)] transition hover:-translate-y-1 hover:border-[#e7d7cf] hover:shadow-[0_16px_40px_rgba(217,119,87,0.12)]"
              >
                <span className="text-3xl">{cat.icon}</span>
                <span className="text-xs font-semibold text-slate-700 group-hover:text-[#d97757] transition leading-tight">{cat.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-[#faf8f3] px-6 py-20 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="mb-10 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#d97757]">Simple process</p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">How BrightTalent works</h2>
          </div>
          <div className="mb-8 flex justify-center gap-2">
            {(['client', 'freelancer'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setHowTab(tab)}
                className={`rounded-xl px-6 py-2.5 text-sm font-semibold transition ${howTab === tab ? 'bg-[#d97757] text-white shadow' : 'border border-black/10 text-slate-600 hover:border-[#d97757] hover:text-[#d97757]'}`}
              >
                {tab === 'client' ? '👤 For Clients' : '🧑‍💻 For Freelancers'}
              </button>
            ))}
          </div>
          <div className="grid gap-6 sm:grid-cols-3">
            {(howTab === 'client' ? clientSteps : freelancerSteps).map(step => (
              <div key={step.n} className="rounded-[2rem] border border-black/5 bg-white p-8 shadow-[0_16px_50px_rgba(15,23,42,0.05)]">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#fff7f3] text-lg font-bold text-[#d97757]">{step.n}</div>
                <h3 className="text-lg font-semibold text-slate-900">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-500">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Freelancers */}
      {freelancers.length > 0 && (
        <section className="px-6 py-20 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="mb-10 flex items-end justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#d97757]">Top talent</p>
                <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">Featured Freelancers</h2>
              </div>
              <Link to="/freelance/freelancers" className="text-sm font-semibold text-[#d97757] hover:underline">View all →</Link>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {freelancers.map(f => (
                <div key={f.id} className="rounded-[2rem] border border-black/5 bg-white p-6 shadow-[0_16px_50px_rgba(15,23,42,0.05)]">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-[#d97757] text-sm font-bold text-white">{initials(f.name)}</div>
                    <div className="min-w-0">
                      <p className="font-semibold text-slate-900">{f.name}</p>
                      <p className="text-sm text-[#d97757]">{f.title}</p>
                      {f.location && <p className="text-xs text-slate-400">📍 {f.location}</p>}
                    </div>
                  </div>
                  {f.bio && <p className="mt-4 text-sm leading-relaxed text-slate-500">{f.bio.slice(0, 100)}{f.bio.length > 100 ? '…' : ''}</p>}
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {f.skills.slice(0, 4).map(s => (
                      <span key={s} className="rounded-full border border-[#efc7ba] bg-[#fff7f3] px-2.5 py-0.5 text-xs font-medium text-[#b85c3d]">{s}</span>
                    ))}
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <div>
                      <StarRating rating={f.rating} />
                      <p className="text-xs text-slate-400">{f.total_jobs} jobs completed</p>
                    </div>
                    {f.hourly_rate && <span className="text-sm font-bold text-slate-900">${f.hourly_rate}<span className="text-xs font-normal text-slate-400">/hr</span></span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Recent Jobs */}
      {jobs.length > 0 && (
        <section className="bg-[#faf8f3] px-6 py-20 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="mb-10 flex items-end justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#d97757]">Latest opportunities</p>
                <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">Recent Jobs</h2>
              </div>
              <Link to="/freelance/jobs" className="text-sm font-semibold text-[#d97757] hover:underline">Browse all →</Link>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {jobs.map(job => (
                <div key={job.id} className="rounded-[2rem] border border-black/5 bg-white p-6 shadow-[0_16px_50px_rgba(15,23,42,0.05)] flex flex-col">
                  <div className="flex items-center justify-between gap-2 mb-3">
                    {job.category && <span className="rounded-full bg-[#fff7f3] border border-[#efc7ba] px-2.5 py-0.5 text-xs font-medium text-[#b85c3d]">{job.category}</span>}
                    {job.is_remote && <span className="rounded-full bg-green-50 border border-green-200 px-2.5 py-0.5 text-xs font-medium text-green-700">🌐 Remote</span>}
                  </div>
                  <h3 className="font-semibold text-slate-900">{job.title}</h3>
                  <p className="mt-2 text-sm text-slate-500 leading-relaxed flex-1">{job.description.slice(0, 100)}…</p>
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {job.skills.slice(0, 3).map(s => (
                      <span key={s} className="rounded-full border border-black/10 px-2.5 py-0.5 text-xs font-medium text-slate-600">{s}</span>
                    ))}
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-sm font-bold text-[#d97757]">{budgetLabel(job)}</span>
                    <span className="text-xs text-slate-400">{timeAgo(job.created_at)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Banner */}
      <section className="px-6 py-20 lg:px-8">
        <div className="mx-auto max-w-5xl rounded-[2.5rem] bg-slate-900 px-8 py-16 text-center shadow-[0_30px_90px_rgba(15,23,42,0.18)]">
          <h2 className="text-3xl font-bold text-white">Ready to get started?</h2>
          <p className="mt-4 text-base text-slate-400">Post your first job free. Find the perfect freelancer in minutes.</p>
          <Link to="/freelance/post-job" className="mt-8 inline-flex items-center gap-2 rounded-xl bg-[#d97757] px-8 py-4 text-base font-semibold text-white hover:bg-[#b85c3d] transition shadow-lg shadow-[#d97757]/30">
            Post a Job Free →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-black/5 bg-white px-6 py-10 text-center text-sm text-slate-400">
        <p>© {new Date().getFullYear()} BrightTalent · Part of the Brightcone platform</p>
        <div className="mt-3 flex justify-center gap-6">
          <Link to="/freelance/jobs" className="hover:text-[#d97757] transition">Browse Jobs</Link>
          <Link to="/freelance/freelancers" className="hover:text-[#d97757] transition">Find Talent</Link>
          <Link to="/freelance/post-job" className="hover:text-[#d97757] transition">Post a Job</Link>
          <Link to="/about" className="hover:text-[#d97757] transition">About</Link>
        </div>
      </footer>
    </div>
  )
}
