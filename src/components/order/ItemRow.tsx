import type { OrderItem } from "@/types/order";
import { Trash2 } from "lucide-react";

const ItemRow = ({
  item,
  editMode,
  onQtyChange,
  onRemove,
}: {
  item: OrderItem;
  editMode: boolean;
  onQtyChange: (id: number, qty: number) => void;
  onRemove: (id: number) => void;
}) => {
  return (
    <div className="px-5 py-3.5 flex items-center justify-between hover:bg-slate-50/70 transition-colors group">
      <div className="flex items-center gap-3 flex-1 min-w-0">
        {editMode && (
          <button
            onClick={() => onRemove(item.productId)}
            className="shrink-0 w-6 h-6 rounded-full bg-red-50 hover:bg-red-100 flex items-center justify-center text-red-400 hover:text-red-600 transition-colors"
            title="Remove item"
          >
            <Trash2 size={15} />
          </button>
        )}
        <div className="min-w-0">
          <p className="text-sm font-semibold text-slate-900 truncate">{item.productName}</p>
          <p className="text-xs text-slate-400">${item.price.toFixed(2)} each</p>
        </div>
      </div>

      <div className="flex items-center gap-4 shrink-0">
        {editMode ? (
          <div className="flex items-center gap-2">
            <button
              onClick={() => onQtyChange(item.productId, item.quantity - 1)}
              className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-700 font-bold text-base leading-none transition-colors"
            >−</button>
            <span className="w-6 text-center text-sm font-bold text-slate-900 tabular-nums">{item.quantity}</span>
            <button
              onClick={() => onQtyChange(item.productId, item.quantity + 1)}
              className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-700 font-bold text-base leading-none transition-colors"
            >+</button>
          </div>
        ) : (
          <span className="text-xs text-slate-400 w-12 text-right">× {item.quantity}</span>
        )}
        <p className="text-sm font-bold text-slate-900 w-16 text-right tabular-nums">
          ${(item.price * item.quantity).toFixed(2)}
        </p>
      </div>
    </div>
  );
}

export default ItemRow;
