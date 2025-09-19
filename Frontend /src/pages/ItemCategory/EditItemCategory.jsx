import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { getItemCategoryById, updateItemCategory } from "../../api/Items.js";

export default function EditItemCategory() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const res = await getItemCategoryById(id);
        const category = res.data || res;
        setName(category.name);
      } catch (err) {
        setError(err.message);
      }
    };
    fetchCategory();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await updateItemCategory(id, { name });
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
        Edit Item Category
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
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-400 outline-none"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="px-5 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg"
        >
          {loading ? "Updating..." : "Update Category"}
        </button>
      </form>
    </motion.div>
  );
}
