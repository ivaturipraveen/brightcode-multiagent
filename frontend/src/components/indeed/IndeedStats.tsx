/** ALEX 🎨 — Stats bar below hero */
interface Props {
  stats: { total_jobs: number; total_applications: number; total_companies: number }
}

export function IndeedStats({ stats }: Props) {
  return (
    <div className="max-w-4xl mx-auto px-4 mt-6 grid grid-cols-3 gap-4">
      {[
        { label: 'Active Jobs', value: stats.total_jobs, icon: '💼' },
        { label: 'Companies Hiring', value: stats.total_companies, icon: '🏢' },
        { label: 'Applications Sent', value: stats.total_applications, icon: '📨' },
      ].map(s => (
        <div
          key={s.label}
          className="rounded-xl py-3 text-center"
          style={{ background: 'rgba(255,255,255,0.08)' }}
        >
          <div className="text-2xl mb-1">{s.icon}</div>
          <div className="text-white text-2xl font-bold">{s.value.toLocaleString()}</div>
          <div style={{ color: '#94A3B8' }} className="text-xs mt-0.5">{s.label}</div>
        </div>
      ))}
    </div>
  )
}
