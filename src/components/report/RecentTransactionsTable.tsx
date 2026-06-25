import type { RecentLargeTransaction } from "../../types/report";
import { formatCurrency, formatDateTime } from "../../utils/reportFormat";

type RecentTransactionsTableProps = {
  transactions: RecentLargeTransaction[];
  loading: boolean;
  error?: string;
};

const statusClassNames: Record<string, string> = {
  COMPLETED: "bg-emerald-50 text-emerald-700",
  CONFIRMED: "bg-blue-50 text-blue-700",
  PENDING: "bg-amber-50 text-amber-700",
  CANCELLED: "bg-red-50 text-red-700",
};

const RecentTransactionsTable = ({
  transactions,
  loading,
  error,
}: RecentTransactionsTableProps) => {
  return (
    <section className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center justify-between gap-4 border-b border-slate-200 px-5 py-4">
        <h2 className="text-2xl font-bold text-slate-950">Recent Large Transactions</h2>
      </div>

      {loading ? (
        <div className="p-5">
          <div className="h-40 animate-pulse rounded bg-slate-100" />
        </div>
      ) : error ? (
        <p className="m-5 rounded-lg border border-red-100 bg-red-50 p-4 text-sm text-red-600">
          {error}
        </p>
      ) : transactions.length === 0 ? (
        <p className="m-5 rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-500">
          No large transactions for this period.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left">
            <thead className="bg-blue-50">
              <tr>
                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Order ID
                </th>
                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Created
                </th>
                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Table
                </th>
                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Items
                </th>
                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Total
                </th>
                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {transactions.map((transaction) => {
                const status = transaction.status ?? "UNKNOWN";

                return (
                  <tr
                    key={transaction.orderId ?? `${transaction.tableNumber}-${transaction.createdAt}`}
                    className="hover:bg-slate-50"
                  >
                    <td className="px-5 py-4 font-semibold text-slate-950">
                      #{transaction.orderId ?? "N/A"}
                    </td>
                    <td className="px-5 py-4 text-slate-600">
                      {formatDateTime(transaction.createdAt)}
                    </td>
                    <td className="px-5 py-4 text-slate-600">
                      {transaction.tableNumber ?? "N/A"}
                    </td>
                    <td className="px-5 py-4 text-slate-600">
                      {transaction.items?.length ?? 0}
                    </td>
                    <td className="px-5 py-4 font-bold text-slate-950">
                      {formatCurrency(transaction.totalAmount)}
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          statusClassNames[status] ?? "bg-slate-100 text-slate-700"
                        }`}
                      >
                        {status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
};

export default RecentTransactionsTable;
