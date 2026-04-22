import { FormEvent, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { hrPost, setHRSession } from '../../lib/hrApi'

export function HRLoginPage() {
  const navigate = useNavigate()
  const [tab, setTab] = useState<'login' | 'register-company' | 'register-employee'>('login')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Login
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')

  // Company Registration
  const [companyName, setCompanyName] = useState('')
  const [companyEmail, setCompanyEmail] = useState('')
  const [companyPhone, setCompanyPhone] = useState('')
  const [industry, setIndustry] = useState('')
  const [adminName, setAdminName] = useState('')
  const [adminEmail, setAdminEmail] = useState('')
  const [adminPassword, setAdminPassword] = useState('')

  // Employee Registration
  const [empName, setEmpName] = useState('')
  const [empEmail, setEmpEmail] = useState('')
  const [empPassword, setEmpPassword] = useState('')
  const [empCompanyId, setEmpCompanyId] = useState('')
  const [empDept, setEmpDept] = useState('')
  const [empDesig, setEmpDesig] = useState('')

  async function handleLogin(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(''); setLoading(true)
    // Read from DOM at submit time to handle browser autofill bypassing React onChange
    const form = e.currentTarget
    const emailValue = (form.elements.namedItem('hr_email') as HTMLInputElement)?.value || loginEmail
    const passwordValue = (form.elements.namedItem('hr_password') as HTMLInputElement)?.value || loginPassword
    try {
      const data = await hrPost<any>('/hr/auth/login', { email: emailValue, password: passwordValue })
      setHRSession(data.access_token, data.role, data.name, data.company_id)
      navigate('/hr/dashboard')
    } catch (err: any) { setError(err.message) }
    finally { setLoading(false) }
  }

  async function handleCompanyRegister(e: FormEvent) {
    e.preventDefault()
    setError(''); setLoading(true)
    try {
      await hrPost('/hr/auth/register-company', {
        company_name: companyName, company_email: companyEmail,
        company_phone: companyPhone, industry,
        admin_name: adminName, admin_email: adminEmail, admin_password: adminPassword,
      })
      setSuccess('Company registered! You can now sign in as the company admin.')
      setTab('login')
    } catch (err: any) { setError(err.message) }
    finally { setLoading(false) }
  }

  async function handleEmployeeRegister(e: FormEvent) {
    e.preventDefault()
    setError(''); setLoading(true)
    try {
      await hrPost('/hr/auth/register-employee', {
        name: empName, email: empEmail, password: empPassword,
        company_id: Number(empCompanyId),
        department: empDept, designation: empDesig,
      })
      setSuccess('Employee registered! You can now sign in.')
      setTab('login')
    } catch (err: any) { setError(err.message) }
    finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center h-12 w-12 rounded-xl bg-indigo-600 mb-4">
            <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">HR Portal</h1>
          <p className="text-sm text-slate-500 mt-1">Manage your workforce efficiently</p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="flex border-b border-slate-200">
            {[
              { key: 'login', label: 'Sign In' },
              { key: 'register-company', label: 'Register Company' },
              { key: 'register-employee', label: 'Register Employee' },
            ].map((t) => (
              <button
                key={t.key}
                onClick={() => { setTab(t.key as any); setError(''); setSuccess('') }}
                className={`flex-1 py-3 text-xs font-semibold transition ${tab === t.key ? 'bg-indigo-50 text-indigo-600 border-b-2 border-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="p-6">
            {error && <p className="mb-4 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">{error}</p>}
            {success && <p className="mb-4 rounded-lg bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-700">{success}</p>}

            {/* Login */}
            {tab === 'login' && (
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Email</label>
                  <input className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" type="email" name="hr_email" autoComplete="email" value={loginEmail} onChange={e => setLoginEmail(e.target.value)} placeholder="you@company.com" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
                  <input className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" type="password" name="hr_password" autoComplete="current-password" value={loginPassword} onChange={e => setLoginPassword(e.target.value)} placeholder="••••••••" required />
                </div>
                <button disabled={loading} className="w-full rounded-lg bg-indigo-600 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:opacity-60">
                  {loading ? 'Signing in...' : 'Sign In'}
                </button>
              </form>
            )}

            {/* Company Registration */}
            {tab === 'register-company' && (
              <form onSubmit={handleCompanyRegister} className="space-y-3">
                <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-2">Company Details</p>
                <input className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" placeholder="Company name *" value={companyName} onChange={e => setCompanyName(e.target.value)} required />
                <input className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" type="email" placeholder="Company email *" value={companyEmail} onChange={e => setCompanyEmail(e.target.value)} required />
                <div className="grid grid-cols-2 gap-3">
                  <input className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" placeholder="Phone" value={companyPhone} onChange={e => setCompanyPhone(e.target.value)} />
                  <input className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" placeholder="Industry" value={industry} onChange={e => setIndustry(e.target.value)} />
                </div>
                <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mt-3">Admin Account</p>
                <input className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" placeholder="Admin full name *" value={adminName} onChange={e => setAdminName(e.target.value)} required />
                <input className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" type="email" placeholder="Admin email *" value={adminEmail} onChange={e => setAdminEmail(e.target.value)} required />
                <input className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" type="password" placeholder="Admin password *" value={adminPassword} onChange={e => setAdminPassword(e.target.value)} required />
                <button disabled={loading} className="w-full rounded-lg bg-indigo-600 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:opacity-60">
                  {loading ? 'Registering...' : 'Register Company'}
                </button>
              </form>
            )}

            {/* Employee Registration */}
            {tab === 'register-employee' && (
              <form onSubmit={handleEmployeeRegister} className="space-y-3">
                <input className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" placeholder="Full name *" value={empName} onChange={e => setEmpName(e.target.value)} required />
                <input className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" type="email" placeholder="Email *" value={empEmail} onChange={e => setEmpEmail(e.target.value)} required />
                <input className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" type="password" placeholder="Password *" value={empPassword} onChange={e => setEmpPassword(e.target.value)} required />
                <input className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" type="number" placeholder="Company ID *" value={empCompanyId} onChange={e => setEmpCompanyId(e.target.value)} required />
                <div className="grid grid-cols-2 gap-3">
                  <input className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" placeholder="Department" value={empDept} onChange={e => setEmpDept(e.target.value)} />
                  <input className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" placeholder="Designation" value={empDesig} onChange={e => setEmpDesig(e.target.value)} />
                </div>
                <button disabled={loading} className="w-full rounded-lg bg-indigo-600 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:opacity-60">
                  {loading ? 'Registering...' : 'Register Employee'}
                </button>
              </form>
            )}
          </div>
        </div>
        <p className="text-center mt-4 text-xs text-slate-400">
          <Link to="/" className="hover:text-slate-600">← Back to Brightcone</Link>
        </p>
      </div>
    </div>
  )
}
