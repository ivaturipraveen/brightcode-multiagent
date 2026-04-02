import { useEffect, useState } from 'react'
import { HRLayout } from './HRLayout'
import { hrGet, hrPatch, getHRToken } from '../../lib/hrApi'

export function HREmployeesPage() {
  const token = getHRToken()
  const [employees, setEmployees] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    hrGet<any[]>('/hr/admin/employees', token).then(setEmployees).catch(e => setError(e.message)).finally(() => setLoading(false))
  }, [])

  async function toggleStatus(id: number, current: string) {
    const next = current === 'active' ? 'inactive' : 'active'
    await hrPatch(`/hr/admin/employees/${id}/status`, { status: next }, token)
    setEmployees(prev => prev.map(e => e.id === id ? { ...e, status: next } : e))
  }

  const filtered = employees.filter(e =>
    e.name.toLowerCase().includes(search.toLowerCase()) ||
    e.email.toLowerCase().includes(search.toLowerCase()) ||
    (e.department || '').toLowerCase().includes(search.toLowerCase())
  )

  return (
    <HRLayout>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Employees</h1>
          <p className="text-sm text-slate-500 mt-1">{employees.length} employee{employees.length !== 1 ? 's' : ''} total</p>
        </div>
        <div className="relative max-w-xs w-full">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input className="w-full rounded-lg border border-slate-200 bg-white pl-9 pr-4 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" placeholder="Search employees..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>

      {error && <p className="mb-4 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">{error}</p>}

      {loading ? (
        <div className="text-center py-20 text-sm text-slate-400">Loading employees...</div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead className="border-b border-slate-100 bg-slate-50">
              <tr>
                {['Employee', 'Department', 'Designation', 'Role', 'Salary', 'Status', 'Actions'].map(h => (
                  <th key={h} className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.length === 0 ? (
                <tr><td colSpan={7} className="px-5 py-12 text-center text-sm text-slate-400">No employees found.</td></tr>
              ) : filtered.map(emp => (
                <tr key={emp.id} className="hover:bg-slate-50 transition">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-700">
                        {emp.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900">{emp.name}</p>
                        <p className="text-xs text-slate-400">{emp.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-slate-500">{emp.department || '—'}</td>
                  <td className="px-5 py-4 text-slate-500">{emp.designation || '—'}</td>
                  <td className="px-5 py-4">
                    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${emp.role === 'company_admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                      {emp.role === 'company_admin' ? 'Admin' : 'Employee'}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-slate-500">{emp.salary ? `$${emp.salary.toLocaleString()}` : '—'}</td>
                  <td className="px-5 py-4">
                    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${emp.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {emp.status}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <button onClick={() => toggleStatus(emp.id, emp.status)} className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${emp.status === 'active' ? 'bg-amber-50 text-amber-700 hover:bg-amber-100' : 'bg-green-50 text-green-700 hover:bg-green-100'}`}>
                      {emp.status === 'active' ? 'Deactivate' : 'Activate'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="px-5 py-3 text-xs text-slate-400 border-t border-slate-100">{filtered.length} of {employees.length} employees shown</p>
        </div>
      )}
    </HRLayout>
  )
}
