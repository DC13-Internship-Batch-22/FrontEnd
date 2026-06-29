import { useState } from "react";
import { Plus, Pencil, Trash2, Inbox, ChevronDown, ChevronRight } from "lucide-react";
import { message, Modal } from "antd";
import type { Category } from "@/types/category";
import CategoryModal from "@/components/Category/CategoryModal";
import { useCategories, useDeleteCategory } from "@/api/hooks";
import SkeletonRow from "@/components/Category/SkeletonRow";
import FoodList from "@/components/Category/FoodList";

const SKELETON_COUNT = 5;

export default function CategoryManagement() {
  const [modalState, setModalState] = useState<{
    open: boolean;
    mode: "add" | "edit";
    item: Category | null;
  }>({ open: false, mode: "add", item: null });

  const [expandedId, setExpandedId] = useState<number | null>(null);

  const { data: categories = [], isFetching } = useCategories();
  const { mutate: deleteCategory } = useDeleteCategory();

  const handleOpenAdd = () => setModalState({ open: true, mode: "add", item: null });
  const handleOpenEdit = (item: Category) => setModalState({ open: true, mode: "edit", item });
  const handleCloseModal = () => setModalState({ open: false, mode: "add", item: null });

  const handleToggleExpand = (id: number) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const handleDelete = (item: Category) => {
    Modal.confirm({
      title: "Confirm Delete",
      content: `Are you sure you want to delete "${item.name}"?`,
      okText: "Delete",
      okType: "danger",
      cancelText: "Cancel",
      onOk: () => {
        deleteCategory(item.id, {
          onSuccess: () => {
            message.success("Category deleted successfully!");
            if (expandedId === item.id) setExpandedId(null);
          },
          onError: () => message.error("Failed to delete category!"),
        });
      },
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <main className="max-w-6xl mx-auto px-6 py-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Category Management</h1>
            <p className="text-sm text-slate-500 mt-0.5">Manage restaurant menu categories and classifications.</p>
          </div>
          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-2 px-4 h-9 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-colors shadow-sm"
          >
            <Plus size={16} />
            Add New Category
          </button>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm flex flex-col max-h-[calc(100vh-220px)]">
          <div className="overflow-auto flex-1">
            <table className="w-full text-left border-collapse">
              <thead className="sticky top-0 z-10">
                <tr className="bg-slate-50 border-b border-slate-200">
                  {["", "ID", "Name", "Description", "Actions"].map((h) => (
                    <th
                      key={h}
                      className={`px-5 py-3 text-[11px] font-semibold text-slate-400 uppercase tracking-widest whitespace-nowrap ${h === "Actions" ? "text-right" : ""} ${h === "" ? "w-8 px-3" : ""}`}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {isFetching ? (
                  Array.from({ length: SKELETON_COUNT }).map((_, i) => <SkeletonRow key={i} />)
                ) : categories.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="h-64">
                      <div className="flex flex-col items-center justify-center h-full gap-2 text-slate-400">
                        <Inbox size={40} />
                        <span className="text-sm">No categories found.</span>
                      </div>
                    </td>
                  </tr>
                ) : (
                  categories.map((category) => {
                    const isExpanded = expandedId === category.id;
                    return (
                      <>
                        <tr
                          key={category.id}
                          className="hover:bg-slate-50 transition-colors h-[53px] cursor-pointer"
                          onClick={() => handleToggleExpand(category.id)}
                        >
                          <td className="pl-3 pr-1 py-3.5 text-slate-400">
                            {isExpanded
                              ? <ChevronDown size={16} />
                              : <ChevronRight size={16} />
                            }
                          </td>
                          <td className="px-5 py-3.5 text-sm font-bold text-slate-800 whitespace-nowrap">
                            {String(category.id)}
                          </td>
                          <td className="px-5 py-3.5 text-sm font-semibold text-slate-800 whitespace-nowrap">
                            {category.name}
                          </td>
                          <td className="px-5 py-3.5 text-sm text-slate-500 max-w-md">
                            <p className="line-clamp-2">{category.description}</p>
                          </td>
                          <td className="px-5 py-3.5 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <button
                                onClick={(e) => { e.stopPropagation(); handleOpenEdit(category); }}
                                className="text-blue-600 hover:bg-blue-50 p-1.5 rounded-lg transition-colors"
                                title="Edit"
                              >
                                <Pencil size={15} />
                              </button>
                              <button
                                onClick={(e) => { e.stopPropagation(); handleDelete(category); }}
                                className="text-red-400 hover:bg-red-50 hover:text-red-600 p-1.5 rounded-lg transition-colors"
                                title="Delete"
                              >
                                <Trash2 size={15} />
                              </button>
                            </div>
                          </td>
                        </tr>
                        {isExpanded && <FoodList key={`foods-${category.id}`} categoryId={category.id} />}
                      </>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      <CategoryModal
        open={modalState.open}
        mode={modalState.mode}
        item={modalState.item}
        onClose={handleCloseModal}
      />
    </div>
  );
}
