import { queryClient } from "@/api/config/query-client";
import { useDeleteOrder, useOrdersPaged } from "@/api/hooks";
import DeleteConfirmDialog from "@/components/order/DeleteConfirmDialog";
import Pagination from "@/components/order/Pagination";
import type { Order, OrderStatus } from "@/types/order";
import { formatTime } from "@/utils/formatTime";
import { Eye, Inbox, RefreshCw, Search, Trash2, X } from "lucide-react";
import { useState, useRef } from "react";
import { Link } from "react-router-dom";

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

function StatusBadge({ status }: { status: OrderStatus }) {
  if (status === "CONFIRMED") {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold tracking-wide border border-emerald-200">
        <span className="w-2 h-2 rounded-full bg-emerald-500" />
        Comfirmed
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

type FilterTab = 'ALL' | OrderStatus;
const TABS: FilterTab[] = ['ALL', 'PENDING', 'CONFIRMED'];

export default function OrdersList() {
  const [activeFilter, setActiveFilter] = useState<FilterTab>('ALL');
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [deleteTarget, setDeleteTarget] = useState<Order | null>(null);

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { data, isFetching } = useOrdersPaged({
    page: page - 1,
    size: pageSize,
    orderId: search || undefined,
    status: activeFilter && activeFilter !== "ALL" ? activeFilter : undefined,
  });

  const orders: Order[] = data?.items ?? [];
  const total = data?.totalCount ?? 0;
  const totalPages = data?.totalPage ?? 1;

  const { mutate: deleteOrder, isPending: deleting } = useDeleteOrder();

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
    deleteOrder(deleteTarget.order_id, {
      onSuccess: () => setDeleteTarget(null),
    });
  };

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ['orders'] });
  };

  const skeletonCount = pageSize;

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {deleteTarget && (
        <DeleteConfirmDialog
          orderId={deleteTarget.order_id}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeleteTarget(null)}
          loading={deleting}
        />
      )}

      <main className="max-w-6xl mx-auto px-6 py-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">List Orders</h1>
            <p className="text-sm text-slate-500 mt-0.5">Real-time status of all current floor transactions.</p>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
          <div className="flex items-center gap-2 px-5 py-3 border-b border-slate-200 bg-white">
            <div className="relative flex-1 min-w-0">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Search by order ID..."
                value={searchInput}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full pl-9 pr-8 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/30 focus:bg-white placeholder:text-slate-400 transition"
              />
              {searchInput && (
                <button
                  onClick={() => { setSearchInput(""); setSearch(""); setPage(1); }}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"
                >
                  <X size={15} />
                </button>
              )}
            </div>

            <div className="h-6 w-px bg-slate-200 flex-shrink-0" />

            <div className="flex bg-slate-100 p-0.5 rounded-lg border border-slate-200 flex-shrink-0">
              {TABS.map((tab) => (
                <button
                  key={tab}
                  onClick={() => handleFilterChange(tab)}
                  className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${activeFilter === tab
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
              disabled={isFetching}
              title="Refresh"
              className="flex-shrink-0 flex items-center gap-1.5 px-3 h-8 rounded-lg text-xs font-semibold text-slate-600 bg-slate-50 border border-slate-200 hover:bg-slate-100 transition-colors disabled:opacity-50"
            >
              <RefreshCw size={15} className={`${isFetching ? "animate-spin" : ""}`} />
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
                      className={`px-5 py-3 text-[11px] font-semibold text-slate-400 uppercase tracking-widest whitespace-nowrap ${h === "Actions" ? "text-right" : ""
                        }`}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {isFetching ? (
                  Array.from({ length: skeletonCount }).map((_, i) => (
                    <SkeletonRow key={i} />
                  ))
                ) : orders.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ height: `${skeletonCount * 53}px` }}>
                      <div className="flex flex-col items-center justify-center h-full gap-2 text-slate-400">
                        <Inbox size={40} />
                        <span className="text-sm">No orders found.</span>
                      </div>
                    </td>
                  </tr>
                ) : (
                  <>
                    {orders.map((order) => (
                      <tr key={order.order_id} className={`hover:bg-slate-50 transition-colors group ${ROW_HEIGHT_CLASS}`}>
                        <td className="px-5 py-3.5 text-sm font-bold text-slate-800 whitespace-nowrap">{order.order_id}</td>
                        <td className="px-5 py-3.5">
                          <span className="inline-flex items-center justify-center px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 text-xs font-bold border border-slate-200">
                            {order.tableNumber}
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
                          <StatusBadge status={order.orderStatus} />
                        </td>
                        <td className="px-5 py-3.5 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Link
                              to={`/order/${order.order_id}`}
                              className="text-blue-600 hover:bg-blue-50 p-1.5 rounded-lg transition-colors inline-flex items-center justify-center"
                              title="View order"
                            >
                              <Eye size={15} />
                            </Link>
                            <button
                              onClick={() => setDeleteTarget(order)}
                              className="text-red-400 hover:bg-red-50 hover:text-red-600 p-1.5 rounded-lg transition-colors"
                              title="Delete order"
                            >
                              <Trash2 size={15} />
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
              {isFetching
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
