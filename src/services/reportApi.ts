import axios from "axios";
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
} from "../types/report";

const reportClient = axios.create({
  baseURL: "http://localhost:8080",
});

export const getReportSummary = async (params: DateRangeParams) => {
  const response = await reportClient.get<ReportSummary>("/reports/summary", {
    params,
  });

  return response.data;
};

export const getRevenueTrend = async (params: RevenueTrendParams) => {
  const response = await reportClient.get<RevenueTrendItem[]>(
    "/reports/revenue-trend",
    { params }
  );

  return response.data;
};

export const getTopSellingDishes = async (params: TopSellingDishesParams) => {
  const response = await reportClient.get<TopSellingDish[]>(
    "/reports/top-selling-dishes",
    { params }
  );

  return response.data;
};

export const getRecentLargeTransactions = async (
  params: RecentLargeTransactionsParams
) => {
  const response = await reportClient.get<RecentLargeTransaction[]>(
    "/reports/recent-large-transactions",
    { params }
  );

  return response.data;
};

export const getOrdersByStatus = async (params: DateRangeParams) => {
  const response = await reportClient.get<OrderStatusReport[]>(
    "/reports/orders-by-status",
    { params }
  );

  return response.data;
};

export const getCategorySales = async (params: DateRangeParams) => {
  const response = await reportClient.get<CategorySales[]>(
    "/reports/category-sales",
    { params }
  );

  return response.data;
};
