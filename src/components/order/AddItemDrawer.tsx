import { useFoods } from "@/api/hooks";
import type { Food } from "@/types/food";
import { Search, X } from "lucide-react";
import { useState } from "react";

const AddItemDrawer = ({ existingIds, onAdd, onClose }: {
  existingIds: Set<string>;
  onAdd: (food: Food, qty: number) => void;
  onClose: () => void;
}) => {
  const { data: foods, isLoading, error, isError } = useFoods();
  const [search, setSearch] = useState("");
  const [quantities, setQuantities] = useState<Record<number, number>>({});

  const available = foods?.filter((f: Food) => f.status === "AVAILABLE") ?? [];
  const filtered = available.filter((f: Food) =>
    f.name.toLowerCase().includes(search.toLowerCase()) ||
    f.categoryName.toLowerCase().includes(search.toLowerCase())
  );

  const grouped: Record<string, Food[]> = {};
  for (const f of filtered) {
    if (!grouped[f.categoryName]) grouped[f.categoryName] = [];
    grouped[f.categoryName].push(f);
  }

  const setQty = (id: number, val: number) =>
    setQuantities(prev => ({ ...prev, [id]: Math.max(1, val) }));

  const handleAdd = (food: Food) => {
    const qty = quantities[food.id] ?? 1;
    onAdd(food, qty);
    setQuantities(prev => ({ ...prev, [food.id]: 1 }));
  }

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="flex-1 bg-black/30 backdrop-blur-[2px]" onClick={onClose} />

      <div
        className="w-[400px] bg-white h-full shadow-2xl flex flex-col"
      >
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between shrink-0">
          <div>
            <h2 className="text-base font-bold text-slate-900">Add Items</h2>
            <p className="text-xs text-slate-400 mt-0.5">Select items to add to this order</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-700 transition-colors"
          >
            <X />
          </button>
        </div>

        <div className="px-5 py-3 border-b border-slate-100 shrink-0">
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              <Search />
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
          {isLoading && (
            <div className="flex flex-col items-center justify-center h-40 gap-2">
              <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-xs text-slate-400">Loading menu…</p>
            </div>
          )}

          {isError && (
            <div className="m-5 p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
              <p className="font-semibold mb-0.5">Failed to load menu</p>
              <p className="text-xs text-red-500">{error.message}</p>
            </div>
          )}

          {!isLoading && !isError && filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center h-40 text-slate-400">
              <p className="text-sm">No items found</p>
            </div>
          )}

          {!isLoading && !isError && Object.entries(grouped).map(([category, items]) => (
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

export default AddItemDrawer;
