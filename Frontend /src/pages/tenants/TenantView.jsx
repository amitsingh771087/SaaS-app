import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getTenantById } from "../../api/Tenant";

export default function TenantView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tenant, setTenant] = useState(null);

  useEffect(() => {
    const fetchTenant = async () => {
      try {
        const data = await getTenantById(id);
        setTenant(data);
      } catch (err) {
        console.error(err.message);
      }
    };
    fetchTenant();
  }, [id]);

  if (!tenant) return <p className="p-6">Loading...</p>;

  return (
    <motion.div
      className="p-6 bg-gray-50 min-h-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <h1 className="text-3xl font-extrabold text-blue-700 mb-6">
        Tenant Details
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-6 rounded-xl shadow-lg">
        <div>
          <p className="text-gray-600 font-medium mb-1">Display Name</p>
          <p className="text-lg font-semibold">{tenant.display_name}</p>
        </div>
        <div>
          <p className="text-gray-600 font-medium mb-1">Slug</p>
          <p className="text-lg font-semibold">{tenant.slug}</p>
        </div>
        <div>
          <p className="text-gray-600 font-medium mb-1">Currency</p>
          <p className="text-lg font-semibold">{tenant.currency}</p>
        </div>
        <div>
          <p className="text-gray-600 font-medium mb-1">Timezone</p>
          <p className="text-lg font-semibold">{tenant.timezone}</p>
        </div>
        <div>
          <p className="text-gray-600 font-medium mb-1">GST Enabled</p>
          <p className="text-lg font-semibold">
            {tenant.gst_enabled ? "Yes" : "No"}
          </p>
        </div>
      </div>

      <div className="mt-6 flex gap-4">
        <button
          onClick={() => navigate(`/tenants/${id}/edit`)}
          className="px-6 py-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
        >
          Edit
        </button>
        <button
          onClick={() => navigate("/tenants")}
          className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
        >
          Back
        </button>
      </div>
    </motion.div>
  );
}
