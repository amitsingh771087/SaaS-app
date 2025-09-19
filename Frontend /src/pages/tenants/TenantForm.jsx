import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { createTenant, getTenantById, updateTenant } from "../../api/Tenant.js";

export default function TenantForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const [form, setForm] = useState({
    slug: "",
    display_name: "",
    currency: "INR",
    timezone: "Asia/Kolkata",
    gst_enabled: true,
  });

  useEffect(() => {
    if (isEdit) {
      const fetchTenant = async () => {
        try {
          const data = await getTenantById(id);
          setForm({
            slug: data.slug,
            display_name: data.display_name,
            currency: data.currency,
            timezone: data.timezone,
            gst_enabled: data.gst_enabled,
          });
        } catch (err) {
          console.error(err.message);
        }
      };
      fetchTenant();
    }
  }, [id, isEdit]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEdit) {
        await updateTenant(id, form);
      } else {
        await createTenant(form);
      }
      navigate("/tenants");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <motion.div
      className="p-6 bg-gray-50 min-h-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <h1 className="text-2xl sm:text-3xl font-extrabold text-blue-700 mb-6">
        {isEdit ? "Edit Tenant" : "Create New Tenant"}
      </h1>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-6 rounded-xl shadow-lg"
      >
        <div>
          <label className="block mb-2 font-medium">Slug</label>
          <input
            type="text"
            name="slug"
            value={form.slug}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
            required
          />
        </div>
        <div>
          <label className="block mb-2 font-medium">Display Name</label>
          <input
            type="text"
            name="display_name"
            value={form.display_name}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
            required
          />
        </div>
        <div>
          <label className="block mb-2 font-medium">Currency</label>
          <input
            type="text"
            name="currency"
            value={form.currency}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
          />
        </div>
        <div>
          <label className="block mb-2 font-medium">Timezone</label>
          <input
            type="text"
            name="timezone"
            value={form.timezone}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
          />
        </div>
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            name="gst_enabled"
            checked={form.gst_enabled}
            onChange={handleChange}
          />
          <label className="font-medium">GST Enabled</label>
        </div>

        <div className="col-span-2 flex flex-col sm:flex-row gap-4 mt-4">
          <motion.button
            type="submit"
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg shadow hover:shadow-xl"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isEdit ? "Update Tenant" : "Create Tenant"}
          </motion.button>
          <button
            type="button"
            onClick={() => navigate("/tenants")}
            className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
          >
            Cancel
          </button>
        </div>
      </form>
    </motion.div>
  );
}
