import { useEffect, useState } from 'react'
import { HRLayout } from './HRLayout'
import { hrGet, hrPatch, hrDelete, getHRToken } from '../../lib/hrApi'

export function HRCompaniesPage() {
  const token = getHRToken()
  const [companies, setCompanies] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    hrGet<any[]>('/hr/admin/companies', token).then(setCompanies).catch(e => setError(e.message)).finally(() => setLoading(false))
  }, [])

  async function toggleStatus(id: number, current: string) {
    const next = current === 'active' ? 'inactive' : 'active'
    await hrPatch(`/hr/admin/companies/${id}/status`, { status: next }, token)
    setCompanies(prev => prev.map(c => c.id === id ? { ...c, status: next } : c))
  }

  async function deleteCompany(id: number) {
    if (!confirm('Delete this company and all its employees?')) return
    await hrDelete(`/hr/admin/companies/${id}`, token)
    setCompanies(prev => prev.filter(c => c.id !== id))
  }

  return (
    <HRLayout>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Companies</h1>
          <p className="text-sm text-slate-500 mt-1">Manage all registered companies</p>
        </div>
      </div>

      {error && <p className="mb-4 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">{error}</p>}

      {loading ? (
        <div className="text-center py-20 text-sm text-slate-400">Loading companies...</div>
      ) : companies.length === 0 ? (
        <div className="text-center py-20 text-sm text-slate-400">No companies registered yet.</div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead className="border-b border-slate-100 bg-slate-50">
              <tr>
                {['Company', 'Email', 'Industry', 'Employees', 'Status', 'Actions'].map(h => (
                  <th key={h} className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {companies.map(c => (
                <tr key={c.id} className="hover:bg-slate-50 transition">
                  <td className="px-5 py-4 font-semibold text-slate-900">{c.name}</td>
                  <td className="px-5 py-4 text-slate-500">{c.email}</td>
                  <td className="px-5 py-4 text-slate-500">{c.industry || '—'}</td>
                  <td className="px-5 py-4 text-slate-500">{c.employee_count}</td>
                  <td className="px-5 py-4">
                    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${c.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {c.status}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <button onClick={() => toggleStatus(c.id, c.status)} className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${c.status === 'active' ? 'bg-amber-50 text-amber-700 hover:bg-amber-100' : 'bg-green-50 text-green-700 hover:bg-green-100'}`}>
                        {c.status === 'active' ? 'Deactivate' : 'Activate'}
                      </button>
                      <button onClick={() => deleteCompany(c.id)} className="rounded-lg bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-700 transition hover:bg-red-100">
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </HRLayout>
  )
}
