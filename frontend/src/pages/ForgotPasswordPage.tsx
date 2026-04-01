import { FormEvent, useState } from 'react'
import { Link } from 'react-router-dom'
import { AuthLayout } from '../components/AuthLayout'
import { postJson } from '../lib/api'

export function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await postJson('/auth/forgot-password', { email })
      setSubmitted(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <AuthLayout title="Check your email" subtitle="We've sent a password reset link if that account exists.">
        <div className="rounded-2xl border border-[#c8e6c4] bg-[#f0faf0] px-4 py-4 text-sm text-[#2e7d32]">
          Reset link sent to <strong>{email}</strong>. Check your inbox and spam folder.
        </div>
        <p className="mt-6 text-sm text-slate-500">
          <Link className="font-medium text-[#b85c3d] transition hover:text-[#9f4c31]" to="/login">
            Back to sign in
          </Link>
        </p>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout title="Forgot password" subtitle="Enter your email and we'll send you a reset link.">
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
        {error && <p className="rounded-2xl border border-[#efc7ba] bg-[#fff4ef] px-4 py-3 text-sm text-[#a44b2f]">{error}</p>}
        <button
          className="w-full rounded-2xl bg-slate-900 px-4 py-3.5 font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
          disabled={loading}
        >
          {loading ? 'Sending...' : 'Send reset link'}
        </button>
      </form>
      <p className="mt-6 text-sm text-slate-500">
        Remember your password?{' '}
        <Link className="font-medium text-[#b85c3d] transition hover:text-[#9f4c31]" to="/login">
          Sign in
        </Link>
      </p>
    </AuthLayout>
  )
}
