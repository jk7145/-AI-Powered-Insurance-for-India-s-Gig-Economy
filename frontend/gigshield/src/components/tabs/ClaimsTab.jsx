export default function ClaimsTab({ claims }) {
  return (
    <div className="soft-card rounded-[1.75rem] p-5">
      <div className="mb-5">
        <h3 className="section-title">Claim History</h3>
        <p className="section-subtitle mt-1">
          Complete list of disruption claims, payout amounts, and decision status.
        </p>
      </div>

      <div className="table-scroll">
        <table className="w-full text-left">
          <thead className="text-sm text-[var(--muted)]">
            <tr>
              <th className="pb-4 font-medium">Disruption</th>
              <th className="pb-4 font-medium">Zone</th>
              <th className="pb-4 font-medium">Amount</th>
              <th className="pb-4 font-medium">Status</th>
              <th className="pb-4 font-medium">Date</th>
            </tr>
          </thead>

          <tbody>
            {claims.map((claim) => (
              <tr key={claim.id} className="border-t border-[var(--border)]">
                <td className="py-4 font-medium">{claim.disruptionType}</td>
                <td className="py-4 text-[var(--muted)]">{claim.zone}</td>
                <td className="py-4 font-semibold">₹{claim.amount}</td>
                <td className="py-4">
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
                </td>
                <td className="py-4 text-[var(--muted)]">
                  {new Date(claim.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}