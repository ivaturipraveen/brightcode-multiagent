import { useEffect, useState, useCallback } from 'react'

const API = import.meta.env.VITE_API_URL || 'https://openclaw-multiagent.onrender.com'

// ── Types ────────────────────────────────────────────────────────────────────
interface Scenario {
  id: number
  name: string
  description: string
  status: 'draft' | 'active' | 'archived'
  current_headcount: number
  projected_volume: number
  aht_seconds: number
  shrinkage_pct: number
  service_level_target: number
  service_level_seconds: number
  shift_hours: number
  required_agents: number
  utilization_pct: number
  gap: number
  est_service_level: number
  created_at: string
}

interface LiveResult {
  required_agents: number
  utilization_pct: number
  gap: number
  est_service_level: number
  traffic_intensity: number
}

const BLANK: Omit<Scenario, 'id' | 'created_at' | 'required_agents' | 'utilization_pct' | 'gap' | 'est_service_level'> = {
  name: '',
  description: '',
  status: 'draft',
  current_headcount: 60,
  projected_volume: 800,
  aht_seconds: 280,
  shrinkage_pct: 20,
  service_level_target: 80,
  service_level_seconds: 20,
  shift_hours: 8,
}

const STATUS_BADGE: Record<string, string> = {
  active: 'bg-green-100 text-green-700',
  draft: 'bg-yellow-100 text-yellow-700',
  archived: 'bg-slate-100 text-slate-500',
}

function GapChip({ gap }: { gap: number }) {
  if (gap > 0) return <span className="font-semibold text-red-600">▲ {gap} understaffed</span>
  if (gap < 0) return <span className="font-semibold text-blue-600">▼ {Math.abs(gap)} overstaffed</span>
  return <span className="font-semibold text-green-600">✓ Balanced</span>
}

function SLBar({ value }: { value: number }) {
  const color = value >= 80 ? 'bg-green-500' : value >= 60 ? 'bg-yellow-400' : 'bg-red-500'
  return (
    <div className="w-full bg-slate-100 rounded-full h-2 mt-1">
      <div className={`${color} h-2 rounded-full transition-all`} style={{ width: `${Math.min(value, 100)}%` }} />
    </div>
  )
}

// ── Main page ────────────────────────────────────────────────────────────────
export function WFMPage() {
  const [scenarios, setScenarios] = useState<Scenario[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editId, setEditId] = useState<number | null>(null)
  const [form, setForm] = useState({ ...BLANK })
  const [liveResult, setLiveResult] = useState<LiveResult | null>(null)
  const [liveLoading, setLiveLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [toast, setToast] = useState<string | null>(null)

  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(null), 3000)
  }

  const load = async () => {
    setLoading(true)
    const r = await fetch(`${API}/wfm/scenarios`)
    if (r.ok) setScenarios(await r.json())
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  // Debounced live compute
  const computeLive = useCallback(
    (() => {
      let t: ReturnType<typeof setTimeout>
      return (f: typeof BLANK) => {
        clearTimeout(t)
        t = setTimeout(async () => {
          setLiveLoading(true)
          try {
            const r = await fetch(`${API}/wfm/compute`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(f),
            })
            if (r.ok) setLiveResult(await r.json())
          } finally {
            setLiveLoading(false)
          }
        }, 300)
      }
    })(),
    []
  )

  const setField = (key: string, val: string | number) => {
    const next = { ...form, [key]: val }
    setForm(next)
    computeLive(next)
  }

  const openNew = () => {
    setForm({ ...BLANK })
    setLiveResult(null)
    setEditId(null)
    setShowForm(true)
    computeLive({ ...BLANK })
  }

  const openEdit = (s: Scenario) => {
    const { id, created_at, required_agents, utilization_pct, gap, est_service_level, ...rest } = s
    setForm(rest)
    setEditId(id)
    setLiveResult({ required_agents, utilization_pct, gap, est_service_level, traffic_intensity: 0 })
    setShowForm(true)
  }

  const save = async () => {
    if (!form.name.trim()) { alert('Name is required'); return }
    setSaving(true)
    const url = editId ? `${API}/wfm/scenarios/${editId}` : `${API}/wfm/scenarios`
    const method = editId ? 'PUT' : 'POST'
    const r = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
    if (r.ok) {
      setShowForm(false)
      await load()
      showToast(editId ? 'Scenario updated.' : 'Scenario saved.')
    }
    setSaving(false)
  }

  const del = async (id: number, name: string) => {
    if (!confirm(`Delete "${name}"?`)) return
    await fetch(`${API}/wfm/scenarios/${id}`, { method: 'DELETE' })
    setScenarios(s => s.filter(x => x.id !== id))
    showToast('Deleted.')
  }

  const filtered = statusFilter === 'all' ? scenarios : scenarios.filter(s => s.status === statusFilter)

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Toast */}
      {toast && (
        <div className="fixed top-4 right-4 bg-slate-800 text-white text-sm px-4 py-2 rounded-lg shadow-lg z-50 animate-fade-in">
          {toast}
        </div>
      )}

      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-5 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">📊 WFM What-If Planner</h1>
          <p className="text-sm text-slate-500 mt-0.5">Model staffing scenarios using Erlang C — without touching production.</p>
        </div>
        <button
          onClick={openNew}
          className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition"
        >
          + New Scenario
        </button>
      </div>

      {/* Filter tabs */}
      <div className="px-6 pt-4 flex gap-2">
        {['all', 'active', 'draft', 'archived'].map(s => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`text-xs font-medium px-3 py-1.5 rounded-full capitalize transition ${
              statusFilter === s ? 'bg-indigo-600 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {s}
          </button>
        ))}
        <span className="ml-auto text-xs text-slate-400 self-center">{filtered.length} scenarios</span>
      </div>

      {/* Scenario cards */}
      <div className="px-6 py-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {loading && <div className="col-span-3 text-center py-16 text-slate-400">Loading…</div>}
        {!loading && filtered.length === 0 && (
          <div className="col-span-3 text-center py-16 text-slate-400">No scenarios yet. Create one above.</div>
        )}
        {filtered.map(s => (
          <div key={s.id} className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm hover:shadow-md transition">
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-slate-800 truncate">{s.name}</h3>
                {s.description && <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{s.description}</p>}
              </div>
              <span className={`ml-2 shrink-0 text-xs font-medium px-2 py-0.5 rounded-full capitalize ${STATUS_BADGE[s.status]}`}>
                {s.status}
              </span>
            </div>

            {/* Key metrics */}
            <div className="grid grid-cols-2 gap-2 mt-3 text-sm">
              <Metric label="Current HC" value={s.current_headcount} />
              <Metric label="Required" value={s.required_agents} highlight />
              <Metric label="Volume/day" value={s.projected_volume} />
              <Metric label="AHT (s)" value={s.aht_seconds} />
              <Metric label="Shrinkage" value={`${s.shrinkage_pct}%`} />
              <Metric label="Utilization" value={`${s.utilization_pct}%`} />
            </div>

            {/* SL bar */}
            <div className="mt-3">
              <div className="flex justify-between text-xs text-slate-500">
                <span>Est. Service Level</span>
                <span className="font-medium">{s.est_service_level}%</span>
              </div>
              <SLBar value={s.est_service_level} />
            </div>

            <div className="mt-3 text-sm">
              <GapChip gap={s.gap} />
            </div>

            <div className="mt-4 flex gap-2">
              <button
                onClick={() => openEdit(s)}
                className="flex-1 text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 py-1.5 rounded-lg transition"
              >
                Edit
              </button>
              <button
                onClick={() => del(s.id, s.name)}
                className="text-xs text-red-400 hover:text-red-600 px-3 py-1.5 rounded-lg hover:bg-red-50 transition"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Slide-over form */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 z-40 flex justify-end" onClick={() => setShowForm(false)}>
          <div
            className="bg-white w-full max-w-lg h-full overflow-y-auto shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
              <h2 className="font-bold text-slate-800">{editId ? 'Edit Scenario' : 'New Scenario'}</h2>
              <button onClick={() => setShowForm(false)} className="text-slate-400 hover:text-slate-600 text-xl leading-none">×</button>
            </div>

            <div className="px-6 py-5 space-y-4">
              {/* Name + status */}
              <div>
                <label className="label">Scenario Name</label>
                <input className="input" value={form.name} onChange={e => setField('name', e.target.value)} placeholder="e.g. Black Friday Peak" />
              </div>
              <div>
                <label className="label">Description</label>
                <textarea className="input" rows={2} value={form.description} onChange={e => setField('description', e.target.value)} placeholder="Optional notes…" />
              </div>
              <div>
                <label className="label">Status</label>
                <select className="input" value={form.status} onChange={e => setField('status', e.target.value)}>
                  <option value="draft">Draft</option>
                  <option value="active">Active</option>
                  <option value="archived">Archived</option>
                </select>
              </div>

              <hr className="border-slate-100" />
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Inputs</p>

              <Slider label="Current Headcount" field="current_headcount" value={form.current_headcount} min={1} max={500} step={1} setField={setField} />
              <Slider label="Projected Volume / day" field="projected_volume" value={form.projected_volume} min={10} max={5000} step={10} setField={setField} />
              <Slider label="Avg Handle Time (seconds)" field="aht_seconds" value={form.aht_seconds} min={30} max={1800} step={10} setField={setField} />
              <Slider label="Shrinkage %" field="shrinkage_pct" value={form.shrinkage_pct} min={0} max={50} step={0.5} setField={setField} />
              <Slider label="Service Level Target %" field="service_level_target" value={form.service_level_target} min={50} max={99} step={1} setField={setField} />
              <Slider label="SL Threshold (seconds)" field="service_level_seconds" value={form.service_level_seconds} min={5} max={120} step={5} setField={setField} />
              <Slider label="Shift Length (hours)" field="shift_hours" value={form.shift_hours} min={4} max={12} step={0.5} setField={setField} />

              {/* Live result panel */}
              {liveResult && (
                <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 mt-2">
                  <p className="text-xs font-semibold text-indigo-500 uppercase tracking-wide mb-3">
                    Live Preview {liveLoading ? '⟳' : ''}
                  </p>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <ResultBox label="Required Agents" value={liveResult.required_agents} big />
                    <ResultBox label="Gap" value={<GapChip gap={liveResult.gap} />} big />
                    <ResultBox label="Utilization" value={`${liveResult.utilization_pct}%`} />
                    <ResultBox label="Traffic (Erlangs)" value={liveResult.traffic_intensity} />
                  </div>
                  <div className="mt-3">
                    <div className="flex justify-between text-xs text-indigo-600">
                      <span>Est. Service Level</span>
                      <span className="font-semibold">{liveResult.est_service_level}%</span>
                    </div>
                    <SLBar value={liveResult.est_service_level} />
                  </div>
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  onClick={save}
                  disabled={saving}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-medium py-2.5 rounded-lg transition text-sm"
                >
                  {saving ? 'Saving…' : editId ? 'Update Scenario' : 'Save Scenario'}
                </button>
                <button onClick={() => setShowForm(false)} className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm transition">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ── Small helpers ────────────────────────────────────────────────────────────
function Metric({ label, value, highlight }: { label: string; value: any; highlight?: boolean }) {
  return (
    <div className="bg-slate-50 rounded-lg px-2 py-1.5">
      <div className="text-xs text-slate-400">{label}</div>
      <div className={`font-semibold text-sm ${highlight ? 'text-indigo-700' : 'text-slate-800'}`}>{value}</div>
    </div>
  )
}

function ResultBox({ label, value, big }: { label: string; value: any; big?: boolean }) {
  return (
    <div className="bg-white rounded-lg px-3 py-2 border border-indigo-100">
      <div className="text-xs text-indigo-400">{label}</div>
      <div className={`font-bold ${big ? 'text-lg text-indigo-800' : 'text-sm text-indigo-700'}`}>{value}</div>
    </div>
  )
}

function Slider({ label, field, value, min, max, step, setField }: {
  label: string; field: string; value: number; min: number; max: number; step: number
  setField: (k: string, v: number) => void
}) {
  return (
    <div>
      <div className="flex justify-between mb-1">
        <label className="label mb-0">{label}</label>
        <span className="text-xs font-semibold text-indigo-700">{value}</span>
      </div>
      <input
        type="range" min={min} max={max} step={step} value={value}
        onChange={e => setField(field, parseFloat(e.target.value))}
        className="w-full accent-indigo-600"
      />
      <div className="flex justify-between text-xs text-slate-300 mt-0.5">
        <span>{min}</span><span>{max}</span>
      </div>
    </div>
  )
}
