import { CheckCircle2 } from "lucide-react";
import type { OrderStatusReport } from "../../types/report";
import { formatNumber, formatPercent } from "../../utils/reportFormat";

type PaymentStatusCardProps = {
  statuses: OrderStatusReport[];
  loading: boolean;
  error?: string;
};

const statusStyles: Record<string, string> = {
  CONFIRMED: "bg-blue-600 text-blue-700",
  PENDING: "bg-amber-600 text-amber-700",
};

const PaymentStatusCard = ({
  statuses,
  loading,
  error,
}: PaymentStatusCardProps) => {
  const total = statuses.reduce((sum, item) => sum + (item.count ?? 0), 0);

  return (
    <section className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Orders By Status
          </p>

          {loading ? (
            <div className="mt-5 h-16 animate-pulse rounded bg-slate-200" />
          ) : error ? (
            <p className="mt-4 text-sm text-red-600">{error}</p>
          ) : total === 0 ? (
            <p className="mt-4 text-sm text-slate-500">
              No order status data for this period.
            </p>
          ) : (
            <>
              <div className="mt-5 flex h-3 overflow-hidden rounded-full bg-slate-100">
                {statuses.map((item) => {
                  const count = item.count ?? 0;
                  const width = total > 0 ? (count / total) * 100 : 0;
                  const status = item.status ?? "UNKNOWN";

                  return (
                    <div
                      key={status}
                      className={statusStyles[status]?.split(" ")[0] ?? "bg-slate-400"}
                      style={{ width: `${width}%` }}
                      title={`${status}: ${formatNumber(count)}`}
                    />
                  );
                })}
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3">
                {statuses.map((item) => {
                  const count = item.count ?? 0;
                  const status = item.status ?? "UNKNOWN";
                  const percent = total > 0 ? (count / total) * 100 : 0;
                  const textClass =
                    statusStyles[status]?.split(" ")[1] ?? "text-slate-700";

                  return (
                    <div key={status}>
                      <p className={`text-sm font-semibold ${textClass}`}>
                        {status}
                      </p>
                      <p className="text-sm text-slate-500">
                        {formatNumber(count)} orders · {formatPercent(percent)}
                      </p>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>

        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg border-4 border-emerald-100">
          <CheckCircle2 className="text-emerald-700" />
        </div>
      </div>
    </section>
  );
};

export default PaymentStatusCard;
