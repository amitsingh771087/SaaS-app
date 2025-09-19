import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { getTenants, deleteTenant } from "../../api/Tenant.js";

export default function TenantsList() {
  const [tenants, setTenants] = useState([]);
  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState("latest");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;
  const navigate = useNavigate();

  useEffect(() => {
    fetchTenants();
  }, []);

  const fetchTenants = async () => {
    try {
      const data = await getTenants();
      setTenants(data);
    } catch (err) {
      console.error("Failed to fetch tenants:", err.message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this tenant?")) {
      try {
        await deleteTenant(id);
        fetchTenants();
      } catch (err) {
        console.error(err.message);
      }
    }
  };

  // Filtered and sorted tenants
  const filteredTenants = useMemo(() => {
    let filtered = tenants.filter(
      (t) =>
        t.display_name?.toLowerCase().includes(search.toLowerCase()) ||
        t.slug?.toLowerCase().includes(search.toLowerCase()) ||
        t.currency?.toLowerCase().includes(search.toLowerCase())
    );

    filtered.sort((a, b) => {
      const dateA = new Date(a.created_at);
      const dateB = new Date(b.created_at);
      return sortOrder === "latest" ? dateB - dateA : dateA - dateB;
    });

    return filtered;
  }, [tenants, search, sortOrder]);

  // Pagination
  const totalPages = Math.ceil(filteredTenants.length / itemsPerPage);
  const paginatedTenants = filteredTenants.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePrev = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNext = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));

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
          Tenants
        </motion.h1>

        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 items-start sm:items-center">
          {/* Search */}
          <input
            type="text"
            placeholder="Search by name, slug, currency..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
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
            onClick={() => navigate("/tenants/create")}
            className="px-5 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            + Create Tenant
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
                Slug
              </th>
              <th className="p-4 text-left text-gray-600 font-semibold">
                Currency
              </th>
              <th className="p-4 text-left text-gray-600 font-semibold">
                GST Enabled
              </th>
              <th className="p-4 text-left text-gray-600 font-semibold">
                Timezone
              </th>
              <th className="p-4 text-center text-gray-600 font-semibold">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {paginatedTenants.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-6 text-center text-gray-500">
                  No tenants found.
                </td>
              </tr>
            ) : (
              paginatedTenants.map((t, idx) => (
                <motion.tr
                  key={t.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="border-t hover:bg-blue-50 transition"
                >
                  <td className="p-4">{t.display_name}</td>
                  <td className="p-4">{t.slug}</td>
                  <td className="p-4">{t.currency}</td>
                  <td className="p-4">{t.gst_enabled ? "Yes" : "No"}</td>
                  <td className="p-4">{t.timezone}</td>
                  <td className="p-4 flex justify-center gap-2">
                    <button
                      onClick={() => navigate(`/tenants/${t.id}`)}
                      className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                    >
                      View
                    </button>
                    <button
                      onClick={() => navigate(`/tenants/${t.id}/edit`)}
                      className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(t.id)}
                      className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
                    >
                      Delete
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
