import { useEffect, useState } from 'react'
import { HRLayout } from './HRLayout'
import { hrGet, hrPost, hrPatch, hrDelete, getHRToken, getHRRole } from '../../lib/hrApi'

interface LeaveRecord {
  id: number
  leave_type: string
  from_date: string
  to_date: string
  days: number
  reason?: string
  status: string
  applied_at?: string
}

interface AdminLeaveRecord extends LeaveRecord {
  employee_id: number
  employee_name?: string
  reason?: string
}

interface Employee {
  id: number
  name: string
  email: string
  status: string
}

export function HRLeavePage() {
  const token = getHRToken()
  const role = getHRRole()
  const [leaves, setLeaves] = useState<LeaveRecord[]>([])
  const [allLeaves, setAllLeaves] = useState<AdminLeaveRecord[]>([])
  const [employees, setEmployees] = useState<Employee[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [showAdminForm, setShowAdminForm] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [actionLoading, setActionLoading] = useState<number | null>(null)

  // My leave form
  const [leaveType, setLeaveType] = useState('sick')
  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')
  const [reason, setReason] = useState('')

  // Admin: apply on behalf of employee
  const [adminEmpId, setAdminEmpId] = useState('')
  const [adminLeaveType, setAdminLeaveType] = useState('sick')
  const [adminFromDate, setAdminFromDate] = useState('')
  const [adminToDate, setAdminToDate] = useState('')
  const [adminReason, setAdminReason] = useState('')

  const isAdmin = role !== 'employee'

  async function loadMyLeaves() {
    const my = await hrGet<LeaveRecord[]>('/hr/leave', token)
    setLeaves(my)
  }

  async function loadAllLeaves(empList?: Employee[]) {
    const all = await hrGet<AdminLeaveRecord[]>('/hr/leave/all', token)
    const empMap: Record<number, string> = {}
    const list = empList ?? employees
    list.forEach(e => { empMap[e.id] = e.name })
    setAllLeaves(all.map(l => ({ ...l, employee_name: empMap[l.employee_id] ?? `Emp #${l.employee_id}` })))
  }

  useEffect(() => {
    const load = async () => {
      try {
        await loadMyLeaves()
        if (isAdmin) {
          const empList = await hrGet<Employee[]>('/hr/admin/employees', token)
          setEmployees(empList)
          await loadAllLeaves(empList)
        }
      } catch (e: any) { setError(e.message) }
      finally { setLoading(false) }
    }
    load()
  }, [])

  async function applyLeave(e: React.FormEvent) {
    e.preventDefault()
    setError(''); setSuccess('')
    try {
      await hrPost('/hr/leave', { leave_type: leaveType, from_date: fromDate, to_date: toDate, reason }, token)
      setSuccess('Leave application submitted!')
      setShowForm(false)
      setFromDate(''); setToDate(''); setReason('')
      await loadMyLeaves()
      if (isAdmin) await loadAllLeaves()
    } catch (e: any) { setError(e.message) }
  }

  async function applyLeaveOnBehalf(e: React.FormEvent) {
    e.preventDefault()
    setError(''); setSuccess('')
    try {
      await hrPost('/hr/admin/leave/apply', {
        employee_id: parseInt(adminEmpId),
        leave_type: adminLeaveType,
        from_date: adminFromDate,
        to_date: adminToDate,
        reason: adminReason,
      }, token)
      setSuccess('Leave applied for employee successfully!')
      setShowAdminForm(false)
      setAdminEmpId(''); setAdminFromDate(''); setAdminToDate(''); setAdminReason('')
      await loadAllLeaves()
    } catch (e: any) { setError(e.message) }
  }

  async function reviewLeave(id: number, action: 'approved' | 'rejected') {
    setError(''); setSuccess('')
    setActionLoading(id)
    try {
      await hrPatch(`/hr/leave/${id}/action`, { action }, token)
      setSuccess(`Leave ${action} successfully.`)
      await loadAllLeaves()
    } catch (e: any) {
      setError(e.message)
    } finally {
      setActionLoading(null)
    }
  }

  async function cancelLeave(id: number) {
    setError(''); setSuccess('')
    try {
      await hrDelete(`/hr/leave/${id}`, token)
      setSuccess('Leave request cancelled.')
      await loadMyLeaves()
      if (isAdmin) await loadAllLeaves()
    } catch (e: any) { setError(e.message) }
  }

  const statusColor: Record<string, string> = {
    pending: 'bg-amber-100 text-amber-700',
    approved: 'bg-green-100 text-green-700',
    rejected: 'bg-red-100 text-red-700',
  }

  const leaveTypeLabel: Record<string, string> = {
    sick: 'Sick', casual: 'Casual', earned: 'Earned', unpaid: 'Unpaid',
  }

  return (
    <HRLayout>
      <div className="mb-6 flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Leave Management</h1>
          <p className="text-sm text-slate-500 mt-1">Apply and track leave requests</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          {isAdmin && (
            <button
              onClick={() => { setShowAdminForm(!showAdminForm); setShowForm(false) }}
              className="rounded-lg border border-indigo-200 bg-white px-4 py-2.5 text-sm font-semibold text-indigo-700 transition hover:bg-indigo-50"
            >
              + Apply for Employee
            </button>
          )}
          <button
            onClick={() => { setShowForm(!showForm); setShowAdminForm(false) }}
            className="rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
          >
            + Apply Leave
          </button>
        </div>
      </div>

      {error && <p className="mb-4 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">{error}</p>}
      {success && <p className="mb-4 rounded-lg bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-700">{success}</p>}

      {/* My Leave Form */}
      {showForm && (
        <div className="mb-6 rounded-2xl border border-indigo-200 bg-indigo-50 p-6">
          <h2 className="text-sm font-semibold text-indigo-800 mb-4">New Leave Application</h2>
          <form onSubmit={applyLeave} className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5">Leave Type</label>
              <select className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-indigo-500" value={leaveType} onChange={e => setLeaveType(e.target.value)}>
                <option value="sick">Sick Leave</option>
                <option value="casual">Casual Leave</option>
                <option value="earned">Earned Leave</option>
                <option value="unpaid">Unpaid Leave</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5">Reason</label>
              <input className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-indigo-500" value={reason} onChange={e => setReason(e.target.value)} placeholder="Brief reason" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5">From Date</label>
              <input type="date" className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-indigo-500" value={fromDate} onChange={e => setFromDate(e.target.value)} required />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5">To Date</label>
              <input type="date" className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-indigo-500" value={toDate} onChange={e => setToDate(e.target.value)} required />
            </div>
            <div className="sm:col-span-2 flex gap-3">
              <button type="submit" className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700">Submit</button>
              <button type="button" onClick={() => setShowForm(false)} className="rounded-lg border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50">Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* Admin: Apply on Behalf Form */}
      {showAdminForm && isAdmin && (
        <div className="mb-6 rounded-2xl border border-purple-200 bg-purple-50 p-6">
          <h2 className="text-sm font-semibold text-purple-800 mb-4">Apply Leave on Behalf of Employee</h2>
          <form onSubmit={applyLeaveOnBehalf} className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5">Employee</label>
              <select className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-purple-500" value={adminEmpId} onChange={e => setAdminEmpId(e.target.value)} required>
                <option value="">Select employee...</option>
                {employees.filter(e => e.status === 'active').map(e => (
                  <option key={e.id} value={e.id}>{e.name} ({e.email})</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5">Leave Type</label>
              <select className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-purple-500" value={adminLeaveType} onChange={e => setAdminLeaveType(e.target.value)}>
                <option value="sick">Sick Leave</option>
                <option value="casual">Casual Leave</option>
                <option value="earned">Earned Leave</option>
                <option value="unpaid">Unpaid Leave</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5">From Date</label>
              <input type="date" className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-purple-500" value={adminFromDate} onChange={e => setAdminFromDate(e.target.value)} required />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5">To Date</label>
              <input type="date" className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-purple-500" value={adminToDate} onChange={e => setAdminToDate(e.target.value)} required />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-slate-700 mb-1.5">Reason</label>
              <input className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-purple-500" value={adminReason} onChange={e => setAdminReason(e.target.value)} placeholder="Brief reason" />
            </div>
            <div className="sm:col-span-2 flex gap-3">
              <button type="submit" className="rounded-lg bg-purple-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-purple-700">Apply</button>
              <button type="button" onClick={() => setShowAdminForm(false)} className="rounded-lg border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50">Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* My Leaves */}
      <h2 className="text-sm font-semibold uppercase tracking-widest text-slate-400 mb-3">My Leave Requests</h2>
      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm mb-8">
        <table className="w-full text-sm">
          <thead className="border-b border-slate-100 bg-slate-50">
            <tr>{['Type', 'From', 'To', 'Days', 'Reason', 'Status', 'Action'].map(h => (
              <th key={h} className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">{h}</th>
            ))}</tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {loading ? (
              <tr><td colSpan={7} className="px-5 py-10 text-center text-sm text-slate-400">Loading...</td></tr>
            ) : leaves.length === 0 ? (
              <tr><td colSpan={7} className="px-5 py-10 text-center text-sm text-slate-400">No leave requests yet.</td></tr>
            ) : leaves.map(l => (
              <tr key={l.id} className="hover:bg-slate-50">
                <td className="px-5 py-3.5 font-medium text-slate-900">{leaveTypeLabel[l.leave_type] ?? l.leave_type}</td>
                <td className="px-5 py-3.5 text-slate-500">{l.from_date}</td>
                <td className="px-5 py-3.5 text-slate-500">{l.to_date}</td>
                <td className="px-5 py-3.5 text-slate-500">{l.days}</td>
                <td className="px-5 py-3.5 text-slate-500">{l.reason || '—'}</td>
                <td className="px-5 py-3.5">
                  <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${statusColor[l.status]}`}>{l.status}</span>
                </td>
                <td className="px-5 py-3.5">
                  {l.status === 'pending' && (
                    <button
                      onClick={() => cancelLeave(l.id)}
                      className="rounded-lg bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-red-50 hover:text-red-600 border border-slate-200"
                    >
                      Cancel
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Admin: All Leaves */}
      {isAdmin && (
        <>
          <h2 className="text-sm font-semibold uppercase tracking-widest text-slate-400 mb-3">All Leave Requests</h2>
          <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
            <table className="w-full text-sm">
              <thead className="border-b border-slate-100 bg-slate-50">
                <tr>{['Employee', 'Type', 'From', 'To', 'Days', 'Reason', 'Status', 'Actions'].map(h => (
                  <th key={h} className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">{h}</th>
                ))}</tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {allLeaves.length === 0 ? (
                  <tr><td colSpan={8} className="px-5 py-10 text-center text-sm text-slate-400">No leave records.</td></tr>
                ) : allLeaves.map(l => (
                  <tr key={l.id} className="hover:bg-slate-50">
                    <td className="px-5 py-3.5 font-medium text-slate-900">{l.employee_name}</td>
                    <td className="px-5 py-3.5 text-slate-600">{leaveTypeLabel[l.leave_type] ?? l.leave_type}</td>
                    <td className="px-5 py-3.5 text-slate-500">{l.from_date}</td>
                    <td className="px-5 py-3.5 text-slate-500">{l.to_date}</td>
                    <td className="px-5 py-3.5 text-slate-500">{l.days}</td>
                    <td className="px-5 py-3.5 text-slate-500 max-w-[150px] truncate">{l.reason || '—'}</td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${statusColor[l.status]}`}>{l.status}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      {l.status === 'pending' && (
                        <div className="flex gap-2">
                          <button
                            disabled={actionLoading === l.id}
                            onClick={() => reviewLeave(l.id, 'approved')}
                            className="rounded-lg bg-green-50 px-3 py-1.5 text-xs font-semibold text-green-700 hover:bg-green-100 disabled:opacity-50"
                          >
                            {actionLoading === l.id ? '…' : 'Approve'}
                          </button>
                          <button
                            disabled={actionLoading === l.id}
                            onClick={() => reviewLeave(l.id, 'rejected')}
                            className="rounded-lg bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-100 disabled:opacity-50"
                          >
                            {actionLoading === l.id ? '…' : 'Reject'}
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </HRLayout>
  )
}
