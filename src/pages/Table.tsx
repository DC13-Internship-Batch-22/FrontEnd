import {
  Armchair,
  CircleCheck,
  Users,
  Clock3,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getTables } from "../api/services/tables-service";

interface TableType {
  id: number;
  tableNumber: string;
  capacity: number;
  status: string;
}

const Table = () => {
  const navigate = useNavigate();

  const [tables, setTables] = useState<TableType[]>([]);
  const [totalTables, setTotalTables] = useState(0);

  useEffect(() => {
    loadTables();
  }, []);

  const loadTables = async () => {
    try {
      const data = await getTables();

      console.log("Danh sách bàn:", data);

      setTables(data.content);
      setTotalTables(data.totalElements);
    } catch (error) {
      console.error("Lỗi lấy danh sách bàn:", error);
    }
  };

  const occupiedTables = tables.filter(
    (table) => table.status === "OCCUPIED"
  ).length;

  const availableTables = tables.filter(
    (table) => table.status === "AVAILABLE"
  ).length;

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="p-8">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-5">
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
        </div>

        {/* Floor Overview */}
        <div className="mt-8">
          <h2 className="text-3xl font-bold mb-5">
            Floor Overview
          </h2>

          <div className="grid grid-cols-5 gap-4">
            {tables.map((table) => (
              <div
                key={table.id}
                className={`group relative bg-white border rounded-lg p-4 border-t-4 transition-all duration-300 hover:shadow-lg hover:-translate-y-[3px]
                ${
                  table.status === "AVAILABLE"
                    ? "border-t-green-500"
                    : "border-t-amber-500"
                }`}
              >
                <div className="flex justify-between items-center">
                  <h3 className="font-bold text-lg">
                    #{table.tableNumber}
                  </h3>

                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      table.status === "AVAILABLE"
                        ? "bg-green-100 text-green-600"
                        : "bg-amber-100 text-amber-600"
                    }`}
                  >
                    {table.status}
                  </span>
                </div>

                <div className="mt-4 text-sm text-gray-500">
                  <p>👥 Cap. {table.capacity}</p>

                  {table.status === "AVAILABLE" ? (
                    <p className="mt-2 flex items-center gap-1">
                      <Clock3 size={14} />
                      Ready
                    </p>
                  ) : (
                    <p className="mt-2 flex items-center gap-1">
                      <Clock3 size={14} />
                      Occupied
                    </p>
                  )}
                </div>

                <div className="mt-4 pt-3 h-10 flex items-center group-hover:border-t group-hover:border-gray-300 font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  {table.status === "AVAILABLE" ? (
                    <button
                      onClick={() =>
                        navigate(`/table/${table.id}`)
                      }
                      className="w-full text-left text-blue-600 cursor-pointer"
                    >
                      New Order →
                    </button>
                  ) : (
                    <button
                      onClick={() =>
                        navigate(`/table/${table.id}`)
                      }
                      className="w-full text-left text-amber-600 cursor-pointer"
                    >
                      View Bill →
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Table;