import { useState } from 'react'

const POSTERS = [
  {
    id: 'v1',
    src: '/posters/bart_poster_v1_bold.png',
    title: 'Variation 1 — Bold Statement',
    theme: 'Navy Blue',
    tag: 'AWARENESS',
    tagColor: '#003882',
    description:
      'A powerful, direct message on deep navy. Designed for high-visibility placement on train platforms and station walls. Bold typography commands attention.',
    usage: ['Platform walls', 'Station entrances', 'Train interiors'],
  },
  {
    id: 'v2',
    src: '/posters/bart_poster_v2_community.png',
    title: 'Variation 2 — Community United',
    theme: 'White / Navy',
    tag: 'COMMUNITY',
    tagColor: '#0066CC',
    description:
      'A clean, community-forward design highlighting solidarity. Works well in print collateral, brochures, and digital displays at community centers and libraries.',
    usage: ['Brochures', 'Community centers', 'Digital displays'],
  },
  {
    id: 'v3',
    src: '/posters/bart_poster_v3_report.png',
    title: 'Variation 3 — Report It',
    theme: 'Navy / Orange',
    tag: 'ACTION',
    tagColor: '#FF6B00',
    description:
      'Action-oriented. Drives riders to report incidents immediately. Features the BART police text line front and center. Ideal for restrooms, ticketing areas, and car interiors.',
    usage: ['Car interiors', 'Restrooms', 'Ticketing areas'],
  },
  {
    id: 'v4',
    src: '/posters/bart_poster_v4_upstander.png',
    title: 'Variation 4 — Be an Upstander',
    theme: 'Navy / Warm Orange',
    tag: 'BYSTANDER',
    tagColor: '#B85C00',
    description:
      'Focuses on bystander intervention — turning witnesses into allies. Addresses riders directly with an empowering call to action. Suitable for social media and digital campaigns.',
    usage: ['Social media', 'Digital ads', 'Website banners'],
  },
]

const STATS = [
  { number: '70%', label: 'of incidents go unreported' },
  { number: '1 in 3', label: 'women experience harassment on transit' },
  { number: '510-874-7440', label: 'BART Police text line' },
  { number: '24/7', label: 'safety reporting available' },
]

const RESOURCES = [
  { icon: '📱', title: 'Text to Report', desc: 'Text 510-874-7440 anytime to report harassment to BART Police.', cta: 'Save Number' },
  { icon: '🚨', title: 'Emergency', desc: 'Press the blue emergency intercom on any BART platform or train car.', cta: 'Learn More' },
  { icon: '🌐', title: 'Online Report', desc: 'Submit a detailed incident report at bart.gov/about/police/report', cta: 'File Report' },
  { icon: '🤝', title: 'Support Services', desc: 'Bay Area Women Against Rape: 510-845-7273. 24-hour crisis line.', cta: 'Get Support' },
]

export function BartCampaignPage() {
  const [selected, setSelected] = useState<string | null>(null)
  const [lightbox, setLightbox] = useState<string | null>(null)

  const selectedPoster = POSTERS.find(p => p.id === selected)

  return (
    <div style={{ fontFamily: "'Segoe UI', Arial, sans-serif", minHeight: '100vh', background: '#f4f6fb', color: '#111' }}>

      {/* ── Top Bar ── */}
      <div style={{ background: '#00264d', color: '#87CEFA', fontSize: 13, padding: '6px 24px', display: 'flex', justifyContent: 'space-between' }}>
        <span>Bay Area Rapid Transit — Public Safety Campaign</span>
        <div style={{ display: 'flex', gap: 16 }}>
          <a href="/bart" style={{ color: '#87CEFA', textDecoration: 'none' }}>← Back to BART Portal</a>
          <a href="#download" style={{ color: '#FF6B00', textDecoration: 'none', fontWeight: 700 }}>↓ Download Posters</a>
        </div>
      </div>

      {/* ── Hero ── */}
      <header style={{
        background: 'linear-gradient(135deg, #001f4d 0%, #003882 60%, #004aab 100%)',
        padding: '64px 24px 56px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Decorative stripe */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 5, background: 'linear-gradient(90deg, #FF6B00, #FFB347, #FF6B00)' }} />

        <div style={{
          display: 'inline-block', background: '#FF6B00', color: '#fff',
          borderRadius: 4, padding: '4px 14px', fontSize: 12, fontWeight: 800,
          letterSpacing: 2, marginBottom: 20, textTransform: 'uppercase',
        }}>
          BART Public Safety Initiative
        </div>

        <h1 style={{
          color: '#fff', fontSize: 'clamp(36px, 6vw, 72px)', fontWeight: 900,
          margin: '0 0 16px', letterSpacing: -1, lineHeight: 1.1,
          textShadow: '0 2px 20px rgba(0,0,0,0.4)',
        }}>
          Not One More Girl
        </h1>

        <p style={{ color: '#87CEFA', fontSize: 20, maxWidth: 640, margin: '0 auto 32px', lineHeight: 1.6 }}>
          Every rider deserves to feel safe. BART's zero-tolerance campaign against sexual harassment and assault on the Bay Area transit system.
        </p>

        <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
          <a href="#posters" style={{
            background: '#FF6B00', color: '#fff', borderRadius: 8,
            padding: '13px 28px', fontWeight: 700, fontSize: 16, textDecoration: 'none',
          }}>View Campaign Posters</a>
          <a href="#report" style={{
            background: 'rgba(255,255,255,0.12)', color: '#fff', borderRadius: 8,
            padding: '13px 28px', fontWeight: 700, fontSize: 16, textDecoration: 'none',
            border: '2px solid rgba(255,255,255,0.3)',
          }}>Report an Incident</a>
        </div>
      </header>

      {/* ── Stats Bar ── */}
      <div style={{ background: '#FF6B00', padding: '20px 24px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
          {STATS.map(s => (
            <div key={s.label} style={{ textAlign: 'center', color: '#fff' }}>
              <div style={{ fontSize: 26, fontWeight: 900, letterSpacing: -1 }}>{s.number}</div>
              <div style={{ fontSize: 13, opacity: 0.9, marginTop: 2 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── About the Campaign ── */}
      <section style={{ maxWidth: 1100, margin: '0 auto', padding: '52px 24px 0' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40, alignItems: 'center' }}>
          <div>
            <span style={{ color: '#FF6B00', fontWeight: 700, fontSize: 13, letterSpacing: 2, textTransform: 'uppercase' }}>About the Initiative</span>
            <h2 style={{ color: '#003882', fontSize: 32, fontWeight: 800, margin: '8px 0 16px', lineHeight: 1.2 }}>
              Committed to Safe, Respectful Transit for All
            </h2>
            <p style={{ color: '#444', fontSize: 15, lineHeight: 1.8, marginBottom: 16 }}>
              <strong>Not One More Girl</strong> is BART's public-facing initiative to eliminate sexual harassment and assault across all stations and train lines. The campaign empowers riders — bystanders and survivors alike — to report incidents and take action.
            </p>
            <p style={{ color: '#444', fontSize: 15, lineHeight: 1.8, marginBottom: 20 }}>
              These campaign materials are designed in accordance with BART's brand standards and are available for use by community organizations, schools, and partner agencies throughout the Bay Area.
            </p>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              {['Zero Tolerance Policy', 'Bystander Training', 'Survivor Support', 'Community Partnership'].map(tag => (
                <span key={tag} style={{ background: '#E8F0FF', color: '#003882', borderRadius: 20, padding: '5px 14px', fontSize: 13, fontWeight: 600 }}>
                  {tag}
                </span>
              ))}
            </div>
          </div>
          <div style={{
            background: 'linear-gradient(135deg, #003882, #0052cc)',
            borderRadius: 16, padding: 32, color: '#fff',
          }}>
            <div style={{ fontSize: 36, marginBottom: 12 }}>🛡️</div>
            <h3 style={{ margin: '0 0 12px', fontSize: 22 }}>BART's Commitment</h3>
            <ul style={{ margin: 0, padding: '0 0 0 18px', fontSize: 15, lineHeight: 2.2, opacity: 0.9 }}>
              <li>Dedicated BART Police transit safety units</li>
              <li>24/7 text-to-report incident line</li>
              <li>Undercover officers on high-incident routes</li>
              <li>Mandatory bystander intervention training</li>
              <li>Partnership with Bay Area survivor advocates</li>
              <li>Multilingual campaign materials</li>
            </ul>
          </div>
        </div>
      </section>

      {/* ── Poster Gallery ── */}
      <section id="posters" style={{ maxWidth: 1100, margin: '0 auto', padding: '56px 24px 0' }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <span style={{ color: '#FF6B00', fontWeight: 700, fontSize: 13, letterSpacing: 2, textTransform: 'uppercase' }}>Campaign Materials</span>
          <h2 style={{ color: '#003882', fontSize: 36, fontWeight: 800, margin: '8px 0 12px' }}>
            Official Campaign Poster Variations
          </h2>
          <p style={{ color: '#555', fontSize: 15, maxWidth: 600, margin: '0 auto' }}>
            Four poster designs, each targeting a different audience and placement context. All meet BART brand standards — navy, orange, and white palette.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }} id="download">
          {POSTERS.map(poster => (
            <div
              key={poster.id}
              style={{
                background: '#fff', borderRadius: 14, overflow: 'hidden',
                boxShadow: selected === poster.id
                  ? '0 0 0 3px #003882, 0 8px 32px rgba(0,56,130,0.2)'
                  : '0 2px 16px rgba(0,56,130,0.10)',
                cursor: 'pointer', transition: 'all 0.2s',
                transform: selected === poster.id ? 'translateY(-4px)' : 'none',
              }}
              onClick={() => setSelected(selected === poster.id ? null : poster.id)}
            >
              {/* Poster image */}
              <div style={{ position: 'relative', background: '#001f4d' }}>
                <img
                  src={poster.src}
                  alt={poster.title}
                  style={{ width: '100%', display: 'block', objectFit: 'cover', height: 320 }}
                  onClick={e => { e.stopPropagation(); setLightbox(poster.src) }}
                />
                <span style={{
                  position: 'absolute', top: 10, left: 10,
                  background: poster.tagColor, color: '#fff',
                  borderRadius: 4, padding: '3px 10px', fontSize: 11, fontWeight: 800, letterSpacing: 1,
                }}>
                  {poster.tag}
                </span>
                <button
                  onClick={e => { e.stopPropagation(); setLightbox(poster.src) }}
                  style={{
                    position: 'absolute', top: 10, right: 10, background: 'rgba(0,0,0,0.55)',
                    color: '#fff', border: 'none', borderRadius: 4, padding: '4px 10px',
                    fontSize: 12, cursor: 'pointer',
                  }}>
                  🔍 Full View
                </button>
              </div>

              <div style={{ padding: '16px 16px 12px' }}>
                <div style={{ fontWeight: 700, fontSize: 14, color: '#003882', marginBottom: 4 }}>{poster.title}</div>
                <div style={{ fontSize: 12, color: '#888', marginBottom: 8 }}>Theme: {poster.theme}</div>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  <a
                    href={poster.src}
                    download
                    onClick={e => e.stopPropagation()}
                    style={{
                      background: '#003882', color: '#fff', borderRadius: 5,
                      padding: '6px 12px', fontSize: 12, fontWeight: 600, textDecoration: 'none', flex: 1, textAlign: 'center',
                    }}>
                    ↓ Download
                  </a>
                  <button
                    onClick={e => { e.stopPropagation(); setSelected(selected === poster.id ? null : poster.id) }}
                    style={{
                      background: selected === poster.id ? '#FF6B00' : '#f0f4ff',
                      color: selected === poster.id ? '#fff' : '#003882',
                      border: 'none', borderRadius: 5, padding: '6px 12px',
                      fontSize: 12, fontWeight: 600, cursor: 'pointer', flex: 1,
                    }}>
                    {selected === poster.id ? '✓ Selected' : 'Details'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Detail Panel */}
        {selectedPoster && (
          <div style={{
            background: '#fff', borderRadius: 14, padding: 28, marginTop: 24,
            boxShadow: '0 4px 24px rgba(0,56,130,0.12)',
            borderLeft: `6px solid ${selectedPoster.tagColor}`,
            display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 28, alignItems: 'start',
          }}>
            <img src={selectedPoster.src} alt={selectedPoster.title}
              style={{ width: '100%', borderRadius: 10, boxShadow: '0 2px 16px rgba(0,0,0,0.15)' }} />
            <div>
              <span style={{ background: selectedPoster.tagColor, color: '#fff', borderRadius: 4, padding: '3px 12px', fontSize: 12, fontWeight: 700 }}>
                {selectedPoster.tag}
              </span>
              <h3 style={{ color: '#003882', fontSize: 24, margin: '12px 0 8px' }}>{selectedPoster.title}</h3>
              <p style={{ color: '#444', fontSize: 15, lineHeight: 1.7, marginBottom: 20 }}>{selectedPoster.description}</p>

              <div style={{ marginBottom: 20 }}>
                <div style={{ fontWeight: 700, color: '#003882', marginBottom: 8, fontSize: 14 }}>Recommended Placements:</div>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {selectedPoster.usage.map(u => (
                    <span key={u} style={{ background: '#E8F0FF', color: '#003882', borderRadius: 20, padding: '4px 14px', fontSize: 13, fontWeight: 600 }}>
                      📍 {u}
                    </span>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', gap: 10 }}>
                <a href={selectedPoster.src} download
                  style={{ background: '#003882', color: '#fff', borderRadius: 8, padding: '10px 22px', fontWeight: 700, fontSize: 14, textDecoration: 'none' }}>
                  ↓ Download PNG
                </a>
                <button
                  onClick={() => setSelected(null)}
                  style={{ background: '#f0f4ff', color: '#003882', border: 'none', borderRadius: 8, padding: '10px 22px', fontWeight: 700, fontSize: 14, cursor: 'pointer' }}>
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* ── Report an Incident ── */}
      <section id="report" style={{ maxWidth: 1100, margin: '0 auto', padding: '56px 24px 0' }}>
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <span style={{ color: '#FF6B00', fontWeight: 700, fontSize: 13, letterSpacing: 2, textTransform: 'uppercase' }}>Take Action</span>
          <h2 style={{ color: '#003882', fontSize: 36, fontWeight: 800, margin: '8px 0 12px' }}>How to Report & Get Help</h2>
          <p style={{ color: '#555', fontSize: 15, maxWidth: 560, margin: '0 auto' }}>
            No incident is too small to report. Your report helps keep every rider safer.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 40 }}>
          {RESOURCES.map(r => (
            <div key={r.title} style={{
              background: '#fff', borderRadius: 14, padding: 24, textAlign: 'center',
              boxShadow: '0 2px 12px rgba(0,56,130,0.08)',
              borderTop: '4px solid #003882',
            }}>
              <div style={{ fontSize: 36, marginBottom: 12 }}>{r.icon}</div>
              <div style={{ fontWeight: 700, color: '#003882', marginBottom: 8, fontSize: 16 }}>{r.title}</div>
              <div style={{ fontSize: 13, color: '#555', lineHeight: 1.6, marginBottom: 16 }}>{r.desc}</div>
              <button style={{
                background: '#FF6B00', color: '#fff', border: 'none', borderRadius: 6,
                padding: '8px 18px', fontWeight: 700, cursor: 'pointer', fontSize: 13, width: '100%',
              }}>
                {r.cta}
              </button>
            </div>
          ))}
        </div>

        {/* Bystander Tips */}
        <div style={{
          background: 'linear-gradient(135deg, #003882, #001f4d)',
          borderRadius: 16, padding: 36, color: '#fff', marginBottom: 40,
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, alignItems: 'center' }}>
            <div>
              <h3 style={{ fontSize: 26, margin: '0 0 12px' }}>🙋 Bystander Intervention Tips</h3>
              <p style={{ opacity: 0.85, lineHeight: 1.7, marginBottom: 0 }}>
                You don't have to confront the harasser directly. Even small actions can make a big difference.
              </p>
            </div>
            <div>
              {[
                ['🗣️', 'Direct', 'Calmly tell the harasser their behavior is unacceptable.'],
                ['🤝', 'Distract', 'Start a conversation with the person being harassed.'],
                ['👥', 'Delegate', 'Ask a BART employee or fellow rider to help.'],
                ['📱', 'Document', 'Record the incident and share with BART Police.'],
                ['✅', 'Delay', 'Check in with the person after the incident is over.'],
              ].map(([emoji, title, desc]) => (
                <div key={title as string} style={{ display: 'flex', gap: 12, marginBottom: 14, alignItems: 'flex-start' }}>
                  <span style={{ fontSize: 22, flexShrink: 0 }}>{emoji}</span>
                  <div>
                    <span style={{ fontWeight: 700, color: '#FFB347' }}>{title}: </span>
                    <span style={{ fontSize: 14, opacity: 0.9 }}>{desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Brand Guidelines ── */}
      <section style={{ maxWidth: 1100, margin: '0 auto', padding: '40px 24px 0' }}>
        <div style={{ background: '#fff', borderRadius: 16, padding: 32, boxShadow: '0 2px 16px rgba(0,56,130,0.08)' }}>
          <h3 style={{ color: '#003882', fontSize: 22, margin: '0 0 20px' }}>🎨 Campaign Brand Standards</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
            <div>
              <div style={{ fontWeight: 700, color: '#003882', marginBottom: 12 }}>Color Palette</div>
              {[
                { color: '#003882', name: 'BART Navy', hex: '#003882' },
                { color: '#FF6B00', name: 'BART Orange', hex: '#FF6B00' },
                { color: '#FFFFFF', name: 'White', hex: '#FFFFFF', border: true },
                { color: '#0066CC', name: 'Accent Blue', hex: '#0066CC' },
              ].map(c => (
                <div key={c.name} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                  <div style={{ width: 32, height: 32, borderRadius: 6, background: c.color, border: c.border ? '1px solid #ddd' : 'none', flexShrink: 0 }} />
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>{c.name}</div>
                    <div style={{ fontSize: 12, color: '#888', fontFamily: 'monospace' }}>{c.hex}</div>
                  </div>
                </div>
              ))}
            </div>
            <div>
              <div style={{ fontWeight: 700, color: '#003882', marginBottom: 12 }}>Typography</div>
              <div style={{ fontSize: 13, color: '#555', lineHeight: 2 }}>
                <div><strong>Headlines:</strong> Bold sans-serif, 900 weight</div>
                <div><strong>Body:</strong> Regular sans-serif, 400–600 weight</div>
                <div><strong>Taglines:</strong> ALL CAPS, letter-spacing 2px</div>
                <div><strong>Min size:</strong> 12px (accessibility)</div>
                <div><strong>Contrast ratio:</strong> ≥ 4.5:1 (WCAG AA)</div>
              </div>
            </div>
            <div>
              <div style={{ fontWeight: 700, color: '#003882', marginBottom: 12 }}>Usage Guidelines</div>
              <div style={{ fontSize: 13, color: '#555', lineHeight: 2 }}>
                <div>✅ Community organizations</div>
                <div>✅ Partner agencies</div>
                <div>✅ Schools & universities</div>
                <div>✅ Social media (with credit)</div>
                <div>❌ Commercial use prohibited</div>
                <div>❌ Do not alter BART branding</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer style={{ background: '#001f4d', color: '#aac4e8', marginTop: 60, padding: '32px 24px', textAlign: 'center' }}>
        <div style={{ maxWidth: 700, margin: '0 auto' }}>
          <div style={{ fontWeight: 800, fontSize: 18, color: '#fff', marginBottom: 8 }}>Not One More Girl</div>
          <div style={{ fontSize: 14, marginBottom: 16, opacity: 0.8 }}>
            Bay Area Rapid Transit — Public Safety Initiative
          </div>
          <div style={{ display: 'flex', gap: 20, justifyContent: 'center', marginBottom: 20, flexWrap: 'wrap' }}>
            <a href="/bart" style={{ color: '#87CEFA', textDecoration: 'none', fontSize: 14 }}>BART Portal</a>
            <a href="#" style={{ color: '#87CEFA', textDecoration: 'none', fontSize: 14 }}>bart.gov/safety</a>
            <a href="#" style={{ color: '#87CEFA', textDecoration: 'none', fontSize: 14 }}>Privacy Policy</a>
            <a href="#" style={{ color: '#87CEFA', textDecoration: 'none', fontSize: 14 }}>Accessibility</a>
          </div>
          <div style={{ fontSize: 13, opacity: 0.6 }}>
            © 2026 Bay Area Rapid Transit District. Campaign materials available for non-commercial community use.
          </div>
        </div>
      </footer>

      {/* ── Lightbox ── */}
      {lightbox && (
        <div
          onClick={() => setLightbox(null)}
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.88)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
            cursor: 'zoom-out',
          }}
        >
          <img
            src={lightbox}
            alt="Poster full view"
            style={{ maxHeight: '92vh', maxWidth: '90vw', borderRadius: 10, boxShadow: '0 8px 60px rgba(0,0,0,0.6)' }}
            onClick={e => e.stopPropagation()}
          />
          <button
            onClick={() => setLightbox(null)}
            style={{
              position: 'fixed', top: 20, right: 24, background: 'rgba(255,255,255,0.15)',
              color: '#fff', border: 'none', borderRadius: '50%', width: 42, height: 42,
              fontSize: 22, cursor: 'pointer', fontWeight: 700,
            }}>
            ×
          </button>
        </div>
      )}
    </div>
  )
}
