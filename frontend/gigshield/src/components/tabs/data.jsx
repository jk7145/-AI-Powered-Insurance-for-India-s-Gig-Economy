"use client";

import { useState, useEffect, useRef } from "react";
import { CloudRain, Wind, Car, Activity, CheckCircle, AlertCircle, Zap, Database, Radio } from "lucide-react";

function rand(a, b) { return Math.round(a + Math.random() * (b - a)); }

const SOURCES = [
  { id:"weather", label:"Weather API",  icon:CloudRain, color:"#2a7fa8", endpoint:"openweathermap.org/v3" },
  { id:"aqi",     label:"AQI Feed",     icon:Wind,      color:"#8a5ca8", endpoint:"airvisual.com/v2"      },
  { id:"traffic", label:"Traffic Feed", icon:Car,       color:"#c04a2a", endpoint:"googleapis.com/traffic" },
];

const EVT_TYPES  = ["INGESTED","NORMALIZED","TRIGGER","QUEUED","PROCESSED"];
const ZONES      = ["OMR Sector 4","T.Nagar","Velachery","Guindy","Adyar"];
const EVT_LABELS = ["Rain > 40mm/hr","AQI > 200","Congestion > 80%","Wind > 40km/h","Zone alert fired"];

function makeReading(id) {
  if (id === "weather") {
    const rain = +(Math.random() * 65).toFixed(1);
    return { primary: `${rand(28,40)}°C`, secondary: `Rain: ${rain}mm · Wind: ${rand(5,45)}km/h`, status: rain > 40 ? "warning" : "ok", sparkVal: rand(28,40) };
  }
  if (id === "aqi") {
    const v = rand(60,290);
    return { primary: `AQI ${v}`, secondary: `PM2.5: ${rand(20,150)} · PM10: ${rand(40,190)}`, status: v > 200 ? "danger" : v > 150 ? "warning" : "ok", sparkVal: v };
  }
  const c = rand(20,95);
  return { primary: `${c}%`, secondary: `Congestion · ${rand(0,7)} incidents`, status: c > 75 ? "danger" : c > 50 ? "warning" : "ok", sparkVal: c };
}

function makeLog() {
  const type = EVT_TYPES[Math.floor(Math.random() * EVT_TYPES.length)];
  return {
    id:     `EVT-${rand(1000,9999)}`,
    type,
    source: SOURCES[Math.floor(Math.random() * SOURCES.length)].label,
    zone:   ZONES[Math.floor(Math.random() * ZONES.length)],
    event:  EVT_LABELS[Math.floor(Math.random() * EVT_LABELS.length)],
    ts:     `${rand(0,59)}s ago`,
    trigger: type === "TRIGGER",
  };
}

function Sparkline({ data, color }) {
  const W = 110, H = 34;
  if (!data.length) return null;
  const min = Math.min(...data), max = Math.max(...data), range = (max - min) || 1;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * W;
    const y = H - ((v - min) / range) * (H - 8) - 4;
    return `${x},${y}`;
  }).join(" ");
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H} style={{ display:"block", flexShrink:0 }}>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.7" />
      {data.map((v, i) => {
        const x = (i / (data.length - 1)) * W;
        const y = H - ((v - min) / range) * (H - 8) - 4;
        return i === data.length - 1
          ? <circle key={i} cx={x} cy={y} r="3.5" fill={color} />
          : null;
      })}
    </svg>
  );
}

function SourceCard({ src, reading, hist }) {
  const Icon = src.icon;
  const statusColor = reading.status === "ok" ? "#52b26a" : reading.status === "warning" ? "#d4884a" : "#c04a2a";
  return (
    <div className="soft-card rounded-[1.75rem] p-5 flex flex-col gap-3"
      style={{ transition:"box-shadow 0.2s" }}
      onMouseEnter={e => e.currentTarget.style.boxShadow="0 20px 40px rgba(104,82,63,0.14)"}
      onMouseLeave={e => e.currentTarget.style.boxShadow=""}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="rounded-xl p-2" style={{ background:`${src.color}15` }}>
            <Icon className="h-4 w-4" style={{ color:src.color }} />
          </div>
          <div>
            <p className="text-sm font-semibold" style={{ color:"var(--foreground)" }}>{src.label}</p>
            <p className="text-xs font-mono" style={{ color:"var(--muted)", fontSize:10 }}>{src.endpoint}</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <span style={{ width:7,height:7,borderRadius:"50%",background:"#52b26a",display:"inline-block",
            animation:"liveBlip 1.6s ease-in-out infinite" }} />
          <span className="text-xs" style={{ color:"#3a8c52" }}>live</span>
        </div>
      </div>

      <div className="flex items-end justify-between gap-2">
        <div>
          <p className="text-2xl font-black" style={{ color:statusColor }}>{reading.primary}</p>
          <p className="text-xs mt-0.5" style={{ color:"var(--muted)" }}>{reading.secondary}</p>
        </div>
        <Sparkline data={hist} color={src.color} />
      </div>

      <div className="flex items-center justify-between pt-2" style={{ borderTop:"0.5px solid var(--border)" }}>
        <span className="text-xs" style={{ color:"var(--muted)" }}>Updated just now</span>
        <span className="text-xs px-2 py-0.5 rounded-full font-semibold"
          style={{ background:`${statusColor}15`, color:statusColor }}>
          {reading.status}
        </span>
      </div>
    </div>
  );
}

function PipelineFlow({ epm }) {
  const stages = [
    { label:"Fetch",     icon:Radio,        color:"#2a7fa8", n:epm },
    { label:"Normalize", icon:Activity,     color:"#8a5ca8", n:Math.round(epm*0.93) },
    { label:"Score",     icon:Zap,          color:"#d4884a", n:Math.round(epm*0.86) },
    { label:"Trigger",   icon:AlertCircle,  color:"#c04a2a", n:Math.round(epm*0.21) },
    { label:"Store",     icon:Database,     color:"#52b26a", n:Math.round(epm*0.86) },
  ];
  return (
    <div className="soft-card rounded-[1.75rem] p-5">
      <p className="font-semibold text-sm mb-4" style={{ color:"var(--foreground)" }}>Pipeline flow · events/min</p>
      <div className="flex items-center gap-2 flex-wrap">
        {stages.map((s, i) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="flex items-center gap-2">
              <div className="flex flex-col items-center gap-1 px-3 py-2.5 rounded-2xl"
                style={{ background:`${s.color}10`, border:`1px solid ${s.color}30`, minWidth:64, transition:"transform 0.15s" }}
                onMouseEnter={e => e.currentTarget.style.transform="scale(1.05)"}
                onMouseLeave={e => e.currentTarget.style.transform=""}>
                <Icon className="h-3.5 w-3.5" style={{ color:s.color }} />
                <span className="text-sm font-black" style={{ color:s.color }}>{s.n}</span>
                <span className="text-xs" style={{ color:"var(--muted)" }}>{s.label}</span>
              </div>
              {i < stages.length - 1 && (
                <span style={{ color:"var(--muted)", fontSize:18, opacity:0.5 }}>›</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function DataPipelineTab() {
  const [readings, setReadings] = useState(() => ({
    weather: makeReading("weather"),
    aqi:     makeReading("aqi"),
    traffic: makeReading("traffic"),
  }));
  const [logs,    setLogs]    = useState(() => Array.from({length:12}, makeLog));
  const [epm,     setEpm]     = useState(rand(44,68));
  const [ingested,setIngested]= useState(48320);
  const [triggers,setTriggers]= useState(342);
  const [tick,    setTick]    = useState(0);

  const hists = useRef({
    weather: Array.from({length:12}, () => rand(28,40)),
    aqi:     Array.from({length:12}, () => rand(80,240)),
    traffic: Array.from({length:12}, () => rand(22,90)),
  });

  useEffect(() => {
    const t = setInterval(() => {
      const newR = {
        weather: makeReading("weather"),
        aqi:     makeReading("aqi"),
        traffic: makeReading("traffic"),
      };
      setReadings(newR);
      hists.current.weather = [...hists.current.weather.slice(1), newR.weather.sparkVal];
      hists.current.aqi     = [...hists.current.aqi.slice(1),     newR.aqi.sparkVal];
      hists.current.traffic = [...hists.current.traffic.slice(1), newR.traffic.sparkVal];
      const newEpm = rand(44,72);
      setEpm(newEpm);
      setIngested(p => p + rand(3,9));
      setTriggers(p => p + (Math.random() > 0.6 ? 1 : 0));
      setLogs(prev => [makeLog(), ...prev.slice(0,11)]);
      setTick(t => t + 1);
    }, 2800);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="flex flex-col gap-5">
      <style>{`
        @keyframes liveBlip { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.4;transform:scale(1.4)} }
        @keyframes rowSlide { from{opacity:0;transform:translateX(-8px)} to{opacity:1;transform:translateX(0)} }
        @keyframes fadeSlide { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        .pipe-anim { animation: fadeSlide 0.35s ease forwards; }
      `}</style>

      {/* Header */}
      <div className="soft-card rounded-[1.75rem] p-6 pipe-anim">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between flex-wrap">
          <div>
            <h3 className="section-title flex items-center gap-2">
              <Database className="h-5 w-5" style={{ color:"var(--primary)" }} />
              Data Ingestion &amp; Pipeline
            </h3>
            <p className="section-subtitle mt-1 leading-7">
              Live weather · AQI · traffic feeds · normalization · disruption triggers
            </p>
          </div>
          <span className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-full font-semibold"
            style={{ background:"rgba(82,178,106,0.12)", color:"#3a8c52", border:"1px solid rgba(82,178,106,0.2)" }}>
            <span style={{ width:6,height:6,borderRadius:"50%",background:"#52b26a",display:"inline-block",
              animation:"liveBlip 1.4s ease-in-out infinite" }} />
            3 feeds live · auto-updating
          </span>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-2 gap-3 mt-4 sm:grid-cols-4">
          {[
            { label:"Total ingested",  value:ingested.toLocaleString(), color:"#2a7fa8", icon:Database      },
            { label:"Events/min",      value:epm,                       color:"#8a5ca8", icon:Activity      },
            { label:"Triggers fired",  value:triggers,                  color:"#c04a2a", icon:AlertCircle   },
            { label:"Pipeline uptime", value:"99.4%",                   color:"#52b26a", icon:CheckCircle   },
          ].map(k => {
            const Icon = k.icon;
            return (
              <div key={k.label} className="soft-card rounded-[1.5rem] p-4 flex flex-col gap-1">
                <div className="flex items-center gap-1.5 mb-1">
                  <Icon className="h-3.5 w-3.5" style={{ color:k.color }} />
                  <span className="text-xs uppercase tracking-wider" style={{ color:"var(--muted)" }}>{k.label}</span>
                </div>
                <span className="text-2xl font-black" style={{ color:k.color, transition:"all 0.3s" }}>{k.value}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Feed cards */}
      <div className="grid gap-4 sm:grid-cols-3 pipe-anim" style={{ animationDelay:"0.05s" }}>
        {SOURCES.map(s => (
          <SourceCard key={s.id} src={s} reading={readings[s.id]} hist={hists.current[s.id]} />
        ))}
      </div>

      {/* Pipeline flow */}
      <div className="pipe-anim" style={{ animationDelay:"0.1s" }}>
        <PipelineFlow epm={epm} />
      </div>

      {/* Event log */}
      <div className="soft-card rounded-[1.75rem] p-6 pipe-anim" style={{ animationDelay:"0.15s" }}>
        <div className="flex items-center justify-between mb-4">
          <p className="font-semibold text-sm" style={{ color:"var(--foreground)" }}>Live event log</p>
          <div className="flex items-center gap-1.5 text-xs" style={{ color:"var(--muted)" }}>
            <span style={{ width:6,height:6,borderRadius:"50%",background:"#52b26a",display:"inline-block",
              animation:"liveBlip 1.4s ease-in-out infinite" }} />
            streaming
          </div>
        </div>
        <div style={{ overflowX:"auto" }}>
          <table style={{ width:"100%", fontSize:12, borderCollapse:"collapse" }}>
            <thead>
              <tr style={{ borderBottom:"1px solid var(--border)" }}>
                {["Event ID","Type","Source","Zone","Event","Time"].map(h => (
                  <th key={h} style={{ padding:"6px 12px", textAlign:"left", color:"var(--muted)", fontWeight:500, whiteSpace:"nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {logs.map((log, i) => (
                <tr key={`${log.id}-${tick}-${i}`}
                  style={{
                    borderBottom:"0.5px solid var(--border)",
                    background: log.trigger ? "rgba(192,74,42,0.04)" : "transparent",
                    animation: i === 0 ? "rowSlide 0.3s ease" : "none",
                  }}>
                  <td style={{ padding:"8px 12px", fontFamily:"monospace", color:"var(--muted)", fontSize:11 }}>{log.id}</td>
                  <td style={{ padding:"8px 12px" }}>
                    <span style={{
                      padding:"2px 8px", borderRadius:99, fontSize:11, fontWeight:600,
                      background: log.trigger ? "rgba(192,74,42,0.12)" : "rgba(82,178,106,0.1)",
                      color:      log.trigger ? "#c04a2a" : "#3a8c52",
                    }}>{log.type}</span>
                  </td>
                  <td style={{ padding:"8px 12px", color:"var(--foreground)" }}>{log.source}</td>
                  <td style={{ padding:"8px 12px", color:"var(--muted)" }}>{log.zone}</td>
                  <td style={{ padding:"8px 12px", color:"var(--foreground)" }}>{log.event}</td>
                  <td style={{ padding:"8px 12px", color:"var(--muted)", whiteSpace:"nowrap" }}>{log.ts}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}