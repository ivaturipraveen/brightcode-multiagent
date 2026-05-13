/** ALEX 🎨 — Right panel job details */
import type { Job } from '../../pages/IndeedPage'

interface Props {
  job: Job
  onApply: () => void
  onClose: () => void
}

function salaryLabel(min?: number, max?: number) {
  if (!min && !max) return null
  const fmt = (n: number) => `$${n.toLocaleString()}`
  if (min && max) return `${fmt(min)} – ${fmt(max)} per year`
  if (min) return `From ${fmt(min)} per year`
  return `Up to ${fmt(max!)} per year`
}

export function IndeedJobDetail({ job, onApply, onClose }: Props) {
  const salary = salaryLabel(job.salary_min, job.salary_max)

  return (
    <div
      className="bg-white rounded-xl shadow-lg sticky top-4 max-h-[calc(100vh-6rem)] overflow-y-auto"
      style={{ border: '1px solid #E2E8F0' }}
    >
      {/* Header */}
      <div style={{ background: '#0A1F44' }} className="rounded-t-xl p-5">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-lg flex items-center justify-center text-white text-xl font-bold shrink-0"
              style={{ background: 'rgba(255,255,255,0.15)' }}
            >
              {job.company.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="text-white font-bold text-lg leading-tight">{job.title}</h2>
              <p style={{ color: '#94A3B8' }} className="text-sm">{job.company}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition p-1"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Quick meta */}
        <div className="mt-4 flex flex-wrap gap-3 text-sm">
          <span style={{ color: '#CBD5E1' }} className="flex items-center gap-1">
            📍 {job.location}
          </span>
          <span style={{ color: '#CBD5E1' }} className="flex items-center gap-1">
            💼 {job.job_type}
          </span>
          {job.category && (
            <span style={{ color: '#CBD5E1' }} className="flex items-center gap-1">
              🏷 {job.category}
            </span>
          )}
        </div>

        {salary && (
          <div
            className="mt-3 inline-block px-3 py-1 rounded-lg text-sm font-semibold"
            style={{ background: 'rgba(245,130,31,0.2)', color: '#F5821F' }}
          >
            💰 {salary}
          </div>
        )}

        {/* CTA */}
        <button
          onClick={onApply}
          style={{ background: '#F5821F' }}
          className="mt-4 w-full py-3 text-white font-bold rounded-xl hover:opacity-90 transition text-sm"
        >
          Apply for This Position →
        </button>
      </div>

      {/* Body */}
      <div className="p-5 space-y-5">
        <Section title="About the Role" content={job.description} />
        {job.requirements && <Section title="Requirements" content={job.requirements} />}
        {job.benefits && <Section title="Benefits" content={job.benefits} />}

        <div
          className="rounded-lg p-3 text-sm text-center"
          style={{ background: '#F4F6FA', color: '#6B7280' }}
        >
          {job.application_count} people have already applied
        </div>
      </div>
    </div>
  )
}

function Section({ title, content }: { title: string; content: string }) {
  return (
    <div>
      <h3 className="font-semibold text-sm mb-2" style={{ color: '#0A1F44' }}>{title}</h3>
      <div className="text-sm text-gray-600 whitespace-pre-line leading-relaxed">{content}</div>
    </div>
  )
}
