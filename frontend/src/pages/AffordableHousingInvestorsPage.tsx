import { Link } from 'react-router-dom'

type ChallengeCard = {
  title: string
  issue: string
  institutionalLens: string
  solution: string
  punch: string
  accent: string
}

type ActionItem = {
  phase: string
  title: string
  detail: string
}

const marketStats = [
  {
    label: 'Capital gap',
    value: '$1T+',
    note: 'Affordable housing needs vastly exceed currently bankable pipeline.',
  },
  {
    label: 'Target holding period',
    value: '10–20 yrs',
    note: 'Institutions prefer long-duration, inflation-aware assets with predictable cash yield.',
  },
  {
    label: 'What investors want',
    value: 'Core+',
    note: 'Stable cash flow, governance clarity, downside protection, and scalable deployment.',
  },
  {
    label: 'Value unlock',
    value: '3-way',
    note: 'Public subsidy + private capital + operating excellence turns mission into investability.',
  },
]

const challenges: ChallengeCard[] = [
  {
    title: 'Fragmented deal economics',
    issue: 'Affordable housing projects are often small, bespoke, and subsidy-dependent, making underwriting slow and expensive.',
    institutionalLens: 'Pension funds and insurers need repeatable products, not one-off exceptions.',
    solution: 'Aggregate projects into standardized regional portfolios with common underwriting templates, pooled reserves, and programmatic capital deployment.',
    punch: 'From cottage industry to portfolio product.',
    accent: 'from-violet-500 to-fuchsia-500',
  },
  {
    title: 'Policy and subsidy complexity',
    issue: 'Layered tax credits, vouchers, grants, and local covenants create legal and execution friction.',
    institutionalLens: 'Complexity raises diligence costs and creates fear around policy discontinuity.',
    solution: 'Create subsidy “wrappers” managed by specialist platforms that absorb compliance administration and provide covenant analytics, reporting, and early-warning triggers.',
    punch: 'Simplify the stack, widen the capital base.',
    accent: 'from-sky-500 to-cyan-500',
  },
  {
    title: 'Perceived return concession',
    issue: 'Investors often assume affordable housing is concessionary, politically constrained, and operationally fragile.',
    institutionalLens: 'Capital committees compare this asset class against infrastructure, private credit, and multifamily alternatives.',
    solution: 'Reframe the sector around risk-adjusted resilience: high occupancy, essential-demand dynamics, inflation-linked rent frameworks, and downside support from public programs.',
    punch: 'The story is not lower return. The story is better durability.',
    accent: 'from-emerald-500 to-teal-500',
  },
  {
    title: 'Thin operating data',
    issue: 'Many assets lack institutional-grade performance dashboards across occupancy, arrears, maintenance, compliance, and tenant outcomes.',
    institutionalLens: 'What cannot be measured cannot be scaled.',
    solution: 'Mandate data rooms and quarterly operating scorecards with consistent KPIs, benchmarked portfolios, and auditable asset-level performance feeds.',
    punch: 'No data, no scale. Full stop.',
    accent: 'from-amber-500 to-orange-500',
  },
  {
    title: 'Liquidity and exit uncertainty',
    issue: 'Secondary markets are thin and exit pathways can be constrained by regulatory restrictions.',
    institutionalLens: 'Institutions need confidence in valuation, refinancing optionality, and eventual liquidity.',
    solution: 'Develop specialized REITs, perpetual funds, and credit vehicles with recycling features, as well as partial guarantee structures that compress exit risk.',
    punch: 'Make the hold strategy intentional, not accidental.',
    accent: 'from-rose-500 to-pink-500',
  },
  {
    title: 'Developer and operator concentration risk',
    issue: 'Execution often relies on a limited pool of experienced affordable housing developers and operators.',
    institutionalLens: 'Single-platform dependence does not fit scaled fiduciary mandates.',
    solution: 'Build institutional operating platforms with shared services, procurement leverage, and multi-manager governance standards.',
    punch: 'Scale needs platforms, not personalities.',
    accent: 'from-indigo-500 to-blue-500',
  },
]

const solutions = [
  {
    title: 'Standardize the product',
    bullets: [
      'Create repeatable deal templates by metro, tenant profile, and subsidy type.',
      'Use master servicing, reserve waterfalls, and covenant playbooks.',
      'Bundle development, preservation, and retrofit opportunities into one investable sleeve.',
    ],
  },
  {
    title: 'De-risk the cash flow',
    bullets: [
      'Blend rents with housing vouchers, master leases, and municipal support agreements.',
      'Layer first-loss capital or guarantees from public/philanthropic partners.',
      'Use inflation-aware lease structures where regulation permits.',
    ],
  },
  {
    title: 'Industrialize asset management',
    bullets: [
      'Deploy AI-enabled compliance and maintenance workflows.',
      'Track occupancy, collections, capex, energy, and resident stability in one dashboard.',
      'Use predictive analytics to reduce arrears and preserve covenant compliance.',
    ],
  },
  {
    title: 'Match the right capital to the right risk',
    bullets: [
      'Pension funds: stabilized preservation portfolios.',
      'Insurers: long-duration senior debt and investment-grade structures.',
      'Private equity / opportunistic credit: development, retrofits, and recapitalizations.',
    ],
  },
]

const roadmap: ActionItem[] = [
  {
    phase: '0–12 months',
    title: 'Create bankable pipelines',
    detail: 'Inventory municipal and nonprofit assets, triage by readiness, and launch standardized predevelopment packs.',
  },
  {
    phase: '12–24 months',
    title: 'Launch aggregation vehicles',
    detail: 'Pool assets across cities or sponsors into diversified mandates that meet minimum check-size thresholds for institutions.',
  },
  {
    phase: '24–36 months',
    title: 'Institutionalize reporting',
    detail: 'Publish audited operational, financial, and impact metrics with benchmark comparisons and portfolio look-through.',
  },
  {
    phase: '36+ months',
    title: 'Deepen liquidity channels',
    detail: 'Enable refinancings, rated debt, REIT wrappers, and secondary market mechanisms that improve price discovery.',
  },
]

const playbook = [
  'Treat affordable housing as an operating platform, not a grant program.',
  'Move from asset-by-asset heroics to portfolio-level repeatability.',
  'Use public capital to absorb friction, not to substitute for discipline.',
  'Report social impact with the same rigor as debt service coverage and NOI.',
]

export function AffordableHousingInvestorsPage() {
  return (
    <div className="min-h-screen bg-[#f6f7fb] text-slate-900">
      <header className="sticky top-0 z-30 border-b border-white/50 bg-[#f6f7fb]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
          <Link to="/" className="text-lg font-semibold tracking-tight text-slate-900">Brightcone</Link>
          <div className="hidden items-center gap-6 text-sm text-slate-600 md:flex">
            <a href="#challenge-map" className="transition hover:text-slate-900">Challenges</a>
            <a href="#solutions" className="transition hover:text-slate-900">Solutions</a>
            <a href="#roadmap" className="transition hover:text-slate-900">Roadmap</a>
          </div>
          <Link
            to="/agent"
            className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            Back to app
          </Link>
        </div>
      </header>

      <main>
        <section className="relative overflow-hidden px-6 pb-20 pt-20 lg:px-8 lg:pb-28 lg:pt-24">
          <div className="pointer-events-none absolute inset-0 -z-10">
            <div className="absolute left-[-10%] top-10 h-80 w-80 rounded-full bg-violet-200/50 blur-[110px]" />
            <div className="absolute right-[-5%] top-24 h-96 w-96 rounded-full bg-cyan-200/45 blur-[120px]" />
            <div className="absolute bottom-0 left-1/2 h-72 w-[42rem] -translate-x-1/2 rounded-full bg-amber-100/40 blur-[90px]" />
          </div>

          <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-[#e7d7cf] bg-white/80 px-4 py-1.5 text-sm font-medium text-[#a54c30] shadow-sm">
                <span className="h-2 w-2 rounded-full bg-[#d97757]" />
                Big4-style strategy view · Institutional capital thesis
              </div>
              <p className="mt-6 text-sm font-semibold uppercase tracking-[0.3em] text-slate-400">Affordable Housing Investment Strategy</p>
              <h1 className="mt-4 max-w-4xl text-5xl font-semibold tracking-tight text-slate-950 sm:text-6xl">
                Make affordable housing
                <span className="block bg-gradient-to-r from-violet-700 via-blue-700 to-cyan-600 bg-clip-text text-transparent">
                  investible at institutional scale.
                </span>
              </h1>
              <p className="mt-8 max-w-3xl text-lg leading-8 text-slate-600">
                The demand story is obvious. The investability story is not. Institutional investors will fund affordable housing at scale when the asset class becomes standardized, de-risked, measurable, and liquid enough for fiduciary capital.
              </p>

              <div className="mt-10 grid gap-4 sm:grid-cols-3">
                {[
                  { title: 'Core problem', body: 'The sector is socially essential but structurally inconvenient for large pools of capital.' },
                  { title: 'Strategic answer', body: 'Turn fragmented projects into portfolio products with governance, data, and downside protection.' },
                  { title: 'Executive punch line', body: 'Mission creates demand. Structure creates investability.' },
                ].map((item) => (
                  <div key={item.title} className="rounded-[1.75rem] border border-white/60 bg-white/80 p-5 shadow-[0_16px_40px_rgba(15,23,42,0.06)] backdrop-blur-sm">
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">{item.title}</p>
                    <p className="mt-3 text-sm leading-6 text-slate-700">{item.body}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[2rem] border border-slate-200/70 bg-slate-950 p-7 text-white shadow-[0_30px_80px_rgba(15,23,42,0.22)]">
              <p className="text-sm font-semibold uppercase tracking-[0.28em] text-white/45">Executive summary</p>
              <div className="mt-6 space-y-5">
                {[
                  'Affordable housing is an essential-infrastructure asset hiding inside a fragmented real-estate delivery model.',
                  'Institutions can allocate meaningfully only when assets are pooled, risk-sharing is explicit, and performance reporting is institutional grade.',
                  'The winning model blends public credit enhancement, private asset-management discipline, and technology-enabled operations.',
                ].map((point, index) => (
                  <div key={point} className="flex gap-4 rounded-2xl border border-white/10 bg-white/5 p-4">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/10 text-sm font-semibold text-cyan-200">0{index + 1}</div>
                    <p className="text-sm leading-6 text-white/78">{point}</p>
                  </div>
                ))}
              </div>
              <div className="mt-8 rounded-2xl bg-gradient-to-r from-violet-500/20 via-blue-500/15 to-cyan-500/20 p-5 ring-1 ring-white/10">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-100/70">Boardroom soundbite</p>
                <p className="mt-3 text-2xl font-semibold tracking-tight">“Affordable housing becomes investible when compassion is engineered into cash flow.”</p>
              </div>
            </div>
          </div>
        </section>

        <section className="px-6 pb-8 lg:px-8">
          <div className="mx-auto grid max-w-7xl gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {marketStats.map((stat) => (
              <div key={stat.label} className="rounded-[1.75rem] border border-slate-200/70 bg-white p-6 shadow-[0_16px_40px_rgba(15,23,42,0.05)]">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">{stat.label}</p>
                <div className="mt-3 text-4xl font-semibold tracking-tight text-slate-950">{stat.value}</div>
                <p className="mt-3 text-sm leading-6 text-slate-600">{stat.note}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="challenge-map" className="px-6 py-16 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="max-w-3xl">
              <p className="text-sm font-semibold uppercase tracking-[0.28em] text-slate-400">Challenge map</p>
              <h2 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950">Why institutional money still hesitates.</h2>
              <p className="mt-5 text-base leading-8 text-slate-600">
                The blockers are not just ideological. They are structural. Each obstacle can be solved, but only if the market is designed for scale rather than assembled project by project.
              </p>
            </div>

            <div className="mt-12 grid gap-6 lg:grid-cols-2">
              {challenges.map((challenge) => (
                <article key={challenge.title} className="overflow-hidden rounded-[2rem] border border-slate-200/80 bg-white shadow-[0_18px_50px_rgba(15,23,42,0.06)]">
                  <div className={`h-2 bg-gradient-to-r ${challenge.accent}`} />
                  <div className="p-7">
                    <h3 className="text-2xl font-semibold tracking-tight text-slate-950">{challenge.title}</h3>
                    <div className="mt-5 space-y-4 text-sm leading-7 text-slate-600">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">Challenge</p>
                        <p className="mt-1">{challenge.issue}</p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">Why institutions care</p>
                        <p className="mt-1">{challenge.institutionalLens}</p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">What to do</p>
                        <p className="mt-1">{challenge.solution}</p>
                      </div>
                    </div>
                    <div className="mt-6 rounded-2xl bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-800">
                      {challenge.punch}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="solutions" className="px-6 py-16 lg:px-8">
          <div className="mx-auto max-w-7xl overflow-hidden rounded-[2.5rem] bg-slate-950 px-8 py-12 text-white shadow-[0_30px_90px_rgba(15,23,42,0.24)] sm:px-10 lg:px-12">
            <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr]">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.28em] text-white/45">Solution architecture</p>
                <h2 className="mt-4 text-4xl font-semibold tracking-tight">How to make the asset class bankable.</h2>
                <p className="mt-5 text-base leading-8 text-white/72">
                  The formula is simple to say and hard to execute: standardization, protection, transparency, and scale. Do those four well and institutional demand follows.
                </p>
                <div className="mt-8 rounded-[1.75rem] border border-white/10 bg-white/5 p-6">
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-100/70">Punch line</p>
                  <p className="mt-3 text-3xl font-semibold tracking-tight">Structure the mission. Then the capital shows up.</p>
                </div>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                {solutions.map((solution) => (
                  <div key={solution.title} className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
                    <h3 className="text-xl font-semibold tracking-tight text-white">{solution.title}</h3>
                    <ul className="mt-4 space-y-3 text-sm leading-6 text-white/72">
                      {solution.bullets.map((bullet) => (
                        <li key={bullet} className="flex gap-3">
                          <span className="mt-1 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-cyan-400/15 text-xs text-cyan-200">✓</span>
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="px-6 py-16 lg:px-8">
          <div className="mx-auto max-w-7xl grid gap-8 lg:grid-cols-[1fr_0.9fr]">
            <div className="rounded-[2rem] border border-slate-200/80 bg-white p-8 shadow-[0_18px_50px_rgba(15,23,42,0.06)]">
              <p className="text-sm font-semibold uppercase tracking-[0.26em] text-slate-400">Capital stack logic</p>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950">The investability bridge</h2>
              <div className="mt-8 space-y-5">
                {[
                  ['Public sector', 'Provides land, entitlement support, tax incentives, guarantees, and targeted first-loss protection.'],
                  ['Impact / philanthropic capital', 'Absorbs early-stage complexity, funds predevelopment, and de-risks demonstration portfolios.'],
                  ['Institutional capital', 'Enters once assets are stabilized, pooled, reported consistently, and protected against tail risk.'],
                ].map(([title, text]) => (
                  <div key={title} className="flex gap-4 rounded-2xl bg-slate-50 p-4">
                    <div className="mt-1 h-3 w-3 shrink-0 rounded-full bg-gradient-to-r from-violet-600 to-cyan-500" />
                    <div>
                      <p className="font-semibold text-slate-900">{title}</p>
                      <p className="mt-1 text-sm leading-6 text-slate-600">{text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[2rem] border border-slate-200/80 bg-gradient-to-br from-[#fff6ef] via-white to-[#eef6ff] p-8 shadow-[0_18px_50px_rgba(15,23,42,0.06)]">
              <p className="text-sm font-semibold uppercase tracking-[0.26em] text-slate-400">Operating model principles</p>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950">What the winning playbook looks like.</h2>
              <div className="mt-7 space-y-4">
                {playbook.map((item, index) => (
                  <div key={item} className="flex gap-4 rounded-2xl border border-white/80 bg-white/85 p-4">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-sm font-semibold text-white">{index + 1}</div>
                    <p className="text-sm leading-6 text-slate-700">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="roadmap" className="px-6 py-16 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="max-w-3xl">
              <p className="text-sm font-semibold uppercase tracking-[0.28em] text-slate-400">Roadmap</p>
              <h2 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950">A practical path from subsidy dependence to institutional scale.</h2>
            </div>

            <div className="mt-12 grid gap-5 lg:grid-cols-4">
              {roadmap.map((item) => (
                <div key={item.phase} className="relative rounded-[2rem] border border-slate-200/80 bg-white p-6 shadow-[0_18px_50px_rgba(15,23,42,0.06)]">
                  <div className="absolute left-6 top-0 h-1.5 w-20 -translate-y-1/2 rounded-full bg-gradient-to-r from-violet-600 to-cyan-500" />
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">{item.phase}</p>
                  <h3 className="mt-3 text-xl font-semibold tracking-tight text-slate-950">{item.title}</h3>
                  <p className="mt-4 text-sm leading-7 text-slate-600">{item.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="px-6 pb-24 pt-8 lg:px-8">
          <div className="mx-auto max-w-7xl overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-slate-900 via-violet-950 to-slate-900 px-8 py-14 text-white shadow-[0_30px_90px_rgba(15,23,42,0.24)] sm:px-12">
            <div className="grid gap-10 lg:grid-cols-[1fr_0.85fr] lg:items-center">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.28em] text-white/45">Closing view</p>
                <h2 className="mt-4 text-4xl font-semibold tracking-tight">Affordable housing can become a serious institutional asset class.</h2>
                <p className="mt-6 max-w-3xl text-base leading-8 text-white/72">
                  But only if stakeholders stop asking capital to tolerate friction indefinitely. The sector must be packaged with the same discipline used in infrastructure, private credit, and core real estate.
                </p>
              </div>
              <div className="rounded-[2rem] border border-white/10 bg-white/5 p-7 backdrop-blur-sm">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-100/70">Final punch line</p>
                <p className="mt-4 text-3xl font-semibold tracking-tight">Need is not enough. Investability is designed.</p>
                <p className="mt-4 text-sm leading-7 text-white/70">
                  The future winners will be the cities, sponsors, and platforms that convert affordability from a policy obligation into a credible institutional product.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
