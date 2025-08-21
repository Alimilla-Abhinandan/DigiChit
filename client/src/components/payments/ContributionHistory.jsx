import React from "react";
import "./Payments.css";
import "./ContributionHistory.css";

export default function ContributionHistory() {
  const rows = [
    { month: "Jan 2025", amount: 5000, status: "Paid", txnId: "TXN12345" },
    { month: "Feb 2025", amount: 5000, status: "Paid", txnId: "TXN12389" },
    { month: "Mar 2025", amount: 5000, status: "Pending", txnId: "—" },
    { month: "Apr 2025", amount: 5000, status: "Paid", txnId: "TXN12890" }
  ];

  const formatINR = (value) => `₹${value.toLocaleString("en-IN")}`;

  return (
    <div className="payments-section contrib-history-card">
      <h3 className="section-title">Contribution History</h3>

      <div className="table-responsive">
        <table className="contrib-table">
          <thead>
            <tr>
              <th>Month</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Transaction ID</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, idx) => (
              <tr key={idx}>
                <td>{row.month}</td>
                <td className="amount-cell">{formatINR(row.amount)}</td>
                <td>
                  <span className={`status-pill ${row.status.toLowerCase()}`}>
                    {row.status}
                  </span>
                </td>
                <td className="txn-cell">{row.txnId}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}


