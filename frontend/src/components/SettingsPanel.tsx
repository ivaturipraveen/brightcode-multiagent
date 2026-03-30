import type { UserProfile } from '../lib/api'

type SettingsPanelProps = {
  profile: UserProfile
  draftProfile: UserProfile
  isOpen: boolean
  onClose: () => void
  onChange: (field: keyof UserProfile, value: string) => void
  onSave: () => void
}

export function SettingsPanel({
  profile,
  draftProfile,
  isOpen,
  onClose,
  onChange,
  onSave,
}: SettingsPanelProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/35 px-4 py-6 backdrop-blur-sm">
      <div className="w-full max-w-2xl rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_24px_90px_rgba(15,23,42,0.18)] sm:p-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-sky-600">Settings</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">Profile</h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Update how your profile appears in the lower-left corner of the chat interface.
            </p>
          </div>
          <button className="rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-600" onClick={onClose}>
            Close
          </button>
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[220px_minmax(0,1fr)]">
          <div className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-5 text-center">
            {draftProfile.avatar_url ? (
              <img src={draftProfile.avatar_url} alt={draftProfile.name} className="mx-auto h-28 w-28 rounded-full object-cover" />
            ) : (
              <div className="mx-auto flex h-28 w-28 items-center justify-center rounded-full bg-slate-900 text-3xl font-semibold text-white">
                {(draftProfile.name || profile.name || 'U').slice(0, 1).toUpperCase()}
              </div>
            )}
            <p className="mt-4 text-base font-medium text-slate-900">{draftProfile.name || 'Your name'}</p>
            <p className="mt-1 text-sm text-slate-500">{draftProfile.email || 'your@email.com'}</p>
          </div>

          <div className="space-y-5">
            <label className="block space-y-2">
              <span className="text-sm font-medium text-slate-700">Display name</span>
              <input
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 outline-none transition focus:border-sky-400 focus:bg-white focus:ring-4 focus:ring-sky-100"
                value={draftProfile.name}
                onChange={(e) => onChange('name', e.target.value)}
                placeholder="Your name"
              />
            </label>

            <label className="block space-y-2">
              <span className="text-sm font-medium text-slate-700">Email</span>
              <input
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 outline-none transition focus:border-sky-400 focus:bg-white focus:ring-4 focus:ring-sky-100"
                value={draftProfile.email}
                onChange={(e) => onChange('email', e.target.value)}
                placeholder="you@example.com"
              />
            </label>

            <label className="block space-y-2">
              <span className="text-sm font-medium text-slate-700">Profile picture URL</span>
              <input
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 outline-none transition focus:border-sky-400 focus:bg-white focus:ring-4 focus:ring-sky-100"
                value={draftProfile.avatar_url}
                onChange={(e) => onChange('avatar_url', e.target.value)}
                placeholder="https://example.com/avatar.jpg"
              />
            </label>

            <label className="block space-y-2">
              <span className="text-sm font-medium text-slate-700">About</span>
              <textarea
                className="min-h-[120px] w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 outline-none transition focus:border-sky-400 focus:bg-white focus:ring-4 focus:ring-sky-100"
                value={draftProfile.bio}
                onChange={(e) => onChange('bio', e.target.value)}
                placeholder="Write a short profile note..."
              />
            </label>

            <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-4 text-sm leading-6 text-slate-500">
              Profile changes are now saved through the backend API and will persist across sessions.
            </div>

            <div className="flex justify-end gap-3">
              <button className="rounded-2xl border border-slate-200 px-5 py-3 text-sm font-medium text-slate-600" onClick={onClose}>
                Cancel
              </button>
              <button className="rounded-2xl bg-sky-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-sky-700" onClick={onSave}>
                Save changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
