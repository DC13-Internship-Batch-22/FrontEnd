import {
  Armchair,
  CircleCheck,
  Users,
  Clock3,
  Pencil,
  Plus,
  Trash2,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { type FormEvent, useEffect, useState } from "react";
import { tablesService } from "../api/services/tables-service";
import type {
  TableRequest,
  TableResponse,
  TableStatus,
} from "../types/table";

const tableStatusOptions: TableStatus[] = [
  "AVAILABLE",
  "OCCUPIED",
  "RESERVED",
  "MAINTENANCE",
];

const emptyForm: TableRequest = {
  tableNumber: "",
  capacity: 2,
  status: "AVAILABLE",
};

const Table = () => {
  const navigate = useNavigate();

  const [tables, setTables] = useState<TableResponse[]>([]);
  const [totalTables, setTotalTables] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState<TableRequest>(emptyForm);
  const [editingTable, setEditingTable] = useState<TableResponse | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  useEffect(() => {
    loadTables();
  }, []);

  const loadTables = async () => {
    setIsLoading(true);
    setError("");

    try {
      const data = await tablesService.getTables();

      setTables(data.content ?? []);
      setTotalTables(data.totalElements);
    } catch (error) {
      console.error("Failed to load tables:", error);
      setError("Unable to load tables. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const openCreateForm = () => {
    setForm(emptyForm);
    setEditingTable(null);
    setError("");
    setIsFormOpen(true);
  };

  const openEditForm = (table: TableResponse) => {
    setForm({
      tableNumber: table.tableNumber,
      capacity: table.capacity,
      status: table.status,
    });
    setEditingTable(table);
    setError("");
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingTable(null);
    setForm(emptyForm);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSaving(true);
    setError("");

    try {
      const payload = {
        ...form,
        tableNumber: form.tableNumber.trim(),
        capacity: Number(form.capacity),
      };

      if (editingTable) {
        await tablesService.updateTable(editingTable.id, payload);
      } else {
        await tablesService.createTable(payload);
      }

      closeForm();
      await loadTables();
    } catch (error) {
      console.error("Failed to save table:", error);
      setError("Unable to save table. Please check the details and try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (table: TableResponse) => {
    const confirmed = window.confirm(
      `Delete table #${table.tableNumber}? This action cannot be undone.`
    );

    if (!confirmed) {
      return;
    }

    setError("");

    try {
      await tablesService.deleteTable(table.id);
      await loadTables();
    } catch (error) {
      console.error("Failed to delete table:", error);
      setError("Unable to delete table. Please try again.");
    }
  };

  const occupiedTables = tables.filter(
    (table) => table.status === "OCCUPIED"
  ).length;

  const availableTables = tables.filter(
    (table) => table.status === "AVAILABLE"
  ).length;

  const reservedTables = tables.filter(
    (table) => table.status === "RESERVED"
  ).length;

  const getStatusClass = (status: TableStatus) => {
    switch (status) {
      case "AVAILABLE":
        return "bg-green-100 text-green-700";
      case "OCCUPIED":
        return "bg-amber-100 text-amber-700";
      case "RESERVED":
        return "bg-blue-100 text-blue-700";
      case "MAINTENANCE":
        return "bg-rose-100 text-rose-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusBorderClass = (status: TableStatus) => {
    switch (status) {
      case "AVAILABLE":
        return "border-t-green-500";
      case "OCCUPIED":
        return "border-t-amber-500";
      case "RESERVED":
        return "border-t-blue-500";
      case "MAINTENANCE":
        return "border-t-rose-500";
      default:
        return "border-t-gray-400";
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="p-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Tables</h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage dining tables and start service from the floor overview.
            </p>
          </div>

          <button
            onClick={openCreateForm}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-700 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-800 cursor-pointer"
          >
            <Plus size={18} />
            Add Table
          </button>
        </div>

        {error && (
          <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-4 gap-5">
          <div className="bg-white border rounded-lg p-5 flex justify-between">
            <div>
              <p className="text-sm text-gray-500">
                Total Tables
              </p>
              <h2 className="text-3xl font-bold mt-4">
                {totalTables}
              </h2>
              <p className="text-gray-400 text-sm">
                Full Capacity
              </p>
            </div>

            <div className="w-10 h-10 bg-blue-100 rounded flex items-center justify-center">
              <Armchair
                className="text-blue-600"
                size={20}
              />
            </div>
          </div>

          <div className="bg-white border rounded-lg p-5 flex justify-between">
            <div>
              <p className="text-sm text-gray-500">
                Available
              </p>
              <h2 className="text-3xl font-bold mt-4">
                {availableTables}
              </h2>
              <p className="text-green-500 text-sm">
                Ready for seating
              </p>
            </div>

            <div className="w-10 h-10 bg-green-100 rounded flex items-center justify-center">
              <CircleCheck
                className="text-green-600"
                size={20}
              />
            </div>
          </div>

          <div className="bg-white border rounded-lg p-5 flex justify-between">
            <div>
              <p className="text-sm text-gray-500">
                Occupied
              </p>
              <h2 className="text-3xl font-bold mt-4">
                {occupiedTables}
              </h2>
              <p className="text-amber-500 text-sm">
                Active service
              </p>
            </div>

            <div className="w-10 h-10 bg-amber-100 rounded flex items-center justify-center">
              <Users
                className="text-amber-600"
                size={20}
              />
            </div>
          </div>

          <div className="bg-white border rounded-lg p-5 flex justify-between">
            <div>
              <p className="text-sm text-gray-500">
                Reserved
              </p>
              <h2 className="text-3xl font-bold mt-4">
                {reservedTables}
              </h2>
              <p className="text-blue-500 text-sm">
                Upcoming guests
              </p>
            </div>

            <div className="w-10 h-10 bg-blue-100 rounded flex items-center justify-center">
              <Clock3
                className="text-blue-600"
                size={20}
              />
            </div>
          </div>
        </div>

        {/* Floor Overview */}
        <div className="mt-8">
          <h2 className="text-3xl font-bold mb-5">
            Floor Overview
          </h2>

          <div className="grid grid-cols-5 gap-4">
            {isLoading ? (
              <div className="col-span-5 rounded-lg border bg-white p-8 text-center text-gray-500">
                Loading tables...
              </div>
            ) : tables.length === 0 ? (
              <div className="col-span-5 rounded-lg border bg-white p-8 text-center text-gray-500">
                No tables found.
              </div>
            ) : (
              tables.map((table) => (
                <div
                  key={table.id}
                  className={`group relative bg-white border rounded-lg p-4 border-t-4 transition-all duration-300 hover:shadow-lg hover:-translate-y-[3px] ${getStatusBorderClass(
                    table.status
                  )}`}
                >
                  <div className="flex justify-between items-start gap-3">
                    <h3 className="font-bold text-lg">
                      #{table.tableNumber}
                    </h3>

                    <span
                      className={`text-xs px-2 py-1 rounded-full ${getStatusClass(
                        table.status
                      )}`}
                    >
                      {table.status}
                    </span>
                  </div>

                  <div className="mt-4 text-sm text-gray-500">
                    <p className="flex items-center gap-1">
                      <Users size={14} />
                      Cap. {table.capacity}
                    </p>

                    <p className="mt-2 flex items-center gap-1">
                      <Clock3 size={14} />
                      {table.status === "AVAILABLE"
                        ? "Ready"
                        : table.status === "OCCUPIED"
                          ? "Occupied"
                          : table.status === "RESERVED"
                            ? "Reserved"
                            : "Maintenance"}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 flex items-center justify-between gap-2 border-t border-gray-200 font-medium">
                    <button
                      onClick={() => navigate(`/table/${table.id}`)}
                      className={`text-left text-sm cursor-pointer ${
                        table.status === "AVAILABLE"
                          ? "text-blue-600"
                          : "text-amber-600"
                      }`}
                    >
                      {table.status === "AVAILABLE"
                        ? "New Order"
                        : "View Bill"}
                    </button>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => openEditForm(table)}
                        className="rounded p-2 text-gray-500 hover:bg-slate-100 hover:text-blue-700 cursor-pointer"
                        title="Edit table"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(table)}
                        className="rounded p-2 text-gray-500 hover:bg-red-50 hover:text-red-700 cursor-pointer"
                        title="Delete table"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-md rounded-lg bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
              <h2 className="text-xl font-bold text-slate-900">
                {editingTable ? "Edit Table" : "Add Table"}
              </h2>
              <button
                type="button"
                onClick={closeForm}
                className="rounded p-2 text-gray-500 hover:bg-slate-100 cursor-pointer"
                title="Close"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 p-5">
              <div>
                <label
                  htmlFor="tableNumber"
                  className="mb-1 block text-sm font-medium text-gray-700"
                >
                  Table Number
                </label>
                <input
                  id="tableNumber"
                  type="text"
                  value={form.tableNumber}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      tableNumber: event.target.value,
                    }))
                  }
                  maxLength={10}
                  required
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div>
                <label
                  htmlFor="capacity"
                  className="mb-1 block text-sm font-medium text-gray-700"
                >
                  Capacity
                </label>
                <input
                  id="capacity"
                  type="number"
                  min={1}
                  value={form.capacity}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      capacity: Number(event.target.value),
                    }))
                  }
                  required
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div>
                <label
                  htmlFor="status"
                  className="mb-1 block text-sm font-medium text-gray-700"
                >
                  Status
                </label>
                <select
                  id="status"
                  value={form.status}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      status: event.target.value as TableStatus,
                    }))
                  }
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                >
                  {tableStatusOptions.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeForm}
                  className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="rounded-lg bg-blue-700 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-800 disabled:bg-gray-300 cursor-pointer"
                >
                  {isSaving ? "Saving..." : editingTable ? "Save" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Table;
