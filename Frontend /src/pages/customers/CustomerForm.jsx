import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  createCustomer,
  getCustomerById,
  updateCustomer,
} from "../../api/Customer.js";

export default function CustomerForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [form, setForm] = useState({
    display_name: "",
    primary_email: "",
    primary_phone: "",
    status: "Active",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Load existing customer if editing
  useEffect(() => {
    if (isEdit) {
      setLoading(true);
      getCustomerById(id)
        .then((res) => {
          setForm({
            display_name: res.data.display_name || "",
            primary_email: res.data.primary_email || "",
            primary_phone: res.data.primary_phone || "",
            status: res.data.status === "active" ? "Active" : "Inactive",
          });
        })
        .catch((err) => setError("Failed to load customer data."))
        .finally(() => setLoading(false));
    }
  }, [id, isEdit]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (isEdit) {
        // Update existing customer
        await updateCustomer(id, {
          display_name: form.display_name,
          primary_email: form.primary_email,
          primary_phone: form.primary_phone,
          status: form.status.toLowerCase(),
        });
      } else {
        // Create new customer
        await createCustomer({
          tenant: "b5788f85-76a7-4ce0-92fe-d10b9a344930", // Replace with actual tenant ID dynamically if needed
          display_name: form.display_name,
          primary_email: form.primary_email,
          primary_phone: form.primary_phone,
        });
      }

      navigate("/customers");
    } catch (err) {
      console.error(err);
      setError("Failed to save customer. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="p-4 sm:p-6 md:p-8 bg-gray-50 min-h-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <h1 className="text-2xl sm:text-3xl font-extrabold text-blue-700 mb-6 sm:mb-8">
        {isEdit ? "Edit Customer" : "Create New Customer"}
      </h1>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>
      )}

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-6 sm:p-8 rounded-xl shadow-lg"
      >
        <div>
          <label className="block mb-2 font-medium text-sm sm:text-base">
            Full Name
          </label>
          <input
            type="text"
            name="display_name"
            value={form.display_name}
            onChange={handleChange}
            placeholder="Full Name"
            className="w-full border rounded px-3 py-2 sm:py-3 text-sm sm:text-base focus:ring-2 focus:ring-blue-400 outline-none"
            required
          />
        </div>
        <div>
          <label className="block mb-2 font-medium text-sm sm:text-base">
            Email
          </label>
          <input
            type="email"
            name="primary_email"
            value={form.primary_email}
            onChange={handleChange}
            placeholder="Email"
            className="w-full border rounded px-3 py-2 sm:py-3 text-sm sm:text-base focus:ring-2 focus:ring-blue-400 outline-none"
          />
        </div>
        <div>
          <label className="block mb-2 font-medium text-sm sm:text-base">
            Phone
          </label>
          <input
            type="text"
            name="primary_phone"
            value={form.primary_phone}
            onChange={handleChange}
            placeholder="Phone"
            className="w-full border rounded px-3 py-2 sm:py-3 text-sm sm:text-base focus:ring-2 focus:ring-blue-400 outline-none"
          />
        </div>
        <div>
          <label className="block mb-2 font-medium text-sm sm:text-base">
            Status
          </label>
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2 sm:py-3 text-sm sm:text-base focus:ring-2 focus:ring-blue-400 outline-none"
          >
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>

        <div className="col-span-2 flex flex-col sm:flex-row gap-3 sm:gap-4 mt-6">
          <motion.button
            type="submit"
            disabled={loading}
            className={`w-full sm:w-auto px-6 py-3 text-white font-semibold rounded-lg shadow hover:shadow-xl ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-blue-500 to-indigo-600"
            }`}
            whileHover={{ scale: loading ? 1 : 1.05 }}
            whileTap={{ scale: loading ? 1 : 0.95 }}
          >
            {loading
              ? "Saving..."
              : isEdit
              ? "Update Customer"
              : "Create Customer"}
          </motion.button>
          <button
            type="button"
            onClick={() => navigate("/customers")}
            className="w-full sm:w-auto px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
          >
            Cancel
          </button>
        </div>
      </form>
    </motion.div>
  );
}
