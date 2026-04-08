import { Link } from 'react-router-dom'
import { useMemo, useState } from 'react'

type TicketStatus = 'Open' | 'In Progress' | 'Resolved'
type TicketPriority = 'Low' | 'Medium' | 'High'

type Ticket = {
  id: number
  title: string
  customer: string
  category: string
  priority: TicketPriority
  status: TicketStatus
  note: string
  createdAt: string
}

const STATUS_STYLES: Record<TicketStatus, string> = {
  Open: 'bg-blue-50 text-blue-700 ring-1 ring-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:ring-blue-800',
  'In Progress': 'bg-amber-50 text-amber-700 ring-1 ring-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:ring-amber-800',
  Resolved: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:ring-emerald-800',
}

const PRIORITY_STYLES: Record<TicketPriority, string> = {
  Low: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
  Medium: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300',
  High: 'bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-300',
}

const INITIAL_TICKETS: Ticket[] = [
  {
    id: 1,
    title: 'Billing portal access request',
    customer: 'Northstar Health',
    category: 'Billing',
    priority: 'High',
    status: 'Open',
    note: 'Customer needs admin access for finance team before next invoice cycle.',
    createdAt: '2026-04-06',
  },
  {
    id: 2,
    title: 'Webhook payload mismatch',
    customer: 'Apex Systems',
    category: 'Integrations',
    priority: 'Medium',
    status: 'In Progress',
    note: 'Support flagged unexpected schema in outbound automation payload.',
    createdAt: '2026-04-07',
  },
  {
    id: 3,
    title: 'Need export of quarterly activity',
    customer: 'Blue Canyon Labs',
    category: 'Reporting',
    priority: 'Low',
    status: 'Resolved',
    note: 'CSV export sent and customer confirmed receipt.',
    createdAt: '2026-04-04',
  },
]

export function TicketsPage() {
  const [tickets, setTickets] = useState<Ticket[]>(INITIAL_TICKETS)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<TicketStatus | 'All'>('All')
  const [showNewTicket, setShowNewTicket] = useState(false)
  const [newTicket, setNewTicket] = useState({
    title: '',
    customer: '',
    category: '',
    priority: 'Medium' as TicketPriority,
    note: '',
  })

  const metrics = useMemo(() => {
    const open = tickets.filter((t) => t.status === 'Open').length
    const inProgress = tickets.filter((t) => t.status === 'In Progress').length
    const resolved = tickets.filter((t) => t.status === 'Resolved').length
    const highPriority = tickets.filter((t) => t.priority === 'High').length
    return { open, inProgress, resolved, highPriority }
  }, [tickets])

  const filteredTickets = useMemo(() => {
    return tickets.filter((ticket) => {
      const matchesSearch = [ticket.title, ticket.customer, ticket.category, ticket.note]
        .join(' ')
        .toLowerCase()
        .includes(search.toLowerCase())
      const matchesStatus = statusFilter === 'All' || ticket.status === statusFilter
      return matchesSearch && matchesStatus
    })
  }, [tickets, search, statusFilter])

  function handleCreateTicket() {
    if (!newTicket.title || !newTicket.customer || !newTicket.category) return
    const ticket: Ticket = {
      id: Date.now(),
      title: newTicket.title,
      customer: newTicket.customer,
      category: newTicket.category,
      priority: newTicket.priority,
      status: 'Open',
      note: newTicket.note,
      createdAt: new Date().toISOString().slice(0, 10),
    }
    setTickets((prev) => [ticket, ...prev])
    setNewTicket({ title: '', customer: '', category: '', priority: 'Medium', note: '' })
    setShowNewTicket(false)
  }

  function updateStatus(id: number, status: TicketStatus) {
    setTickets((prev) => prev.map((ticket) => (ticket.id === id ? { ...ticket, status } : ticket)))
  }

  function deleteTicket(id: number) {
    setTickets((prev) => prev.filter((ticket) => ticket.id !== id))
  }

  return (
    <div className="min-h-screen bg-[#fbfbfd] text-slate-900 dark:bg-gray-950 dark:text-gray-100">
      <header className="sticky top-0 z-20 border-b border-black/5 bg-[#fbfbfd]/90 backdrop-blur-xl dark:border-gray-800 dark:bg-gray-950/90">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
          <Link to="/" className="text-lg font-semibold tracking-tight dark:text-white">Brightcone</Link>
          <nav className="hidden items-center gap-8 text-sm text-slate-600 dark:text-gray-400 md:flex">
            <Link to="/#features" className="transition hover:text-slate-900 dark:hover:text-white">Features</Link>
            <Link to="/#enterprise" className="transition hover:text-slate-900 dark:hover:text-white">Enterprise</Link>
            <Link to="/pricing" className="transition hover:text-slate-900 dark:hover:text-white">Pricing</Link>
            <Link to="/about" className="transition hover:text-slate-900 dark:hover:text-white">About</Link>
            <Link to="/crm" className="transition hover:text-slate-900 dark:hover:text-white">CRM</Link>
            <Link to="/tickets" className="font-medium text-slate-900 dark:text-white">Tickets</Link>
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
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.24em] text-slate-400 dark:text-gray-500">Support</p>
            <h1 className="mt-1 text-3xl font-semibold tracking-tight text-slate-900 dark:text-white">Ticket Management</h1>
            <p className="mt-1 text-sm text-slate-500 dark:text-gray-400">Track customer issues, prioritize the queue, and move requests through resolution.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              to="/crm"
              className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
            >
              Back to CRM
            </Link>
            <button
              onClick={() => setShowNewTicket(true)}
              className="rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-indigo-700"
            >
              Create Ticket
            </button>
          </div>
        </div>

        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: 'Open', value: metrics.open, helper: 'Needs response' },
            { label: 'In Progress', value: metrics.inProgress, helper: 'Actively owned' },
            { label: 'Resolved', value: metrics.resolved, helper: 'Closed successfully' },
            { label: 'High Priority', value: metrics.highPriority, helper: 'Escalated items' },
          ].map((stat) => (
            <div key={stat.label} className="rounded-[1.5rem] border border-black/5 bg-white p-6 shadow-[0_8px_30px_rgba(15,23,42,0.05)] dark:border-gray-800 dark:bg-gray-900">
              <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 dark:text-gray-500">{stat.label}</p>
              <p className="mt-2 text-3xl font-semibold tracking-tight text-slate-900 dark:text-white">{stat.value}</p>
              <p className="mt-1 text-xs text-slate-500 dark:text-gray-400">{stat.helper}</p>
            </div>
          ))}
        </div>

        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <input
            className="w-full max-w-xs rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
            placeholder="Search tickets..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className="flex flex-wrap gap-2">
            {(['All', 'Open', 'In Progress', 'Resolved'] as const).map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${statusFilter === status ? 'bg-indigo-600 text-white' : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'}`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-hidden rounded-[1.5rem] border border-black/5 bg-white shadow-[0_8px_30px_rgba(15,23,42,0.05)] dark:border-gray-800 dark:bg-gray-900">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 dark:border-gray-800">
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-gray-500">Title</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-gray-500">Customer</th>
                <th className="hidden px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-gray-500 md:table-cell">Category</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-gray-500">Priority</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-gray-500">Status</th>
                <th className="hidden px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-gray-500 lg:table-cell">Created</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-gray-800">
              {filteredTickets.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-sm text-slate-400 dark:text-gray-500">No tickets match your filters.</td>
                </tr>
              ) : (
                filteredTickets.map((ticket) => (
                  <tr key={ticket.id} className="transition hover:bg-slate-50/50 dark:hover:bg-gray-800/50">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-slate-900 dark:text-white">{ticket.title}</p>
                        <p className="mt-1 text-xs text-slate-400 dark:text-gray-500">{ticket.note}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600 dark:text-gray-400">{ticket.customer}</td>
                    <td className="hidden px-6 py-4 text-slate-500 dark:text-gray-500 md:table-cell">{ticket.category}</td>
                    <td className="px-6 py-4">
                      <span className={`rounded-lg px-2.5 py-1 text-xs font-medium ${PRIORITY_STYLES[ticket.priority]}`}>{ticket.priority}</span>
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={ticket.status}
                        onChange={(e) => updateStatus(ticket.id, e.target.value as TicketStatus)}
                        className={`cursor-pointer rounded-lg px-2.5 py-1 text-xs font-medium outline-none ${STATUS_STYLES[ticket.status]}`}
                      >
                        {(['Open', 'In Progress', 'Resolved'] as TicketStatus[]).map((status) => (
                          <option key={status} value={status}>{status}</option>
                        ))}
                      </select>
                    </td>
                    <td className="hidden px-6 py-4 text-slate-400 dark:text-gray-500 lg:table-cell">{ticket.createdAt}</td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => deleteTicket(ticket.id)}
                        className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-400 transition hover:border-red-300 hover:bg-red-50 hover:text-red-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-500 dark:hover:border-red-800 dark:hover:bg-red-950 dark:hover:text-red-400"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          <p className="border-t border-slate-50 px-6 py-3 text-xs text-slate-400 dark:border-gray-800 dark:text-gray-600">{filteredTickets.length} ticket{filteredTickets.length !== 1 ? 's' : ''} shown</p>
        </div>
      </main>

      {showNewTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-[2rem] border border-black/5 bg-white p-8 shadow-2xl dark:border-gray-700 dark:bg-gray-900">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Create Support Ticket</h2>
            <div className="mt-4 space-y-3">
              <input
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 outline-none focus:border-indigo-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
                placeholder="Ticket title *"
                value={newTicket.title}
                onChange={(e) => setNewTicket((prev) => ({ ...prev, title: e.target.value }))}
              />
              <input
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 outline-none focus:border-indigo-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
                placeholder="Customer name *"
                value={newTicket.customer}
                onChange={(e) => setNewTicket((prev) => ({ ...prev, customer: e.target.value }))}
              />
              <input
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 outline-none focus:border-indigo-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
                placeholder="Category *"
                value={newTicket.category}
                onChange={(e) => setNewTicket((prev) => ({ ...prev, category: e.target.value }))}
              />
              <select
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 outline-none focus:border-indigo-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
                value={newTicket.priority}
                onChange={(e) => setNewTicket((prev) => ({ ...prev, priority: e.target.value as TicketPriority }))}
              >
                <option value="Low">Low priority</option>
                <option value="Medium">Medium priority</option>
                <option value="High">High priority</option>
              </select>
              <textarea
                className="h-28 w-full resize-none rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-900 outline-none focus:border-indigo-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
                placeholder="Issue summary / support note"
                value={newTicket.note}
                onChange={(e) => setNewTicket((prev) => ({ ...prev, note: e.target.value }))}
              />
            </div>
            <div className="mt-4 flex justify-end gap-3">
              <button onClick={() => setShowNewTicket(false)} className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800">Cancel</button>
              <button onClick={handleCreateTicket} disabled={!newTicket.title || !newTicket.customer || !newTicket.category} className="rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50">Create Ticket</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
