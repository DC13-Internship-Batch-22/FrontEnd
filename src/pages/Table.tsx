import {
  Armchair,
  CircleCheck,
  Users,
  Clock3,
} from "lucide-react";

import { useNavigate } from "react-router-dom";
const tables = Array.from({ length: 20 }, (_, i) => ({
  id: i + 1,
  status:
    i === 2 || i === 6 || i === 11
      ? "Occupied"
      : "Available",
}));

const Table = () => {
  const navigate = useNavigate();
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
                20
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
                17
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
                3
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
                className={`group relative bg-white border rounded-lg p-4 border-t-4 transition-all duration-300 hover:shadow-lg hover:scale-[1.02]
                ${table.status === "Available"
                    ? "border-t-green-500"
                    : "border-t-amber-500"
                  }`}
              >
                {/* Nội dung card */}
                <div className="flex justify-between items-center">
                  <h3 className="font-bold text-lg">
                    #{table.id}
                  </h3>

                  <span
                    className={`text-xs px-2 py-1 rounded-full
                    ${table.status === "Available"
                        ? "bg-green-100 text-green-600"
                        : "bg-amber-100 text-amber-600"
                      }`}
                  >
                    {table.status}
                  </span>
                </div>

                <div className="mt-4 text-sm text-gray-500">
                  <p>👥 Cap. 4</p>

                  {table.status === "Available" ? (
                    <p className="mt-2 flex items-center gap-1">
                      <Clock3 size={14} />
                      Ready
                    </p>
                  ) : (
                    <p className="mt-2 flex items-center gap-1">
                      <Clock3 size={14} />
                      35 min
                    </p>
                  )}
                </div>

                {/* Overlay Hover */}
                <div className="absolute inset-0 bg-black/40 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
                  {table.status === "Available" ? (
                    <button
                      onClick={() => navigate(`/table/${table.id}`)}
                      className="px-4 py-2 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 cursor-pointer"
                    >
                      New Order
                    </button>
                  ) : (
                    <button
                      className="px-4 py-2 bg-amber-500 text-white rounded-lg font-medium hover:bg-amber-600 cursor-pointer"
                    >
                      View Detail
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