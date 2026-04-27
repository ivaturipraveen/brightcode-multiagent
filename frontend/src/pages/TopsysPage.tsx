import { useEffect } from 'react'

const TOPSYS_COLORS = {
  navy: '#000243',
  blue: '#003388',
  cyan: '#00D4FF',
  teal: '#009688',
  white: '#ffffff',
  lightBg: '#f0f8ff',
}

const services = [
  {
    icon: '🤖',
    title: 'AI & ML',
    desc: 'Harness the power of Artificial Intelligence and Machine Learning to drive smarter business decisions. We deliver solutions that automate processes, uncover insights, and enhance efficiency across your organization.',
  },
  {
    icon: '☁️',
    title: 'Cloud Services',
    desc: 'Empower your business with secure, reliable, and scalable cloud solutions. We enable seamless data management, collaboration, and flexible access to support your growth and operational efficiency.',
  },
  {
    icon: '📱',
    title: 'Application Services',
    desc: 'Deliver robust and customized application solutions to meet your business needs. We develop, maintain, and optimize applications that enhance performance, user experience, and operational efficiency.',
  },
  {
    icon: '⚙️',
    title: 'DevOps',
    desc: 'Accelerate your software delivery with our expert DevOps solutions. We streamline development, deployment, and operations to ensure faster, more reliable, and scalable business outcomes.',
  },
  {
    icon: '🔄',
    title: 'Modernization Services',
    desc: 'Transform your legacy systems with our complete modernization services for enhanced performance and scalability. We help businesses adopt the latest technologies to stay competitive and future-ready.',
  },
  {
    icon: '🔒',
    title: 'Cybersecurity',
    desc: 'Protect your business with advanced cybersecurity solutions that safeguard data and digital assets. We provide proactive threat detection, risk management, and robust security measures for complete peace.',
  },
]

const industries = [
  'Healthcare', 'Finance & Banking', 'Government', 'Education',
  'Retail & E-commerce', 'Manufacturing', 'Telecom', 'Energy',
]

export function TopsysPage() {
  useEffect(() => {
    document.title = 'TOPSYS IT – Connecting Talent with Great Opportunities'
    return () => { document.title = 'BrightCode' }
  }, [])

  return (
    <div style={{ fontFamily: 'Segoe UI, Arial, sans-serif', color: '#222', margin: 0, padding: 0 }}>

      {/* ── Nav ── */}
      <nav style={{
        background: TOPSYS_COLORS.navy,
        padding: '0 40px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 64,
        position: 'sticky',
        top: 0,
        zIndex: 100,
        boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{
            fontSize: 22, fontWeight: 800, color: TOPSYS_COLORS.cyan,
            letterSpacing: 1,
          }}>TOPSYS</span>
          <span style={{ color: TOPSYS_COLORS.white, fontSize: 22, fontWeight: 300 }}>IT</span>
        </div>
        <div style={{ display: 'flex', gap: 28 }}>
          {['Home', 'About', 'Services', 'Industries', 'Clients', 'Careers', 'Contact'].map(link => (
            <a key={link} href="#" style={{
              color: TOPSYS_COLORS.white, textDecoration: 'none',
              fontSize: 14, fontWeight: 500, opacity: 0.9,
              transition: 'color 0.2s',
            }}
              onMouseOver={e => (e.currentTarget.style.color = TOPSYS_COLORS.cyan)}
              onMouseOut={e => (e.currentTarget.style.color = TOPSYS_COLORS.white)}
            >{link}</a>
          ))}
        </div>
      </nav>

      {/* ── Hero ── */}
      <section style={{
        background: `linear-gradient(135deg, ${TOPSYS_COLORS.navy} 0%, ${TOPSYS_COLORS.blue} 60%, ${TOPSYS_COLORS.teal} 100%)`,
        color: TOPSYS_COLORS.white,
        padding: '100px 60px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', inset: 0, opacity: 0.08,
          backgroundImage: 'radial-gradient(circle at 20% 50%, #00D4FF 0%, transparent 50%), radial-gradient(circle at 80% 20%, #009688 0%, transparent 50%)',
        }} />
        <div style={{ position: 'relative', maxWidth: 800, margin: '0 auto' }}>
          <p style={{ color: TOPSYS_COLORS.cyan, fontWeight: 600, letterSpacing: 3, fontSize: 13, textTransform: 'uppercase', marginBottom: 16 }}>
            About Us
          </p>
          <h1 style={{ fontSize: 'clamp(32px, 5vw, 52px)', fontWeight: 800, margin: '0 0 24px', lineHeight: 1.15 }}>
            Join the <span style={{ color: TOPSYS_COLORS.cyan }}>TOPSYS IT</span>
          </h1>
          <p style={{ fontSize: 17, lineHeight: 1.8, opacity: 0.9, maxWidth: 700, margin: '0 auto 40px' }}>
            We specialize in rapidly placing quality talent by cultivating relationships with diverse industries and
            companies. Through a network of IT companies, we connect great talent with great opportunities,
            helping businesses win and careers soar.
          </p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button style={{
              background: TOPSYS_COLORS.cyan, color: TOPSYS_COLORS.navy,
              border: 'none', borderRadius: 6, padding: '14px 32px',
              fontWeight: 700, fontSize: 15, cursor: 'pointer',
            }}>Get Started</button>
            <button style={{
              background: 'transparent', color: TOPSYS_COLORS.white,
              border: `2px solid ${TOPSYS_COLORS.cyan}`, borderRadius: 6, padding: '12px 32px',
              fontWeight: 600, fontSize: 15, cursor: 'pointer',
            }}>Our Services</button>
          </div>
        </div>
      </section>

      {/* ── Stats Bar ── */}
      <section style={{
        background: TOPSYS_COLORS.teal, padding: '28px 60px',
        display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: 16,
      }}>
        {[
          { label: 'Years of Experience', value: '10+' },
          { label: 'Clients Served', value: '200+' },
          { label: 'IT Professionals', value: '500+' },
          { label: 'Industries', value: '12+' },
        ].map(stat => (
          <div key={stat.label} style={{ textAlign: 'center', color: TOPSYS_COLORS.white }}>
            <div style={{ fontSize: 32, fontWeight: 800 }}>{stat.value}</div>
            <div style={{ fontSize: 13, opacity: 0.85 }}>{stat.label}</div>
          </div>
        ))}
      </section>

      {/* ── Services ── */}
      <section style={{ padding: '80px 60px', background: TOPSYS_COLORS.lightBg }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <p style={{ color: TOPSYS_COLORS.teal, fontWeight: 600, letterSpacing: 3, fontSize: 12, textTransform: 'uppercase', textAlign: 'center' }}>
            What We Offer
          </p>
          <h2 style={{ fontSize: 36, fontWeight: 800, textAlign: 'center', color: TOPSYS_COLORS.navy, margin: '8px 0 12px' }}>
            Our IT Services
          </h2>
          <p style={{ textAlign: 'center', color: '#555', maxWidth: 640, margin: '0 auto 48px', lineHeight: 1.7 }}>
            At TOPSYS IT, we provide a wide range of innovative and reliable IT solutions designed to meet your unique business needs.
          </p>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: 28,
          }}>
            {services.map(s => (
              <div key={s.title} style={{
                background: TOPSYS_COLORS.white,
                borderRadius: 12,
                padding: 32,
                boxShadow: '0 4px 20px rgba(0,2,67,0.08)',
                borderTop: `4px solid ${TOPSYS_COLORS.cyan}`,
                transition: 'transform 0.2s, box-shadow 0.2s',
              }}
                onMouseOver={e => {
                  (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-4px)'
                  ;(e.currentTarget as HTMLDivElement).style.boxShadow = '0 8px 32px rgba(0,2,67,0.15)'
                }}
                onMouseOut={e => {
                  (e.currentTarget as HTMLDivElement).style.transform = 'none'
                  ;(e.currentTarget as HTMLDivElement).style.boxShadow = '0 4px 20px rgba(0,2,67,0.08)'
                }}
              >
                <div style={{ fontSize: 36, marginBottom: 14 }}>{s.icon}</div>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: TOPSYS_COLORS.navy, margin: '0 0 10px' }}>{s.title}</h3>
                <p style={{ color: '#666', lineHeight: 1.7, fontSize: 14, margin: 0 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Clients ── */}
      <section style={{ padding: '80px 60px', background: TOPSYS_COLORS.navy }}>
        <div style={{ maxWidth: 1000, margin: '0 auto', textAlign: 'center' }}>
          <p style={{ color: TOPSYS_COLORS.cyan, fontWeight: 600, letterSpacing: 3, fontSize: 12, textTransform: 'uppercase' }}>
            Real Customers. Real Results.
          </p>
          <h2 style={{ fontSize: 36, fontWeight: 800, color: TOPSYS_COLORS.white, margin: '8px 0 16px' }}>
            Our Government & Private Clients
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.7)', maxWidth: 600, margin: '0 auto 48px', lineHeight: 1.7 }}>
            Real-world results from customers using TOPSYS IT to move faster, work smarter, and lead with data.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 16 }}>
            {['Government Agency', 'Federal Dept.', 'State Services', 'DoD Contractor',
              'FinTech Corp', 'HealthCare Inc', 'Retail Chain', 'Energy Co.'].map(c => (
              <div key={c} style={{
                background: 'rgba(255,255,255,0.08)',
                border: `1px solid rgba(0,212,255,0.25)`,
                borderRadius: 8,
                padding: '16px 28px',
                color: TOPSYS_COLORS.white,
                fontWeight: 600,
                fontSize: 14,
              }}>{c}</div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Industries ── */}
      <section style={{ padding: '80px 60px', background: TOPSYS_COLORS.white }}>
        <div style={{ maxWidth: 1000, margin: '0 auto', textAlign: 'center' }}>
          <p style={{ color: TOPSYS_COLORS.teal, fontWeight: 600, letterSpacing: 3, fontSize: 12, textTransform: 'uppercase' }}>
            Sectors
          </p>
          <h2 style={{ fontSize: 36, fontWeight: 800, color: TOPSYS_COLORS.navy, margin: '8px 0 16px' }}>
            Industries We Serve
          </h2>
          <p style={{ color: '#555', maxWidth: 640, margin: '0 auto 48px', lineHeight: 1.7 }}>
            TOPSYS IT partners with businesses across diverse industries to deliver innovative and customized technology solutions.
          </p>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
            gap: 16,
          }}>
            {industries.map(ind => (
              <div key={ind} style={{
                background: TOPSYS_COLORS.lightBg,
                borderRadius: 8,
                padding: '20px 16px',
                fontWeight: 600,
                color: TOPSYS_COLORS.navy,
                fontSize: 14,
                border: `1px solid rgba(0,150,136,0.2)`,
              }}>{ind}</div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{
        background: `linear-gradient(135deg, ${TOPSYS_COLORS.blue}, ${TOPSYS_COLORS.teal})`,
        padding: '80px 60px',
        textAlign: 'center',
        color: TOPSYS_COLORS.white,
      }}>
        <h2 style={{ fontSize: 36, fontWeight: 800, margin: '0 0 16px' }}>
          Ready to Connect Talent with Opportunity?
        </h2>
        <p style={{ opacity: 0.85, fontSize: 16, marginBottom: 36, maxWidth: 500, margin: '0 auto 36px' }}>
          Join hundreds of organizations that trust TOPSYS IT to power their digital transformation.
        </p>
        <button style={{
          background: TOPSYS_COLORS.white, color: TOPSYS_COLORS.navy,
          border: 'none', borderRadius: 6, padding: '16px 40px',
          fontWeight: 700, fontSize: 16, cursor: 'pointer',
        }}>Contact Us Today</button>
      </section>

      {/* ── Footer ── */}
      <footer style={{
        background: TOPSYS_COLORS.navy,
        color: 'rgba(255,255,255,0.6)',
        padding: '32px 60px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 12,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ color: TOPSYS_COLORS.cyan, fontWeight: 800, fontSize: 18 }}>TOPSYS</span>
          <span style={{ color: TOPSYS_COLORS.white, fontWeight: 300, fontSize: 18 }}>IT</span>
        </div>
        <span style={{ fontSize: 13 }}>© {new Date().getFullYear()} TOPSYS IT. All rights reserved.</span>
        <div style={{ display: 'flex', gap: 20, fontSize: 13 }}>
          {['Privacy Policy', 'Terms of Service', 'Sitemap'].map(l => (
            <a key={l} href="#" style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none' }}>{l}</a>
          ))}
        </div>
      </footer>
    </div>
  )
}
