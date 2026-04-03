"use client";

import { useState } from "react";
import { CheckCircle2, Shield, Sparkles } from "lucide-react";
import { api } from "@/lib/api";

const plans = [
  {
    name: "BASIC",
    premium: 99,
    desc: "Essential protection for weekly disruption-linked income loss.",
    features: [
      "Rain and shutdown coverage",
      "Standard claim processing",
      "Basic weekly protection"
    ]
  },
  {
    name: "STANDARD",
    premium: 149,
    desc: "Balanced protection with stronger coverage and better payouts.",
    features: [
      "Rain, AQI, and traffic coverage",
      "Improved claim support",
      "Better payout protection"
    ]
  },
  {
    name: "PREMIUM",
    premium: 229,
    desc: "Maximum protection for high-risk workers and priority events.",
    features: [
      "Full disruption coverage",
      "Priority trigger review",
      "Highest protected payout range"
    ]
  }
];

export default function PremiumTab({ worker, onUpdated, onLocalPlanUpdate, isDemo }) {
  const [loading, setLoading] = useState(false);

  const updatePlan = async (coveragePlan, weeklyPremium) => {
    try {
      setLoading(true);

      if (isDemo) {
        onLocalPlanUpdate?.(coveragePlan, weeklyPremium);
        return;
      }

      await api.patch("/worker/plan", { coveragePlan, weeklyPremium });
      onUpdated?.();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-grid">
      <div className="soft-card rounded-[1.75rem] p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h3 className="section-title">Coverage & Weekly Premium</h3>
            <p className="section-subtitle mt-1">
              Select a worker protection plan based on your risk level and weekly budget.
            </p>
          </div>

          <div className="rounded-2xl bg-[#f6eee5] px-4 py-3">
            <p className="text-sm text-[var(--muted)]">Current plan</p>
            <p className="mt-1 font-semibold text-[var(--foreground)]">
              {worker.coveragePlan} · ₹{worker.weeklyPremium}/week
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {plans.map((plan) => {
          const active = worker.coveragePlan === plan.name;

          return (
            <div
              key={plan.name}
              className={`rounded-[1.75rem] border p-5 shadow-sm transition ${
                active
                  ? "border-[#b08968] bg-[#fff8f1] shadow-[0_14px_30px_rgba(176,137,104,0.15)]"
                  : "border-[var(--border)] bg-[var(--card)]"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-medium tracking-[0.08em] text-[var(--muted)]">
                    {plan.name}
                  </p>
                  <h4 className="mt-2 text-3xl font-bold tracking-tight">
                    ₹{plan.premium}
                  </h4>
                  <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
                    {plan.desc}
                  </p>
                </div>

                <div className="rounded-2xl bg-[#f4eadf] p-3">
                  {plan.name === "PREMIUM" ? (
                    <Sparkles className="h-5 w-5 text-[var(--primary)]" />
                  ) : (
                    <Shield className="h-5 w-5 text-[var(--primary)]" />
                  )}
                </div>
              </div>

              <div className="mt-5 space-y-3">
                {plan.features.map((feature) => (
                  <div key={feature} className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 text-[var(--success)]" />
                    <p className="text-sm text-[var(--foreground)]">{feature}</p>
                  </div>
                ))}
              </div>

              <button
                disabled={loading}
                onClick={() => updatePlan(plan.name, plan.premium)}
                className={`mt-6 w-full rounded-2xl px-4 py-3 font-semibold transition ${
                  active
                    ? "secondary-btn"
                    : "primary-btn"
                }`}
              >
                {active ? "Current Plan" : `Choose ${plan.name}`}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}