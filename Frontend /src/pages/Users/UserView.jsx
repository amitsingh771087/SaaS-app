import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { getUserById } from "../../api/Users.js";

export default function UserView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await getUserById(id);
        setUser(data);
      } catch (err) {
        console.error(err.message);
      }
    };
    fetchUser();
  }, [id]);

  if (!user) return <p className="p-6">Loading...</p>;

  return (
    <motion.div
      className="p-8 bg-gray-50 min-h-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <h1 className="text-3xl font-extrabold text-blue-700 mb-8">
        User Details
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white p-8 rounded-xl shadow-lg">
        <div>
          <p className="text-gray-600 font-medium mb-1">Username</p>
          <p className="text-lg font-semibold">{user.username}</p>
        </div>
        <div>
          <p className="text-gray-600 font-medium mb-1">Email</p>
          <p className="text-lg font-semibold">{user.email}</p>
        </div>
      </div>

      <div className="mt-8 flex gap-4">
        <button
          onClick={() => navigate(`/users/${id}/edit`)}
          className="px-6 py-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
        >
          Edit
        </button>
        <button
          onClick={() => navigate("/users")}
          className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
        >
          Back
        </button>
      </div>
    </motion.div>
  );
}
