"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  BadgeCheck,
  BellRing,
  ChartNoAxesColumn,
  CloudRain,
  MapPinned,
  ShieldCheck,
  Wallet,
  Route,
  UserRound,
  Shield,
  Sparkles,
  Activity,
  TriangleAlert
} from "lucide-react";
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";
import DashboardTab from "@/components/tabs/DashboardTab";
import ClaimsTab from "@/components/tabs/ClaimsTab";
import PremiumTab from "@/components/tabs/PremiumTab";
import AlertsTab from "@/components/tabs/AlertsTab";
import PlaceholderTab from "@/components/tabs/PlaceholderTab";
import { api, setAuthToken } from "@/lib/api";

const initialRegisterForm = {
  fullName: "",
  email: "",
  phone: "",
  city: "",
  platform: "",
  password: ""
};

const mockWorker = {
  id: "demo-worker-1",
  fullName: "Ravi Kumar",
  email: "ravi@gigshield.demo",
  phone: "9876543210",
  city: "Chennai",
  platform: "Swiggy",
  coveragePlan: "STANDARD",
  weeklyPremium: 149
};

const mockClaims = [
  {
    id: "c1",
    disruptionType: "Heavy Rain",
    zone: "OMR Sector 4",
    amount: 1200,
    status: "APPROVED",
    createdAt: "2026-04-01T10:30:00.000Z"
  },
  {
    id: "c2",
    disruptionType: "Traffic Blockage",
    zone: "Velachery Main Road",
    amount: 650,
    status: "PENDING",
    createdAt: "2026-03-29T09:45:00.000Z"
  },
  {
    id: "c3",
    disruptionType: "AQI Spike",
    zone: "Guindy Industrial Belt",
    amount: 900,
    status: "REJECTED",
    createdAt: "2026-03-20T14:10:00.000Z"
  },
  {
    id: "c4",
    disruptionType: "Zone Shutdown",
    zone: "T Nagar Central",
    amount: 1500,
    status: "APPROVED",
    createdAt: "2026-03-12T16:00:00.000Z"
  }
];

const mockAlerts = [
  {
    id: "a1",
    title: "Heavy rain warning in OMR delivery zones",
    description:
      "Localized rainfall intensity has crossed disruption threshold. Active workers in nearby mapped zones may be eligible for coverage-based protection.",
    severity: "high",
    status: "Active"
  },
  {
    id: "a2",
    title: "Traffic congestion spike near Velachery corridor",
    description:
      "Major route slowdown detected from traffic feed inputs. Delivery completion rates may be affected during the next few hours.",
    severity: "medium",
    status: "Monitoring"
  },
  {
    id: "a3",
    title: "AQI increase detected in Guindy industrial region",
    description:
      "Air quality is approaching unsafe thresholds for prolonged delivery activity in affected blocks.",
    severity: "low",
    status: "Monitoring"
  }
];

function HexCell({ className = "", tone = "normal", children }) {
  const tones = {
    normal: "bg-[#fff8f1] border-[#e8d7c6]",
    muted: "bg-[#f7eee5] border-[#ead8c8]",
    danger: "bg-[#f3c7c5] border-[#e1a6a3]",
    safe: "bg-[#dcebdd] border-[#bdd4bf]"
  };
  return (
    <div
      className={`absolute flex h-16 w-[4.5rem] items-center justify-center border shadow-sm ${tones[tone]} ${className}`}
      style={{ clipPath: "polygon(25% 6%, 75% 6%, 100% 50%, 75% 94%, 25% 94%, 0 50%)" }}
    >
      {children}
    </div>
  );
}

/* ─── Hero Illustration ─────────────────────────────────────────────────── */
function HeroIllustration() {
  return (
    <svg
      width="100%"
      viewBox="0 0 680 820"
      xmlns="http://www.w3.org/2000/svg"
      style={{ borderRadius: "2.4rem", overflow: "hidden", display: "block" }}
    >
      <defs>
        <clipPath id="roundedMain">
          <rect x="0" y="0" width="680" height="820" rx="38" />
        </clipPath>
      </defs>

      {/* Background */}
      <rect width="680" height="820" fill="#f5ece0" rx="38" />

      {/* City block pattern */}
      <g opacity="0.13">
        <rect x="30" y="110" width="120" height="70" rx="8" fill="#c4a882" />
        <rect x="170" y="90" width="80" height="90" rx="8" fill="#c4a882" />
        <rect x="270" y="120" width="100" height="60" rx="8" fill="#c4a882" />
        <rect x="390" y="100" width="90" height="80" rx="8" fill="#c4a882" />
        <rect x="500" y="115" width="110" height="65" rx="8" fill="#c4a882" />
        <rect x="80" y="72" width="60" height="38" rx="6" fill="#b89672" />
        <rect x="200" y="68" width="45" height="22" rx="5" fill="#b89672" />
        <rect x="330" y="78" width="50" height="42" rx="6" fill="#b89672" />
        <rect x="450" y="70" width="40" height="30" rx="5" fill="#b89672" />
        <rect x="0" y="190" width="680" height="24" fill="#b89672" />
        <rect x="0" y="192" width="680" height="2" fill="#cbb08e" />
      </g>

      {/* Skyline silhouette */}
      <g opacity="0.09" fill="#7a5c40">
        <rect x="20" y="60" width="18" height="130" /><rect x="12" y="80" width="34" height="110" />
        <rect x="50" y="100" width="14" height="90" /><rect x="70" y="50" width="22" height="140" />
        <rect x="100" y="70" width="30" height="120" /><rect x="140" y="90" width="16" height="100" />
        <rect x="162" y="55" width="26" height="135" /><rect x="200" y="80" width="18" height="110" />
        <rect x="228" y="65" width="32" height="125" /><rect x="270" y="85" width="20" height="105" />
        <rect x="300" y="50" width="24" height="140" /><rect x="340" y="78" width="16" height="112" />
        <rect x="365" y="60" width="28" height="130" /><rect x="405" y="82" width="18" height="108" />
        <rect x="434" y="45" width="30" height="145" /><rect x="476" y="72" width="20" height="118" />
        <rect x="508" y="55" width="26" height="135" /><rect x="546" y="88" width="16" height="102" />
        <rect x="574" y="62" width="28" height="128" /><rect x="614" y="78" width="20" height="112" />
        <rect x="645" y="50" width="30" height="140" />
      </g>

      {/* Road */}
      <rect x="0" y="498" width="680" height="60" fill="#e0cebc" />
      <rect x="0" y="500" width="680" height="4" fill="#cbb8a4" />
      <rect x="20" y="525" width="60" height="6" rx="3" fill="#c4aa90" opacity="0.5" />
      <rect x="120" y="525" width="60" height="6" rx="3" fill="#c4aa90" opacity="0.5" />
      <rect x="220" y="525" width="60" height="6" rx="3" fill="#c4aa90" opacity="0.5" />
      <rect x="320" y="525" width="60" height="6" rx="3" fill="#c4aa90" opacity="0.5" />
      <rect x="420" y="525" width="60" height="6" rx="3" fill="#c4aa90" opacity="0.5" />
      <rect x="520" y="525" width="60" height="6" rx="3" fill="#c4aa90" opacity="0.5" />
      <rect x="620" y="525" width="55" height="6" rx="3" fill="#c4aa90" opacity="0.5" />

      {/* Ground */}
      <rect x="0" y="555" width="680" height="265" fill="#ede0d0" />

      {/* Motion lines */}
      <g opacity="0.18" stroke="#b07a50" strokeLinecap="round">
        <line x1="60" y1="490" x2="160" y2="490" strokeWidth="2.5" />
        <line x1="40" y1="504" x2="150" y2="504" strokeWidth="1.5" />
        <line x1="70" y1="516" x2="155" y2="516" strokeWidth="1" />
        <line x1="30" y1="475" x2="110" y2="475" strokeWidth="1" />
        <line x1="55" y1="462" x2="120" y2="462" strokeWidth="0.8" />
      </g>

      {/* ── Rear wheel ── */}
      <circle cx="248" cy="518" r="42" fill="none" stroke="#4a3525" strokeWidth="9" />
      <circle cx="248" cy="518" r="28" fill="none" stroke="#6b4c35" strokeWidth="3" />
      <circle cx="248" cy="518" r="8" fill="#4a3525" />
      <g stroke="#4a3525" strokeWidth="2" opacity="0.6">
        <line x1="248" y1="478" x2="248" y2="558" />
        <line x1="208" y1="518" x2="288" y2="518" />
        <line x1="220" y1="490" x2="276" y2="546" />
        <line x1="220" y1="546" x2="276" y2="490" />
      </g>

      {/* ── Front wheel ── */}
      <circle cx="440" cy="518" r="42" fill="none" stroke="#4a3525" strokeWidth="9" />
      <circle cx="440" cy="518" r="28" fill="none" stroke="#6b4c35" strokeWidth="3" />
      <circle cx="440" cy="518" r="8" fill="#4a3525" />
      <g stroke="#4a3525" strokeWidth="2" opacity="0.6">
        <line x1="440" y1="478" x2="440" y2="558" />
        <line x1="400" y1="518" x2="480" y2="518" />
        <line x1="412" y1="490" x2="468" y2="546" />
        <line x1="412" y1="546" x2="468" y2="490" />
      </g>

      {/* ── Frame ── */}
      <g fill="none" stroke="#b86a2a" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="290,500 330,430 400,500" />
        <line x1="330" y1="430" x2="248" y2="510" />
        <line x1="330" y1="430" x2="440" y2="490" />
        <line x1="330" y1="430" x2="318" y2="480" />
        <line x1="400" y1="500" x2="440" y2="490" />
      </g>
      <g fill="none" stroke="#d4884a" strokeWidth="4" strokeLinecap="round">
        <line x1="332" y1="432" x2="398" y2="498" />
      </g>

      {/* Handlebar */}
      <line x1="395" y1="430" x2="430" y2="425" stroke="#3d2a1a" strokeWidth="7" strokeLinecap="round" />
      <circle cx="430" cy="424" r="5" fill="#3d2a1a" />

      {/* Seat */}
      <rect x="300" y="420" width="50" height="10" rx="5" fill="#3d2a1a" />

      {/* Engine block */}
      <rect x="310" y="460" width="60" height="32" rx="8" fill="#c47030" />
      <rect x="318" y="466" width="44" height="20" rx="5" fill="#d4894a" />
      <rect x="322" y="470" width="36" height="12" rx="3" fill="#b85e22" />

      {/* ── Delivery box ── */}
      <rect x="246" y="390" width="96" height="76" rx="10" fill="#c04a2a" />
      <rect x="252" y="396" width="84" height="64" rx="8" fill="#d45530" />
      <rect x="284" y="390" width="6" height="76" rx="3" fill="#a83a1e" opacity="0.7" />
      <rect x="246" y="422" width="96" height="6" rx="3" fill="#a83a1e" opacity="0.7" />
      <rect x="262" y="406" width="64" height="38" rx="6" fill="white" opacity="0.15" />
      <text x="294" y="421" textAnchor="middle" fontFamily="system-ui,sans-serif" fontWeight="700" fontSize="10" fill="white">SWIGGY</text>
      <text x="294" y="435" textAnchor="middle" fontFamily="system-ui,sans-serif" fontSize="8" fill="white" opacity="0.85">EXPRESS</text>

      {/* ── Rider legs ── */}
      <path d="M340 445 Q325 470 315 490" stroke="#3d2a1a" strokeWidth="14" strokeLinecap="round" fill="none" />
      <ellipse cx="312" cy="494" rx="16" ry="8" fill="#2a1a0e" transform="rotate(-10 312 494)" />
      <path d="M345 448 Q338 475 342 498" stroke="#3d2a1a" strokeWidth="13" strokeLinecap="round" fill="none" />
      <ellipse cx="345" cy="500" rx="14" ry="7" fill="#2a1a0e" />

      {/* ── Rider arms ── */}
      <path d="M370 415 Q390 420 405 428" stroke="#e87f2e" strokeWidth="13" strokeLinecap="round" fill="none" />
      <path d="M365 418 Q384 430 402 432" stroke="#d96820" strokeWidth="8" strokeLinecap="round" fill="none" />
      <circle cx="408" cy="430" r="10" fill="#2a1a0e" />

      {/* ── Rider torso ── */}
      <ellipse cx="358" cy="420" rx="28" ry="36" fill="#e87f2e" transform="rotate(-20 358 420)" />
      <ellipse cx="356" cy="418" rx="20" ry="28" fill="#d96820" transform="rotate(-20 356 418)" />

      {/* ── Rider head ── */}
      <circle cx="366" cy="388" r="24" fill="#f5c49a" />

      {/* ── Helmet ── */}
      <path d="M344 386 Q346 360 366 355 Q386 360 390 382 Q385 376 366 374 Q347 376 344 386Z" fill="#c04a2a" />
      <path d="M344 386 Q342 395 345 400 Q349 396 366 395 Q380 396 385 400 Q390 396 390 386Z" fill="#d45530" />
      <path d="M348 390 Q366 386 384 390 Q382 398 366 400 Q350 398 348 390Z" fill="#4a8fc4" opacity="0.6" />
      <path d="M358 360 Q370 358 376 365 Q372 360 366 358 Q362 358 358 360Z" fill="#f5a020" opacity="0.8" />
      <ellipse cx="343" cy="392" rx="6" ry="8" fill="#e8a878" />

      {/* ── Floating card 1: Coverage Active ── */}
      <rect x="28" y="220" width="190" height="90" rx="16" fill="white" opacity="0.93" />
      <rect x="28" y="220" width="190" height="90" rx="16" fill="none" stroke="#ead8c4" strokeWidth="1" />
      <circle cx="52" cy="244" r="6" fill="#52b26a" />
      <text x="66" y="249" fontFamily="system-ui,sans-serif" fontSize="11" fill="#8a7060">Coverage</text>
      <text x="44" y="273" fontFamily="system-ui,sans-serif" fontWeight="700" fontSize="20" fill="#2d1f14">Active</text>
      <rect x="44" y="282" width="82" height="17" rx="8" fill="#e6f4ea" />
      <text x="85" y="295" textAnchor="middle" fontFamily="system-ui,sans-serif" fontSize="10" fill="#3a8c52">Standard Plan</text>
      <text x="44" y="305" fontFamily="system-ui,sans-serif" fontSize="10" fill="#b09880">₹149 / week</text>

      {/* ── Floating card 2: Protected Earnings ── */}
      <rect x="462" y="210" width="192" height="100" rx="16" fill="white" opacity="0.93" />
      <rect x="462" y="210" width="192" height="100" rx="16" fill="none" stroke="#ead8c4" strokeWidth="1" />
      <text x="480" y="238" fontFamily="system-ui,sans-serif" fontSize="11" fill="#8a7060">Protected earnings</text>
      <text x="480" y="268" fontFamily="system-ui,sans-serif" fontWeight="700" fontSize="26" fill="#2d1f14">₹2,700</text>
      <rect x="480" y="283" width="12" height="14" rx="3" fill="#d4884a" />
      <rect x="496" y="278" width="12" height="19" rx="3" fill="#d4884a" />
      <rect x="512" y="275" width="12" height="22" rx="3" fill="#c04a2a" />
      <rect x="528" y="272" width="12" height="25" rx="3" fill="#c04a2a" />
      <rect x="544" y="269" width="12" height="28" rx="3" fill="#9e3a1e" />
      <text x="568" y="295" fontFamily="system-ui,sans-serif" fontSize="11" fill="#52b26a">↑ 12%</text>
      <text x="480" y="305" fontFamily="system-ui,sans-serif" fontSize="10" fill="#b09880">this week vs last</text>

      {/* ── Floating card 3: Alert badge ── */}
      <rect x="494" y="352" width="160" height="74" rx="14" fill="#fff3ef" opacity="0.96" />
      <rect x="494" y="352" width="160" height="74" rx="14" fill="none" stroke="#f0c8b8" strokeWidth="1" />
      <path d="M514 378 L520 365 L526 378 Z" fill="#e05030" />
      <circle cx="520" cy="381" r="1.5" fill="#e05030" />
      <line x1="520" y1="371" x2="520" y2="378" stroke="#e05030" strokeWidth="1.5" strokeLinecap="round" />
      <text x="534" y="375" fontFamily="system-ui,sans-serif" fontSize="11" fill="#8a4030">High Alert</text>
      <text x="514" y="392" fontFamily="system-ui,sans-serif" fontWeight="600" fontSize="11" fill="#2d1f14">OMR Sector 4</text>
      <text x="514" y="410" fontFamily="system-ui,sans-serif" fontSize="10" fill="#8a7060">Heavy rain · active zone</text>

      {/* ── Floating card 4: Last Claim ── */}
      <rect x="28" y="342" width="162" height="74" rx="14" fill="white" opacity="0.93" />
      <rect x="28" y="342" width="162" height="74" rx="14" fill="none" stroke="#ead8c4" strokeWidth="1" />
      <text x="46" y="368" fontFamily="system-ui,sans-serif" fontSize="11" fill="#8a7060">Last claim payout</text>
      <text x="46" y="394" fontFamily="system-ui,sans-serif" fontWeight="700" fontSize="22" fill="#2d1f14">₹1,200</text>
      <rect x="46" y="402" width="62" height="5" rx="2.5" fill="#52b26a" opacity="0.45" />

      {/* ── Route dotted path ── */}
      <path d="M60 560 Q180 545 300 552 Q380 558 490 548 Q570 542 640 556"
        stroke="#c04a2a" strokeWidth="2" strokeDasharray="8 5" strokeLinecap="round" fill="none" opacity="0.35" />
      <circle cx="60" cy="560" r="6" fill="#52b26a" opacity="0.7" />
      <circle cx="640" cy="556" r="6" fill="#c04a2a" opacity="0.7" />

      {/* ── Stats row ── */}
      <rect x="28" y="590" width="190" height="82" rx="16" fill="white" opacity="0.88" />
      <rect x="28" y="590" width="190" height="82" rx="16" fill="none" stroke="#ead8c4" strokeWidth="1" />
      <text x="47" y="618" fontFamily="system-ui,sans-serif" fontSize="11" fill="#8a7060">Claims processed</text>
      <text x="47" y="648" fontFamily="system-ui,sans-serif" fontWeight="700" fontSize="28" fill="#2d1f14">24</text>
      <text x="85" y="648" fontFamily="system-ui,sans-serif" fontSize="11" fill="#52b26a">approved</text>
      <text x="47" y="664" fontFamily="system-ui,sans-serif" fontSize="10" fill="#8a7060">this month</text>

      <rect x="245" y="590" width="190" height="82" rx="16" fill="white" opacity="0.88" />
      <rect x="245" y="590" width="190" height="82" rx="16" fill="none" stroke="#ead8c4" strokeWidth="1" />
      <text x="264" y="618" fontFamily="system-ui,sans-serif" fontSize="11" fill="#8a7060">Disruptions tracked</text>
      <text x="264" y="648" fontFamily="system-ui,sans-serif" fontWeight="700" fontSize="28" fill="#2d1f14">08</text>
      <text x="302" y="648" fontFamily="system-ui,sans-serif" fontSize="11" fill="#d4884a">alerts</text>
      <text x="264" y="664" fontFamily="system-ui,sans-serif" fontSize="10" fill="#8a7060">active zones</text>

      <rect x="462" y="590" width="190" height="82" rx="16" fill="white" opacity="0.88" />
      <rect x="462" y="590" width="190" height="82" rx="16" fill="none" stroke="#ead8c4" strokeWidth="1" />
      <text x="480" y="618" fontFamily="system-ui,sans-serif" fontSize="11" fill="#8a7060">Coverage status</text>
      <text x="480" y="648" fontFamily="system-ui,sans-serif" fontWeight="700" fontSize="22" fill="#2d1f14">Live</text>
      <circle cx="540" cy="643" r="9" fill="#52b26a" opacity="0.18" />
      <circle cx="540" cy="643" r="5" fill="#52b26a" />
      <text x="480" y="664" fontFamily="system-ui,sans-serif" fontSize="10" fill="#8a7060">real-time monitoring</text>

      {/* ── Zone chips row ── */}
      <text x="28" y="712" fontFamily="system-ui,sans-serif" fontSize="10" fill="#8a7060" letterSpacing="0.08em">ACTIVE ZONES</text>
      {/* Chip: OMR */}
      <g transform="translate(28, 722)">
        <path d="M18 0 L36 10 L36 30 L18 40 L0 30 L0 10 Z" fill="#f0d4c4" stroke="#e0c0a8" strokeWidth="1" />
        <text x="18" y="24" textAnchor="middle" fontFamily="system-ui,sans-serif" fontSize="8" fill="#7a5c40">OMR</text>
      </g>
      {/* Chip: T.Ngr */}
      <g transform="translate(80, 722)">
        <path d="M18 0 L36 10 L36 30 L18 40 L0 30 L0 10 Z" fill="#fde0d8" stroke="#f0b8a8" strokeWidth="1" />
        <text x="18" y="24" textAnchor="middle" fontFamily="system-ui,sans-serif" fontSize="8" fill="#c04030">T.Ngr</text>
      </g>
      {/* Chip: Velch */}
      <g transform="translate(132, 722)">
        <path d="M18 0 L36 10 L36 30 L18 40 L0 30 L0 10 Z" fill="#f5ece0" stroke="#ead8c4" strokeWidth="1" />
        <text x="18" y="24" textAnchor="middle" fontFamily="system-ui,sans-serif" fontSize="8" fill="#8a7060">Velch</text>
      </g>
      {/* Chip: Guindy */}
      <g transform="translate(184, 722)">
        <path d="M18 0 L36 10 L36 30 L18 40 L0 30 L0 10 Z" fill="#e6f2ea" stroke="#b8dcc0" strokeWidth="1" />
        <text x="18" y="24" textAnchor="middle" fontFamily="system-ui,sans-serif" fontSize="8" fill="#3a7a52">Guindy</text>
      </g>
      {/* Chip: Anna */}
      <g transform="translate(236, 722)">
        <path d="M18 0 L36 10 L36 30 L18 40 L0 30 L0 10 Z" fill="#f5ece0" stroke="#ead8c4" strokeWidth="1" />
        <text x="18" y="24" textAnchor="middle" fontFamily="system-ui,sans-serif" fontSize="8" fill="#8a7060">Anna</text>
      </g>
      {/* Legend */}
      <circle cx="480" cy="742" r="5" fill="#fde0d8" stroke="#f0b8a8" strokeWidth="1" />
      <text x="492" y="746" fontFamily="system-ui,sans-serif" fontSize="10" fill="#8a7060">Disrupted</text>
      <circle cx="554" cy="742" r="5" fill="#e6f2ea" stroke="#b8dcc0" strokeWidth="1" />
      <text x="566" y="746" fontFamily="system-ui,sans-serif" fontSize="10" fill="#8a7060">Safe</text>
      <circle cx="608" cy="742" r="5" fill="#f5ece0" stroke="#ead8c4" strokeWidth="1" />
      <text x="620" y="746" fontFamily="system-ui,sans-serif" fontSize="10" fill="#8a7060">Monitor</text>
    </svg>
  );
}

/* ─── Main Component ────────────────────────────────────────────────────── */
export default function HomePage() {
  const [worker, setWorker] = useState(null);
  const [claims, setClaims] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [screen, setScreen] = useState("landing");
  const [mode, setMode] = useState("login");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [isDemo, setIsDemo] = useState(false);

  const [registerForm, setRegisterForm] = useState(initialRegisterForm);
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });

 useEffect(() => {
  const token = localStorage.getItem("gigshield_token");
  const isDemoUser = localStorage.getItem("gigshield_demo");

  // ✅ Restore demo
  if (isDemoUser) {
    loadDemoData();
    return;
  }

  // ✅ Only run if token exists
  if (!token) return;

  setAuthToken(token);

  loadData().then(() => setScreen("dashboard"));

  const interval = setInterval(loadData, 10000);
  return () => clearInterval(interval);
}, []);

  const loadData = async () => {
  try {
    const token = localStorage.getItem("gigshield_token"); // ✅ ensure token

    const config = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };

    const [dashboardRes, claimsRes, alertsRes] = await Promise.all([
      api.get("/worker/dashboard", config),
      api.get("/worker/claims", config),
      api.get("/worker/alerts", config)
    ]);

    setWorker(dashboardRes.data.worker);
    setClaims(claimsRes.data);
    setAlerts(alertsRes.data);
  } catch (err) {
    console.error("Load data error:", err.response?.status);

    if (err.response?.status === 401) {
      logout();
    }
  }
};

  const handleRegister = async () => {
  try {
    setLoading(true);
    setMessage("");

    const res = await api.post("/auth/register", registerForm);

    setAuthToken(res.data.token);
    localStorage.setItem("gigshield_token", res.data.token); // 🔥 IMPORTANT

    await loadData();

    setScreen("dashboard"); // ✅ ADD THIS
  } catch (error) {
    setMessage(error?.response?.data?.message || "Registration failed");
  } finally {
    setLoading(false);
  }
};

  const handleLogin = async () => {
  try {
    setLoading(true);
    setMessage("");

    const res = await api.post("/auth/login", loginForm);

    setAuthToken(res.data.token);
    localStorage.setItem("gigshield_token", res.data.token); // 🔥 IMPORTANT

    await loadData();

    setScreen("dashboard"); // ✅ ADD THIS
  } catch (error) {
    setMessage(error?.response?.data?.message || "Login failed");
  } finally {
    setLoading(false);
  }
};

  const logout = () => {
  setAuthToken(null);

  // ✅ remove BOTH
  localStorage.removeItem("gigshield_token");
  localStorage.removeItem("gigshield_demo");

  setWorker(null);
  setClaims([]);
  setAlerts([]);

  setIsDemo(false);
  setActiveTab("dashboard");
  setMode("login");
  setScreen("landing");
};

  const handleLocalPlanUpdate = (coveragePlan, weeklyPremium) => {
    setWorker((prev) => ({ ...prev, coveragePlan, weeklyPremium }));
  };

  const tabContent = useMemo(() => {
    if (!worker) return null;
    switch (activeTab) {
      case "dashboard": return <DashboardTab worker={worker} claims={claims} alerts={alerts} />;
      case "claims":    return <ClaimsTab claims={claims} />;
      case "premium":   return <PremiumTab worker={worker} onUpdated={loadData} onLocalPlanUpdate={handleLocalPlanUpdate} isDemo={isDemo} />;
      case "alerts":    return <AlertsTab alerts={alerts} />;
      case "map":       return <PlaceholderTab title="H3 Geospatial Map Module" description="Disrupted hex zones, worker location markers, zone overlap detection, and live geospatial activity can be shown here." />;
      case "data":      return <PlaceholderTab title="Data Ingestion & Monitoring Module" description="Weather feeds, AQI feeds, traffic ingestion status, normalized event logs, and pipeline monitoring can be shown here." />;
      case "ai":        return <PlaceholderTab title="AI Premium & Risk Insights Module" description="Prediction models, worker risk scoring, premium confidence, and explainability charts can be shown here." />;
      case "payouts":   return <PlaceholderTab title="Claims Engine & Payout Module" description="Trigger rules, verification checks, approval states, payout execution, and transaction timelines can be implemented here." />;
      default:          return null;
    }
  }, [activeTab, worker, claims, alerts, isDemo]);

  /* ── Landing ── */
  if (screen === "landing") {
    return (
      <main className="mx-auto min-h-screen max-w-[1460px] px-4 py-6 md:px-6 lg:px-8">
        <section className="shell-card overflow-hidden rounded-[2.6rem] border border-[var(--border)]">
          <div className="grid gap-10 px-6 py-8 md:px-10 lg:grid-cols-[1.02fr,0.98fr] lg:px-12 lg:py-12">

            {/* ── Left column ── */}
            <div className="flex flex-col justify-between">
              <div>
                <div className="mb-6 flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--accent-soft)]">
                    <ShieldCheck className="h-6 w-6 text-[var(--primary)]" />
                  </div>
                  <div>
                    <p className="text-lg font-bold tracking-tight text-[var(--foreground)]">GigShield</p>
                    <p className="text-sm text-[var(--muted)]">Protection platform for gig workers</p>
                  </div>
                </div>

                <span className="badge badge-neutral">Smart income protection for delivery workers</span>

                <h1 className="mt-6 max-w-3xl text-5xl font-black leading-[1.04] tracking-tight md:text-6xl">
                  Protect every route when
                  <span className="gradient-heading"> disruption hits the city</span>
                </h1>

                <p className="mt-6 max-w-2xl text-lg leading-8 text-[var(--muted)]">
                  GigShield brings together claims visibility, coverage plans, disruption
                  alerts, and protected earnings in a polished worker-first experience.
                </p>

                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <button
                    onClick={() => setScreen("auth")}
                    className="primary-btn inline-flex items-center justify-center gap-2 rounded-2xl px-6 py-4 font-semibold"
                  >
                    Get Started
                    <ArrowRight className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => { localStorage.setItem("gigshield_demo", "true"); loadDemoData(); }}
                    className="secondary-btn inline-flex items-center justify-center gap-2 rounded-2xl px-6 py-4 font-semibold"
                  >
                    Explore Demo
                  </button>
                </div>

                <div className="mt-10 grid gap-4 md:grid-cols-3">
                  <div className="soft-card rounded-[1.5rem] p-4">
                    <MapPinned className="h-5 w-5 text-[var(--primary)]" />
                    <h3 className="mt-3 font-semibold">Zone Monitoring</h3>
                    <p className="mt-2 text-sm leading-6 text-[var(--muted)]">See where delivery activity is at risk in real time.</p>
                  </div>
                  <div className="soft-card rounded-[1.5rem] p-4">
                    <Wallet className="h-5 w-5 text-[var(--primary)]" />
                    <h3 className="mt-3 font-semibold">Coverage Plans</h3>
                    <p className="mt-2 text-sm leading-6 text-[var(--muted)]">Choose a plan that matches weekly earnings and route exposure.</p>
                  </div>
                  <div className="soft-card rounded-[1.5rem] p-4">
                    <ChartNoAxesColumn className="h-5 w-5 text-[var(--primary)]" />
                    <h3 className="mt-3 font-semibold">Claims Visibility</h3>
                    <p className="mt-2 text-sm leading-6 text-[var(--muted)]">Track review status, payouts, and protected income history.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* ── Right column: Illustration ── */}
            <div className="relative min-h-[820px]">
              {/* Ambient blobs */}
              <div className="absolute -left-8 top-12 hidden h-32 w-32 rounded-full bg-[#ead9c8] blur-3xl lg:block" />
              <div className="absolute right-4 top-2 hidden h-28 w-28 rounded-full bg-[#f3e7da] blur-3xl lg:block" />
              <div className="absolute bottom-14 right-10 hidden h-32 w-32 rounded-full bg-[#e7d3c0] blur-3xl lg:block" />

              <HeroIllustration />
            </div>

          </div>
        </section>
      </main>
    );
  }

  /* ── Auth ── */
  if (screen === "auth" && !worker) {
    return (
      <main className="mx-auto flex min-h-screen max-w-[1260px] items-center px-4 py-8 md:px-6">
        <div className="grid w-full gap-8 lg:grid-cols-[1fr,0.96fr]">
          <div className="flex flex-col justify-center">
            <button
              onClick={() => setScreen("landing")}
              className="mb-5 w-fit rounded-2xl border border-[var(--border)] px-4 py-2 text-sm text-[var(--muted)] transition hover:bg-[#f6eee5]"
            >
              ← Back
            </button>

            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--accent-soft)]">
                <ShieldCheck className="h-6 w-6 text-[var(--primary)]" />
              </div>
              <div>
                <p className="text-lg font-bold tracking-tight text-[var(--foreground)]">GigShield</p>
                <p className="text-sm text-[var(--muted)]">Worker login and onboarding</p>
              </div>
            </div>

            <h1 className="text-4xl font-black leading-tight tracking-tight md:text-5xl">
              Welcome to<span className="gradient-heading"> GigShield</span>
            </h1>

            <p className="mt-5 max-w-xl text-base leading-8 text-[var(--muted)]">
              Sign in to view your coverage, claims, alerts, and protected earnings, or
              create a new account to get started.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="soft-card rounded-[1.5rem] p-4">
                <p className="font-semibold">Track claims</p>
                <p className="mt-2 text-sm leading-6 text-[var(--muted)]">Follow approvals, reviews, and payout history.</p>
              </div>
              <div className="soft-card rounded-[1.5rem] p-4">
                <p className="font-semibold">Manage coverage</p>
                <p className="mt-2 text-sm leading-6 text-[var(--muted)]">Select the protection plan that fits your weekly route risk.</p>
              </div>
            </div>
          </div>

          <div className="shell-card rounded-[2rem] p-6 md:p-8">
            <div className="mb-5 flex gap-2 rounded-2xl bg-[#f6eee5] p-1">
              <button
                onClick={() => setMode("login")}
                className={`flex-1 rounded-2xl px-4 py-3 font-medium transition ${mode === "login" ? "bg-[var(--primary)] text-white" : "text-[var(--foreground)]"}`}
              >
                Login
              </button>
              <button
                onClick={() => setMode("register")}
                className={`flex-1 rounded-2xl px-4 py-3 font-medium transition ${mode === "register" ? "bg-[var(--primary)] text-white" : "text-[var(--foreground)]"}`}
              >
                Sign Up
              </button>
            </div>

            {mode === "register" ? (
              <div className="grid gap-4">
                <input className="field" placeholder="Full name" value={registerForm.fullName} onChange={(e) => setRegisterForm({ ...registerForm, fullName: e.target.value })} />
                <input className="field" placeholder="Email" value={registerForm.email} onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })} />
                <input className="field" placeholder="Phone" value={registerForm.phone} onChange={(e) => setRegisterForm({ ...registerForm, phone: e.target.value })} />
                <input className="field" placeholder="City" value={registerForm.city} onChange={(e) => setRegisterForm({ ...registerForm, city: e.target.value })} />
                <select className="field" value={registerForm.platform} onChange={(e) => setRegisterForm({ ...registerForm, platform: e.target.value })}>
                  <option value="">Select platform</option>
                  <option value="Swiggy">Swiggy</option>
                  <option value="Zomato">Zomato</option>
                </select>
                <input type="password" className="field" placeholder="Password" value={registerForm.password} onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })} />
                <button onClick={handleRegister} disabled={loading} className="primary-btn rounded-2xl px-4 py-3 font-semibold">
                  {loading ? "Creating account..." : "Create Account"}
                </button>
              </div>
            ) : (
              <div className="grid gap-4">
                <input className="field" placeholder="Email" value={loginForm.email} onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })} />
                <input type="password" className="field" placeholder="Password" value={loginForm.password} onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })} />
                <button onClick={handleLogin} disabled={loading} className="primary-btn rounded-2xl px-4 py-3 font-semibold">
                  {loading ? "Signing in..." : "Login"}
                </button>
                <button
                  onClick={() => { localStorage.setItem("gigshield_demo", "true"); loadDemoData(); }}
                  className="secondary-btn rounded-2xl px-4 py-3 font-semibold"
                >
                  Use Demo Data
                </button>
              </div>
            )}

            {message && <p className="mt-4 text-sm text-[var(--danger)]">{message}</p>}
          </div>
        </div>
      </main>
    );
  }

  /* ── Dashboard ── */
  return (
    <main className="mx-auto max-w-[1550px] px-4 py-5 md:px-6">
      <div className="dashboard-shell">
        <Sidebar activeTab={activeTab} onChange={setActiveTab} worker={worker} />
        <section className="min-w-0">
          <Topbar name={worker?.fullName} onLogout={logout} />
          {tabContent}
        </section>
      </div>
    </main>
  );
}