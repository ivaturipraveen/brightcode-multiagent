import { FormEvent, useState } from 'react'
import { Link } from 'react-router-dom'
import { apiUrl } from '../lib/api'
import { useTheme } from '../lib/theme'

const openRoles = [
  {
    title: 'Senior Frontend Engineer',
    team: 'Engineering',
    location: 'Remote',
    type: 'Full-time',
    description:
      'Build and own the Brightcone UI. React, TypeScript, Tailwind — you care deeply about performance, accessibility, and pixel-perfect craft.',
    skills: ['React', 'TypeScript', 'Tailwind CSS', 'Vite'],
  },
  {
    title: 'Backend Engineer (Python)',
    team: 'Engineering',
    location: 'Remote',
    type: 'Full-time',
    description:
      'Design and scale our FastAPI backend — from auth and real-time streaming to multi-agent orchestration and database architecture.',
    skills: ['Python', 'FastAPI', 'PostgreSQL', 'SQLAlchemy'],
  },
  {
    title: 'AI/ML Engineer',
    team: 'AI Research',
    location: 'Remote',
    type: 'Full-time',
    description:
      'Shape the intelligence layer: agent routing, context management, tool-use patterns, and evaluation pipelines for production-grade LLM systems.',
    skills: ['LLMs', 'LangChain / LlamaIndex', 'Python', 'RAG'],
  },
  {
    title: 'Product Designer',
    team: 'Design',
    location: 'Remote',
    type: 'Full-time',
    description:
      'Own the end-to-end product experience. You think in systems, sweat the details, and believe enterprise software can be beautiful.',
    skills: ['Figma', 'Design Systems', 'UX Research', 'Prototyping'],
  },
  {
    title: 'DevOps / Platform Engineer',
    team: 'Infrastructure',
    location: 'Remote',
    type: 'Full-time',
    description:
      'Keep the platform fast, secure, and reliable. CI/CD, observability, cloud infrastructure — you make sure nothing breaks in production.',
    skills: ['Docker', 'Kubernetes', 'GitHub Actions', 'AWS/GCP'],
  },
  {
    title: 'Growth Marketing Manager',
    team: 'Marketing',
    location: 'Remote',
    type: 'Full-time',
    description:
      'Drive awareness and acquisition for an enterprise AI platform. You understand technical buyers and know how to build pipelines that convert.',
    skills: ['B2B SaaS', 'SEO/Content', 'Paid Acquisition', 'Analytics'],
  },
]

const perks = [
  { icon: '🌍', title: 'Fully remote', desc: 'Work from anywhere in the world. Async-first, overlap-optional.' },
  { icon: '🏥', title: 'Health coverage', desc: 'Comprehensive medical, dental, and vision for you and dependents.' },
  { icon: '📈', title: 'Equity', desc: 'Meaningful equity stake in a company built to last.' },
  { icon: '🎓', title: 'Learning budget', desc: '$2,000/year for courses, books, conferences, and tools.' },
  { icon: '🖥️', title: 'Home office stipend', desc: '$1,500 to set up a workspace where you do your best thinking.' },
  { icon: '🌴', title: 'Unlimited PTO', desc: 'Take the time you need. We mean it — rest makes better work.' },
]

const values = [
  { icon: '🎯', title: 'Craft over velocity', desc: 'We move fast but never ship garbage. Quality is the culture.' },
  { icon: '🤝', title: 'Trust by default', desc: 'We hire people we trust, then actually trust them.' },
  { icon: '🧠', title: 'Curiosity required', desc: 'The AI space moves fast. We value people who learn continuously.' },
  { icon: '🔊', title: 'Direct communication', desc: 'Say what you mean. Respectfully, but clearly.' },
]

function ApplyModal({
  role,
  onClose,
}: {
  role: string
  onClose: () => void
}) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [linkedin, setLinkedin] = useState('')
  const [cover, setCover] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch(apiUrl('/careers/apply'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ job_title: role, name, email, phone, linkedin, cover_letter: cover }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.detail ?? 'Application failed')
      setSuccess(data.message)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const inputCls =
    'w-full rounded-2xl border border-black/10 bg-[#faf8f3] px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[#d97757] focus:bg-white focus:ring-4 focus:ring-[#f0d8cf] dark:border-white/10 dark:bg-white/5 dark:text-white dark:focus:border-[#d97757] dark:focus:bg-white/10'

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="relative w-full max-w-lg rounded-[2rem] border border-black/5 bg-white p-8 shadow-[0_30px_90px_rgba(15,23,42,0.2)] dark:border-white/5 dark:bg-[#111118]">
        <button
          onClick={onClose}
          className="absolute right-6 top-6 flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition hover:bg-slate-200 dark:bg-white/10 dark:text-slate-400 dark:hover:bg-white/20"
        >
          ✕
        </button>
        <p className="text-xs font-medium uppercase tracking-widest text-[#b85c3d]">Apply now</p>
        <h2 className="mt-2 text-xl font-semibold text-slate-900 dark:text-white">{role}</h2>

        {success ? (
          <div className="mt-6 rounded-2xl border border-green-200 bg-green-50 px-5 py-4 text-sm font-medium text-green-700 dark:border-green-800/40 dark:bg-green-900/20 dark:text-green-400">
            ✅ {success}
            <button onClick={onClose} className="ml-4 underline">Close</button>
          </div>
        ) : (
          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            <label className="block space-y-1.5">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Full name <span className="text-[#d97757]">*</span></span>
              <input className={inputCls} placeholder="Jane Smith" value={name} onChange={e => setName(e.target.value)} required />
            </label>
            <label className="block space-y-1.5">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Email <span className="text-[#d97757]">*</span></span>
              <input className={inputCls} placeholder="jane@company.com" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
            </label>
            <div className="grid grid-cols-2 gap-4">
              <label className="block space-y-1.5">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Phone</span>
                <input className={inputCls} placeholder="+1 555 000 0000" type="tel" value={phone} onChange={e => setPhone(e.target.value)} />
              </label>
              <label className="block space-y-1.5">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">LinkedIn</span>
                <input className={inputCls} placeholder="linkedin.com/in/…" value={linkedin} onChange={e => setLinkedin(e.target.value)} />
              </label>
            </div>
            <label className="block space-y-1.5">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Cover letter</span>
              <textarea
                className={`${inputCls} min-h-[100px] resize-y`}
                placeholder="Tell us why you're a great fit…"
                value={cover}
                onChange={e => setCover(e.target.value)}
              />
            </label>
            {error && (
              <p className="rounded-2xl border border-[#efc7ba] bg-[#fff4ef] px-4 py-3 text-sm text-[#a44b2f]">{error}</p>
            )}
            <button
              className="w-full rounded-full bg-slate-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
              disabled={loading}
            >
              {loading ? 'Submitting…' : 'Submit application →'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}

export function CareersPage() {
  const { theme } = useTheme()
  const [applyingFor, setApplyingFor] = useState<string | null>(null)

  return (
    <div className="min-h-screen bg-[#fbfbfd] text-slate-900 dark:bg-[#0a0a0f] dark:text-slate-100 transition-colors duration-300">

      {/* ── Header ── */}
      <header className="sticky top-0 z-20 border-b border-black/5 bg-[#fbfbfd]/90 backdrop-blur-xl dark:border-white/5 dark:bg-[#0a0a0f]/90">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3 lg:px-8">
          <Link to="/" className="flex items-center">
            <img
              src={theme === 'dark' ? '/brightcone-logo-dark.jpg' : '/brightcone-logo.jpg'}
              alt="Brightcone"
              className="h-9 w-auto object-contain"
            />
          </Link>
          <nav className="hidden items-center gap-8 text-sm text-slate-600 dark:text-slate-400 md:flex">
            <a href="/#features" className="transition hover:text-slate-900 dark:hover:text-white">Features</a>
            <a href="/#enterprise" className="transition hover:text-slate-900 dark:hover:text-white">Enterprise</a>
            <Link to="/pricing" className="transition hover:text-slate-900 dark:hover:text-white">Pricing</Link>
            <Link to="/about" className="transition hover:text-slate-900 dark:hover:text-white">About</Link>
            <Link to="/careers" className="font-medium text-slate-900 dark:text-white">Careers</Link>
          </nav>
          <div className="flex items-center gap-3">
            <Link to="/login" className="text-sm font-medium text-slate-700 transition hover:text-slate-900 dark:text-slate-300 dark:hover:text-white">
              Sign in
            </Link>
            <Link
              to="/register"
              className="rounded-full bg-slate-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
            >
              Get started
            </Link>
          </div>
        </div>
      </header>

      <main>
        {/* ── Hero ── */}
        <section className="relative overflow-hidden px-6 pb-20 pt-24 lg:px-8 lg:pb-28 lg:pt-32">
          <div className="pointer-events-none absolute inset-0 -z-10">
            <div className="absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full bg-[#f0d8cf]/40 blur-[120px]" />
            <div className="absolute -right-40 top-10 h-[400px] w-[400px] rounded-full bg-slate-200/40 blur-[100px] dark:bg-slate-800/30" />
          </div>
          <div className="mx-auto max-w-4xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#e7d7cf] bg-[#fff7f3] px-4 py-1.5 text-sm font-medium text-[#b85c3d] dark:border-[#b85c3d]/30 dark:bg-[#b85c3d]/10 dark:text-[#e8916f]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#d97757]" />
              We're hiring
            </div>
            <h1 className="mx-auto mt-8 text-5xl font-semibold tracking-tight text-slate-900 dark:text-white sm:text-6xl lg:text-7xl lg:leading-[1.05]">
              Build the future of{' '}
              <span className="bg-gradient-to-r from-[#d97757] to-[#b85c3d] bg-clip-text text-transparent">
                enterprise AI
              </span>
            </h1>
            <p className="mx-auto mt-8 max-w-2xl text-lg leading-8 text-slate-500 dark:text-slate-400">
              We're a small team building software that changes how enterprises operate. Every role at Brightcone has real impact — join us if you want your work to matter.
            </p>
            <a
              href="#open-roles"
              className="mt-10 inline-flex rounded-full bg-slate-900 px-7 py-3.5 text-sm font-medium text-white transition hover:bg-slate-700 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
            >
              See open roles ↓
            </a>
          </div>
        </section>

        {/* ── Values ── */}
        <section className="px-6 py-16 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <div className="max-w-2xl">
              <p className="text-sm font-medium uppercase tracking-[0.24em] text-slate-400 dark:text-slate-500">How we work</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900 dark:text-white">
                What you can expect from us.
              </h2>
            </div>
            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {values.map((v) => (
                <div key={v.title} className="rounded-[2rem] border border-black/5 bg-white p-7 shadow-[0_16px_50px_rgba(15,23,42,0.05)] dark:border-white/5 dark:bg-[#111118]">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-50 text-2xl dark:bg-white/5">{v.icon}</div>
                  <h3 className="mt-4 font-semibold text-slate-900 dark:text-white">{v.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">{v.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Perks ── */}
        <section className="px-6 py-16 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <div className="max-w-2xl">
              <p className="text-sm font-medium uppercase tracking-[0.24em] text-slate-400 dark:text-slate-500">Benefits</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900 dark:text-white">
                What we offer.
              </h2>
            </div>
            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {perks.map((perk) => (
                <div
                  key={perk.title}
                  className="flex items-start gap-5 rounded-[2rem] border border-black/5 bg-white p-7 shadow-[0_16px_50px_rgba(15,23,42,0.05)] dark:border-white/5 dark:bg-[#111118]"
                >
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-[#fff7f3] text-2xl dark:bg-[#b85c3d]/10">
                    {perk.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-white">{perk.title}</h3>
                    <p className="mt-1 text-sm leading-6 text-slate-500 dark:text-slate-400">{perk.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Open Roles ── */}
        <section id="open-roles" className="px-6 py-16 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <div className="max-w-2xl">
              <p className="text-sm font-medium uppercase tracking-[0.24em] text-slate-400 dark:text-slate-500">Open positions</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900 dark:text-white">
                {openRoles.length} roles available — all remote.
              </h2>
            </div>
            <div className="mt-10 space-y-4">
              {openRoles.map((role) => (
                <div
                  key={role.title}
                  className="group rounded-[2rem] border border-black/5 bg-white p-7 shadow-[0_16px_50px_rgba(15,23,42,0.05)] transition hover:shadow-[0_20px_60px_rgba(15,23,42,0.09)] dark:border-white/5 dark:bg-[#111118]"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{role.title}</h3>
                        <span className="rounded-full bg-[#fff7f3] px-3 py-0.5 text-xs font-medium text-[#b85c3d] dark:bg-[#b85c3d]/10 dark:text-[#e8916f]">
                          {role.team}
                        </span>
                      </div>
                      <div className="mt-1 flex flex-wrap gap-3 text-xs text-slate-400 dark:text-slate-500">
                        <span>📍 {role.location}</span>
                        <span>⏱ {role.type}</span>
                      </div>
                      <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-400">{role.description}</p>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {role.skills.map((skill) => (
                          <span
                            key={skill}
                            className="rounded-full border border-black/5 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600 dark:border-white/5 dark:bg-white/5 dark:text-slate-400"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                    <button
                      onClick={() => setApplyingFor(role.title)}
                      className="mt-2 flex-shrink-0 rounded-full bg-slate-900 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-slate-700 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 sm:mt-0"
                    >
                      Apply →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="px-6 pb-24 pt-8 lg:px-8">
          <div className="mx-auto max-w-5xl rounded-[2.5rem] border border-black/5 bg-slate-900 px-8 py-14 text-center text-white shadow-[0_30px_90px_rgba(15,23,42,0.18)] dark:border-white/5 dark:bg-[#111118] sm:px-12">
            <p className="text-sm font-medium uppercase tracking-[0.26em] text-white/60">Don't see your role?</p>
            <h2 className="mt-5 text-3xl font-semibold tracking-tight sm:text-4xl">
              We'd still love to hear from you.
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base leading-8 text-white/70">
              If you think you belong at Brightcone, reach out. We occasionally create roles for exceptional people.
            </p>
            <a
              href="mailto:careers@brightcone.ai"
              className="mt-8 inline-flex rounded-full bg-white px-7 py-3.5 text-sm font-medium text-slate-900 transition hover:bg-slate-100"
            >
              careers@brightcone.ai
            </a>
          </div>
        </section>
      </main>

      {/* ── Footer ── */}
      <footer className="border-t border-black/5 px-6 py-8 dark:border-white/5">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 sm:flex-row lg:px-8">
          <p className="text-xs text-slate-400 dark:text-slate-600">© 2026 Brightcone. All rights reserved.</p>
          <div className="flex items-center gap-6 text-sm text-slate-400 dark:text-slate-600">
            <Link to="/about" className="transition hover:text-slate-600 dark:hover:text-slate-400">About</Link>
            <Link to="/pricing" className="transition hover:text-slate-600 dark:hover:text-slate-400">Pricing</Link>
            <Link to="/careers" className="transition hover:text-slate-600 dark:hover:text-slate-400">Careers</Link>
            <Link to="/login" className="transition hover:text-slate-600 dark:hover:text-slate-400">Sign in</Link>
          </div>
        </div>
      </footer>

      {/* ── Apply Modal ── */}
      {applyingFor && (
        <ApplyModal role={applyingFor} onClose={() => setApplyingFor(null)} />
      )}
    </div>
  )
}
