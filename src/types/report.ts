export type DateRangeParams = {
  from: string;
  to: string;
};

export type RevenueTrendGroupBy = "HOUR" | "DAY" | "WEEK" | "MONTH";

export type TopSellingSortBy = "QUANTITY" | "REVENUE";

export type OrderStatus = "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED";

export type ReportSummary = {
  revenue?: number;
  totalOrders?: number;
  averageOrderValue?: number;
  totalItemsSold?: number;
  largestOrderAmount?: number;
};

export type RevenueTrendItem = {
  period?: string;
  revenue?: number;
  orderCount?: number;
};

export type TopSellingDish = {
  productId?: number;
  productName?: string;
  quantitySold?: number;
  revenue?: number;
};

export type OrderItem = {
  productId?: number;
  productName?: string;
  quantity?: number;
  price?: number;
};

export type RecentLargeTransaction = {
  orderId?: number;
  tableNumber?: string;
  totalAmount?: number;
  status?: OrderStatus;
  createdAt?: string;
  items?: OrderItem[];
};

export type OrderStatusReport = {
  status?: OrderStatus;
  count?: number;
};

export type CategorySales = {
  categoryId?: number;
  categoryName?: string;
  quantitySold?: number;
  revenue?: number;
};

export type RevenueTrendParams = DateRangeParams & {
  groupBy: RevenueTrendGroupBy;
};

export type TopSellingDishesParams = DateRangeParams & {
  limit: number;
  sortBy: TopSellingSortBy;
};

export type RecentLargeTransactionsParams = DateRangeParams & {
  minAmount: number;
  limit: number;
};
