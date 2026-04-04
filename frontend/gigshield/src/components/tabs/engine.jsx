"use client";

import { useState } from "react";
import { Wallet, BadgeCheck, XCircle, Clock, RefreshCw, ShieldCheck, CreditCard, Zap, TrendingUp } from "lucide-react";

const INITIAL_CLAIMS = [
  { id:"CLM-4821", worker:"Ravi K.",    zone:"OMR Sector 4",      type:"Heavy Rain",    amount:1200, status:"APPROVED",   payout:"UPI",  ts:"04 Apr 10:31", checks:5, conf:94 },
  { id:"CLM-4820", worker:"Priya S.",   zone:"Velachery Main",    type:"Traffic Block", amount:650,  status:"PENDING",    payout:"—",    ts:"04 Apr 09:47", checks:3, conf:71 },
  { id:"CLM-4819", worker:"Arjun M.", zone:"T.Nagar Central",    type:"Zone Shutdown", amount:1500, status:"APPROVED",   payout:"Bank", ts:"03 Apr 16:02", checks:5, conf:97 },
  { id:"CLM-4818", worker:"Sunita R.", zone:"Guindy Ind. Belt",  type:"AQI Spike",     amount:900,  status:"REJECTED",   payout:"—",    ts:"03 Apr 14:15", checks:1, conf:12 },
  { id:"CLM-4817", worker:"Deepak T.", zone:"Anna Nagar",        type:"Heavy Rain",    amount:1100, status:"APPROVED",   payout:"UPI",  ts:"02 Apr 08:50", checks:5, conf:91 },
  { id:"CLM-4816", worker:"Meena P.",  zone:"Adyar Coast",       type:"Traffic Block", amount:750,  status:"REJECTED",   payout:"—",    ts:"01 Apr 17:33", checks:2, conf:38 },
  { id:"CLM-4815", worker:"Karthik S.",zone:"Sholinganallur",    type:"Zone Shutdown", amount:1300, status:"APPROVED",   payout:"UPI",  ts:"31 Mar 11:20", checks:5, conf:88 },
  { id:"CLM-4814", worker:"Ananya R.", zone:"Porur Junction",    type:"AQI Spike",     amount:800,  status:"PROCESSING", payout:"—",    ts:"30 Mar 09:05", checks:4, conf:79 },
];

const INITIAL_TXNS = [
  { id:"TXN-9901", claim:"CLM-4821", worker:"Ravi K.",    amount:1200, method:"UPI",  ts:"04 Apr 10:32" },
  { id:"TXN-9900", claim:"CLM-4819", worker:"Arjun M.", amount:1500, method:"Bank", ts:"03 Apr 16:04" },
  { id:"TXN-9899", claim:"CLM-4817", worker:"Deepak T.", amount:1100, method:"UPI",  ts:"02 Apr 08:51" },
  { id:"TXN-9898", claim:"CLM-4815", worker:"Karthik S.",amount:1300, method:"UPI",  ts:"31 Mar 11:21" },
];

const STATUS_META = {
  APPROVED:   { color:"#3a8c52", bg:"rgba(82,178,106,0.12)",  icon:BadgeCheck  },
  REJECTED:   { color:"#c04a2a", bg:"rgba(192,74,42,0.10)",   icon:XCircle     },
  PENDING:    { color:"#d4884a", bg:"rgba(212,136,74,0.12)",  icon:Clock       },
  PROCESSING: { color:"#2a7fa8", bg:"rgba(42,127,168,0.12)",  icon:RefreshCw   },
};

const CHECK_LABELS = [
  "GPS in disrupted zone",
  "Activity drop significant",
  "H3 zone matched",
  "Disruption event logged",
  "Parametric threshold met",
];

function CheckDots({ count, total = 5 }) {
  return (
    <div className="flex gap-1">
      {Array.from({ length: total }).map((_, i) => (
        <span key={i} style={{
          width:9, height:9, borderRadius:2, display:"inline-block", flexShrink:0,
          background: i < count ? "#52b26a" : "#ead8c8",
          transition:"background 0.3s ease",
        }} />
      ))}
    </div>
  );
}

function PayoutButton({ claim, onPaid }) {
  const [state, setState] = useState("idle"); // idle | paying | done

  if (!["APPROVED","PROCESSING"].includes(claim.status) || state === "done") {
    if (state === "done") {
      return (
        <div className="rounded-2xl px-4 py-3 text-center text-sm font-semibold"
          style={{ background:"rgba(82,178,106,0.1)", border:"1px solid rgba(82,178,106,0.3)", color:"#3a8c52",
            animation:"popIn 0.3s ease" }}>
          ✓ ₹{claim.amount.toLocaleString()} sent via UPI
        </div>
      );
    }
    return null;
  }

  return (
    <button
      onClick={() => {
        setState("paying");
        setTimeout(() => { setState("done"); onPaid(); }, 1400);
      }}
      disabled={state === "paying"}
      className="primary-btn w-full rounded-2xl px-4 py-3 text-sm font-semibold flex items-center justify-center gap-2"
      style={{ opacity: state === "paying" ? 0.75 : 1 }}>
      {state === "paying"
        ? <><RefreshCw className="h-4 w-4 animate-spin" />Processing…</>
        : <><Zap className="h-4 w-4" />Simulate payout · ₹{claim.amount.toLocaleString()}</>
      }
    </button>
  );
}

function ClaimDetailPanel({ claim, onClose, onPaid }) {
  const meta = STATUS_META[claim.status];
  const Icon = meta.icon;
  const checks = CHECK_LABELS.map((label, i) => ({ label, val: i < claim.checks }));

  return (
    <div className="soft-card rounded-[1.75rem] p-6 flex flex-col gap-4"
      style={{ animation:"slideIn 0.25s ease" }}>
      <div className="flex items-center justify-between">
        <p className="font-semibold text-sm" style={{ color:"var(--foreground)" }}>
          {claim.id} · detail
        </p>
        <button onClick={onClose} className="secondary-btn rounded-xl px-3 py-1 text-xs font-semibold">
          ✕ close
        </button>
      </div>

      {/* Info rows */}
      <div className="flex flex-col">
        {[
          { l:"Worker",   v:claim.worker },
          { l:"Type",     v:claim.type   },
          { l:"Zone",     v:claim.zone   },
          { l:"Amount",   v:`₹${claim.amount.toLocaleString()}` },
          { l:"Filed",    v:claim.ts     },
          { l:"Confidence", v:`${claim.conf}%` },
        ].map(r => (
          <div key={r.l} className="flex justify-between py-2" style={{ borderBottom:"0.5px solid var(--border)" }}>
            <span className="text-xs" style={{ color:"var(--muted)" }}>{r.l}</span>
            <span className="text-xs font-semibold" style={{ color:"var(--foreground)" }}>{r.v}</span>
          </div>
        ))}
      </div>

      {/* 5-point checks */}
      <div>
        <p className="text-xs mb-2" style={{ color:"var(--muted)" }}>5-point parametric verification</p>
        <div className="flex flex-col gap-1.5">
          {checks.map(c => (
            <div key={c.label} className="flex items-center justify-between rounded-xl px-3 py-2"
              style={{ background:"var(--accent-soft)" }}>
              <span className="text-xs" style={{ color:"var(--foreground)" }}>{c.label}</span>
              {c.val
                ? <BadgeCheck className="h-3.5 w-3.5" style={{ color:"#52b26a" }} />
                : <XCircle   className="h-3.5 w-3.5" style={{ color:"#c04a2a" }} />
              }
            </div>
          ))}
        </div>
      </div>

      {/* Confidence bar */}
      <div>
        <div className="flex justify-between mb-1">
          <span className="text-xs" style={{ color:"var(--muted)" }}>Model confidence</span>
          <span className="text-xs font-bold" style={{ color: claim.conf >= 80 ? "#3a8c52" : claim.conf >= 55 ? "#d4884a" : "#c04a2a" }}>
            {claim.conf}%
          </span>
        </div>
        <div className="h-2 rounded-full overflow-hidden" style={{ background:"#ead8c8" }}>
          <div className="h-full rounded-full"
            style={{ width:`${claim.conf}%`, transition:"width 0.8s ease",
              background: claim.conf >= 80 ? "#52b26a" : claim.conf >= 55 ? "#d4884a" : "#c04a2a" }} />
        </div>
      </div>

      {/* Status */}
      <div className="flex items-center gap-2 rounded-2xl px-4 py-3"
        style={{ background:meta.bg, border:`1px solid ${meta.color}30` }}>
        <Icon className="h-4 w-4" style={{ color:meta.color }} />
        <span className="text-sm font-semibold" style={{ color:meta.color }}>
          {claim.status === "APPROVED"   ? "Approved — eligible for payout"
          :claim.status === "REJECTED"   ? "Rejected — criteria not met"
          :claim.status === "PROCESSING" ? "Processing — verification ongoing"
          :                               "Pending — awaiting review"}
        </span>
      </div>

      <PayoutButton claim={claim} onPaid={onPaid} />
    </div>
  );
}

export default function ClaimsEngineTab() {
  const [claims,   setClaims]   = useState(INITIAL_CLAIMS);
  const [txns,     setTxns]     = useState(INITIAL_TXNS);
  const [selected, setSelected] = useState(null);
  const [filter,   setFilter]   = useState("ALL");
  const [totalPaid,setTotalPaid]= useState(INITIAL_TXNS.reduce((s,t) => s+t.amount, 0));
  const [newTxnId, setNewTxnId] = useState(null);

  const approved = claims.filter(c => c.status === "APPROVED").length;
  const rejected = claims.filter(c => c.status === "REJECTED").length;
  const pending  = claims.filter(c => ["PENDING","PROCESSING"].includes(c.status)).length;
  const pct      = Math.round((approved / claims.length) * 100);
  const filtered = filter === "ALL" ? claims : claims.filter(c => c.status === filter);

  function handlePaid() {
    if (!selected) return;
    const amount = selected.amount;
    const id = `TXN-${9902 + txns.length}`;
    const newTxn = {
      id, claim:selected.id, worker:selected.worker, amount,
      method:"UPI",
      ts: new Date().toLocaleString("en-IN",{day:"2-digit",month:"short",hour:"2-digit",minute:"2-digit"}),
    };
    setTxns(prev => [newTxn, ...prev]);
    setTotalPaid(prev => prev + amount);
    setNewTxnId(id);
    setTimeout(() => setNewTxnId(null), 2000);
    setClaims(prev => prev.map(c => c.id === selected.id ? {...c, status:"APPROVED", payout:"UPI"} : c));
  }

  return (
    <div className="flex flex-col gap-5">
      <style>{`
        @keyframes fadeSlide { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        @keyframes slideIn   { from{opacity:0;transform:translateX(10px)} to{opacity:1;transform:translateX(0)} }
        @keyframes popIn     { from{opacity:0;transform:scale(0.95)} to{opacity:1;transform:scale(1)} }
        @keyframes txnSlide  { from{opacity:0;transform:translateX(-10px)} to{opacity:1;transform:translateX(0)} }
        .claims-anim { animation: fadeSlide 0.35s ease forwards; }
      `}</style>

      {/* Header */}
      <div className="soft-card rounded-[1.75rem] p-6 claims-anim">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between flex-wrap">
          <div>
            <h3 className="section-title flex items-center gap-2">
              <Wallet className="h-5 w-5" style={{ color:"var(--primary)" }} />
              Claims Engine &amp; Payout System
            </h3>
            <p className="section-subtitle mt-1 leading-7">
              Parametric trigger logic · 5-point verification · instant payout simulation
            </p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 mt-4 sm:grid-cols-4">
          {[
            { label:"Approved",       value:approved,   color:"#52b26a", icon:BadgeCheck  },
            { label:"Rejected",       value:rejected,   color:"#c04a2a", icon:XCircle     },
            { label:"Pending",        value:pending,    color:"#d4884a", icon:Clock       },
            { label:"Paid out",       value:`₹${(totalPaid/1000).toFixed(1)}k`, color:"var(--primary)", icon:Wallet },
          ].map(k => {
            const Icon = k.icon;
            return (
              <div key={k.label} className="soft-card rounded-[1.5rem] p-4 flex flex-col gap-1">
                <div className="flex items-center gap-1.5 mb-1">
                  <Icon className="h-3.5 w-3.5" style={{ color:k.color }} />
                  <span className="text-xs uppercase tracking-wider" style={{ color:"var(--muted)" }}>{k.label}</span>
                </div>
                <span className="text-2xl font-black" style={{ color:k.color }}>{k.value}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Approval bar */}
      <div className="soft-card rounded-[1.75rem] p-5 claims-anim" style={{ animationDelay:"0.05s" }}>
        <div className="flex justify-between mb-2">
          <span className="text-sm font-semibold" style={{ color:"var(--foreground)" }}>Overall approval rate</span>
          <span className="text-sm font-black" style={{ color:"#52b26a" }}>{pct}%</span>
        </div>
        <div className="h-3 rounded-full overflow-hidden" style={{ background:"#ead8c8" }}>
          <div className="h-full rounded-full" style={{
            width:`${pct}%`, background:"linear-gradient(90deg,#52b26a,#3a8c52)", transition:"width 1s ease",
          }} />
        </div>
        <div className="flex justify-between mt-1.5">
          <span className="text-xs" style={{ color:"#3a8c52" }}>{approved} approved</span>
          <span className="text-xs" style={{ color:"#c04a2a" }}>{rejected} rejected</span>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1fr,320px]">
        {/* Table side */}
        <div className="flex flex-col gap-4">
          {/* Filter chips */}
          <div className="flex gap-2 flex-wrap">
            {["ALL","APPROVED","PENDING","PROCESSING","REJECTED"].map(s => (
              <button key={s} onClick={() => setFilter(s)}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold transition-all"
                style={{
                  background: filter === s ? "var(--primary)" : "var(--accent-soft)",
                  color:      filter === s ? "#fff" : "var(--muted)",
                  border:     filter === s ? "none" : "1px solid var(--border)",
                  transform:  filter === s ? "scale(1.04)" : "",
                }}>
                {s}
              </button>
            ))}
          </div>

          {/* Table */}
          <div className="soft-card rounded-[1.75rem] overflow-hidden claims-anim" style={{ animationDelay:"0.1s" }}>
            <div style={{ overflowX:"auto" }}>
              <table style={{ width:"100%", fontSize:12, borderCollapse:"collapse" }}>
                <thead>
                  <tr style={{ borderBottom:"1px solid var(--border)" }}>
                    {["Claim ID","Worker","Type","Zone","Amount","Checks","Status"].map(h => (
                      <th key={h} style={{ padding:"11px 14px", textAlign:"left", color:"var(--muted)", fontWeight:500, whiteSpace:"nowrap" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(c => {
                    const meta = STATUS_META[c.status];
                    const Icon = meta.icon;
                    const isSel = selected?.id === c.id;
                    return (
                      <tr key={c.id}
                        onClick={() => setSelected(isSel ? null : c)}
                        style={{
                          borderBottom:"0.5px solid var(--border)",
                          background: isSel ? "var(--accent-soft)" : "transparent",
                          cursor:"pointer", transition:"background 0.15s",
                        }}
                        onMouseEnter={e => { if (!isSel) e.currentTarget.style.background = "#f9f3ee"; }}
                        onMouseLeave={e => { if (!isSel) e.currentTarget.style.background = "transparent"; }}>
                        <td style={{ padding:"10px 14px", fontFamily:"monospace", color:"var(--muted)", fontSize:11 }}>{c.id}</td>
                        <td style={{ padding:"10px 14px", fontWeight:600, color:"var(--foreground)" }}>{c.worker}</td>
                        <td style={{ padding:"10px 14px", color:"var(--muted)" }}>{c.type}</td>
                        <td style={{ padding:"10px 14px", color:"var(--muted)" }}>{c.zone}</td>
                        <td style={{ padding:"10px 14px", fontWeight:700, color:"var(--foreground)" }}>₹{c.amount.toLocaleString()}</td>
                        <td style={{ padding:"10px 14px" }}><CheckDots count={c.checks} /></td>
                        <td style={{ padding:"10px 14px" }}>
                          <span className="flex items-center gap-1 w-fit px-2 py-1 rounded-full text-xs font-semibold"
                            style={{ background:meta.bg, color:meta.color }}>
                            <Icon className="h-3 w-3" />{c.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right panel */}
        <div className="flex flex-col gap-4">
          {selected ? (
            <ClaimDetailPanel
              claim={selected}
              onClose={() => setSelected(null)}
              onPaid={handlePaid}
            />
          ) : (
            <div className="soft-card rounded-[1.75rem] p-6 flex flex-col items-center justify-center gap-2 claims-anim"
              style={{ minHeight:200 }}>
              <ShieldCheck className="h-8 w-8" style={{ color:"var(--muted)", opacity:0.35 }} />
              <p className="text-sm text-center" style={{ color:"var(--muted)" }}>
                Click any row to inspect and simulate payout
              </p>
            </div>
          )}

          {/* Transaction log */}
          <div className="soft-card rounded-[1.75rem] p-5 claims-anim" style={{ animationDelay:"0.1s" }}>
            <div className="flex items-center gap-2 mb-4">
              <CreditCard className="h-4 w-4" style={{ color:"var(--primary)" }} />
              <p className="font-semibold text-sm" style={{ color:"var(--foreground)" }}>Transaction history</p>
            </div>
            {txns.map((t, i) => (
              <div key={t.id} className="flex items-center justify-between py-2.5"
                style={{
                  borderBottom: i < txns.length-1 ? "0.5px solid var(--border)" : "none",
                  animation: t.id === newTxnId ? "txnSlide 0.4s ease" : "none",
                }}>
                <div className="flex items-center gap-2">
                  <div className="rounded-xl p-1.5" style={{ background:"rgba(82,178,106,0.12)" }}>
                    <BadgeCheck className="h-3.5 w-3.5" style={{ color:"#3a8c52" }} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold" style={{ color:"var(--foreground)" }}>{t.worker}</p>
                    <p className="text-xs" style={{ color:"var(--muted)" }}>{t.claim} · {t.method}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-black" style={{ color:"#3a8c52" }}>+₹{t.amount.toLocaleString()}</p>
                  <p className="text-xs" style={{ color:"var(--muted)" }}>{t.ts}</p>
                </div>
              </div>
            ))}
            <div className="mt-3 pt-3 flex justify-between" style={{ borderTop:"1px solid var(--border)" }}>
              <span className="text-xs font-semibold" style={{ color:"var(--muted)" }}>Total disbursed</span>
              <span className="text-base font-black" style={{ color:"var(--foreground)", transition:"all 0.3s" }}>
                ₹{totalPaid.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}