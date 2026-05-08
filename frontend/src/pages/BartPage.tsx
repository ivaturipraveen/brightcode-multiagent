import { useState } from 'react'

const STATIONS = [
  'Antioch', 'Brentwood', 'Bay Fair', 'Balboa Park', 'Castro Valley',
  'Civic Center', 'Coliseum', 'Colma', 'Concord', 'Daly City',
  'Downtown Berkeley', 'Dublin/Pleasanton', 'El Cerrito del Norte',
  'El Cerrito Plaza', 'Embarcadero', 'Fremont', 'Fruitvale',
  'Glen Park', 'Hayward', 'Lake Merritt', 'MacArthur', 'Millbrae',
  'Montgomery St', 'North Berkeley', 'North Concord', 'Oakland City Center',
  'Orinda', 'Pittsburg/Bay Point', 'Pleasant Hill', 'Powell St',
  'Richmond', 'Rockridge', 'San Bruno', "San Francisco Int'l Airport",
  'San Leandro', 'South Hayward', 'South San Francisco', 'Union City',
  'Walnut Creek', 'West Dublin', 'West Oakland',
]

const TRAIN_LINES = [
  {
    id: 'red',
    name: 'Richmond – Daly City/Millbrae',
    color: '#E31837',
    stops: ['Richmond', 'El Cerrito del Norte', 'El Cerrito Plaza', 'North Berkeley', 'Downtown Berkeley', 'Ashby', 'MacArthur', 'Embarcadero', 'Montgomery St', 'Powell St', 'Civic Center', 'Balboa Park', 'Daly City', 'Millbrae'],
    firstTrain: '4:00 AM',
    lastTrain: '12:00 AM',
    frequency: 'Every 15 min',
  },
  {
    id: 'yellow',
    name: 'Antioch – SFO/Millbrae',
    color: '#FFD700',
    stops: ['Antioch', 'Pittsburg/Bay Point', 'North Concord', 'Concord', 'Pleasant Hill', 'Walnut Creek', 'Lafayette', 'Orinda', 'Rockridge', 'MacArthur', 'West Oakland', 'Embarcadero', 'Montgomery St', 'Powell St', 'Civic Center', 'Millbrae'],
    firstTrain: '4:15 AM',
    lastTrain: '11:45 PM',
    frequency: 'Every 20 min',
  },
  {
    id: 'blue',
    name: 'Dublin/Pleasanton – Daly City',
    color: '#0066CC',
    stops: ['Dublin/Pleasanton', 'West Dublin', 'Castro Valley', 'Bay Fair', 'San Leandro', 'Fruitvale', 'Coliseum', 'Lake Merritt', 'Oakland City Center', 'West Oakland', 'Embarcadero', 'Montgomery St', 'Powell St', 'Civic Center', 'Balboa Park', 'Daly City'],
    firstTrain: '4:45 AM',
    lastTrain: '11:30 PM',
    frequency: 'Every 15 min',
  },
  {
    id: 'green',
    name: 'Berryessa – Daly City',
    color: '#00A550',
    stops: ['Berryessa', 'Milpitas', 'Warm Springs', 'Fremont', 'Union City', 'South Hayward', 'Hayward', 'Bay Fair', 'San Leandro', 'Fruitvale', 'Coliseum', 'Lake Merritt', 'Oakland City Center', 'West Oakland', 'Balboa Park', 'Daly City'],
    firstTrain: '5:00 AM',
    lastTrain: '11:00 PM',
    frequency: 'Every 20 min',
  },
  {
    id: 'orange',
    name: 'Berryessa – Richmond',
    color: '#FF6600',
    stops: ['Berryessa', 'Milpitas', 'Warm Springs', 'Fremont', 'Union City', 'South Hayward', 'Hayward', 'Bay Fair', 'Oakland City Center', 'MacArthur', 'Ashby', 'Downtown Berkeley', 'North Berkeley', 'El Cerrito Plaza', 'El Cerrito del Norte', 'Richmond'],
    firstTrain: '5:15 AM',
    lastTrain: '10:45 PM',
    frequency: 'Every 20 min',
  },
]

const BUS_ROUTES = [
  { route: '72', name: 'East Oakland – San Leandro', frequency: 'Every 12 min', firstBus: '5:00 AM', lastBus: '11:30 PM', stops: 18 },
  { route: '51A', name: 'Berkeley – Fruitvale BART', frequency: 'Every 10 min', firstBus: '4:45 AM', lastBus: '1:00 AM', stops: 22 },
  { route: 'F', name: 'Fremont – Bay Fair BART', frequency: 'Every 15 min', firstBus: '5:30 AM', lastBus: '10:00 PM', stops: 14 },
  { route: '232', name: 'Hayward BART – Fremont', frequency: 'Every 30 min', firstBus: '6:00 AM', lastBus: '9:30 PM', stops: 9 },
  { route: '57', name: 'Fruitvale – Coliseum BART', frequency: 'Every 20 min', firstBus: '5:15 AM', lastBus: '11:00 PM', stops: 11 },
  { route: '45', name: 'Downtown SF – Daly City BART', frequency: 'Every 15 min', firstBus: '5:00 AM', lastBus: '12:30 AM', stops: 16 },
]

const DEPARTURES = [
  { destination: 'Millbrae / SFO', line: 'yellow', minutes: 2, cars: 9, status: 'On Time' },
  { destination: 'Richmond', line: 'red', minutes: 5, cars: 6, status: 'On Time' },
  { destination: 'Antioch', line: 'yellow', minutes: 8, cars: 10, status: 'Delayed +3' },
  { destination: 'Daly City', line: 'blue', minutes: 11, cars: 9, status: 'On Time' },
  { destination: 'Berryessa', line: 'green', minutes: 14, cars: 8, status: 'On Time' },
  { destination: 'Dublin/Pleasanton', line: 'blue', minutes: 17, cars: 9, status: 'On Time' },
]

const LINE_COLORS: Record<string, string> = {
  red: '#E31837', yellow: '#DAA520', blue: '#0066CC', green: '#00A550', orange: '#FF6600',
}

const FARES = [
  { type: 'Adult Clipper', price: '$2.50', note: 'Base fare, distance-based' },
  { type: 'Senior / Disabled', price: '$1.25', note: 'Half fare with valid ID' },
  { type: 'Youth (5–18)', price: '$1.25', note: 'Half fare' },
  { type: 'Adult Paper Ticket', price: '$3.00', note: 'Includes $0.50 surcharge' },
  { type: 'Monthly Pass', price: '$100', note: 'Unlimited weekday rides' },
  { type: 'Airport Surcharge', price: '+$3.00', note: 'SFO / OAK terminals' },
]

type Tab = 'planner' | 'schedules' | 'bus' | 'fares' | 'realtime'

export function BartPage() {
  const [activeTab, setActiveTab] = useState<Tab>('planner')
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [time, setTime] = useState('Now')
  const [tripType, setTripType] = useState<'depart' | 'arrive'>('depart')
  const [expandedLine, setExpandedLine] = useState<string | null>(null)
  const [selectedBus, setSelectedBus] = useState<string | null>(null)
  const [searched, setSearched] = useState(false)
  const [alertVisible, setAlertVisible] = useState(true)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (from && to) setSearched(true)
  }

  const mockResults = from && to ? [
    { dep: '9:12 AM', arr: '9:54 AM', duration: '42 min', transfers: 0, line: 'yellow', fare: '$4.20', train: 'Antioch' },
    { dep: '9:27 AM', arr: '10:15 AM', duration: '48 min', transfers: 1, line: 'blue', fare: '$4.20', train: 'Daly City' },
    { dep: '9:42 AM', arr: '10:22 AM', duration: '40 min', transfers: 0, line: 'red', fare: '$4.20', train: 'Richmond' },
  ] : []

  return (
    <div style={{ fontFamily: "'Segoe UI', Arial, sans-serif", minHeight: '100vh', background: '#f5f5f5', color: '#222' }}>

      {/* ── Top Bar ── */}
      <div style={{ background: '#00356B', color: '#fff', fontSize: 13, padding: '6px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span>Bay Area Rapid Transit — Serving the Bay since 1972</span>
        <div style={{ display: 'flex', gap: 16 }}>
          <a href="#" style={{ color: '#87CEFA', textDecoration: 'none' }}>Español</a>
          <a href="#" style={{ color: '#87CEFA', textDecoration: 'none' }}>中文</a>
          <a href="#" style={{ color: '#87CEFA', textDecoration: 'none' }}>Contact Us</a>
        </div>
      </div>

      {/* ── Header ── */}
      <header style={{ background: '#003882', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 72 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{
            width: 52, height: 52, background: '#fff', borderRadius: 8,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 900, fontSize: 22, color: '#003882', letterSpacing: -1,
            boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
          }}>
            BART
          </div>
          <div>
            <div style={{ color: '#fff', fontWeight: 700, fontSize: 20, letterSpacing: 0.5 }}>Bay Area Rapid Transit</div>
            <div style={{ color: '#87CEFA', fontSize: 12 }}>Trains · Buses · Schedules · Fares</div>
          </div>
        </div>
        <nav style={{ display: 'flex', gap: 8 }}>
          {([
            ['planner', '🗺️ Trip Planner'],
            ['realtime', '🟢 Real-Time'],
            ['schedules', '🚉 Train Lines'],
            ['bus', '🚌 Bus Routes'],
            ['fares', '💳 Fares & Tickets'],
          ] as [Tab, string][]).map(([id, label]) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              style={{
                background: activeTab === id ? '#FF6B00' : 'rgba(255,255,255,0.1)',
                color: '#fff', border: 'none', borderRadius: 6,
                padding: '8px 14px', cursor: 'pointer', fontWeight: activeTab === id ? 700 : 400,
                fontSize: 13, transition: 'all 0.2s',
              }}
            >
              {label}
            </button>
          ))}
        </nav>
      </header>

      {/* ── Alert Banner ── */}
      {alertVisible && (
        <div style={{ background: '#FFF3CD', borderBottom: '2px solid #FF6B00', padding: '10px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ background: '#FF6B00', color: '#fff', borderRadius: 4, padding: '2px 8px', fontSize: 12, fontWeight: 700 }}>SERVICE ALERT</span>
            <span style={{ fontSize: 14 }}>⚠️ Yellow Line delays of 5–10 min due to police activity at Embarcadero. Use Red Line as alternate.</span>
          </div>
          <button onClick={() => setAlertVisible(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 18, color: '#666' }}>×</button>
        </div>
      )}

      {/* ── Main Content ── */}
      <main style={{ maxWidth: 1100, margin: '0 auto', padding: '28px 24px' }}>

        {/* ══════════ TRIP PLANNER ══════════ */}
        {activeTab === 'planner' && (
          <div>
            <h2 style={{ color: '#003882', marginBottom: 4 }}>Plan Your Trip</h2>
            <p style={{ color: '#555', marginBottom: 20, fontSize: 14 }}>Find the best BART route between stations.</p>

            <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 2px 16px rgba(0,56,130,0.10)', padding: 28, marginBottom: 24 }}>
              <form onSubmit={handleSearch}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                  <div>
                    <label style={{ display: 'block', fontWeight: 600, marginBottom: 6, color: '#003882', fontSize: 14 }}>From Station</label>
                    <select value={from} onChange={e => setFrom(e.target.value)}
                      style={{ width: '100%', padding: '10px 12px', borderRadius: 6, border: '2px solid #ddd', fontSize: 15, outline: 'none' }}>
                      <option value="">Select origin station…</option>
                      {STATIONS.map(s => <option key={s}>{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontWeight: 600, marginBottom: 6, color: '#003882', fontSize: 14 }}>To Station</label>
                    <select value={to} onChange={e => setTo(e.target.value)}
                      style={{ width: '100%', padding: '10px 12px', borderRadius: 6, border: '2px solid #ddd', fontSize: 15, outline: 'none' }}>
                      <option value="">Select destination station…</option>
                      {STATIONS.map(s => <option key={s}>{s}</option>)}
                    </select>
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: 16, alignItems: 'end' }}>
                  <div>
                    <label style={{ display: 'block', fontWeight: 600, marginBottom: 6, color: '#003882', fontSize: 14 }}>Date</label>
                    <input type="date" value={date} onChange={e => setDate(e.target.value)}
                      style={{ width: '100%', padding: '10px 12px', borderRadius: 6, border: '2px solid #ddd', fontSize: 14 }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontWeight: 600, marginBottom: 6, color: '#003882', fontSize: 14 }}>Time</label>
                    <select value={time} onChange={e => setTime(e.target.value)}
                      style={{ width: '100%', padding: '10px 12px', borderRadius: 6, border: '2px solid #ddd', fontSize: 14 }}>
                      <option>Now</option>
                      {Array.from({ length: 48 }, (_, i) => {
                        const h = Math.floor(i / 2), m = i % 2 === 0 ? '00' : '30'
                        const ampm = h < 12 ? 'AM' : 'PM'
                        const h12 = h === 0 ? 12 : h > 12 ? h - 12 : h
                        return <option key={i}>{`${h12}:${m} ${ampm}`}</option>
                      })}
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontWeight: 600, marginBottom: 6, color: '#003882', fontSize: 14 }}>Trip Type</label>
                    <select value={tripType} onChange={e => setTripType(e.target.value as 'depart' | 'arrive')}
                      style={{ width: '100%', padding: '10px 12px', borderRadius: 6, border: '2px solid #ddd', fontSize: 14 }}>
                      <option value="depart">Depart at</option>
                      <option value="arrive">Arrive by</option>
                    </select>
                  </div>
                  <button type="submit"
                    style={{ background: '#003882', color: '#fff', border: 'none', borderRadius: 8, padding: '11px 28px', fontWeight: 700, fontSize: 15, cursor: 'pointer' }}>
                    🔍 Find Trips
                  </button>
                </div>
              </form>
            </div>

            {searched && mockResults.length > 0 && (
              <div>
                <h3 style={{ color: '#003882', marginBottom: 12 }}>
                  Results: {from} → {to}
                </h3>
                {mockResults.map((r, i) => (
                  <div key={i} style={{
                    background: '#fff', borderRadius: 10, padding: '18px 24px', marginBottom: 12,
                    boxShadow: '0 1px 8px rgba(0,56,130,0.08)', display: 'flex', alignItems: 'center',
                    justifyContent: 'space-between', borderLeft: `5px solid ${LINE_COLORS[r.line]}`
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: 18 }}>{r.dep}</div>
                        <div style={{ color: '#888', fontSize: 12 }}>Departs</div>
                      </div>
                      <div style={{ color: '#888', fontSize: 20 }}>→</div>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: 18 }}>{r.arr}</div>
                        <div style={{ color: '#888', fontSize: 12 }}>Arrives</div>
                      </div>
                      <div style={{ marginLeft: 8 }}>
                        <div style={{ background: LINE_COLORS[r.line], color: '#fff', borderRadius: 4, padding: '3px 10px', fontSize: 12, fontWeight: 700, marginBottom: 4 }}>
                          {r.line.toUpperCase()} LINE
                        </div>
                        <div style={{ fontSize: 13, color: '#555' }}>
                          ⏱ {r.duration} · {r.transfers === 0 ? 'Direct' : `${r.transfers} transfer`}
                        </div>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontWeight: 700, fontSize: 22, color: '#003882' }}>{r.fare}</div>
                      <div style={{ fontSize: 12, color: '#888', marginBottom: 8 }}>Clipper fare</div>
                      <button style={{ background: '#FF6B00', color: '#fff', border: 'none', borderRadius: 6, padding: '7px 18px', fontWeight: 600, cursor: 'pointer', fontSize: 13 }}>
                        Buy Ticket
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Quick Links */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginTop: 32 }}>
              {[
                { icon: '🗺️', title: 'System Map', desc: 'View all BART stations' },
                { icon: '📱', title: 'Clipper Card', desc: 'Load or manage your card' },
                { icon: '♿', title: 'Accessibility', desc: 'Elevator & ADA info' },
                { icon: '🅿️', title: 'Parking', desc: 'Station parking availability' },
              ].map((card) => (
                <div key={card.title} style={{ background: '#fff', borderRadius: 10, padding: 20, textAlign: 'center', boxShadow: '0 1px 8px rgba(0,56,130,0.08)', cursor: 'pointer', transition: 'transform 0.2s' }}>
                  <div style={{ fontSize: 32, marginBottom: 8 }}>{card.icon}</div>
                  <div style={{ fontWeight: 700, color: '#003882', marginBottom: 4 }}>{card.title}</div>
                  <div style={{ fontSize: 13, color: '#666' }}>{card.desc}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ══════════ REAL-TIME DEPARTURES ══════════ */}
        {activeTab === 'realtime' && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <div>
                <h2 style={{ color: '#003882', marginBottom: 4 }}>Real-Time Departures</h2>
                <p style={{ color: '#555', fontSize: 14 }}>Live departure board — Embarcadero Station</p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#E8F5E9', borderRadius: 8, padding: '8px 16px' }}>
                <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#00A550', display: 'inline-block', animation: 'pulse 1.5s infinite' }} />
                <span style={{ color: '#00A550', fontWeight: 600, fontSize: 14 }}>Live</span>
              </div>
            </div>

            <div style={{ background: '#003882', borderRadius: 12, overflow: 'hidden', marginBottom: 24 }}>
              <div style={{ padding: '14px 20px', background: '#00356B', display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr', gap: 16, color: '#87CEFA', fontWeight: 700, fontSize: 13 }}>
                <span>DESTINATION</span>
                <span>LINE</span>
                <span>DEPARTS</span>
                <span>CARS</span>
                <span>STATUS</span>
              </div>
              {DEPARTURES.map((d, i) => (
                <div key={i} style={{
                  padding: '16px 20px', display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr', gap: 16, alignItems: 'center',
                  background: i % 2 === 0 ? 'rgba(255,255,255,0.04)' : 'transparent',
                  borderBottom: '1px solid rgba(255,255,255,0.06)', color: '#fff',
                }}>
                  <span style={{ fontWeight: 600 }}>→ {d.destination}</span>
                  <span>
                    <span style={{ background: LINE_COLORS[d.line], borderRadius: 4, padding: '2px 10px', fontSize: 12, fontWeight: 700 }}>
                      {d.line.toUpperCase()}
                    </span>
                  </span>
                  <span style={{ fontWeight: 700, fontSize: 18, color: d.minutes <= 3 ? '#FFC107' : '#fff' }}>
                    {d.minutes} min
                  </span>
                  <span style={{ color: '#87CEFA' }}>{d.cars} car</span>
                  <span style={{ color: d.status === 'On Time' ? '#69F0AE' : '#FF6B6B', fontSize: 13 }}>
                    {d.status === 'On Time' ? '✅' : '⚠️'} {d.status}
                  </span>
                </div>
              ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div style={{ background: '#fff', borderRadius: 10, padding: 20, boxShadow: '0 1px 8px rgba(0,56,130,0.08)' }}>
                <h4 style={{ color: '#003882', margin: '0 0 12px' }}>Station: Embarcadero</h4>
                <div style={{ fontSize: 14, color: '#555', lineHeight: 1.8 }}>
                  <div>📍 Market & Steuart St, San Francisco</div>
                  <div>🕒 Open: 4:00 AM – 12:00 AM</div>
                  <div>♿ Elevator: Operational</div>
                  <div>🅿️ No parking available</div>
                  <div>🚌 Muni connections: F, J, K, L, M, N lines</div>
                </div>
              </div>
              <div style={{ background: '#fff', borderRadius: 10, padding: 20, boxShadow: '0 1px 8px rgba(0,56,130,0.08)' }}>
                <h4 style={{ color: '#003882', margin: '0 0 12px' }}>System Status</h4>
                {[
                  { line: 'red', status: 'Normal Service' },
                  { line: 'yellow', status: '5–10 min delays' },
                  { line: 'blue', status: 'Normal Service' },
                  { line: 'green', status: 'Normal Service' },
                  { line: 'orange', status: 'Normal Service' },
                ].map(({ line, status }) => (
                  <div key={line} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                    <span style={{ width: 14, height: 14, borderRadius: '50%', background: LINE_COLORS[line], display: 'inline-block', flexShrink: 0 }} />
                    <span style={{ fontSize: 13, fontWeight: 600, textTransform: 'capitalize' }}>{line} Line</span>
                    <span style={{ fontSize: 13, color: status === 'Normal Service' ? '#00A550' : '#FF6B00', marginLeft: 'auto' }}>
                      {status === 'Normal Service' ? '✅' : '⚠️'} {status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ══════════ TRAIN SCHEDULES ══════════ */}
        {activeTab === 'schedules' && (
          <div>
            <h2 style={{ color: '#003882', marginBottom: 4 }}>Train Lines & Schedules</h2>
            <p style={{ color: '#555', marginBottom: 20, fontSize: 14 }}>Click a line to view all stops.</p>
            {TRAIN_LINES.map(line => (
              <div key={line.id} style={{ background: '#fff', borderRadius: 12, marginBottom: 14, boxShadow: '0 1px 8px rgba(0,56,130,0.08)', overflow: 'hidden' }}>
                <div
                  onClick={() => setExpandedLine(expandedLine === line.id ? null : line.id)}
                  style={{ padding: '18px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', borderLeft: `6px solid ${line.color}` }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <div style={{ width: 28, height: 28, borderRadius: '50%', background: line.color, flexShrink: 0 }} />
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 16, color: '#111' }}>{line.name}</div>
                      <div style={{ fontSize: 13, color: '#777', marginTop: 2 }}>
                        {line.frequency} · {line.firstTrain} – {line.lastTrain} · {line.stops.length} stops
                      </div>
                    </div>
                  </div>
                  <span style={{ color: '#003882', fontWeight: 700, fontSize: 20 }}>{expandedLine === line.id ? '▲' : '▼'}</span>
                </div>
                {expandedLine === line.id && (
                  <div style={{ padding: '0 24px 20px 24px', background: '#F8FAFF' }}>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, paddingTop: 16 }}>
                      {line.stops.map((stop, idx) => (
                        <div key={stop} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <div style={{
                            background: line.color, color: '#fff', borderRadius: 20,
                            padding: '5px 14px', fontSize: 13, fontWeight: 600
                          }}>
                            {stop}
                          </div>
                          {idx < line.stops.length - 1 && <span style={{ color: line.color, fontSize: 16 }}>→</span>}
                        </div>
                      ))}
                    </div>
                    <div style={{ marginTop: 16, display: 'flex', gap: 12 }}>
                      <button style={{ background: line.color, color: '#fff', border: 'none', borderRadius: 6, padding: '8px 18px', fontWeight: 600, cursor: 'pointer', fontSize: 13 }}>
                        📅 Full Timetable
                      </button>
                      <button style={{ background: '#003882', color: '#fff', border: 'none', borderRadius: 6, padding: '8px 18px', fontWeight: 600, cursor: 'pointer', fontSize: 13 }}>
                        🗺️ View on Map
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* ══════════ BUS ROUTES ══════════ */}
        {activeTab === 'bus' && (
          <div>
            <h2 style={{ color: '#003882', marginBottom: 4 }}>Bus Routes</h2>
            <p style={{ color: '#555', marginBottom: 20, fontSize: 14 }}>BART-connecting bus services across the Bay Area.</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              {BUS_ROUTES.map(route => (
                <div
                  key={route.route}
                  onClick={() => setSelectedBus(selectedBus === route.route ? null : route.route)}
                  style={{
                    background: '#fff', borderRadius: 12, padding: '18px 20px', cursor: 'pointer',
                    boxShadow: '0 1px 8px rgba(0,56,130,0.08)',
                    borderLeft: `5px solid #003882`,
                    border: selectedBus === route.route ? '2px solid #003882' : '1px solid #eee',
                    transition: 'all 0.2s',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                        <span style={{ background: '#003882', color: '#fff', borderRadius: 6, padding: '4px 12px', fontWeight: 800, fontSize: 16 }}>
                          {route.route}
                        </span>
                        <span style={{ fontWeight: 700, fontSize: 15 }}>{route.name}</span>
                      </div>
                      <div style={{ fontSize: 13, color: '#666', lineHeight: 1.8 }}>
                        <div>🕒 {route.firstBus} – {route.lastBus}</div>
                        <div>⏱ {route.frequency}</div>
                        <div>📍 {route.stops} stops</div>
                      </div>
                    </div>
                    <span style={{ color: '#003882', fontSize: 20 }}>{selectedBus === route.route ? '▲' : '▼'}</span>
                  </div>
                  {selectedBus === route.route && (
                    <div style={{ marginTop: 14, paddingTop: 14, borderTop: '1px solid #eee' }}>
                      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                        <button style={{ background: '#003882', color: '#fff', border: 'none', borderRadius: 6, padding: '7px 16px', cursor: 'pointer', fontSize: 13 }}>
                          📅 Full Schedule
                        </button>
                        <button style={{ background: '#FF6B00', color: '#fff', border: 'none', borderRadius: 6, padding: '7px 16px', cursor: 'pointer', fontSize: 13 }}>
                          🗺️ Route Map
                        </button>
                        <button style={{ background: '#00A550', color: '#fff', border: 'none', borderRadius: 6, padding: '7px 16px', cursor: 'pointer', fontSize: 13 }}>
                          🔴 Live Tracking
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ══════════ FARES & TICKETS ══════════ */}
        {activeTab === 'fares' && (
          <div>
            <h2 style={{ color: '#003882', marginBottom: 4 }}>Fares & Tickets</h2>
            <p style={{ color: '#555', marginBottom: 20, fontSize: 14 }}>All fares are distance-based. Clipper Card saves you money.</p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginBottom: 28 }}>
              {FARES.map(f => (
                <div key={f.type} style={{ background: '#fff', borderRadius: 12, padding: 20, boxShadow: '0 1px 8px rgba(0,56,130,0.08)', textAlign: 'center' }}>
                  <div style={{ fontWeight: 700, color: '#003882', marginBottom: 6, fontSize: 15 }}>{f.type}</div>
                  <div style={{ fontSize: 32, fontWeight: 900, color: '#FF6B00', margin: '8px 0' }}>{f.price}</div>
                  <div style={{ fontSize: 13, color: '#777' }}>{f.note}</div>
                </div>
              ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
              {/* Clipper Card */}
              <div style={{ background: 'linear-gradient(135deg, #003882 60%, #0066CC)', borderRadius: 14, padding: 24, color: '#fff' }}>
                <div style={{ fontSize: 28, marginBottom: 12 }}>💳</div>
                <h3 style={{ margin: '0 0 8px' }}>Clipper Card</h3>
                <p style={{ fontSize: 14, opacity: 0.85, margin: '0 0 16px' }}>
                  The smart way to pay for transit across 23 Bay Area agencies. Load value, get discounts, never fumble for cash.
                </p>
                <div style={{ fontSize: 13, lineHeight: 2, marginBottom: 16 }}>
                  <div>✅ Works on BART, Muni, AC Transit, Caltrain</div>
                  <div>✅ Auto-load when balance is low</div>
                  <div>✅ Free card at station ticket machines</div>
                </div>
                <button style={{ background: '#FF6B00', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 22px', fontWeight: 700, cursor: 'pointer' }}>
                  Get Clipper Card
                </button>
              </div>

              {/* Buy Ticket */}
              <div style={{ background: '#fff', borderRadius: 14, padding: 24, boxShadow: '0 2px 16px rgba(0,56,130,0.10)' }}>
                <div style={{ fontSize: 28, marginBottom: 12 }}>🎫</div>
                <h3 style={{ color: '#003882', margin: '0 0 8px' }}>Buy a Ticket</h3>
                <p style={{ fontSize: 14, color: '#555', margin: '0 0 16px' }}>
                  One-way and round-trip tickets available at all station vending machines or online.
                </p>
                <div style={{ marginBottom: 16 }}>
                  <label style={{ fontWeight: 600, color: '#003882', fontSize: 14, display: 'block', marginBottom: 6 }}>Ticket Type</label>
                  <select style={{ width: '100%', padding: '10px 12px', borderRadius: 6, border: '2px solid #ddd', fontSize: 14 }}>
                    <option>Adult One-Way</option>
                    <option>Adult Round-Trip</option>
                    <option>Senior / Disabled</option>
                    <option>Youth (5–18)</option>
                    <option>Monthly Pass</option>
                  </select>
                </div>
                <div style={{ marginBottom: 20 }}>
                  <label style={{ fontWeight: 600, color: '#003882', fontSize: 14, display: 'block', marginBottom: 6 }}>Quantity</label>
                  <input type="number" defaultValue={1} min={1} max={20}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: 6, border: '2px solid #ddd', fontSize: 14 }} />
                </div>
                <button style={{ width: '100%', background: '#003882', color: '#fff', border: 'none', borderRadius: 8, padding: '12px', fontWeight: 700, cursor: 'pointer', fontSize: 15 }}>
                  🛒 Proceed to Checkout
                </button>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* ── Footer ── */}
      <footer style={{ background: '#001f4d', color: '#aac4e8', marginTop: 48, padding: '32px 24px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 28, marginBottom: 24 }}>
          {[
            { title: 'Riding BART', links: ['Schedules', 'Fares & Tickets', 'Station Info', 'Accessibility', 'Clipper Card'] },
            { title: 'About BART', links: ['Who We Are', 'Board of Directors', 'News & Press', 'Careers', 'Contact'] },
            { title: 'Projects', links: ['BART to Silicon Valley', 'Fleet of the Future', 'Station Modernization', 'Safety'] },
            { title: 'Help & Resources', links: ['Lost & Found', 'Police & Safety', 'Customer Service', 'Feedback', 'Developer API'] },
          ].map(col => (
            <div key={col.title}>
              <div style={{ color: '#fff', fontWeight: 700, marginBottom: 12, fontSize: 14 }}>{col.title}</div>
              {col.links.map(link => (
                <div key={link} style={{ marginBottom: 8 }}>
                  <a href="#" style={{ color: '#87CEFA', textDecoration: 'none', fontSize: 13 }}>{link}</a>
                </div>
              ))}
            </div>
          ))}
        </div>
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 13 }}>
          <span>© 2026 Bay Area Rapid Transit District. All rights reserved.</span>
          <div style={{ display: 'flex', gap: 20 }}>
            <a href="#" style={{ color: '#87CEFA', textDecoration: 'none' }}>Privacy Policy</a>
            <a href="#" style={{ color: '#87CEFA', textDecoration: 'none' }}>Terms of Use</a>
            <a href="#" style={{ color: '#87CEFA', textDecoration: 'none' }}>Accessibility</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
