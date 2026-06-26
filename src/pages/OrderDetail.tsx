import { useOrder, useUpdateOrderItems, useUpdateOrderStatus } from "@/api/hooks";
import AddItemDrawer from "@/components/order/AddItemDrawer";
import ItemRow from "@/components/order/ItemRow";
import type { Food } from "@/types/food";
import type { Order, OrderItem, OrderStatus } from "@/types/order";
import { formatTime } from "@/utils/formatTime";
import { Check, DollarSign, Loader2, Plus, SquarePen, X } from "lucide-react";
import { useState } from "react";
import { Link, useParams } from "react-router-dom";

const STATUS_CONFIG: Record<Order["orderStatus"], { label: string; color: string; bg: string }> = {
  PENDING: { label: "Pending", color: "text-amber-700", bg: "bg-amber-50 border-amber-200" },
  CONFIRMED: { label: "Completed", color: "text-slate-700", bg: "bg-slate-50 border-slate-200" },
};

export default function OrderDetail() {
  const { id } = useParams();
  const orderId = Number(id);

  const { data: order, isFetching: loading, error, isError } = useOrder(orderId);
  const { mutate: updateItems, isPending: saving } = useUpdateOrderItems(orderId);
  const { mutate: updateStatus, isPending: confirming } = useUpdateOrderStatus(orderId);

  const [editMode, setEditMode] = useState(false);
  const [draftItems, setDraftItems] = useState<OrderItem[]>([]);
  const [addDrawerOpen, setAddDrawerOpen] = useState(false);

  const enterEdit = () => {
    if (!order) return;
    setDraftItems(order.items.map((i: OrderItem) => ({ ...i })));
    setEditMode(true);
  }

  const cancelEdit = () => {
    setEditMode(false);
    setDraftItems([]);
  }

  const saveEdit = () => {
    if (!order) return;
    const items = draftItems
      .filter(i => i.quantity > 0)
      .map(i => ({ productId: i.productId, quantity: i.quantity }));
    updateItems(items, {
      onSuccess: () => {
        setEditMode(false);
        setDraftItems([]);
      }
    })
  }

  const updateQty = (id: number, qty: number) => {
    setDraftItems(prev => prev.map(i => i.productId === id ? { ...i, quantity: Math.max(1, qty) } : i));
  }

  const removeItem = (id: number) => {
    setDraftItems(prev => prev.filter(i => i.productId !== id));
  }

  const handleAddFood = (food: Food, qty: number) => {
    setDraftItems(prev => {
      const existing = prev.find(i => i.productId === food.id);
      if (existing) {
        return prev.map(i =>
          i.productId === food.id
            ? { ...i, quantity: i.quantity + qty }
            : i
        );
      }
      return [...prev, {
        productId: food.id,
        productName: food.name,
        quantity: qty,
        price: food.price
      }];
    });
  }

  const handleProceedToPayment = () => {
    updateStatus('CONFIRMED');
  }

  const displayItems = editMode ? draftItems : (order?.items ?? []);
  const displayTotal = editMode
    ? draftItems.reduce((s, i) => s + i.price * i.quantity, 0)
    : (order?.totalAmount ?? 0);

  const existingIds = new Set(draftItems.map(i => i.productId));

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-slate-500">Loading order…</p>
        </div>
      </div>
    );
  }

  if (isError || !order) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <p className="text-red-600 text-sm">{error?.message ?? "Order not found."}</p>
      </div>
    );
  }

  const status = STATUS_CONFIG[order.orderStatus as OrderStatus];

  return (
    <div className="min-h-screen bg-slate-50 p-6 font-['Inter',sans-serif]">
      <div className="mb-6 max-w-5xl mx-auto space-y-3">
        <div className="flex items-center gap-2 text-sm text-slate-400">
          <Link to="/order" className="hover:text-blue-600 transition-colors font-medium">
            Orders
          </Link>
          <span>/</span>
          <span className="text-blue-600 font-semibold">#{order.order_id}</span>
        </div>

        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Order Details</h1>

          {!editMode ? (
            <button
              onClick={enterEdit}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 text-sm font-semibold hover:bg-slate-50 active:scale-95 transition-all shadow-sm"
            >
              <SquarePen size={16} />
              Edit Order
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={cancelEdit}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-600 text-sm font-semibold hover:bg-slate-50 active:scale-95 transition-all"
              >
                <X size={16} />
                Cancel
              </button>
              <button
                onClick={saveEdit}
                disabled={saving}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 active:scale-95 transition-all shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {saving ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-5xl mx-auto grid grid-cols-12 gap-5">

        <div className="col-span-12 lg:col-span-8">
          <div className={`bg-white rounded-2xl border shadow-sm overflow-hidden transition-colors ${editMode ? "border-blue-300 ring-2 ring-blue-100" : "border-slate-200"}`}>

            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900">
                  Items
                  <span className="ml-2 text-sm font-normal text-slate-400">({displayItems.length})</span>
                </h2>
                {editMode && (
                  <span className="text-[11px] font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                    Editing
                  </span>
                )}
              </div>
              {editMode && (
                <button
                  onClick={() => setAddDrawerOpen(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 active:scale-95 transition-all"
                >
                  <Plus />
                  Add Item
                </button>
              )}
            </div>

            <div className="divide-y divide-slate-100">
              {displayItems.length === 0 ? (
                <div className="py-10 flex flex-col items-center text-slate-400 gap-2">
                  <p className="text-sm">No items in this order</p>
                  {editMode && (
                    <button
                      onClick={() => setAddDrawerOpen(true)}
                      className="text-xs text-blue-600 font-semibold hover:underline"
                    >
                      + Add the first item
                    </button>
                  )}
                </div>
              ) : (
                displayItems.map((item: OrderItem) => (
                  <ItemRow
                    key={item.productId}
                    item={item}
                    editMode={editMode}
                    onQtyChange={updateQty}
                    onRemove={removeItem}
                  />
                ))
              )}
            </div>

            <div className="px-5 py-4 bg-slate-50 border-t border-slate-200 flex justify-between items-center">
              <span className="text-sm font-semibold text-slate-500">Total</span>
              <span className="text-xl font-black text-blue-700">${displayTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-4 space-y-4">

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Order Status</p>
            <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm font-semibold mb-4 ${status.bg} ${status.color}`}>
              <span className="w-1.5 h-1.5 rounded-full bg-current" />
              {status.label}
            </div>
            <div className="space-y-2.5">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Order time</span>
                <span className="font-semibold text-slate-900">{formatTime(order.createdAt)}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Table</p>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center text-white font-black text-lg shrink-0">
                {order.tableNumber}
              </div>
              <p className="text-xl font-black text-slate-900 leading-none">Table #{order.tableNumber}</p>
            </div>
          </div>

          <button
            onClick={handleProceedToPayment}
            disabled={confirming || order.orderStatus === 'CONFIRMED'}
            className="w-full py-3.5 rounded-2xl bg-blue-600 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-200 hover:bg-blue-700 active:scale-95 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {confirming ? <Loader2 className="animate-spin" /> : <DollarSign />}
            {confirming ? 'Processing...' : order.orderStatus === 'CONFIRMED' ? 'Already Confirmed' : 'Proceed to Payment'}
          </button>
        </div>
      </div>

      {addDrawerOpen && (
        <AddItemDrawer
          existingIds={existingIds}
          onAdd={handleAddFood}
          onClose={() => setAddDrawerOpen(false)}
        />
      )}
    </div>
  );
}
