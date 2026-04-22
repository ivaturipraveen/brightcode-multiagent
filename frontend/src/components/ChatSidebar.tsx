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
    <aside className="flex h-screen w-72 flex-shrink-0 flex-col border-r border-gray-100 bg-white dark:border-gray-800 dark:bg-gray-900">
      {/* Logo / App name */}
      <div className="flex items-center gap-2.5 border-b border-gray-100 px-5 py-4 dark:border-gray-800">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-600">
          <svg className="h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </div>
        <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">Brightcone Chat</span>
      </div>

      {/* New chat button */}
      <div className="px-3 pt-4">
        <button
          onClick={onNewChat}
          className="flex w-full items-center gap-2 rounded-xl border border-dashed border-gray-200 bg-gray-50 px-3.5 py-2.5 text-sm font-medium text-gray-500 transition hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:border-indigo-700 dark:hover:bg-indigo-950 dark:hover:text-indigo-400"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          New conversation
        </button>
      </div>

      {/* Section label */}
      <div className="px-5 pb-1 pt-5">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-600">Recent</p>
      </div>

      {/* Conversation list */}
      <div className="flex-1 overflow-y-auto px-3 pb-3">
        {conversations.length === 0 ? (
          <div className="px-2 py-4 text-xs text-gray-400 dark:text-gray-600">
            No conversations yet. Start a new chat!
          </div>
        ) : (
          <div className="space-y-0.5">
            {conversations.map((conversation) => {
              const active = conversation.id === activeConversationId
              return (
                <button
                  key={conversation.id}
                  onClick={() => onSelectConversation(conversation.id)}
                  className={`group flex w-full flex-col rounded-xl px-3 py-2.5 text-left transition ${
                    active
                      ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200'
                  }`}
                >
                  <span className="truncate text-sm font-medium">
                    {conversation.title || 'Untitled conversation'}
                  </span>
                  <span className={`mt-0.5 text-xs ${active ? 'text-indigo-400 dark:text-indigo-500' : 'text-gray-400 dark:text-gray-600'}`}>
                    {conversation.updated_at
                      ? new Date(conversation.updated_at).toLocaleDateString('en-US', { timeZone: 'America/New_York',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })
                      : 'Just now'}
                  </span>
                </button>
              )
            })}
          </div>
        )}
      </div>

      {/* User profile / Settings */}
      <button
        onClick={onOpenSettings}
        className="flex items-center gap-3 border-t border-gray-100 px-4 py-3.5 transition hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-800"
      >
        {profile.avatar_url ? (
          <img
            src={profile.avatar_url}
            alt={profile.name}
            className="h-8 w-8 rounded-full object-cover ring-2 ring-gray-100 dark:ring-gray-700"
          />
        ) : (
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-xs font-semibold text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300">
            {initials}
          </div>
        )}
        <div className="min-w-0 flex-1 text-left">
          <p className="truncate text-sm font-medium text-gray-900 dark:text-gray-100">{profile.name}</p>
          <p className="truncate text-xs text-gray-400 dark:text-gray-500">{profile.email}</p>
        </div>
        <svg className="h-4 w-4 flex-shrink-0 text-gray-400 dark:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      </button>
    </aside>
  )
}
