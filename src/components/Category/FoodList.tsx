import { useFoods } from "@/api/hooks";
import type { Food } from "@/types/food";
import { UtensilsCrossed } from "lucide-react";

const FoodList = ({ categoryId }: { categoryId: number }) => {
  const { data: foods = [], isFetching } = useFoods(categoryId);

  if (isFetching) {
    return (
      <tr>
        <td colSpan={5} className="px-0 py-0">
          <div className="bg-slate-50 border-t border-slate-100 px-8 py-3">
            <div className="flex flex-col gap-2 animate-pulse">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="h-8 w-8 bg-slate-200 rounded-md" />
                  <div className="h-3 bg-slate-200 rounded w-32" />
                  <div className="h-3 bg-slate-200 rounded w-20 ml-auto" />
                </div>
              ))}
            </div>
          </div>
        </td>
      </tr>
    );
  }

  if (foods.length === 0) {
    return (
      <tr>
        <td colSpan={5} className="px-0 py-0">
          <div className="bg-slate-50 border-t border-slate-100 px-8 py-4 flex items-center gap-2 text-slate-400 text-sm">
            <UtensilsCrossed size={16} />
            <span>No food items in this category.</span>
          </div>
        </td>
      </tr>
    );
  }

  return (
    <tr>
      <td colSpan={5} className="px-0 py-0">
        <div className="bg-slate-50 border-t border-slate-100">
          <div className="px-8 py-2">
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest mb-2">
              Food Items ({foods.length})
            </p>
            <div className="flex flex-col divide-y divide-slate-100">
              {foods.map((food: Food) => (
                <div key={food.id} className="flex items-center gap-3 py-2">
                  {food.imageUrl ? (
                    <img
                      src={food.imageUrl}
                      alt={food.name}
                      className="h-8 w-8 rounded-md object-cover border border-slate-200 shrink-0"
                    />
                  ) : (
                    <div className="h-8 w-8 rounded-md bg-slate-200 flex items-center justify-center shrink-0">
                      <UtensilsCrossed size={14} className="text-slate-400" />
                    </div>
                  )}
                  <span className="text-sm font-medium text-slate-700 flex-1 min-w-0 truncate">
                    {food.name}
                  </span>
                  {food.price != null && (
                    <span className="text-sm font-semibold text-blue-600 whitespace-nowrap">
                      ${food.price.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </td>
    </tr>
  );
}

export default FoodList;
