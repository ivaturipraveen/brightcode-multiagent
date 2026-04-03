import { useEffect, useState } from 'react'
import { HRLayout } from './HRLayout'
import { hrGet, hrPatch, hrPost, getHRToken } from '../../lib/hrApi'

interface Employee {
  id: number
  name: string
  email: string
  role: string
  department?: string
  designation?: string
  phone?: string
  salary?: number
  status: string
  company_id?: number
}

interface EditForm {
  name: string
  department: string
  designation: string
  phone: string
  salary: string
}

export function HREmployeesPage() {
  const token = getHRToken()
  const [employees, setEmployees] = useState<Employee[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editForm, setEditForm] = useState<EditForm>({ name: '', department: '', designation: '', phone: '', salary: '' })
  const [showAddForm, setShowAddForm] = useState(false)
  const [addForm, setAddForm] = useState({ name: '', email: '', password: '', department: '', designation: '', phone: '', salary: '', date_of_joining: '' })

  async function loadEmployees() {
    const data = await hrGet<Employee[]>('/hr/admin/employees', token)
    setEmployees(data)
  }

  useEffect(() => {
    loadEmployees().catch(e => setError(e.message)).finally(() => setLoading(false))
  }, [])

  async function toggleStatus(id: number, current: string) {
    const next = current === 'active' ? 'inactive' : 'active'
    try {
      await hrPatch(`/hr/admin/employees/${id}/status`, { status: next }, token)
      setEmployees(prev => prev.map(e => e.id === id ? { ...e, status: next } : e))
      setSuccess(`Employee ${next === 'active' ? 'activated' : 'deactivated'}.`)
    } catch (e: any) { setError(e.message) }
  }

  function startEdit(emp: Employee) {
    setEditingId(emp.id)
    setEditForm({
      name: emp.name ?? '',
      department: emp.department ?? '',
      designation: emp.designation ?? '',
      phone: emp.phone ?? '',
      salary: emp.salary ? String(emp.salary) : '',
    })
  }

  async function saveEdit(id: number) {
    setError(''); setSuccess('')
    try {
      await hrPatch(`/hr/admin/employees/${id}`, {
        name: editForm.name,
        department: editForm.department,
        designation: editForm.designation,
        phone: editForm.phone,
        salary: editForm.salary ? parseFloat(editForm.salary) : null,
      }, token)
      await loadEmployees()
      setEditingId(null)
      setSuccess('Employee updated successfully.')
    } catch (e: any) { setError(e.message) }
  }

  async function addEmployee(e: React.FormEvent) {
    e.preventDefault()
    setError(''); setSuccess('')
    try {
      // get company_id from first employee or from localStorage
      const companyId = employees[0]?.company_id ?? parseInt(localStorage.getItem('hr_company_id') ?? '0')
      await hrPost('/hr/auth/register-employee', {
        name: addForm.name,
        email: addForm.email,
        password: addForm.password,
        company_id: companyId,
        department: addForm.department || undefined,
        designation: addForm.designation || undefined,
        phone: addForm.phone || undefined,
        salary: addForm.salary ? parseFloat(addForm.salary) : undefined,
        date_of_joining: addForm.date_of_joining || undefined,
      }, token)
      setSuccess('Employee added successfully!')
      setShowAddForm(false)
      setAddForm({ name: '', email: '', password: '', department: '', designation: '', phone: '', salary: '', date_of_joining: '' })
      await loadEmployees()
    } catch (e: any) { setError(e.message) }
  }

  const filtered = employees.filter(e =>
    e.name.toLowerCase().includes(search.toLowerCase()) ||
    e.email.toLowerCase().includes(search.toLowerCase()) ||
    (e.department ?? '').toLowerCase().includes(search.toLowerCase()) ||
    (e.designation ?? '').toLowerCase().includes(search.toLowerCase())
  )

  return (
    <HRLayout>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Employees</h1>
          <p className="text-sm text-slate-500 mt-1">{employees.length} employee{employees.length !== 1 ? 's' : ''} total</p>
        </div>
        <div className="flex gap-3 flex-wrap items-center">
          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              className="w-full rounded-lg border border-slate-200 bg-white pl-9 pr-4 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              placeholder="Search employees..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 whitespace-nowrap"
          >
            + Add Employee
          </button>
        </div>
      </div>

      {error && <p className="mb-4 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">{error}</p>}
      {success && <p className="mb-4 rounded-lg bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-700">{success}</p>}

      {/* Add Employee Form */}
      {showAddForm && (
        <div className="mb-6 rounded-2xl border border-indigo-200 bg-indigo-50 p-6">
          <h2 className="text-sm font-semibold text-indigo-800 mb-4">Add New Employee</h2>
          <form onSubmit={addEmployee} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5">Full Name *</label>
              <input required className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-indigo-500" value={addForm.name} onChange={e => setAddForm(p => ({...p, name: e.target.value}))} placeholder="John Doe" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5">Email *</label>
              <input required type="email" className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-indigo-500" value={addForm.email} onChange={e => setAddForm(p => ({...p, email: e.target.value}))} placeholder="john@company.com" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5">Password *</label>
              <input required type="password" className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-indigo-500" value={addForm.password} onChange={e => setAddForm(p => ({...p, password: e.target.value}))} placeholder="Min 6 chars" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5">Department</label>
              <input className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-indigo-500" value={addForm.department} onChange={e => setAddForm(p => ({...p, department: e.target.value}))} placeholder="Engineering" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5">Designation</label>
              <input className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-indigo-500" value={addForm.designation} onChange={e => setAddForm(p => ({...p, designation: e.target.value}))} placeholder="Software Engineer" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5">Phone</label>
              <input className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-indigo-500" value={addForm.phone} onChange={e => setAddForm(p => ({...p, phone: e.target.value}))} placeholder="+91-9000000000" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5">Salary</label>
              <input type="number" className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-indigo-500" value={addForm.salary} onChange={e => setAddForm(p => ({...p, salary: e.target.value}))} placeholder="50000" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5">Date of Joining</label>
              <input type="date" className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-indigo-500" value={addForm.date_of_joining} onChange={e => setAddForm(p => ({...p, date_of_joining: e.target.value}))} />
            </div>
            <div className="sm:col-span-2 lg:col-span-3 flex gap-3">
              <button type="submit" className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700">Add Employee</button>
              <button type="button" onClick={() => setShowAddForm(false)} className="rounded-lg border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50">Cancel</button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="text-center py-20 text-sm text-slate-400">Loading employees...</div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead className="border-b border-slate-100 bg-slate-50">
              <tr>
                {['Employee', 'Department', 'Designation', 'Role', 'Phone', 'Salary', 'Status', 'Actions'].map(h => (
                  <th key={h} className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.length === 0 ? (
                <tr><td colSpan={8} className="px-5 py-12 text-center text-sm text-slate-400">No employees found.</td></tr>
              ) : filtered.map(emp => (
                editingId === emp.id ? (
                  <tr key={emp.id} className="bg-indigo-50">
                    <td className="px-5 py-3">
                      <input className="w-full rounded-lg border border-indigo-300 bg-white px-3 py-1.5 text-sm outline-none" value={editForm.name} onChange={e => setEditForm(p => ({...p, name: e.target.value}))} />
                      <p className="text-xs text-slate-400 mt-1">{emp.email}</p>
                    </td>
                    <td className="px-5 py-3">
                      <input className="w-full rounded-lg border border-indigo-300 bg-white px-3 py-1.5 text-sm outline-none" placeholder="Department" value={editForm.department} onChange={e => setEditForm(p => ({...p, department: e.target.value}))} />
                    </td>
                    <td className="px-5 py-3">
                      <input className="w-full rounded-lg border border-indigo-300 bg-white px-3 py-1.5 text-sm outline-none" placeholder="Designation" value={editForm.designation} onChange={e => setEditForm(p => ({...p, designation: e.target.value}))} />
                    </td>
                    <td className="px-5 py-3">
                      <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${emp.role === 'company_admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                        {emp.role === 'company_admin' ? 'Admin' : 'Employee'}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <input className="w-full rounded-lg border border-indigo-300 bg-white px-3 py-1.5 text-sm outline-none" placeholder="Phone" value={editForm.phone} onChange={e => setEditForm(p => ({...p, phone: e.target.value}))} />
                    </td>
                    <td className="px-5 py-3">
                      <input type="number" className="w-28 rounded-lg border border-indigo-300 bg-white px-3 py-1.5 text-sm outline-none" placeholder="Salary" value={editForm.salary} onChange={e => setEditForm(p => ({...p, salary: e.target.value}))} />
                    </td>
                    <td className="px-5 py-3">
                      <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${emp.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{emp.status}</span>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex gap-2">
                        <button onClick={() => saveEdit(emp.id)} className="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-indigo-700">Save</button>
                        <button onClick={() => setEditingId(null)} className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50">Cancel</button>
                      </div>
                    </td>
                  </tr>
                ) : (
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
                    <td className="px-5 py-4 text-slate-500">{emp.phone || '—'}</td>
                    <td className="px-5 py-4 text-slate-500">{emp.salary ? `₹${emp.salary.toLocaleString()}` : '—'}</td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${emp.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {emp.status}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex gap-2">
                        <button onClick={() => startEdit(emp)} className="rounded-lg bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-700 hover:bg-indigo-100">
                          Edit
                        </button>
                        <button
                          onClick={() => toggleStatus(emp.id, emp.status)}
                          className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${emp.status === 'active' ? 'bg-amber-50 text-amber-700 hover:bg-amber-100' : 'bg-green-50 text-green-700 hover:bg-green-100'}`}
                        >
                          {emp.status === 'active' ? 'Deactivate' : 'Activate'}
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              ))}
            </tbody>
          </table>
          <p className="px-5 py-3 text-xs text-slate-400 border-t border-slate-100">{filtered.length} of {employees.length} employees shown</p>
        </div>
      )}
    </HRLayout>
  )
}
