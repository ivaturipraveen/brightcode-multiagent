import { useEffect, useState } from 'react'
import { HRLayout } from './HRLayout'
import { hrGet, hrPost, getHRToken, getHRRole } from '../../lib/hrApi'

export function HRPayslipsPage() {
  const token = getHRToken()
  const role = getHRRole()
  const [payslips, setPayslips] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showGenerate, setShowGenerate] = useState(false)
  const [empId, setEmpId] = useState('')
  const [month, setMonth] = useState('')
  const [genLoading, setGenLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    hrGet<any[]>('/hr/payslips', token).then(setPayslips).catch(e => setError(e.message)).finally(() => setLoading(false))
  }, [])

  async function generatePayslip(e: React.FormEvent) {
    e.preventDefault()
    setGenLoading(true); setError(''); setSuccess('')
    try {
      const res = await hrPost<any>(`/hr/payslips/generate?month=${month}&employee_id=${empId}`, {}, token)
      setSuccess(`Payslip generated. Net pay: $${res.net_pay}`)
      setShowGenerate(false)
    } catch (e: any) { setError(e.message) }
    finally { setGenLoading(false) }
  }

  return (
    <HRLayout>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Payslips</h1>
          <p className="text-sm text-slate-500 mt-1">Your salary history</p>
        </div>
        {role !== 'employee' && (
          <button onClick={() => setShowGenerate(!showGenerate)} className="rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700">
            + Generate Payslip
          </button>
        )}
      </div>

      {error && <p className="mb-4 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">{error}</p>}
      {success && <p className="mb-4 rounded-lg bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-700">{success}</p>}

      {showGenerate && (
        <div className="mb-6 rounded-2xl border border-indigo-200 bg-indigo-50 p-6">
          <h2 className="text-sm font-semibold text-indigo-800 mb-4">Generate Payslip</h2>
          <form onSubmit={generatePayslip} className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5">Employee ID</label>
              <input className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-indigo-500" type="number" value={empId} onChange={e => setEmpId(e.target.value)} placeholder="e.g. 3" required />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5">Month</label>
              <input className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-indigo-500" type="month" value={month} onChange={e => setMonth(e.target.value)} required />
            </div>
            <div className="flex items-end gap-2">
              <button type="submit" disabled={genLoading} className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-60">
                {genLoading ? 'Generating...' : 'Generate'}
              </button>
              <button type="button" onClick={() => setShowGenerate(false)} className="rounded-lg border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50">Cancel</button>
            </div>
          </form>
        </div>
      )}

      {loading ? <div className="text-center py-20 text-sm text-slate-400">Loading payslips...</div> : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {payslips.length === 0 ? (
            <div className="sm:col-span-3 text-center py-20 text-sm text-slate-400">No payslips yet.</div>
          ) : payslips.map(s => (
            <div key={s.id} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-semibold text-slate-900">{s.month}</span>
                <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">Paid</span>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-slate-500">Basic</span><span className="font-medium">${s.basic.toLocaleString()}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Allowances</span><span className="font-medium text-green-600">+${s.allowances.toLocaleString()}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Deductions</span><span className="font-medium text-red-500">-${s.deductions.toLocaleString()}</span></div>
                <div className="border-t border-slate-100 pt-2 flex justify-between"><span className="font-semibold text-slate-900">Net Pay</span><span className="font-bold text-indigo-600">${s.net_pay.toLocaleString()}</span></div>
              </div>
              <p className="mt-3 text-xs text-slate-400">Generated {new Date(s.generated_at).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      )}
    </HRLayout>
  )
}
