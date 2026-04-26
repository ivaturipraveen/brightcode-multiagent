/**
 * SmartShop — Demo-only Smart Shopping Cart
 * Design: ProcurementPartners-inspired enterprise SaaS
 * (navy #003057, green #00875A, white backgrounds, clean cards)
 * All vendor data is mocked — no real API calls.
 */

import { useState, useMemo, useCallback } from 'react'

// ─── Design tokens (ProcurementPartners palette) ──────────────────────────────
const C = {
  navy:        '#003057',
  navyLight:   '#1B4F8A',
  navyDark:    '#001F3D',
  green:       '#00875A',
  greenHover:  '#006644',
  greenLight:  '#E6F4F0',
  gray50:      '#F8F9FA',
  gray100:     '#F1F3F5',
  gray200:     '#E9ECEF',
  gray400:     '#ADB5BD',
  gray600:     '#6C757D',
  gray800:     '#343A40',
  white:       '#FFFFFF',
  amber:       '#F59E0B',
  red:         '#DC2626',
  redLight:    '#FEF2F2',
  greenBadge:  '#D1FAE5',
  navyBg:      '#EEF2F7',
}

// ─── Types ────────────────────────────────────────────────────────────────────
interface Vendor   { id: string; name: string; logo: string }
interface Product  { id: string; title: string; brand: string; model: string; category: string; image: string }
interface Offer    { vendorId: string; price: number; shippingCost: number; shippingEtaDays: number; inStock: boolean; sellerRating: number; returnWindowDays: number; fetchedAt: string }
interface CartItem { product: Product; quantity: number }
interface Weights  { price: number; speed: number; rating: number; returnPolicy: number }
interface Rec      { type: 'cheapest'|'fastest'|'best'; label: string; icon: string; vendorId: string; totalCost: number; rationale: string }

// ─── Mock Data ────────────────────────────────────────────────────────────────
const VENDORS: Vendor[] = [
  { id: 'amazon',  name: 'Amazon',   logo: '🟠' },
  { id: 'walmart', name: 'Walmart',  logo: '🔵' },
  { id: 'bestbuy', name: 'Best Buy', logo: '🟡' },
]

const CATALOG: Product[] = [
  { id: 'p1', title: 'Sony WH-1000XM5 Wireless Headphones',   brand: 'Sony',        model: 'WH-1000XM5',  category: 'Electronics', image: '🎧' },
  { id: 'p2', title: 'Apple AirPods Pro (2nd Gen)',            brand: 'Apple',       model: 'MQTP3LL/A',   category: 'Electronics', image: '🎵' },
  { id: 'p3', title: 'Samsung 65" 4K QLED Smart TV',          brand: 'Samsung',     model: 'QN65Q80C',    category: 'Electronics', image: '📺' },
  { id: 'p4', title: 'Apple MacBook Air M2 13"',               brand: 'Apple',       model: 'MLY33LL/A',   category: 'Computers',   image: '💻' },
  { id: 'p5', title: 'Dyson V15 Detect Vacuum',                brand: 'Dyson',       model: 'V15 Detect',  category: 'Home',        image: '🌀' },
  { id: 'p6', title: 'Nintendo Switch OLED',                   brand: 'Nintendo',    model: 'HEG-001',     category: 'Gaming',      image: '🎮' },
  { id: 'p7', title: 'Instant Pot Duo 7-in-1',                brand: 'Instant Pot', model: 'Duo 6Qt',     category: 'Kitchen',     image: '🍲' },
  { id: 'p8', title: 'LG 27" UltraGear Gaming Monitor',       brand: 'LG',          model: '27GP850-B',   category: 'Monitors',    image: '🖥️' },
]

const MOCK_OFFERS: Record<string, Record<string, Offer>> = {
  p1: {
    amazon:  { vendorId:'amazon',  price:279.99, shippingCost:0,    shippingEtaDays:2, inStock:true,  sellerRating:4.7, returnWindowDays:30, fetchedAt: new Date().toISOString() },
    walmart: { vendorId:'walmart', price:269.00, shippingCost:5.99, shippingEtaDays:5, inStock:true,  sellerRating:4.3, returnWindowDays:15, fetchedAt: new Date().toISOString() },
    bestbuy: { vendorId:'bestbuy', price:299.99, shippingCost:0,    shippingEtaDays:3, inStock:true,  sellerRating:4.6, returnWindowDays:15, fetchedAt: new Date().toISOString() },
  },
  p2: {
    amazon:  { vendorId:'amazon',  price:189.00, shippingCost:0,    shippingEtaDays:1, inStock:true,  sellerRating:4.8, returnWindowDays:30, fetchedAt: new Date().toISOString() },
    walmart: { vendorId:'walmart', price:179.00, shippingCost:0,    shippingEtaDays:3, inStock:false, sellerRating:4.2, returnWindowDays:15, fetchedAt: new Date().toISOString() },
    bestbuy: { vendorId:'bestbuy', price:199.00, shippingCost:0,    shippingEtaDays:2, inStock:true,  sellerRating:4.7, returnWindowDays:15, fetchedAt: new Date().toISOString() },
  },
  p3: {
    amazon:  { vendorId:'amazon',  price:997.99, shippingCost:0,    shippingEtaDays:3, inStock:true,  sellerRating:4.6, returnWindowDays:30, fetchedAt: new Date().toISOString() },
    walmart: { vendorId:'walmart', price:949.00, shippingCost:0,    shippingEtaDays:7, inStock:true,  sellerRating:4.0, returnWindowDays:30, fetchedAt: new Date().toISOString() },
    bestbuy: { vendorId:'bestbuy', price:1099.99,shippingCost:0,    shippingEtaDays:2, inStock:true,  sellerRating:4.8, returnWindowDays:15, fetchedAt: new Date().toISOString() },
  },
  p4: {
    amazon:  { vendorId:'amazon',  price:999.00, shippingCost:0,    shippingEtaDays:2, inStock:true,  sellerRating:4.9, returnWindowDays:30, fetchedAt: new Date().toISOString() },
    walmart: { vendorId:'walmart', price:979.00, shippingCost:9.99, shippingEtaDays:6, inStock:true,  sellerRating:4.1, returnWindowDays:15, fetchedAt: new Date().toISOString() },
    bestbuy: { vendorId:'bestbuy', price:1049.00,shippingCost:0,    shippingEtaDays:1, inStock:true,  sellerRating:4.8, returnWindowDays:14, fetchedAt: new Date().toISOString() },
  },
  p5: {
    amazon:  { vendorId:'amazon',  price:649.99, shippingCost:0,    shippingEtaDays:2, inStock:true,  sellerRating:4.7, returnWindowDays:30, fetchedAt: new Date().toISOString() },
    walmart: { vendorId:'walmart', price:599.00, shippingCost:0,    shippingEtaDays:5, inStock:true,  sellerRating:4.3, returnWindowDays:15, fetchedAt: new Date().toISOString() },
    bestbuy: { vendorId:'bestbuy', price:699.99, shippingCost:0,    shippingEtaDays:2, inStock:false, sellerRating:4.6, returnWindowDays:15, fetchedAt: new Date().toISOString() },
  },
  p6: {
    amazon:  { vendorId:'amazon',  price:329.99, shippingCost:0,    shippingEtaDays:1, inStock:true,  sellerRating:4.8, returnWindowDays:30, fetchedAt: new Date().toISOString() },
    walmart: { vendorId:'walmart', price:319.00, shippingCost:0,    shippingEtaDays:4, inStock:true,  sellerRating:4.2, returnWindowDays:30, fetchedAt: new Date().toISOString() },
    bestbuy: { vendorId:'bestbuy', price:349.99, shippingCost:0,    shippingEtaDays:2, inStock:true,  sellerRating:4.7, returnWindowDays:15, fetchedAt: new Date().toISOString() },
  },
  p7: {
    amazon:  { vendorId:'amazon',  price:79.95,  shippingCost:0,    shippingEtaDays:2, inStock:true,  sellerRating:4.6, returnWindowDays:30, fetchedAt: new Date().toISOString() },
    walmart: { vendorId:'walmart', price:69.00,  shippingCost:0,    shippingEtaDays:3, inStock:true,  sellerRating:4.4, returnWindowDays:15, fetchedAt: new Date().toISOString() },
    bestbuy: { vendorId:'bestbuy', price:89.99,  shippingCost:5.99, shippingEtaDays:3, inStock:true,  sellerRating:4.5, returnWindowDays:15, fetchedAt: new Date().toISOString() },
  },
  p8: {
    amazon:  { vendorId:'amazon',  price:279.99, shippingCost:0,    shippingEtaDays:2, inStock:true,  sellerRating:4.7, returnWindowDays:30, fetchedAt: new Date().toISOString() },
    walmart: { vendorId:'walmart', price:259.00, shippingCost:0,    shippingEtaDays:5, inStock:true,  sellerRating:4.1, returnWindowDays:15, fetchedAt: new Date().toISOString() },
    bestbuy: { vendorId:'bestbuy', price:299.99, shippingCost:0,    shippingEtaDays:1, inStock:true,  sellerRating:4.8, returnWindowDays:15, fetchedAt: new Date().toISOString() },
  },
}

// ─── Engine ───────────────────────────────────────────────────────────────────
function cartTotals(cart: CartItem[]): Record<string, number> {
  const t: Record<string, number> = {}
  VENDORS.forEach(v => { t[v.id] = 0 })
  cart.forEach(item => {
    VENDORS.forEach(v => {
      const o = MOCK_OFFERS[item.product.id]?.[v.id]
      t[v.id] += (o && o.inStock) ? (o.price + o.shippingCost) * item.quantity : Infinity
    })
  })
  return t
}

function getRecommendations(cart: CartItem[], weights: Weights): Rec[] {
  if (!cart.length) return []
  const totals = cartTotals(cart)

  const etaByVendor: Record<string, number> = {}
  VENDORS.forEach(v => {
    etaByVendor[v.id] = cart.reduce((mx, item) => {
      const o = MOCK_OFFERS[item.product.id]?.[v.id]
      return o && o.inStock ? Math.max(mx, o.shippingEtaDays) : 999
    }, 0)
  })

  const scoreByVendor: Record<string, number> = {}
  VENDORS.forEach(v => {
    const allOffers = cart.flatMap(item => Object.values(MOCK_OFFERS[item.product.id] ?? {}))
    const inStockOffers = allOffers.filter(o => o.inStock)
    if (!inStockOffers.length) { scoreByVendor[v.id] = -1; return }
    const costs = inStockOffers.map(o => o.price + o.shippingCost)
    const [minC, maxC] = [Math.min(...costs), Math.max(...costs)]
    const etas  = inStockOffers.map(o => o.shippingEtaDays)
    const [minE, maxE] = [Math.min(...etas), Math.max(...etas)]
    const rets  = inStockOffers.map(o => o.returnWindowDays)
    const [minR, maxR] = [Math.min(...rets), Math.max(...rets)]
    const norm = (val: number, lo: number, hi: number, inv: boolean) =>
      hi === lo ? 1 : inv ? 1 - (val - lo) / (hi - lo) : (val - lo) / (hi - lo)
    const vOffers = cart.map(item => MOCK_OFFERS[item.product.id]?.[v.id]).filter(Boolean) as Offer[]
    const canCover = vOffers.length === cart.length && vOffers.every(o => o.inStock)
    if (!canCover) { scoreByVendor[v.id] = -1; return }
    scoreByVendor[v.id] = vOffers.reduce((sum, o) => {
      return sum +
        weights.price        * norm(o.price + o.shippingCost, minC, maxC, true)  +
        weights.speed        * norm(o.shippingEtaDays, minE, maxE, true)          +
        weights.rating       * (o.sellerRating / 5)                               +
        weights.returnPolicy * norm(o.returnWindowDays, minR, maxR, false)
    }, 0) / cart.length
  })

  const vn = (id: string) => VENDORS.find(v => v.id === id)?.name ?? id
  const fmt = (n: number) => n === Infinity ? 'N/A' : `$${n.toFixed(2)}`
  const validTotals = Object.entries(totals).filter(([,v]) => v !== Infinity)

  const recs: Rec[] = []
  const cheapest = validTotals.sort((a,b)=>a[1]-b[1])[0]
  if (cheapest) recs.push({ type:'cheapest', label:'Cheapest', icon:'💰', vendorId:cheapest[0], totalCost:cheapest[1], rationale:`${vn(cheapest[0])} offers the lowest total cart cost at ${fmt(cheapest[1])}, including all shipping.` })

  const fastest = Object.entries(etaByVendor).filter(([,e])=>e<999).sort((a,b)=>a[1]-b[1])[0]
  if (fastest) recs.push({ type:'fastest', label:'Fastest', icon:'⚡', vendorId:fastest[0], totalCost:totals[fastest[0]], rationale:`${vn(fastest[0])} delivers all items within ${fastest[1]} day(s) — the fastest guaranteed option.` })

  const best = Object.entries(scoreByVendor).filter(([,s])=>s>0).sort((a,b)=>b[1]-a[1])[0]
  if (best) {
    const diff = totals[best[0]] - (cheapest ? cheapest[1] : 0)
    const diffStr = diff > 0.01 ? ` (${fmt(diff)} more than cheapest)` : ''
    recs.push({ type:'best', label:'Best Overall', icon:'⭐', vendorId:best[0], totalCost:totals[best[0]], rationale:`${vn(best[0])} scores best across price, speed, seller rating, and return policy${diffStr}.` })
  }
  return recs
}

// ─── Shared micro-components ──────────────────────────────────────────────────
const Badge = ({ ok }: { ok: boolean }) => (
  <span style={{ display:'inline-block', padding:'2px 10px', borderRadius:20, fontSize:11, fontWeight:600, background: ok ? C.greenBadge : C.redLight, color: ok ? C.green : C.red }}>
    {ok ? 'In Stock' : 'Out of Stock'}
  </span>
)

const StarRow = ({ rating }: { rating: number }) => {
  const full = Math.floor(rating)
  return (
    <span style={{ color: C.amber, fontSize:13 }}>
      {'★'.repeat(full)}{'☆'.repeat(5 - full)}
      <span style={{ color: C.gray600, fontSize:11, marginLeft:4 }}>({rating})</span>
    </span>
  )
}

const Btn = ({ children, variant='primary', onClick, style={} }: { children: React.ReactNode; variant?: 'primary'|'outline'|'ghost'; onClick?: () => void; style?: React.CSSProperties }) => {
  const base: React.CSSProperties = { display:'inline-flex', alignItems:'center', gap:6, padding:'10px 22px', borderRadius:6, fontWeight:600, fontSize:14, cursor:'pointer', transition:'background 0.15s, border-color 0.15s', border:'2px solid transparent' }
  const styles: Record<string, React.CSSProperties> = {
    primary: { ...base, background:C.green,  color:C.white,  border:`2px solid ${C.green}`  },
    outline: { ...base, background:'transparent', color:C.navy, border:`2px solid ${C.navy}` },
    ghost:   { ...base, background:'transparent', color:C.gray600, border:'2px solid transparent' },
  }
  return <button onClick={onClick} style={{ ...styles[variant], ...style }}>{children}</button>
}

const SectionHeader = ({ title, sub }: { title: string; sub?: string }) => (
  <div style={{ marginBottom:24 }}>
    <h2 style={{ margin:0, fontSize:22, fontWeight:700, color:C.navy }}>{title}</h2>
    {sub && <p style={{ margin:'6px 0 0', color:C.gray600, fontSize:14 }}>{sub}</p>}
  </div>
)

const fmt = (n: number) => n === Infinity ? '—' : `$${n.toFixed(2)}`

// ─── Main Component ───────────────────────────────────────────────────────────
export function SmartShopPage() {
  const [query, setQuery]         = useState('')
  const [results, setResults]     = useState<Product[]>([])
  const [cart, setCart]           = useState<CartItem[]>([])
  const [tab, setTab]             = useState<'search'|'cart'|'compare'|'prefs'>('search')
  const [weights, setWeights]     = useState<Weights>({ price:0.5, speed:0.2, rating:0.2, returnPolicy:0.1 })
  const [expanded, setExpanded]   = useState<string|null>(null)
  const [loading, setLoading]     = useState(false)

  const handleSearch = useCallback(() => {
    if (!query.trim()) return
    setLoading(true)
    setTimeout(() => {
      const q = query.toLowerCase()
      const found = CATALOG.filter(p => p.title.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q) || p.category.toLowerCase().includes(q))
      setResults(found.length ? found : CATALOG.slice(0, 4))
      setLoading(false)
    }, 500)
  }, [query])

  const addToCart = (p: Product) =>
    setCart(prev => prev.find(i => i.product.id === p.id)
      ? prev.map(i => i.product.id === p.id ? { ...i, quantity: i.quantity + 1 } : i)
      : [...prev, { product: p, quantity: 1 }])

  const changeQty = (id: string, d: number) =>
    setCart(prev => prev.map(i => i.product.id === id ? { ...i, quantity: i.quantity + d } : i).filter(i => i.quantity > 0))

  const removeItem = (id: string) => setCart(prev => prev.filter(i => i.product.id !== id))

  const recs = useMemo(() => getRecommendations(cart, weights), [cart, weights])
  const totals = useMemo(() => cartTotals(cart), [cart])
  const weightSum = weights.price + weights.speed + weights.rating + weights.returnPolicy
  const weightValid = Math.abs(weightSum - 1) < 0.01

  const TAB_DEFS = [
    { key: 'search',  label: 'Product Search' },
    { key: 'cart',    label: `Cart${cart.length ? ` (${cart.length})` : ''}` },
    { key: 'compare', label: 'Compare & Recommend' },
    { key: 'prefs',   label: 'Preferences' },
  ] as const

  return (
    <div id="smartshop-root" style={{ minHeight:'100vh', background:C.gray50, fontFamily:"'Inter','Segoe UI',sans-serif", color:C.gray800 }}>

      {/* ── Top Nav ── */}
      <nav style={{ background:C.navy, borderBottom:`3px solid ${C.green}`, padding:'0 32px', display:'flex', alignItems:'center', height:64, position:'sticky', top:0, zIndex:100 }}>
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <div style={{ background:C.green, borderRadius:8, width:36, height:36, display:'flex', alignItems:'center', justifyContent:'center', fontSize:20 }}>🛒</div>
          <div>
            <span style={{ color:C.white, fontWeight:800, fontSize:18, letterSpacing:'-0.5px' }}>SmartShop</span>
            <span style={{ color:'rgba(255,255,255,0.5)', fontSize:11, marginLeft:8, textTransform:'uppercase', letterSpacing:'1px' }}>Price Intelligence</span>
          </div>
        </div>
        <div style={{ marginLeft:'auto', display:'flex', gap:6, alignItems:'center' }}>
          {VENDORS.map(v => (
            <span key={v.id} style={{ background:'rgba(255,255,255,0.1)', borderRadius:20, padding:'4px 14px', fontSize:12, color:C.white, fontWeight:500 }}>
              {v.logo} {v.name}
            </span>
          ))}
          <Btn variant="primary" onClick={() => setTab('cart')} style={{ marginLeft:12, padding:'8px 18px' }}>
            🛒 Cart {cart.length > 0 && <span style={{ background:C.white, color:C.green, borderRadius:10, padding:'1px 7px', fontSize:11, fontWeight:700 }}>{cart.length}</span>}
          </Btn>
        </div>
      </nav>

      {/* ── Hero banner ── */}
      <div style={{ background:`linear-gradient(135deg, ${C.navy} 0%, ${C.navyLight} 100%)`, padding:'48px 32px 40px', textAlign:'center' }}>
        <div style={{ display:'inline-block', background:C.green, color:C.white, borderRadius:20, padding:'4px 16px', fontSize:12, fontWeight:600, marginBottom:16, letterSpacing:'0.5px' }}>
          DEMO — Multi-Vendor Price Intelligence
        </div>
        <h1 style={{ margin:'0 0 12px', color:C.white, fontSize:36, fontWeight:800, letterSpacing:'-1px' }}>
          Stop Overpaying. Shop Smarter.
        </h1>
        <p style={{ margin:'0 auto 24px', color:'rgba(255,255,255,0.7)', fontSize:16, maxWidth:580 }}>
          Add products to your cart and SmartShop instantly compares Amazon, Walmart, and Best Buy — surfacing the cheapest, fastest, and best overall option.
        </p>
        <div style={{ display:'flex', gap:12, justifyContent:'center' }}>
          <Btn variant="primary" onClick={() => setTab('search')} style={{ fontSize:15, padding:'12px 28px' }}>Start Comparing →</Btn>
          <Btn variant="outline" onClick={() => setTab('compare')} style={{ color:C.white, borderColor:'rgba(255,255,255,0.5)', fontSize:15, padding:'12px 28px' }}>View Recommendations</Btn>
        </div>
        {/* Stats */}
        <div style={{ display:'flex', gap:40, justifyContent:'center', marginTop:36 }}>
          {[['3', 'Vendors'], ['8', 'Products'], ['Instant', 'Comparison'], ['3 Types', 'Recommendations']].map(([n, l]) => (
            <div key={l} style={{ textAlign:'center' }}>
              <div style={{ color:C.green, fontWeight:800, fontSize:22 }}>{n}</div>
              <div style={{ color:'rgba(255,255,255,0.6)', fontSize:12, textTransform:'uppercase', letterSpacing:'0.5px' }}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Tab bar ── */}
      <div style={{ background:C.white, borderBottom:`1px solid ${C.gray200}`, padding:'0 32px' }}>
        <div style={{ display:'flex', gap:0 }}>
          {TAB_DEFS.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              style={{ background:'transparent', border:'none', padding:'16px 24px', fontWeight: tab===t.key ? 700 : 400, fontSize:14, color: tab===t.key ? C.green : C.gray600, borderBottom: tab===t.key ? `3px solid ${C.green}` : '3px solid transparent', cursor:'pointer', transition:'all 0.15s', whiteSpace:'nowrap' }}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Content ── */}
      <div style={{ maxWidth:1200, margin:'0 auto', padding:'32px 24px' }}>

        {/* ════ SEARCH ════ */}
        {tab === 'search' && (
          <div>
            <SectionHeader title="Find Products" sub="Search by name, brand, or category. Results are matched across all 3 vendors." />

            {/* Search bar */}
            <div style={{ display:'flex', gap:10, marginBottom:32 }}>
              <div style={{ flex:1, position:'relative' }}>
                <span style={{ position:'absolute', left:14, top:'50%', transform:'translateY(-50%)', fontSize:18, color:C.gray400 }}>🔍</span>
                <input id="smartshop-search-input" value={query} onChange={e => setQuery(e.target.value)} onKeyDown={e => e.key==='Enter' && handleSearch()}
                  placeholder='Search — e.g. "Sony headphones", "MacBook", "TV"'
                  style={{ width:'100%', padding:'13px 16px 13px 44px', border:`2px solid ${C.gray200}`, borderRadius:8, fontSize:15, outline:'none', boxSizing:'border-box', fontFamily:'inherit', color:C.gray800 }}
                />
              </div>
              <Btn variant="primary" onClick={handleSearch} style={{ padding:'0 28px', fontSize:15 }}>{loading ? 'Searching…' : 'Search'}</Btn>
            </div>

            {/* Empty state */}
            {results.length === 0 && (
              <div style={{ textAlign:'center', padding:'60px 0', color:C.gray400 }}>
                <div style={{ fontSize:56, marginBottom:16 }}>🔍</div>
                <div style={{ fontSize:16, color:C.gray600, marginBottom:8 }}>Search to compare prices instantly across all vendors</div>
                <div style={{ fontSize:13 }}>Try: headphones · MacBook · Samsung TV · vacuum · Nintendo Switch</div>
              </div>
            )}

            {/* Product grid */}
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(270px, 1fr))', gap:20 }}>
              {results.map(p => {
                const offers = MOCK_OFFERS[p.id] ?? {}
                const minPrice = Math.min(...Object.values(offers).filter(o=>o.inStock).map(o => o.price + o.shippingCost))
                const inCart = cart.find(i => i.product.id === p.id)
                return (
                  <div key={p.id} className="smartshop-product-card" style={{ background:C.white, border:`1px solid ${C.gray200}`, borderRadius:10, overflow:'hidden', transition:'box-shadow 0.2s', boxShadow:'0 1px 4px rgba(0,0,0,0.06)' }}>
                    {/* Image / emoji area */}
                    <div style={{ background:C.navyBg, padding:'28px 0', textAlign:'center', fontSize:52 }}>{p.image}</div>
                    <div style={{ padding:'16px 18px 18px' }}>
                      <div style={{ fontSize:11, fontWeight:600, color:C.green, textTransform:'uppercase', letterSpacing:'0.5px', marginBottom:6 }}>{p.category}</div>
                      <div style={{ fontWeight:700, fontSize:14, color:C.navy, lineHeight:1.4, marginBottom:4 }}>{p.title}</div>
                      <div style={{ fontSize:12, color:C.gray600, marginBottom:12 }}>{p.brand} · {p.model}</div>
                      {/* Vendor price pills */}
                      <div style={{ display:'flex', flexWrap:'wrap', gap:4, marginBottom:14 }}>
                        {Object.entries(offers).map(([vid, o]) => (
                          <div key={vid} style={{ background: o.inStock ? C.greenBadge : C.redLight, borderRadius:4, padding:'3px 8px', fontSize:11, color: o.inStock ? C.green : C.red, fontWeight:600 }}>
                            {VENDORS.find(v=>v.id===vid)?.logo} {fmt(o.price + o.shippingCost)}
                          </div>
                        ))}
                      </div>
                      <div style={{ fontSize:20, fontWeight:800, color:C.navy, marginBottom:14 }}>from {fmt(minPrice)}</div>
                      <button onClick={() => addToCart(p)}
                        style={{ width:'100%', padding:'10px', borderRadius:6, border: inCart ? `2px solid ${C.green}` : `2px solid ${C.green}`, background: inCart ? C.greenLight : C.green, color: inCart ? C.green : C.white, fontWeight:700, fontSize:13, cursor:'pointer', transition:'all 0.15s' }}>
                        {inCart ? `✓ In Cart (×${inCart.quantity})` : '+ Add to Cart'}
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* ════ CART ════ */}
        {tab === 'cart' && (
          <div>
            <SectionHeader title="Your Cart" sub="Review items, adjust quantities, and get recommendations." />

            {cart.length === 0 ? (
              <div style={{ textAlign:'center', padding:'60px 0', color:C.gray400, background:C.white, borderRadius:10, border:`1px solid ${C.gray200}` }}>
                <div style={{ fontSize:56, marginBottom:16 }}>🛒</div>
                <div style={{ color:C.gray600, fontSize:16, marginBottom:16 }}>Your cart is empty</div>
                <Btn variant="primary" onClick={() => setTab('search')}>Browse Products →</Btn>
              </div>
            ) : (
              <div style={{ display:'grid', gridTemplateColumns:'1fr 320px', gap:24, alignItems:'start' }}>
                {/* Items */}
                <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
                  {cart.map(item => {
                    const offers = MOCK_OFFERS[item.product.id] ?? {}
                    const best = Object.values(offers).filter(o=>o.inStock).sort((a,b)=>(a.price+a.shippingCost)-(b.price+b.shippingCost))[0]
                    return (
                      <div key={item.product.id} style={{ background:C.white, border:`1px solid ${C.gray200}`, borderRadius:10, padding:'16px 20px', display:'flex', alignItems:'center', gap:16, boxShadow:'0 1px 4px rgba(0,0,0,0.04)' }}>
                        <div style={{ background:C.navyBg, borderRadius:8, width:60, height:60, display:'flex', alignItems:'center', justifyContent:'center', fontSize:28, flexShrink:0 }}>{item.product.image}</div>
                        <div style={{ flex:1 }}>
                          <div style={{ fontWeight:700, fontSize:14, color:C.navy }}>{item.product.title}</div>
                          <div style={{ fontSize:12, color:C.gray600 }}>{item.product.brand} · {item.product.model}</div>
                          {best && <div style={{ fontSize:12, color:C.green, marginTop:4, fontWeight:600 }}>Best: {fmt((best.price+best.shippingCost)*item.quantity)} via {VENDORS.find(v=>v.id===best.vendorId)?.name}</div>}
                        </div>
                        {/* Qty controls */}
                        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                          <button onClick={() => changeQty(item.product.id, -1)} style={{ width:30, height:30, borderRadius:6, border:`1px solid ${C.gray200}`, background:C.white, fontSize:16, cursor:'pointer', color:C.gray800 }}>−</button>
                          <span style={{ fontWeight:700, minWidth:24, textAlign:'center' }}>{item.quantity}</span>
                          <button onClick={() => changeQty(item.product.id, 1)} style={{ width:30, height:30, borderRadius:6, border:`1px solid ${C.gray200}`, background:C.white, fontSize:16, cursor:'pointer', color:C.gray800 }}>+</button>
                        </div>
                        <button onClick={() => removeItem(item.product.id)} style={{ background:C.redLight, border:'none', borderRadius:6, padding:'6px 12px', color:C.red, cursor:'pointer', fontSize:12, fontWeight:600 }}>Remove</button>
                      </div>
                    )
                  })}
                </div>

                {/* Summary card */}
                <div style={{ background:C.white, border:`1px solid ${C.gray200}`, borderRadius:10, padding:24, boxShadow:'0 1px 4px rgba(0,0,0,0.04)' }}>
                  <div style={{ fontWeight:700, fontSize:16, color:C.navy, marginBottom:16 }}>Cart Total by Vendor</div>
                  {VENDORS.map(v => (
                    <div key={v.id} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'10px 0', borderBottom:`1px solid ${C.gray100}` }}>
                      <div style={{ display:'flex', alignItems:'center', gap:8, fontWeight:600, fontSize:13 }}>{v.logo} {v.name}</div>
                      <div style={{ fontWeight:800, fontSize:15, color: totals[v.id]===Infinity ? C.red : C.navy }}>
                        {totals[v.id]===Infinity ? 'Unavail.' : fmt(totals[v.id])}
                      </div>
                    </div>
                  ))}
                  <Btn variant="primary" onClick={() => setTab('compare')} style={{ width:'100%', justifyContent:'center', marginTop:20 }}>
                    ⭐ Get Recommendations →
                  </Btn>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ════ COMPARE ════ */}
        {tab === 'compare' && (
          <div>
            {cart.length === 0 ? (
              <div style={{ textAlign:'center', padding:'60px 0', background:C.white, borderRadius:10, border:`1px solid ${C.gray200}` }}>
                <div style={{ fontSize:56, marginBottom:16 }}>📊</div>
                <div style={{ color:C.gray600, fontSize:16, marginBottom:16 }}>Add items to your cart to see comparisons</div>
                <Btn variant="primary" onClick={() => setTab('search')}>Search Products →</Btn>
              </div>
            ) : (
              <>
                {/* Recommendation cards */}
                {recs.length > 0 && (
                  <div style={{ marginBottom:36 }}>
                    <SectionHeader title="Our Recommendations" sub="Based on your cart contents and preference weights." />
                    <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(300px, 1fr))', gap:20 }}>
                      {recs.map(rec => (
                        <div key={rec.type} style={{ background:C.white, border: rec.type==='best' ? `2px solid ${C.green}` : `1px solid ${C.gray200}`, borderRadius:10, padding:24, boxShadow: rec.type==='best' ? `0 4px 16px rgba(0,135,90,0.12)` : '0 1px 4px rgba(0,0,0,0.06)', position:'relative', overflow:'hidden' }}>
                          {rec.type === 'best' && (
                            <div style={{ position:'absolute', top:0, right:0, background:C.green, color:C.white, fontSize:10, fontWeight:700, padding:'4px 12px', borderRadius:'0 10px 0 10px', letterSpacing:'0.5px' }}>TOP PICK</div>
                          )}
                          <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:12 }}>
                            <div style={{ background: rec.type==='best' ? C.green : C.navyBg, borderRadius:10, width:48, height:48, display:'flex', alignItems:'center', justifyContent:'center', fontSize:22 }}>{rec.icon}</div>
                            <div>
                              <div style={{ fontWeight:700, fontSize:15, color:C.navy }}>{rec.label}</div>
                              <div style={{ fontSize:12, color:C.gray600 }}>{VENDORS.find(v=>v.id===rec.vendorId)?.logo} {VENDORS.find(v=>v.id===rec.vendorId)?.name}</div>
                            </div>
                            <div style={{ marginLeft:'auto', textAlign:'right' }}>
                              <div style={{ fontWeight:800, fontSize:20, color: rec.type==='best' ? C.green : C.navy }}>{fmt(rec.totalCost)}</div>
                              <div style={{ fontSize:11, color:C.gray400 }}>total cart</div>
                            </div>
                          </div>
                          <div style={{ fontSize:13, color:C.gray600, lineHeight:1.6, background:C.gray50, borderRadius:6, padding:'10px 12px' }}>{rec.rationale}</div>
                          <button style={{ marginTop:14, width:'100%', padding:'9px', borderRadius:6, border:`2px solid ${rec.type==='best' ? C.green : C.navy}`, background:'transparent', color: rec.type==='best' ? C.green : C.navy, fontWeight:700, fontSize:13, cursor:'pointer' }}>
                            Go to {VENDORS.find(v=>v.id===rec.vendorId)?.name} →
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Per-item accordion comparison */}
                <SectionHeader title="Item-by-Item Comparison" sub="Click any row to expand the full vendor breakdown." />
                <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                  {cart.map(item => {
                    const offers = MOCK_OFFERS[item.product.id] ?? {}
                    const isOpen = expanded === item.product.id
                    const costs = Object.values(offers).filter(o=>o.inStock).map(o=>o.price+o.shippingCost)
                    const minCost = costs.length ? Math.min(...costs) : null
                    return (
                      <div key={item.product.id} style={{ background:C.white, border:`1px solid ${C.gray200}`, borderRadius:10, overflow:'hidden' }}>
                        <div onClick={() => setExpanded(isOpen ? null : item.product.id)}
                          style={{ padding:'14px 20px', cursor:'pointer', display:'flex', alignItems:'center', gap:14, userSelect:'none' }}>
                          <div style={{ background:C.navyBg, borderRadius:8, width:44, height:44, display:'flex', alignItems:'center', justifyContent:'center', fontSize:22, flexShrink:0 }}>{item.product.image}</div>
                          <div style={{ flex:1 }}>
                            <div style={{ fontWeight:700, fontSize:13, color:C.navy }}>{item.product.title}</div>
                            <div style={{ fontSize:12, color:C.gray600 }}>Qty: {item.quantity} · Best price: {minCost ? fmt(minCost) : '—'}</div>
                          </div>
                          <div style={{ fontSize:18, color:C.gray400 }}>{isOpen ? '▲' : '▼'}</div>
                        </div>
                        {isOpen && (
                          <div style={{ borderTop:`1px solid ${C.gray100}`, padding:'0 20px 20px' }}>
                            <table style={{ width:'100%', borderCollapse:'collapse', fontSize:13 }}>
                              <thead>
                                <tr style={{ background:C.navyBg }}>
                                  {['Vendor','Price','Shipping','Total (×qty)','ETA','Rating','Returns','Stock'].map(h => (
                                    <th key={h} style={{ padding:'10px 12px', textAlign: h==='Vendor' ? 'left' : 'center', fontWeight:600, color:C.navy, fontSize:12, textTransform:'uppercase', letterSpacing:'0.4px' }}>{h}</th>
                                  ))}
                                </tr>
                              </thead>
                              <tbody>
                                {VENDORS.map((v, i) => {
                                  const o = offers[v.id]
                                  if (!o) return null
                                  const total = (o.price + o.shippingCost) * item.quantity
                                  const isBest = o.inStock && total === Math.min(...Object.values(offers).filter(x=>x.inStock).map(x=>(x.price+x.shippingCost)*item.quantity))
                                  return (
                                    <tr key={v.id} style={{ background: isBest ? C.greenBadge : i%2===0 ? C.white : C.gray50, borderBottom:`1px solid ${C.gray100}` }}>
                                      <td style={{ padding:'11px 12px', fontWeight:700, color:C.navy }}>{v.logo} {v.name}</td>
                                      <td style={{ padding:'11px 12px', textAlign:'center' }}>{fmt(o.price)}</td>
                                      <td style={{ padding:'11px 12px', textAlign:'center', color: o.shippingCost===0 ? C.green : C.gray800, fontWeight: o.shippingCost===0 ? 600 : 400 }}>{o.shippingCost===0 ? 'FREE' : fmt(o.shippingCost)}</td>
                                      <td style={{ padding:'11px 12px', textAlign:'center', fontWeight:800, color: isBest ? C.green : C.navy }}>{fmt(total)}</td>
                                      <td style={{ padding:'11px 12px', textAlign:'center' }}>{o.shippingEtaDays}d</td>
                                      <td style={{ padding:'11px 12px', textAlign:'center' }}><StarRow rating={o.sellerRating} /></td>
                                      <td style={{ padding:'11px 12px', textAlign:'center' }}>{o.returnWindowDays}d</td>
                                      <td style={{ padding:'11px 12px', textAlign:'center' }}><Badge ok={o.inStock} /></td>
                                    </tr>
                                  )
                                })}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </>
            )}
          </div>
        )}

        {/* ════ PREFERENCES ════ */}
        {tab === 'prefs' && (
          <div style={{ maxWidth:600 }}>
            <SectionHeader title="Recommendation Preferences" sub="Tune how the scoring engine weights each factor. Must sum to 100%." />

            <div style={{ background:C.white, border:`1px solid ${C.gray200}`, borderRadius:10, padding:28, marginBottom:20, boxShadow:'0 1px 4px rgba(0,0,0,0.04)' }}>
              {([
                { key:'price',        label:'💰 Price',          desc:'Lowest total landed cost' },
                { key:'speed',        label:'⚡ Delivery Speed', desc:'Fastest estimated delivery' },
                { key:'rating',       label:'⭐ Seller Rating',  desc:'Vendor trust & quality' },
                { key:'returnPolicy', label:'↩️ Return Policy',  desc:'Longer return window' },
              ] as const).map(({ key, label, desc }) => (
                <div key={key} style={{ marginBottom:24 }}>
                  <div style={{ display:'flex', justifyContent:'space-between', marginBottom:8 }}>
                    <div>
                      <div style={{ fontWeight:700, fontSize:14, color:C.navy }}>{label}</div>
                      <div style={{ fontSize:12, color:C.gray600 }}>{desc}</div>
                    </div>
                    <div style={{ fontWeight:800, fontSize:20, color:C.green }}>{Math.round(weights[key]*100)}%</div>
                  </div>
                  <input type="range" min={0} max={100} value={Math.round(weights[key]*100)}
                    onChange={e => setWeights(prev => ({ ...prev, [key]: parseInt(e.target.value)/100 }))}
                    style={{ width:'100%', accentColor:C.green, height:6 }}
                  />
                </div>
              ))}

              <div style={{ padding:'12px 16px', borderRadius:8, background: weightValid ? C.greenBadge : C.redLight, border:`1px solid ${weightValid ? C.green : C.red}`, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                <span style={{ fontWeight:600, fontSize:13, color: weightValid ? C.green : C.red }}>Total weight: {Math.round(weightSum*100)}%</span>
                <span style={{ fontSize:13, color: weightValid ? C.green : C.red }}>{weightValid ? '✓ Valid' : '⚠️ Must total 100%'}</span>
              </div>
            </div>

            {/* Vendor preferences */}
            <div style={{ background:C.white, border:`1px solid ${C.gray200}`, borderRadius:10, padding:24, boxShadow:'0 1px 4px rgba(0,0,0,0.04)' }}>
              <div style={{ fontWeight:700, fontSize:15, color:C.navy, marginBottom:16 }}>🏪 Vendor Preferences</div>
              {VENDORS.map(v => (
                <div key={v.id} style={{ display:'flex', alignItems:'center', gap:12, padding:'12px 0', borderBottom:`1px solid ${C.gray100}` }}>
                  <span style={{ fontSize:20 }}>{v.logo}</span>
                  <span style={{ flex:1, fontWeight:600, color:C.navy }}>{v.name}</span>
                  <Btn variant="outline" style={{ padding:'5px 14px', fontSize:12, color:C.green, borderColor:C.green }}>Prefer</Btn>
                  <Btn variant="ghost" style={{ padding:'5px 14px', fontSize:12, color:C.red, border:`1px solid ${C.red}` }}>Block</Btn>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── Footer ── */}
      <footer style={{ background:C.navy, color:'rgba(255,255,255,0.5)', textAlign:'center', padding:'20px 32px', fontSize:12, marginTop:60 }}>
        SmartShop — Demo only · All prices and vendor data are simulated · No real purchases are made
      </footer>
    </div>
  )
}
