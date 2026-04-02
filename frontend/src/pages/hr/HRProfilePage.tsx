import { useEffect, useRef, useState } from 'react'
import { HRLayout } from './HRLayout'
import { hrGet, hrPost, getHRToken, getHRName } from '../../lib/hrApi'
import { API_BASE_URL } from '../../lib/api'

interface Profile {
  id: number
  name: string
  email: string
  role: string
  department: string | null
  designation: string | null
  phone: string | null
  salary: number | null
  status: string
  company_id: number | null
  avatar_url: string | null
  bio: string | null
  date_of_joining: string | null
}

export function HRProfilePage() {
  const token = getHRToken()
  const fileRef = useRef<HTMLInputElement>(null)

  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [editMode, setEditMode] = useState(false)

  // editable fields
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [department, setDepartment] = useState('')
  const [designation, setDesignation] = useState('')
  const [bio, setBio] = useState('')

  useEffect(() => {
    hrGet<Profile>('/hr/profile', token)
      .then(p => {
        setProfile(p)
        setName(p.name)
        setPhone(p.phone ?? '')
        setDepartment(p.department ?? '')
        setDesignation(p.designation ?? '')
        setBio(p.bio ?? '')
      })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  async function handleSave() {
    setSaving(true); setError(''); setSuccess('')
    try {
      const res = await fetch(`${API_BASE_URL}/hr/profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ name, phone, department, designation, bio }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.detail || 'Update failed')
      setProfile(data)
      localStorage.setItem('hr_name', data.name)
      setSuccess('Profile updated successfully!')
      setEditMode(false)
    } catch (e: any) { setError(e.message) }
    finally { setSaving(false) }
  }

  async function handleAvatarUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true); setError(''); setSuccess('')
    try {
      const formData = new FormData()
      formData.append('file', file)
      const res = await fetch(`${API_BASE_URL}/hr/profile/avatar`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.detail || 'Upload failed')
      setProfile(prev => prev ? { ...prev, avatar_url: data.avatar_url } : prev)
      setSuccess('Profile picture updated!')
    } catch (e: any) { setError(e.message) }
    finally { setUploading(false) }
  }

  const roleBadge: Record<string, { label: string; color: string }> = {
    super_admin: { label: 'Super Admin', color: 'bg-purple-100 text-purple-700' },
    company_admin: { label: 'Company Admin', color: 'bg-blue-100 text-blue-700' },
    employee: { label: 'Employee', color: 'bg-green-100 text-green-700' },
  }
  const badge = profile ? (roleBadge[profile.role] ?? { label: profile.role, color: 'bg-slate-100 text-slate-600' }) : null

  if (loading) return <HRLayout><div className="flex items-center justify-center py-24 text-sm text-slate-400">Loading profile...</div></HRLayout>

  return (
    <HRLayout>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">My Profile</h1>
          <p className="text-sm text-slate-500 mt-1">Manage your personal information and profile picture</p>
        </div>
        {!editMode && (
          <button onClick={() => setEditMode(true)} className="rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700">
            Edit Profile
          </button>
        )}
      </div>

      {error && <p className="mb-5 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">{error}</p>}
      {success && <p className="mb-5 rounded-lg bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-700">✅ {success}</p>}

      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">

        {/* ── Avatar Card ── */}
        <div className="flex flex-col items-center rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="relative mb-4">
            {profile?.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt={profile.name}
                className="h-28 w-28 rounded-full object-cover ring-4 ring-indigo-100 shadow-md"
              />
            ) : (
              <div className="flex h-28 w-28 items-center justify-center rounded-full bg-indigo-600 text-4xl font-bold text-white ring-4 ring-indigo-100 shadow-md">
                {profile?.name?.[0]?.toUpperCase() ?? 'U'}
              </div>
            )}
            {uploading && (
              <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40">
                <span className="text-xs text-white font-medium">Uploading...</span>
              </div>
            )}
            <button
              onClick={() => fileRef.current?.click()}
              className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 text-white shadow-md transition hover:bg-indigo-700"
              title="Change photo"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
          </div>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />

          <h2 className="text-base font-bold text-slate-900 text-center">{profile?.name}</h2>
          <p className="mt-1 text-sm text-slate-500 text-center">{profile?.designation || profile?.role}</p>
          {badge && <span className={`mt-2 rounded-full px-3 py-1 text-xs font-semibold ${badge.color}`}>{badge.label}</span>}

          <div className="mt-6 w-full space-y-2 text-sm">
            {profile?.department && (
              <div className="flex items-center gap-2 text-slate-600">
                <span className="text-base">🏢</span> {profile.department}
              </div>
            )}
            {profile?.phone && (
              <div className="flex items-center gap-2 text-slate-600">
                <span className="text-base">📞</span> {profile.phone}
              </div>
            )}
            {profile?.email && (
              <div className="flex items-center gap-2 text-slate-600">
                <span className="text-base">✉️</span> <span className="truncate">{profile.email}</span>
              </div>
            )}
            {profile?.date_of_joining && (
              <div className="flex items-center gap-2 text-slate-600">
                <span className="text-base">📅</span> Joined {profile.date_of_joining}
              </div>
            )}
            {profile?.salary && (
              <div className="flex items-center gap-2 text-slate-600">
                <span className="text-base">💰</span> ${profile.salary.toLocaleString()} / yr
              </div>
            )}
          </div>

          <div className="mt-4 w-full">
            <span className={`block w-full rounded-full px-3 py-1.5 text-center text-xs font-semibold ${profile?.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {profile?.status === 'active' ? '● Active' : '● Inactive'}
            </span>
          </div>

          <button
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            className="mt-4 w-full rounded-lg border border-slate-200 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-60"
          >
            {uploading ? 'Uploading...' : '📷 Change Photo'}
          </button>
        </div>

        {/* ── Info / Edit Card ── */}
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          {!editMode ? (
            <>
              <h2 className="text-base font-semibold text-slate-900 mb-6">Personal Information</h2>
              <dl className="grid gap-5 sm:grid-cols-2">
                <InfoRow label="Full Name" value={profile?.name} />
                <InfoRow label="Email" value={profile?.email} />
                <InfoRow label="Phone" value={profile?.phone} />
                <InfoRow label="Department" value={profile?.department} />
                <InfoRow label="Designation" value={profile?.designation} />
                <InfoRow label="Role" value={badge?.label} />
                <InfoRow label="Date of Joining" value={profile?.date_of_joining} />
                <InfoRow label="Status" value={profile?.status} />
                {profile?.bio && (
                  <div className="sm:col-span-2">
                    <dt className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-1">Bio</dt>
                    <dd className="text-sm text-slate-700 leading-6">{profile.bio}</dd>
                  </div>
                )}
              </dl>
            </>
          ) : (
            <>
              <h2 className="text-base font-semibold text-slate-900 mb-6">Edit Profile</h2>
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Full Name" value={name} onChange={setName} />
                <Field label="Phone" value={phone} onChange={setPhone} placeholder="+1 555 000 0000" />
                <Field label="Department" value={department} onChange={setDepartment} />
                <Field label="Designation" value={designation} onChange={setDesignation} />
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold uppercase tracking-widest text-slate-400 mb-1.5">Bio</label>
                  <textarea
                    className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 resize-none"
                    rows={3}
                    value={bio}
                    onChange={e => setBio(e.target.value)}
                    placeholder="Write a short bio..."
                  />
                </div>
                <div className="sm:col-span-2 flex gap-3 pt-2">
                  <button onClick={handleSave} disabled={saving} className="rounded-lg bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:opacity-60">
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button onClick={() => { setEditMode(false); setError(''); setSuccess('') }} className="rounded-lg border border-slate-200 px-6 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">
                    Cancel
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </HRLayout>
  )
}

function InfoRow({ label, value }: { label: string; value?: string | null }) {
  return (
    <div>
      <dt className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-1">{label}</dt>
      <dd className="text-sm font-medium text-slate-900">{value || <span className="text-slate-400">—</span>}</dd>
    </div>
  )
}

function Field({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <div>
      <label className="block text-xs font-semibold uppercase tracking-widest text-slate-400 mb-1.5">{label}</label>
      <input
        className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </div>
  )
}
