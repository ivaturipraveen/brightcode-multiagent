import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  clearAdminToken,
  fetchAllContent,
  getAdminToken,
  updateContentText,
  uploadContentImage,
} from '../../lib/adminApi'
import { apiUrl } from '../../lib/api'

// ── Section grouping for the sidebar ────────────────────────────────────────
const SECTIONS = [
  { id: 'hero',     label: '🏠 Hero',     prefix: 'about.hero' },
  { id: 'mission',  label: '🎯 Mission',  prefix: 'about.mission' },
  { id: 'features', label: '⚡ Features', prefix: 'about.feature' },
  { id: 'team',     label: '👥 Team',     prefix: 'about.team' },
  { id: 'timeline', label: '🗓 Timeline', prefix: 'about.timeline' },
  { id: 'values',   label: '💡 Values',   prefix: 'about.value' },
  { id: 'cta',      label: '🚀 CTA',      prefix: 'about.cta' },
]

function friendlyLabel(key: string): string {
  return key.split('.').slice(1).join(' › ').replace(/-/g, ' ')
}

interface ContentEntry {
  key: string
  value: string
  contentType: 'text' | 'image'
}

// ── Single editable row ──────────────────────────────────────────────────────
function ContentRow({
  entry,
  token,
  onSaved,
}: {
  entry: ContentEntry
  token: string
  onSaved: (key: string, newValue: string) => void
}) {
  const [draft, setDraft] = useState(entry.value)
  const [saving, setSaving] = useState(false)
  const [status, setStatus] = useState<'idle' | 'saved' | 'error'>('idle')
  const fileRef = useRef<HTMLInputElement>(null)

  const save = async () => {
    setSaving(true)
    setStatus('idle')
    try {
      await updateContentText(entry.key, draft, token)
      onSaved(entry.key, draft)
      setStatus('saved')
    } catch {
      setStatus('error')
    } finally {
      setSaving(false)
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setSaving(true)
    setStatus('idle')
    try {
      const url = await uploadContentImage(entry.key, file, token)
      setDraft(url)
      onSaved(entry.key, url)
      setStatus('saved')
    } catch {
      setStatus('error')
    } finally {
      setSaving(false)
    }
  }

  const isImage = entry.contentType === 'image'
  const isDirty = draft !== entry.value

  return (
    <div className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm transition hover:shadow-md">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-2">
            {friendlyLabel(entry.key)}
          </p>

          {isImage ? (
            <div className="space-y-3">
              {draft ? (
                <img
                  src={draft.startsWith('/') ? apiUrl(draft) : draft}
                  alt={entry.key}
                  className="h-28 w-auto rounded-xl border border-black/5 object-cover shadow-sm"
                />
              ) : (
                <div className="flex h-24 w-full items-center justify-center rounded-xl border-2 border-dashed border-slate-200 text-slate-400 text-sm">
                  No image uploaded
                </div>
              )}
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
              />
              <button
                onClick={() => fileRef.current?.click()}
                disabled={saving}
                className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 transition disabled:opacity-50"
              >
                {saving ? 'Uploading…' : '📁 Choose image'}
              </button>
            </div>
          ) : draft.length > 80 ? (
            <textarea
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              rows={3}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-100 resize-y"
            />
          ) : (
            <input
              type="text"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
            />
          )}
        </div>

        {/* Save button (text only) */}
        {!isImage && (
          <button
            onClick={save}
            disabled={saving}
            className="mt-6 flex-shrink-0 rounded-xl bg-violet-600 px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-violet-700 disabled:opacity-40"
          >
            {saving ? '…' : 'Save'}
          </button>
        )}
      </div>

      {/* Status pill */}
      {status === 'saved' && (
        <p className="mt-2 text-xs font-medium text-emerald-600">✅ Saved — live on site</p>
      )}
      {status === 'error' && (
        <p className="mt-2 text-xs font-medium text-red-500">❌ Save failed. Try again.</p>
      )}
    </div>
  )
}

// ── Main page ────────────────────────────────────────────────────────────────
export function AdminContentPage() {
  const navigate = useNavigate()
  const token = getAdminToken()
  const [activeSection, setActiveSection] = useState('hero')
  const [content, setContent] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    if (!token) {
      navigate('/admin/login')
      return
    }
    fetchAllContent()
      .then(setContent)
      .catch(() => setError('Failed to load content'))
      .finally(() => setLoading(false))
  }, [token, navigate])

  const handleSaved = (key: string, value: string) => {
    setContent((prev) => ({ ...prev, [key]: value }))
  }

  const logout = () => {
    clearAdminToken()
    navigate('/admin/login')
  }

  // Filter entries for active section
  const currentSection = SECTIONS.find((s) => s.id === activeSection)!
  const entries: ContentEntry[] = Object.entries(content)
    .filter(([key]) => {
      const matchSection = key.startsWith(currentSection.prefix)
      const matchSearch = !searchQuery || key.toLowerCase().includes(searchQuery.toLowerCase())
      return matchSection && matchSearch
    })
    .map(([key, value]) => ({
      key,
      value,
      contentType: key.includes('.avatar') || key.includes('.image') ? 'image' : 'text',
    }))

  return (
    <div className="flex min-h-screen bg-[#f5f5fa]">
      {/* ── Sidebar ──────────────────────────────────────────────────────── */}
      <aside className="fixed left-0 top-0 h-full w-64 border-r border-black/5 bg-white shadow-sm flex flex-col">
        {/* Logo */}
        <div className="flex items-center gap-3 px-6 py-5 border-b border-black/5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-blue-600 text-white text-sm font-bold shadow">
            B
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-900">Brightcone</p>
            <p className="text-xs text-slate-400">Content Manager</p>
          </div>
        </div>

        {/* Search */}
        <div className="px-4 py-3 border-b border-black/5">
          <input
            type="text"
            placeholder="Search fields…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-700 outline-none focus:border-violet-400 focus:ring-1 focus:ring-violet-200"
          />
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-3 px-3">
          {SECTIONS.map((s) => (
            <button
              key={s.id}
              onClick={() => { setActiveSection(s.id); setSearchQuery('') }}
              className={[
                'w-full text-left rounded-xl px-4 py-2.5 text-sm font-medium transition mb-1',
                activeSection === s.id
                  ? 'bg-violet-50 text-violet-700'
                  : 'text-slate-600 hover:bg-slate-50',
              ].join(' ')}
            >
              {s.label}
            </button>
          ))}
        </nav>

        {/* Footer */}
        <div className="border-t border-black/5 px-4 py-4 space-y-2">
          <a
            href="/about"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-medium text-slate-600 hover:bg-slate-50 transition"
          >
            🌐 Preview live site
          </a>
          <button
            onClick={logout}
            className="w-full rounded-xl border border-red-100 bg-red-50 px-4 py-2.5 text-xs font-medium text-red-600 hover:bg-red-100 transition"
          >
            Sign out
          </button>
        </div>
      </aside>

      {/* ── Main content ─────────────────────────────────────────────────── */}
      <main className="ml-64 flex-1 p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-slate-900">
            {currentSection.label} Content
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Changes save instantly to the database and reflect on the live site.
          </p>
        </div>

        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="h-8 w-8 rounded-full border-2 border-violet-300 border-t-violet-600 animate-spin" />
          </div>
        )}

        {error && (
          <div className="rounded-2xl bg-red-50 border border-red-100 p-6 text-sm text-red-600">
            {error}
          </div>
        )}

        {!loading && !error && (
          <>
            {entries.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-200 p-12 text-center text-slate-400 text-sm">
                No content fields found for this section.
              </div>
            ) : (
              <div className="grid gap-4 lg:grid-cols-2">
                {entries.map((entry) => (
                  <ContentRow
                    key={entry.key}
                    entry={entry}
                    token={token!}
                    onSaved={handleSaved}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  )
}
