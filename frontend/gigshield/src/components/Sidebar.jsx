"use client";

import {
  Shield,
  LayoutDashboard,
  FileClock,
  Wallet,
  Bell,
  Map,
  Database,
  BrainCircuit,
  Landmark
} from "lucide-react";

const items = [
  { key: "dashboard", label: "Overview", icon: LayoutDashboard },
  { key: "claims", label: "Claim History", icon: FileClock },
  { key: "premium", label: "Coverage & Premium", icon: Wallet },
  { key: "alerts", label: "Disruption Alerts", icon: Bell },
  { key: "map", label: "H3 Map Module", icon: Map },
  { key: "data", label: "Data Pipeline", icon: Database },
  { key: "ai", label: "AI Insights", icon: BrainCircuit },
  { key: "payouts", label: "Payout Engine", icon: Landmark }
];

export default function Sidebar({ activeTab, onChange, worker }) {
  return (
    <aside className="shell-card rounded-[2rem] p-5 lg:sticky lg:top-5">
      <div className="border-b border-[var(--border)] pb-5">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--accent-soft)]">
            <Shield className="h-7 w-7 text-[var(--primary)]" />
          </div>

          <div>
            <h2 className="text-lg font-bold text-[var(--foreground)]">GigShield AI</h2>
            <p className="text-sm text-[var(--muted)]">Worker Protection Console</p>
          </div>
        </div>

        {worker && (
          <div className="soft-panel rounded-2xl p-4">
            <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted)]">
              Active Worker
            </p>
            <h3 className="mt-2 text-base font-semibold">{worker.fullName}</h3>
            <p className="mt-1 text-sm text-[var(--muted)]">
              {worker.platform || "Swiggy"} · {worker.city}
            </p>
          </div>
        )}
      </div>

      <div className="mt-5 space-y-2">
        {items.map((item) => {
          const Icon = item.icon;
          const active = activeTab === item.key;

          return (
            <button
              key={item.key}
              onClick={() => onChange(item.key)}
              className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left transition ${
                active
                  ? "bg-[var(--primary)] text-white shadow-md"
                  : "text-[var(--foreground)] hover:bg-[#f4ede5]"
              }`}
            >
              <Icon className="h-5 w-5" />
              <span className="text-sm font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>

      
    </aside>
  );
}