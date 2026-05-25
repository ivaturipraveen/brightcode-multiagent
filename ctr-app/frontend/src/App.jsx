import { useState } from "react";
import "./App.css";

const API = "http://localhost:8000";

const TRANSACTION_TYPES = [
  "WIRE_TRANSFER", "CASH_DEPOSIT", "CASH_WITHDRAWAL",
  "CRYPTO_STABLECOIN", "ACH", "SWIFT", "SEPA"
];

const CURRENCIES = ["USD", "EUR", "GBP", "CAD", "JPY", "CHF", "AUD", "USDT", "USDC", "BUSD"];

const defaultPerson = { full_name: "", country: "US", address: "", id_type: "", id_number: "" };

export default function App() {
  const [form, setForm] = useState({
    amount_usd: "",
    original_currency: "USD",
    original_amount: "",
    transaction_type: "WIRE_TRANSFER",
    transaction_date: new Date().toISOString().split("T")[0],
    memo: "",
    is_aggregated: false,
    sender: { ...defaultPerson },
    receiver: { ...defaultPerson },
    sending_institution: { name: "", swift_bic: "", country: "US" },
    receiving_institution: { name: "", swift_bic: "", country: "US" },
  });

  const [result, setResult] = useState(null);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("submit");

  const updateField = (path, value) => {
    setForm(prev => {
      const copy = JSON.parse(JSON.stringify(prev));
      const keys = path.split(".");
      let obj = copy;
      for (let i = 0; i < keys.length - 1; i++) obj = obj[keys[i]];
      obj[keys[keys.length - 1]] = value;
      return copy;
    });
  };

  const submit = async () => {
    setLoading(true);
    try {
      const payload = {
        ...form,
        amount_usd: parseFloat(form.amount_usd),
        original_amount: form.original_amount ? parseFloat(form.original_amount) : undefined,
      };
      const res = await fetch(`${API}/api/transfer/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      setResult(data);
      setActiveTab("result");
    } catch (e) {
      alert("Error: " + e.message);
    } finally {
      setLoading(false);
    }
  };

  const loadReports = async () => {
    const res = await fetch(`${API}/api/ctr/reports`);
    const data = await res.json();
    setReports(data);
    setActiveTab("reports");
  };

  const markFiled = async (ctr_id) => {
    await fetch(`${API}/api/ctr/reports/${ctr_id}/status?new_status=FILED`, { method: "PATCH" });
    loadReports();
  };

  const statusBadge = (status) => {
    const colors = {
      TRIGGERED: "#e74c3c",
      FILED: "#27ae60",
      EXEMPT: "#f39c12",
      BELOW_THRESHOLD: "#7f8c8d",
    };
    return <span className="badge" style={{ background: colors[status] || "#555" }}>{status}</span>;
  };

  return (
    <div className="app">
      {/* Header */}
      <header>
        <div className="header-inner">
          <div className="logo">
            <span className="logo-icon">🏦</span>
            <div>
              <h1>CTR Notification System</h1>
              <p>Currency Transaction Report — FinCEN Form 112</p>
            </div>
          </div>
          <div className="threshold-badge">⚠️ Threshold: $10,000 USD</div>
        </div>
      </header>

      {/* Tabs */}
      <nav className="tabs">
        {[["submit","📤 New Transfer"], ["result","📋 CTR Report"], ["reports","🗂 All Reports"]].map(([id, label]) => (
          <button key={id} className={activeTab === id ? "tab active" : "tab"} onClick={() => id === "reports" ? loadReports() : setActiveTab(id)}>
            {label}
          </button>
        ))}
      </nav>

      <main>
        {/* ── Submit Form ─────────────────────────────────────────── */}
        {activeTab === "submit" && (
          <div className="card">
            <h2>🌐 Global Money Transfer</h2>

            {/* Transaction Details */}
            <section className="section">
              <h3>Transaction Details</h3>
              <div className="grid-2">
                <div className="field">
                  <label>Amount (USD) *</label>
                  <input type="number" placeholder="e.g. 15000.00" value={form.amount_usd}
                    onChange={e => updateField("amount_usd", e.target.value)} />
                  {parseFloat(form.amount_usd) >= 10000 && (
                    <span className="warn">⚠️ CTR will be triggered</span>
                  )}
                </div>
                <div className="field">
                  <label>Transaction Type *</label>
                  <select value={form.transaction_type} onChange={e => updateField("transaction_type", e.target.value)}>
                    {TRANSACTION_TYPES.map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div className="field">
                  <label>Original Currency</label>
                  <select value={form.original_currency} onChange={e => updateField("original_currency", e.target.value)}>
                    {CURRENCIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div className="field">
                  <label>Original Amount</label>
                  <input type="number" placeholder="If non-USD" value={form.original_amount}
                    onChange={e => updateField("original_amount", e.target.value)} />
                </div>
                <div className="field">
                  <label>Transaction Date *</label>
                  <input type="date" value={form.transaction_date}
                    onChange={e => updateField("transaction_date", e.target.value)} />
                </div>
                <div className="field">
                  <label>Memo / Purpose</label>
                  <input type="text" placeholder="Payment description" value={form.memo}
                    onChange={e => updateField("memo", e.target.value)} />
                </div>
              </div>
              <label className="checkbox">
                <input type="checkbox" checked={form.is_aggregated}
                  onChange={e => updateField("is_aggregated", e.target.checked)} />
                &nbsp;Aggregated daily transactions (same person, same day)
              </label>
            </section>

            {/* Sender */}
            <section className="section">
              <h3>👤 Sender</h3>
              <div className="grid-2">
                {[["full_name","Full Name *","text","e.g. John Doe"],["country","Country","text","US"],
                  ["address","Address","text","Street, City, State"],["id_type","ID Type","text","PASSPORT / SSN"],
                  ["id_number","ID Number","text",""]].map(([k, label, type, ph]) => (
                  <div className="field" key={k}>
                    <label>{label}</label>
                    <input type={type} placeholder={ph} value={form.sender[k] || ""}
                      onChange={e => updateField(`sender.${k}`, e.target.value)} />
                  </div>
                ))}
              </div>
            </section>

            {/* Receiver */}
            <section className="section">
              <h3>👤 Receiver</h3>
              <div className="grid-2">
                {[["full_name","Full Name *","text","e.g. Jane Smith"],["country","Country","text","US"],
                  ["address","Address","text","Street, City, State"],["id_type","ID Type","text","PASSPORT / SSN"],
                  ["id_number","ID Number","text",""]].map(([k, label, type, ph]) => (
                  <div className="field" key={k}>
                    <label>{label}</label>
                    <input type={type} placeholder={ph} value={form.receiver[k] || ""}
                      onChange={e => updateField(`receiver.${k}`, e.target.value)} />
                  </div>
                ))}
              </div>
            </section>

            {/* Institutions */}
            <section className="section">
              <h3>🏛 Financial Institutions</h3>
              <div className="grid-2">
                <div>
                  <p className="sub-label">Sending Institution</p>
                  <input placeholder="Bank / Exchange Name" value={form.sending_institution.name}
                    onChange={e => updateField("sending_institution.name", e.target.value)} />
                  <input placeholder="SWIFT / BIC Code" value={form.sending_institution.swift_bic}
                    onChange={e => updateField("sending_institution.swift_bic", e.target.value)} />
                </div>
                <div>
                  <p className="sub-label">Receiving Institution</p>
                  <input placeholder="Bank / Exchange Name" value={form.receiving_institution.name}
                    onChange={e => updateField("receiving_institution.name", e.target.value)} />
                  <input placeholder="SWIFT / BIC Code" value={form.receiving_institution.swift_bic}
                    onChange={e => updateField("receiving_institution.swift_bic", e.target.value)} />
                </div>
              </div>
            </section>

            <button className="btn-primary" onClick={submit} disabled={loading}>
              {loading ? "Processing..." : "📤 Submit Transfer & Generate CTR"}
            </button>
          </div>
        )}

        {/* ── CTR Result ─────────────────────────────────────────── */}
        {activeTab === "result" && result && (
          <div className="card">
            <div className={`ctr-header ${result.status === "TRIGGERED" ? "ctr-alert" : "ctr-ok"}`}>
              <div>
                <h2>{result.status === "TRIGGERED" ? "🚨 CTR NOTIFICATION TRIGGERED" : "✅ No CTR Required"}</h2>
                <p>{result.summary}</p>
              </div>
              {statusBadge(result.status)}
            </div>

            <div className="report-grid">
              <div className="info-block">
                <label>CTR ID</label><p>{result.ctr_id}</p>
              </div>
              <div className="info-block">
                <label>Form Type</label><p>{result.form_type}</p>
              </div>
              <div className="info-block">
                <label>Triggered At</label><p>{new Date(result.triggered_at).toLocaleString()}</p>
              </div>
              <div className="info-block">
                <label>Filing Deadline</label><p className="deadline">{result.filing_deadline}</p>
              </div>
              <div className="info-block">
                <label>Amount</label><p>${result.transaction.amount_usd.toLocaleString()}</p>
              </div>
              <div className="info-block">
                <label>Type</label><p>{result.transaction.transaction_type}</p>
              </div>
            </div>

            {result.alerts.length > 0 && (
              <div className="alerts">
                <h3>Compliance Alerts</h3>
                {result.alerts.map((a, i) => <div className="alert-item" key={i}>{a}</div>)}
              </div>
            )}

            <div className="parties">
              <div className="party-card">
                <h4>👤 Sender</h4>
                <p><strong>{result.transaction.sender.full_name}</strong></p>
                <p>{result.transaction.sender.country}</p>
                {result.transaction.sender.id_type && <p>ID: {result.transaction.sender.id_type} — {result.transaction.sender.id_number}</p>}
              </div>
              <div className="arrow">→</div>
              <div className="party-card">
                <h4>👤 Receiver</h4>
                <p><strong>{result.transaction.receiver.full_name}</strong></p>
                <p>{result.transaction.receiver.country}</p>
                {result.transaction.receiver.id_type && <p>ID: {result.transaction.receiver.id_type} — {result.transaction.receiver.id_number}</p>}
              </div>
            </div>

            {result.status === "TRIGGERED" && (
              <div className="filing-note">
                <strong>📌 Next Steps:</strong> This CTR must be filed electronically with FinCEN via the BSA E-Filing System
                within <strong>15 calendar days</strong> of the transaction date ({result.filing_deadline}).
              </div>
            )}
          </div>
        )}

        {/* ── All Reports ─────────────────────────────────────────── */}
        {activeTab === "reports" && (
          <div className="card">
            <h2>🗂 CTR Report Log ({reports.length} total)</h2>
            {reports.length === 0 ? (
              <p className="empty">No reports yet. Submit a transfer to generate CTR notifications.</p>
            ) : (
              <table className="report-table">
                <thead>
                  <tr>
                    <th>CTR ID</th><th>Date</th><th>Amount (USD)</th>
                    <th>Type</th><th>Sender → Receiver</th><th>Status</th><th>Deadline</th><th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {reports.map(r => (
                    <tr key={r.ctr_id}>
                      <td><code>{r.ctr_id}</code></td>
                      <td>{r.transaction.transaction_date}</td>
                      <td>${r.transaction.amount_usd.toLocaleString()}</td>
                      <td>{r.transaction.transaction_type}</td>
                      <td>{r.transaction.sender.full_name} → {r.transaction.receiver.full_name}</td>
                      <td>{statusBadge(r.status)}</td>
                      <td>{r.filing_deadline}</td>
                      <td>
                        {r.status === "TRIGGERED" && (
                          <button className="btn-small" onClick={() => markFiled(r.ctr_id)}>Mark Filed</button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
