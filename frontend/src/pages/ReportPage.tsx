import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { getOutreachReport, OutreachReport } from '../lib/api'

export function ReportPage() {
  const token = localStorage.getItem('token') ?? ''
  const [report, setReport] = useState<OutreachReport | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    getOutreachReport(token)
      .then(setReport)
      .catch(() => setError('Failed to load report.'))
      .finally(() => setLoading(false))
  }, [token])

  const successRate = report && (report.total_sent + report.total_failed) > 0
    ? Math.round((report.total_sent / (report.total_sent + report.total_failed)) * 100)
    : 0

  return (
    <div className="min-h-screen bg-[#fbfbfd] text-slate-900">
      {/* Nav */}
      <header className="sticky top-0 z-20 border-b border-black/5 bg-[#fbfbfd]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
          <Link to="/" className="text-lg font-semibold tracking-tight">Brightcone</Link>
          <nav className="hidden items-center gap-8 text-sm text-slate-600 md:flex">
            <Link to="/#features" className="transition hover:text-slate-900">Features</Link>
            <Link to="/#enterprise" className="transition hover:text-slate-900">Enterprise</Link>
            <Link to="/pricing" className="transition hover:text-slate-900">Pricing</Link>
            <Link to="/about" className="transition hover:text-slate-900">About</Link>
            <Link to="/crm" className="transition hover:text-slate-900">CRM</Link>
            <Link to="/tickets" className="transition hover:text-slate-900">Tickets</Link>
            <Link to="/report" className="font-medium text-slate-900">Report</Link>
          </nav>
          <div className="flex items-center gap-3">
            <Link to="/crm" className="rounded-full border border-slate-200 px-5 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50">
              Back to CRM
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
        {/* Page header */}
        <div className="mb-8">
          <p className="text-sm font-medium uppercase tracking-[0.24em] text-slate-400">Reports</p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight text-slate-900">Outreach Activity Report</h1>
          <p className="mt-1 text-sm text-slate-500">Full summary of all email outreach sent from your account. A copy is automatically sent to <strong>tulasi.chintha@gmail.com</strong> on every email.</p>
        </div>

        {loading && (
          <div className="py-20 text-center text-sm text-slate-400">Loading report...</div>
        )}

        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-6 py-4 text-sm text-red-700">{error}</div>
        )}

        {report && (
          <>
            {/* Summary cards */}
            <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { label: 'Total Emails Sent', value: String(report.total_sent), color: 'text-emerald-600', bg: 'bg-emerald-50', icon: '✉️' },
                { label: 'Failed', value: String(report.total_failed), color: 'text-red-600', bg: 'bg-red-50', icon: '⚠️' },
                { label: 'Unique Recipients', value: String(report.unique_recipients), color: 'text-indigo-600', bg: 'bg-indigo-50', icon: '👤' },
                { label: 'Delivery Rate', value: `${successRate}%`, color: 'text-slate-900', bg: 'bg-slate-50', icon: '📊' },
              ].map((stat) => (
                <div key={stat.label} className="rounded-[1.5rem] border border-black/5 bg-white p-6 shadow-[0_8px_30px_rgba(15,23,42,0.05)]">
                  <div className={`mb-3 inline-flex h-10 w-10 items-center justify-center rounded-2xl text-xl ${stat.bg}`}>
                    {stat.icon}
                  </div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">{stat.label}</p>
                  <p className={`mt-2 text-3xl font-semibold tracking-tight ${stat.color}`}>{stat.value}</p>
                </div>
              ))}
            </div>

            {/* CC Notice */}
            <div className="mb-6 flex items-center gap-3 rounded-2xl border border-indigo-100 bg-indigo-50 px-5 py-3.5 text-sm text-indigo-700">
              <svg className="h-4 w-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Every outreach email is automatically CC'd to <strong className="ml-1">tulasi.chintha@gmail.com</strong>
            </div>

            {/* Activity Table */}
            <div className="overflow-hidden rounded-[1.5rem] border border-black/5 bg-white shadow-[0_8px_30px_rgba(15,23,42,0.05)]">
              <div className="border-b border-slate-100 px-6 py-4">
                <h2 className="text-base font-semibold text-slate-900">Email Activity</h2>
                <p className="mt-0.5 text-xs text-slate-400">{report.logs.length} email{report.logs.length !== 1 ? 's' : ''} total</p>
              </div>

              {report.logs.length === 0 ? (
                <div className="px-6 py-16 text-center text-sm text-slate-400">
                  No outreach emails sent yet.
                </div>
              ) : (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-100">
                      <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">#</th>
                      <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">Recipient</th>
                      <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">Subject</th>
                      <th className="hidden px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-400 md:table-cell">Message Preview</th>
                      <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">Status</th>
                      <th className="hidden px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-400 lg:table-cell">Sent At</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {report.logs.map((log, idx) => (
                      <tr key={log.id} className="transition hover:bg-slate-50/50">
                        <td className="px-6 py-4 text-slate-400 text-xs">{idx + 1}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xs font-semibold text-indigo-700">
                              {log.to_email[0].toUpperCase()}
                            </div>
                            <span className="font-medium text-slate-900">{log.to_email}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-slate-600">{log.subject}</td>
                        <td className="hidden px-6 py-4 max-w-xs truncate text-slate-500 md:table-cell">
                          {log.body.replace(/<[^>]*>/g, '').slice(0, 80)}{log.body.length > 80 ? '…' : ''}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-medium ring-1 ${
                            log.status === 'sent'
                              ? 'bg-emerald-50 text-emerald-700 ring-emerald-200'
                              : 'bg-red-50 text-red-700 ring-red-200'
                          }`}>
                            {log.status === 'sent' ? '✓ Sent' : '✗ Failed'}
                          </span>
                        </td>
                        <td className="hidden px-6 py-4 text-slate-400 text-xs lg:table-cell">
                          {new Date(log.sent_at).toLocaleString('en-US', { timeZone: 'America/New_York' })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            {/* Footer note */}
            <p className="mt-4 text-center text-xs text-slate-400">
              Report generated at {new Date().toLocaleString('en-US', { timeZone: 'America/New_York' })} · All times in EST (America/New_York)
            </p>
          </>
        )}
      </main>
    </div>
  )
}
