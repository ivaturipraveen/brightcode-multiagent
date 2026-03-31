import { useEffect, useMemo, useRef, useState } from 'react'
import { ChatSidebar } from '../components/ChatSidebar'
import { SettingsPanel } from '../components/SettingsPanel'
import {
  apiUrl,
  type ChatMessage,
  type Conversation,
  getJson,
  putJson,
  type UserProfile,
} from '../lib/api'

export function ChatPage() {
  const token = useMemo(() => localStorage.getItem('token') ?? '', [])
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [activeConversationId, setActiveConversationId] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const [sidebarLoading, setSidebarLoading] = useState(true)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [profile, setProfile] = useState<UserProfile>({
    name: 'OpenClaw User',
    email: 'you@example.com',
    avatar_url: '',
    bio: '',
  })
  const [draftProfile, setDraftProfile] = useState<UserProfile>({
    name: 'OpenClaw User',
    email: 'you@example.com',
    avatar_url: '',
    bio: '',
  })
  const containerRef = useRef<HTMLDivElement | null>(null)

  async function loadConversations() {
    const data = await getJson<Conversation[]>('/conversations', token)
    setConversations(data)
    return data
  }

  async function loadProfile() {
    const data = await getJson<UserProfile>('/profile', token)
    setProfile(data)
    setDraftProfile(data)
  }

  async function loadConversationMessages(conversationId: number) {
    const data = await getJson<ChatMessage[]>(`/conversations/${conversationId}/messages`, token)
    setMessages(data)
    setActiveConversationId(conversationId)
    requestAnimationFrame(() => {
      containerRef.current?.scrollTo({ top: containerRef.current.scrollHeight, behavior: 'smooth' })
    })
  }

  useEffect(() => {
    async function initialize() {
      try {
        await loadProfile()
        const data = await loadConversations()
        if (data.length > 0) {
          await loadConversationMessages(data[0].id)
        }
      } finally {
        setSidebarLoading(false)
      }
    }
    void initialize()
  }, [])

  async function handleSend() {
    const nextInput = input.trim()
    if (!nextInput || loading) return

    const userMessage: ChatMessage = { role: 'user', content: nextInput }
    const assistantIndex = messages.length + 1
    setMessages((prev) => [...prev, userMessage, { role: 'assistant', content: '' }])
    setInput('')
    setLoading(true)

    requestAnimationFrame(() => {
      containerRef.current?.scrollTo({ top: containerRef.current.scrollHeight, behavior: 'smooth' })
    })

    try {
      const response = await fetch(apiUrl('/chat'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          message: userMessage.content,
          conversation_id: activeConversationId,
        }),
      })

      if (!response.ok || !response.body) {
        throw new Error('Unable to start chat stream')
      }

      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let buffer = ''
      let streamedConversationId = activeConversationId

      while (true) {
        const { value, done } = await reader.read()
        if (done) break
        buffer += decoder.decode(value, { stream: true })

        const events = buffer.split('\n\n')
        buffer = events.pop() ?? ''

        for (const event of events) {
          if (!event.startsWith('data: ')) continue
          const payload = event.slice(6)
          if (payload === '[DONE]') continue
          const parsed = JSON.parse(payload) as { token?: string; conversation_id?: number }
          if (parsed.conversation_id && !streamedConversationId) {
            streamedConversationId = parsed.conversation_id
            setActiveConversationId(parsed.conversation_id)
          }
          if (parsed.token) {
            setMessages((prev) => {
              const next = [...prev]
              next[assistantIndex] = {
                ...next[assistantIndex],
                content: `${next[assistantIndex]?.content ?? ''}${parsed.token}`,
              }
              return next
            })
            requestAnimationFrame(() => {
              containerRef.current?.scrollTo({ top: containerRef.current.scrollHeight, behavior: 'smooth' })
            })
          }
        }
      }

      const data = await loadConversations()
      if (streamedConversationId) {
        const exists = data.find((c) => c.id === streamedConversationId)
        if (exists) setActiveConversationId(streamedConversationId)
      }
    } catch (error) {
      setMessages((prev) => {
        const next = [...prev]
        next[assistantIndex] = {
          role: 'assistant',
          content: error instanceof Error ? error.message : 'Something went wrong',
        }
        return next
      })
    } finally {
      setLoading(false)
    }
  }

  function handleNewChat() {
    setActiveConversationId(null)
    setMessages([])
    setInput('')
  }

  function handleOpenSettings() {
    setDraftProfile(profile)
    setSettingsOpen(true)
  }

  async function handleSaveProfile() {
    const updated = await putJson<UserProfile>('/profile', draftProfile, token)
    setProfile(updated)
    setDraftProfile(updated)
    setSettingsOpen(false)
  }

  return (
    <div className="flex h-screen bg-gray-50 font-sans antialiased">
      {/* Sidebar */}
      {sidebarLoading ? (
        <div className="flex w-72 flex-col border-r border-gray-100 bg-white px-4 py-6">
          <div className="flex flex-col gap-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-14 animate-pulse rounded-xl bg-gray-100" />
            ))}
          </div>
        </div>
      ) : (
        <ChatSidebar
          conversations={conversations}
          activeConversationId={activeConversationId}
          onSelectConversation={(id) => void loadConversationMessages(id)}
          onNewChat={handleNewChat}
          profile={profile}
          onOpenSettings={handleOpenSettings}
        />
      )}

      {/* Main chat area */}
      <main className="flex flex-1 flex-col overflow-hidden">
        {/* Top bar */}
        <header className="flex items-center justify-between border-b border-gray-100 bg-white px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600">
              <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <div>
              <h1 className="text-sm font-semibold text-gray-900">
                {activeConversationId
                  ? conversations.find((c) => c.id === activeConversationId)?.title ?? 'Conversation'
                  : 'New Chat'}
              </h1>
              <p className="text-xs text-gray-400">
                {loading ? 'Claude is typing...' : 'Powered by Claude Sonnet'}
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              localStorage.removeItem('token')
              window.location.href = '/login'
            }}
            className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-gray-500 transition hover:bg-gray-100 hover:text-gray-700"
          >
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Sign out
          </button>
        </header>

        {/* Messages */}
        <div
          ref={containerRef}
          className="flex-1 overflow-y-auto px-6 py-6"
          style={{ scrollbarWidth: 'thin', scrollbarColor: '#e2e8f0 transparent' }}
        >
          {messages.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 ring-1 ring-indigo-100">
                <svg className="h-8 w-8 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-900">How can I help you today?</h2>
              <p className="mt-2 max-w-sm text-sm text-gray-400">
                Ask me anything. I'll remember your conversation history so you can pick up where you left off.
              </p>
              <div className="mt-8 grid grid-cols-2 gap-3 text-left sm:grid-cols-3">
                {[
                  'Explain a concept',
                  'Write some code',
                  'Draft an email',
                  'Summarize text',
                  'Debug an error',
                  'Brainstorm ideas',
                ].map((prompt) => (
                  <button
                    key={prompt}
                    onClick={() => setInput(prompt)}
                    className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-600 shadow-sm transition hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="mx-auto max-w-3xl space-y-6">
              {messages.map((message, index) => (
                <div
                  key={`${message.role}-${index}`}
                  className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {message.role === 'assistant' && (
                    <div className="mt-1 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-indigo-600">
                      <svg className="h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                    </div>
                  )}
                  <div
                    className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                      message.role === 'user'
                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-100'
                        : 'bg-white text-gray-800 shadow-sm ring-1 ring-gray-100'
                    }`}
                  >
                    {message.content ? (
                      <p className="whitespace-pre-wrap">{message.content}</p>
                    ) : loading && message.role === 'assistant' ? (
                      <div className="flex items-center gap-1 px-1 py-0.5">
                        <span className="typing-dot h-1.5 w-1.5 rounded-full bg-gray-400" />
                        <span className="typing-dot h-1.5 w-1.5 rounded-full bg-gray-400" />
                        <span className="typing-dot h-1.5 w-1.5 rounded-full bg-gray-400" />
                      </div>
                    ) : null}
                  </div>
                  {message.role === 'user' && (
                    <div className="mt-1 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-gray-200 text-xs font-semibold text-gray-600">
                      {profile.name[0]?.toUpperCase() ?? 'U'}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Input area */}
        <div className="border-t border-gray-100 bg-white px-6 py-4">
          <div className="mx-auto max-w-3xl">
            <div className="flex items-end gap-3 rounded-2xl border border-gray-200 bg-gray-50 p-2 shadow-sm transition focus-within:border-indigo-300 focus-within:bg-white focus-within:shadow-md focus-within:shadow-indigo-50">
              <textarea
                className="max-h-40 min-h-[2.75rem] flex-1 resize-none bg-transparent px-3 py-2.5 text-sm text-gray-900 outline-none placeholder:text-gray-400"
                placeholder="Message Claude..."
                rows={1}
                value={input}
                onChange={(e) => {
                  setInput(e.target.value)
                  e.target.style.height = 'auto'
                  e.target.style.height = `${Math.min(e.target.scrollHeight, 160)}px`
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    void handleSend()
                  }
                }}
              />
              <button
                className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-indigo-300"
                onClick={() => void handleSend()}
                disabled={loading || !input.trim()}
                title="Send"
              >
                {loading ? (
                  <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                ) : (
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                )}
              </button>
            </div>
            <p className="mt-2 text-center text-xs text-gray-400">
              Press <kbd className="rounded bg-gray-100 px-1 py-0.5 text-gray-500">Enter</kbd> to send · <kbd className="rounded bg-gray-100 px-1 py-0.5 text-gray-500">Shift+Enter</kbd> for new line
            </p>
          </div>
        </div>
      </main>

      <SettingsPanel
        profile={profile}
        draftProfile={draftProfile}
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        onChange={(field, value) => setDraftProfile((prev) => ({ ...prev, [field]: value }))}
        onSave={() => void handleSaveProfile()}
      />
    </div>
  )
}
