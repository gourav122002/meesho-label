import type { FeeItem } from "../../../lib/calculator/types";

interface Props {
  fees: FeeItem[];
  totalFees: number;
}

export default function FeeBreakdown({ fees, totalFees }: Props) {
  return (
    <div className="fee-breakdown">
      <h3 className="fee-breakdown-title">Deduction & Fee Breakdown</h3>
      <table className="fee-table">
        <thead>
          <tr>
            <th>Fee Component</th>
            <th>Rate / Calculation</th>
            <th className="fee-amount-th">Amount</th>
          </tr>
        </thead>
        <tbody>
          {fees.map((fee) => (
            <tr key={fee.label} className={fee.amount === 0 ? "fee-row-zero" : ""}>
              <td>
                <span className="fee-label-text">{fee.label}</span>
              </td>
              <td className="fee-rate">{fee.rate ?? "—"}</td>
              <td className="fee-amount">
                {fee.amount === 0 ? (
                  <span className="fee-free">FREE</span>
                ) : (
                  `₹${fee.amount.toFixed(2)}`
                )}
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="fee-total-row">
            <td colSpan={2}>Total Deductions</td>
            <td className="fee-amount fee-total-amount">₹{totalFees.toFixed(2)}</td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}
