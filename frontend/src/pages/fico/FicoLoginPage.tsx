import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

export function FicoLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!email || !password) { setError('Please enter your email and password.'); return }
    setLoading(true)
    setTimeout(() => { setLoading(false); navigate('/fico') }, 1200)
  }

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '12px 14px', borderRadius: 8,
    border: '1.5px solid #D1D9E0', fontSize: 15, fontFamily: 'Inter,sans-serif',
    outline: 'none', boxSizing: 'border-box', color: '#1B2A5E',
    transition: 'border-color 0.2s',
  }

  return (
    <div style={{
      minHeight: '100vh', background: 'linear-gradient(145deg, #F0F4FF 0%, #E8F0FE 100%)',
      display: 'flex', flexDirection: 'column', fontFamily: 'Inter,sans-serif',
    }}>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />

      {/* Nav */}
      <nav style={{ padding: '0 5%', height: 60, background: '#fff', display: 'flex', alignItems: 'center', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
        <Link to="/fico" style={{ fontWeight: 900, fontSize: 24, color: '#1B2A5E', textDecoration: 'none' }}>
          FICO<sup style={{ fontSize: 10, verticalAlign: 'super' }}>®</sup>
        </Link>
      </nav>

      {/* Card */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
        <div style={{
          background: '#fff', borderRadius: 20, boxShadow: '0 12px 48px rgba(27,42,94,0.12)',
          padding: '48px 44px', width: '100%', maxWidth: 420,
        }}>
          {/* Logo */}
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <div style={{ fontWeight: 900, fontSize: 32, color: '#1B2A5E', letterSpacing: '-1px' }}>
              FICO<sup style={{ fontSize: 14, verticalAlign: 'super' }}>®</sup>
            </div>
            <div style={{ fontSize: 13, color: '#888', marginTop: 4 }}>myFICO Member Portal</div>
          </div>

          <h1 style={{ fontSize: 22, fontWeight: 800, color: '#1B2A5E', marginBottom: 6, textAlign: 'center' }}>Welcome back</h1>
          <p style={{ textAlign: 'center', color: '#666', fontSize: 14, marginBottom: 28 }}>Sign in to access your FICO® Score</p>

          {error && (
            <div style={{ background: '#FFF0F0', border: '1px solid #FFCCCC', color: '#CC0000', borderRadius: 8, padding: '10px 14px', fontSize: 13, marginBottom: 20 }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 18 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#333', marginBottom: 6 }}>Email Address</label>
              <input
                type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com" style={inputStyle}
                onFocus={e => (e.target.style.borderColor = '#2D6BE4')}
                onBlur={e => (e.target.style.borderColor = '#D1D9E0')}
              />
            </div>
            <div style={{ marginBottom: 8 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#333', marginBottom: 6 }}>Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPw ? 'text' : 'password'} value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••" style={{ ...inputStyle, paddingRight: 44 }}
                  onFocus={e => (e.target.style.borderColor = '#2D6BE4')}
                  onBlur={e => (e.target.style.borderColor = '#D1D9E0')}
                />
                <button type="button" onClick={() => setShowPw(!showPw)} style={{
                  position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', cursor: 'pointer', fontSize: 16, color: '#888',
                }}>{showPw ? '🙈' : '👁'}</button>
              </div>
            </div>
            <div style={{ textAlign: 'right', marginBottom: 24 }}>
              <a href="#" style={{ fontSize: 13, color: '#2D6BE4', textDecoration: 'none', fontWeight: 500 }}>Forgot Password?</a>
            </div>
            <button type="submit" disabled={loading} style={{
              width: '100%', background: loading ? '#8AAEE0' : '#2D6BE4', color: '#fff',
              border: 'none', borderRadius: 8, padding: '13px', fontSize: 15,
              fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer',
              fontFamily: 'Inter,sans-serif', transition: 'background 0.2s',
            }}>
              {loading ? 'Signing In…' : 'Sign In'}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: 24, fontSize: 14, color: '#666' }}>
            Don't have an account?{' '}
            <Link to="/fico/signup" style={{ color: '#2D6BE4', fontWeight: 600, textDecoration: 'none' }}>Sign Up Free</Link>
          </div>

          {/* Trust badges */}
          <div style={{ marginTop: 32, borderTop: '1px solid #F0F0F0', paddingTop: 20, display: 'flex', justifyContent: 'center', gap: 20 }}>
            {[['🔒', '256-bit SSL'], ['✅', 'FDIC Compliant'], ['🏆', 'BBB Accredited']].map(([icon, label]) => (
              <div key={label as string} style={{ textAlign: 'center', fontSize: 11, color: '#888' }}>
                <div style={{ fontSize: 18 }}>{icon}</div>
                <div style={{ marginTop: 2, fontWeight: 500 }}>{label as string}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Social proof */}
        <div style={{ position: 'absolute', bottom: 24, left: '50%', transform: 'translateX(-50%)', textAlign: 'center', fontSize: 13, color: '#888' }}>
          Trusted by <strong style={{ color: '#1B2A5E' }}>10 million+</strong> Americans to protect their credit
        </div>
      </div>
    </div>
  )
}
