import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { getItemPrices, deleteItemPrice, getItems } from "../../api/Items.js";

export default function ItemPricesView() {
  const navigate = useNavigate();
  const [prices, setPrices] = useState([]);
  const [items, setItems] = useState({});
  const [error, setError] = useState("");

  const fetchPrices = async () => {
    try {
      const res = await getItemPrices();
      setPrices(res.data || res);

      // Build a map of item ID → item name for easy display
      const itemsRes = await getItems();
      const itemMap = {};
      (itemsRes.data || itemsRes).forEach((i) => {
        itemMap[i.id] = i.name;
      });
      setItems(itemMap);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchPrices();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this price?")) {
      try {
        await deleteItemPrice(id);
        fetchPrices();
      } catch (err) {
        setError(err.message);
      }
    }
  };

  return (
    <motion.div
      className="p-6 bg-gray-50 min-h-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <h1 className="text-3xl font-extrabold text-blue-700 mb-6">
        Item Prices
      </h1>

      {error && <div className="text-red-600 mb-4">{error}</div>}

      <button
        className="mb-4 px-4 py-2 bg-blue-600 text-white rounded"
        onClick={() => navigate("/item-prices/create")}
      >
        Create Item Price
      </button>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2">ID</th>
              <th className="px-4 py-2">Item</th>
              <th className="px-4 py-2">Price</th>
              <th className="px-4 py-2">Currency</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {prices.map((p) => (
              <tr key={p.id} className="border-b">
                <td className="px-4 py-2">{p.id}</td>
                <td className="px-4 py-2">{items[p.item] || p.item}</td>
                <td className="px-4 py-2">{p.sell_price}</td>
                <td className="px-4 py-2">{p.currency}</td>
                <td className="px-4 py-2 space-x-2">
                  <button
                    className="px-2 py-1 bg-yellow-400 text-white rounded"
                    onClick={() => navigate(`/item-prices/edit/${p.id}`)}
                  >
                    Edit
                  </button>
                  <button
                    className="px-2 py-1 bg-red-500 text-white rounded"
                    onClick={() => handleDelete(p.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
