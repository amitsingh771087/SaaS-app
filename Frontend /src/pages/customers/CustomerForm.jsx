import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

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

  useEffect(() => {
    if (isEdit) {
      setForm({
        display_name: "Loaded Name",
        primary_email: "loaded@example.com",
        primary_phone: "9998887777",
        status: "Active",
      });
    }
  }, [id, isEdit]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate("/customers");
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

        {/* Buttons - stacked on mobile, inline on desktop */}
        <div className="col-span-2 flex flex-col sm:flex-row gap-3 sm:gap-4 mt-6">
          <motion.button
            type="submit"
            className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-lg shadow hover:shadow-xl"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isEdit ? "Update Customer" : "Create Customer"}
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
