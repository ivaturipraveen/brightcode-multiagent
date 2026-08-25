import { FormEvent, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'

type TodoFilter = 'all' | 'active' | 'completed'

type TodoItem = {
  id: number
  text: string
  completed: boolean
  createdAt: string
}

const STORAGE_KEY = 'brightcone.todo.items'

const starterTodos: TodoItem[] = [
  {
    id: 1,
    text: 'Sketch today\'s top priorities',
    completed: false,
    createdAt: 'Today',
  },
  {
    id: 2,
    text: 'Ship one small win before lunch',
    completed: true,
    createdAt: 'Today',
  },
]

function loadTodos(): TodoItem[] {
  if (typeof window === 'undefined') return starterTodos

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return starterTodos
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return starterTodos

    return parsed.filter((item): item is TodoItem => (
      typeof item?.id === 'number'
      && typeof item?.text === 'string'
      && typeof item?.completed === 'boolean'
      && typeof item?.createdAt === 'string'
    ))
  } catch {
    return starterTodos
  }
}

function saveTodos(items: TodoItem[]) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
}

export function TodoPage() {
  const [todos, setTodos] = useState<TodoItem[]>(() => loadTodos())
  const [draft, setDraft] = useState('')
  const [filter, setFilter] = useState<TodoFilter>('all')

  useEffect(() => {
    saveTodos(todos)
  }, [todos])

  const activeCount = useMemo(() => todos.filter((item) => !item.completed).length, [todos])
  const completedCount = todos.length - activeCount

  const visibleTodos = useMemo(() => {
    if (filter === 'active') return todos.filter((item) => !item.completed)
    if (filter === 'completed') return todos.filter((item) => item.completed)
    return todos
  }, [filter, todos])

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const text = draft.trim()
    if (!text) return

    setTodos((current) => [
      {
        id: Date.now(),
        text,
        completed: false,
        createdAt: 'Just now',
      },
      ...current,
    ])
    setDraft('')
  }

  function toggleTodo(id: number) {
    setTodos((current) => current.map((item) => (
      item.id === id ? { ...item, completed: !item.completed } : item
    )))
  }

  function removeTodo(id: number) {
    setTodos((current) => current.filter((item) => item.id !== id))
  }

  function clearCompleted() {
    setTodos((current) => current.filter((item) => !item.completed))
  }

  function markAllCompleted() {
    setTodos((current) => current.map((item) => (
      item.completed ? item : { ...item, completed: true }
    )))
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#fff6ef,_#fff,_#f6f7fb)] px-6 py-10 text-slate-900 dark:bg-[radial-gradient(circle_at_top,_#1d1320,_#0d0e14,_#090a0f)] dark:text-white lg:px-8">
      <div className="mx-auto max-w-5xl">
        <header className="flex flex-col gap-6 rounded-[2rem] border border-black/5 bg-white/85 p-8 shadow-[0_20px_70px_rgba(15,23,42,0.08)] backdrop-blur dark:border-white/10 dark:bg-white/5 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[#cf6c4a]">Simple planner</p>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">Todo app that stays out of your way.</h1>
            <p className="mt-4 text-base leading-7 text-slate-600 dark:text-slate-300">
              Quick capture, clean filtering, and local persistence so your list is still here when you come back.
            </p>
          </div>
          <div className="flex items-center gap-3 text-sm text-slate-500 dark:text-slate-400">
            <Link to="/" className="rounded-full border border-black/10 px-4 py-2 font-medium transition hover:border-[#cf6c4a] hover:text-[#cf6c4a] dark:border-white/10">
              Back home
            </Link>
            <div className="rounded-full bg-slate-900 px-4 py-2 font-medium text-white dark:bg-white dark:text-slate-900">
              {activeCount} active
            </div>
          </div>
        </header>

        <section className="mt-8 grid gap-8 lg:grid-cols-[1.6fr,0.9fr]">
          <div className="rounded-[2rem] border border-black/5 bg-white p-8 shadow-[0_16px_60px_rgba(15,23,42,0.07)] dark:border-white/10 dark:bg-[#11131a]">
            <form className="flex flex-col gap-4 sm:flex-row" onSubmit={handleSubmit}>
              <label className="sr-only" htmlFor="todo-input">Add a task</label>
              <input
                id="todo-input"
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                placeholder="What needs doing?"
                className="flex-1 rounded-2xl border border-black/10 bg-[#faf8f3] px-5 py-4 text-base outline-none transition focus:border-[#cf6c4a] focus:bg-white focus:ring-4 focus:ring-[#f6d7cb] dark:border-white/10 dark:bg-white/5 dark:text-white dark:focus:bg-white/10"
              />
              <button
                type="submit"
                className="rounded-2xl bg-[#cf6c4a] px-6 py-4 text-sm font-semibold text-white transition hover:bg-[#b85938]"
              >
                Add task
              </button>
            </form>

            <div className="mt-6 flex flex-wrap gap-3" role="tablist" aria-label="Todo filters">
              {(['all', 'active', 'completed'] as TodoFilter[]).map((value) => {
                const isActive = filter === value
                return (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setFilter(value)}
                    className={`rounded-full px-4 py-2 text-sm font-medium transition ${isActive ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900' : 'border border-black/10 text-slate-600 hover:border-[#cf6c4a] hover:text-[#cf6c4a] dark:border-white/10 dark:text-slate-300'}`}
                    aria-pressed={isActive}
                  >
                    {value[0].toUpperCase() + value.slice(1)}
                  </button>
                )
              })}
            </div>

            <div className="mt-8 space-y-4">
              {visibleTodos.length === 0 ? (
                <div className="rounded-3xl border border-dashed border-black/10 px-6 py-12 text-center text-slate-500 dark:border-white/10 dark:text-slate-400">
                  Nothing here yet. Add a task or switch filters.
                </div>
              ) : (
                visibleTodos.map((item) => (
                  <article
                    key={item.id}
                    className="flex flex-col gap-4 rounded-3xl border border-black/5 bg-[#fcfcfd] p-5 shadow-sm dark:border-white/10 dark:bg-white/5 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="flex items-start gap-4">
                      <button
                        type="button"
                        onClick={() => toggleTodo(item.id)}
                        className={`mt-1 flex h-6 w-6 items-center justify-center rounded-full border transition ${item.completed ? 'border-emerald-500 bg-emerald-500 text-white' : 'border-slate-300 bg-white text-transparent dark:border-slate-500 dark:bg-transparent'}`}
                        aria-label={`Mark ${item.text} as ${item.completed ? 'active' : 'completed'}`}
                      >
                        ✓
                      </button>
                      <div>
                        <p className={`text-base font-medium ${item.completed ? 'text-slate-400 line-through dark:text-slate-500' : 'text-slate-900 dark:text-white'}`}>
                          {item.text}
                        </p>
                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Added {item.createdAt}</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeTodo(item.id)}
                      className="text-sm font-medium text-slate-500 transition hover:text-rose-500 dark:text-slate-400"
                    >
                      Remove
                    </button>
                  </article>
                ))
              )}
            </div>
          </div>

          <aside className="space-y-6">
            <div className="rounded-[2rem] border border-black/5 bg-white p-7 shadow-[0_16px_60px_rgba(15,23,42,0.06)] dark:border-white/10 dark:bg-[#11131a]">
              <h2 className="text-lg font-semibold">Overview</h2>
              <dl className="mt-5 space-y-4">
                <div className="flex items-center justify-between rounded-2xl bg-[#f7f4ef] px-4 py-3 dark:bg-white/5">
                  <dt className="text-sm text-slate-500 dark:text-slate-400">Total tasks</dt>
                  <dd className="text-lg font-semibold">{todos.length}</dd>
                </div>
                <div className="flex items-center justify-between rounded-2xl bg-[#f7f4ef] px-4 py-3 dark:bg-white/5">
                  <dt className="text-sm text-slate-500 dark:text-slate-400">Completed</dt>
                  <dd className="text-lg font-semibold">{completedCount}</dd>
                </div>
                <div className="flex items-center justify-between rounded-2xl bg-[#f7f4ef] px-4 py-3 dark:bg-white/5">
                  <dt className="text-sm text-slate-500 dark:text-slate-400">Still active</dt>
                  <dd className="text-lg font-semibold">{activeCount}</dd>
                </div>
              </dl>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={markAllCompleted}
                  className="w-full rounded-2xl bg-slate-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
                  disabled={activeCount === 0}
                >
                  Mark all complete
                </button>
                <button
                  type="button"
                  onClick={clearCompleted}
                  className="w-full rounded-2xl border border-black/10 px-4 py-3 text-sm font-medium transition hover:border-[#cf6c4a] hover:text-[#cf6c4a] disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/10"
                  disabled={completedCount === 0}
                >
                  Clear completed
                </button>
              </div>
            </div>

            <div className="rounded-[2rem] border border-black/5 bg-[#1f2937] p-7 text-white shadow-[0_16px_60px_rgba(15,23,42,0.15)] dark:border-white/10 dark:bg-[#161a23]">
              <h2 className="text-lg font-semibold">Why this version?</h2>
              <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-200">
                <li>• No login required.</li>
                <li>• Saves to local storage automatically.</li>
                <li>• Filter between all, active, and completed items.</li>
                <li>• Built as a standalone route at <span className="font-semibold text-white">/todo</span>.</li>
              </ul>
            </div>
          </aside>
        </section>
      </div>
    </div>
  )
}
