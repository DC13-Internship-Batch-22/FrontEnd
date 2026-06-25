import { X } from "lucide-react";
import type { TopSellingDish } from "../../types/report";
import { formatCurrency, formatNumber } from "../../utils/reportFormat";

type MenuAnalyticsModalProps = {
  dishes: TopSellingDish[];
  error?: string;
  loading: boolean;
  onClose: () => void;
};

const MenuAnalyticsModal = ({
  dishes,
  error,
  loading,
  onClose,
}: MenuAnalyticsModalProps) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4">
      <section className="max-h-[90vh] w-full max-w-4xl overflow-hidden rounded-lg bg-white shadow-xl">
        <div className="flex items-start justify-between gap-4 border-b border-slate-200 p-5">
          <div>
            <h2 className="text-2xl font-bold text-slate-950">Menu Analytics</h2>
            <p className="text-sm text-slate-500">
              Full selling performance for dishes in the selected period.
            </p>
          </div>
          <button
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded border border-slate-200 text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-950"
            onClick={onClose}
            type="button"
            aria-label="Close menu analytics"
          >
            <X size={18} />
          </button>
        </div>

        <div className="max-h-[calc(90vh-96px)] overflow-auto p-5">
          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 8 }).map((_, index) => (
                <div key={index} className="h-12 animate-pulse rounded bg-slate-100" />
              ))}
            </div>
          ) : error ? (
            <p className="rounded-lg border border-red-100 bg-red-50 p-4 text-sm text-red-600">
              {error}
            </p>
          ) : dishes.length === 0 ? (
            <p className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-500">
              No menu analytics data for this period.
            </p>
          ) : (
            <table className="w-full min-w-[680px] border-separate border-spacing-0 text-left text-sm">
              <thead>
                <tr className="text-xs uppercase tracking-wide text-slate-500">
                  <th className="border-b border-slate-200 px-4 py-3 font-semibold">Rank</th>
                  <th className="border-b border-slate-200 px-4 py-3 font-semibold">Dish</th>
                  <th className="border-b border-slate-200 px-4 py-3 font-semibold">Product ID</th>
                  <th className="border-b border-slate-200 px-4 py-3 text-right font-semibold">
                    Quantity Sold
                  </th>
                  <th className="border-b border-slate-200 px-4 py-3 text-right font-semibold">
                    Revenue
                  </th>
                </tr>
              </thead>
              <tbody>
                {dishes.map((dish, index) => (
                  <tr
                    key={dish.productId ?? `${dish.productName}-${index}`}
                    className="transition-colors hover:bg-slate-50"
                  >
                    <td className="border-b border-slate-100 px-4 py-3 font-semibold text-blue-700">
                      #{index + 1}
                    </td>
                    <td className="border-b border-slate-100 px-4 py-3 font-semibold text-slate-950">
                      {dish.productName ?? "Unknown dish"}
                    </td>
                    <td className="border-b border-slate-100 px-4 py-3 text-slate-500">
                      {dish.productId ?? "N/A"}
                    </td>
                    <td className="border-b border-slate-100 px-4 py-3 text-right text-slate-700">
                      {formatNumber(dish.quantitySold)}
                    </td>
                    <td className="border-b border-slate-100 px-4 py-3 text-right font-bold text-blue-700">
                      {formatCurrency(dish.revenue)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </section>
    </div>
  );
};

export default MenuAnalyticsModal;
