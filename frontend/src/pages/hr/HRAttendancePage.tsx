import { useEffect, useState } from 'react'
import { HRLayout } from './HRLayout'
import { hrGet, hrPost, getHRToken } from '../../lib/hrApi'

export function HRAttendancePage() {
  const token = getHRToken()
  const [records, setRecords] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    hrGet<any[]>('/hr/attendance', token).then(setRecords).catch(e => setError(e.message)).finally(() => setLoading(false))
  }, [])

  async function clockIn() {
    setActionLoading(true); setError(''); setMessage('')
    try {
      const res = await hrPost<any>('/hr/attendance/clockin', {}, token)
      setMessage(`Clocked in at ${new Date(res.time).toLocaleTimeString()}`)
      const updated = await hrGet<any[]>('/hr/attendance', token)
      setRecords(updated)
    } catch (e: any) { setError(e.message) }
    finally { setActionLoading(false) }
  }

  async function clockOut() {
    setActionLoading(true); setError(''); setMessage('')
    try {
      const res = await hrPost<any>('/hr/attendance/clockout', {}, token)
      setMessage(`Clocked out. Total hours: ${res.total_hours}h`)
      const updated = await hrGet<any[]>('/hr/attendance', token)
      setRecords(updated)
    } catch (e: any) { setError(e.message) }
    finally { setActionLoading(false) }
  }

  const today = records.find(r => r.date === new Date().toISOString().split('T')[0])

  return (
    <HRLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Attendance</h1>
        <p className="text-sm text-slate-500 mt-1">Track your daily clock-in and clock-out</p>
      </div>

      {/* Today's Status */}
      <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-4">Today — {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-3">
            <div className={`h-10 w-10 rounded-xl flex items-center justify-center text-lg ${today?.clock_in ? 'bg-green-100' : 'bg-slate-100'}`}>⏰</div>
            <div>
              <p className="text-xs text-slate-400">Clock In</p>
              <p className="text-sm font-semibold text-slate-900">{today?.clock_in ? new Date(today.clock_in).toLocaleTimeString() : '—'}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className={`h-10 w-10 rounded-xl flex items-center justify-center text-lg ${today?.clock_out ? 'bg-blue-100' : 'bg-slate-100'}`}>🏁</div>
            <div>
              <p className="text-xs text-slate-400">Clock Out</p>
              <p className="text-sm font-semibold text-slate-900">{today?.clock_out ? new Date(today.clock_out).toLocaleTimeString() : '—'}</p>
            </div>
          </div>
          {today?.total_hours && (
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl flex items-center justify-center text-lg bg-indigo-100">⏱️</div>
              <div>
                <p className="text-xs text-slate-400">Total Hours</p>
                <p className="text-sm font-semibold text-slate-900">{today.total_hours}h</p>
              </div>
            </div>
          )}
        </div>
        {message && <p className="mt-4 rounded-lg bg-green-50 border border-green-200 px-4 py-2 text-sm text-green-700">{message}</p>}
        {error && <p className="mt-4 rounded-lg bg-red-50 border border-red-200 px-4 py-2 text-sm text-red-700">{error}</p>}
        <div className="mt-5 flex gap-3">
          <button onClick={clockIn} disabled={actionLoading || !!today?.clock_in} className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:opacity-50">
            Clock In
          </button>
          <button onClick={clockOut} disabled={actionLoading || !today?.clock_in || !!today?.clock_out} className="rounded-lg border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50">
            Clock Out
          </button>
        </div>
      </div>

      {/* History */}
      <h2 className="text-sm font-semibold uppercase tracking-widest text-slate-400 mb-3">Recent Attendance</h2>
      {loading ? <div className="text-center py-10 text-sm text-slate-400">Loading...</div> : (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead className="border-b border-slate-100 bg-slate-50">
              <tr>
                {['Date', 'Clock In', 'Clock Out', 'Hours', 'Status'].map(h => (
                  <th key={h} className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {records.length === 0 ? (
                <tr><td colSpan={5} className="px-5 py-10 text-center text-sm text-slate-400">No attendance records yet.</td></tr>
              ) : records.map(r => (
                <tr key={r.id} className="hover:bg-slate-50">
                  <td className="px-5 py-3.5 font-medium text-slate-900">{r.date}</td>
                  <td className="px-5 py-3.5 text-slate-500">{r.clock_in ? new Date(r.clock_in).toLocaleTimeString() : '—'}</td>
                  <td className="px-5 py-3.5 text-slate-500">{r.clock_out ? new Date(r.clock_out).toLocaleTimeString() : '—'}</td>
                  <td className="px-5 py-3.5 text-slate-500">{r.total_hours ? `${r.total_hours}h` : '—'}</td>
                  <td className="px-5 py-3.5">
                    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${r.status === 'present' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{r.status}</span>
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
