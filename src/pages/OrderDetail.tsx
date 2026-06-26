import { useState, useEffect, useRef } from "react";

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

interface FoodItem {
  id: number;
  name: string;
  price: number;
  imageUrl: string;
  status: "AVAILABLE" | string;
  categoryId: number;
  categoryName: string;
  createdAt: string;
  updatedAt: string;
}

const MOCK_ORDER: Order = {
  orderId: "ORD-8942",
  tableNumber: 14,
  status: "pending",
  createdAt: new Date(Date.now() - 32 * 60 * 1000).toISOString(),
  updatedAt: new Date(Date.now() - 4 * 60 * 1000).toISOString(),
  items: [
    { id: "1", name: "Prime Ribeye Steak",     quantity: 1, unitPrice: 42 },
    { id: "2", name: "Grilled Atlantic Salmon", quantity: 1, unitPrice: 34 },
    { id: "3", name: "Lobster Bisque",          quantity: 2, unitPrice: 16 },
    { id: "4", name: "Cabernet Sauvignon",      quantity: 2, unitPrice: 24 },
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

function useFoods(enabled: boolean) {
  const [foods, setFoods] = useState<FoodItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled) return;
    setLoading(true);

    fetch("http://localhost:8080/foods")
      .then(r => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((data: FoodItem[]) => setFoods(data))
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));

    // const t = setTimeout(() => {
    //   setFoods(MOCK_FOODS);
    //   setLoading(false);
    // }, 300);
    // return () => clearTimeout(t);
  }, [enabled]);

  return { foods, loading, error };
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });
}

function useElapsed(iso: string) {
  const [elapsed, setElapsed] = useState("");
  useEffect(() => {
    function calc() {
      const d = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
      if (d < 60) return `${d}s`;
      if (d < 3600) return `${Math.floor(d / 60)}m ${d % 60}s`;
      return `${Math.floor(d / 3600)}h ${Math.floor((d % 3600) / 60)}m`;
    }
    setElapsed(calc());
    const id = setInterval(() => setElapsed(calc()), 1000);
    return () => clearInterval(id);
  }, [iso]);
  return elapsed;
}

function useLastUpdated(iso: string) {
  const [label, setLabel] = useState("");
  useEffect(() => {
    function calc() {
      const d = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
      if (d < 60) return `${d}s ago`;
      if (d < 3600) return `${Math.floor(d / 60)}m ago`;
      return `${Math.floor(d / 3600)}h ago`;
    }
    setLabel(calc());
    const id = setInterval(() => setLabel(calc()), 10000);
    return () => clearInterval(id);
  }, [iso]);
  return label;
}

const STATUS_CONFIG: Record<Order["status"], { label: string; color: string; bg: string }> = {
  pending:   { label: "Pending",   color: "text-amber-700", bg: "bg-amber-50 border-amber-200"  },
  preparing: { label: "Preparing", color: "text-blue-700",  bg: "bg-blue-50  border-blue-200"   },
  ready:     { label: "Ready",     color: "text-green-700", bg: "bg-green-50 border-green-200"  },
  completed: { label: "Completed", color: "text-slate-700", bg: "bg-slate-50 border-slate-200"  },
  cancelled: { label: "Cancelled", color: "text-red-700",   bg: "bg-red-50   border-red-200"    },
};

const IconEdit = () => (
  <svg width="14" height="14" viewBox="0 0 15 15" fill="none">
    <path d="M11.5 1.5l2 2-9 9H2.5v-2l9-9z" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const IconCheck = () => (
  <svg width="14" height="14" viewBox="0 0 15 15" fill="none">
    <path d="M2.5 8l4 4 6-7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const IconTrash = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
    <path d="M2 4h12M5 4V2.5h6V4M6 7v5M10 7v5M3 4l1 9h8l1-9" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const IconPlus = () => (
  <svg width="14" height="14" viewBox="0 0 15 15" fill="none">
    <path d="M7.5 2v11M2 7.5h11" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
  </svg>
);
const IconX = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M12 4L4 12M4 4l8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);
const IconSearch = () => (
  <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
    <circle cx="6.5" cy="6.5" r="4.5" stroke="currentColor" strokeWidth="1.3"/>
    <path d="M10.5 10.5l3 3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
  </svg>
);
const IconCard = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
    <rect x="2" y="5" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="1.8"/>
    <path d="M2 10h20" stroke="currentColor" strokeWidth="1.8"/>
  </svg>
);

function AddItemDrawer({
  existingIds,
  onAdd,
  onClose,
}: {
  existingIds: Set<string>;
  onAdd: (food: FoodItem, qty: number) => void;
  onClose: () => void;
}) {
  const { foods, loading, error } = useFoods(true);
  const [search, setSearch] = useState("");
  const [quantities, setQuantities] = useState<Record<number, number>>({});
  const drawerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (drawerRef.current && !drawerRef.current.contains(e.target as Node)) onClose();
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);

  const available = foods.filter(f => f.status === "AVAILABLE");
  const filtered = available.filter(f =>
    f.name.toLowerCase().includes(search.toLowerCase()) ||
    f.categoryName.toLowerCase().includes(search.toLowerCase())
  );

  const grouped: Record<string, FoodItem[]> = {};
  for (const f of filtered) {
    if (!grouped[f.categoryName]) grouped[f.categoryName] = [];
    grouped[f.categoryName].push(f);
  }

  const setQty = (id: number, val: number) =>
    setQuantities(prev => ({ ...prev, [id]: Math.max(1, val) }));

  function handleAdd(food: FoodItem) {
    const qty = quantities[food.id] ?? 1;
    onAdd(food, qty);
    setQuantities(prev => ({ ...prev, [food.id]: 1 }));
  }

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="flex-1 bg-black/30 backdrop-blur-[2px]" onClick={onClose} />

      <div
        ref={drawerRef}
        className="w-[400px] bg-white h-full shadow-2xl flex flex-col animate-[slideIn_0.22s_ease-out]"
        style={{ animation: "slideIn 0.22s ease-out" }}
      >
        <style>{`
          @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0.6; }
            to   { transform: translateX(0);    opacity: 1; }
          }
        `}</style>

        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between shrink-0">
          <div>
            <h2 className="text-base font-bold text-slate-900">Add Items</h2>
            <p className="text-xs text-slate-400 mt-0.5">Select items to add to this order</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-700 transition-colors"
          >
            <IconX />
          </button>
        </div>

        <div className="px-5 py-3 border-b border-slate-100 shrink-0">
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              <IconSearch />
            </span>
            <input
              autoFocus
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search food or category…"
              className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-slate-50"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {loading && (
            <div className="flex flex-col items-center justify-center h-40 gap-2">
              <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-xs text-slate-400">Loading menu…</p>
            </div>
          )}

          {error && (
            <div className="m-5 p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
              <p className="font-semibold mb-0.5">Failed to load menu</p>
              <p className="text-xs text-red-500">{error}</p>
            </div>
          )}

          {!loading && !error && filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center h-40 text-slate-400">
              <p className="text-sm">No items found</p>
            </div>
          )}

          {!loading && !error && Object.entries(grouped).map(([category, items]) => (
            <div key={category}>
              <div className="px-5 py-2 bg-slate-50 border-b border-slate-100 sticky top-0">
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">{category}</p>
              </div>
              <div className="divide-y divide-slate-100">
                {items.map(food => {
                  const alreadyIn = existingIds.has(String(food.id));
                  const qty = quantities[food.id] ?? 1;
                  return (
                    <div
                      key={food.id}
                      className={`px-5 py-3 flex items-center gap-3 transition-colors ${alreadyIn ? "opacity-50" : "hover:bg-slate-50"}`}
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-slate-900 truncate">{food.name}</p>
                        <p className="text-xs text-slate-500">${food.price.toFixed(2)}</p>
                        {alreadyIn && (
                          <p className="text-[10px] text-blue-500 font-medium mt-0.5">Already in order</p>
                        )}
                      </div>

                      {!alreadyIn && (
                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            onClick={() => setQty(food.id, qty - 1)}
                            className="w-6 h-6 rounded-md bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 text-sm font-bold transition-colors"
                          >−</button>
                          <span className="w-5 text-center text-sm font-bold text-slate-900 tabular-nums">{qty}</span>
                          <button
                            onClick={() => setQty(food.id, qty + 1)}
                            className="w-6 h-6 rounded-md bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 text-sm font-bold transition-colors"
                          >+</button>
                        </div>
                      )}

                      {!alreadyIn && (
                        <button
                          onClick={() => handleAdd(food)}
                          className="shrink-0 px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 active:scale-95 transition-all"
                        >
                          Add
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="px-5 py-4 border-t border-slate-200 shrink-0">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800 transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

function ItemRow({
  item,
  editMode,
  onQtyChange,
  onRemove,
}: {
  item: OrderItem;
  editMode: boolean;
  onQtyChange: (id: string, qty: number) => void;
  onRemove: (id: string) => void;
}) {
  return (
    <div className="px-5 py-3.5 flex items-center justify-between hover:bg-slate-50/70 transition-colors group">
      <div className="flex items-center gap-3 flex-1 min-w-0">
        {editMode && (
          <button
            onClick={() => onRemove(item.id)}
            className="shrink-0 w-6 h-6 rounded-full bg-red-50 hover:bg-red-100 flex items-center justify-center text-red-400 hover:text-red-600 transition-colors"
            title="Remove item"
          >
            <IconTrash />
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

  const elapsed = useElapsed(order?.createdAt ?? new Date().toISOString());
  const lastUpdated = useLastUpdated(order?.updatedAt ?? new Date().toISOString());

  function enterEdit() {
    if (!order) return;
    setDraftItems(order.items.map(i => ({ ...i })));
    setEditMode(true);
  }

  function cancelEdit() {
    setEditMode(false);
    setDraftItems([]);
  }

  function saveEdit() {
    if (!order) return;
    const items = draftItems.filter(i => i.quantity > 0);
    const totalAmount = items.reduce((s, i) => s + i.unitPrice * i.quantity, 0);
    setOrder({ ...order, items, totalAmount, updatedAt: new Date().toISOString() });
    setEditMode(false);
    setDraftItems([]);
  }

  function updateQty(id: string, qty: number) {
    setDraftItems(prev => prev.map(i => i.id === id ? { ...i, quantity: Math.max(1, qty) } : i));
  }

  function removeItem(id: string) {
    setDraftItems(prev => prev.filter(i => i.id !== id));
  }

  function handleAddFood(food: FoodItem, qty: number) {
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
            <IconEdit />
            Edit Order
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={cancelEdit}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-600 text-sm font-semibold hover:bg-slate-50 active:scale-95 transition-all"
            >
              <IconX />
              Cancel
            </button>
            <button
              onClick={saveEdit}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 active:scale-95 transition-all shadow-sm"
            >
              <IconCheck />
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
                  <IconPlus />
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
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Elapsed</span>
                <span className="font-semibold text-amber-600 tabular-nums">{elapsed}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Last updated</span>
                <span className="font-semibold text-slate-900">{lastUpdated}</span>
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
            <IconCard />
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
