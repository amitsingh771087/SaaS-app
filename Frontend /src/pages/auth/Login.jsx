import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await login(username, password);
      if (result.success) {
        setError("");

        setError(result.message);

        setTimeout(() => {
          navigate("/");
        }, 1000);
      }
    } catch (err) {
      setError(err.message || "Invalid credentials");
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100">
      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="bg-white p-8 rounded-2xl shadow-lg w-96 space-y-5"
      >
        <motion.h2
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-3xl font-extrabold text-blue-600 text-center"
        >
          Welcome Back 👋
        </motion.h2>

        {error && (
          <p
            className={`text-center text-sm ${
              error.includes("successful") ? "text-green-600" : "text-red-500"
            }`}
          >
            {error}
          </p>
        )}

        <motion.input
          whileFocus={{ scale: 1.02 }}
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
        />
        <motion.input
          whileFocus={{ scale: 1.02 }}
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
        />

        <div className="flex justify-between text-sm">
          <Link to="/forgot-password" className="text-blue-500 hover:underline">
            Forgot Password?
          </Link>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
        >
          Login
        </motion.button>

        <p className="text-center text-sm text-gray-600">
          Don’t have an account?{" "}
          <Link
            to="/register"
            className="text-blue-500 font-medium hover:underline"
          >
            Sign Up
          </Link>
        </p>
      </motion.form>
    </div>
  );
}
