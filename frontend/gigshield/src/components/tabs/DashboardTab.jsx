"use client";

import {
  IndianRupee,
  ShieldCheck,
  WalletCards,
  MapPin,
  TrendingUp,
  Clock3,
  CloudRain,
  Activity
} from "lucide-react";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";

import StatCard from "../cards/StatCard";

export default function DashboardTab({ worker, claims, alerts }) {
  const approvedClaims = claims.filter((c) => c.status === "APPROVED");
  const totalPayout = approvedClaims.reduce((sum, c) => sum + c.amount, 0);
  const pendingClaims = claims.filter((c) => c.status === "PENDING").length;
  const activeAlerts = alerts.filter((a) => a.status !== "Resolved").length;

  // 📊 Chart data (last 7 claims)
  const chartData = claims.slice(0, 7).map((c, i) => ({
    name: `C${i + 1}`,
    amount: c.amount
  }));

  // ⚠️ Risk Score Logic (REAL SYSTEM FEEL)
  const riskScore = worker?.riskScore || "LOW";

  const riskColor =
    riskScore === "HIGH"
      ? "text-red-500"
      : riskScore === "MEDIUM"
      ? "text-yellow-500"
      : "text-green-500";

  return (
    <div className="dashboard-grid">
      {/* 🔹 TOP STATS */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Weekly Premium"
          value={`₹${worker.weeklyPremium}`}
          sub={`Current ${worker.coveragePlan.toLowerCase()} plan`}
          icon={<WalletCards className="h-5 w-5 text-[var(--primary)]" />}
        />

        <StatCard
          title="Protected Earnings"
          value={`₹${totalPayout}`}
          sub="Approved payout total"
          icon={<IndianRupee className="h-5 w-5 text-green-500" />}
        />

        <StatCard
          title="Pending Claims"
          value={pendingClaims}
          sub="Under review"
          icon={<Clock3 className="h-5 w-5 text-yellow-500" />}
        />

        <StatCard
          title="Active Zone"
          value={worker.city}
          sub="Operational city"
          icon={<MapPin className="h-5 w-5 text-[var(--primary)]" />}
        />
      </div>

      {/* 🔹 WEATHER + RISK */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* 🌤 Weather */}
        <div className="soft-card rounded-2xl p-5">
          <h3 className="section-title">Live Weather</h3>

          {worker.weather ? (
            <div className="mt-4">
              <p className="text-3xl font-bold">
                {worker.weather.temperature}°C
              </p>
              <p className="text-sm text-[var(--muted)]">
                {worker.weather.condition} in {worker.city}
              </p>

              <div className="mt-3 flex gap-4 text-sm">
                <span>💨 {worker.weather.windSpeed} m/s</span>
                <span>💧 {worker.weather.humidity}%</span>
              </div>
            </div>
          ) : (
            <p className="mt-4 text-sm text-gray-400">Loading weather...</p>
          )}
        </div>

        {/* ⚠️ Risk */}
        <div className="soft-card rounded-2xl p-5">
          <h3 className="section-title">Risk Score</h3>

          <p className={`mt-4 text-3xl font-bold ${riskColor}`}>
            {riskScore}
          </p>

          <p className="mt-2 text-sm text-[var(--muted)]">
            Based on alerts + city conditions
          </p>

          <div className="mt-4 flex items-center gap-2">
            <Activity className="h-4 w-4" />
            <span className="text-sm">
              {activeAlerts} active disruptions detected
            </span>
          </div>
        </div>
      </div>

      {/* 🔹 CHART */}
      <div className="soft-card rounded-2xl p-5">
        <h3 className="section-title">Claims Trend</h3>

        <div className="mt-5 h-60">
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={chartData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="amount" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 🔹 RECENT CLAIMS */}
      <div className="soft-card rounded-2xl p-5">
        <h3 className="section-title">Recent Claims</h3>

        <div className="mt-5 space-y-3">
          {claims.slice(0, 3).map((claim) => (
            <div key={claim.id} className="border p-4 rounded-xl">
              <div className="flex justify-between">
                <div>
                  <p className="font-semibold">{claim.disruptionType}</p>
                  <p className="text-sm text-gray-500">{claim.zone}</p>
                </div>

                <span className="text-sm">{claim.status}</span>
              </div>

              <p className="mt-2 font-bold">₹{claim.amount}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 🔹 ALERTS */}
      <div className="soft-card rounded-2xl p-5">
        <h3 className="section-title">Live Alerts</h3>

        <div className="mt-5 space-y-3">
          {alerts.slice(0, 3).map((alert) => (
            <div key={alert.id} className="p-4 bg-[#f9f3ec] rounded-xl">
              <p className="font-semibold">{alert.title}</p>
              <p className="text-sm text-gray-600">{alert.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}