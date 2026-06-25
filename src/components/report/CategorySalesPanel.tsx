import type { CategorySales } from "../../types/report";
import { formatCurrency, formatNumber } from "../../utils/reportFormat";

type CategorySalesPanelProps = {
  categories: CategorySales[];
  loading: boolean;
  error?: string;
};

const CategorySalesPanel = ({
  categories,
  loading,
  error,
}: CategorySalesPanelProps) => {
  const maxRevenue = Math.max(
    ...categories.map((category) => category.revenue ?? 0),
    0
  );

  return (
    <section className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm">
      <h2 className="text-2xl font-bold text-slate-950">Category Sales</h2>

      {loading ? (
        <div className="mt-6 space-y-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="h-12 animate-pulse rounded bg-slate-100" />
          ))}
        </div>
      ) : error ? (
        <p className="mt-6 rounded-lg border border-red-100 bg-red-50 p-4 text-sm text-red-600">
          {error}
        </p>
      ) : categories.length === 0 ? (
        <p className="mt-6 rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-500">
          No category sales for this period.
        </p>
      ) : (
        <div className="mt-6 space-y-4">
          {categories.map((category) => {
            const revenue = category.revenue ?? 0;
            const width = maxRevenue > 0 ? (revenue / maxRevenue) * 100 : 0;

            return (
              <div key={category.categoryId ?? category.categoryName}>
                <div className="mb-2 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-slate-950">
                      {category.categoryName ?? "Unknown category"}
                    </p>
                    <p className="text-xs text-slate-500">
                      {formatNumber(category.quantitySold)} items sold
                    </p>
                  </div>
                  <p className="shrink-0 font-semibold text-slate-950">
                    {formatCurrency(revenue)}
                  </p>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                  <div className="h-full rounded-full bg-blue-600" style={{ width: `${width}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};

export default CategorySalesPanel;
