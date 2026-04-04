"use client";

import { useState, useEffect, useCallback } from "react";
import { MapPin, Hexagon, AlertTriangle, Users, Radio, RefreshCw, Info } from "lucide-react";

const HEX_COLS = 13;
const HEX_ROWS = 8;

const ZONE_NAMES = [
  "OMR Sector 4","T.Nagar Central","Velachery Main","Guindy Ind. Belt",
  "Anna Nagar","Adyar Coast","Tambaram East","Porur Junction",
  "Chromepet","Sholinganallur","Perungudi","Mylapore","Nungambakkam",
];

function hexId(c, r) { return `H3-${c.toString(16).toUpperCase().padStart(2,"0")}${r.toString(16).toUpperCase().padStart(2,"0")}`; }

function makeGrid() {
  return Array.from({ length: HEX_ROWS * HEX_COLS }, (_, i) => {
    const col = i % HEX_COLS, row = Math.floor(i / HEX_COLS);
    const rand = Math.random();
    const status = rand < 0.15 ? "disrupted" : rand < 0.28 ? "warning" : rand < 0.38 ? "worker" : "normal";
    return {
      id: hexId(col, row), col, row, status,
      workers: (status === "worker" || status === "disrupted") ? Math.floor(Math.random() * 6) + 1 : 0,
      zone: ZONE_NAMES[Math.floor(Math.random() * ZONE_NAMES.length)],
      aqi: Math.floor(Math.random() * 220) + 50,
      rain: (Math.random() > 0.55 ? (Math.random() * 70).toFixed(1) : "0"),
      severity: Math.random(),
    };
  });
}

const WORKERS = [
  { id:"W-001", name:"Ravi K.",    platform:"Swiggy", col:3,  row:2, active:true  },
  { id:"W-002", name:"Priya S.",   platform:"Zomato", col:7,  row:4, active:true  },
  { id:"W-003", name:"Arjun M.",  platform:"Swiggy", col:5,  row:6, active:false },
  { id:"W-004", name:"Sunita R.", platform:"Dunzo",  col:10, row:3, active:true  },
  { id:"W-005", name:"Deepak T.", platform:"Zomato", col:2,  row:7, active:true  },
  { id:"W-006", name:"Meena P.",  platform:"Swiggy", col:8,  row:1, active:false },
];

const STATUS = {
  disrupted: { fill:"#f3c7c5", stroke:"#c04a2a", label:"Disrupted", textColor:"#c04a2a" },
  warning:   { fill:"#fae8d0", stroke:"#d4884a", label:"Warning",   textColor:"#d4884a" },
  worker:    { fill:"#d5eaf4", stroke:"#2a7fa8", label:"Workers",   textColor:"#2a7fa8" },
  normal:    { fill:"#f0e8dc", stroke:"#c8b09a", label:"Normal",    textColor:"#8a7060" },
};

function HexSVGGrid({ cells, selected, onSelect, workers, tick }) {
  const W = 50, H = 44, OX = 26;
  const svgW = HEX_COLS * W + OX + 8;
  const svgH = HEX_ROWS * H * 0.75 + H * 0.5 + 8;

  function pos(col, row) {
    return {
      x: col * W + (row % 2 === 1 ? OX : 0) + W / 2 + 4,
      y: row * H * 0.75 + H / 2 + 4,
    };
  }

  function hex(cx, cy) {
    const hw = W / 2 - 2, qh = (H - 2) / 4, hh = (H - 2) / 2;
    return `M${cx},${cy-hh} L${cx+hw},${cy-qh} L${cx+hw},${cy+qh} L${cx},${cy+hh} L${cx-hw},${cy+qh} L${cx-hw},${cy-qh}Z`;
  }

  return (
    <svg viewBox={`0 0 ${svgW} ${svgH}`} width="100%" style={{ display:"block", cursor:"default" }}>
      <defs>
        <filter id="hexGlow">
          <feGaussianBlur stdDeviation="2" result="blur"/>
          <feComposite in="SourceGraphic" in2="blur" operator="over"/>
        </filter>
      </defs>

      {cells.map(cell => {
        const { x, y } = pos(cell.col, cell.row);
        const s = STATUS[cell.status];
        const isSel = selected?.id === cell.id;
        const isDisrupted = cell.status === "disrupted";

        return (
          <g key={cell.id} onClick={() => onSelect(isSel ? null : cell)} style={{ cursor:"pointer" }}>
            {/* Pulse ring for disrupted */}
            {isDisrupted && (
              <path d={hex(x, y)} fill="none" stroke="#c04a2a" strokeWidth="3"
                style={{ opacity: 0.3, animation: `hexPulse ${1.5 + cell.severity}s ease-in-out infinite` }} />
            )}
            {/* Main hex */}
            <path d={hex(x, y)}
              fill={isSel ? s.stroke : s.fill}
              stroke={s.stroke}
              strokeWidth={isSel ? 2.5 : 1}
              style={{ transition: "fill 0.2s, stroke-width 0.15s", filter: isSel ? "url(#hexGlow)" : "none" }}
            />
            {/* Worker count */}
            {cell.workers > 0 && (
              <text x={x} y={y + 4} textAnchor="middle" fontSize="10" fontWeight="700"
                fill={isSel ? "#fff" : s.textColor}>
                {cell.workers}
              </text>
            )}
          </g>
        );
      })}

      {/* Worker GPS dots */}
      {workers.map(w => {
        const { x, y } = pos(w.col, w.row);
        const col = w.active ? "#52b26a" : "#b09880";
        return (
          <g key={w.id}>
            {w.active && (
              <circle cx={x} cy={y-10} r="12" fill={col} opacity="0.15"
                style={{ animation: "workerRing 2s ease-in-out infinite" }} />
            )}
            <circle cx={x} cy={y-10} r="6" fill={col} />
            <circle cx={x} cy={y-10} r="3" fill="white" />
          </g>
        );
      })}

      <style>{`
        @keyframes hexPulse { 0%,100%{opacity:0.2;r:0} 50%{opacity:0.5} }
        @keyframes workerRing { 0%,100%{opacity:0.15;transform:scale(1)} 50%{opacity:0.3;transform:scale(1.3)} }
      `}</style>
    </svg>
  );
}

function StatPill({ icon: Icon, label, value, color }) {
  return (
    <div className="soft-card rounded-[1.25rem] px-4 py-3 flex items-center gap-3">
      <div className="rounded-xl p-2" style={{ background:`${color}18` }}>
        <Icon className="h-4 w-4" style={{ color }} />
      </div>
      <div>
        <p className="text-xs" style={{ color:"var(--muted)" }}>{label}</p>
        <p className="text-xl font-black" style={{ color:"var(--foreground)" }}>{value}</p>
      </div>
    </div>
  );
}

export default function GeospatialTab() {
  const [cells,    setCells]    = useState(() => makeGrid());
  const [selected, setSelected] = useState(null);
  const [pulse,    setPulse]    = useState(true);
  const [tick,     setTick]     = useState(0);
  const [ts,       setTs]       = useState(new Date());
  const [refreshing, setRefreshing] = useState(false);

  const disrupted = cells.filter(c => c.status === "disrupted").length;
  const warning   = cells.filter(c => c.status === "warning").length;
  const activeW   = WORKERS.filter(w => w.active).length;
  const atRisk    = cells.filter(c => c.status === "disrupted" && c.workers > 0)
                         .reduce((s, c) => s + c.workers, 0);

  function refresh() {
    setRefreshing(true);
    setTimeout(() => {
      setCells(makeGrid());
      setTs(new Date());
      setTick(t => t + 1);
      setRefreshing(false);
    }, 700);
  }

  useEffect(() => {
    const t = setInterval(refresh, 12000);
    return () => clearInterval(t);
  }, []);

  const recentEvents = [
    { zone:"OMR Sector 4",    type:"Heavy Rain",    sev:"high",   time:"1m ago"  },
    { zone:"T.Nagar Central", type:"Traffic Block", sev:"medium", time:"9m ago"  },
    { zone:"Guindy Ind.",     type:"AQI Spike",     sev:"low",    time:"22m ago" },
    { zone:"Velachery Main",  type:"Zone Shutdown", sev:"high",   time:"35m ago" },
  ];

  return (
    <div className="flex flex-col gap-5">
      <style>{`
        @keyframes fadeSlide { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
        .geo-anim { animation: fadeSlide 0.4s ease forwards; }
      `}</style>

      {/* Header */}
      <div className="soft-card rounded-[1.75rem] p-6 geo-anim">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between flex-wrap">
          <div>
            <h3 className="section-title flex items-center gap-2">
              <Hexagon className="h-5 w-5" style={{ color:"var(--primary)" }} />
              H3 Geospatial Live Map
            </h3>
            <p className="section-subtitle mt-1 leading-7">
              Real-time disruption zones · worker GPS positions · H3 hex grid
            </p>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-xs" style={{ color:"var(--muted)" }}>
              {ts.toLocaleTimeString()}
            </span>
            <button onClick={refresh} disabled={refreshing}
              className="secondary-btn rounded-2xl px-4 py-2 text-sm font-semibold inline-flex items-center gap-2"
              style={{ opacity: refreshing ? 0.6 : 1 }}>
              <RefreshCw className={`h-3 w-3 ${refreshing ? "animate-spin" : ""}`} />
              Refresh grid
            </button>
            <button onClick={() => setPulse(p => !p)}
              className="secondary-btn rounded-2xl px-4 py-2 text-sm font-semibold inline-flex items-center gap-2">
              <Radio className="h-3 w-3" style={{ color: pulse ? "#52b26a" : "var(--muted)" }} />
              {pulse ? "Pulse on" : "Pulse off"}
            </button>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 mt-4 sm:grid-cols-4">
          <StatPill icon={AlertTriangle} label="Disrupted zones" value={disrupted} color="#c04a2a" />
          <StatPill icon={Hexagon}       label="Warning zones"   value={warning}   color="#d4884a" />
          <StatPill icon={Users}         label="Active workers"  value={activeW}   color="#52b26a" />
          <StatPill icon={MapPin}        label="Workers at risk" value={atRisk}    color="#c04a2a" />
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1fr,296px]">
        {/* Map */}
        <div className="soft-card rounded-[1.75rem] p-4 overflow-hidden geo-anim" style={{ animationDelay:"0.05s" }}>
          <div className="flex gap-4 flex-wrap mb-3 px-1">
            {Object.entries(STATUS).map(([key, s]) => (
              <span key={key} className="flex items-center gap-1.5 text-xs" style={{ color:"var(--muted)" }}>
                <span style={{ width:12, height:12, background:s.fill, border:`1.5px solid ${s.stroke}`, borderRadius:3, display:"inline-block" }} />
                {s.label}
              </span>
            ))}
            <span className="flex items-center gap-1.5 text-xs" style={{ color:"var(--muted)" }}>
              <span style={{ width:10, height:10, borderRadius:"50%", background:"#52b26a", display:"inline-block" }} />Active worker
            </span>
          </div>
          <div style={{ overflowX:"auto" }}>
            <HexSVGGrid cells={cells} selected={selected} onSelect={setSelected} workers={WORKERS} tick={tick} />
          </div>
        </div>

        {/* Side panel */}
        <div className="flex flex-col gap-4">
          {/* Cell detail */}
          <div className="soft-card rounded-[1.75rem] p-5 geo-anim" style={{ animationDelay:"0.08s" }}>
            {selected ? (
              <>
                <div className="flex items-center justify-between mb-3">
                  <p className="font-semibold text-sm" style={{ color:"var(--foreground)" }}>Zone detail</p>
                  <span className="text-xs px-3 py-1 rounded-full font-semibold"
                    style={{ background:`${STATUS[selected.status].stroke}18`, color:STATUS[selected.status].stroke }}>
                    {selected.status}
                  </span>
                </div>
                {[
                  { l:"Hex ID",   v:selected.id },
                  { l:"Zone",     v:selected.zone },
                  { l:"Workers",  v:selected.workers || "None" },
                  { l:"AQI",      v:`${selected.aqi} µg/m³` },
                  { l:"Rainfall", v:`${selected.rain} mm/hr` },
                ].map(r => (
                  <div key={r.l} className="flex justify-between py-2"
                    style={{ borderBottom:"0.5px solid var(--border)" }}>
                    <span className="text-xs" style={{ color:"var(--muted)" }}>{r.l}</span>
                    <span className="text-xs font-semibold" style={{ color:"var(--foreground)" }}>{r.v}</span>
                  </div>
                ))}
                <button onClick={() => setSelected(null)}
                  className="mt-3 w-full secondary-btn rounded-xl py-2 text-xs font-semibold">
                  Deselect
                </button>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center gap-2 py-6">
                <Info className="h-7 w-7" style={{ color:"var(--muted)", opacity:0.4 }} />
                <p className="text-xs text-center" style={{ color:"var(--muted)" }}>
                  Click any hex cell to inspect zone data
                </p>
              </div>
            )}
          </div>

          {/* Workers */}
          <div className="soft-card rounded-[1.75rem] p-5 geo-anim" style={{ animationDelay:"0.11s" }}>
            <p className="font-semibold text-sm mb-3" style={{ color:"var(--foreground)" }}>Worker positions</p>
            {WORKERS.map(w => (
              <div key={w.id} className="flex items-center justify-between py-2"
                style={{ borderBottom:"0.5px solid var(--border)" }}>
                <div className="flex items-center gap-2">
                  <span style={{ width:7, height:7, borderRadius:"50%", flexShrink:0, display:"inline-block",
                    background: w.active ? "#52b26a" : "#b09880",
                    animation: w.active ? "workerDot 2s ease-in-out infinite" : "none",
                  }} />
                  <div>
                    <p className="text-xs font-semibold" style={{ color:"var(--foreground)" }}>{w.name}</p>
                    <p className="text-xs" style={{ color:"var(--muted)" }}>{w.platform}</p>
                  </div>
                </div>
                <span className="text-xs font-mono" style={{ color:"var(--muted)" }}>
                  {hexId(w.col, w.row)}
                </span>
              </div>
            ))}
            <style>{`@keyframes workerDot { 0%,100%{opacity:1} 50%{opacity:0.4} }`}</style>
          </div>

          {/* Events */}
          <div className="soft-card rounded-[1.75rem] p-5 geo-anim" style={{ animationDelay:"0.14s" }}>
            <p className="font-semibold text-sm mb-3" style={{ color:"var(--foreground)" }}>Disruption events</p>
            {recentEvents.map((e, i) => (
              <div key={i} className="flex items-start gap-3 py-2" style={{ borderBottom:"0.5px solid var(--border)" }}>
                <span style={{ width:8, height:8, borderRadius:"50%", flexShrink:0, marginTop:3,
                  background: e.sev==="high" ? "#c04a2a" : e.sev==="medium" ? "#d4884a" : "#b0884a",
                  display:"inline-block" }} />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold truncate" style={{ color:"var(--foreground)" }}>{e.zone}</p>
                  <p className="text-xs" style={{ color:"var(--muted)" }}>{e.type}</p>
                </div>
                <span className="text-xs whitespace-nowrap" style={{ color:"var(--muted)" }}>{e.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}