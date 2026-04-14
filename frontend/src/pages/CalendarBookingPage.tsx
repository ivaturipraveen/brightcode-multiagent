import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTheme } from '../lib/theme'

type Slot = {
  label: string
  available?: boolean
}

type DayOption = {
  id: string
  weekday: string
  month: string
  day: number
  slots: Slot[]
}

function ThemeToggle() {
  const { theme, toggle } = useTheme()
  return (
    <button
      onClick={toggle}
      aria-label="Toggle dark mode"
      className="flex h-9 w-9 items-center justify-center rounded-full border border-black/10 bg-white/80 text-slate-600 shadow-sm backdrop-blur transition hover:bg-slate-100 dark:border-white/10 dark:bg-white/5 dark:text-slate-300 dark:hover:bg-white/10"
    >
      {theme === 'dark' ? (
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M17.657 17.657l-.707-.707M6.343 6.343l-.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
        </svg>
      ) : (
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
        </svg>
      )}
    </button>
  )
}

const dayOptions: DayOption[] = [
  {
    id: '2026-04-15',
    weekday: 'Wed',
    month: 'Apr',
    day: 15,
    slots: [
      { label: '09:00 AM' },
      { label: '10:30 AM' },
      { label: '01:00 PM' },
      { label: '03:30 PM' },
    ],
  },
  {
    id: '2026-04-16',
    weekday: 'Thu',
    month: 'Apr',
    day: 16,
    slots: [
      { label: '08:30 AM' },
      { label: '11:00 AM' },
      { label: '02:00 PM' },
      { label: '04:30 PM', available: false },
    ],
  },
  {
    id: '2026-04-17',
    weekday: 'Fri',
    month: 'Apr',
    day: 17,
    slots: [
      { label: '09:30 AM' },
      { label: '12:00 PM' },
      { label: '02:30 PM' },
      { label: '05:00 PM' },
    ],
  },
  {
    id: '2026-04-18',
    weekday: 'Sat',
    month: 'Apr',
    day: 18,
    slots: [
      { label: '10:00 AM' },
      { label: '11:30 AM' },
      { label: '01:30 PM' },
      { label: '03:00 PM' },
    ],
  },
]

export function CalendarBookingPage() {
  const { theme } = useTheme()
  const [selectedDayId, setSelectedDayId] = useState(dayOptions[0].id)
  const selectedDay = useMemo(
    () => dayOptions.find((day) => day.id === selectedDayId) ?? dayOptions[0],
    [selectedDayId],
  )
  const firstAvailableSlot = selectedDay.slots.find((slot) => slot.available !== false)?.label ?? null
  const [selectedSlot, setSelectedSlot] = useState<string | null>(firstAvailableSlot)
  const [submitted, setSubmitted] = useState(false)

  const handleDaySelect = (dayId: string) => {
    setSelectedDayId(dayId)
    const nextDay = dayOptions.find((day) => day.id === dayId)
    const nextAvailableSlot = nextDay?.slots.find((slot) => slot.available !== false)?.label ?? null
    setSelectedSlot(nextAvailableSlot)
    setSubmitted(false)
  }

  return (
    <div className="min-h-screen bg-[#fbfbfd] text-slate-900 transition-colors duration-300 dark:bg-[#0a0a0f] dark:text-slate-100">
      <header className="sticky top-0 z-20 border-b border-black/5 bg-[#fbfbfd]/90 backdrop-blur-xl dark:border-white/5 dark:bg-[#0a0a0f]/90">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3 lg:px-8">
          <Link to="/" className="flex items-center">
            <img
              src={theme === 'dark' ? '/brightcone-logo-dark.jpg' : '/brightcone-logo.jpg'}
              alt="Brightcone"
              className="h-9 w-auto object-contain"
            />
          </Link>

          <nav className="hidden items-center gap-8 text-sm text-slate-600 dark:text-slate-400 md:flex">
            <Link to="/" className="transition hover:text-slate-900 dark:hover:text-white">Home</Link>
            <Link to="/pricing" className="transition hover:text-slate-900 dark:hover:text-white">Pricing</Link>
            <Link to="/about" className="transition hover:text-slate-900 dark:hover:text-white">About</Link>
            <Link to="/cal" className="font-medium text-slate-900 dark:text-white">Schedule</Link>
          </nav>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link to="/login" className="text-sm font-medium text-slate-700 transition hover:text-slate-900 dark:text-slate-300 dark:hover:text-white">
              Sign in
            </Link>
          </div>
        </div>
      </header>

      <main className="px-6 py-12 lg:px-8 lg:py-16">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <section className="rounded-[2rem] border border-black/5 bg-white p-8 shadow-[0_24px_70px_rgba(15,23,42,0.06)] dark:border-white/5 dark:bg-[#111118] dark:shadow-[0_24px_70px_rgba(0,0,0,0.35)] lg:p-10">
            <div className="flex flex-col gap-5 border-b border-slate-200 pb-8 dark:border-white/10">
              <div className="inline-flex w-fit rounded-full border border-[#e7d7cf] bg-[#fff7f3] px-4 py-1.5 text-sm font-medium text-[#b85c3d] dark:border-[#b85c3d]/30 dark:bg-[#b85c3d]/10 dark:text-[#e8916f]">
                Scheduling
              </div>
              <div>
                <h1 className="text-4xl font-semibold tracking-tight text-slate-900 dark:text-white sm:text-5xl">
                  Book time in a clean Calendly-style flow.
                </h1>
                <p className="mt-4 max-w-2xl text-base leading-8 text-slate-600 dark:text-slate-400">
                  Pick a day, choose a slot, and leave your details. This is a polished scheduling screen you can wire to real availability and meeting APIs next.
                </p>
              </div>
              <div className="flex flex-wrap gap-3 text-sm text-slate-500 dark:text-slate-400">
                <span className="rounded-full bg-slate-100 px-3 py-1.5 dark:bg-white/5">30 min meeting</span>
                <span className="rounded-full bg-slate-100 px-3 py-1.5 dark:bg-white/5">Instant timezone-friendly UI</span>
                <span className="rounded-full bg-slate-100 px-3 py-1.5 dark:bg-white/5">Ready for backend hookup</span>
              </div>
            </div>

            <div className="mt-8 grid gap-8 xl:grid-cols-[0.95fr_1.05fr]">
              <div>
                <h2 className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-400 dark:text-slate-500">Select a date</h2>
                <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4 xl:grid-cols-2">
                  {dayOptions.map((day) => {
                    const active = day.id === selectedDayId
                    return (
                      <button
                        key={day.id}
                        type="button"
                        onClick={() => handleDaySelect(day.id)}
                        className={`rounded-2xl border px-4 py-4 text-left transition ${
                          active
                            ? 'border-slate-900 bg-slate-900 text-white shadow-lg dark:border-white dark:bg-white dark:text-slate-900'
                            : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300 hover:bg-white dark:border-white/10 dark:bg-white/5 dark:text-slate-300 dark:hover:border-white/20 dark:hover:bg-white/10'
                        }`}
                      >
                        <p className={`text-xs uppercase tracking-[0.24em] ${active ? 'text-white/70 dark:text-slate-500' : 'text-slate-400 dark:text-slate-500'}`}>
                          {day.weekday}
                        </p>
                        <p className="mt-2 text-2xl font-semibold">{day.day}</p>
                        <p className={`mt-1 text-sm ${active ? 'text-white/80 dark:text-slate-600' : 'text-slate-500 dark:text-slate-400'}`}>
                          {day.month}
                        </p>
                      </button>
                    )
                  })}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h2 className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-400 dark:text-slate-500">Available time slots</h2>
                    <p className="mt-2 text-lg font-medium text-slate-900 dark:text-white">
                      {selectedDay.weekday}, {selectedDay.month} {selectedDay.day}
                    </p>
                  </div>
                  <span className="rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
                    {selectedDay.slots.filter((slot) => slot.available !== false).length} open
                  </span>
                </div>

                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  {selectedDay.slots.map((slot) => {
                    const unavailable = slot.available === false
                    const active = slot.label === selectedSlot
                    return (
                      <button
                        key={slot.label}
                        type="button"
                        disabled={unavailable}
                        onClick={() => setSelectedSlot(slot.label)}
                        className={`rounded-2xl border px-4 py-4 text-left transition ${
                          unavailable
                            ? 'cursor-not-allowed border-slate-200 bg-slate-100 text-slate-400 opacity-60 dark:border-white/10 dark:bg-white/5 dark:text-slate-600'
                            : active
                              ? 'border-[#d97757] bg-[#fff4ef] text-[#9a4f34] shadow-sm dark:border-[#e8916f] dark:bg-[#b85c3d]/10 dark:text-[#f0ad92]'
                              : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50 dark:border-white/10 dark:bg-[#0d0d14] dark:text-slate-300 dark:hover:border-white/20 dark:hover:bg-white/5'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-3">
                          <span className="text-sm font-semibold">{slot.label}</span>
                          <span className="text-xs uppercase tracking-[0.18em]">
                            {unavailable ? 'Booked' : active ? 'Selected' : 'Open'}
                          </span>
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>
          </section>

          <aside className="rounded-[2rem] border border-black/5 bg-white p-8 shadow-[0_24px_70px_rgba(15,23,42,0.06)] dark:border-white/5 dark:bg-[#111118] dark:shadow-[0_24px_70px_rgba(0,0,0,0.35)] lg:p-10">
            <div className="border-b border-slate-200 pb-6 dark:border-white/10">
              <h2 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">Confirm your booking</h2>
              <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-400">
                Once connected to your backend, this panel can create meetings, trigger emails, and sync calendars.
              </p>
            </div>

            <div className="mt-6 rounded-3xl bg-slate-50 p-5 dark:bg-[#0d0d14]">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400 dark:text-slate-500">Selected slot</p>
              <p className="mt-3 text-lg font-semibold text-slate-900 dark:text-white">
                {selectedDay.weekday}, {selectedDay.month} {selectedDay.day}
              </p>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{selectedSlot ?? 'Pick a time to continue'}</p>
            </div>

            <form
              className="mt-6 space-y-4"
              onSubmit={(event) => {
                event.preventDefault()
                setSubmitted(true)
              }}
            >
              <div>
                <label htmlFor="name" className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Full name
                </label>
                <input
                  id="name"
                  name="name"
                  placeholder="Jane Smith"
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-slate-200/70 dark:border-white/10 dark:bg-[#0d0d14] dark:text-white dark:focus:border-white/20 dark:focus:ring-white/10"
                />
              </div>

              <div>
                <label htmlFor="email" className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="jane@company.com"
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-slate-200/70 dark:border-white/10 dark:bg-[#0d0d14] dark:text-white dark:focus:border-white/20 dark:focus:ring-white/10"
                />
              </div>

              <div>
                <label htmlFor="topic" className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  What should we discuss?
                </label>
                <textarea
                  id="topic"
                  name="topic"
                  rows={5}
                  placeholder="Tell us what you want to cover in the meeting."
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-slate-200/70 dark:border-white/10 dark:bg-[#0d0d14] dark:text-white dark:focus:border-white/20 dark:focus:ring-white/10"
                />
              </div>

              <button
                type="submit"
                disabled={!selectedSlot}
                className="w-full rounded-full bg-slate-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 dark:disabled:bg-slate-700 dark:disabled:text-slate-400"
              >
                Schedule meeting
              </button>
            </form>

            {submitted ? (
              <div className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-300">
                Booking request captured for {selectedDay.weekday}, {selectedDay.month} {selectedDay.day} at {selectedSlot}.
              </div>
            ) : null}
          </aside>
        </div>
      </main>
    </div>
  )
}
