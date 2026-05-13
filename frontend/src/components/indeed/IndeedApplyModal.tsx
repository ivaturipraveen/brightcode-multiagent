/** ALEX 🎨 — Apply for job modal */
import { useState } from 'react'
import type { Job } from '../../pages/IndeedPage'

interface Props {
  job: Job
  apiBase: string
  onClose: () => void
  onSuccess: () => void
}

interface Form {
  applicant_name: string
  applicant_email: string
  applicant_phone: string
  years_experience: string
  linkedin_url: string
  cover_letter: string
  resume_url: string
}

const EMPTY: Form = {
  applicant_name: '',
  applicant_email: '',
  applicant_phone: '',
  years_experience: '',
  linkedin_url: '',
  cover_letter: '',
  resume_url: '',
}

export function IndeedApplyModal({ job, apiBase, onClose, onSuccess }: Props) {
  const [form, setForm] = useState<Form>(EMPTY)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [applicationId, setApplicationId] = useState<number | null>(null)

  const set = (k: keyof Form, v: string) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      const res = await fetch(`${apiBase}/api/indeed/apply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          job_id: job.id,
          applicant_name: form.applicant_name,
          applicant_email: form.applicant_email,
          applicant_phone: form.applicant_phone || undefined,
          years_experience: form.years_experience ? parseInt(form.years_experience) : undefined,
          linkedin_url: form.linkedin_url || undefined,
          cover_letter: form.cover_letter || undefined,
          resume_url: form.resume_url || undefined,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.detail ?? 'Failed to submit application')
      setApplicationId(data.id)
      setSuccess(true)
      onSuccess()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(10,31,68,0.6)' }}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div style={{ background: '#0A1F44' }} className="rounded-t-2xl px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-white font-bold">Apply: {job.title}</h2>
            <p style={{ color: '#94A3B8' }} className="text-sm">{job.company} · {job.location}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {success ? (
          <div className="p-8 text-center">
            <div className="text-5xl mb-4">🎉</div>
            <h3 className="text-xl font-bold mb-2" style={{ color: '#0A1F44' }}>Application Submitted!</h3>
            <p className="text-gray-500 mb-4">
              Your application ID is <strong style={{ color: '#F5821F' }}>#{applicationId}</strong>
            </p>
            <p className="text-sm text-gray-400 mb-6">
              Track your application status using your email address.
            </p>
            <button
              onClick={onClose}
              style={{ background: '#0A1F44' }}
              className="px-6 py-2.5 text-white font-semibold rounded-xl hover:opacity-90 transition"
            >
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-2.5 rounded-lg">
                {error}
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <Field label="Full Name *" required value={form.applicant_name}
                onChange={v => set('applicant_name', v)} placeholder="Jane Doe" />
              <Field label="Email *" type="email" required value={form.applicant_email}
                onChange={v => set('applicant_email', v)} placeholder="jane@example.com" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Phone" value={form.applicant_phone}
                onChange={v => set('applicant_phone', v)} placeholder="+1 555 000 0000" />
              <Field label="Years of Experience" type="number" value={form.years_experience}
                onChange={v => set('years_experience', v)} placeholder="3" />
            </div>
            <Field label="LinkedIn URL" value={form.linkedin_url}
              onChange={v => set('linkedin_url', v)} placeholder="https://linkedin.com/in/..." />
            <Field label="Resume / Portfolio URL" value={form.resume_url}
              onChange={v => set('resume_url', v)} placeholder="https://drive.google.com/..." />

            {/* Cover letter */}
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: '#0A1F44' }}>
                Cover Letter
              </label>
              <textarea
                rows={4}
                value={form.cover_letter}
                onChange={e => set('cover_letter', e.target.value)}
                placeholder="Why are you a great fit for this role?"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-orange-400 resize-none"
                style={{ color: '#0A1F44' }}
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              style={{ background: '#F5821F' }}
              className="w-full py-3 text-white font-bold rounded-xl hover:opacity-90 transition disabled:opacity-60 text-sm"
            >
              {submitting ? 'Submitting…' : 'Submit Application →'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}

function Field({
  label, value, onChange, placeholder, type = 'text', required,
}: {
  label: string; value: string; onChange: (v: string) => void
  placeholder?: string; type?: string; required?: boolean
}) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1.5" style={{ color: '#0A1F44' }}>{label}</label>
      <input
        type={type}
        required={required}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-orange-400"
        style={{ color: '#0A1F44' }}
      />
    </div>
  )
}
