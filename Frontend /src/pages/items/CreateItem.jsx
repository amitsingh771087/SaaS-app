import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import { getItemCategories, createItem, getTenants } from "../../api/Items.js";

export default function CreateItem() {
  const navigate = useNavigate();
  const [tenants, setTenants] = useState([]);
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    tenant: "",
    sku: "",
    name: "",
    type: "product",
    category: "",
    sell_price: "",
    cost_price: "",
    tax_rate_percent: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch tenants
        const tenantsRes = await getTenants();
        // If your API returns { success, data }
        setTenants(tenantsRes.data || tenantsRes || []);

        // Fetch categories
        const categoriesRes = await getItemCategories();
        setCategories(categoriesRes.data || []);
      } catch (err) {
        console.error(err.message);
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await createItem(formData);
      navigate("/items");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="p-6 bg-gray-50 min-h-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <motion.h1 className="text-3xl font-extrabold text-blue-700 mb-6">
        Create Item
      </motion.h1>

      {error && <div className="text-red-600 mb-4">{error}</div>}

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow-lg space-y-4 max-w-xl"
      >
        <div>
          <label className="block mb-1 font-semibold">Tenant</label>
          <select
            name="tenant"
            value={formData.tenant}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-400 outline-none"
          >
            <option value="">Select Tenant</option>
            {tenants.map((t) => (
              <option key={t.id} value={t.id}>
                {t.display_name || t.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-1 font-semibold">Category</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-400 outline-none"
          >
            <option value="">Select Category</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-1 font-semibold">SKU</label>
          <input
            type="text"
            name="sku"
            value={formData.sku}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-400 outline-none"
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-400 outline-none"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block mb-1 font-semibold">Sell Price</label>
            <input
              type="number"
              name="sell_price"
              value={formData.sell_price}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-400 outline-none"
            />
          </div>
          <div>
            <label className="block mb-1 font-semibold">Cost Price</label>
            <input
              type="number"
              name="cost_price"
              value={formData.cost_price}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-400 outline-none"
            />
          </div>
          <div>
            <label className="block mb-1 font-semibold">Tax %</label>
            <input
              type="number"
              name="tax_rate_percent"
              value={formData.tax_rate_percent}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-400 outline-none"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="px-5 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition"
        >
          {loading ? "Creating..." : "Create Item"}
        </button>
      </form>
    </motion.div>
  );
}
