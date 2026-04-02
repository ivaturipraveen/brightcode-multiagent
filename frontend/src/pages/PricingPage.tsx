import { Link } from 'react-router-dom'
import { Navbar } from '../components/Navbar'
import { Footer } from '../components/Footer'

const tiers = [
  {
    name: 'Starter',
    price: '$29',
    period: '/mo',
    description: 'For solo builders testing agent workflows and lightweight internal tools.',
    features: ['1 workspace', 'Basic chat history', 'Core agent orchestration', 'Email support'],
    cta: 'Get started',
    href: '/register',
    featured: false,
  },
  {
    name: 'Pro',
    price: '$99',
    period: '/mo',
    description: 'For growing teams shipping production-grade agent experiences faster.',
    features: ['5 team members', 'Advanced conversation history', 'Profile & workspace settings', 'Priority support', 'CRM & outreach tools'],
    cta: 'Start Pro',
    href: '/register',
    featured: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: '',
    description: 'For enterprises deploying secure, branded, large-scale AI agent systems.',
    features: ['Unlimited seats', 'Custom deployment', 'SSO / enterprise auth', 'Dedicated support', 'Custom integrations'],
    cta: 'Talk to sales',
    href: '/login',
    featured: false,
  },
]

const faqs = [
  {
    q: 'Can I start small and upgrade later?',
    a: 'Yes. Start on Starter or Pro and move to Enterprise as your team or deployment needs grow.',
  },
  {
    q: 'Do you support enterprise customization?',
    a: 'Yes. Enterprise plans include custom branding, deployment setup, and deeper integrations.',
  },
  {
    q: 'Is pricing monthly or annual?',
    a: 'Currently monthly. Annual billing with a discount can be arranged for Enterprise customers.',
  },
  {
    q: 'What happens to my data if I cancel?',
    a: 'Your data is yours. Export it anytime before cancelling — we don\'t hold it hostage.',
  },
]

export function PricingPage() {
  return (
    <div className="min-h-screen bg-[#f8f9fb] text-slate-900">
      <Navbar />

      <main className="px-6 py-20 lg:px-8 lg:py-28">
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-blue-600">Pricing</p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
            Simple, transparent pricing.
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-slate-500">
            Start lean, upgrade when your workflows mature, move to Enterprise when you need custom deployment and scale.
          </p>
        </div>

        {/* Tiers */}
        <div className="mx-auto mt-14 grid max-w-6xl gap-6 lg:grid-cols-3">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={`relative flex flex-col rounded-2xl border p-8 shadow-sm transition ${
                tier.featured
                  ? 'border-blue-600 bg-slate-900 text-white shadow-lg'
                  : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-md'
              }`}
            >
              {tier.featured && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <span className="rounded-full bg-blue-600 px-4 py-1 text-xs font-semibold text-white shadow">
                    Most popular
                  </span>
                </div>
              )}

              <div>
                <p className={`text-sm font-semibold ${tier.featured ? 'text-blue-400' : 'text-slate-500'}`}>
                  {tier.name}
                </p>
                <div className="mt-3 flex items-end gap-1">
                  <span className={`text-4xl font-bold ${tier.featured ? 'text-white' : 'text-slate-900'}`}>
                    {tier.price}
                  </span>
                  {tier.period && (
                    <span className={`mb-1 text-sm ${tier.featured ? 'text-slate-400' : 'text-slate-500'}`}>
                      {tier.period}
                    </span>
                  )}
                </div>
                <p className={`mt-3 text-sm leading-6 ${tier.featured ? 'text-slate-400' : 'text-slate-500'}`}>
                  {tier.description}
                </p>
              </div>

              <ul className="mt-8 flex-1 space-y-3">
                {tier.features.map((f) => (
                  <li key={f} className="flex items-start gap-3">
                    <svg
                      className={`mt-0.5 h-4 w-4 flex-shrink-0 ${tier.featured ? 'text-blue-400' : 'text-blue-600'}`}
                      fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                    <span className={`text-sm ${tier.featured ? 'text-slate-300' : 'text-slate-700'}`}>{f}</span>
                  </li>
                ))}
              </ul>

              <Link
                to={tier.href}
                className={`mt-10 block rounded-lg px-5 py-3 text-center text-sm font-semibold transition ${
                  tier.featured
                    ? 'bg-blue-600 text-white hover:bg-blue-500'
                    : 'bg-slate-900 text-white hover:bg-slate-700'
                }`}
              >
                {tier.cta}
              </Link>
            </div>
          ))}
        </div>

        {/* FAQ */}
        <div className="mx-auto mt-24 max-w-3xl">
          <h2 className="text-center text-2xl font-bold tracking-tight text-slate-900">Frequently asked questions</h2>
          <dl className="mt-10 divide-y divide-slate-200">
            {faqs.map((faq) => (
              <div key={faq.q} className="py-6">
                <dt className="text-sm font-semibold text-slate-900">{faq.q}</dt>
                <dd className="mt-2 text-sm leading-6 text-slate-500">{faq.a}</dd>
              </div>
            ))}
          </dl>
        </div>

        {/* CTA */}
        <div className="mx-auto mt-24 max-w-3xl rounded-3xl border border-slate-200 bg-white px-8 py-14 text-center shadow-sm">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Still deciding?</h2>
          <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-500">
            Start on Starter — no credit card required. Upgrade any time.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link to="/register" className="rounded-lg bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-700">
              Create free account
            </Link>
            <Link to="/" className="rounded-lg border border-slate-200 px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">
              Back to home
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
