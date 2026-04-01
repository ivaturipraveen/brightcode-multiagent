import { FormEvent, useState } from 'react'
import { Link, useSearchParams, useNavigate } from 'react-router-dom'
import { AuthLayout } from '../components/AuthLayout'
import { postJson } from '../lib/api'

export function ResetPasswordPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const token = searchParams.get('token') ?? ''

  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    if (password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }
    if (password !== confirm) {
      setError('Passwords do not match.')
      return
    }
    setLoading(true)
    try {
      await postJson('/auth/reset-password', { token, new_password: password })
      setSuccess(true)
      setTimeout(() => navigate('/login'), 2500)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Reset failed')
    } finally {
      setLoading(false)
    }
  }

  if (!token) {
    return (
      <AuthLayout title="Invalid link" subtitle="This reset link is missing or invalid.">
        <Link className="text-sm font-medium text-[#b85c3d] transition hover:text-[#9f4c31]" to="/forgot-password">
          Request a new reset link
        </Link>
      </AuthLayout>
    )
  }

  if (success) {
    return (
      <AuthLayout title="Password updated!" subtitle="Your password has been reset successfully.">
        <div className="rounded-2xl border border-[#c8e6c4] bg-[#f0faf0] px-4 py-4 text-sm text-[#2e7d32]">
          Redirecting you to sign in...
        </div>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout title="Reset password" subtitle="Choose a new password for your account.">
      <form className="space-y-5" onSubmit={handleSubmit}>
        <label className="block space-y-2">
          <span className="text-sm font-medium text-slate-700">New password</span>
          <input
            className="w-full rounded-2xl border border-black/10 bg-[#faf8f3] px-4 py-3.5 text-slate-900 outline-none transition focus:border-[#d97757] focus:bg-white focus:ring-4 focus:ring-[#f0d8cf]"
            placeholder="Min. 8 characters"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        <label className="block space-y-2">
          <span className="text-sm font-medium text-slate-700">Confirm password</span>
          <input
            className="w-full rounded-2xl border border-black/10 bg-[#faf8f3] px-4 py-3.5 text-slate-900 outline-none transition focus:border-[#d97757] focus:bg-white focus:ring-4 focus:ring-[#f0d8cf]"
            placeholder="Repeat your password"
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
          />
        </label>
        {error && <p className="rounded-2xl border border-[#efc7ba] bg-[#fff4ef] px-4 py-3 text-sm text-[#a44b2f]">{error}</p>}
        <button
          className="w-full rounded-2xl bg-slate-900 px-4 py-3.5 font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
          disabled={loading}
        >
          {loading ? 'Updating...' : 'Update password'}
        </button>
      </form>
      <p className="mt-6 text-sm text-slate-500">
        <Link className="font-medium text-[#b85c3d] transition hover:text-[#9f4c31]" to="/login">
          Back to sign in
        </Link>
      </p>
    </AuthLayout>
  )
}
