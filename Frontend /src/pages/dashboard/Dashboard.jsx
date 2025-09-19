import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import axiosClient from "../../api/axiosClient";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

export default function Dashboard() {
  const [users, setUsers] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [items, setItems] = useState([]);
  const [itemCategories, setItemCategories] = useState([]);
  const [itemPrices, setItemPrices] = useState([]);
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Generic fetch function
  const fetchData = async (apiFunc, setter) => {
    try {
      const data = await apiFunc();
      setter(data?.data || data);
    } catch (err) {
      setError(err.message || "Failed to fetch data");
    }
  };

  // ---------------- API Functions ----------------
  const getUsers = async () => (await axiosClient.get("users/")).data;
  const getCustomers = async () => (await axiosClient.get("customers/")).data;
  const getItems = async () => (await axiosClient.get("items/")).data;
  const getItemCategories = async () =>
    (await axiosClient.get("item-categories/")).data;
  const getItemPrices = async () =>
    (await axiosClient.get("item-prices/")).data;
  const getTenants = async () => (await axiosClient.get("tenants/")).data;

  // Fetch all data
  const fetchAll = async () => {
    setLoading(true);
    setError("");
    await Promise.all([
      fetchData(getUsers, setUsers),
      fetchData(getCustomers, setCustomers),
      fetchData(getItems, setItems),
      fetchData(getItemCategories, setItemCategories),
      fetchData(getItemPrices, setItemPrices),
      fetchData(getTenants, setTenants),
    ]);
    setLoading(false);
  };

  useEffect(() => {
    fetchAll();
  }, []);

  // Data for charts
  const chartData = [
    { name: "Users", count: users.length },
    { name: "Customers", count: customers.length },
    { name: "Items", count: items.length },
    { name: "Categories", count: itemCategories.length },
    { name: "Item Prices", count: itemPrices.length },
    { name: "Tenants", count: tenants.length },
  ];

  const COLORS = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#AF19FF",
    "#FF4F81",
  ];

  return (
    <motion.div
      className="p-6 bg-gray-50 min-h-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <h1 className="text-3xl font-extrabold text-blue-700 mb-6">Dashboard</h1>

      {error && <div className="text-red-600 mb-4">{error}</div>}

      <button
        onClick={fetchAll}
        className="mb-6 px-4 py-2 bg-blue-600 text-white rounded"
        disabled={loading}
      >
        {loading ? "Refreshing..." : "Refresh Data"}
      </button>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-8">
        {chartData.map((item) => (
          <div
            key={item.name}
            className="p-4 bg-white shadow rounded-lg text-center"
          >
            <h2 className="text-lg font-semibold">{item.name}</h2>
            <p className="text-2xl mt-2">{item.count}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Bar Chart */}
        <div className="bg-white shadow rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-4 text-center">
            Entities Count (Bar Chart)
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart */}
        <div className="bg-white shadow rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-4 text-center">
            Entities Count (Pie Chart)
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={chartData}
                dataKey="count"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                label
              >
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Legend />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </motion.div>
  );
}
