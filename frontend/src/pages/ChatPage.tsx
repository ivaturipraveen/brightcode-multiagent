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
        const exists = data.find((conversation) => conversation.id === streamedConversationId)
        if (exists) {
          setActiveConversationId(streamedConversationId)
        }
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
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col px-4 py-6 sm:px-6 lg:px-8">
        <header className="mb-6 flex flex-col gap-4 rounded-[2rem] border border-slate-200 bg-white/90 px-6 py-5 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-600">OpenClaw chat</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">Chat with full conversation history</h1>
            <p className="mt-2 text-sm leading-6 text-slate-500">Browse past conversations in the sidebar and jump between threads instantly.</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-700">
              Live SSE stream
            </div>
            <button
              className="rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
              onClick={() => {
                localStorage.removeItem('token')
                window.location.href = '/login'
              }}
            >
              Logout
            </button>
          </div>
        </header>

        <div className="grid flex-1 gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
          {sidebarLoading ? (
            <div className="rounded-[2rem] border border-slate-200 bg-white p-6 text-sm text-slate-500 shadow-[0_20px_60px_rgba(15,23,42,0.06)]">
              Loading conversations...
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

          <section className="flex min-h-[70vh] w-full flex-col rounded-[2rem] border border-slate-200 bg-white shadow-[0_20px_60px_rgba(15,23,42,0.06)]">
            <div ref={containerRef} className="flex-1 space-y-6 overflow-y-auto px-5 py-6 sm:px-7">
              {messages.length === 0 ? (
                <div className="flex h-full min-h-[420px] flex-col items-center justify-center rounded-[1.5rem] border border-dashed border-slate-200 bg-slate-50 px-6 text-center">
                  <div className="rounded-full bg-sky-100 px-4 py-1 text-sm font-medium text-sky-700">Ready to chat</div>
                  <h3 className="mt-5 text-2xl font-semibold text-slate-900">Start a new conversation</h3>
                  <p className="mt-3 max-w-md text-sm leading-7 text-slate-500">
                    Your conversation history will appear in the sidebar so you can reopen previous chats anytime.
                  </p>
                </div>
              ) : (
                messages.map((message, index) => (
                  <div key={`${message.role}-${index}`} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div
                      className={`max-w-[85%] whitespace-pre-wrap rounded-[1.75rem] px-5 py-4 text-sm leading-7 shadow-sm ${
                        message.role === 'user'
                          ? 'bg-slate-900 text-white'
                          : 'border border-slate-200 bg-slate-50 text-slate-800'
                      }`}
                    >
                      {message.content || (loading && message.role === 'assistant' ? 'Thinking…' : '')}
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="border-t border-slate-100 px-5 py-5 sm:px-7">
              <div className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-3 shadow-inner shadow-slate-100">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
                  <div className="flex-1">
                    <label className="mb-2 block text-sm font-medium text-slate-600">Message</label>
                    <input
                      className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3.5 text-slate-900 outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
                      placeholder="Ask something useful..."
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault()
                          void handleSend()
                        }
                      }}
                    />
                  </div>
                  <button
                    className="rounded-2xl bg-sky-600 px-6 py-3.5 font-medium text-white transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:bg-sky-300"
                    onClick={() => void handleSend()}
                    disabled={loading}
                  >
                    {loading ? 'Sending...' : 'Send'}
                  </button>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>

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
