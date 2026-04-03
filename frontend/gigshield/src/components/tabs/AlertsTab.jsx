export default function AlertsTab({ alerts }) {
  return (
    <div className="soft-card rounded-[1.75rem] p-5">
      <div className="mb-5">
        <h3 className="section-title">Disruption Alerts</h3>
        <p className="section-subtitle mt-1">
          Live alert feed for worker-impacting events like rain, shutdowns, and traffic blocks.
        </p>
      </div>

      <div className="space-y-4">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className="rounded-[1.5rem] border border-[var(--border)] bg-[#fffdfa] p-5"
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h4 className="text-lg font-semibold">{alert.title}</h4>
                <p className="mt-2 max-w-3xl text-sm leading-7 text-[var(--muted)]">
                  {alert.description}
                </p>
                <p className="mt-3 text-xs uppercase tracking-[0.14em] text-[#9a8e84]">
                  Zone impact alert
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
  );
}