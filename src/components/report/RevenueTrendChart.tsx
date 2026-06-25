import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { RevenueTrendItem } from "../../types/report";
import { formatCurrency, formatNumber } from "../../utils/reportFormat";

type RevenueTrendChartProps = {
  data: RevenueTrendItem[];
  loading: boolean;
  error?: string;
};

type RevenueTrendChartRow = {
  period: string;
  revenue: number;
  orderCount: number;
};

type RevenueTrendTooltipProps = {
  active?: boolean;
  payload?: Array<{ payload?: RevenueTrendChartRow }>;
  label?: string | number;
};

const RevenueTrendTooltip = ({
  active,
  payload,
  label,
}: RevenueTrendTooltipProps) => {
  if (!active || !payload?.length) {
    return null;
  }

  const row = payload[0]?.payload as RevenueTrendChartRow | undefined;

  return (
    <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-lg">
      <p className="font-semibold text-slate-950">{label}</p>
      <p className="mt-1 text-blue-700">Revenue: {formatCurrency(row?.revenue)}</p>
      <p className="text-slate-500">Orders: {formatNumber(row?.orderCount)}</p>
    </div>
  );
};

const RevenueTrendChart = ({ data, loading, error }: RevenueTrendChartProps) => {
  const chartData = data
    .filter((item) => item.period)
    .map((item) => ({
      period: item.period,
      revenue: item.revenue ?? 0,
      orderCount: item.orderCount ?? 0,
    }));

  return (
    <section className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-slate-950">Revenue Trends</h2>
          <p className="text-sm text-slate-500">
            Revenue and order count for the selected period.
          </p>
        </div>
        <span className="rounded bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-700">
          Gross Revenue
        </span>
      </div>

      {loading ? (
        <div className="mt-6 h-[300px] animate-pulse rounded-lg bg-slate-100" />
      ) : error ? (
        <p className="mt-6 rounded-lg border border-red-100 bg-red-50 p-4 text-sm text-red-600">
          {error}
        </p>
      ) : chartData.length === 0 ? (
        <p className="mt-6 rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-500">
          No revenue trend data for this period.
        </p>
      ) : (
        <div className="mt-6 overflow-x-auto">
          <div
            className="h-[300px] min-w-[640px] rounded-lg border border-slate-100 bg-white pr-3 pt-4"
            role="img"
            aria-label="Revenue trend chart"
          >
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 12, right: 16, bottom: 12, left: 16 }}>
                <defs>
                  <linearGradient id="revenueTrendGradient" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#2563eb" stopOpacity={0.24} />
                    <stop offset="100%" stopColor="#2563eb" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#f1f5f9" strokeDasharray="0" vertical />
                <XAxis
                  dataKey="period"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#475569", fontSize: 12, fontWeight: 600 }}
                  dy={10}
                  interval="preserveStartEnd"
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#64748b", fontSize: 12 }}
                  tickFormatter={(value) => formatCurrency(Number(value))}
                  width={84}
                />
                <Tooltip content={<RevenueTrendTooltip />} cursor={{ stroke: "#cbd5e1" }} />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#0b57d0"
                  strokeWidth={3}
                  fill="url(#revenueTrendGradient)"
                  dot={{ fill: "#0b57d0", r: 4, strokeWidth: 0 }}
                  activeDot={{ fill: "#0b57d0", r: 5, stroke: "#ffffff", strokeWidth: 2 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </section>
  );
};

export default RevenueTrendChart;
