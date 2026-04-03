export default function StatCard({ title, value, sub, icon, tone = "neutral" }) {
  const tones = {
    neutral: "bg-[#f7efe6]",
    success: "bg-[#e7f3ec]",
    warning: "bg-[#fff4dd]",
    danger: "bg-[#fde8e8]"
  };

  return (
    <div className="soft-card rounded-[1.75rem] p-5">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-[var(--muted)]">{title}</p>
          <h3 className="mt-2 text-3xl font-bold tracking-tight text-[var(--foreground)]">
            {value}
          </h3>
        </div>

        <div className={`rounded-2xl p-3 ${tones[tone] || tones.neutral}`}>{icon}</div>
      </div>

      <p className="text-sm leading-6 text-[var(--muted)]">{sub}</p>
    </div>
  );
}