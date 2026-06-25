import type { TopSellingDish } from "../../types/report";
import { formatCurrency, formatNumber } from "../../utils/reportFormat";

type TopSellingDishesProps = {
  dishes: TopSellingDish[];
  loading: boolean;
  error?: string;
  onViewAll: () => void;
};

const TopSellingDishes = ({
  dishes,
  loading,
  error,
  onViewAll,
}: TopSellingDishesProps) => {
  return (
    <section className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm">
      <div>
        <h2 className="text-2xl font-bold text-slate-950">
          Top Selling Dishes
        </h2>
        <p className="text-sm text-slate-500">Ranked by gross revenue.</p>
      </div>

      {loading ? (
        <div className="mt-6 space-y-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="h-14 animate-pulse rounded bg-slate-100"
            />
          ))}
        </div>
      ) : error ? (
        <p className="mt-6 rounded-lg border border-red-100 bg-red-50 p-4 text-sm text-red-600">
          {error}
        </p>
      ) : dishes.length === 0 ? (
        <p className="mt-6 rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-500">
          No top-selling dishes for this period.
        </p>
      ) : (
        <div className="mt-6 space-y-4">
          {dishes.map((dish, index) => (
            <div
              key={dish.productId ?? `${dish.productName}-${index}`}
              className="flex items-center gap-4 rounded-lg p-1 transition-colors hover:bg-slate-50"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-blue-50 text-sm font-bold text-blue-700">
                #{index + 1}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold text-slate-950">
                  {dish.productName ?? "Unknown dish"}
                </p>
                <p className="text-sm text-slate-500">
                  {formatNumber(dish.quantitySold)} sold
                </p>
              </div>
              <p className="shrink-0 font-bold text-blue-700">
                {formatCurrency(dish.revenue)}
              </p>
            </div>
          ))}
        </div>
      )}

      <div className="mt-5 text-center">
        <button
          className="text-sm font-semibold text-blue-700 underline-offset-4 transition-colors hover:text-blue-800 hover:underline disabled:cursor-not-allowed disabled:text-slate-400 disabled:no-underline"
          disabled={loading}
          onClick={onViewAll}
          type="button"
        >
          View All Menu Analytics
        </button>
      </div>
    </section>
  );
};

export default TopSellingDishes;
