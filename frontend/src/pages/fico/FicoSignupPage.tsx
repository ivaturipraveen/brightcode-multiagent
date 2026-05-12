import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const STEPS = ['Account', 'Personal', 'Review']

export function FicoSignupPage() {
  const [step, setStep] = useState(0)
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', password: '', confirm: '',
    phone: '', dob: '', terms: false, marketing: false,
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [showPw, setShowPw] = useState(false)
  const navigate = useNavigate()

  const set = (k: string, v: string | boolean) => setForm(f => ({ ...f, [k]: v }))

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '12px 14px', borderRadius: 8,
    border: '1.5px solid #D1D9E0', fontSize: 15, fontFamily: 'Inter,sans-serif',
    outline: 'none', boxSizing: 'border-box', color: '#1B2A5E',
  }
  const labelStyle: React.CSSProperties = {
    display: 'block', fontSize: 13, fontWeight: 600, color: '#333', marginBottom: 6,
  }
  const errStyle: React.CSSProperties = {
    fontSize: 12, color: '#CC0000', marginTop: 4,
  }

  const validateStep0 = () => {
    const e: Record<string, string> = {}
    if (!form.email) e.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email'
    if (!form.password) e.password = 'Password is required'
    else if (form.password.length < 8) e.password = 'Password must be at least 8 characters'
    if (form.password !== form.confirm) e.confirm = 'Passwords do not match'
    setErrors(e)
    return Object.keys(e).length === 0
  }
  const validateStep1 = () => {
    const e: Record<string, string> = {}
    if (!form.firstName) e.firstName = 'First name is required'
    if (!form.lastName) e.lastName = 'Last name is required'
    if (!form.terms) e.terms = 'You must accept the Terms of Service'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const next = () => {
    if (step === 0 && !validateStep0()) return
    if (step === 1 && !validateStep1()) return
    setStep(s => s + 1)
  }

  const submit = () => {
    setLoading(true)
    setTimeout(() => { setLoading(false); setDone(true) }, 1500)
  }

  if (done) return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(145deg, #F0F4FF 0%, #E8F0FE 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter,sans-serif' }}>
      <div style={{ background: '#fff', borderRadius: 20, padding: '56px 44px', maxWidth: 420, width: '100%', textAlign: 'center', boxShadow: '0 12px 48px rgba(27,42,94,0.12)' }}>
        <div style={{ fontSize: 64, marginBottom: 16 }}>🎉</div>
        <h2 style={{ fontSize: 26, fontWeight: 800, color: '#1B2A5E', marginBottom: 10 }}>Account Created!</h2>
        <p style={{ color: '#666', fontSize: 15, lineHeight: 1.6, marginBottom: 28 }}>
          Welcome to myFICO, <strong>{form.firstName}</strong>! Your FICO® Score is being calculated. You'll receive a confirmation at <strong>{form.email}</strong>.
        </p>
        <button onClick={() => navigate('/fico')} style={{
          background: '#2D6BE4', color: '#fff', border: 'none', borderRadius: 8,
          padding: '13px 32px', fontSize: 15, fontWeight: 700, cursor: 'pointer', fontFamily: 'Inter,sans-serif',
        }}>View My Dashboard</button>
      </div>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(145deg, #F0F4FF 0%, #E8F0FE 100%)', fontFamily: 'Inter,sans-serif' }}>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />

      {/* Nav */}
      <nav style={{ padding: '0 5%', height: 60, background: '#fff', display: 'flex', alignItems: 'center', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
        <Link to="/fico" style={{ fontWeight: 900, fontSize: 24, color: '#1B2A5E', textDecoration: 'none' }}>
          FICO<sup style={{ fontSize: 10, verticalAlign: 'super' }}>®</sup>
        </Link>
      </nav>

      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '40px 20px', gap: 32, flexWrap: 'wrap' }}>
        {/* Main card */}
        <div style={{ background: '#fff', borderRadius: 20, boxShadow: '0 12px 48px rgba(27,42,94,0.12)', padding: '44px 40px', width: '100%', maxWidth: 460 }}>
          {/* Logo */}
          <div style={{ textAlign: 'center', marginBottom: 28 }}>
            <div style={{ fontWeight: 900, fontSize: 28, color: '#1B2A5E' }}>FICO<sup style={{ fontSize: 12, verticalAlign: 'super' }}>®</sup></div>
          </div>

          {/* Step indicator */}
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: 32 }}>
            {STEPS.map((s, i) => (
              <div key={s} style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: i < step ? '#2ECC71' : i === step ? '#2D6BE4' : '#E2E8F0',
                    color: i <= step ? '#fff' : '#888', fontWeight: 700, fontSize: 13,
                    transition: 'all 0.3s',
                  }}>
                    {i < step ? '✓' : i + 1}
                  </div>
                  <div style={{ fontSize: 11, marginTop: 4, fontWeight: 600, color: i === step ? '#2D6BE4' : '#999' }}>{s}</div>
                </div>
                {i < STEPS.length - 1 && (
                  <div style={{ height: 2, background: i < step ? '#2ECC71' : '#E2E8F0', flex: 2, marginBottom: 18, transition: 'background 0.3s' }} />
                )}
              </div>
            ))}
          </div>

          {/* Step 0: Account */}
          {step === 0 && (
            <>
              <h2 style={{ fontSize: 20, fontWeight: 800, color: '#1B2A5E', marginBottom: 4 }}>Create Your Account</h2>
              <p style={{ fontSize: 14, color: '#666', marginBottom: 24 }}>Set up your login credentials</p>
              <div style={{ marginBottom: 16 }}>
                <label style={labelStyle}>Email Address</label>
                <input type="email" value={form.email} onChange={e => set('email', e.target.value)}
                  placeholder="you@example.com" style={{ ...inputStyle, borderColor: errors.email ? '#CC0000' : '#D1D9E0' }} />
                {errors.email && <div style={errStyle}>{errors.email}</div>}
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={labelStyle}>Password</label>
                <div style={{ position: 'relative' }}>
                  <input type={showPw ? 'text' : 'password'} value={form.password}
                    onChange={e => set('password', e.target.value)}
                    placeholder="Min. 8 characters" style={{ ...inputStyle, paddingRight: 44, borderColor: errors.password ? '#CC0000' : '#D1D9E0' }} />
                  <button type="button" onClick={() => setShowPw(!showPw)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: 16, color: '#888' }}>{showPw ? '🙈' : '👁'}</button>
                </div>
                {errors.password && <div style={errStyle}>{errors.password}</div>}
                {/* Password strength */}
                {form.password && (
                  <div style={{ marginTop: 8, display: 'flex', gap: 4 }}>
                    {[1, 2, 3, 4].map(i => (
                      <div key={i} style={{ height: 4, flex: 1, borderRadius: 2, background: form.password.length >= i * 3 ? (form.password.length >= 12 ? '#2ECC71' : '#F39C12') : '#E2E8F0', transition: 'background 0.3s' }} />
                    ))}
                  </div>
                )}
              </div>
              <div style={{ marginBottom: 24 }}>
                <label style={labelStyle}>Confirm Password</label>
                <input type="password" value={form.confirm} onChange={e => set('confirm', e.target.value)}
                  placeholder="Re-enter password" style={{ ...inputStyle, borderColor: errors.confirm ? '#CC0000' : '#D1D9E0' }} />
                {errors.confirm && <div style={errStyle}>{errors.confirm}</div>}
              </div>
              <button onClick={next} style={{ width: '100%', background: '#2D6BE4', color: '#fff', border: 'none', borderRadius: 8, padding: '13px', fontSize: 15, fontWeight: 700, cursor: 'pointer', fontFamily: 'Inter,sans-serif' }}>
                Continue →
              </button>
            </>
          )}

          {/* Step 1: Personal */}
          {step === 1 && (
            <>
              <h2 style={{ fontSize: 20, fontWeight: 800, color: '#1B2A5E', marginBottom: 4 }}>Personal Information</h2>
              <p style={{ fontSize: 14, color: '#666', marginBottom: 24 }}>Tell us a bit about yourself</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
                <div>
                  <label style={labelStyle}>First Name</label>
                  <input value={form.firstName} onChange={e => set('firstName', e.target.value)}
                    placeholder="John" style={{ ...inputStyle, borderColor: errors.firstName ? '#CC0000' : '#D1D9E0' }} />
                  {errors.firstName && <div style={errStyle}>{errors.firstName}</div>}
                </div>
                <div>
                  <label style={labelStyle}>Last Name</label>
                  <input value={form.lastName} onChange={e => set('lastName', e.target.value)}
                    placeholder="Smith" style={{ ...inputStyle, borderColor: errors.lastName ? '#CC0000' : '#D1D9E0' }} />
                  {errors.lastName && <div style={errStyle}>{errors.lastName}</div>}
                </div>
              </div>
              <div style={{ marginBottom: 14 }}>
                <label style={labelStyle}>Phone Number <span style={{ fontWeight: 400, color: '#aaa' }}>(optional)</span></label>
                <input value={form.phone} onChange={e => set('phone', e.target.value)}
                  placeholder="+1 (555) 000-0000" style={inputStyle} />
              </div>
              <div style={{ marginBottom: 20 }}>
                <label style={labelStyle}>Date of Birth <span style={{ fontWeight: 400, color: '#aaa' }}>(optional)</span></label>
                <input type="date" value={form.dob} onChange={e => set('dob', e.target.value)} style={inputStyle} />
              </div>
              <div style={{ marginBottom: 12 }}>
                <label style={{ display: 'flex', alignItems: 'flex-start', gap: 10, cursor: 'pointer', fontSize: 13 }}>
                  <input type="checkbox" checked={form.terms} onChange={e => set('terms', e.target.checked)} style={{ marginTop: 2, accentColor: '#2D6BE4' }} />
                  <span style={{ color: errors.terms ? '#CC0000' : '#555', lineHeight: 1.5 }}>
                    I agree to the <a href="#" style={{ color: '#2D6BE4' }}>Terms of Service</a> and <a href="#" style={{ color: '#2D6BE4' }}>Privacy Policy</a>
                  </span>
                </label>
                {errors.terms && <div style={{ ...errStyle, marginLeft: 24 }}>{errors.terms}</div>}
              </div>
              <div style={{ marginBottom: 24 }}>
                <label style={{ display: 'flex', alignItems: 'flex-start', gap: 10, cursor: 'pointer', fontSize: 13 }}>
                  <input type="checkbox" checked={form.marketing} onChange={e => set('marketing', e.target.checked)} style={{ marginTop: 2, accentColor: '#2D6BE4' }} />
                  <span style={{ color: '#555', lineHeight: 1.5 }}>Send me tips on improving my credit score (optional)</span>
                </label>
              </div>
              <div style={{ display: 'flex', gap: 12 }}>
                <button onClick={() => setStep(0)} style={{ flex: 1, background: '#F0F4FF', color: '#1B2A5E', border: 'none', borderRadius: 8, padding: '13px', fontSize: 15, fontWeight: 600, cursor: 'pointer' }}>← Back</button>
                <button onClick={next} style={{ flex: 2, background: '#2D6BE4', color: '#fff', border: 'none', borderRadius: 8, padding: '13px', fontSize: 15, fontWeight: 700, cursor: 'pointer', fontFamily: 'Inter,sans-serif' }}>Continue →</button>
              </div>
            </>
          )}

          {/* Step 2: Review */}
          {step === 2 && (
            <>
              <h2 style={{ fontSize: 20, fontWeight: 800, color: '#1B2A5E', marginBottom: 4 }}>Review & Confirm</h2>
              <p style={{ fontSize: 14, color: '#666', marginBottom: 24 }}>Double-check your details before creating your account</p>
              <div style={{ background: '#F8FAFF', borderRadius: 12, padding: '20px', marginBottom: 24 }}>
                {[
                  ['Name', `${form.firstName} ${form.lastName}`],
                  ['Email', form.email],
                  ['Phone', form.phone || '—'],
                ].map(([label, value]) => (
                  <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #E8EEF8', fontSize: 14 }}>
                    <span style={{ color: '#888', fontWeight: 500 }}>{label}</span>
                    <span style={{ color: '#1B2A5E', fontWeight: 600 }}>{value}</span>
                  </div>
                ))}
              </div>
              <div style={{ background: '#E8F5E9', borderRadius: 10, padding: '14px 16px', marginBottom: 24, display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                <span style={{ fontSize: 20 }}>🔒</span>
                <p style={{ fontSize: 13, color: '#2E7D32', margin: 0, lineHeight: 1.5 }}>Your information is encrypted with 256-bit SSL. We will never sell your personal data.</p>
              </div>
              <div style={{ display: 'flex', gap: 12 }}>
                <button onClick={() => setStep(1)} style={{ flex: 1, background: '#F0F4FF', color: '#1B2A5E', border: 'none', borderRadius: 8, padding: '13px', fontSize: 15, fontWeight: 600, cursor: 'pointer' }}>← Back</button>
                <button onClick={submit} disabled={loading} style={{
                  flex: 2, background: loading ? '#8AAEE0' : '#2D6BE4', color: '#fff', border: 'none',
                  borderRadius: 8, padding: '13px', fontSize: 15, fontWeight: 700,
                  cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'Inter,sans-serif',
                }}>
                  {loading ? 'Creating Account…' : 'Create My Account 🎉'}
                </button>
              </div>
            </>
          )}

          <div style={{ textAlign: 'center', marginTop: 24, fontSize: 14, color: '#666' }}>
            Already have an account?{' '}
            <Link to="/fico/login" style={{ color: '#2D6BE4', fontWeight: 600, textDecoration: 'none' }}>Sign In</Link>
          </div>
        </div>

        {/* Side benefits panel */}
        <div style={{ maxWidth: 280, display: 'flex', flexDirection: 'column', gap: 16, paddingTop: 16 }}>
          <div style={{ background: '#1B2A5E', borderRadius: 16, padding: '24px', color: '#fff' }}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>📊</div>
            <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 6 }}>Your FICO® Score in Minutes</div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', lineHeight: 1.6 }}>Get instant access to your real FICO Score — the same one lenders see.</div>
          </div>
          {[
            { icon: '🛡️', title: 'Identity Protection', desc: 'Up to $1M insurance included with select plans' },
            { icon: '🔮', title: 'Score Simulator', desc: 'See how your decisions affect your score before you make them' },
            { icon: '📈', title: '28+ FICO® Scores', desc: 'Access mortgage, auto, and card scores all in one place' },
          ].map(b => (
            <div key={b.title} style={{ background: '#fff', borderRadius: 14, padding: '18px 20px', boxShadow: '0 2px 12px rgba(27,42,94,0.08)' }}>
              <div style={{ fontSize: 24, marginBottom: 6 }}>{b.icon}</div>
              <div style={{ fontWeight: 700, fontSize: 14, color: '#1B2A5E', marginBottom: 4 }}>{b.title}</div>
              <div style={{ fontSize: 12, color: '#666', lineHeight: 1.5 }}>{b.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
