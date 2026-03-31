import { Link } from 'react-router-dom'

const tiers = [
  {
    name: 'Starter',
    price: '$29',
    period: '/month',
    description: 'For solo builders testing agent workflows and lightweight internal tools.',
    features: ['1 workspace', 'Basic chat history', 'Core agent orchestration', 'Email support'],
    cta: 'Start Starter',
    featured: false,
  },
  {
    name: 'Pro',
    price: '$99',
    period: '/month',
    description: 'For growing teams shipping production-grade agent experiences faster.',
    features: ['5 team members', 'Advanced conversation history', 'Profile settings + workspace features', 'Priority support'],
    cta: 'Choose Pro',
    featured: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: '',
    description: 'For enterprises rolling out secure, branded, and large-scale AI agent systems.',
    features: ['Custom deployment', 'SSO / enterprise auth path', 'Dedicated support', 'Custom integrations'],
    cta: 'Talk to sales',
    featured: false,
  },
]

const faqs = [
  {
    question: 'Can I start small and upgrade later?',
    answer: 'Yes. Start with Starter or Pro and move to Enterprise when your team or deployment needs grow.',
  },
  {
    question: 'Do you support enterprise customization?',
    answer: 'Yes. Enterprise plans can include custom branding, deployment setup, and deeper integrations.',
  },
  {
    question: 'Is pricing monthly?',
    answer: 'The page is set up with simple monthly pricing for the fastest launch path. Annual billing can be added later.',
  },
]

export function PricingPage() {
  return (
    <div className="min-h-screen bg-[#fbfbfd] text-slate-900">
      <header className="sticky top-0 z-20 border-b border-black/5 bg-[#fbfbfd]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
          <Link to="/" className="text-lg font-semibold tracking-tight">Brightcone</Link>
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

      <main className="px-6 py-16 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-6xl text-center">
          <div className="inline-flex rounded-full border border-[#e7d7cf] bg-[#fff7f3] px-4 py-1.5 text-sm font-medium text-[#b85c3d]">
            Pricing built for speed
          </div>
          <h1 className="mx-auto mt-8 max-w-4xl text-5xl font-semibold tracking-tight text-slate-900 sm:text-6xl">
            Simple pricing for teams building with AI agents.
          </h1>
          <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-slate-600">
            Start lean, upgrade when your workflows mature, and move to enterprise when you need security,
            scale, and custom deployment support.
          </p>
        </div>

        <div className="mx-auto mt-16 grid max-w-6xl gap-6 lg:grid-cols-3">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={`rounded-[2rem] border p-8 shadow-[0_20px_60px_rgba(15,23,42,0.06)] ${
                tier.featured
                  ? 'border-slate-900 bg-slate-900 text-white'
                  : 'border-black/5 bg-white text-slate-900'
              }`}
            >
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold tracking-tight">{tier.name}</h2>
                {tier.featured ? (
                  <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.24em] text-white/80">
                    Popular
                  </span>
                ) : null}
              </div>
              <div className="mt-6 flex items-end gap-1">
                <span className="text-5xl font-semibold tracking-tight">{tier.price}</span>
                <span className={`pb-1 text-sm ${tier.featured ? 'text-white/70' : 'text-slate-500'}`}>{tier.period}</span>
              </div>
              <p className={`mt-5 text-sm leading-7 ${tier.featured ? 'text-white/75' : 'text-slate-600'}`}>
                {tier.description}
              </p>
              <ul className="mt-8 space-y-3">
                {tier.features.map((feature) => (
                  <li key={feature} className={`flex items-start gap-3 text-sm leading-7 ${tier.featured ? 'text-white/85' : 'text-slate-700'}`}>
                    <span className={`mt-2 h-2.5 w-2.5 rounded-full ${tier.featured ? 'bg-white' : 'bg-[#d97757]'}`} />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Link
                to={tier.name === 'Enterprise' ? '/login' : '/register'}
                className={`mt-10 inline-flex w-full items-center justify-center rounded-full px-5 py-3 text-sm font-medium transition ${
                  tier.featured
                    ? 'bg-white text-slate-900 hover:bg-slate-100'
                    : 'bg-slate-900 text-white hover:bg-slate-800'
                }`}
              >
                {tier.cta}
              </Link>
            </div>
          ))}
        </div>

        <div className="mx-auto mt-20 grid max-w-5xl gap-6 lg:grid-cols-3">
          {faqs.map((faq) => (
            <div key={faq.question} className="rounded-[2rem] border border-black/5 bg-white p-6 shadow-[0_16px_50px_rgba(15,23,42,0.05)]">
              <h3 className="text-lg font-semibold tracking-tight text-slate-900">{faq.question}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">{faq.answer}</p>
            </div>
          ))}
        </div>

        <div className="mx-auto mt-20 max-w-5xl rounded-[2.5rem] border border-black/5 bg-slate-900 px-8 py-14 text-center text-white shadow-[0_30px_90px_rgba(15,23,42,0.18)] sm:px-12">
          <p className="text-sm font-medium uppercase tracking-[0.26em] text-white/60">Ready to launch</p>
          <h2 className="mt-5 text-4xl font-semibold tracking-tight sm:text-5xl">
            Pick a plan and start shipping faster.
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-white/70">
            The fastest path is already live: clean plans, direct CTA, and room to expand later with yearly billing or comparisons.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              to="/register"
              className="rounded-full bg-white px-7 py-3.5 text-sm font-medium text-slate-900 transition hover:bg-slate-100"
            >
              Create your account
            </Link>
            <Link
              to="/"
              className="rounded-full border border-white/20 px-7 py-3.5 text-sm font-medium text-white transition hover:bg-white/10"
            >
              Back to home
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
