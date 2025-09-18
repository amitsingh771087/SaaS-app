import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function CustomerView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState(null);

  useEffect(() => {
    setCustomer({
      id,
      display_name: "John Doe",
      primary_email: "john@example.com",
      primary_phone: "9876543210",
      status: "Active",
    });
  }, [id]);

  if (!customer) return <p className="p-6">Loading...</p>;

  return (
    <motion.div
      className="p-8 bg-gray-50 min-h-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <h1 className="text-3xl font-extrabold text-blue-700 mb-8">
        Customer Details
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white p-8 rounded-xl shadow-lg">
        <div>
          <p className="text-gray-600 font-medium mb-1">Name</p>
          <p className="text-lg font-semibold">{customer.display_name}</p>
        </div>
        <div>
          <p className="text-gray-600 font-medium mb-1">Email</p>
          <p className="text-lg font-semibold">{customer.primary_email}</p>
        </div>
        <div>
          <p className="text-gray-600 font-medium mb-1">Phone</p>
          <p className="text-lg font-semibold">{customer.primary_phone}</p>
        </div>
        <div>
          <p className="text-gray-600 font-medium mb-1">Status</p>
          <span
            className={`px-4 py-2 rounded-full text-sm ${
              customer.status === "Active"
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {customer.status}
          </span>
        </div>
      </div>

      <div className="mt-8 flex gap-4">
        <button
          onClick={() => navigate(`/customers/${id}/edit`)}
          className="px-6 py-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition"
        >
          Edit
        </button>
        <button
          onClick={() => navigate("/customers")}
          className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
        >
          Back
        </button>
      </div>
    </motion.div>
  );
}
