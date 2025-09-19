import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getCustomerById } from "../../api/Customer.js";

export default function CustomerView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const res = await getCustomerById(id);
        setCustomer(res.data);
      } catch (err) {
        console.error("Failed to fetch customer:", err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchCustomer();
  }, [id]);

  if (loading)
    return <p className="p-6 text-gray-600">Loading customer details...</p>;
  if (!customer) return <p className="p-6 text-red-600">Customer not found.</p>;

  return (
    <motion.div
      className="p-6 bg-gray-50 min-h-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <h1 className="text-3xl font-extrabold text-blue-700 mb-8">
        Customer Details
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 bg-white p-8 rounded-xl shadow-lg">
        <Detail label="Name" value={customer.display_name} />
        <Detail label="Email" value={customer.primary_email} />
        <Detail label="Phone" value={customer.primary_phone} />
        <Detail
          label="WhatsApp Opt-in"
          value={customer.whatsapp_opt_in ? "Yes" : "No"}
        />
        <Detail label="GSTIN" value={customer.gstin || "N/A"} />
        <Detail
          label="Billing Address"
          value={customer.billing_address || "N/A"}
        />
        <Detail
          label="Shipping Address"
          value={customer.shipping_address || "N/A"}
        />
        <Detail label="Notes" value={customer.notes || "N/A"} />
        <Detail label="Source" value={customer.source || "N/A"} />
        <Detail label="Status" value={customer.status} badge />
        <Detail label="Tenant ID" value={customer.tenant} />
        <Detail
          label="Created At"
          value={new Date(customer.created_at).toLocaleString()}
        />
        <Detail
          label="Updated At"
          value={new Date(customer.updated_at).toLocaleString()}
        />
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

// Detail Component for clean layout
const Detail = ({ label, value, badge }) => (
  <div className="p-4 border rounded-lg bg-gray-50 flex flex-col">
    <span className="text-gray-500 font-medium mb-1">{label}</span>
    {badge ? (
      <span
        className={`px-3 py-1 rounded-full text-sm ${
          value?.toLowerCase() === "active"
            ? "bg-green-100 text-green-700"
            : "bg-red-100 text-red-700"
        }`}
      >
        {value || "N/A"}
      </span>
    ) : (
      <span className="text-gray-800 font-semibold">{value || "N/A"}</span>
    )}
  </div>
);
