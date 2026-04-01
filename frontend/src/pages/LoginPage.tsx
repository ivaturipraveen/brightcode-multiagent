import { FormEvent, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthLayout } from '../components/AuthLayout'
import { postJson, type AuthResponse } from '../lib/api'

export function LoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setError('')
    setLoading(true)

    try {
      const data = await postJson<AuthResponse>('/auth/login', { email, password })
      localStorage.setItem('token', data.access_token)
      navigate('/chat')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout title="Welcome back" subtitle="Sign in to continue your conversations.">
      <form className="space-y-5" onSubmit={handleSubmit}>
        <label className="block space-y-2">
          <span className="text-sm font-medium text-slate-700">Email</span>
          <input
            className="w-full rounded-2xl border border-black/10 bg-[#faf8f3] px-4 py-3.5 text-slate-900 outline-none transition focus:border-[#d97757] focus:bg-white focus:ring-4 focus:ring-[#f0d8cf]"
            placeholder="you@example.com"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        <label className="block space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-700">Password</span>
            <Link className="text-xs font-medium text-[#b85c3d] transition hover:text-[#9f4c31]" to="/forgot-password">
              Forgot password?
            </Link>
          </div>
          <input
            className="w-full rounded-2xl border border-black/10 bg-[#faf8f3] px-4 py-3.5 text-slate-900 outline-none transition focus:border-[#d97757] focus:bg-white focus:ring-4 focus:ring-[#f0d8cf]"
            placeholder="Enter your password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        {error ? <p className="rounded-2xl border border-[#efc7ba] bg-[#fff4ef] px-4 py-3 text-sm text-[#a44b2f]">{error}</p> : null}
        <button
          className="w-full rounded-2xl bg-slate-900 px-4 py-3.5 font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
          disabled={loading}
        >
          {loading ? 'Signing in...' : 'Continue'}
        </button>
      </form>
      <p className="mt-6 text-sm text-slate-500">
        Need an account?{' '}
        <Link className="font-medium text-[#b85c3d] transition hover:text-[#9f4c31]" to="/register">
          Create one
        </Link>
      </p>
    </AuthLayout>
  )
}
