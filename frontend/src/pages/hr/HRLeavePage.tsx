import { useEffect, useState } from 'react'
import { HRLayout } from './HRLayout'
import { hrGet, hrPost, hrPatch, getHRToken, getHRRole } from '../../lib/hrApi'

export function HRLeavePage() {
  const token = getHRToken()
  const role = getHRRole()
  const [leaves, setLeaves] = useState<any[]>([])
  const [allLeaves, setAllLeaves] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [leaveType, setLeaveType] = useState('sick')
  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')
  const [reason, setReason] = useState('')

  useEffect(() => {
    const load = async () => {
      try {
        const my = await hrGet<any[]>('/hr/leave', token)
        setLeaves(my)
        if (role !== 'employee') {
          const all = await hrGet<any[]>('/hr/leave/all', token)
          setAllLeaves(all)
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
      const updated = await hrGet<any[]>('/hr/leave', token)
      setLeaves(updated)
    } catch (e: any) { setError(e.message) }
  }

  async function reviewLeave(id: number, action: string) {
    await hrPatch(`/hr/leave/${id}/action`, { action }, token)
    const all = await hrGet<any[]>('/hr/leave/all', token)
    setAllLeaves(all)
  }

  const statusColor: Record<string, string> = {
    pending: 'bg-amber-100 text-amber-700',
    approved: 'bg-green-100 text-green-700',
    rejected: 'bg-red-100 text-red-700',
  }

  return (
    <HRLayout>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Leave Management</h1>
          <p className="text-sm text-slate-500 mt-1">Apply and track your leave requests</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700">
          + Apply Leave
        </button>
      </div>

      {error && <p className="mb-4 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">{error}</p>}
      {success && <p className="mb-4 rounded-lg bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-700">{success}</p>}

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

      {/* My Leaves */}
      <h2 className="text-sm font-semibold uppercase tracking-widest text-slate-400 mb-3">My Leave Requests</h2>
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm mb-8">
        <table className="w-full text-sm">
          <thead className="border-b border-slate-100 bg-slate-50">
            <tr>{['Type', 'From', 'To', 'Days', 'Reason', 'Status'].map(h => <th key={h} className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">{h}</th>)}</tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {leaves.length === 0 ? <tr><td colSpan={6} className="px-5 py-10 text-center text-sm text-slate-400">No leave requests.</td></tr> : leaves.map(l => (
              <tr key={l.id} className="hover:bg-slate-50">
                <td className="px-5 py-3.5 font-medium text-slate-900 capitalize">{l.leave_type}</td>
                <td className="px-5 py-3.5 text-slate-500">{l.from_date}</td>
                <td className="px-5 py-3.5 text-slate-500">{l.to_date}</td>
                <td className="px-5 py-3.5 text-slate-500">{l.days}</td>
                <td className="px-5 py-3.5 text-slate-500">{l.reason || '—'}</td>
                <td className="px-5 py-3.5"><span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${statusColor[l.status]}`}>{l.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Admin: All Leaves */}
      {role !== 'employee' && (
        <>
          <h2 className="text-sm font-semibold uppercase tracking-widest text-slate-400 mb-3">All Leave Requests</h2>
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <table className="w-full text-sm">
              <thead className="border-b border-slate-100 bg-slate-50">
                <tr>{['Emp ID', 'Type', 'From', 'To', 'Days', 'Status', 'Actions'].map(h => <th key={h} className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">{h}</th>)}</tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {allLeaves.length === 0 ? <tr><td colSpan={7} className="px-5 py-10 text-center text-sm text-slate-400">No leaves.</td></tr> : allLeaves.map(l => (
                  <tr key={l.id} className="hover:bg-slate-50">
                    <td className="px-5 py-3.5 text-slate-500">#{l.employee_id}</td>
                    <td className="px-5 py-3.5 font-medium text-slate-900 capitalize">{l.leave_type}</td>
                    <td className="px-5 py-3.5 text-slate-500">{l.from_date}</td>
                    <td className="px-5 py-3.5 text-slate-500">{l.to_date}</td>
                    <td className="px-5 py-3.5 text-slate-500">{l.days}</td>
                    <td className="px-5 py-3.5"><span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${statusColor[l.status]}`}>{l.status}</span></td>
                    <td className="px-5 py-3.5">
                      {l.status === 'pending' && (
                        <div className="flex gap-2">
                          <button onClick={() => reviewLeave(l.id, 'approved')} className="rounded-lg bg-green-50 px-3 py-1.5 text-xs font-semibold text-green-700 hover:bg-green-100">Approve</button>
                          <button onClick={() => reviewLeave(l.id, 'rejected')} className="rounded-lg bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-100">Reject</button>
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
