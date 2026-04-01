import { Link } from 'react-router-dom'

const features = [
  {
    icon: '🤖',
    title: 'Multi-Agent Orchestration',
    description:
      'Coordinate specialized agents — frontend, backend, QA — inside one focused workspace. Each agent knows its role and executes with precision.',
  },
  {
    icon: '💬',
    title: 'Persistent Conversation History',
    description:
      'Every conversation is stored and searchable. Resume where you left off, review past decisions, and maintain full context across sessions.',
  },
  {
    icon: '🔐',
    title: 'Secure by Default',
    description:
      'JWT-based authentication, protected routes, and bcrypt password hashing. Enterprise-grade security built in from day one.',
  },
  {
    icon: '⚡',
    title: 'Real-Time Streaming',
    description:
      'Responses stream live via Server-Sent Events. No waiting for full responses — watch answers appear token by token, instantly.',
  },
  {
    icon: '🎨',
    title: 'Premium UI',
    description:
      'A clean, minimal interface with dark and light mode. Built with React, TypeScript, and Tailwind — fast, accessible, and beautiful.',
  },
  {
    icon: '🚀',
    title: 'Production Ready',
    description:
      'From prototype to deployed product with automated testing, CI-friendly deployment scripts, and a codebase built for real teams.',
  },
]

const team = [
  { name: 'Sam', role: 'Founder & CEO', initials: 'SA' },
  { name: 'Alex', role: 'Frontend Engineer', initials: 'AX' },
  { name: 'Jordan', role: 'Backend Engineer', initials: 'JO' },
  { name: 'Riley', role: 'QA Engineer', initials: 'RI' },
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
        {/* Hero */}
        <section className="px-6 pb-16 pt-20 text-center lg:px-8 lg:pb-24 lg:pt-28">
          <div className="mx-auto max-w-4xl">
            <div className="inline-flex rounded-full border border-[#e7d7cf] bg-[#fff7f3] px-4 py-1.5 text-sm font-medium text-[#b85c3d]">
              About Brightcone
            </div>
            <h1 className="mx-auto mt-8 text-5xl font-semibold tracking-tight text-slate-900 sm:text-6xl">
              Built for teams who take AI seriously.
            </h1>
            <p className="mx-auto mt-8 max-w-2xl text-lg leading-8 text-slate-600">
              Brightcone is an enterprise AI platform that makes it easy to build, deploy, and manage
              intelligent agent workflows — with a premium interface teams actually want to use.
            </p>
          </div>
        </section>

        {/* Mission */}
        <section className="px-6 py-16 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <div className="grid gap-10 rounded-[2.5rem] border border-black/5 bg-white p-10 shadow-[0_20px_70px_rgba(15,23,42,0.06)] lg:grid-cols-2 lg:gap-16 lg:p-14">
              <div>
                <p className="text-sm font-medium uppercase tracking-[0.24em] text-slate-400">Our Mission</p>
                <h2 className="mt-4 text-4xl font-semibold tracking-tight text-slate-900">
                  Make AI agents a production-grade reality.
                </h2>
                <p className="mt-6 text-base leading-8 text-slate-600">
                  Most AI tooling is built for demos. Brightcone is built for production — with the auth, history,
                  streaming, and orchestration that real enterprise teams need.
                </p>
                <p className="mt-4 text-base leading-8 text-slate-600">
                  We believe the next generation of enterprise software will be powered by coordinated AI agents.
                  Our mission is to make that future accessible, reliable, and beautifully simple to operate.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[
                  ['18x', 'Faster task routing'],
                  ['92%', 'Conversation recall'],
                  ['24/7', 'Agent availability'],
                  ['100%', 'TypeScript codebase'],
                ].map(([value, label]) => (
                  <div key={value} className="flex flex-col justify-between rounded-3xl bg-[#f7f7f8] p-6">
                    <div className="text-4xl font-semibold tracking-tight text-slate-900">{value}</div>
                    <div className="mt-3 text-sm leading-6 text-slate-500">{label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="px-6 py-16 lg:px-8">
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
                  className="rounded-[2rem] border border-black/5 bg-white p-8 shadow-[0_16px_50px_rgba(15,23,42,0.05)] transition hover:shadow-[0_20px_60px_rgba(15,23,42,0.08)]"
                >
                  <div className="mb-4 text-3xl">{f.icon}</div>
                  <h3 className="text-lg font-semibold tracking-tight text-slate-900">{f.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-600">{f.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Team */}
        <section className="px-6 py-16 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <div className="max-w-2xl">
              <p className="text-sm font-medium uppercase tracking-[0.24em] text-slate-400">Team</p>
              <h2 className="mt-4 text-4xl font-semibold tracking-tight text-slate-900">
                The people building Brightcone.
              </h2>
            </div>
            <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {team.map((member) => (
                <div
                  key={member.name}
                  className="flex flex-col items-center rounded-[2rem] border border-black/5 bg-white p-8 text-center shadow-[0_16px_50px_rgba(15,23,42,0.05)]"
                >
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-900 text-lg font-semibold text-white">
                    {member.initials}
                  </div>
                  <h3 className="mt-4 text-base font-semibold text-slate-900">{member.name}</h3>
                  <p className="mt-1 text-sm text-slate-500">{member.role}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="px-6 pb-24 pt-8 lg:px-8">
          <div className="mx-auto max-w-5xl rounded-[2.5rem] border border-black/5 bg-slate-900 px-8 py-14 text-center text-white shadow-[0_30px_90px_rgba(15,23,42,0.18)] sm:px-12">
            <p className="text-sm font-medium uppercase tracking-[0.26em] text-white/60">Ready to start?</p>
            <h2 className="mt-5 text-4xl font-semibold tracking-tight sm:text-5xl">
              Join teams building the future with Brightcone.
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-white/70">
              Get access to the full platform — multi-agent orchestration, streaming chat, and enterprise-ready deployment.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                to="/register"
                className="rounded-full bg-white px-7 py-3.5 text-sm font-medium text-slate-900 transition hover:bg-slate-100"
              >
                Create account
              </Link>
              <Link
                to="/pricing"
                className="rounded-full border border-white/20 px-7 py-3.5 text-sm font-medium text-white transition hover:bg-white/10"
              >
                View pricing
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
