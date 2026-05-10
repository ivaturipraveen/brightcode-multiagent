import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { adminLogin, setAdminToken } from '../../lib/adminApi'

export function AdminLoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const user = await adminLogin(email, password)
      setAdminToken(user.access_token)
      navigate('/admin/content')
    } catch (err: any) {
      setError(err.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#f8f8fc] flex items-center justify-center px-4">
      {/* Background blobs */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full bg-violet-100/60 blur-[100px]" />
        <div className="absolute -right-40 bottom-0 h-[400px] w-[400px] rounded-full bg-blue-100/50 blur-[80px]" />
      </div>

      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="mb-8 text-center">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-blue-600 shadow-lg text-white text-2xl font-bold mb-4">
            B
          </div>
          <h1 className="text-2xl font-semibold text-slate-900">Admin Portal</h1>
          <p className="mt-1 text-sm text-slate-500">Sign in to manage site content</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-3xl border border-black/5 bg-white p-8 shadow-[0_20px_60px_rgba(15,23,42,0.08)]"
        >
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="admin@brightcone.ai"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-200"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-200"
              />
            </div>

            {error && (
              <div className="rounded-xl bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 py-3 text-sm font-semibold text-white shadow-md transition hover:from-violet-700 hover:to-blue-700 disabled:opacity-60"
            >
              {loading ? 'Signing in…' : 'Sign in to Admin'}
            </button>
          </div>
        </form>

        <p className="mt-6 text-center text-xs text-slate-400">
          Brightcone Admin · Restricted Access
        </p>
      </div>
    </div>
  )
}
