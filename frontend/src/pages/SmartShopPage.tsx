/**
 * SmartShop — Demo-only Smart Shopping Cart
 * Multi-vendor price comparison with scoring & recommendations.
 * All data is mocked; no real vendor API calls are made.
 */

import { useState, useMemo, useCallback } from 'react'

// ─── Types ────────────────────────────────────────────────────────────────────

interface Vendor {
  id: string
  name: string
  logo: string
  color: string
}

interface Product {
  id: string
  title: string
  brand: string
  model: string
  category: string
  image: string
  upc: string
}

interface Offer {
  vendorId: string
  price: number
  shippingCost: number
  shippingEtaDays: number
  inStock: boolean
  sellerRating: number  // 0–5
  returnWindowDays: number
  url: string
  fetchedAt: string
}

interface CartItem {
  product: Product
  quantity: number
}

interface Weights {
  price: number
  speed: number
  rating: number
  returnPolicy: number
}

interface Recommendation {
  type: 'cheapest' | 'fastest' | 'best'
  label: string
  emoji: string
  vendorId: string
  totalCost: number
  rationale: string
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const VENDORS: Vendor[] = [
  { id: 'amazon',   name: 'Amazon',   logo: '🟠', color: '#FF9900' },
  { id: 'walmart',  name: 'Walmart',  logo: '🔵', color: '#0071CE' },
  { id: 'bestbuy',  name: 'Best Buy', logo: '🟡', color: '#003BBF' },
]

const CATALOG: Product[] = [
  { id: 'p1', title: 'Sony WH-1000XM5 Wireless Headphones', brand: 'Sony', model: 'WH-1000XM5', category: 'Electronics', image: '🎧', upc: '027242920392' },
  { id: 'p2', title: 'Apple AirPods Pro (2nd Gen)', brand: 'Apple', model: 'MQTP3LL/A', category: 'Electronics', image: '🎵', upc: '194253397069' },
  { id: 'p3', title: 'Samsung 65" 4K QLED Smart TV', brand: 'Samsung', model: 'QN65Q80C', category: 'Electronics', image: '📺', upc: '887276671321' },
  { id: 'p4', title: 'Apple MacBook Air M2 13"', brand: 'Apple', model: 'MLY33LL/A', category: 'Computers', image: '💻', upc: '194253068945' },
  { id: 'p5', title: 'Dyson V15 Detect Vacuum', brand: 'Dyson', model: 'V15 Detect', category: 'Home', image: '🌀', upc: '885609017539' },
  { id: 'p6', title: 'Nintendo Switch OLED', brand: 'Nintendo', model: 'HEG-001', category: 'Gaming', image: '🎮', upc: '045496882494' },
  { id: 'p7', title: 'Instant Pot Duo 7-in-1', brand: 'Instant Pot', model: 'Duo 6Qt', category: 'Kitchen', image: '🍲', upc: '812369024711' },
  { id: 'p8', title: 'LG 27" UltraGear Gaming Monitor', brand: 'LG', model: '27GP850-B', category: 'Monitors', image: '🖥️', upc: '719192635993' },
]

// Mock offers keyed by productId → vendorId → Offer
const MOCK_OFFERS: Record<string, Record<string, Offer>> = {
  p1: {
    amazon:  { vendorId:'amazon',  price:279.99, shippingCost:0,     shippingEtaDays:2, inStock:true,  sellerRating:4.7, returnWindowDays:30, url:'#', fetchedAt: new Date().toISOString() },
    walmart: { vendorId:'walmart', price:269.00, shippingCost:5.99,  shippingEtaDays:5, inStock:true,  sellerRating:4.3, returnWindowDays:15, url:'#', fetchedAt: new Date().toISOString() },
    bestbuy: { vendorId:'bestbuy', price:299.99, shippingCost:0,     shippingEtaDays:3, inStock:true,  sellerRating:4.6, returnWindowDays:15, url:'#', fetchedAt: new Date().toISOString() },
  },
  p2: {
    amazon:  { vendorId:'amazon',  price:189.00, shippingCost:0,     shippingEtaDays:1, inStock:true,  sellerRating:4.8, returnWindowDays:30, url:'#', fetchedAt: new Date().toISOString() },
    walmart: { vendorId:'walmart', price:179.00, shippingCost:0,     shippingEtaDays:3, inStock:false, sellerRating:4.2, returnWindowDays:15, url:'#', fetchedAt: new Date().toISOString() },
    bestbuy: { vendorId:'bestbuy', price:199.00, shippingCost:0,     shippingEtaDays:2, inStock:true,  sellerRating:4.7, returnWindowDays:15, url:'#', fetchedAt: new Date().toISOString() },
  },
  p3: {
    amazon:  { vendorId:'amazon',  price:997.99, shippingCost:0,     shippingEtaDays:3, inStock:true,  sellerRating:4.6, returnWindowDays:30, url:'#', fetchedAt: new Date().toISOString() },
    walmart: { vendorId:'walmart', price:949.00, shippingCost:0,     shippingEtaDays:7, inStock:true,  sellerRating:4.0, returnWindowDays:30, url:'#', fetchedAt: new Date().toISOString() },
    bestbuy: { vendorId:'bestbuy', price:1099.99,shippingCost:0,     shippingEtaDays:2, inStock:true,  sellerRating:4.8, returnWindowDays:15, url:'#', fetchedAt: new Date().toISOString() },
  },
  p4: {
    amazon:  { vendorId:'amazon',  price:999.00, shippingCost:0,     shippingEtaDays:2, inStock:true,  sellerRating:4.9, returnWindowDays:30, url:'#', fetchedAt: new Date().toISOString() },
    walmart: { vendorId:'walmart', price:979.00, shippingCost:9.99,  shippingEtaDays:6, inStock:true,  sellerRating:4.1, returnWindowDays:15, url:'#', fetchedAt: new Date().toISOString() },
    bestbuy: { vendorId:'bestbuy', price:1049.00,shippingCost:0,     shippingEtaDays:1, inStock:true,  sellerRating:4.8, returnWindowDays:14, url:'#', fetchedAt: new Date().toISOString() },
  },
  p5: {
    amazon:  { vendorId:'amazon',  price:649.99, shippingCost:0,     shippingEtaDays:2, inStock:true,  sellerRating:4.7, returnWindowDays:30, url:'#', fetchedAt: new Date().toISOString() },
    walmart: { vendorId:'walmart', price:599.00, shippingCost:0,     shippingEtaDays:5, inStock:true,  sellerRating:4.3, returnWindowDays:15, url:'#', fetchedAt: new Date().toISOString() },
    bestbuy: { vendorId:'bestbuy', price:699.99, shippingCost:0,     shippingEtaDays:2, inStock:false, sellerRating:4.6, returnWindowDays:15, url:'#', fetchedAt: new Date().toISOString() },
  },
  p6: {
    amazon:  { vendorId:'amazon',  price:329.99, shippingCost:0,     shippingEtaDays:1, inStock:true,  sellerRating:4.8, returnWindowDays:30, url:'#', fetchedAt: new Date().toISOString() },
    walmart: { vendorId:'walmart', price:319.00, shippingCost:0,     shippingEtaDays:4, inStock:true,  sellerRating:4.2, returnWindowDays:30, url:'#', fetchedAt: new Date().toISOString() },
    bestbuy: { vendorId:'bestbuy', price:349.99, shippingCost:0,     shippingEtaDays:2, inStock:true,  sellerRating:4.7, returnWindowDays:15, url:'#', fetchedAt: new Date().toISOString() },
  },
  p7: {
    amazon:  { vendorId:'amazon',  price:79.95,  shippingCost:0,     shippingEtaDays:2, inStock:true,  sellerRating:4.6, returnWindowDays:30, url:'#', fetchedAt: new Date().toISOString() },
    walmart: { vendorId:'walmart', price:69.00,  shippingCost:0,     shippingEtaDays:3, inStock:true,  sellerRating:4.4, returnWindowDays:15, url:'#', fetchedAt: new Date().toISOString() },
    bestbuy: { vendorId:'bestbuy', price:89.99,  shippingCost:5.99,  shippingEtaDays:3, inStock:true,  sellerRating:4.5, returnWindowDays:15, url:'#', fetchedAt: new Date().toISOString() },
  },
  p8: {
    amazon:  { vendorId:'amazon',  price:279.99, shippingCost:0,     shippingEtaDays:2, inStock:true,  sellerRating:4.7, returnWindowDays:30, url:'#', fetchedAt: new Date().toISOString() },
    walmart: { vendorId:'walmart', price:259.00, shippingCost:0,     shippingEtaDays:5, inStock:true,  sellerRating:4.1, returnWindowDays:15, url:'#', fetchedAt: new Date().toISOString() },
    bestbuy: { vendorId:'bestbuy', price:299.99, shippingCost:0,     shippingEtaDays:1, inStock:true,  sellerRating:4.8, returnWindowDays:15, url:'#', fetchedAt: new Date().toISOString() },
  },
}

// ─── Scoring Engine ───────────────────────────────────────────────────────────

function scoreOffers(offers: Offer[], weights: Weights): Record<string, number> {
  const available = offers.filter(o => o.inStock)
  if (available.length === 0) return {}

  const totals = available.map(o => o.price + o.shippingCost)
  const minTotal = Math.min(...totals)
  const maxTotal = Math.max(...totals)
  const minEta   = Math.min(...available.map(o => o.shippingEtaDays))
  const maxEta   = Math.max(...available.map(o => o.shippingEtaDays))
  const minRet   = Math.min(...available.map(o => o.returnWindowDays))
  const maxRet   = Math.max(...available.map(o => o.returnWindowDays))

  const norm = (v: number, min: number, max: number, invert = false) => {
    if (max === min) return 1
    const s = (v - min) / (max - min)
    return invert ? 1 - s : s
  }

  const scores: Record<string, number> = {}
  available.forEach(o => {
    const total = o.price + o.shippingCost
    const priceScore  = norm(total, minTotal, maxTotal, true)
    const speedScore  = norm(o.shippingEtaDays, minEta, maxEta, true)
    const ratingScore = o.sellerRating / 5
    const returnScore = norm(o.returnWindowDays, minRet, maxRet, false)

    scores[o.vendorId] =
      weights.price * priceScore +
      weights.speed * speedScore +
      weights.rating * ratingScore +
      weights.returnPolicy * returnScore
  })
  return scores
}

function computeCartTotals(cart: CartItem[]): Record<string, number> {
  const totals: Record<string, number> = {}
  VENDORS.forEach(v => { totals[v.id] = 0 })

  cart.forEach(item => {
    const offers = MOCK_OFFERS[item.product.id] ?? {}
    VENDORS.forEach(v => {
      const o = offers[v.id]
      if (o && o.inStock) {
        totals[v.id] += (o.price + o.shippingCost) * item.quantity
      } else {
        totals[v.id] = Infinity
      }
    })
  })
  return totals
}

function getRecommendations(cart: CartItem[], weights: Weights): Recommendation[] {
  if (cart.length === 0) return []
  const totals = computeCartTotals(cart)

  // Cheapest
  const cheapestId  = Object.entries(totals).sort((a,b)=>a[1]-b[1])[0]?.[0]
  // Fastest (min max ETA across items)
  const etaByVendor: Record<string,number> = {}
  VENDORS.forEach(v => {
    etaByVendor[v.id] = cart.reduce((max, item) => {
      const o = MOCK_OFFERS[item.product.id]?.[v.id]
      return o && o.inStock ? Math.max(max, o.shippingEtaDays) : 999
    }, 0)
  })
  const fastestId = Object.entries(etaByVendor).sort((a,b)=>a[1]-b[1])[0]?.[0]

  // Best overall (weighted score)
  const scoreByVendor: Record<string, number> = {}
  VENDORS.forEach(v => {
    const offersForVendor = cart.map(item => MOCK_OFFERS[item.product.id]?.[v.id]).filter(Boolean) as Offer[]
    if (offersForVendor.length < cart.length) { scoreByVendor[v.id] = -1; return }
    const allOffers = cart.flatMap(item => Object.values(MOCK_OFFERS[item.product.id] ?? {}))
    const s = scoreOffers(allOffers, weights)
    scoreByVendor[v.id] = s[v.id] ?? 0
  })
  const bestId = Object.entries(scoreByVendor).sort((a,b)=>b[1]-a[1])[0]?.[0]

  const vendorName = (id: string) => VENDORS.find(v => v.id === id)?.name ?? id
  const fmt = (n: number) => n === Infinity ? 'N/A' : `$${n.toFixed(2)}`

  const recs: Recommendation[] = []

  if (cheapestId && totals[cheapestId] !== Infinity) {
    const savings = Math.min(...Object.values(totals).filter(x=>x!==Infinity)) === totals[cheapestId]
      ? null : totals[cheapestId]
    recs.push({
      type: 'cheapest', label: 'Cheapest', emoji: '💰',
      vendorId: cheapestId,
      totalCost: totals[cheapestId],
      rationale: `${vendorName(cheapestId)} has the lowest total cart cost at ${fmt(totals[cheapestId])}, including shipping.`,
    })
  }
  if (fastestId && etaByVendor[fastestId] < 999) {
    recs.push({
      type: 'fastest', label: 'Fastest', emoji: '⚡',
      vendorId: fastestId,
      totalCost: totals[fastestId],
      rationale: `${vendorName(fastestId)} delivers everything within ${etaByVendor[fastestId]} day(s) — fastest guaranteed delivery.`,
    })
  }
  if (bestId && scoreByVendor[bestId] > 0) {
    const diff = totals[bestId] - Math.min(...Object.values(totals).filter(x=>x!==Infinity))
    const diffStr = diff > 0 ? ` (${fmt(diff)} more than cheapest)` : ''
    recs.push({
      type: 'best', label: 'Best Overall', emoji: '⭐',
      vendorId: bestId,
      totalCost: totals[bestId],
      rationale: `${vendorName(bestId)} scores highest on price, speed, rating, and return policy${diffStr}.`,
    })
  }
  return recs
}

// ─── UI Helpers ───────────────────────────────────────────────────────────────

const fmt = (n: number) => n === Infinity ? '—' : `$${n.toFixed(2)}`
const stars = (r: number) => '★'.repeat(Math.round(r)) + '☆'.repeat(5 - Math.round(r))

// ─── Component ────────────────────────────────────────────────────────────────

export function SmartShopPage() {
  const [query, setQuery]             = useState('')
  const [searchResults, setSearchResults] = useState<Product[]>([])
  const [cart, setCart]               = useState<CartItem[]>([])
  const [activeTab, setActiveTab]     = useState<'search'|'cart'|'compare'|'prefs'>('search')
  const [weights, setWeights]         = useState<Weights>({ price: 0.5, speed: 0.2, rating: 0.2, returnPolicy: 0.1 })
  const [expandedItem, setExpandedItem] = useState<string|null>(null)
  const [searching, setSearching]     = useState(false)
  const [showRecs, setShowRecs]       = useState(false)

  // Mock search
  const handleSearch = useCallback(() => {
    if (!query.trim()) return
    setSearching(true)
    setTimeout(() => {
      const q = query.toLowerCase()
      const results = CATALOG.filter(p =>
        p.title.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.model.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
      )
      setSearchResults(results.length ? results : CATALOG.slice(0, 4))
      setSearching(false)
    }, 600)
  }, [query])

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(i => i.product.id === product.id)
      if (existing) return prev.map(i => i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i)
      return [...prev, { product, quantity: 1 }]
    })
  }

  const updateQty = (productId: string, delta: number) => {
    setCart(prev => prev
      .map(i => i.product.id === productId ? { ...i, quantity: i.quantity + delta } : i)
      .filter(i => i.quantity > 0)
    )
  }

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(i => i.product.id !== productId))
  }

  const recommendations = useMemo(() => getRecommendations(cart, weights), [cart, weights])

  const totalWeight = weights.price + weights.speed + weights.rating + weights.returnPolicy

  const updateWeight = (key: keyof Weights, value: number) => {
    setWeights(prev => ({ ...prev, [key]: value }))
  }

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)', fontFamily: "'Inter', sans-serif", color: '#fff' }}>
      {/* Header */}
      <div style={{ background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.1)', padding: '16px 24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{ fontSize: '28px' }}>🛒</div>
        <div>
          <div style={{ fontSize: '20px', fontWeight: 700, letterSpacing: '-0.5px' }}>SmartShop</div>
          <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', letterSpacing: '1px', textTransform: 'uppercase' }}>Multi-vendor price comparison · Demo</div>
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: '8px', alignItems: 'center' }}>
          {VENDORS.map(v => (
            <div key={v.id} style={{ background: 'rgba(255,255,255,0.1)', borderRadius: '20px', padding: '4px 12px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span>{v.logo}</span><span>{v.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '2px', padding: '16px 24px 0', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        {([
          { key: 'search',  label: '🔍 Search' },
          { key: 'cart',    label: `🛒 Cart${cart.length ? ` (${cart.length})` : ''}` },
          { key: 'compare', label: '📊 Compare' },
          { key: 'prefs',   label: '⚙️ Preferences' },
        ] as const).map(tab => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)}
            style={{
              background: activeTab === tab.key ? 'rgba(255,255,255,0.15)' : 'transparent',
              border: 'none', color: activeTab === tab.key ? '#fff' : 'rgba(255,255,255,0.5)',
              padding: '10px 20px', borderRadius: '8px 8px 0 0', cursor: 'pointer',
              fontSize: '14px', fontWeight: activeTab === tab.key ? 600 : 400,
              borderBottom: activeTab === tab.key ? '2px solid #7c3aed' : '2px solid transparent',
            }}
          >{tab.label}</button>
        ))}
      </div>

      <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>

        {/* ── Search Tab ── */}
        {activeTab === 'search' && (
          <div>
            <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
              <input
                value={query} onChange={e => setQuery(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSearch()}
                placeholder='Search by keyword, brand, or model — e.g. "Sony headphones"'
                style={{ flex: 1, background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '10px', padding: '12px 16px', color: '#fff', fontSize: '15px', outline: 'none' }}
              />
              <button onClick={handleSearch}
                style={{ background: '#7c3aed', border: 'none', borderRadius: '10px', padding: '12px 24px', color: '#fff', fontSize: '15px', fontWeight: 600, cursor: 'pointer' }}>
                {searching ? '…' : 'Search'}
              </button>
            </div>

            {searchResults.length === 0 && (
              <div style={{ textAlign: 'center', padding: '60px 0', color: 'rgba(255,255,255,0.4)' }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔍</div>
                <div style={{ fontSize: '16px' }}>Search for products to compare across Amazon, Walmart, and Best Buy</div>
                <div style={{ fontSize: '13px', marginTop: '8px', color: 'rgba(255,255,255,0.3)' }}>Try: "headphones", "MacBook", "TV", "vacuum"</div>
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
              {searchResults.map(p => {
                const inCart = cart.find(i => i.product.id === p.id)
                const offers = MOCK_OFFERS[p.id] ?? {}
                const minPrice = Math.min(...Object.values(offers).map(o => o.price + o.shippingCost))

                return (
                  <div key={p.id} style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '16px', padding: '20px', transition: 'transform 0.2s' }}>
                    <div style={{ fontSize: '48px', textAlign: 'center', marginBottom: '12px' }}>{p.image}</div>
                    <div style={{ fontWeight: 600, fontSize: '14px', marginBottom: '4px', lineHeight: 1.4 }}>{p.title}</div>
                    <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', marginBottom: '12px' }}>{p.brand} · {p.category}</div>
                    <div style={{ fontSize: '18px', fontWeight: 700, color: '#a78bfa', marginBottom: '12px' }}>
                      from {fmt(minPrice)}
                    </div>
                    <div style={{ display: 'flex', gap: '4px', marginBottom: '16px', flexWrap: 'wrap' }}>
                      {Object.entries(offers).map(([vid, o]) => (
                        <div key={vid} style={{ background: o.inStock ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)', borderRadius: '4px', padding: '2px 8px', fontSize: '11px', color: o.inStock ? '#34d399' : '#f87171' }}>
                          {VENDORS.find(v=>v.id===vid)?.logo} {fmt(o.price + o.shippingCost)}
                        </div>
                      ))}
                    </div>
                    <button onClick={() => addToCart(p)}
                      style={{ width: '100%', background: inCart ? 'rgba(124,58,237,0.3)' : '#7c3aed', border: '1px solid #7c3aed', borderRadius: '8px', padding: '10px', color: '#fff', fontWeight: 600, cursor: 'pointer', fontSize: '14px' }}>
                      {inCart ? `✓ In Cart (×${inCart.quantity})` : '+ Add to Cart'}
                    </button>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* ── Cart Tab ── */}
        {activeTab === 'cart' && (
          <div>
            {cart.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px 0', color: 'rgba(255,255,255,0.4)' }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>🛒</div>
                <div>Your cart is empty. Search for products to add.</div>
              </div>
            ) : (
              <>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
                  {cart.map(item => {
                    const offers = MOCK_OFFERS[item.product.id] ?? {}
                    const minOffer = Object.values(offers).filter(o=>o.inStock).sort((a,b)=>(a.price+a.shippingCost)-(b.price+b.shippingCost))[0]
                    return (
                      <div key={item.product.id} style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '12px', padding: '16px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <div style={{ fontSize: '36px' }}>{item.product.image}</div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 600, fontSize: '14px' }}>{item.product.title}</div>
                          <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>{item.product.brand} · {item.product.model}</div>
                          {minOffer && <div style={{ fontSize: '13px', color: '#a78bfa', marginTop: '4px' }}>Best: {fmt(minOffer.price + minOffer.shippingCost)} via {VENDORS.find(v=>v.id===minOffer.vendorId)?.name}</div>}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <button onClick={() => updateQty(item.product.id, -1)} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '6px', width: '28px', height: '28px', color: '#fff', cursor: 'pointer', fontSize: '16px' }}>−</button>
                          <span style={{ minWidth: '24px', textAlign: 'center', fontWeight: 600 }}>{item.quantity}</span>
                          <button onClick={() => updateQty(item.product.id, 1)} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '6px', width: '28px', height: '28px', color: '#fff', cursor: 'pointer', fontSize: '16px' }}>+</button>
                        </div>
                        <button onClick={() => removeFromCart(item.product.id)} style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '6px', padding: '6px 10px', color: '#f87171', cursor: 'pointer', fontSize: '12px' }}>Remove</button>
                      </div>
                    )
                  })}
                </div>

                {/* Cart totals by vendor */}
                <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '12px', padding: '20px', marginBottom: '20px' }}>
                  <div style={{ fontWeight: 600, marginBottom: '16px', fontSize: '15px' }}>🏷️ Total Cart Cost by Vendor</div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                    {VENDORS.map(v => {
                      const total = computeCartTotals(cart)[v.id]
                      return (
                        <div key={v.id} style={{ background: 'rgba(255,255,255,0.07)', borderRadius: '10px', padding: '16px', textAlign: 'center' }}>
                          <div style={{ fontSize: '20px', marginBottom: '6px' }}>{v.logo}</div>
                          <div style={{ fontWeight: 600, marginBottom: '4px' }}>{v.name}</div>
                          <div style={{ fontSize: '22px', fontWeight: 700, color: total === Infinity ? '#f87171' : '#a78bfa' }}>
                            {total === Infinity ? 'Unavailable' : fmt(total)}
                          </div>
                          {total !== Infinity && <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', marginTop: '4px' }}>incl. shipping</div>}
                        </div>
                      )
                    })}
                  </div>
                </div>

                <button onClick={() => { setShowRecs(true); setActiveTab('compare') }}
                  style={{ background: 'linear-gradient(135deg, #7c3aed, #4f46e5)', border: 'none', borderRadius: '10px', padding: '14px 32px', color: '#fff', fontSize: '16px', fontWeight: 700, cursor: 'pointer', width: '100%' }}>
                  ⭐ Get Recommendations →
                </button>
              </>
            )}
          </div>
        )}

        {/* ── Compare Tab ── */}
        {activeTab === 'compare' && (
          <div>
            {cart.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px 0', color: 'rgba(255,255,255,0.4)' }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>📊</div>
                <div>Add items to your cart to see comparisons.</div>
              </div>
            ) : (
              <>
                {/* Recommendations */}
                {recommendations.length > 0 && (
                  <div style={{ marginBottom: '32px' }}>
                    <div style={{ fontWeight: 700, fontSize: '18px', marginBottom: '16px' }}>🤖 Recommendations</div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
                      {recommendations.map(rec => (
                        <div key={rec.type} style={{ background: rec.type === 'best' ? 'linear-gradient(135deg, rgba(124,58,237,0.3), rgba(79,70,229,0.2))' : 'rgba(255,255,255,0.07)', border: rec.type === 'best' ? '1px solid rgba(124,58,237,0.6)' : '1px solid rgba(255,255,255,0.12)', borderRadius: '16px', padding: '20px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                            <span style={{ fontSize: '24px' }}>{rec.emoji}</span>
                            <div>
                              <div style={{ fontWeight: 700, fontSize: '15px' }}>{rec.label}</div>
                              <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>{VENDORS.find(v=>v.id===rec.vendorId)?.logo} {VENDORS.find(v=>v.id===rec.vendorId)?.name}</div>
                            </div>
                            <div style={{ marginLeft: 'auto', fontSize: '20px', fontWeight: 700, color: '#a78bfa' }}>{fmt(rec.totalCost)}</div>
                          </div>
                          <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)', lineHeight: 1.5 }}>{rec.rationale}</div>
                          <button style={{ marginTop: '14px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', padding: '8px 16px', color: '#fff', cursor: 'pointer', fontSize: '13px', fontWeight: 600 }}>
                            Go to {VENDORS.find(v=>v.id===rec.vendorId)?.name} →
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Per-item comparison tables */}
                <div style={{ fontWeight: 700, fontSize: '18px', marginBottom: '16px' }}>📋 Item-by-Item Comparison</div>
                {cart.map(item => {
                  const offers = MOCK_OFFERS[item.product.id] ?? {}
                  const isExpanded = expandedItem === item.product.id
                  return (
                    <div key={item.product.id} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', marginBottom: '12px', overflow: 'hidden' }}>
                      <div onClick={() => setExpandedItem(isExpanded ? null : item.product.id)}
                        style={{ padding: '16px 20px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span style={{ fontSize: '24px' }}>{item.product.image}</span>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 600, fontSize: '14px' }}>{item.product.title}</div>
                          <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>Qty: {item.quantity}</div>
                        </div>
                        <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '18px' }}>{isExpanded ? '▲' : '▼'}</span>
                      </div>

                      {isExpanded && (
                        <div style={{ padding: '0 20px 20px' }}>
                          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                            <thead>
                              <tr style={{ color: 'rgba(255,255,255,0.5)' }}>
                                <th style={{ textAlign: 'left', padding: '8px 12px', background: 'rgba(255,255,255,0.05)' }}>Vendor</th>
                                <th style={{ textAlign: 'right', padding: '8px 12px', background: 'rgba(255,255,255,0.05)' }}>Price</th>
                                <th style={{ textAlign: 'right', padding: '8px 12px', background: 'rgba(255,255,255,0.05)' }}>Shipping</th>
                                <th style={{ textAlign: 'right', padding: '8px 12px', background: 'rgba(255,255,255,0.05)' }}>Total</th>
                                <th style={{ textAlign: 'center', padding: '8px 12px', background: 'rgba(255,255,255,0.05)' }}>ETA</th>
                                <th style={{ textAlign: 'center', padding: '8px 12px', background: 'rgba(255,255,255,0.05)' }}>Rating</th>
                                <th style={{ textAlign: 'center', padding: '8px 12px', background: 'rgba(255,255,255,0.05)' }}>Returns</th>
                                <th style={{ textAlign: 'center', padding: '8px 12px', background: 'rgba(255,255,255,0.05)' }}>Stock</th>
                              </tr>
                            </thead>
                            <tbody>
                              {VENDORS.map((v, i) => {
                                const o = offers[v.id]
                                if (!o) return null
                                const total = (o.price + o.shippingCost) * item.quantity
                                return (
                                  <tr key={v.id} style={{ background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.03)' }}>
                                    <td style={{ padding: '10px 12px', fontWeight: 600 }}>{v.logo} {v.name}</td>
                                    <td style={{ padding: '10px 12px', textAlign: 'right' }}>{fmt(o.price)}</td>
                                    <td style={{ padding: '10px 12px', textAlign: 'right', color: o.shippingCost === 0 ? '#34d399' : '#fff' }}>{o.shippingCost === 0 ? 'Free' : fmt(o.shippingCost)}</td>
                                    <td style={{ padding: '10px 12px', textAlign: 'right', fontWeight: 700, color: '#a78bfa' }}>{fmt(total)}</td>
                                    <td style={{ padding: '10px 12px', textAlign: 'center' }}>{o.shippingEtaDays}d</td>
                                    <td style={{ padding: '10px 12px', textAlign: 'center', color: '#fbbf24', fontSize: '11px' }} title={`${o.sellerRating}/5`}>{stars(o.sellerRating)}</td>
                                    <td style={{ padding: '10px 12px', textAlign: 'center' }}>{o.returnWindowDays}d</td>
                                    <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                                      <span style={{ background: o.inStock ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)', color: o.inStock ? '#34d399' : '#f87171', borderRadius: '4px', padding: '2px 8px', fontSize: '11px' }}>
                                        {o.inStock ? 'In Stock' : 'Out'}
                                      </span>
                                    </td>
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
              </>
            )}
          </div>
        )}

        {/* ── Preferences Tab ── */}
        {activeTab === 'prefs' && (
          <div style={{ maxWidth: '560px' }}>
            <div style={{ fontWeight: 700, fontSize: '18px', marginBottom: '8px' }}>⚙️ Recommendation Weights</div>
            <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px', marginBottom: '24px' }}>
              Adjust how the scoring engine weighs each factor. Weights must sum to 1.0.
            </div>

            {([
              { key: 'price',        label: '💰 Price',         desc: 'Lowest landed cost' },
              { key: 'speed',        label: '⚡ Speed',         desc: 'Fastest delivery ETA' },
              { key: 'rating',       label: '⭐ Seller Rating', desc: 'Trust & quality' },
              { key: 'returnPolicy', label: '↩️ Return Policy', desc: 'Longer return window' },
            ] as const).map(({ key, label, desc }) => (
              <div key={key} style={{ background: 'rgba(255,255,255,0.07)', borderRadius: '12px', padding: '20px', marginBottom: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '14px' }}>{label}</div>
                    <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>{desc}</div>
                  </div>
                  <div style={{ fontWeight: 700, fontSize: '18px', color: '#a78bfa' }}>{Math.round(weights[key] * 100)}%</div>
                </div>
                <input type="range" min="0" max="100" value={Math.round(weights[key] * 100)}
                  onChange={e => updateWeight(key, parseInt(e.target.value) / 100)}
                  style={{ width: '100%', accentColor: '#7c3aed' }}
                />
              </div>
            ))}

            <div style={{ background: totalWeight > 1.001 || totalWeight < 0.999 ? 'rgba(239,68,68,0.15)' : 'rgba(16,185,129,0.15)', border: `1px solid ${totalWeight > 1.001 || totalWeight < 0.999 ? 'rgba(239,68,68,0.4)' : 'rgba(16,185,129,0.4)'}`, borderRadius: '10px', padding: '12px 16px', fontSize: '14px', color: totalWeight > 1.001 || totalWeight < 0.999 ? '#f87171' : '#34d399' }}>
              Total weight: {(totalWeight * 100).toFixed(0)}% {totalWeight > 1.001 || totalWeight < 0.999 ? '⚠️ Adjust sliders to sum to 100%' : '✓ Valid'}
            </div>

            <div style={{ marginTop: '24px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', padding: '20px' }}>
              <div style={{ fontWeight: 600, fontSize: '14px', marginBottom: '16px' }}>🏪 Vendor Preferences</div>
              {VENDORS.map(v => (
                <div key={v.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  <span style={{ fontSize: '20px' }}>{v.logo}</span>
                  <span style={{ flex: 1, fontWeight: 600 }}>{v.name}</span>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button style={{ background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: '6px', padding: '4px 12px', color: '#34d399', cursor: 'pointer', fontSize: '12px' }}>Prefer</button>
                    <button style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '6px', padding: '4px 12px', color: '#f87171', cursor: 'pointer', fontSize: '12px' }}>Block</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
