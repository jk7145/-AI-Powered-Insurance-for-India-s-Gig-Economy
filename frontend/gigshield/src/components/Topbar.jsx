"use client";

import { Bell, LogOut, Search } from "lucide-react";

export default function Topbar({ name, onLogout }) {
  return (
    <div className="shell-card mb-6 rounded-[2rem] px-5 py-4">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm text-[var(--muted)]">Welcome back</p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight">
            <span className="gradient-heading">{name || "Worker"}</span>
          </h1>
          <p className="mt-1 text-sm text-[var(--muted)]">
            Track your coverage, claims, alerts, and protected earnings in one place.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative min-w-[220px]">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9a8e84]" />
            <input
              className="field pl-10"
              placeholder="Search claims, alerts, zones..."
            />
          </div>

          <button className="secondary-btn flex items-center justify-center gap-2 rounded-2xl px-4 py-3">
            <Bell className="h-4 w-4" />
            Alerts
          </button>

          <button
            onClick={onLogout}
            className="primary-btn flex items-center justify-center gap-2 rounded-2xl px-4 py-3"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}