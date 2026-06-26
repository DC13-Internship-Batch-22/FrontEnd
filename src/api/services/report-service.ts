import apiClient from "../config/api-client";
import type {
  CategorySales,
  DateRangeParams,
  OrderStatusReport,
  RecentLargeTransaction,
  RecentLargeTransactionsParams,
  ReportSummary,
  RevenueTrendItem,
  RevenueTrendParams,
  TopSellingDish,
  TopSellingDishesParams,
} from "../../types/report";

type ApiObject = Record<string, unknown>;

const isApiObject = (value: unknown): value is ApiObject =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const unwrapData = <T>(payload: unknown): T => {
  if (isApiObject(payload) && "data" in payload) {
    return payload.data as T;
  }

  return payload as T;
};

const unwrapArray = <T>(payload: unknown, preferredKey?: string): T[] => {
  if (Array.isArray(payload)) {
    return payload as T[];
  }

  if (!isApiObject(payload)) {
    return [];
  }

  const keys = [
    preferredKey,
    "data",
    "result",
    "items",
    "content",
    "records",
  ].filter(Boolean) as string[];

  for (const key of keys) {
    const value = payload[key];

    if (Array.isArray(value)) {
      return value as T[];
    }

    if (isApiObject(value)) {
      const nested = unwrapArray<T>(value, preferredKey);
      if (nested.length > 0) {
        return nested;
      }
    }
  }

  return [];
};

export const reportService = {
  async getReportSummary(params: DateRangeParams) {
    const response = await apiClient.get<unknown>("/reports/summary", {
      params,
    });

    return unwrapData<ReportSummary>(response.data);
  },

  async getRevenueTrend(params: RevenueTrendParams) {
    const response = await apiClient.get<unknown>(
      "/reports/revenue-trend",
      { params }
    );

    return unwrapArray<RevenueTrendItem>(response.data, "revenueTrend");
  },

  async getTopSellingDishes(params: TopSellingDishesParams) {
    const response = await apiClient.get<unknown>(
      "/reports/top-selling-dishes",
      { params }
    );

    return unwrapArray<TopSellingDish>(response.data, "topSellingDishes");
  },

  async getRecentLargeTransactions(params: RecentLargeTransactionsParams) {
    const response = await apiClient.get<unknown>(
      "/reports/recent-large-transactions",
      { params }
    );

    return unwrapArray<RecentLargeTransaction>(
      response.data,
      "recentLargeTransactions"
    );
  },

  async getOrdersByStatus(params: DateRangeParams) {
    const response = await apiClient.get<unknown>(
      "/reports/orders-by-status",
      { params }
    );

    return unwrapArray<OrderStatusReport>(response.data, "ordersByStatus");
  },

  async getCategorySales(params: DateRangeParams) {
    const response = await apiClient.get<unknown>(
      "/reports/category-sales",
      { params }
    );

    return unwrapArray<CategorySales>(response.data, "categorySales");
  },
};
