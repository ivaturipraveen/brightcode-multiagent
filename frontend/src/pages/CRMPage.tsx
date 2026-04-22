import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import {
  getLeads, createLead, updateLead, deleteLead,
  sendEmailAuth, getEmailLogs,
  Lead, EmailLog,
} from '../lib/api'

type LeadStatus = 'New' | 'Contacted' | 'Qualified' | 'Closed'

const STATUS_STYLES: Record<LeadStatus, string> = {
  New: 'bg-blue-50 text-blue-700 ring-1 ring-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:ring-blue-800',
  Contacted: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:ring-amber-800',
  Qualified: 'bg-indigo-50 text-indigo-700 ring-1 ring-indigo-200 dark:bg-indigo-950 dark:text-indigo-300 dark:ring-indigo-800',
  Closed: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:ring-emerald-800',
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value)
}

function parseValue(raw: string): number {
  const cleaned = raw.replace(/[$,]/g, '').trim()
  const parsed = parseFloat(cleaned)
  return isNaN(parsed) ? 0 : parsed
}

export function CRMPage() {
  const token = localStorage.getItem('token') ?? ''

  const [leads, setLeads] = useState<Lead[]>([])
  const [leadsLoading, setLeadsLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState<LeadStatus | 'All'>('All')

  const [showImport, setShowImport] = useState(false)
  const [showEmail, setShowEmail] = useState(false)
  const [emailTo, setEmailTo] = useState('')
  const [emailSubject, setEmailSubject] = useState('')
  const [emailBody, setEmailBody] = useState('')
  const [emailSent, setEmailSent] = useState(false)
  const [emailError, setEmailError] = useState('')
  const [emailSending, setEmailSending] = useState(false)

  const [importText, setImportText] = useState('')
  const [importSuccess, setImportSuccess] = useState(false)
  const [newLead, setNewLead] = useState({ name: '', email: '', company: '', value: '' })
  const [showAddLead, setShowAddLead] = useState(false)
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null)

  const [activeTab, setActiveTab] = useState<'leads' | 'outreach'>('leads')
  const [emailLogs, setEmailLogs] = useState<EmailLog[]>([])
  const [logsLoading, setLogsLoading] = useState(false)

  // Load leads on mount
  useEffect(() => {
    setLeadsLoading(true)
    getLeads(token)
      .then(setLeads)
      .catch(() => setLeads([]))
      .finally(() => setLeadsLoading(false))
  }, [token])

  // Load email logs when tab switches
  useEffect(() => {
    if (activeTab === 'outreach') {
      setLogsLoading(true)
      getEmailLogs(token)
        .then(setEmailLogs)
        .catch(() => setEmailLogs([]))
        .finally(() => setLogsLoading(false))
    }
  }, [activeTab, token])

  // ── Analytics ──────────────────────────────────────────────────────────────
  const totalLeads = leads.length
  const qualifiedCount = leads.filter((l) => l.status === 'Qualified').length
  const closedLeads = leads.filter((l) => l.status === 'Closed')
  const pipelineValue = leads.filter((l) => l.status !== 'Closed').reduce((sum, l) => sum + l.value, 0)
  const closedValue = closedLeads.reduce((sum, l) => sum + l.value, 0)
  const conversionRate = totalLeads > 0 ? Math.round((qualifiedCount / totalLeads) * 100) : 0

  const ANALYTICS = [
    { label: 'Total Leads', value: String(totalLeads), delta: `${totalLeads} tracked`, up: true },
    { label: 'Qualified', value: String(qualifiedCount), delta: `${conversionRate}% conversion rate`, up: qualifiedCount > 0 },
    { label: 'Pipeline Value', value: formatCurrency(pipelineValue), delta: `${leads.filter(l => l.status !== 'Closed').length} active leads`, up: true },
    { label: 'Closed Won', value: String(closedLeads.length), delta: `${formatCurrency(closedValue)} revenue`, up: closedLeads.length > 0 },
  ]

  const filtered = leads.filter((lead) => {
    const matchesSearch =
      lead.name.toLowerCase().includes(search.toLowerCase()) ||
      lead.email.toLowerCase().includes(search.toLowerCase()) ||
      lead.company.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = filterStatus === 'All' || lead.status === filterStatus
    return matchesSearch && matchesStatus
  })

  async function handleStatusChange(id: number, status: string) {
    const updated = await updateLead(id, { status }, token)
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, status: updated.status } : l)))
  }

  async function handleDeleteLead(id: number) {
    await deleteLead(id, token)
    setLeads((prev) => prev.filter((l) => l.id !== id))
    setDeleteConfirmId(null)
  }

  async function handleImport() {
    const lines = importText.trim().split('\n').filter(Boolean)
    const created: Lead[] = []
    for (const line of lines) {
      const [name = '', email = '', company = '', value = ''] = line.split(',').map((s) => s.trim())
      if (!name || !email) continue
      try {
        const lead = await createLead({ name, email, company, value: parseValue(value) }, token)
        created.push(lead)
      } catch { /* skip invalid rows */ }
    }
    setLeads((prev) => [...created, ...prev])
    setImportText('')
    setImportSuccess(true)
    setTimeout(() => { setImportSuccess(false); setShowImport(false) }, 1500)
  }

  async function handleSendEmail() {
    setEmailError('')
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(emailTo)) {
      setEmailError('Please enter a valid email address (e.g. name@example.com)')
      return
    }
    setEmailSending(true)
    try {
      await sendEmailAuth({
        to: emailTo,
        subject: emailSubject,
        html: `<p>${emailBody.replace(/\n/g, '<br/>')}</p>`,
      }, token)
      setEmailSending(false)
      setShowEmail(false)
      setEmailTo('')
      setEmailSubject('')
      setEmailBody('')
      setEmailSent(true)
      setTimeout(() => setEmailSent(false), 2000)
    } catch (err: unknown) {
      setEmailSending(false)
      setEmailError(err instanceof Error ? err.message : 'Failed to send email')
    }
  }

  async function handleAddLead() {
    if (!newLead.name || !newLead.email) return
    try {
      const lead = await createLead({
        name: newLead.name,
        email: newLead.email,
        company: newLead.company,
        value: parseValue(newLead.value),
      }, token)
      setLeads((prev) => [lead, ...prev])
      setNewLead({ name: '', email: '', company: '', value: '' })
      setShowAddLead(false)
    } catch { /* ignore */ }
  }

  return (
    <div className="min-h-screen bg-[#fbfbfd] text-slate-900 dark:bg-gray-950 dark:text-gray-100">
      {/* Nav */}
      <header className="sticky top-0 z-20 border-b border-black/5 bg-[#fbfbfd]/90 backdrop-blur-xl dark:border-gray-800 dark:bg-gray-950/90">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
          <Link to="/" className="text-lg font-semibold tracking-tight dark:text-white">Brightcone</Link>
          <nav className="hidden items-center gap-8 text-sm text-slate-600 dark:text-gray-400 md:flex">
            <Link to="/#features" className="transition hover:text-slate-900 dark:hover:text-white">Features</Link>
            <Link to="/#enterprise" className="transition hover:text-slate-900 dark:hover:text-white">Enterprise</Link>
            <Link to="/pricing" className="transition hover:text-slate-900 dark:hover:text-white">Pricing</Link>
            <Link to="/about" className="transition hover:text-slate-900 dark:hover:text-white">About</Link>
            <Link to="/crm" className="font-medium text-slate-900 dark:text-white">CRM</Link>
            <Link to="/tickets" className="transition hover:text-slate-900 dark:hover:text-white">Tickets</Link>
            <Link to="/report" className="transition hover:text-slate-900 dark:hover:text-white">Report</Link>
          </nav>
          <div className="flex items-center gap-3">
            <Link to="/chat" className="rounded-full bg-slate-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800 dark:bg-indigo-600 dark:hover:bg-indigo-700">
              Open Chat
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-10 lg:px-8">

        {/* Page header */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.24em] text-slate-400 dark:text-gray-500">CRM</p>
            <h1 className="mt-1 text-3xl font-semibold tracking-tight text-slate-900 dark:text-white">Lead Management</h1>
            <p className="mt-1 text-sm text-slate-500 dark:text-gray-400">Track leads, send outreach, and monitor your pipeline.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              to="/tickets"
              className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5h6m-6 4h6m-7 4h8m-9 6h10a2 2 0 002-2V7.414a2 2 0 00-.586-1.414l-2.414-2.414A2 2 0 0015.586 3H7a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              View Tickets
            </Link>
            <Link
              to="/report"
              className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              View Report
            </Link>
            <button
              onClick={() => setShowImport(true)}
              className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              Import Leads
            </button>
            <button
              onClick={() => setShowEmail(true)}
              className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Email Outreach
            </button>
            <button
              onClick={() => setShowAddLead(true)}
              className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-indigo-700"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              Add Lead
            </button>
          </div>
        </div>

        {/* Analytics */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {ANALYTICS.map((stat) => (
            <div key={stat.label} className="rounded-[1.5rem] border border-black/5 bg-white p-6 shadow-[0_8px_30px_rgba(15,23,42,0.05)] dark:border-gray-800 dark:bg-gray-900">
              <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 dark:text-gray-500">{stat.label}</p>
              <p className="mt-2 text-3xl font-semibold tracking-tight text-slate-900 dark:text-white">{stat.value}</p>
              <p className={`mt-1 text-xs font-medium ${stat.up ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}`}>
                {stat.delta}
              </p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="mb-6 flex gap-1 rounded-2xl border border-black/5 bg-slate-100 p-1 dark:border-gray-800 dark:bg-gray-800 w-fit">
          <button
            onClick={() => setActiveTab('leads')}
            className={`rounded-xl px-5 py-2 text-sm font-medium transition ${activeTab === 'leads' ? 'bg-white text-slate-900 shadow-sm dark:bg-gray-700 dark:text-white' : 'text-slate-500 hover:text-slate-700 dark:text-gray-400 dark:hover:text-gray-200'}`}
          >
            Leads
          </button>
          <button
            onClick={() => setActiveTab('outreach')}
            className={`rounded-xl px-5 py-2 text-sm font-medium transition ${activeTab === 'outreach' ? 'bg-white text-slate-900 shadow-sm dark:bg-gray-700 dark:text-white' : 'text-slate-500 hover:text-slate-700 dark:text-gray-400 dark:hover:text-gray-200'}`}
          >
            Outreach History
          </button>
        </div>

        {/* Outreach History Tab */}
        {activeTab === 'outreach' && (
          <div className="overflow-hidden rounded-[1.5rem] border border-black/5 bg-white shadow-[0_8px_30px_rgba(15,23,42,0.05)] dark:border-gray-800 dark:bg-gray-900">
            {logsLoading ? (
              <div className="px-6 py-12 text-center text-sm text-slate-400 dark:text-gray-500">Loading outreach history...</div>
            ) : emailLogs.length === 0 ? (
              <div className="px-6 py-12 text-center text-sm text-slate-400 dark:text-gray-500">No outreach emails sent yet.</div>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-gray-800">
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-gray-500">To</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-gray-500">Subject</th>
                    <th className="hidden px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-gray-500 md:table-cell">Message</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-gray-500">Status</th>
                    <th className="hidden px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-gray-500 lg:table-cell">Sent At</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 dark:divide-gray-800">
                  {emailLogs.map((log) => (
                    <tr key={log.id} className="transition hover:bg-slate-50/50 dark:hover:bg-gray-800/50">
                      <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">{log.to_email}</td>
                      <td className="px-6 py-4 text-slate-600 dark:text-gray-400">{log.subject}</td>
                      <td className="hidden px-6 py-4 max-w-xs truncate text-slate-500 dark:text-gray-500 md:table-cell">
                        {log.body.replace(/<[^>]*>/g, '').slice(0, 80)}{log.body.length > 80 ? '…' : ''}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`rounded-lg px-2.5 py-1 text-xs font-medium ring-1 ${log.status === 'sent' ? 'bg-emerald-50 text-emerald-700 ring-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:ring-emerald-800' : 'bg-red-50 text-red-700 ring-red-200 dark:bg-red-950 dark:text-red-300 dark:ring-red-800'}`}>
                          {log.status === 'sent' ? '✓ Sent' : '✗ Failed'}
                        </span>
                      </td>
                      <td className="hidden px-6 py-4 text-slate-400 dark:text-gray-500 lg:table-cell">
                        {new Date(log.sent_at).toLocaleString('en-US', { timeZone: 'America/New_York' })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            <p className="px-6 py-3 text-xs text-slate-400 dark:text-gray-600 border-t border-slate-50 dark:border-gray-800">
              {emailLogs.length} email{emailLogs.length !== 1 ? 's' : ''} total
            </p>
          </div>
        )}

        {/* Leads Tab */}
        {activeTab === 'leads' && <>
          {/* Filters */}
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative max-w-xs flex-1">
              <svg className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-4 text-sm text-slate-900 outline-none transition focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:focus:border-indigo-600"
                placeholder="Search leads..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {(['All', 'New', 'Contacted', 'Qualified', 'Closed'] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setFilterStatus(s)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${filterStatus === s ? 'bg-indigo-600 text-white' : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'}`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Leads Table */}
          <div className="overflow-hidden rounded-[1.5rem] border border-black/5 bg-white shadow-[0_8px_30px_rgba(15,23,42,0.05)] dark:border-gray-800 dark:bg-gray-900">
            {leadsLoading ? (
              <div className="px-6 py-12 text-center text-sm text-slate-400 dark:text-gray-500">Loading your leads...</div>
            ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 dark:border-gray-800">
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-gray-500">Name</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-gray-500">Company</th>
                  <th className="hidden px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-gray-500 md:table-cell">Email</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-gray-500">Status</th>
                  <th className="hidden px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-gray-500 sm:table-cell">Value</th>
                  <th className="hidden px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-gray-500 lg:table-cell">Date</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-gray-800">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-sm text-slate-400 dark:text-gray-500">
                      {leads.length === 0 ? 'No leads yet. Add your first lead!' : 'No leads match your search.'}
                    </td>
                  </tr>
                ) : (
                  filtered.map((lead) => (
                    <tr key={lead.id} className="transition hover:bg-slate-50/50 dark:hover:bg-gray-800/50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xs font-semibold text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300">
                            {lead.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                          </div>
                          <span className="font-medium text-slate-900 dark:text-white">{lead.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-600 dark:text-gray-400">{lead.company}</td>
                      <td className="hidden px-6 py-4 text-slate-500 dark:text-gray-500 md:table-cell">{lead.email}</td>
                      <td className="px-6 py-4">
                        <select
                          value={lead.status}
                          onChange={(e) => handleStatusChange(lead.id, e.target.value)}
                          className={`cursor-pointer rounded-lg px-2.5 py-1 text-xs font-medium outline-none ${STATUS_STYLES[lead.status as LeadStatus] ?? ''}`}
                        >
                          {(['New', 'Contacted', 'Qualified', 'Closed'] as LeadStatus[]).map((s) => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </td>
                      <td className="hidden px-6 py-4 font-medium text-slate-900 dark:text-white sm:table-cell">
                        {formatCurrency(lead.value)}
                      </td>
                      <td className="hidden px-6 py-4 text-slate-400 dark:text-gray-500 lg:table-cell">
                        {lead.created_at ? new Date(lead.created_at).toLocaleDateString('en-US', { timeZone: 'America/New_York' }) : '—'}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => { setEmailTo(lead.email); setShowEmail(true) }}
                            className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:border-indigo-700 dark:hover:bg-indigo-950 dark:hover:text-indigo-300"
                          >
                            Email
                          </button>
                          {deleteConfirmId === lead.id ? (
                            <div className="flex items-center gap-1">
                              <button onClick={() => handleDeleteLead(lead.id)} className="rounded-lg bg-red-500 px-2.5 py-1.5 text-xs font-medium text-white hover:bg-red-600">Confirm</button>
                              <button onClick={() => setDeleteConfirmId(null)} className="rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-medium text-slate-500 hover:bg-slate-50 dark:border-gray-700 dark:text-gray-400">Cancel</button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setDeleteConfirmId(lead.id)}
                              className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-400 transition hover:border-red-300 hover:bg-red-50 hover:text-red-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-500 dark:hover:border-red-800 dark:hover:bg-red-950 dark:hover:text-red-400"
                            >
                              Delete
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
            )}
          </div>
          <p className="mt-3 text-xs text-slate-400 dark:text-gray-600">{filtered.length} lead{filtered.length !== 1 ? 's' : ''} shown</p>
        </>}
      </main>

      {/* Import Modal */}
      {showImport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-[2rem] border border-black/5 bg-white p-8 shadow-2xl dark:border-gray-700 dark:bg-gray-900">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Import Leads</h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-gray-400">Paste CSV rows: <code className="rounded bg-slate-100 px-1 dark:bg-gray-800">Name, Email, Company, Value</code></p>
            <textarea
              className="mt-4 h-36 w-full resize-none rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-900 outline-none focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
              placeholder={"John Doe, john@acme.com, Acme, $5000\nJane Smith, jane@corp.com, Corp, $8000"}
              value={importText}
              onChange={(e) => setImportText(e.target.value)}
            />
            <div className="mt-4 flex justify-end gap-3">
              <button onClick={() => setShowImport(false)} className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800">Cancel</button>
              <button onClick={handleImport} className="rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-indigo-700">
                {importSuccess ? '✅ Imported!' : 'Import'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Email Modal */}
      {showEmail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-[2rem] border border-black/5 bg-white p-8 shadow-2xl dark:border-gray-700 dark:bg-gray-900">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Email Outreach</h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-gray-400">
              Send a message to a lead directly. Fields marked <span className="text-red-500 font-semibold">*</span> are required.
            </p>
            <div className="mt-4 space-y-3">
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-gray-400">To <span className="text-red-500">*</span></label>
                <input className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 outline-none focus:border-indigo-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100" placeholder="email@example.com" value={emailTo} onChange={(e) => setEmailTo(e.target.value)} />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-gray-400">Subject <span className="text-red-500">*</span></label>
                <input className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 outline-none focus:border-indigo-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100" placeholder="e.g. Quick Connect" value={emailSubject} onChange={(e) => setEmailSubject(e.target.value)} />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-gray-400">Message <span className="text-red-500">*</span></label>
                <textarea className="h-32 w-full resize-none rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-900 outline-none focus:border-indigo-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100" placeholder="Write your message..." value={emailBody} onChange={(e) => setEmailBody(e.target.value)} />
              </div>
            </div>
            {emailError && <p className="mt-3 text-sm text-red-500">{emailError}</p>}
            <div className="mt-4 flex justify-end gap-3">
              <button onClick={() => { setShowEmail(false); setEmailTo(''); setEmailSubject(''); setEmailBody(''); setEmailError('') }} className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800">Cancel</button>
              <button onClick={handleSendEmail} disabled={emailSending || !emailTo || !emailSubject || !emailBody} className="rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50">
                {emailSending ? 'Sending…' : 'Send Email'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Lead Modal */}
      {showAddLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-[2rem] border border-black/5 bg-white p-8 shadow-2xl dark:border-gray-700 dark:bg-gray-900">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Add New Lead</h2>
            <div className="mt-4 space-y-3">
              <input className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 outline-none focus:border-indigo-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100" placeholder="Full name *" value={newLead.name} onChange={(e) => setNewLead((p) => ({ ...p, name: e.target.value }))} />
              <input className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 outline-none focus:border-indigo-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100" placeholder="Email address *" value={newLead.email} onChange={(e) => setNewLead((p) => ({ ...p, email: e.target.value }))} />
              <input className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 outline-none focus:border-indigo-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100" placeholder="Company" value={newLead.company} onChange={(e) => setNewLead((p) => ({ ...p, company: e.target.value }))} />
              <input className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 outline-none focus:border-indigo-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100" placeholder="Deal value (e.g. $5,000)" value={newLead.value} onChange={(e) => setNewLead((p) => ({ ...p, value: e.target.value }))} />
            </div>
            <div className="mt-4 flex justify-end gap-3">
              <button onClick={() => setShowAddLead(false)} className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800">Cancel</button>
              <button onClick={handleAddLead} disabled={!newLead.name || !newLead.email} className="rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-indigo-700 disabled:bg-indigo-300">Add Lead</button>
            </div>
          </div>
        </div>
      )}

      {/* Email Sent Success Overlay */}
      {emailSent && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm dark:bg-gray-950/80">
          <div className="flex flex-col items-center gap-4">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900">
              <svg className="h-12 w-12 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-xl font-semibold text-slate-900 dark:text-white">Email Sent!</p>
            <p className="text-sm text-slate-500 dark:text-gray-400">Your message has been delivered successfully.</p>
          </div>
        </div>
      )}
    </div>
  )
}
