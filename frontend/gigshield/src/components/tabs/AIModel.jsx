"use client";

import { useState, useEffect } from "react";
import {
  Brain,
  TrendingUp,
  ShieldCheck,
  Activity,
  BadgeCheck,
  XCircle,
  ChevronRight,
  Zap,
  Wifi,
  WifiOff,
} from "lucide-react";

const ML_API = "http://127.0.0.1:8000";

// ─── Static demo data (chart + claims list) ───────────────────────────────────
const weeklyPremiumData = [
  { week: "W1", premium: 112, risk: 34 },
  { week: "W2", premium: 98,  risk: 28 },
  { week: "W3", premium: 145, risk: 67 },
  { week: "W4", premium: 130, risk: 52 },
  { week: "W5", premium: 88,  risk: 21 },
  { week: "W6", premium: 162, risk: 78 },
  { week: "W7", premium: 121, risk: 45 },
  { week: "W8", premium: 95,  risk: 31 },
];

const recentClaims = [
  { id: "CLM-4821", worker: "Ravi K.",   zone: "H3-48F2", gps: true,  activity: true,  zoneMatch: true,  verdict: "approved", confidence: 94,
    apiPayload: { claim_id: "CLM-4821", worker_id: "WKR-001", gps_match: 1, activity_drop_pct: 67.4, zone_match: 1, disruption_event_logged: 1, parametric_threshold_met: 1, worker_history_fraud_flag: 0, time_since_disruption_hrs: 3.5, zone_disruption_severity: 82.0 }},
  { id: "CLM-4820", worker: "Priya S.",  zone: "H3-3C1A", gps: true,  activity: false, zoneMatch: true,  verdict: "rejected", confidence: 71,
    apiPayload: { claim_id: "CLM-4820", worker_id: "WKR-002", gps_match: 1, activity_drop_pct: 22.0, zone_match: 1, disruption_event_logged: 1, parametric_threshold_met: 0, worker_history_fraud_flag: 0, time_since_disruption_hrs: 8.0, zone_disruption_severity: 45.0 }},
  { id: "CLM-4819", worker: "Arjun M.", zone: "H3-7D5B", gps: true,  activity: true,  zoneMatch: true,  verdict: "approved", confidence: 97,
    apiPayload: { claim_id: "CLM-4819", worker_id: "WKR-003", gps_match: 1, activity_drop_pct: 80.1, zone_match: 1, disruption_event_logged: 1, parametric_threshold_met: 1, worker_history_fraud_flag: 0, time_since_disruption_hrs: 1.2, zone_disruption_severity: 91.0 }},
  { id: "CLM-4818", worker: "Sunita R.", zone: "H3-22E9", gps: false, activity: false, zoneMatch: false, verdict: "rejected", confidence: 12,
    apiPayload: { claim_id: "CLM-4818", worker_id: "WKR-004", gps_match: 0, activity_drop_pct: 10.0, zone_match: 0, disruption_event_logged: 0, parametric_threshold_met: 0, worker_history_fraud_flag: 1, time_since_disruption_hrs: 48.0, zone_disruption_severity: 12.0 }},
  { id: "CLM-4817", worker: "Deepak T.", zone: "H3-91F7", gps: true,  activity: true,  zoneMatch: false, verdict: "rejected", confidence: 58,
    apiPayload: { claim_id: "CLM-4817", worker_id: "WKR-005", gps_match: 1, activity_drop_pct: 55.0, zone_match: 0, disruption_event_logged: 1, parametric_threshold_met: 0, worker_history_fraud_flag: 0, time_since_disruption_hrs: 12.0, zone_disruption_severity: 38.0 }},
];

const riskFactors = [
  { label: "Traffic disruption",        value: 88, color: "#c04a2a" },
  { label: "Weather severity",          value: 72, color: "#d4884a" },
  { label: "Zone activity drop",        value: 61, color: "#d4884a" },
  { label: "AQI index",                 value: 54, color: "#b0884a" },
  { label: "Earnings variance (hist.)", value: 39, color: "#8a7060" },
];

// ─── StatCard ─────────────────────────────────────────────────────────────────
function StatCard({ icon: Icon, label, value, sub, accentColor }) {
  return (
    <div className="soft-card rounded-[1.5rem] p-5 flex flex-col gap-1">
      <div className="flex items-center gap-2 mb-1">
        <Icon className="h-4 w-4" style={{ color: accentColor || "var(--primary)" }} />
        <span className="text-xs uppercase tracking-wider" style={{ color: "var(--muted)" }}>{label}</span>
      </div>
      <span className="text-3xl font-black tracking-tight" style={{ color: accentColor || "var(--foreground)" }}>
        {value}
      </span>
      {sub && <span className="text-xs leading-5" style={{ color: "var(--muted)" }}>{sub}</span>}
    </div>
  );
}

// ─── Animated feature bar ─────────────────────────────────────────────────────
function FeatureBar({ label, value, color }) {
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setWidth(value), 80);
    return () => clearTimeout(t);
  }, [value]);
  return (
    <div>
      <div className="flex justify-between mb-1">
        <span className="text-sm" style={{ color: "var(--foreground)" }}>{label}</span>
        <span className="text-xs font-semibold" style={{ color }}>{value}%</span>
      </div>
      <div className="h-[6px] rounded-full overflow-hidden" style={{ background: "#ead8c8" }}>
        <div
          className="h-full rounded-full"
          style={{ width: `${width}%`, background: color, transition: "width 1s cubic-bezier(.4,0,.2,1)" }}
        />
      </div>
    </div>
  );
}

// ─── SVG Confidence Gauge ─────────────────────────────────────────────────────
function ConfidenceGauge({ value }) {
  const color = value >= 85 ? "#52b26a" : value >= 60 ? "#d4884a" : "#c04a2a";
  const angle = (value / 100) * 180;
  const rad   = (angle - 180) * (Math.PI / 180);
  const cx = 80, cy = 80, r = 56;
  const nx = cx + r * Math.cos(rad);
  const ny = cy + r * Math.sin(rad);
  return (
    <svg viewBox="0 0 160 100" width="160" height="100">
      <path d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
        fill="none" stroke="#ead8c8" strokeWidth="10" strokeLinecap="round" />
      <path d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${nx} ${ny}`}
        fill="none" stroke={color} strokeWidth="10" strokeLinecap="round"
        style={{ transition: "all 1s ease" }} />
      <line x1={cx} y1={cy} x2={nx} y2={ny} stroke={color} strokeWidth="2" strokeLinecap="round" />
      <circle cx={cx} cy={cy} r="4" fill={color} />
      <text x={cx} y={cy + 16} textAnchor="middle" fontSize="18" fontWeight="700" fill={color}>{value}%</text>
      <text x={cx} y={cy + 30} textAnchor="middle" fontSize="9" fill="#8a7060">confidence</text>
    </svg>
  );
}

// ─── Pure-SVG Bar + Line chart ────────────────────────────────────────────────
function PremiumBarChart() {
  const maxP = Math.max(...weeklyPremiumData.map(d => d.premium));
  const W = 560, H = 180, pL = 36, pR = 16, pT = 14, pB = 28;
  const iW = W - pL - pR;
  const iH = H - pT - pB;
  const step = iW / weeklyPremiumData.length;
  const bW   = 32;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ overflow: "visible" }}>
      {[0, 0.25, 0.5, 0.75, 1].map((t, i) => (
        <g key={i}>
          <line x1={pL} y1={pT + iH * (1 - t)} x2={W - pR} y2={pT + iH * (1 - t)}
            stroke="#ead8c8" strokeWidth="0.5" strokeDasharray="4 4" />
          <text x={pL - 4} y={pT + iH * (1 - t) + 4} textAnchor="end" fontSize="9" fill="#b09880">
            {Math.round(maxP * t)}
          </text>
        </g>
      ))}
      {weeklyPremiumData.map((d, i) => {
        const cx = pL + step * i + step / 2;
        const bh = (d.premium / maxP) * iH;
        return (
          <g key={d.week}>
            <rect x={cx - bW / 2} y={pT + iH - bh} width={bW} height={bh} rx="5" fill="#d4884a" opacity="0.8" />
            <text x={cx} y={H - pB + 14} textAnchor="middle" fontSize="9" fill="#8a7060">{d.week}</text>
          </g>
        );
      })}
      {weeklyPremiumData.map((d, i) => {
        const cx = pL + step * i + step / 2;
        const cy = pT + iH - (d.risk / 100) * iH;
        const nd = weeklyPremiumData[i + 1];
        const nx = nd ? pL + step * (i + 1) + step / 2 : null;
        const ny = nd ? pT + iH - (nd.risk / 100) * iH  : null;
        return (
          <g key={`r-${d.week}`}>
            {nx && <line x1={cx} y1={cy} x2={nx} y2={ny} stroke="#c04a2a" strokeWidth="2" strokeLinecap="round" />}
            <circle cx={cx} cy={cy} r="3.5" fill="#c04a2a" />
          </g>
        );
      })}
    </svg>
  );
}

// ─── Live Predictor (CONNECTED TO REAL ML API) ────────────────────────────────
function LivePredictor({ apiOnline }) {
  const [earnings,    setEarnings]    = useState(18500);
  const [disruptions, setDisruptions] = useState(3);
  const [running,     setRunning]     = useState(false);
  const [result,      setResult]      = useState(null);
  const [error,       setError]       = useState(null);

  async function run() {
    setRunning(true);
    setResult(null);
    setError(null);

    if (apiOnline) {
      // ── REAL API CALL ──
      try {
        const res = await fetch(`${ML_API}/predict/premium`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            disruptions_month:    disruptions,
            avg_weekly_earnings:  earnings,
            aqi_avg:              180,
            weather_severity:     55,
            traffic_score:        70,
            worker_tenure_weeks:  24,
            hex_zone_risk:        0.6,
          }),
        });
        const data = await res.json();
        setResult({
          premium: data.weekly_premium,
          risk:    data.risk_score,
          conf:    data.confidence_pct,
          live:    true,
        });
      } catch (err) {
        setError("ML server unreachable — showing estimated result");
        fallback();
      }
    } else {
      // ── FALLBACK (ML server not running) ──
      fallback();
    }
    setRunning(false);
  }

  function fallback() {
    const eF      = Math.max(0, (25000 - earnings) / 25000) * 60;
    const dF      = disruptions * 12;
    const premium = Math.round(80 + eF + dF);
    const risk    = Math.min(99, Math.round(30 + dF + eF * 0.3));
    const conf    = Math.round(85 + Math.random() * 10);
    setResult({ premium, risk, conf, live: false });
  }

  const riskColor = result
    ? result.risk > 65 ? "#c04a2a" : result.risk > 40 ? "#d4884a" : "#52b26a"
    : "#8a7060";

  return (
    <div className="soft-card rounded-[1.75rem] p-5 flex flex-col gap-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <Zap className="h-4 w-4" style={{ color: "var(--primary)" }} />
          <span className="font-semibold text-sm" style={{ color: "var(--foreground)" }}>
            Live premium predictor
          </span>
        </div>
        {/* API status badge */}
        <span
          className="flex items-center gap-1 text-xs px-3 py-1 rounded-full font-medium"
          style={{
            background: apiOnline ? "rgba(82,178,106,0.12)" : "rgba(192,74,42,0.1)",
            color:      apiOnline ? "#3a8c52" : "#c04a2a",
          }}
        >
          {apiOnline
            ? <><Wifi className="h-3 w-3" /> ML server connected</>
            : <><WifiOff className="h-3 w-3" /> ML server offline · using estimate</>
          }
        </span>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="text-xs mb-2 block" style={{ color: "var(--muted)" }}>
            Past weekly earnings (₹) —{" "}
            <strong style={{ color: "var(--foreground)" }}>₹{earnings.toLocaleString()}</strong>
          </label>
          <input type="range" min="5000" max="40000" step="500"
            value={earnings} onChange={e => setEarnings(+e.target.value)} className="w-full" />
        </div>
        <div>
          <label className="text-xs mb-2 block" style={{ color: "var(--muted)" }}>
            Disruptions last month —{" "}
            <strong style={{ color: "var(--foreground)" }}>{disruptions}</strong>
          </label>
          <input type="range" min="0" max="10" step="1"
            value={disruptions} onChange={e => setDisruptions(+e.target.value)} className="w-full" />
        </div>
      </div>

      <div className="flex items-center gap-4 flex-wrap">
        <button
          onClick={run}
          disabled={running}
          className="primary-btn rounded-2xl px-5 py-2 text-sm font-semibold inline-flex items-center gap-2"
          style={{ opacity: running ? 0.7 : 1 }}
        >
          {running
            ? "Running model…"
            : <><span>Predict premium</span><ChevronRight className="h-3 w-3" /></>
          }
        </button>

        {result && (
          <div className="flex gap-4 flex-wrap items-center">
            <span className="text-sm">
              Premium: <strong style={{ color: "var(--primary)" }}>₹{result.premium}/week</strong>
            </span>
            <span className="text-sm">
              Risk: <strong style={{ color: riskColor }}>{result.risk}/100</strong>
            </span>
            <span className="text-sm">
              Confidence: <strong style={{ color: "var(--muted)" }}>{result.conf}%</strong>
            </span>
            {result.live && (
              <span className="text-xs px-2 py-0.5 rounded-full"
                style={{ background: "rgba(82,178,106,0.12)", color: "#3a8c52" }}>
                live result
              </span>
            )}
          </div>
        )}
      </div>

      {error && (
        <p className="text-xs" style={{ color: "#c04a2a" }}>{error}</p>
      )}
    </div>
  );
}

// ─── Claim Verifier (CONNECTED TO REAL ML API) ────────────────────────────────
function ClaimVerifier({ apiOnline }) {
  const [selectedClaim,  setSelectedClaim]  = useState(recentClaims[0]);
  const [liveResult,     setLiveResult]     = useState(null);
  const [verifying,      setVerifying]      = useState(false);

  // Auto-verify when a claim is selected and API is online
  async function verifyClaim(claim) {
    setSelectedClaim(claim);
    setLiveResult(null);
    if (!apiOnline) return;

    setVerifying(true);
    try {
      const res = await fetch(`${ML_API}/verify/claim`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(claim.apiPayload),
      });
      const data = await res.json();
      setLiveResult(data);
    } catch (err) {
      // silently fall back to static data
    } finally {
      setVerifying(false);
    }
  }

  // Run on first load
  useEffect(() => { verifyClaim(recentClaims[0]); }, [apiOnline]);

  // Use live result if available, else static
  const verdict    = liveResult ? liveResult.verdict    : selectedClaim.verdict;
  const confidence = liveResult ? liveResult.confidence_pct : selectedClaim.confidence;

  const checks = liveResult
    ? Object.entries(liveResult.checks).map(([key, val]) => ({
        label: key.replace(/_/g, " "),
        val,
      }))
    : [
        { label: "GPS in disrupted zone",     val: selectedClaim.gps },
        { label: "Activity drop significant", val: selectedClaim.activity },
        { label: "H3 zone matched",           val: selectedClaim.zoneMatch },
        { label: "Disruption event logged",   val: selectedClaim.verdict === "approved" },
        { label: "Parametric threshold met",  val: selectedClaim.verdict === "approved" },
      ];

  const passed = checks.filter(c => c.val).length;

  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-4 lg:grid-cols-2">

        {/* Claims list */}
        <div className="soft-card rounded-[1.75rem] p-6">
          <div className="flex items-center justify-between mb-4">
            <p className="font-semibold text-sm" style={{ color: "var(--foreground)" }}>
              Recent verifications
            </p>
            <span
              className="flex items-center gap-1 text-xs px-3 py-1 rounded-full font-medium"
              style={{
                background: apiOnline ? "rgba(82,178,106,0.12)" : "rgba(192,74,42,0.1)",
                color:      apiOnline ? "#3a8c52" : "#c04a2a",
              }}
            >
              {apiOnline ? <><Wifi className="h-3 w-3" /> live</> : <><WifiOff className="h-3 w-3" /> demo</>}
            </span>
          </div>
          <div className="flex flex-col gap-2">
            {recentClaims.map(c => (
              <button
                key={c.id}
                onClick={() => verifyClaim(c)}
                className="flex items-center justify-between rounded-2xl px-4 py-3 text-left w-full transition-colors"
                style={{
                  background: selectedClaim.id === c.id ? "var(--accent-soft)" : "transparent",
                  border: `1px solid ${selectedClaim.id === c.id ? "#e8cdb8" : "var(--border)"}`,
                }}
              >
                <div>
                  <p className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>{c.id}</p>
                  <p className="text-xs mt-0.5" style={{ color: "var(--muted)" }}>
                    {c.worker} · {c.zone}
                  </p>
                </div>
                <span
                  className="text-xs font-semibold px-3 py-1 rounded-full"
                  style={{
                    background: c.verdict === "approved" ? "rgba(82,178,106,0.12)" : "rgba(192,74,42,0.1)",
                    color:      c.verdict === "approved" ? "#3a8c52" : "#c04a2a",
                  }}
                >
                  {c.verdict}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Breakdown panel */}
        <div className="soft-card rounded-[1.75rem] p-6 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <p className="font-semibold text-sm" style={{ color: "var(--foreground)" }}>
              Verification breakdown · {selectedClaim.id}
            </p>
            {verifying && (
              <span className="text-xs animate-pulse" style={{ color: "var(--muted)" }}>
                verifying…
              </span>
            )}
            {liveResult && !verifying && (
              <span className="text-xs px-2 py-0.5 rounded-full"
                style={{ background: "rgba(82,178,106,0.12)", color: "#3a8c52" }}>
                live result
              </span>
            )}
          </div>

          <div className="flex flex-col gap-2">
            {checks.map(item => (
              <div
                key={item.label}
                className="flex items-center justify-between rounded-2xl px-4 py-3"
                style={{ background: "var(--accent-soft)" }}
              >
                <span className="text-sm capitalize" style={{ color: "var(--foreground)" }}>{item.label}</span>
                {item.val
                  ? <BadgeCheck className="h-4 w-4" style={{ color: "#52b26a" }} />
                  : <XCircle   className="h-4 w-4" style={{ color: "#c04a2a" }} />
                }
              </div>
            ))}
          </div>

          <div className="flex flex-col items-center gap-1">
            <ConfidenceGauge value={confidence} />
            <span className="text-xs" style={{ color: "var(--muted)" }}>
              {passed}/5 parametric checks passed
            </span>
          </div>

          {liveResult?.reason && (
            <p className="text-xs px-3 py-2 rounded-xl" style={{ background: "var(--accent-soft)", color: "var(--muted)" }}>
              {liveResult.reason}
            </p>
          )}

          <div
            className="rounded-2xl px-4 py-3 text-center text-sm font-semibold"
            style={{
              background: verdict === "approved" ? "rgba(82,178,106,0.1)" : "rgba(192,74,42,0.08)",
              border: `1px solid ${verdict === "approved" ? "rgba(82,178,106,0.3)" : "rgba(192,74,42,0.25)"}`,
              color:  verdict === "approved" ? "#3a8c52" : "#c04a2a",
            }}
          >
            {verdict === "approved"
              ? "Claim approved — payout triggered"
              : "Claim rejected — insufficient evidence"
            }
          </div>
        </div>
      </div>

      {/* Confidence distribution */}
      <div className="soft-card rounded-[1.75rem] p-6">
        <p className="font-semibold text-sm mb-4" style={{ color: "var(--foreground)" }}>
          Verification confidence distribution · 847 total claims
        </p>
        <div className="flex flex-col gap-3">
          {[
            { label: "High confidence (85–100%)", count: 412, color: "#52b26a" },
            { label: "Medium confidence (60–84%)", count: 234, color: "#d4884a" },
            { label: "Low confidence (0–59%)",     count: 201, color: "#c04a2a" },
          ].map(b => (
            <FeatureBar
              key={b.label}
              label={`${b.label} — ${b.count} claims`}
              value={Math.round((b.count / 847) * 100)}
              color={b.color}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Root component ────────────────────────────────────────────────────────────
export default function MLInsightsTab() {
  const [activeModel, setActiveModel] = useState("premium");
  const [apiOnline,   setApiOnline]   = useState(false);

  // Ping ML server on mount to check if it's running
  useEffect(() => {
    fetch(`${ML_API}/docs`, { method: "GET" })
      .then(() => setApiOnline(true))
      .catch(() => setApiOnline(false));
  }, []);

  return (
    <div className="flex flex-col gap-6">

      {/* ── Header card ── */}
      <div className="soft-card rounded-[1.75rem] p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between flex-wrap">
          <div>
            <h3 className="section-title flex items-center gap-2">
              <Brain className="h-5 w-5" style={{ color: "var(--primary)" }} />
              AI &amp; ML Insights
            </h3>
            <p className="section-subtitle mt-2 leading-7">
              Premium prediction model · claim verification engine · risk intelligence
            </p>
          </div>
          <div className="flex rounded-2xl overflow-hidden" style={{ border: "1px solid var(--border)" }}>
            {[
              { key: "premium", label: "Premium Model"  },
              { key: "claims",  label: "Claim Verifier" },
            ].map(m => (
              <button
                key={m.key}
                onClick={() => setActiveModel(m.key)}
                className="px-4 py-2 text-sm font-medium transition-colors"
                style={{
                  background: activeModel === m.key ? "var(--primary)" : "transparent",
                  color:      activeModel === m.key ? "#fff" : "var(--muted)",
                }}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mt-5 sm:grid-cols-4">
          <StatCard icon={Activity}    label="Model accuracy"  value="93%"  sub="1,240 training samples" accentColor="#d4884a" />
          <StatCard icon={BadgeCheck}  label="Claims verified" value="847"  sub="This month"             accentColor="#52b26a" />
          <StatCard icon={TrendingUp}  label="Avg. premium"    value="₹119" sub="Weekly, gig workers"    accentColor="var(--primary)" />
          <StatCard icon={ShieldCheck} label="Fraud blocked"   value="34"   sub="Rejected this month"    accentColor="#c04a2a" />
        </div>
      </div>

      {/* ── MODEL 1: Premium Prediction ── */}
      {activeModel === "premium" && (
        <div className="flex flex-col gap-4">
          <div className="soft-card rounded-[1.75rem] p-6">
            <div className="flex items-center justify-between mb-5 flex-wrap gap-2">
              <span className="font-semibold text-sm" style={{ color: "var(--foreground)" }}>
                Weekly premium vs. risk score (8 weeks)
              </span>
              <div className="flex gap-4 text-xs" style={{ color: "var(--muted)" }}>
                <span className="flex items-center gap-1">
                  <span style={{ width: 10, height: 10, borderRadius: 3, background: "#d4884a", display: "inline-block" }} />
                  Premium (₹)
                </span>
                <span className="flex items-center gap-1">
                  <span style={{ width: 16, height: 2, background: "#c04a2a", display: "inline-block" }} />
                  Risk score
                </span>
              </div>
            </div>
            <PremiumBarChart />
          </div>

          <LivePredictor apiOnline={apiOnline} />

          <div className="soft-card rounded-[1.75rem] p-6">
            <p className="font-semibold text-sm mb-4" style={{ color: "var(--foreground)" }}>
              Feature importance · risk drivers
            </p>
            <div className="flex flex-col gap-3">
              {riskFactors.map(f => (
                <FeatureBar key={f.label} label={f.label} value={f.value} color={f.color} />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── MODEL 2: Claim Verification ── */}
      {activeModel === "claims" && (
        <ClaimVerifier apiOnline={apiOnline} />
      )}
    </div>
  );
}