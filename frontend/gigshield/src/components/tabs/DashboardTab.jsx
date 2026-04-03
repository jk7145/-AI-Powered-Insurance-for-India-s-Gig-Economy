import {
  IndianRupee,
  ShieldCheck,
  WalletCards,
  MapPin,
  TrendingUp,
  Clock3
} from "lucide-react";
import StatCard from "../cards/StatCard";

export default function DashboardTab({ worker, claims, alerts }) {
  const approvedClaims = claims.filter((claim) => claim.status === "APPROVED");
  const totalPayout = approvedClaims.reduce((sum, claim) => sum + claim.amount, 0);
  const pendingClaims = claims.filter((claim) => claim.status === "PENDING").length;
  const activeAlerts = alerts.filter((alert) => alert.status !== "Resolved").length;

  return (
    <div className="dashboard-grid">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Weekly Premium"
          value={`₹${worker.weeklyPremium}`}
          sub={`Current ${worker.coveragePlan.toLowerCase()} plan with active protection`}
          icon={<WalletCards className="h-5 w-5 text-[var(--primary)]" />}
          tone="neutral"
        />
        <StatCard
          title="Protected Earnings"
          value={`₹${totalPayout}`}
          sub="Total approved payout amount till date"
          icon={<IndianRupee className="h-5 w-5 text-[var(--success)]" />}
          tone="success"
        />
        <StatCard
          title="Pending Claims"
          value={pendingClaims}
          sub="Claims currently under verification or review"
          icon={<Clock3 className="h-5 w-5 text-[var(--warning)]" />}
          tone="warning"
        />
        <StatCard
          title="Active Zone"
          value={worker.city}
          sub="Primary operating city linked to your profile"
          icon={<MapPin className="h-5 w-5 text-[var(--primary)]" />}
          tone="neutral"
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr,0.8fr]">
        <div className="soft-card rounded-[1.75rem] p-5">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h3 className="section-title">Coverage Summary</h3>
              <p className="section-subtitle mt-1">
                Your current plan, protection level, and recent performance snapshot.
              </p>
            </div>

            <span className="badge badge-neutral">
              <ShieldCheck className="h-4 w-4" />
              {worker.coveragePlan} Plan
            </span>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="soft-panel rounded-2xl p-4">
              <p className="text-sm text-[var(--muted)]">Platform</p>
              <h4 className="mt-2 text-xl font-semibold">{worker.platform}</h4>
            </div>
            <div className="soft-panel rounded-2xl p-4">
              <p className="text-sm text-[var(--muted)]">Coverage Status</p>
              <h4 className="mt-2 text-xl font-semibold">Active</h4>
            </div>
            <div className="soft-panel rounded-2xl p-4">
              <p className="text-sm text-[var(--muted)]">Live Alerts</p>
              <h4 className="mt-2 text-xl font-semibold">{activeAlerts}</h4>
            </div>
          </div>

          <div className="mt-5 rounded-[1.5rem] bg-[#f7efe6] p-5">
            <div className="flex items-center gap-2 text-[var(--primary)]">
              <TrendingUp className="h-4 w-4" />
              <p className="text-sm font-semibold">Weekly protection insight</p>
            </div>
            <p className="mt-2 text-sm leading-7 text-[#6a5a4d]">
              Your current risk profile is stable. Keeping the {worker.coveragePlan} plan
              active helps you stay protected against rain, shutdown, and disruption-based
              earning loss in your registered zone.
            </p>
          </div>
        </div>

        <div className="soft-card rounded-[1.75rem] p-5">
          <h3 className="section-title">Recent Claims</h3>
          <p className="section-subtitle mt-1">
            Latest claim events linked to your worker account.
          </p>

          <div className="mt-5 space-y-3">
            {claims.slice(0, 3).map((claim) => (
              <div
                key={claim.id}
                className="rounded-2xl border border-[var(--border)] bg-[#fffdfa] p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold">{claim.disruptionType}</p>
                    <p className="mt-1 text-sm text-[var(--muted)]">{claim.zone}</p>
                  </div>

                  <span
                    className={`badge ${
                      claim.status === "APPROVED"
                        ? "status-approved"
                        : claim.status === "PENDING"
                        ? "status-pending"
                        : "status-rejected"
                    }`}
                  >
                    {claim.status}
                  </span>
                </div>

                <p className="mt-3 text-lg font-bold">₹{claim.amount}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.9fr,1.1fr]">
        <div className="soft-card rounded-[1.75rem] p-5">
          <h3 className="section-title">Live Disruption Alerts</h3>
          <p className="section-subtitle mt-1">
            Area-based alerts that may affect operations and payouts.
          </p>

          <div className="mt-5 space-y-3">
            {alerts.slice(0, 3).map((alert) => (
              <div key={alert.id} className="rounded-2xl bg-[#f9f3ec] p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold">{alert.title}</p>
                    <p className="mt-1 text-sm leading-6 text-[var(--muted)]">
                      {alert.description}
                    </p>
                  </div>
                  <span
                    className={`badge ${
                      alert.severity === "high"
                        ? "badge-danger"
                        : alert.severity === "medium"
                        ? "badge-warning"
                        : "badge-neutral"
                    }`}
                  >
                    {alert.severity}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="soft-card rounded-[1.75rem] p-5">
          <h3 className="section-title">Worker Snapshot</h3>
          <p className="section-subtitle mt-1">
            Demo-ready summary for project presentation and evaluation.
          </p>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <div className="soft-panel rounded-2xl p-4">
              <p className="text-sm text-[var(--muted)]">Worker Name</p>
              <h4 className="mt-2 text-lg font-semibold">{worker.fullName}</h4>
            </div>
            <div className="soft-panel rounded-2xl p-4">
              <p className="text-sm text-[var(--muted)]">Linked Platform</p>
              <h4 className="mt-2 text-lg font-semibold">{worker.platform}</h4>
            </div>
            <div className="soft-panel rounded-2xl p-4">
              <p className="text-sm text-[var(--muted)]">Registered City</p>
              <h4 className="mt-2 text-lg font-semibold">{worker.city}</h4>
            </div>
            <div className="soft-panel rounded-2xl p-4">
              <p className="text-sm text-[var(--muted)]">Coverage Tier</p>
              <h4 className="mt-2 text-lg font-semibold">{worker.coveragePlan}</h4>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}