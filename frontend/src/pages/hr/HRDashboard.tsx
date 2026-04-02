import { useEffect, useState } from 'react'
import { HRLayout } from './HRLayout'
import { hrGet, getHRToken, getHRRole, getHRName } from '../../lib/hrApi'

export function HRDashboard() {
  const token = getHRToken()
  const role = getHRRole()
  const name = getHRName()
  const [summary, setSummary] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (role !== 'employee') {
      hrGet<any>('/hr/reports/summary', token).then(setSummary).catch(() => {}).finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  const roleBadge: Record<string, { label: string; color: string }> = {
    super_admin: { label: 'Super Admin', color: 'bg-purple-100 text-purple-700' },
    company_admin: { label: 'Company Admin', color: 'bg-blue-100 text-blue-700' },
    employee: { label: 'Employee', color: 'bg-green-100 text-green-700' },
  }
  const badge = roleBadge[role] ?? { label: role, color: 'bg-slate-100 text-slate-600' }

  return (
    <HRLayout>
      <div className="mb-6">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-slate-900">Welcome back, {name} 👋</h1>
          <span className={`rounded-full px-3 py-1 text-xs font-semibold ${badge.color}`}>{badge.label}</span>
        </div>
        <p className="mt-1 text-sm text-slate-500">Here's what's happening in your HR workspace today.</p>
      </div>

      {!loading && summary && (
        <div className="grid gap-4 sm:grid-cols-3 mb-8">
          {role === 'super_admin' && (
            <StatCard icon="🏢" label="Total Companies" value={summary.total_companies} color="bg-purple-50 text-purple-600" />
          )}
          <StatCard icon="👥" label="Total Employees" value={summary.total_employees} color="bg-blue-50 text-blue-600" />
          <StatCard icon="📋" label="Pending Leaves" value={summary.pending_leaves} color="bg-amber-50 text-amber-600" />
        </div>
      )}

      {/* Quick Actions */}
      <div className="mb-4">
        <h2 className="text-sm font-semibold uppercase tracking-widest text-slate-400">Quick Actions</h2>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {role !== 'super_admin' && (
          <QuickCard title="Clock In / Out" desc="Mark your attendance for today" href="/hr/attendance" icon="⏱️" />
        )}
        <QuickCard title="Apply Leave" desc="Submit a leave request" href="/hr/leave" icon="📅" />
        <QuickCard title="View Payslips" desc="Check your salary history" href="/hr/payslips" icon="💰" />
        {(role === 'company_admin' || role === 'super_admin') && (
          <QuickCard title="Manage Employees" desc="View and update employee records" href="/hr/employees" icon="👤" />
        )}
        {role === 'super_admin' && (
          <QuickCard title="Manage Companies" desc="Activate or deactivate companies" href="/hr/companies" icon="🏢" />
        )}
        {(role === 'company_admin' || role === 'super_admin') && (
          <QuickCard title="Reports" desc="View attendance and leave reports" href="/hr/reports" icon="📊" />
        )}
      </div>
    </HRLayout>
  )
}

function StatCard({ icon, label, value, color }: { icon: string; label: string; value: number; color: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className={`inline-flex h-10 w-10 items-center justify-center rounded-xl text-xl ${color}`}>{icon}</div>
      <p className="mt-3 text-2xl font-bold text-slate-900">{value}</p>
      <p className="mt-1 text-sm text-slate-500">{label}</p>
    </div>
  )
}

function QuickCard({ title, desc, href, icon }: { title: string; desc: string; href: string; icon: string }) {
  return (
    <a href={href} className="block rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-indigo-200 hover:shadow-md">
      <div className="text-2xl mb-3">{icon}</div>
      <p className="text-sm font-semibold text-slate-900">{title}</p>
      <p className="mt-1 text-xs text-slate-500">{desc}</p>
    </a>
  )
}
