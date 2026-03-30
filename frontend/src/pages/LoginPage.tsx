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
    <AuthLayout>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <input className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100" placeholder="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100" placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        {error ? <p className="text-sm text-rose-400">{error}</p> : null}
        <button className="w-full rounded-xl bg-cyan-500 px-4 py-3 font-medium text-slate-950 transition hover:bg-cyan-400 disabled:opacity-70" disabled={loading}>
          {loading ? 'Signing in...' : 'Login'}
        </button>
      </form>
      <p className="mt-4 text-sm text-slate-400">
        Need an account? <Link className="text-cyan-400" to="/register">Register</Link>
      </p>
    </AuthLayout>
  )
}
