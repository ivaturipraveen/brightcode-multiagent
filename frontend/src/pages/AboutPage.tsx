import { Link } from 'react-router-dom'

const features = [
  {
    icon: '🤖',
    title: 'Multi-Agent Orchestration',
    description: 'Coordinate specialized agents — frontend, backend, QA — inside one focused workspace. Each agent knows its role and executes with precision.',
    color: 'from-violet-500/10 to-purple-500/5',
    border: 'border-violet-200/60',
  },
  {
    icon: '💬',
    title: 'Persistent Conversation History',
    description: 'Every conversation is stored and searchable. Resume where you left off, review past decisions, and maintain full context across sessions.',
    color: 'from-blue-500/10 to-cyan-500/5',
    border: 'border-blue-200/60',
  },
  {
    icon: '🔐',
    title: 'Secure by Default',
    description: 'JWT-based authentication, protected routes, and bcrypt password hashing. Enterprise-grade security built in from day one.',
    color: 'from-emerald-500/10 to-green-500/5',
    border: 'border-emerald-200/60',
  },
  {
    icon: '⚡',
    title: 'Real-Time Streaming',
    description: 'Responses stream live via Server-Sent Events. No waiting for full responses — watch answers appear token by token, instantly.',
    color: 'from-amber-500/10 to-yellow-500/5',
    border: 'border-amber-200/60',
  },
  {
    icon: '🎨',
    title: 'Premium UI',
    description: 'A clean, minimal interface with dark and light mode. Built with React, TypeScript, and Tailwind — fast, accessible, and beautiful.',
    color: 'from-pink-500/10 to-rose-500/5',
    border: 'border-pink-200/60',
  },
  {
    icon: '🚀',
    title: 'Production Ready',
    description: 'From prototype to deployed product with automated testing, CI-friendly deployment scripts, and a codebase built for real teams.',
    color: 'from-orange-500/10 to-red-500/5',
    border: 'border-orange-200/60',
  },
]

const team = [
  { name: 'Sam', role: 'Founder & CEO', initials: 'SA', color: 'from-violet-600 to-purple-700', desc: 'Visionary behind Brightcone. Builds the future, one agent at a time.' },
  { name: 'Alex', role: 'Frontend Engineer', initials: 'AX', color: 'from-blue-600 to-cyan-700', desc: 'Crafts every pixel. Obsessed with UX, performance, and clean design.' },
  { name: 'Jordan', role: 'Backend Engineer', initials: 'JO', color: 'from-emerald-600 to-teal-700', desc: 'Keeps the engine running. APIs, databases, and everything beneath the surface.' },
  { name: 'Riley', role: 'QA Engineer', initials: 'RI', color: 'from-amber-600 to-orange-700', desc: 'Nothing ships without Riley\'s sign-off. Quality is the baseline, not the goal.' },
]

const timeline = [
  { year: '2023', title: 'The Idea', desc: 'Brightcone started as a question: why is enterprise AI tooling so painful to use?' },
  { year: 'Q1 2024', title: 'First Build', desc: 'Core chat, auth, and multi-agent orchestration shipped. First internal users onboarded.' },
  { year: 'Q3 2024', title: 'CRM & Outreach', desc: 'Lead management and email outreach capabilities added. Teams started replacing their CRMs.' },
  { year: '2025', title: 'Enterprise Launch', desc: 'Full enterprise platform launched — SSO, reporting, and custom deployments for large teams.' },
]

const stats = [
  { value: '18x', label: 'Faster task routing', icon: '⚡' },
  { value: '92%', label: 'Conversation recall', icon: '🧠' },
  { value: '24/7', label: 'Agent availability', icon: '🌐' },
  { value: '100%', label: 'TypeScript codebase', icon: '🛡️' },
]

export function AboutPage() {
  return (
    <div className="min-h-screen bg-[#fbfbfd] text-slate-900">
      {/* Nav */}
      <header className="sticky top-0 z-20 border-b border-black/5 bg-[#fbfbfd]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
          <Link to="/" className="text-lg font-semibold tracking-tight">Brightcone</Link>
          <nav className="hidden items-center gap-8 text-sm text-slate-600 md:flex">
            <Link to="/#features" className="transition hover:text-slate-900">Features</Link>
            <Link to="/#enterprise" className="transition hover:text-slate-900">Enterprise</Link>
            <Link to="/pricing" className="transition hover:text-slate-900">Pricing</Link>
            <Link to="/about" className="font-medium text-slate-900">About</Link>
            <Link to="/crm" className="transition hover:text-slate-900">CRM</Link>
          </nav>
          <div className="flex items-center gap-3">
            <Link to="/login" className="text-sm font-medium text-slate-700 transition hover:text-slate-900">Sign in</Link>
            <Link to="/register" className="rounded-full bg-slate-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800">Get started</Link>
          </div>
        </div>
      </header>

      <main>
        {/* ── Hero ─────────────────────────────────────────────────── */}
        <section className="relative overflow-hidden px-6 pb-20 pt-24 lg:px-8 lg:pb-32 lg:pt-32">
          {/* background blobs */}
          <div className="pointer-events-none absolute inset-0 -z-10">
            <div className="absolute -left-40 -top-40 h-[600px] w-[600px] rounded-full bg-violet-100/60 blur-[120px]" />
            <div className="absolute -right-40 top-20 h-[500px] w-[500px] rounded-full bg-blue-100/50 blur-[100px]" />
            <div className="absolute bottom-0 left-1/2 h-[400px] w-[800px] -translate-x-1/2 rounded-full bg-amber-100/30 blur-[80px]" />
          </div>

          <div className="mx-auto max-w-4xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#e7d7cf] bg-[#fff7f3] px-4 py-1.5 text-sm font-medium text-[#b85c3d]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#d97757]" />
              About Brightcone
            </div>
            <h1 className="mx-auto mt-8 text-5xl font-semibold tracking-tight text-slate-900 sm:text-6xl lg:text-7xl">
              Built for teams who take
              <span className="block bg-gradient-to-r from-violet-600 via-blue-600 to-cyan-500 bg-clip-text text-transparent">
                AI seriously.
              </span>
            </h1>
            <p className="mx-auto mt-8 max-w-2xl text-lg leading-8 text-slate-600">
              Brightcone is an enterprise AI platform that makes it easy to build, deploy, and manage
              intelligent agent workflows — with a premium interface teams actually want to use.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link to="/register" className="rounded-full bg-slate-900 px-7 py-3.5 text-sm font-medium text-white transition hover:bg-slate-800">
                Start building
              </Link>
              <Link to="/pricing" className="rounded-full border border-slate-200 bg-white px-7 py-3.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50">
                View pricing
              </Link>
            </div>
          </div>

          {/* Stats strip */}
          <div className="mx-auto mt-20 grid max-w-4xl grid-cols-2 gap-4 lg:grid-cols-4">
            {stats.map((s) => (
              <div key={s.value} className="flex flex-col items-center rounded-2xl border border-black/5 bg-white/80 px-6 py-6 shadow-sm backdrop-blur-sm">
                <span className="text-2xl">{s.icon}</span>
                <div className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">{s.value}</div>
                <div className="mt-1 text-center text-xs font-medium text-slate-500">{s.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Mission ──────────────────────────────────────────────── */}
        <section className="px-6 py-20 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-10 shadow-[0_30px_90px_rgba(15,23,42,0.2)] lg:p-16">
              {/* decorative blobs inside card */}
              <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-violet-500/20 blur-[60px]" />
              <div className="pointer-events-none absolute -bottom-20 left-10 h-64 w-64 rounded-full bg-blue-500/20 blur-[60px]" />

              <div className="relative grid gap-12 lg:grid-cols-2 lg:items-center">
                <div>
                  <p className="text-sm font-medium uppercase tracking-[0.24em] text-white/50">Our Mission</p>
                  <h2 className="mt-4 text-4xl font-semibold tracking-tight text-white">
                    Make AI agents a production-grade reality.
                  </h2>
                  <p className="mt-6 text-base leading-8 text-white/70">
                    Most AI tooling is built for demos. Brightcone is built for production — with the auth, history,
                    streaming, and orchestration that real enterprise teams need.
                  </p>
                  <p className="mt-4 text-base leading-8 text-white/70">
                    We believe the next generation of enterprise software will be powered by coordinated AI agents.
                    Our mission is to make that future accessible, reliable, and beautifully simple to operate.
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    ['🎯', 'Precision', 'Every agent action is intentional and traceable.'],
                    ['🔒', 'Security', 'Enterprise-grade auth built in from the start.'],
                    ['🌊', 'Speed', 'Real-time streaming with no latency compromises.'],
                    ['🧩', 'Modularity', 'Swap, extend, and compose agents freely.'],
                  ].map(([icon, title, desc]) => (
                    <div key={title} className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
                      <div className="text-2xl">{icon}</div>
                      <div className="mt-2 text-sm font-semibold text-white">{title}</div>
                      <div className="mt-1 text-xs leading-5 text-white/60">{desc}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Timeline ─────────────────────────────────────────────── */}
        <section className="px-6 py-20 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <div className="max-w-2xl">
              <p className="text-sm font-medium uppercase tracking-[0.24em] text-slate-400">Our Journey</p>
              <h2 className="mt-4 text-4xl font-semibold tracking-tight text-slate-900">How we got here.</h2>
            </div>
            <div className="mt-12 relative">
              {/* vertical line */}
              <div className="absolute left-6 top-0 h-full w-px bg-gradient-to-b from-violet-300 via-blue-300 to-transparent lg:left-1/2" />
              <div className="space-y-10">
                {timeline.map((item, i) => (
                  <div key={item.year} className={`relative flex items-start gap-8 lg:gap-0 ${i % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'}`}>
                    {/* dot */}
                    <div className="absolute left-6 top-5 z-10 h-3 w-3 -translate-x-1/2 rounded-full bg-gradient-to-br from-violet-500 to-blue-500 shadow-md ring-4 ring-white lg:left-1/2" />
                    {/* content */}
                    <div className={`ml-14 w-full lg:ml-0 lg:w-5/12 ${i % 2 === 0 ? 'lg:pr-16' : 'lg:pl-16'}`}>
                      <div className="rounded-2xl border border-black/5 bg-white p-6 shadow-[0_8px_30px_rgba(15,23,42,0.06)] transition hover:shadow-[0_12px_40px_rgba(15,23,42,0.1)]">
                        <span className="inline-block rounded-full bg-gradient-to-r from-violet-100 to-blue-100 px-3 py-1 text-xs font-semibold text-violet-700">
                          {item.year}
                        </span>
                        <h3 className="mt-3 text-lg font-semibold text-slate-900">{item.title}</h3>
                        <p className="mt-2 text-sm leading-6 text-slate-600">{item.desc}</p>
                      </div>
                    </div>
                    {/* spacer */}
                    <div className="hidden lg:block lg:w-5/12" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── Features ─────────────────────────────────────────────── */}
        <section className="px-6 py-20 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <div className="max-w-2xl">
              <p className="text-sm font-medium uppercase tracking-[0.24em] text-slate-400">Key Features</p>
              <h2 className="mt-4 text-4xl font-semibold tracking-tight text-slate-900">
                Everything you need. Nothing you don't.
              </h2>
            </div>
            <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((f) => (
                <div
                  key={f.title}
                  className={`group relative overflow-hidden rounded-[2rem] border bg-gradient-to-br p-8 transition hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(15,23,42,0.1)] ${f.color} ${f.border}`}
                >
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-sm text-2xl">
                    {f.icon}
                  </div>
                  <h3 className="text-lg font-semibold tracking-tight text-slate-900">{f.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-600">{f.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Team ─────────────────────────────────────────────────── */}
        <section className="px-6 py-20 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <div className="max-w-2xl">
              <p className="text-sm font-medium uppercase tracking-[0.24em] text-slate-400">Team</p>
              <h2 className="mt-4 text-4xl font-semibold tracking-tight text-slate-900">
                The people building Brightcone.
              </h2>
              <p className="mt-4 text-base leading-7 text-slate-600">
                A small, focused team that moves fast, ships clean code, and cares deeply about the product.
              </p>
            </div>
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {team.map((member) => (
                <div
                  key={member.name}
                  className="group relative overflow-hidden rounded-[2rem] border border-black/5 bg-white p-8 shadow-[0_16px_50px_rgba(15,23,42,0.05)] transition hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(15,23,42,0.1)]"
                >
                  <div className={`mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br text-2xl font-bold text-white shadow-md ${member.color}`}>
                    {member.initials}
                  </div>
                  <h3 className="mt-5 text-center text-base font-semibold text-slate-900">{member.name}</h3>
                  <p className="mt-1 text-center text-xs font-medium uppercase tracking-wide text-slate-400">{member.role}</p>
                  <p className="mt-3 text-center text-xs leading-5 text-slate-500">{member.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Values ───────────────────────────────────────────────── */}
        <section className="px-6 py-20 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <div className="max-w-2xl">
              <p className="text-sm font-medium uppercase tracking-[0.24em] text-slate-400">Values</p>
              <h2 className="mt-4 text-4xl font-semibold tracking-tight text-slate-900">What drives us.</h2>
            </div>
            <div className="mt-12 grid gap-5 sm:grid-cols-3">
              {[
                { icon: '🎯', title: 'Clarity over complexity', desc: 'We strip away noise. Every feature must earn its place. Simple interfaces that do powerful things.' },
                { icon: '🤝', title: 'Trust through transparency', desc: 'No black boxes. You know what the agents are doing, why they\'re doing it, and what\'s next.' },
                { icon: '⚡', title: 'Speed without shortcuts', desc: 'Move fast but never at the cost of reliability. Good engineering is how we respect our users\' time.' },
              ].map((v) => (
                <div key={v.title} className="rounded-[2rem] border border-black/5 bg-white p-8 shadow-[0_16px_50px_rgba(15,23,42,0.05)]">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-50 text-2xl">{v.icon}</div>
                  <h3 className="mt-5 text-lg font-semibold text-slate-900">{v.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-600">{v.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ──────────────────────────────────────────────────── */}
        <section className="px-6 pb-24 pt-8 lg:px-8">
          <div className="mx-auto max-w-5xl">
            <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-slate-900 via-violet-950 to-slate-900 px-8 py-16 text-center text-white shadow-[0_30px_90px_rgba(15,23,42,0.25)] sm:px-12">
              <div className="pointer-events-none absolute -left-20 -top-20 h-64 w-64 rounded-full bg-violet-500/20 blur-[60px]" />
              <div className="pointer-events-none absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-blue-500/20 blur-[60px]" />
              <div className="relative">
                <p className="text-sm font-medium uppercase tracking-[0.26em] text-white/50">Ready to start?</p>
                <h2 className="mx-auto mt-5 max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl">
                  Join teams building the future with Brightcone.
                </h2>
                <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-white/70">
                  Get access to the full platform — multi-agent orchestration, streaming chat, and enterprise-ready deployment.
                </p>
                <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                  <Link to="/register" className="rounded-full bg-white px-7 py-3.5 text-sm font-medium text-slate-900 transition hover:bg-slate-100">
                    Create free account
                  </Link>
                  <Link to="/pricing" className="rounded-full border border-white/20 px-7 py-3.5 text-sm font-medium text-white transition hover:bg-white/10">
                    View pricing
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
