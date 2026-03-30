import { useMemo, useState } from 'react'
import { API_BASE_URL } from '../lib/api'

type Message = {
  role: 'user' | 'assistant'
  content: string
}

export function ChatPage() {
  const token = useMemo(() => localStorage.getItem('token') ?? '', [])
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(false)

  async function handleSend() {
    if (!input.trim() || loading) return

    const userMessage: Message = { role: 'user', content: input.trim() }
    const assistantIndex = messages.length + 1
    setMessages((prev) => [...prev, userMessage, { role: 'assistant', content: '' }])
    setInput('')
    setLoading(true)

    try {
      const response = await fetch(`${API_BASE_URL}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ message: userMessage.content }),
      })

      if (!response.ok || !response.body) {
        throw new Error('Unable to start chat stream')
      }

      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let buffer = ''

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
          const parsed = JSON.parse(payload) as { token?: string }
          if (parsed.token) {
            setMessages((prev) => {
              const next = [...prev]
              next[assistantIndex] = {
                ...next[assistantIndex],
                content: `${next[assistantIndex]?.content ?? ''}${parsed.token}`,
              }
              return next
            })
          }
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

  return (
    <div className="flex min-h-screen flex-col bg-slate-950 text-slate-100">
      <header className="border-b border-slate-800 px-6 py-4">
        <div className="mx-auto flex w-full max-w-4xl items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-cyan-400">GPT-4o chat</p>
            <h1 className="mt-1 text-xl font-semibold">OpenClaw Assistant</h1>
          </div>
          <button
            className="rounded-lg border border-slate-700 px-3 py-2 text-sm text-slate-300"
            onClick={() => {
              localStorage.removeItem('token')
              window.location.href = '/login'
            }}
          >
            Logout
          </button>
        </div>
      </header>
      <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-4 px-4 py-6">
        <div className="flex-1 space-y-4 overflow-y-auto rounded-2xl border border-slate-800 bg-slate-900/50 p-4">
          {messages.length === 0 ? (
            <div className="flex h-full items-center justify-center text-slate-500">Start a conversation.</div>
          ) : (
            messages.map((message, index) => (
              <div key={`${message.role}-${index}`} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] rounded-2xl px-4 py-3 whitespace-pre-wrap ${message.role === 'user' ? 'bg-cyan-500 text-slate-950' : 'bg-slate-800 text-slate-100'}`}>
                  {message.content || (loading && message.role === 'assistant' ? '…' : '')}
                </div>
              </div>
            ))
          )}
        </div>
        <div className="flex gap-3 rounded-2xl border border-slate-800 bg-slate-900 p-3">
          <input
            className="flex-1 rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none"
            placeholder="Ask something..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                void handleSend()
              }
            }}
          />
          <button className="rounded-xl bg-cyan-500 px-5 py-3 font-medium text-slate-950 disabled:opacity-60" onClick={() => void handleSend()} disabled={loading}>
            {loading ? 'Sending...' : 'Send'}
          </button>
        </div>
      </main>
    </div>
  )
}
