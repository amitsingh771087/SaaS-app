import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function CustomersList() {
  const [customers, setCustomers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    setCustomers([
      {
        id: 1,
        display_name: "John Doe",
        primary_email: "john@example.com",
        primary_phone: "9876543210",
        status: "Active",
      },
      {
        id: 2,
        display_name: "Jane Smith",
        primary_email: "jane@example.com",
        primary_phone: "9123456780",
        status: "Inactive",
      },
    ]);
  }, []);

  return (
    <motion.div
      className="p-6 bg-gray-50 min-h-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <motion.h1
          className="text-3xl font-extrabold text-blue-700"
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
        >
          Customers
        </motion.h1>
        <motion.button
          onClick={() => navigate("/customers/create")}
          className="px-5 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          + Create Customer
        </motion.button>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl shadow-lg bg-white">
        <table className="w-full border-collapse">
          <thead className="bg-gradient-to-r from-blue-50 to-indigo-50">
            <tr>
              <th className="p-4 text-left text-gray-600 font-semibold">
                Name
              </th>
              <th className="p-4 text-left text-gray-600 font-semibold">
                Email
              </th>
              <th className="p-4 text-left text-gray-600 font-semibold">
                Phone
              </th>
              <th className="p-4 text-left text-gray-600 font-semibold">
                Status
              </th>
              <th className="p-4 text-center text-gray-600 font-semibold">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {customers.map((c, idx) => (
              <motion.tr
                key={c.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="border-t hover:bg-blue-50 transition"
              >
                <td className="p-4">{c.display_name}</td>
                <td className="p-4">{c.primary_email}</td>
                <td className="p-4">{c.primary_phone}</td>
                <td className="p-4">
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${
                      c.status === "Active"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {c.status}
                  </span>
                </td>
                <td className="p-4 flex justify-center gap-2">
                  <button
                    onClick={() => navigate(`/customers/${c.id}`)}
                    className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                  >
                    View
                  </button>
                  <button
                    onClick={() => navigate(`/customers/${c.id}/timeline`)}
                    className="px-3 py-1 bg-indigo-500 text-white rounded hover:bg-indigo-600 transition"
                  >
                    Timeline
                  </button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
