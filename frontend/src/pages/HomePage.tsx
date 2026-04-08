import { Link } from 'react-router-dom'
import { useTheme } from '../lib/theme'

const features = [
  {
    title: 'Agent orchestration',
    description: 'Coordinate research, frontend, backend, and QA agents inside one focused workspace.',
  },
  {
    title: 'Enterprise control',
    description: 'Ship with conversation history, protected access, and a system built for real teams.',
  },
  {
    title: 'Modern deployment',
    description: 'Move from prototype to deployed product with fast iteration and clean handoffs.',
  },
]

const useCases = [
  'Customer support copilots with persistent memory',
  'Internal research and ops assistants for enterprise teams',
  'Multi-agent product workflows with human review in the loop',
]

function ThemeToggle() {
  const { theme, toggle } = useTheme()
  return (
    <button
      onClick={toggle}
      aria-label="Toggle dark mode"
      className="flex h-9 w-9 items-center justify-center rounded-full border border-black/10 bg-white/80 text-slate-600 shadow-sm backdrop-blur transition hover:bg-slate-100 dark:border-white/10 dark:bg-white/5 dark:text-slate-300 dark:hover:bg-white/10"
    >
      {theme === 'dark' ? (
        /* Sun icon */
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M17.657 17.657l-.707-.707M6.343 6.343l-.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
        </svg>
      ) : (
        /* Moon icon */
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
        </svg>
      )}
    </button>
  )
}

export function HomePage() {
  const { theme } = useTheme()
  return (
    <div className="min-h-screen bg-[#fbfbfd] text-slate-900 dark:bg-[#0a0a0f] dark:text-slate-100 transition-colors duration-300">

      {/* ── Header ─────────────────────────────────────────────── */}
      <header className="sticky top-0 z-20 border-b border-black/5 bg-[#fbfbfd]/90 backdrop-blur-xl dark:border-white/5 dark:bg-[#0a0a0f]/90">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3 lg:px-8">
          {/* Logo — swaps between light and dark asset */}
          <Link to="/" className="flex items-center">
            <img
              src={theme === 'dark' ? '/brightcone-logo-dark.jpg' : '/brightcone-logo.jpg'}
              alt="Brightcone"
              className="h-9 w-auto object-contain"
            />
          </Link>
          <nav className="hidden items-center gap-8 text-sm text-slate-600 dark:text-slate-400 md:flex">
            <a href="#features" className="transition hover:text-slate-900 dark:hover:text-white">Features</a>
            <a href="#enterprise" className="transition hover:text-slate-900 dark:hover:text-white">Enterprise</a>
            <Link to="/pricing" className="transition hover:text-slate-900 dark:hover:text-white">Pricing</Link>
            <Link to="/about" className="transition hover:text-slate-900 dark:hover:text-white">About</Link>
            <Link to="/crm" className="transition hover:text-slate-900 dark:hover:text-white">CRM</Link>
            <Link to="/tickets" className="transition hover:text-slate-900 dark:hover:text-white">Tickets</Link>
          </nav>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link to="/login" className="text-sm font-medium text-slate-700 transition hover:text-slate-900 dark:text-slate-300 dark:hover:text-white">
              Sign in
            </Link>
            <Link
              to="/register"
              className="rounded-full bg-slate-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
            >
              Get started
            </Link>
          </div>
        </div>
      </header>

      <main>
        {/* ── Hero ──────────────────────────────────────────────── */}
        <section className="px-6 pb-24 pt-20 lg:px-8 lg:pb-32 lg:pt-32">
          <div className="mx-auto max-w-3xl text-center">
            <div className="inline-flex rounded-full border border-[#e7d7cf] bg-[#fff7f3] px-4 py-1.5 text-sm font-medium text-[#b85c3d] dark:border-[#b85c3d]/30 dark:bg-[#b85c3d]/10 dark:text-[#e8916f]">
              Enterprise AI agents, designed with restraint
            </div>
            <h1 className="mt-8 text-5xl font-semibold tracking-tight text-slate-900 dark:text-white sm:text-6xl lg:text-7xl lg:leading-[1.05]">
              Build agent products teams actually use.
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-slate-500 dark:text-slate-400">
              Brightcone is a clean foundation for orchestrating AI agents, managing conversations, and shipping
              production workflows — fast.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                to="/register"
                className="rounded-full bg-slate-900 px-7 py-3.5 text-sm font-medium text-white transition hover:bg-slate-700 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
              >
                Get started
              </Link>
              <Link
                to="/pricing"
                className="rounded-full border border-slate-200 bg-white px-7 py-3.5 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 dark:border-white/10 dark:bg-white/5 dark:text-slate-300 dark:hover:border-white/20 dark:hover:bg-white/10"
              >
                View pricing
              </Link>
            </div>
          </div>
        </section>

        {/* ── Features ──────────────────────────────────────────── */}
        <section id="features" className="px-6 py-20 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <div className="max-w-2xl">
              <p className="text-sm font-medium uppercase tracking-[0.24em] text-slate-400 dark:text-slate-500">Features</p>
              <h2 className="mt-4 text-4xl font-semibold tracking-tight text-slate-900 dark:text-white">
                Minimalist by design, enterprise by intent.
              </h2>
            </div>
            <div className="mt-12 grid gap-6 lg:grid-cols-3">
              {features.map((feature) => (
                <div key={feature.title} className="rounded-[2rem] border border-black/5 bg-white p-8 shadow-[0_16px_50px_rgba(15,23,42,0.05)] dark:border-white/5 dark:bg-[#111118] dark:shadow-[0_16px_50px_rgba(0,0,0,0.3)]">
                  <h3 className="text-xl font-semibold tracking-tight text-slate-900 dark:text-white">{feature.title}</h3>
                  <p className="mt-4 text-sm leading-7 text-slate-600 dark:text-slate-400">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Enterprise ────────────────────────────────────────── */}
        <section id="enterprise" className="px-6 py-20 lg:px-8">
          <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1fr_1fr] lg:items-center">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.24em] text-slate-400 dark:text-slate-500">Enterprise value</p>
              <h2 className="mt-4 text-4xl font-semibold tracking-tight text-slate-900 dark:text-white">
                Sell AI agents as serious products, not demos.
              </h2>
              <p className="mt-6 text-base leading-8 text-slate-600 dark:text-slate-400">
                Position Brightcone as the operating layer for enterprise AI: from premium UX and secure auth to
                persistent conversation history and coordinated multi-agent workflows.
              </p>
            </div>
            <div className="rounded-[2rem] border border-black/5 bg-white p-8 shadow-[0_18px_60px_rgba(15,23,42,0.06)] dark:border-white/5 dark:bg-[#111118] dark:shadow-[0_18px_60px_rgba(0,0,0,0.3)]">
              <ul className="space-y-4">
                {useCases.map((item) => (
                  <li key={item} className="flex items-start gap-4 rounded-2xl bg-[#f7f7f8] px-4 py-4 text-sm leading-7 text-slate-700 dark:bg-[#0d0d14] dark:text-slate-300">
                    <span className="mt-2 h-2.5 w-2.5 flex-shrink-0 rounded-full bg-[#d97757]" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* ── CTA ───────────────────────────────────────────────── */}
        <section className="px-6 pb-24 pt-8 lg:px-8">
          <div className="mx-auto max-w-5xl rounded-[2.5rem] border border-black/5 bg-slate-900 px-8 py-14 text-center text-white shadow-[0_30px_90px_rgba(15,23,42,0.18)] dark:border-white/5 dark:bg-[#111118] dark:shadow-[0_30px_90px_rgba(0,0,0,0.5)] sm:px-12">
            <p className="text-sm font-medium uppercase tracking-[0.26em] text-white/60">Ready to launch</p>
            <h2 className="mt-5 text-4xl font-semibold tracking-tight sm:text-5xl">
              Start shipping enterprise AI agents with a product people actually want to use.
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-white/70">
              Move from concept to polished interface faster, with a foundation built around clarity, speed, and trust.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                to="/pricing"
                className="rounded-full bg-white px-7 py-3.5 text-sm font-medium text-slate-900 transition hover:bg-slate-100"
              >
                View pricing
              </Link>
              <Link
                to="/register"
                className="rounded-full border border-white/20 px-7 py-3.5 text-sm font-medium text-white transition hover:bg-white/10"
              >
                Create account
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* ── Footer ────────────────────────────────────────────── */}
      <footer className="border-t border-black/5 px-6 py-8 dark:border-white/5">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 sm:flex-row lg:px-8">
          <div className="flex flex-col items-center gap-2 sm:items-start">
            <img
              src={theme === 'dark' ? '/brightcone-logo-dark.jpg' : '/brightcone-logo.jpg'}
              alt="Brightcone"
              className="h-7 w-auto object-contain opacity-60"
            />
            <p className="text-xs text-slate-400 dark:text-slate-600">© 2026 Brightcone. All rights reserved.</p>
          </div>
          <div className="flex items-center gap-6 text-sm text-slate-400 dark:text-slate-600">
            <Link to="/about" className="transition hover:text-slate-600 dark:hover:text-slate-400">About</Link>
            <Link to="/pricing" className="transition hover:text-slate-600 dark:hover:text-slate-400">Pricing</Link>
            <Link to="/login" className="transition hover:text-slate-600 dark:hover:text-slate-400">Sign in</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
