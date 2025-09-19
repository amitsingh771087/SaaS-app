import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { createUser, getUserById, updateUser } from "../../api/Users.js";

export default function UserForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [form, setForm] = useState({ username: "", email: "" });

  useEffect(() => {
    if (isEdit) {
      const fetchUser = async () => {
        try {
          const data = await getUserById(id);
          setForm({ username: data.username, email: data.email });
        } catch (err) {
          console.error(err.message);
        }
      };
      fetchUser();
    }
  }, [id, isEdit]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEdit) {
        await updateUser(id, form);
      } else {
        await createUser(form);
      }
      navigate("/users");
    } catch (err) {
      console.error(err.message);
    }
  };

  return (
    <motion.div
      className="p-6 bg-gray-50 min-h-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <h1 className="text-2xl sm:text-3xl font-extrabold text-blue-700 mb-6">
        {isEdit ? "Edit User" : "Create New User"}
      </h1>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-6 rounded-xl shadow-lg"
      >
        <div>
          <label className="block mb-2 font-medium">Username</label>
          <input
            type="text"
            name="username"
            value={form.username}
            onChange={handleChange}
            placeholder="Username"
            required
            className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
          />
        </div>

        <div>
          <label className="block mb-2 font-medium">Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email"
            className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
          />
        </div>

        <div className="col-span-2 flex gap-3 mt-6">
          <motion.button
            type="submit"
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg shadow hover:shadow-xl"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isEdit ? "Update User" : "Create User"}
          </motion.button>
          <button
            type="button"
            onClick={() => navigate("/users")}
            className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
          >
            Cancel
          </button>
        </div>
      </form>
    </motion.div>
  );
}
