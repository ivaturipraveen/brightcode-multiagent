import { Link } from 'react-router-dom'

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

export function HomePage() {
  return (
    <div className="min-h-screen bg-[#fbfbfd] text-slate-900">
      <header className="sticky top-0 z-20 border-b border-black/5 bg-[#fbfbfd]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
          <div className="text-lg font-semibold tracking-tight">Brightcone</div>
          <nav className="hidden items-center gap-8 text-sm text-slate-600 md:flex">
            <a href="#features" className="transition hover:text-slate-900">Features</a>
            <a href="#enterprise" className="transition hover:text-slate-900">Enterprise</a>
            <Link to="/pricing" className="transition hover:text-slate-900">Pricing</Link>
          </nav>
          <div className="flex items-center gap-3">
            <Link to="/login" className="text-sm font-medium text-slate-700 transition hover:text-slate-900">
              Sign in
            </Link>
            <Link
              to="/register"
              className="rounded-full bg-slate-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800"
            >
              Get started
            </Link>
          </div>
        </div>
      </header>

      <main>
        <section className="px-6 pb-20 pt-16 lg:px-8 lg:pb-28 lg:pt-24">
          <div className="mx-auto max-w-6xl text-center">
            <div className="inline-flex rounded-full border border-[#e7d7cf] bg-[#fff7f3] px-4 py-1.5 text-sm font-medium text-[#b85c3d]">
              Enterprise AI agents, designed with restraint
            </div>
            <h1 className="mx-auto mt-8 max-w-5xl text-5xl font-semibold tracking-tight text-slate-900 sm:text-6xl lg:text-7xl lg:leading-[1.05]">
              Build modern agent products for enterprise teams.
            </h1>
            <p className="mx-auto mt-8 max-w-3xl text-lg leading-8 text-slate-600 sm:text-xl">
              Brightcone gives you a clean, premium interface for orchestrating AI agents, managing conversations,
              and delivering production-ready workflows that feel simple on the surface and powerful underneath.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                to="/register"
                className="rounded-full bg-slate-900 px-7 py-3.5 text-sm font-medium text-white transition hover:bg-slate-800"
              >
                Start building
              </Link>
              <Link
                to="/pricing"
                className="rounded-full border border-slate-200 bg-white px-7 py-3.5 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
              >
                View pricing
              </Link>
            </div>
          </div>

          <div className="mx-auto mt-16 max-w-6xl rounded-[2.5rem] border border-black/5 bg-gradient-to-b from-white to-[#f5f5f7] p-4 shadow-[0_30px_90px_rgba(15,23,42,0.08)] sm:p-6 lg:mt-20">
            <div className="overflow-hidden rounded-[2rem] border border-black/5 bg-white">
              <div className="flex items-center gap-2 border-b border-black/5 px-5 py-4">
                <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
                <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
                <span className="h-3 w-3 rounded-full bg-[#28c840]" />
                <div className="ml-4 text-sm text-slate-400">Brightcone Enterprise Console</div>
              </div>
              <div className="grid gap-0 lg:grid-cols-[280px_minmax(0,1fr)]">
                <div className="border-r border-black/5 bg-[#f7f7f8] p-5">
                  <div className="rounded-2xl bg-white p-4 shadow-sm">
                    <div className="text-xs font-medium uppercase tracking-[0.22em] text-slate-400">Agents</div>
                    <div className="mt-4 space-y-3">
                      {['Revenue Analyst', 'Support Copilot', 'Release Manager'].map((agent) => (
                        <div key={agent} className="rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-700">
                          {agent}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="bg-white p-6 sm:p-8">
                  <div className="max-w-2xl">
                    <div className="text-sm font-medium text-[#b85c3d]">Enterprise workflow</div>
                    <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-900">
                      One system for orchestrating agents, context, and human decisions.
                    </h2>
                    <p className="mt-4 text-base leading-7 text-slate-600">
                      Create AI experiences that feel premium: fast chats, structured sidebars, persistent history,
                      and enterprise-ready collaboration patterns.
                    </p>
                    <div className="mt-8 grid gap-4 sm:grid-cols-3">
                      {[
                        ['18x', 'faster internal task routing'],
                        ['92%', 'conversation recall accuracy'],
                        ['24/7', 'agent availability across workflows'],
                      ].map(([value, label]) => (
                        <div key={value} className="rounded-3xl bg-[#f7f7f8] p-5">
                          <div className="text-3xl font-semibold tracking-tight text-slate-900">{value}</div>
                          <div className="mt-2 text-sm leading-6 text-slate-500">{label}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="px-6 py-20 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <div className="max-w-2xl">
              <p className="text-sm font-medium uppercase tracking-[0.24em] text-slate-400">Features</p>
              <h2 className="mt-4 text-4xl font-semibold tracking-tight text-slate-900">
                Minimalist by design, enterprise by intent.
              </h2>
            </div>
            <div className="mt-12 grid gap-6 lg:grid-cols-3">
              {features.map((feature) => (
                <div key={feature.title} className="rounded-[2rem] border border-black/5 bg-white p-8 shadow-[0_16px_50px_rgba(15,23,42,0.05)]">
                  <h3 className="text-xl font-semibold tracking-tight text-slate-900">{feature.title}</h3>
                  <p className="mt-4 text-sm leading-7 text-slate-600">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="enterprise" className="px-6 py-20 lg:px-8">
          <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1fr_1fr] lg:items-center">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.24em] text-slate-400">Enterprise value</p>
              <h2 className="mt-4 text-4xl font-semibold tracking-tight text-slate-900">
                Sell AI agents as serious products, not demos.
              </h2>
              <p className="mt-6 text-base leading-8 text-slate-600">
                Position Brightcone as the operating layer for enterprise AI: from premium UX and secure auth to
                persistent conversation history and coordinated multi-agent workflows.
              </p>
            </div>
            <div className="rounded-[2rem] border border-black/5 bg-white p-8 shadow-[0_18px_60px_rgba(15,23,42,0.06)]">
              <ul className="space-y-4">
                {useCases.map((item) => (
                  <li key={item} className="flex items-start gap-4 rounded-2xl bg-[#f7f7f8] px-4 py-4 text-sm leading-7 text-slate-700">
                    <span className="mt-2 h-2.5 w-2.5 rounded-full bg-[#d97757]" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="px-6 pb-24 pt-8 lg:px-8">
          <div className="mx-auto max-w-5xl rounded-[2.5rem] border border-black/5 bg-slate-900 px-8 py-14 text-center text-white shadow-[0_30px_90px_rgba(15,23,42,0.18)] sm:px-12">
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
    </div>
  )
}
