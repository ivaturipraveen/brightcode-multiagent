import { useEffect, useState } from 'react'
import { HRLayout } from './HRLayout'
import { hrGet, getHRToken, getHRRole } from '../../lib/hrApi'

export function HRReportsPage() {
  const token = getHRToken()
  const role = getHRRole()
  const [summary, setSummary] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    hrGet<any>('/hr/reports/summary', token).then(setSummary).catch(e => setError(e.message)).finally(() => setLoading(false))
  }, [])

  return (
    <HRLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Reports & Analytics</h1>
        <p className="text-sm text-slate-500 mt-1">Overview of your HR data</p>
      </div>

      {error && <p className="mb-4 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">{error}</p>}

      {loading ? <div className="text-center py-20 text-sm text-slate-400">Loading...</div> : summary && (
        <>
          <div className="grid gap-4 sm:grid-cols-3 mb-8">
            {role === 'super_admin' && (
              <StatCard label="Total Companies" value={summary.total_companies} icon="🏢" color="bg-purple-50 text-purple-700" />
            )}
            <StatCard label="Total Employees" value={summary.total_employees} icon="👥" color="bg-blue-50 text-blue-700" />
            <StatCard label="Pending Leave Requests" value={summary.pending_leaves} icon="📋" color="bg-amber-50 text-amber-700" />
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
            <h2 className="text-base font-semibold text-slate-900 mb-4">Summary</h2>
            <div className="space-y-4">
              {role === 'super_admin' && (
                <Row label="Total registered companies" value={summary.total_companies} />
              )}
              <Row label="Total employees" value={summary.total_employees} />
              <Row label="Pending leave approvals" value={summary.pending_leaves} highlight={summary.pending_leaves > 0} />
            </div>
            <div className="mt-6 rounded-xl bg-slate-50 border border-slate-200 px-5 py-4 text-sm text-slate-500">
              📊 More detailed reports (attendance export, payroll summary, leave balance) coming soon.
            </div>
          </div>
        </>
      )}
    </HRLayout>
  )
}

function StatCard({ label, value, icon, color }: { label: string; value: number; icon: string; color: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className={`inline-flex h-10 w-10 items-center justify-center rounded-xl text-xl mb-3 ${color}`}>{icon}</div>
      <p className="text-2xl font-bold text-slate-900">{value}</p>
      <p className="mt-1 text-sm text-slate-500">{label}</p>
    </div>
  )
}

function Row({ label, value, highlight }: { label: string; value: number; highlight?: boolean }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
      <span className="text-sm text-slate-600">{label}</span>
      <span className={`text-sm font-semibold ${highlight ? 'text-amber-600' : 'text-slate-900'}`}>{value}</span>
    </div>
  )
}
