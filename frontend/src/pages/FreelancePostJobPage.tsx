import { FormEvent, useState } from 'react'
import { Link } from 'react-router-dom'
import { apiUrl } from '../lib/api'

const CATEGORIES = [
  'Design & Creative', 'Development', 'Writing', 'Marketing',
  'Video & Animation', 'Data Science', 'Finance', 'Customer Service',
]

const DURATIONS = ['1 Week', '1 Month', '3 Months', '6 Months', 'Ongoing']

function Navbar() {
  return (
    <header className="sticky top-0 z-30 border-b border-black/5 bg-[#fbfbfd]/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link to="/freelance" className="text-xl font-bold text-slate-900">Bright<span className="text-[#d97757]">Talent</span></Link>
        <nav className="hidden items-center gap-8 text-sm font-medium text-slate-600 md:flex">
          <Link to="/freelance/jobs" className="hover:text-[#d97757] transition">Find Work</Link>
          <Link to="/freelance/freelancers" className="hover:text-[#d97757] transition">Find Talent</Link>
          <Link to="/freelance/post-job" className="text-[#d97757] font-semibold">Post a Job</Link>
        </nav>
        <Link to="/login" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition">Sign In</Link>
      </div>
    </header>
  )
}

export function FreelancePostJobPage() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('')
  const [budgetType, setBudgetType] = useState<'fixed' | 'hourly'>('fixed')
  const [budgetMin, setBudgetMin] = useState('')
  const [budgetMax, setBudgetMax] = useState('')
  const [skillsInput, setSkillsInput] = useState('')
  const [skills, setSkills] = useState<string[]>([])
  const [isRemote, setIsRemote] = useState(true)
  const [duration, setDuration] = useState('')
  const [clientName, setClientName] = useState('')
  const [clientEmail, setClientEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const inputCls = "w-full rounded-xl border border-black/10 bg-[#faf8f3] px-4 py-3 text-slate-900 outline-none focus:border-[#d97757] focus:ring-2 focus:ring-[#f0d8cf] transition text-sm"

  function addSkill() {
    const parsed = skillsInput.split(',').map(s => s.trim()).filter(Boolean)
    const newSkills = [...new Set([...skills, ...parsed])]
    setSkills(newSkills)
    setSkillsInput('')
  }

  function removeSkill(s: string) {
    setSkills(skills.filter(sk => sk !== s))
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const finalSkills = skillsInput ? [...new Set([...skills, ...skillsInput.split(',').map(s => s.trim()).filter(Boolean)])] : skills
      const res = await fetch(apiUrl('/freelance/jobs'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description,
          category: category || null,
          budget_type: budgetType,
          budget_min: budgetMin ? parseFloat(budgetMin) : null,
          budget_max: budgetMax ? parseFloat(budgetMax) : null,
          skills: finalSkills,
          is_remote: isRemote,
          duration: duration || null,
          client_name: clientName,
          client_email: clientEmail,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.detail ?? 'Failed to post job')
      setSuccess(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  function resetForm() {
    setTitle(''); setDescription(''); setCategory(''); setBudgetType('fixed')
    setBudgetMin(''); setBudgetMax(''); setSkillsInput(''); setSkills([])
    setIsRemote(true); setDuration(''); setClientName(''); setClientEmail('')
    setSuccess(false); setError('')
  }

  return (
    <div className="min-h-screen bg-[#fbfbfd]">
      <Navbar />
      <div className="mx-auto max-w-2xl px-6 py-16">
        {success ? (
          <div className="rounded-[2.5rem] border border-black/5 bg-white p-12 text-center shadow-[0_20px_60px_rgba(15,23,42,0.07)]">
            <p className="text-5xl mb-4">🎉</p>
            <h2 className="text-2xl font-bold text-slate-900">Job Posted Successfully!</h2>
            <p className="mt-3 text-slate-500">Your job is now live. Freelancers will start sending proposals soon.</p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
              <Link to="/freelance/jobs" className="rounded-xl bg-[#d97757] px-6 py-3 text-sm font-semibold text-white hover:bg-[#b85c3d] transition">
                View All Jobs →
              </Link>
              <button onClick={resetForm} className="rounded-xl border border-[#d97757] px-6 py-3 text-sm font-semibold text-[#d97757] hover:bg-[#fff7f3] transition">
                Post Another Job
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="mb-8">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#d97757]">Hire talent</p>
              <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">Post a Job</h1>
              <p className="mt-2 text-slate-500">Reach thousands of qualified freelancers. It's free.</p>
            </div>
            <div className="rounded-[2.5rem] border border-black/5 bg-white p-8 shadow-[0_20px_60px_rgba(15,23,42,0.07)]">
              <form onSubmit={handleSubmit} className="space-y-6">

                {/* Title */}
                <label className="block space-y-2">
                  <span className="text-sm font-semibold text-slate-700">Job Title <span className="text-[#d97757]">*</span></span>
                  <input className={inputCls} required value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Build a React dashboard for my SaaS app" />
                </label>

                {/* Description */}
                <label className="block space-y-2">
                  <span className="text-sm font-semibold text-slate-700">Description <span className="text-[#d97757]">*</span></span>
                  <textarea className={inputCls + ' min-h-[140px] resize-none'} required value={description} onChange={e => setDescription(e.target.value)} placeholder="Describe the project, deliverables, and any specific requirements…" />
                </label>

                {/* Category */}
                <label className="block space-y-2">
                  <span className="text-sm font-semibold text-slate-700">Category</span>
                  <select className={inputCls} value={category} onChange={e => setCategory(e.target.value)}>
                    <option value="">Select a category</option>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </label>

                {/* Budget type */}
                <div className="space-y-2">
                  <span className="text-sm font-semibold text-slate-700">Budget Type</span>
                  <div className="flex gap-3">
                    {(['fixed', 'hourly'] as const).map(bt => (
                      <button key={bt} type="button" onClick={() => setBudgetType(bt)} className={`flex-1 rounded-xl border py-3 text-sm font-semibold transition ${budgetType === bt ? 'bg-[#d97757] text-white border-[#d97757]' : 'border-black/10 text-slate-600 hover:border-[#d97757] hover:text-[#d97757]'}`}>
                        {bt === 'fixed' ? '💰 Fixed Price' : '⏱️ Hourly Rate'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Budget range */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block space-y-2">
                    <span className="text-sm font-semibold text-slate-700">Min Budget ($)</span>
                    <input type="number" className={inputCls} value={budgetMin} onChange={e => setBudgetMin(e.target.value)} placeholder="e.g. 500" />
                  </label>
                  <label className="block space-y-2">
                    <span className="text-sm font-semibold text-slate-700">Max Budget ($)</span>
                    <input type="number" className={inputCls} value={budgetMax} onChange={e => setBudgetMax(e.target.value)} placeholder="e.g. 2000" />
                  </label>
                </div>

                {/* Skills */}
                <div className="space-y-2">
                  <span className="text-sm font-semibold text-slate-700">Required Skills</span>
                  <div className="flex gap-2">
                    <input
                      className={inputCls}
                      value={skillsInput}
                      onChange={e => setSkillsInput(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                      placeholder="Type skills, comma-separated, then press Enter or Add"
                    />
                    <button type="button" onClick={addSkill} className="flex-shrink-0 rounded-xl bg-[#faf8f3] border border-[#e7d7cf] px-4 text-sm font-semibold text-[#b85c3d] hover:bg-[#fff7f3] transition">Add</button>
                  </div>
                  {skills.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-1">
                      {skills.map(s => (
                        <span key={s} className="flex items-center gap-1.5 rounded-full border border-[#efc7ba] bg-[#fff7f3] px-3 py-1 text-xs font-medium text-[#b85c3d]">
                          {s}
                          <button type="button" onClick={() => removeSkill(s)} className="text-[#d97757] hover:text-[#b85c3d] font-bold leading-none">×</button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Remote + Duration */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <span className="text-sm font-semibold text-slate-700">Duration</span>
                    <select className={inputCls} value={duration} onChange={e => setDuration(e.target.value)}>
                      <option value="">Select duration</option>
                      {DURATIONS.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <span className="text-sm font-semibold text-slate-700">Work Location</span>
                    <div className="flex items-center gap-3 h-[46px]">
                      <button
                        type="button"
                        onClick={() => setIsRemote(!isRemote)}
                        className={`relative h-6 w-11 rounded-full transition ${isRemote ? 'bg-[#d97757]' : 'bg-slate-200'}`}
                      >
                        <span className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${isRemote ? 'translate-x-5' : ''}`} />
                      </button>
                      <span className="text-sm text-slate-700">{isRemote ? '🌐 Remote' : '🏢 On-site'}</span>
                    </div>
                  </div>
                </div>

                {/* Client info */}
                <div className="rounded-2xl border border-black/5 bg-[#faf8f3] p-5 space-y-4">
                  <p className="text-sm font-bold text-slate-700">Your Contact Info</p>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="block space-y-1.5">
                      <span className="text-xs font-semibold text-slate-600">Full Name <span className="text-[#d97757]">*</span></span>
                      <input className={inputCls} required value={clientName} onChange={e => setClientName(e.target.value)} placeholder="Your full name" />
                    </label>
                    <label className="block space-y-1.5">
                      <span className="text-xs font-semibold text-slate-600">Email <span className="text-[#d97757]">*</span></span>
                      <input type="email" className={inputCls} required value={clientEmail} onChange={e => setClientEmail(e.target.value)} placeholder="you@company.com" />
                    </label>
                  </div>
                </div>

                {error && <p className="rounded-xl border border-[#efc7ba] bg-[#fff4ef] px-4 py-3 text-sm text-[#a44b2f]">{error}</p>}

                <button type="submit" disabled={loading} className="w-full rounded-xl bg-[#d97757] py-4 text-base font-semibold text-white hover:bg-[#b85c3d] transition shadow-lg shadow-[#d97757]/20 disabled:opacity-60">
                  {loading ? 'Posting your job…' : 'Post Job Free →'}
                </button>
              </form>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
