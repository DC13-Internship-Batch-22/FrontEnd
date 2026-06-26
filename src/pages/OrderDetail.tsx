import AddItemDrawer from "@/components/order/AddItemDrawer";
import type { Food } from "@/types/food";
import { formatTime } from "@/utils/formatTime";
import { Check, DollarSign, Plus, SquarePen, Trash, X } from "lucide-react";
import { useState, useEffect } from "react";

interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  unitPrice: number;
}

interface Order {
  orderId: string;
  tableNumber: number;
  status: "pending" | "preparing" | "ready" | "completed" | "cancelled";
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
  totalAmount: number;
}

const MOCK_ORDER: Order = {
  orderId: "ORD-8942",
  tableNumber: 14,
  status: "pending",
  createdAt: new Date(Date.now() - 32 * 60 * 1000).toISOString(),
  updatedAt: new Date(Date.now() - 4 * 60 * 1000).toISOString(),
  items: [
    { id: "1", name: "Prime Ribeye Steak", quantity: 1, unitPrice: 42 },
    { id: "2", name: "Grilled Atlantic Salmon", quantity: 1, unitPrice: 34 },
    { id: "3", name: "Lobster Bisque", quantity: 2, unitPrice: 16 },
    { id: "4", name: "Cabernet Sauvignon", quantity: 2, unitPrice: 24 },
  ],
  totalAmount: 156,
};

function useOrder(orderId: string) {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, _setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    // fetch(`/api/orders/${orderId}`)
    //   .then(r => r.json())
    //   .then(setOrder)
    //   .catch(e => setError(e.message))
    //   .finally(() => setLoading(false));
    const t = setTimeout(() => {
      setOrder({ ...MOCK_ORDER, orderId });
      setLoading(false);
    }, 400);
    return () => clearTimeout(t);
  }, [orderId]);

  return { order, loading, error };
}

const STATUS_CONFIG: Record<Order["status"], { label: string; color: string; bg: string }> = {
  pending: { label: "Pending", color: "text-amber-700", bg: "bg-amber-50 border-amber-200" },
  preparing: { label: "Preparing", color: "text-blue-700", bg: "bg-blue-50  border-blue-200" },
  ready: { label: "Ready", color: "text-green-700", bg: "bg-green-50 border-green-200" },
  completed: { label: "Completed", color: "text-slate-700", bg: "bg-slate-50 border-slate-200" },
  cancelled: { label: "Cancelled", color: "text-red-700", bg: "bg-red-50   border-red-200" },
};

const ItemRow = ({
  item,
  editMode,
  onQtyChange,
  onRemove,
}: {
  item: OrderItem;
  editMode: boolean;
  onQtyChange: (id: string, qty: number) => void;
  onRemove: (id: string) => void;
}) => {
  return (
    <div className="px-5 py-3.5 flex items-center justify-between hover:bg-slate-50/70 transition-colors group">
      <div className="flex items-center gap-3 flex-1 min-w-0">
        {editMode && (
          <button
            onClick={() => onRemove(item.id)}
            className="shrink-0 w-6 h-6 rounded-full bg-red-50 hover:bg-red-100 flex items-center justify-center text-red-400 hover:text-red-600 transition-colors"
            title="Remove item"
          >
            <Trash size={15} />
          </button>
        )}
        <div className="min-w-0">
          <p className="text-sm font-semibold text-slate-900 truncate">{item.name}</p>
          <p className="text-xs text-slate-400">${item.unitPrice.toFixed(2)} each</p>
        </div>
      </div>

      <div className="flex items-center gap-4 shrink-0">
        {editMode ? (
          <div className="flex items-center gap-2">
            <button
              onClick={() => onQtyChange(item.id, item.quantity - 1)}
              className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-700 font-bold text-base leading-none transition-colors"
            >−</button>
            <span className="w-6 text-center text-sm font-bold text-slate-900 tabular-nums">{item.quantity}</span>
            <button
              onClick={() => onQtyChange(item.id, item.quantity + 1)}
              className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-700 font-bold text-base leading-none transition-colors"
            >+</button>
          </div>
        ) : (
          <span className="text-xs text-slate-400 w-12 text-right">× {item.quantity}</span>
        )}
        <p className="text-sm font-bold text-slate-900 w-16 text-right tabular-nums">
          ${(item.unitPrice * item.quantity).toFixed(2)}
        </p>
      </div>
    </div>
  );
}

export default function OrderDetail({ orderId = "ORD-8942" }: { orderId?: string }) {
  const { order: fetchedOrder, loading, error } = useOrder(orderId);
  const [order, setOrder] = useState<Order | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [draftItems, setDraftItems] = useState<OrderItem[]>([]);
  const [addDrawerOpen, setAddDrawerOpen] = useState(false);

  useEffect(() => {
    if (fetchedOrder) setOrder(fetchedOrder);
  }, [fetchedOrder]);

  const enterEdit = () => {
    if (!order) return;
    setDraftItems(order.items.map(i => ({ ...i })));
    setEditMode(true);
  }

  const cancelEdit = () => {
    setEditMode(false);
    setDraftItems([]);
  }

  const saveEdit = () => {
    if (!order) return;
    const items = draftItems.filter(i => i.quantity > 0);
    const totalAmount = items.reduce((s, i) => s + i.unitPrice * i.quantity, 0);
    setOrder({ ...order, items, totalAmount, updatedAt: new Date().toISOString() });
    setEditMode(false);
    setDraftItems([]);
  }

  const updateQty = (id: string, qty: number) => {
    setDraftItems(prev => prev.map(i => i.id === id ? { ...i, quantity: Math.max(1, qty) } : i));
  }

  const removeItem = (id: string) => {
    setDraftItems(prev => prev.filter(i => i.id !== id));
  }

  const handleAddFood = (food: Food, qty: number) => {
    setDraftItems(prev => {
      const existing = prev.find(i => i.id === String(food.id));
      if (existing) {
        return prev.map(i => i.id === String(food.id) ? { ...i, quantity: i.quantity + qty } : i);
      }
      return [...prev, { id: String(food.id), name: food.name, quantity: qty, unitPrice: food.price }];
    });
  }

  const displayItems = editMode ? draftItems : (order?.items ?? []);
  const displayTotal = editMode
    ? draftItems.reduce((s, i) => s + i.unitPrice * i.quantity, 0)
    : (order?.totalAmount ?? 0);

  const existingIds = new Set(draftItems.map(i => i.id));

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

  if (error || !order) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <p className="text-red-600 text-sm">{error ?? "Order not found."}</p>
      </div>
    );
  }

  const status = STATUS_CONFIG[order.status];

  console.log("DEBUG-0: ", addDrawerOpen);
  console.log("DEBUG-0.2: ", existingIds);

  return (
    <div className="min-h-screen bg-slate-50 p-6 font-['Inter',sans-serif]">
      <div className="flex items-end justify-between mb-6 max-w-5xl mx-auto">
        <div>
          <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
            <a href="/order" className="hover:text-blue-600 transition-colors">Orders</a>
            <span>›</span>
            <span className="text-blue-600 font-semibold">#{order.orderId}</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Order Details</h1>
        </div>

        {!editMode ? (
          <button
            onClick={enterEdit}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 text-sm font-semibold hover:bg-slate-50 active:scale-95 transition-all shadow-sm"
          >
            <SquarePen />
            Edit Order
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={cancelEdit}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-600 text-sm font-semibold hover:bg-slate-50 active:scale-95 transition-all"
            >
              <X />
              Cancel
            </button>
            <button
              onClick={saveEdit}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 active:scale-95 transition-all shadow-sm"
            >
              <Check />
              Save Changes
            </button>
          </div>
        )}
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
                displayItems.map(item => (
                  <ItemRow
                    key={item.id}
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

          <button className="w-full py-3.5 rounded-2xl bg-blue-600 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-200 hover:bg-blue-700 active:scale-95 transition-all">
            <DollarSign />
            Proceed to Payment
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
