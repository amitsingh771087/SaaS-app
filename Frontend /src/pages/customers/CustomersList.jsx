import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { getCustomers } from "../../api/Customer.js";

export default function CustomersList() {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState("latest");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getCustomers();
        setCustomers(res.data || []);
      } catch (err) {
        console.error("Failed to fetch customers:", err.message);
      }
    };
    fetchData();
  }, []);

  // Filtered and sorted customers
  const filteredCustomers = useMemo(() => {
    let filtered = customers.filter(
      (c) =>
        c.display_name?.toLowerCase().includes(search.toLowerCase()) ||
        c.primary_email?.toLowerCase().includes(search.toLowerCase()) ||
        c.primary_phone?.includes(search)
    );

    filtered.sort((a, b) => {
      const dateA = new Date(a.created_at);
      const dateB = new Date(b.created_at);
      return sortOrder === "latest" ? dateB - dateA : dateA - dateB;
    });

    return filtered;
  }, [customers, search, sortOrder]);

  // Pagination
  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);
  const paginatedCustomers = filteredCustomers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePrev = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNext = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  return (
    <motion.div
      className="p-6 bg-gray-50 min-h-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3">
        <motion.h1
          className="text-3xl font-extrabold text-blue-700"
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
        >
          Customers
        </motion.h1>

        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 items-start sm:items-center">
          {/* Search */}
          <input
            type="text"
            placeholder="Search by name, email, phone..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1); // reset page when searching
            }}
            className="px-4 py-2 border rounded focus:ring-2 focus:ring-blue-400 outline-none w-full sm:w-64"
          />

          {/* Sort */}
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="px-4 py-2 border rounded focus:ring-2 focus:ring-blue-400 outline-none"
          >
            <option value="latest">Latest First</option>
            <option value="oldest">Oldest First</option>
          </select>

          {/* Create button */}
          <motion.button
            onClick={() => navigate("/customers/create")}
            className="px-5 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            + Create Customer
          </motion.button>
        </div>
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
            {paginatedCustomers.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-6 text-center text-gray-500">
                  No customers found.
                </td>
              </tr>
            ) : (
              paginatedCustomers.map((c, idx) => (
                <motion.tr
                  key={c.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="border-t hover:bg-blue-50 transition"
                >
                  <td className="p-4">{c.display_name}</td>
                  <td className="p-4">{c.primary_email}</td>
                  <td className="p-4">{c.primary_phone}</td>
                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${
                        c.status?.toLowerCase() === "active"
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
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-4 flex justify-center items-center gap-3">
          <button
            onClick={handlePrev}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 disabled:opacity-50"
          >
            Prev
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={handleNext}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </motion.div>
  );
}
