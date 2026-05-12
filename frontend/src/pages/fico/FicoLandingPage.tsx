import { Link } from 'react-router-dom'

const NAV: React.CSSProperties = {
  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
  padding: '0 5%', height: 68, background: '#fff',
  boxShadow: '0 2px 8px rgba(0,0,0,0.08)', position: 'sticky', top: 0, zIndex: 100,
}
const LOGO: React.CSSProperties = {
  fontFamily: 'Inter,sans-serif', fontWeight: 900, fontSize: 28,
  color: '#1B2A5E', letterSpacing: '-1px', textDecoration: 'none',
}
const NAV_LINKS: React.CSSProperties = {
  display: 'flex', alignItems: 'center', gap: 32, listStyle: 'none', margin: 0, padding: 0,
}
const NAV_A: React.CSSProperties = {
  color: '#333', textDecoration: 'none', fontSize: 15, fontWeight: 500,
  fontFamily: 'Inter,sans-serif',
}
const BTN_OUTLINE: React.CSSProperties = {
  border: '1.5px solid #1B2A5E', color: '#1B2A5E', background: 'none',
  padding: '8px 20px', borderRadius: 6, fontWeight: 600, cursor: 'pointer',
  fontSize: 14, fontFamily: 'Inter,sans-serif', textDecoration: 'none',
}
const BTN_PRIMARY: React.CSSProperties = {
  background: '#2D6BE4', color: '#fff', border: 'none',
  padding: '10px 24px', borderRadius: 6, fontWeight: 700, cursor: 'pointer',
  fontSize: 14, fontFamily: 'Inter,sans-serif', textDecoration: 'none',
}
const BTN_HERO: React.CSSProperties = {
  background: '#2D6BE4', color: '#fff', border: 'none',
  padding: '14px 32px', borderRadius: 8, fontWeight: 700, cursor: 'pointer',
  fontSize: 16, fontFamily: 'Inter,sans-serif', textDecoration: 'none', display: 'inline-block',
}
const BTN_GHOST: React.CSSProperties = {
  background: 'transparent', color: '#fff',
  border: '2px solid rgba(255,255,255,0.6)',
  padding: '14px 32px', borderRadius: 8, fontWeight: 600, cursor: 'pointer',
  fontSize: 16, fontFamily: 'Inter,sans-serif', textDecoration: 'none', display: 'inline-block',
}

function ScoreGauge() {
  const score = 742
  const min = 300, max = 850
  const pct = (score - min) / (max - min)
  // arc: semicircle, 0 = left, 1 = right
  const r = 90, cx = 110, cy = 110
  const startAngle = Math.PI
  const endAngle = 2 * Math.PI
  const totalAngle = endAngle - startAngle
  const scoreAngle = startAngle + pct * totalAngle
  const x1 = cx + r * Math.cos(startAngle), y1 = cy + r * Math.sin(startAngle)
  const x2 = cx + r * Math.cos(scoreAngle), y2 = cy + r * Math.sin(scoreAngle)
  const largeArc = scoreAngle - startAngle > Math.PI ? 1 : 0

  const trackX2 = cx + r * Math.cos(endAngle)
  const trackY2 = cy + r * Math.sin(endAngle)

  return (
    <div style={{ textAlign: 'center' }}>
      <svg width={220} height={130} viewBox="0 0 220 130">
        {/* Track */}
        <path
          d={`M ${x1} ${y1} A ${r} ${r} 0 1 1 ${trackX2} ${trackY2}`}
          fill="none" stroke="#E2E8F0" strokeWidth={18} strokeLinecap="round"
        />
        {/* Score arc */}
        <path
          d={`M ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2}`}
          fill="none" stroke="#2ECC71" strokeWidth={18} strokeLinecap="round"
        />
        {/* Score */}
        <text x={cx} y={cy - 4} textAnchor="middle" fontSize={36} fontWeight={800}
          fontFamily="Inter,sans-serif" fill="#1B2A5E">{score}</text>
        <text x={cx} y={cy + 18} textAnchor="middle" fontSize={13} fontWeight={600}
          fontFamily="Inter,sans-serif" fill="#2ECC71">GOOD</text>
      </svg>
      <div style={{ fontFamily: 'Inter,sans-serif', fontSize: 12, color: '#888', marginTop: 4 }}>
        Score range: 300–850
      </div>
    </div>
  )
}

const RANGES = [
  { label: 'Exceptional', range: '800–850', color: '#27AE60', w: '10%' },
  { label: 'Very Good',   range: '740–799', color: '#2ECC71', w: '12%' },
  { label: 'Good',        range: '670–739', color: '#F1C40F', w: '14%' },
  { label: 'Fair',        range: '580–669', color: '#E67E22', w: '18%' },
  { label: 'Poor',        range: '300–579', color: '#E74C3C', w: '46%' },
].reverse()

const PLANS = [
  {
    name: 'Basic', price: '$19.95', period: '/mo', highlight: false,
    features: ['1-bureau (Experian)', 'Monthly updates', 'FICO® Score 8', 'Score Simulator', 'Credit report', 'Score monitoring'],
  },
  {
    name: 'Advanced', price: '$29.95', period: '/mo', highlight: true,
    features: ['3-bureau coverage', 'Quarterly updates', 'All FICO® Scores', 'Score Simulator', 'All 3 credit reports', 'Score & credit monitoring', '$1M identity theft insurance'],
  },
  {
    name: 'Premier', price: '$39.95', period: '/mo', highlight: false,
    features: ['3-bureau coverage', 'Monthly updates', 'All FICO® Scores', 'Mortgage score simulator', 'All 3 credit reports', 'Score & credit monitoring', '$1M identity theft insurance', '24/7 identity restoration'],
  },
]

const FEATURES = [
  { icon: '📊', title: 'Credit Monitoring', desc: 'Real-time alerts when your score changes. Stay ahead of anything that could hurt your credit.' },
  { icon: '🛡️', title: 'Identity Protection', desc: 'Up to $1M identity theft insurance and 24/7 restoration experts ready to help.' },
  { icon: '🔮', title: 'Score Simulator', desc: 'See how financial decisions — paying off debt, opening new accounts — could affect your score.' },
  { icon: '📈', title: '28+ FICO® Scores', desc: 'Access all the scores lenders use — mortgage, auto, credit card — not just one generic number.' },
]

export function FicoLandingPage() {
  return (
    <div style={{ fontFamily: 'Inter,sans-serif', background: '#fff', minHeight: '100vh' }}>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />

      {/* NAV */}
      <nav style={NAV}>
        <a href="/fico" style={LOGO}>FICO<sup style={{ fontSize: 12, verticalAlign: 'super' }}>®</sup></a>
        <ul style={NAV_LINKS}>
          <li><a href="#plans" style={NAV_A}>Products</a></li>
          <li><a href="#scores" style={NAV_A}>Education</a></li>
          <li><a href="#features" style={NAV_A}>Help</a></li>
        </ul>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <Link to="/fico/login" style={BTN_OUTLINE}>Log In</Link>
          <Link to="/fico/signup" style={BTN_PRIMARY}>Get My Score</Link>
        </div>
      </nav>

      {/* HERO */}
      <section style={{
        background: 'linear-gradient(135deg, #1B2A5E 0%, #2D4A9E 60%, #1a3a8f 100%)',
        padding: '80px 5% 80px',
        display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60, alignItems: 'center',
      }}>
        <div>
          <div style={{ display: 'inline-block', background: 'rgba(255,255,255,0.12)', color: '#a8c4ff', fontSize: 12, fontWeight: 600, letterSpacing: '0.1em', padding: '6px 14px', borderRadius: 20, marginBottom: 20 }}>
            USED BY 90% OF TOP US LENDERS
          </div>
          <h1 style={{ color: '#fff', fontSize: 'clamp(28px,3.5vw,48px)', fontWeight: 800, lineHeight: 1.2, margin: '0 0 20px' }}>
            Know Your FICO<sup style={{ fontSize: '0.5em' }}>®</sup> Score.<br />
            <span style={{ color: '#64B5F6' }}>Own Your Financial Future.</span>
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: 16, lineHeight: 1.7, maxWidth: 480, margin: '0 0 36px' }}>
            The FICO® Score is used in 90% of US lending decisions. Get yours, understand it, and use it to make smarter financial moves — starting today.
          </p>
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            <Link to="/fico/signup" style={BTN_HERO}>Get My Free Score</Link>
            <a href="#scores" style={BTN_GHOST}>Learn More</a>
          </div>
          <div style={{ display: 'flex', gap: 24, marginTop: 32 }}>
            {[['🔒', 'Secure & Private'], ['⭐', '4.8/5 Rating'], ['👥', '10M+ Members']].map(([icon, label]) => (
              <div key={label as string} style={{ color: 'rgba(255,255,255,0.65)', fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}>
                <span>{icon}</span>{label}
              </div>
            ))}
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ background: '#fff', borderRadius: 20, padding: '36px 40px', boxShadow: '0 24px 60px rgba(0,0,0,0.3)', textAlign: 'center', minWidth: 260 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#888', letterSpacing: '0.08em', marginBottom: 8 }}>YOUR FICO® SCORE</div>
            <ScoreGauge />
            <div style={{ marginTop: 12, fontSize: 13, color: '#555' }}>As of May 2026</div>
            <Link to="/fico/signup" style={{ ...BTN_PRIMARY, display: 'block', marginTop: 20, textAlign: 'center' }}>Check Your Score</Link>
          </div>
        </div>
      </section>

      {/* SCORE RANGES */}
      <section id="scores" style={{ padding: '72px 5%', background: '#F8FAFF' }}>
        <div style={{ maxWidth: 860, margin: '0 auto', textAlign: 'center' }}>
          <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.12em', color: '#2D6BE4', textTransform: 'uppercase', marginBottom: 12 }}>Understanding Your Score</div>
          <h2 style={{ fontSize: 'clamp(24px,3vw,36px)', fontWeight: 800, color: '#1B2A5E', marginBottom: 12 }}>What Does Your FICO® Score Mean?</h2>
          <p style={{ color: '#666', fontSize: 16, lineHeight: 1.6, marginBottom: 40 }}>FICO® Scores range from 300 to 850. The higher your score, the better your chances of qualifying for credit at favorable rates.</p>

          {/* Score bar */}
          <div style={{ display: 'flex', borderRadius: 10, overflow: 'hidden', height: 28, marginBottom: 12 }}>
            {RANGES.map(r => (
              <div key={r.label} style={{ width: r.w, background: r.color, transition: 'all 0.3s' }} title={`${r.label}: ${r.range}`} />
            ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            {RANGES.map(r => (
              <div key={r.label} style={{ textAlign: 'center', flex: 1 }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: r.color, margin: '6px auto 4px' }} />
                <div style={{ fontSize: 12, fontWeight: 700, color: '#333' }}>{r.label}</div>
                <div style={{ fontSize: 11, color: '#888' }}>{r.range}</div>
              </div>
            ))}
          </div>

          {/* Needle indicator for 742 */}
          <div style={{ marginTop: 24, display: 'inline-flex', alignItems: 'center', gap: 10, background: '#E8F5E9', borderRadius: 8, padding: '10px 20px' }}>
            <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#2ECC71' }} />
            <span style={{ fontSize: 14, fontWeight: 600, color: '#1B5E20' }}>742 — Very Good range. You qualify for most credit products at competitive rates.</span>
          </div>
        </div>
      </section>

      {/* PLANS */}
      <section id="plans" style={{ padding: '72px 5%', background: '#fff' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.12em', color: '#2D6BE4', textTransform: 'uppercase', marginBottom: 12 }}>Pricing</div>
            <h2 style={{ fontSize: 'clamp(24px,3vw,36px)', fontWeight: 800, color: '#1B2A5E', marginBottom: 12 }}>Choose Your Plan</h2>
            <p style={{ color: '#666', fontSize: 16 }}>Cancel anytime. All plans include your FICO® Score and credit report.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 24 }}>
            {PLANS.map(plan => (
              <div key={plan.name} style={{
                border: plan.highlight ? '2px solid #2D6BE4' : '1.5px solid #E2E8F0',
                borderRadius: 16, padding: '32px 28px', position: 'relative',
                background: plan.highlight ? '#F0F6FF' : '#fff',
                boxShadow: plan.highlight ? '0 8px 32px rgba(45,107,228,0.15)' : '0 2px 8px rgba(0,0,0,0.04)',
              }}>
                {plan.highlight && (
                  <div style={{ position: 'absolute', top: -14, left: '50%', transform: 'translateX(-50%)', background: '#2D6BE4', color: '#fff', fontSize: 11, fontWeight: 700, padding: '4px 16px', borderRadius: 20, letterSpacing: '0.08em' }}>MOST POPULAR</div>
                )}
                <div style={{ fontSize: 20, fontWeight: 800, color: '#1B2A5E', marginBottom: 4 }}>{plan.name}</div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 2, marginBottom: 20 }}>
                  <span style={{ fontSize: 36, fontWeight: 900, color: '#1B2A5E' }}>{plan.price}</span>
                  <span style={{ fontSize: 14, color: '#888' }}>{plan.period}</span>
                </div>
                <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 28px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {plan.features.map(f => (
                    <li key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 14, color: '#444' }}>
                      <span style={{ color: '#2ECC71', fontWeight: 700, marginTop: 1 }}>✓</span>{f}
                    </li>
                  ))}
                </ul>
                <Link to="/fico/signup" style={{
                  display: 'block', textAlign: 'center', textDecoration: 'none',
                  background: plan.highlight ? '#2D6BE4' : '#1B2A5E',
                  color: '#fff', padding: '12px', borderRadius: 8, fontWeight: 700, fontSize: 14,
                }}>Get Started</Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" style={{ padding: '72px 5%', background: '#F8FAFF' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.12em', color: '#2D6BE4', textTransform: 'uppercase', marginBottom: 12 }}>Features</div>
            <h2 style={{ fontSize: 'clamp(24px,3vw,36px)', fontWeight: 800, color: '#1B2A5E' }}>Everything You Need to Take Control</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 24 }}>
            {FEATURES.map(f => (
              <div key={f.title} style={{ background: '#fff', borderRadius: 16, padding: '32px 24px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', textAlign: 'center' }}>
                <div style={{ fontSize: 40, marginBottom: 16 }}>{f.icon}</div>
                <div style={{ fontSize: 17, fontWeight: 700, color: '#1B2A5E', marginBottom: 10 }}>{f.title}</div>
                <div style={{ fontSize: 14, color: '#666', lineHeight: 1.65 }}>{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TRUST BANNER */}
      <section style={{ background: '#1B2A5E', padding: '56px 5%', textAlign: 'center' }}>
        <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.12em', color: '#64B5F6', textTransform: 'uppercase', marginBottom: 12 }}>Trusted by Lenders Nationwide</div>
        <h2 style={{ color: '#fff', fontSize: 'clamp(22px,3vw,36px)', fontWeight: 800, marginBottom: 12 }}>90% of Top US Lenders Use FICO<sup style={{ fontSize: '0.5em' }}>®</sup> Scores</h2>
        <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: 16, maxWidth: 560, margin: '0 auto 32px' }}>When you apply for a mortgage, auto loan, or credit card, lenders are almost certainly looking at your FICO® Score.</p>
        <Link to="/fico/signup" style={{ ...BTN_HERO, background: '#2D6BE4' }}>Start for Free</Link>
      </section>

      {/* FOOTER */}
      <footer style={{ background: '#0F1A3A', padding: '48px 5% 24px', color: 'rgba(255,255,255,0.5)', fontSize: 13 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 40, marginBottom: 40 }}>
          <div>
            <div style={{ fontWeight: 900, fontSize: 22, color: '#fff', marginBottom: 12 }}>FICO<sup style={{ fontSize: 10 }}>®</sup></div>
            <p style={{ lineHeight: 1.7, maxWidth: 280 }}>Fair Isaac Corporation. Helping people and businesses make smarter financial decisions since 1956.</p>
          </div>
          {[
            { title: 'Products', links: ['FICO® Score', 'Credit Reports', 'Score Simulator', 'Identity Monitoring'] },
            { title: 'Company', links: ['About FICO', 'Careers', 'Press', 'Contact Us'] },
            { title: 'Support', links: ['Help Center', 'FAQs', 'Privacy Policy', 'Terms of Use'] },
          ].map(col => (
            <div key={col.title}>
              <div style={{ color: '#fff', fontWeight: 700, marginBottom: 14 }}>{col.title}</div>
              {col.links.map(l => <div key={l} style={{ marginBottom: 8, cursor: 'pointer' }}>{l}</div>)}
            </div>
          ))}
        </div>
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: 20, textAlign: 'center' }}>
          © 2026 Fair Isaac Corporation. FICO is a registered trademark of Fair Isaac Corporation. This is a mock/demo site.
        </div>
      </footer>
    </div>
  )
}
