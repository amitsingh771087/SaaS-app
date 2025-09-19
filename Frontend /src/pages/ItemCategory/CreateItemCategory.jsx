import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  createItemCategory,
  getItemCategoryById,
  updateItemCategory,
} from "../../api/Items.js";

export default function ItemCategoryForm() {
  const navigate = useNavigate();
  const { id } = useParams(); // if editing
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    is_active: 1,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch category if editing
  useEffect(() => {
    if (id) {
      const fetchCategory = async () => {
        try {
          const res = await getItemCategoryById(id);
          setFormData({
            name: res.name || "",
            slug: res.slug || "",
            is_active: res.is_active ? 1 : 0,
          });
        } catch (err) {
          setError(err.message);
        }
      };
      fetchCategory();
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? (checked ? 1 : 0) : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (id) {
        await updateItemCategory(id, formData);
      } else {
        await createItemCategory(formData);
      }
      navigate("/item-categories");
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
      <h1 className="text-3xl font-extrabold text-blue-700 mb-6">
        {id ? "Edit" : "Create"} Item Category
      </h1>

      {error && <div className="text-red-600 mb-4">{error}</div>}

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow-lg max-w-md space-y-4"
      >
        <div>
          <label className="block mb-1 font-semibold">Category Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-400 outline-none"
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold">Slug</label>
          <input
            type="text"
            name="slug"
            value={formData.slug}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-400 outline-none"
          />
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            name="is_active"
            checked={formData.is_active === 1}
            onChange={handleChange}
          />
          <label className="font-semibold">Active</label>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="px-5 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg"
        >
          {loading
            ? id
              ? "Updating..."
              : "Creating..."
            : id
            ? "Update"
            : "Create"}
        </button>
      </form>
    </motion.div>
  );
}
