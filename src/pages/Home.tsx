import { DollarSign, ReceiptText, ShoppingBasket, Trophy } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import CategorySalesPanel from "../components/report/CategorySalesPanel";
import MenuAnalyticsModal from "../components/report/MenuAnalyticsModal";
import PaymentStatusCard from "../components/report/PaymentStatusCard";
import RecentTransactionsTable from "../components/report/RecentTransactionsTable";
import ReportPageHeader from "../components/report/ReportPageHeader";
import ReportSummaryCard from "../components/report/ReportSummaryCard";
import RevenueTrendChart from "../components/report/RevenueTrendChart";
import TopSellingDishes from "../components/report/TopSellingDishes";
import {
  getCategorySales,
  getOrdersByStatus,
  getRecentLargeTransactions,
  getReportSummary,
  getRevenueTrend,
  getTopSellingDishes,
} from "../services/reportApi";
import type {
  CategorySales,
  DateRangeParams,
  OrderStatusReport,
  RecentLargeTransaction,
  ReportSummary,
  RevenueTrendItem,
  TopSellingDish,
} from "../types/report";
import { formatCurrency, formatNumber } from "../utils/reportFormat";

type ReportState = {
  summary?: ReportSummary;
  revenueTrend: RevenueTrendItem[];
  topDishes: TopSellingDish[];
  transactions: RecentLargeTransaction[];
  orderStatuses: OrderStatusReport[];
  categorySales: CategorySales[];
};

type ReportErrors = Partial<Record<keyof ReportState, string>>;

const emptyReportState: ReportState = {
  revenueTrend: [],
  topDishes: [],
  transactions: [],
  orderStatuses: [],
  categorySales: [],
};

const toInputDate = (date: Date) => date.toISOString().slice(0, 10);

const getDefaultDateRange = (): DateRangeParams => {
  const today = new Date();
  const from = new Date(today);
  from.setDate(today.getDate() - 30);

  return {
    from: toInputDate(from),
    to: toInputDate(today),
  };
};

const getErrorMessage = (fallback: string, reason: unknown) => {
  if (reason instanceof Error) {
    return `${fallback}: ${reason.message}`;
  }

  return fallback;
};

type CsvValue = string | number | undefined;

const escapeCsvField = (value?: CsvValue) => {
  const text = value === undefined || value === null ? "" : String(value);

  if (/[",\n\r]/.test(text)) {
    return `"${text.replace(/"/g, '""')}"`;
  }

  return text;
};

const buildCsvSection = (
  title: string,
  headers: string[],
  rows: CsvValue[][]
) => [
  [title],
  headers,
  ...rows,
  [],
];

const buildReportCsv = (
  reportData: ReportState,
  range: DateRangeParams,
  exportedAt: string
) => {
  const sections: CsvValue[][] = [
    ...buildCsvSection("Report Metadata", ["Field", "Value"], [
      ["From", range.from],
      ["To", range.to],
      ["Exported At", exportedAt],
    ]),
    ...buildCsvSection("Summary", ["Metric", "Value"], [
      ["Revenue", reportData.summary?.revenue],
      ["Total Orders", reportData.summary?.totalOrders],
      ["Average Order Value", reportData.summary?.averageOrderValue],
      ["Items Sold", reportData.summary?.totalItemsSold],
      ["Largest Order Amount", reportData.summary?.largestOrderAmount],
    ]),
    ...buildCsvSection(
      "Revenue Trend",
      ["Period", "Revenue", "Order Count"],
      reportData.revenueTrend.map((item) => [
        item.period,
        item.revenue,
        item.orderCount,
      ])
    ),
    ...buildCsvSection(
      "Top Selling Dishes",
      ["Rank", "Product ID", "Dish", "Quantity Sold", "Revenue"],
      reportData.topDishes.map((dish, index) => [
        index + 1,
        dish.productId,
        dish.productName,
        dish.quantitySold,
        dish.revenue,
      ])
    ),
    ...buildCsvSection(
      "Orders By Status",
      ["Status", "Count"],
      reportData.orderStatuses.map((status) => [status.status, status.count])
    ),
    ...buildCsvSection(
      "Category Sales",
      ["Category ID", "Category", "Quantity Sold", "Revenue"],
      reportData.categorySales.map((category) => [
        category.categoryId,
        category.categoryName,
        category.quantitySold,
        category.revenue,
      ])
    ),
    ...buildCsvSection(
      "Recent Large Transactions",
      ["Order ID", "Table", "Status", "Created At", "Total Amount", "Items"],
      reportData.transactions.map((transaction) => [
        transaction.orderId,
        transaction.tableNumber,
        transaction.status,
        transaction.createdAt,
        transaction.totalAmount,
        transaction.items
          ?.map((item) => `${item.productName ?? "Unknown item"} x${item.quantity ?? 0}`)
          .join("; ") ?? "No items",
      ])
    ),
  ];

  return sections
    .map((row) => row.map((field) => escapeCsvField(field)).join(","))
    .join("\r\n");
};

const Home = () => {
  const defaultRange = useMemo(() => getDefaultDateRange(), []);
  const [from, setFrom] = useState(defaultRange.from);
  const [to, setTo] = useState(defaultRange.to);
  const [appliedRange, setAppliedRange] = useState(defaultRange);
  const [data, setData] = useState<ReportState>(emptyReportState);
  const [errors, setErrors] = useState<ReportErrors>({});
  const [loading, setLoading] = useState(false);
  const [menuAnalyticsOpen, setMenuAnalyticsOpen] = useState(false);
  const [menuAnalytics, setMenuAnalytics] = useState<TopSellingDish[]>([]);
  const [menuAnalyticsError, setMenuAnalyticsError] = useState<string>();
  const [menuAnalyticsLoading, setMenuAnalyticsLoading] = useState(false);

  const fetchReports = useCallback(async () => {
    const params = appliedRange;

    setLoading(true);
    setErrors({});

    const [
      summaryResult,
      revenueTrendResult,
      topDishesResult,
      transactionsResult,
      orderStatusesResult,
      categorySalesResult,
    ] = await Promise.allSettled([
      getReportSummary(params),
      getRevenueTrend({ ...params, groupBy: "DAY" }),
      getTopSellingDishes({ ...params, limit: 5, sortBy: "REVENUE" }),
      getRecentLargeTransactions({ ...params, minAmount: 0, limit: 5 }),
      getOrdersByStatus(params),
      getCategorySales(params),
    ]);

    setData({
      summary:
        summaryResult.status === "fulfilled" ? summaryResult.value : undefined,
      revenueTrend:
        revenueTrendResult.status === "fulfilled" ? revenueTrendResult.value : [],
      topDishes:
        topDishesResult.status === "fulfilled" ? topDishesResult.value : [],
      transactions:
        transactionsResult.status === "fulfilled" ? transactionsResult.value : [],
      orderStatuses:
        orderStatusesResult.status === "fulfilled" ? orderStatusesResult.value : [],
      categorySales:
        categorySalesResult.status === "fulfilled" ? categorySalesResult.value : [],
    });

    setErrors({
      ...(summaryResult.status === "rejected" && {
        summary: getErrorMessage("Unable to load summary", summaryResult.reason),
      }),
      ...(revenueTrendResult.status === "rejected" && {
        revenueTrend: getErrorMessage(
          "Unable to load revenue trend",
          revenueTrendResult.reason
        ),
      }),
      ...(topDishesResult.status === "rejected" && {
        topDishes: getErrorMessage(
          "Unable to load top dishes",
          topDishesResult.reason
        ),
      }),
      ...(transactionsResult.status === "rejected" && {
        transactions: getErrorMessage(
          "Unable to load large transactions",
          transactionsResult.reason
        ),
      }),
      ...(orderStatusesResult.status === "rejected" && {
        orderStatuses: getErrorMessage(
          "Unable to load order statuses",
          orderStatusesResult.reason
        ),
      }),
      ...(categorySalesResult.status === "rejected" && {
        categorySales: getErrorMessage(
          "Unable to load category sales",
          categorySalesResult.reason
        ),
      }),
    });

    setLoading(false);
  }, [appliedRange]);

  useEffect(() => {
    const timerId = window.setTimeout(() => {
      void fetchReports();
    }, 0);

    return () => window.clearTimeout(timerId);
  }, [fetchReports]);

  const handleRefresh = () => {
    if (from === appliedRange.from && to === appliedRange.to) {
      void fetchReports();
      return;
    }

    setAppliedRange({ from, to });
  };

  const handleExport = () => {
    const csv = buildReportCsv(data, appliedRange, new Date().toISOString());
    const blob = new Blob([csv], {
      type: "text/csv;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");

    anchor.href = url;
    anchor.download = `report-${appliedRange.from}-to-${appliedRange.to}.csv`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const handleViewAllMenuAnalytics = async () => {
    setMenuAnalyticsOpen(true);
    setMenuAnalyticsLoading(true);
    setMenuAnalyticsError(undefined);

    try {
      const dishes = await getTopSellingDishes({
        ...appliedRange,
        limit: 100,
        sortBy: "REVENUE",
      });

      setMenuAnalytics(dishes);
    } catch (reason) {
      setMenuAnalytics([]);
      setMenuAnalyticsError(
        getErrorMessage("Unable to load menu analytics", reason)
      );
    } finally {
      setMenuAnalyticsLoading(false);
    }
  };

  const summaryError = errors.summary;

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="space-y-8 p-6 xl:p-8">
        <ReportPageHeader
          from={from}
          loading={loading}
          onExport={handleExport}
          onFromChange={setFrom}
          onRefresh={handleRefresh}
          onToChange={setTo}
          to={to}
        />

        {summaryError && (
          <div className="rounded-lg border border-red-100 bg-red-50 p-4 text-sm text-red-600">
            {summaryError}
          </div>
        )}

        <section className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
          <ReportSummaryCard
            helper="Total restaurant revenue"
            icon={<DollarSign size={22} />}
            loading={loading}
            title="Revenue"
            value={formatCurrency(data.summary?.revenue)}
          />
          <ReportSummaryCard
            helper="Orders in selected range"
            icon={<ReceiptText size={22} />}
            loading={loading}
            title="Total Orders"
            tone="warning"
            value={formatNumber(data.summary?.totalOrders)}
          />
          <ReportSummaryCard
            helper="Average value per order"
            icon={<Trophy size={22} />}
            loading={loading}
            title="Average Order Value"
            value={formatCurrency(data.summary?.averageOrderValue)}
          />
          <ReportSummaryCard
            helper="Items sold in selected range"
            icon={<ShoppingBasket size={22} />}
            loading={loading}
            title="Items Sold"
            tone="success"
            value={formatNumber(data.summary?.totalItemsSold)}
          />
        </section>

        <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
          <div className="xl:col-span-2">
            <RevenueTrendChart
              data={data.revenueTrend}
              error={errors.revenueTrend}
              loading={loading}
            />
          </div>
          <TopSellingDishes
            dishes={data.topDishes}
            error={errors.topDishes}
            loading={loading}
            onViewAll={handleViewAllMenuAnalytics}
          />
        </div>

        <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
          <PaymentStatusCard
            error={errors.orderStatuses}
            loading={loading}
            statuses={data.orderStatuses}
          />
          <CategorySalesPanel
            categories={data.categorySales}
            error={errors.categorySales}
            loading={loading}
          />
        </div>

        <RecentTransactionsTable
          error={errors.transactions}
          loading={loading}
          transactions={data.transactions}
        />
      </div>

      {menuAnalyticsOpen && (
        <MenuAnalyticsModal
          dishes={menuAnalytics}
          error={menuAnalyticsError}
          loading={menuAnalyticsLoading}
          onClose={() => setMenuAnalyticsOpen(false)}
        />
      )}
    </div>
  );
};

export default Home;
