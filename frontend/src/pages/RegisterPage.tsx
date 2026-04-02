import { FormEvent, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthLayout } from '../components/AuthLayout'
import { postJson, type AuthResponse } from '../lib/api'

export function RegisterPage() {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setError('')
    setLoading(true)

    try {
      const data = await postJson<AuthResponse>('/auth/register', { name, email, password })
      localStorage.setItem('token', data.access_token)
      navigate('/chat')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout title="Create your account" subtitle="Start with a clean workspace and persistent conversations.">
      <form className="space-y-5" onSubmit={handleSubmit}>
        <label className="block space-y-2">
          <span className="text-sm font-medium text-slate-700">Name</span>
          <input
            className="w-full rounded-2xl border border-black/10 bg-[#faf8f3] px-4 py-3.5 text-slate-900 outline-none transition focus:border-[#d97757] focus:bg-white focus:ring-4 focus:ring-[#f0d8cf]"
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </label>
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
          <span className="text-sm font-medium text-slate-700">Password</span>
          <input
            className="w-full rounded-2xl border border-black/10 bg-[#faf8f3] px-4 py-3.5 text-slate-900 outline-none transition focus:border-[#d97757] focus:bg-white focus:ring-4 focus:ring-[#f0d8cf]"
            placeholder="Choose a password"
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
          {loading ? 'Creating account...' : 'Create account'}
        </button>
      </form>
      <p className="mt-6 text-sm text-slate-500">
        Already registered?{' '}
        <Link className="font-medium text-[#b85c3d] transition hover:text-[#9f4c31]" to="/login">
          Sign in
        </Link>
      </p>
    </AuthLayout>
  )
}
