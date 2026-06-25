import { useState, useEffect, useCallback, useRef } from "react";

export type OrderStatus = "Paid" | "Pending";

export interface Order {
  id: string;
  table: string;
  createdAt: string;
  totalAmount: number;
  status: OrderStatus;
}

export interface OrderStats {
  totalOrders: number;
  pending: number;
  completed: number;
  todayRevenue: number;
}

export interface FetchOrdersParams {
  page: number;
  pageSize: number;
  status?: OrderStatus | "All";
  search?: string;
}

export interface FetchOrdersResult {
  orders: Order[];
  total: number;
}

function timeAgo(isoDate: string): string {
  const diff = Math.floor((Date.now() - new Date(isoDate).getTime()) / 1000);
  if (diff < 10) return "Just now";
  if (diff < 60) return `${diff}s ago`;
  const mins = Math.floor(diff / 60);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

function formatTime(isoDate: string): string {
  return new Date(isoDate).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

const ALL_MOCK_ORDERS: Order[] = Array.from({ length: 42 }, (_, i) => {
  const statuses: OrderStatus[] = ["Paid", "Pending", "Pending", "Pending"];
  const tables = ["T-01", "T-02", "T-04", "T-07", "T-08", "T-14", "T-18", "T-22", "T-25", "T-30"];
  const minutesAgo = i * 3 + Math.floor(Math.random() * 5);
  return {
    id: `#ORD-${4592 + i}`,
    table: tables[i % tables.length],
    createdAt: new Date(Date.now() - minutesAgo * 60 * 1000).toISOString(),
    totalAmount: Math.round((20 + Math.random() * 280) * 100) / 100,
    status: statuses[i % statuses.length],
  };
});

async function fetchOrders(params: FetchOrdersParams): Promise<FetchOrdersResult> {
  // const query = new URLSearchParams({
  //   page: String(params.page),
  //   pageSize: String(params.pageSize),
  //   ...(params.status && params.status !== "All" ? { status: params.status } : {}),
  //   ...(params.search ? { search: params.search } : {}),
  // });
  // const res = await fetch(`/api/orders?${query}`);
  // return res.json();

  await new Promise((r) => setTimeout(r, 700));

  const filtered = ALL_MOCK_ORDERS.filter((o) => {
    const matchStatus = !params.status || params.status === "All" || o.status === params.status;
    const matchSearch =
      !params.search ||
      o.id.toLowerCase().includes(params.search.toLowerCase()) ||
      o.table.toLowerCase().includes(params.search.toLowerCase());
    return matchStatus && matchSearch;
  });

  const total = filtered.length;
  const start = (params.page - 1) * params.pageSize;
  const orders = filtered.slice(start, start + params.pageSize);
  return { orders, total };
}

async function fetchStats(): Promise<OrderStats> {
  // const res = await fetch("/api/orders/stats");
  // return res.json();
  await new Promise((r) => setTimeout(r, 400));
  return { totalOrders: 42, pending: 12, completed: 30, todayRevenue: 2481.5 };
}

async function deleteOrder(_id: string): Promise<void> {
  // await fetch(`/api/orders/${_id}`, { method: "DELETE" });
  await new Promise((r) => setTimeout(r, 400));
}

function buildDetailUrl(orderId: string): string {
  const base = window.location.pathname.replace(/\/$/, "");
  const cleanId = orderId.replace(/^#/, "");
  return `${base}/${cleanId}`;
}

function StatusBadge({ status }: { status: OrderStatus }) {
  if (status === "Paid") {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold tracking-wide border border-emerald-200">
        <span className="w-2 h-2 rounded-full bg-emerald-500" />
        Paid
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-semibold tracking-wide border border-amber-200">
      <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
      Pending
    </span>
  );
}

const ROW_HEIGHT_CLASS = "h-[53px]";

function SkeletonRow() {
  return (
    <tr className={`animate-pulse ${ROW_HEIGHT_CLASS}`}>
      <td className="px-5 py-3.5"><div className="h-3.5 bg-slate-200 rounded w-24" /></td>
      <td className="px-5 py-3.5"><div className="h-6 bg-slate-200 rounded w-12" /></td>
      <td className="px-5 py-3.5"><div className="h-3.5 bg-slate-200 rounded w-40" /></td>
      <td className="px-5 py-3.5"><div className="h-3.5 bg-slate-200 rounded w-20" /></td>
      <td className="px-5 py-3.5"><div className="h-6 bg-slate-200 rounded-full w-20" /></td>
      <td className="px-5 py-3.5">
        <div className="flex justify-end gap-1">
          <div className="h-7 w-7 bg-slate-200 rounded-lg" />
          <div className="h-7 w-7 bg-slate-200 rounded-lg" />
        </div>
      </td>
    </tr>
  );
}

function StatCard({
  icon,
  iconBg,
  label,
  value,
  loading,
}: {
  icon: React.ReactNode;
  iconBg: string;
  label: string;
  value: string;
  loading?: boolean;
}) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 flex items-center gap-3 shadow-sm">
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${iconBg}`}>
        {icon}
      </div>
      <div>
        <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">{label}</p>
        {loading ? (
          <div className="mt-1 h-6 w-16 bg-slate-200 rounded animate-pulse" />
        ) : (
          <p className="text-xl font-extrabold text-slate-800 leading-tight tabular-nums">{value}</p>
        )}
      </div>
    </div>
  );
}

function DeleteConfirmDialog({
  orderId,
  onConfirm,
  onCancel,
  loading,
}: {
  orderId: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading: boolean;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm mx-4">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
            </svg>
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-800">Delete order {orderId}?</h3>
            <p className="text-sm text-slate-500 mt-1">
              This action cannot be undone. The order will be permanently removed.
            </p>
          </div>
        </div>
        <div className="flex gap-2 mt-5 justify-end">
          <button
            onClick={onCancel}
            disabled={loading}
            className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="px-4 py-2 rounded-lg text-xs font-semibold text-white bg-red-600 hover:bg-red-700 transition-colors disabled:opacity-60 flex items-center gap-1.5"
          >
            {loading && (
              <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
            )}
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

function buildPageList(page: number, totalPages: number): (number | "…")[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }
  if (page <= 3) {
    return [1, 2, 3, 4, "…", totalPages - 1, totalPages];
  } else if (page >= totalPages - 2) {
    return [1, 2, "…", totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
  } else {
    return [1, "…", page - 1, page, page + 1, "…", totalPages];
  }
}

function PaginationBtn({
  children,
  active,
  disabled,
  onClick,
  title,
}: {
  children: React.ReactNode;
  active?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  title?: string;
}) {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      title={title}
      className={`w-8 h-8 flex items-center justify-center rounded-md text-xs font-semibold transition-colors disabled:opacity-30 disabled:cursor-not-allowed ${
        active ? "bg-blue-600 text-white shadow-sm" : "text-slate-500 hover:bg-slate-200"
      }`}
    >
      {children}
    </button>
  );
}

function Pagination({
  page,
  totalPages,
  pageSize,
  onPageChange,
  onPageSizeChange,
}: {
  page: number;
  totalPages: number;
  pageSize: number;
  onPageChange: (p: number) => void;
  onPageSizeChange: (s: number) => void;
}) {
  const pages = buildPageList(page, totalPages);
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3 bg-slate-50 border-t border-slate-200">
      <div className="flex items-center gap-2">
        <span className="text-xs text-slate-400">Rows per page</span>
        <select
          value={pageSize}
          onChange={(e) => onPageSizeChange(Number(e.target.value))}
          className="text-xs font-semibold text-slate-600 bg-white border border-slate-200 rounded-md px-2 py-1 outline-none focus:ring-2 focus:ring-blue-500/30"
        >
          {[5, 10, 20, 50].map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>
      <div className="flex items-center gap-1">
        <PaginationBtn onClick={() => onPageChange(1)} disabled={page === 1} title="First page">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7M18 19l-7-7 7-7" />
          </svg>
        </PaginationBtn>
        <PaginationBtn onClick={() => onPageChange(page - 1)} disabled={page === 1} title="Previous page">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </PaginationBtn>
        {pages.map((p, i) =>
          p === "…" ? (
            <span key={`ell-${i}`} className="w-8 text-center text-xs text-slate-400 select-none">…</span>
          ) : (
            <PaginationBtn key={p} active={p === page} onClick={() => onPageChange(p as number)}>
              {p}
            </PaginationBtn>
          )
        )}
        <PaginationBtn onClick={() => onPageChange(page + 1)} disabled={page === totalPages} title="Next page">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </PaginationBtn>
        <PaginationBtn onClick={() => onPageChange(totalPages)} disabled={page === totalPages} title="Last page">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M6 5l7 7-7 7" />
          </svg>
        </PaginationBtn>
      </div>
    </div>
  );
}

type FilterTab = "All" | OrderStatus;
const TABS: FilterTab[] = ["All", "Pending", "Paid"];

export default function OrdersList() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [total, setTotal] = useState(0);
  const [stats, setStats] = useState<OrderStats | null>(null);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [loadingStats, setLoadingStats] = useState(true);

  const [activeFilter, setActiveFilter] = useState<FilterTab>("All");
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const [deleteTarget, setDeleteTarget] = useState<Order | null>(null);
  const [deleting, setDeleting] = useState(false);

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const loadOrders = useCallback(async () => {
    setLoadingOrders(true);
    try {
      const result = await fetchOrders({ page, pageSize, status: activeFilter, search });
      setOrders(result.orders);
      setTotal(result.total);
    } finally {
      setLoadingOrders(false);
    }
  }, [page, pageSize, activeFilter, search]);

  const loadStats = useCallback(async () => {
    setLoadingStats(true);
    try {
      setStats(await fetchStats());
    } finally {
      setLoadingStats(false);
    }
  }, []);

  useEffect(() => { loadOrders(); }, [loadOrders]);
  useEffect(() => { loadStats(); }, [loadStats]);

  const handleSearchChange = (val: string) => {
    setSearchInput(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setSearch(val);
      setPage(1);
    }, 400);
  };

  const handleFilterChange = (tab: FilterTab) => {
    setActiveFilter(tab);
    setPage(1);
  };

  const handlePageSizeChange = (s: number) => {
    setPageSize(s);
    setPage(1);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteOrder(deleteTarget.id);
      setDeleteTarget(null);
      await loadOrders();
      await loadStats();
    } finally {
      setDeleting(false);
    }
  };

  const handleRefresh = () => {
    loadOrders();
    loadStats();
  };

  const skeletonCount = pageSize;

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {deleteTarget && (
        <DeleteConfirmDialog
          orderId={deleteTarget.id}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeleteTarget(null)}
          loading={deleting}
        />
      )}

      <main className="max-w-6xl mx-auto px-6 py-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">List Orders</h1>
            <p className="text-sm text-slate-500 mt-0.5">Real-time status of all current floor transactions.</p>
          </div>
          <button className="self-start sm:self-auto bg-blue-600 text-white px-4 h-9 rounded-lg text-xs font-bold flex items-center gap-1.5 hover:bg-blue-700 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Order
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard
            icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>}
            iconBg="bg-blue-50 text-blue-600" label="Total Orders"
            value={stats ? String(stats.totalOrders) : ""} loading={loadingStats}
          />
          <StatCard
            icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
            iconBg="bg-amber-50 text-amber-600" label="Pending"
            value={stats ? String(stats.pending) : ""} loading={loadingStats}
          />
          <StatCard
            icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
            iconBg="bg-emerald-50 text-emerald-600" label="Completed"
            value={stats ? String(stats.completed) : ""} loading={loadingStats}
          />
          <StatCard
            icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
            iconBg="bg-blue-50 text-blue-600" label="Today's Revenue"
            value={stats ? `$${stats.todayRevenue.toLocaleString("en-US", { minimumFractionDigits: 2 })}` : ""}
            loading={loadingStats}
          />
        </div>

        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
          <div className="flex items-center gap-2 px-5 py-3 border-b border-slate-200 bg-white">
            <div className="relative flex-1 min-w-0">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search by order ID or table…"
                value={searchInput}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full pl-9 pr-8 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/30 focus:bg-white placeholder:text-slate-400 transition"
              />
              {searchInput && (
                <button
                  onClick={() => { setSearchInput(""); setSearch(""); setPage(1); }}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>

            <div className="h-6 w-px bg-slate-200 flex-shrink-0" />

            <div className="flex bg-slate-100 p-0.5 rounded-lg border border-slate-200 flex-shrink-0">
              {TABS.map((tab) => (
                <button
                  key={tab}
                  onClick={() => handleFilterChange(tab)}
                  className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                    activeFilter === tab
                      ? "bg-white shadow-sm text-blue-600"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="h-6 w-px bg-slate-200 flex-shrink-0" />

            <button
              onClick={handleRefresh}
              disabled={loadingOrders}
              title="Refresh"
              className="flex-shrink-0 flex items-center gap-1.5 px-3 h-8 rounded-lg text-xs font-semibold text-slate-600 bg-slate-50 border border-slate-200 hover:bg-slate-100 transition-colors disabled:opacity-50"
            >
              <svg
                className={`w-3.5 h-3.5 ${loadingOrders ? "animate-spin" : ""}`}
                fill="none" stroke="currentColor" viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  {["Order ID", "Table", "Created Time", "Total Amount", "Status", "Actions"].map((h) => (
                    <th
                      key={h}
                      className={`px-5 py-3 text-[11px] font-semibold text-slate-400 uppercase tracking-widest whitespace-nowrap ${
                        h === "Actions" ? "text-right" : ""
                      }`}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loadingOrders ? (
                  Array.from({ length: skeletonCount }).map((_, i) => (
                    <SkeletonRow key={i} />
                  ))
                ) : orders.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ height: `${skeletonCount * 53}px` }}>
                      <div className="flex flex-col items-center justify-center h-full gap-2 text-slate-400">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        <span className="text-sm">No orders found.</span>
                      </div>
                    </td>
                  </tr>
                ) : (
                  <>
                    {orders.map((order) => (
                      <tr key={order.id} className={`hover:bg-slate-50 transition-colors group ${ROW_HEIGHT_CLASS}`}>
                        <td className="px-5 py-3.5 text-sm font-bold text-slate-800 whitespace-nowrap">{order.id}</td>
                        <td className="px-5 py-3.5">
                          <span className="inline-flex items-center justify-center px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 text-xs font-bold border border-slate-200">
                            {order.table}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-sm text-slate-500 whitespace-nowrap">
                          {formatTime(order.createdAt)}{" "}
                          <span className="text-[11px] text-slate-400">({timeAgo(order.createdAt)})</span>
                        </td>
                        <td className="px-5 py-3.5 text-sm font-bold text-slate-800 tabular-nums whitespace-nowrap">
                          ${order.totalAmount.toFixed(2)}
                        </td>
                        <td className="px-5 py-3.5">
                          <StatusBadge status={order.status} />
                        </td>
                        <td className="px-5 py-3.5 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <a
                              href={buildDetailUrl(order.id)}
                              className="text-blue-600 hover:bg-blue-50 p-1.5 rounded-lg transition-colors inline-flex items-center justify-center"
                              title="View order"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                            </a>
                            <button
                              onClick={() => setDeleteTarget(order)}
                              className="text-red-400 hover:bg-red-50 hover:text-red-600 p-1.5 rounded-lg transition-colors"
                              title="Delete order"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {orders.length < pageSize &&
                      Array.from({ length: pageSize - orders.length }).map((_, i) => (
                        <tr key={`pad-${i}`} className={ROW_HEIGHT_CLASS}>
                          <td colSpan={6} />
                        </tr>
                      ))}
                  </>
                )}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-5 py-3 bg-slate-50 border-t border-slate-200">
            <p className="text-xs text-slate-400 order-last sm:order-first">
              {loadingOrders
                ? "Loading…"
                : `Showing ${total === 0 ? 0 : (page - 1) * pageSize + 1}–${Math.min(page * pageSize, total)} of ${total} orders`}
            </p>
            <Pagination
              page={page}
              totalPages={totalPages}
              pageSize={pageSize}
              onPageChange={setPage}
              onPageSizeChange={handlePageSizeChange}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
