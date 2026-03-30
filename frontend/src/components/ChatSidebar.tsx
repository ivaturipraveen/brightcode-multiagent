import type { Conversation, UserProfile } from '../lib/api'

type ChatSidebarProps = {
  conversations: Conversation[]
  activeConversationId: number | null
  onSelectConversation: (id: number) => void
  onNewChat: () => void
  profile: UserProfile
  onOpenSettings: () => void
}

export function ChatSidebar({
  conversations,
  activeConversationId,
  onSelectConversation,
  onNewChat,
  profile,
  onOpenSettings,
}: ChatSidebarProps) {
  const initials = profile.name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('') || 'U'

  return (
    <aside className="flex h-full w-full max-w-sm flex-col rounded-[2rem] border border-slate-200 bg-white p-4 shadow-[0_20px_60px_rgba(15,23,42,0.06)]">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">Sidebar</p>
          <h2 className="mt-2 text-xl font-semibold text-slate-900">Conversations</h2>
        </div>
        <button
          className="rounded-2xl bg-sky-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-sky-700"
          onClick={onNewChat}
        >
          New chat
        </button>
      </div>

      <div className="flex-1 space-y-2 overflow-y-auto pr-1">
        {conversations.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-6 text-sm leading-6 text-slate-500">
            No conversations yet. Start a new chat and it will appear here.
          </div>
        ) : (
          conversations.map((conversation) => {
            const active = conversation.id === activeConversationId
            return (
              <button
                key={conversation.id}
                className={`w-full rounded-2xl border px-4 py-3 text-left transition ${
                  active
                    ? 'border-sky-200 bg-sky-50 text-sky-900'
                    : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300 hover:bg-white'
                }`}
                onClick={() => onSelectConversation(conversation.id)}
              >
                <div className="truncate text-sm font-medium">{conversation.title || 'Untitled conversation'}</div>
                <div className="mt-1 text-xs text-slate-400">
                  {conversation.updated_at ? new Date(conversation.updated_at).toLocaleString() : 'Just now'}
                </div>
              </button>
            )
          })
        )}
      </div>

      <button
        className="mt-4 flex items-center gap-3 rounded-[1.5rem] border border-slate-200 bg-slate-50 px-3 py-3 text-left transition hover:border-slate-300 hover:bg-white"
        onClick={onOpenSettings}
      >
        {profile.avatar_url ? (
          <img src={profile.avatar_url} alt={profile.name} className="h-11 w-11 rounded-full object-cover" />
        ) : (
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-900 text-sm font-semibold text-white">
            {initials}
          </div>
        )}
        <div className="min-w-0 flex-1">
          <div className="truncate text-sm font-medium text-slate-900">{profile.name}</div>
          <div className="truncate text-xs text-slate-500">{profile.email}</div>
        </div>
        <div className="text-xs font-medium text-sky-600">Settings</div>
      </button>
    </aside>
  )
}
