export default function PlaceholderTab({ title, description }) {
  return (
    <div className="soft-card rounded-[1.75rem] p-8">
      <div className="max-w-3xl">
        <h3 className="section-title">{title}</h3>
        <p className="section-subtitle mt-3 leading-7">{description}</p>

        <div className="mt-6 rounded-[1.5rem] border border-dashed border-[#ccb39d] bg-[#fbf4ec] p-6">
          <p className="font-medium text-[var(--primary)]">Reserved teammate module</p>
          <p className="mt-2 text-sm leading-7 text-[#6c5c4d]">
            This section is already wired into the main application shell. 
            can fork and build this module independently without breaking navigation,
            authentication flow, or the overall dashboard layout.
          </p>
        </div>
      </div>
    </div>
  );
}