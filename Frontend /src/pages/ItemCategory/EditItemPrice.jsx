import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  getItemPrices,
  getItems,
  getItemPriceById,
  updateItemPrice,
} from "../../api/Items.js";

export default function EditItemPrice() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [formData, setFormData] = useState({
    item: "",
    price: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const itemsRes = await getItems();
        setItems(itemsRes.data || itemsRes);

        const priceRes = await getItemPriceById(id);
        const data = priceRes.data || priceRes;
        setFormData({ item: data.item, price: data.price });
      } catch (err) {
        setError(err.message);
      }
    };
    fetchData();
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await updateItemPrice(id, formData);
      navigate("/item-prices");
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
        Edit Item Price
      </h1>

      {error && <div className="text-red-600 mb-4">{error}</div>}

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow-lg max-w-md space-y-4"
      >
        <div>
          <label className="block mb-1 font-semibold">Item</label>
          <select
            name="item"
            value={formData.item}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-400 outline-none"
          >
            <option value="">Select Item</option>
            {items.map((i) => (
              <option key={i.id} value={i.id}>
                {i.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-1 font-semibold">Price</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-400 outline-none"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="px-5 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg"
        >
          {loading ? "Updating..." : "Update Price"}
        </button>
      </form>
    </motion.div>
  );
}
