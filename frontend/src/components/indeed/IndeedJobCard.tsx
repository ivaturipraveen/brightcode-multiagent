/** ALEX 🎨 — Job list card */
import type { Job } from '../../pages/IndeedPage'

interface Props {
  job: Job
  isSelected: boolean
  onClick: () => void
  onApply: () => void
}

const STATUS_COLORS: Record<string, string> = {
  'Full-Time': '#10B981',
  'Part-Time': '#3B82F6',
  'Contract': '#8B5CF6',
  'Remote': '#F5821F',
  'Internship': '#F59E0B',
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const days = Math.floor(diff / 86400000)
  if (days === 0) return 'Today'
  if (days === 1) return 'Yesterday'
  if (days < 7) return `${days}d ago`
  if (days < 30) return `${Math.floor(days / 7)}w ago`
  return `${Math.floor(days / 30)}mo ago`
}

function salaryLabel(min?: number, max?: number) {
  if (!min && !max) return null
  const fmt = (n: number) => `$${(n / 1000).toFixed(0)}k`
  if (min && max) return `${fmt(min)} – ${fmt(max)}/yr`
  if (min) return `From ${fmt(min)}/yr`
  return `Up to ${fmt(max!)}/yr`
}

export function IndeedJobCard({ job, isSelected, onClick, onApply }: Props) {
  const salary = salaryLabel(job.salary_min, job.salary_max)
  const typeColor = STATUS_COLORS[job.job_type] ?? '#6B7280'

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-xl p-5 cursor-pointer transition-all duration-200 hover:shadow-md"
      style={{
        border: isSelected ? '2px solid #F5821F' : '2px solid transparent',
        boxShadow: isSelected ? '0 0 0 3px rgba(245,130,31,0.15)' : undefined,
      }}
    >
      <div className="flex items-start gap-4">
        {/* Logo / Avatar */}
        <div
          className="w-12 h-12 rounded-lg flex items-center justify-center text-white text-lg font-bold shrink-0"
          style={{ background: '#0A1F44' }}
        >
          {job.logo_url ? (
            <img src={job.logo_url} alt={job.company} className="w-full h-full object-cover rounded-lg" />
          ) : (
            job.company.charAt(0).toUpperCase()
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3
                className="font-semibold text-base leading-tight"
                style={{ color: '#0A1F44' }}
              >
                {job.title}
              </h3>
              <p className="text-sm text-gray-500 mt-0.5">{job.company}</p>
            </div>
            <span className="text-xs text-gray-400 shrink-0 mt-0.5">{timeAgo(job.created_at)}</span>
          </div>

          <div className="flex flex-wrap items-center gap-2 mt-2">
            {/* Location */}
            <span className="flex items-center gap-1 text-xs text-gray-500">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a2 2 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              </svg>
              {job.location}
            </span>

            {/* Job type badge */}
            <span
              className="text-xs font-medium px-2 py-0.5 rounded-full"
              style={{ background: `${typeColor}18`, color: typeColor }}
            >
              {job.job_type}
            </span>

            {/* Salary */}
            {salary && (
              <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                {salary}
              </span>
            )}

            {/* Category */}
            {job.category && (
              <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                {job.category}
              </span>
            )}
          </div>

          {/* Description preview */}
          <p className="text-xs text-gray-400 mt-2 line-clamp-2">{job.description}</p>

          <div className="flex items-center justify-between mt-3">
            <span className="text-xs text-gray-400">
              {job.application_count} applicant{job.application_count !== 1 ? 's' : ''}
            </span>
            <button
              onClick={e => { e.stopPropagation(); onApply() }}
              style={{ background: '#F5821F' }}
              className="px-4 py-1.5 text-white text-xs font-semibold rounded-lg hover:opacity-90 transition"
            >
              Apply Now
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
